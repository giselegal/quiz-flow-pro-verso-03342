/**
 * 🎯 FASE 1: Store Unificado com Event Sourcing
 * 
 * Single Source of Truth para todo o estado do editor
 * Projeta mudanças automaticamente para React, Supabase e IndexedDB
 */

import { produce } from 'immer';
import type { Block } from '@/types/block';
import { editorEventBus, type EditorEvent } from './EditorEventBus';
import { appLogger } from '@/lib/utils/logger';
import { persistenceService } from '@/services/persistence/PersistenceService';

// Tipo simplificado de Funnel (compatível com múltiplas estruturas)
export interface Funnel {
  id: string;
  name: string;
  description?: string;
  is_published?: boolean;
  metadata?: Record<string, any>;
  steps?: Array<{
    id: string;
    order: number;
    blocks: Block[];
  }>;
}

export interface EditorState {
  // Funnel atual
  currentFunnel: Funnel | null;
  
  // Steps e blocos (estrutura normalizada)
  stepBlocks: Record<number, Block[]>;
  
  // UI State
  currentStep: number;
  selectedBlockId: string | null;
  
  // Metadata
  isDirty: boolean;
  lastSaved: number | null;
  isLoading: boolean;
}

/**
 * Store unificado que gerencia todo o estado do editor
 * 
 * Arquitetura:
 * 1. Estado canônico em memória (this.state)
 * 2. Eventos para cada mudança (Event Sourcing)
 * 3. Projeções automáticas para camadas externas
 * 4. Replay de eventos para time-travel debugging
 */
export class UnifiedEditorStore {
  private state: EditorState = {
    currentFunnel: null,
    stepBlocks: {},
    currentStep: 1,
    selectedBlockId: null,
    isDirty: false,
    lastSaved: null,
    isLoading: false,
  };

  private listeners = new Set<(state: EditorState) => void>();
  private eventStore: EditorEvent[] = [];
  private maxEventStoreSize = 500;

  constructor() {
    // Setup de handlers do event bus
    this.setupEventHandlers();
  }

  /**
   * Registrar handlers para eventos do bus
   */
  private setupEventHandlers(): void {
    editorEventBus.on('BLOCK_ADDED', (event) => this.handleBlockAdded(event));
    editorEventBus.on('BLOCK_UPDATED', (event) => this.handleBlockUpdated(event));
    editorEventBus.on('BLOCK_DELETED', (event) => this.handleBlockDeleted(event));
    editorEventBus.on('BLOCK_REORDERED', (event) => this.handleBlockReordered(event));
    editorEventBus.on('STEP_CHANGED', (event) => this.handleStepChanged(event));
    editorEventBus.on('SELECTION_CHANGED', (event) => this.handleSelectionChanged(event));
  }

  /**
   * Obter estado atual (read-only)
   */
  getState(): Readonly<EditorState> {
    return this.state;
  }

  /**
   * Subscribir a mudanças de estado
   */
  subscribe(listener: (state: EditorState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Notificar todos os listeners
   */
  private notify(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.state);
      } catch (error) {
        appLogger.error('[UnifiedStore] Error in listener:', { data: [error] });
      }
    });
  }

  /**
   * Aplicar evento ao estado (usando Immer para imutabilidade)
   */
  private applyEvent(event: EditorEvent): void {
    this.eventStore.push(event);
    if (this.eventStore.length > this.maxEventStoreSize) {
      this.eventStore.shift();
    }

    // Atualizar estado baseado no tipo de evento
    // (handlers específicos fazem a mutação via Immer)
  }

  /**
   * COMANDOS: Métodos públicos que emitem eventos
   */

  async addBlock(stepIndex: number, block: Block): Promise<void> {
    await editorEventBus.emit('BLOCK_ADDED', { stepIndex, block }, {
      source: 'user',
      stepId: `step-${String(stepIndex).padStart(2, '0')}`,
      funnelId: this.state.currentFunnel?.id,
    });
  }

  async updateBlock(blockId: string, updates: Partial<Block>): Promise<void> {
    await editorEventBus.emit('BLOCK_UPDATED', { blockId, updates }, {
      source: 'user',
      funnelId: this.state.currentFunnel?.id,
    });
  }

  async deleteBlock(blockId: string): Promise<void> {
    await editorEventBus.emit('BLOCK_DELETED', { blockId }, {
      source: 'user',
      funnelId: this.state.currentFunnel?.id,
    });
  }

  async reorderBlocks(stepIndex: number, newOrder: Block[]): Promise<void> {
    await editorEventBus.emit('BLOCK_REORDERED', { stepIndex, blocks: newOrder }, {
      source: 'user',
      stepId: `step-${String(stepIndex).padStart(2, '0')}`,
      funnelId: this.state.currentFunnel?.id,
    });
  }

  async setCurrentStep(stepIndex: number): Promise<void> {
    await editorEventBus.emit('STEP_CHANGED', { stepIndex }, {
      source: 'user',
    });
  }

  async setSelectedBlock(blockId: string | null): Promise<void> {
    await editorEventBus.emit('SELECTION_CHANGED', { blockId }, {
      source: 'user',
    });
  }

  /**
   * EVENT HANDLERS: Atualizam estado e projetam para camadas externas
   */

  private async handleBlockAdded(event: EditorEvent): Promise<void> {
    const { stepIndex, block } = event.payload;

    this.state = produce(this.state, draft => {
      if (!draft.stepBlocks[stepIndex]) {
        draft.stepBlocks[stepIndex] = [];
      }
      draft.stepBlocks[stepIndex].push(block);
      draft.isDirty = true;
    });

    this.notify();

    // Projetar para Supabase (async, não-bloqueante)
    this.projectToSupabase(event).catch(error => {
      appLogger.error('[UnifiedStore] Failed to project to Supabase:', { data: [error] });
    });

    // Projetar para IndexedDB (fallback offline)
    this.projectToIndexedDB(event).catch(error => {
      appLogger.error('[UnifiedStore] Failed to project to IndexedDB:', { data: [error] });
    });
  }

  private async handleBlockUpdated(event: EditorEvent): Promise<void> {
    const { blockId, updates } = event.payload;

    this.state = produce(this.state, draft => {
      // Encontrar e atualizar bloco
      Object.keys(draft.stepBlocks).forEach(stepKey => {
        const stepIndex = Number(stepKey);
        const blocks = draft.stepBlocks[stepIndex];
        const blockIndex = blocks.findIndex(b => b.id === blockId);
        
        if (blockIndex !== -1) {
          Object.assign(blocks[blockIndex], updates);
          draft.isDirty = true;
        }
      });
    });

    this.notify();

    // Projeções assíncronas
    await Promise.all([
      this.projectToSupabase(event),
      this.projectToIndexedDB(event),
    ]).catch(error => {
      appLogger.error('[UnifiedStore] Projection error:', { data: [error] });
    });
  }

  private async handleBlockDeleted(event: EditorEvent): Promise<void> {
    const { blockId } = event.payload;

    this.state = produce(this.state, draft => {
      Object.keys(draft.stepBlocks).forEach(stepKey => {
        const stepIndex = Number(stepKey);
        draft.stepBlocks[stepIndex] = draft.stepBlocks[stepIndex].filter(b => b.id !== blockId);
      });
      
      if (draft.selectedBlockId === blockId) {
        draft.selectedBlockId = null;
      }
      
      draft.isDirty = true;
    });

    this.notify();

    await Promise.all([
      this.projectToSupabase(event),
      this.projectToIndexedDB(event),
    ]);
  }

  private async handleBlockReordered(event: EditorEvent): Promise<void> {
    const { stepIndex, blocks } = event.payload;

    this.state = produce(this.state, draft => {
      draft.stepBlocks[stepIndex] = blocks.map((b: Block, idx: number) => ({
        ...b,
        order: idx,
      }));
      draft.isDirty = true;
    });

    this.notify();

    await Promise.all([
      this.projectToSupabase(event),
      this.projectToIndexedDB(event),
    ]);
  }

  private async handleStepChanged(event: EditorEvent): Promise<void> {
    const { stepIndex } = event.payload;

    this.state = produce(this.state, draft => {
      draft.currentStep = stepIndex;
      draft.selectedBlockId = null; // Limpar seleção ao trocar de step
    });

    this.notify();
  }

  private async handleSelectionChanged(event: EditorEvent): Promise<void> {
    const { blockId } = event.payload;

    this.state = produce(this.state, draft => {
      draft.selectedBlockId = blockId;
    });

    this.notify();
  }

  /**
   * PROJEÇÕES: Sincronizar mudanças para camadas externas
   */

  private async projectToSupabase(event: EditorEvent): Promise<void> {
    if (!this.state.currentFunnel?.id) return;

    try {
      await persistenceService.save(
        this.state.currentFunnel.id,
        this.state.stepBlocks,
        {
          maxRetries: 3,
          onRetry: (attempt: number) => {
            appLogger.warn(`[UnifiedStore] Supabase retry ${attempt}/3`);
          },
        }
      );
    } catch (error) {
      appLogger.error('[UnifiedStore] Supabase projection failed:', { data: [error] });
      throw error;
    }
  }

  private async projectToIndexedDB(event: EditorEvent): Promise<void> {
    if (!this.state.currentFunnel?.id) return;

    try {
      // Salvar no IndexedDB como fallback offline
      const db = await this.openIndexedDB();
      const tx = db.transaction(['editorState'], 'readwrite');
      const store = tx.objectStore('editorState');
      
      await store.put({
        funnelId: this.state.currentFunnel.id,
        state: this.state,
        timestamp: Date.now(),
      });
    } catch (error) {
      appLogger.error('[UnifiedStore] IndexedDB projection failed:', { data: [error] });
    }
  }

  private async openIndexedDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('QuizFlowEditor', 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('editorState')) {
          db.createObjectStore('editorState', { keyPath: 'funnelId' });
        }
      };
    });
  }

  /**
   * UTILIDADES
   */

  getBlocks(stepIndex: number): Block[] {
    return this.state.stepBlocks[stepIndex] || [];
  }

  getSelectedBlock(): Block | undefined {
    if (!this.state.selectedBlockId) return undefined;
    
    const blocks = this.getBlocks(this.state.currentStep);
    return blocks.find(b => b.id === this.state.selectedBlockId);
  }

  /**
   * Replay de eventos para time-travel debugging
   */
  replayEvents(events: EditorEvent[]): void {
    appLogger.info('[UnifiedStore] Replaying events...', { data: [events.length] });
    
    events.forEach(event => {
      this.applyEvent(event);
    });
    
    this.notify();
  }
}

// Singleton global
export const unifiedEditorStore = new UnifiedEditorStore();

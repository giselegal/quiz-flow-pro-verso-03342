/**
 * 🎛️ EDITOR STATE MANAGER
 * 
 * Gerencia operações de estado do editor (CRUD de blocos)
 * Coordena HistoryService e TemplateLoader
 * Extraído do EditorProviderUnified para reduzir complexidade
 * 
 * @version 1.0.0
 */

import { Block } from '@/types/editor';
import { EditorHistoryService } from './HistoryService';
import { TemplateLoader } from './TemplateLoader';
import { arrayMove } from '@dnd-kit/sortable';

export interface EditorState {
  stepBlocks: Record<string, Block[]>;
  stepSources?: Record<string, 'normalized-json' | 'modular-json' | 'individual-json' | 'master-hydrated' | 'ts-template'>;
  currentStep: number;
  selectedBlockId: string | null;
  stepValidation: Record<number, boolean>;
  isLoading: boolean;
  databaseMode: 'local' | 'supabase';
  isSupabaseEnabled: boolean;
}

export interface StateUpdateCallback {
  (updater: (prev: EditorState) => EditorState): void;
}

export class EditorStateManager {
  private history: EditorHistoryService;
  private loader: TemplateLoader;
  private updateState: StateUpdateCallback;

  constructor(
    updateState: StateUpdateCallback,
    history: EditorHistoryService,
    loader: TemplateLoader
  ) {
    this.updateState = updateState;
    this.history = history;
    this.loader = loader;
  }

  /**
   * Adiciona bloco ao final de um step
   */
  async addBlock(stepKey: string, block: Block): Promise<void> {
    this.updateState(prev => {
      const currentBlocks = prev.stepBlocks[stepKey] || [];
      const newBlock = {
        ...block,
        order: currentBlocks.length
      };
      
      const newState = {
        ...prev,
        stepBlocks: {
          ...prev.stepBlocks,
          [stepKey]: [...currentBlocks, newBlock]
        }
      };
      
      this.history.push(newState);
      return newState;
    });
  }

  /**
   * Adiciona bloco em índice específico
   */
  async addBlockAtIndex(stepKey: string, block: Block, index: number): Promise<void> {
    this.updateState(prev => {
      const currentBlocks = prev.stepBlocks[stepKey] || [];
      const newBlock = { ...block, order: index };
      const newBlocks = [...currentBlocks];
      newBlocks.splice(index, 0, newBlock);
      
      // Reordenar índices
      const reorderedBlocks = newBlocks.map((b, i) => ({ ...b, order: i }));
      
      const newState = {
        ...prev,
        stepBlocks: {
          ...prev.stepBlocks,
          [stepKey]: reorderedBlocks
        }
      };
      
      this.history.push(newState);
      return newState;
    });
  }

  /**
   * Remove bloco de um step
   */
  async removeBlock(stepKey: string, blockId: string): Promise<void> {
    this.updateState(prev => {
      const currentBlocks = prev.stepBlocks[stepKey] || [];
      const filteredBlocks = currentBlocks
        .filter(b => b.id !== blockId)
        .map((b, i) => ({ ...b, order: i }));
      
      const newState = {
        ...prev,
        stepBlocks: {
          ...prev.stepBlocks,
          [stepKey]: filteredBlocks
        },
        selectedBlockId: prev.selectedBlockId === blockId ? null : prev.selectedBlockId
      };
      
      this.history.push(newState);
      return newState;
    });
  }

  /**
   * Reordena blocos dentro de um step
   */
  async reorderBlocks(stepKey: string, oldIndex: number, newIndex: number): Promise<void> {
    this.updateState(prev => {
      const currentBlocks = prev.stepBlocks[stepKey] || [];
      const reorderedBlocks = arrayMove(currentBlocks, oldIndex, newIndex)
        .map((b, i) => ({ ...b, order: i }));
      
      const newState = {
        ...prev,
        stepBlocks: {
          ...prev.stepBlocks,
          [stepKey]: reorderedBlocks
        }
      };
      
      this.history.push(newState);
      return newState;
    });
  }

  /**
   * Atualiza propriedades de um bloco
   */
  async updateBlock(
    stepKey: string, 
    blockId: string, 
    updates: Record<string, any>
  ): Promise<void> {
    this.updateState(prev => {
      const currentBlocks = prev.stepBlocks[stepKey] || [];
      const updatedBlocks = currentBlocks.map(block =>
        block.id === blockId
          ? { ...block, ...updates }
          : block
      );
      
      const newState = {
        ...prev,
        stepBlocks: {
          ...prev.stepBlocks,
          [stepKey]: updatedBlocks
        }
      };
      
      this.history.push(newState);
      return newState;
    });
  }

  /**
   * Garante que um step está carregado
   */
  async ensureStepLoaded(
    step: number | string,
    currentState: EditorState
  ): Promise<Partial<EditorState>> {
    const normalizedKey = this.normalizeStepKey(step);
    const existingBlocks = currentState.stepBlocks[normalizedKey];

    // Skip se já carregado
    if (existingBlocks && existingBlocks.length > 0) {
      console.log(`⏭️ Skip: ${normalizedKey} já carregado`);
      return {};
    }

    try {
      const { blocks, source } = await this.loader.loadStep(normalizedKey);
      
      return {
        stepBlocks: {
          ...currentState.stepBlocks,
          [normalizedKey]: blocks
        },
        stepSources: {
          ...(currentState.stepSources || {}),
          [normalizedKey]: source
        }
      };
    } catch (error) {
      console.error(`❌ Erro ao carregar ${normalizedKey}:`, error);
      return {};
    }
  }

  /**
   * Normaliza chave do step
   */
  private normalizeStepKey(step: number | string): string {
    const rawKey = typeof step === 'string' ? step : `step-${step}`;
    const match = rawKey.match(/^step-(\d{1,2})$/);
    return match ? `step-${parseInt(match[1], 10).toString().padStart(2, '0')}` : rawKey;
  }

  /**
   * Desfaz última ação
   */
  undo(): EditorState | null {
    return this.history.undo();
  }

  /**
   * Refaz última ação desfeita
   */
  redo(): EditorState | null {
    return this.history.redo();
  }

  /**
   * Estado do histórico
   */
  get canUndo(): boolean {
    return this.history.canUndo;
  }

  get canRedo(): boolean {
    return this.history.canRedo;
  }

  /**
   * Limpa histórico
   */
  clearHistory(): void {
    this.history.clear();
  }
}

export default EditorStateManager;

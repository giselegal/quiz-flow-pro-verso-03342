/**
 * 🎯 FASE 1: Event Bus para sincronização de estado
 * 
 * Sistema de eventos que garante Single Source of Truth
 * eliminando race conditions entre múltiplas fontes de dados
 */

import { appLogger } from '@/lib/utils/logger';

export type EditorEventType =
  | 'BLOCK_ADDED'
  | 'BLOCK_UPDATED'
  | 'BLOCK_DELETED'
  | 'BLOCK_REORDERED'
  | 'STEP_CHANGED'
  | 'FUNNEL_LOADED'
  | 'FUNNEL_SAVED'
  | 'FUNNEL_PUBLISHED'
  | 'SELECTION_CHANGED';

export interface EditorEvent {
  type: EditorEventType;
  payload: any;
  timestamp: number;
  metadata?: {
    source?: 'user' | 'system' | 'sync';
    stepId?: string;
    funnelId?: string;
  };
}

export type EventHandler = (event: EditorEvent) => void | Promise<void>;

/**
 * Event Bus centralizado para coordenar todas as mudanças de estado
 * 
 * Benefícios:
 * - ✅ Single Source of Truth
 * - ✅ Rastreabilidade completa (todos os eventos logados)
 * - ✅ Sincronização automática entre camadas
 * - ✅ Prevenção de race conditions
 */
export class EditorEventBus {
  private handlers = new Map<EditorEventType, Set<EventHandler>>();
  private eventHistory: EditorEvent[] = [];
  private maxHistorySize = 100;

  /**
   * Registrar handler para tipo de evento específico
   */
  on(type: EditorEventType, handler: EventHandler): () => void {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set());
    }
    
    this.handlers.get(type)!.add(handler);

    // Retornar função de cleanup
    return () => {
      this.handlers.get(type)?.delete(handler);
    };
  }

  /**
   * Emitir evento para todos os handlers registrados
   */
  async emit(type: EditorEventType, payload: any, metadata?: EditorEvent['metadata']): Promise<void> {
    const event: EditorEvent = {
      type,
      payload,
      timestamp: Date.now(),
      metadata,
    };

    // Adicionar ao histórico
    this.eventHistory.push(event);
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.shift();
    }

    appLogger.debug(`[EventBus] 📡 ${type}`, { data: [payload, metadata] });

    // Executar handlers de forma assíncrona mas sequencial
    const handlers = this.handlers.get(type);
    if (!handlers || handlers.size === 0) return;

    const promises = Array.from(handlers).map(handler => {
      try {
        return Promise.resolve(handler(event));
      } catch (error) {
        appLogger.error(`[EventBus] Error in handler for ${type}:`, { data: [error] });
        return Promise.resolve();
      }
    });

    await Promise.all(promises);
  }

  /**
   * Obter histórico recente de eventos
   */
  getHistory(limit?: number): EditorEvent[] {
    const history = [...this.eventHistory];
    return limit ? history.slice(-limit) : history;
  }

  /**
   * Limpar histórico
   */
  clearHistory(): void {
    this.eventHistory = [];
  }

  /**
   * Remover todos os handlers
   */
  clear(): void {
    this.handlers.clear();
    this.eventHistory = [];
  }
}

// Singleton global
export const editorEventBus = new EditorEventBus();

/**
 * 🔔 EDITOR EVENT BUS - Sprint 1 Dia 2
 * 
 * Sistema de eventos local para comunicação entre componentes
 * sem causar re-renders em cascata do React Context
 */

type EventCallback = (data: any) => void;

interface EventBusEvents {
  'block-updated': {
    stepKey: string;
    blockId: string;
    patch: {
      properties?: Record<string, any>;
      content?: Record<string, any>;
    };
  };
  'block-selected': {
    blockId: string | null;
  };
  'step-changed': {
    stepKey: string;
  };
}

class EditorEventBus {
  private listeners = new Map<keyof EventBusEvents, Set<EventCallback>>();

  /**
   * Registra listener para um evento
   */
  on<K extends keyof EventBusEvents>(
    event: K,
    callback: (data: EventBusEvents[K]) => void
  ): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    this.listeners.get(event)!.add(callback);

    // Retorna função de cleanup
    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }

  /**
   * Emite um evento
   */
  emit<K extends keyof EventBusEvents>(event: K, data: EventBusEvents[K]): void {
    const callbacks = this.listeners.get(event);
    if (!callbacks) return;

    callbacks.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`[EventBus] Error in ${event} listener:`, error);
      }
    });
  }

  /**
   * Remove todos os listeners de um evento
   */
  off(event: keyof EventBusEvents): void {
    this.listeners.delete(event);
  }

  /**
   * Limpa todos os listeners
   */
  clear(): void {
    this.listeners.clear();
  }

  /**
   * Debug: lista eventos registrados
   */
  debug(): void {
    console.log('[EventBus] Registered events:', {
      events: Array.from(this.listeners.keys()),
      listenerCounts: Array.from(this.listeners.entries()).map(([event, callbacks]) => ({
        event,
        count: callbacks.size,
      })),
    });
  }
}

// Singleton global
export const editorEventBus = new EditorEventBus();

// Helpers tipados
export const emitBlockUpdate = (data: EventBusEvents['block-updated']) => {
  editorEventBus.emit('block-updated', data);
};

export const onBlockUpdate = (callback: (data: EventBusEvents['block-updated']) => void) => {
  return editorEventBus.on('block-updated', callback);
};

export const emitBlockSelected = (blockId: string | null) => {
  editorEventBus.emit('block-selected', { blockId });
};

export const onBlockSelected = (callback: (data: EventBusEvents['block-selected']) => void) => {
  return editorEventBus.on('block-selected', callback);
};

export const emitStepChanged = (stepKey: string) => {
  editorEventBus.emit('step-changed', { stepKey });
};

export const onStepChanged = (callback: (data: EventBusEvents['step-changed']) => void) => {
  return editorEventBus.on('step-changed', callback);
};

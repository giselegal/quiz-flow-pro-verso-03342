import { useCallback, useEffect, useRef } from 'react';

/**
 * 🎯 GERENCIADOR CENTRAL DE EVENT LISTENERS
 * 
 * Consolida múltiplos event listeners globais para melhor performance
 * e facilita gerenciamento de cleanup
 */

type EventType = 'resize' | 'storage' | 'quiz-result-updated' | 'quiz-button-state-change' | 
                 'step01-button-state-change' | 'navigate-to-step' | 'quiz-navigate-to-step' |
                 'storage-cleanup-request' | 'canvas-virt-flag-changed' | 'quiz-selection-change' |
                 'quiz-input-change' | 'scroll' | 'keydown';

type EventHandler = (event: Event) => void;

interface GlobalEventManager {
  addEventListener: (type: EventType, handler: EventHandler) => () => void;
  removeEventListener: (type: EventType, handler: EventHandler) => void;
  removeAllListeners: () => void;
}

export const useGlobalEventManager = (): GlobalEventManager => {
  const listenersRef = useRef<Map<EventType, Set<EventHandler>>>(new Map());
  const boundHandlersRef = useRef<Map<EventType, EventHandler>>(new Map());

  // Handler central que distribui eventos para handlers específicos
  const createCentralHandler = useCallback((type: EventType) => {
    return (event: Event) => {
      const handlers = listenersRef.current.get(type);
      if (handlers) {
        // Executar handlers em batch para melhor performance
        handlers.forEach(handler => {
          try {
            handler(event);
          } catch (error) {
            console.error(`Error in ${type} event handler:`, error);
          }
        });
      }
    };
  }, []);

  // Adicionar event listener
  const addEventListener = useCallback((type: EventType, handler: EventHandler) => {
    let handlers = listenersRef.current.get(type);
    
    if (!handlers) {
      handlers = new Set();
      listenersRef.current.set(type, handlers);
      
      // Criar e registrar handler central apenas na primeira vez
      const centralHandler = createCentralHandler(type);
      boundHandlersRef.current.set(type, centralHandler);
      window.addEventListener(type, centralHandler);
    }
    
    handlers.add(handler);

    // Retornar função de cleanup
    return () => {
      removeEventListener(type, handler);
    };
  }, [createCentralHandler]);

  // Remover event listener
  const removeEventListener = useCallback((type: EventType, handler: EventHandler) => {
    const handlers = listenersRef.current.get(type);
    if (!handlers) return;

    handlers.delete(handler);

    // Se não há mais handlers, remover listener global
    if (handlers.size === 0) {
      const boundHandler = boundHandlersRef.current.get(type);
      if (boundHandler) {
        window.removeEventListener(type, boundHandler);
        boundHandlersRef.current.delete(type);
      }
      listenersRef.current.delete(type);
    }
  }, []);

  // Remover todos os listeners
  const removeAllListeners = useCallback(() => {
    boundHandlersRef.current.forEach((handler, type) => {
      window.removeEventListener(type, handler);
    });
    
    listenersRef.current.clear();
    boundHandlersRef.current.clear();
  }, []);

  // Cleanup automático no unmount
  useEffect(() => {
    return () => {
      removeAllListeners();
    };
  }, [removeAllListeners]);

  return {
    addEventListener,
    removeEventListener,
    removeAllListeners
  };
};

/**
 * 🎯 HOOK SIMPLIFICADO PARA USO COMUM
 * 
 * Para casos onde você só precisa adicionar um ou poucos listeners
 */
export const useGlobalEvent = (type: EventType, handler: EventHandler, deps: any[] = []) => {
  const eventManager = useGlobalEventManager();
  
  useEffect(() => {
    const cleanup = eventManager.addEventListener(type, handler);
    return cleanup;
  }, [eventManager, type, ...deps]); // eslint-disable-line react-hooks/exhaustive-deps
};

export default useGlobalEventManager;
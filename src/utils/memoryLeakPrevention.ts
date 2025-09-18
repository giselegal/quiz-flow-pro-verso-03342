// @ts-nocheck
/**
 * 🛡️ PREVENÇÃO DE MEMORY LEAKS
 * Sistema centralizado para prevenir vazamentos de memória
 */

import React from 'react';
import { performanceManager } from './performanceManager';

/**
 * Hook para gerenciar cleanup automático
 */
export const useMemoryLeakPrevention = () => {
  const cleanupFunctions = new Set<() => void>();
  
  const registerCleanup = (cleanupFn: () => void) => {
    cleanupFunctions.add(cleanupFn);
  };
  
  const cleanup = () => {
    cleanupFunctions.forEach(fn => {
      try {
        fn();
      } catch (error) {
        if (__DEV__) {
          console.warn('Cleanup function error:', error);
        }
      }
    });
    cleanupFunctions.clear();
  };
  
  return { registerCleanup, cleanup };
};

/**
 * Wrapper para setTimeout que previne leaks
 */
export const safeSetTimeout = (callback: () => void, delay: number): (() => void) => {
  const timeoutId = setTimeout(callback, delay);
  
  const cleanup = () => {
    clearTimeout(timeoutId);
  };
  
  return cleanup;
};

/**
 * Wrapper para setInterval que previne leaks
 */
export const safeSetInterval = (callback: () => void, delay: number): (() => void) => {
  const intervalId = setInterval(callback, delay);
  
  const cleanup = () => {
    clearInterval(intervalId);
  };
  
  return cleanup;
};

/**
 * Wrapper para event listeners que previne leaks
 */
export const safeAddEventListener = <K extends keyof WindowEventMap>(
  target: EventTarget,
  type: K,
  listener: (event: WindowEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions
): (() => void) => {
  target.addEventListener(type as string, listener as EventListener, options);
  
  const cleanup = () => {
    target.removeEventListener(type as string, listener as EventListener, options);
  };
  
  return cleanup;
};

/**
 * Gerenciador de recursos para componentes React
 */
export class ComponentResourceManager {
  private cleanupFunctions: Set<() => void> = new Set();
  private abortController: AbortController;
  
  constructor() {
    this.abortController = performanceManager.createAbortController();
  }
  
  /**
   * Registrar função de limpeza
   */
  registerCleanup(cleanupFn: () => void) {
    this.cleanupFunctions.add(cleanupFn);
  }
  
  /**
   * Criar timeout gerenciado
   */
  setTimeout(callback: () => void, delay: number): number {
    const timeoutId = window.setTimeout(callback, delay);
    this.registerCleanup(() => clearTimeout(timeoutId));
    return timeoutId;
  }
  
  /**
   * Criar interval gerenciado
   */
  setInterval(callback: () => void, delay: number): number {
    const intervalId = window.setInterval(callback, delay);
    this.registerCleanup(() => clearInterval(intervalId));
    return intervalId;
  }
  
  /**
   * Adicionar event listener gerenciado
   */
  addEventListener<K extends keyof WindowEventMap>(
    target: EventTarget,
    type: K,
    listener: (event: WindowEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ) {
    target.addEventListener(type as string, listener as EventListener, options);
    this.registerCleanup(() => {
      target.removeEventListener(type as string, listener as EventListener, options);
    });
  }
  
  /**
   * Criar fetch request com AbortController
   */
  async fetch(url: string, options?: RequestInit): Promise<Response> {
    return fetch(url, {
      ...options,
      signal: this.abortController.signal
    });
  }
  
  /**
   * Cleanup de todos os recursos
   */
  cleanup() {
    // Executar funções de limpeza
    this.cleanupFunctions.forEach(cleanup => {
      try {
        cleanup();
      } catch (error) {
        if (__DEV__) {
          performanceManager.log('warn', 'Cleanup function error', error);
        }
      }
    });
    
    this.cleanupFunctions.clear();
    
    // Abortar requests pendentes
    if (!this.abortController.signal.aborted) {
      this.abortController.abort();
    }
  }
}

/**
 * Hook React para gerenciar recursos automaticamente
 */
export const useResourceManager = () => {
  const managerRef = React.useRef<ComponentResourceManager>();
  
  if (!managerRef.current) {
    managerRef.current = new ComponentResourceManager();
  }
  
  React.useEffect(() => {
    const manager = managerRef.current!;
    
    return () => {
      manager.cleanup();
    };
  }, []);
  
  return managerRef.current;
};

// Global cleanup para development hot reload
if (__DEV__ && import.meta.hot) {
  import.meta.hot.dispose(() => {
    // Cleanup será feito pelo performanceManager
  });
}
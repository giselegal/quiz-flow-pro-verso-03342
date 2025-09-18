/**
 * TODO: TypeScript Migration - Deadline: Janeiro 2025
 * - [ ] Criar interfaces para EventListenerEntry, MemoryStats, CleanupHandlers
 * - [ ] Tipar adequadamente performance.memory com declaração global
 * - [ ] Implementar generic types para observers (T extends Observer)
 * - [ ] Adicionar union types para diferentes tipos de observers
 * - [ ] Separar hooks React do core MemoryManager (responsabilidades distintas)
 */

import { PerformanceOptimizer } from './performanceOptimizer';
import { useCallback, useEffect, useRef, useState } from 'react';
import { appLogger } from './logger';

// Tipos mínimos para migração
interface EventListenerEntry {
  element: Element | Window | Document;
  event: string;
  handler: EventListener;
}

interface MemoryStats {
  memoryUsage: number;
  isHighUsage: boolean;
}

type ObserverType = IntersectionObserver | MutationObserver | ResizeObserver;
type CleanupFunction = () => void;

// Gerenciador de memory leaks
class MemoryManager {
  private static instance: MemoryManager;
  private eventListeners = new Set<EventListenerEntry>();
  private intervals = new Set<number>();
  private timeouts = new Set<number>();
  private observers = new Set<ObserverType>();

  static getInstance(): MemoryManager {
    if (!MemoryManager.instance) {
      MemoryManager.instance = new MemoryManager();
    }
    return MemoryManager.instance;
  }

  // Registrar event listener para cleanup automático
  addEventListener(
    element: Element | Window | Document,
    event: string,
    handler: EventListener,
    options?: boolean | AddEventListenerOptions
  ): void {
    appLogger.debug('Adding event listener for cleanup', { event });
    element.addEventListener(event, handler, options);
    this.eventListeners.add({ element, event, handler });
  }

  // Registrar interval para cleanup automático
  setInterval(callback: CleanupFunction, ms: number): number {
    // 🚀 OTIMIZAÇÃO: Usar PerformanceOptimizer
    const id = PerformanceOptimizer.scheduleInterval(callback, ms);
    this.intervals.add(id);
    return id;
  }

  // Registrar timeout para cleanup automático
  setTimeout(callback: CleanupFunction, ms: number): number {
    // 🚀 OTIMIZAÇÃO: Usar PerformanceOptimizer
    const strategy = PerformanceOptimizer.getSuggestedStrategy(ms);
    const id = PerformanceOptimizer.schedule(callback, ms, strategy);
    this.timeouts.add(id);
    return id;
  }

  // Registrar observer para cleanup automático
  addObserver(observer: ObserverType): ObserverType {
    this.observers.add(observer);
    return observer;
  }

  // Cleanup completo
  cleanup(): void {
    appLogger.info('Performing memory cleanup', {
      eventListeners: this.eventListeners.size,
      intervals: this.intervals.size,
      timeouts: this.timeouts.size,
      observers: this.observers.size
    });

    // Remover event listeners
    this.eventListeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });
    this.eventListeners.clear();

    // Limpar intervals
    this.intervals.forEach(id => window.clearInterval(id));
    this.intervals.clear();

    // Limpar timeouts
    this.timeouts.forEach(id => window.clearTimeout(id));
    this.timeouts.clear();

    // Desconectar observers
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }

  // Remover item específico
  removeEventListener(element: Element | Window | Document, event: string, handler: EventListener) {
    element.removeEventListener(event, handler);
    // Encontrar a entrada correspondente para remoção correta
    for (const entry of Array.from(this.eventListeners)) {
      if (entry.element === element && entry.event === event && entry.handler === handler) {
        this.eventListeners.delete(entry);
        break;
      }
    }
  }

  clearInterval(id: number) {
    window.clearInterval(id);
    this.intervals.delete(id);
  }

  clearTimeout(id: number) {
    window.clearTimeout(id);
    this.timeouts.delete(id);
  }
}

// Hook para automatic cleanup
export const useMemoryCleanup = () => {
  const manager = MemoryManager.getInstance();

  useEffect(() => {
    return () => manager.cleanup();
  }, [manager]);

  return {
    addEventListener: manager.addEventListener.bind(manager),
    setInterval: manager.setInterval.bind(manager),
    setTimeout: manager.setTimeout.bind(manager),
    addObserver: manager.addObserver.bind(manager),
    cleanup: manager.cleanup.bind(manager),
  };
};

// Hook para weak references (desabilitado - WeakRef não disponível em todos os ambientes)
export const useWeakRef = <T extends object>(value: T) => {
  // const weakRef = useRef<WeakRef<T>>();
  const valueRef = useRef<T>(value);

  useEffect(() => {
    // weakRef.current = new WeakRef(value);
    valueRef.current = value;
  }, [value]);

  const getValue = useCallback(() => {
    // return weakRef.current?.deref();
    return valueRef.current;
  }, []);

  return getValue;
};

// Hook para monitoramento de memória
export const useMemoryMonitor = (threshold = 50): MemoryStats => {
  const [memoryUsage, setMemoryUsage] = useState<number>(0);
  const [isHighUsage, setIsHighUsage] = useState(false);

  useEffect(() => {
    if (!('memory' in performance)) return;

    const checkMemory = () => {
      const memory = (performance as any).memory;
      const usagePercent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;

      setMemoryUsage(usagePercent);
      setIsHighUsage(usagePercent > threshold);

      if (usagePercent > 80) {
        appLogger.warn('High memory usage detected', { usagePercent: usagePercent.toFixed(2) });
      }
    };

    // 🚀 OTIMIZAÇÃO: Usar PerformanceOptimizer interval
    const interval = PerformanceOptimizer.scheduleInterval(checkMemory, 5000);
    checkMemory();

    return () => clearInterval(interval);
  }, [threshold]);

  return { memoryUsage, isHighUsage };
};

// Garbage collection forçado (se disponível)
export const forceGarbageCollection = () => {
  if ('gc' in window && typeof (window as any).gc === 'function') {
    (window as any).gc();
  }
};

// Hook para components que precisam de cleanup pesado
export const useHeavyCleanup = (cleanupFn: () => void) => {
  const cleanupRef = useRef(cleanupFn);
  cleanupRef.current = cleanupFn;

  useEffect(() => {
    return () => {
      cleanupRef.current();
      // Force cleanup on unmount
      if (typeof window !== 'undefined') {
        setTimeout(() => {
          forceGarbageCollection();
        }, 100);
      }
    };
  }, []);
};

// Performance observer para detectar memory leaks
export const useMemoryLeakDetector = () => {
  useEffect(() => {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver(list => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        if (entry.entryType === 'measure' && entry.name.includes('memory')) {
          console.log('Memory measurement:', entry);
        }
      });
    });

    observer.observe({ entryTypes: ['measure'] });

    return () => observer.disconnect();
  }, []);
};

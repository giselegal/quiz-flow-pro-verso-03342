import { PerformanceOptimizer } from './performanceOptimizer';
import { useCallback, useEffect, useRef, useState } from 'react';

// Gerenciador de memory leaks
class MemoryManager {
  private static instance: MemoryManager;
  private eventListeners = new Set<{
    element: Element | Window | Document;
    event: string;
    handler: EventListener;
  }>();
  private intervals = new Set<number>();
  private timeouts = new Set<number>();
  private observers = new Set<IntersectionObserver | MutationObserver | ResizeObserver>();

  static getInstance() {
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
  ) {
    element.addEventListener(event, handler, options);
    this.eventListeners.add({ element, event, handler });
  }

  // Registrar interval para cleanup automático
  setInterval(callback: () => void, ms: number) {
    // 🚀 OTIMIZAÇÃO: Usar PerformanceOptimizer
    const id = PerformanceOptimizer.scheduleInterval(callback, ms);
    this.intervals.add(id);
    return id;
  }

  // Registrar timeout para cleanup automático
  setTimeout(callback: () => void, ms: number) {
    // 🚀 OTIMIZAÇÃO: Usar PerformanceOptimizer
    const strategy = PerformanceOptimizer.getSuggestedStrategy(ms);
    const id = PerformanceOptimizer.schedule(callback, ms, strategy);
    this.timeouts.add(id);
    return id;
  }

  // Registrar observer para cleanup automático
  addObserver(observer: IntersectionObserver | MutationObserver | ResizeObserver) {
    this.observers.add(observer);
    return observer;
  }

  // Cleanup completo
  cleanup() {
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
    this.eventListeners.delete({ element, event, handler });
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
export const useMemoryMonitor = (threshold = 50) => {
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
        console.warn(`High memory usage detected: ${usagePercent.toFixed(2)}%`);
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

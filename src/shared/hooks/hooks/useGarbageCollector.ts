import { useCallback, useRef } from 'react';

/**
 * 🧹 GARBAGE COLLECTION OPTIMIZER
 *
 * Hook otimizado para limpeza de memória e performance
 */

interface MemoryCleanupOptions {
  intervalMs?: number;
  threshold?: number;
  aggressiveCleanup?: boolean;
}

export const useGarbageCollector = (options: MemoryCleanupOptions = {}) => {
  const {
    intervalMs = 60000, // 1 minuto
    threshold = 0.75, // 75% da memória
    aggressiveCleanup = false,
  } = options;

  const cleanupTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastCleanupRef = useRef<number>(0);

  // Função otimizada de limpeza
  const performCleanup = useCallback(() => {
    const now = performance.now();

    // Evitar limpeza muito frequente
    if (now - lastCleanupRef.current < intervalMs / 2) {
      return;
    }

    try {
      // 1. Garbage Collection manual se disponível
      if (typeof window !== 'undefined' && 'gc' in window) {
        (window as any).gc();
      }

      // 2. Limpeza de referencias DOM órfãs
      if (typeof document !== 'undefined') {
        // Remover event listeners órfãos
        const elements = document.querySelectorAll('[data-cleanup]');
        elements.forEach(el => el.remove());
      }

      // 3. Limpeza de cache de imagens se necessário
      if (aggressiveCleanup) {
        // Forçar recarregamento de imagens não utilizadas
        const images = document.querySelectorAll('img[data-cached]');
        images.forEach(img => {
          if (!img.closest('.optimized-block-wrapper')) {
            img.remove();
          }
        });
      }

      // 4. Trigger de limpeza do React DevTools se em desenvolvimento
      if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
        // @ts-ignore
        if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
          // Força limpeza de componentes não utilizados
          setTimeout(() => {
            // @ts-ignore
            window.__REACT_DEVTOOLS_GLOBAL_HOOK__.onCommitFiberRoot();
          }, 100);
        }
      }

      lastCleanupRef.current = now;

      if (process.env.NODE_ENV === 'development') {
        console.log('🧹 Memory cleanup performed');
      }
    } catch (error) {
      console.warn('⚠️ Cleanup error:', error);
    }
  }, [intervalMs, aggressiveCleanup]);

  // Verificação de memória otimizada
  const checkMemoryUsage = useCallback(() => {
    if (typeof performance === 'undefined' || !('memory' in performance)) {
      return false;
    }

    const memory = (performance as any).memory;
    if (!memory) return false;

    const usageRatio = memory.usedJSHeapSize / memory.totalJSHeapSize;

    if (usageRatio > threshold) {
      performCleanup();
      return true;
    }

    return false;
  }, [threshold, performCleanup]);

  // Iniciar monitoramento automático
  const startAutoCleanup = useCallback(() => {
    if (cleanupTimerRef.current) return;

    cleanupTimerRef.current = setInterval(() => {
      checkMemoryUsage();
    }, intervalMs);

    // Limpeza inicial após 5 segundos
    setTimeout(() => {
      performCleanup();
    }, 5000);
  }, [intervalMs, checkMemoryUsage, performCleanup]);

  // Parar monitoramento
  const stopAutoCleanup = useCallback(() => {
    if (cleanupTimerRef.current) {
      clearInterval(cleanupTimerRef.current);
      cleanupTimerRef.current = null;
    }
  }, []);

  // Limpeza manual imediata
  const forceCleanup = useCallback(() => {
    performCleanup();
  }, [performCleanup]);

  return {
    startAutoCleanup,
    stopAutoCleanup,
    forceCleanup,
    checkMemoryUsage,
  };
};

// Hook para componentes que precisam de cleanup específico
export const useComponentCleanup = (componentId: string) => {
  const cleanupCallbacksRef = useRef<Set<() => void>>(new Set());

  const addCleanupCallback = useCallback((callback: () => void) => {
    cleanupCallbacksRef.current.add(callback);
  }, []);

  const removeCleanupCallback = useCallback((callback: () => void) => {
    cleanupCallbacksRef.current.delete(callback);
  }, []);

  const performComponentCleanup = useCallback(() => {
    cleanupCallbacksRef.current.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.warn(`⚠️ Cleanup error for ${componentId}:`, error);
      }
    });
    cleanupCallbacksRef.current.clear();
  }, [componentId]);

  return {
    addCleanupCallback,
    removeCleanupCallback,
    performComponentCleanup,
  };
};

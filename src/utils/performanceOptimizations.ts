// @ts-nocheck
/**
 * Utilitários de performance para evitar violations
 */

// Cache de requestAnimationFrame IDs para cleanup
const rafIds = new Set<number>();
const timeoutIds = new Set<number>();
const intervalIds = new Set<number>();

/**
 * setTimeout otimizado que evita violations
 */
export const optimizedSetTimeout = (callback: () => void, delay: number): number => {
  const timeoutId = window.setTimeout(() => {
    timeoutIds.delete(timeoutId);
    callback();
  }, delay);

  timeoutIds.add(timeoutId);
  return timeoutId;
};

/**
 * setInterval otimizado com auto-cleanup
 */
export const optimizedSetInterval = (callback: () => void, delay: number): number => {
  const intervalId = window.setInterval(callback, Math.max(delay, 16)); // Mínimo 16ms
  intervalIds.add(intervalId);
  return intervalId;
};

/**
 * requestAnimationFrame otimizado com cache
 */
export const optimizedRAF = (callback: () => void): number => {
  const rafId = requestAnimationFrame(() => {
    rafIds.delete(rafId);
    callback();
  });

  rafIds.add(rafId);
  return rafId;
};

/**
 * requestIdleCallback com fallback otimizado
 */
export const optimizedRequestIdle = (
  callback: () => void,
  options?: { timeout?: number }
): number => {
  if ('requestIdleCallback' in window) {
    return (window as any).requestIdleCallback(callback, options);
  }

  // Fallback usando RAF para ser menos invasivo que setTimeout
  return optimizedRAF(() => {
    // Aguardar um pouco para simular idle time
    optimizedSetTimeout(callback, 16);
  });
};

/**
 * Cleanup de todos os timers/RAFs ativos
 */
export const cleanupAllTimers = (): void => {
  rafIds.forEach(id => cancelAnimationFrame(id));
  timeoutIds.forEach(id => clearTimeout(id));
  intervalIds.forEach(id => clearInterval(id));

  rafIds.clear();
  timeoutIds.clear();
  intervalIds.clear();
};

/**
 * Debounce otimizado usando requestIdleCallback
 */
export const optimizedDebounce = <T extends (...args: any[]) => any>(func: T, delay: number): T => {
  let timeoutId: number | null = null;

  return ((...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);

    timeoutId = optimizedSetTimeout(() => {
      func(...args);
      timeoutId = null;
    }, delay);
  }) as T;
};

/**
 * Throttle usando requestAnimationFrame para suavidade
 */
export const optimizedThrottle = <T extends (...args: any[]) => any>(func: T, fps = 60): T => {
  let rafId: number | null = null;
  let lastExecution = 0;
  const frameTime = 1000 / fps;

  return ((...args: Parameters<T>) => {
    const now = performance.now();

    if (rafId || now - lastExecution < frameTime) {
      return;
    }

    rafId = optimizedRAF(() => {
      lastExecution = performance.now();
      func(...args);
      rafId = null;
    });
  }) as T;
};

/**
 * Executar operação pesada em chunks para evitar blocking
 */
export const executeInChunks = async <T>(
  items: T[],
  processor: (item: T, index: number) => void,
  chunkSize = 100,
  yieldEvery = 5 // Yield a cada 5 chunks
): Promise<void> => {
  let chunkCount = 0;

  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);

    chunk.forEach((item, idx) => processor(item, i + idx));

    chunkCount++;

    // Yield controle para o browser periodicamente
    if (chunkCount % yieldEvery === 0 && i + chunkSize < items.length) {
      await new Promise<void>(resolve => {
        optimizedRequestIdle(() => resolve());
      });
    }
  }
};

/**
 * Monitor de performance que não causa violations
 */
export const createPerformanceMonitor = () => {
  let isRunning = false;
  let cleanupFunc: (() => void) | null = null;

  const start = () => {
    if (isRunning) return;
    isRunning = true;

    const monitor = () => {
      if (!isRunning) return;

      // Verificações leves de performance
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.9) {
          console.warn('🚨 High memory usage detected');
        }
      }

      // Reagendar de forma otimizada
      optimizedRequestIdle(() => {
        if (isRunning) {
          optimizedSetTimeout(monitor, 15000); // 15s interval
        }
      });
    };

    monitor();

    cleanupFunc = () => {
      isRunning = false;
      cleanupAllTimers();
    };
  };

  const stop = () => {
    isRunning = false;
    cleanupFunc?.();
  };

  return { start, stop };
};

// Auto-cleanup quando a página é descarregada
const __IS_TEST__ = typeof import.meta !== 'undefined' && (import.meta as any).env && Boolean((import.meta as any).env.VITEST);
if (typeof window !== 'undefined' && !__IS_TEST__) {
  window.addEventListener('beforeunload', cleanupAllTimers);

  // Cleanup no Visibility API
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cleanupAllTimers();
    }
  });
}

export default {
  optimizedSetTimeout,
  optimizedSetInterval,
  optimizedRAF,
  optimizedRequestIdle,
  optimizedDebounce,
  optimizedThrottle,
  executeInChunks,
  createPerformanceMonitor,
  cleanupAllTimers,
};

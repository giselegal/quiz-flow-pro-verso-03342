/**
 * Utilitário para monitoramento e otimização de performance
 */

interface EnhancedPerformanceEntry extends PerformanceEntry {
  processingStart?: number;
  processingEnd?: number;
  hadRecentInput?: boolean;
}

/**
 * Métricas de performance do Quiz
 */
export const QUIZ_PERF = {
  startTime: performance.now(),
  markerTimings: {} as Record<string, number>,
  mark: (name: string) => {
    QUIZ_PERF.markerTimings[name] = performance.now() - QUIZ_PERF.startTime;
    if (typeof window !== "undefined" && "performance" in window) {
      window.performance.mark(name);
    }
  },
  measure: (name: string, startMark: string, endMark: string) => {
    if (typeof window !== "undefined" && "performance" in window) {
      try {
        window.performance.measure(name, startMark, endMark);
      } catch (e) {
        console.error("Error measuring performance:", e);
      }
    }
  },
  getLCP: () => {
    // Implementação simulada para retornar LCP
    return 1200; // Valor fictício em ms
  },
};

/**
 * Inicializa observadores de performance
 */
export function initPerformanceObservers() {
  if (typeof window === "undefined" || !("PerformanceObserver" in window)) {
    return;
  }

  try {
    // LCP Observer
    const lcpObserver = new PerformanceObserver(entryList => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1] as EnhancedPerformanceEntry;

      if (lastEntry) {
        const lcp = lastEntry.startTime;
        console.log(`[Performance] LCP: ${lcp.toFixed(0)}ms`);

        // Armazenar para análise
        (window as any).quizPerformanceMetrics = {
          ...((window as any).quizPerformanceMetrics || {}),
          lcp,
        };
      }
    });

    lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });

    // FID Observer
    const fidObserver = new PerformanceObserver(entryList => {
      const entries = entryList.getEntries();
      for (const entry of entries) {
        const customEntry = entry as EnhancedPerformanceEntry;
        const fid = customEntry.processingStart
          ? customEntry.processingStart - customEntry.startTime
          : 0;

        console.log(`[Performance] FID: ${fid.toFixed(0)}ms`);

        // Armazenar para análise
        (window as any).quizPerformanceMetrics = {
          ...((window as any).quizPerformanceMetrics || {}),
          fid,
        };
      }
    });

    fidObserver.observe({ type: "first-input", buffered: true });

    // Metrics para CLS
    let cumulativeLayoutShift = 0;
    const clsObserver = new PerformanceObserver(entryList => {
      const entries = entryList.getEntries();
      for (const entry of entries) {
        const customEntry = entry as EnhancedPerformanceEntry;

        // Ignorar shifts causados pela interação do usuário
        if (customEntry.hadRecentInput) {
          continue;
        }

        const entryValue = (entry as any).value || 0;
        cumulativeLayoutShift += entryValue;

        // Atualizar CLS
        (window as any).quizPerformanceMetrics = {
          ...((window as any).quizPerformanceMetrics || {}),
          cls: cumulativeLayoutShift,
        };
      }
    });

    clsObserver.observe({ type: "layout-shift", buffered: true });

    return [lcpObserver, fidObserver, clsObserver];
  } catch (error) {
    console.error("[Performance] Error initializing observers:", error);
    return [];
  }
}

/**
 * OTIMIZAÇÕES PARA RESOLVER VIOLATIONS DE PERFORMANCE
 */

/**
 * Debounce otimizado que usa requestIdleCallback quando possível
 */
export function optimizedDebounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
  useIdle = true
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let idleId: number | null = null;

  return (...args: Parameters<T>) => {
    const execute = () => {
      try {
        func(...args);
      } catch (error) {
        console.error('Error in debounced function:', error);
      }
    };

    // Cancelar execuções anteriores
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    if (idleId && 'cancelIdleCallback' in window) {
      cancelIdleCallback(idleId);
      idleId = null;
    }

    if (useIdle && 'requestIdleCallback' in window) {
      // Usar requestIdleCallback para operações não críticas
      idleId = requestIdleCallback(execute, { timeout: delay + 1000 });
    } else {
      // Fallback com setTimeout otimizado
      timeoutId = setTimeout(execute, delay);
    }
  };
}

/**
 * Throttle otimizado usando requestAnimationFrame
 */
export function optimizedThrottle<T extends (...args: any[]) => any>(
  func: T,
  fps = 60
): (...args: Parameters<T>) => void {
  let rafId: number | null = null;
  let lastArgs: Parameters<T> | null = null;
  const delay = 1000 / fps;
  let lastExecution = 0;

  return (...args: Parameters<T>) => {
    lastArgs = args;

    if (rafId) return;

    rafId = requestAnimationFrame(() => {
      const now = performance.now();
      
      if (now - lastExecution >= delay && lastArgs) {
        try {
          func(...lastArgs);
        } catch (error) {
          console.error('Error in throttled function:', error);
        }
        lastExecution = now;
      }
      
      rafId = null;
    });
  };
}

/**
 * Agenda trabalho de forma otimizada para evitar violations
 */
export function scheduleOptimizedWork(
  callback: () => void,
  priority: 'idle' | 'normal' | 'urgent' = 'normal',
  timeout = 5000
): () => void {
  let id: number | ReturnType<typeof setTimeout>;
  let cancelled = false;

  const wrappedCallback = () => {
    if (cancelled) return;
    
    try {
      const start = performance.now();
      callback();
      const duration = performance.now() - start;
      
      // Log se a operação demorou muito
      if (duration > 16.67) { // > 1 frame @ 60fps
        console.warn(`⚠️ Slow operation: ${Math.round(duration)}ms`);
      }
    } catch (error) {
      console.error('Error in scheduled work:', error);
    }
  };

  switch (priority) {
    case 'idle':
      if ('requestIdleCallback' in window) {
        id = requestIdleCallback(wrappedCallback, { timeout });
      } else {
        id = setTimeout(wrappedCallback, 0);
      }
      break;
    
    case 'urgent':
      id = requestAnimationFrame(wrappedCallback);
      break;
    
    default: // normal
      id = setTimeout(wrappedCallback, 0);
      break;
  }

  // Retorna função de cancelamento
  return () => {
    cancelled = true;
    if (typeof id === 'number') {
      if ('cancelIdleCallback' in window) {
        cancelIdleCallback(id);
      } else {
        cancelAnimationFrame(id);
      }
    } else {
      clearTimeout(id);
    }
  };
}

/**
 * Verifica se uma operação deve ser executada baseado na performance atual
 */
export function shouldExecuteBasedOnPerformance(): boolean {
  // Verificar se o browser está sobrecarregado
  if ('memory' in performance && (performance as any).memory) {
    const memory = (performance as any).memory;
    const memoryUsage = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
    
    // Se uso de memória > 80%, adiar operações não críticas
    if (memoryUsage > 0.8) {
      return false;
    }
  }

  // Verificar se há trabalho pendente no main thread
  if ('scheduler' in window && (window as any).scheduler.isInputPending) {
    return !(window as any).scheduler.isInputPending();
  }

  return true;
}

/**
 * Wrapper para setTimeout que evita violations
 */
export function optimizedSetTimeout(
  callback: () => void,
  delay: number
): ReturnType<typeof setTimeout> {
  const startTime = performance.now();
  
  return setTimeout(() => {
    if (!shouldExecuteBasedOnPerformance()) {
      // Reagendar se performance estiver ruim
      optimizedSetTimeout(callback, delay);
      return;
    }

    const executionStart = performance.now();
    
    try {
      callback();
    } catch (error) {
      console.error('Error in optimized timeout:', error);
    }
    
    const executionTime = performance.now() - executionStart;
    
    // Log se demorou muito
    if (executionTime > 50) {
      console.warn(`⏱️ Slow setTimeout: ${Math.round(executionTime)}ms`);
    }
  }, delay);
}

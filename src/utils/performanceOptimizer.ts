/**
 * Utilitário para monitoramento e otimização de performance
 * Otimizado para reduzir violações de setTimeout
 */

interface EnhancedPerformanceEntry extends PerformanceEntry {
  processingStart?: number;
  processingEnd?: number;
  hadRecentInput?: boolean;
}

// Configuração para reduzir logs em desenvolvimento
const IS_DEV = process.env.NODE_ENV === 'development';
const ENABLE_PERFORMANCE_LOGS = !IS_DEV; // Desabilitar logs em dev para reduzir violações

/**
 * Métricas de performance do Quiz - Otimizado para reduzir setTimeout violations
 */
export const QUIZ_PERF = {
  startTime: performance.now(),
  markerTimings: {} as Record<string, number>,
  mark: (name: string) => {
    QUIZ_PERF.markerTimings[name] = performance.now() - QUIZ_PERF.startTime;
    if (typeof window !== 'undefined' && 'performance' in window) {
      // Usar requestIdleCallback para operações não críticas
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(() => {
          (window as any).performance.mark(name);
        });
      } else {
        (window as any).performance.mark(name);
      }
    }
  },
  measure: (name: string, startMark: string, endMark: string) => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      // Usar requestIdleCallback para medições não críticas
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(() => {
          try {
            (window as any).performance.measure(name, startMark, endMark);
          } catch (e) {
            if (ENABLE_PERFORMANCE_LOGS) {
              console.error('Error measuring performance:', e);
            }
          }
        });
      } else {
        try {
          (window as any).performance.measure(name, startMark, endMark);
        } catch (e) {
          if (ENABLE_PERFORMANCE_LOGS) {
            console.error('Error measuring performance:', e);
          }
        }
      }
    }
  },
  getLCP: () => {
    // Implementação simulada para retornar LCP
    return 1200; // Valor fictício em ms
  }
};

/**
 * Substituto otimizado para setTimeout que usa requestIdleCallback quando possível
 */
export function optimizedTimeout(callback: () => void, delay: number = 0): any {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window && delay === 0) {
    // Para delays de 0ms, usar requestIdleCallback para evitar violações
    return (window as any).requestIdleCallback(callback);
  }
  
  // Para outros casos, usar setTimeout normal
  return setTimeout(callback, delay) as any;
}

/**
 * Hook otimizado para debounce que reduz violações de setTimeout
 */
export function useOptimizedDebounce<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T {
  let timeoutId: any;

  return ((...args: any[]) => {
    if (timeoutId) {
      if (typeof timeoutId === 'number' && 'cancelIdleCallback' in window) {
        (window as any).cancelIdleCallback(timeoutId);
      } else {
        clearTimeout(timeoutId);
      }
    }

    if (delay === 0 && typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      // Para delay 0, usar requestIdleCallback
      timeoutId = (window as any).requestIdleCallback(() => callback(...args));
    } else {
      // Para outros delays, usar setTimeout normal
      timeoutId = setTimeout(() => callback(...args), delay);
    }
  }) as T;
}

/**
 * Inicializa observadores de performance - Otimizado para reduzir setTimeout violations
 */
export function initPerformanceObservers() {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return;
  }

  // Não inicializar observadores em desenvolvimento para reduzir violações
  if (IS_DEV) {
    return;
  }

  try {
    // LCP Observer com throttling
    const lcpObserver = new PerformanceObserver((entryList) => {
      // Usar requestIdleCallback para processar entradas
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1] as EnhancedPerformanceEntry;
          
          if (lastEntry && ENABLE_PERFORMANCE_LOGS) {
            const lcp = lastEntry.startTime;
            console.log(`[Performance] LCP: ${lcp.toFixed(0)}ms`);
            
            // Armazenar para análise
            (window as any).quizPerformanceMetrics = {
              ...(window as any).quizPerformanceMetrics || {},
              lcp
            };
          }
        });
      }
    });
    
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    
    // FID Observer com throttling
    const fidObserver = new PerformanceObserver((entryList) => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          const entries = entryList.getEntries();
          for (const entry of entries) {
            const customEntry = entry as EnhancedPerformanceEntry;
            const fid = customEntry.processingStart ? 
              customEntry.processingStart - customEntry.startTime : 
              0;
            
            if (ENABLE_PERFORMANCE_LOGS) {
              console.log(`[Performance] FID: ${fid.toFixed(0)}ms`);
            }
            
            // Armazenar para análise
            (window as any).quizPerformanceMetrics = {
              ...(window as any).quizPerformanceMetrics || {},
              fid
            };
          }
        });
      }
    });
    
    fidObserver.observe({ type: 'first-input', buffered: true });
    
    // CLS Observer simplificado
    let cumulativeLayoutShift = 0;
    const clsObserver = new PerformanceObserver((entryList) => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
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
              ...(window as any).quizPerformanceMetrics || {},
              cls: cumulativeLayoutShift
            };
          }
        });
      }
    });
    
    clsObserver.observe({ type: 'layout-shift', buffered: true });
    
    return [lcpObserver, fidObserver, clsObserver];
  } catch (error) {
    if (ENABLE_PERFORMANCE_LOGS) {
      console.error('[Performance] Error initializing observers:', error);
    }
    return [];
  }
}

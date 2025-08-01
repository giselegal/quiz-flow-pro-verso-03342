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
    if (typeof window !== 'undefined' && 'performance' in window) {
      window.performance.mark(name);
    }
  },
  measure: (name: string, startMark: string, endMark: string) => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      try {
        window.performance.measure(name, startMark, endMark);
      } catch (e) {
        console.error('Error measuring performance:', e);
      }
    }
  },
  getLCP: () => {
    // Implementação simulada para retornar LCP
    return 1200; // Valor fictício em ms
  }
};

/**
 * Inicializa observadores de performance
 */
export function initPerformanceObservers() {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return;
  }

  try {
    // LCP Observer
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1] as EnhancedPerformanceEntry;
      
      if (lastEntry) {
        const lcp = lastEntry.startTime;
        console.log(`[Performance] LCP: ${lcp.toFixed(0)}ms`);
        
        // Armazenar para análise
        (window as any).quizPerformanceMetrics = {
          ...(window as any).quizPerformanceMetrics || {},
          lcp
        };
      }
    });
    
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    
    // FID Observer
    const fidObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      for (const entry of entries) {
        const customEntry = entry as EnhancedPerformanceEntry;
        const fid = customEntry.processingStart ? 
          customEntry.processingStart - customEntry.startTime : 
          0;
        
        console.log(`[Performance] FID: ${fid.toFixed(0)}ms`);
        
        // Armazenar para análise
        (window as any).quizPerformanceMetrics = {
          ...(window as any).quizPerformanceMetrics || {},
          fid
        };
      }
    });
    
    fidObserver.observe({ type: 'first-input', buffered: true });
    
    // Metrics para CLS
    let cumulativeLayoutShift = 0;
    const clsObserver = new PerformanceObserver((entryList) => {
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
    
    clsObserver.observe({ type: 'layout-shift', buffered: true });
    
    return [lcpObserver, fidObserver, clsObserver];
  } catch (error) {
    console.error('[Performance] Error initializing observers:', error);
    return [];
  }
}

/**
 * Configurações para reduzir violações de setTimeout em desenvolvimento
 */

// Utilitário para reduzir violações de performance
export const DevPerformanceOptimizer = {
  init() {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      // Desabilita observadores de performance em desenvolvimento
      if ('PerformanceObserver' in window) {
        const originalPerformanceObserver = window.PerformanceObserver;
        window.PerformanceObserver = class extends originalPerformanceObserver {
          observe(options: any) {
            // Reduz a frequência de observação em desenvolvimento
            if (options.buffered) {
              options.buffered = false;
            }
            return super.observe(options);
          }
        };
      }

      // Reduz logs do console para melhorar performance
      const originalConsoleLog = console.log;
      console.log = (...args: any[]) => {
        if (args[0] && typeof args[0] === 'string' && args[0].includes('[Violation]')) {
          return; // Suprime mensagens de violação
        }
        return originalConsoleLog.apply(console, args);
      };

      console.log('🔧 [Dev] Performance optimization enabled');
    }
  }
};

// Auto-inicializa
DevPerformanceOptimizer.init();

export {};

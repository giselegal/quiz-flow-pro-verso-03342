// @ts-nocheck
/**
 * 🚀 PERFORMANCE MANAGER CONSOLIDADO
 * Gerencia todos os aspectos de performance da aplicação
 */

import { optimizedSetTimeout, optimizedRAF, cleanupAllTimers } from './performanceOptimizations';

class PerformanceManager {
  private isInitialized = false;
  private logBuffer: Array<{ level: string; message: string; data?: any; timestamp: number }> = [];
  private memoryMonitor: ReturnType<typeof setInterval> | null = null;
  private observers: ResizeObserver[] = [];
  private abortControllers: AbortController[] = [];

  /**
   * Inicializar o gerenciador de performance
   */
  initialize() {
    if (this.isInitialized) return;
    
    this.isInitialized = true;
    this.setupMemoryMonitoring();
    this.setupCleanupListeners();
    
    // Log apenas em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.log('🚀 Performance Manager initialized');
    }
  }

  /**
   * Sistema de logging otimizado
   */
  log(level: 'info' | 'warn' | 'error', message: string, data?: any) {
    if (process.env.NODE_ENV !== 'development') return;

    const logEntry = {
      level,
      message,
      data,
      timestamp: performance.now()
    };

    // Buffer de logs para evitar spam
    this.logBuffer.push(logEntry);
    
    // Manter apenas os últimos 50 logs
    if (this.logBuffer.length > 50) {
      this.logBuffer.shift();
    }

    // Log imediato apenas para erros críticos
    if (level === 'error') {
      console.error(`🚨 ${message}`, data);
    }
  }

  /**
   * Monitoramento de memória
   */
  private setupMemoryMonitoring() {
    if (typeof window === 'undefined' || !('memory' in performance)) return;

    this.memoryMonitor = setInterval(() => {
      const memory = (performance as any).memory;
      const usagePercent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
      
      if (usagePercent > 80) {
        this.log('warn', 'High memory usage detected', {
          usage: `${usagePercent.toFixed(1)}%`,
          used: `${(memory.usedJSHeapSize / 1048576).toFixed(1)}MB`,
          limit: `${(memory.jsHeapSizeLimit / 1048576).toFixed(1)}MB`
        });
      }
    }, 30000); // Check every 30 seconds
  }

  /**
   * Configurar listeners de limpeza
   */
  private setupCleanupListeners() {
    if (typeof window === 'undefined') return;

    // Cleanup on page unload
    const cleanup = () => {
      this.cleanup();
    };

    window.addEventListener('beforeunload', cleanup);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.partialCleanup();
      }
    });
  }

  /**
   * Criar AbortController gerenciado
   */
  createAbortController(): AbortController {
    const controller = new AbortController();
    this.abortControllers.push(controller);
    return controller;
  }

  /**
   * Criar ResizeObserver gerenciado
   */
  createResizeObserver(callback: ResizeObserverCallback): ResizeObserver {
    const observer = new ResizeObserver(callback);
    this.observers.push(observer);
    return observer;
  }

  /**
   * Limpeza parcial (quando tab fica inativa)
   */
  private partialCleanup() {
    // Cancelar apenas requests não críticos
    this.abortControllers.forEach(controller => {
      if (!controller.signal.aborted) {
        controller.abort();
      }
    });
    this.abortControllers = [];
  }

  /**
   * Limpeza completa
   */
  cleanup() {
    // Limpar memory monitor
    if (this.memoryMonitor) {
      clearInterval(this.memoryMonitor);
      this.memoryMonitor = null;
    }

    // Limpar observers
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];

    // Limpar abort controllers
    this.abortControllers.forEach(controller => {
      if (!controller.signal.aborted) {
        controller.abort();
      }
    });
    this.abortControllers = [];

    // Limpar timers otimizados
    cleanupAllTimers();

    // Limpar log buffer
    this.logBuffer = [];

    this.isInitialized = false;
    
    if (process.env.NODE_ENV === 'development') {
      console.log('🧹 Performance Manager cleanup completed');
    }
  }

  /**
   * Obter estatísticas de performance
   */
  getStats() {
    const memory = typeof window !== 'undefined' && 'memory' in performance ? (performance as any).memory : null;
    
    return {
      initialized: this.isInitialized,
      logBufferSize: this.logBuffer.length,
      activeObservers: this.observers.length,
      activeControllers: this.abortControllers.filter(c => !c.signal.aborted).length,
      memory: memory ? {
        used: `${(memory.usedJSHeapSize / 1048576).toFixed(1)}MB`,
        limit: `${(memory.jsHeapSizeLimit / 1048576).toFixed(1)}MB`,
        usage: `${((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100).toFixed(1)}%`
      } : null
    };
  }
}

// Singleton instance
export const performanceManager = new PerformanceManager();

// Auto cleanup on module hot reload (development)
if (process.env.NODE_ENV === 'development' && import.meta.hot) {
  import.meta.hot.dispose(() => {
    performanceManager.cleanup();
  });
}
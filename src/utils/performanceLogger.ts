/**
 * PERFORMANCE UTILITY - Controle inteligente de logs e otimizações
 * ✅ Reduz logs desnecessários em produção
 * ✅ Debug condicional baseado em query params
 * ✅ Throttling de eventos para melhor performance
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class PerformanceLogger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private debugMode = typeof window !== 'undefined' && window.location.search.includes('debug=true');
  private verboseMode = typeof window !== 'undefined' && window.location.search.includes('verbose=true');

  // Controle inteligente de logs
  log(level: LogLevel, message: string, data?: any) {
    if (!this.isDevelopment) return;
    
    if (level === 'debug' && !this.debugMode) return;
    if (level === 'info' && !this.verboseMode && !this.debugMode) return;
    
    const logger = console[level] || console.log;
    if (data) {
      logger(message, data);
    } else {
      logger(message);
    }
  }

  debug(message: string, data?: any) {
    this.log('debug', `🔍 ${message}`, data);
  }

  info(message: string, data?: any) {
    this.log('info', `ℹ️ ${message}`, data);
  }

  warn(message: string, data?: any) {
    this.log('warn', `⚠️ ${message}`, data);
  }

  error(message: string, data?: any) {
    this.log('error', `❌ ${message}`, data);
  }

  // Throttling para eventos frequentes
  private throttleTimers = new Map<string, number>();
  
  throttle(key: string, fn: () => void, delay = 100) {
    if (this.throttleTimers.has(key)) {
      clearTimeout(this.throttleTimers.get(key));
    }
    
    const timer = window.setTimeout(() => {
      fn();
      this.throttleTimers.delete(key);
    }, delay);
    
    this.throttleTimers.set(key, timer);
  }

  // Debouncing para inputs
  private debounceTimers = new Map<string, number>();
  
  debounce(key: string, fn: () => void, delay = 300) {
    if (this.debounceTimers.has(key)) {
      clearTimeout(this.debounceTimers.get(key));
    }
    
    const timer = window.setTimeout(() => {
      fn();
      this.debounceTimers.delete(key);
    }, delay);
    
    this.debounceTimers.set(key, timer);
  }

  // Performance measurement
  private performanceMarks = new Map<string, number>();
  
  startMeasure(key: string) {
    if (!this.isDevelopment) return;
    this.performanceMarks.set(key, performance.now());
  }
  
  endMeasure(key: string, logResult = false) {
    if (!this.isDevelopment) return 0;
    
    const start = this.performanceMarks.get(key);
    if (!start) return 0;
    
    const duration = performance.now() - start;
    this.performanceMarks.delete(key);
    
    if (logResult && this.debugMode) {
      console.log(`⏱️ Performance [${key}]: ${duration.toFixed(2)}ms`);
    }
    
    return duration;
  }
}

// Instância singleton
export const perfLogger = new PerformanceLogger();

// Hooks de otimização
export const useOptimizedCallback = <T extends (...args: any[]) => void>(
  callback: T,
  deps: React.DependencyList,
  debounceMs = 100
): T => {
  const React = require('react');
  
  return React.useCallback(
    (...args: Parameters<T>) => {
      perfLogger.debounce(
        `callback-${callback.name || 'anonymous'}`,
        () => callback(...args),
        debounceMs
      );
    },
    deps
  ) as T;
};

// Event throttling utility
export const dispatchThrottledEvent = (
  eventName: string,
  detail: any,
  element: Element | Document = document,
  throttleMs = 16 // ~60fps
) => {
  perfLogger.throttle(
    `event-${eventName}`,
    () => {
      const event = new CustomEvent(eventName, {
        detail,
        bubbles: true,
        cancelable: true
      });
      
      // Performance: Use requestAnimationFrame for DOM events
      requestAnimationFrame(() => {
        element.dispatchEvent(event);
      });
    },
    throttleMs
  );
};

export default perfLogger;
// @ts-nocheck
/**
 * 🚀 PERFORMANCE OPTIMIZER
 * Utilitário para monitoramento e otimização de performance
 * Inclui otimizações para setTimeout violations
 */

interface EnhancedPerformanceEntry extends PerformanceEntry {
  processingStart?: number;
  processingEnd?: number;
  hadRecentInput?: boolean;
}

// 1️⃣ OTIMIZAÇÃO: requestAnimationFrame pool para operações UI
class AnimationFrameScheduler {
  private queue: (() => void)[] = [];
  private isScheduled = false;

  schedule(callback: () => void) {
    this.queue.push(callback);
    if (!this.isScheduled) {
      this.isScheduled = true;
      requestAnimationFrame(() => this.flush());
    }
  }

  private flush() {
    const callbacks = [...this.queue];
    this.queue.length = 0;
    this.isScheduled = false;

    callbacks.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.error('Animation frame callback error:', error);
      }
    });
  }
}

// 2️⃣ OTIMIZAÇÃO: MessageChannel para non-blocking scheduling
class MessageChannelScheduler {
  private channel: MessageChannel;
  private port1: MessagePort;
  private port2: MessagePort;
  private callbacks: (() => void)[] = [];

  constructor() {
    this.channel = new MessageChannel();
    this.port1 = this.channel.port1;
    this.port2 = this.channel.port2;

    this.port1.onmessage = () => this.flushCallbacks();
  }

  schedule(callback: () => void) {
    this.callbacks.push(callback);
    this.port2.postMessage(null);
  }

  private flushCallbacks() {
    const callbacks = [...this.callbacks];
    this.callbacks.length = 0;

    callbacks.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.error('MessageChannel callback error:', error);
      }
    });
  }
}

// 3️⃣ OTIMIZAÇÃO: Smart timeout com fallbacks
class SmartTimeout {
  private static animationScheduler = new AnimationFrameScheduler();
  private static messageScheduler = new MessageChannelScheduler();

  /**
   * Substituto otimizado para setTimeout com scheduling inteligente
   */
  static schedule(
    callback: () => void,
    delay: number = 0,
    strategy: 'animation' | 'message' | 'timeout' = 'animation'
  ): number {
    switch (strategy) {
      case 'animation':
        // Para UI updates, usar requestAnimationFrame
        this.animationScheduler.schedule(callback);
        return 0; // requestAnimationFrame não retorna ID cancelável

      case 'message':
        // Para non-blocking operations
        this.messageScheduler.schedule(callback);
        return 0;

      case 'timeout':
      default:
        // Fallback para setTimeout nativo quando necessário
        return window.setTimeout(callback, Math.max(delay, 4)) as unknown as number;
    }
  }

  /**
   * Substituto otimizado para setInterval
   */
  static scheduleInterval(
    callback: () => void,
    delay: number,
    strategy: 'animation' | 'timeout' = 'animation'
  ): number {
    if (strategy === 'animation' && delay < 100) {
      // Para intervalos rápidos, usar requestAnimationFrame recursivo
      const recursiveCallback = () => {
        callback();
        requestAnimationFrame(recursiveCallback);
      };
      requestAnimationFrame(recursiveCallback);
      return 0;
    }

    // Fallback para setInterval nativo
    return window.setInterval(callback, Math.max(delay, 16)) as unknown as number;
  }
}

// 4️⃣ OTIMIZAÇÃO: Debounce otimizado
class OptimizedDebounce {
  private static timers = new Map<string, number>();
  private static scheduler = new AnimationFrameScheduler();

  static create<T extends (...args: any[]) => any>(
    fn: T,
    delay: number,
    key?: string
  ): T & { cancel: () => void } {
    const uniqueKey = key || `debounce-${Math.random()}`;

    const debouncedFn = ((...args: any[]) => {
      // Cancel previous timer
      if (this.timers.has(uniqueKey)) {
        clearTimeout(this.timers.get(uniqueKey));
      }

      if (delay <= 16) {
        // Para delays muito baixos, usar requestAnimationFrame
        this.scheduler.schedule(() => fn(...args));
      } else {
        // Para delays maiores, usar setTimeout otimizado
        const timerId = SmartTimeout.schedule(
          () => {
            this.timers.delete(uniqueKey);
            fn(...args);
          },
          delay,
          'timeout'
        );

        this.timers.set(uniqueKey, timerId);
      }
    }) as T & { cancel: () => void };

    debouncedFn.cancel = () => {
      if (this.timers.has(uniqueKey)) {
        clearTimeout(this.timers.get(uniqueKey));
        this.timers.delete(uniqueKey);
      }
    };

    return debouncedFn;
  }
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
  },
};

// 5️⃣ EXPORT: API pública otimizada com fallbacks
const __tracked = {
  timeouts: new Set<number>(),
  intervals: new Set<number>(),
  cancelOnNavTimeouts: new Set<number>(),
  cancelOnNavIntervals: new Set<number>(),
};

export const PerformanceOptimizer = {
  // Schedulers otimizados com fallbacks seguros
  schedule: (
    callback: () => void,
    delay: number = 0,
    strategy: 'animation' | 'message' | 'timeout' = 'animation',
    options?: { cancelOnNav?: boolean; label?: string }
  ) => {
    try {
      const id = SmartTimeout.schedule(callback, delay, strategy);
      if (strategy === 'timeout' && typeof id === 'number' && id) {
        __tracked.timeouts.add(id);
        if (options?.cancelOnNav) __tracked.cancelOnNavTimeouts.add(id);
      }
      return id;
    } catch (error) {
      console.warn('PerformanceOptimizer.schedule fallback:', error);
      // Fallback seguro para setTimeout nativo
      const id = setTimeout(callback, Math.max(delay, 0)) as unknown as number;
      __tracked.timeouts.add(id);
      if (options?.cancelOnNav) __tracked.cancelOnNavTimeouts.add(id);
      return id;
    }
  },

  scheduleInterval: (
    callback: () => void,
    delay: number,
    strategy: 'animation' | 'timeout' = 'animation',
    options?: { cancelOnNav?: boolean; label?: string }
  ) => {
    try {
      const id = SmartTimeout.scheduleInterval(callback, delay, strategy);
      if (strategy === 'timeout' && typeof id === 'number' && id) {
        __tracked.intervals.add(id);
        if (options?.cancelOnNav) __tracked.cancelOnNavIntervals.add(id);
      }
      return id;
    } catch (error) {
      console.warn('PerformanceOptimizer.scheduleInterval fallback:', error);
      // Fallback seguro para setInterval nativo
      const id = setInterval(callback, Math.max(delay, 16)) as unknown as number;
      __tracked.intervals.add(id);
      if (options?.cancelOnNav) __tracked.cancelOnNavIntervals.add(id);
      return id;
    }
  },

  // Debounce otimizado com fallback
  debounce: <T extends (...args: any[]) => any>(fn: T, delay: number, key?: string) => {
    try {
      return OptimizedDebounce.create(fn, delay, key);
    } catch (error) {
      console.warn('PerformanceOptimizer.debounce fallback:', error);
      // Fallback simples para debounce
      let timeoutId: any;
      const debouncedFn = ((...args: any[]) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
      }) as T & { cancel: () => void };

      debouncedFn.cancel = () => clearTimeout(timeoutId);
      return debouncedFn;
    }
  },

  // Utilitários seguros
  isHighFrequencyUpdate: (delay: number) => delay < 100,
  getSuggestedStrategy: (
    delay: number,
    isUIUpdate = false
  ): 'animation' | 'message' | 'timeout' => {
    if (isUIUpdate || delay < 16) return 'animation';
    if (delay < 100) return 'message';
    return 'timeout';
  },

  // Cancelamentos utilitários
  cancelTimeout: (id?: number) => {
    if (typeof id === 'number') {
      clearTimeout(id);
      __tracked.timeouts.delete(id);
      __tracked.cancelOnNavTimeouts.delete(id);
    }
  },
  cancelInterval: (id?: number) => {
    if (typeof id === 'number') {
      clearInterval(id);
      __tracked.intervals.delete(id);
      __tracked.cancelOnNavIntervals.delete(id);
    }
  },
  cancelAllTimeouts: () => {
    for (const id of Array.from(__tracked.timeouts)) {
      clearTimeout(id);
      __tracked.timeouts.delete(id);
      __tracked.cancelOnNavTimeouts.delete(id);
    }
  },
  cancelAllIntervals: () => {
    for (const id of Array.from(__tracked.intervals)) {
      clearInterval(id);
      __tracked.intervals.delete(id);
      __tracked.cancelOnNavIntervals.delete(id);
    }
  },
  cancelOnNavigation: () => {
    // Cancela apenas timers marcados explicitamente para navegação
    for (const id of Array.from(__tracked.cancelOnNavTimeouts)) {
      clearTimeout(id);
      __tracked.cancelOnNavTimeouts.delete(id);
      __tracked.timeouts.delete(id);
    }
    for (const id of Array.from(__tracked.cancelOnNavIntervals)) {
      clearInterval(id);
      __tracked.cancelOnNavIntervals.delete(id);
      __tracked.intervals.delete(id);
    }
  },
};

// Garantir que seja um export default também para compatibilidade
export default PerformanceOptimizer;

/**
 * Inicializa observadores de performance
 */
export function initPerformanceObservers() {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
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

    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

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

    fidObserver.observe({ type: 'first-input', buffered: true });

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

    clsObserver.observe({ type: 'layout-shift', buffered: true });

    return [lcpObserver, fidObserver, clsObserver];
  } catch (error) {
    console.error('[Performance] Error initializing observers:', error);
    return [];
  }
}

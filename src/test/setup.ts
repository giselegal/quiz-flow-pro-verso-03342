import '@testing-library/jest-dom';
import { vi, afterEach, afterAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import { PerformanceOptimizer } from '@/utils/performanceOptimizer';

// Setup global test environment
global.ResizeObserver = class ResizeObserver {
  observe() { }
  unobserve() { }
  disconnect() { }
};

// Mock window.matchMedia apenas quando window existir (evita falha no ambiente node)
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  root: Element | null = null;
  rootMargin: string = '';
  thresholds: ReadonlyArray<number> = [];

  constructor() { }
  observe() { }
  disconnect() { }
  unobserve() { }
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
};

// --------------------------
// Timer/RAF/Idle polyfills + cleanup to avoid leaks between tests
// --------------------------
(function installGlobalTimersCleanup() {
  const g: any = globalThis as any;

  // Track all timers/intervals created during tests
  const activeTimeouts = new Set<number>();
  const activeIntervals = new Set<number>();
  const activeRafs = new Set<number>();
  const activeIdles = new Set<number>();

  const originalSetTimeout = g.setTimeout?.bind(g) || ((fn: any) => fn());
  const originalClearTimeout = g.clearTimeout?.bind(g) || (() => { });
  const originalSetInterval = g.setInterval?.bind(g) || ((fn: any) => fn());
  const originalClearInterval = g.clearInterval?.bind(g) || (() => { });
  const originalRequestAnimationFrame = g.requestAnimationFrame?.bind(g) || ((cb: any) => originalSetTimeout(cb, 16));
  const originalCancelAnimationFrame = g.cancelAnimationFrame?.bind(g) || ((id: any) => originalClearTimeout(id));

  // requestIdleCallback polyfill with cancel support
  const requestIdleCallback: (cb: Function, opts?: { timeout?: number }) => number =
    g.requestIdleCallback?.bind(g) || ((cb: any, opts?: { timeout?: number }) => {
      const timeout = Math.min(50, opts?.timeout ?? 50);
      return originalSetTimeout(() => cb({ didTimeout: false, timeRemaining: () => 50 }), timeout) as unknown as number;
    });
  const cancelIdleCallback = g.cancelIdleCallback?.bind(g) || ((id: number) => originalClearTimeout(id));

  // Patch globals to track ids
  g.setTimeout = ((handler: TimerHandler, timeout?: number, ...args: any[]) => {
    const id = originalSetTimeout(handler as any, timeout as any, ...args) as unknown as number;
    if (typeof id === 'number') activeTimeouts.add(id);
    return id as any;
  }) as typeof setTimeout;

  g.clearTimeout = ((id?: number) => {
    if (typeof id === 'number') activeTimeouts.delete(id);
    return originalClearTimeout(id as any);
  }) as typeof clearTimeout;

  g.setInterval = ((handler: TimerHandler, timeout?: number, ...args: any[]) => {
    const id = originalSetInterval(handler as any, timeout as any, ...args) as unknown as number;
    if (typeof id === 'number') activeIntervals.add(id);
    return id as any;
  }) as typeof setInterval;

  g.clearInterval = ((id?: number) => {
    if (typeof id === 'number') activeIntervals.delete(id);
    return originalClearInterval(id as any);
  }) as typeof clearInterval;

  g.requestAnimationFrame = ((cb: FrameRequestCallback) => {
    const id = originalRequestAnimationFrame(cb) as unknown as number;
    if (typeof id === 'number') activeRafs.add(id);
    return id as any;
  }) as typeof requestAnimationFrame;

  g.cancelAnimationFrame = ((id?: number) => {
    if (typeof id === 'number') activeRafs.delete(id);
    return originalCancelAnimationFrame(id as any);
  }) as typeof cancelAnimationFrame;

  g.requestIdleCallback = ((cb: Function, opts?: { timeout?: number }) => {
    const id = requestIdleCallback(cb, opts);
    if (typeof id === 'number') activeIdles.add(id);
    return id;
  }) as any;

  g.cancelIdleCallback = ((id?: number) => {
    if (typeof id === 'number') activeIdles.delete(id);
    return cancelIdleCallback(id as any);
  }) as any;

  // After each test, clear any leftover timers to prevent accumulation
  afterEach(() => {
    // Desmonta árvores React e limpa DOM entre testes para evitar retenção
    try { cleanup(); } catch { }
    try { PerformanceOptimizer.cancelAllTimeouts(); } catch { }
    try { PerformanceOptimizer.cancelAllIntervals(); } catch { }
    for (const id of Array.from(activeTimeouts)) {
      originalClearTimeout(id as any);
      activeTimeouts.delete(id);
    }
    for (const id of Array.from(activeIntervals)) {
      originalClearInterval(id as any);
      activeIntervals.delete(id);
    }
    for (const id of Array.from(activeRafs)) {
      originalCancelAnimationFrame(id as any);
      activeRafs.delete(id);
    }
    for (const id of Array.from(activeIdles)) {
      cancelIdleCallback(id as any);
      activeIdles.delete(id);
    }
  });

  // As a final safeguard, also clear on suite teardown
  afterAll(() => {
    try { PerformanceOptimizer.cancelAllTimeouts(); } catch { }
    try { PerformanceOptimizer.cancelAllIntervals(); } catch { }
    for (const id of Array.from(activeTimeouts)) {
      originalClearTimeout(id as any);
      activeTimeouts.delete(id);
    }
    for (const id of Array.from(activeIntervals)) {
      originalClearInterval(id as any);
      activeIntervals.delete(id);
    }
    for (const id of Array.from(activeRafs)) {
      originalCancelAnimationFrame(id as any);
      activeRafs.delete(id);
    }
    for (const id of Array.from(activeIdles)) {
      cancelIdleCallback(id as any);
      activeIdles.delete(id);
    }
    // Forçar GC quando disponível para aliviar uso de heap em teardown
    try {
      if (typeof (globalThis as any).gc === 'function') {
        (globalThis as any).gc();
      }
    } catch { }
  });
})();

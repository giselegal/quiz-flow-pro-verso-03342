/**
 * ⚡ PERFORMANCE OPTIMIZATIONS - SPRINT 3
 * Utilities para otimização de performance
 */

import { lazy, ComponentType, LazyExoticComponent } from 'react';

// Lazy loading com retry
export function lazyWithRetry<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  retries = 3
): LazyExoticComponent<T> {
  return lazy(async () => {
    for (let i = 0; i < retries; i++) {
      try {
        return await importFn();
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
      }
    }
    throw new Error('Failed to load component');
  });
}

// Preload de componentes
export function preloadComponent<T extends ComponentType<any>>(
  lazyComponent: LazyExoticComponent<T>
): void {
  // @ts-ignore
  const preload = lazyComponent._ctor;
  if (typeof preload === 'function') preload();
}

// Debounce
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return function debouncedFn(...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

// Throttle
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function throttledFn(...args: Parameters<T>) {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Shallow comparison
export function shallowEqual(objA: any, objB: any): boolean {
  if (objA === objB) return true;
  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false;
  }
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) return false;
  for (let key of keysA) {
    if (objA[key] !== objB[key]) return false;
  }
  return true;
}

// Virtual scrolling
export function calculateVisibleRange(
  scrollTop: number,
  containerHeight: number,
  itemHeight: number,
  totalItems: number,
  overscan = 3
): { start: number; end: number } {
  const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const visibleItems = Math.ceil(containerHeight / itemHeight);
  const end = Math.min(totalItems, start + visibleItems + overscan * 2);
  return { start, end };
}

// Performance measurement
export async function measurePerformance<T>(
  name: string,
  fn: () => T | Promise<T>
): Promise<T> {
  const start = performance.now();
  try {
    const result = await fn();
    const end = performance.now();
    if (process.env.NODE_ENV === 'development') {
      console.log(`⏱️ ${name}: ${(end - start).toFixed(2)}ms`);
    }
    return result;
  } catch (error) {
    const end = performance.now();
    console.error(`❌ ${name} failed after ${(end - start).toFixed(2)}ms`, error);
    throw error;
  }
}

// Run when browser is idle
export function runWhenIdle(callback: () => void, timeout = 2000): void {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(callback, { timeout });
  } else {
    setTimeout(callback, timeout);
  }
}

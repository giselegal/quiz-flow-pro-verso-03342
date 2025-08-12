import { useCallback, useEffect, useRef } from 'react';

interface PerformanceMetrics {
  componentRenderTime: number;
  memoryUsage: number;
  bundleSize?: number;
}

export const usePerformanceOptimization = () => {
  const renderStartTime = useRef<number>();
  const observerRef = useRef<IntersectionObserver>();

  // Performance monitoring
  const startRenderTracking = useCallback(() => {
    renderStartTime.current = performance.now();
  }, []);

  const endRenderTracking = useCallback((componentName: string) => {
    if (renderStartTime.current) {
      const renderTime = performance.now() - renderStartTime.current;
      console.log(`[Performance] ${componentName} rendered in ${renderTime.toFixed(2)}ms`);
    }
  }, []);

  // Memory usage tracking
  const getMemoryUsage = useCallback((): PerformanceMetrics => {
    const memory = (performance as any).memory;
    return {
      componentRenderTime: 0,
      memoryUsage: memory ? memory.usedJSHeapSize / 1024 / 1024 : 0, // MB
    };
  }, []);

  // Intersection Observer for lazy loading
  const createIntersectionObserver = useCallback(
    (
      callback: (entries: IntersectionObserverEntry[]) => void,
      options?: IntersectionObserverInit
    ) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new IntersectionObserver(callback, {
        rootMargin: '50px',
        threshold: 0.1,
        ...options,
      });

      return observerRef.current;
    },
    []
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Debounced function creator for performance
  const createDebouncedCallback = useCallback(
    <T extends (...args: any[]) => void>(fn: T, delay: number): T => {
      let timeoutId: NodeJS.Timeout;

      return ((...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
      }) as T;
    },
    []
  );

  // Throttled function creator for performance
  const createThrottledCallback = useCallback(
    <T extends (...args: any[]) => void>(fn: T, delay: number): T => {
      let lastCall = 0;

      return ((...args: Parameters<T>) => {
        const now = Date.now();
        if (now - lastCall >= delay) {
          lastCall = now;
          fn(...args);
        }
      }) as T;
    },
    []
  );

  return {
    startRenderTracking,
    endRenderTracking,
    getMemoryUsage,
    createIntersectionObserver,
    createDebouncedCallback,
    createThrottledCallback,
  };
};

// Hook for component-level performance optimization
export const useComponentOptimization = (componentName: string) => {
  const { startRenderTracking, endRenderTracking } = usePerformanceOptimization();

  useEffect(() => {
    startRenderTracking();
    return () => endRenderTracking(componentName);
  });
};

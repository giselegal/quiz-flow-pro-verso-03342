// =====================================================================
// hooks/useDebounce.ts - Hook para debouncing de valores
// =====================================================================

import { useEffect, useState } from 'react';
import { PerformanceOptimizer } from '@/utils/performanceOptimizer';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // 🚀 OTIMIZAÇÃO: Usar PerformanceOptimizer
    const strategy = PerformanceOptimizer.getSuggestedStrategy(delay, true);
    const timerId = PerformanceOptimizer.schedule(
      () => {
        setDebouncedValue(value);
      },
      delay,
      strategy
    );

    return () => {
      if (strategy === 'timeout') {
        clearTimeout(timerId);
      }
    };
  }, [value, delay]);

  return debouncedValue;
}

// Hook para debouncing de callbacks
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const [timeoutId, setTimeoutId] = useState<number | null>(null);

  const debouncedCallback = ((...args: any[]) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // 🚀 OTIMIZAÇÃO: Usar PerformanceOptimizer
    const strategy = PerformanceOptimizer.getSuggestedStrategy(delay, true);
    const newTimeoutId = PerformanceOptimizer.schedule(
      () => {
        callback(...args);
        setTimeoutId(null);
      },
      delay,
      strategy
    );

    if (strategy === 'timeout') {
      setTimeoutId(newTimeoutId as number | null);
    }
  }) as T;

  return debouncedCallback;
}

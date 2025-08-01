// =====================================================================
// hooks/useDebounce.ts - Hook para debouncing de valores - OTIMIZADO
// =====================================================================

import { useState, useEffect, useRef } from 'react';

// Função utilitária para requestIdleCallback com fallback
const requestIdleCallbackPolyfill = (callback: () => void, timeout = 50) => {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    return window.requestIdleCallback(callback, { timeout });
  }
  // Fallback para setTimeout com delay menor
  return setTimeout(callback, Math.min(timeout, 16)) as any;
};

const cancelIdleCallbackPolyfill = (id: number) => {
  if (typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
    window.cancelIdleCallback(id);
  } else {
    clearTimeout(id);
  }
};

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const timeoutRef = useRef<number>();

  useEffect(() => {
    // Para delays curtos, use requestAnimationFrame
    if (delay < 50) {
      timeoutRef.current = requestAnimationFrame(() => {
        setDebouncedValue(value);
      });
    } else {
      // Para delays maiores, use requestIdleCallback
      timeoutRef.current = requestIdleCallbackPolyfill(() => {
        setDebouncedValue(value);
      }, delay);
    }

    return () => {
      if (timeoutRef.current) {
        if (delay < 50) {
          cancelAnimationFrame(timeoutRef.current);
        } else {
          cancelIdleCallbackPolyfill(timeoutRef.current);
        }
      }
    };
  }, [value, delay]);

  return debouncedValue;
}

// Hook para debouncing de callbacks - OTIMIZADO
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<number>();
  const callbackRef = useRef(callback);
  
  // Atualiza a referência do callback
  callbackRef.current = callback;

  const debouncedCallback = ((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      if (delay < 50) {
        cancelAnimationFrame(timeoutRef.current);
      } else {
        cancelIdleCallbackPolyfill(timeoutRef.current);
      }
    }

    if (delay < 50) {
      timeoutRef.current = requestAnimationFrame(() => {
        callbackRef.current(...args);
      });
    } else {
      timeoutRef.current = requestIdleCallbackPolyfill(() => {
        callbackRef.current(...args);
      }, delay);
    }
  }) as T;

  return debouncedCallback;
}

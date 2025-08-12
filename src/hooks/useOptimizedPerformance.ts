import { useCallback, useRef } from "react";

/**
 * Hook otimizado para debounce que evita violations de performance
 * Usa requestIdleCallback quando possível para operações não críticas
 */
export const useOptimizedDebounce = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  useIdleCallback = true
): T => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idleCallbackRef = useRef<number | null>(null);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      // Cancelar callbacks anteriores
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (idleCallbackRef.current) {
        cancelIdleCallback(idleCallbackRef.current);
        idleCallbackRef.current = null;
      }

      const execute = () => callback(...args);

      if (useIdleCallback && "requestIdleCallback" in window) {
        // Usar requestIdleCallback para operações não críticas
        idleCallbackRef.current = requestIdleCallback(execute, {
          timeout: delay + 1000, // Timeout de segurança
        });
      } else {
        // Fallback otimizado com setTimeout
        timeoutRef.current = setTimeout(execute, delay);
      }
    },
    [callback, delay, useIdleCallback]
  ) as T;

  return debouncedCallback;
};

/**
 * Hook para throttle otimizado usando requestAnimationFrame
 * Ideal para handlers de scroll, resize, etc.
 */
export const useOptimizedThrottle = <T extends (...args: any[]) => any>(
  callback: T,
  fps = 60
): T => {
  const rafRef = useRef<number | null>(null);
  const lastCallTime = useRef<number>(0);
  const frameTime = 1000 / fps;

  const throttledCallback = useCallback(
    (...args: Parameters<T>) => {
      const now = performance.now();

      if (rafRef.current) {
        return;
      }

      if (now - lastCallTime.current >= frameTime) {
        lastCallTime.current = now;
        callback(...args);
      } else {
        rafRef.current = requestAnimationFrame(() => {
          rafRef.current = null;
          lastCallTime.current = performance.now();
          callback(...args);
        });
      }
    },
    [callback, frameTime]
  ) as T;

  return throttledCallback;
};

/**
 * Hook para executar operações pesadas de forma otimizada
 * Quebra operações grandes em chunks menores
 */
export const useOptimizedHeavyOperation = () => {
  const executeInChunks = useCallback(
    async <T>(
      items: T[],
      processor: (item: T) => void,
      chunkSize = 50,
      delayBetweenChunks = 16 // ~1 frame
    ) => {
      for (let i = 0; i < items.length; i += chunkSize) {
        const chunk = items.slice(i, i + chunkSize);

        chunk.forEach(processor);

        // Yield para o browser entre chunks
        if (i + chunkSize < items.length) {
          await new Promise(resolve => {
            if ("requestIdleCallback" in window) {
              requestIdleCallback(() => resolve(undefined));
            } else {
              setTimeout(resolve, delayBetweenChunks);
            }
          });
        }
      }
    },
    []
  );

  return { executeInChunks };
};

export default {
  useOptimizedDebounce,
  useOptimizedThrottle,
  useOptimizedHeavyOperation,
};

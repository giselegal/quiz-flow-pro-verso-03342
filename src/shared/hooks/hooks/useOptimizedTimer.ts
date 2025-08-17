import { useCallback, useRef } from 'react';

/**
 * Hook otimizado para timers que evita violations de performance
 * Usa estratégias inteligentes baseadas no delay necessário
 */
export const useOptimizedTimer = () => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const idleCallbackRef = useRef<number | null>(null);

  // Função para escolher estratégia baseada no delay
  const scheduleOptimized = useCallback(
    (callback: () => void, delay: number = 0): (() => void) => {
      // Limpar timers anteriores
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      if (idleCallbackRef.current) {
        cancelIdleCallback(idleCallbackRef.current);
        idleCallbackRef.current = null;
      }

      // Escolher estratégia baseada no delay
      if (delay === 0 || delay < 16) {
        // Para operações imediatas: usar requestAnimationFrame
        animationFrameRef.current = requestAnimationFrame(callback);
        
        return () => {
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
          }
        };
      } else if (delay < 100) {
        // Para delays curtos: usar requestIdleCallback com timeout
        if ('requestIdleCallback' in window) {
          idleCallbackRef.current = (window as any).requestIdleCallback(callback, {
            timeout: delay + 50,
          });
          
          return () => {
            if (idleCallbackRef.current) {
              cancelIdleCallback(idleCallbackRef.current);
            }
          };
        }
      }

      // Fallback para setTimeout otimizado
      timeoutRef.current = setTimeout(callback, Math.max(delay, 16)); // Mínimo 16ms
      
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    },
    []
  );

  // Função para debounce otimizado
  const debouncedCallback = useCallback(
    <T extends (...args: any[]) => any>(fn: T, delay: number): T => {
      return ((...args: Parameters<T>) => {
        scheduleOptimized(() => fn(...args), delay);
      }) as T;
    },
    [scheduleOptimized]
  );

  // Cleanup automático
  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (idleCallbackRef.current) {
      cancelIdleCallback(idleCallbackRef.current);
      idleCallbackRef.current = null;
    }
  }, []);

  return {
    scheduleOptimized,
    debouncedCallback,
    cleanup,
  };
};

export default useOptimizedTimer;
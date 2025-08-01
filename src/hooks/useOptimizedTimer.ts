// =====================================================================
// hooks/useOptimizedTimer.ts - Hook otimizado para timers
// =====================================================================

import { useRef, useCallback, useEffect } from 'react';

/**
 * Hook otimizado para substituir setTimeout/setInterval pesados
 * Usa requestAnimationFrame para operações rápidas e requestIdleCallback para operações não críticas
 */
export function useOptimizedTimer() {
  const timersRef = useRef<Set<number>>(new Set());

  // Limpa todos os timers quando o componente é desmontado
  useEffect(() => {
    return () => {
      timersRef.current.forEach(id => {
        cancelAnimationFrame(id);
        if (typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
          window.cancelIdleCallback(id);
        } else {
          clearTimeout(id);
        }
      });
      timersRef.current.clear();
    };
  }, []);

  const setOptimizedTimeout = useCallback((callback: () => void, delay: number, priority: 'high' | 'low' = 'low') => {
    let id: number;

    if (priority === 'high' || delay < 16) {
      // Para operações críticas ou delays muito curtos, usa requestAnimationFrame
      id = requestAnimationFrame(() => {
        if (delay > 16) {
          // Se ainda há delay, usa setTimeout otimizado
          const timeoutId = setTimeout(callback, delay - 16) as any;
          timersRef.current.add(timeoutId);
          timersRef.current.delete(id);
        } else {
          callback();
          timersRef.current.delete(id);
        }
      });
    } else {
      // Para operações não críticas, usa requestIdleCallback com fallback
      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        id = window.requestIdleCallback(() => {
          callback();
          timersRef.current.delete(id);
        }, { timeout: delay });
      } else {
        // Fallback para setTimeout com chunk menor
        id = setTimeout(() => {
          callback();
          timersRef.current.delete(id);
        }, Math.min(delay, 50)) as any;
      }
    }

    timersRef.current.add(id);
    return id;
  }, []);

  const clearOptimizedTimeout = useCallback((id: number) => {
    if (timersRef.current.has(id)) {
      cancelAnimationFrame(id);
      if (typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(id);
      } else {
        clearTimeout(id);
      }
      timersRef.current.delete(id);
    }
  }, []);

  return { setOptimizedTimeout, clearOptimizedTimeout };
}

/**
 * Hook para operações em batch que reduz o número de execuções
 */
export function useBatchedUpdates<T>(
  callback: (items: T[]) => void,
  delay: number = 16
) {
  const batchRef = useRef<T[]>([]);
  const timeoutRef = useRef<number>();
  const { setOptimizedTimeout, clearOptimizedTimeout } = useOptimizedTimer();

  const addToBatch = useCallback((item: T) => {
    batchRef.current.push(item);

    if (timeoutRef.current) {
      clearOptimizedTimeout(timeoutRef.current);
    }

    timeoutRef.current = setOptimizedTimeout(() => {
      if (batchRef.current.length > 0) {
        callback([...batchRef.current]);
        batchRef.current = [];
      }
    }, delay, 'high');
  }, [callback, delay, setOptimizedTimeout, clearOptimizedTimeout]);

  const flush = useCallback(() => {
    if (timeoutRef.current) {
      clearOptimizedTimeout(timeoutRef.current);
    }
    if (batchRef.current.length > 0) {
      callback([...batchRef.current]);
      batchRef.current = [];
    }
  }, [callback, clearOptimizedTimeout]);

  return { addToBatch, flush };
}

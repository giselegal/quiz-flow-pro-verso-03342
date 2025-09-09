/**
 * 🎯 DEBOUNCE UTILITY - PHASE 2
 * 
 * Implementa debounce para cálculos durante navegação,
 * evitando cálculos em cascata e melhorando performance.
 */

export interface DebounceOptions {
  wait: number;
  leading?: boolean;
  trailing?: boolean;
  maxWait?: number;
}

/**
 * Cria uma função debounced que atrasa a execução até que
 * tenham passado `wait` milissegundos desde a última invocação.
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options: Partial<DebounceOptions> = {}
): T & { cancel: () => void; flush: () => ReturnType<T> | undefined } {
  const {
    leading = false,
    trailing = true,
    maxWait
  } = options;

  let timeoutId: number | undefined;
  let maxTimeoutId: number | undefined;
  let lastCallTime: number | undefined;
  let lastInvokeTime = 0;
  let result: ReturnType<T>;
  let lastArgs: Parameters<T>;
  let lastThis: any;

  function invokeFunc(time: number) {
    const args = lastArgs;
    const thisArg = lastThis;

    lastArgs = undefined as any;
    lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time: number) {
    lastInvokeTime = time;
    timeoutId = setTimeout(timerExpired, wait) as unknown as number;
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time: number) {
    const timeSinceLastCall = time - (lastCallTime || 0);
    const timeSinceLastInvoke = time - lastInvokeTime;
    const timeWaiting = wait - timeSinceLastCall;

    return maxWait !== undefined
      ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting;
  }

  function shouldInvoke(time: number) {
    const timeSinceLastCall = time - (lastCallTime || 0);
    const timeSinceLastInvoke = time - lastInvokeTime;

    return (
      lastCallTime === undefined ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      (maxWait !== undefined && timeSinceLastInvoke >= maxWait)
    );
  }

  function timerExpired() {
    const time = Date.now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    timeoutId = setTimeout(timerExpired, remainingWait(time)) as unknown as number;
  }

  function trailingEdge(time: number) {
    timeoutId = undefined;

    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = undefined as any;
    lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
    if (maxTimeoutId !== undefined) {
      clearTimeout(maxTimeoutId);
    }
    lastInvokeTime = 0;
    timeoutId = undefined;
    maxTimeoutId = undefined;
    lastCallTime = undefined;
    lastArgs = undefined as any;
    lastThis = undefined;
  }

  function flush() {
    return timeoutId === undefined ? result : trailingEdge(Date.now());
  }

  function debounced(this: any, ...args: Parameters<T>): ReturnType<T> {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timeoutId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxWait !== undefined) {
        timeoutId = setTimeout(timerExpired, wait) as unknown as number;
        return invokeFunc(lastCallTime);
      }
    }
    if (timeoutId === undefined) {
      timeoutId = setTimeout(timerExpired, wait) as unknown as number;
    }
    return result;
  }

  debounced.cancel = cancel;
  debounced.flush = flush;

  return debounced as any;
}

/**
 * Hook para criar função debounced que persiste entre renders
 */
export function useDebounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options?: Partial<DebounceOptions>,
  deps: React.DependencyList = []
): T & { cancel: () => void; flush: () => ReturnType<T> | undefined } {
  const funcRef = React.useRef(func);
  const debouncedRef = React.useRef<ReturnType<typeof debounce>>();

  // Atualizar função se deps mudaram
  React.useEffect(() => {
    funcRef.current = func;
  }, deps);

  // Criar função debounced uma vez
  React.useMemo(() => {
    if (debouncedRef.current) {
      debouncedRef.current.cancel();
    }
    
    debouncedRef.current = debounce(
      (...args: Parameters<T>) => funcRef.current(...args),
      wait,
      options
    );
  }, [wait, options?.leading, options?.trailing, options?.maxWait]);

  // Cleanup ao desmontar
  React.useEffect(() => {
    return () => {
      if (debouncedRef.current) {
        debouncedRef.current.cancel();
      }
    };
  }, []);

  return debouncedRef.current! as any;
}

// Import React para o hook
import * as React from 'react';
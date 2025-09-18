import { useCallback, useEffect, useRef } from 'react';

type TaskType = 'timeout' | 'raf' | 'idle';

type ScheduledTask = {
  key: string;
  type: TaskType;
  cancel: () => void;
};

export function useOptimizedScheduler() {
  const tasksRef = useRef<Map<string, ScheduledTask>>(new Map());
  const debouncedRef = useRef<Map<string, { timeout: any }>>(new Map());
  const throttledRef = useRef<Map<string, { last: number; timeout: any }>>(new Map());

  const cancel = useCallback((key: string) => {
    const task = tasksRef.current.get(key);
    if (!task) return;
    try {
      if (task.type === 'timeout') {
        clearTimeout((task as any).id);
      } else if (task.type === 'raf') {
        cancelAnimationFrame((task as any).id);
      } else if (task.type === 'idle' && 'cancelIdleCallback' in window) {
        (window as any).cancelIdleCallback?.((task as any).id);
      }
    } catch {}
    tasksRef.current.delete(key);
  }, []);

  const cancelAll = useCallback(() => {
    Array.from(tasksRef.current.keys()).forEach(cancel);
    // também limpa debounced/throttled pendentes
    debouncedRef.current.forEach(d => clearTimeout(d.timeout));
    debouncedRef.current.clear();
    throttledRef.current.forEach(t => clearTimeout(t.timeout));
    throttledRef.current.clear();
  }, [cancel]);

  const schedule = useCallback(
    (
      key: string,
      fn: () => void,
      delay = 0,
      type: TaskType = 'timeout'
    ) => {
      // cancela tarefa anterior com a mesma chave
      cancel(key);

      if (type === 'raf') {
        const id = requestAnimationFrame(() => {
          tasksRef.current.delete(key);
          fn();
        });
        tasksRef.current.set(key, { key, type, cancel: () => cancelAnimationFrame(id), id } as any);
        return () => cancel(key);
      }

      if (type === 'idle' && 'requestIdleCallback' in window) {
        const id = (window as any).requestIdleCallback(() => {
          tasksRef.current.delete(key);
          fn();
        }, { timeout: delay || 1000 });
        tasksRef.current.set(key, { key, type, cancel: () => (window as any).cancelIdleCallback(id), id } as any);
        return () => cancel(key);
      }

      const id = setTimeout(() => {
        tasksRef.current.delete(key);
        fn();
      }, Math.max(0, delay));
      tasksRef.current.set(key, { key, type: 'timeout', cancel: () => clearTimeout(id), id } as any);
      return () => cancel(key);
    },
    [cancel]
  );

  const debounce = useCallback(
    (key: string, fn: () => void, delay = 200) => {
      const prev = debouncedRef.current.get(key);
      if (prev) clearTimeout(prev.timeout);
      const timeout = setTimeout(() => {
        debouncedRef.current.delete(key);
        fn();
      }, Math.max(0, delay));
      debouncedRef.current.set(key, { timeout });
      return () => {
        const cur = debouncedRef.current.get(key);
        if (cur) clearTimeout(cur.timeout);
        debouncedRef.current.delete(key);
      };
    },
    []
  );

  const throttle = useCallback(
    (key: string, fn: () => void, interval = 200) => {
      const now = Date.now();
      const rec = throttledRef.current.get(key) || { last: 0, timeout: null as any };
      const remaining = interval - (now - rec.last);
      if (remaining <= 0) {
        rec.last = now;
        throttledRef.current.set(key, rec);
        fn();
        return () => {};
      }
      clearTimeout(rec.timeout);
      rec.timeout = setTimeout(() => {
        rec.last = Date.now();
        fn();
      }, remaining);
      throttledRef.current.set(key, rec);
      return () => clearTimeout(rec.timeout);
    },
    []
  );

  useEffect(() => cancelAll, [cancelAll]);

  return { schedule, debounce, throttle, cancel, cancelAll };
}

export default useOptimizedScheduler;

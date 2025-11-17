import { useRef, useState, useCallback, useEffect } from 'react';
import { generateHistoryId } from '@/lib/utils/idGenerator';

export type SaveStatus = 'idle' | 'queued' | 'saving' | 'saved' | 'error';

interface SaveRequest<T> {
  id: string;
  data: T;
  timestamp: number;
  retries: number;
}

interface UseSmartAutosaveOptions {
  debounceMs?: number;
  maxRetries?: number;
  retryDelayMs?: number;
  onError?: (error: Error) => void;
}

export function useSmartAutosave<T>(
  saveFn: (data: T) => Promise<void>,
  options: UseSmartAutosaveOptions = {},
) {
  const {
    debounceMs = 2000,
    maxRetries = 3,
    retryDelayMs = 1000,
    onError,
  } = options;

  const [status, setStatus] = useState<SaveStatus>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const lockRef = useRef(false);
  const queueRef = useRef<SaveRequest<T>[]>([]);
  const debounceTimerRef = useRef<NodeJS.Timeout>();

  const processSave = useCallback(async () => {
    if (lockRef.current) return;

    const request = queueRef.current.shift();
    if (!request) {
      setStatus('idle');
      return;
    }

    lockRef.current = true;
    setStatus('saving');
    setError(null);

    try {
      await saveFn(request.data);

      setStatus('saved');
      setLastSaved(new Date());

      queueRef.current = queueRef.current.filter(r => r.timestamp > request.timestamp);

      setTimeout(() => {
        if (queueRef.current.length === 0) {
          setStatus('idle');
        }
      }, 2000);
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      if (request.retries < maxRetries) {
        queueRef.current.unshift({
          ...request,
          retries: request.retries + 1,
        });

        const delay = retryDelayMs * Math.pow(2, request.retries);
        setTimeout(processSave, delay);
      } else {
        setStatus('error');
        setError(e);
        if (onError) onError(e);
      }
    } finally {
      lockRef.current = false;
    }

    if (queueRef.current.length > 0) {
      setTimeout(processSave, 100);
    }
  }, [saveFn, maxRetries, retryDelayMs, onError]);

  const enqueueSave = useCallback((data: T) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      queueRef.current.push({
        id: generateHistoryId(),
        data,
        timestamp: Date.now(),
        retries: 0,
      });

      setStatus('queued');
      processSave();
    }, debounceMs);
  }, [debounceMs, processSave]);

  const saveNow = useCallback(async (data: T) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    queueRef.current.push({
      id: generateHistoryId(),
      data,
      timestamp: Date.now(),
      retries: 0,
    });

    await processSave();
  }, [processSave]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    status,
    lastSaved,
    error,
    enqueueSave,
    saveNow,
    isProcessing: status === 'saving' || queueRef.current.length > 0,
    queueSize: queueRef.current.length,
  };
}

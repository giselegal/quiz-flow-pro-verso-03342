import { useCallback, useEffect, useRef } from 'react';
import { appLogger } from '@/lib/utils/appLogger';

interface UseAutoSaveOptions {
  data: any;
  onSave: (data: any) => Promise<void> | void;
  delay?: number;
  enabled?: boolean;
}

export const useAutoSave = ({ data, onSave, delay = 3000, enabled = true }: UseAutoSaveOptions) => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastDataRef = useRef(data);

  const save = useCallback(async () => {
    try {
      await onSave(data);
      lastDataRef.current = data;
    } catch (error) {
      appLogger.error('Auto-save error:', { data: [error] });
    }
  }, [data, onSave]);

  const debouncedSave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      save();
    }, delay);
  }, [save, delay]);

  useEffect(() => {
    if (!enabled) return;

    // Only save if data has actually changed
    if (JSON.stringify(data) !== JSON.stringify(lastDataRef.current)) {
      debouncedSave();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, enabled, debouncedSave]);

  return { save };
};

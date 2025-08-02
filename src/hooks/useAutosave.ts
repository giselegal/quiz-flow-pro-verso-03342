
import { useEffect, useRef, useState } from 'react';

interface UseAutosaveOptions {
  data: any;
  onSave: (data: any) => Promise<boolean>;
  interval?: number;
  enabled?: boolean;
}

interface UseAutosaveReturn {
  isSaving: boolean;
  lastSaved: Date | null;
  saveNow: () => Promise<void>;
}

export const useAutosave = ({
  data,
  onSave,
  interval = 5000,
  enabled = true
}: UseAutosaveOptions): UseAutosaveReturn => {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastDataRef = useRef(data);

  const saveNow = async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      const success = await onSave(data);
      if (success) {
        setLastSaved(new Date());
        lastDataRef.current = data;
      }
    } catch (error) {
      console.error('Autosave failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (!enabled) return;

    const hasChanged = JSON.stringify(data) !== JSON.stringify(lastDataRef.current);
    if (!hasChanged) return;

    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
    }

    intervalRef.current = setTimeout(saveNow, interval);

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, [data, enabled, interval]);

  return {
    isSaving,
    lastSaved,
    saveNow
  };
};

import { useState, useEffect, useCallback } from "react";

interface UseAutosaveOptions {
  data: any;
  onSave: (data: any) => Promise<boolean | void>;
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
  enabled = true,
}: UseAutosaveOptions): UseAutosaveReturn => {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const saveNow = useCallback(async () => {
    if (isSaving) return;

    setIsSaving(true);
    try {
      await onSave(data);
      setLastSaved(new Date());
    } catch (error) {
      console.error("Erro ao salvar:", error);
    } finally {
      setIsSaving(false);
    }
  }, [data, onSave, isSaving]);

  useEffect(() => {
    if (!enabled || !data) return;

    const timer = setInterval(saveNow, interval);
    return () => clearInterval(timer);
  }, [data, interval, enabled, saveNow]);

  return {
    isSaving,
    lastSaved,
    saveNow,
  };
};

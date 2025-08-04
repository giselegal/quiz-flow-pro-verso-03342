import { useCallback, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

interface UseAutoSaveWithDebounceOptions {
  data: any;
  onSave: (data: any) => Promise<void> | void;
  delay?: number;
  enabled?: boolean;
  showToasts?: boolean;
}

/**
 * ✅ HOOK DE AUTO-SAVE COM DEBOUNCE - Fase 1
 * Melhoria crítica para evitar salvamentos excessivos
 */
export const useAutoSaveWithDebounce = ({
  data,
  onSave,
  delay = 500, // 500ms debounce - mais responsivo
  enabled = true,
  showToasts = false,
}: UseAutoSaveWithDebounceOptions) => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastDataRef = useRef(data);
  const isSavingRef = useRef(false);
  const { toast } = useToast();

  const save = useCallback(async () => {
    if (isSavingRef.current) return; // Evitar múltiplos saves simultâneos

    try {
      isSavingRef.current = true;
      await onSave(data);
      lastDataRef.current = data;

      if (showToasts) {
        toast({
          title: "Salvamento automático",
          description: "Alterações salvas com sucesso",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Auto-save error:", error);

      if (showToasts) {
        toast({
          title: "Erro no salvamento",
          description: "Falha ao salvar alterações automaticamente",
          variant: "destructive",
        });
      }
    } finally {
      isSavingRef.current = false;
    }
  }, [data, onSave, showToasts, toast]);

  const debouncedSave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      save();
    }, delay);
  }, [save, delay]);

  // Força salvamento manual (bypassa debounce)
  const forceSave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    save();
  }, [save]);

  useEffect(() => {
    if (!enabled) return;

    // Só salvar se os dados realmente mudaram
    const currentDataString = JSON.stringify(data);
    const lastDataString = JSON.stringify(lastDataRef.current);

    if (currentDataString !== lastDataString) {
      debouncedSave();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, enabled, debouncedSave]);

  return {
    forceSave,
    isSaving: isSavingRef.current,
  };
};

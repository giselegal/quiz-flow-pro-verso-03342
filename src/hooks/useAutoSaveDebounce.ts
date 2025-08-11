import { PerformanceOptimizer } from "@/utils/performanceOptimizer";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Hook para debounce de auto-save com controle inteligente
 * Evita saves excessivos e melhora performance
 */
export const useAutoSaveDebounce = (
  saveFunction: () => Promise<void>,
  delay: number = 1000,
  maxInterval: number = 10000
) => {
  const [isActive, setIsActive] = useState(true);
  const [lastSave, setLastSave] = useState<Date | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const debounceRef = useRef<number | null>(null);
  const maxDelayRef = useRef<number | null>(null);
  const lastSaveRef = useRef<number>(0);
  const isActiveRef = useRef<boolean>(true);

  // Limpar timers ao desmontar
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (maxDelayRef.current) clearTimeout(maxDelayRef.current);
    };
  }, []);

  // Save com debounce inteligente
  const debouncedSave = useCallback(() => {
    if (!isActiveRef.current) return;

    // Limpar timeout anterior
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Configurar novo timeout de debounce - OTIMIZADO
    const strategy = PerformanceOptimizer.getSuggestedStrategy(delay, false);
    debounceRef.current = PerformanceOptimizer.schedule(async () => {
      const now = Date.now();

      // Evitar saves muito frequentes (mínimo 5 segundos entre saves)
      if (now - lastSaveRef.current < 5000) {
        console.log("[AutoSave] Save ignorado - muito recente");
        return;
      }

      try {
        setSaveStatus("saving");
        await saveFunction();
        lastSaveRef.current = now;
        setLastSave(new Date());
        setSaveStatus("success");
        console.log(`✅ Auto-save successful: ${new Date().toLocaleTimeString()}`);
      } catch (error) {
        setSaveStatus("error");
        console.error("❌ Auto-save failed:", error);

        // Se for erro de localStorage, tentar limpeza
        if (error instanceof DOMException && error.name === "QuotaExceededError") {
          console.warn("⚠️ LocalStorage quota exceeded, attempting cleanup...");
          try {
            // Limpar dados antigos do localStorage
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
              const key = localStorage.key(i);
              if (key && (key.startsWith("quiz-versions-") || key.startsWith("caktoquiz-"))) {
                keysToRemove.push(key);
              }
            }
            // Remover apenas versões antigas, manter as mais recentes
            keysToRemove.slice(0, -3).forEach(key => {
              try {
                localStorage.removeItem(key);
              } catch (e) {
                /* ignore */
              }
            });
            console.log("🧹 Cleaned up old localStorage data");
          } catch (cleanupError) {
            console.warn("Failed to cleanup localStorage:", cleanupError);
          }
        }
      }
    }, delay);

    // Garantir save máximo a cada maxDelay
    if (maxDelayRef.current) {
      clearTimeout(maxDelayRef.current);
    }

    maxDelayRef.current = PerformanceOptimizer.schedule(async () => {
      const now = Date.now();

      // Só fazer save forçado se passou tempo suficiente
      if (now - lastSaveRef.current >= maxInterval - 1000) {
        try {
          console.log("[AutoSave] Save forçado por tempo máximo");
          await saveFunction();
          lastSaveRef.current = now;
        } catch (error) {
          console.error("[AutoSave] Erro no save forçado:", error);
        }
      }
    }, maxInterval);
  }, [saveFunction, delay, maxInterval]);

  // Save imediato (para ações importantes)
  const saveNow = useCallback(async () => {
    if (!isActiveRef.current) return;

    // Limpar timeouts pendentes
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (maxDelayRef.current) clearTimeout(maxDelayRef.current);

    try {
      console.log("[AutoSave] Save imediato executado");
      await saveFunction();
      lastSaveRef.current = Date.now();
    } catch (error) {
      console.error("[AutoSave] Erro no save imediato:", error);
    }
  }, [saveFunction]);

  // Pausar/resumir auto-save
  const pauseAutoSave = useCallback(() => {
    isActiveRef.current = false;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (maxDelayRef.current) clearTimeout(maxDelayRef.current);
    console.log("[AutoSave] Auto-save pausado");
  }, []);

  const resumeAutoSave = useCallback(() => {
    isActiveRef.current = true;
    console.log("[AutoSave] Auto-save resumido");
  }, []);

  return {
    debouncedSave,
    saveNow,
    pauseAutoSave,
    resumeAutoSave,
    isActive: isActiveRef.current,
  };
};

export default useAutoSaveDebounce;

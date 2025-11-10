import { PerformanceOptimizer } from '@/lib/utils/performanceOptimizer';
import { useCallback, useEffect, useRef } from 'react';
import { appLogger } from '@/lib/utils/appLogger';

/**
 * Hook para debounce de auto-save com controle inteligente
 * Evita saves excessivos e melhora performance
 */
export const useAutoSaveDebounce = (
  saveFunction: () => Promise<void>,
  delay: number = 1000,
  maxInterval: number = 10000,
) => {
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
    if (debounceRef.current !== null) {
      clearTimeout(debounceRef.current);
    }

    // Configurar novo timeout de debounce - OTIMIZADO
    debounceRef.current = PerformanceOptimizer.schedule(async () => {
      const now = Date.now();

      // Evitar saves muito frequentes (mínimo 5 segundos entre saves)
      if (now - lastSaveRef.current < 5000) {
        appLogger.info('[AutoSave] Save ignorado - muito recente');
        return;
      }

      try {
        await saveFunction();
        lastSaveRef.current = now;
        appLogger.info(`✅ Auto-save successful: ${new Date().toLocaleTimeString()}`);
      } catch (error) {
        appLogger.error('❌ Auto-save failed:', { data: [error] });

        // Se for erro de localStorage, tentar limpeza
        if (error instanceof DOMException && error.name === 'QuotaExceededError') {
          appLogger.warn('⚠️ LocalStorage quota exceeded, attempting cleanup...');
          try {
            // Limpar dados antigos do localStorage
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
              const key = localStorage.key(i);
              if (key && (key.startsWith('quiz-versions-') || key.startsWith('caktoquiz-'))) {
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
            appLogger.info('🧹 Cleaned up old localStorage data');
          } catch (cleanupError) {
            appLogger.warn('Failed to cleanup localStorage:', { data: [cleanupError] });
          }
        }
      }
    }, delay) as number | null;

    // Garantir save máximo a cada maxDelay
    if (maxDelayRef.current !== null) {
      clearTimeout(maxDelayRef.current);
    }

    maxDelayRef.current = PerformanceOptimizer.schedule(async () => {
      const now = Date.now();

      // Só fazer save forçado se passou tempo suficiente
      if (now - lastSaveRef.current >= maxInterval - 1000) {
        try {
          appLogger.info('[AutoSave] Save forçado por tempo máximo');
          await saveFunction();
          lastSaveRef.current = now;
        } catch (error) {
          appLogger.error('[AutoSave] Erro no save forçado:', { data: [error] });
        }
      }
    }, maxInterval) as number | null;
  }, [saveFunction, delay, maxInterval]);

  // Save imediato (para ações importantes)
  const saveNow = useCallback(async () => {
    if (!isActiveRef.current) return;

    // Limpar timeouts pendentes
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (maxDelayRef.current) clearTimeout(maxDelayRef.current);

    try {
      appLogger.info('[AutoSave] Save imediato executado');
      await saveFunction();
      lastSaveRef.current = Date.now();
    } catch (error) {
      appLogger.error('[AutoSave] Erro no save imediato:', { data: [error] });
    }
  }, [saveFunction]);

  // Pausar/resumir auto-save
  const pauseAutoSave = useCallback(() => {
    isActiveRef.current = false;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (maxDelayRef.current) clearTimeout(maxDelayRef.current);
    appLogger.info('[AutoSave] Auto-save pausado');
  }, []);

  const resumeAutoSave = useCallback(() => {
    isActiveRef.current = true;
    appLogger.info('[AutoSave] Auto-save resumido');
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

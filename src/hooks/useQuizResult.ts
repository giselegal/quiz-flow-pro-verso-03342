// hooks/useQuizResult.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { StyleResult } from '@/types/quiz';
import { StorageService } from '@/services/core/StorageService';
import { calculateAndSaveQuizResult } from '@/utils/quizResultCalculator';
import EVENTS from '@/core/constants/events';

export const useQuizResult = () => {
  // 🔒 Guarda global simples para evitar cálculos concorrentes entre múltiplas instâncias do hook
  // e compartilhar o último resultado/erro rapidamente.
  // Em ambientes browser com hot-reload, este módulo persiste entre renders.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globalState = (globalThis as any).__quizResultGlobal || ((globalThis as any).__quizResultGlobal = {
    inflight: null as Promise<any> | null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    lastOkResult: null as any,
    lastError: null as string | null,
    lastUpdatedAt: 0 as number,
  });

  const [primaryStyle, setPrimaryStyle] = useState<StyleResult | null>(null);
  const [secondaryStyles, setSecondaryStyles] = useState<StyleResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  // Rastreia timers para evitar vazamentos entre testes e permitir cleanup
  const timersRef = useRef<Set<number>>(new Set());

  const loadFromStorage = useCallback(async () => {
    // ✅ CORREÇÃO CRÍTICA: Evitar loading infinito com timeout e retry
    setIsLoading(true);
    setError(null);

    try {
      // Verificar múltiplas fontes de dados
      const legacyResult = StorageService.safeGetJSON<any>('quizResult');

      let unifiedResult = null;
      try {
        const { unifiedQuizStorage } = await import('@/services/core/UnifiedQuizStorage');
        unifiedResult = unifiedQuizStorage.loadData().result;
      } catch { /* ignore */ }

      // Usar resultado existente se disponível
      if (legacyResult || unifiedResult) {
        const result = legacyResult || unifiedResult;
        setPrimaryStyle(result.primaryStyle ?? null);
        setSecondaryStyles(result.secondaryStyles || []);
        console.log('✅ Resultado carregado do storage:', result.primaryStyle?.style);
        return;
      }

      // ✅ Só calcular se não há resultado E há dados suficientes
      console.log('⚠️ Nenhum resultado encontrado, verificando dados...');

      // Verificar se há dados suficientes para calcular
      let hasEnoughData = false;
      let isResultStep = false;

      try {
        const { unifiedQuizStorage } = await import('@/services/core/UnifiedQuizStorage');
        const unifiedData = unifiedQuizStorage.loadData();
        isResultStep = unifiedData.metadata?.currentStep === 20;
        hasEnoughData = unifiedQuizStorage.hasEnoughDataForResult();
      } catch {
        // Fallback: verificar dados legados
        const userSelections = StorageService.safeGetJSON<Record<string, string[]>>('userSelections') || {};
        hasEnoughData = Object.keys(userSelections).length >= 3;
      }

      // Na etapa 20, sempre tentar calcular resultado
      if (!hasEnoughData && !isResultStep) {
        console.warn('⚠️ Dados insuficientes para calcular resultado');
        setError('Dados insuficientes para calcular resultado');
        return;
      }

      if (isResultStep) {
        console.log('🎯 Etapa 20: forçando cálculo de resultado mesmo com dados insuficientes');
      }

      // ✅ Calcular com timeout (10s) e guarda global anti-concorrência
      console.log('🔄 Iniciando cálculo com timeout e guarda global...');

      const runWithTimeout = async <T>(p: Promise<T>, ms: number): Promise<T> => {
        let timeoutId: number | undefined;
        const timeoutPromise = new Promise<never>((_, reject) => {
          timeoutId = setTimeout(() => reject(new Error('Timeout: cálculo demorou mais de 10 segundos')), ms) as unknown as number;
          timersRef.current.add(timeoutId!);
        });
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const out = (await Promise.race([p, timeoutPromise])) as any;
          return out as T;
        } finally {
          if (timeoutId !== undefined) {
            clearTimeout(timeoutId as unknown as number);
            timersRef.current.delete(timeoutId as unknown as number);
          }
        }
      };

      // Reutilizar cálculo em andamento, se houver
      if (!globalState.inflight) {
        globalState.inflight = (async () => {
          const r = await calculateAndSaveQuizResult();
          return r;
        })();
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.info('⏳ Cálculo de resultado já em andamento — aguardando o mesmo promise');
        }
      }

      // Tipar explicitamente para evitar inferência como {}
      const result = await runWithTimeout<any>(globalState.inflight!, 10000) as any;

      // Marcar que terminou a promise atual (libera novas execuções)
      globalState.inflight = null;

      if (result) {
        setPrimaryStyle(result.primaryStyle ?? null);
        setSecondaryStyles(result.secondaryStyles || []);
        setRetryCount(0); // Reset retry count on success

        // Atualizar cache global
        globalState.lastOkResult = result;
        globalState.lastError = null;
        globalState.lastUpdatedAt = Date.now();

        // Emitir eventos para outros consumidores
        window.dispatchEvent(new Event('quiz-result-updated'));
        console.log('✅ Resultado calculado e definido:', result.primaryStyle?.style);
      } else {
        throw new Error('Cálculo retornou resultado vazio');
      }

    } catch (error: any) {
      console.error('❌ Erro ao carregar/calcular resultado:', error);
      setError(error.message || 'Erro desconhecido');

      // Atualizar cache global de erro
      globalState.lastError = error?.message || 'Erro desconhecido';
      globalState.lastUpdatedAt = Date.now();
      // Liberar inflight se a falha foi desta promise
      globalState.inflight = null;

      // ✅ Retry automático até 3 vezes com delay crescente (com cleanup)
      if (retryCount < 3) {
        const delay = (retryCount + 1) * 2000; // 2s, 4s, 6s
        console.log(`🔄 Tentativa ${retryCount + 1}/3 em ${delay}ms...`);
        const id = setTimeout(() => {
          setRetryCount(prev => prev + 1);
          loadFromStorage();
        }, delay) as unknown as number;
        timersRef.current.add(id);
      } else {
        console.error('❌ Esgotadas tentativas de retry');
      }
    } finally {
      setIsLoading(false);
    }
  }, [retryCount]);

  useEffect(() => {
    // Se houver resultado recente no cache global, usar imediatamente para evitar flicker
    if (globalState.lastOkResult) {
      try {
        setPrimaryStyle(globalState.lastOkResult.primaryStyle ?? null);
        setSecondaryStyles(globalState.lastOkResult.secondaryStyles || []);
      } catch { /* ignore */ }
    }

    loadFromStorage();
    const handler = () => loadFromStorage();

    // Reage a mudanças do localStorage (em outras abas) e a eventos customizados internos
    window.addEventListener('storage', handler);
    window.addEventListener(EVENTS.QUIZ_RESULT_UPDATED, handler as EventListener);
    window.addEventListener('quiz-result-refresh', handler as EventListener);
    window.addEventListener('unified-quiz-data-updated', handler as EventListener);

    // Adicionar listener para respostas atualizadas
    const answerHandler = () => {
      // ✅ CORREÇÃO CRÍTICA: quizAnswers é um objeto, não array
      const answers = StorageService.safeGetJSON<Record<string, any>>('quizAnswers') || {};
      const answerKeys = Object.keys(answers);

      // Se tiver dados suficientes (userName + algumas respostas), recalcular
      if (answerKeys.length >= 3 || answers.userName) {
        console.log('🔄 Recalculando resultado devido a novas respostas');
        calculateAndSaveQuizResult();
      }
    };

    window.addEventListener(EVENTS.QUIZ_ANSWER_UPDATED, answerHandler);

    return () => {
      window.removeEventListener('storage', handler);
      window.removeEventListener(EVENTS.QUIZ_RESULT_UPDATED, handler as EventListener);
      window.removeEventListener('quiz-result-refresh', handler as EventListener);
      window.removeEventListener('unified-quiz-data-updated', handler as EventListener);
      window.removeEventListener(EVENTS.QUIZ_ANSWER_UPDATED, answerHandler);

      // Limpar qualquer timer pendente
      try {
        timersRef.current.forEach(id => clearTimeout(id as unknown as number));
        timersRef.current.clear();
      } catch { /* ignore */ }
    };
  }, [loadFromStorage]);

  // ✅ Função manual de retry para componentes
  const retry = useCallback(() => {
    setRetryCount(0);
    setError(null);
    loadFromStorage();
  }, [loadFromStorage]);

  return {
    primaryStyle,
    secondaryStyles,
    isLoading,
    error,
    retry,
    hasResult: Boolean(primaryStyle),
  };
};
// hooks/useQuizResult.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { StyleResult } from '@/types/quiz';
import { StorageService } from '@/services/core/StorageService';
import { calculateAndSaveQuizResult } from '@/utils/quizResultCalculator';
import EVENTS from '@/core/constants/events';

export const useQuizResult = () => {
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
      try {
        const { unifiedQuizStorage } = await import('@/services/core/UnifiedQuizStorage');
        hasEnoughData = unifiedQuizStorage.hasEnoughDataForResult();
      } catch {
        // Fallback: verificar dados legados
        const userSelections = StorageService.safeGetJSON<Record<string, string[]>>('userSelections') || {};
        hasEnoughData = Object.keys(userSelections).length >= 3;
      }

      if (!hasEnoughData) {
        console.warn('⚠️ Dados insuficientes para calcular resultado');
        setError('Dados insuficientes para calcular resultado');
        return;
      }

      // ✅ Calcular com timeout de 10 segundos (com cleanup do timer)
      console.log('🔄 Iniciando cálculo com timeout...');
      let timeoutId: number | undefined;
      const timeoutPromise = new Promise((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error('Timeout: cálculo demorou mais de 10 segundos')), 10000) as unknown as number;
        timersRef.current.add(timeoutId!);
      });

      const calculationPromise = calculateAndSaveQuizResult();

      const result = await Promise.race([calculationPromise, timeoutPromise]) as any;

      // Cancelar timeout se cálculo venceu a corrida
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId as unknown as number);
        timersRef.current.delete(timeoutId as unknown as number);
      }

      if (result) {
        setPrimaryStyle(result.primaryStyle ?? null);
        setSecondaryStyles(result.secondaryStyles || []);
        setRetryCount(0); // Reset retry count on success

        // Emitir eventos para outros consumidores
        window.dispatchEvent(new Event('quiz-result-updated'));
        console.log('✅ Resultado calculado e definido:', result.primaryStyle?.style);
      } else {
        throw new Error('Cálculo retornou resultado vazio');
      }

    } catch (error: any) {
      console.error('❌ Erro ao carregar/calcular resultado:', error);
      setError(error.message || 'Erro desconhecido');

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
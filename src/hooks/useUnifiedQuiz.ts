/**
 * 🎯 USE UNIFIED QUIZ - Hook simplificado
 * 
 * Hook de conveniência para usar o sistema unificado nos componentes
 */

import { useEffect, useState } from 'react';
import { UnifiedQuizStep } from '@/adapters/UnifiedQuizStepAdapter';
import { unifiedQuizBridge, UnifiedFunnelData } from '@/services/UnifiedQuizBridge';

export function useUnifiedQuiz(stepId?: string) {
  const [step, setStep] = useState<UnifiedQuizStep | null>(null);
  const [funnel, setFunnel] = useState<UnifiedFunnelData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setIsLoading(true);
        setError(null);

        if (stepId) {
          // Carregar step individual
          const loadedStep = await unifiedQuizBridge.loadStep(stepId);
          setStep(loadedStep);
        } else {
          // Carregar funil completo
          const loadedFunnel = await unifiedQuizBridge.loadProductionFunnel();
          setFunnel(loadedFunnel);
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [stepId]);

  return {
    step,
    funnel,
    isLoading,
    error,
    reload: () => {
      unifiedQuizBridge.clearCache();
      setIsLoading(true);
    }
  };
}

/**
 * Hook para carregar múltiplos steps
 */
export function useUnifiedQuizSteps(stepIds: string[]) {
  const [steps, setSteps] = useState<Record<string, UnifiedQuizStep>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setIsLoading(true);
        setError(null);

        const loadedSteps: Record<string, UnifiedQuizStep> = {};

        for (const stepId of stepIds) {
          const step = await unifiedQuizBridge.loadStep(stepId);
          if (step) {
            loadedSteps[stepId] = step;
          }
        }

        setSteps(loadedSteps);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [stepIds.join(',')]);

  return { steps, isLoading, error };
}

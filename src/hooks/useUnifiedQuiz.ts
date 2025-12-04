/**
 * 🎯 USE UNIFIED QUIZ - Hook simplificado
 * 
 * Hook de conveniência para usar o sistema unificado nos componentes
 */

import { useEffect, useState } from 'react';
import { UnifiedQuizStep, UnifiedQuizStepAdapter } from '@/lib/adapters/UnifiedQuizStepAdapter';
import { templateService } from '@/services';

export function useUnifiedQuiz(stepId?: string) {
  const [step, setStep] = useState<UnifiedQuizStep | null>(null);
  const [funnel, setFunnel] = useState<Record<string, any> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setIsLoading(true);
        setError(null);

        if (stepId) {
          const result = await templateService.getStep(stepId);
          if (result.success) {
            const unified = UnifiedQuizStepAdapter.fromBlocks(result.data as any, stepId);
            setStep(unified);
          } else {
            throw result.error;
          }
        } else {
          // Fallback simples: carrega apenas o step-01 como "funil" mínimo
          const result = await templateService.getStep('step-01');
          if (result.success) {
            const unified = UnifiedQuizStepAdapter.fromBlocks(result.data as any, 'step-01');
            setFunnel({ 'step-01': unified });
          } else {
            setFunnel(null);
          }
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
      templateService.clearCache();
      setIsLoading(true);
    },
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
          const result = await templateService.getStep(stepId);
          if (result.success) {
            loadedSteps[stepId] = UnifiedQuizStepAdapter.fromBlocks(result.data as any, stepId);
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

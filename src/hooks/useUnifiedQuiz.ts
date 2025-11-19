/**
 * 🎯 USE UNIFIED QUIZ - Hook simplificado
 * 
 * Hook de conveniência para usar o sistema unificado nos componentes
 */

import { useEffect, useState } from 'react';
import { UnifiedQuizStep } from '@/lib/adapters/UnifiedQuizStepAdapter';
import { templateService } from '@/services/canonical/TemplateService';

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
            setStep({ id: stepId, blocks: result.data } as UnifiedQuizStep);
          } else {
            throw result.error;
          }
        } else {
          const steps = await templateService.getAllSteps();
          setFunnel(steps);
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

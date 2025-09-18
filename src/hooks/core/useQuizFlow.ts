import { useState, useCallback } from 'react';
import { QuizDataService } from '@/services/core/QuizDataService';

export interface QuizFlowState {
  currentStep: number;
  totalSteps: number;
  responses: Record<string, any>;
  isComplete: boolean;
}

export const useQuizFlow = () => {
  const [state, setState] = useState<QuizFlowState>({
    currentStep: 1,
    totalSteps: 21,
    responses: {},
    isComplete: false
  });

  const [loading, setLoading] = useState(false);

  const nextStep = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, prev.totalSteps)
    }));
  }, []);

  const previousStep = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 1)
    }));
  }, []);

  const goToStep = useCallback((step: number) => {
    setState(prev => ({
      ...prev,
      currentStep: Math.max(1, Math.min(step, prev.totalSteps))
    }));
  }, []);

  const saveResponse = useCallback(async (stepId: string, response: any) => {
    setLoading(true);
    try {
      await QuizDataService.saveResponse(stepId, response);
      setState(prev => ({
        ...prev,
        responses: { ...prev.responses, [stepId]: response }
      }));
    } catch (error) {
      console.error('Error saving response:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const completeQuiz = useCallback(() => {
    setState(prev => ({ ...prev, isComplete: true }));
  }, []);

  return {
    ...state,
    loading,
    nextStep,
    previousStep,
    goToStep,
    saveResponse,
    completeQuiz,
    quizState: {
      ...state,
      progress: (state.currentStep / state.totalSteps) * 100,
      isLoading: loading,
      stepValidation: {}
    },
    actions: {
      nextStep,
      previousStep: previousStep,
      prevStep: previousStep,
      goToStep,
      saveResponse,
      completeQuiz,
      getStepData: (stepId: string) => state.responses[stepId],
      setStepValid: (stepId: string, isValid: boolean) => {
        console.log(`Step ${stepId} validation:`, isValid);
      },
      preloadTemplates: () => Promise.resolve()
    }
  };
};
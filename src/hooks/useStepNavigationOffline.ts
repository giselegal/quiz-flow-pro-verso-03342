import { useQuizFlow } from '@/context/QuizFlowProvider';
import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'wouter';

/**
 * Hook simplificado para navegação offline (sem Supabase)
 */

export interface StepNavigationState {
  currentStep: number;
  sessionId: string | null;
  isLoading: boolean;
  canGoNext: boolean;
  canGoPrevious: boolean;
  progress: number;
  totalSteps: number;
}

export const useStepNavigationOffline = (initialStep: number = 1) => {
  const [, setLocation] = useLocation();
  const { currentStep, totalSteps, next, previous, goTo, canProceed } = useQuizFlow();
  const [state, setState] = useState<StepNavigationState>({
    currentStep: initialStep,
    sessionId: `offline-${Date.now()}`,
    isLoading: false,
    canGoNext: true,
    canGoPrevious: initialStep > 1,
    progress: (initialStep / 21) * 100,
    totalSteps: 21,
  });

  // Mock da sessão offline
  const session = {
    id: state.sessionId,
    responses: {},
    current_step: state.currentStep,
  };

  // Navegar para etapa específica
  const goToStep = useCallback(
    async (stepNumber: number) => {
      if (stepNumber < 1 || stepNumber > 21) {
        console.warn(`Etapa ${stepNumber} é inválida`);
        return;
      }

      goTo(stepNumber);
      setLocation(`/step/${stepNumber}`);
      console.log(`🚀 Navegação offline para etapa ${stepNumber}`);
    },
    [setLocation, goTo]
  );

  // Próxima etapa
  const goNext = useCallback(async () => {
    if (currentStep >= (totalSteps || 21)) return;
    next();
  }, [currentStep, totalSteps, next]);

  // Etapa anterior
  const goPrevious = useCallback(async () => {
    if (currentStep <= 1) return;
    previous();
  }, [currentStep, previous]);

  // Salvar resposta (mock)
  const saveResponse = useCallback(async (questionId: string, response: any) => {
    console.log(`💾 Resposta offline salva para ${questionId}:`, response);
    // Mock - não salva no banco
  }, []);

  // Completar quiz (mock)
  const completeQuiz = useCallback(async () => {
    console.log('🎉 Quiz offline finalizado!');
    setLocation('/quiz/resultado-offline');
  }, [setLocation]);

  // Sync estado derivado do provider
  useEffect(() => {
    setState(prev => ({
      ...prev,
      currentStep,
      totalSteps: totalSteps || 21,
      canGoNext:
        (canProceed && currentStep < (totalSteps || 21)) || currentStep < (totalSteps || 21),
      canGoPrevious: currentStep > 1,
      progress: (currentStep / (totalSteps || 21)) * 100,
    }));
  }, [currentStep, totalSteps, canProceed]);

  return {
    // Estado
    ...state,
    session,

    // Navegação
    goToStep,
    goNext,
    goPrevious,

    // Dados (mocks)
    getCurrentStepData: () => null,
    getStepData: () => null,

    // Respostas
    saveResponse,

    // Finalização
    completeQuiz,

    // Utilitários
    isLastStep: currentStep === (totalSteps || 21),
    isFirstStep: currentStep === 1,
    getProgressText: () => `${currentStep} de ${totalSteps || state.totalSteps}`,
  };
};

export default useStepNavigationOffline;

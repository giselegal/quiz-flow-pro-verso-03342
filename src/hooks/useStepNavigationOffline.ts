import { useCallback, useState } from 'react';
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

      setState(prev => ({
        ...prev,
        currentStep: stepNumber,
        canGoNext: stepNumber < 21,
        canGoPrevious: stepNumber > 1,
        progress: (stepNumber / 21) * 100,
      }));

      setLocation(`/step/${stepNumber}`);
      console.log(`🚀 Navegação offline para etapa ${stepNumber}`);
    },
    [setLocation]
  );

  // Próxima etapa
  const goNext = useCallback(async () => {
    if (state.currentStep >= 21) return;
    await goToStep(state.currentStep + 1);
  }, [state.currentStep, goToStep]);

  // Etapa anterior
  const goPrevious = useCallback(async () => {
    if (state.currentStep <= 1) return;
    await goToStep(state.currentStep - 1);
  }, [state.currentStep, goToStep]);

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
    isLastStep: state.currentStep === 21,
    isFirstStep: state.currentStep === 1,
    getProgressText: () => `${state.currentStep} de ${state.totalSteps}`,
  };
};

export default useStepNavigationOffline;

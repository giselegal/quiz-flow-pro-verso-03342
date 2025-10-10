import { useQuizFlow } from '@/context/QuizFlowProvider';
import React, { createContext, useCallback, useContext, useState } from 'react';

interface PreviewContextType {
  isPreviewing: boolean;
  currentStep: number;
  totalSteps: number;
  canGoNext: boolean;
  canGoPrevious: boolean;
  sessionData: Record<string, any>;

  // Ações
  togglePreview: () => void;
  startPreview: () => void;
  stopPreview: () => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  setCurrentStep: (step: number) => void;
  navigateToStep: (stepId: string) => void; // New function
  updateSessionData: (key: string, value: any) => void;
  resetSession: () => void;
}

const PreviewContext = createContext<PreviewContextType | undefined>(undefined);

const usePreview = () => {
  const context = useContext(PreviewContext);
  if (!context) {
    console.warn('usePreview called outside PreviewProvider, returning fallback');
    // Return fallback values instead of throwing
    return {
      isPreviewing: false,
      currentStep: 1,
      totalSteps: 21,
      canGoNext: true,
      canGoPrevious: false,
      sessionData: {},
      togglePreview: () => {},
      startPreview: () => {},
      stopPreview: () => {},
      goToNextStep: () => {},
      goToPreviousStep: () => {},
      setCurrentStep: () => {},
      navigateToStep: () => {},
      updateSessionData: () => {},
      resetSession: () => {},
    };
  }
  return context;
};

interface PreviewProviderProps {
  children: React.ReactNode;
  totalSteps?: number;
  funnelId?: string;
}

const PreviewProvider: React.FC<PreviewProviderProps> = ({
  children,
  totalSteps = 21,
  funnelId,
}) => {
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [sessionData, setSessionData] = useState<Record<string, any>>({});
  const { currentStep, totalSteps: flowTotal, next, previous, goTo, canProceed } = useQuizFlow();
  const effectiveTotal = flowTotal || totalSteps;

  // Calcular se pode navegar
  // Respeita validação da etapa atual via QuizFlowProvider (event-driven)
  const canGoNext = currentStep < effectiveTotal && !!canProceed;
  const canGoPrevious = currentStep > 1;

  const togglePreview = useCallback(() => {
    setIsPreviewing(prev => {
      const newValue = !prev;
      if (newValue) {
        // Iniciando preview - resetar sessão
        setSessionData({});
        console.log('🚀 Preview Mode: ATIVADO');
      } else {
        console.log('🚀 Preview Mode: DESATIVADO');
      }
      return newValue;
    });
  }, []);

  const startPreview = useCallback(() => {
    setIsPreviewing(true);
    setSessionData({});
    console.log('🚀 Preview Mode: INICIADO');
  }, []);

  const stopPreview = useCallback(() => {
    setIsPreviewing(false);
    console.log('🚀 Preview Mode: PARADO');
  }, []);

  const goToNextStep = useCallback(() => {
    if (canGoNext) {
      next();
      if (isPreviewing && funnelId) {
        const newStep = currentStep + 1;
        const newUrl = `/dashboard/funnel/${funnelId}/step/${newStep}`;
        console.log('🚀 Preview: Navegando para etapa', newStep, '-', newUrl);
      }
    }
  }, [currentStep, canGoNext, next, isPreviewing, funnelId]);

  const goToPreviousStep = useCallback(() => {
    if (canGoPrevious) {
      previous();
      if (isPreviewing && funnelId) {
        const prev = currentStep - 1;
        const newUrl = `/dashboard/funnel/${funnelId}/step/${prev}`;
        console.log('🚀 Preview: Navegando para etapa', prev, '-', newUrl);
      }
    }
  }, [currentStep, canGoPrevious, previous, isPreviewing, funnelId]);

  const navigateToStep = useCallback(
    (stepId: string) => {
      let stepNumber: number | null = null;
      if (typeof stepId === 'string') {
        const digits = parseInt(stepId.replace(/\D/g, ''), 10);
        if (!isNaN(digits)) stepNumber = digits;
      }
      if (stepNumber && stepNumber >= 1 && stepNumber <= effectiveTotal) {
        goTo(stepNumber);
        console.log('🚀 Preview: Navegou diretamente para etapa', stepNumber, 'via ID:', stepId);
      } else {
        console.warn('🚨 Preview: Número/ID de etapa inválido:', stepId);
      }
    },
    [effectiveTotal, goTo]
  );

  const setCurrentStep = useCallback(
    (step: number) => {
      if (step >= 1 && step <= effectiveTotal) {
        goTo(step);
        console.log('🚀 Preview: Definiu etapa atual para', step);
      }
    },
    [effectiveTotal, goTo]
  );

  const updateSessionData = useCallback((key: string, value: any) => {
    setSessionData(prev => ({
      ...prev,
      [key]: value,
    }));
    console.log('🚀 Preview: Dados da sessão atualizados:', { key, value });
  }, []);

  const resetSession = useCallback(() => {
    setSessionData({});
    goTo(1);
    console.log('🚀 Preview: Sessão resetada');
  }, [goTo]);

  const contextValue: PreviewContextType = {
    isPreviewing,
    currentStep,
    totalSteps: effectiveTotal,
    canGoNext,
    canGoPrevious,
    sessionData,

    togglePreview,
    startPreview,
    stopPreview,
    goToNextStep,
    goToPreviousStep,
    setCurrentStep,
    navigateToStep,
    updateSessionData,
    resetSession,
  };

  // Listen to navigation events from components in preview mode
  React.useEffect(() => {
    // Expor etapa atual globalmente para consumidores que dependem de window.__quizCurrentStep
    try {
      (window as any).__quizCurrentStep = currentStep;
      (window as any).__quizTotalSteps = effectiveTotal;
    } catch {}

    const handleNavigateToStep = (event: CustomEvent) => {
      if (!isPreviewing) return;
      if (event.detail?.stepId) navigateToStep(event.detail.stepId);
      else if (typeof event.detail?.step === 'number') goTo(event.detail.step);
    };

    const handleQuizStart = (event: CustomEvent) => {
      if (isPreviewing) {
        console.log('🚀 Preview: Quiz started with user data:', event.detail);
        updateSessionData('userName', event.detail?.userName || 'Anonymous');
        updateSessionData('startTime', event.detail?.timestamp || Date.now());
      }
    };

    // Listen for navigation events (legacy and new)
    window.addEventListener('navigate-to-step', handleNavigateToStep as EventListener);
    window.addEventListener('quiz-navigate-to-step', handleNavigateToStep as EventListener);
    window.addEventListener('quiz-start', handleQuizStart as EventListener);

    return () => {
      window.removeEventListener('navigate-to-step', handleNavigateToStep as EventListener);
      window.removeEventListener('quiz-navigate-to-step', handleNavigateToStep as EventListener);
      window.removeEventListener('quiz-start', handleQuizStart as EventListener);
    };
  }, [isPreviewing, navigateToStep, updateSessionData, goTo, currentStep, effectiveTotal]);

  return <PreviewContext.Provider value={contextValue}>{children}</PreviewContext.Provider>;
};

export { PreviewContext, PreviewProvider, usePreview };
export default PreviewProvider;

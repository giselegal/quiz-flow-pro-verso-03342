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
  const [currentStep, setCurrentStepState] = useState(1);
  const [sessionData, setSessionData] = useState<Record<string, any>>({});

  // Calcular se pode navegar
  const canGoNext = currentStep < totalSteps;
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
      const nextStep = currentStep + 1;
      setCurrentStepState(nextStep);

      // Se estiver em preview, simular navegação real
      if (isPreviewing && funnelId) {
        // Simular a navegação sem recarregar a página
        const newUrl = `/dashboard/funnel/${funnelId}/step/${nextStep}`;
        console.log('🚀 Preview: Navegando para etapa', nextStep, '-', newUrl);
      }

      console.log('🚀 Preview: Avançou para etapa', nextStep);
    }
  }, [currentStep, canGoNext, isPreviewing, funnelId]);

  const goToPreviousStep = useCallback(() => {
    if (canGoPrevious) {
      const previousStep = currentStep - 1;
      setCurrentStepState(previousStep);

      // Se estiver em preview, simular navegação real
      if (isPreviewing && funnelId) {
        const newUrl = `/dashboard/funnel/${funnelId}/step/${previousStep}`;
        console.log('🚀 Preview: Navegando para etapa', previousStep, '-', newUrl);
      }

      console.log('🚀 Preview: Voltou para etapa', previousStep);
    }
  }, [currentStep, canGoPrevious, isPreviewing, funnelId]);

  const setCurrentStep = useCallback(
    (step: number) => {
      if (step >= 1 && step <= totalSteps) {
        setCurrentStepState(step);
        console.log('🚀 Preview: Definiu etapa atual para', step);
      }
    },
    [totalSteps]
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
    setCurrentStepState(1);
    console.log('🚀 Preview: Sessão resetada');
  }, []);

  const contextValue: PreviewContextType = {
    isPreviewing,
    currentStep,
    totalSteps,
    canGoNext,
    canGoPrevious,
    sessionData,

    togglePreview,
    startPreview,
    stopPreview,
    goToNextStep,
    goToPreviousStep,
    setCurrentStep,
    updateSessionData,
    resetSession,
  };

  return <PreviewContext.Provider value={contextValue}>{children}</PreviewContext.Provider>;
};

export { PreviewProvider, usePreview, PreviewContext };
export default PreviewProvider;

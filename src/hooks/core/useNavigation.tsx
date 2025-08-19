import { useCallback, useEffect, useState } from 'react';

interface StepNavigationProps {
  totalSteps: number;
  initialStep?: number;
  onStepChange?: (step: number) => void;
  autoAdvance?: boolean;
  validationRequired?: boolean;
}

interface NavigationState {
  currentStep: number;
  previousStep: number | null;
  canGoNext: boolean;
  canGoPrev: boolean;
  isFirstStep: boolean;
  isLastStep: boolean;
  progress: number;
  visitedSteps: Set<number>;
}

/**
 * 🧭 HOOK DE NAVEGAÇÃO ENTRE ETAPAS
 *
 * Controla navegação inteligente com validação
 * Suporte a auto-advance e histórico
 */
export const useNavigation = ({
  totalSteps,
  initialStep = 1,
  onStepChange,
  autoAdvance = false,
  validationRequired = true,
}: StepNavigationProps) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [previousStep, setPreviousStep] = useState<number | null>(null);
  const [visitedSteps, setVisitedSteps] = useState(new Set([initialStep]));
  const [stepValidation, setStepValidation] = useState<Record<number, boolean>>({});
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Calcular estado da navegação
  const navigationState: NavigationState = {
    currentStep,
    previousStep,
    canGoNext: !validationRequired || stepValidation[currentStep] === true,
    canGoPrev: currentStep > 1,
    isFirstStep: currentStep === 1,
    isLastStep: currentStep === totalSteps,
    progress: Math.round((currentStep / totalSteps) * 100),
    visitedSteps,
  };

  // Navegar para próxima etapa
  const nextStep = useCallback(async () => {
    if (currentStep < totalSteps && navigationState.canGoNext && !isTransitioning) {
      setIsTransitioning(true);

      const newStep = currentStep + 1;
      setPreviousStep(currentStep);
      setCurrentStep(newStep);
      setVisitedSteps(prev => new Set(prev).add(newStep));

      onStepChange?.(newStep);

      // Delay para transição suave
      setTimeout(() => setIsTransitioning(false), 300);
    }
  }, [currentStep, totalSteps, navigationState.canGoNext, isTransitioning, onStepChange]);

  // Voltar para etapa anterior
  const prevStep = useCallback(async () => {
    if (currentStep > 1 && !isTransitioning) {
      setIsTransitioning(true);

      const newStep = currentStep - 1;
      setPreviousStep(currentStep);
      setCurrentStep(newStep);

      onStepChange?.(newStep);

      setTimeout(() => setIsTransitioning(false), 300);
    }
  }, [currentStep, isTransitioning, onStepChange]);

  // Ir para etapa específica
  const goToStep = useCallback(
    async (step: number) => {
      if (step >= 1 && step <= totalSteps && step !== currentStep && !isTransitioning) {
        setIsTransitioning(true);

        setPreviousStep(currentStep);
        setCurrentStep(step);
        setVisitedSteps(prev => new Set(prev).add(step));

        onStepChange?.(step);

        setTimeout(() => setIsTransitioning(false), 300);
      }
    },
    [currentStep, totalSteps, isTransitioning, onStepChange]
  );

  // Validar etapa atual
  const validateStep = useCallback(
    (isValid: boolean) => {
      setStepValidation(prev => ({
        ...prev,
        [currentStep]: isValid,
      }));

      // Auto-advance se configurado e válido
      if (autoAdvance && isValid && navigationState.canGoNext) {
        setTimeout(nextStep, 1000);
      }
    },
    [currentStep, autoAdvance, navigationState.canGoNext, nextStep]
  );

  // Resetar validação de uma etapa
  const resetStepValidation = useCallback(
    (step?: number) => {
      const targetStep = step || currentStep;
      setStepValidation(prev => {
        const newValidation = { ...prev };
        delete newValidation[targetStep];
        return newValidation;
      });
    },
    [currentStep]
  );

  // Resetar navegação completa
  const resetNavigation = useCallback(() => {
    setCurrentStep(initialStep);
    setPreviousStep(null);
    setVisitedSteps(new Set([initialStep]));
    setStepValidation({});
    setIsTransitioning(false);
  }, [initialStep]);

  // Pular etapas (para casos especiais)
  const skipToStep = useCallback(
    (step: number) => {
      if (step >= 1 && step <= totalSteps) {
        // Marcar etapas intermediárias como visitadas
        const newVisited = new Set(visitedSteps);
        for (let i = Math.min(currentStep, step); i <= Math.max(currentStep, step); i++) {
          newVisited.add(i);
        }

        setPreviousStep(currentStep);
        setCurrentStep(step);
        setVisitedSteps(newVisited);
        onStepChange?.(step);
      }
    },
    [currentStep, totalSteps, visitedSteps, onStepChange]
  );

  // Verificar se etapa foi visitada
  const wasVisited = useCallback(
    (step: number) => {
      return visitedSteps.has(step);
    },
    [visitedSteps]
  );

  // Obter etapas válidas
  const getValidSteps = useCallback(() => {
    return Object.entries(stepValidation)
      .filter(([, isValid]) => isValid)
      .map(([step]) => parseInt(step));
  }, [stepValidation]);

  // Obter progresso detalhado
  const getDetailedProgress = useCallback(() => {
    const validSteps = getValidSteps().length;
    const visitedCount = visitedSteps.size;

    return {
      current: currentStep,
      total: totalSteps,
      visited: visitedCount,
      valid: validSteps,
      percentage: Math.round((currentStep / totalSteps) * 100),
      validPercentage: Math.round((validSteps / totalSteps) * 100),
      visitedPercentage: Math.round((visitedCount / totalSteps) * 100),
    };
  }, [currentStep, totalSteps, visitedSteps.size, getValidSteps]);

  // Efeito para notificar mudanças
  useEffect(() => {
    onStepChange?.(currentStep);
  }, [currentStep, onStepChange]);

  return {
    // Estado atual
    ...navigationState,
    isTransitioning,
    stepValidation,

    // Ações de navegação
    nextStep,
    prevStep,
    goToStep,
    skipToStep,
    resetNavigation,

    // Validação
    validateStep,
    resetStepValidation,

    // Utilitários
    wasVisited,
    getValidSteps,
    getDetailedProgress,

    // Dados computados
    progressPercentage: navigationState.progress,
    detailedProgress: getDetailedProgress(),
  };
};

/**
 * 🔄 HOOK PARA GERENCIAMENTO DAS ETAPAS DO QUIZ
 *
 * useQuizSteps.ts - Sistema de navegação seguindo o padrão do QuizNavigationBlock
 * Gerencia estado, validação e navegação entre as 21 etapas
 */

import { useCallback, useMemo, useState } from 'react';

interface QuizStepData {
  stepNumber: number;
  isCompleted: boolean;
  isValid: boolean;
  answers: Record<string, any>;
  timestamp?: number;
}

interface UseQuizStepsConfig {
  totalSteps: number;
  initialStep?: number;
  enableValidation?: boolean;
  autoSave?: boolean;
}

interface UseQuizStepsReturn {
  // Estado atual
  currentStep: number;
  totalSteps: number;
  isLoading: boolean;

  // Dados das etapas
  stepData: Record<number, QuizStepData>;
  currentStepData: QuizStepData | null;

  // Navegação
  canGoNext: boolean;
  canGoBack: boolean;
  canJumpTo: (step: number) => boolean;

  // Ações
  goToNext: () => void;
  goToPrevious: () => void;
  jumpToStep: (step: number) => void;
  markStepCompleted: (step: number, answers?: Record<string, any>) => void;
  validateCurrentStep: () => boolean;
  restart: () => void;

  // Dados para o QuizStepsNavigation
  getNavigationConfig: () => any;

  // Progresso
  progress: {
    percentage: number;
    completedSteps: number;
    validSteps: number;
    remainingSteps: number;
  };
}

export const useQuizSteps = (config: UseQuizStepsConfig): UseQuizStepsReturn => {
  const { totalSteps = 21, initialStep = 1, enableValidation = true, autoSave = true } = config;

  // ========================================
  // Estados
  // ========================================
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [isLoading, setIsLoading] = useState(false);
  const [stepData, setStepData] = useState<Record<number, QuizStepData>>({});

  // ========================================
  // Dados computados
  // ========================================
  const currentStepData = useMemo(() => {
    return stepData[currentStep] || null;
  }, [stepData, currentStep]);

  const progress = useMemo(() => {
    const completedSteps = Object.keys(stepData).filter(
      step => stepData[parseInt(step)]?.isCompleted
    ).length;

    const validSteps = Object.keys(stepData).filter(
      step => stepData[parseInt(step)]?.isValid
    ).length;

    return {
      percentage: Math.round((currentStep / totalSteps) * 100),
      completedSteps,
      validSteps,
      remainingSteps: totalSteps - currentStep,
    };
  }, [stepData, currentStep, totalSteps]);

  // ========================================
  // Validações de navegação
  // ========================================
  const canGoNext = useMemo(() => {
    if (currentStep >= totalSteps) return false;

    if (!enableValidation) return true;

    // Verificar se a etapa atual está válida
    const current = stepData[currentStep];
    return current?.isValid !== false; // Permite avançar se não foi marcada como inválida
  }, [currentStep, totalSteps, stepData, enableValidation]);

  const canGoBack = useMemo(() => {
    return currentStep > 1;
  }, [currentStep]);

  const canJumpTo = useCallback(
    (step: number): boolean => {
      if (step < 1 || step > totalSteps) return false;

      if (!enableValidation) return true;

      // Só pode pular para etapas anteriores ou próxima se a atual estiver válida
      if (step <= currentStep) return true;
      if (step === currentStep + 1) return canGoNext;

      return false;
    },
    [currentStep, totalSteps, canGoNext, enableValidation]
  );

  // ========================================
  // Ações de navegação
  // ========================================
  const goToNext = useCallback(async () => {
    if (!canGoNext) return;

    setIsLoading(true);

    try {
      // Simular async operation (validação, save, etc)
      await new Promise(resolve => setTimeout(resolve, 300));

      const nextStep = Math.min(currentStep + 1, totalSteps);
      setCurrentStep(nextStep);

      // Auto-save se habilitado
      if (autoSave) {
        console.log('📝 Auto-save: Etapa', currentStep, '→', nextStep);
      }
    } finally {
      setIsLoading(false);
    }
  }, [canGoNext, currentStep, totalSteps, autoSave]);

  const goToPrevious = useCallback(async () => {
    if (!canGoBack) return;

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 200));

      const prevStep = Math.max(currentStep - 1, 1);
      setCurrentStep(prevStep);
    } finally {
      setIsLoading(false);
    }
  }, [canGoBack, currentStep]);

  const jumpToStep = useCallback(
    async (step: number) => {
      if (!canJumpTo(step)) return;

      setIsLoading(true);

      try {
        await new Promise(resolve => setTimeout(resolve, 200));
        setCurrentStep(step);
      } finally {
        setIsLoading(false);
      }
    },
    [canJumpTo]
  );

  const markStepCompleted = useCallback((step: number, answers?: Record<string, any>) => {
    setStepData(prev => ({
      ...prev,
      [step]: {
        stepNumber: step,
        isCompleted: true,
        isValid: true,
        answers: answers || {},
        timestamp: Date.now(),
      },
    }));
  }, []);

  const validateCurrentStep = useCallback((): boolean => {
    // Lógica de validação específica para cada etapa
    const stepValidationRules: Record<number, () => boolean> = {
      1: () => true, // Sempre válida
      2: () => true, // Questão básica
      // Adicionar regras específicas conforme necessário
    };

    const validator = stepValidationRules[currentStep] || (() => true);
    const isValid = validator();

    // Atualizar estado da etapa
    setStepData(prev => ({
      ...prev,
      [currentStep]: {
        ...prev[currentStep],
        stepNumber: currentStep,
        isCompleted: prev[currentStep]?.isCompleted || false,
        isValid,
        answers: prev[currentStep]?.answers || {},
      },
    }));

    return isValid;
  }, [currentStep]);

  const restart = useCallback(() => {
    setCurrentStep(1);
    setStepData({});
    setIsLoading(false);
  }, []);

  // ========================================
  // Configuração para QuizStepsNavigation
  // ========================================
  const getNavigationConfig = useCallback(() => {
    const stepValidation = Object.keys(stepData).reduce(
      (acc, step) => {
        acc[parseInt(step)] = stepData[parseInt(step)]?.isValid || false;
        return acc;
      },
      {} as Record<number, boolean>
    );

    return {
      mode: 'editor' as const,
      quizState: {
        currentStep,
        totalSteps,
        sessionData: {},
        stepValidation,
      },
      navigation: {
        onNext: goToNext,
        onPrevious: goToPrevious,
        onStepJump: jumpToStep,
        canGoNext: canGoNext && !isLoading,
        canGoBack: canGoBack && !isLoading,
      },
      theme: {
        primaryColor: '#B89B7A',
        backgroundColor: '#FEFEFE',
        textColor: '#432818',
      },
    };
  }, [
    currentStep,
    totalSteps,
    stepData,
    goToNext,
    goToPrevious,
    jumpToStep,
    canGoNext,
    canGoBack,
    isLoading,
  ]);

  return {
    // Estado atual
    currentStep,
    totalSteps,
    isLoading,

    // Dados das etapas
    stepData,
    currentStepData,

    // Navegação
    canGoNext,
    canGoBack,
    canJumpTo,

    // Ações
    goToNext,
    goToPrevious,
    jumpToStep,
    markStepCompleted,
    validateCurrentStep,
    restart,

    // Configuração
    getNavigationConfig,

    // Progresso
    progress,
  };
};

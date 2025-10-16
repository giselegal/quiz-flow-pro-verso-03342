/**
 * 🎯 OPTIMIZED QUIZ FLOW - SPRINT 3 (TK-ED-08)
 * 
 * Hook refatorado e otimizado para navegação de quiz.
 * 
 * SUBSTITUI:
 * ❌ useQuizFlow (monolítico)
 * ❌ useFunnelNavigation (duplicado)
 * 
 * MELHORIAS:
 * ✅ Código modular < 100 linhas
 * ✅ Separação clara de responsabilidades
 * ✅ Performance otimizada com useMemo
 * ✅ Type-safe
 */

import { useCallback, useMemo } from 'react';
import { useUnifiedApp } from '@/contexts/UnifiedAppProvider';

interface QuizFlowReturn {
  // Navigation state
  currentStep: number;
  totalSteps: number;
  canGoNext: boolean;
  canGoPrevious: boolean;
  isFirstStep: boolean;
  isLastStep: boolean;
  progress: number;
  
  // Navigation actions
  goToStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  
  // Validation
  isCurrentStepValid: boolean;
  validateCurrentStep: () => boolean;
}

export const useOptimizedQuizFlow = (): QuizFlowReturn => {
  const { state, actions } = useUnifiedApp();
  const { currentStep, steps, stepValidation } = state;

  // Computed values - memoizados
  const totalSteps = useMemo(() => steps.length, [steps.length]);
  
  const isFirstStep = useMemo(() => currentStep === 1, [currentStep]);
  const isLastStep = useMemo(() => currentStep === totalSteps, [currentStep, totalSteps]);
  
  const canGoPrevious = useMemo(() => !isFirstStep, [isFirstStep]);
  const canGoNext = useMemo(() => !isLastStep, [isLastStep]);
  
  const progress = useMemo(() => 
    totalSteps > 0 ? Math.round((currentStep / totalSteps) * 100) : 0,
    [currentStep, totalSteps]
  );

  const isCurrentStepValid = useMemo(() => 
    stepValidation[currentStep] ?? true, // Default to true if not validated yet
    [stepValidation, currentStep]
  );

  // Actions - callbacks otimizados
  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= totalSteps) {
      actions.setCurrentStep(step);
    }
  }, [totalSteps, actions]);

  const nextStep = useCallback(() => {
    if (canGoNext) {
      actions.goToNextStep();
    }
  }, [canGoNext, actions]);

  const previousStep = useCallback(() => {
    if (canGoPrevious) {
      actions.goToPreviousStep();
    }
  }, [canGoPrevious, actions]);

  const validateCurrentStep = useCallback(() => {
    return actions.validateStep(currentStep);
  }, [currentStep, actions]);

  return {
    currentStep,
    totalSteps,
    canGoNext,
    canGoPrevious,
    isFirstStep,
    isLastStep,
    progress,
    goToStep,
    nextStep,
    previousStep,
    isCurrentStepValid,
    validateCurrentStep,
  };
};

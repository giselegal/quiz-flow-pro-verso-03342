/**
 * 🧭 USE QUIZ NAVIGATION - HOOK DE NAVEGAÇÃO DO QUIZ
 *
 * Hook temporário para compatibilidade
 */

import { useCallback, useState } from 'react';

export interface NavigationState {
  currentStep: number;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

export const useQuizNavigation = (
  initialStep = 1,
  totalSteps = 21,
  onStepChange?: (step: number) => void
) => {
  const [currentStep, setCurrentStep] = useState(initialStep);

  const goToStep = useCallback(
    (step: number) => {
      if (step >= 1 && step <= totalSteps) {
        setCurrentStep(step);
        onStepChange?.(step);
      }
    },
    [totalSteps, onStepChange]
  );

  const nextStep = useCallback(() => {
    goToStep(currentStep + 1);
  }, [currentStep, goToStep]);

  const previousStep = useCallback(() => {
    goToStep(currentStep - 1);
  }, [currentStep, goToStep]);

  const canGoNext = currentStep < totalSteps;
  const canGoPrevious = currentStep > 1;

  return {
    currentStep,
    nextStep,
    previousStep,
    goToStep,
    canGoNext,
    canGoPrevious,
    navigationState: {
      currentStep,
      canGoNext,
      canGoPrevious,
    } as NavigationState,
  };
};

export default useQuizNavigation;

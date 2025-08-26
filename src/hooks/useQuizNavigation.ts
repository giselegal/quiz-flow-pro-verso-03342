/**
 * 🧭 USE QUIZ NAVIGATION - HOOK DE NAVEGAÇÃO DO QUIZ
 *
 * Hook temporário para compatibilidade
 */

import { useCallback } from 'react';
import { useQuizFlow } from '@/context/QuizFlowProvider';

export interface NavigationState {
  currentStep: number;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

export const useQuizNavigation = (
  _initialStep = 1,
  _totalSteps = 21,
  onStepChange?: (step: number) => void
) => {
  const { currentStep, next, previous, goTo, totalSteps: flowTotal } = useQuizFlow();

  const effectiveTotal = flowTotal || _totalSteps;

  const goToStep = useCallback(
    (step: number) => {
      if (step >= 1 && step <= effectiveTotal) {
        goTo(step);
        onStepChange?.(step);
      }
    },
    [effectiveTotal, goTo, onStepChange]
  );

  const nextStep = useCallback(() => {
    next();
  }, [next]);

  const previousStep = useCallback(() => {
    previous();
  }, [previous]);

  const canGoNext = currentStep < effectiveTotal;
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

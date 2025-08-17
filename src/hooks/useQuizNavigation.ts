/**
 * useQuizNavigation Hook - Flow Control and Navigation History
 * 
 * Manages quiz navigation flow, step transitions, and navigation history.
 * Integrates with the quiz state management for seamless user experience.
 */

import { useState, useCallback, useEffect } from 'react';
import { QuizNavigation, QuizNavigationHook } from '@/types/quizCore';

const MAX_STEPS = 21;

export const useQuizNavigation = (
  currentStep: number = 1,
  totalSteps: number = MAX_STEPS,
  onStepChange?: (stepNumber: number) => void
): QuizNavigationHook => {
  const [navigation, setNavigation] = useState<QuizNavigation>({
    currentStep,
    totalSteps,
    canGoBack: currentStep > 1,
    canGoForward: currentStep < totalSteps,
    history: [currentStep.toString()],
  });

  // Update navigation state when current step changes
  useEffect(() => {
    setNavigation(prev => ({
      ...prev,
      currentStep,
      totalSteps,
      canGoBack: currentStep > 1,
      canGoForward: currentStep < totalSteps,
    }));
  }, [currentStep, totalSteps]);

  // Navigate to a specific step
  const goToStep = useCallback((stepNumber: number) => {
    if (stepNumber < 1 || stepNumber > totalSteps) {
      console.warn(`⚠️ Invalid step number: ${stepNumber}. Must be between 1 and ${totalSteps}`);
      return;
    }

    console.log(`🧭 Navigating to step ${stepNumber}`);
    
    setNavigation(prev => {
      const newHistory = [...prev.history];
      
      // Add to history if not going back
      if (stepNumber > prev.currentStep) {
        newHistory.push(stepNumber.toString());
      } else if (stepNumber < prev.currentStep) {
        // Remove future steps from history when going back
        const stepIndex = newHistory.indexOf(stepNumber.toString());
        if (stepIndex !== -1) {
          newHistory.splice(stepIndex + 1);
        }
      }

      return {
        currentStep: stepNumber,
        totalSteps,
        canGoBack: stepNumber > 1,
        canGoForward: stepNumber < totalSteps,
        history: newHistory,
      };
    });

    // Notify parent component of step change
    if (onStepChange) {
      onStepChange(stepNumber);
    }
  }, [totalSteps, onStepChange]);

  // Navigate to next step
  const nextStep = useCallback(() => {
    if (navigation.canGoForward) {
      goToStep(navigation.currentStep + 1);
    } else {
      console.warn('⚠️ Cannot go forward: already at last step');
    }
  }, [navigation.canGoForward, navigation.currentStep, goToStep]);

  // Navigate to previous step
  const previousStep = useCallback(() => {
    if (navigation.canGoBack) {
      goToStep(navigation.currentStep - 1);
    } else {
      console.warn('⚠️ Cannot go back: already at first step');
    }
  }, [navigation.canGoBack, navigation.currentStep, goToStep]);

  // Check if can advance (alias for canGoForward)
  const canAdvance = navigation.canGoForward;

  // Check if this is the first step
  const isFirstStep = navigation.currentStep === 1;

  // Check if this is the last step
  const isLastStep = navigation.currentStep === totalSteps;

  return {
    navigation,
    goToStep,
    nextStep,
    previousStep,
    canAdvance,
    isFirstStep,
    isLastStep,
  };
};

export default useQuizNavigation;
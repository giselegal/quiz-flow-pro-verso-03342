/**
 * Quiz21StepsProvider Stub
 */
import React, { ReactNode } from 'react';

export function Quiz21StepsProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export const useQuiz21Steps = () => ({
  currentStep: 1,
  totalSteps: 21,
  isLoading: false,
  canGoNext: true,
  canGoPrevious: false,
});

export default Quiz21StepsProvider;

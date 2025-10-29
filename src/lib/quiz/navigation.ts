/**
 * Quiz Navigation Module
 * Stub para exemplo Next.js - não usado no runtime atual
 */

export interface NavigationConfig {
  enableBack?: boolean;
  enableNext?: boolean;
  autoAdvance?: boolean;
  autoAdvanceDelay?: number;
}

export interface NavigationState {
  currentStep: number;
  totalSteps: number;
  canGoBack: boolean;
  canGoNext: boolean;
  isFirstStep: boolean;
  isLastStep: boolean;
}

/**
 * Calcula o estado de navegação para um step
 */
export function getNavigationState(
  currentStep: number,
  totalSteps: number,
  config?: NavigationConfig
): NavigationState {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep >= totalSteps;

  return {
    currentStep,
    totalSteps,
    canGoBack: !isFirstStep && (config?.enableBack ?? true),
    canGoNext: !isLastStep && (config?.enableNext ?? true),
    isFirstStep,
    isLastStep,
  };
}

/**
 * Obtém o próximo step na sequência
 */
export function getNextStep(
  currentStep: number,
  totalSteps: number
): number | null {
  if (currentStep >= totalSteps) {
    return null;
  }
  return currentStep + 1;
}

/**
 * Obtém o step anterior na sequência
 */
export function getPreviousStep(currentStep: number): number | null {
  if (currentStep <= 1) {
    return null;
  }
  return currentStep - 1;
}

/**
 * Formata o número do step para exibição
 */
export function formatStepNumber(step: number, totalSteps: number): string {
  return `${step} de ${totalSteps}`;
}

/**
 * Calcula o progresso percentual
 */
export function calculateProgress(currentStep: number, totalSteps: number): number {
  if (totalSteps === 0) return 0;
  return Math.round((currentStep / totalSteps) * 100);
}

/**
 * Alias para compatibilidade com exemplo Next.js
 */
export const computeProgress = calculateProgress;

/**
 * Verifica se um step é válido
 */
export function isValidStep(step: number, totalSteps: number): boolean {
  return step >= 1 && step <= totalSteps;
}

/**
 * Hook-like helper para gerenciar navegação de quiz
 */
export class QuizNavigator {
  private currentStep: number;
  private totalSteps: number;
  private config: NavigationConfig;

  constructor(totalSteps: number, config?: NavigationConfig) {
    this.currentStep = 1;
    this.totalSteps = totalSteps;
    this.config = config || {};
  }

  getState(): NavigationState {
    return getNavigationState(this.currentStep, this.totalSteps, this.config);
  }

  goToStep(step: number): boolean {
    if (isValidStep(step, this.totalSteps)) {
      this.currentStep = step;
      return true;
    }
    return false;
  }

  goNext(): boolean {
    const next = getNextStep(this.currentStep, this.totalSteps);
    if (next !== null) {
      this.currentStep = next;
      return true;
    }
    return false;
  }

  goBack(): boolean {
    const prev = getPreviousStep(this.currentStep);
    if (prev !== null) {
      this.currentStep = prev;
      return true;
    }
    return false;
  }

  getCurrentStep(): number {
    return this.currentStep;
  }

  getProgress(): number {
    return calculateProgress(this.currentStep, this.totalSteps);
  }
}

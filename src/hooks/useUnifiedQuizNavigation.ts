/**
 * 🧭 Hook de navegação unificada para qualquer funil/quiz
 * 
 * Centraliza toda lógica de navegação entre steps, incluindo:
 * - Avanço/retorno entre etapas
 * - Validação inteligente baseada no tipo do step
 * - Histórico de navegação e recuperação de estado
 * - Suporte para navegação condicional baseada em regras
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useQuizUserProgress } from './useQuizUserProgress';

export interface NavigationRule {
  stepId: number;
  condition: (answers: any[]) => boolean;
  targetStepId: number;
}

export interface UseUnifiedQuizNavigationOptions {
  funnelId: string;
  totalSteps: number;
  initialStep?: number;
  rules?: NavigationRule[];
  onStepChange?: (stepIndex: number) => void;
  onComplete?: (answers: any[]) => void;
  persistNavigation?: boolean;
  disableBackNavigation?: boolean;
}

export const useUnifiedQuizNavigation = ({
  funnelId,
  totalSteps,
  initialStep = 0,
  rules = [],
  onStepChange,
  onComplete,
  persistNavigation = true,
  disableBackNavigation = false,
}: UseUnifiedQuizNavigationOptions) => {
  // Integração com hook de progresso do usuário
  const {
    progress,
    currentStepIndex,
    answers,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    completeQuiz,
    hasAnsweredStep,
    calculateCompletionPercentage,
  } = useQuizUserProgress({
    funnelId,
    persistToLocalStorage: persistNavigation,
  });

  // Histórico de navegação para "breadcrumbs" ou botão de voltar
  const navigationHistoryRef = useRef<number[]>([initialStep]);
  const [navigationHistory, setNavigationHistory] = useState<number[]>([initialStep]);

  // Estado para controlar validação do step atual
  const [isCurrentStepValid, setIsCurrentStepValid] = useState(false);
  
  // Manter histórico de navegação
  useEffect(() => {
    // Verificar se o step mudou e não é o mesmo que o último do histórico
    if (
      currentStepIndex !== navigationHistory[navigationHistory.length - 1] &&
      !navigationHistory.includes(currentStepIndex)
    ) {
      const newHistory = [...navigationHistory, currentStepIndex];
      setNavigationHistory(newHistory);
      navigationHistoryRef.current = newHistory;
    }
  }, [currentStepIndex, navigationHistory]);

  // Aplicar regras de navegação condicional
  const findNextStepByRules = useCallback(() => {
    if (!rules || rules.length === 0) {
      return currentStepIndex + 1;
    }

    // Procurar regras aplicáveis ao step atual
    const applicableRules = rules.filter(rule => 
      rule.stepId === currentStepIndex && rule.condition(answers)
    );

    // Se encontrou alguma regra, retorna o step alvo da primeira regra aplicável
    if (applicableRules.length > 0) {
      return applicableRules[0].targetStepId;
    }

    // Caso contrário, avança para o próximo step sequencial
    return currentStepIndex + 1;
  }, [currentStepIndex, rules, answers]);

  // Navegar para o próximo step com regras
  const navigateToNextStep = useCallback(() => {
    const nextStepIndex = findNextStepByRules();
    
    // Verificar se chegou ao final
    if (nextStepIndex >= totalSteps) {
      completeQuiz();
      if (onComplete) {
        onComplete(answers);
      }
      return;
    }
    
    // Navegar para o próximo
    goToStep(nextStepIndex);
    
    // Callback
    if (onStepChange) {
      onStepChange(nextStepIndex);
    }
  }, [findNextStepByRules, goToStep, totalSteps, onStepChange, onComplete, answers, completeQuiz]);

  // Voltar para o step anterior
  const navigateToPreviousStep = useCallback(() => {
    if (disableBackNavigation) {
      console.warn('Navegação de retorno está desabilitada');
      return;
    }

    // Se tiver histórico, volte para o penúltimo item
    if (navigationHistory.length > 1) {
      const newHistory = [...navigationHistory];
      newHistory.pop(); // Remove o atual
      const previousStep = newHistory[newHistory.length - 1];
      
      goToStep(previousStep);
      setNavigationHistory(newHistory);
      navigationHistoryRef.current = newHistory;
      
      // Callback
      if (onStepChange) {
        onStepChange(previousStep);
      }
    } else {
      // Se não tiver histórico suficiente, só volta um
      const previousStep = Math.max(0, currentStepIndex - 1);
      goToStep(previousStep);
      
      // Callback
      if (onStepChange) {
        onStepChange(previousStep);
      }
    }
  }, [currentStepIndex, navigationHistory, goToStep, onStepChange, disableBackNavigation]);

  // Navegação direta para um step específico
  const navigateToStep = useCallback((stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < totalSteps) {
      goToStep(stepIndex);
      
      // Atualizar histórico
      const newHistory = [...navigationHistoryRef.current, stepIndex];
      setNavigationHistory(newHistory);
      navigationHistoryRef.current = newHistory;
      
      // Callback
      if (onStepChange) {
        onStepChange(stepIndex);
      }
    } else {
      console.error(`Step ${stepIndex} está fora do intervalo válido (0-${totalSteps - 1})`);
    }
  }, [goToStep, totalSteps, onStepChange]);

  // Validação do step atual
  const setStepValidity = useCallback((isValid: boolean) => {
    setIsCurrentStepValid(isValid);
  }, []);

  // Helpers
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === totalSteps - 1;
  const canGoBack = !isFirstStep && !disableBackNavigation;
  const canGoForward = isCurrentStepValid;
  const completionPercentage = calculateCompletionPercentage(totalSteps);

  // Debug
  useEffect(() => {
    console.log(
      `🧭 useUnifiedQuizNavigation: Step ${currentStepIndex + 1}/${totalSteps} (${completionPercentage}%) - Valid: ${isCurrentStepValid}`
    );
  }, [currentStepIndex, totalSteps, completionPercentage, isCurrentStepValid]);

  return {
    // Estado
    currentStepIndex,
    navigationHistory,
    isCurrentStepValid,
    
    // Getters
    isFirstStep,
    isLastStep,
    canGoBack,
    canGoForward,
    completionPercentage,
    
    // Ações
    navigateToNextStep,
    navigateToPreviousStep,
    navigateToStep,
    setStepValidity,
    
    // Helper
    totalSteps,
    hasAnsweredStep,
  };
};

export default useUnifiedQuizNavigation;
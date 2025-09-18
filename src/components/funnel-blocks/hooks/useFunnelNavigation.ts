import { useState, useEffect } from 'react';
// import { useRouter } from 'next/router'; // Comentado para React puro
import { useFunnelConfig } from '../editor/FunnelConfigProvider';

interface UseFunnelNavigationOptions {
  initialStep?: number;
  persistState?: boolean;
  storageKey?: string;
  preventExit?: boolean;
}

/**
 * Hook para gerenciar a navegação em funis
 *
 * Gerencia estados, URL e permite navegação entre etapas
 */
export function useFunnelNavigation({
  initialStep = 0,
  persistState = true,
  storageKey = 'funnel-navigation-state',
  preventExit = true,
}: UseFunnelNavigationOptions = {}) {
  // Acesso ao contexto global do funil
  const { config, currentStepIndex, setCurrentStepIndex, userData, updateUserData } =
    useFunnelConfig();

  // const router = useRouter(); // Removido para React puro

  // Estado local para histórico de navegação
  const [navigationHistory, setNavigationHistory] = useState<number[]>([initialStep]);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  // Verificar localStorage ao iniciar
  useEffect(() => {
    if (persistState && typeof window !== 'undefined') {
      try {
        const savedState = localStorage.getItem(storageKey);

        if (savedState) {
          const parsedState = JSON.parse(savedState);

          // Restaurar estado
          if (parsedState.currentStep !== undefined) {
            setCurrentStepIndex(parsedState.currentStep);
          }

          if (parsedState.userData) {
            updateUserData(parsedState.userData);
          }

          if (parsedState.completedSteps) {
            setCompletedSteps(new Set(parsedState.completedSteps));
          }
        }
      } catch (error) {
        console.error('Erro ao carregar estado do funil:', error);
      }
    }
  }, []);

  // Salvar estado quando mudar
  useEffect(() => {
    if (persistState && typeof window !== 'undefined') {
      const stateToSave = {
        currentStep: currentStepIndex,
        userData,
        completedSteps: Array.from(completedSteps),
      };

      localStorage.setItem(storageKey, JSON.stringify(stateToSave));
    }
  }, [currentStepIndex, userData, completedSteps]);

  // Prevenir saída acidental
  useEffect(() => {
    if (preventExit && typeof window !== 'undefined') {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        const message = 'Você tem progresso não salvo. Tem certeza que deseja sair?';
        e.returnValue = message;
        return message;
      };

      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [preventExit]);

  // Funções de navegação
  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < config.steps.length) {
      setCurrentStepIndex(stepIndex);
      setNavigationHistory(prev => [...prev, stepIndex]);
    }
  };

  const goToNextStep = () => {
    if (currentStepIndex < config.steps.length - 1) {
      setCompletedSteps(prev => new Set(prev).add(currentStepIndex));
      goToStep(currentStepIndex + 1);
    }
  };

  const goToPreviousStep = () => {
    if (navigationHistory.length > 1) {
      // Remover etapa atual e voltar para a anterior
      const newHistory = [...navigationHistory];
      newHistory.pop();
      const previousStep = newHistory[newHistory.length - 1];

      setCurrentStepIndex(previousStep);
      setNavigationHistory(newHistory);
    } else if (currentStepIndex > 0) {
      // Fallback se não houver histórico
      goToStep(currentStepIndex - 1);
    }
  };

  // Navegação para URLs específicas
  const navigateToURL = (url: string) => {
    // router.push(url); // Removido para React puro
    window.location.href = url; // Usar navegação padrão do browser
  };

  // Limpar estado
  const resetNavigation = () => {
    setCurrentStepIndex(initialStep);
    setNavigationHistory([initialStep]);
    setCompletedSteps(new Set());

    if (persistState && typeof window !== 'undefined') {
      localStorage.removeItem(storageKey);
    }
  };

  return {
    currentStep: currentStepIndex,
    goToStep,
    goToNextStep,
    goToPreviousStep,
    navigateToURL,
    resetNavigation,
    completedSteps: Array.from(completedSteps),
    isFirstStep: currentStepIndex === 0,
    isLastStep: currentStepIndex === config.steps.length - 1,
    totalSteps: config.steps.length,
    progress: config.steps.length > 0 ? (currentStepIndex + 1) / config.steps.length : 0,
  };
}

export default useFunnelNavigation;

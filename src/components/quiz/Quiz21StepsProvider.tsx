import { useFunnels } from '@/context/FunnelsContext';
import { useQuizLogic } from '@/hooks/useQuizLogic';
import React, { createContext, useCallback, useContext, useState } from 'react';

interface Quiz21StepsContextType {
  // Estado
  currentStep: number;
  totalSteps: number;
  isLoading: boolean;

  // Dados
  userName: string;
  answers: any[];
  sessionData: Record<string, any>;
  currentStepSelections: Record<string, any>;

  // Navegação
  canGoNext: boolean;
  canGoPrevious: boolean;
  isCurrentStepComplete: boolean;
  autoAdvanceEnabled: boolean;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  goToStep: (step: number) => void;

  // Ações
  setUserName: (name: string) => void;
  saveAnswer: (questionId: string, optionId: string, value?: any) => void;
  updateStepSelections: (selections: Record<string, any>) => void;
  resetQuiz: () => void;

  // Sistema
  getCurrentStageData: () => any;
  getProgress: () => number;
  getStepRequirements: () => { requiredSelections: number; maxSelections: number; autoAdvance: boolean };
}

const Quiz21StepsContext = createContext<Quiz21StepsContextType | undefined>(undefined);

export const useQuiz21Steps = () => {
  const context = useContext(Quiz21StepsContext);
  if (!context) {
    throw new Error('useQuiz21Steps must be used within Quiz21StepsProvider');
  }
  return context;
};

interface Quiz21StepsProviderProps {
  children: React.ReactNode;
  initialStep?: number;
  debug?: boolean;
}

/**
 * 🎯 PROVIDER PARA QUIZ DE 21 ETAPAS
 *
 * Integra:
 * - FunnelsContext (dados das etapas)
 * - useQuizLogic (lógica de cálculo)
 * - Navegação entre etapas
 * - Persistência de dados
 */
export const Quiz21StepsProvider: React.FC<Quiz21StepsProviderProps> = ({
  children,
  initialStep = 1,
  debug = false,
}) => {
  // Hooks externos - com fallback para quando não estiver em FunnelsProvider
  const funnels = React.useMemo(() => {
    try {
      return useFunnels();
    } catch (error) {
      if (debug) {
        console.warn('🎯 Quiz21Steps: FunnelsProvider não encontrado, usando fallback');
      }
      return {
        activeStageId: `step-${initialStep}`,
        steps: [],
        setActiveStageId: () => {},
      };
    }
  }, [initialStep, debug]);

  const { activeStageId, steps, setActiveStageId } = funnels;
  const {
    answers,
    answerQuestion,
    answerStrategicQuestion,
    setUserNameFromInput,
    userName: quizUserName,
  } = useQuizLogic();

  // Estado local
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserNameState] = useState('');
  const [sessionData, setSessionData] = useState<Record<string, any>>({});
  const [currentStepSelections, setCurrentStepSelections] = useState<Record<string, any>>({});

  const totalSteps = 21;

  // Navegação
  const canGoNext = currentStep < totalSteps;
  const canGoPrevious = currentStep > 1;

  // Funções para determinar requisitos da etapa atual
  const getStepRequirements = useCallback(() => {
    // Etapas 2-11: Questões principais (3 seleções, auto-advance)
    if (currentStep >= 2 && currentStep <= 11) {
      return {
        requiredSelections: 3,
        maxSelections: 3,
        autoAdvance: true
      };
    }
    
    // Etapas 13-18: Questões estratégicas (1 seleção, auto-advance)
    if (currentStep >= 13 && currentStep <= 18) {
      return {
        requiredSelections: 1,
        maxSelections: 1,
        autoAdvance: true
      };
    }
    
    // Outras etapas: Navegação manual
    return {
      requiredSelections: 0,
      maxSelections: 0,
      autoAdvance: false
    };
  }, [currentStep]);

  // Verificar se a etapa atual está completa
  const isCurrentStepComplete = useCallback(() => {
    const requirements = getStepRequirements();
    
    // Etapa 1: Verificar se o nome foi inserido
    if (currentStep === 1) {
      return Boolean(userName && userName.trim().length > 0);
    }
    
    // Etapas com seleções: Verificar se o número necessário foi atingido
    if (requirements.requiredSelections > 0) {
      const selectionsCount = Object.keys(currentStepSelections).length;
      return selectionsCount >= requirements.requiredSelections;
    }
    
    // Outras etapas: Sempre podem avançar manualmente
    return true;
  }, [currentStep, userName, currentStepSelections, getStepRequirements]);

  const autoAdvanceEnabled = useCallback(() => {
    return getStepRequirements().autoAdvance;
  }, [getStepRequirements]);

  const goToStep = useCallback(
    (step: number) => {
      if (step >= 1 && step <= totalSteps) {
        setCurrentStep(step);
        setCurrentStepSelections({}); // Limpar seleções da etapa anterior

        // Atualizar stage no FunnelsContext
        const stageId = `step-${step}`;
        setActiveStageId(stageId);

        if (debug) {
          console.log('🎯 Quiz21Steps: Navegou para etapa', step, 'stageId:', stageId);
        }
      }
    },
    [setActiveStageId, debug, totalSteps]
  );

  const goToNextStep = useCallback(() => {
    if (canGoNext) {
      goToStep(currentStep + 1);
    }
  }, [canGoNext, currentStep, goToStep]);

  const goToPreviousStep = useCallback(() => {
    if (canGoPrevious) {
      goToStep(currentStep - 1);
    }
  }, [canGoPrevious, currentStep, goToStep]);

  // Ações
  const setUserName = useCallback(
    (name: string) => {
      setUserNameState(name);
      setUserNameFromInput(name);

      // Salvar em session data
      setSessionData(prev => ({
        ...prev,
        userName: name,
        startTime: Date.now(),
      }));

      if (debug) {
        console.log('🎯 Quiz21Steps: Nome definido:', name);
      }
    },
    [setUserNameFromInput, debug]
  );

  const saveAnswer = useCallback(
    (questionId: string, optionId: string, value?: any) => {
      // Detectar tipo de questão baseado no currentStep
      if (currentStep >= 2 && currentStep <= 11) {
        // Questões pontuadas (etapas 2-11)
        answerQuestion(questionId, optionId);
      } else if (currentStep >= 13 && currentStep <= 18) {
        // Questões estratégicas (etapas 13-18)
        answerStrategicQuestion(questionId, optionId, 'strategic', 'tracking');
      }

      // Atualizar seleções da etapa atual
      setCurrentStepSelections(prev => ({
        ...prev,
        [optionId]: {
          questionId,
          optionId,
          value,
          timestamp: Date.now()
        }
      }));

      // Salvar em session data
      setSessionData(prev => ({
        ...prev,
        [`q${currentStep}_${questionId}`]: {
          questionId,
          optionId,
          value,
          step: currentStep,
          timestamp: Date.now(),
        },
      }));

      if (debug) {
        console.log('🎯 Quiz21Steps: Resposta salva:', { questionId, optionId, step: currentStep });
      }

      // Auto-advance se as condições forem atendidas
      setTimeout(() => {
        const requirements = getStepRequirements();
        const newSelectionsCount = Object.keys(currentStepSelections).length + 1;
        
        if (requirements.autoAdvance && newSelectionsCount >= requirements.requiredSelections) {
          if (debug) {
            console.log('🚀 Quiz21Steps: Auto-avançando para próxima etapa');
          }
          goToNextStep();
        }
      }, 1500); // Delay para permitir visualização da seleção
    },
    [currentStep, answerQuestion, answerStrategicQuestion, debug, currentStepSelections, getStepRequirements, goToNextStep]
  );

  const updateStepSelections = useCallback((selections: Record<string, any>) => {
    setCurrentStepSelections(selections);
    
    if (debug) {
      console.log('🎯 Quiz21Steps: Seleções atualizadas:', selections);
    }
  }, [debug]);

  const resetQuiz = useCallback(() => {
    setCurrentStep(1);
    setUserNameState('');
    setSessionData({});
    setCurrentStepSelections({});
    setActiveStageId('step-1');

    if (debug) {
      console.log('🎯 Quiz21Steps: Quiz resetado');
    }
  }, [setActiveStageId, debug]);

  // Utils
  const getCurrentStageData = useCallback(() => {
    const stageId = `step-${currentStep}`;
    return steps.find(step => step.id === stageId) || null;
  }, [currentStep, steps]);

  const getProgress = useCallback(() => {
    return Math.round((currentStep / totalSteps) * 100);
  }, [currentStep, totalSteps]);

  // Debug logs
  React.useEffect(() => {
    if (debug) {
      console.log('🎯 Quiz21Steps State:', {
        currentStep,
        activeStageId,
        userName,
        answersCount: answers.length,
        sessionDataKeys: Object.keys(sessionData),
        stepsCount: steps.length,
      });
    }
  }, [currentStep, activeStageId, userName, answers.length, sessionData, debug, steps.length]);

  const contextValue: Quiz21StepsContextType = {
    // Estado
    currentStep,
    totalSteps,
    isLoading,

    // Dados
    userName: userName || quizUserName,
    answers,
    sessionData,
    currentStepSelections,

    // Navegação
    canGoNext,
    canGoPrevious,
    isCurrentStepComplete: isCurrentStepComplete(),
    autoAdvanceEnabled: autoAdvanceEnabled(),
    goToNextStep,
    goToPreviousStep,
    goToStep,

    // Ações
    setUserName,
    saveAnswer,
    updateStepSelections,
    resetQuiz,

    // Sistema
    getCurrentStageData,
    getProgress,
    getStepRequirements,
  };

  return <Quiz21StepsContext.Provider value={contextValue}>{children}</Quiz21StepsContext.Provider>;
};

export default Quiz21StepsProvider;

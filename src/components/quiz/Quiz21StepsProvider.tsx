import { useFunnels } from '@/context/FunnelsContext';
import { useQuizAnalytics } from '@/hooks/useQuizAnalytics';
import { useQuizLogic } from '@/hooks/useQuizLogic';
import { useSupabaseQuiz } from '@/hooks/useSupabaseQuiz'; // 🎯 NOVO: Integração Sup      // 🗄️ SUPABASE: Salvar resposta no banco
      saveSupabaseAnswer(questionId, optionId);mport { useStepNavigationStore } from '@/stores/useStepNavigationStore';
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
  completeQuizWithAnalytics: () => any; // 🎯 NOVO: Completar quiz com analytics

  // Sistema
  getCurrentStageData: () => any;
  getProgress: () => number;
  getStepRequirements: () => {
    requiredSelections: number;
    maxSelections: number;
    autoAdvance: boolean;
  };
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

  const { steps } = funnels;
  // Para compatibilidade, criar activeStageId e setActiveStageId localmente
  const [activeStageId, setActiveStageId] = useState(`step-${initialStep}`);
  const {
    answers,
    answerQuestion,
    answerStrategicQuestion,
    setUserNameFromInput,
    userName: quizUserName,
    completeQuiz: completeQuizLogic,
    quizResult: quizLogicResult,
  } = useQuizLogic();

  // 🎯 NOVO: Integração com store de configurações NoCode
  const { getStepConfig } = useStepNavigationStore();

  // Estado local
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [isLoading] = useState(false);
  const [userName, setUserNameState] = useState('');
  const [sessionData, setSessionData] = useState<Record<string, any>>({});
  const [currentStepSelections, setCurrentStepSelections] = useState<Record<string, any>>({});

  // 📊 NOVO: Integração com Analytics (após estados)
  const { trackStepStart, trackStepComplete, trackQuizComplete } = useQuizAnalytics();

  // 🗄️ NOVO: Integração com Supabase
  const {
    session: supabaseSession,
    saveAnswer: saveSupabaseAnswer,
    completeQuiz: completeSupabaseQuiz,
    isLoading: isSupabaseLoading,
    startQuiz: startSupabaseQuiz,
  } = useSupabaseQuiz();

  const totalSteps = 21;

  // Navegação
  const canGoNext = currentStep < totalSteps;
  const canGoPrevious = currentStep > 1;

  // 🎯 ATUALIZADO: Requisitos baseados em configurações NoCode
  const getStepRequirements = useCallback(() => {
    const stageId = `step-${currentStep}`;
    const config = getStepConfig(stageId);

    // Usar configurações NoCode quando disponíveis
    return {
      requiredSelections: config.requiredSelections,
      maxSelections: config.maxSelections,
      autoAdvance: config.autoAdvanceOnComplete,
      autoAdvanceDelay: config.autoAdvanceDelay,
      enableButtonOnlyWhenValid: config.enableButtonOnlyWhenValid,
      validationMessage: config.validationMessage,
      progressMessage: config.progressMessage,
    };
  }, [currentStep, getStepConfig]);

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
        // 📊 ANALYTICS: Track step navigation
        if (step > currentStep) {
          // Para trackStepComplete, precisa dos answers - usar answers do useQuizLogic
          const userAnswers = answers.map(a => ({
            stepId: `step-${currentStep}`,
            questionId: a.questionId,
            selectedOptions: [a.optionId],
            selectedOptionDetails: [
              {
                id: a.optionId,
                text: a.optionId,
                category: a.optionId,
              },
            ],
            answeredAt: new Date(),
            timeSpent: 0,
          }));
          trackStepComplete(`step-${currentStep}`, userAnswers);
        }
        trackStepStart(`step-${step}`);

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
    [setActiveStageId, debug, totalSteps, currentStep, trackStepStart, trackStepComplete, answers]
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

      // �️ SUPABASE: Salvar resposta no banco
      saveSupabaseAnswer(questionId, optionId, {
        stepId: `step-${currentStep}`,
        stepNumber: currentStep,
        value,
        timestamp: Date.now(),
      });

      // �📊 ANALYTICS: Track user interaction
      // trackUserInteraction seria ideal aqui, mas vamos usar trackEvent por enquanto

      // Atualizar seleções da etapa atual
      setCurrentStepSelections(prev => ({
        ...prev,
        [optionId]: {
          questionId,
          optionId,
          value,
          timestamp: Date.now(),
        },
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
    [
      currentStep,
      answerQuestion,
      answerStrategicQuestion,
      debug,
      currentStepSelections,
      getStepRequirements,
      goToNextStep,
    ]
  );

  const updateStepSelections = useCallback(
    (selections: Record<string, any>) => {
      setCurrentStepSelections(selections);

      if (debug) {
        console.log('🎯 Quiz21Steps: Seleções atualizadas:', selections);
      }
    },
    [debug]
  );

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

  // 🎯 NOVO: Completar quiz com analytics
  const completeQuizWithAnalytics = useCallback(() => {
    // Usar função do useQuizLogic para completar
    completeQuizLogic();

    // Se há resultado disponível, fazer tracking
    // Note: quizLogicResult será atualizado após completeQuizLogic() por useQuizLogic
    setTimeout(() => {
      if (quizLogicResult) {
        // 📊 Converter QuizResult para Result para analytics
        const resultForAnalytics = {
          id: crypto.randomUUID(),
          quizId: 'quiz-21-steps',
          styleCategory: quizLogicResult.primaryStyle.category,
          primaryStyle: quizLogicResult.primaryStyle.category,
          scores: quizLogicResult.scores,
          percentages: quizLogicResult.scores,
          userAnswers: [], // TODO: Mapear de answers se necessário
          completedAt: quizLogicResult.completedAt,
          totalScore: Object.values(quizLogicResult.scores).reduce((acc, score) => acc + score, 0),
        };

        // 📊 ANALYTICS: Track quiz completion
        trackQuizComplete(resultForAnalytics);

        if (debug) {
          console.log('🎯 Quiz21Steps: Quiz completado com analytics:', quizLogicResult);
        }
      }
    }, 100); // Pequeno delay para garantir que quizLogicResult foi atualizado

    return quizLogicResult;
  }, [completeQuizLogic, quizLogicResult, trackQuizComplete, debug]);

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
    completeQuizWithAnalytics, // 🎯 NOVO: Função para completar quiz com analytics

    // Sistema
    getCurrentStageData,
    getProgress,
    getStepRequirements,
  };

  return <Quiz21StepsContext.Provider value={contextValue}>{children}</Quiz21StepsContext.Provider>;
};

export default Quiz21StepsProvider;

import { useFunnels } from '@/context/FunnelsContext';
import { useQuizAnalytics } from '@/hooks/useQuizAnalytics';
import { useQuizLogic } from '@/hooks/useQuizLogic';
import { useSupabaseQuiz } from '@/hooks/useSupabaseQuiz';
import { useStepNavigationStore } from '@/stores/useStepNavigationStore';
import { trackQuizStarted, trackStepViewed, trackOptionSelected } from '@/services/compatibleAnalytics';
import React, { createContext, useCallback, useContext, useState } from 'react';

// ✅ FASE 3: Interface adaptadora para compatibilidade entre core e legacy
interface AdaptedFunnelStep {
  id: string;
  name: string;
  description?: string;
  order: number;
  type: string;
  isActive?: boolean;
  blocksCount?: number;
  // Propriedades do core
  isRequired?: boolean;
  isVisible?: boolean;
}

// ✅ HELPER: Adaptar step legacy para interface unificada
const adaptLegacyStep = (legacyStep: any): AdaptedFunnelStep => {
  return {
    id: legacyStep.id,
    name: legacyStep.name,
    description: legacyStep.description || '',
    order: legacyStep.order,
    type: legacyStep.type,
    isActive: legacyStep.isActive ?? true,
    blocksCount: legacyStep.blocksCount || 1,
    isRequired: true, // Default do core
    isVisible: legacyStep.isActive ?? true,
  };
};

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
 * - useQuizAnalytics (tracking)
 * - useSupabaseQuiz (persistência)
 * - Navegação entre etapas
 * - Persistência de dados
 */
export const Quiz21StepsProvider: React.FC<Quiz21StepsProviderProps> = ({
  children,
  initialStep = 1,
  debug = false,
}) => {
  // 🔍 DEBUG: Log inicial detalhado
  console.log('🚀 Quiz21StepsProvider: Iniciando com debug =', debug);

  // 🎯 INTEGRAÇÃO COM FUNNELS CONTEXT
  const funnelsContext = useFunnels();

  // 🔍 DEBUG: Verificar se o FunnelsContext está disponível
  console.log('🔍 Quiz21StepsProvider: FunnelsContext disponível?', !!funnelsContext);
  console.log('🔍 Quiz21StepsProvider: FunnelsContext data:', {
    hasSteps: !!funnelsContext?.steps,
    stepsLength: funnelsContext?.steps?.length || 0,
    currentFunnelId: funnelsContext?.currentFunnelId,
  });

  // 🎯 INTEGRAÇÃO: FunnelsContext para dados das etapas
  let funnels = funnelsContext;
  let steps: AdaptedFunnelStep[] = [];

  try {
    const rawSteps = funnels.steps || [];
    steps = rawSteps.map(adaptLegacyStep);
    console.log('✅ Quiz21StepsProvider: Steps adaptados com sucesso:', {
      rawStepsLength: rawSteps.length,
      adaptedStepsLength: steps.length,
      currentFunnelId: funnels.currentFunnelId,
      firstStepAdapted: steps[0] ? `${steps[0].name} (${steps[0].type})` : 'nenhum',
    });
  } catch (error) {
    console.error('❌ Quiz21StepsProvider: Erro ao acessar FunnelsContext:', error);
    // Fallback temporário para debug
    steps = [];
    funnels = {
      steps: [],
      setActiveStageId: () => { },
      currentFunnelId: 'fallback',
      setCurrentFunnelId: () => { },
      setSteps: () => { },
      getTemplate: () => ({}),
      getTemplateBlocks: () => [],
      updateFunnelStep: () => { },
      addStepBlock: () => { },
      saveFunnelToDatabase: async () => { },
      loading: false,
      error: String(error),
    };
  }

  // 🔍 DEBUG CRÍTICO: Verificar se o contexto está funcionando
  React.useEffect(() => {
    console.log('🔍 CONTEXT DEBUG:', {
      // funnelsExists: !!funnels, // Comentado - variável não utilizada
      // funnelsType: typeof funnels, // Comentado - variável não utilizada
      stepsExists: !!steps,
      stepsLength: steps?.length || 0,
      // funnelsKeys: funnels ? Object.keys(funnels) : 'null', // Comentado - variável não utilizada
      stepsSample: steps?.slice(0, 2),
    });
  }, [steps]); // Removido 'funnels' das dependências

  // 🔍 VERIFICAÇÃO CRÍTICA: Garantir que as etapas foram carregadas
  React.useEffect(() => {
    if (debug) {
      console.log('🔍 VERIFICAÇÃO CRÍTICA - Quiz21StepsProvider:');
      console.log('  - FunnelsContext disponível:', !!funnels);
      console.log('  - Steps disponíveis:', !!steps);
      console.log('  - Quantidade de steps:', steps?.length || 0);
      console.log('  - Primeira step:', steps?.[0] || 'nenhuma');
      console.log('  - Última step:', steps?.[steps.length - 1] || 'nenhuma');

      if (!steps || steps.length === 0) {
        console.error('🔴 PROBLEMA IDENTIFICADO: Steps não carregadas pelo FunnelsContext!');
        console.error('🔴 Possible Solutions:');
        console.error('  1. Verificar se FunnelsProvider está antes de Quiz21StepsProvider');
        console.error('  2. Verificar se template "quiz-estilo-completo" existe');
        console.error('  3. Verificar se inicialização do FunnelsProvider está correta');
      }
    }
  }, [steps, funnels, debug]); // Removido 'funnels' das dependências

  // Para compatibilidade, criar activeStageId e setActiveStageId localmente
  const [activeStageId, setActiveStageId] = useState(`step-${initialStep}`);

  // 🎯 INTEGRAÇÃO: useQuizLogic para cálculo de resultados
  const {
    answers,
    answerQuestion,
    answerStrategicQuestion,
    setUserNameFromInput,
    userName: quizUserName,
    completeQuiz: completeQuizLogic,
    quizResult: quizLogicResult,
  } = useQuizLogic();

  // 🎯 INTEGRAÇÃO: useStepNavigationStore para configurações NoCode
  const { getStepConfig } = useStepNavigationStore();

  // Estado local
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [isLoading] = useState(false);
  const [userName, setUserNameState] = useState('');
  const [sessionData, setSessionData] = useState<Record<string, any>>({});
  const [currentStepSelections, setCurrentStepSelections] = useState<Record<string, any>>({});

  // 📊 INTEGRAÇÃO: Analytics para tracking
  const { trackStepStart, trackStepComplete, trackQuizComplete } = useQuizAnalytics();

  // 🗄️ INTEGRAÇÃO: Supabase para persistência
  const {
    session: supabaseSession,
    saveAnswer: saveSupabaseAnswer,
    completeQuiz: completeSupabaseQuiz,
    isLoading: isSupabaseLoading,
    startQuiz: startSupabaseQuiz,
  } = useSupabaseQuiz();

  const totalSteps = steps?.length || 21; // ✅ Usar steps.length quando disponível

  // Navegação
  const canGoNext = currentStep < totalSteps;
  const canGoPrevious = currentStep > 1;

  // 🎯 Requisitos baseados em configurações NoCode
  const getStepRequirements = useCallback(() => {
    const stageId = `step-${currentStep}`;
    const config = getStepConfig(stageId);

    // Usar configurações NoCode quando disponíveis
    return {
      requiredSelections: config.requiredSelections || 1,
      maxSelections: config.maxSelections || 1,
      autoAdvance: config.autoAdvanceOnComplete || false,
    };
  }, [currentStep, getStepConfig]);

  // 🎯 Verificar se etapa atual está completa
  const isCurrentStepComplete = useCallback(() => {
    const requirements = getStepRequirements();
    const selectionsCount = Object.keys(currentStepSelections).length;
    return selectionsCount >= requirements.requiredSelections;
  }, [currentStepSelections, getStepRequirements]);

  // 🎯 Verificar se auto-advance está habilitado
  const autoAdvanceEnabled = useCallback(() => {
    const requirements = getStepRequirements();
    return requirements.autoAdvance;
  }, [getStepRequirements]);

  // 🎯 Navegar para etapa específica
  const goToStep = useCallback(
    (step: number) => {
      if (step < 1 || step > totalSteps) {
        console.warn(`🎯 Quiz21Steps: Etapa ${step} inválida (1-${totalSteps})`);
        return;
      }

      // 📊 ANALYTICS: Track step viewed
      trackStepViewed(step).catch(err => console.warn('Analytics error:', err));

      // 📊 ANALYTICS: Track step completion antes de mudar
      if (step > currentStep) {
        // Para trackStepComplete, converter answers para formato correto
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
    },
    [currentStep, answers, trackStepComplete, trackStepStart, debug, totalSteps]
  );

  // 🎯 Próxima etapa
  const goToNextStep = useCallback(() => {
    if (canGoNext) {
      goToStep(currentStep + 1);
    }
  }, [canGoNext, currentStep, goToStep]);

  // 🎯 Etapa anterior
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

      // 🗄️ SUPABASE: Iniciar sessão do quiz se ainda não iniciada
      if (!supabaseSession.id) {
        startSupabaseQuiz({
          name,
          email: '', // TODO: Capturar email do usuário
          quizId: 'quiz-21-steps',
        });
      }

      // 📊 ANALYTICS: Rastrear início do quiz
      trackQuizStarted(name);

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
    [setUserNameFromInput, supabaseSession.id, startSupabaseQuiz, debug]
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

      // 🗄️ SUPABASE: Salvar resposta no banco
      saveSupabaseAnswer({ questionId, optionId });

      // 📊 ANALYTICS: Rastrear seleção de opção
      trackOptionSelected(currentStep, optionId, value);

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
            console.log('🎯 Quiz21Steps: Auto-advance acionado');
          }
          goToNextStep();
        }
      }, 100);
    },
    [
      currentStep,
      answerQuestion,
      answerStrategicQuestion,
      saveSupabaseAnswer,
      currentStepSelections,
      getStepRequirements,
      goToNextStep,
      debug,
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
      console.log('🎯 Quiz21Steps: Quiz reiniciado');
    }
  }, [debug]);

  // 🎯 NOVO: Completar quiz com analytics
  const completeQuizWithAnalytics = useCallback(() => {
    // Usar função do useQuizLogic para completar
    completeQuizLogic();

    // 🗄️ SUPABASE: Completar quiz no banco
    completeSupabaseQuiz();

    // Se há resultado disponível, fazer tracking
    // Note: quizLogicResult será atualizado após completeQuizLogic() por useQuizLogic
    setTimeout(() => {
      if (quizLogicResult) {
        // 📊 ANALYTICS: Track quiz completion
        import('@/services/compatibleAnalytics').then(({ trackQuizCompleted }) => {
          trackQuizCompleted(quizLogicResult);
        });

        if (debug) {
          console.log('🎯 Quiz21Steps: Quiz completado com analytics:', quizLogicResult);
        }
      }
    }, 100); // Pequeno delay para garantir que quizLogicResult foi atualizado

    return quizLogicResult;
  }, [completeQuizLogic, completeSupabaseQuiz, quizLogicResult, debug]);

  // Sistema
  const getCurrentStageData = useCallback(() => {
    const stageId = `step-${currentStep}`;
    return {
      stageId,
      step: currentStep,
      total: totalSteps,
      isCompleted: isCurrentStepComplete(),
      canAdvance: canGoNext,
      canGoBack: canGoPrevious,
      selections: currentStepSelections,
    };
  }, [
    currentStep,
    totalSteps,
    isCurrentStepComplete,
    canGoNext,
    canGoPrevious,
    currentStepSelections,
  ]);

  const getProgress = useCallback(() => {
    return Math.round((currentStep / totalSteps) * 100);
  }, [currentStep, totalSteps]);

  // Debug logs
  React.useEffect(() => {
    if (debug) {
      console.log('🎯 Quiz21Steps: Estado atualizado:', {
        currentStep,
        activeStageId,
        userName,
        answersCount: answers.length,
        sessionDataKeys: Object.keys(sessionData),
        stepsCount: steps.length,
        supabaseSessionId: supabaseSession.id,
        isSupabaseLoading,
        funnelsProvider: {
          hasSteps: steps && steps.length > 0,
          stepsLength: steps?.length || 0,
          firstStepId: steps?.[0]?.id || 'nenhum',
          lastStepId: steps?.[steps.length - 1]?.id || 'nenhum',
        },
      });

      // 🔍 PONTO CEGO: Verificar se as etapas realmente estão sendo fornecidas pelo FunnelsContext
      if (!steps || steps.length === 0) {
        console.error('🔴 PONTO CEGO IDENTIFICADO: FunnelsContext não está fornecendo etapas!');
        console.error('🔴 Possíveis causas:');
        console.error('  - FunnelsProvider não inicializado');
        console.error('  - Template não encontrado');
        console.error('  - Erro na configuração do currentFunnelId');
        console.error('  - Problema na importação dos templates');
      }
    }
  }, [
    currentStep,
    activeStageId,
    userName,
    answers.length,
    sessionData,
    debug,
    steps.length,
    supabaseSession.id,
    isSupabaseLoading,
    steps,
  ]);

  const contextValue: Quiz21StepsContextType = {
    // Estado
    currentStep,
    totalSteps,
    isLoading: isLoading || isSupabaseLoading,

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

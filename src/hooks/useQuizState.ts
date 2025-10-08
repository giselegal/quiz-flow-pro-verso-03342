/**
 * 🎯 HOOK DE ESTADO DO QUIZ - GISELE GALVÃO
 * 
 * Este hook gerencia todo o estado global do quiz:
 * - Navegação entre etapas
 * - Armazenamento de respostas
 * - Cálculo de pontuações por estilo
 * - Perfil do usuário e resultado final
 * - Lógica de ofertas personalizadas
 * - Suporte a templates personalizados via funnelId
 */

import { useState, useCallback, useMemo, useEffect } from 'react';
import { styleMapping, type StyleId } from '../data/styles';
import { resolveStyleId } from '@/utils/styleIds';
import { QUIZ_STEPS, STEP_ORDER } from '../data/quizSteps';
import { stepIdVariants, normalizeStepId, getNextFromOrder, getPreviousFromOrder, safeGetStep } from '@/utils/quizStepIds';
import { getPersonalizedStepTemplate } from '../templates/quiz21StepsSimplified';
import { quizEditorBridge } from '@/services/QuizEditorBridge';
// Note: STRATEGIC_ANSWER_TO_OFFER_KEY commented - not used
// import { STRATEGIC_ANSWER_TO_OFFER_KEY } from '@/data/quizSteps';

// Tipos do estado do quiz
export interface QuizScores {
  natural: number;
  classico: number;
  contemporaneo: number;
  elegante: number;
  romantico: number;
  sexy: number;
  dramatico: number;
  criativo: number;
}

export interface UserProfile {
  userName: string;
  resultStyle: string;
  secondaryStyles: string[];
  strategicAnswers: Record<string, string>;
}

export interface QuizState {
  currentStep: string;
  answers: Record<string, string[]>;
  scores: QuizScores;
  userProfile: UserProfile;
}

const initialScores: QuizScores = {
  natural: 0,
  classico: 0,
  contemporaneo: 0,
  elegante: 0,
  romantico: 0,
  sexy: 0,
  dramatico: 0,
  criativo: 0,
};

const initialUserProfile: UserProfile = {
  userName: '',
  resultStyle: '',
  secondaryStyles: [],
  strategicAnswers: {},
};

const initialState: QuizState = {
  currentStep: 'step-01',
  answers: {},
  scores: { ...initialScores },
  userProfile: { ...initialUserProfile },
};

export function useQuizState(funnelId?: string, externalSteps?: Record<string, any>) {
  const [state, setState] = useState<QuizState>(initialState);
  const [loadedSteps, setLoadedSteps] = useState<Record<string, any> | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 🎯 NOVO: Carregar steps do bridge se tiver funnelId
  useEffect(() => {
    if (funnelId && !externalSteps) {
      setIsLoading(true);
      quizEditorBridge.loadForRuntime(funnelId)
        .then(steps => {
          console.log('✅ Steps carregados do bridge:', Object.keys(steps).length);
          setLoadedSteps(steps);
        })
        .catch(err => {
          console.error('❌ Erro ao carregar steps:', err);
          setLoadedSteps(QUIZ_STEPS); // Fallback
        })
        .finally(() => setIsLoading(false));
    }
  }, [funnelId, externalSteps]);

  // Determinar source dos steps (prioridade: external > loaded > default)
  const stepsSource = externalSteps || loadedSteps || QUIZ_STEPS;

  // (agora importado de util) normalizeStepId

  // Navegar para próxima etapa
  const nextStep = useCallback((stepId?: string) => {
    setState(prev => {
      if (stepId) {
        return { ...prev, currentStep: normalizeStepId(stepId) };
      }
      const next = getNextFromOrder(STEP_ORDER, prev.currentStep);
      return { ...prev, currentStep: next };
    });
  }, []);

  // Navegar para etapa anterior
  const previousStep = useCallback(() => {
    const prevId = getPreviousFromOrder(STEP_ORDER, state.currentStep);
    if (prevId !== state.currentStep) {
      setState(prev => ({ ...prev, currentStep: prevId }));
    }
  }, [state.currentStep]);

  // Definir nome do usuário
  const setUserName = useCallback((userName: string) => {
    setState(prev => ({
      ...prev,
      userProfile: {
        ...prev.userProfile,
        userName: userName.trim()
      }
    }));
  }, []);

  // Calcular resultado do quiz
  const calculateResult = useCallback(() => {
    console.log('🔄 Calculando resultado do quiz...');
    // Reinicia as pontuações
    const newScores = { ...initialScores };

    // Conta pontos baseado nas respostas das etapas de perguntas (steps 2-11)
    Object.entries(state.answers).forEach(([stepId, selections]) => {
      const step = safeGetStep(QUIZ_STEPS, stepId);

      // Só conta pontos para etapas do tipo 'question' (não strategic-question)
      if (step?.type === 'question' && selections) {
        selections.forEach(selectionId => {
          if (selectionId in newScores) {
            (newScores as any)[selectionId] += 1;
          }
        });
      }
    });

    console.log('📊 Pontuações calculadas:', newScores);

    // Ordena estilos por pontuação
    const sortedStyles = Object.entries(newScores)
      .sort(([, a], [, b]) => b - a)
      .map(([plainId]) => {
        // Converte para id canônico (acentuado) quando necessário
        const canonicalId = resolveStyleId(plainId);
        const style = styleMapping[canonicalId as StyleId] || styleMapping[plainId as StyleId];
        console.log(`🎨 Mapeando estilo: ${plainId} -> canonical: ${canonicalId} =>`, style);
        return style;
      })
      .filter(style => style !== undefined);

    console.log('🏆 Estilos ordenados:', sortedStyles);

    // Verifica se há estilos válidos
    if (sortedStyles.length === 0) {
      console.warn('⚠️ Nenhum estilo válido encontrado, usando estilo padrão');
      // Usar primeiro estilo disponível como fallback
      const fallbackStyle = Object.values(styleMapping)[0];
      if (fallbackStyle) {
        sortedStyles.push(fallbackStyle);
      }
    }

    const resultStyleId = sortedStyles[0]?.id || 'clássico';
    console.log('🎯 Estilo resultado:', resultStyleId);

    // Atualiza estado com resultado
    setState(prev => ({
      ...prev,
      scores: newScores,
      userProfile: {
        ...prev.userProfile,
        resultStyle: resultStyleId,
        secondaryStyles: sortedStyles.slice(1, 3).map(s => s?.id).filter(Boolean)
      }
    }));

    return {
      primaryStyle: sortedStyles[0],
      secondaryStyles: sortedStyles.slice(1, 3),
      scores: newScores
    };
  }, [state.answers]);

  // Adicionar resposta para etapa
  const addAnswer = useCallback((stepId: string, selections: string[]) => {
    setState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [stepId]: selections
      }
    }));

    // Auto-calcular resultado durante as questões estratégicas
    const step = QUIZ_STEPS[stepId];
    if (step?.type === 'strategic-question') {
      setTimeout(() => {
        calculateResult();
      }, 100);
    }
  }, [calculateResult]);

  // Adicionar resposta estratégica
  const addStrategicAnswer = useCallback((question: string, answer: string) => {
    setState(prev => ({
      ...prev,
      userProfile: {
        ...prev.userProfile,
        strategicAnswers: {
          ...prev.userProfile.strategicAnswers,
          [question]: answer
        }
      }
    }));
  }, []);

  // Obter chave da oferta baseada na resposta estratégica
  const getOfferKey = useCallback(() => {
    const strategicAnswer = state.userProfile.strategicAnswers['Qual desses resultados você mais gostaria de alcançar?'];

    // Mapear resposta para chave de oferta
    const answerToKey: Record<string, string> = {
      'montar-looks-facilidade': 'Montar looks com mais facilidade e confiança',
      'usar-que-tenho': 'Usar o que já tenho e me sentir estilosa',
      'comprar-consciencia': 'Comprar com mais consciência e sem culpa',
      'ser-admirada': 'Ser admirada pela imagem que transmito'
    };

    return answerToKey[strategicAnswer] || 'Montar looks com mais facilidade e confiança';
  }, [state.userProfile.strategicAnswers]);

  // Resetar quiz
  const resetQuiz = useCallback(() => {
    setState(initialState);
  }, []);

  // Verificar se etapa atual tem respostas suficientes
  const isCurrentStepComplete = useMemo(() => {
    const source = stepsSource;
    const currentStepData = source[state.currentStep];

    if (!currentStepData) return false;

    if (currentStepData.type === 'intro') {
      return state.userProfile.userName.trim().length > 0;
    }

    if (currentStepData.type === 'question') {
      const answers = state.answers[state.currentStep] || [];
      return answers.length === currentStepData.requiredSelections;
    }

    if (currentStepData.type === 'strategic-question') {
      const answers = state.answers[state.currentStep] || [];
      return answers.length > 0;
    }

    return true; // Para transições, resultado e oferta
  }, [state.currentStep, state.answers, state.userProfile.userName, stepsSource]);

  // Obter progresso do quiz
  const progress = useMemo(() => {
    const currentIndex = STEP_ORDER.indexOf(state.currentStep);
    const totalSteps = STEP_ORDER.length;
    return Math.min(100, Math.round((currentIndex / (totalSteps - 1)) * 100));
  }, [state.currentStep]);

  // Obter dados da etapa atual (com suporte a personalização via funnelId)
  const currentStepData = useMemo(() => {
    const source = stepsSource;

    // Tentar variações (padded + legacy)
    for (const variant of stepIdVariants(state.currentStep)) {
      if (funnelId) {
        const personalizedTemplate = getPersonalizedStepTemplate(variant, funnelId);
        if (personalizedTemplate) return personalizedTemplate;
      }
      const base = source[variant];
      if (base) return base;
    }

    // Última tentativa com lookup seguro
    const fallback = safeGetStep(source, state.currentStep);
    return fallback;
  }, [state.currentStep, funnelId, stepsSource]);

  // Verificar se pode voltar
  const canGoBack = useMemo(() => {
    const currentIndex = STEP_ORDER.indexOf(state.currentStep);
    return currentIndex > 0;
  }, [state.currentStep]);

  // Verificar se pode avançar
  const canGoForward = useMemo(() => {
    return isCurrentStepComplete;
  }, [isCurrentStepComplete]);

  return {
    // ✅ COMPATIBILIDADE: Interface compatível com QuizApp.tsx
    currentStep: state.currentStep,
    userName: state.userProfile.userName,
    answers: state.answers,
    scores: state.scores,
    strategicAnswers: state.userProfile.strategicAnswers,
    resultStyle: state.userProfile.resultStyle,
    secondaryStyles: state.userProfile.secondaryStyles,
    navigateToStep: nextStep, // Alias para nextStep

    // Estado adicional útil
    state,
    currentStepData,
    progress,
    canGoBack,
    canGoForward,
    isCurrentStepComplete,
    isLoading, // 🎯 NOVO: indicador de carregamento

    // Ações de navegação
    nextStep,
    previousStep,

    // Ações de dados
    setUserName,
    addAnswer,
    addStrategicAnswer,
    calculateResult,
    getOfferKey,
    resetQuiz,
  };
}

export default useQuizState;

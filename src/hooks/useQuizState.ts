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
import { computeResult } from '@/utils/result/computeResult';
import { mergeRuntimeFlags, type QuizRuntimeFlags } from '@/config/quizRuntimeFlags';
import { stepIdVariants, normalizeStepId, getNextFromOrder, getPreviousFromOrder, safeGetStep } from '@/utils/quizStepIds';
import { getPersonalizedStepTemplate } from '../templates/quiz21StepsSimplified';
import { quizEditorBridge } from '@/services/QuizEditorBridge';
import { useFeatureFlags } from './useFeatureFlags';
import { useTemplateLoader } from './useTemplateLoader';
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

export function useQuizState(funnelId?: string, externalSteps?: Record<string, any>, flagsInput?: Partial<QuizRuntimeFlags>) {
  const [state, setState] = useState<QuizState>(initialState);
  const [loadedSteps, setLoadedSteps] = useState<Record<string, any> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const flags = useMemo(() => mergeRuntimeFlags(flagsInput), [flagsInput]);
  const autoAdvanceTimerRef = (globalThis as any).__quizAutoAdvanceTimerRef || { current: null as any };
  ; (globalThis as any).__quizAutoAdvanceTimerRef = autoAdvanceTimerRef;

  // 🎯 FASE 2: Feature Flags e Template Loader
  const { useJsonTemplates, enablePrefetch } = useFeatureFlags();
  const {
    loadQuizEstiloTemplate,
    prefetchNextSteps,
    isLoading: isLoadingTemplate,
    error: templateError,
    clearCache
  } = useTemplateLoader();  // 🎯 NOVO: Carregar steps do bridge se tiver funnelId
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

  // 🎯 FASE 2: Carregar template JSON quando step mudar
  useEffect(() => {
    // Se não usar JSON ou tem externalSteps, pular
    if (!useJsonTemplates || externalSteps || funnelId) {
      return;
    }

    // Extrair número do step (ex: "step-01" -> 1)
    const stepMatch = state.currentStep.match(/step-(\d+)/);
    if (!stepMatch) return;

    const stepNumber = parseInt(stepMatch[1], 10);

    // Carregar template assíncrono
    (async () => {
      try {
        console.log(`🔄 [useQuizState] Carregando JSON template para step ${stepNumber}...`);
        const template = await loadQuizEstiloTemplate(stepNumber);

        if (template) {
          console.log(`✅ [useQuizState] Template ${stepNumber} carregado com sucesso`);

          // Prefetch próximos steps se habilitado
          if (enablePrefetch) {
            prefetchNextSteps(stepNumber);
          }
        }
      } catch (error) {
        console.error(`❌ [useQuizState] Erro ao carregar template ${stepNumber}:`, error);
        // Fallback silencioso - QUIZ_STEPS será usado
      }
    })();
  }, [state.currentStep, useJsonTemplates, externalSteps, funnelId, loadQuizEstiloTemplate, prefetchNextSteps, enablePrefetch]);

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
    console.log('🔄 [useQuizState] Calculando resultado via computeResult util...');
    const { primaryStyleId, secondaryStyleIds, scores } = computeResult({ answers: state.answers });

    // Mapear estilos canônicos para objetos completos
    const primaryStyle = (styleMapping as any)[resolveStyleId(primaryStyleId) as StyleId] || (styleMapping as any)[primaryStyleId as StyleId];
    const secondaryStylesObjects = secondaryStyleIds
      .map(id => (styleMapping as any)[resolveStyleId(id) as StyleId] || (styleMapping as any)[id as StyleId])
      .filter(Boolean);

    setState(prev => ({
      ...prev,
      scores: Object.keys(prev.scores).reduce((acc, k) => { acc[k as keyof typeof prev.scores] = (scores as any)[k] || 0; return acc; }, { ...prev.scores }),
      userProfile: {
        ...prev.userProfile,
        resultStyle: primaryStyle?.id || primaryStyleId,
        secondaryStyles: secondaryStylesObjects.map(s => s.id)
      }
    }));

    return {
      primaryStyle: primaryStyle,
      secondaryStyles: secondaryStylesObjects,
      scores
    };
  }, [state.answers]);

  // Adicionar resposta para etapa
  const addAnswer = useCallback((stepId: string, selections: string[]) => {
    // Cancelar auto advance anterior (se usuário clicou rápido em outra opção)
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }

    setState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [stepId]: selections
      }
    }));

    const sourceStep = QUIZ_STEPS[stepId];
    if (sourceStep?.type === 'strategic-question') {
      setTimeout(() => calculateResult(), 100);
    }

    // Auto advance: apenas para questions normais
    if (flags.enableAutoAdvance && sourceStep?.type === 'question') {
      const nextId = sourceStep.nextStep;
      if (nextId) {
        autoAdvanceTimerRef.current = setTimeout(() => {
          nextStep(nextId);
          autoAdvanceTimerRef.current = null;
        }, flags.autoAdvanceDelayMs);
      }
    }
  }, [calculateResult, flags.enableAutoAdvance, flags.autoAdvanceDelayMs, nextStep]);

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
    let stepData = fallback;
    // Personalização de nome no último passo (resultado/oferta) – substitui {nome}
    if (flags.personalizeFinalStep && stepData && ['offer', 'result'].includes(stepData.type) && state.userProfile.userName) {
      const replaceName = (val: any) => typeof val === 'string' ? val.replace(/\{nome\}/gi, state.userProfile.userName) : val;
      stepData = { ...stepData };
      ['title', 'description', 'subtitle', 'heading', 'content'].forEach(field => {
        if (stepData[field]) stepData[field] = replaceName(stepData[field]);
      });
    }
    return stepData;
  }, [state.currentStep, funnelId, stepsSource, flags.personalizeFinalStep, state.userProfile.userName]);

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
    // Percentuais derivados (0..100). Útil para Step 20 preview avançado.
    scorePercentages: useMemo(() => {
      const total = Object.values(state.scores).reduce((a, b) => a + b, 0);
      if (!total) return {} as Record<string, number>;
      const pct: Record<string, number> = {};
      Object.entries(state.scores).forEach(([k, v]) => { pct[k] = (v / total) * 100; });
      return pct;
    }, [state.scores]),
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
    isLoading, // Carregamento do bridge/funnelId
    isLoadingTemplate, // 🎯 FASE 2: Carregamento de templates JSON
    templateError, // 🎯 FASE 2: Erro no carregamento de templates
    useJsonTemplates, // 🎯 FASE 2: Flag indicando se está usando JSON

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
    flags,
  };
}

export default useQuizState;

import { toast } from '@/components/ui/use-toast';
import { useQuizFlow } from '@/contexts';
import { quizSupabaseService, templateService } from '@/services';
import { useCallback, useEffect, useState } from 'react';
import { StorageService } from '@/services/core/StorageService';
import { useLocation } from 'wouter';
import { appLogger } from '@/lib/utils/appLogger';

/**
 * 🎯 Hook para navegação funcional das 21 etapas
 *
 * Funcionalidades:
 * - ✅ Navegação sequencial (próxima/anterior)
 * - ✅ Persistência de progresso no Supabase
 * - ✅ Validação de etapas
 * - ✅ Carregamento de templates
 * - ✅ Sistema de resultados
 */

export interface StepNavigationState {
  currentStep: number;
  sessionId: string | null;
  isLoading: boolean;
  canGoNext: boolean;
  canGoPrevious: boolean;
  progress: number;
  totalSteps: number;
}

export interface StepData {
  stepNumber: number;
  template: any;
  responses: Record<string, any>;
  isCompleted: boolean;
  isQuizStep: boolean;
}

export const useStepNavigation = (initialStep: number = 1) => {
  const [, setLocation] = useLocation();
  const { currentStep, totalSteps, next, previous, goTo, canProceed } = useQuizFlow();
  const [state, setState] = useState<StepNavigationState>({
    currentStep: initialStep,
    sessionId: null,
    isLoading: false,
    canGoNext: false,
    canGoPrevious: initialStep > 1,
    progress: 0,
    totalSteps: 21,
  });

  const [session, setSession] = useState<any | null>(null);
  const [stepData, setStepData] = useState<Map<number, StepData>>(new Map());

  // ===== INICIALIZAÇÃO DA SESSÃO =====
  const initializeSession = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));

      // Criar usuário e sessão do quiz
      const userName =
        StorageService.safeGetString('userName') ||
        StorageService.safeGetString('quizUserName') ||
        '';

      const user = await quizSupabaseService.createQuizUser({
        name: userName || undefined,
        userAgent: navigator.userAgent,
      });

      const newSession = await quizSupabaseService.createQuizSession({
        funnelId: 'quiz-21-steps',
        quizUserId: user.id,
        totalSteps: 21,
        maxScore: 100,
        metadata: {
          startTime: new Date().toISOString(),
          userAgent: navigator.userAgent,
        },
      });

      setSession(newSession);
      setState(prev => ({
        ...prev,
        sessionId: newSession.id,
        isLoading: false,
      }));

      appLogger.info('✅ Sessão do quiz inicializada:', { data: [newSession.id] });
    } catch (error) {
      appLogger.error('❌ Erro ao inicializar sessão:', { data: [error] });
      toast({
        title: 'Erro',
        description: 'Não foi possível inicializar o quiz',
        variant: 'destructive',
      });
    }
  }, [currentStep]);

  // ===== CARREGAR DADOS DA ETAPA =====
  const loadStepData = useCallback(
    async (stepNumber: number) => {
      try {
        // Buscar template canônico para a etapa
        const result = await templateService.getTemplate(`step-${stepNumber}`);

        if (!result.success || !result.data) {
          // Fallback mínimo: step sem blocks
          const fallbackTemplate = { id: `step-${stepNumber}`, blocks: [] };
          return fallbackTemplate as any;
        }

        const template = result.data;

        // Verificar se é etapa de quiz (tem blocos de pergunta/opções)
        const questionLikeTypes = new Set([
          'multiple-choice', 'single-choice', 'text-input', 'rating',
          'quiz-options', 'options-grid', 'quiz-question',
        ]);
        const isQuizStep = Array.isArray(template.blocks)
          ? template.blocks.some((block: any) => questionLikeTypes.has(block.type))
          : false;

        const data: StepData = {
          stepNumber,
          template,
          responses: session?.responses?.[stepNumber] || {},
          isCompleted: false,
          isQuizStep,
        };

        setStepData(prev => new Map(prev.set(stepNumber, data)));

        appLogger.info(`✅ Dados da etapa ${stepNumber} carregados:`, { data: [{
                    isQuizStep,
                    stepsCount: Array.isArray(template.blocks) ? template.blocks.length : 0,
                  }] });

        return data;
      } catch (error) {
        appLogger.error(`❌ Erro ao carregar etapa ${stepNumber}:`, { data: [error] });
        throw error;
      }
    },
    [session],
  );

  // ===== NAVEGAR PARA ETAPA ESPECÍFICA =====
  const goToStep = useCallback(
    async (stepNumber: number) => {
      if (stepNumber < 1 || stepNumber > 21) {
        toast({
          title: 'Etapa Inválida',
          description: `A etapa ${stepNumber} não existe`,
          variant: 'destructive',
        });
        return;
      }

      try {
        setState(prev => ({ ...prev, isLoading: true }));

        // Carregar dados da etapa
        await loadStepData(stepNumber);

        // Atualizar provedor unificado e encerrar loading local
        goTo(stepNumber);
        setState(prev => ({ ...prev, isLoading: false }));

        // Navegar na URL
        setLocation(`/step/${stepNumber}`);

        // Atualizar sessão no banco
        if (session) {
          await quizSupabaseService.updateQuizSession(session.id, {
            currentStep: stepNumber,
          });
        }

        appLogger.info(`🚀 Navegou para etapa ${stepNumber}`);
      } catch (error) {
        appLogger.error(`❌ Erro ao navegar para etapa ${stepNumber}:`, { data: [error] });
        setState(prev => ({ ...prev, isLoading: false }));

        toast({
          title: 'Erro na Navegação',
          description: `Não foi possível carregar a etapa ${stepNumber}`,
          variant: 'destructive',
        });
      }
    },
    [session, loadStepData, setLocation, goTo],
  );

  // ===== PRÓXIMA ETAPA =====
  const goNext = useCallback(async () => {
    if (currentStep >= (totalSteps || 21)) return;
    next();
  }, [currentStep, totalSteps, next]);

  // ===== ETAPA ANTERIOR =====
  const goPrevious = useCallback(async () => {
    if (currentStep <= 1) return;
    previous();
  }, [currentStep, previous]);

  // ===== SALVAR RESPOSTA =====
  const saveResponse = useCallback(
    async (questionId: string, response: any) => {
      if (!session) return;

      try {
        const currentResponses = session.responses || {};
        const stepResponses = currentResponses[currentStep] || {};

        const updatedResponses = {
          ...currentResponses,
          [currentStep]: {
            ...stepResponses,
            [questionId]: response,
          },
        };

        // Atualizar sessão no banco
        await quizSupabaseService.updateQuizSession(session.id, {
          metadata: { ...(session.metadata || {}), responses: updatedResponses },
        });

        // Atualizar estado local
  setSession((prev: any) =>
          prev
            ? {
                ...prev,
                responses: updatedResponses,
              }
            : null,
        );

        // Validar se pode avançar
        const currentStepData = stepData.get(currentStep);
        if (currentStepData?.isQuizStep) {
          const hasRequiredAnswers = validateStepResponses(currentStep, updatedResponses);
          setState(prev => ({
            ...prev,
            canGoNext: hasRequiredAnswers,
          }));
        }

        appLogger.info(`💾 Resposta salva para ${questionId}:`, { data: [response] });
      } catch (error) {
        appLogger.error('❌ Erro ao salvar resposta:', { data: [error] });
        toast({
          title: 'Erro ao Salvar',
          description: 'Não foi possível salvar sua resposta',
          variant: 'destructive',
        });
      }
    },
    [session, currentStep, stepData],
  );

  // ===== VALIDAÇÃO DE RESPOSTAS =====
  const validateStepResponses = useCallback(
    (stepNumber: number, responses: Record<string, any>) => {
      const stepData = responses[stepNumber];
      if (!stepData) return false;

      // Verificar se há pelo menos uma resposta
      const hasAnswers = Object.keys(stepData).length > 0;

      // TODO: Adicionar validações específicas por tipo de etapa

      return hasAnswers;
    },
    [],
  );

  // ===== FINALIZAR QUIZ =====
  const completeQuiz = useCallback(async () => {
    if (!session) return;

    try {
      setState(prev => ({ ...prev, isLoading: true }));

      // Calcular resultados
      const results = await calculateQuizResults(session.responses);

      // Marcar como completado
      await quizSupabaseService.updateQuizSession(session.id, {
        status: 'completed',
        completedAt: new Date(),
        metadata: { ...(session.metadata || {}), results },
      });

      // Navegar para página de resultados
      setLocation('/quiz/resultado');

      toast({
        title: 'Quiz Concluído!',
        description: 'Seu resultado está pronto',
        variant: 'default',
      });

      appLogger.info('🎉 Quiz finalizado com sucesso!');
    } catch (error) {
      appLogger.error('❌ Erro ao finalizar quiz:', { data: [error] });
      toast({
        title: 'Erro',
        description: 'Não foi possível finalizar o quiz',
        variant: 'destructive',
      });
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [session, setLocation]);

  // ===== CALCULAR RESULTADOS =====
  const calculateQuizResults = useCallback(
    async (responses: Record<string, any>) => {
      if (!session) return null;

      try {
        appLogger.info('📊 Iniciando cálculo de resultados...');

        // Importar serviço de resultados
        const { quizResultsService } = await import('@/services/quizResultsService');

        // Preparar sessão para o serviço
        const sessionForCalculation = {
          id: session.id,
          session_id: session.session_id || session.id,
          quiz_user_id: session.quiz_user_id,
          responses,
          current_step: session.current_step,
        };

        // Calcular resultados completos
        const results = await quizResultsService.calculateResults(sessionForCalculation);

        appLogger.info('✅ Resultados calculados:', { data: [{
                    primaryStyle: results.styleProfile.primaryStyle,
                    completionScore: results.completionScore,
                  }] });

        // ✅ Normalizar e persistir no core para a Etapa 20 (consumo pelos blocos via useQuizResult)
        try {
          const scores = results.styleProfile.styleScores || {};
          const total = Object.values(scores).reduce((a: number, b: number) => a + (b as number), 0) || 1;
          const ordered = Object.entries(scores)
            .map(([category, score]) => ({
              style: category,
              category,
              score: Number(score) || 0,
              percentage: Math.round(((Number(score) || 0) / total) * 100),
            }))
            .sort((a, b) => b.score - a.score);

          const primary = ordered[0] || {
            style: results.styleProfile.primaryStyle,
            category: results.styleProfile.primaryStyle,
            score: 0,
            percentage: 0,
          };
          const secondary = ordered.slice(1);

          const payload = {
            version: 'v1',
            primaryStyle: primary,
            secondaryStyles: secondary,
            scores,
            totalQuestions: results.metadata?.answeredQuestions || total,
            userData: { name: (results as any).userName || '' },
          };

          StorageService.safeSetJSON('quizResult', payload);
          if ((results as any).userName) {
            StorageService.safeSetString('userName', (results as any).userName);
            StorageService.safeSetString('quizUserName', (results as any).userName);
          }
        } catch (e) {
          appLogger.warn('Não foi possível normalizar/persistir resultado no core:', { data: [e] });
        }

        return {
          totalAnswers: results.metadata.answeredQuestions,
          completionRate: results.completionScore,
          styleProfile: {
            primaryStyle: results.styleProfile.primaryStyle,
            secondaryStyle: results.styleProfile.secondaryStyle,
            colorPreferences: results.styleProfile.colorPalette,
            confidence: results.styleProfile.confidence,
          },
          recommendations: {
            wardrobe: results.recommendations.wardrobe,
            shopping: results.recommendations.shopping,
            styling: results.recommendations.styling,
          },
          fullResults: results,
        };
      } catch (error) {
        appLogger.error('❌ Erro no cálculo de resultados:', { data: [error] });

        // Fallback para cálculo básico
        const totalAnswers = Object.keys(responses).length;
        const stylePreferences = extractStylePreferences(responses);

        // 🔄 Persistir fallback mínimo para destravar etapa 20
        try {
          const primaryCategory = stylePreferences?.primaryStyle || 'Natural';
          const payload = {
            version: 'v1',
            primaryStyle: {
              style: primaryCategory,
              category: primaryCategory,
              score: totalAnswers,
              percentage: Math.min(100, Math.round((totalAnswers / 21) * 100)),
            },
            secondaryStyles: [],
            scores: { [primaryCategory]: totalAnswers },
            totalQuestions: totalAnswers,
            userData: { name: StorageService.safeGetString('userName') || StorageService.safeGetString('quizUserName') || '' },
          };
          StorageService.safeSetJSON('quizResult', payload);
        } catch {}

        return {
          totalAnswers,
          completionRate: (totalAnswers / 21) * 100,
          styleProfile: stylePreferences,
          recommendations: generateRecommendations(stylePreferences),
        };
      }
    },
    [session],
  );

  // ===== EXTRAIR PREFERÊNCIAS DE ESTILO =====
  const extractStylePreferences = useCallback((_responses: Record<string, any>) => {
    // Analisar respostas para determinar perfil de estilo
    // TODO: Implementar algoritmo de análise das respostas

    return {
      primaryStyle: 'casual-elegante',
      colorPreferences: ['neutros', 'terrosos'],
      occasionPriority: 'versatilidade',
      confidence: 0.85,
    };
  }, []);

  // ===== GERAR RECOMENDAÇÕES =====
  const generateRecommendations = useCallback((_styleProfile: any) => {
    // TODO: Implementar sistema de recomendações baseado no perfil

    return {
      products: [],
      tips: ['Use cores neutras como base', 'Invista em peças versáteis'],
      nextSteps: ['Agende uma consultoria', 'Veja nosso catálogo personalizado'],
    };
  }, []);

  // ===== INICIALIZAÇÃO =====
  useEffect(() => {
    initializeSession();
  }, [initializeSession]);

  // Sincronizar estado básico com o provider unificado
  useEffect(() => {
    setState(prev => ({
      ...prev,
      currentStep,
      totalSteps: totalSteps || 21,
      canGoNext:
        (canProceed && currentStep < (totalSteps || 21)) || currentStep < (totalSteps || 21),
      canGoPrevious: currentStep > 1,
      progress: (currentStep / (totalSteps || 21)) * 100,
    }));
  }, [currentStep, totalSteps, canProceed]);

  // ===== RETORNO DO HOOK =====
  return {
    // Estado
    ...state,
    session,

    // Navegação
    goToStep,
    goNext,
    goPrevious,

    // Dados
    getCurrentStepData: () => stepData.get(currentStep),
    getStepData: (step: number) => stepData.get(step),

    // Respostas
    saveResponse,

    // Finalização
    completeQuiz,

    // Utilitários
    isLastStep: currentStep === (totalSteps || 21),
    isFirstStep: currentStep === 1,
    getProgressText: () => `${currentStep} de ${totalSteps || state.totalSteps}`,
  };
};

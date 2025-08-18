// @ts-nocheck
import { toast } from '@/components/ui/use-toast';
import { quizSupabaseService } from '@/services/quizSupabaseService';
import { templateService } from '@/services/templateService';
import type { QuizSession } from '@/types/quiz';
import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'wouter';

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
  const [state, setState] = useState<StepNavigationState>({
    currentStep: initialStep,
    sessionId: null,
    isLoading: false,
    canGoNext: false,
    canGoPrevious: initialStep > 1,
    progress: 0,
    totalSteps: 21,
  });

  const [session, setSession] = useState<QuizSession | null>(null);
  const [stepData, setStepData] = useState<Map<number, StepData>>(new Map());

  // ===== INICIALIZAÇÃO DA SESSÃO =====
  const initializeSession = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));

      // Criar ou recuperar sessão do quiz
      const newSession = await quizSupabaseService.createQuizSession({
        current_step: state.currentStep,
        responses: {},
        is_completed: false,
        funnel_id: 'quiz-21-steps', // ID do funil das 21 etapas
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

      console.log('✅ Sessão do quiz inicializada:', newSession.id);
    } catch (error) {
      console.error('❌ Erro ao inicializar sessão:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível inicializar o quiz',
        variant: 'destructive',
      });
    }
  }, [state.currentStep]);

  // ===== CARREGAR DADOS DA ETAPA =====
  const loadStepData = useCallback(
    async (stepNumber: number) => {
      try {
        // Carregar template da etapa
        const template = await templateService.getTemplateByStep(stepNumber);

        if (!template) {
          throw new Error(`Template não encontrado para etapa ${stepNumber}`);
        }

        // Verificar se é etapa de quiz (tem perguntas)
        const isQuizStep =
          template.blocks?.some((block: any) =>
            ['multiple-choice', 'single-choice', 'text-input', 'rating'].includes(block.type)
          ) || false;

        const data: StepData = {
          stepNumber,
          template,
          responses: session?.responses?.[stepNumber] || {},
          isCompleted: false,
          isQuizStep,
        };

        setStepData(prev => new Map(prev.set(stepNumber, data)));

        console.log(`✅ Dados da etapa ${stepNumber} carregados:`, {
          templateId: template.metadata.id,
          isQuizStep,
          blocksCount: template.blocks?.length || 0,
        });

        return data;
      } catch (error) {
        console.error(`❌ Erro ao carregar etapa ${stepNumber}:`, error);
        throw error;
      }
    },
    [session]
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

        // Atualizar estado
        setState(prev => ({
          ...prev,
          currentStep: stepNumber,
          canGoNext: stepNumber < 21,
          canGoPrevious: stepNumber > 1,
          progress: (stepNumber / 21) * 100,
          isLoading: false,
        }));

        // Navegar na URL
        setLocation(`/step/${stepNumber}`);

        // Atualizar sessão no banco
        if (session) {
          await quizSupabaseService.updateQuizSession(session.id, {
            current_step: stepNumber,
          });
        }

        console.log(`🚀 Navegou para etapa ${stepNumber}`);
      } catch (error) {
        console.error(`❌ Erro ao navegar para etapa ${stepNumber}:`, error);
        setState(prev => ({ ...prev, isLoading: false }));

        toast({
          title: 'Erro na Navegação',
          description: `Não foi possível carregar a etapa ${stepNumber}`,
          variant: 'destructive',
        });
      }
    },
    [session, loadStepData, setLocation]
  );

  // ===== PRÓXIMA ETAPA =====
  const goNext = useCallback(async () => {
    if (state.currentStep >= 21) return;

    await goToStep(state.currentStep + 1);
  }, [state.currentStep, goToStep]);

  // ===== ETAPA ANTERIOR =====
  const goPrevious = useCallback(async () => {
    if (state.currentStep <= 1) return;

    await goToStep(state.currentStep - 1);
  }, [state.currentStep, goToStep]);

  // ===== SALVAR RESPOSTA =====
  const saveResponse = useCallback(
    async (questionId: string, response: any) => {
      if (!session) return;

      try {
        const currentResponses = session.responses || {};
        const stepResponses = currentResponses[state.currentStep] || {};

        const updatedResponses = {
          ...currentResponses,
          [state.currentStep]: {
            ...stepResponses,
            [questionId]: response,
          },
        };

        // Atualizar sessão no banco
        await quizSupabaseService.updateQuizSession(session.id, {
          responses: updatedResponses,
        });

        // Atualizar estado local
        setSession(prev =>
          prev
            ? {
                ...prev,
                responses: updatedResponses,
              }
            : null
        );

        // Validar se pode avançar
        const currentStepData = stepData.get(state.currentStep);
        if (currentStepData?.isQuizStep) {
          const hasRequiredAnswers = validateStepResponses(state.currentStep, updatedResponses);
          setState(prev => ({
            ...prev,
            canGoNext: hasRequiredAnswers,
          }));
        }

        console.log(`💾 Resposta salva para ${questionId}:`, response);
      } catch (error) {
        console.error('❌ Erro ao salvar resposta:', error);
        toast({
          title: 'Erro ao Salvar',
          description: 'Não foi possível salvar sua resposta',
          variant: 'destructive',
        });
      }
    },
    [session, state.currentStep, stepData]
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
    []
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
        is_completed: true,
        completed_at: new Date().toISOString(),
        results,
      });

      // Navegar para página de resultados
      setLocation('/quiz/resultado');

      toast({
        title: 'Quiz Concluído!',
        description: 'Seu resultado está pronto',
        variant: 'default',
      });

      console.log('🎉 Quiz finalizado com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao finalizar quiz:', error);
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
        console.log('📊 Iniciando cálculo de resultados...');

        // Importar serviço de resultados
        const { quizResultsService } = await import('@/services/quizResultsService');

        // Preparar sessão para o serviço
        const sessionForCalculation = {
          id: session.id,
          session_id: session.session_id || session.id,
          quiz_user_id: session.quiz_user_id,
          responses: responses,
          current_step: session.current_step,
        };

        // Calcular resultados completos
        const results = await quizResultsService.calculateResults(sessionForCalculation);

        console.log('✅ Resultados calculados:', {
          primaryStyle: results.styleProfile.primaryStyle,
          completionScore: results.completionScore,
        });

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
        console.error('❌ Erro no cálculo de resultados:', error);

        // Fallback para cálculo básico
        const totalAnswers = Object.keys(responses).length;
        const stylePreferences = extractStylePreferences(responses);

        return {
          totalAnswers,
          completionRate: (totalAnswers / 21) * 100,
          styleProfile: stylePreferences,
          recommendations: generateRecommendations(stylePreferences),
        };
      }
    },
    [session]
  );

  // ===== EXTRAIR PREFERÊNCIAS DE ESTILO =====
  const extractStylePreferences = useCallback((responses: Record<string, any>) => {
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
  const generateRecommendations = useCallback((styleProfile: any) => {
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
    getCurrentStepData: () => stepData.get(state.currentStep),
    getStepData: (step: number) => stepData.get(step),

    // Respostas
    saveResponse,

    // Finalização
    completeQuiz,

    // Utilitários
    isLastStep: state.currentStep === 21,
    isFirstStep: state.currentStep === 1,
    getProgressText: () => `${state.currentStep} de ${state.totalSteps}`,
  };
};

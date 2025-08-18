// Hook de integração com Supabase para o Quiz - ATUALIZADO para Quiz21StepsProvider
import { useToast } from '@/components/ui/use-toast';
import { calculateQuizResult } from '@/lib/quizEngine';
import { quizSupabaseService } from '@/services/quizSupabaseService';
import { QuizAnswer, QuizQuestion, QuizResult } from '@/types/quiz';
import { useCallback, useEffect, useState } from 'react';

// Interface para a sessão integrada com Quiz21StepsProvider
interface Quiz21SupabaseSession {
  id: string | null;
  userId: string | null;
  funnelId: string;
  status: 'idle' | 'started' | 'in_progress' | 'completed' | 'abandoned';
  currentStep: number;
  totalSteps: number;
  score: number;
  startedAt: Date | null;
  lastActivity: Date | null;
  responses: QuizAnswer[];
  strategicResponses: any[];
  result: QuizResult | null;
  // Propriedades derivadas do status para compatibilidade
  isStarted: boolean;
  isCompleted: boolean;
}

// Interface para parâmetros UTM
interface UtmParameters {
  source?: string;
  medium?: string;
  campaign?: string;
}

// Função utilitária para obter parâmetros UTM da URL
const getUtmParameters = (): UtmParameters => {
  if (typeof window === 'undefined') return {};

  const urlParams = new URLSearchParams(window.location.search);
  return {
    source: urlParams.get('utm_source') || undefined,
    medium: urlParams.get('utm_medium') || undefined,
    campaign: urlParams.get('utm_campaign') || undefined,
  };
};

/**
 * Hook personalizado para integrar o quiz com o Supabase
 * Gerencia todo o ciclo de vida da sessão do quiz
 */
export const useSupabaseQuiz = (questions: QuizQuestion[] = []) => {
  const { toast } = useToast();

  // Estado da sessão do quiz
  const [session, setSession] = useState<Quiz21SupabaseSession>({
    id: null,
    userId: null,
    funnelId: 'default-funnel',
    status: 'idle',
    currentStep: 1,
    totalSteps: 21,
    score: 0,
    startedAt: null,
    lastActivity: null,
    responses: [],
    strategicResponses: [],
    result: null,
    isStarted: false,
    isCompleted: false,
  });

  // Estado de carregamento
  const [isLoading, setIsLoading] = useState(false);

  // Estado de erro
  const [error, setError] = useState<string | null>(null);

  // Inicializar o quiz com dados do usuário
  const startQuiz = useCallback(
    async (userData: { name: string; email: string; quizId: string }) => {
      setIsLoading(true);
      setError(null);

      try {
        // Obter parâmetros UTM
        const utmParams = getUtmParameters();

        // Criar usuário no Supabase
        const user = await quizSupabaseService.createQuizUser({
          name: userData.name,
          email: userData.email,
          utmSource: utmParams.source,
          utmMedium: utmParams.medium,
          utmCampaign: utmParams.campaign,
          userAgent: navigator.userAgent,
        });

        // Criar sessão do quiz
        const quizSession = await quizSupabaseService.createQuizSession({
          funnelId: userData.quizId,
          quizUserId: user.id,
          totalSteps: questions.length,
          maxScore: 100,
        });

        // Atualizar estado local
        setSession({
          ...session,
          id: quizSession.id,
          userId: user.id,
          status: 'started',
          currentStep: 0,
          responses: [],
          isStarted: true,
          isCompleted: false,
        });

        // Rastrear evento de início
        await quizSupabaseService.trackEvent({
          funnelId: userData.quizId,
          eventType: 'quiz_started',
          sessionId: quizSession.id,
          userId: user.id,
        });

        return {
          success: true,
          sessionId: quizSession.id,
          userId: user.id,
        };
      } catch (error) {
        console.error('Erro ao iniciar o quiz:', error);
        setError('Não foi possível iniciar o quiz. Tente novamente.');

        toast({
          title: 'Erro ao iniciar o quiz',
          description: 'Por favor, tente novamente.',
          variant: 'destructive',
        });

        return { success: false };
      } finally {
        setIsLoading(false);
      }
    },
    [questions.length, session, toast]
  );

  // Salvar resposta e avançar
  const saveAnswer = useCallback(
    async (questionId: string, optionId: string) => {
      if (!session.id) {
        setError('Sessão do quiz não iniciada');
        return false;
      }

      setIsLoading(true);

      try {
        // Encontrar a pergunta e opção
        const question = questions.find(q => q.id === questionId);
        const option = question?.options.find(o => o.id === optionId);

        if (!question || !option) {
          throw new Error('Pergunta ou opção não encontrada');
        }

        // Salvar resposta no Supabase
        await quizSupabaseService.saveQuizResponse({
          sessionId: session.id,
          stepNumber: session.currentStep + 1,
          questionId,
          questionText: question.text || question.question,
          answerValue: optionId,
          answerText: option.text,
          scoreEarned: option.weight || 1,
          responseTimeMs: 0, // Poderia implementar medição de tempo
        });

        // Atualizar sessão
        await quizSupabaseService.updateQuizSession(session.id, {
          currentStep: session.currentStep + 1,
          status: 'in_progress',
        });

        // Atualizar estado local
        const newAnswer: QuizAnswer = { questionId, optionId };
        const newResponses = [...session.responses, newAnswer];

        setSession({
          ...session,
          currentStep: session.currentStep + 1,
          status: 'in_progress',
          responses: newResponses,
        });

        return true;
      } catch (error) {
        console.error('Erro ao salvar resposta:', error);
        setError('Erro ao salvar resposta. Tente novamente.');

        toast({
          title: 'Erro ao salvar resposta',
          description: 'Por favor, tente novamente.',
          variant: 'destructive',
        });

        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [session, questions, toast]
  );

  // Calcular e salvar resultado final
  const completeQuiz = useCallback(async () => {
    if (!session.id || session.responses.length === 0) {
      setError('Não há respostas para calcular o resultado');
      return null;
    }

    setIsLoading(true);

    try {
      // Calcular resultado
      const result = calculateQuizResult(session.responses, questions);

      // Atualizar sessão no Supabase
      await quizSupabaseService.updateQuizSession(session.id, {
        status: 'completed',
        score: result.primaryStyle.score,
        completedAt: new Date(),
      });

      // Salvar resultado detalhado
      const resultId = await quizSupabaseService.saveQuizResult({
        sessionId: session.id,
        resultType: result.primaryStyle.style,
        resultTitle: result.primaryStyle.category,
        resultDescription: `Seu estilo predominante é ${result.primaryStyle.category} com ${result.primaryStyle.percentage}% de compatibilidade.`,
        resultData: {
          primaryStyle: result.primaryStyle,
          secondaryStyles: result.secondaryStyles,
          scores: result.scores,
          totalQuestions: questions.length,
        },
      });

      // Atualizar estado local
      setSession({
        ...session,
        status: 'completed',
        result,
        isCompleted: true,
      });

      // Salvar no localStorage para referência futura
      localStorage.setItem('quizResult', JSON.stringify(result));

      return {
        success: true,
        resultId,
        result,
      };
    } catch (error) {
      console.error('Erro ao completar o quiz:', error);
      setError('Erro ao calcular resultado. Tente novamente.');

      toast({
        title: 'Erro ao completar o quiz',
        description: 'Por favor, tente novamente.',
        variant: 'destructive',
      });

      return { success: false };
    } finally {
      setIsLoading(false);
    }
  }, [session, questions, toast]);

  // Registrar conversão (quando o usuário adquire um produto)
  const recordConversion = useCallback(
    async (conversionData: {
      productId: string;
      productName: string;
      value: number;
      currency?: string;
    }) => {
      if (!session.id) {
        setError('Sessão do quiz não iniciada');
        return false;
      }

      try {
        await quizSupabaseService.recordConversion({
          sessionId: session.id,
          conversionType: 'purchase',
          conversionValue: conversionData.value,
          currency: conversionData.currency || 'BRL',
          productId: conversionData.productId,
          productName: conversionData.productName,
        });

        return true;
      } catch (error) {
        console.error('Erro ao registrar conversão:', error);
        return false;
      }
    },
    [session.id]
  );

  // Reiniciar o quiz
  const resetQuiz = useCallback(() => {
    setSession({
      id: null,
      userId: null,
      funnelId: 'default-funnel',
      status: 'idle',
      currentStep: 0,
      totalSteps: questions.length,
      score: 0,
      startedAt: null,
      lastActivity: null,
      responses: [],
      strategicResponses: [],
      result: null,
      isStarted: false,
      isCompleted: false,
    });

    setError(null);
  }, [questions.length]);

  // Voltar para a pergunta anterior
  const goToPreviousQuestion = useCallback(() => {
    if (session.currentStep > 0) {
      setSession({
        ...session,
        currentStep: session.currentStep - 1,
        responses: session.responses.slice(0, -1),
      });
    }
  }, [session]);

  // Carregar resultado salvo (se disponível)
  useEffect(() => {
    const loadSavedResult = () => {
      try {
        const savedResult = localStorage.getItem('quizResult');
        if (savedResult) {
          const parsedResult = JSON.parse(savedResult);

          // Verificar se o resultado tem o formato esperado
          if (parsedResult.primaryStyle && parsedResult.secondaryStyles) {
            setSession(prev => ({
              ...prev,
              status: 'completed',
              result: parsedResult,
              isCompleted: true,
            }));
          }
        }
      } catch (error) {
        console.error('Erro ao carregar resultado salvo:', error);
      }
    };

    // Carregar apenas se não houver sessão ativa
    if (!session.isStarted && !session.result) {
      loadSavedResult();
    }
  }, []);

  return {
    // Estado
    session,
    currentStep: session.currentStep,
    responses: session.responses,
    result: session.result,
    isLoading,
    error,
    isStarted: session.isStarted,
    isCompleted: session.isCompleted,

    // Ações
    startQuiz,
    saveAnswer,
    completeQuiz,
    resetQuiz,
    goToPreviousQuestion,
    recordConversion,
  };
};

export default useSupabaseQuiz;

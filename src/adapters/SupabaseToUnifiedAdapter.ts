/**
 * 🔄 ADAPTADOR DE COMPATIBILIDADE
 *
 * Permite transição gradual do sistema Supabase para o sistema CORE
 * Simula a interface do useSupabaseQuiz usando o novo sistema unificado
 */

import { useQuizFlow } from '@/components/core/QuizFlow';
import { QuizAnalyticsService } from '@/services/core/QuizAnalyticsService';
import { QuizDataService } from '@/services/core/QuizDataService';

export interface SupabaseCompatibleSession {
  responses: Record<string, any>;
  result: any;
  isCompleted: boolean;
  currentStep: number;
  progress: number;
  styleScores: Record<string, number>;
  userAnswers: any[];
}

export interface SupabaseCompatibleActions {
  submitAnswer: (questionId: string, answer: any) => void;
  calculateResult: () => void;
  navigateToStep: (step: number) => void;
  resetQuiz: () => void;
  saveProgress: () => void;
}

export interface SupabaseCompatibleQuiz {
  session: SupabaseCompatibleSession;
  isLoading: boolean;
  error: string | null;
  actions: SupabaseCompatibleActions;
}

/**
 * 🎯 Hook adaptador que simula useSupabaseQuiz usando sistema CORE
 */
export const useSupabaseCompatibleQuiz = (): SupabaseCompatibleQuiz => {
  const { quizState, actions } = useQuizFlow();
  const dataService = QuizDataService.getInstance();
  const analytics = QuizAnalyticsService.getInstance();

  // Simular interface do Supabase
  const session: SupabaseCompatibleSession = {
    responses: quizState.answers,
    result: quizState.quizResult,
    isCompleted: quizState.isCompleted,
    currentStep: quizState.currentStep,
    progress: quizState.progress,
    styleScores: quizState.styleScores || {},
    userAnswers: Object.entries(quizState.answers).map(([questionId, answer]) => ({
      questionId,
      answer,
      timestamp: new Date().toISOString(),
    })),
  };

  const compatibleActions: SupabaseCompatibleActions = {
    submitAnswer: (questionId: string, answer: any) => {
      actions.answerScoredQuestion(questionId, answer);

      // Log compatibilidade
      analytics.trackEvent('compatibility_answer_submitted', {
        questionId,
        answer,
        system: 'unified_via_adapter',
      });
    },

    calculateResult: () => {
      actions.generateResult();

      analytics.trackEvent('compatibility_result_calculated', {
        system: 'unified_via_adapter',
        result: quizState.quizResult,
      });
    },

    navigateToStep: (step: number) => {
      actions.navigateToStep(step);

      analytics.trackEvent('compatibility_navigation', {
        fromStep: quizState.currentStep,
        toStep: step,
        system: 'unified_via_adapter',
      });
    },

    resetQuiz: () => {
      actions.resetQuiz();

      analytics.trackEvent('compatibility_quiz_reset', {
        system: 'unified_via_adapter',
      });
    },

    saveProgress: () => {
      // O sistema CORE salva automaticamente
      analytics.trackEvent('compatibility_progress_saved', {
        step: quizState.currentStep,
        progress: quizState.progress,
        system: 'unified_via_adapter',
      });
    },
  };

  return {
    session,
    isLoading: false, // Sistema CORE é sempre instantâneo
    error: null,
    actions: compatibleActions,
  };
};

/**
 * 🔄 Factory para criar adaptador baseado em feature flag
 */
export const createQuizAdapter = (useUnifiedSystem: boolean = false) => {
  if (useUnifiedSystem) {
    return useSupabaseCompatibleQuiz;
  } else {
    // Retorna hook original do Supabase (precisa ser importado dinamicamente)
    return async () => {
      const { useSupabaseQuiz } = await import('@/hooks/useSupabaseQuiz');
      return useSupabaseQuiz();
    };
  }
};

/**
 * 🎯 Utilitário para migração gradual
 */
export const migrateFromSupabaseToUnified = {
  /**
   * Converte dados de sessão do Supabase para formato unificado
   */
  convertSession: (supabaseSession: any) => {
    return {
      answers: supabaseSession.responses || {},
      currentStep: supabaseSession.currentStep || 1,
      progress: supabaseSession.progress || 0,
      isCompleted: supabaseSession.isCompleted || false,
      quizResult: supabaseSession.result || null,
      styleScores: supabaseSession.styleScores || {},
    };
  },

  /**
   * Valida compatibilidade entre resultados
   */
  validateCompatibility: (supabaseResult: any, unifiedResult: any) => {
    const differences = [];

    if (supabaseResult.currentStep !== unifiedResult.currentStep) {
      differences.push(
        `currentStep: ${supabaseResult.currentStep} vs ${unifiedResult.currentStep}`
      );
    }

    if (supabaseResult.isCompleted !== unifiedResult.isCompleted) {
      differences.push(
        `isCompleted: ${supabaseResult.isCompleted} vs ${unifiedResult.isCompleted}`
      );
    }

    if (Math.abs(supabaseResult.progress - unifiedResult.progress) > 0.01) {
      differences.push(`progress: ${supabaseResult.progress} vs ${unifiedResult.progress}`);
    }

    return {
      isCompatible: differences.length === 0,
      differences,
    };
  },
};

export default useSupabaseCompatibleQuiz;

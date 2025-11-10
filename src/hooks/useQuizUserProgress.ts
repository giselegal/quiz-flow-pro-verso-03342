/**
 * 📊 Hook para gerenciamento centralizado do progresso do usuário em quizzes
 * 
 * Responsável por:
 * - Rastreamento de respostas do usuário
 * - Cálculo de pontuação em tempo real
 * - Persistência de progresso (localStorage)
 * - Sincronização com backend (opcional)
 */

import { useState, useEffect, useCallback } from 'react';
import { appLogger } from '@/lib/utils/appLogger';

export interface QuizUserAnswer {
  stepId: number;
  questionId?: string;
  selectedOptions: Array<{
    id: string;
    value: string;
    points?: number;
  }>;
  inputValue?: string;
  timestamp: number;
}

export interface QuizProgress {
  funnelId: string;
  userId?: string;
  answers: QuizUserAnswer[];
  currentStepIndex: number;
  startedAt: number;
  lastUpdatedAt: number;
  completedAt?: number;
  totalPoints: number;
  maxPossiblePoints?: number;
}

export interface UseQuizUserProgressOptions {
  funnelId: string;
  userId?: string;
  initialStep?: number;
  persistToLocalStorage?: boolean;
  syncWithBackend?: boolean;
  onProgressUpdate?: (progress: QuizProgress) => void;
}

export const useQuizUserProgress = ({
  funnelId,
  userId,
  initialStep = 0,
  persistToLocalStorage = true,
  syncWithBackend = false,
  onProgressUpdate,
}: UseQuizUserProgressOptions) => {
  // Estado principal de progresso
  const [progress, setProgress] = useState<QuizProgress>(() => {
    // Tentar recuperar do localStorage se disponível
    if (persistToLocalStorage && typeof window !== 'undefined') {
      const savedProgress = localStorage.getItem(`quiz_progress_${funnelId}`);
      if (savedProgress) {
        try {
          return JSON.parse(savedProgress);
        } catch (e) {
          appLogger.error('Erro ao carregar progresso salvo:', { data: [e] });
        }
      }
    }

    // Estado inicial
    return {
      funnelId,
      userId,
      answers: [],
      currentStepIndex: initialStep,
      startedAt: Date.now(),
      lastUpdatedAt: Date.now(),
      totalPoints: 0,
    };
  });

  // Salvar no localStorage quando houver mudanças
  useEffect(() => {
    if (persistToLocalStorage && typeof window !== 'undefined') {
      localStorage.setItem(`quiz_progress_${funnelId}`, JSON.stringify(progress));
    }
    
    // Callback opcional
    if (onProgressUpdate) {
      onProgressUpdate(progress);
    }
  }, [progress, funnelId, persistToLocalStorage, onProgressUpdate]);

  // Registrar resposta do usuário
  const recordAnswer = useCallback((stepId: number, answer: Omit<QuizUserAnswer, 'stepId' | 'timestamp'>) => {
    setProgress(prev => {
      // Calcular pontos da resposta atual
      const pointsFromAnswer = answer.selectedOptions.reduce((sum, opt) => sum + (opt.points || 0), 0);
      
      // Verificar se já existe uma resposta para esse step
      const existingAnswerIndex = prev.answers.findIndex(a => a.stepId === stepId);
      
      let newAnswers: QuizUserAnswer[];
      let pointsDelta = pointsFromAnswer;
      
      if (existingAnswerIndex >= 0) {
        // Substituir resposta existente
        const oldPoints = prev.answers[existingAnswerIndex].selectedOptions
          .reduce((sum, opt) => sum + (opt.points || 0), 0);
        
        pointsDelta = pointsFromAnswer - oldPoints;
        
        newAnswers = [...prev.answers];
        newAnswers[existingAnswerIndex] = {
          ...answer,
          stepId,
          timestamp: Date.now(),
        };
      } else {
        // Adicionar nova resposta
        newAnswers = [...prev.answers, {
          ...answer,
          stepId,
          timestamp: Date.now(),
        }];
      }

      return {
        ...prev,
        answers: newAnswers,
        totalPoints: prev.totalPoints + pointsDelta,
        lastUpdatedAt: Date.now(),
      };
    });
  }, []);

  // Avançar para o próximo step
  const goToNextStep = useCallback(() => {
    setProgress(prev => ({
      ...prev,
      currentStepIndex: prev.currentStepIndex + 1,
      lastUpdatedAt: Date.now(),
    }));
  }, []);

  // Voltar para o step anterior
  const goToPreviousStep = useCallback(() => {
    setProgress(prev => ({
      ...prev,
      currentStepIndex: Math.max(0, prev.currentStepIndex - 1),
      lastUpdatedAt: Date.now(),
    }));
  }, []);

  // Ir para um step específico
  const goToStep = useCallback((stepIndex: number) => {
    setProgress(prev => ({
      ...prev,
      currentStepIndex: Math.max(0, stepIndex),
      lastUpdatedAt: Date.now(),
    }));
  }, []);

  // Completar o quiz
  const completeQuiz = useCallback(() => {
    setProgress(prev => ({
      ...prev,
      completedAt: Date.now(),
      lastUpdatedAt: Date.now(),
    }));
  }, []);

  // Resetar o progresso
  const resetProgress = useCallback(() => {
    setProgress({
      funnelId,
      userId,
      answers: [],
      currentStepIndex: 0,
      startedAt: Date.now(),
      lastUpdatedAt: Date.now(),
      totalPoints: 0,
    });
    
    // Limpar também do localStorage se necessário
    if (persistToLocalStorage && typeof window !== 'undefined') {
      localStorage.removeItem(`quiz_progress_${funnelId}`);
    }
  }, [funnelId, userId, persistToLocalStorage]);

  // Sincronização com backend
  useEffect(() => {
    if (!syncWithBackend) return;

    // TODO: Implementar lógica de sincronização com backend
    // Esta seria uma versão simplificada:
    const syncProgress = async () => {
      try {
        // const response = await fetch('/api/quiz/progress', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify(progress),
        // });
        // const data = await response.json();
        appLogger.info('Progresso sincronizado com backend:', { data: [progress] });
      } catch (error) {
        appLogger.error('Erro ao sincronizar progresso:', { data: [error] });
      }
    };

    // Debounce para evitar muitas chamadas API
    const timeoutId = setTimeout(syncProgress, 2000);
    return () => clearTimeout(timeoutId);
  }, [progress, syncWithBackend]);

  // Verificar se o usuário respondeu um step específico
  const hasAnsweredStep = useCallback((stepId: number) => {
    return progress.answers.some(answer => answer.stepId === stepId);
  }, [progress.answers]);

  // Obter resposta para um step específico
  const getAnswerForStep = useCallback((stepId: number) => {
    return progress.answers.find(answer => answer.stepId === stepId);
  }, [progress.answers]);

  // Calcular percentual de conclusão
  const calculateCompletionPercentage = useCallback((totalSteps: number) => {
    if (totalSteps <= 0) return 0;
    
    // Se completou o quiz, retorna 100%
    if (progress.completedAt) return 100;
    
    // Calcula com base no índice atual + 1 (porque é zero-based)
    return Math.min(100, Math.round(((progress.currentStepIndex + 1) / totalSteps) * 100));
  }, [progress.currentStepIndex, progress.completedAt]);

  return {
    // Estado
    progress,
    currentStepIndex: progress.currentStepIndex,
    answers: progress.answers,
    totalPoints: progress.totalPoints,
    isCompleted: Boolean(progress.completedAt),
    
    // Ações
    recordAnswer,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    completeQuiz,
    resetProgress,
    
    // Helpers
    hasAnsweredStep,
    getAnswerForStep,
    calculateCompletionPercentage,
    
    // Timestamps
    startedAt: progress.startedAt,
    completedAt: progress.completedAt,
    duration: progress.completedAt 
      ? progress.completedAt - progress.startedAt 
      : Date.now() - progress.startedAt,
  };
};

export default useQuizUserProgress;
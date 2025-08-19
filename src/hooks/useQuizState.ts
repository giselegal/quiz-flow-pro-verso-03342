/**
 * 🎯 USE QUIZ STATE - HOOK DE ESTADO DO QUIZ
 *
 * Hook temporário para compatibilidade
 */

import { useState } from 'react';

export interface QuizState {
  currentStep: number;
  totalSteps: number;
  answers: Record<string, any>;
  scores: Record<string, number>;
  isCompleted: boolean;
  progress: number;
}

export const useQuizState = (initialStep = 1) => {
  const [state, setState] = useState<QuizState>({
    currentStep: initialStep,
    totalSteps: 21,
    answers: {},
    scores: {},
    isCompleted: false,
    progress: 0,
  });

  const updateState = (updates: Partial<QuizState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const answerQuestion = (questionId: string, answer: any) => {
    setState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: answer,
      },
    }));
  };

  const updateScore = (category: string, points: number) => {
    setState(prev => ({
      ...prev,
      scores: {
        ...prev.scores,
        [category]: (prev.scores[category] || 0) + points,
      },
    }));
  };

  return {
    state,
    updateState,
    answerQuestion,
    updateScore,
  };
};

export default useQuizState;

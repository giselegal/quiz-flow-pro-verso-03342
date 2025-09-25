/**
 * 🎯 QUIZ LOGIC - Fixed version with proper StyleResult mapping
 */

import { useState, useCallback } from 'react';
import { QuizQuestion, QuizAnswer, StyleResult, QuizResult } from '@/types/quiz';
import { mapToStyleResult } from '@/utils/styleResultMapper';

interface QuizLogicState {
  currentQuestionIndex: number;
  answers: QuizAnswer[];
  result: QuizResult | null;
  isComplete: boolean;
}

export const useQuizLogicFixed = (questions: QuizQuestion[]) => {
  const [state, setState] = useState<QuizLogicState>({
    currentQuestionIndex: 0,
    answers: [],
    result: null,
    isComplete: false,
  });

  const submitAnswer = useCallback((answer: QuizAnswer) => {
    setState(prev => {
      const newAnswers = [...prev.answers, answer];
      const isLastQuestion = prev.currentQuestionIndex >= questions.length - 1;

      if (isLastQuestion) {
        // Calculate results
        const mockResult: QuizResult = {
          id: `result-${Date.now()}`,
          responses: {},
          score: 85,
          maxScore: 100,
          completedAt: new Date().toISOString(),
          styleResult: mapToStyleResult({
            category: 'natural',
            score: 85,
            percentage: 85,
            points: 85,
            rank: 1
          }),
          primaryStyle: mapToStyleResult({
            category: 'natural',
            score: 85,
            percentage: 85,
            points: 85,
            rank: 1
          }),
          secondaryStyles: [
            mapToStyleResult({
              category: 'classico',
              score: 70,
              percentage: 70,
              points: 70,
              rank: 2
            })
          ]
        };

        return {
          ...prev,
          answers: newAnswers,
          result: mockResult,
          isComplete: true,
        };
      }

      return {
        ...prev,
        answers: newAnswers,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
      };
    });
  }, [questions.length]);

  const resetQuiz = useCallback(() => {
    setState({
      currentQuestionIndex: 0,
      answers: [],
      result: null,
      isComplete: false,
    });
  }, []);

  return {
    ...state,
    submitAnswer,
    resetQuiz,
    currentQuestion: questions[state.currentQuestionIndex],
    progress: (state.currentQuestionIndex / questions.length) * 100,
  };
};

export default useQuizLogicFixed;
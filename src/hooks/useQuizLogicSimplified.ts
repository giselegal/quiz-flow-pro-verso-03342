/**
 * 🎯 QUIZ LOGIC SIMPLIFIED - Quick fix version
 */
import { useState, useCallback } from 'react';
import { QuizQuestion, QuizAnswer, QuizResult } from '@/types/quiz';
import { mapToStyleResult } from '@/utils/styleResultMapper';

export const useQuizLogicSimplified = (questions: QuizQuestion[]) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const submitAnswer = useCallback((answer: QuizAnswer) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestionIndex >= questions.length - 1) {
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

      setResult(mockResult);
      setIsComplete(true);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  }, [answers, currentQuestionIndex, questions.length]);

  return {
    currentQuestionIndex,
    answers,
    result,
    isComplete,
    submitAnswer,
    currentQuestion: questions[currentQuestionIndex],
    progress: (currentQuestionIndex / questions.length) * 100
  };
};

export default useQuizLogicSimplified;
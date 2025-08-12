import { useState, useCallback } from "react";
import { QuizQuestion, UserResponse, StyleResult } from "@/types/quiz";

export const useQuizHooks = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<UserResponse[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleAnswer = useCallback((response: UserResponse) => {
    setResponses(prev => [...prev, response]);
    setCurrentQuestionIndex(prev => prev + 1);
  }, []);

  const calculateResults = useCallback((): StyleResult[] => {
    // Simplified calculation for demo purposes
    return [
      {
        category: "Natural",
        score: 85,
        percentage: 45.2,
        style: "natural",
        points: 85,
        rank: 1,
      },
      {
        category: "Clássico",
        score: 70,
        percentage: 32.1,
        style: "classico",
        points: 70,
        rank: 2,
      },
    ];
  }, [responses]);

  const resetQuiz = useCallback(() => {
    setCurrentQuestionIndex(0);
    setResponses([]);
    setIsCompleted(false);
  }, []);

  return {
    currentQuestionIndex,
    responses,
    isCompleted,
    handleAnswer,
    calculateResults,
    resetQuiz,
    setIsCompleted,
  };
};

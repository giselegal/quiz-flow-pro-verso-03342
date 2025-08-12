import React, { createContext, useContext, useState, useCallback } from 'react';
import { QuizQuestion, QuizAnswer, QuizResult } from '@/types/quiz';
import { calculateQuizResult } from '@/lib/quizEngine';

interface EditorQuizContextType {
  currentQuestionIndex: number;
  answers: QuizAnswer[];
  quizCompleted: boolean;
  quizResult: QuizResult | null;
  totalQuestions: number;
  initializeQuiz: (questions: QuizQuestion[]) => void;
  answerQuestion: (questionId: string, optionId: string) => void;
  previousQuestion: () => void;
  nextQuestion: () => void;
  resetQuiz: () => void;
  completeQuiz: () => void;
}

const EditorQuizContext = createContext<EditorQuizContextType | undefined>(undefined);

interface EditorQuizProviderProps {
  children: React.ReactNode;
}

export const EditorQuizProvider: React.FC<EditorQuizProviderProps> = ({ children }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  const initializeQuiz = useCallback((quizQuestions: QuizQuestion[]) => {
    setQuestions(quizQuestions);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setQuizCompleted(false);
    setQuizResult(null);
  }, []);

  const answerQuestion = useCallback((questionId: string, optionId: string) => {
    setAnswers(prev => {
      const existingAnswerIndex = prev.findIndex(a => a.questionId === questionId);
      const newAnswer: QuizAnswer = { questionId, optionId };

      if (existingAnswerIndex >= 0) {
        const updated = [...prev];
        updated[existingAnswerIndex] = newAnswer;
        return updated;
      } else {
        return [...prev, newAnswer];
      }
    });
  }, []);

  const previousQuestion = useCallback(() => {
    setCurrentQuestionIndex(prev => Math.max(0, prev - 1));
  }, []);

  const nextQuestion = useCallback(() => {
    setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1));
  }, [questions.length]);

  const resetQuiz = useCallback(() => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setQuizCompleted(false);
    setQuizResult(null);
  }, []);

  const completeQuiz = useCallback(() => {
    if (answers.length > 0) {
      const result = calculateQuizResult(answers, questions);
      setQuizResult(result);
      setQuizCompleted(true);
    }
  }, [answers, questions]);

  const value: EditorQuizContextType = {
    currentQuestionIndex,
    answers,
    quizCompleted,
    quizResult,
    totalQuestions: questions.length,
    initializeQuiz,
    answerQuestion,
    previousQuestion,
    nextQuestion,
    resetQuiz,
    completeQuiz,
  };

  return <EditorQuizContext.Provider value={value}>{children}</EditorQuizContext.Provider>;
};

export const useEditorQuiz = (): EditorQuizContextType => {
  const context = useContext(EditorQuizContext);
  if (context === undefined) {
    throw new Error('useEditorQuiz must be used within an EditorQuizProvider');
  }
  return context;
};

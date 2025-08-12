import caktoquizQuestions from '@/data/caktoquizQuestions';
import { QuizAnswer, QuizQuestion, QuizResult, StyleResult } from '@/types/quiz';
import { useCallback, useState } from 'react';

export const useQuizLogic = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [totalQuestions, setTotalQuestions] = useState(0);

  const initializeQuiz = (questions: QuizQuestion[]) => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setQuizCompleted(false);
    setQuizResult(null);
    setTotalQuestions(questions.length);
  };

  const answerQuestion = useCallback((questionId: string, optionId: string) => {
    setAnswers(prevAnswers => {
      const newAnswer: QuizAnswer = {
        questionId,
        optionId,
      };
      return [...prevAnswers, newAnswer];
    });
  }, []);

  const goToNextQuestion = useCallback(() => {
    setCurrentQuestionIndex(prevIndex => Math.min(prevIndex + 1, totalQuestions - 1));
  }, [totalQuestions]);

  const goToPreviousQuestion = useCallback(() => {
    setCurrentQuestionIndex(prevIndex => Math.max(prevIndex - 1, 0));
  }, []);

  const restartQuiz = useCallback(() => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setQuizCompleted(false);
    setQuizResult(null);
  }, []);

  const calculateStyleScores = (answers: QuizAnswer[]) => {
    const styleScores: { [style: string]: number } = {};

    answers.forEach(answer => {
      const question = caktoquizQuestions.find((q: any) => q.id === answer.questionId);
      const option = question?.options.find((opt: any) => opt.id === answer.optionId);

      if (option?.style) {
        styleScores[option.style] = (styleScores[option.style] || 0) + (option.weight || 1);
      }
    });

    return styleScores;
  };

  const createStyleResult = (category: string, score: number): StyleResult => ({
    category,
    score,
    percentage: Math.round((score / totalQuestions) * 100),
    style: category.toLowerCase(),
    points: score,
    rank: 1,
  });

  const calculateResults = useCallback((answers: QuizAnswer[]): QuizResult => {
    const styleScores = calculateStyleScores(answers);

    const sortedStyles = Object.entries(styleScores).sort(
      ([, scoreA], [, scoreB]) => scoreB - scoreA
    );
    const topStyle = sortedStyles[0]?.[0] || 'estilo-neutro';

    const primaryResult = createStyleResult(topStyle, styleScores[topStyle] || 0);

    const secondaryResults = sortedStyles
      .slice(1, 4)
      .map(([category, score]) => createStyleResult(category, score));

    const result: QuizResult = {
      primaryStyle: primaryResult,
      secondaryStyles: secondaryResults,
      totalQuestions: answers.length,
      completedAt: new Date(),
      scores: styleScores,
    };

    return result;
  }, []);

  const completeQuiz = useCallback(() => {
    const calculatedResult = calculateResults(answers);
    setQuizResult(calculatedResult);
    setQuizCompleted(true);
  }, [answers, calculateResults]);

  return {
    currentQuestionIndex,
    answers,
    quizCompleted,
    quizResult,
    totalQuestions,
    initializeQuiz,
    answerQuestion,
    goToNextQuestion,
    goToPreviousQuestion,
    restartQuiz,
    completeQuiz,
  };
};

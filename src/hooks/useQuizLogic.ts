import caktoquizQuestions from '@/data/caktoquizQuestions';
import { QuizAnswer, QuizQuestion, QuizResult, StyleResult } from '@/types/quiz';
import { useCallback, useState } from 'react';

// ✅ INTERFACE PARA QUESTÕES ESTRATÉGICAS
interface StrategicAnswer {
  questionId: string;
  optionId: string;
  category: string;
  strategicType: string;
  timestamp: Date;
}

export const useQuizLogic = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [strategicAnswers, setStrategicAnswers] = useState<StrategicAnswer[]>([]);
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

  // ✅ NOVA FUNÇÃO: Responder questões estratégicas (13-18)
  const answerStrategicQuestion = useCallback(
    (questionId: string, optionId: string, category: string, strategicType: string) => {
      const strategicAnswer: StrategicAnswer = {
        questionId,
        optionId,
        category,
        strategicType,
        timestamp: new Date(),
      };

      setStrategicAnswers(prev => [...prev, strategicAnswer]);

      // ✅ TRACKING: Enviar métricas sem afetar cálculo
      console.log('📊 MÉTRICA ESTRATÉGICA:', {
        questionId,
        optionId,
        category,
        strategicType,
        timestamp: strategicAnswer.timestamp,
      });

      // TODO: Integrar com analytics/Supabase para métricas
      // trackStrategicInteraction(strategicAnswer);
    },
    []
  );

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

    // ✅ CORREÇÃO DE FLUXO: Apenas questões 2-11 pontuam para o resultado
    answers.forEach(answer => {
      const question = caktoquizQuestions.find((q: any) => q.id === answer.questionId);
      const option = question?.options.find((opt: any) => opt.id === answer.optionId);

      // ✅ FILTRO: Só conta se for questão que pontua (2-11)
      const questionNumber = parseInt(question?.id?.replace('q', '') || '0');
      const isScorableQuestion = questionNumber >= 1 && questionNumber <= 10; // q1-q10 = etapas 2-11

      if (option?.style && isScorableQuestion) {
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
    strategicAnswers,
    quizCompleted,
    quizResult,
    totalQuestions,
    initializeQuiz,
    answerQuestion,
    answerStrategicQuestion,
    goToNextQuestion,
    goToPreviousQuestion,
    restartQuiz,
    completeQuiz,
  };
};

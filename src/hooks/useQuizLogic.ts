import caktoquizQuestions from '@/data/caktoquizQuestions';
import { QuizAnswer, QuizQuestion, QuizResult, StyleResult } from '@/types/quiz';
import { useCallback, useState } from 'react';
import { StorageService } from '@/services/core/StorageService';

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
  // ✅ NOVO: Estado para capturar nome do usuário na Etapa 1
  const [userName, setUserName] = useState<string>(StorageService.safeGetString('userName') || StorageService.safeGetString('quizUserName') || '');

  const initializeQuiz = (questions: QuizQuestion[]) => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setQuizCompleted(false);
    setQuizResult(null);
    setTotalQuestions(questions.length);
    // ✅ MANTER: Nome do usuário persiste durante o quiz
  };

  // ✅ NOVA FUNÇÃO: Capturar nome do usuário (Etapa 1)
  const setUserNameFromInput = useCallback((name: string) => {
    const cleanName = name.trim();
    setUserName(cleanName);

    // ✅ TRACKING: Log da captura do nome
    console.log('👤 NOME CAPTURADO:', {
      name: cleanName,
      timestamp: new Date().toISOString(),
      step: 1,
    });

    // Persistir em ambas as chaves por compatibilidade
    if (cleanName) {
      StorageService.safeSetString('userName', cleanName);
      StorageService.safeSetString('quizUserName', cleanName);
    }
  }, []);

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

    // ✅ CORREÇÃO DE FLUXO: Apenas questões q1-q10 pontuam para o resultado (etapas 2-11)
    answers.forEach(answer => {
      const question = caktoquizQuestions.find((q: any) => q.id === answer.questionId);
      const option = question?.options.find((opt: any) => opt.id === answer.optionId);

      // ✅ FILTRO: Só conta se for questão que pontua (q1-q10 = etapas 2-11)
      const isScorableQuestion = [
        'q1',
        'q2',
        'q3',
        'q4',
        'q5',
        'q6',
        'q7',
        'q8',
        'q9',
        'q10',
      ].includes(question?.id || '');

      if (option?.style && isScorableQuestion) {
        styleScores[option.style] = (styleScores[option.style] || 0) + (option.weight || 1);
      }
    });

    return styleScores;
  };

  // Calcula o resultado por estilo usando a proporção de pontos daquele estilo
  const createStyleResult = (category: string, score: number, totalPoints: number): StyleResult => ({
    category,
    score,
    // Usa proporção em relação ao total de pontos para evitar depender de totalQuestions
    percentage: totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0,
    style: category.toLowerCase(),
    points: score,
    rank: 1,
  });

  const calculateResults = useCallback(
    (answers: QuizAnswer[]): QuizResult => {
      const styleScores = calculateStyleScores(answers);

      const sortedStyles = Object.entries(styleScores).sort(
        ([, scoreA], [, scoreB]) => scoreB - scoreA
      );
      const topStyle = sortedStyles[0]?.[0] || 'estilo-neutro';

      // Total de pontos somando todos os estilos (considera multi-seleção por questão)
      const totalPoints = Object.values(styleScores).reduce((acc, v) => acc + (v || 0), 0);

      const primaryResult = createStyleResult(topStyle, styleScores[topStyle] || 0, totalPoints);

      const secondaryResults = sortedStyles
        .slice(1, 4)
        .map(([category, score]) => createStyleResult(category, score, totalPoints));

      // ✅ PERSONALIZAÇÃO: Incluir nome do usuário no resultado
      const currentUserName =
        userName ||
        StorageService.safeGetString('userName') ||
        StorageService.safeGetString('quizUserName') || '';

      const result: QuizResult = {
        primaryStyle: primaryResult,
        secondaryStyles: secondaryResults,
        totalQuestions: answers.length,
        completedAt: new Date(),
        scores: styleScores,
        // ✅ NOVO: Dados personalizados
        userData: {
          name: currentUserName,
          completionTime: new Date(),
          strategicAnswersCount: strategicAnswers.length,
        },
      };

      return result;
    },
    [userName, strategicAnswers.length]
  );

  const completeQuiz = useCallback(() => {
    const calculatedResult = calculateResults(answers);
    setQuizResult(calculatedResult);
    // Persistir imediatamente para consumo por componentes de resultado
    try { StorageService.safeSetJSON('quizResult', calculatedResult); } catch { }
    setQuizCompleted(true);
  }, [answers, calculateResults]);

  return {
    currentQuestionIndex,
    answers,
    strategicAnswers,
    quizCompleted,
    quizResult,
    totalQuestions,
    userName,
    initializeQuiz,
    answerQuestion,
    answerStrategicQuestion,
    setUserNameFromInput,
    goToNextQuestion,
    goToPreviousQuestion,
    restartQuiz,
    completeQuiz,
    // Expor cálculo para hidratação em modos de edição/preview
    calculateResults,
  };
};

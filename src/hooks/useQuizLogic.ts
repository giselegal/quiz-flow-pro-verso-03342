import caktoquizQuestions from '@/data/caktoquizQuestions';
import { isScorableQuestion } from '@/core/constants/quiz';
import { StyleResult, QuizQuestion, QuizResult, QuizAnswer } from '@/types/quiz';
import { mapToStyleResult } from '@/utils/styleResultMapper';
import { useCallback, useState } from 'react';
import { StorageService } from '@/services/core/StorageService';
import { useQuizRulesConfig } from './useQuizRulesConfig';

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
  const [userName, setUserName] = useState<string>('');

  // ✅ INTEGRAÇÃO: Conectar com configuração centralizada
  const { config } = useQuizRulesConfig();

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
        selectedOptions: [optionId],
        value: [optionId],
        timestamp: new Date().toISOString(),
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

      // ✅ FILTRO: Só conta se for questão que pontua (centralizado em constants/quiz.ts)
      const scorable = isScorableQuestion(question?.id || '');

      if (option?.style && scorable) {
        styleScores[option.style] = (styleScores[option.style] || 0) + (option.weight || 1);
      }
    });

    return styleScores;
  };

  // Calcula o resultado por estilo usando a proporção de pontos daquele estilo
  const createStyleResult = (category: string, score: number, totalPoints: number): StyleResult => 
    mapToStyleResult({
      category,
      score,
      percentage: totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0,
      style: category.toLowerCase(),
      points: score,
      rank: 1
    });

  const calculateResults = useCallback(
    (answers: QuizAnswer[]): QuizResult => {
      // ✅ NOVO: Usar UnifiedCalculationEngine consolidado
      console.log('🎯 useQuizLogic: Usando UnifiedCalculationEngine para cálculo');

      const currentUserName =
        userName ||
        StorageService.safeGetString('userName') ||
        StorageService.safeGetString('quizUserName') || '';

      try {
        // Importar dinamicamente para evitar dependências circulares
        const { UnifiedCalculationEngine } = require('@/utils/UnifiedCalculationEngine');

        // Criar engine com configuração centralizada
        const engine = new UnifiedCalculationEngine(config || undefined);

        const engineResult = engine.calculateResults(answers, {
          includeUserData: true,
          userName: currentUserName,
          strategicAnswersCount: strategicAnswers.length,
          tieBreakStrategy: config?.globalScoringConfig?.algorithm?.tieBreaker === 'first_selection'
            ? 'first-answer'
            : 'highest-score',
          debug: process.env.NODE_ENV === 'development'
        });

        // Mapear resultado do engine para interface esperada pelo useQuizLogic
        const primaryStyleData = engineResult.scores.find((s: any) => s.style === engineResult.primaryStyle);
        const secondaryStylesData = engineResult.scores.filter((s: any) =>
          engineResult.secondaryStyles.includes(s.style)
        );

        const mappedResult: QuizResult = {
          primaryStyle: mapToStyleResult({
            category: engineResult.primaryStyle || 'natural',
            score: primaryStyleData?.points || 0,
            percentage: primaryStyleData?.percentage || 0,
            style: (engineResult.primaryStyle || 'natural').toLowerCase(),
            points: primaryStyleData?.points || 0,
            rank: 1
          }),
          secondaryStyles: secondaryStylesData.map((styleData: any, index: number) => ({
            category: styleData.style,
            score: styleData.points,
            percentage: styleData.percentage,
            style: styleData.style.toLowerCase(),
            points: styleData.points,
            rank: index + 2,
          })),
          totalQuestions: engineResult.totalQuestions,
          completedAt: engineResult.completedAt,
          styleScores: Object.fromEntries(
            engineResult.scores.map((s: any) => [s.style, s.points])
          ),
          // Dados de compatibilidade
          predominantStyle: engineResult.primaryStyle,
          complementaryStyles: engineResult.secondaryStyles,
          userData: engineResult.userData
        };

        console.log('✅ useQuizLogic: Resultado calculado via UnifiedCalculationEngine:', {
          primaryStyle: mappedResult.primaryStyle?.category || mappedResult.primaryStyle?.name,
          percentage: mappedResult.primaryStyle?.percentage,
          totalQuestions: mappedResult.totalQuestions,
          usingCentralizedConfig: !!config
        });

        return mappedResult;
      } catch (error) {
        console.warn('⚠️ useQuizLogic: Erro no UnifiedCalculationEngine, usando fallback:', error);

        // FALLBACK: Manter implementação original como backup
        const styleScores = calculateStyleScores(answers);

        const sortedStyles = Object.entries(styleScores).sort(
          ([, scoreA], [, scoreB]) => scoreB - scoreA
        );
        const topStyle = sortedStyles[0]?.[0] || 'Natural';

        // Total de pontos somando todos os estilos (considera multi-seleção por questão)
        const totalPoints = Object.values(styleScores).reduce((acc, v) => acc + (v || 0), 0);

        const primaryResult = createStyleResult(topStyle, styleScores[topStyle] || 0, totalPoints);

        const secondaryResults = sortedStyles
          .slice(1, 4)
          .map(([category, score]) => createStyleResult(category, score, totalPoints));

        const result: QuizResult = {
          id: `result-${Date.now()}`,
          responses: {},
          score: Object.values(styleScores).reduce((sum, score) => sum + score, 0),
          maxScore: 100,
          completedAt: new Date().toISOString(),
          primaryStyle: primaryResult,
          secondaryStyles: secondaryResults,
          totalQuestions: answers.length,
          styleResult: primaryResult,
          // ✅ NOVO: Dados personalizados
          userData: {
            name: currentUserName,
            completionTime: new Date(),
            strategicAnswersCount: strategicAnswers.length,
          },
        };

        console.log('✅ useQuizLogic: Usando algoritmo fallback');
        return result;
      }
    },
    [userName, strategicAnswers.length]
  );

  const completeQuiz = useCallback(async () => {
    const calculatedResult = calculateResults(answers);
    setQuizResult(calculatedResult);

    // Persistência e normalização ampliadas
    try {
      // Persistir resultado completo para consumo direto
      StorageService.safeSetJSON('quizResult', calculatedResult);

      // Tentar calcular via serviço central (se disponível) com respostas agregadas
      try {
        const { quizResultsService: central } = await import('@/services/quizResultsService');
        // Montar responses a partir do storage incremental das seleções
        const incremental = (StorageService.safeGetJSON('quizResponses') as any) || {};
        const sessionId = StorageService.safeGetString('quizSessionId') || `local-${Date.now()}`;
        const session = {
          id: sessionId,
          session_id: sessionId,
          responses: incremental,
          current_step: 19,
        };
        if (central && typeof central.calculateResults === 'function') {
          central.calculateResults(session).then((svcResult: any) => {
            try {
              // Normalizar payload mínimo esperado pelos blocos de resultado
              const scores = (svcResult?.styleProfile?.styleScores as any) || {};
              const total = Object.values(scores).reduce((a: number, b: any) => a + Number(b || 0), 0) || 1;
              const ordered = Object.entries(scores)
                .map(([category, score]) => ({
                  category,
                  style: category,
                  score: Number(score) || 0,
                  percentage: Math.round(((Number(score) || 0) / total) * 100),
                }))
                .sort((a, b) => b.score - a.score);
              const primary = ordered[0] || calculatedResult.primaryStyle;
              const secondary = ordered.slice(1);
              const normalized = {
                primaryStyle: primary,
                secondaryStyles: secondary,
                totalQuestions: calculatedResult.totalQuestions,
                completedAt: new Date(),
                scores,
                userData: calculatedResult.userData || {},
              };
              StorageService.safeSetJSON('quizResult', normalized);
              try { window.dispatchEvent(new Event('quiz-result-updated')); } catch { }
            } catch { }
          }).catch(() => {
            // Fallback já persistido acima
          });
        }
      } catch { }

      try { window.dispatchEvent(new Event('quiz-result-updated')); } catch { }
    } catch { }

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

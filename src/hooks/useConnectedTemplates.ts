// 🔗 HOOK PARA GERENCIAR TEMPLATES CONECTADOS AO SISTEMA DE QUIZ
// Facilita a integração entre templates TSX e hooks de quiz

import { QUIZ_QUESTIONS_COMPLETE } from '@/templates/quiz21StepsComplete';
import { useCallback, useMemo } from 'react';
import { useQuizLogic } from './useQuizLogic';
import { useSupabaseQuiz } from './useSupabaseQuiz';

export interface ConnectedTemplateConfig {
  stepNumber: number;
  questionId: string;
  questionData: any;
  isConnected: boolean;
  hasRealData: boolean;
  progressValue: number;
}

/**
 * Hook para gerenciar templates conectados
 * Fornece dados e handlers unificados para templates conectados aos hooks
 */
export const useConnectedTemplates = () => {
  const quizLogic = useQuizLogic();
  const supabaseQuiz = useSupabaseQuiz();

  // 🎯 MAPEAR CONFIGURAÇÕES DOS TEMPLATES CONECTADOS
  const templateConfigs = useMemo(() => {
    const configs: Record<number, ConnectedTemplateConfig> = {};

    // Steps 1-21 usando QUIZ_QUESTIONS_COMPLETE como fonte única
    for (let step = 1; step <= 21; step++) {
      const questionText = QUIZ_QUESTIONS_COMPLETE[step];

      configs[step] = {
        stepNumber: step,
        questionId: `step-${step}`,
        questionData: {
          id: `step-${step}`,
          text: questionText,
          title: questionText,
          order: step,
          type:
            step === 1
              ? 'intro'
              : step === 2
                ? 'name-input'
                : step >= 3 && step <= 12
                  ? 'multiple-choice'
                  : step >= 13 && step <= 19
                    ? 'strategic'
                    : step === 20
                      ? 'result'
                      : 'offer',
        },
        isConnected: step <= 3, // Apenas Steps 1-3 estão conectados por enquanto
        hasRealData: !!questionText,
        progressValue: ((step - 1) / 21) * 100, // Calcular progresso
      };
    }

    return configs;
  }, []);

  // 🎯 HANDLER UNIFICADO PARA RESPONDER QUESTÕES
  const handleAnswerQuestion = useCallback(
    async (stepNumber: number, selectedOptions: string[]) => {
      const config = templateConfigs[stepNumber];
      if (!config || !config.questionData) {
        console.error(`❌ Template config not found for step ${stepNumber}`);
        return false;
      }

      try {
        // answerQuestion espera 2 argumentos: questionId e selectedOption
        if (selectedOptions.length > 0) {
          await quizLogic.answerQuestion(config.questionId, selectedOptions[0]);
        }

        console.log(`✅ Connected Template Step ${stepNumber}: Resposta salva`, {
          questionId: config.questionId,
          selectedOptions,
        });

        return true;
      } catch (error) {
        console.error(`❌ Connected Template Step ${stepNumber}: Erro ao salvar`, error);
        return false;
      }
    },
    [templateConfigs, quizLogic]
  );

  // 🎯 OBTER ESTADO ATUAL DA QUESTÃO
  const getQuestionState = useCallback(
    (stepNumber: number) => {
      const config = templateConfigs[stepNumber];
      if (!config) return null;

      const questionAnswers = quizLogic.answers.filter(a => a.questionId === config.questionId);

      return {
        config,
        currentSelections: questionAnswers.map(a => a.optionId),
        isLoading: false,
        isComplete: questionAnswers.length >= (config.questionData?.multiSelect || 1),
        canProceed: questionAnswers.length >= (config.questionData?.multiSelect || 1),
      };
    },
    [templateConfigs, quizLogic.answers]
  );

  // 🎯 VALIDAR SE TEMPLATE ESTÁ PRONTO PARA CONECTAR
  const canConnectTemplate = useCallback(
    (stepNumber: number) => {
      const config = templateConfigs[stepNumber];
      return config && config.hasRealData && config.questionData;
    },
    [templateConfigs]
  );

  // 📊 ESTATÍSTICAS DOS TEMPLATES
  const stats = useMemo(() => {
    const total = Object.keys(templateConfigs).length;
    const connected = Object.values(templateConfigs).filter(c => c.isConnected).length;
    const withRealData = Object.values(templateConfigs).filter(c => c.hasRealData).length;

    return {
      total,
      connected,
      pending: total - connected,
      withRealData,
      completionRate: total > 0 ? (connected / total) * 100 : 0,
    };
  }, [templateConfigs]);

  return {
    // 🎯 Configurações dos templates
    templateConfigs,

    // 🔗 Handlers conectados
    handleAnswerQuestion,
    getQuestionState,
    canConnectTemplate,

    // 📊 Estados dos hooks
    quizLogic,
    supabaseQuiz,

    // 📊 Estatísticas
    stats,

    // 🎯 Utilitários
    isTemplateConnected: (stepNumber: number) => templateConfigs[stepNumber]?.isConnected || false,
    hasRealData: (stepNumber: number) => templateConfigs[stepNumber]?.hasRealData || false,
  };
};

export default useConnectedTemplates;

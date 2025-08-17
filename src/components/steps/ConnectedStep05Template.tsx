// 🔗 CONNECTED STEP 05 TEMPLATE - Questão: "QUAIS DETALHES VOCÊ GOSTA?"
// Quarta questão: Detalhes (texto) - 3 seleções obrigatórias - Auto-avanço

import { useCallback } from 'react';
import { useQuizLogic } from '@/hooks/useQuizLogic';
import { COMPLETE_QUIZ_QUESTIONS } from '@/data/correctQuizQuestions';

export const ConnectedStep05Template = () => {
  const { answerQuestion, answers } = useQuizLogic();

  // 🎯 Buscar questão real dos dados (q4)
  const questionData =
    COMPLETE_QUIZ_QUESTIONS.find(q => q.id === 'q4') || COMPLETE_QUIZ_QUESTIONS[4];

  const handleOptionSelect = useCallback(
    async (optionIds: string[]) => {
      try {
        const selectedOption = questionData.options.find((opt: any) => optionIds.includes(opt.id));
        if (selectedOption) {
          await answerQuestion(questionData.id, selectedOption.id);

          console.log('✅ Connected Step05: Resposta salva via hooks', {
            questionId: questionData.id,
            selectedOptions: optionIds,
          });
        }
      } catch (error) {
        console.error('❌ Connected Step05: Erro ao salvar resposta', error);
      }
    },
    [answerQuestion, questionData]
  );

  return [
    // 📱 CABEÇALHO COM LOGO E PROGRESSO
    {
      id: 'step05-header',
      type: 'quiz-intro-header',
      properties: {
        logoUrl:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt: 'Logo Gisele Galvão',
        logoWidth: 96,
        logoHeight: 96,
        progressValue: 25,
        progressMax: 100,
        showBackButton: true,
        spacing: 'small',
        marginTop: 0,
        marginBottom: 0,
      },
    },

    // 🎯 TÍTULO DA QUESTÃO (DADOS REAIS)
    {
      id: 'step05-question-title',
      type: 'text-inline',
      properties: {
        content: questionData.text,
        fontSize: 'text-2xl',
        fontWeight: 'font-bold',
        textAlign: 'text-center',
        color: '#432818',
        marginBottom: 0,
        spacing: 'small',
        marginTop: 0,
      },
    },

    // 📊 CONTADOR DE QUESTÃO
    {
      id: 'step05-question-counter',
      type: 'text-inline',
      properties: {
        content: 'Questão 4 de 10',
        fontSize: 'text-sm',
        textAlign: 'text-center',
        color: '#6B7280',
        marginBottom: 24,
        spacing: 'small',
        marginTop: 0,
      },
    },

    // 🎯 OPÇÕES DE DETALHES CONECTADAS (DADOS REAIS)
    {
      id: 'step05-details-options',
      type: 'options-grid',
      properties: {
        questionId: questionData.id,

        // 🎯 OPÇÕES REAIS DOS DADOS
        options: questionData.options.map((option: any) => ({
          id: option.id,
          text: option.text,
          description: option.text,
          value: option.id,
          category: option.styleCategory,
          styleCategory: option.styleCategory,
          points: option.weight,
          marginTop: 0,
          spacing: 'small',
          marginBottom: 0,
        })),

        // 🎨 LAYOUT BASEADO NO TIPO (text = 1 coluna)
        columns: 1,
        showImages: false,
        multipleSelection: true,
        maxSelections: questionData.multiSelect || 3,
        minSelections: questionData.multiSelect || 3,
        autoAdvance: true,
        validationMessage: 'Selecione até 3 opções',
        gridGap: 12,
        responsiveColumns: false,

        // 🚀 AUTOAVANÇO
        autoAdvanceOnComplete: true,
        autoAdvanceDelay: 1500,
        instantActivation: true,
        requiredSelections: 3,

        // 🔗 HANDLER CONECTADO
        onSelectionChange: handleOptionSelect,

        // 📊 STATUS CONECTADO
        currentSelections:
          answers.filter(a => a.questionId === questionData.id).map(a => a.optionId) || [],
        isLoading: false,
      },
    },

    // 🔘 BOTÃO CONECTADO
    {
      id: 'step05-continue-button',
      type: 'button-inline',
      properties: {
        text: 'Continuar →',
        textWhenDisabled: 'Selecione 3 opções para continuar',
        textWhenComplete: 'Continuar →',

        variant: 'primary',
        size: 'large',
        backgroundColor: '#B89B7A',
        textColor: '#ffffff',
        disabledBackgroundColor: '#E5E7EB',
        disabledTextColor: '#9CA3AF',

        // 🔗 ESTADO CONECTADO
        disabled:
          answers.filter(a => a.questionId === questionData.id).length <
          (questionData.multiSelect || 3),
        requiresValidInput: true,
        instantActivation: true,

        // 🚀 AUTOAVANÇO
        autoAdvanceAfterActivation: false,
        autoAdvanceDelay: 1500,

        marginTop: 0,
        spacing: 'small',
        marginBottom: 0,
      },
    },
  ];
};

export const getConnectedStep05Template = () => {
  return ConnectedStep05Template();
};

export default ConnectedStep05Template;

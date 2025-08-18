// 🔗 CONNECTED STEP 03 TEMPLATE - Integrado com Hooks do Sistema
// Segunda questão: "RESUMA A SUA PERSONALIDADE:"

import { useCallback } from 'react';
import { useQuizLogic } from '@/hooks/useQuizLogic';
import { COMPLETE_QUIZ_QUESTIONS } from '@/data/correctQuizQuestions';

export const ConnectedStep03Template = () => {
  const { answerQuestion, answers } = useQuizLogic();

  // 🎯 Buscar questão real dos dados (q2 = segunda questão)
  const questionData =
    COMPLETE_QUIZ_QUESTIONS.find(q => q.id === 'q2') || COMPLETE_QUIZ_QUESTIONS[2];

  const handleOptionSelect = useCallback(
    async (optionIds: string[]) => {
      try {
        // 🎯 Usar hook real do sistema - answerQuestion espera 2 argumentos
        const selectedOption = questionData.options.find((opt: any) => optionIds.includes(opt.id));
        if (selectedOption) {
          await answerQuestion(questionData.id, selectedOption.id);

          console.log('✅ Connected Step03: Resposta salva via hooks', {
            questionId: questionData.id,
            selectedOptions: optionIds,
          });
        }
      } catch (error) {
        console.error('❌ Connected Step03: Erro ao salvar resposta', error);
      }
    },
    [answerQuestion, questionData]
  );

  return [
    // 📱 CABEÇALHO COM LOGO E PROGRESSO
    {
      id: 'step03-header',
      type: 'quiz-intro-header',
      properties: {
        logoUrl:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt: 'Logo Gisele Galvão',
        logoWidth: 96,
        logoHeight: 96,
        progressValue: 15,
        progressMax: 100,
        showBackButton: true,
        marginTop: 0,
        spacing: 'small',
        marginBottom: 0,
      },
    },

    // 🎯 TÍTULO DA QUESTÃO (DADOS REAIS)
    {
      id: 'step03-question-title',
      type: 'text-inline',
      properties: {
        content: questionData.text, // "RESUMA A SUA PERSONALIDADE:"
        level: 'h2',
        fontSize: 'text-2xl',
        fontWeight: 'font-bold',
        textAlign: 'text-center',
        color: '#432818',
        marginBottom: 0,
        marginTop: 0,
        spacing: 'small',
      },
    },

    // 📊 CONTADOR DE QUESTÃO
    {
      id: 'step03-question-counter',
      type: 'text-inline',
      properties: {
        content: 'Questão 2 de 10',
        fontSize: 'text-sm',
        textAlign: 'text-center',
        color: '#6B7280',
        marginBottom: 24,
        marginTop: 0,
        spacing: 'small',
      },
    },

    // 🎯 OPÇÕES DE PERSONALIDADE CONECTADAS (DADOS REAIS)
    {
      id: 'step03-personality-options',
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
        columns: 1, // SEM IMAGENS = 1 COLUNA
        showImages: false, // Questão de personalidade não tem imagens
        multipleSelection: true,
        maxSelections: questionData.multiSelect || 3,
        minSelections: questionData.multiSelect || 3,
        autoAdvance: true,
        validationMessage: 'Selecione até 3 opções',
        gridGap: 12,
        responsiveColumns: false,

        // 🚀 AUTOAVANÇO E ATIVAÇÃO
        autoAdvanceOnComplete: true,
        autoAdvanceDelay: 1500,
        instantActivation: true,
        requiredSelections: 3,
        enableButtonOnlyWhenValid: false,
        instantButtonActivation: true,
        showValidationFeedback: true,

        // 🔗 HANDLER CONECTADO
        onSelectionChange: handleOptionSelect,

        // 📊 STATUS CONECTADO - Usando answers do useQuizLogic
        currentSelections:
          answers.filter(a => a.questionId === questionData.id).map(a => a.optionId) || [],
        isLoading: false,
      },
    },

    // 🔘 BOTÃO CONECTADO COM ATIVAÇÃO INSTANTÂNEA
    {
      id: 'step03-continue-button',
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

        // 🔗 ESTADO CONECTADO - Usando answers do useQuizLogic
        disabled:
          answers.filter(a => a.questionId === questionData.id).length <
          (questionData.multiSelect || 3),
        requiresValidInput: true,
        instantActivation: true,
        noDelay: true,

        // 🚀 AUTOAVANÇO
        autoAdvanceAfterActivation: false,
        autoAdvanceDelay: 1500,

        // 📊 FEEDBACK RÁPIDO
        showSuccessAnimation: false,
        showPulseWhenEnabled: false,
        quickFeedback: true,
        marginTop: 0,
        spacing: 'small',
        marginBottom: 0,
      },
    },
  ];
};

export const getConnectedStep03Template = () => {
  return ConnectedStep03Template();
};

export default ConnectedStep03Template;

// 🔗 CONNECTED STEP 08 TEMPLATE - Questão: "QUAL SUA CALÇA FAVORITA?"
// Sétima questão: Calças com imagens - 3 seleções obrigatórias - Auto-avanço

import { useCallback } from 'react';
import { useQuizLogic } from '@/hooks/useQuizLogic';
import { COMPLETE_QUIZ_QUESTIONS } from '@/data/correctQuizQuestions';

export const ConnectedStep08Template = () => {
  const { answerQuestion, answers } = useQuizLogic();
  
  // 🎯 Buscar questão real dos dados (q7)
  const questionData = COMPLETE_QUIZ_QUESTIONS.find(q => q.id === 'q7') || COMPLETE_QUIZ_QUESTIONS[7];
  
  const handleOptionSelect = useCallback(async (optionIds: string[]) => {
    try {
      const selectedOption = questionData.options.find((opt: any) => optionIds.includes(opt.id));
      if (selectedOption) {
        await answerQuestion(questionData.id, selectedOption.id);
        
        console.log('✅ Connected Step08: Resposta salva via hooks', { 
          questionId: questionData.id, 
          selectedOptions: optionIds 
        });
      }
    } catch (error) {
      console.error('❌ Connected Step08: Erro ao salvar resposta', error);
    }
  }, [answerQuestion, questionData]);

  return [
    // 📱 CABEÇALHO COM LOGO E PROGRESSO
    {
      id: 'step08-header',
      type: 'quiz-intro-header',
      properties: {
        logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt: 'Logo Gisele Galvão',
        logoWidth: 96,
        logoHeight: 96,
        progressValue: 40,
        progressMax: 100,
        showBackButton: true,
        spacing: 'small',
        marginTop: 0,
        marginBottom: 0,
      },
    },

    // 🎯 TÍTULO DA QUESTÃO (DADOS REAIS)
    {
      id: 'step08-question-title',
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
      id: 'step08-question-counter',
      type: 'text-inline',
      properties: {
        content: 'Questão 7 de 10',
        fontSize: 'text-sm',
        textAlign: 'text-center',
        color: '#6B7280',
        marginBottom: 24,
        spacing: 'small',
        marginTop: 0,
      },
    },

    // 🎯 GRADE DE CALÇAS CONECTADA (DADOS REAIS)
    {
      id: 'step08-pants-options',
      type: 'options-grid',
      properties: {
        // 🎯 OPÇÕES REAIS DOS DADOS
        options: questionData.options.map((option: any) => ({
          id: option.id,
          text: option.text,
          description: option.text,
          imageUrl: option.imageUrl,
          value: option.id,
          category: option.styleCategory,
          points: option.weight,
        })),

        // 🎨 LAYOUT
        columns: 2,
        imageSize: 256,
        showImages: true,

        // 🎯 VALIDAÇÃO BASEADA NOS DADOS REAIS
        multipleSelection: (questionData.multiSelect || 1) > 1,
        maxSelections: questionData.multiSelect || 3,
        minSelections: questionData.multiSelect || 3,
        autoAdvanceOnComplete: true,
        autoAdvance: true,

        // 🔗 HANDLER CONECTADO
        onSelectionChange: handleOptionSelect,

        // 🎨 CORES DO SISTEMA
        borderColor: '#E5E7EB',
        selectedBorderColor: '#B89B7A',
        hoverColor: '#F3E8D3',

        // 📊 STATUS - Usando answers do useQuizLogic
        currentSelections: answers.filter(a => a.questionId === questionData.id).map(a => a.optionId) || [],
        isLoading: false,

        containerWidth: 'full',
        spacing: 'small',
        marginBottom: 16,
      },
    },

    // 🔘 BOTÃO CONECTADO
    {
      id: 'step08-continue-button',
      type: 'button-inline',
      properties: {
        text: 'Continuar →',
        textWhenDisabled: 'Selecione 3 opções para continuar',
        textWhenComplete: 'Continuar',

        variant: 'primary',
        size: 'large',
        backgroundColor: '#B89B7A',
        textColor: '#ffffff',
        disabledBackgroundColor: '#d1d5db',
        disabledTextColor: '#9ca3af',

        // 🔗 ESTADO CONECTADO - Usando answers do useQuizLogic
        disabled: answers.filter(a => a.questionId === questionData.id).length < (questionData.multiSelect || 3),
        requiresValidInput: true,
        instantActivation: false,

        fullWidth: true,
        marginTop: 24,
        textAlign: 'text-center',
        spacing: 'small',
        marginBottom: 0,

        // 🔗 HANDLER DE NAVEGAÇÃO CONECTADO
        onClick: () => {
          console.log('🎯 Connected Step08: Navegando para próximo step');
        }
      },
    },
  ];
};

export const getConnectedStep08Template = () => {
  return ConnectedStep08Template();
};

export default ConnectedStep08Template;
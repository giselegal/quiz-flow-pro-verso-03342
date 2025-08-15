// 🔗 CONNECTED STEP 13 TEMPLATE - QUESTÃO ESTRATÉGICA 1: "Como você se vê hoje?"
// Primeira questão estratégica - 1 seleção obrigatória - SEM auto-avanço

import { useCallback } from 'react';
import { useQuizLogic } from '@/hooks/useQuizLogic';
import { COMPLETE_QUIZ_QUESTIONS } from '@/data/correctQuizQuestions';

export const ConnectedStep13Template = () => {
  const { answerStrategicQuestion, strategicAnswers } = useQuizLogic();
  
  // 🎯 Buscar questão estratégica real dos dados
  const questionData = COMPLETE_QUIZ_QUESTIONS.find(q => q.id === 'strategic1');
  
  const handleOptionSelect = useCallback(async (optionIds: string[]) => {
    try {
      const selectedOption = questionData?.options.find((opt: any) => optionIds.includes(opt.id));
      if (selectedOption) {
        await answerStrategicQuestion(
          questionData?.id || '', 
          selectedOption.id,
          (selectedOption as any).category,
          (selectedOption as any).strategicType
        );
        
        console.log('✅ Connected Step13: Resposta estratégica salva', { 
          questionId: questionData.id, 
          selectedOptions: optionIds 
        });
      }
    } catch (error) {
      console.error('❌ Connected Step13: Erro ao salvar resposta estratégica', error);
    }
  }, [answerStrategicQuestion, questionData]);

  return [
    // 📱 CABEÇALHO COM LOGO E PROGRESSO
    {
      id: 'step13-header',
      type: 'quiz-intro-header',
      properties: {
        logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt: 'Logo Gisele Galvão',
        logoWidth: 96,
        logoHeight: 96,
        progressValue: 65,
        progressMax: 100,
        showBackButton: true,
        spacing: 'small',
        marginTop: 0,
        marginBottom: 0,
      },
    },

    // 🎯 TÍTULO DA QUESTÃO ESTRATÉGICA (DADOS REAIS)
    {
      id: 'step13-question-title',
      type: 'text-inline',
      properties: {
        content: questionData?.text || 'Como você se vê hoje?',
        fontSize: 'text-3xl',
        fontWeight: 'font-bold',
        textAlign: 'text-center',
        color: '#432818',
        marginBottom: 16,
        spacing: 'small',
        marginTop: 0,
      },
    },

    // 📋 SUBTÍTULO/DESCRIÇÃO
    {
      id: 'step13-question-subtitle',
      type: 'text-inline',
      properties: {
        content: questionData?.subtitle || 'Quando você se olha no espelho, como se sente com sua imagem pessoal atualmente?',
        fontSize: 'text-lg',
        fontWeight: 'font-medium',
        textAlign: 'text-center',
        color: '#6B4F43',
        marginBottom: 32,
        spacing: 'small',
        marginTop: 0,
      },
    },

    // 🎯 OPÇÕES ESTRATÉGICAS CONECTADAS (DADOS REAIS)
    {
      id: 'step13-strategic-options',
      type: 'options-grid',
      properties: {
        questionId: questionData?.id,
        
        // 🎯 OPÇÕES ESTRATÉGICAS REAIS
        options: (questionData?.options || []).map((option: any) => ({
          id: option.id,
          text: option.text,
          description: option.text,
          value: option.id,
          category: option.category,
          strategicType: option.strategicType,
          points: option.weight,
          marginTop: 0,
          spacing: 'small',
          marginBottom: 0,
        })),
        
        // 🎨 LAYOUT QUESTÕES ESTRATÉGICAS (1 coluna)
        columns: 1,
        showImages: false,
        multipleSelection: false, // ❌ SÓ UMA SELEÇÃO
        maxSelections: 1,
        minSelections: 1,
        autoAdvance: false, // ❌ SEM AUTO-AVANÇO
        validationMessage: 'Selecione uma opção',
        gridGap: 12,
        responsiveColumns: false,

        // 🔗 HANDLER CONECTADO (ESTRATÉGICO)
        onSelectionChange: handleOptionSelect,

        // 📊 STATUS CONECTADO
        currentSelections: strategicAnswers.filter(a => a.questionId === questionData?.id).map(a => a.optionId) || [],
        isLoading: false,
      },
    },

    // 🔘 BOTÃO MANUAL (SEM AUTO-AVANÇO)
    {
      id: 'step13-continue-button',
      type: 'button-inline',
      properties: {
        text: 'Continuar',
        textWhenDisabled: 'Selecione uma opção para continuar',
        textWhenComplete: 'Continuar',

        variant: 'primary',
        size: 'large',
        backgroundColor: '#B89B7A',
        textColor: '#ffffff',
        disabledBackgroundColor: '#E5E7EB',
        disabledTextColor: '#9CA3AF',

        // 🔗 ESTADO CONECTADO - ESTRATÉGICO (1 seleção)
        disabled: strategicAnswers.filter(a => a.questionId === questionData?.id).length < 1,
        requiresValidInput: true,
        instantActivation: false, // ❌ SEM ATIVAÇÃO AUTOMÁTICA

        // ❌ SEM AUTO-AVANÇO
        autoAdvanceAfterActivation: false,

        marginTop: 24,
        spacing: 'small',
        marginBottom: 0,

        // 🔗 HANDLER MANUAL
        onClick: () => {
          console.log('🎯 Connected Step13: Usuário clicou para avançar manualmente');
        }
      },
    },
  ];
};

export const getConnectedStep13Template = () => {
  return ConnectedStep13Template();
};

export default ConnectedStep13Template;
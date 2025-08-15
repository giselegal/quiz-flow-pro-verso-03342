// 🔗 CONNECTED STEP 02 TEMPLATE - Versão Corrigida sem Hooks
// Template que retorna array de blocos JSON puro, sem dependência de React hooks

import { COMPLETE_QUIZ_QUESTIONS } from '@/data/correctQuizQuestions';

export const ConnectedStep02Template = () => {
  // 🎯 Buscar questão real dos dados (SEM HOOKS)
  const questionData = COMPLETE_QUIZ_QUESTIONS.find(q => q.id === 'q1') || COMPLETE_QUIZ_QUESTIONS[1];
  
  return [
    // 📱 CABEÇALHO COM LOGO E PROGRESSO
    {
      id: 'step02-header',
      type: 'quiz-intro-header',
      properties: {
        logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt: 'Logo Gisele Galvão',
        logoWidth: 96,
        logoHeight: 96,
        progressValue: 10,
        progressMax: 100,
        showBackButton: true,
        spacing: 'small',
        marginTop: 0,
        marginBottom: 0,
      },
    },

    // 🎯 TÍTULO DA QUESTÃO (DADOS REAIS)
    {
      id: 'step02-question-title',
      type: 'text-inline',
      properties: {
        content: questionData.text, // 🎯 TEXTO REAL DA QUESTÃO
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
      id: 'step02-question-counter',
      type: 'text-inline',
      properties: {
        content: 'Questão 1 de 10',
        fontSize: 'text-sm',
        textAlign: 'text-center',
        color: '#6B7280',
        marginBottom: 24,
        spacing: 'small',
        marginTop: 0,
      },
    },

    // 🎯 GRADE DE OPÇÕES CONECTADA (DADOS REAIS)
    {
      id: 'step02-clothing-options',
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
        layout: 'grid',
        columns: 2,
        gap: 16,
        
        // 🔗 Integração via eventos (sem hooks diretos)
        questionId: questionData.id,
        
        // Comportamento
        allowMultiple: false,
        maxSelection: questionData.multiSelect || 1,
        autoAdvance: true,
        
        containerWidth: 'full',
        spacing: 'small',
        marginBottom: 16,
      },
    },

    // 🔘 BOTÃO CONECTADO
    {
      id: 'step02-continue-button',
      type: 'button-inline',
      properties: {
        text: 'Continuar →',
        variant: 'primary',
        size: 'large',
        backgroundColor: '#B89B7A',
        textColor: '#ffffff',
        fullWidth: true,
        marginTop: 24,
        textAlign: 'text-center',
        spacing: 'small',
        marginBottom: 0,
        
        // 🎯 Integração via evento de navegação
        onClick: 'navigate-next-step',
        stepId: 'step-02'
      },
    },
  ];
};

// 🎯 FUNÇÃO WRAPPER PARA COMPATIBILIDADE
export const getConnectedStep02Template = () => {
  return ConnectedStep02Template();
};

export default ConnectedStep02Template;
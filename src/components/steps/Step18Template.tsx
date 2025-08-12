/**
 * Step18Template - Template Modular para Etapa 18 do Quiz
 * ✅ QUESTÃO ESTRATÉGICA 6 (FINAL) - NÃO pontua, apenas métricas
 */

export const getStep18Template = () => {
  return [
    {
      id: 'progress-header-step18',
      type: 'quiz-header',
      properties: {
        logoUrl:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt: 'Logo Gisele Galvão',
        logoWidth: 80,
        logoHeight: 80,
        progressValue: 90,
        progressMax: 100,
        showBackButton: false,
        showProgress: true,
        stepNumber: '18 de 21',
        spacing: 'small',
      },
    },
    {
      id: 'question-title-step18',
      type: 'text-inline',
      properties: {
        content: 'QUESTÃO ESTRATÉGICA 6',
        fontSize: 'text-2xl md:text-3xl',
        fontWeight: 'font-bold',
        textAlign: 'text-center',
        color: '#432818',
        marginBottom: 16,
        spacing: 'medium',
      },
    },
    {
      id: 'strategic-question-step18',
      type: 'text-inline',
      properties: {
        content: 'O que mais te motiva a investir em você?',
        fontSize: 'text-xl md:text-2xl',
        fontWeight: 'font-semibold',
        textAlign: 'text-center',
        color: '#432818',
        marginBottom: 32,
        maxWidth: '720px',
        spacing: 'medium',
      },
    },
    {
      id: 'strategic-options-step18',
      type: 'options-grid',
      properties: {
        options: [
          {
            id: 'strategic-18-a',
            text: 'Crescimento profissional',
            category: 'professional',
            strategicType: 'motivation-final',
          },
          {
            id: 'strategic-18-b',
            text: 'Bem-estar pessoal',
            category: 'personal',
            strategicType: 'motivation-final',
          },
          {
            id: 'strategic-18-c',
            text: 'Relacionamentos',
            category: 'relationships',
            strategicType: 'motivation-final',
          },
          {
            id: 'strategic-18-d',
            text: 'Autoestima e confiança',
            category: 'confidence',
            strategicType: 'motivation-final',
          },
        ],
        multiSelect: false,
        columns: 2,
        backgroundColor: '#FFFFFF',
        borderColor: '#E5DDD5',
        hoverBackgroundColor: '#F3E8E6',
        selectedBackgroundColor: '#B89B7A',
        selectedTextColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        spacing: 'medium',
        trackingEnabled: true,
      },
    },
    {
      id: 'navigation-button-step18',
      type: 'button-inline',
      properties: {
        text: 'Finalizar Questões →',
        variant: 'primary',
        size: 'large',
        backgroundColor: '#B89B7A',
        textColor: '#FFFFFF',
        hoverBackgroundColor: '#A1835D',
        borderRadius: 12,
        padding: '16px 32px',
        fontSize: 'text-lg',
        fontWeight: 'font-semibold',
        marginTop: 32,
        marginBottom: 16,
        showShadow: true,
        spacing: 'medium',
        disabled: true,
        requiresSelection: true,
      },
    },
    {
      id: 'strategic-progress-step18',
      type: 'text-inline',
      properties: {
        content: 'Última Questão Estratégica • Não afeta sua pontuação',
        fontSize: 'text-sm',
        textAlign: 'text-center',
        color: '#432818',
        opacity: 0.6,
        marginTop: 16,
        spacing: 'small',
      },
    },
  ];
};

export default getStep18Template;

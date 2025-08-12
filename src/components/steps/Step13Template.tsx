/**
 * Step13Template - Template Modular para Etapa 13 do Quiz
 * ✅ QUESTÃO ESTRATÉGICA 1 - NÃO pontua, apenas métricas
 */

export const getStep13Template = () => {
  return [
    {
      id: 'progress-header-step13',
      type: 'quiz-header',
      properties: {
        logoUrl:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt: 'Logo Gisele Galvão',
        logoWidth: 80,
        logoHeight: 80,
        progressValue: 60,
        progressMax: 100,
        showBackButton: false,
        showProgress: true,
        stepNumber: '13 de 21',
        spacing: 'small',
      },
    },
    {
      id: 'question-title-step13',
      type: 'text-inline',
      properties: {
        content: 'QUESTÃO ESTRATÉGICA 1',
        fontSize: 'text-2xl md:text-3xl',
        fontWeight: 'font-bold',
        textAlign: 'text-center',
        color: '#432818',
        marginBottom: 16,
        spacing: 'medium',
      },
    },
    {
      id: 'strategic-question-step13',
      type: 'text-inline',
      properties: {
        content: 'Em que ocasiões você mais usa as roupas que compra?',
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
      id: 'strategic-options-step13',
      type: 'options-grid',
      properties: {
        options: [
          {
            id: 'strategic-13-a',
            text: 'Trabalho/profissional',
            category: 'work',
            strategicType: 'usage',
          },
          {
            id: 'strategic-13-b',
            text: 'Eventos sociais',
            category: 'social',
            strategicType: 'usage',
          },
          {
            id: 'strategic-13-c',
            text: 'Dia a dia casual',
            category: 'casual',
            strategicType: 'usage',
          },
          {
            id: 'strategic-13-d',
            text: 'Ocasiões especiais',
            category: 'special',
            strategicType: 'usage',
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
      id: 'navigation-button-step13',
      type: 'button-inline',
      properties: {
        text: 'Próxima Questão →',
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
      id: 'strategic-progress-step13',
      type: 'text-inline',
      properties: {
        content: 'Questão Estratégica 1 de 6 • Não afeta sua pontuação',
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

export default getStep13Template;

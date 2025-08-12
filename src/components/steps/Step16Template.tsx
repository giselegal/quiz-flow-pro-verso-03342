/**
 * Step16Template - Template Modular para Etapa 16 do Quiz
 * ✅ QUESTÃO ESTRATÉGICA 4 - NÃO pontua, apenas métricas
 */

export const getStep16Template = () => {
  return [
    {
      id: 'progress-header-step16',
      type: 'quiz-header',
      properties: {
        logoUrl:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt: 'Logo Gisele Galvão',
        logoWidth: 80,
        logoHeight: 80,
        progressValue: 84,
        progressMax: 100,
        showBackButton: false,
        showProgress: true,
        stepNumber: '16 de 21',
        spacing: 'small',
      },
    },
    {
      id: 'question-title-step16',
      type: 'text-inline',
      properties: {
        content: 'QUESTÃO ESTRATÉGICA 4',
        fontSize: 'text-2xl md:text-3xl',
        fontWeight: 'font-bold',
        textAlign: 'text-center',
        color: '#432818',
        marginBottom: 16,
        spacing: 'medium',
      },
    },
    {
      id: 'strategic-question-step16',
      type: 'text-inline',
      properties: {
        content: 'Onde você mais compra roupas?',
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
      id: 'strategic-options-step16',
      type: 'options-grid',
      properties: {
        options: [
          {
            id: 'strategic-16-a',
            text: 'Lojas físicas',
            category: 'physical',
            strategicType: 'shopping',
          },
          {
            id: 'strategic-16-b',
            text: 'Sites online',
            category: 'online',
            strategicType: 'shopping',
          },
          {
            id: 'strategic-16-c',
            text: 'Marketplaces',
            category: 'marketplace',
            strategicType: 'shopping',
          },
          {
            id: 'strategic-16-d',
            text: 'Redes sociais',
            category: 'social',
            strategicType: 'shopping',
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
      id: 'navigation-button-step16',
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
      id: 'strategic-progress-step16',
      type: 'text-inline',
      properties: {
        content: 'Questão Estratégica 4 de 6 • Não afeta sua pontuação',
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

export default getStep16Template;

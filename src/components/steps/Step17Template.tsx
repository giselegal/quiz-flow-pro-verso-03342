/**
 * Step17Template - Template Modular para Etapa 17 do Quiz
 * ✅ QUESTÃO ESTRATÉGICA 5 - NÃO pontua, apenas métricas
 */

export const getStep17Template = () => {
  return [
    {
      id: 'progress-header-step17',
      type: 'quiz-header',
      properties: {
        logoUrl:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt: 'Logo Gisele Galvão',
        logoWidth: 80,
        logoHeight: 80,
        progressValue: 87,
        progressMax: 100,
        showBackButton: false,
        showProgress: true,
        stepNumber: '17 de 21',
        spacing: 'small',
      },
    },
    {
      id: 'question-title-step17',
      type: 'text-inline',
      properties: {
        content: 'QUESTÃO ESTRATÉGICA 5',
        fontSize: 'text-2xl md:text-3xl',
        fontWeight: 'font-bold',
        textAlign: 'text-center',
        color: '#432818',
        marginBottom: 16,
        spacing: 'medium',
      },
    },
    {
      id: 'strategic-question-step17',
      type: 'text-inline',
      properties: {
        content: 'Você já teve consultoria de estilo antes?',
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
      id: 'strategic-options-step17',
      type: 'options-grid',
      properties: {
        options: [
          {
            id: 'strategic-17-a',
            text: 'Continuar →',
            category: 'physical-experience',
            strategicType: 'experience',
          },
          {
            id: 'strategic-17-b',
            text: 'Continuar →',
            category: 'online-experience',
            strategicType: 'experience',
          },
          {
            id: 'strategic-17-c',
            text: 'Continuar →',
            category: 'interested',
            strategicType: 'experience',
          },
          {
            id: 'strategic-17-d',
            text: 'Continuar →',
            category: 'no-experience',
            strategicType: 'experience',
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
      id: 'navigation-button-step17',
      type: 'button-inline',
      properties: {
        text: 'Continuar →',
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
      id: 'strategic-progress-step17',
      type: 'text-inline',
      properties: {
        content: 'Questão Estratégica 5 de 6 • Não afeta sua pontuação',
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

export default getStep17Template;

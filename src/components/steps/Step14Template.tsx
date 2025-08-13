// 🎯 TEMPLATE DE BLOCOS DA ETAPA 14 - QUESTÃO ESTRATÉGICA: ORÇAMENTO

export const getStep14Template = () => {
  return [
    {
      id: 'step14-header',
      type: 'quiz-intro-header',
      properties: {
        logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt: 'Logo Gisele Galvão',
        logoWidth: 96,
        logoHeight: 96,
        progressValue: 77,
        progressMax: 100,
        showBackButton: true,
      },
    },
    {
      id: 'step14-question-title',
      type: 'text-inline',
      properties: {
        content: 'QUAL É SEU ORÇAMENTO MENSAL PARA ROUPAS?',
        fontSize: 'text-2xl',
        fontWeight: 'font-bold',
        textAlign: 'text-center',
        color: '#432818',
      },
    },
    {
      id: 'step14-budget-options',
      type: 'options-grid',
      properties: {
        questionId: 'strategic-3',
        options: [
          { id: 's3a', text: 'Até R$ 200 por mês', category: 'baixo', points: 1 },
          { id: 's3b', text: 'Entre R$ 200 e R$ 500 por mês', category: 'medio-baixo', points: 1 },
          { id: 's3c', text: 'Entre R$ 500 e R$ 1.000 por mês', category: 'medio', points: 1 },
          { id: 's3d', text: 'Entre R$ 1.000 e R$ 2.000 por mês', category: 'medio-alto', points: 1 },
          { id: 's3e', text: 'Acima de R$ 2.000 por mês', category: 'alto', points: 1 },
          { id: 's3f', text: 'Prefiro não informar', category: 'nao-informar', points: 1 },
        ],
        columns: 1,
        showImages: false,
        multipleSelection: false,
        maxSelections: 1,
        minSelections: 1,
      },
    },
    {
      id: 'step14-continue-button',
      type: 'button-inline',
      properties: {
        text: 'Continuar →',
        backgroundColor: '#B89B7A',
        textColor: '#ffffff',
        disabled: true,
      },
    },
  ];
};

export default getStep14Template;
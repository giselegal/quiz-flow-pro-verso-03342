// 🎯 TEMPLATE DE BLOCOS DA ETAPA 12 - QUESTÃO ESTRATÉGICA: ONDE COMPRA ROUPAS

export const getStep12Template = () => {
  return [
    {
      id: 'step12-header',
      type: 'quiz-intro-header',
      properties: {
        logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt: 'Logo Gisele Galvão',
        logoWidth: 96,
        logoHeight: 96,
        progressValue: 66,
        progressMax: 100,
        showBackButton: true,
      },
    },
    {
      id: 'step12-question-title',
      type: 'text-inline',
      properties: {
        content: 'ONDE VOCÊ COSTUMA COMPRAR SUAS ROUPAS?',
        fontSize: 'text-2xl',
        fontWeight: 'font-bold',
        textAlign: 'text-center',
        color: '#432818',
      },
    },
    {
      id: 'step12-shopping-options',
      type: 'options-grid',
      properties: {
        questionId: 'strategic-1',
        options: [
          { id: 's1a', text: 'Shoppings e lojas físicas tradicionais', category: 'shopping-tradicional', points: 1 },
          { id: 's1b', text: 'Lojas online e e-commerce', category: 'online', points: 1 },
          { id: 's1c', text: 'Lojas de departamento grandes', category: 'departamento', points: 1 },
          { id: 's1d', text: 'Boutiques especializadas', category: 'boutique', points: 1 },
          { id: 's1e', text: 'Brechós e lojas de segunda mão', category: 'brecho', points: 1 },
          { id: 's1f', text: 'Mix de todos os lugares', category: 'mix', points: 1 },
        ],
        columns: 1,
        showImages: false,
        multipleSelection: false,
        maxSelections: 1,
        minSelections: 1,
      },
    },
    {
      id: 'step12-continue-button',
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

export default getStep12Template;
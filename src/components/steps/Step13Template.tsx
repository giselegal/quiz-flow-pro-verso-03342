// 🎯 TEMPLATE DE BLOCOS DA ETAPA 13 - QUESTÃO ESTRATÉGICA: MAIOR DIFICULDADE

export const getStep13Template = () => {
  return [
    {
      id: 'step13-header',
      type: 'quiz-intro-header',
      properties: {
        logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt: 'Logo Gisele Galvão',
        logoWidth: 96,
        logoHeight: 96,
        progressValue: 72,
        progressMax: 100,
        showBackButton: true,
      },
    },
    {
      id: 'step13-question-title',
      type: 'text-inline',
      properties: {
        content: 'QUAL É SUA MAIOR DIFICULDADE COM ROUPAS?',
        fontSize: 'text-2xl',
        fontWeight: 'font-bold',
        textAlign: 'text-center',
        color: '#432818',
      },
    },
    {
      id: 'step13-difficulty-options',
      type: 'options-grid',
      properties: {
        questionId: 'strategic-2',
        options: [
          { id: 's2a', text: 'Não sei qual é meu estilo pessoal', category: 'estilo-indefinido', points: 1 },
          { id: 's2b', text: 'Tenho dificuldade para combinar peças', category: 'combinacao', points: 1 },
          { id: 's2c', text: 'Não encontro roupas que me favorecem', category: 'favorecimento', points: 1 },
          { id: 's2d', text: 'Orçamento limitado para roupas', category: 'orcamento', points: 1 },
          { id: 's2e', text: 'Falta de tempo para me arrumar', category: 'tempo', points: 1 },
          { id: 's2f', text: 'Insegurança com meu corpo', category: 'inseguranca', points: 1 },
          { id: 's2g', text: 'Não tenho nenhuma dificuldade específica', category: 'nenhuma', points: 1 },
        ],
        columns: 1,
        showImages: false,
        multipleSelection: false,
        maxSelections: 1,
        minSelections: 1,
      },
    },
    {
      id: 'step13-continue-button',
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

export default getStep13Template;
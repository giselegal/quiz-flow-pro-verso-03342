// 🎯 TEMPLATE DE BLOCOS DA ETAPA 11 - QUESTÃO 10: INSPIRAÇÕES DE ESTILO

export const getStep11Template = () => {
  return [
    {
      id: 'step11-header',
      type: 'quiz-intro-header',
      properties: {
        logoUrl:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt: 'Logo Gisele Galvão',
        logoWidth: 96,
        logoHeight: 96,
        progressValue: 61,
        progressMax: 100,
        showBackButton: true,
      },
    },
    {
      id: 'step11-question-title',
      type: 'text-inline',
      properties: {
        content: 'QUAIS INSPIRAÇÕES MAIS COMBINAM COM VOCÊ?',
        fontSize: 'text-2xl',
        fontWeight: 'font-bold',
        textAlign: 'text-center',
        color: '#432818',
      },
    },
    {
      id: 'step11-inspiration-options',
      type: 'options-grid',
      properties: {
        questionId: 'q10',
        options: [
          { id: '10a', text: 'Natureza e vida ao ar livre', category: 'Natural', points: 4 },
          { id: '10b', text: 'Elegância atemporal e clássica', category: 'Clássico', points: 4 },
          { id: '10c', text: 'Modernidade e inovação', category: 'Contemporâneo', points: 3 },
          { id: '10d', text: 'Luxo e sofisticação', category: 'Elegante', points: 4 },
          { id: '10e', text: 'Romance e feminilidade', category: 'Romântico', points: 4 },
          { id: '10f', text: 'Sensualidade e confiança', category: 'Sexy', points: 4 },
          { id: '10g', text: 'Poder e impacto', category: 'Dramático', points: 4 },
          { id: '10h', text: 'Arte e expressão única', category: 'Criativo', points: 4 },
        ],
        columns: 2,
        showImages: true,
        multipleSelection: true,
        maxSelections: 3,
        minSelections: 3,
      },
    },
    {
      id: 'step11-continue-button',
      type: 'button-inline',
      properties: {
        text: 'Finalizar Quiz! →',
        backgroundColor: '#B89B7A',
        textColor: '#ffffff',
        disabled: true,
      },
    },
  ];
};

export default getStep11Template;

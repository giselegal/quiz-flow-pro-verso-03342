// 🎯 TEMPLATE DE BLOCOS DA ETAPA 17 - PRIMEIRO RESULTADO

export const getStep17Template = () => {
  return [
    {
      id: 'step17-header',
      type: 'quiz-intro-header',
      properties: {
        logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt: 'Logo Gisele Galvão',
        logoWidth: 96,
        logoHeight: 96,
        progressValue: 94,
        progressMax: 100,
        showBackButton: false,
      },
    },
    {
      id: 'step17-result-title',
      type: 'text-inline',
      properties: {
        content: 'Qual desses resultados você mais gostaria de alcançar com os Guias de Estilo e Imagem?',
        fontSize: 'text-2xl',
        fontWeight: 'font-bold',
        textAlign: 'text-center',
        color: '#432818',
      },
    },
    {
      id: 'step17-result-card',
      type: 'result-style-card',
      properties: {
        styleName: 'ESTILO ELEGANTE',
        styleDescription: 'Você tem preferência por peças clássicas, refinadas e sofisticadas.',
        styleImage: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp',
        backgroundColor: '#FAF9F7',
        borderColor: '#B89B7A',
      },
    },
    {
      id: 'step17-continue-button',
      type: 'button-inline',
      properties: {
        text: 'Ver Mais Detalhes →',
        backgroundColor: '#B89B7A',
        textColor: '#ffffff',
      },
    },
  ];
};

export default getStep17Template;
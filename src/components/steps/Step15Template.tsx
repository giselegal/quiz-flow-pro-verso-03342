// 🎯 TEMPLATE DE BLOCOS DA ETAPA 15 - TRANSIÇÃO PARA ANÁLISE

export const getStep15Template = () => {
  return [
    {
      id: 'step15-header',
      type: 'quiz-intro-header',
      properties: {
        logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt: 'Logo Gisele Galvão',
        logoWidth: 96,
        logoHeight: 96,
        progressValue: 83,
        progressMax: 100,
        showBackButton: false,
      },
    },
    {
      id: 'step15-title',
      type: 'text-inline',
      properties: {
        content: 'Pense no quanto você já gastou com roupas que não usa ou que não representam quem você é...',
        fontSize: 'text-3xl',
        fontWeight: 'font-bold',
        textAlign: 'text-center',
        color: '#432818',
      },
    },
    {
      id: 'step15-loading-image',
      type: 'image-display-inline',
      properties: {
        src: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1746838157/20250509_2150_Idade_e_Experi%C3%AAncia_simple_compose_01jtvtdbkfcj3g9f8tmexn5chm_wppuxb.webp',
        alt: 'Analisando seu perfil de estilo',
        width: 400,
        height: 300,
      },
    },
    {
      id: 'step15-description',
      type: 'text-inline',
      properties: {
        content: 'Estamos processando suas respostas para identificar seu estilo predominante...',
        fontSize: 'text-lg',
        textAlign: 'text-center',
        color: '#6B7280',
      },
    },
    {
      id: 'step15-auto-advance',
      type: 'auto-advance',
      properties: {
        delay: 4000,
        nextStep: '/quiz/step-16',
      },
    },
  ];
};

export default getStep15Template;
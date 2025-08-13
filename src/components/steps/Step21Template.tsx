// 🎯 TEMPLATE DE BLOCOS DA ETAPA 21 - THANK YOU PAGE

export const getStep21Template = () => {
  return [
    {
      id: 'step21-header',
      type: 'quiz-intro-header',
      properties: {
        logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt: 'Logo Gisele Galvão',
        logoWidth: 120,
        logoHeight: 120,
        progressValue: 100,
        progressMax: 100,
        showBackButton: false,
        showProgress: false,
      },
    },
    {
      id: 'step21-success-title',
      type: 'text-inline',
      properties: {
        content: '🎉 PARABÉNS! TUDO PRONTO!',
        fontSize: 'text-3xl',
        fontWeight: 'font-bold',
        textAlign: 'text-center',
        color: '#B89B7A',
      },
    },
    {
      id: 'step21-confirmation',
      type: 'text-inline',
      properties: {
        content: 'Seu guia personalizado está sendo preparado e chegará no seu e-mail em instantes!',
        fontSize: 'text-lg',
        textAlign: 'text-center',
        color: '#432818',
      },
    },
    {
      id: 'step21-success-image',
      type: 'image-display-inline',
      properties: {
        src: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1746838175/20250509_2156_Resultado_Final_simple_compose_01jtvtjm8wn0q6r9p3b7k2mvcl_hdz8kt.webp',
        alt: 'Guia de estilo enviado com sucesso',
        width: 400,
        height: 300,
      },
    },
    {
      id: 'step21-next-steps',
      type: 'next-steps',
      properties: {
        title: '📋 Próximos Passos:',
        steps: [
          '📧 Verifique sua caixa de entrada (e spam também)',
          '📱 Salve nosso e-mail nos seus contatos',
          '💬 Aguarde convite para o grupo VIP do WhatsApp',
          '✨ Comece a transformar seu estilo hoje mesmo!'
        ],
        backgroundColor: '#F9F9F7',
        borderColor: '#B89B7A',
      },
    },
    {
      id: 'step21-final-message',
      type: 'final-message',
      properties: {
        message: '💕 Obrigada por confiar em mim para te ajudar a descobrir seu estilo único!',
        author: 'Com carinho, Gisele Galvão',
        backgroundColor: '#FAF9F7',
        textColor: '#432818',
        fontStyle: 'italic',
        textAlign: 'text-center',
      },
    },
  ];
};

export default getStep21Template;
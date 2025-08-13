// 🎯 TEMPLATE DE BLOCOS DA ETAPA 20 - CAPTURA DE LEAD

export const getStep20Result = () => {
  return [
    {
      id: 'step20-header',
      type: 'quiz-intro-header',
      properties: {
        logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt: 'Logo Gisele Galvão',
        logoWidth: 96,
        logoHeight: 96,
        progressValue: 100,
        progressMax: 100,
        showBackButton: false,
        showProgress: true,
      },
    },
    {
      id: 'step20-congratulations',
      type: 'text-inline',
      properties: {
        content: '🎉 PARABÉNS! SEU ESTILO FOI DESCOBERTO',
        fontSize: 'text-2xl',
        fontWeight: 'font-bold',
        textAlign: 'text-center',
        color: '#B89B7A',
      },
    },
    {
      id: 'step20-form-title',
      type: 'text-inline',
      properties: {
        content: 'RECEBA SEU GUIA COMPLETO DE ESTILO',
        fontSize: 'text-xl',
        fontWeight: 'font-bold',
        textAlign: 'text-center',
        color: '#432818',
      },
    },
    {
      id: 'step20-benefits',
      type: 'benefits-list',
      properties: {
        benefits: [
          '✨ Guia personalizado com +50 dicas exclusivas',
          '🎨 Paleta de cores ideal para seu estilo',
          '👗 Lista completa de peças essenciais',
          '💡 Dicas de combinações e styling',
          '🛍️ Sugestões de onde encontrar as peças',
          '📱 Acesso ao grupo VIP no WhatsApp'
        ],
        backgroundColor: '#F9F9F7',
        borderColor: '#B89B7A',
      },
    },
    {
      id: 'step20-lead-form',
      type: 'lead-capture-form',
      properties: {
        fields: [
          { type: 'text', name: 'firstName', placeholder: 'Digite seu primeiro nome', required: true },
          { type: 'email', name: 'email', placeholder: 'Digite seu melhor e-mail', required: true },
          { type: 'tel', name: 'phone', placeholder: '(11) 99999-9999', required: false }
        ],
        submitText: '🎁 QUERO RECEBER MEU GUIA GRATUITO!',
        submitBackgroundColor: '#B89B7A',
        submitTextColor: '#ffffff',
      },
    },
  ];
};

export default getStep20Result;
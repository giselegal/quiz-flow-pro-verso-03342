// 🎯 TEMPLATE DE BLOCOS DA ETAPA 19 - RESULTADO DETALHADO

export const getStep19Template = () => {
  return [
    {
      id: 'step19-header',
      type: 'quiz-intro-header',
      properties: {
        logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt: 'Logo Gisele Galvão',
        logoWidth: 96,
        logoHeight: 96,
        progressValue: 99,
        progressMax: 100,
        showBackButton: false,
      },
    },
    {
      id: 'step19-final-title',
      type: 'text-inline',
      properties: {
        content: 'SEU PERFIL DE ESTILO COMPLETO',
        fontSize: 'text-3xl',
        fontWeight: 'font-bold',
        textAlign: 'text-center',
        color: '#432818',
      },
    },
    {
      id: 'step19-color-palette',
      type: 'color-palette',
      properties: {
        title: 'Sua Paleta de Cores Ideal',
        colors: ['#2C3E50', '#FFFFFF', '#F8F9FA', '#6C757D', '#B89B7A'],
        colorNames: ['Azul Marinho', 'Branco', 'Off-White', 'Cinza', 'Caramelo'],
      },
    },
    {
      id: 'step19-style-tips',
      type: 'style-tips',
      properties: {
        title: 'Dicas Personalizadas para Você',
        tips: [
          '✨ Invista em peças de qualidade em cores neutras',
          '💎 Aposte em acessórios finos e delicados',
          '👠 Prefira saltos médios e sapatos clássicos',
          '🎯 Combine texturas diferentes para criar interesse visual'
        ],
      },
    },
    {
      id: 'step19-cta-container',
      type: 'cta-container',
      properties: {
        title: '🎁 QUER RECEBER SEU GUIA COMPLETO?',
        subtitle: 'Receba gratuitamente um guia personalizado com mais de 50 dicas exclusivas!',
        backgroundColor: '#F8F6F4',
        borderColor: '#B89B7A',
      },
    },
    {
      id: 'step19-get-guide-button',
      type: 'button-inline',
      properties: {
        text: '📧 Quero Receber o Guia Gratuito!',
        backgroundColor: '#B89B7A',
        textColor: '#ffffff',
        fontWeight: 'font-bold',
        pulse: true,
      },
    },
  ];
};

export default getStep19Template;
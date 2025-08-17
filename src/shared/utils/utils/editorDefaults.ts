// @ts-nocheck
export const getDefaultContentForType = (type: string) => {
  switch (type) {
    case 'header':
      return {
        title: 'Título do Cabeçalho',
        subtitle: 'Subtítulo opcional',
        textColor: '#432818',
        backgroundColor: '#faf8f5',
      };
    case 'text':
      return {
        text: 'Adicione seu texto aqui...',
        textColor: '#432818',
        fontSize: '16px',
      };
    case 'image':
      return {
        src: 'https://via.placeholder.com/600x400',
        alt: 'Imagem de exemplo',
        width: '100%',
        height: 'auto',
      };
    case 'button':
      return {
        buttonText: 'Clique aqui',
        buttonUrl: '#',
        backgroundColor: '#B89B7A',
        textColor: '#ffffff',
      };
    case 'spacer':
      return {
        height: '50px',
      };
    case 'benefits-list':
      return {
        title: 'Por que escolher nosso produto?',
        subtitle: 'Descubra todos os benefícios inclusos',
        benefits: [
          {
            id: 'benefit-1',
            title: 'Análise Completa de Estilo',
            description: 'Identificação detalhada do seu perfil e características únicas',
            icon: 'star',
            isHighlight: true,
            isIncluded: true,
            value: 'R$ 150',
            category: 'premium',
          },
          {
            id: 'benefit-2',
            title: 'Guia Personalizado',
            description: 'Material exclusivo criado especialmente para você',
            icon: 'crown',
            isHighlight: false,
            isIncluded: true,
            value: 'R$ 80',
            category: 'standard',
          },
          {
            id: 'benefit-3',
            title: 'Suporte 30 dias',
            description: 'Acompanhamento completo durante sua transformação',
            icon: 'shield',
            isHighlight: false,
            isIncluded: true,
            value: 'R$ 120',
            category: 'support',
          },
        ],
        layout: 'list',
        showIcons: true,
        showDescriptions: true,
        showValues: false,
        animateOnScroll: true,
        highlightStyle: 'premium',
        backgroundColor: '#ffffff',
        textColor: '#432818',
        accentColor: '#B89B7A',
        cardStyle: 'elevated',
        spacing: 'normal',
      };
    default:
      return {};
  }
};

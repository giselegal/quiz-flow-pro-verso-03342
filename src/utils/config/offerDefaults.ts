import { OfferContent, OfferSection, Section } from '@/types/resultPageConfig';

export const createOfferConfig = (): Section => ({
  visible: true,
  content: {
    title: 'TRANSFORME SEU ESTILO PESSOAL',
    subtitle: 'Com a nossa consultoria especializada',
    description:
      'Descubra como destacar sua beleza natural e criar um guarda-roupa que realmente combine com você.',
    ctaText: 'QUERO COMEÇAR AGORA',
    ctaUrl: '#comprar',
    heroImage:
      'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911578/BANNER_CONSULTORIA_GISELE_GALV%C3%83O_s2fliv.webp',
    price: 'R$ 197',
    regularPrice: 'R$ 397',
  },
  style: {
    backgroundColor: '#F9F5F1',
    textAlign: 'center',
    paddingY: '2rem',
    paddingX: '1rem',
  },
});

export const createOfferSectionConfig = (): OfferSection => {
  return {
    hero: {
      visible: true,
      content: {
        title: 'TRANSFORME SEU ESTILO PESSOAL',
        subtitle: 'Com a nossa consultoria especializada',
        description:
          'Descubra como destacar sua beleza natural e criar um guarda-roupa que realmente combine com você.',
        ctaText: 'QUERO COMEÇAR AGORA',
        ctaUrl: '#comprar',
        heroImage:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911578/BANNER_CONSULTORIA_GISELE_GALV%C3%83O_s2fliv.webp',
        price: 'R$ 197',
        regularPrice: 'R$ 397',
      },
      style: {
        backgroundColor: '#F9F5F1',
        textAlign: 'center',
        paddingY: '2rem',
        paddingX: '1rem',
      },
    },
    benefits: {
      content: {
        title: 'O QUE VOCÊ VAI RECEBER',
        items: [
          'Análise personalizada do seu biotipo e coloração pessoal',
          'Guia completo de peças que valorizam seu corpo',
          'Consultoria de 1 hora com nossa especialista',
          'Acesso a materiais exclusivos',
        ],
      },
      style: {
        backgroundColor: '#FFFFFF',
        textAlign: 'center',
        paddingY: '2rem',
        paddingX: '1rem',
      },
      visible: true,
    },
    products: {
      content: {},
      style: {},
      visible: true,
    },
    pricing: {
      content: {},
      style: {},
      visible: true,
    },
    testimonials: {
      content: {},
      style: {},
      visible: true,
    },
    guarantee: {
      content: {},
      style: {},
      visible: true,
    },
  };
};

import { BlockDefinition } from '@/types/blocks';

export const step21BlockDefinition: BlockDefinition = {
  type: 'step-21-offer',
  name: 'Oferta (Etapa 21)',
  description: 'Página de oferta completa e personalizável',
  category: 'offer',
  icon: null,
  defaultProps: {
    header: {
      logoUrl: 'https://placehold.co/200x60',
      logoAlt: 'Logo da Empresa',
      logoWidth: 200,
      logoHeight: 60,
      isSticky: true,
      backgroundColor: '#ffffff',
    },
    hero: {
      title: 'Título Principal da Oferta',
      subtitle: 'Subtítulo explicativo da oferta',
      imageUrl: 'https://placehold.co/600x400',
      imageAlt: 'Imagem Principal',
      imageWidth: 600,
      imageHeight: 400,
      ctaText: 'Quero Aproveitar',
      ctaUrl: '#oferta',
    },
    problem: {
      title: 'Principais Desafios',
      problems: ['Problema 1', 'Problema 2', 'Problema 3'],
      highlightText: 'Destaque importante',
      imageUrl: 'https://placehold.co/500x300',
      imageAlt: 'Ilustração dos Problemas',
      imageWidth: 500,
      imageHeight: 300,
      layout: 'side-by-side',
    },
    solution: {
      title: 'A Solução Ideal',
      description: 'Descrição detalhada da solução',
      benefits: ['Benefício 1', 'Benefício 2', 'Benefício 3'],
      imageUrl: 'https://placehold.co/500x300',
      imageAlt: 'Ilustração da Solução',
      imageWidth: 500,
      imageHeight: 300,
      countdown: {
        hours: 48,
        minutes: 0,
        seconds: 0,
      },
    },
    products: {
      title: 'Nossos Produtos',
      description: 'Escolha o plano ideal para você',
      items: [
        {
          id: 'basic',
          title: 'Plano Básico',
          description: 'Ideal para iniciantes',
          imageUrl: 'https://placehold.co/300x200',
          imageAlt: 'Plano Básico',
          imageWidth: 300,
          imageHeight: 200,
          price: 'R$ 97,00',
          installments: {
            quantity: 3,
            amount: 'R$ 32,33',
          },
          features: ['Recurso 1', 'Recurso 2', 'Recurso 3'],
        },
      ],
    },
    guarantee: {
      title: 'Garantia de 7 Dias',
      description: 'Satisfação garantida ou seu dinheiro de volta',
      imageUrl: 'https://placehold.co/400x400',
      imageAlt: 'Selo de Garantia',
      imageWidth: 400,
      imageHeight: 400,
      layout: 'centered',
    },
    faq: {
      title: 'Perguntas Frequentes',
      questions: [
        {
          question: 'Pergunta 1?',
          answer: 'Resposta detalhada da pergunta 1',
        },
        {
          question: 'Pergunta 2?',
          answer: 'Resposta detalhada da pergunta 2',
        },
      ],
    },
  },
  properties: {}
};

// @ts-nocheck
import { SimpleComponent, QuizOption, BonusItem, FaqItem } from '@/interfaces/quiz';
import PlaceholderUtils from './placeholderUtils';

// Dados padrão para componentes
export const defaultImageData = {
  src: PlaceholderUtils.generatePlaceholderImage(400, 300),
  alt: 'Imagem padrão',
};

export const defaultAvatarData = {
  avatar: PlaceholderUtils.generatePlaceholderImage(64, 64),
  name: 'Nome do usuário',
};

export const defaultTestimonialData = {
  text: 'Este é um depoimento de exemplo que demonstra como o componente funciona.',
  author: 'João Silva',
  avatar: PlaceholderUtils.generatePlaceholderImage(48, 48),
  role: 'Cliente satisfeito',
};

export const getDefaultData = (type: SimpleComponent['type']): SimpleComponent['data'] => {
  switch (type) {
    case 'logo':
      return {
        src: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        alt: 'Logo',
        width: 96,
        height: 96,
      };
    case 'progress':
      return { progressValue: 50, showPercentage: true };
    case 'title':
      return { text: 'Novo Título', fontSize: '2.5rem', fontWeight: '700' };
    case 'subtitle':
      return { text: 'Novo Subtítulo', fontSize: '1.25rem' };
    case 'text':
      return { text: 'Parágrafo de texto editável.', fontSize: '1rem' };
    case 'image':
      return {
        src: PlaceholderUtils.generatePlaceholderImage(400, 300),
        alt: 'Nova imagem',
        width: 400,
        height: 300,
      };
    case 'input':
      return {
        label: 'CAMPO',
        placeholder: 'Digite aqui...',
        required: false,
        type: 'text',
      };
    case 'options':
      return {
        text: 'Selecione uma opção:',
        hasImages: false,
        multiSelect: false,
        maxSelections: 1,
        options: [
          { id: 'opt-1', text: 'Opção 1', value: 'option1' },
          { id: 'opt-2', text: 'Opção 2', value: 'option2' },
        ] as QuizOption[],
      };
    case 'button':
      return { text: 'CLIQUE AQUI', variant: 'primary' };
    case 'spacer':
      return { height: 32 };
    case 'video':
      return {
        videoUrl: '',
        title: 'Vídeo',
      };
    case 'testimonial':
      return {
        text: 'Este produto mudou minha vida completamente! Recomendo para todos que querem resultados reais.',
        name: 'Cliente Satisfeito',
        role: 'Cliente verificado',
        avatar: PlaceholderUtils.generatePlaceholderImage(60, 60),
      };
    case 'price':
      return {
        price: '97',
        originalPrice: '197',
        installments: '9,90',
        currency: 'R$',
      };
    case 'countdown':
      return {
        title: '⏰ OFERTA LIMITADA!',
        endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      };
    case 'guarantee':
      return {
        title: 'Garantia de 30 Dias',
        text: 'Se não ficar satisfeito, devolvemos 100% do seu dinheiro!',
        guaranteeDays: 30,
      };
    case 'bonus':
      return {
        bonuses: [
          {
            id: 'bonus1',
            title: 'Bônus #1: Guia Completo',
            value: 'R$ 197',
            description: 'Material exclusivo para acelerar seus resultados',
          },
          {
            id: 'bonus2',
            title: 'Bônus #2: Acesso VIP',
            value: 'R$ 297',
            description: 'Grupo exclusivo para networking',
          },
        ] as BonusItem[],
      };
    case 'faq':
      return {
        faqs: [
          {
            id: 'faq1',
            question: 'Como funciona a garantia?',
            answer:
              'Oferecemos 30 dias de garantia incondicional. Se não ficar satisfeito, devolvemos seu dinheiro.',
          },
          {
            id: 'faq2',
            question: 'Quanto tempo tenho acesso?',
            answer: 'O acesso é vitalício! Você pode acessar quando quiser, quantas vezes quiser.',
          },
        ] as FaqItem[],
      };
    case 'social-proof':
      return {
        customerCount: '5.000',
        rating: '4.9',
        reviewCount: '1.247',
        socialProofText: 'pessoas já transformaram seus resultados',
      };
    default:
      return {};
  }
};

export const getDefaultStyle = (type: SimpleComponent['type']): SimpleComponent['style'] => {
  switch (type) {
    case 'title':
      return {
        fontSize: '2.5rem',
        fontWeight: '700',
        textAlign: 'center',
        color: '#432818',
        marginBottom: '1rem',
      };
    case 'subtitle':
      return {
        fontSize: '1.25rem',
        textAlign: 'center',
        color: '#6B4F43',
        marginBottom: '1rem',
      };
    case 'text':
      return {
        fontSize: '1rem',
        textAlign: 'left',
        color: '#374151',
        marginBottom: '1rem',
      };
    case 'image':
      return {
        textAlign: 'center',
        marginBottom: '1rem',
        width: '100%',
        maxWidth: '400px',
      };
    case 'button':
      return {
        width: '100%',
        height: '3rem',
        backgroundColor: 'hsl(var(--primary))',
        color: 'hsl(var(--primary-foreground))',
        borderRadius: '0.375rem',
        marginBottom: '1rem',
      };
    case 'spacer':
      return {
        height: '2rem',
        width: '100%',
      };
    case 'input':
      return {
        width: '100%',
        marginBottom: '1rem',
      };
    case 'options':
      return {
        display: 'grid',
        gap: '1rem',
        marginBottom: '2rem',
      };
    case 'progress':
      return {
        width: '100%',
        marginBottom: '2rem',
      };
    case 'logo':
      return {
        textAlign: 'center',
        marginBottom: '1rem',
        maxWidth: '96px',
      };
    default:
      return {};
  }
};

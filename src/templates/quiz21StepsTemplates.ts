// =====================================================================
// templates/quiz21StepsTemplates.ts - Templates das 21 Etapas do Quiz
// =====================================================================

import { type BlockData } from '../types/blocks';

export interface QuizStepTemplate {
  id: string;
  name: string;
  description: string;
  type: 'intro' | 'name-input' | 'question' | 'transition' | 'strategic' | 'result' | 'offer';
  blocks: BlockData[];
  settings?: any;
}

export const quiz21StepsTemplates: QuizStepTemplate[] = [
  // ETAPA 1: INTRODUÇÃO
  {
    id: 'etapa-1',
    name: 'Introdução',
    description: 'Apresentação do Quiz de Estilo',
    type: 'intro',
    blocks: [
      {
        id: 'intro-header',
        type: 'vertical-canvas-header',
        properties: {
          title: 'Descubra Seu Estilo Único',
          subtitle: 'Quiz Personalizado de Descoberta de Estilo',
          description: 'Descubra qual estilo combina mais com você através deste quiz personalizado baseado em anos de experiência em consultoria de imagem.',
          showBackButton: false,
          showProgress: false
        }
      },
      {
        id: 'intro-benefits',
        type: 'text-inline',
        properties: {
          content: '• São apenas 21 etapas rápidas\n• Leva menos de 5 minutos\n• Resultado personalizado instantâneo\n• Baseado em dados reais de consultoria',
          fontSize: 'medium',
          textAlign: 'left'
        }
      },
      {
        id: 'intro-cta',
        type: 'button-inline',
        properties: {
          text: 'Começar Quiz Agora',
          variant: 'primary',
          size: 'large',
          fullWidth: true
        }
      }
    ]
  },

  // ETAPA 2: COLETA DE NOME
  {
    id: 'etapa-2',
    name: 'Coleta de Nome',
    description: 'Captura do nome do participante',
    type: 'name-input',
    blocks: [
      {
        id: 'name-header',
        type: 'heading-inline',
        properties: {
          text: 'Vamos personalizar sua experiência!',
          level: 2,
          textAlign: 'center'
        }
      },
      {
        id: 'name-subtitle',
        type: 'text-inline',
        properties: {
          content: 'Como podemos te chamar?',
          fontSize: 'medium',
          textAlign: 'center'
        }
      },
      {
        id: 'name-input',
        type: 'form-input',
        properties: {
          label: 'Seu nome',
          placeholder: 'Digite seu primeiro nome',
          required: true,
          type: 'text'
        }
      },
      {
        id: 'name-continue',
        type: 'button-inline',
        properties: {
          text: 'Continuar',
          variant: 'primary',
          size: 'large',
          fullWidth: true
        }
      }
    ]
  },

  // ETAPA 3: Q1 - TIPO DE ROUPA
  {
    id: 'etapa-3',
    name: 'Q1: Tipo de Roupa',
    description: 'QUAL O SEU TIPO DE ROUPA FAVORITA?',
    type: 'question',
    blocks: [
      {
        id: 'q1-header',
        type: 'quiz-progress',
        properties: {
          currentStep: 1,
          totalSteps: 21,
          progress: 14
        }
      },
      {
        id: 'q1-question',
        type: 'quiz-question',
        properties: {
          questionId: 'q1',
          title: 'QUAL O SEU TIPO DE ROUPA FAVORITA?',
          subtitle: 'Selecione até 3 opções que mais combinam com você',
          type: 'both',
          multiSelect: 3,
          required: true,
          options: [
            {
              id: '1a',
              text: 'Conforto, leveza e praticidade no vestir.',
              imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp',
              styleCategory: 'Natural',
              points: 1
            },
            {
              id: '1b',
              text: 'Discrição, caimento clássico e sobriedade.',
              imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp',
              styleCategory: 'Clássico',
              points: 1
            },
            {
              id: '1c',
              text: 'Praticidade com um toque de estilo atual.',
              imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp',
              styleCategory: 'Contemporâneo',
              points: 1
            },
            {
              id: '1d',
              text: 'Sofisticação em looks estruturados e refinados.',
              imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_mjrfcl.webp',
              styleCategory: 'Elegante',
              points: 1
            },
            {
              id: '1e',
              text: 'Delicadeza em tecidos suaves e fluidos.',
              imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/15_xezvcy.webp',
              styleCategory: 'Romântico',
              points: 1
            },
            {
              id: '1f',
              text: 'Sensualidade com destaque para o corpo.',
              imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735316/16_mpqpew.webp',
              styleCategory: 'Sexy',
              points: 1
            },
            {
              id: '1g',
              text: 'Impacto visual com peças estruturadas e assimétricas.',
              imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735319/17_m5ogub.webp',
              styleCategory: 'Dramático',
              points: 1
            },
            {
              id: '1h',
              text: 'Mix criativo com formas ousadas e originais.',
              imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/18_j8ipfb.webp',
              styleCategory: 'Criativo',
              points: 1
            }
          ]
        }
      }
    ]
  },

  // ETAPA 4: Q2 - PERSONALIDADE
  {
    id: 'etapa-4',
    name: 'Q2: Personalidade',
    description: 'RESUMA A SUA PERSONALIDADE:',
    type: 'question',
    blocks: [
      {
        id: 'q2-header',
        type: 'quiz-progress',
        properties: {
          currentStep: 2,
          totalSteps: 21,
          progress: 19
        }
      },
      {
        id: 'q2-question',
        type: 'quiz-question',
        properties: {
          questionId: 'q2',
          title: 'RESUMA A SUA PERSONALIDADE:',
          subtitle: 'Selecione até 3 características que mais definem você',
          type: 'text',
          multiSelect: 3,
          required: true,
          options: [
            { id: '2a', text: 'Informal, espontânea, alegre, essencialista', styleCategory: 'Natural', points: 1 },
            { id: '2b', text: 'Conservadora, séria, organizada', styleCategory: 'Clássico', points: 1 },
            { id: '2c', text: 'Informada, ativa, prática', styleCategory: 'Contemporâneo', points: 1 },
            { id: '2d', text: 'Exigente, sofisticada, seletiva', styleCategory: 'Elegante', points: 1 },
            { id: '2e', text: 'Feminina, meiga, delicada, sensível', styleCategory: 'Romântico', points: 1 },
            { id: '2f', text: 'Glamorosa, vaidosa, sensual', styleCategory: 'Sexy', points: 1 },
            { id: '2g', text: 'Cosmopolita, moderna e audaciosa', styleCategory: 'Dramático', points: 1 },
            { id: '2h', text: 'Exótica, aventureira, livre', styleCategory: 'Criativo', points: 1 }
          ]
        }
      }
    ]
  },

  // ETAPA 5: Q3 - VISUAL
  {
    id: 'etapa-5',
    name: 'Q3: Visual',
    description: 'QUAL VISUAL VOCÊ MAIS SE IDENTIFICA?',
    type: 'question',
    blocks: [
      {
        id: 'q3-header',
        type: 'quiz-progress',
        properties: {
          currentStep: 3,
          totalSteps: 21,
          progress: 24
        }
      },
      {
        id: 'q3-question',
        type: 'quiz-question',
        properties: {
          questionId: 'q3',
          title: 'QUAL VISUAL VOCÊ MAIS SE IDENTIFICA?',
          subtitle: 'Selecione até 3 visuais que mais combinam com você',
          type: 'both',
          multiSelect: 3,
          required: true,
          options: [
            {
              id: '3a',
              text: 'Visual leve, despojado e natural',
              imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/2_ziffwx.webp',
              styleCategory: 'Natural',
              points: 1
            },
            {
              id: '3b',
              text: 'Visual clássico e tradicional',
              imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/3_asaunw.webp',
              styleCategory: 'Clássico',
              points: 1
            },
            {
              id: '3c',
              text: 'Visual casual com toque atual',
              imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/13_uvbciq.webp',
              styleCategory: 'Contemporâneo',
              points: 1
            },
            {
              id: '3d',
              text: 'Visual refinado e imponente',
              imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/5_dhrgpf.webp',
              styleCategory: 'Elegante',
              points: 1
            },
            {
              id: '3e',
              text: 'Visual romântico, feminino e delicado',
              imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/6_gnoxfg.webp',
              styleCategory: 'Romântico',
              points: 1
            },
            {
              id: '3f',
              text: 'Visual sensual, com saia justa e decote',
              imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735327/7_ynez1z.webp',
              styleCategory: 'Sexy',
              points: 1
            },
            {
              id: '3g',
              text: 'Visual marcante e urbano (jeans + jaqueta)',
              imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/8_yqu3hw.webp',
              styleCategory: 'Dramático',
              points: 1
            },
            {
              id: '3h',
              text: 'Visual criativo, colorido e ousado',
              imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/9_x6so6a.webp',
              styleCategory: 'Criativo',
              points: 1
            }
          ]
        }
      }
    ]
  },

  // ETAPA 13: TRANSIÇÃO
  {
    id: 'etapa-13',
    name: 'Transição',
    description: 'Análise dos resultados parciais',
    type: 'transition',
    blocks: [
      {
        id: 'transition-header',
        type: 'heading-inline',
        properties: {
          text: '🕐 Enquanto calculamos o seu resultado...',
          level: 2,
          textAlign: 'center'
        }
      },
      {
        id: 'transition-content',
        type: 'text-inline',
        properties: {
          content: 'Estamos analisando suas respostas para criar um perfil de estilo personalizado para você.',
          fontSize: 'medium',
          textAlign: 'center'
        }
      },
      {
        id: 'transition-stats',
        type: 'stat-inline',
        properties: {
          value: '10.000+',
          label: 'Mulheres já descobriram seu estilo',
          description: 'Com nosso método comprovado'
        }
      }
    ]
  },

  // ETAPA 20: RESULTADO
  {
    id: 'etapa-20',
    name: 'Resultado',
    description: 'Página de resultado personalizada',
    type: 'result',
    blocks: [
      {
        id: 'result-header',
        type: 'result-header-inline',
        properties: {
          title: 'Parabéns! Seu estilo foi identificado',
          subtitle: 'Baseado nas suas respostas, calculamos seu perfil único',
          showConfetti: true
        }
      },
      {
        id: 'result-primary-style',
        type: 'style-card-inline',
        properties: {
          title: 'Seu Estilo Predominante',
          styleType: 'primary',
          showPercentage: true,
          showDescription: true
        }
      },
      {
        id: 'result-secondary-styles',
        type: 'style-card-inline',
        properties: {
          title: 'Seus Estilos Complementares',
          styleType: 'secondary',
          showPercentage: true,
          showDescription: false
        }
      },
      {
        id: 'result-testimonials',
        type: 'testimonials-inline',
        properties: {
          title: 'O que outras mulheres estão dizendo:',
          showImages: true,
          layout: 'carousel'
        }
      }
    ]
  },

  // ETAPA 21: OFERTA
  {
    id: 'etapa-21',
    name: 'Oferta',
    description: 'Apresentação da oferta final',
    type: 'offer',
    blocks: [
      {
        id: 'offer-header',
        type: 'heading-inline',
        properties: {
          text: 'Quer descobrir TUDO sobre seu estilo?',
          level: 2,
          textAlign: 'center'
        }
      },
      {
        id: 'offer-subtitle',
        type: 'text-inline',
        properties: {
          content: 'Acesse o Guia Completo personalizado para seu estilo e transforme definitivamente seu guarda-roupa',
          fontSize: 'large',
          textAlign: 'center'
        }
      },
      {
        id: 'offer-pricing',
        type: 'quiz-offer-pricing-inline',
        properties: {
          originalPrice: 197,
          discountPrice: 47,
          currency: 'R$',
          discount: '76% OFF',
          limited: true,
          timer: true
        }
      },
      {
        id: 'offer-cta',
        type: 'quiz-offer-cta-inline',
        properties: {
          text: 'QUERO MEU GUIA COMPLETO AGORA',
          variant: 'primary',
          size: 'large',
          fullWidth: true,
          urgent: true
        }
      },
      {
        id: 'offer-guarantee',
        type: 'guarantee',
        properties: {
          title: 'Garantia de 7 dias',
          description: 'Ou seu dinheiro de volta',
          icon: 'shield'
        }
      }
    ]
  }
];

// Função para obter template por ID
export const getQuizStepTemplate = (stepId: string): QuizStepTemplate | undefined => {
  return quiz21StepsTemplates.find(template => template.id === stepId);
};

// Função para obter todos os templates por tipo
export const getQuizStepTemplatesByType = (type: QuizStepTemplate['type']): QuizStepTemplate[] => {
  return quiz21StepsTemplates.filter(template => template.type === type);
};

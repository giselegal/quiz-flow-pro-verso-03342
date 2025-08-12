// src/templates/stepTemplates.ts
import { BlockData } from '../types/blocks';

// Interfaces para parâmetros dos templates
export interface QuestionParams {
  questionNumber: number;
  title: string;
  subtitle?: string;
  multiSelect?: number;
  variant?: 'image' | 'text' | 'mixed';
}

export interface StrategicParams {
  questionNumber: number;
  title: string;
  subtitle?: string;
}

// Template de introdução
export const introTemplate = [
  {
    type: 'vertical-canvas-header',
    properties: {
      title: 'Descubra Seu Estilo Único',
      subtitle: 'Quiz Personalizado de Descoberta de Estilo',
      description:
        'Descubra qual estilo combina mais com você através deste quiz personalizado baseado em anos de experiência em consultoria de imagem.',
      showBackButton: false,
      showProgress: false,
    },
  },
  {
    type: 'text-inline',
    properties: {
      content:
        '• São apenas 21 etapas rápidas\n• Leva menos de 5 minutos\n• Resultado personalizado instantâneo\n• Baseado em dados reais de consultoria',
      fontSize: 'medium',
      textAlign: 'left',
    },
  },
  {
    type: 'button-inline',
    properties: {
      text: 'Começar Quiz Agora',
      variant: 'primary',
      size: 'large',
      fullWidth: true,
    },
  },
];

// Template de coleta de nome
export const nameInputTemplate = [
  {
    type: 'heading-inline',
    properties: {
      text: 'Vamos personalizar sua experiência!',
      level: 2,
      textAlign: 'center',
    },
  },
  {
    type: 'text-inline',
    properties: {
      content: 'Como podemos te chamar?',
      fontSize: 'medium',
      textAlign: 'center',
    },
  },
  {
    type: 'form-input',
    properties: {
      label: 'Seu nome',
      placeholder: 'Digite seu primeiro nome',
      required: true,
      type: 'text',
    },
  },
  {
    type: 'button-inline',
    properties: {
      text: 'Continuar',
      variant: 'primary',
      size: 'large',
      fullWidth: true,
    },
  },
];

// Template de questão de quiz (função que retorna template baseado em parâmetros)
export const questionTemplate = ({
  questionNumber = 1,
  title = 'QUAL O SEU TIPO DE ROUPA FAVORITA?',
  subtitle = 'Selecione até 3 opções que mais combinam com você',
  multiSelect = 3,
  variant = 'image',
}: QuestionParams) => {
  return [
    {
      type: 'quiz-progress',
      properties: {
        currentStep: questionNumber + 2, // +2 porque as primeiras etapas são intro e nome
        totalSteps: 21,
        progress: Math.floor(((questionNumber + 2) / 21) * 100),
      },
    },
    {
      type: 'quiz-question',
      properties: {
        questionId: `q${questionNumber}`,
        title,
        subtitle,
        multiSelect,
      },
    },
    {
      type: 'options-grid',
      properties: {
        layout: 'grid',
        columns: 2,
        showImages: variant !== 'text',
      },
    },
  ];
};

// Template de questão estratégica
export const strategicTemplate = ({
  questionNumber = 1,
  title = 'QUAL A SUA PRINCIPAL DIFICULDADE COM ROUPAS?',
  subtitle = 'Esta informação nos ajuda a personalizar sua experiência',
}: StrategicParams) => {
  return [
    {
      type: 'quiz-progress',
      properties: {
        currentStep: questionNumber + 13, // As estratégicas começam após as 13 etapas iniciais
        totalSteps: 21,
        progress: Math.floor(((questionNumber + 13) / 21) * 100),
      },
    },
    {
      type: 'strategic-question-main',
      properties: {
        questionId: `s${questionNumber}`,
        title,
        subtitle,
        multiSelect: 1,
      },
    },
    {
      type: 'options-grid',
      properties: {
        layout: 'list',
        columns: 1,
        showImages: false,
      },
    },
  ];
};

// Template de transição
export const transitionTemplate = [
  {
    type: 'heading-inline',
    properties: {
      text: 'Analisando suas respostas...',
      level: 2,
      textAlign: 'center',
    },
  },
  {
    type: 'loading-animation',
    properties: {
      type: 'spinner',
      duration: 3000,
      message: 'Processando suas preferências de estilo',
    },
  },
  {
    type: 'text-inline',
    properties: {
      content: 'Preparando questões especiais para você baseadas nas suas respostas anteriores',
      textAlign: 'center',
      fontSize: 'medium',
    },
  },
];

// Template de resultado
export const resultTemplate = [
  {
    type: 'result-header-inline',
    properties: {
      title: 'Seu Resultado Personalizado',
      subtitle: 'Baseado nas suas 19 respostas',
      showConfetti: true,
    },
  },
  {
    type: 'result-card-inline',
    properties: {
      styleType: 'Contemporâneo Elegante',
      description: 'Você tem um estilo que combina modernidade com sofisticação',
      showImage: true,
      showDescription: true,
      showCharacteristics: true,
    },
  },
  {
    type: 'before-after-inline',
    properties: {
      title: 'Sua Transformação',
      showComparison: true,
      beforeText: 'Antes: Insegurança com roupas',
      afterText: 'Depois: Confiança total no seu estilo',
    },
  },
  {
    type: 'testimonials-inline',
    properties: {
      title: 'Pessoas como você disseram:',
      count: 3,
      showRatings: true,
    },
  },
];

// Template de oferta
export const offerTemplate = [
  {
    type: 'quiz-offer-cta-inline',
    properties: {
      title: 'Transforme Seu Estilo Agora!',
      subtitle: 'Oferta Especial Baseada no Seu Resultado',
      urgency: true,
      showTimer: true,
    },
  },
  {
    type: 'quiz-offer-pricing-inline',
    properties: {
      originalPrice: 297,
      discountPrice: 97,
      showDiscount: true,
      highlightValue: true,
      installments: '3x de R$ 32,33',
    },
  },
  {
    type: 'bonus-list-inline',
    properties: {
      title: 'Bônus Exclusivos Inclusos:',
      showBonuses: true,
      bonuses: [
        { name: 'Guia de Cores Personalizado', value: 'R$ 97' },
        { name: 'Lista de Compras Inteligente', value: 'R$ 67' },
        { name: 'Consultoria Online 1:1', value: 'R$ 197' },
      ],
    },
  },
  {
    type: 'button-inline',
    properties: {
      text: 'Quero Transformar Meu Estilo',
      variant: 'cta',
      size: 'large',
      fullWidth: true,
      urgent: true,
    },
  },
];

// Objeto centralizado com todos os templates
export const stepTemplates = {
  intro: introTemplate,
  'name-input': nameInputTemplate,
  question: questionTemplate,
  strategic: strategicTemplate,
  transition: transitionTemplate,
  result: resultTemplate,
  offer: offerTemplate,

  // Método utilitário para obter template pelo tipo da etapa
  getTemplateByStepType(stepType: string, params: any = {}) {
    switch (stepType) {
      case 'intro':
        return this.intro;
      case 'name-input':
        return this['name-input'];
      case 'question':
        return this.question(params);
      case 'strategic':
        return this.strategic(params);
      case 'transition':
        return this.transition;
      case 'result':
        return this.result;
      case 'offer':
        return this.offer;
      default:
        // Template genérico para tipos desconhecidos
        return [
          {
            type: 'heading-inline',
            properties: {
              text: 'Etapa Personalizada',
              level: 2,
              textAlign: 'center',
            },
          },
          {
            type: 'text-inline',
            properties: {
              content: 'Configure esta etapa de acordo com suas necessidades',
              textAlign: 'center',
            },
          },
        ];
    }
  },
};

// src/templates/stepTemplates.ts

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

// Template de introdução com sistema inteligente
export const introTemplate = [
  {
    type: 'quiz-intro-header',
    properties: {
      logoUrl:
        'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
      logoAlt: 'Logo Gisele Galvão',
      logoWidth: 96,
      logoHeight: 96,
      progressValue: 0,
      progressMax: 100,
      showBackButton: false,
      showProgress: false,
    },
  },
  {
    type: 'decorative-bar-inline',
    properties: {
      width: '100%',
      height: 4,
      color: '#B89B7A',
      backgroundColor: '#B89B7A',
      marginTop: 0,
      marginBottom: 24,
    },
  },
  {
    type: 'text-inline',
    properties: {
      content:
        '<span style="color: #B89B7A">Chega</span> de um guarda-roupa lotado e da sensação de que nada combina com <span style="color: #B89B7A">Você</span>.',
      fontSize: 'text-2xl',
      fontWeight: 'font-bold',
      textAlign: 'text-center',
      color: '#432818',
      marginBottom: 16,
    },
  },
  {
    type: 'image-display-inline',
    properties: {
      src: 'https://res.cloudinary.com/der8kogzu/image/upload/f_avif,q_85,w_300,c_limit/v1752443943/Gemini_Generated_Image_i5cst6i5cst6i5cs_fpoukb.avif',
      alt: 'Descubra seu estilo predominante',
      width: 300,
      height: 204,
      containerPosition: 'center',
      marginBottom: 16,
    },
  },
  {
    type: 'text-inline',
    properties: {
      content: 'Descubra seu <strong>ESTILO PREDOMINANTE</strong> em apenas alguns minutos!',
      fontSize: 'text-lg',
      fontWeight: 'font-medium',
      textAlign: 'text-center',
      color: '#432818',
      marginBottom: 24,
    },
  },
  {
    type: 'form-container',
    properties: {
      backgroundColor: 'transparent',
      marginTop: 0,
      marginBottom: 16,
      paddingTop: 0,
      paddingBottom: 0,
      requireNameToEnableButton: true,
      targetButtonId: 'intro-cta-button',
      visuallyDisableButton: true,
    },
    children: [
      {
        id: 'intro-form-input',
        type: 'form-input',
        properties: {
          inputType: 'text',
          placeholder: 'Digite seu primeiro nome aqui...',
          label: 'Como posso te chamar?',
          required: true,
          name: 'userName',
          backgroundColor: '#ffffff',
          borderColor: '#B89B7A',
          marginBottom: 16,
        },
      },
      {
        id: 'intro-cta-button',
        type: 'button-inline',
        properties: {
          text: 'Quero Descobrir meu Estilo Agora!',
          variant: 'primary',
          size: 'lg',
          fullWidth: true,
          backgroundColor: '#B89B7A',
          textColor: '#ffffff',
          requiresValidInput: true,
          watchInputId: 'intro-form-input',
          nextStepUrl: '/quiz/step-2',
          nextStepId: 'step-2',
          autoAdvanceOnComplete: false,
          disabledText: 'Digite seu nome para continuar',
          showDisabledState: true,
          disabledOpacity: 0.6,
        },
      },
    ],
  },
];

// Template de coleta de nome com sistema inteligente (para outras etapas se necessário)
export const nameInputTemplate = [
  {
    type: 'text-inline',
    properties: {
      content: 'Como podemos te chamar?',
      fontSize: 'text-lg',
      fontWeight: 'font-medium',
      textAlign: 'center',
      marginBottom: 16,
    },
  },
  {
    type: 'form-container',
    properties: {
      backgroundColor: 'transparent',
      requireNameToEnableButton: true,
      targetButtonId: 'continue-button',
      visuallyDisableButton: true,
    },
    children: [
      {
        id: 'name-input',
        type: 'form-input',
        properties: {
          label: 'Seu nome',
          placeholder: 'Digite seu primeiro nome',
          required: true,
          name: 'userName',
          inputType: 'text',
        },
      },
      {
        id: 'continue-button',
        type: 'button-inline',
        properties: {
          text: 'Continuar',
          variant: 'primary',
          size: 'large',
          fullWidth: true,
          requiresValidInput: true,
          watchInputId: 'name-input',
          disabledText: 'Digite seu nome para continuar',
          showDisabledState: true,
        },
      },
    ],
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

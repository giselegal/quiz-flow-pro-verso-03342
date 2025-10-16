/**
 * 📐 STEP BLOCK SCHEMAS
 * 
 * Define a estrutura de blocos para cada tipo de step
 */

export interface StepBlockSchema {
  id: string;
  type: string;
  order: number;
  props: Record<string, any>;
  editable?: boolean;
  deletable?: boolean;
  movable?: boolean;
}

export interface StepSchema {
  type: string;
  blocks: StepBlockSchema[];
}

/**
 * 🏠 INTRO STEP SCHEMA
 */
export const INTRO_STEP_SCHEMA: StepSchema = {
  type: 'intro',
  blocks: [
    {
      id: 'intro-logo',
      type: 'image-inline',
      order: 0,
      props: {
        src: 'https://res.cloudinary.com/der8kogzu/image/upload/f_png,q_70,w_132,h_55,c_fit/v1752430327/LOGO_DA_MARCA_GISELE_l78gin.png',
        alt: 'Gisele Galvão Logo',
        width: '132px',
        height: '55px',
        maxWidth: '132px'
      },
      editable: true,
      deletable: false,
      movable: false
    },
    {
      id: 'intro-decorator',
      type: 'decorative-bar-inline',
      order: 1,
      props: {
        height: '3px',
        color: '#B89B7A',
        maxWidth: '300px',
        centered: true
      },
      editable: true,
      deletable: true,
      movable: true
    },
    {
      id: 'intro-headline',
      type: 'text-inline',
      order: 2,
      props: {
        content: '[#B89B7A]**Chega**[/#B89B7A] de um guarda-roupa lotado e da sensação de que [#B89B7A]**nada combina com você**[/#B89B7A].',
        fontSize: 'text-2xl sm:text-3xl md:text-4xl',
        fontWeight: 'font-bold',
        fontFamily: 'playfair-display',
        textAlign: 'text-center',
        textColor: 'text-[#432818]'
      },
      editable: true,
      deletable: true,
      movable: true
    },
    {
      id: 'intro-image',
      type: 'image-inline',
      order: 3,
      props: {
        src: 'https://res.cloudinary.com/der8kogzu/image/upload/f_png,q_85,w_300,c_limit/v1752443943/Gemini_Generated_Image_i5cst6i5cst6i5cs_fpoukb.png',
        alt: 'Descubra seu estilo predominante',
        aspectRatio: '1.47',
        maxWidth: '300px',
        rounded: true
      },
      editable: true,
      deletable: true,
      movable: true
    },
    {
      id: 'intro-description',
      type: 'text-inline',
      order: 4,
      props: {
        content: 'Em poucos minutos, descubra seu Estilo Predominante — e aprenda a montar looks que realmente refletem sua essência, com praticidade e confiança.',
        fontSize: 'text-sm sm:text-base',
        textAlign: 'text-center',
        textColor: 'text-gray-700'
      },
      editable: true,
      deletable: true,
      movable: true
    },
    {
      id: 'intro-name-input',
      type: 'form-input',
      order: 5,
      props: {
        id: 'intro-name-input',
        name: 'userName',
        label: 'Como posso te chamar?',
        placeholder: 'Digite seu primeiro nome aqui...',
        required: true,
        fieldType: 'text',
        fieldName: 'userName'
      },
      editable: true,
      deletable: false,
      movable: true
    },
    {
      id: 'intro-cta-button',
      type: 'button-inline',
      order: 6,
      props: {
        id: 'intro-cta-button',
        text: 'Quero Descobrir meu Estilo Agora!',
        variant: 'primary',
        size: 'lg',
        fullWidth: true,
        bgColor: '#B89B7A',
        hoverBgColor: '#A1835D',
        textColor: '#ffffff'
      },
      editable: true,
      deletable: false,
      movable: true
    },
    {
      id: 'intro-footer',
      type: 'text-inline',
      order: 7,
      props: {
        content: '© 2025 Gisele Galvão - Todos os direitos reservados',
        fontSize: 'text-xs',
        textAlign: 'text-center',
        textColor: 'text-gray-500'
      },
      editable: true,
      deletable: true,
      movable: true
    }
  ]
};

/**
 * ❓ QUESTION STEP SCHEMA
 */
export const QUESTION_STEP_SCHEMA: StepSchema = {
  type: 'question',
  blocks: [
    {
      id: 'question-progress',
      type: 'ProgressBarBlock',
      order: 0,
      props: {
        progress: '{{progress}}',
        height: 8,
        fillColor: '#B89B7A',
        bgColor: '#e5e7eb',
        rounded: true,
        animated: true
      },
      editable: true,
      deletable: false,
      movable: false
    },
    {
      id: 'question-number',
      type: 'HeadlineBlock',
      order: 1,
      props: {
        text: '{{questionNumber}}',
        fontSize: 'text-xl md:text-2xl',
        fontWeight: 'font-bold',
        align: 'center',
        color: '#432818'
      },
      editable: false,
      deletable: false,
      movable: false
    },
    {
      id: 'question-text',
      type: 'HeadlineBlock',
      order: 2,
      props: {
        text: '{{questionText}}',
        fontSize: 'text-xl md:text-2xl',
        fontWeight: 'font-bold',
        fontFamily: 'playfair-display',
        align: 'center',
        color: '#deac6d'
      },
      editable: false,
      deletable: false,
      movable: false
    },
    {
      id: 'question-instructions',
      type: 'TextBlock',
      order: 3,
      props: {
        text: 'Selecione {{requiredSelections}} opções ({{currentSelections}}/{{requiredSelections}})',
        size: 'text-sm',
        color: 'text-gray-600',
        align: 'center'
      },
      editable: true,
      deletable: true,
      movable: true
    },
    {
      id: 'question-spacer-1',
      type: 'SpacerBlock',
      order: 4,
      props: {
        height: 24
      },
      editable: true,
      deletable: true,
      movable: true
    },
    {
      id: 'question-options',
      type: 'GridOptionsBlock',
      order: 5,
      props: {
        options: '{{options}}',
        columns: 2,
        gap: 'gap-3 sm:gap-4',
        hasImages: true,
        selectionIndicator: 'checkbox',
        maxSelections: '{{maxSelections}}',
        minSelections: '{{requiredSelections}}'
      },
      editable: false,
      deletable: false,
      movable: false
    },
    {
      id: 'question-spacer-2',
      type: 'SpacerBlock',
      order: 6,
      props: {
        height: 32
      },
      editable: true,
      deletable: true,
      movable: true
    },
    {
      id: 'question-button',
      type: 'ButtonBlock',
      order: 7,
      props: {
        text: 'Avançando...',
        variant: 'primary',
        size: 'lg',
        fullWidth: true,
        bgColor: '#B89B7A',
        disabled: '{{!canProceed}}',
        animate: 'pulse'
      },
      editable: true,
      deletable: false,
      movable: true
    }
  ]
};

/**
 * 🎯 STRATEGIC QUESTION STEP SCHEMA
 */
export const STRATEGIC_QUESTION_STEP_SCHEMA: StepSchema = {
  type: 'strategic-question',
  blocks: [
    {
      id: 'strategic-icon',
      type: 'TextBlock',
      order: 0,
      props: {
        text: '💭',
        size: 'text-5xl',
        align: 'center'
      },
      editable: true,
      deletable: true,
      movable: true
    },
    {
      id: 'strategic-question',
      type: 'HeadlineBlock',
      order: 1,
      props: {
        text: '{{questionText}}',
        fontSize: 'text-xl md:text-2xl',
        fontWeight: 'font-bold',
        fontFamily: 'playfair-display',
        align: 'center',
        color: '#deac6d'
      },
      editable: false,
      deletable: false,
      movable: false
    },
    {
      id: 'strategic-options',
      type: 'GridOptionsBlock',
      order: 2,
      props: {
        options: '{{options}}',
        hasImages: false,
        columns: 1,
        selectionIndicator: 'radio',
        gap: 'gap-4'
      },
      editable: false,
      deletable: false,
      movable: false
    },
    {
      id: 'strategic-progress-indicator',
      type: 'TextBlock',
      order: 3,
      props: {
        text: '{{currentAnswer ? "Processando resposta..." : ""}}',
        size: 'text-sm',
        color: 'text-[#deac6d]',
        align: 'center'
      },
      editable: true,
      deletable: true,
      movable: true
    }
  ]
};

/**
 * ⏳ TRANSITION STEP SCHEMA
 */
export const TRANSITION_STEP_SCHEMA: StepSchema = {
  type: 'transition',
  blocks: [
    {
      id: 'transition-loading',
      type: 'LoadingAnimationBlock',
      order: 0,
      props: {
        type: 'spinner',
        size: 'large',
        color: '#deac6d'
      },
      editable: true,
      deletable: false,
      movable: true
    },
    {
      id: 'transition-title',
      type: 'HeadlineBlock',
      order: 1,
      props: {
        text: '{{title}}',
        fontSize: 'text-2xl md:text-3xl',
        fontWeight: 'font-bold',
        fontFamily: 'playfair-display',
        align: 'center',
        color: '#5b4135'
      },
      editable: true,
      deletable: false,
      movable: true
    },
    {
      id: 'transition-message',
      type: 'TextBlock',
      order: 2,
      props: {
        text: '{{text}}',
        size: 'text-lg',
        color: 'text-gray-600',
        align: 'center'
      },
      editable: true,
      deletable: false,
      movable: true
    },
    {
      id: 'transition-dots',
      type: 'ProgressIndicatorBlock',
      order: 3,
      props: {
        current: 0,
        total: 3,
        showLabel: false,
        animated: true
      },
      editable: true,
      deletable: true,
      movable: true
    }
  ]
};

/**
 * 🎯 RESULT STEP SCHEMA
 */
export const RESULT_STEP_SCHEMA: StepSchema = {
  type: 'result',
  blocks: [
    {
      id: 'result-logo',
      type: 'LogoBlock',
      order: 0,
      props: {
        logoUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo%20GG-6w33qkEHxzZCbYI93W2BxxqxbFNr78.png',
        height: 55,
        width: 132,
        showDecorator: false
      },
      editable: true,
      deletable: false,
      movable: false
    },
    {
      id: 'result-headline',
      type: 'HeadlineBlock',
      order: 1,
      props: {
        text: '{{userName}}, seu estilo predominante é:',
        fontSize: 'text-2xl md:text-3xl',
        fontWeight: 'font-bold',
        align: 'center',
        color: '#432818'
      },
      editable: true,
      deletable: false,
      movable: true
    },
    {
      id: 'result-style-name',
      type: 'HeadlineBlock',
      order: 2,
      props: {
        text: '{{styleName}}',
        fontSize: 'text-3xl md:text-5xl',
        fontWeight: 'font-bold',
        fontFamily: '"Playfair Display", serif',
        align: 'center',
        color: '#B89B7A'
      },
      editable: false,
      deletable: false,
      movable: false
    },
    {
      id: 'result-image',
      type: 'ImageBlock',
      order: 3,
      props: {
        src: '{{styleImage}}',
        alt: 'Seu estilo',
        aspectRatio: '1',
        maxWidth: '400px',
        rounded: true,
        shadow: true
      },
      editable: true,
      deletable: false,
      movable: true
    },
    {
      id: 'result-description',
      type: 'TextBlock',
      order: 4,
      props: {
        text: '{{styleDescription}}',
        size: 'text-base',
        align: 'center',
        color: 'text-gray-700'
      },
      editable: false,
      deletable: false,
      movable: true
    }
  ]
};

/**
 * 🎁 OFFER STEP SCHEMA
 */
export const OFFER_STEP_SCHEMA: StepSchema = {
  type: 'offer',
  blocks: [
    {
      id: 'offer-hero-gradient',
      type: 'HeadlineBlock',
      order: 0,
      props: {
        text: '{{title}}',
        fontSize: 'text-2xl md:text-3xl',
        fontWeight: 'font-bold',
        align: 'center',
        backgroundColor: 'linear-gradient(to right, #deac6d, #c49548)',
        textColor: '#ffffff',
        padding: '32px'
      },
      editable: true,
      deletable: false,
      movable: false
    },
    {
      id: 'offer-image',
      type: 'ImageBlock',
      order: 1,
      props: {
        src: '{{guideImage}}',
        alt: 'Oferta Especial',
        rounded: true,
        shadow: true,
        badge: {
          text: 'Oferta Especial',
          color: '#bd0000',
          position: 'top-right'
        }
      },
      editable: true,
      deletable: false,
      movable: true
    },
    {
      id: 'offer-description',
      type: 'TextBlock',
      order: 2,
      props: {
        text: '{{description}}',
        size: 'text-base',
        backgroundColor: 'gradient-to-r from-gray-50 to-gray-100',
        padding: '24px',
        icon: '💡'
      },
      editable: true,
      deletable: false,
      movable: true
    },
    {
      id: 'offer-cta',
      type: 'ButtonBlock',
      order: 3,
      props: {
        text: '{{buttonText}}',
        bgColor: '#65c83a',
        size: 'lg',
        fullWidth: true
      },
      editable: true,
      deletable: false,
      movable: true
    },
    {
      id: 'offer-guarantee',
      type: 'TextBlock',
      order: 4,
      props: {
        text: '🛡️ Satisfação 100% garantida',
        size: 'text-sm',
        color: 'text-gray-600',
        align: 'center'
      },
      editable: true,
      deletable: true,
      movable: true
    }
  ]
};

/**
 * 📊 REGISTRY DE SCHEMAS
 */
export const STEP_SCHEMAS_REGISTRY: Record<string, StepSchema> = {
  intro: INTRO_STEP_SCHEMA,
  question: QUESTION_STEP_SCHEMA,
  'strategic-question': STRATEGIC_QUESTION_STEP_SCHEMA,
  transition: TRANSITION_STEP_SCHEMA,
  'transition-result': TRANSITION_STEP_SCHEMA,
  result: RESULT_STEP_SCHEMA,
  offer: OFFER_STEP_SCHEMA
};

/**
 * 🔍 Obter schema por tipo de step
 */
export const getStepSchema = (stepType: string): StepSchema | null => {
  return STEP_SCHEMAS_REGISTRY[stepType] || null;
};

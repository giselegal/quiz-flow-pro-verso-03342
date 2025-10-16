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
      type: 'LogoBlock',
      order: 0,
      props: {
        logoUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo%20GG-6w33qkEHxzZCbYI93W2BxxqxbFNr78.png',
        height: 55,
        width: 132,
        showDecorator: true,
        decoratorColor: '#B89B7A',
        decoratorHeight: 2,
        alt: 'Gisele Galvão Logo'
      },
      editable: true,
      deletable: false,
      movable: false
    },
    {
      id: 'intro-headline',
      type: 'HeadlineBlock',
      order: 1,
      props: {
        html: '<span style="color: #B89B7A;">Chega</span> de um guarda-roupa <span style="color: #B89B7A;">cheio</span> e a sensação de <span style="color: #B89B7A;">não ter nada</span> para vestir!',
        fontSize: 'text-2xl sm:text-3xl md:text-4xl',
        fontWeight: 'font-bold',
        fontFamily: '"Playfair Display", serif',
        align: 'center'
      },
      editable: true,
      deletable: true,
      movable: true
    },
    {
      id: 'intro-image',
      type: 'ImageBlock',
      order: 2,
      props: {
        src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-removebg-preview%20(10)-jSEJlJtUY9lO7BHo7r1f6Wv39CKSbg.png',
        alt: 'Descubra seu estilo pessoal',
        aspectRatio: '1.47',
        maxWidth: '300px',
        rounded: true,
        shadow: false
      },
      editable: true,
      deletable: true,
      movable: true
    },
    {
      id: 'intro-description',
      type: 'TextBlock',
      order: 3,
      props: {
        text: 'Em poucos minutos, descubra seu Estilo Predominante e aprenda a criar looks perfeitos para o seu corpo e ocasiões do dia a dia.',
        size: 'text-sm sm:text-base',
        align: 'center',
        color: 'text-gray-700',
        highlights: [
          {
            text: 'Estilo Predominante',
            color: '#B89B7A',
            weight: 'font-semibold'
          }
        ]
      },
      editable: true,
      deletable: true,
      movable: true
    },
    {
      id: 'intro-form',
      type: 'FormInputBlock',
      order: 4,
      props: {
        id: 'name-input',
        label: 'Como posso te chamar?',
        placeholder: 'Digite seu primeiro nome',
        required: true,
        inputType: 'text'
      },
      editable: true,
      deletable: false,
      movable: true
    },
    {
      id: 'intro-button',
      type: 'ButtonBlock',
      order: 5,
      props: {
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
      type: 'FooterBlock',
      order: 6,
      props: {
        text: '© 2025 Gisele Galvão - Todos os direitos reservados',
        align: 'center',
        size: 'text-xs',
        color: 'text-gray-500'
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

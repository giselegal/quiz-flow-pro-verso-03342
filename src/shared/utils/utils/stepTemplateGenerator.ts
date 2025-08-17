import { StepConfig } from '@/components/steps/BaseStepTemplate';
import { Block, BlockType } from '@/types/editor';

/**
 * STEP TEMPLATE GENERATOR - Utilitário para gerar templates de steps
 * ✅ Padronização automática
 * ✅ Templates reutilizáveis
 * ✅ Configuração dinâmica
 * ✅ TypeScript correto
 */

export interface QuestionOption {
  id: string;
  text: string;
  description?: string;
  value: string;
  image?: string;
}

export interface QuestionConfig {
  stepNumber: number;
  title: string;
  description?: string;
  questionId: string;
  allowMultiple?: boolean;
  minSelections?: number;
  maxSelections?: number;
  showImages?: boolean;
  columns?: number;
  options: QuestionOption[];
}

export const generateQuestionStepConfig = (config: QuestionConfig): StepConfig => {
  const {
    stepNumber,
    title,
    description,
    questionId,
    allowMultiple = false,
    minSelections = 1,
    maxSelections = 1,
    showImages = false,
    columns = 2,
    options
  } = config;

  const blocks: Block[] = [
    // Progress bar
    {
      id: `step-${stepNumber}-progress`,
      type: 'progress-inline' as BlockType,
      order: 1,
      content: {
        title: 'Progress'
      },
      properties: {
        currentStep: stepNumber - 1,
        totalSteps: 19,
        showPercentage: true,
        marginBottom: 32
      }
    },
    // Question header
    {
      id: `step-${stepNumber}-question-header`,
      type: 'heading-inline' as BlockType,
      order: 2,
      content: {
        title: title,
        level: 2,
        textAlign: 'center',
        fontSize: '1.75rem',
        fontWeight: 'semibold'
      },
      properties: {
        marginBottom: description ? 16 : 32
      }
    }
  ];

  // Optional description
  if (description) {
    blocks.push({
      id: `step-${stepNumber}-description`,
      type: 'text-inline' as BlockType,
      order: 3,
      content: {
        text: description,
        textAlign: 'center',
        fontSize: '1.1rem'
      },
      properties: {
        color: 'hsl(var(--muted-foreground))',
        marginBottom: 32
      }
    });
  }

  // Options grid
  blocks.push({
    id: `step-${stepNumber}-options-grid`,
    type: 'options-grid' as BlockType,
    order: description ? 4 : 3,
    content: {
      title: 'Options'
    },
    properties: {
      questionId,
      allowMultiple,
      minSelections,
      maxSelections,
      showImages,
      columns,
      options,
      marginBottom: 32
    }
  });

  // Next button
  blocks.push({
    id: `step-${stepNumber}-next-button`,
    type: 'button-inline' as BlockType,
    order: description ? 5 : 4,
    content: {
      title: allowMultiple ? 'Continuar' : 'Próxima Questão'
    },
    properties: {
      variant: 'default',
      size: 'lg',
      action: 'next-step',
      disabled: true,
      requiresValidation: true,
      validationTarget: `step-${stepNumber}-options-grid`
    }
  });

  return {
    id: `step-${stepNumber.toString().padStart(2, '0')}-${questionId}`,
    title,
    description,
    layout: 'vertical',
    spacing: 'md',
    padding: 'p-6',
    blocks
  };
};

// Template para step de introdução
export const generateIntroStepConfig = (config: {
  stepNumber: number;
  title: string;
  subtitle?: string;
  description?: string;
  features?: string[];
  ctaText?: string;
  image?: string;
}): StepConfig => {
  const {
    stepNumber,
    title,
    subtitle,
    description,
    features,
    ctaText = 'Começar Quiz',
    image
  } = config;

  const blocks: Block[] = [
    {
      id: `step-${stepNumber}-header`,
      type: 'heading-inline' as BlockType,
      order: 1,
      content: {
        title: title,
        level: 1,
        textAlign: 'center',
        fontSize: 'clamp(2rem, 5vw, 3.5rem)',
        fontWeight: 'bold'
      },
      properties: {
        marginBottom: subtitle ? 16 : 24
      }
    }
  ];

  if (subtitle) {
    blocks.push({
      id: `step-${stepNumber}-subtitle`,
      type: 'text-inline' as BlockType,
      order: 2,
      content: {
        text: subtitle,
        textAlign: 'center',
        fontSize: '1.25rem'
      },
      properties: {
        color: 'hsl(var(--muted-foreground))',
        marginBottom: 24
      }
    });
  }

  if (image) {
    blocks.push({
      id: `step-${stepNumber}-image`,
      type: 'image-display-inline' as BlockType,
      order: blocks.length + 1,
      content: {
        url: image,
        alt: 'Imagem ilustrativa',
        width: '400px',
        height: '300px'
      },
      properties: {
        borderRadius: 16,
        alignment: 'center',
        marginBottom: 32
      }
    });
  }

  if (features && features.length > 0) {
    blocks.push({
      id: `step-${stepNumber}-features`,
      type: 'text-inline' as BlockType,
      order: blocks.length + 1,
      content: {
        text: features.join('\n'),
        textAlign: 'center',
        fontSize: '1.1rem'
      },
      properties: {
        lineHeight: '1.8',
        marginBottom: 40
      }
    });
  }

  if (description) {
    blocks.push({
      id: `step-${stepNumber}-description`,
      type: 'text-inline' as BlockType,
      order: blocks.length + 1,
      content: {
        text: description,
        textAlign: 'center',
        fontSize: '1rem'
      },
      properties: {
        color: 'hsl(var(--muted-foreground))',
        marginBottom: 32
      }
    });
  }

  blocks.push({
    id: `step-${stepNumber}-cta-button`,
    type: 'button-inline' as BlockType,
    order: blocks.length + 1,
    content: {
      title: ctaText
    },
    properties: {
      variant: 'default',
      size: 'lg',
      action: 'next-step'
    }
  });

  return {
    id: `step-${stepNumber.toString().padStart(2, '0')}-intro`,
    title,
    description: subtitle,
    layout: 'vertical',
    spacing: 'lg',
    padding: 'p-8',
    blocks
  };
};

// Questões padronizadas para geração rápida
export const STANDARD_QUESTIONS = {
  7: {
    title: 'Qual é o tamanho do ambiente principal?',
    questionId: 'room-size',
    options: [
      { id: 'small', text: 'Pequeno (até 20m²)', value: 'small' },
      { id: 'medium', text: 'Médio (20-40m²)', value: 'medium' },
      { id: 'large', text: 'Grande (40-60m²)', value: 'large' },
      { id: 'xlarge', text: 'Muito Grande (60m²+)', value: 'xlarge' }
    ]
  },
  8: {
    title: 'Como você pretende usar o espaço?',
    description: 'Selecione até 3 opções',
    questionId: 'room-function',
    allowMultiple: true,
    maxSelections: 3,
    options: [
      { id: 'relax', text: 'Relaxar e descansar', value: 'relax' },
      { id: 'work', text: 'Trabalhar/estudar', value: 'work' },
      { id: 'entertain', text: 'Receber visitas', value: 'entertain' },
      { id: 'family', text: 'Atividades familiares', value: 'family' },
      { id: 'creative', text: 'Hobbies criativos', value: 'creative' }
    ]
  }
} as const;
import { StepConfig } from '@/components/steps/BaseStepTemplate';

/**
 * STEP TEMPLATE GENERATOR - Utilitário para gerar templates de steps
 * ✅ Padronização automática
 * ✅ Templates reutilizáveis
 * ✅ Configuração dinâmica
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

  return {
    id: `step-${stepNumber.toString().padStart(2, '0')}-${questionId}`,
    title,
    description,
    layout: 'vertical',
    spacing: 'md',
    padding: 'p-6',
    blocks: [
      // Progress bar
      {
        id: `step-${stepNumber}-progress`,
        type: 'progress-inline',
        order: 1,
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
        type: 'heading-inline',
        order: 2,
        properties: {
          text: title,
          level: 2,
          textAlign: 'center',
          fontSize: '1.75rem',
          fontWeight: '600',
          marginBottom: description ? 16 : 32
        }
      },
      // Optional description
      ...(description ? [{
        id: `step-${stepNumber}-description`,
        type: 'text-inline',
        order: 3,
        properties: {
          text: description,
          textAlign: 'center',
          fontSize: '1.1rem',
          color: 'hsl(var(--muted-foreground))',
          marginBottom: 32
        }
      }] : []),
      // Options grid
      {
        id: `step-${stepNumber}-options-grid`,
        type: 'options-grid-inline',
        order: description ? 4 : 3,
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
      },
      // Next button
      {
        id: `step-${stepNumber}-next-button`,
        type: 'button-inline-fixed',
        order: description ? 5 : 4,
        properties: {
          text: allowMultiple ? 'Continuar' : 'Próxima Questão',
          variant: 'default',
          size: 'lg',
          action: 'next-step',
          disabled: true,
          requiresValidation: true,
          validationTarget: `step-${stepNumber}-options-grid`
        }
      }
    ]
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

  const blocks = [
    {
      id: `step-${stepNumber}-header`,
      type: 'heading-inline',
      order: 1,
      properties: {
        text: title,
        level: 1,
        textAlign: 'center',
        fontSize: 'clamp(2rem, 5vw, 3.5rem)',
        fontWeight: '700',
        marginBottom: subtitle ? 16 : 24
      }
    }
  ];

  if (subtitle) {
    blocks.push({
      id: `step-${stepNumber}-subtitle`,
      type: 'text-inline',
      order: 2,
      properties: {
        text: subtitle,
        textAlign: 'center',
        fontSize: '1.25rem',
        color: 'hsl(var(--muted-foreground))',
        marginBottom: 24
      }
    });
  }

  if (image) {
    blocks.push({
      id: `step-${stepNumber}-image`,
      type: 'image-display-inline',
      order: blocks.length + 1,
      properties: {
        src: image,
        alt: 'Imagem ilustrativa',
        width: 400,
        height: 300,
        borderRadius: 16,
        alignment: 'center',
        marginBottom: 32
      }
    });
  }

  if (features && features.length > 0) {
    blocks.push({
      id: `step-${stepNumber}-features`,
      type: 'text-inline',
      order: blocks.length + 1,
      properties: {
        text: features.join('\n'),
        textAlign: 'center',
        fontSize: '1.1rem',
        lineHeight: '1.8',
        marginBottom: 40
      }
    });
  }

  if (description) {
    blocks.push({
      id: `step-${stepNumber}-description`,
      type: 'text-inline',
      order: blocks.length + 1,
      properties: {
        text: description,
        textAlign: 'center',
        fontSize: '1rem',
        color: 'hsl(var(--muted-foreground))',
        marginBottom: 32
      }
    });
  }

  blocks.push({
    id: `step-${stepNumber}-cta-button`,
    type: 'button-inline-fixed',
    order: blocks.length + 1,
    properties: {
      text: ctaText,
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
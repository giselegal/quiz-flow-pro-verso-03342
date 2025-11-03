import { ValidationProps } from '@/types/editor';
import { z } from 'zod';

// =====================================================
// INTRO BLOCKS SCHEMAS
// =====================================================
const introLogoSchema = z.object({
  src: z.string().min(1, 'URL do logo é obrigatória'),
  alt: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  link: z.string().optional(),
});

const introTitleSchema = z.object({
  text: z.string().min(1, 'Título é obrigatório'),
  level: z.enum(['h1', 'h2', 'h3']).optional(),
  fontSize: z.string().optional(),
  fontWeight: z.string().optional(),
  color: z.string().optional(),
  textAlign: z.enum(['left', 'center', 'right']).optional(),
});

const introDescriptionSchema = z.object({
  text: z.string().min(1, 'Descrição é obrigatória'),
  fontSize: z.string().optional(),
  color: z.string().optional(),
  textAlign: z.enum(['left', 'center', 'right']).optional(),
});

const introImageSchema = z.object({
  src: z.string().min(1, 'URL da imagem é obrigatória'),
  alt: z.string().optional(),
  aspectRatio: z.string().optional(),
  objectFit: z.enum(['cover', 'contain', 'fill']).optional(),
});

const introFormSchema = z.object({
  fields: z.array(z.object({
    id: z.string(),
    type: z.enum(['text', 'email', 'phone', 'textarea']),
    label: z.string(),
    placeholder: z.string().optional(),
    required: z.boolean().optional(),
  })).min(1, 'Pelo menos um campo é necessário'),
  buttonText: z.string().min(1, 'Texto do botão é obrigatório'),
  buttonStyle: z.enum(['primary', 'secondary', 'outline']).optional(),
});

// =====================================================
// QUESTION BLOCKS SCHEMAS
// =====================================================
const questionProgressSchema = z.object({
  currentStep: z.number().min(1),
  totalSteps: z.number().min(1),
  showPercentage: z.boolean().optional(),
  style: z.enum(['bar', 'dots', 'steps']).optional(),
});

const questionTitleSchema = z.object({
  text: z.string().min(1, 'Título da pergunta é obrigatório'),
  subtitle: z.string().optional(),
  fontSize: z.string().optional(),
  fontWeight: z.string().optional(),
  textAlign: z.enum(['left', 'center', 'right']).optional(),
});

const questionHeroSchema = z.object({
  src: z.string().min(1, 'URL da imagem hero é obrigatória'),
  alt: z.string().optional(),
  height: z.string().optional(),
  objectFit: z.enum(['cover', 'contain', 'fill']).optional(),
  overlay: z.boolean().optional(),
  overlayColor: z.string().optional(),
  overlayOpacity: z.number().min(0).max(1).optional(),
});

const questionNavigationSchema = z.object({
  showBack: z.boolean().optional(),
  showNext: z.boolean().optional(),
  backText: z.string().optional(),
  nextText: z.string().optional(),
  disableNext: z.boolean().optional(),
});

const questionOptionsGridSchema = z.object({
  options: z
    .array(
      z.object({
        id: z.string(),
        text: z.string(),
        imageUrl: z.string().optional(),
        points: z.number().optional(),
        category: z.string().optional(),
      }),
    )
    .min(1, 'Pelo menos uma opção é necessária'),
  columns: z.number().min(1).max(4).optional(),
  imageSize: z.enum(['small', 'medium', 'large', 'custom']).optional(),
  selectionType: z.enum(['single', 'multiple']).optional(),
  maxSelections: z.number().optional(),
});

// =====================================================
// TRANSITION BLOCKS SCHEMAS
// =====================================================
const transitionHeroSchema = z.object({
  src: z.string().min(1, 'URL da imagem é obrigatória'),
  alt: z.string().optional(),
  height: z.string().optional(),
  objectFit: z.enum(['cover', 'contain', 'fill']).optional(),
});

const transitionTextSchema = z.object({
  text: z.string().min(1, 'Texto é obrigatório'),
  subtitle: z.string().optional(),
  fontSize: z.string().optional(),
  fontWeight: z.string().optional(),
  textAlign: z.enum(['left', 'center', 'right']).optional(),
  duration: z.number().optional(),
});

// =====================================================
// RESULT BLOCKS SCHEMAS
// =====================================================
const resultHeaderSchema = z.object({
  title: z.string().min(1, 'Título do resultado é obrigatório'),
  subtitle: z.string().optional(),
  icon: z.string().optional(),
  backgroundColor: z.string().optional(),
});

const resultDescriptionSchema = z.object({
  text: z.string().min(1, 'Descrição do resultado é obrigatória'),
  fontSize: z.string().optional(),
  textAlign: z.enum(['left', 'center', 'right']).optional(),
});

const resultCtaSchema = z.object({
  text: z.string().min(1, 'Texto do CTA é obrigatório'),
  url: z.string().optional(),
  action: z.string().optional(),
  style: z.enum(['primary', 'secondary', 'outline']).optional(),
  size: z.enum(['sm', 'md', 'lg']).optional(),
});

// =====================================================
// OFFER BLOCKS SCHEMAS
// =====================================================
const offerHeroSchema = z.object({
  title: z.string().min(1, 'Título da oferta é obrigatório'),
  subtitle: z.string().optional(),
  image: z.string().optional(),
  backgroundColor: z.string().optional(),
});

const offerPricingSchema = z.object({
  price: z.number().min(0, 'Preço deve ser maior ou igual a 0'),
  currency: z.string().optional(),
  period: z.string().optional(),
  discount: z.number().min(0).max(100).optional(),
  installments: z.object({
    count: z.number(),
    value: z.number(),
  }).optional(),
});

const offerBenefitsSchema = z.object({
  items: z.array(z.object({
    id: z.string(),
    text: z.string(),
    icon: z.string().optional(),
  })).min(1, 'Pelo menos um benefício é necessário'),
  style: z.enum(['list', 'grid', 'cards']).optional(),
});

const offerTestimonialsSchema = z.object({
  items: z.array(z.object({
    id: z.string(),
    name: z.string(),
    text: z.string(),
    avatar: z.string().optional(),
    rating: z.number().min(0).max(5).optional(),
  })).optional(),
  style: z.enum(['slider', 'grid', 'list']).optional(),
});

const offerUrgencySchema = z.object({
  type: z.enum(['countdown', 'limited-spots', 'text']),
  endDate: z.string().optional(),
  spotsLeft: z.number().optional(),
  text: z.string().optional(),
  showTimer: z.boolean().optional(),
});

// =====================================================
// LAYOUT BLOCKS SCHEMAS
// =====================================================
const layoutContainerSchema = z.object({
  maxWidth: z.string().optional(),
  padding: z.string().optional(),
  backgroundColor: z.string().optional(),
});

const layoutDividerSchema = z.object({
  style: z.enum(['solid', 'dashed', 'dotted']).optional(),
  color: z.string().optional(),
  thickness: z.number().optional(),
  spacing: z.string().optional(),
});

const layoutSpacerSchema = z.object({
  height: z.string().min(1, 'Altura é obrigatória'),
});

// =====================================================
// LEGACY SCHEMAS (manter compatibilidade)
// =====================================================
const textBlockSchema = z.object({
  content: z.string().min(1, 'Conteúdo é obrigatório'),
  fontSize: z.number().optional(),
  fontWeight: z.number().optional(),
  textAlign: z.enum(['left', 'center', 'right', 'justify']).optional(),
  color: z.string().optional(),
});

const buttonBlockSchema = z.object({
  text: z.string().min(1, 'Texto do botão é obrigatório'),
  action: z.string().min(1, 'Ação do botão é obrigatória'),
  style: z.enum(['primary', 'secondary', 'outline']).optional(),
  size: z.enum(['sm', 'md', 'lg']).optional(),
  disabled: z.boolean().optional(),
});

const imageBlockSchema = z.object({
  src: z.string().min(1, 'URL da imagem é obrigatória'),
  alt: z.string().min(1, 'Texto alternativo é obrigatório'),
  width: z.number().optional(),
  height: z.number().optional(),
  fit: z.enum(['cover', 'contain', 'fill']).optional(),
});

// =====================================================
// MAPA COMPLETO DE SCHEMAS
// =====================================================
export const blockSchemas: Record<string, z.ZodSchema> = {
  // Intro blocks
  'intro-logo': introLogoSchema,
  'intro-title': introTitleSchema,
  'intro-description': introDescriptionSchema,
  'intro-image': introImageSchema,
  'intro-form': introFormSchema,
  
  // Question blocks
  'question-progress': questionProgressSchema,
  'question-title': questionTitleSchema,
  'question-hero': questionHeroSchema,
  'question-navigation': questionNavigationSchema,
  'question-options-grid': questionOptionsGridSchema,
  
  // Transition blocks
  'transition-hero': transitionHeroSchema,
  'transition-text': transitionTextSchema,
  
  // Result blocks
  'result-header': resultHeaderSchema,
  'result-description': resultDescriptionSchema,
  'result-cta': resultCtaSchema,
  
  // Offer blocks
  'offer-hero': offerHeroSchema,
  'offer-pricing': offerPricingSchema,
  'offer-benefits': offerBenefitsSchema,
  'offer-testimonials': offerTestimonialsSchema,
  'offer-urgency': offerUrgencySchema,
  
  // Layout blocks
  'layout-container': layoutContainerSchema,
  'layout-divider': layoutDividerSchema,
  'layout-spacer': layoutSpacerSchema,
  
  // Legacy blocks
  text: textBlockSchema,
  button: buttonBlockSchema,
  image: imageBlockSchema,
  'options-grid': questionOptionsGridSchema,
};

// Função de validação genérica
export function validateBlock({ type, properties }: ValidationProps) {
  const schema = blockSchemas[type];
  if (!schema) {
    console.warn(`No validation schema found for block type: ${type}`);
    return { success: true };
  }

  try {
    schema.parse(properties);
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      };
    }
    return {
      success: false,
      errors: [{ path: '', message: 'Erro de validação desconhecido' }],
    };
  }
}

// Validadores específicos por campo
export const fieldValidators = {
  required: (value: any) => {
    if (value === undefined || value === null || value === '') {
      return 'Este campo é obrigatório';
    }
    return null;
  },

  minLength: (value: string, min: number) => {
    if (value.length < min) {
      return `Mínimo de ${min} caracteres`;
    }
    return null;
  },

  maxLength: (value: string, max: number) => {
    if (value.length > max) {
      return `Máximo de ${max} caracteres`;
    }
    return null;
  },

  pattern: (value: string, pattern: RegExp, message: string) => {
    if (!pattern.test(value)) {
      return message;
    }
    return null;
  },

  number: (value: any) => {
    if (isNaN(Number(value))) {
      return 'Valor deve ser um número';
    }
    return null;
  },

  url: (value: string) => {
    try {
      new URL(value);
      return null;
    } catch {
      return 'URL inválida';
    }
  },

  color: (value: string) => {
    if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)) {
      return 'Cor inválida (use formato hexadecimal)';
    }
    return null;
  },
};

// Validador de schema completo do editor
export function validateEditorSchema(blocks: any[]) {
  const errors: any[] = [];

  blocks.forEach((block, index) => {
    const validation = validateBlock(block);
    if (!validation.success) {
      errors.push({
        blockIndex: index,
        blockId: block.id,
        blockType: block.type,
        errors: validation.errors,
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Validador de estrutura de dados do editor
export function validateEditorStructure(data: any) {
  const requiredKeys = ['blocks', 'version', 'metadata'];
  const missingKeys = requiredKeys.filter(key => !(key in data));

  if (missingKeys.length > 0) {
    return {
      isValid: false,
      errors: [
        {
          message: `Campos obrigatórios faltando: ${missingKeys.join(', ')}`,
        },
      ],
    };
  }

  if (!Array.isArray(data.blocks)) {
    return {
      isValid: false,
      errors: [
        {
          message: 'A propriedade "blocks" deve ser um array',
        },
      ],
    };
  }

  // Validar cada bloco
  const blockValidation = validateEditorSchema(data.blocks);

  return {
    isValid: blockValidation.isValid,
    errors: blockValidation.errors,
  };
}

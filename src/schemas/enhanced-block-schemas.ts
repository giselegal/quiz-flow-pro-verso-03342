/**
 * 🎯 ENHANCED BLOCK SCHEMAS - Complete Zod Validation
 * 
 * This file provides comprehensive Zod schemas for all 24 block types
 * used in the quiz21StepsComplete template with full validation and versioning.
 * 
 * @module schemas/enhanced-block-schemas
 * @version 3.0.0
 */

import { z } from 'zod';

// ============================================================================
// BASE SCHEMAS
// ============================================================================

/**
 * Base properties shared by all blocks
 */
export const BasePropertiesSchema = z.object({
  padding: z.number().min(0).default(16),
  margin: z.number().min(0).default(0),
  animationType: z.enum(['fade', 'slide', 'scale', 'none']).default('fade'),
  animationDuration: z.number().min(0).max(2000).default(300),
});

/**
 * Base block schema - foundation for all block types
 */
export const BaseBlockSchema = z.object({
  id: z.string().min(1, 'Block ID é obrigatório'),
  type: z.string(),
  order: z.number().min(0),
  properties: z.record(z.any()),
  content: z.record(z.any()).optional(),
  metadata: z.object({
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    version: z.literal('3.0.0').default('3.0.0'),
  }).optional(),
});

// ============================================================================
// INTRO BLOCKS (5 types)
// ============================================================================

/**
 * intro-logo: Logo block with animation support
 */
export const IntroLogoBlockSchema = BaseBlockSchema.extend({
  type: z.literal('intro-logo'),
  properties: BasePropertiesSchema.extend({
    width: z.number().min(10).max(500).optional(),
    height: z.number().min(10).max(500).optional(),
  }),
  content: z.object({
    src: z.string().url('URL da imagem inválida'),
    alt: z.string().min(1, 'Texto alternativo é obrigatório'),
    width: z.number().optional(),
    height: z.number().optional(),
  }),
});

/**
 * intro-title: Title block with typography controls
 */
export const IntroTitleBlockSchema = BaseBlockSchema.extend({
  type: z.literal('intro-title'),
  properties: BasePropertiesSchema.extend({
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Cor inválida').default('#1F2937'),
    fontSize: z.number().min(12).max(72).default(32),
    fontFamily: z.string().default('Playfair Display, serif'),
    fontWeight: z.enum(['normal', 'bold', '300', '400', '500', '600', '700', '800']).default('bold'),
    alignment: z.enum(['left', 'center', 'right']).default('center'),
    lineHeight: z.number().min(1).max(3).default(1.4),
  }),
  content: z.object({
    text: z.string().min(1, 'Texto do título é obrigatório').max(200),
  }),
});

/**
 * intro-description: Description text with formatting
 */
export const IntroDescriptionBlockSchema = BaseBlockSchema.extend({
  type: z.literal('intro-description'),
  properties: BasePropertiesSchema.extend({
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#4B5563'),
    fontSize: z.number().min(12).max(32).default(16),
    alignment: z.enum(['left', 'center', 'right']).default('center'),
    maxWidth: z.number().min(200).max(1200).default(600),
  }),
  content: z.object({
    text: z.string().min(1, 'Texto da descrição é obrigatório').max(500),
  }),
});

/**
 * intro-image: Hero image block
 */
export const IntroImageBlockSchema = BaseBlockSchema.extend({
  type: z.literal('intro-image'),
  properties: BasePropertiesSchema.extend({
    width: z.number().min(100).max(1200).default(400),
    height: z.number().min(100).max(800).default(300),
    objectFit: z.enum(['cover', 'contain', 'fill', 'none']).default('cover'),
    borderRadius: z.number().min(0).max(50).default(12),
  }),
  content: z.object({
    src: z.string().url('URL da imagem inválida'),
    alt: z.string().min(1, 'Texto alternativo é obrigatório'),
  }),
});

/**
 * intro-form: Name input form
 */
export const IntroFormBlockSchema = BaseBlockSchema.extend({
  type: z.literal('intro-form'),
  properties: BasePropertiesSchema.extend({
    buttonColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#B89B7A'),
    buttonTextColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#FFFFFF'),
    borderRadius: z.number().min(0).max(50).default(8),
  }),
  content: z.object({
    placeholder: z.string().default('Digite seu nome'),
    buttonText: z.string().min(1, 'Texto do botão é obrigatório').default('Começar'),
    requiredMessage: z.string().default('Por favor, insira seu nome'),
  }),
});

// ============================================================================
// QUESTION BLOCKS (4 main types)
// ============================================================================

/**
 * question-hero: Hero image for question pages
 */
export const QuestionHeroBlockSchema = BaseBlockSchema.extend({
  type: z.literal('question-hero'),
  properties: BasePropertiesSchema.extend({
    height: z.number().min(200).max(800).default(400),
    overlayOpacity: z.number().min(0).max(1).default(0.3),
    overlayColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#000000'),
  }),
  content: z.object({
    imageUrl: z.string().url('URL da imagem inválida'),
    alt: z.string().optional(),
  }),
});

/**
 * question-title: Question text display
 */
export const QuestionTitleBlockSchema = BaseBlockSchema.extend({
  type: z.literal('question-title'),
  properties: BasePropertiesSchema.extend({
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#1F2937'),
    fontSize: z.number().min(16).max(48).default(24),
    fontWeight: z.enum(['normal', 'bold', '600', '700']).default('bold'),
    alignment: z.enum(['left', 'center', 'right']).default('center'),
  }),
  content: z.object({
    text: z.string().min(1, 'Texto da pergunta é obrigatório').max(300),
  }),
});

/**
 * options-grid: Multiple choice options with scoring
 */
export const OptionsGridBlockSchema = BaseBlockSchema.extend({
  type: z.literal('options-grid'),
  properties: BasePropertiesSchema.extend({
    columns: z.number().min(1).max(4).default(2),
    spacing: z.number().min(8).max(48).default(16),
    minSelections: z.number().min(0).max(10).default(3),
    maxSelections: z.number().min(1).max(10).default(3),
    allowDeselect: z.boolean().default(true),
  }),
  content: z.object({
    options: z.array(
      z.object({
        id: z.string(),
        text: z.string().min(1, 'Texto da opção é obrigatório'),
        imageUrl: z.string().url().optional(),
        points: z.record(z.string(), z.number()),
      })
    ).min(1, 'Pelo menos uma opção é obrigatória'),
  }),
});

/**
 * question-progress: Progress indicator
 */
export const QuestionProgressBlockSchema = BaseBlockSchema.extend({
  type: z.literal('question-progress'),
  properties: BasePropertiesSchema.extend({
    showPercentage: z.boolean().default(true),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#B89B7A'),
    backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#E5E7EB'),
    height: z.number().min(4).max(20).default(8),
    borderRadius: z.number().min(0).max(20).default(4),
  }),
  content: z.object({
    currentStep: z.number().optional(),
    totalSteps: z.number().optional(),
  }).optional(),
});

/**
 * question-navigation: Navigation buttons
 */
export const QuestionNavigationBlockSchema = BaseBlockSchema.extend({
  type: z.literal('question-navigation'),
  properties: BasePropertiesSchema.extend({
    showBack: z.boolean().default(true),
    showNext: z.boolean().default(true),
    alignment: z.enum(['left', 'center', 'right', 'space-between']).default('space-between'),
    buttonColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#B89B7A'),
    buttonTextColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#FFFFFF'),
  }),
  content: z.object({
    backText: z.string().default('Voltar'),
    nextText: z.string().default('Próximo'),
  }),
});

// ============================================================================
// TRANSITION BLOCKS (2 types)
// ============================================================================

/**
 * transition-hero: Transition page hero
 */
export const TransitionHeroBlockSchema = BaseBlockSchema.extend({
  type: z.literal('transition-hero'),
  properties: BasePropertiesSchema.extend({
    height: z.number().min(200).max(600).default(400),
    backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#F3E8D3'),
  }),
  content: z.object({
    imageUrl: z.string().url().optional(),
    title: z.string().min(1, 'Título é obrigatório'),
    subtitle: z.string().optional(),
  }),
});

/**
 * transition-text: Transition description text
 */
export const TransitionTextBlockSchema = BaseBlockSchema.extend({
  type: z.literal('transition-text'),
  properties: BasePropertiesSchema.extend({
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#4B5563'),
    fontSize: z.number().min(14).max(24).default(16),
    alignment: z.enum(['left', 'center', 'right']).default('center'),
  }),
  content: z.object({
    text: z.string().min(1, 'Texto é obrigatório').max(500),
  }),
});

// ============================================================================
// RESULT BLOCKS (9 types)
// ============================================================================

/**
 * result-congrats: Congratulations message
 */
export const ResultCongratsBlockSchema = BaseBlockSchema.extend({
  type: z.literal('result-congrats'),
  properties: BasePropertiesSchema.extend({
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#B89B7A'),
    fontSize: z.number().min(20).max(48).default(32),
    showAnimation: z.boolean().default(true),
  }),
  content: z.object({
    text: z.string().min(1).default('Parabéns!'),
  }),
});

/**
 * result-main: Main result display
 */
export const ResultMainBlockSchema = BaseBlockSchema.extend({
  type: z.literal('result-main'),
  properties: BasePropertiesSchema.extend({
    displayMode: z.enum(['text', 'image', 'both']).default('both'),
    backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#FFFFFF'),
    borderRadius: z.number().min(0).max(30).default(12),
  }),
  content: z.object({
    title: z.string().min(1, 'Título do resultado é obrigatório'),
    description: z.string().min(1, 'Descrição é obrigatória'),
    imageUrl: z.string().url().optional(),
  }),
});

/**
 * result-image: Result style image
 */
export const ResultImageBlockSchema = BaseBlockSchema.extend({
  type: z.literal('result-image'),
  properties: BasePropertiesSchema.extend({
    width: z.number().min(200).max(800).default(400),
    height: z.number().min(200).max(800).default(400),
    borderRadius: z.number().min(0).max(50).default(12),
    objectFit: z.enum(['cover', 'contain']).default('cover'),
  }),
  content: z.object({
    src: z.string().url('URL da imagem inválida'),
    alt: z.string(),
  }),
});

/**
 * result-description: Result description text
 */
export const ResultDescriptionBlockSchema = BaseBlockSchema.extend({
  type: z.literal('result-description'),
  properties: BasePropertiesSchema.extend({
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#4B5563'),
    fontSize: z.number().min(14).max(20).default(16),
    maxLength: z.number().min(100).max(1000).default(500),
  }),
  content: z.object({
    text: z.string().min(1).max(1000),
  }),
});

/**
 * result-progress-bars: Style percentage bars
 */
export const ResultProgressBarsBlockSchema = BaseBlockSchema.extend({
  type: z.literal('result-progress-bars'),
  properties: BasePropertiesSchema.extend({
    showPercentages: z.boolean().default(true),
    barHeight: z.number().min(20).max(60).default(40),
    colorScheme: z.enum(['default', 'gradient', 'monochrome']).default('default'),
    maxBars: z.number().min(1).max(8).default(3),
  }),
  content: z.object({
    styles: z.array(
      z.object({
        name: z.string(),
        percentage: z.number().min(0).max(100),
        color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
      })
    ),
  }),
});

/**
 * result-secondary-styles: Secondary styles display
 */
export const ResultSecondaryStylesBlockSchema = BaseBlockSchema.extend({
  type: z.literal('result-secondary-styles'),
  properties: BasePropertiesSchema.extend({
    displayMode: z.enum(['list', 'cards', 'compact']).default('cards'),
    maxItems: z.number().min(1).max(5).default(2),
  }),
  content: z.object({
    styles: z.array(
      z.object({
        name: z.string(),
        percentage: z.number(),
        description: z.string().optional(),
      })
    ),
  }),
});

/**
 * result-share: Social sharing buttons
 */
export const ResultShareBlockSchema = BaseBlockSchema.extend({
  type: z.literal('result-share'),
  properties: BasePropertiesSchema.extend({
    alignment: z.enum(['left', 'center', 'right']).default('center'),
    buttonStyle: z.enum(['outlined', 'filled', 'text']).default('filled'),
  }),
  content: z.object({
    platforms: z.array(z.enum(['facebook', 'twitter', 'whatsapp', 'instagram', 'linkedin'])),
    shareText: z.string().optional(),
  }),
});

/**
 * result-cta: Call-to-action button
 */
export const ResultCTABlockSchema = BaseBlockSchema.extend({
  type: z.literal('result-cta'),
  properties: BasePropertiesSchema.extend({
    buttonColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#B89B7A'),
    buttonTextColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#FFFFFF'),
    size: z.enum(['small', 'medium', 'large']).default('large'),
  }),
  content: z.object({
    text: z.string().min(1, 'Texto do botão é obrigatório'),
    href: z.string().url('URL inválida'),
  }),
});

// ============================================================================
// OFFER BLOCKS (2 types)
// ============================================================================

/**
 * offer-hero: Offer page hero
 */
export const OfferHeroBlockSchema = BaseBlockSchema.extend({
  type: z.literal('offer-hero'),
  properties: BasePropertiesSchema.extend({
    backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#F3E8D3'),
    height: z.number().min(200).max(600).default(300),
  }),
  content: z.object({
    headline: z.string().min(1, 'Headline é obrigatório').max(200),
    subheadline: z.string().optional(),
    imageUrl: z.string().url().optional(),
  }),
});

/**
 * pricing: Pricing table
 */
export const PricingBlockSchema = BaseBlockSchema.extend({
  type: z.literal('pricing'),
  properties: BasePropertiesSchema.extend({
    layout: z.enum(['single', 'comparison', 'tiered']).default('single'),
    showDiscount: z.boolean().default(true),
    currency: z.string().default('BRL'),
  }),
  content: z.object({
    plans: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        price: z.number().min(0),
        originalPrice: z.number().optional(),
        features: z.array(z.string()),
        highlighted: z.boolean().default(false),
      })
    ).min(1),
  }),
});

// ============================================================================
// UTILITY BLOCKS (3 types)
// ============================================================================

/**
 * CTAButton: Generic CTA button
 */
export const CTAButtonBlockSchema = BaseBlockSchema.extend({
  type: z.literal('CTAButton'),
  properties: BasePropertiesSchema.extend({
    backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#B89B7A'),
    textColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#FFFFFF'),
    size: z.enum(['small', 'medium', 'large']).default('medium'),
    fullWidth: z.boolean().default(false),
  }),
  content: z.object({
    text: z.string().min(1, 'Texto do botão é obrigatório'),
    href: z.string().url('URL inválida'),
    openInNewTab: z.boolean().default(false),
  }),
});

/**
 * text-inline: Inline text block
 */
export const TextInlineBlockSchema = BaseBlockSchema.extend({
  type: z.literal('text-inline'),
  properties: BasePropertiesSchema.extend({
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#4B5563'),
    fontSize: z.number().min(12).max(24).default(14),
    style: z.enum(['normal', 'italic', 'bold']).default('normal'),
  }),
  content: z.object({
    text: z.string().min(1),
  }),
});

// ============================================================================
// DISCRIMINATED UNION - All Block Types
// ============================================================================

/**
 * Complete union type for all quiz blocks
 * Uses discriminated union for type safety and better error messages
 */
export const QuizBlockSchema = z.discriminatedUnion('type', [
  // Intro blocks
  IntroLogoBlockSchema,
  IntroTitleBlockSchema,
  IntroDescriptionBlockSchema,
  IntroImageBlockSchema,
  IntroFormBlockSchema,
  
  // Question blocks
  QuestionHeroBlockSchema,
  QuestionTitleBlockSchema,
  OptionsGridBlockSchema,
  QuestionProgressBlockSchema,
  QuestionNavigationBlockSchema,
  
  // Transition blocks
  TransitionHeroBlockSchema,
  TransitionTextBlockSchema,
  
  // Result blocks
  ResultCongratsBlockSchema,
  ResultMainBlockSchema,
  ResultImageBlockSchema,
  ResultDescriptionBlockSchema,
  ResultProgressBarsBlockSchema,
  ResultSecondaryStylesBlockSchema,
  ResultShareBlockSchema,
  ResultCTABlockSchema,
  
  // Offer blocks
  OfferHeroBlockSchema,
  PricingBlockSchema,
  
  // Utility blocks
  CTAButtonBlockSchema,
  TextInlineBlockSchema,
]);

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type QuizBlock = z.infer<typeof QuizBlockSchema>;
export type IntroLogoBlock = z.infer<typeof IntroLogoBlockSchema>;
export type QuestionHeroBlock = z.infer<typeof QuestionHeroBlockSchema>;
export type OptionsGridBlock = z.infer<typeof OptionsGridBlockSchema>;
export type ResultMainBlock = z.infer<typeof ResultMainBlockSchema>;
// ... export all other types as needed

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Validates a block and returns detailed error messages
 */
export function validateBlock(block: unknown): {
  success: boolean;
  data?: QuizBlock;
  errors?: string[];
} {
  const result = QuizBlockSchema.safeParse(block);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  const errors = result.error.issues.map((issue) => {
    const path = issue.path.join('.');
    return `[${path}] ${issue.message}`;
  });
  
  return { success: false, errors };
}

/**
 * Validates an array of blocks
 */
export function validateBlocks(blocks: unknown[]): {
  success: boolean;
  validBlocks: QuizBlock[];
  invalidBlocks: Array<{ index: number; errors: string[] }>;
} {
  const validBlocks: QuizBlock[] = [];
  const invalidBlocks: Array<{ index: number; errors: string[] }> = [];
  
  blocks.forEach((block, index) => {
    const result = validateBlock(block);
    if (result.success && result.data) {
      validBlocks.push(result.data);
    } else {
      invalidBlocks.push({ index, errors: result.errors || [] });
    }
  });
  
  return {
    success: invalidBlocks.length === 0,
    validBlocks,
    invalidBlocks,
  };
}

// ============================================================================
// ✅ ADDITIONAL BLOCK SCHEMAS - Correção Crítica para Properties Panel
// ============================================================================

/**
 * quiz-score-display: Display quiz score with animation
 */
export const QuizScoreDisplayBlockSchema = BaseBlockSchema.extend({
  type: z.literal('quiz-score-display'),
  properties: BasePropertiesSchema.extend({
    score: z.number().min(0).default(0),
    maxScore: z.number().min(1).default(100),
    label: z.string().default('Sua Pontuação'),
    showPercentage: z.boolean().default(true),
    animateCounter: z.boolean().default(true),
    size: z.enum(['sm', 'md', 'lg', 'xl']).default('lg'),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#B89B7A'),
    backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#FAF9F7'),
    borderRadius: z.number().min(0).default(8),
  }),
});

/**
 * strategic-question: Strategic question block
 */
export const StrategicQuestionBlockSchema = BaseBlockSchema.extend({
  type: z.literal('strategic-question'),
  properties: BasePropertiesSchema.extend({
    question: z.string().min(1, 'Pergunta é obrigatória'),
    description: z.string().optional(),
    questionType: z.enum(['single', 'multiple', 'scale', 'text']).default('single'),
    options: z.array(z.object({
      label: z.string(),
      value: z.string(),
      score: z.number().optional()
    })).optional(),
    required: z.boolean().default(true),
    showProgress: z.boolean().default(true),
    minSelections: z.number().min(0).default(1),
    maxSelections: z.number().min(1).default(1),
  }),
});

/**
 * transition: General transition block
 */
export const TransitionBlockSchema = BaseBlockSchema.extend({
  type: z.literal('transition'),
  properties: BasePropertiesSchema.extend({
    message: z.string().default('Carregando...'),
    duration: z.number().min(100).max(10000).default(2000),
    showSpinner: z.boolean().default(true),
    spinnerType: z.enum(['circular', 'bars', 'dots', 'pulse']).default('circular'),
    backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#FAF9F7'),
    textColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#1F2937'),
    autoAdvance: z.boolean().default(true),
  }),
});

/**
 * transition-result: Transition to result page
 */
export const TransitionResultBlockSchema = BaseBlockSchema.extend({
  type: z.literal('transition-result'),
  properties: BasePropertiesSchema.extend({
    message: z.string().default('Calculando seu resultado...'),
    steps: z.array(z.string()).min(1),
    stepDuration: z.number().min(100).max(5000).default(800),
    showIcon: z.boolean().default(true),
    icon: z.string().default('Sparkles'),
    animateIcon: z.boolean().default(true),
  }),
});

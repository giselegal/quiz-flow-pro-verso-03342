/**
 * 🎯 SCHEMAS ZOD PARA VALIDAÇÃO DE QUIZ
 * 
 * Validação runtime completa para estrutura de quiz v4.0
 * Garante type-safety e validação de dados em runtime
 */

import { z } from 'zod';

// ============================================================================
// COLOR SCHEMAS
// ============================================================================

export const QuizColorSchemaZ = z.object({
  primary: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor primária deve ser hexadecimal'),
  primaryHover: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  primaryLight: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  secondary: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor secundária deve ser hexadecimal'),
  background: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor de fundo deve ser hexadecimal'),
  text: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor do texto deve ser hexadecimal'),
  border: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor da borda deve ser hexadecimal')
});

export const QuizFontSchemaZ = z.object({
  heading: z.string().min(1, 'Font heading é obrigatória'),
  body: z.string().min(1, 'Font body é obrigatória')
});

export const QuizSpacingSchemaZ = z.record(z.number().int().min(0));

export const QuizBorderRadiusSchemaZ = z.record(z.number().int().min(0));

// ============================================================================
// THEME SCHEMA
// ============================================================================

export const QuizThemeSchemaZ = z.object({
  colors: QuizColorSchemaZ,
  fonts: QuizFontSchemaZ,
  spacing: QuizSpacingSchemaZ,
  borderRadius: QuizBorderRadiusSchemaZ
});

// ============================================================================
// BLOCK SCHEMAS
// ============================================================================

export const BlockTypeZ = z.enum([
  // Progress & Navigation
  'question-progress',
  'question-navigation',
  
  // Intro Blocks
  'intro-logo',
  'intro-logo-header',
  'intro-title',
  'intro-subtitle',
  'intro-description',
  'intro-image',
  'intro-form',
  'intro-button',
  'quiz-intro-header',
  
  // Question Blocks
  'question-title',
  'question-description',
  'options-grid',
  'form-input',
  // Compat: heróis e CTA em uso nos JSONs
  'question-hero',
  'transition-hero',
  'CTAButton',
  
  // Transition Blocks
  'transition-title',
  'transition-text',
  'transition-button',
  'transition-image',
  
  // Result Blocks
  'result-header',
  'result-title',
  'result-description',
  'result-image',
  'result-display',
  'result-guide-image',
  // Compat: blocos de resultado usados no gold
  'result-congrats',
  'quiz-score-display',
  'result-main',
  'result-progress-bars',
  'result-secondary-styles',
  'result-cta',
  'result-share',
  
  // Offer Blocks
  'offer-hero',
  'quiz-offer-hero',
  'offer-card',
  'benefits-list',
  'testimonials',
  'pricing',
  'guarantee',
  'urgency-timer',
  'value-anchoring',
  'secure-purchase',
  'cta-button',
  
  // Generic Content
  'text',
  'text-inline',
  'heading',
  'image',
  'button',
  
  // Layout
  'container',
  'spacer',
  'divider',
  'footer-copyright'
]);

export const BlockMetadataZ = z.object({
  component: z.string().optional(),
  editable: z.boolean().default(true),
  reorderable: z.boolean().default(true),
  reusable: z.boolean().default(true),
  deletable: z.boolean().default(true)
}).optional();

export const CalculationRuleZ = z.object({
  weight: z.number().default(1),
  pointsMap: z.record(z.string(), z.number()).optional(),
  numericScale: z.object({
    mul: z.number().default(1),
    min: z.number().optional(),
    max: z.number().optional()
  }).optional()
}).optional();

export const QuizBlockSchemaZ = z.object({
  id: z.string().min(1, 'Block ID é obrigatório'),
  type: BlockTypeZ,
  order: z.number().min(0, 'Order deve be >= 0'),
  properties: z.record(z.any()),
  content: z.record(z.any()).optional(),
  parentId: z.string().nullable().optional(),
  metadata: BlockMetadataZ,
  calculationRule: CalculationRuleZ
});

// ============================================================================
// NAVIGATION SCHEMAS
// ============================================================================

export const NavigationConditionZ = z.object({
  id: z.string(),
  if: z.object({
    operator: z.enum(['equals', 'notEquals', 'greaterThan', 'lessThan', 'contains', 'in']),
    field: z.string(),
    value: z.any()
  }),
  then: z.object({
    action: z.enum(['goto', 'showResult', 'skip', 'end']),
    target: z.string()
  })
});

export const NavigationConfigZ = z.object({
  nextStep: z.string().nullable(),
  conditions: z.array(NavigationConditionZ).optional()
});

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

export const ValidationRuleZ = z.object({
  minItems: z.number().int().min(0).optional(),
  maxItems: z.number().int().min(0).optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  pattern: z.string().optional(),
  errorMessage: z.string().optional()
});

export const ValidationSchemaZ = z.object({
  required: z.boolean().default(false),
  rules: z.record(ValidationRuleZ).optional()
});

// ============================================================================
// STEP SCHEMAS
// ============================================================================

export const StepTypeZ = z.enum([
  'intro',
  'question',
  'strategicQuestion',
  'transition',
  'loading',
  'result',
  'offer',
  // Compat: aliases usados em templates existentes
  'quiz-question',
  'strategic-question',
  'transition-result',
  'quiz-result'
]);

export const QuizStepSchemaZ = z.object({
  id: z.string().min(1, 'Step ID é obrigatório'),
  type: StepTypeZ,
  order: z.number().int().min(1).max(50, 'Order deve estar entre 1 e 50'),
  title: z.string().optional(),
  blocks: z.array(QuizBlockSchemaZ).min(1, 'Step deve ter pelo menos 1 block'),
  navigation: NavigationConfigZ,
  validation: ValidationSchemaZ.optional(),
  // 🔒 P1: Optimistic Locking - versionamento para detectar conflitos
  version: z.number().int().min(1).default(1),
  lastModified: z.string().datetime({ message: 'lastModified deve ser ISO 8601' }).optional()
});

// ============================================================================
// SETTINGS SCHEMAS
// ============================================================================

export const ScoringSettingsZ = z.object({
  enabled: z.boolean().default(true),
  method: z.enum(['sum', 'weighted', 'majority', 'category-points']),
  categories: z.array(z.string()).optional(),
  weights: z.record(z.number()).optional(),
  tieBreak: z.enum(['alphabetical', 'first', 'natural-first', 'random']).optional()
});

export const NavigationSettingsZ = z.object({
  allowBack: z.boolean().default(false),
  autoAdvance: z.boolean().default(true),
  showProgress: z.boolean().default(true),
  delayMs: z.number().int().min(0).optional()
});

export const ValidationSettingsZ = z.object({
  required: z.boolean().default(true),
  strictMode: z.boolean().default(true)
});

export const QuizSettingsZ = z.object({
  scoring: ScoringSettingsZ,
  navigation: NavigationSettingsZ,
  validation: ValidationSettingsZ
});

// ============================================================================
// METADATA SCHEMAS
// ============================================================================

export const QuizMetadataZ = z.object({
  id: z.string().min(1, 'ID é obrigatório'),
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  author: z.string().min(1, 'Autor é obrigatório'),
  createdAt: z.string().datetime({ message: 'Data de criação deve ser ISO 8601' }),
  updatedAt: z.string().datetime({ message: 'Data de atualização deve ser ISO 8601' }),
  // 🔒 P1: Optimistic Locking - versão global do template (semver)
  version: z.string().regex(/^\d+\.\d+\.\d+$/, 'Versão deve ser semver (x.y.z)').optional(),
  tags: z.array(z.string()).optional()
});

// ============================================================================
// RESULTS SCHEMAS
// ============================================================================

export const ResultStyleZ = z.object({
  id: z.string(),
  name: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  image: z.string().url().optional(),
  guideImage: z.string().url().optional(),
  category: z.string().optional(),
  blocks: z.array(QuizBlockSchemaZ).optional()
});

export const ResultsConfigZ = z.record(ResultStyleZ);

// ============================================================================
// BLOCK LIBRARY SCHEMA
// ============================================================================

export const BlockLibraryItemZ = z.object({
  component: z.string(),
  editable: z.boolean().default(true),
  reorderable: z.boolean().default(true),
  reusable: z.boolean().default(true),
  deletable: z.boolean().default(true),
  schema: z.string().optional(),
  defaultProps: z.record(z.any()).optional(),
  defaultContent: z.record(z.any()).optional()
});

export const BlockLibraryZ = z.record(BlockLibraryItemZ);

// ============================================================================
// MAIN QUIZ SCHEMA
// ============================================================================

export const QuizSchemaZ = z.object({
  version: z.string().regex(/^\d+\.\d+\.\d+$/, 'Versão deve ser semver (x.y.z)'),
  schemaVersion: z.string().regex(/^\d+\.\d+$/, 'Schema version deve ser x.y'),
  metadata: QuizMetadataZ,
  theme: QuizThemeSchemaZ,
  settings: QuizSettingsZ,
  steps: z.array(QuizStepSchemaZ).min(1, 'Quiz deve ter pelo menos 1 step').max(50, 'Máximo de 50 steps'),
  results: ResultsConfigZ.optional(),
  blockLibrary: BlockLibraryZ.optional()
});

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type QuizColor = z.infer<typeof QuizColorSchemaZ>;
export type QuizFont = z.infer<typeof QuizFontSchemaZ>;
export type QuizTheme = z.infer<typeof QuizThemeSchemaZ>;
export type BlockType = z.infer<typeof BlockTypeZ>;
export type BlockMetadata = z.infer<typeof BlockMetadataZ>;
export type QuizBlock = z.infer<typeof QuizBlockSchemaZ>;
export type NavigationCondition = z.infer<typeof NavigationConditionZ>;
export type NavigationConfig = z.infer<typeof NavigationConfigZ>;
export type ValidationRule = z.infer<typeof ValidationRuleZ>;
export type ValidationSchema = z.infer<typeof ValidationSchemaZ>;
export type StepType = z.infer<typeof StepTypeZ>;
export type QuizStep = z.infer<typeof QuizStepSchemaZ>;
export type ScoringSettings = z.infer<typeof ScoringSettingsZ>;
export type NavigationSettings = z.infer<typeof NavigationSettingsZ>;
export type ValidationSettings = z.infer<typeof ValidationSettingsZ>;
export type QuizSettings = z.infer<typeof QuizSettingsZ>;
export type QuizMetadata = z.infer<typeof QuizMetadataZ>;
export type ResultStyle = z.infer<typeof ResultStyleZ>;
export type ResultsConfig = z.infer<typeof ResultsConfigZ>;
export type BlockLibraryItem = z.infer<typeof BlockLibraryItemZ>;
export type BlockLibrary = z.infer<typeof BlockLibraryZ>;
export type QuizSchema = z.infer<typeof QuizSchemaZ>;

// 🔒 P1: Optimistic Locking - tipos já exportados acima (QuizStep, QuizMetadata)

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

export function validateQuizSchema(data: unknown): { 
  success: true; 
  data: QuizSchema 
} | { 
  success: false; 
  errors: z.ZodError 
} {
  try {
    const validated = QuizSchemaZ.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error };
    }
    throw error;
  }
}

export function validateQuizSchemaAsync(data: unknown): Promise<QuizSchema> {
  return QuizSchemaZ.parseAsync(data);
}

export function isValidQuizSchema(data: unknown): data is QuizSchema {
  return QuizSchemaZ.safeParse(data).success;
}

export function getSchemaErrors(data: unknown): string[] {
  const result = QuizSchemaZ.safeParse(data);
  if (result.success) return [];
  
  return result.error.errors.map(err => 
    `${err.path.join('.')}: ${err.message}`
  );
}

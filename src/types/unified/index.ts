/**
 * 🎯 UNIFIED TYPES - Tipos Canônicos Centralizados
 * 
 * Este módulo define os tipos CANÔNICOS do sistema.
 * Todos os outros arquivos de tipos devem importar daqui.
 * 
 * REGRA: Se um tipo existe aqui, NÃO defina em outro lugar.
 */

import { z } from 'zod';

// ============================================================================
// BLOCK TYPES - Schema com Zod para validação runtime
// ============================================================================

export const BlockTypeSchema = z.enum([
  // Core blocks
  'headline',
  'text',
  'text-paragraph',
  'image',
  'button',
  'spacer',
  'divider',
  
  // Quiz blocks
  'multiple-choice',
  'single-choice',
  'text-input',
  'quiz-question-inline',
  'quiz-result-inline',
  
  // Layout blocks
  'container',
  'grid',
  'two-column',
  'hero-section',
  
  // Content blocks
  'testimonial',
  'pricing',
  'benefits',
  'faq',
  'video',
  'cta',
  
  // Result blocks
  'result-card',
  'result-header',
  'result-description',
  
  // Offer blocks
  'offer-card',
  'offer-hero',
  'offer-cta',
  
  // Inline blocks
  'text-inline',
  'image-inline',
  'button-inline',
  'badge-inline',
  'progress-inline',
  
  // Form blocks
  'form-input',
  'lead-form',
  'input-field',
  
  // Other
  'custom-code',
  'legal-notice',
]);

export type UnifiedBlockType = z.infer<typeof BlockTypeSchema>;

// ============================================================================
// BLOCK - Estrutura base de um bloco
// ============================================================================

export const BlockSchema = z.object({
  id: z.string(),
  type: z.string(), // Aceita qualquer string para compatibilidade, mas valide com BlockTypeSchema quando necessário
  order: z.number().default(0),
  properties: z.record(z.any()).default({}),
  content: z.record(z.any()).default({}),
  style: z.record(z.any()).optional(),
  children: z.array(z.lazy((): z.ZodTypeAny => BlockSchema)).optional(),
});

export type UnifiedBlock = z.infer<typeof BlockSchema>;

// ============================================================================
// STEP - Estrutura de um step/página
// ============================================================================

export const StepTypeSchema = z.enum([
  'intro',
  'question',
  'strategic-question',
  'transition',
  'result',
  'offer',
  'form',
  'content',
]);

export type UnifiedStepType = z.infer<typeof StepTypeSchema>;

export const StepSchema = z.object({
  id: z.string(),
  type: StepTypeSchema,
  order: z.number(),
  name: z.string(),
  description: z.string().optional(),
  blocks: z.array(BlockSchema).default([]),
  settings: z.object({
    showProgressBar: z.boolean().optional(),
    autoAdvance: z.boolean().optional(),
    timeLimit: z.number().optional(),
    allowBack: z.boolean().optional(),
    allowSkip: z.boolean().optional(),
  }).optional(),
});

export type UnifiedStep = z.infer<typeof StepSchema>;

// ============================================================================
// FUNNEL - Estrutura completa de um funil
// ============================================================================

export const FunnelStatusSchema = z.enum(['draft', 'published', 'archived']);
export type UnifiedFunnelStatus = z.infer<typeof FunnelStatusSchema>;

export const FunnelTypeSchema = z.enum(['quiz', 'lead-gen', 'survey', 'other']);
export type UnifiedFunnelType = z.infer<typeof FunnelTypeSchema>;

export const FunnelThemeSchema = z.object({
  primaryColor: z.string().default('#6366f1'),
  secondaryColor: z.string().default('#8b5cf6'),
  backgroundColor: z.string().default('#ffffff'),
  textColor: z.string().default('#1f2937'),
  fontFamily: z.string().default('Inter, sans-serif'),
});

export type UnifiedFunnelTheme = z.infer<typeof FunnelThemeSchema>;

export const FunnelSettingsSchema = z.object({
  showProgressBar: z.boolean().default(true),
  autoAdvance: z.boolean().default(false),
  enableHistory: z.boolean().default(true),
  analyticsEnabled: z.boolean().default(true),
});

export type UnifiedFunnelSettings = z.infer<typeof FunnelSettingsSchema>;

export const FunnelSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  type: FunnelTypeSchema.default('quiz'),
  status: FunnelStatusSchema.default('draft'),
  steps: z.array(StepSchema).default([]),
  theme: FunnelThemeSchema.optional(),
  settings: FunnelSettingsSchema.optional(),
  userId: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  version: z.number().default(1),
  isActive: z.boolean().default(true),
  metadata: z.record(z.any()).optional(),
});

export type UnifiedFunnel = z.infer<typeof FunnelSchema>;

// ============================================================================
// QUIZ ANSWER - Resposta do usuário
// ============================================================================

export const QuizAnswerSchema = z.object({
  questionId: z.string(),
  value: z.union([z.string(), z.array(z.string()), z.number(), z.boolean()]),
  timestamp: z.string(),
  timeSpentMs: z.number().optional(),
  metadata: z.record(z.any()).optional(),
});

export type UnifiedQuizAnswer = z.infer<typeof QuizAnswerSchema>;

// ============================================================================
// QUIZ SESSION - Sessão do quiz
// ============================================================================

export const QuizSessionSchema = z.object({
  id: z.string(),
  funnelId: z.string(),
  startedAt: z.string(),
  completedAt: z.string().optional(),
  status: z.enum(['in_progress', 'completed', 'abandoned']),
  currentStep: z.number().default(0),
  answers: z.record(QuizAnswerSchema).default({}),
  score: z.number().optional(),
  maxScore: z.number().optional(),
  resultType: z.string().optional(),
  userName: z.string().optional(),
  userEmail: z.string().optional(),
  deviceInfo: z.object({
    userAgent: z.string().optional(),
    screenSize: z.string().optional(),
    language: z.string().optional(),
  }).optional(),
});

export type UnifiedQuizSession = z.infer<typeof QuizSessionSchema>;

// ============================================================================
// EDITOR STATE - Estado do editor
// ============================================================================

export const EditorModeSchema = z.enum(['edit', 'preview', 'readonly']);
export type UnifiedEditorMode = z.infer<typeof EditorModeSchema>;

export interface UnifiedEditorState {
  funnel: UnifiedFunnel | null;
  currentStepId: string | null;
  selectedBlockId: string | null;
  mode: UnifiedEditorMode;
  isDirty: boolean;
  isSaving: boolean;
  history: UnifiedFunnel[];
  historyIndex: number;
}

// ============================================================================
// RESULT - Resultado do quiz
// ============================================================================

export const QuizResultSchema = z.object({
  id: z.string(),
  sessionId: z.string(),
  resultType: z.string(),
  score: z.number(),
  maxScore: z.number(),
  title: z.string(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  recommendation: z.string().optional(),
  nextSteps: z.array(z.string()).optional(),
  data: z.record(z.any()).optional(),
  createdAt: z.string(),
});

export type UnifiedQuizResult = z.infer<typeof QuizResultSchema>;

// ============================================================================
// VALIDATORS - Funções de validação
// ============================================================================

export const validateBlock = (data: unknown): UnifiedBlock | null => {
  const result = BlockSchema.safeParse(data);
  return result.success ? result.data : null;
};

export const validateStep = (data: unknown): UnifiedStep | null => {
  const result = StepSchema.safeParse(data);
  return result.success ? result.data : null;
};

export const validateFunnel = (data: unknown): UnifiedFunnel | null => {
  const result = FunnelSchema.safeParse(data);
  return result.success ? result.data : null;
};

// ============================================================================
// TYPE GUARDS
// ============================================================================

export const isUnifiedBlock = (obj: unknown): obj is UnifiedBlock => {
  return BlockSchema.safeParse(obj).success;
};

export const isUnifiedStep = (obj: unknown): obj is UnifiedStep => {
  return StepSchema.safeParse(obj).success;
};

export const isUnifiedFunnel = (obj: unknown): obj is UnifiedFunnel => {
  return FunnelSchema.safeParse(obj).success;
};

// ============================================================================
// FACTORY FUNCTIONS
// ============================================================================

export const createBlock = (
  type: string,
  properties: Record<string, any> = {},
  content: Record<string, any> = {}
): UnifiedBlock => ({
  id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  type,
  order: 0,
  properties,
  content,
});

export const createStep = (
  type: UnifiedStepType,
  name: string,
  blocks: UnifiedBlock[] = []
): UnifiedStep => ({
  id: `step-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  type,
  order: 0,
  name,
  blocks,
});

export const createFunnel = (name: string): UnifiedFunnel => ({
  id: `funnel-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  name,
  type: 'quiz',
  status: 'draft',
  steps: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  version: 1,
  isActive: true,
});

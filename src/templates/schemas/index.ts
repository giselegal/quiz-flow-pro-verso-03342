/**
 * 🔐 SCHEMAS ZOD - Validação de Templates
 * 
 * Garante integridade dos dados em build time e runtime
 */

import { z } from 'zod';

// ============================================================================
// BLOCK SCHEMAS
// ============================================================================

export const BlockPropertiesSchema = z.record(z.any()).optional();

export const BlockContentSchema = z.record(z.any()).optional();

export const BlockSchema = z.object({
  id: z.string().min(1, 'Block ID é obrigatório'),
  type: z.string().min(1, 'Block type é obrigatório'),
  order: z.number().int().nonnegative('Order deve ser >= 0'),
  properties: BlockPropertiesSchema,
  content: BlockContentSchema,
  metadata: z.record(z.any()).optional(),
});

export type Block = z.infer<typeof BlockSchema>;

// ============================================================================
// STEP SCHEMAS
// ============================================================================

export const StepSchema = z.object({
  id: z.string().regex(/^step-\d{2}$/, 'ID deve ser formato step-XX'),
  name: z.string().min(1, 'Nome é obrigatório'),
  order: z.number().int().positive('Order deve ser > 0'),
  type: z.enum(['intro', 'question', 'result', 'lead-capture', 'transition', 'offer']),
  blocks: z.array(BlockSchema).min(1, 'Pelo menos 1 bloco é obrigatório'),
  isActive: z.boolean().default(true),
  metadata: z.record(z.any()).optional(),
});

export type Step = z.infer<typeof StepSchema>;

// ============================================================================
// FUNNEL SCHEMAS
// ============================================================================

export const FunnelMetadataSchema = z.object({
  id: z.string().min(1, 'ID é obrigatório'),
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  version: z.string().regex(/^\d+\.\d+\.\d+$/, 'Version deve ser semver (ex: 2.1.0)'),
  author: z.string().optional(),
  createdAt: z.string().datetime('Data inválida').optional(),
  updatedAt: z.string().datetime('Data inválida').optional(),
  tags: z.array(z.string()).default([]),
}).passthrough();

export const FunnelThemeSchema = z.object({
  colors: z.object({
    primary: z.string(),
    secondary: z.string(),
    background: z.string(),
    text: z.string(),
  }),
  fonts: z.object({
    heading: z.string(),
    body: z.string(),
  }).optional(),
  spacing: z.record(z.number()).optional(),
  borderRadius: z.record(z.number()).optional(),
});

export const FunnelSettingsSchema = z.object({
  scoring: z.object({
    enabled: z.boolean().default(false),
    type: z.enum(['simple', 'weighted', 'custom']).optional(),
    maxScore: z.number().optional(),
  }).optional(),
  analytics: z.object({
    enabled: z.boolean().default(true),
    provider: z.enum(['ga4', 'mixpanel', 'custom']).optional(),
  }).optional(),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    keywords: z.array(z.string()).optional(),
  }).optional(),
});

export const FunnelSchema = z.object({
  metadata: FunnelMetadataSchema,
  theme: FunnelThemeSchema.optional(),
  settings: FunnelSettingsSchema.optional(),
  steps: z.record(z.string(), z.array(BlockSchema)),
}).passthrough(); // Permite propriedades extras como 'assets'

export type FunnelMetadata = z.infer<typeof FunnelMetadataSchema>;
export type FunnelTheme = z.infer<typeof FunnelThemeSchema>;
export type FunnelSettings = z.infer<typeof FunnelSettingsSchema>;
export type Funnel = z.infer<typeof FunnelSchema>;

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Valida um funnel completo
 */
export function validateFunnel(data: unknown) {
  const result = FunnelSchema.safeParse(data);
  
  if (!result.success) {
    return {
      valid: false,
      errors: result.error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message,
        code: err.code,
      })),
    };
  }
  
  return {
    valid: true,
    data: result.data,
  };
}

/**
 * Valida um step individual
 */
export function validateStep(data: unknown) {
  const result = StepSchema.safeParse(data);
  
  if (!result.success) {
    return {
      valid: false,
      errors: result.error.errors,
    };
  }
  
  return {
    valid: true,
    data: result.data,
  };
}

/**
 * Valida um bloco individual
 */
export function validateBlock(data: unknown) {
  const result = BlockSchema.safeParse(data);
  
  if (!result.success) {
    return {
      valid: false,
      errors: result.error.errors,
    };
  }
  
  return {
    valid: true,
    data: result.data,
  };
}

// ============================================================================
// EXPORT ALL
// ============================================================================

export default {
  FunnelSchema,
  StepSchema,
  BlockSchema,
  validateFunnel,
  validateStep,
  validateBlock,
};

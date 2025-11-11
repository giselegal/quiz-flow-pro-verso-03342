/**
 * Zod Schema for Template V3 Validation
 * Canonical export: prefer importing from '@/templates/validation' index barrel.
 * 
 * Valida estrutura de templates importados via JSON, garantindo:
 * - Campos obrigatórios presentes
 * - Tipos corretos
 * - IDs válidos (UUID format)
 * - Estrutura de blocos e steps consistente
 */

import { z } from 'zod';

// ============================================================================
// Block Schema
// ============================================================================

/**
 * Schema para Option dentro de blocks
 */
export const optionSchema = z.object({
  id: z.string().min(1, 'Option ID obrigatório'),
  text: z.string().min(1, 'Option text obrigatório'),
  value: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
  category: z.string().optional(),
  styleCategory: z.string().optional(),
  points: z.record(z.string(), z.number()).optional(),
  segment: z.string().optional(),
  goal: z.string().optional(),
});

/**
 * Schema para BlockContent
 */
export const blockContentSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  question: z.string().optional(),
  text: z.string().optional(),
  placeholder: z.string().optional(),
  buttonText: z.string().optional(),
  options: z.array(optionSchema).optional(),
  imageUrl: z.string().optional(),
  alt: z.string().optional(),
}).passthrough(); // Permite campos extras para extensibilidade

/**
 * Schema para BlockProperties
 */
export const blockPropertiesSchema = z.object({
  // Layout
  backgroundColor: z.string().optional(),
  textAlign: z.enum(['left', 'center', 'right']).optional(),
  padding: z.string().optional(),
  margin: z.string().optional(),
  borderRadius: z.string().optional(),
  boxShadow: z.string().optional(),
  
  // Typography
  fontSize: z.string().optional(),
  fontWeight: z.string().optional(),
  color: z.string().optional(),
  
  // Quiz specific
  showImages: z.boolean().optional(),
  columns: z.number().int().positive().optional(),
  requiredSelections: z.number().int().min(0).optional(),
  maxSelections: z.number().int().positive().optional(),
  minSelections: z.number().int().min(0).optional(),
  multipleSelection: z.boolean().optional(),
  autoAdvanceOnComplete: z.boolean().optional(),
  autoAdvanceDelay: z.number().int().min(0).optional(),
  
  // Selection and validation
  questionId: z.string().optional(),
  enableButtonOnlyWhenValid: z.boolean().optional(),
  showValidationFeedback: z.boolean().optional(),
  validationMessage: z.string().optional(),
  progressMessage: z.string().optional(),
  showSelectionCount: z.boolean().optional(),
  
  // Styling
  selectionStyle: z.enum(['border', 'background', 'shadow']).optional(),
  selectedColor: z.string().optional(),
  hoverColor: z.string().optional(),
  gridGap: z.number().int().min(0).optional(),
  responsiveColumns: z.boolean().optional(),
  
  // Animation
  animation: z.string().optional(),
  animationDuration: z.string().optional(),
  
  // Score values
  scoreValues: z.record(z.string(), z.number()).optional(),
}).passthrough(); // Permite campos extras

/**
 * Schema principal para Block
 */
export const blockSchema = z.object({
  id: z.string().min(1, 'Block ID obrigatório'),
  type: z.string().min(1, 'Block type obrigatório'),
  order: z.number().int().min(0, 'Order deve ser >= 0'),
  content: blockContentSchema,
  properties: blockPropertiesSchema,
});

export type Block = z.infer<typeof blockSchema>;

// ============================================================================
// Template Metadata Schema
// ============================================================================

export const templateMetadataSchema = z.object({
  name: z.string().min(1, 'Template name obrigatório'),
  version: z.string().min(1, 'Template version obrigatória'),
  description: z.string().optional(),
  author: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type TemplateMetadata = z.infer<typeof templateMetadataSchema>;

// ============================================================================
// Template Steps Schema
// ============================================================================

/**
 * Schema para Steps (Record<string, Block[]>)
 * Valida que cada step tem um array de blocks
 */
export const templateStepsSchema = z.record(
  z.string().regex(/^step-\d+$/, 'Step key deve ser formato "step-N"'),
  z.array(blockSchema).min(0, 'Step deve conter array de blocks (pode ser vazio)')
);

export type TemplateSteps = z.infer<typeof templateStepsSchema>;

// ============================================================================
// Template V3 Complete Schema
// ============================================================================

/**
 * Schema completo para Template V3
 * Estrutura esperada:
 * {
 *   metadata: { name, version, description, author },
 *   steps: {
 *     "step-1": [blocks],
 *     "step-2": [blocks],
 *     ...
 *   }
 * }
 */
export const templateV3Schema = z.object({
  metadata: templateMetadataSchema,
  steps: templateStepsSchema,
});

export type TemplateV3 = z.infer<typeof templateV3Schema>;

// ============================================================================
// Validation Result Types
// ============================================================================

export interface ValidationSuccess {
  success: true;
  data: TemplateV3;
  warnings?: string[];
}

export interface ValidationError {
  success: false;
  errors: Array<{
    path: string[];
    message: string;
    code: string;
  }>;
  rawError: z.ZodError;
}

export type ValidationResult = ValidationSuccess | ValidationError;

// ============================================================================
// UUID Validation Helpers
// ============================================================================

/**
 * Regex para validar UUID v4 format
 */
export const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Valida se um ID é formato UUID v4
 */
export function isValidUUID(id: string): boolean {
  return UUID_V4_REGEX.test(id);
}

/**
 * Valida se um ID é formato legado (Date.now() ou numérico)
 */
export function isLegacyId(id: string): boolean {
  // IDs legados: "block-1234567890", "custom-1234567890", "step-1"
  return /^(block|custom|step|option)-\d+$/.test(id);
}

/**
 * Extrai o prefixo de um ID composto (e.g., "block-" de "block-uuid")
 */
export function extractIdPrefix(id: string): string | null {
  const match = id.match(/^([a-z]+-)/);
  return match ? match[1] : null;
}

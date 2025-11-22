/**
 * 🔒 TEMPLATE VALIDATION SCHEMAS - Wave 2
 * 
 * Schemas Zod para validação de templates/funis.
 * Garantem integridade e type-safety em runtime.
 * 
 * @version 1.0.0
 * @wave 2
 */

import { z } from 'zod';

/**
 * Schema para TemplateVersion
 */
export const TemplateVersionSchema = z.string().regex(/^\d+\.\d+\.\d+$/);

/**
 * Schema para TemplateCategoryEnum
 */
export const TemplateCategorySchema = z.enum([
  'quiz',
  'survey',
  'lead-capture',
  'product-finder',
  'assessment',
  'custom',
]);

/**
 * Schema para StepTypeEnum
 */
export const StepTypeSchema = z.enum([
  'intro',
  'question',
  'transition',
  'result',
  'offer',
  'lead-form',
  'custom',
]);

/**
 * Schema para FunnelMetadata
 */
export const FunnelMetadataSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string(),
  category: TemplateCategorySchema,
  tags: z.array(z.string()),
  version: TemplateVersionSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  author: z.string().optional(),
  thumbnailUrl: z.string().url().optional(),
  isOfficial: z.boolean().optional(),
});

/**
 * Schema para FunnelSettings
 */
export const FunnelSettingsSchema = z.object({
  theme: z.string().optional(),
  navigation: z
    .object({
      allowBack: z.boolean().optional(),
      showProgress: z.boolean().optional(),
      autoAdvance: z.boolean().optional(),
    })
    .optional(),
  scoring: z
    .object({
      method: z.enum(['weighted', 'count', 'custom']).optional(),
      resultsMapping: z.record(z.any()).optional(),
    })
    .optional(),
  integrations: z
    .object({
      analytics: z.boolean().optional(),
      crm: z.string().optional(),
      email: z.string().optional(),
    })
    .optional(),
});

/**
 * Schema para FunnelStep
 */
export const FunnelStepSchema = z.object({
  id: z.string().min(1),
  type: z.union([StepTypeSchema, z.string()]),
  order: z.number().int().positive(),
  title: z.string().min(1),
  description: z.string().optional(),
  blocks: z.array(z.string()),
  settings: z
    .object({
      required: z.boolean().optional(),
      minSelections: z.number().int().optional(),
      maxSelections: z.number().int().optional(),
      validation: z.record(z.any()).optional(),
      timer: z.number().optional(),
    })
    .optional(),
  metadata: z
    .object({
      weight: z.number().optional(),
      dimension: z.string().optional(),
      tags: z.array(z.string()).optional(),
    })
    .optional(),
});

/**
 * Schema para FunnelTemplate completo
 */
export const FunnelTemplateSchema = z.object({
  metadata: FunnelMetadataSchema,
  settings: FunnelSettingsSchema,
  steps: z.array(FunnelStepSchema).min(1),
  blocksUsed: z.array(z.string()),
  validationSchema: z.string().optional(),
});

/**
 * Schema para FunnelResult
 */
export const FunnelResultSchema = z.object({
  sessionId: z.string().min(1),
  templateId: z.string().min(1),
  completedAt: z.string().datetime(),
  responses: z.record(z.any()),
  score: z
    .object({
      primary: z.string().optional(),
      secondary: z.array(z.string()).optional(),
      dimensions: z.record(z.number()).optional(),
    })
    .optional(),
  leadData: z
    .object({
      name: z.string().optional(),
      email: z.string().email().optional(),
      phone: z.string().optional(),
    })
    .passthrough()
    .optional(),
});

/**
 * Schema para TemplateValidationResult
 */
export const TemplateValidationResultSchema = z.object({
  valid: z.boolean(),
  errors: z.array(
    z.object({
      path: z.string(),
      message: z.string(),
      code: z.string(),
    })
  ),
  warnings: z
    .array(
      z.object({
        path: z.string(),
        message: z.string(),
      })
    )
    .optional(),
});

/**
 * Validar FunnelTemplate completo
 */
export function validateFunnelTemplate(data: unknown) {
  return FunnelTemplateSchema.safeParse(data);
}

/**
 * Validar FunnelStep
 */
export function validateFunnelStep(data: unknown) {
  return FunnelStepSchema.safeParse(data);
}

/**
 * Validar FunnelMetadata
 */
export function validateFunnelMetadata(data: unknown) {
  return FunnelMetadataSchema.safeParse(data);
}

/**
 * Validação customizada de integridade do template
 */
export function validateTemplateIntegrity(
  template: z.infer<typeof FunnelTemplateSchema>
): z.infer<typeof TemplateValidationResultSchema> {
  const errors: Array<{ path: string; message: string; code: string }> = [];
  const warnings: Array<{ path: string; message: string }> = [];

  // Validar que todos os blocos referenciados nos steps estão em blocksUsed
  const blocksUsedSet = new Set(template.blocksUsed);
  const allBlocksInSteps = new Set<string>();

  template.steps.forEach((step, stepIndex) => {
    step.blocks.forEach((blockId, blockIndex) => {
      allBlocksInSteps.add(blockId);
      if (!blocksUsedSet.has(blockId)) {
        warnings.push({
          path: `steps[${stepIndex}].blocks[${blockIndex}]`,
          message: `Bloco '${blockId}' não está em blocksUsed`,
        });
      }
    });
  });

  // Validar que blocksUsed não tem blocos não utilizados
  template.blocksUsed.forEach((blockId, index) => {
    if (!allBlocksInSteps.has(blockId)) {
      warnings.push({
        path: `blocksUsed[${index}]`,
        message: `Bloco '${blockId}' está em blocksUsed mas não é usado em nenhum step`,
      });
    }
  });

  // Validar ordem dos steps
  const orders = template.steps.map((s) => s.order);
  const sortedOrders = [...orders].sort((a, b) => a - b);
  if (JSON.stringify(orders) !== JSON.stringify(sortedOrders)) {
    errors.push({
      path: 'steps',
      message: 'Steps não estão ordenados corretamente',
      code: 'INVALID_ORDER',
    });
  }

  // Verificar se há steps duplicados
  const stepIds = template.steps.map((s) => s.id);
  const uniqueStepIds = new Set(stepIds);
  if (stepIds.length !== uniqueStepIds.size) {
    errors.push({
      path: 'steps',
      message: 'Existem steps com IDs duplicados',
      code: 'DUPLICATE_STEP_IDS',
    });
  }

  // Validar que o template tem pelo menos intro e result
  const stepTypes = new Set(template.steps.map((s) => s.type));
  if (!stepTypes.has('intro')) {
    warnings.push({
      path: 'steps',
      message: 'Template não tem step de introdução',
    });
  }
  if (!stepTypes.has('result')) {
    warnings.push({
      path: 'steps',
      message: 'Template não tem step de resultado',
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Type guards com validação Zod
 */
export function isFunnelTemplate(data: unknown): data is z.infer<typeof FunnelTemplateSchema> {
  return FunnelTemplateSchema.safeParse(data).success;
}

export function isFunnelStep(data: unknown): data is z.infer<typeof FunnelStepSchema> {
  return FunnelStepSchema.safeParse(data).success;
}

export function isFunnelMetadata(data: unknown): data is z.infer<typeof FunnelMetadataSchema> {
  return FunnelMetadataSchema.safeParse(data).success;
}

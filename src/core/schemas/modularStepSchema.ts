/**
 * 🧩 MODULAR STEP SCHEMA - Schema Zod para Steps Modulares v4.0
 * 
 * Schema estendido para arquitetura modular com suporte a:
 * - Template versioning
 * - Metadata enriquecido
 * - Navigation avançado
 * - Validation rules
 * 
 * @example
 * ```typescript
 * import { ModularStepSchema, ModularStep } from '@/core/schemas/modularStepSchema';
 * 
 * const result = ModularStepSchema.safeParse(data);
 * if (result.success) {
 *   const step: ModularStep = result.data;
 * }
 * ```
 */

import { z } from 'zod';
import { StepTypeSchema, StepMetadataSchema } from './stepSchema';
import { BlocksArraySchema } from './blockSchema';
import { NavigationSchema, createNavigation } from './navigationSchema';
import { ValidationSchema } from './validationSchema';

/**
 * Schema de metadata para steps modulares
 * ⚠️ Não usa .extend(StepMetadataSchema) - tem estrutura diferente
 * - StepMetadataSchema: optional, campos básicos
 * - ModularStepMetadataSchema: required com id, name, order
 */
export const ModularStepMetadataSchema = z.object({
    id: z.string(),
    name: z.string(),
    order: z.number(),
    description: z.string().optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    title: z.string().optional(),
    createdAt: z.number().optional(),
    updatedAt: z.number().optional(),
    version: z.string().optional(),
    scoringAddedAt: z.string().optional(),
    scoring: z.object({
        weight: z.number().optional(),
        timeLimit: z.number().optional(),
        hasCorrectAnswer: z.boolean().optional(),
        speedBonusEnabled: z.boolean().optional(),
    }).optional(),
});


/**
 * Schema de theme/styling
 */
export const StepThemeSchema = z.object({
    colors: z.record(z.string()).optional(),
    fonts: z.record(z.string()).optional(),
    spacing: z.record(z.union([z.number(), z.string()])).optional(),
    borderRadius: z.record(z.union([z.number(), z.string()])).optional(),
}).optional();

/**
 * Schema de behavior
 */
export const StepBehaviorSchema = z.object({
    autoAdvance: z.boolean().optional(),
}).optional();

/**
 * Schema de modular metadata (_modular field)
 */
export const ModularMetaSchema = z.object({
    extractedFrom: z.string().optional(),
    extractedAt: z.string().optional(),
    sourceVersion: z.string().optional(),
    modularVersion: z.string().optional(),
    originalStepId: z.string().optional(),
}).optional();

/**
 * Schema principal de step modular (v4.0)
 */
export const ModularStepSchema = z.object({
    // Campos obrigatórios
    templateVersion: z.string().default('4.0'),
    metadata: ModularStepMetadataSchema,
    blocks: BlocksArraySchema,
    
    // Campos opcionais
    type: StepTypeSchema.optional(),
    title: z.string().optional(),
    redirectPath: z.string().optional(),
    theme: StepThemeSchema.optional(),
    validation: ValidationSchema.optional(),
    behavior: StepBehaviorSchema.optional(),
    navigation: NavigationSchema.optional(),
    
    // Metadata modular
    _modular: ModularMetaSchema,
    
    // Campos de resultado/oferta (steps específicos)
    offer: z.any().optional(),
    layout: z.any().optional(),
});

/**
 * Tipo TypeScript derivado do schema
 */
export type ModularStepMetadata = z.infer<typeof ModularStepMetadataSchema>;
export type StepTheme = z.infer<typeof StepThemeSchema>;
export type StepBehavior = z.infer<typeof StepBehaviorSchema>;
export type ModularMeta = z.infer<typeof ModularMetaSchema>;
export type ModularStep = z.infer<typeof ModularStepSchema>;

/**
 * Schema de array de steps modulares
 */
export const ModularStepsArraySchema = z.array(ModularStepSchema);

/**
 * Validação helper
 */
export function validateModularStep(data: unknown): { success: true; data: ModularStep } | { success: false; error: z.ZodError } {
    const result = ModularStepSchema.safeParse(data);
    return result;
}

/**
 * Validação helper para array
 */
export function validateModularSteps(data: unknown): { success: true; data: ModularStep[] } | { success: false; error: z.ZodError } {
    const result = ModularStepsArraySchema.safeParse(data);
    return result;
}

/**
 * Factory para criar step modular com valores padrão
 */
export function createModularStep(metadata: ModularStepMetadata, overrides?: Partial<ModularStep>): ModularStep {
    return {
        templateVersion: '4.0',
        metadata,
        blocks: [],
        theme: {},
        validation: {},
        behavior: {},
        navigation: createNavigation(),
        ...overrides,
    };
}

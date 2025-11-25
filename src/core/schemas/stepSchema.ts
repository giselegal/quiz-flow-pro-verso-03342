/**
 * 🎯 STEP SCHEMA - Schema Zod para Steps
 * 
 * Schema consolidado para steps do quiz.
 * 
 * @example
 * ```typescript
 * import { StepSchema, Step } from '@/core/schemas/stepSchema';
 * 
 * const result = StepSchema.safeParse(data);
 * if (result.success) {
 *   const step: Step = result.data;
 * }
 * ```
 */

import { z } from 'zod';
import { BlockSchema, BlocksArraySchema } from './blockSchema';

/**
 * Tipos de step suportados
 */
export const StepTypeSchema = z.enum([
    'intro',
    'question',
    'transition',
    'result',
    'offer',
]);

export type StepType = z.infer<typeof StepTypeSchema>;

/**
 * Schema de metadata do step
 */
export const StepMetadataSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    createdAt: z.number().optional(),
    updatedAt: z.number().optional(),
    version: z.string().optional(),
}).optional();

/**
 * Schema principal de step
 */
export const StepSchema = z.object({
    id: z.string(),
    type: StepTypeSchema,
    blocks: BlocksArraySchema,
    metadata: StepMetadataSchema,
});

/**
 * Tipo TypeScript derivado do schema
 */
export type Step = z.infer<typeof StepSchema>;

/**
 * Schema de array de steps
 */
export const StepsArraySchema = z.array(StepSchema);

/**
 * Validação helper
 */
export function validateStep(data: unknown): { success: true; data: Step } | { success: false; error: z.ZodError } {
    const result = StepSchema.safeParse(data);
    return result;
}

/**
 * Factory para criar steps com valores padrão
 */
export function createStep(id: string, type: StepType, overrides?: Partial<Step>): Step {
    return {
        id,
        type,
        blocks: [],
        metadata: {
            createdAt: Date.now(),
            version: '1.0.0',
        },
        ...overrides,
    };
}

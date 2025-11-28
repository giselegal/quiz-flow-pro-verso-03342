/**
 * ✅ VALIDATION SCHEMA - Schema Zod para Validação
 * 
 * Schema para regras de validação de steps e blocos.
 * 
 * @example
 * ```typescript
 * import { ValidationSchema, Validation } from '@/core/schemas/validationSchema';
 * 
 * const result = ValidationSchema.safeParse(data);
 * if (result.success) {
 *   const validation: Validation = result.data;
 * }
 * ```
 */

import { z } from 'zod';

/**
 * Schema de regra individual
 */
export const ValidationRuleSchema = z.object({
    minItems: z.number().int().positive().optional(),
    maxItems: z.number().int().positive().optional(),
    minLength: z.number().int().nonnegative().optional(),
    maxLength: z.number().int().positive().optional(),
    pattern: z.string().optional(),
    errorMessage: z.string().optional(),
    custom: z.any().optional(),
});

/**
 * Schema de validação completo
 */
export const ValidationSchema = z.object({
    required: z.array(z.string()).optional(),
    rules: z.record(ValidationRuleSchema).optional(),
    errorMessages: z.record(z.string()).optional(),
}).optional();

/**
 * Tipo TypeScript derivado do schema
 */
export type ValidationRule = z.infer<typeof ValidationRuleSchema>;
export type Validation = z.infer<typeof ValidationSchema>;

/**
 * Validação helper
 */
export function validateValidationConfig(data: unknown): { success: true; data: Validation } | { success: false; error: z.ZodError } {
    const result = ValidationSchema.safeParse(data);
    return result;
}

/**
 * Factory para criar validação com valores padrão
 */
export function createValidation(overrides?: Partial<Validation>): Validation {
    return {
        required: [],
        rules: {},
        errorMessages: {},
        ...overrides,
    };
}

/**
 * 🧭 NAVIGATION SCHEMA - Schema Zod para Navegação
 * 
 * Schema para configuração de navegação entre steps.
 * 
 * @example
 * ```typescript
 * import { NavigationSchema, Navigation } from '@/core/schemas/navigationSchema';
 * 
 * const result = NavigationSchema.safeParse(data);
 * if (result.success) {
 *   const nav: Navigation = result.data;
 * }
 * ```
 */

import { z } from 'zod';

/**
 * Schema de navegação completo
 */
export const NavigationSchema = z.object({
    nextStep: z.string().optional(),
    prevStep: z.string().optional(),
    allowBack: z.boolean().default(true),
    autoAdvance: z.boolean().default(false),
    autoAdvanceDelay: z.number().positive().optional(),
}).optional();

/**
 * Tipo TypeScript derivado do schema
 */
export type Navigation = z.infer<typeof NavigationSchema>;

/**
 * Validação helper
 */
export function validateNavigation(data: unknown): { success: true; data: Navigation } | { success: false; error: z.ZodError } {
    const result = NavigationSchema.safeParse(data);
    return result;
}

/**
 * Factory para criar navegação com valores padrão
 */
export function createNavigation(overrides?: Partial<Navigation>): Navigation {
    return {
        allowBack: true,
        autoAdvance: false,
        ...overrides,
    };
}

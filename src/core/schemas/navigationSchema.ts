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
    nextStep: z.string().optional().describe('ID do próximo step (step-XX)'),
    prevStep: z.string().optional().describe('ID do step anterior (step-XX)'),
    allowBack: z.boolean().default(true).describe('Permite voltar ao step anterior'),
    autoAdvance: z.boolean().default(false).describe('Avança automaticamente após validação'),
    autoAdvanceDelay: z.number().min(0).default(0).describe('Delay em ms antes do autoadvance'),
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
export function createNavigation(data: Partial<Navigation> = {}): Navigation {
    // Usa o schema para aplicar defaults e validar entrada parcial
    return NavigationSchema.parse(data);
}

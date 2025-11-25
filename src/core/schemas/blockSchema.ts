/**
 * 🎯 UNIFIED BLOCK SCHEMA - Fonte Única de Verdade
 * 
 * Schema Zod consolidado para blocos do editor.
 * Substitui definições duplicadas em types/editor.ts e types/quizBuilder.ts
 * 
 * BENEFÍCIOS:
 * - Validação em runtime com Zod
 * - Tipo TypeScript derivado do schema
 * - Sem duplicação de tipos
 * - Fácil adicionar novos tipos de bloco
 * 
 * @example
 * ```typescript
 * import { BlockSchema, Block } from '@/core/schemas/blockSchema';
 * 
 * // Validar em runtime
 * const result = BlockSchema.safeParse(data);
 * if (result.success) {
 *   const block: Block = result.data;
 * }
 * ```
 */

import { z } from 'zod';

/**
 * Tipos de bloco suportados
 */
export const BlockTypeSchema = z.enum([
    // Blocos de introdução
    'intro-logo',
    'intro-logo-header',
    'intro-title',
    'intro-description',
    'intro-image',
    'intro-form',
    'intro-button',
    
    // Blocos de pergunta
    'question-title',
    'question-description',
    'options-grid',
    'question-navigation',
    
    // Blocos de transição
    'transition-title',
    'transition-text',
    'transition-button',
    
    // Blocos de resultado
    'result-header',
    'result-title',
    'result-description',
    'result-image',
    
    // Blocos de oferta
    'offer-hero',
    'quiz-offer-hero',
    'benefits-list',
    'testimonials',
    'pricing',
    'guarantee',
    'urgency-timer',
    'value-anchoring',
    'secure-purchase',
    'cta-button',
    
    // Blocos genéricos
    'text',
    'heading',
    'image',
    'button',
    'form-input',
    'footer-copyright',
    
    // Blocos de layout
    'container',
    'spacer',
    'divider',
]);

export type BlockType = z.infer<typeof BlockTypeSchema>;

/**
 * Schema de propriedades genéricas de bloco
 */
export const BlockPropertiesSchema = z.record(z.any()).optional();

/**
 * Schema de conteúdo genérico de bloco
 */
export const BlockContentSchema = z.record(z.any()).optional();

/**
 * Schema de metadata do bloco
 */
export const BlockMetadataSchema = z.object({
    createdAt: z.number().optional(),
    updatedAt: z.number().optional(),
    version: z.string().optional(),
    tags: z.array(z.string()).optional(),
}).optional();

/**
 * Schema principal de bloco
 */
export const BlockSchema = z.object({
    id: z.string(),
    type: BlockTypeSchema,
    order: z.number().int().nonnegative(),
    content: BlockContentSchema,
    properties: BlockPropertiesSchema,
    metadata: BlockMetadataSchema,
});

/**
 * Tipo TypeScript derivado do schema
 */
export type Block = z.infer<typeof BlockSchema>;

/**
 * Schema de array de blocos
 */
export const BlocksArraySchema = z.array(BlockSchema);

/**
 * Validação helper
 */
export function validateBlock(data: unknown): { success: true; data: Block } | { success: false; error: z.ZodError } {
    const result = BlockSchema.safeParse(data);
    return result;
}

/**
 * Validação de array de blocos
 */
export function validateBlocks(data: unknown): { success: true; data: Block[] } | { success: false; error: z.ZodError } {
    const result = BlocksArraySchema.safeParse(data);
    return result;
}

/**
 * Tipo guard TypeScript
 */
export function isBlock(data: unknown): data is Block {
    return BlockSchema.safeParse(data).success;
}

/**
 * Factory para criar blocos com valores padrão
 */
export function createBlock(type: BlockType, overrides?: Partial<Block>): Block {
    return {
        id: `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type,
        order: 0,
        content: {},
        properties: {},
        metadata: {
            createdAt: Date.now(),
            version: '1.0.0',
        },
        ...overrides,
    };
}

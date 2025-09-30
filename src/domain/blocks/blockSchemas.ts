import { z } from 'zod';
import type { BlockType } from './blockTypes';

// Schemas específicos mínimos (evoluir conforme necessário)
export const headingBlockSchema = z.object({
    id: z.string(),
    type: z.literal('heading'),
    properties: z.object({
        text: z.string().default('Título'),
        level: z.number().int().min(1).max(4).default(1),
        align: z.enum(['left', 'center', 'right']).default('center')
    }),
    content: z.object({
        title: z.string().default(''),
        description: z.string().default('')
    }).partial().optional()
});

export const imageBlockSchema = z.object({
    id: z.string(),
    type: z.literal('image'),
    properties: z.object({
        src: z.string().url().or(z.literal('')).default(''),
        alt: z.string().default(''),
        width: z.number().optional(),
        height: z.number().optional(),
        rounded: z.boolean().default(true)
    }),
    content: z.object({ title: z.string().default('') }).partial().optional()
});

export const inputBlockSchema = z.object({
    id: z.string(),
    type: z.literal('input'),
    properties: z.object({
        name: z.string().default('nome'),
        label: z.string().default('Nome'),
        placeholder: z.string().default('Digite...'),
        required: z.boolean().default(true),
        variant: z.enum(['text', 'email']).default('text')
    }),
    content: z.object({ helper: z.string().default('') }).partial().optional()
});

export const buttonBlockSchema = z.object({
    id: z.string(),
    type: z.literal('button'),
    properties: z.object({
        text: z.string().default('Continuar'),
        action: z.enum(['next', 'submit', 'none']).default('next'),
        fullWidth: z.boolean().default(true)
    }),
    content: z.object({}).optional()
});

// Quiz specific (mínimo para fase 2)
export const quizQuestionBlockSchema = z.object({
    id: z.string(),
    type: z.literal('quiz-question-inline'),
    properties: z.object({
        questionId: z.string().optional(),
        title: z.string().default('Pergunta'),
        options: z.array(z.any()).default([]),
        scoring: z.any().nullable().optional(),
        variant: z.string().default('default'),
        autoAdvance: z.boolean().optional(),
        requiredSelections: z.number().optional()
    }),
    content: z.object({
        prompt: z.string().default(''),
        description: z.string().default('')
    }).partial().optional(),
    order: z.number().int().default(0)
});

export const quizTransitionBlockSchema = z.object({
    id: z.string(),
    type: z.literal('quiz-transition'),
    properties: z.object({
        label: z.string().default('Transição')
    }),
    content: z.object({ title: z.string().default('') }).partial().optional(),
    order: z.number().int().default(0)
});

export const quizResultBlockSchema = z.object({
    id: z.string(),
    type: z.literal('quiz-result'),
    properties: z.object({
        title: z.string().default('Resultados')
    }),
    content: z.object({ title: z.string().default('Resultados') }).partial().optional(),
    order: z.number().int().default(0)
});

export const quizOfferBlockSchema = z.object({
    id: z.string(),
    type: z.literal('quiz-offer'),
    properties: z.object({
        title: z.string().default('Oferta')
    }),
    content: z.object({ title: z.string().default('Oferta') }).partial().optional(),
    order: z.number().int().default(0)
});

export const blockSchemas = {
    heading: headingBlockSchema,
    image: imageBlockSchema,
    input: inputBlockSchema,
    button: buttonBlockSchema,
    'quiz-question-inline': quizQuestionBlockSchema,
    'quiz-transition': quizTransitionBlockSchema,
    'quiz-result': quizResultBlockSchema,
    'quiz-offer': quizOfferBlockSchema
};

export type HeadingBlock = z.infer<typeof headingBlockSchema>;
export type ImageBlock = z.infer<typeof imageBlockSchema>;
export type InputBlock = z.infer<typeof inputBlockSchema>;
export type ButtonBlock = z.infer<typeof buttonBlockSchema>;
export type QuizQuestionBlock = z.infer<typeof quizQuestionBlockSchema>;
export type QuizTransitionBlock = z.infer<typeof quizTransitionBlockSchema>;
export type QuizResultBlock = z.infer<typeof quizResultBlockSchema>;
export type QuizOfferBlock = z.infer<typeof quizOfferBlockSchema>;

export type AnyCoreBlock =
    | HeadingBlock
    | ImageBlock
    | InputBlock
    | ButtonBlock
    | QuizQuestionBlock
    | QuizTransitionBlock
    | QuizResultBlock
    | QuizOfferBlock;

export function validateBlock(block: unknown) {
    if (!block || typeof block !== 'object') return { success: false, error: 'invalid object' };
    const type = (block as any).type as BlockType;
    const schema = (blockSchemas as any)[type];
    if (!schema) return { success: false, error: 'unknown block type' };
    const parsed = schema.safeParse(block);
    return parsed.success ? { success: true, data: parsed.data } : { success: false, error: parsed.error };
}

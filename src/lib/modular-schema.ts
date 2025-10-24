/**
 * Zod schemas para o formato modular JSON do quiz.
 * - ModularOptionSchema: opção dentro de perguntas / grids
 * - ModularBlockSchema: blocos recursivos (children)
 * - ModularStepSchema: etapas do quiz
 * - ModularQuizSchema: raíz (meta + steps)
 *
 * Observação:
 * - Usamos .catchall(z.unknown()) em pontos apropriados para permitir campos extras
 *   sem quebrar a validação (compatibilidade retroativa).
 */

import { z } from 'zod';

// Opção usada em blocos do tipo question / options-grid
export const ModularOptionSchema = z.object({
    id: z.string(),
    label: z.string().optional(),
    text: z.string().optional(),
    image: z.string().optional(),
    imageUrl: z.string().optional(),
    points: z.number().optional(),
    score: z.number().optional(),
    category: z.string().optional()
}).catchall(z.unknown());

export type ModularOption = z.infer<typeof ModularOptionSchema>;

// Bloco recursivo (aceita content/props e children)
export const ModularBlockSchema: z.ZodType<any> = z.lazy(() =>
    z.object({
        id: z.string(),
        type: z.string(), // ex: 'text' | 'quiz-options' | 'image' | 'container' ...
        component: z.string().optional(), // nome do componente modular (registry)
        props: z.record(z.any()).optional(),
        content: z.record(z.any()).optional(), // dados exibíveis
        order: z.number().optional(),
        children: z.array(ModularBlockSchema).optional()
    }).catchall(z.unknown())
);

export type ModularBlock = z.infer<typeof ModularBlockSchema>;

// Etapa
export const ModularStepSchema = z.object({
    id: z.string(),
    type: z.string(), // 'intro' | 'question' | 'result' | 'offer' ...
    order: z.number().optional(),
    title: z.string().optional(),
    blocks: z.array(ModularBlockSchema).optional(),
    nextStep: z.string().optional()
}).catchall(z.unknown());

export type ModularStep = z.infer<typeof ModularStepSchema>;

// Quiz raiz
export const ModularQuizSchema = z.object({
    meta: z.record(z.any()).optional(),
    steps: z.array(ModularStepSchema)
}).strict();

export type ModularQuiz = z.infer<typeof ModularQuizSchema>;

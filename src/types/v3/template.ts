import { z } from 'zod';

// BlockInstance representa uma instância de bloco atômico no step
export const BlockInstanceSchema = z.object({
    id: z.string().min(1),           // id único da instância
    type: z.string().min(1),         // id do bloco no BlockRegistry
    config: z.record(z.any()).default({}),
    responsive: z
        .object({
            hiddenOnMobile: z.boolean().optional(),
            hiddenOnDesktop: z.boolean().optional(),
            maxWidth: z.string().optional(),
            align: z.enum(['left', 'center', 'right']).optional(),
        })
        .optional(),
});

export type BlockInstance = z.infer<typeof BlockInstanceSchema>;

// Template minimalista por etapa baseado apenas em blocos (v3.1)
export const StepBlocksTemplateSchema = z.object({
    stepId: z.string().min(1, 'Step ID é obrigatório'),
    metadata: z.object({
        id: z.string(),
        title: z.string(),
        description: z.string().optional(),
        version: z.string().optional(),
    }),
    templateVersion: z.enum(['3.0', '3.1', '3.2']),
    theme: z.record(z.any()).optional(),
    layout: z.record(z.any()).optional(),
    blocks: z.array(BlockInstanceSchema).default([]),
    validation: z
        .object({
            required: z.array(z.string()).optional(),
            minAnswers: z.number().optional(),
            maxAnswers: z.number().optional(),
            validationMessage: z.string().optional(),
        })
        .optional(),
    analytics: z
        .object({
            events: z.array(z.string()).default([]),
            trackingId: z.string().optional(),
        })
        .optional(),
});

export type StepBlocksTemplate = z.infer<typeof StepBlocksTemplateSchema>;

import { z } from 'zod';

// Fundamental scalar helpers
const idRegex = /^[a-z0-9\-_:]+$/i;
export const IdSchema = z.string().min(1).regex(idRegex, 'invalid id');

// Option for question / strategic question
export const QuestionOptionSchema = z.object({
    id: IdSchema,
    text: z.string().min(1, 'option text required'),
    image: z.string().url().optional().or(z.literal('').transform(() => undefined)).optional()
});

// Base discriminated union for canonical steps
export const IntroStepSchema = z.object({
    id: IdSchema,
    type: z.literal('intro'),
    title: z.string().min(1),
    text: z.string().optional(),
    buttonText: z.string().min(1).optional()
});

export const QuestionStepSchema = z.object({
    id: IdSchema,
    type: z.literal('question'),
    questionText: z.string().min(1),
    requiredSelections: z.number().int().min(1).max(10),
    options: z.array(QuestionOptionSchema).min(2),
    next: IdSchema
});

export const StrategicQuestionStepSchema = z.object({
    id: IdSchema,
    type: z.literal('strategic-question'),
    questionText: z.string().min(1),
    options: z.array(z.object({ id: IdSchema, text: z.string().min(1) })).min(2),
    next: IdSchema
});

// Transition variants (separated for discriminated union correctness)
const TransitionBaseShape = {
    id: IdSchema,
    title: z.string().min(1),
    text: z.string().optional(),
    next: IdSchema
};

export const TransitionStepSchema = z.object({
    ...TransitionBaseShape,
    type: z.literal('transition')
});

export const TransitionResultStepSchema = z.object({
    ...TransitionBaseShape,
    type: z.literal('transition-result')
});

export const ResultStepSchema = z.object({
    id: IdSchema,
    type: z.literal('result'),
    title: z.string().min(1),
    next: IdSchema
});

export const OfferVariantSchema = z.object({
    matchValue: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1),
    buttonText: z.string().min(1),
    testimonial: z.object({
        quote: z.string().min(1),
        author: z.string().min(1)
    })
});

export const OfferStepSchema = z.object({
    id: IdSchema,
    type: z.literal('offer'),
    image: z.string().url().optional(),
    variants: z.array(OfferVariantSchema).min(1)
});

export const CanonicalStepSchema = z.discriminatedUnion('type', [
    IntroStepSchema,
    QuestionStepSchema,
    StrategicQuestionStepSchema,
    TransitionStepSchema,
    TransitionResultStepSchema,
    ResultStepSchema,
    OfferStepSchema
]);

export const CanonicalQuizDefinitionSchema = z.object({
    version: z.string().min(1),
    hash: z.string().min(4),
    steps: z.array(CanonicalStepSchema).min(5),
    offerMapping: z.object({ strategicFinalStepId: IdSchema }),
    progress: z.object({ countedStepIds: z.array(IdSchema).min(1) })
}).superRefine((val, ctx) => {
    // Validate that all referenced next step ids exist
    const ids = new Set(val.steps.map(s => s.id));
    for (const s of val.steps) {
        if ('next' in s && s.next && !ids.has(s.next)) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: `next references missing step: ${s.next}`, path: ['steps', s.id, 'next'] });
        }
    }
});

// Publish payload (flattened) – can be extended with metadata
export const PublishPayloadSchema = z.object({
    id: IdSchema,
    canonical: CanonicalQuizDefinitionSchema,
    publishedAt: z.string().datetime().optional(),
    version: z.number().int().positive(),
    diff: z.any().optional()
});

export type CanonicalStepValidated = z.infer<typeof CanonicalStepSchema>;
export type CanonicalQuizDefinitionValidated = z.infer<typeof CanonicalQuizDefinitionSchema>;
export type PublishPayload = z.infer<typeof PublishPayloadSchema>;

export function validateCanonicalDefinition(data: unknown) {
    return CanonicalQuizDefinitionSchema.safeParse(data);
}

export function validatePublishPayload(data: unknown) {
    return PublishPayloadSchema.safeParse(data);
}

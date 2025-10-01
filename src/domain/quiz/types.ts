import { z } from 'zod';

// Fundamental style ids (mantém identicidade com scoring atual)
export const styleIds = [
    'natural',
    'classico',
    'contemporaneo',
    'elegante',
    'romantico',
    'sexy',
    'dramatico',
    'criativo'
] as const;
export type StyleId = typeof styleIds[number];

export const stepTypeSchema = z.enum([
    'intro',
    'question',
    'strategic-question',
    'transition',
    'transition-result',
    'result',
    'offer'
]);
export type StepType = z.infer<typeof stepTypeSchema>;

// Base de qualquer step; usamos passthrough para permitir campos de UI opcionais
// (formQuestion, placeholder, buttonText, image) sem quebrar validação estrita
const baseStepSchema = z.object({
    id: z.string().regex(/^step-\d+$/),
    type: stepTypeSchema,
    next: z.string().regex(/^step-\d+$/).optional(),
    title: z.string().optional()
}).passthrough();

const questionOptionSchema = z.object({
    id: z.string(),
    text: z.string(),
    image: z.string().url().optional(),
    weight: z.number().int().positive().optional() // default = 1
});

const questionStepSchema = baseStepSchema.extend({
    type: z.literal('question'),
    questionNumber: z.string(),
    questionText: z.string(),
    requiredSelections: z.number().int().positive(),
    minSelections: z.number().int().positive().optional(),
    maxSelections: z.number().int().positive().optional(),
    options: z.array(questionOptionSchema).min(1)
});

const strategicOptionSchema = z.object({
    id: z.string(),
    text: z.string(),
    tagKey: z.string().optional()
});

const strategicStepSchema = baseStepSchema.extend({
    type: z.literal('strategic-question'),
    questionText: z.string(),
    options: z.array(strategicOptionSchema).min(2)
});

const transitionStepSchema = baseStepSchema.extend({
    type: z.literal('transition'),
    text: z.string().optional()
});

const transitionResultStepSchema = baseStepSchema.extend({
    type: z.literal('transition-result'),
    text: z.string().optional()
});

const resultStepSchema = baseStepSchema.extend({
    type: z.literal('result'),
    title: z.string()
});

const offerVariantSchema = z.object({
    matchValue: z.string(),
    title: z.string(),
    description: z.string(),
    buttonText: z.string(),
    testimonial: z.object({
        quote: z.string(),
        author: z.string()
    }),
    priority: z.number().int().optional()
});

const offerStepSchema = baseStepSchema.extend({
    type: z.literal('offer'),
    image: z.string().url().optional(),
    variants: z.array(offerVariantSchema).min(1),
    matchQuestionId: z.string().regex(/^step-\d+$/)
});

export const anyStepSchema = z.union([
    questionStepSchema,
    strategicStepSchema,
    transitionStepSchema,
    transitionResultStepSchema,
    resultStepSchema,
    offerStepSchema,
    baseStepSchema // fallback (intro)
]);

const seoSchema = z.object({
    title: z.string(),
    description: z.string(),
    keywords: z.array(z.string()),
    ogTitle: z.string(),
    ogDescription: z.string()
});

const trackingSchema = z.object({
    events: z.array(z.string())
});

export const quizDefinitionSchema = z.object({
    id: z.string(),
    version: z.string(),
    status: z.enum(['draft', 'published']),
    createdAt: z.string(),
    updatedAt: z.string(),
    steps: z.array(anyStepSchema).length(21),
    scoring: z.object({
        styles: z.array(z.enum(styleIds)),
        defaultWeight: z.number().int().positive(),
        perStep: z.record(z.record(z.number().int().positive())).optional()
    }),
    progress: z.object({
        countedStepIds: z.array(z.string())
    }),
    seo: seoSchema,
    tracking: trackingSchema,
    offerMapping: z.object({
        strategicFinalStepId: z.string().regex(/^step-\d+$/)
    }),
    integrity: z.object({
        hash: z.string()
    })
});

export type QuizDefinition = z.infer<typeof quizDefinitionSchema>;
export type QuestionStep = z.infer<typeof questionStepSchema>;
export type StrategicStep = z.infer<typeof strategicStepSchema>;
export type OfferStep = z.infer<typeof offerStepSchema>;

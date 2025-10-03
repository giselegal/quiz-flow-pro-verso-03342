import { z } from 'zod';

// ================== ZOD SCHEMAS (Step / OfferMap / Export) ==================
const OfferContentSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    buttonText: z.string().optional(),
    testimonial: z.object({
        quote: z.string().optional(),
        author: z.string().optional()
    }).optional(),
    ctaLabel: z.string().optional(),
    ctaUrl: z.string().url().optional().or(z.literal('')).optional(),
    image: z.string().optional()
});

const BaseStepSchema = z.object({
    id: z.string(),
    nextStep: z.string().optional()
});

const IntroStepSchema = BaseStepSchema.extend({
    type: z.literal('intro'),
    title: z.string().optional(),
    formQuestion: z.string().optional(),
    placeholder: z.string().optional(),
    buttonText: z.string().optional(),
    image: z.string().optional()
});

const QuestionStepSchema = BaseStepSchema.extend({
    type: z.literal('question'),
    questionNumber: z.string().optional(),
    questionText: z.string().optional(),
    requiredSelections: z.number().int().min(1).optional(),
    options: z.array(z.object({
        id: z.string(),
        text: z.string(),
        image: z.string().optional()
    })).default([])
});

const StrategicQuestionStepSchema = BaseStepSchema.extend({
    type: z.literal('strategic-question'),
    questionText: z.string().optional(),
    options: z.array(z.object({
        id: z.string(),
        text: z.string()
    })).default([])
});

const TransitionStepSchema = BaseStepSchema.extend({
    type: z.literal('transition'),
    title: z.string().optional(),
    text: z.string().optional()
});

const TransitionResultStepSchema = BaseStepSchema.extend({
    type: z.literal('transition-result'),
    title: z.string().optional()
});

const ResultStepSchema = BaseStepSchema.extend({
    type: z.literal('result'),
    title: z.string().optional()
});

const OfferStepSchema = BaseStepSchema.extend({
    type: z.literal('offer'),
    offerMap: z.record(OfferContentSchema).default({}),
    image: z.string().optional()
});

export const AnyStepSchema = z.discriminatedUnion('type', [
    IntroStepSchema,
    QuestionStepSchema,
    StrategicQuestionStepSchema,
    TransitionStepSchema,
    TransitionResultStepSchema,
    ResultStepSchema,
    OfferStepSchema
]);

export const StepsArraySchema = z.array(AnyStepSchema).min(1);

// Schema de export com metadados de blocos para futura migração
const BlockExportMetaSchema = z.object({ 
    id: z.string(), 
    version: z.number().int() 
});

export const ExportSchema = z.object({
    version: z.number().int().default(1),
    exportedAt: z.string().optional(),
    blockRegistry: z.array(BlockExportMetaSchema).default([]),
    steps: StepsArraySchema
});

export type ParsedStep = z.infer<typeof AnyStepSchema>;
export type ExportData = z.infer<typeof ExportSchema>;
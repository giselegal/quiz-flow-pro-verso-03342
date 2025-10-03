/**
 * 🎯 SCHEMAS UNIFICADOS - TypeScript & Zod
 * 
 * Definições completas de tipos e validação runtime para todo o sistema de funis.
 * Consolida todas as interfaces dispersas em um esquema centralizado e validado.
 */

import { z } from 'zod';
import { FunnelContext } from '@/core/contexts/FunnelContext';

// ============================================================================
// QUIZ STEPS SCHEMAS
// ============================================================================

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

const QuizOptionSchema = z.object({
    id: z.string(),
    text: z.string(),
    image: z.string().optional()
});

const BaseQuizStepSchema = z.object({
    id: z.string().optional(),
    nextStep: z.string().optional()
});

const IntroStepSchema = BaseQuizStepSchema.extend({
    type: z.literal('intro'),
    title: z.string().optional(),
    formQuestion: z.string().optional(),
    placeholder: z.string().optional(),
    buttonText: z.string().optional(),
    image: z.string().optional()
});

const QuestionStepSchema = BaseQuizStepSchema.extend({
    type: z.literal('question'),
    questionNumber: z.string().optional(),
    questionText: z.string().optional(),
    requiredSelections: z.number().int().min(1).optional(),
    options: z.array(QuizOptionSchema).default([])
});

const StrategicQuestionStepSchema = BaseQuizStepSchema.extend({
    type: z.literal('strategic-question'),
    questionText: z.string().optional(),
    options: z.array(QuizOptionSchema).default([])
});

const TransitionStepSchema = BaseQuizStepSchema.extend({
    type: z.literal('transition'),
    title: z.string().optional(),
    text: z.string().optional()
});

const TransitionResultStepSchema = BaseQuizStepSchema.extend({
    type: z.literal('transition-result'),
    title: z.string().optional()
});

const ResultStepSchema = BaseQuizStepSchema.extend({
    type: z.literal('result'),
    title: z.string().optional()
});

const OfferStepSchema = BaseQuizStepSchema.extend({
    type: z.literal('offer'),
    offerMap: z.record(OfferContentSchema).default({}),
    image: z.string().optional()
});

export const QuizStepSchema = z.discriminatedUnion('type', [
    IntroStepSchema,
    QuestionStepSchema,
    StrategicQuestionStepSchema,
    TransitionStepSchema,
    TransitionResultStepSchema,
    ResultStepSchema,
    OfferStepSchema
]);

export const QuizStepsArraySchema = z.array(QuizStepSchema);

// ============================================================================
// FUNNEL CONTEXT SCHEMA
// ============================================================================

export const FunnelContextSchema = z.nativeEnum(FunnelContext);

// ============================================================================
// FUNNEL SETTINGS & PAGES SCHEMAS
// ============================================================================

// Schema flexível para settings - pode conter qualquer configuração específica do funil
export const FunnelSettingsSchema = z.record(z.any()).default({});

// Schema flexível para páginas - estrutura genérica para diferentes tipos de funil
const BaseFunnelPageSchema = z.object({
    id: z.string(),
    page_type: z.string().optional(), // Compatibilidade com banco
    type: z.string().optional(), // Compatibilidade com editor
    title: z.string().optional(),
    page_order: z.number().int().min(0).optional(), // Compatibilidade com banco
    order: z.number().int().min(0).optional(), // Compatibilidade com editor
    isPublished: z.boolean().optional(),
    metadata: z.any().optional(), // Banco pode retornar Json type
    funnel_id: z.string().optional(), // Compatibilidade com banco
    created_at: z.string().optional(), // Compatibilidade com banco
    updated_at: z.string().optional(), // Compatibilidade com banco
    blocks: z.any().optional() // Compatibilidade com banco
});

export const FunnelPageSchema = BaseFunnelPageSchema.extend({
    content: z.record(z.any()).optional()
});

export const FunnelPagesArraySchema = z.array(FunnelPageSchema);

// ============================================================================
// UNIFIED FUNNEL DATA SCHEMA
// ============================================================================

export const UnifiedFunnelDataSchema = z.object({
    // Identificação
    id: z.string(),
    name: z.string().min(1, 'Nome do funil é obrigatório'),
    description: z.string().optional(),
    category: z.string().optional(),

    // Contexto e permissões
    context: FunnelContextSchema,
    userId: z.string(),

    // Dados estruturais
    settings: FunnelSettingsSchema,
    pages: FunnelPagesArraySchema,

    // Dados específicos de quiz (opcional para funis não-quiz)
    quizSteps: QuizStepsArraySchema.optional(),

    // Metadados de publicação
    isPublished: z.boolean().default(false),
    version: z.number().int().min(1).default(1),

    // Timestamps - permitir tanto string ISO quanto Date objects
    createdAt: z.union([z.string().datetime(), z.date()]).transform(val =>
        typeof val === 'string' ? new Date(val) : val
    ),
    updatedAt: z.union([z.string().datetime(), z.date()]).transform(val =>
        typeof val === 'string' ? new Date(val) : val
    ),

    // Informações de template
    templateId: z.string().optional(),
    isFromTemplate: z.boolean().default(false)
});

// ============================================================================
// OPERATION SCHEMAS
// ============================================================================

export const CreateFunnelOptionsSchema = z.object({
    name: z.string().min(1, 'Nome é obrigatório'),
    description: z.string().optional(),
    category: z.string().optional(),
    context: FunnelContextSchema,
    templateId: z.string().optional(),
    userId: z.string().optional(),
    autoPublish: z.boolean().optional()
});

export const UpdateFunnelOptionsSchema = z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    category: z.string().optional(),
    settings: FunnelSettingsSchema.optional(),
    pages: FunnelPagesArraySchema.optional(),
    quizSteps: QuizStepsArraySchema.optional(),
    isPublished: z.boolean().optional()
});

export const ListFunnelOptionsSchema = z.object({
    context: FunnelContextSchema.optional(),
    userId: z.string().optional(),
    includeUnpublished: z.boolean().optional(),
    category: z.string().optional(),
    limit: z.number().int().min(1).max(100).optional(),
    offset: z.number().int().min(0).optional()
}).default({});

export const FunnelPermissionsSchema = z.object({
    canRead: z.boolean(),
    canEdit: z.boolean(),
    canDelete: z.boolean(),
    canPublish: z.boolean(),
    isOwner: z.boolean()
});

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type QuizStep = z.infer<typeof QuizStepSchema>;
export type QuizOption = z.infer<typeof QuizOptionSchema>;
export type OfferContent = z.infer<typeof OfferContentSchema>;

export type FunnelPage = z.infer<typeof FunnelPageSchema>;
export type FunnelSettings = z.infer<typeof FunnelSettingsSchema>;

export type UnifiedFunnelData = z.infer<typeof UnifiedFunnelDataSchema>;
export type CreateFunnelOptions = z.infer<typeof CreateFunnelOptionsSchema>;
export type UpdateFunnelOptions = z.infer<typeof UpdateFunnelOptionsSchema>;
export type ListFunnelOptions = z.infer<typeof ListFunnelOptionsSchema>;
export type FunnelPermissions = z.infer<typeof FunnelPermissionsSchema>;

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

/**
 * Valida se um objeto é um UnifiedFunnelData válido
 */
export function validateUnifiedFunnelData(data: unknown): UnifiedFunnelData {
    return UnifiedFunnelDataSchema.parse(data);
}

/**
 * Valida de forma segura, retornando resultado ou erro
 */
export function safeValidateUnifiedFunnelData(data: unknown): {
    success: true;
    data: UnifiedFunnelData;
} | {
    success: false;
    error: z.ZodError;
} {
    const result = UnifiedFunnelDataSchema.safeParse(data);
    if (result.success) {
        return { success: true, data: result.data };
    }
    return { success: false, error: result.error };
}

/**
 * Valida array de quiz steps
 */
export function validateQuizSteps(steps: unknown): QuizStep[] {
    return QuizStepsArraySchema.parse(steps);
}

/**
 * Valida opções de criação de funil
 */
export function validateCreateFunnelOptions(options: unknown): CreateFunnelOptions {
    return CreateFunnelOptionsSchema.parse(options);
}

/**
 * Valida opções de atualização de funil
 */
export function validateUpdateFunnelOptions(options: unknown): UpdateFunnelOptions {
    return UpdateFunnelOptionsSchema.parse(options);
}

/**
 * Normaliza páginas do formato do banco para o formato do editor
 */
export function normalizePages(pages: any[]): FunnelPage[] {
    return pages.map(page => ({
        id: page.id,
        type: page.type || page.page_type || 'generic',
        title: page.title || '',
        order: page.order !== undefined ? page.order : (page.page_order || 0),
        isPublished: page.isPublished !== undefined ? page.isPublished : true,
        metadata: typeof page.metadata === 'object' ? page.metadata : {},
        content: page.content || page.blocks || {}
    }));
}

/**
 * Normaliza dados do banco para UnifiedFunnelData
 */
export function normalizeUnifiedFunnelData(data: any): UnifiedFunnelData {
    // Normalizar páginas se necessário
    const normalizedPages = Array.isArray(data.pages) ? normalizePages(data.pages) : [];

    return {
        ...data,
        pages: normalizedPages,
        settings: data.settings || {},
        isPublished: data.isPublished !== undefined ? data.isPublished : false,
        version: data.version || 1,
        createdAt: typeof data.createdAt === 'string' ? new Date(data.createdAt) : (data.createdAt || new Date()),
        updatedAt: typeof data.updatedAt === 'string' ? new Date(data.updatedAt) : (data.updatedAt || new Date()),
        isFromTemplate: data.isFromTemplate !== undefined ? data.isFromTemplate : false
    };
}
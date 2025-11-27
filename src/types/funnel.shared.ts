/**
 * 🔄 FUNNEL SHARED TYPES
 * 
 * Tipos compartilhados entre servidor e cliente para garantir consistência.
 * Usa Zod para validação runtime nos dois lados.
 * 
 * RESPONSABILIDADES:
 * - DTOs de Funnel consistentes
 * - Validação Zod compartilhada
 * - Enums e constantes comuns
 * - Tipos de Step compartilhados
 * 
 * BENEFÍCIOS:
 * - Uma única fonte da verdade para tipos
 * - Validação consistente servidor/cliente
 * - Menos bugs de dessincronização
 * - TypeScript safety em ambos os lados
 * 
 * @version 1.0.0
 */

import { z } from 'zod';

// ============================================================================
// ENUMS E CONSTANTES
// ============================================================================

/**
 * Status possíveis de um funil
 */
export const FunnelStatus = {
    NEW: 'new',
    DRAFT: 'draft',
    PUBLISHED: 'published',
    ARCHIVED: 'archived',
} as const;

export type FunnelStatusType = typeof FunnelStatus[keyof typeof FunnelStatus];

/**
 * Tipos de template disponíveis
 */
export const TemplateType = {
    QUIZ_21_STEPS: 'quiz21StepsComplete',
    QUIZ_SIMPLE: 'quizSimple',
    LEAD_GEN: 'leadGeneration',
    SALES_PAGE: 'salesPage',
    CUSTOM: 'custom',
} as const;

export type TemplateTypeEnum = typeof TemplateType[keyof typeof TemplateType];

// ============================================================================
// ZOD SCHEMAS
// ============================================================================

/**
 * Schema Zod para validação de Funnel
 */
export const FunnelSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1).max(255),
    slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/),
    description: z.string().optional(),
    status: z.enum(['new', 'draft', 'published', 'archived']),
    version: z.number().int().positive().default(1),
    templateId: z.string().optional(),
    templateType: z.string().optional(),
    
    // Metadata
    createdAt: z.string().datetime().or(z.date()),
    updatedAt: z.string().datetime().or(z.date()),
    publishedAt: z.string().datetime().or(z.date()).nullable().optional(),
    
    // Owner
    userId: z.string().uuid().optional(),
    
    // Configuration
    settings: z.record(z.any()).optional(),
    
    // Analytics
    views: z.number().int().nonnegative().default(0),
    conversions: z.number().int().nonnegative().default(0),
    
    // Steps (podem ser carregados lazy)
    totalSteps: z.number().int().positive().default(21),
});

/**
 * Schema para Step individual
 */
export const FunnelStepSchema = z.object({
    id: z.string(),
    stepNumber: z.number().int().positive(),
    name: z.string(),
    type: z.enum(['intro', 'question', 'transition', 'result', 'offer']),
    
    // Blocks do step (pode ser array vazio)
    blocks: z.array(z.any()).default([]),
    
    // Metadata
    order: z.number().int().nonnegative(),
    isActive: z.boolean().default(true),
    
    // Validation
    isValid: z.boolean().optional(),
    validationErrors: z.array(z.string()).optional(),
});

/**
 * Schema para Funnel completo com steps
 */
export const FunnelWithStepsSchema = FunnelSchema.extend({
    steps: z.array(FunnelStepSchema),
});

/**
 * Schema para criação de Funnel (sem ID)
 */
export const CreateFunnelSchema = FunnelSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    publishedAt: true,
}).partial({
    status: true,
    version: true,
    views: true,
    conversions: true,
    totalSteps: true,
});

/**
 * Schema para atualização de Funnel (campos opcionais)
 */
export const UpdateFunnelSchema = FunnelSchema.partial().required({
    id: true,
});

// ============================================================================
// TYPESCRIPT TYPES (inferidos do Zod)
// ============================================================================

/**
 * Tipo TypeScript para Funnel (inferido do schema Zod)
 */
export type Funnel = z.infer<typeof FunnelSchema>;

/**
 * Tipo TypeScript para Step
 */
export type FunnelStep = z.infer<typeof FunnelStepSchema>;

/**
 * Tipo TypeScript para Funnel com Steps
 */
export type FunnelWithSteps = z.infer<typeof FunnelWithStepsSchema>;

/**
 * Tipo TypeScript para criação de Funnel
 */
export type CreateFunnelDto = z.infer<typeof CreateFunnelSchema>;

/**
 * Tipo TypeScript para atualização de Funnel
 */
export type UpdateFunnelDto = z.infer<typeof UpdateFunnelSchema>;

// ============================================================================
// INTERFACES LEGADAS (para compatibilidade retroativa)
// ============================================================================

/**
 * Interface legada do cliente
 * @deprecated Use Funnel do Zod schema
 */
export interface LegacyFunnelDto {
    id: string | null;
    name: string;
    status: FunnelStatusType;
    steps: FunnelStep[];
    version?: number;
    templateId?: string;
    createdAt?: string;
    updatedAt?: string;
}

/**
 * Interface legada do servidor
 * @deprecated Use Funnel do Zod schema
 */
export interface LegacyServerFunnel {
    id: string;
    steps: any[];
    published: boolean;
    version: number;
    name?: string;
    description?: string;
}

// ============================================================================
// FUNÇÕES DE CONVERSÃO
// ============================================================================

/**
 * Converte Funnel do servidor para formato cliente
 */
export function serverToClientFunnel(serverFunnel: any): Funnel {
    return FunnelSchema.parse({
        id: serverFunnel.id,
        name: serverFunnel.name || 'Sem nome',
        slug: serverFunnel.slug || serverFunnel.id,
        description: serverFunnel.description,
        status: serverFunnel.published ? 'published' : serverFunnel.status || 'draft',
        version: serverFunnel.version || 1,
        templateId: serverFunnel.template_id,
        templateType: serverFunnel.template_type,
        createdAt: serverFunnel.created_at || new Date().toISOString(),
        updatedAt: serverFunnel.updated_at || new Date().toISOString(),
        publishedAt: serverFunnel.published_at || null,
        userId: serverFunnel.user_id,
        settings: serverFunnel.settings || {},
        views: serverFunnel.views || 0,
        conversions: serverFunnel.conversions || 0,
        totalSteps: serverFunnel.total_steps || 21,
    });
}

/**
 * Converte Funnel do cliente para formato servidor
 */
export function clientToServerFunnel(clientFunnel: Funnel): Record<string, any> {
    return {
        id: clientFunnel.id,
        name: clientFunnel.name,
        slug: clientFunnel.slug,
        description: clientFunnel.description,
        status: clientFunnel.status,
        published: clientFunnel.status === 'published',
        version: clientFunnel.version,
        template_id: clientFunnel.templateId,
        template_type: clientFunnel.templateType,
        created_at: clientFunnel.createdAt,
        updated_at: clientFunnel.updatedAt,
        published_at: clientFunnel.publishedAt,
        user_id: clientFunnel.userId,
        settings: clientFunnel.settings,
        views: clientFunnel.views,
        conversions: clientFunnel.conversions,
        total_steps: clientFunnel.totalSteps,
    };
}

/**
 * Valida se um objeto é um Funnel válido
 */
export function isFunnel(obj: unknown): obj is Funnel {
    try {
        FunnelSchema.parse(obj);
        return true;
    } catch {
        return false;
    }
}

/**
 * Valida se um objeto é um FunnelStep válido
 */
export function isFunnelStep(obj: unknown): obj is FunnelStep {
    try {
        FunnelStepSchema.parse(obj);
        return true;
    } catch {
        return false;
    }
}

// ============================================================================
// VALIDAÇÃO HELPERS
// ============================================================================

/**
 * Valida e retorna Funnel ou lança erro
 */
export function validateFunnel(data: unknown): Funnel {
    return FunnelSchema.parse(data);
}

/**
 * Valida e retorna Funnel ou null se inválido
 */
export function safeParseFunnel(data: unknown): Funnel | null {
    const result = FunnelSchema.safeParse(data);
    return result.success ? result.data : null;
}

/**
 * Valida array de Steps
 */
export function validateSteps(data: unknown[]): FunnelStep[] {
    return z.array(FunnelStepSchema).parse(data);
}

/**
 * Valida e retorna Steps ou array vazio se inválido
 */
export function safeParseSteps(data: unknown[]): FunnelStep[] {
    const result = z.array(FunnelStepSchema).safeParse(data);
    return result.success ? result.data : [];
}

// ============================================================================
// CONSTANTES DE VALIDAÇÃO
// ============================================================================

export const FUNNEL_CONSTRAINTS = {
    NAME_MIN_LENGTH: 1,
    NAME_MAX_LENGTH: 255,
    SLUG_MIN_LENGTH: 1,
    SLUG_MAX_LENGTH: 255,
    SLUG_PATTERN: /^[a-z0-9-]+$/,
    MIN_STEPS: 1,
    MAX_STEPS: 50,
    DEFAULT_STEPS: 21,
} as const;

export const VALIDATION_MESSAGES = {
    INVALID_FUNNEL_ID: 'ID do funil inválido',
    INVALID_NAME: 'Nome do funil inválido',
    INVALID_SLUG: 'Slug deve conter apenas letras minúsculas, números e hífens',
    INVALID_STATUS: 'Status inválido',
    MISSING_REQUIRED_FIELDS: 'Campos obrigatórios faltando',
} as const;

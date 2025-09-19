/**
 * 🔄 NOMENCLATURA UNIFICADA - SISTEMA PADRONIZADO
 * 
 * Define interfaces e types para padronizar nomenclatura em todo o sistema:
 * - stageId vs stepNumber -> stepNumber (consistente)
 * - funnel vs funnelId -> funnelId (consistente)  
 * - instance_key vs instanceKey -> instanceKey (camelCase)
 * - snake_case vs camelCase -> camelCase (frontend), snake_case (database)
 */

import { validateFunnelId, validateStepNumber, validateInstanceKey } from './idValidation';

// ============================================================================
// TIPOS UNIFICADOS
// ============================================================================

/**
 * Interface para identificadores padronizados
 */
export interface StandardIdentifiers {
    // Primary identifiers
    funnelId: string;          // ✅ Sempre funnelId (não funnel)
    stepNumber: number;        // ✅ Sempre stepNumber (não stageId)
    instanceKey: string;       // ✅ Sempre instanceKey (camelCase)

    // Display identifiers
    displayName?: string;      // Para UI
    internalKey?: string;      // Para processamento interno
}

/**
 * Interface para propriedades de database (snake_case)
 */
export interface DatabaseIdentifiers {
    funnel_id: string;         // Database format
    step_number: number;       // Database format  
    instance_key: string;      // Database format
}

/**
 * Interface para propriedades de frontend (camelCase)
 */
export interface FrontendIdentifiers {
    funnelId: string;          // Frontend format
    stepNumber: number;        // Frontend format
    instanceKey: string;       // Frontend format
}

// ============================================================================
// MAPEAMENTOS DE CONVERSÃO
// ============================================================================

/**
 * Mapeia propriedades legacy para novos nomes
 */
export const LEGACY_PROPERTY_MAP = {
    // Funnel identifiers
    'funnel': 'funnelId',
    'funnel_id': 'funnelId',
    'FUNNEL_ID': 'funnelId',

    // Step identifiers  
    'stageId': 'stepNumber',
    'stage_id': 'stepNumber',
    'step': 'stepNumber',
    'step_id': 'stepNumber',

    // Instance identifiers
    'instance_key': 'instanceKey',
    'INSTANCE_KEY': 'instanceKey',
    'instanceId': 'instanceKey',
    'instance_id': 'instanceKey'
} as const;

/**
 * Mapeia formatos database para frontend
 */
export const DB_TO_FRONTEND_MAP = {
    'funnel_id': 'funnelId',
    'step_number': 'stepNumber',
    'instance_key': 'instanceKey',
    'created_at': 'createdAt',
    'updated_at': 'updatedAt',
    'is_active': 'isActive',
    'is_published': 'isPublished',
    'is_template': 'isTemplate',
    'order_index': 'orderIndex',
    'page_order': 'pageOrder',
    'component_type_key': 'componentTypeKey'
} as const;

/**
 * Mapeia formatos frontend para database
 */
export const FRONTEND_TO_DB_MAP = Object.fromEntries(
    Object.entries(DB_TO_FRONTEND_MAP).map(([db, frontend]) => [frontend, db])
) as Record<string, string>;

// ============================================================================
// FUNÇÕES DE NORMALIZAÇÃO
// ============================================================================

/**
 * Normaliza propriedades legacy para nomes padrão
 */
export const normalizeLegacyProperties = (obj: Record<string, any>): Record<string, any> => {
    const normalized: Record<string, any> = {};

    for (const [key, value] of Object.entries(obj)) {
        const normalizedKey = LEGACY_PROPERTY_MAP[key as keyof typeof LEGACY_PROPERTY_MAP] || key;
        normalized[normalizedKey] = value;
    }

    return normalized;
};

/**
 * Converte propriedades de database para frontend
 */
export const dbToFrontend = <T extends Record<string, any>>(dbObj: T): Record<string, any> => {
    const frontendObj: Record<string, any> = {};

    for (const [key, value] of Object.entries(dbObj)) {
        const frontendKey = DB_TO_FRONTEND_MAP[key as keyof typeof DB_TO_FRONTEND_MAP] || key;
        frontendObj[frontendKey] = value;
    }

    return frontendObj;
};

/**
 * Converte propriedades de frontend para database
 */
export const frontendToDb = <T extends Record<string, any>>(frontendObj: T): Record<string, any> => {
    const dbObj: Record<string, any> = {};

    for (const [key, value] of Object.entries(frontendObj)) {
        const dbKey = FRONTEND_TO_DB_MAP[key] || key;
        dbObj[dbKey] = value;
    }

    return dbObj;
};

/**
 * Normaliza identificadores para formato padrão
 */
export const normalizeIdentifiers = (input: any): StandardIdentifiers => {
    // Extrair identificadores de várias fontes possíveis
    const rawFunnelId = input.funnelId || input.funnel_id || input.funnel || input.FUNNEL_ID;
    const rawStepNumber = input.stepNumber || input.step_number || input.stageId || input.stage_id || input.step;
    const rawInstanceKey = input.instanceKey || input.instance_key || input.instanceId || input.instance_id;

    // Validar e normalizar
    const funnelValidation = validateFunnelId(rawFunnelId);
    const stepValidation = validateStepNumber(rawStepNumber);
    const instanceValidation = rawInstanceKey ? validateInstanceKey(rawInstanceKey) : null;

    return {
        funnelId: funnelValidation.isValid ? funnelValidation.normalized! : 'quiz21StepsComplete',
        stepNumber: stepValidation.isValid ? parseInt(stepValidation.normalized!) : 1,
        instanceKey: instanceValidation?.isValid ? instanceValidation.normalized! : '',
        displayName: input.displayName || input.name || `Step ${stepValidation.normalized || 1}`,
        internalKey: input.internalKey || input.id
    };
};

// ============================================================================
// UTILITÁRIOS DE COMPATIBILIDADE
// ============================================================================

/**
 * Cria adapter para manter compatibilidade com código legacy
 */
export const createLegacyAdapter = <T extends Record<string, any>>(
    modernObject: T
): T & Record<string, any> => {
    const adapter = { ...modernObject };

    // Adicionar propriedades legacy para compatibilidade
    if (modernObject.funnelId) {
        (adapter as any).funnel = modernObject.funnelId;
        (adapter as any).funnel_id = modernObject.funnelId;
    }

    if (modernObject.stepNumber) {
        (adapter as any).stageId = `step-${modernObject.stepNumber}`;
        (adapter as any).stage_id = `step-${modernObject.stepNumber}`;
        (adapter as any).step = modernObject.stepNumber;
    }

    if (modernObject.instanceKey) {
        (adapter as any).instance_key = modernObject.instanceKey;
    }

    return adapter;
};

/**
 * Migra objeto legacy para nova nomenclatura
 */
export const migrateLegacyObject = <T extends Record<string, any>>(
    legacyObject: T
): StandardIdentifiers & Omit<T, keyof typeof LEGACY_PROPERTY_MAP> => {
    const normalized = normalizeLegacyProperties(legacyObject);
    const identifiers = normalizeIdentifiers(normalized);

    // Remove propriedades legacy
    const migrated = { ...legacyObject };
    for (const legacyKey of Object.keys(LEGACY_PROPERTY_MAP)) {
        delete migrated[legacyKey];
    }

    return {
        ...migrated,
        ...identifiers
    };
};

// ============================================================================
// VALIDADORES DE NOMENCLATURA
// ============================================================================

/**
 * Verifica se um objeto usa nomenclatura consistente
 */
export const validateNamingConsistency = (obj: Record<string, any>): {
    isConsistent: boolean;
    issues: string[];
    suggestions: string[];
} => {
    const issues: string[] = [];
    const suggestions: string[] = [];

    // Verificar se há mistura de formatos
    const hasCamelCase = Object.keys(obj).some(key => /[A-Z]/.test(key));
    const hasSnakeCase = Object.keys(obj).some(key => /_/.test(key));

    if (hasCamelCase && hasSnakeCase) {
        issues.push('Mixing camelCase and snake_case properties');
        suggestions.push('Use consistent naming convention (camelCase for frontend, snake_case for database)');
    }

    // Verificar propriedades legacy
    const legacyProps = Object.keys(obj).filter(key => key in LEGACY_PROPERTY_MAP);
    if (legacyProps.length > 0) {
        issues.push(`Using legacy property names: ${legacyProps.join(', ')}`);
        legacyProps.forEach(prop => {
            const modern = LEGACY_PROPERTY_MAP[prop as keyof typeof LEGACY_PROPERTY_MAP];
            suggestions.push(`Replace '${prop}' with '${modern}'`);
        });
    }

    return {
        isConsistent: issues.length === 0,
        issues,
        suggestions
    };
};

/**
 * Converte batch de objetos para nomenclatura consistente
 */
export const normalizeBatch = <T extends Record<string, any>>(
    objects: T[],
    targetFormat: 'frontend' | 'database' = 'frontend'
): Record<string, any>[] => {
    return objects.map(obj => {
        const normalized = normalizeLegacyProperties(obj);
        return targetFormat === 'database' ? frontendToDb(normalized) : normalized;
    });
};
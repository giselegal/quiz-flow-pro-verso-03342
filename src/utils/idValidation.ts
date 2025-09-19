/**
 * 🔒 SISTEMA UNIFICADO DE VALIDAÇÃO DE IDs
 * 
 * Centraliza todas as validações de identificadores do sistema:
 * - UUIDs v4 para primary keys
 * - Foreign keys com validação
 * - Display keys para interface
 * - Instance keys únicos
 */

// ============================================================================
// TIPOS E INTERFACES
// ============================================================================

export interface IdValidationResult {
    isValid: boolean;
    error?: string;
    normalized?: string;
}

export interface IdGenerationOptions {
    prefix?: string;
    includeTimestamp?: boolean;
    customFormat?: 'uuid' | 'shortId' | 'displayKey';
}

// ============================================================================
// VALIDADORES DE ID
// ============================================================================

/**
 * Valida se um ID é um UUID v4 válido
 */
export const validateUUID = (id: string): IdValidationResult => {
    if (!id || typeof id !== 'string') {
        return { isValid: false, error: 'ID deve ser uma string não vazia' };
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(id)) {
        return { isValid: false, error: 'ID deve ser um UUID v4 válido' };
    }

    return { isValid: true, normalized: id.toLowerCase() };
};

/**
 * Valida funnel ID (pode ser UUID ou string especial)
 */
export const validateFunnelId = (funnelId: string): IdValidationResult => {
    if (!funnelId || typeof funnelId !== 'string') {
        return { isValid: false, error: 'Funnel ID deve ser uma string não vazia' };
    }

    // IDs especiais permitidos
    const specialIds = ['default-funnel', 'quiz21StepsComplete', 'template-funnel'];
    if (specialIds.includes(funnelId)) {
        return { isValid: true, normalized: funnelId };
    }

    // Formato legado step-based
    if (/^[a-z0-9-]+$/.test(funnelId) && funnelId.length >= 3) {
        return { isValid: true, normalized: funnelId.toLowerCase() };
    }

    // UUID válido
    return validateUUID(funnelId);
};

/**
 * Valida step number (1-based integer)
 */
export const validateStepNumber = (stepNumber: number | string): IdValidationResult => {
    const num = typeof stepNumber === 'string' ? parseInt(stepNumber, 10) : stepNumber;

    if (isNaN(num) || !Number.isInteger(num) || num < 1 || num > 1000) {
        return {
            isValid: false,
            error: 'Step number deve ser um inteiro entre 1 e 1000'
        };
    }

    return { isValid: true, normalized: num.toString() };
};

/**
 * Valida instance key (formato específico)
 */
export const validateInstanceKey = (instanceKey: string): IdValidationResult => {
    if (!instanceKey || typeof instanceKey !== 'string') {
        return { isValid: false, error: 'Instance key deve ser uma string não vazia' };
    }

    // Formato: component-type_step-number_unique-id
    const instanceRegex = /^[a-z0-9-]+_\d+_[a-z0-9-]+$/i;

    if (!instanceRegex.test(instanceKey)) {
        return {
            isValid: false,
            error: 'Instance key deve seguir o formato: component-type_step-number_unique-id'
        };
    }

    return { isValid: true, normalized: instanceKey.toLowerCase() };
};

// ============================================================================
// GERADORES DE ID
// ============================================================================

/**
 * Gera UUID v4 seguro
 */
export const generateSecureId = (): string => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }

    // Fallback para ambientes sem crypto.randomUUID
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

/**
 * Gera funnel ID único
 */
export const generateFunnelId = (options: IdGenerationOptions = {}): string => {
    const { prefix = 'funnel', includeTimestamp = false, customFormat = 'uuid' } = options;

    switch (customFormat) {
        case 'uuid':
            return generateSecureId();

        case 'shortId':
            const shortId = Math.random().toString(36).substr(2, 9);
            return includeTimestamp
                ? `${prefix}-${shortId}-${Date.now().toString(36)}`
                : `${prefix}-${shortId}`;

        case 'displayKey':
            return `${prefix}-${Math.random().toString(36).substr(2, 6)}`;

        default:
            return generateSecureId();
    }
};

/**
 * Gera instance key único
 */
export const generateInstanceKey = (
    componentType: string,
    stepNumber: number,
    uniqueId?: string
): string => {
    const normalizedType = componentType.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const normalizedStep = Math.max(1, Math.floor(stepNumber));
    const id = uniqueId || Math.random().toString(36).substr(2, 8);

    return `${normalizedType}_${normalizedStep}_${id}`;
};

// ============================================================================
// UTILITÁRIOS DE PARSING
// ============================================================================

/**
 * Extrai step number de diversos formatos de ID
 */
export const parseStepNumber = (input: string | number | null | undefined): number => {
    if (typeof input === 'number') {
        return Math.max(1, Math.floor(input));
    }

    if (!input || typeof input !== 'string') {
        return 1;
    }

    // Formato step-X
    const stepMatch = input.match(/step-(\d+)/i);
    if (stepMatch) {
        return Math.max(1, parseInt(stepMatch[1], 10));
    }

    // Formato instance key: component_step_id
    const instanceMatch = input.match(/_(\d+)_/);
    if (instanceMatch) {
        return Math.max(1, parseInt(instanceMatch[1], 10));
    }

    // Número direto
    const directNumber = parseInt(input, 10);
    if (!isNaN(directNumber) && directNumber > 0) {
        return Math.max(1, directNumber);
    }

    return 1;
};

/**
 * Normaliza stage ID para formato consistente
 */
export const normalizeStageId = (stageId: string | null | undefined): string => {
    const stepNumber = parseStepNumber(stageId);
    return `step-${stepNumber}`;
};

/**
 * Extrai componente type de instance key
 */
export const parseComponentType = (instanceKey: string): string => {
    if (!instanceKey || typeof instanceKey !== 'string') {
        return 'unknown';
    }

    const parts = instanceKey.split('_');
    return parts[0] || 'unknown';
};

// ============================================================================
// VALIDAÇÃO BATCH
// ============================================================================

/**
 * Valida múltiplos IDs de uma vez
 */
export const validateIdBatch = (ids: Record<string, string>): Record<string, IdValidationResult> => {
    const results: Record<string, IdValidationResult> = {};

    for (const [key, value] of Object.entries(ids)) {
        if (key.includes('funnel')) {
            results[key] = validateFunnelId(value);
        } else if (key.includes('step') || key.includes('stage')) {
            results[key] = validateStepNumber(value);
        } else if (key.includes('instance')) {
            results[key] = validateInstanceKey(value);
        } else {
            results[key] = validateUUID(value);
        }
    }

    return results;
};

/**
 * Verifica se todos os IDs de um objeto são válidos
 */
export const validateAllIds = (ids: Record<string, string>): boolean => {
    const results = validateIdBatch(ids);
    return Object.values(results).every(result => result.isValid);
};
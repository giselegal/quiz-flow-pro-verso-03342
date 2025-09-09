/**
 * 🎯 SISTEMA DE CONTEXTOS PARA ISOLAMENTO DE FUNIS
 * 
 * Define contextos únicos para evitar vazamento de dados entre:
 * - Editor de funis
 * - Templates/Modelos  
 * - Meus Funis
 * - Preview/Visualização
 */

/**
 * Enum de contextos de funil para isolamento completo
 */
export enum FunnelContext {
    /** Contexto do editor principal de funis */
    EDITOR = 'editor',

    /** Contexto de templates/modelos predefinidos */
    TEMPLATES = 'templates',

    /** Contexto de funis do usuário (Meus Funis) */
    MY_FUNNELS = 'my-funnels',

    /** Contexto de templates personalizados do usuário (Meus Templates) */
    MY_TEMPLATES = 'my-templates',

    /** Contexto de preview/visualização */
    PREVIEW = 'preview',

    /** Contexto de desenvolvimento/teste */
    DEV = 'dev'
}

/**
 * Interface para services contextuais
 */
export interface ContextualService {
    readonly context: FunnelContext;
}

/**
 * Gera ID único com contexto para evitar colisões
 */
export const generateContextualId = (
    context: FunnelContext,
    baseId?: string
): string => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    const id = baseId || `${timestamp}-${random}`;
    return `${context}-${id}`;
};

/**
 * Extrai contexto de um ID contextual
 */
export const extractContextFromId = (contextualId: string): FunnelContext | null => {
    for (const context of Object.values(FunnelContext)) {
        if (contextualId.startsWith(`${context}-`)) {
            return context;
        }
    }
    return null;
};

/**
 * Remove contexto de um ID para obter ID base
 */
export const extractBaseId = (contextualId: string): string => {
    const context = extractContextFromId(contextualId);
    if (context) {
        return contextualId.replace(`${context}-`, '');
    }
    return contextualId;
};

/**
 * Gera chave de storage contextual
 */
export const generateContextualStorageKey = (
    context: FunnelContext,
    keyType: string,
    identifier?: string
): string => {
    const baseKey = `${context}-${keyType}`;
    return identifier ? `${baseKey}-${identifier}` : baseKey;
};

/**
 * Valida se um ID pertence ao contexto especificado
 */
export const validateContextualId = (
    id: string,
    expectedContext: FunnelContext
): boolean => {
    const actualContext = extractContextFromId(id);
    return actualContext === expectedContext;
};

/**
 * Migra dados entre contextos (útil para reorganização)
 */
export const migrateDataBetweenContexts = (
    fromContext: FunnelContext,
    toContext: FunnelContext,
    dataType: string,
    identifier?: string
): boolean => {
    if (typeof window === 'undefined') return false;

    const fromKey = generateContextualStorageKey(fromContext, dataType, identifier);
    const toKey = generateContextualStorageKey(toContext, dataType, identifier);

    const data = localStorage.getItem(fromKey);
    if (data) {
        localStorage.setItem(toKey, data);
        localStorage.removeItem(fromKey);
        console.log(`🔄 Dados migrados: ${fromKey} → ${toKey}`);
        return true;
    }

    return false;
};

/**
 * Lista todas as chaves de storage para um contexto específico
 */
export const listContextualStorageKeys = (context: FunnelContext): string[] => {
    if (typeof window === 'undefined') return [];

    const contextPrefix = `${context}-`;
    const keys: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(contextPrefix)) {
            keys.push(key);
        }
    }

    return keys;
};

/**
 * Limpa todos os dados de um contexto específico
 */
export const clearContextualData = (context: FunnelContext): number => {
    if (typeof window === 'undefined') return 0;

    const keys = listContextualStorageKeys(context);
    keys.forEach(key => localStorage.removeItem(key));

    console.log(`🗑️ Limpos ${keys.length} itens do contexto ${context}`);
    return keys.length;
};

/**
 * Debug: mostra todos os dados de um contexto
 */
export const debugContextualData = (context: FunnelContext): Record<string, any> => {
    if (typeof window === 'undefined') return {};

    const keys = listContextualStorageKeys(context);
    const data: Record<string, any> = {};

    keys.forEach(key => {
        const value = localStorage.getItem(key);
        if (value) {
            try {
                data[key] = JSON.parse(value);
            } catch {
                data[key] = value;
            }
        }
    });

    return data;
};

/**
 * Obtém estatísticas de uso por contexto
 */
export const getContextualStats = (): Record<FunnelContext, number> => {
    const stats = {} as Record<FunnelContext, number>;

    Object.values(FunnelContext).forEach(context => {
        stats[context] = listContextualStorageKeys(context).length;
    });

    return stats;
};

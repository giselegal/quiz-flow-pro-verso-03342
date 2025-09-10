/**
 * 🔄 DEEP CLONE UNIVERSAL
 * 
 * Utilitário completo para clonagem profunda de funis e templates:
 * - Deep clone total com novas referências
 * - Regeneração automática de IDs únicos
 * - Preservação de relacionamentos
 * - Limpeza de referências antigas
 * - Isolamento completo entre instâncias
 */

import { FunnelTemplate } from '@/config/funnelTemplates';

// ============================================================================
// TYPES E INTERFACES
// ============================================================================

export interface ClonedFunnelInstance {
    id: string;
    templateSourceId: string;
    name: string;
    description?: string;
    blocks: Array<{
        id: string;
        type: string;
        properties: Record<string, any>;
    }>;
    createdAt: string;
}

export interface CloneOptions {
    regenerateIds?: boolean;
    preserveMetadata?: boolean;
    namePrefix?: string;
    nameSuffix?: string;
    customName?: string;
}

export interface CloneResult<T> {
    original: T;
    cloned: T;
    idMapping: Map<string, string>;
    clonedAt: Date;
    success: boolean;
    error?: string;
}

// ============================================================================
// ID GENERATION
// ============================================================================

const generateId = () => `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
const generateUniqueId = (prefix = 'item') => `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// ============================================================================
// DEEP CLONE IMPLEMENTATION
// ============================================================================

/**
 * Deep clone universal que funciona com qualquer objeto
 */
export function deepClone<T>(obj: T): T {
    // Verificações básicas
    if (obj === null || obj === undefined) {
        return obj;
    }

    // Tipos primitivos
    if (typeof obj !== 'object') {
        return obj;
    }

    // Datas
    if (obj instanceof Date) {
        return new Date(obj.getTime()) as unknown as T;
    }

    // Arrays
    if (Array.isArray(obj)) {
        return obj.map(item => deepClone(item)) as unknown as T;
    }

    // Map
    if (obj instanceof Map) {
        const clonedMap = new Map();
        obj.forEach((value, key) => {
            clonedMap.set(deepClone(key), deepClone(value));
        });
        return clonedMap as unknown as T;
    }

    // Set
    if (obj instanceof Set) {
        const clonedSet = new Set();
        obj.forEach(value => {
            clonedSet.add(deepClone(value));
        });
        return clonedSet as unknown as T;
    }

    // Objetos regulares
    if (typeof obj === 'object' && obj.constructor === Object) {
        const cloned = {} as T;
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                (cloned as any)[key] = deepClone((obj as any)[key]);
            }
        }
        return cloned;
    }

    // Classes e outros objetos complexos
    try {
        const cloned = Object.create(Object.getPrototypeOf(obj));
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                cloned[key] = deepClone((obj as any)[key]);
            }
        }
        return cloned as T;
    } catch (error) {
        console.warn('⚠️ Fallback para JSON clone:', error);
        return JSON.parse(JSON.stringify(obj));
    }
}

/**
 * Deep clone com regeneração automática de IDs
 */
export function deepCloneWithNewIds<T extends Record<string, any>>(
    obj: T,
    options: CloneOptions = {}
): CloneResult<T> {
    const startTime = Date.now();
    const idMapping = new Map<string, string>();

    try {
        // Clone inicial
        const cloned = deepClone(obj);

        // Regenerar IDs se solicitado
        if (options.regenerateIds !== false) {
            regenerateObjectIds(cloned, idMapping);
        }

        // Atualizar nome se necessário
        if (cloned && typeof cloned === 'object' && 'name' in cloned) {
            updateClonedName(cloned, options);
        }

        // Limpar metadados se solicitado
        if (!options.preserveMetadata && cloned && typeof cloned === 'object') {
            cleanMetadata(cloned);
        }

        console.log(`✅ Deep clone concluído em ${Date.now() - startTime}ms com ${idMapping.size} IDs regenerados`);

        return {
            original: obj,
            cloned,
            idMapping,
            clonedAt: new Date(),
            success: true
        };

    } catch (error) {
        console.error('❌ Erro no deep clone:', error);
        return {
            original: obj,
            cloned: obj, // Fallback para objeto original
            idMapping,
            clonedAt: new Date(),
            success: false,
            error: error instanceof Error ? error.message : 'Erro desconhecido'
        };
    }
}

/**
 * Regenera todos os IDs em um objeto recursivamente
 */
function regenerateObjectIds(obj: any, idMapping: Map<string, string>): void {
    if (!obj || typeof obj !== 'object') {
        return;
    }

    // Se o objeto tem um ID, regenerar
    if (obj.id && typeof obj.id === 'string') {
        const oldId = obj.id;
        const newId = generateUniqueId(getIdPrefix(oldId));
        obj.id = newId;
        idMapping.set(oldId, newId);
    }

    // Processar arrays
    if (Array.isArray(obj)) {
        obj.forEach(item => regenerateObjectIds(item, idMapping));
        return;
    }

    // Processar propriedades do objeto
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            regenerateObjectIds(obj[key], idMapping);
        }
    }

    // Atualizar referências para IDs antigos
    updateIdReferences(obj, idMapping);
}

/**
 * Atualiza referências para IDs antigos com os novos
 */
function updateIdReferences(obj: any, idMapping: Map<string, string>): void {
    if (!obj || typeof obj !== 'object') {
        return;
    }

    // Lista de propriedades que podem conter referências de ID
    const referenceFields = [
        'funnelId', 'funnel_id', 'parentId', 'parent_id',
        'targetId', 'target_id', 'sourceId', 'source_id',
        'stepId', 'step_id', 'blockId', 'block_id',
        'pageId', 'page_id', 'componentId', 'component_id'
    ];

    if (Array.isArray(obj)) {
        obj.forEach(item => updateIdReferences(item, idMapping));
        return;
    }

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];

            // Atualizar referências de ID
            if (referenceFields.includes(key) && typeof value === 'string' && idMapping.has(value)) {
                obj[key] = idMapping.get(value);
            }

            // Recursão para objetos aninhados
            else if (typeof value === 'object') {
                updateIdReferences(value, idMapping);
            }
        }
    }
}

/**
 * Extrai prefixo de um ID para manter padrão
 */
function getIdPrefix(id: string): string {
    const parts = id.split('_');
    return parts[0] || 'item';
}

/**
 * Atualiza o nome do objeto clonado
 */
function updateClonedName(obj: any, options: CloneOptions): void {
    if (!obj.name) return;

    if (options.customName) {
        obj.name = options.customName;
    } else {
        let newName = obj.name;

        if (options.namePrefix) {
            newName = `${options.namePrefix}${newName}`;
        }

        if (options.nameSuffix) {
            newName = `${newName}${options.nameSuffix}`;
        } else if (!options.customName && !options.namePrefix) {
            newName = `${newName} (Cópia)`;
        }

        obj.name = newName;
    }
}

/**
 * Remove metadados de criação/atualização
 */
function cleanMetadata(obj: any): void {
    if (!obj || typeof obj !== 'object') return;

    // Limpar timestamps
    delete obj.createdAt;
    delete obj.created_at;
    delete obj.updatedAt;
    delete obj.updated_at;
    delete obj.lastModified;
    delete obj.lastModifiedAt;

    // Limpar dados de usuário
    delete obj.userId;
    delete obj.user_id;
    delete obj.createdBy;
    delete obj.created_by;
    delete obj.modifiedBy;
    delete obj.modified_by;

    // Limpar dados de versionamento
    delete obj.version;
    delete obj.versionHistory;

    // Recursão para objetos aninhados
    if (Array.isArray(obj)) {
        obj.forEach(item => cleanMetadata(item));
    } else {
        for (const key in obj) {
            if (obj.hasOwnProperty(key) && typeof obj[key] === 'object') {
                cleanMetadata(obj[key]);
            }
        }
    }
}

// ============================================================================
// FUNÇÕES ESPECÍFICAS PARA FUNIS
// ============================================================================

/**
 * Clona um template de funil com isolamento completo
 */
export function cloneFunnelTemplate(template: FunnelTemplate, customName?: string): ClonedFunnelInstance {
    const cloneResult = deepCloneWithNewIds(template, {
        regenerateIds: true,
        preserveMetadata: false,
        customName: customName
    });

    if (!cloneResult.success) {
        throw new Error(`Erro ao clonar template: ${cloneResult.error}`);
    }

    const cloned = cloneResult.cloned;

    return {
        id: `${template.id}-${generateId()}`,
        templateSourceId: template.id,
        name: customName || template.name,
        description: template.description,
        blocks: cloned.blocks?.map((b: any) => ({
            id: generateId(),
            type: b.type,
            properties: deepClone(b.properties || {})
        })) || [],
        createdAt: new Date().toISOString()
    };
}

/**
 * Clona um funil completo com preservação de estrutura
 */
export function cloneFunnelComplete<T extends Record<string, any>>(
    funnel: T,
    options: CloneOptions = {}
): CloneResult<T> {
    return deepCloneWithNewIds(funnel, {
        regenerateIds: true,
        preserveMetadata: false,
        nameSuffix: ' (Cópia)',
        ...options
    });
}

/**
 * Clona apenas as páginas de um funil
 */
export function cloneFunnelPages(pages: any[], funnelId?: string): any[] {
    if (!Array.isArray(pages)) return [];

    return pages.map((page) => {
        const clonedPage = deepClone(page);

        // Regenerar IDs
        clonedPage.id = generateUniqueId('page');
        if (funnelId) clonedPage.funnel_id = funnelId;

        // Regenerar IDs dos blocos
        if (clonedPage.blocks) {
            clonedPage.blocks = clonedPage.blocks.map((block: any) => ({
                ...deepClone(block),
                id: generateUniqueId('block')
            }));
        }

        return clonedPage;
    });
}

// ============================================================================
// UTILITIES DE COMPARAÇÃO
// ============================================================================

/**
 * Verifica se dois objetos são isolados (não compartilham referências)
 */
export function verifyIsolation<T>(original: T, cloned: T): boolean {
    try {
        // Teste básico: alterar propriedade no clone não deve afetar original
        if (typeof cloned === 'object' && cloned !== null && !Array.isArray(cloned)) {
            const testKey = '__test_isolation__';
            (cloned as any)[testKey] = 'test_value';

            const isIsolated = !(testKey in (original as any));
            delete (cloned as any)[testKey];

            return isIsolated;
        }

        return true; // Primitivos são sempre isolados

    } catch (error) {
        console.warn('⚠️ Não foi possível verificar isolamento:', error);
        return false;
    }
}

/**
 * Encontra IDs duplicados em um objeto
 */
export function findDuplicateIds(obj: any): string[] {
    const ids = new Set<string>();
    const duplicates = new Set<string>();

    function collectIds(current: any): void {
        if (!current || typeof current !== 'object') return;

        if (current.id && typeof current.id === 'string') {
            if (ids.has(current.id)) {
                duplicates.add(current.id);
            } else {
                ids.add(current.id);
            }
        }

        if (Array.isArray(current)) {
            current.forEach(collectIds);
        } else {
            Object.values(current).forEach(collectIds);
        }
    }

    collectIds(obj);
    return Array.from(duplicates);
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    deepClone,
    deepCloneWithNewIds,
    cloneFunnelTemplate,
    cloneFunnelComplete,
    cloneFunnelPages,
    verifyIsolation,
    findDuplicateIds,
    generateId,
    generateUniqueId
};

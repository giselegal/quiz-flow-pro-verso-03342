/**
 * 🎯 IMPLEMENTAÇÃO: ID GENERATOR CENTRALIZADO
 * 
 * Sistema unificado para geração de IDs consistentes
 * Substitui a geração duplicada e inconsistente atual
 */

import { v4 as uuidv4 } from 'uuid';

// ✅ TIPOS DE ID SUPORTADOS
export type IDType =
    | 'funnel'
    | 'template'
    | 'component'
    | 'step'
    | 'block'
    | 'session'
    | 'user'
    | 'analytics';

// ✅ CONFIGURAÇÃO DE PREFIXOS
const ID_PREFIXES: Record<IDType, string> = {
    funnel: 'fnl',
    template: 'tpl',
    component: 'cmp',
    step: 'stp',
    block: 'blk',
    session: 'ses',
    user: 'usr',
    analytics: 'ana'
};

// ✅ INTERFACE PARA METADADOS
interface IDMetadata {
    type: IDType;
    createdAt: Date;
    prefix: string;
    version: string;
}

/**
 * 🏭 GERADOR CENTRALIZADO DE IDs
 */
export class UnifiedIDGenerator {
    private static instance: UnifiedIDGenerator;
    private cache = new Map<string, IDMetadata>();

    static getInstance(): UnifiedIDGenerator {
        if (!this.instance) {
            this.instance = new UnifiedIDGenerator();
        }
        return this.instance;
    }

    /**
     * Gera ID único com prefixo apropriado
     */
    generate(type: IDType, options?: {
        suffix?: string;
        timestamp?: boolean;
        readable?: boolean;
    }): string {
        const prefix = ID_PREFIXES[type];
        const uuid = uuidv4();

        let id: string;

        if (options?.readable) {
            // ID mais legível para desenvolvimento
            const timestamp = options.timestamp ? `_${Date.now()}` : '';
            const suffix = options.suffix ? `_${options.suffix}` : '';
            id = `${prefix}${suffix}${timestamp}_${uuid.slice(0, 8)}`;
        } else {
            // ID compacto para produção
            id = `${prefix}_${uuid}`;
        }

        // Cache metadata para debugging
        this.cache.set(id, {
            type,
            createdAt: new Date(),
            prefix,
            version: '1.0'
        });

        return id;
    }

    /**
     * Gera ID para funil baseado em template
     */
    generateFunnelFromTemplate(templateId: string): string {
        return this.generate('funnel', {
            suffix: `from_${templateId.slice(0, 8)}`,
            timestamp: true,
            readable: true
        });
    }

    /**
     * Gera ID para step específico de um funil
     */
    generateStepId(funnelId: string, stepNumber: number): string {
        const stepNum = stepNumber.toString().padStart(2, '0');
        return this.generate('step', {
            suffix: `${funnelId.slice(0, 8)}_${stepNum}`,
            readable: true
        });
    }

    /**
     * Gera ID para componente com contexto
     */
    generateComponentId(type: string, context?: {
        funnelId?: string;
        stepId?: string;
        parentId?: string;
    }): string {
        let suffix = type;

        if (context?.funnelId) {
            suffix += `_${context.funnelId.slice(0, 6)}`;
        }

        if (context?.stepId) {
            suffix += `_${context.stepId.slice(-4)}`;
        }

        return this.generate('component', { suffix, readable: true });
    }

    /**
     * Valida se um ID foi gerado por este sistema
     */
    isValidID(id: string, expectedType?: IDType): boolean {
        if (!id || typeof id !== 'string') return false;

        const [prefix] = id.split('_');
        const validPrefixes = Object.values(ID_PREFIXES);

        if (!validPrefixes.includes(prefix)) return false;

        if (expectedType) {
            return ID_PREFIXES[expectedType] === prefix;
        }

        return true;
    }

    /**
     * Extrai tipo do ID
     */
    getTypeFromID(id: string): IDType | null {
        const [prefix] = id.split('_');

        for (const [type, typePrefix] of Object.entries(ID_PREFIXES)) {
            if (typePrefix === prefix) {
                return type as IDType;
            }
        }

        return null;
    }

    /**
     * Migra ID legado para novo formato
     */
    migrateLegacyID(legacyId: string, type: IDType): string {
        // Detectar padrões legados e converter
        const patterns = {
            timestamp: /^.+-\d{13}.*$/, // templateId-timestamp format
            uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
            custom: /^(quiz|funnel|step|block)-.+$/i
        };

        // Se já está no formato novo, retorna
        if (this.isValidID(legacyId, type)) {
            return legacyId;
        }

        // Gera novo ID mantendo contexto quando possível
        if (patterns.timestamp.test(legacyId)) {
            const [baseName] = legacyId.split('-');
            return this.generate(type, { suffix: baseName, timestamp: true, readable: true });
        }

        if (patterns.custom.test(legacyId)) {
            return this.generate(type, { suffix: legacyId.replace(/[^a-zA-Z0-9]/g, ''), readable: true });
        }

        // Fallback: gerar novo ID
        return this.generate(type);
    }

    /**
     * Obtém estatísticas de uso
     */
    getStats(): {
        totalGenerated: number;
        byType: Record<IDType, number>;
        recentIds: Array<{ id: string; type: IDType; createdAt: Date }>;
    } {
        const stats = {
            totalGenerated: this.cache.size,
            byType: {} as Record<IDType, number>,
            recentIds: [] as Array<{ id: string; type: IDType; createdAt: Date }>
        };

        // Contar por tipo
        for (const [id, metadata] of this.cache) {
            stats.byType[metadata.type] = (stats.byType[metadata.type] || 0) + 1;
            stats.recentIds.push({
                id,
                type: metadata.type,
                createdAt: metadata.createdAt
            });
        }

        // Ordenar por mais recente
        stats.recentIds.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        stats.recentIds = stats.recentIds.slice(0, 10);

        return stats;
    }

    /**
     * Limpa cache (útil para testes)
     */
    clearCache(): void {
        this.cache.clear();
    }
}

// ✅ SINGLETON EXPORT
export const idGenerator = UnifiedIDGenerator.getInstance();

// ✅ HELPERS CONVENIENTES
export const generateID = {
    funnel: () => idGenerator.generate('funnel'),
    template: () => idGenerator.generate('template'),
    component: (type: string) => idGenerator.generateComponentId(type),
    step: (funnelId: string, stepNumber: number) => idGenerator.generateStepId(funnelId, stepNumber),
    session: () => idGenerator.generate('session'),
    block: () => idGenerator.generate('block'),
    user: () => idGenerator.generate('user'),
    analytics: () => idGenerator.generate('analytics')
};

// ✅ MIGRATION HELPER
export function migrateLegacyIDs(data: any, typeMapping: Record<string, IDType>): any {
    if (typeof data !== 'object' || data === null) return data;

    const migrated = Array.isArray(data) ? [...data] : { ...data };

    for (const [key, value] of Object.entries(migrated)) {
        if (typeof value === 'string' && typeMapping[key]) {
            migrated[key] = idGenerator.migrateLegacyID(value, typeMapping[key]);
        } else if (typeof value === 'object') {
            migrated[key] = migrateLegacyIDs(value, typeMapping);
        }
    }

    return migrated;
}

// ✅ VALIDATION HELPERS
export function validateIDs(obj: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    function validateRecursive(current: any, path: string = '') {
        if (typeof current === 'object' && current !== null) {
            for (const [key, value] of Object.entries(current)) {
                const currentPath = path ? `${path}.${key}` : key;

                // Verificar campos que devem ser IDs
                if (key.endsWith('Id') && typeof value === 'string') {
                    if (!idGenerator.isValidID(value)) {
                        errors.push(`${currentPath}: "${value}" não é um ID válido`);
                    }
                }

                validateRecursive(value, currentPath);
            }
        }
    }

    validateRecursive(obj);

    return {
        valid: errors.length === 0,
        errors
    };
}

export default idGenerator;
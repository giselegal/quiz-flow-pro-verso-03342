/**
 * 🏪 Hybrid Storage Service - IndexedDB + LocalStorage
 * 
 * Estratégia inteligente:
 * 1. 🥇 IndexedDB (principal) - alta performance, grandes volumes
 * 2. 🥈 LocalStorage (fallback) - compatibilidade garantida  
 * 3. 🥉 Memory cache - performance máxima para dados frequentes
 */

import { indexedDBService, type FunnelDBData, type DraftDBData } from './IndexedDBService';
import { safeLocalStorage } from '@/utils/safeLocalStorage';

export interface HybridStorageOptions {
    preferIndexedDB?: boolean;
    fallbackToLocalStorage?: boolean;
    useMemoryCache?: boolean;
    memoryTTL?: number; // ms
}

interface CacheEntry<T> {
    data: T;
    timestamp: number;
    ttl: number;
}

class HybridStorageService {
    private memoryCache = new Map<string, CacheEntry<any>>();
    private readonly DEFAULT_OPTIONS: Required<HybridStorageOptions> = {
        preferIndexedDB: true,
        fallbackToLocalStorage: true,
        useMemoryCache: true,
        memoryTTL: 5 * 60 * 1000 // 5 minutos
    };

    // ============================================================================
    // DETECTION E CAPABILITIES
    // ============================================================================

    /**
     * Detecta qual tecnologia de armazenamento usar
     */
    async getStorageCapability(): Promise<{
        indexedDB: boolean;
        localStorage: boolean;
        memoryOnly: boolean;
        recommendation: 'indexedDB' | 'localStorage' | 'memory';
    }> {
        const capabilities = {
            indexedDB: false,
            localStorage: false,
            memoryOnly: false,
            recommendation: 'memory' as const
        };

        // Testar IndexedDB
        try {
            await indexedDBService.init();
            capabilities.indexedDB = true;
            capabilities.recommendat
            ion = 'indexedDB';
        } catch (error) {
            console.warn('IndexedDB não disponível:', error);
        }

        // Testar localStorage
        try {
            safeLocalStorage.setItem('__storage_test__', 'test');
            safeLocalStorage.removeItem('__storage_test__');
            capabilities.localStorage = true;

            if (!capabilities.indexedDB) {
                capabilities.recommendation = 'localStorage';
            }
        } catch (error) {
            console.warn('localStorage não disponível:', error);
        }

        // Se nada funcionar, usar apenas memória
        if (!capabilities.indexedDB && !capabilities.localStorage) {
            capabilities.memoryOnly = true;
            capabilities.recommendation = 'memory';
        }

        console.log('🔍 Storage capabilities:', capabilities);
        return capabilities;
    }

    // ============================================================================
    // MEMORY CACHE
    // ============================================================================

    private setMemoryCache<T>(key: string, data: T, ttl?: number): void {
        this.memoryCache.set(key, {
            data,
            timestamp: Date.now(),
            ttl: ttl || this.DEFAULT_OPTIONS.memoryTTL
        });
    }

    private getMemoryCache<T>(key: string): T | null {
        const entry = this.memoryCache.get(key);
        if (!entry) return null;

        // Verificar TTL
        if (Date.now() - entry.timestamp > entry.ttl) {
            this.memoryCache.delete(key);
            return null;
        }

        return entry.data;
    }

    private clearMemoryCache(pattern?: string): void {
        if (pattern) {
            const keysToDelete = Array.from(this.memoryCache.keys())
                .filter(key => key.includes(pattern));
            keysToDelete.forEach(key => this.memoryCache.delete(key));
        } else {
            this.memoryCache.clear();
        }
    }

    // ============================================================================
    // FUNNEL OPERATIONS
    // ============================================================================

    /**
     * Salva funil com estratégia híbrida
     */
    async saveFunnel(funnel: FunnelDBData, options: HybridStorageOptions = {}): Promise<{
        success: boolean;
        storage: 'indexedDB' | 'localStorage' | 'memory';
        error?: string;
    }> {
        const opts = { ...this.DEFAULT_OPTIONS, ...options };
        const cacheKey = `funnel:${funnel.id}`;

        // 1. Tentar IndexedDB primeiro (se preferido)
        if (opts.preferIndexedDB) {
            try {
                await indexedDBService.saveFunnel(funnel);

                // Cache em memória se habilitado
                if (opts.useMemoryCache) {
                    this.setMemoryCache(cacheKey, funnel);
                }

                console.log(`✅ Funil ${funnel.id} salvo no IndexedDB`);
                return { success: true, storage: 'indexedDB' };
            } catch (error) {
                console.warn('❌ Falha no IndexedDB, tentando localStorage:', error);

                if (!opts.fallbackToLocalStorage) {
                    return {
                        success: false,
                        storage: 'memory',
                        error: String(error)
                    };
                }
            }
        }

        // 2. Fallback para localStorage
        if (opts.fallbackToLocalStorage) {
            try {
                const localStorageKey = `hybrid-funnel:${funnel.id}`;
                safeLocalStorage.setItem(localStorageKey, JSON.stringify(funnel));

                // Manter lista de IDs para facilitar consultas
                const listKey = `hybrid-funnels-list:${funnel.userId}`;
                const existingList = JSON.parse(safeLocalStorage.getItem(listKey) || '[]');
                if (!existingList.includes(funnel.id)) {
                    existingList.push(funnel.id);
                    safeLocalStorage.setItem(listKey, JSON.stringify(existingList));
                }

                // Cache em memória se habilitado
                if (opts.useMemoryCache) {
                    this.setMemoryCache(cacheKey, funnel);
                }

                console.log(`✅ Funil ${funnel.id} salvo no localStorage`);
                return { success: true, storage: 'localStorage' };
            } catch (error) {
                console.warn('❌ Falha no localStorage:', error);

                // Último recurso: apenas memória
                if (opts.useMemoryCache) {
                    this.setMemoryCache(cacheKey, funnel, 24 * 60 * 60 * 1000); // 24h para dados só em memória
                    console.log(`✅ Funil ${funnel.id} mantido apenas em memória`);
                    return { success: true, storage: 'memory' };
                }

                return {
                    success: false,
                    storage: 'memory',
                    error: String(error)
                };
            }
        }

        return {
            success: false,
            storage: 'memory',
            error: 'Nenhum método de armazenamento disponível'
        };
    }

    /**
     * Carrega funil com estratégia híbrida
     */
    async loadFunnel(funnelId: string, options: HybridStorageOptions = {}): Promise<{
        data: FunnelDBData | null;
        source: 'memory' | 'indexedDB' | 'localStorage' | 'none';
    }> {
        const opts = { ...this.DEFAULT_OPTIONS, ...options };
        const cacheKey = `funnel:${funnelId}`;

        // 1. Verificar cache em memória primeiro
        if (opts.useMemoryCache) {
            const cached = this.getMemoryCache<FunnelDBData>(cacheKey);
            if (cached) {
                console.log(`⚡ Funil ${funnelId} carregado da memória`);
                return { data: cached, source: 'memory' };
            }
        }

        // 2. Tentar IndexedDB
        if (opts.preferIndexedDB) {
            try {
                const data = await indexedDBService.loadFunnel(funnelId);
                if (data) {
                    // Cache em memória para próximas consultas
                    if (opts.useMemoryCache) {
                        this.setMemoryCache(cacheKey, data);
                    }
                    console.log(`✅ Funil ${funnelId} carregado do IndexedDB`);
                    return { data, source: 'indexedDB' };
                }
            } catch (error) {
                console.warn('❌ Falha ao carregar do IndexedDB:', error);
            }
        }

        // 3. Fallback para localStorage
        if (opts.fallbackToLocalStorage) {
            try {
                const localStorageKey = `hybrid-funnel:${funnelId}`;
                const stored = safeLocalStorage.getItem(localStorageKey);
                if (stored) {
                    const data = JSON.parse(stored) as FunnelDBData;

                    // Cache em memória para próximas consultas
                    if (opts.useMemoryCache) {
                        this.setMemoryCache(cacheKey, data);
                    }

                    console.log(`✅ Funil ${funnelId} carregado do localStorage`);
                    return { data, source: 'localStorage' };
                }
            } catch (error) {
                console.warn('❌ Falha ao carregar do localStorage:', error);
            }
        }

        console.log(`❌ Funil ${funnelId} não encontrado em nenhum storage`);
        return { data: null, source: 'none' };
    }

    /**
     * Lista funis com estratégia híbrida
     */
    async listFunnels(filters: {
        userId?: string;
        category?: string;
        context?: string;
        limit?: number;
    } = {}, options: HybridStorageOptions = {}): Promise<{
        data: FunnelDBData[];
        source: 'memory' | 'indexedDB' | 'localStorage' | 'mixed';
    }> {
        const opts = { ...this.DEFAULT_OPTIONS, ...options };

        // 1. Tentar IndexedDB primeiro (suporta consultas complexas)
        if (opts.preferIndexedDB) {
            try {
                const data = await indexedDBService.listFunnels(filters);
                console.log(`✅ ${data.length} funis listados do IndexedDB`);
                return { data, source: 'indexedDB' };
            } catch (error) {
                console.warn('❌ Falha ao listar do IndexedDB:', error);
            }
        }

        // 2. Fallback para localStorage (menos eficiente)
        if (opts.fallbackToLocalStorage) {
            try {
                const results: FunnelDBData[] = [];

                if (filters.userId) {
                    // Usar lista de IDs se disponível
                    const listKey = `hybrid-funnels-list:${filters.userId}`;
                    const funnelIds = JSON.parse(safeLocalStorage.getItem(listKey) || '[]');

                    for (const id of funnelIds) {
                        const stored = safeLocalStorage.getItem(`hybrid-funnel:${id}`);
                        if (stored) {
                            const funnel = JSON.parse(stored) as FunnelDBData;
                            results.push(funnel);
                        }
                    }
                } else {
                    // Buscar em todas as chaves (menos eficiente)
                    const keys = Object.keys(localStorage).filter(k => k.startsWith('hybrid-funnel:'));
                    for (const key of keys) {
                        const stored = safeLocalStorage.getItem(key);
                        if (stored) {
                            const funnel = JSON.parse(stored) as FunnelDBData;
                            results.push(funnel);
                        }
                    }
                }

                // Aplicar filtros manualmente
                let filtered = results;
                if (filters.category) {
                    filtered = filtered.filter(f => f.category === filters.category);
                }
                if (filters.context) {
                    filtered = filtered.filter(f => f.context === filters.context);
                }

                // Ordenar por data de criação
                filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

                // Aplicar limite
                if (filters.limit) {
                    filtered = filtered.slice(0, filters.limit);
                }

                console.log(`✅ ${filtered.length} funis listados do localStorage`);
                return { data: filtered, source: 'localStorage' };
            } catch (error) {
                console.warn('❌ Falha ao listar do localStorage:', error);
            }
        }

        return { data: [], source: 'mixed' };
    }

    // ============================================================================
    // DRAFT OPERATIONS
    // ============================================================================

    /**
     * Salva draft com estratégia híbrida
     */
    async saveDraft(draft: DraftDBData, options: HybridStorageOptions = {}): Promise<boolean> {
        const opts = { ...this.DEFAULT_OPTIONS, ...options };
        const cacheKey = `draft:${draft.id}`;

        // IndexedDB primeiro (melhor para drafts frequentes)
        if (opts.preferIndexedDB) {
            try {
                await indexedDBService.saveDraft(draft);

                if (opts.useMemoryCache) {
                    this.setMemoryCache(cacheKey, draft, 2 * 60 * 1000); // Cache curto para drafts
                }

                return true;
            } catch (error) {
                console.warn('❌ Falha ao salvar draft no IndexedDB:', error);
            }
        }

        // Fallback localStorage
        if (opts.fallbackToLocalStorage) {
            try {
                const key = `hybrid-draft:${draft.id}`;
                safeLocalStorage.setItem(key, JSON.stringify(draft));

                if (opts.useMemoryCache) {
                    this.setMemoryCache(cacheKey, draft, 2 * 60 * 1000);
                }

                return true;
            } catch (error) {
                console.warn('❌ Falha ao salvar draft no localStorage:', error);
            }
        }

        // Último recurso: apenas memória
        if (opts.useMemoryCache) {
            this.setMemoryCache(cacheKey, draft, 10 * 60 * 1000); // 10min para drafts só em memória
            return true;
        }

        return false;
    }

    /**
     * Carrega draft com estratégia híbrida
     */
    async loadDraft(funnelId: string, stepKey: string, options: HybridStorageOptions = {}): Promise<DraftDBData | null> {
        const opts = { ...this.DEFAULT_OPTIONS, ...options };
        const draftId = `${funnelId}:${stepKey}`;
        const cacheKey = `draft:${draftId}`;

        // Memória primeiro (drafts são acessados frequentemente)
        if (opts.useMemoryCache) {
            const cached = this.getMemoryCache<DraftDBData>(cacheKey);
            if (cached) {
                return cached;
            }
        }

        // IndexedDB
        if (opts.preferIndexedDB) {
            try {
                const data = await indexedDBService.loadDraft(funnelId, stepKey);
                if (data) {
                    if (opts.useMemoryCache) {
                        this.setMemoryCache(cacheKey, data, 2 * 60 * 1000);
                    }
                    return data;
                }
            } catch (error) {
                console.warn('❌ Falha ao carregar draft do IndexedDB:', error);
            }
        }

        // localStorage fallback
        if (opts.fallbackToLocalStorage) {
            try {
                const key = `hybrid-draft:${draftId}`;
                const stored = safeLocalStorage.getItem(key);
                if (stored) {
                    const data = JSON.parse(stored) as DraftDBData;

                    if (opts.useMemoryCache) {
                        this.setMemoryCache(cacheKey, data, 2 * 60 * 1000);
                    }

                    return data;
                }
            } catch (error) {
                console.warn('❌ Falha ao carregar draft do localStorage:', error);
            }
        }

        return null;
    }

    // ============================================================================
    // UTILITIES
    // ============================================================================

    /**
     * Migra dados do localStorage para IndexedDB
     */
    async migrateToIndexedDB(): Promise<{
        migrated: number;
        errors: number;
        details: string[];
    }> {
        const result = {
            migrated: 0,
            errors: 0,
            details: [] as string[]
        };

        try {
            // Migrar funis
            const funnelKeys = Object.keys(localStorage).filter(k => k.startsWith('hybrid-funnel:'));

            for (const key of funnelKeys) {
                try {
                    const stored = safeLocalStorage.getItem(key);
                    if (stored) {
                        const funnel = JSON.parse(stored) as FunnelDBData;
                        await indexedDBService.saveFunnel(funnel);
                        result.migrated++;
                        result.details.push(`✅ Funil ${funnel.id} migrado`);
                    }
                } catch (error) {
                    result.errors++;
                    result.details.push(`❌ Erro ao migrar ${key}: ${error}`);
                }
            }

            // Migrar drafts
            const draftKeys = Object.keys(localStorage).filter(k => k.startsWith('hybrid-draft:'));

            for (const key of draftKeys) {
                try {
                    const stored = safeLocalStorage.getItem(key);
                    if (stored) {
                        const draft = JSON.parse(stored) as DraftDBData;
                        await indexedDBService.saveDraft(draft);
                        result.migrated++;
                        result.details.push(`✅ Draft ${draft.id} migrado`);
                    }
                } catch (error) {
                    result.errors++;
                    result.details.push(`❌ Erro ao migrar ${key}: ${error}`);
                }
            }

            console.log(`🔄 Migração concluída: ${result.migrated} itens migrados, ${result.errors} erros`);
        } catch (error) {
            result.errors++;
            result.details.push(`❌ Erro geral na migração: ${error}`);
        }

        return result;
    }

    /**
     * Obtém estatísticas de armazenamento
     */
    async getStorageStats(): Promise<{
        indexedDB: { available: boolean; items: number };
        localStorage: { available: boolean; items: number; sizeKB: number };
        memoryCache: { items: number };
        recommendation: string;
    }> {
        const stats = {
            indexedDB: { available: false, items: 0 },
            localStorage: { available: false, items: 0, sizeKB: 0 },
            memoryCache: { items: this.memoryCache.size },
            recommendation: ''
        };

        // IndexedDB stats
        try {
            const idbStats = await indexedDBService.getStats();
            stats.indexedDB = {
                available: true,
                items: idbStats.funnels + idbStats.drafts + idbStats.templates
            };
        } catch (error) {
            console.warn('Não foi possível obter stats do IndexedDB:', error);
        }

        // localStorage stats  
        try {
            const keys = Object.keys(localStorage).filter(k => k.startsWith('hybrid-'));
            let totalSize = 0;

            keys.forEach(key => {
                const value = localStorage.getItem(key) || '';
                totalSize += key.length + value.length;
            });

            stats.localStorage = {
                available: true,
                items: keys.length,
                sizeKB: Math.round(totalSize / 1024 * 100) / 100
            };
        } catch (error) {
            console.warn('Não foi possível obter stats do localStorage:', error);
        }

        // Recomendação
        if (stats.indexedDB.available) {
            if (stats.localStorage.sizeKB > 2000) { // > 2MB
                stats.recommendation = 'Migre para IndexedDB para melhor performance';
            } else {
                stats.recommendation = 'IndexedDB ativo - performance otimizada';
            }
        } else if (stats.localStorage.available) {
            if (stats.localStorage.sizeKB > 3000) { // > 3MB
                stats.recommendation = 'Considere reduzir dados ou habilitar IndexedDB';
            } else {
                stats.recommendation = 'localStorage ativo - funcional';
            }
        } else {
            stats.recommendation = 'Apenas memória - dados serão perdidos ao recarregar';
        }

        return stats;
    }

    /**
     * Limpa todos os dados
     */
    async clearAllData(): Promise<void> {
        // Limpar memória
        this.clearMemoryCache();

        // Limpar IndexedDB
        try {
            // Note: IndexedDBService não tem método clear implementado ainda
            // Seria necessário implementar
            console.log('IndexedDB: limpeza não implementada ainda');
        } catch (error) {
            console.warn('Erro ao limpar IndexedDB:', error);
        }

        // Limpar localStorage
        try {
            const keys = Object.keys(localStorage).filter(k => k.startsWith('hybrid-'));
            keys.forEach(key => localStorage.removeItem(key));
            console.log(`✅ ${keys.length} itens removidos do localStorage`);
        } catch (error) {
            console.warn('Erro ao limpar localStorage:', error);
        }
    }
}

// Export singleton
export const hybridStorage = new HybridStorageService();
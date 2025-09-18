/**
 * 🎯 LOCAL STORAGE SERVICE
 * 
 * Serviço centralizado para gerenciar dados locais de funis
 * Cache inteligente e sincronização com Supabase
 */

import { FunnelState, FunnelSettings } from '../types';

// ============================================================================
// INTERFACES
// ============================================================================

export interface CacheOptions {
    ttl?: number; // Time to live em segundos
    encrypted?: boolean;
    compress?: boolean;
}

export interface StorageItem<T = any> {
    data: T;
    timestamp: number;
    ttl?: number;
    version: string;
}

export interface StorageStats {
    totalItems: number;
    totalSize: number; // Em bytes
    funnelItems: number;
    settingsItems: number;
    oldestItem: Date;
    newestItem: Date;
}

// ============================================================================
// CONSTANTES
// ============================================================================

const STORAGE_PREFIX = 'funnel-core';
const CURRENT_VERSION = '1.0.0';
const DEFAULT_TTL = 7 * 24 * 60 * 60; // 7 dias em segundos

const STORAGE_KEYS = {
    FUNNEL: (id: string) => `${STORAGE_PREFIX}-funnel-${id}`,
    SETTINGS: (id: string) => `${STORAGE_PREFIX}-settings-${id}`,
    CACHE: (key: string) => `${STORAGE_PREFIX}-cache-${key}`,
    METADATA: 'funnel-core-metadata',
    INDEX: 'funnel-core-index'
} as const;

// ============================================================================
// LOCAL STORAGE SERVICE CLASS
// ============================================================================

export class LocalStorageService {
    private static instance: LocalStorageService;
    private isAvailable: boolean = false;

    private constructor() {
        this.isAvailable = this.checkAvailability();
    }

    /**
     * Singleton instance
     */
    static getInstance(): LocalStorageService {
        if (!this.instance) {
            this.instance = new LocalStorageService();
        }
        return this.instance;
    }

    // ============================================================================
    // CORE STORAGE OPERATIONS
    // ============================================================================

    /**
     * Verifica se localStorage está disponível
     */
    private checkAvailability(): boolean {
        try {
            if (typeof window === 'undefined') return false;

            const testKey = '__test_storage__';
            window.localStorage.setItem(testKey, 'test');
            window.localStorage.removeItem(testKey);
            return true;
        } catch (error) {
            console.warn('⚠️ LocalStorage não disponível:', error);
            return false;
        }
    }

    /**
     * Obtém um item do localStorage
     */
    private getItem<T>(key: string): StorageItem<T> | null {
        if (!this.isAvailable) return null;

        try {
            const item = window.localStorage.getItem(key);
            if (!item) return null;

            const parsed = JSON.parse(item) as StorageItem<T>;

            // Verificar TTL
            if (parsed.ttl && parsed.ttl > 0) {
                const now = Date.now() / 1000;
                const age = now - (parsed.timestamp / 1000);

                if (age > parsed.ttl) {
                    console.log(`🗑️ Item expirado removido: ${key}`);
                    this.removeItem(key);
                    return null;
                }
            }

            return parsed;
        } catch (error) {
            console.error('❌ Erro ao ler localStorage:', error);
            return null;
        }
    }

    /**
     * Salva um item no localStorage
     */
    private setItem<T>(
        key: string,
        data: T,
        options: CacheOptions = {}
    ): boolean {
        if (!this.isAvailable) return false;

        try {
            const item: StorageItem<T> = {
                data,
                timestamp: Date.now(),
                ttl: options.ttl || DEFAULT_TTL,
                version: CURRENT_VERSION
            };

            const serialized = JSON.stringify(item);
            window.localStorage.setItem(key, serialized);

            // Atualizar índice
            this.updateIndex(key, serialized.length);

            return true;
        } catch (error) {
            console.error('❌ Erro ao salvar no localStorage:', error);

            // Tentar limpar itens antigos e tentar novamente
            if (error instanceof Error && error.name === 'QuotaExceededError') {
                console.log('🧹 Quota excedida, limpando itens antigos...');
                this.cleanupExpiredItems();

                try {
                    const serialized = JSON.stringify({
                        data,
                        timestamp: Date.now(),
                        ttl: options.ttl || DEFAULT_TTL,
                        version: CURRENT_VERSION
                    });
                    window.localStorage.setItem(key, serialized);
                    return true;
                } catch (retryError) {
                    console.error('❌ Erro mesmo após limpeza:', retryError);
                    return false;
                }
            }

            return false;
        }
    }

    /**
     * Remove um item do localStorage
     */
    private removeItem(key: string): boolean {
        if (!this.isAvailable) return false;

        try {
            window.localStorage.removeItem(key);
            this.removeFromIndex(key);
            return true;
        } catch (error) {
            console.error('❌ Erro ao remover do localStorage:', error);
            return false;
        }
    }

    // ============================================================================
    // FUNNEL OPERATIONS
    // ============================================================================

    /**
     * Salva estado de funil
     */
    saveFunnel(funnelId: string, state: FunnelState): boolean {
        console.log(`💾 Salvando funil no localStorage: ${funnelId}`);

        const key = STORAGE_KEYS.FUNNEL(funnelId);
        const success = this.setItem(key, state, { ttl: DEFAULT_TTL });

        if (success) {
            console.log(`✅ Funil salvo localmente: ${funnelId}`);
        }

        return success;
    }

    /**
     * Carrega estado de funil
     */
    loadFunnel(funnelId: string): FunnelState | null {
        console.log(`📖 Carregando funil do localStorage: ${funnelId}`);

        const key = STORAGE_KEYS.FUNNEL(funnelId);
        const item = this.getItem<FunnelState>(key);

        if (item) {
            console.log(`✅ Funil carregado localmente: ${funnelId}`);
            return item.data;
        }

        return null;
    }

    /**
     * Remove funil do localStorage
     */
    removeFunnel(funnelId: string): boolean {
        console.log(`🗑️ Removendo funil do localStorage: ${funnelId}`);

        const funnelKey = STORAGE_KEYS.FUNNEL(funnelId);
        const settingsKey = STORAGE_KEYS.SETTINGS(funnelId);

        const funnelRemoved = this.removeItem(funnelKey);
        const settingsRemoved = this.removeItem(settingsKey);

        return funnelRemoved || settingsRemoved;
    }

    /**
     * Lista funis salvos localmente
     */
    listFunnels(): string[] {
        if (!this.isAvailable) return [];

        try {
            const funnelIds: string[] = [];
            const prefix = STORAGE_KEYS.FUNNEL('');

            for (let i = 0; i < window.localStorage.length; i++) {
                const key = window.localStorage.key(i);
                if (key && key.startsWith(prefix)) {
                    // Extrair ID do funil da chave
                    const funnelId = key.replace(prefix, '');
                    if (funnelId) {
                        funnelIds.push(funnelId);
                    }
                }
            }

            return funnelIds;
        } catch (error) {
            console.error('❌ Erro ao listar funis:', error);
            return [];
        }
    }

    // ============================================================================
    // SETTINGS OPERATIONS
    // ============================================================================

    /**
     * Salva configurações de funil
     */
    saveSettings(funnelId: string, settings: FunnelSettings): boolean {
        console.log(`💾 Salvando configurações no localStorage: ${funnelId}`);

        const key = STORAGE_KEYS.SETTINGS(funnelId);
        const success = this.setItem(key, settings, { ttl: DEFAULT_TTL });

        if (success) {
            console.log(`✅ Configurações salvas localmente: ${funnelId}`);
        }

        return success;
    }

    /**
     * Carrega configurações de funil
     */
    loadSettings(funnelId: string): FunnelSettings | null {
        console.log(`📖 Carregando configurações do localStorage: ${funnelId}`);

        const key = STORAGE_KEYS.SETTINGS(funnelId);
        const item = this.getItem<FunnelSettings>(key);

        if (item) {
            console.log(`✅ Configurações carregadas localmente: ${funnelId}`);
            return item.data;
        }

        return null;
    }

    // ============================================================================
    // CACHE OPERATIONS
    // ============================================================================

    /**
     * Salva dados em cache genérico
     */
    setCache<T>(key: string, data: T, options: CacheOptions = {}): boolean {
        const cacheKey = STORAGE_KEYS.CACHE(key);
        return this.setItem(cacheKey, data, options);
    }

    /**
     * Obtém dados do cache
     */
    getCache<T>(key: string): T | null {
        const cacheKey = STORAGE_KEYS.CACHE(key);
        const item = this.getItem<T>(cacheKey);
        return item ? item.data : null;
    }

    /**
     * Remove item do cache
     */
    removeCache(key: string): boolean {
        const cacheKey = STORAGE_KEYS.CACHE(key);
        return this.removeItem(cacheKey);
    }

    // ============================================================================
    // MAINTENANCE OPERATIONS
    // ============================================================================

    /**
     * Limpa itens expirados
     */
    cleanupExpiredItems(): number {
        if (!this.isAvailable) return 0;

        let cleanedCount = 0;
        const now = Date.now() / 1000;

        try {
            const keys = Object.keys(window.localStorage);

            for (const key of keys) {
                if (key.startsWith(STORAGE_PREFIX)) {
                    try {
                        const item = window.localStorage.getItem(key);
                        if (item) {
                            const parsed = JSON.parse(item) as StorageItem;

                            if (parsed.ttl && parsed.ttl > 0) {
                                const age = now - (parsed.timestamp / 1000);

                                if (age > parsed.ttl) {
                                    window.localStorage.removeItem(key);
                                    cleanedCount++;
                                }
                            }
                        }
                    } catch (error) {
                        // Item corrompido, remover
                        window.localStorage.removeItem(key);
                        cleanedCount++;
                    }
                }
            }

            if (cleanedCount > 0) {
                console.log(`🧹 ${cleanedCount} itens expirados removidos`);
            }

            return cleanedCount;
        } catch (error) {
            console.error('❌ Erro durante limpeza:', error);
            return 0;
        }
    }

    /**
     * Obtém estatísticas de uso
     */
    getStorageStats(): StorageStats {
        const stats: StorageStats = {
            totalItems: 0,
            totalSize: 0,
            funnelItems: 0,
            settingsItems: 0,
            oldestItem: new Date(),
            newestItem: new Date(0)
        };

        if (!this.isAvailable) return stats;

        try {
            for (let i = 0; i < window.localStorage.length; i++) {
                const key = window.localStorage.key(i);
                if (key && key.startsWith(STORAGE_PREFIX)) {
                    const item = window.localStorage.getItem(key);
                    if (item) {
                        stats.totalItems++;
                        stats.totalSize += item.length;

                        if (key.includes('-funnel-')) {
                            stats.funnelItems++;
                        } else if (key.includes('-settings-')) {
                            stats.settingsItems++;
                        }

                        try {
                            const parsed = JSON.parse(item) as StorageItem;
                            const itemDate = new Date(parsed.timestamp);

                            if (itemDate < stats.oldestItem) {
                                stats.oldestItem = itemDate;
                            }
                            if (itemDate > stats.newestItem) {
                                stats.newestItem = itemDate;
                            }
                        } catch (parseError) {
                            // Ignorar itens corrompidos
                        }
                    }
                }
            }
        } catch (error) {
            console.error('❌ Erro ao calcular estatísticas:', error);
        }

        return stats;
    }

    /**
     * Limpa todos os dados do funil no localStorage
     */
    clearAllFunnelData(): boolean {
        if (!this.isAvailable) return false;

        try {
            const keys = Object.keys(window.localStorage);
            let removedCount = 0;

            for (const key of keys) {
                if (key.startsWith(STORAGE_PREFIX)) {
                    window.localStorage.removeItem(key);
                    removedCount++;
                }
            }

            console.log(`🧹 ${removedCount} itens removidos do localStorage`);
            return true;
        } catch (error) {
            console.error('❌ Erro ao limpar localStorage:', error);
            return false;
        }
    }

    // ============================================================================
    // PRIVATE UTILITIES
    // ============================================================================

    private updateIndex(key: string, size: number): void {
        try {
            const index = this.getItem<Record<string, any>>(STORAGE_KEYS.INDEX);
            const indexData = index?.data || {};

            indexData[key] = {
                size,
                timestamp: Date.now()
            };

            this.setItem(STORAGE_KEYS.INDEX, indexData);
        } catch (error) {
            // Ignorar erros de índice
        }
    }

    private removeFromIndex(key: string): void {
        try {
            const index = this.getItem<Record<string, any>>(STORAGE_KEYS.INDEX);
            if (index?.data && index.data[key]) {
                const indexData = { ...index.data };
                delete indexData[key];
                this.setItem(STORAGE_KEYS.INDEX, indexData);
            }
        } catch (error) {
            // Ignorar erros de índice
        }
    }

    /**
     * Verifica se o localStorage está disponível
     */
    isStorageAvailable(): boolean {
        return this.isAvailable;
    }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const localStorageService = LocalStorageService.getInstance();

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Helper para migrar dados antigos
 */
export function migrateLegacyFunnelData(): number {
    let migratedCount = 0;

    try {
        // Migrar dados de funis com formato antigo
        for (let i = 0; i < window.localStorage.length; i++) {
            const key = window.localStorage.key(i);
            if (key && (key.startsWith('funnel-') || key.startsWith('quiz-'))) {
                const oldData = window.localStorage.getItem(key);
                if (oldData) {
                    try {
                        const parsed = JSON.parse(oldData);

                        // Identificar se é um funil e migrar
                        if (parsed.id && (parsed.steps || parsed.questions)) {
                            const funnelId = parsed.id;
                            const success = localStorageService.saveFunnel(funnelId, parsed);

                            if (success) {
                                window.localStorage.removeItem(key);
                                migratedCount++;
                                console.log(`✅ Migrado: ${key} → ${funnelId}`);
                            }
                        }
                    } catch (parseError) {
                        console.warn(`⚠️ Erro ao migrar ${key}:`, parseError);
                    }
                }
            }
        }

        if (migratedCount > 0) {
            console.log(`🔄 ${migratedCount} itens migrados para o novo formato`);
        }
    } catch (error) {
        console.error('❌ Erro durante migração:', error);
    }

    return migratedCount;
}

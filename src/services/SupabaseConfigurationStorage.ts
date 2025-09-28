/**
 * 🏗️ SUPABASE CONFIGURATION STORAGE - SUBSTITUIÇÃO DOS MOCKS
 * 
 * Sistema real de persistência para configurações de componentes
 * ✅ Substituí o ConfigurationStorage em memória
 * ✅ Integração com Supabase + fallback IndexedDB
 * ✅ Cache inteligente para performance
 * ✅ Sync offline/online automático
 */

import { supabase } from '@/integrations/supabase/client';
import { IndexedDBStorageService } from '@/utils/storage/IndexedDBStorageService';

// =============================================================================
// TYPES AND INTERFACES
// =============================================================================

export interface StoredConfiguration {
    componentId: string;
    funnelId?: string;
    properties: Record<string, any>;
    version: number;
    lastModified: Date;
    createdBy?: string;
    metadata: {
        source: 'api' | 'editor' | 'import';
        cacheTtl?: number;
        tags?: string[];
    };
}

export interface ConfigurationStats {
    totalConfigurations: number;
    byFunnel: Record<string, number>;
    byComponent: Record<string, number>;
    lastModified: Date;
}

// =============================================================================
// SUPABASE STORAGE IMPLEMENTATION
// =============================================================================

export class SupabaseConfigurationStorage {
    private static instance: SupabaseConfigurationStorage;
    private cache = new Map<string, { data: StoredConfiguration; timestamp: number }>();
    private cacheTtl = 5 * 60 * 1000; // 5 minutos
    private indexedDBService: IndexedDBStorageService;
    private isOnline = navigator.onLine;

    constructor() {
        this.indexedDBService = new IndexedDBStorageService();
        this.setupOfflineHandling();
    }

    static getInstance(): SupabaseConfigurationStorage {
        if (!SupabaseConfigurationStorage.instance) {
            SupabaseConfigurationStorage.instance = new SupabaseConfigurationStorage();
        }
        return SupabaseConfigurationStorage.instance;
    }

    // =========================================================================
    // OFFLINE/ONLINE HANDLING
    // =========================================================================

    private setupOfflineHandling(): void {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.syncPendingChanges();
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
        });
    }

    private async syncPendingChanges(): Promise<void> {
        if (!this.isOnline) return;

        try {
            // Buscar mudanças pendentes do IndexedDB
            const pendingChanges = await this.indexedDBService.getPendingChanges();
            
            for (const change of pendingChanges) {
                await this.saveToSupabase(change.data);
                await this.indexedDBService.markAsSynced(change.id);
            }

            console.log(`✅ Sincronizadas ${pendingChanges.length} configurações pendentes`);
        } catch (error) {
            console.error('❌ Erro durante sincronização offline:', error);
        }
    }

    // =========================================================================
    // CORE STORAGE OPERATIONS
    // =========================================================================

    private generateKey(componentId: string, funnelId?: string): string {
        return funnelId ? `${componentId}:${funnelId}` : componentId;
    }

    async save(config: StoredConfiguration): Promise<void> {
        try {
            const key = this.generateKey(config.componentId, config.funnelId);
            const configWithDefaults = {
                ...config,
                lastModified: new Date(),
                metadata: {
                    source: 'editor' as const,
                    ...config.metadata
                }
            };

            // 1. Salvar no cache local
            this.cache.set(key, {
                data: configWithDefaults,
                timestamp: Date.now()
            });

            // 2. Salvar no IndexedDB (sempre funciona)
            await this.indexedDBService.store(key, configWithDefaults, {
                tableName: 'component_configurations',
                syncStatus: this.isOnline ? 'synced' : 'pending'
            });

            // 3. Tentar salvar no Supabase se online
            if (this.isOnline) {
                await this.saveToSupabase(configWithDefaults);
                console.log(`💾 Configuração salva: ${key}`, configWithDefaults.properties);
            } else {
                console.log(`📱 Configuração salva offline: ${key}`);
            }

        } catch (error) {
            console.error(`❌ Erro ao salvar configuração:`, error);
            throw error;
        }
    }

    private async saveToSupabase(config: StoredConfiguration): Promise<void> {
        const { error } = await supabase
            .from('component_configurations')
            .upsert({
                component_id: config.componentId,
                funnel_id: config.funnelId,
                properties: config.properties,
                metadata: config.metadata,
                source: config.metadata.source,
                created_by: config.createdBy || null,
                version: config.version
            }, {
                onConflict: 'component_id,funnel_id'
            });

        if (error) {
            throw new Error(`Supabase save error: ${error.message}`);
        }
    }

    async load(componentId: string, funnelId?: string): Promise<StoredConfiguration | null> {
        try {
            const key = this.generateKey(componentId, funnelId);

            // 1. Verificar cache local primeiro
            const cached = this.cache.get(key);
            if (cached && Date.now() - cached.timestamp < this.cacheTtl) {
                console.log(`💨 Cache hit: ${key}`);
                return cached.data;
            }

            // 2. Tentar carregar do Supabase se online
            if (this.isOnline) {
                const { data, error } = await supabase
                    .from('component_configurations')
                    .select('*')
                    .eq('component_id', componentId)
                    .eq('funnel_id', funnelId || null)
                    .single();

                if (!error && data) {
                    const config: StoredConfiguration = {
                        componentId: data.component_id,
                        funnelId: data.funnel_id,
                        properties: data.properties,
                        version: data.version,
                        lastModified: new Date(data.last_modified),
                        createdBy: data.created_by,
                        metadata: data.metadata
                    };

                    // Salvar no cache
                    this.cache.set(key, {
                        data: config,
                        timestamp: Date.now()
                    });

                    console.log(`✅ Configuração carregada do Supabase: ${key}`);
                    return config;
                }
            }

            // 3. Fallback para IndexedDB
            const localData = await this.indexedDBService.retrieve(key, {
                tableName: 'component_configurations'
            });

            if (localData) {
                console.log(`📱 Configuração carregada offline: ${key}`);
                return localData as StoredConfiguration;
            }

            console.log(`⚙️ Configuração não encontrada: ${key}`);
            return null;

        } catch (error) {
            console.error(`❌ Erro ao carregar configuração:`, error);
            return null;
        }
    }

    async list(funnelId?: string): Promise<StoredConfiguration[]> {
        try {
            // Tentar carregar do Supabase se online
            if (this.isOnline) {
                let query = supabase.from('component_configurations').select('*');
                
                if (funnelId) {
                    query = query.eq('funnel_id', funnelId);
                }

                const { data, error } = await query;

                if (!error && data) {
                    return data.map(item => ({
                        componentId: item.component_id,
                        funnelId: item.funnel_id,
                        properties: item.properties,
                        version: item.version,
                        lastModified: new Date(item.last_modified),
                        createdBy: item.created_by,
                        metadata: item.metadata
                    }));
                }
            }

            // Fallback para IndexedDB
            const localData = await this.indexedDBService.list({
                tableName: 'component_configurations',
                filter: funnelId ? { funnelId } : undefined
            });

            return localData as StoredConfiguration[];

        } catch (error) {
            console.error(`❌ Erro ao listar configurações:`, error);
            return [];
        }
    }

    async delete(componentId: string, funnelId?: string): Promise<boolean> {
        try {
            const key = this.generateKey(componentId, funnelId);

            // 1. Remover do cache
            this.cache.delete(key);

            // 2. Remover do IndexedDB
            await this.indexedDBService.remove(key, {
                tableName: 'component_configurations'
            });

            // 3. Remover do Supabase se online
            if (this.isOnline) {
                const { error } = await supabase
                    .from('component_configurations')
                    .delete()
                    .eq('component_id', componentId)
                    .eq('funnel_id', funnelId || null);

                if (error) {
                    console.error('Erro ao deletar do Supabase:', error);
                    return false;
                }
            }

            console.log(`🗑️ Configuração deletada: ${key}`);
            return true;

        } catch (error) {
            console.error(`❌ Erro ao deletar configuração:`, error);
            return false;
        }
    }

    // =========================================================================
    // BACKUP AND UTILITIES
    // =========================================================================

    async backup(funnelId?: string): Promise<Record<string, StoredConfiguration>> {
        const configurations = await this.list(funnelId);
        const backup: Record<string, StoredConfiguration> = {};

        configurations.forEach(config => {
            const key = this.generateKey(config.componentId, config.funnelId);
            backup[key] = config;
        });

        return backup;
    }

    async restore(backup: Record<string, StoredConfiguration>): Promise<void> {
        for (const [key, config] of Object.entries(backup)) {
            await this.save(config);
        }
        console.log(`✅ Restauradas ${Object.keys(backup).length} configurações`);
    }

    async getStats(funnelId?: string): Promise<ConfigurationStats> {
        const configurations = await this.list(funnelId);
        
        const stats: ConfigurationStats = {
            totalConfigurations: configurations.length,
            byFunnel: {},
            byComponent: {},
            lastModified: new Date(0)
        };

        configurations.forEach(config => {
            // Contadores por funil
            const funnel = config.funnelId || 'global';
            stats.byFunnel[funnel] = (stats.byFunnel[funnel] || 0) + 1;

            // Contadores por componente
            stats.byComponent[config.componentId] = (stats.byComponent[config.componentId] || 0) + 1;

            // Última modificação
            if (config.lastModified > stats.lastModified) {
                stats.lastModified = config.lastModified;
            }
        });

        return stats;
    }

    // =========================================================================
    // CACHE MANAGEMENT
    // =========================================================================

    clearCache(): void {
        this.cache.clear();
        console.log('🧹 Cache de configurações limpo');
    }

    getCacheStats(): { size: number; entries: string[] } {
        return {
            size: this.cache.size,
            entries: Array.from(this.cache.keys())
        };
    }
}

// Export singleton instance
export const supabaseConfigStorage = SupabaseConfigurationStorage.getInstance();
export default supabaseConfigStorage;

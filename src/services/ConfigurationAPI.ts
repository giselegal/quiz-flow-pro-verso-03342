/**
 * 🔌 CONFIGURATION API SERVICE v2.0 - REAL PERSISTENCE
 * 
 * API REST para controle completo de configurações dos componentes
 * ✅ MIGRADO: Substituí mocks em memória por Supabase + IndexedDB
 * ✅ PERFORMANCE: Cache inteligente + sincronização offline
 * ✅ BACKUP: Sistema de backup/restore automático
 */

import { ComponentDefinition, ComponentConfigurationAPI } from '@/types/componentConfiguration';
import { SupabaseConfigurationStorage, type StoredConfiguration } from './SupabaseConfigurationStorage';

// ============================================================================
// CONFIGURATION API CLASS
// ============================================================================

export class ConfigurationAPI implements ComponentConfigurationAPI {
    private static instance: ConfigurationAPI;
    private cache = new Map<string, any>();
    private cacheTimeout = 5 * 60 * 1000; // 5 minutos
    private useHttp = typeof window !== 'undefined' && (import.meta as any)?.env?.VITE_CONFIG_API_HTTP === 'true';
    private baseUrl = typeof window !== 'undefined' ? '' : '';
    private storage = SupabaseConfigurationStorage.getInstance();

    static getInstance(): ConfigurationAPI {
        if (!ConfigurationAPI.instance) {
            ConfigurationAPI.instance = new ConfigurationAPI();
        }
        return ConfigurationAPI.instance;
    }

    /**
     * 📥 GET CONFIGURATION
     */
    async getConfiguration(componentId: string, funnelId?: string): Promise<Record<string, any>> {
        try {
            console.log(`📥 GET Configuration: ${componentId}${funnelId ? ` (${funnelId})` : ''}`);

            // Verificar cache primeiro
            const cacheKey = `${componentId}:${funnelId || 'default'}`;
            if (this.cache.has(cacheKey)) {
                console.log(`💨 Cache hit: ${cacheKey}`);
                return this.cache.get(cacheKey);
            }

            if (this.useHttp) {
                const params = new URLSearchParams();
                if (funnelId) params.set('funnelId', funnelId);
                const res = await fetch(`${this.baseUrl}/api/components/${encodeURIComponent(componentId)}/configuration?${params.toString()}`, {
                    method: 'GET'
                });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const json = await res.json();
                this.cache.set(cacheKey, json);
                setTimeout(() => this.cache.delete(cacheKey), this.cacheTimeout);
                return json;
            }

            // Carregar do storage real (Supabase + IndexedDB)
            const stored = await this.storage.load(componentId, funnelId);

            if (stored) {
                // Cachear resultado
                this.cache.set(cacheKey, stored.properties);
                setTimeout(() => this.cache.delete(cacheKey), this.cacheTimeout);

                console.log(`✅ Configuration loaded: ${componentId}`, stored.properties);
                return stored.properties;
            }

            // Retornar configuração padrão se não encontrar
            const defaultConfig = await this.getDefaultConfiguration(componentId);
            console.log(`⚙️ Using default configuration: ${componentId}`, defaultConfig);
            return defaultConfig;

        } catch (error) {
            console.error(`❌ Error loading configuration for ${componentId}:`, error);
            return await this.getDefaultConfiguration(componentId);
        }
    }

    /**
     * 📤 UPDATE CONFIGURATION
     */
    async updateConfiguration(componentId: string, properties: Record<string, any>, funnelId?: string): Promise<void> {
        try {
            console.log(`📤 UPDATE Configuration: ${componentId}`, properties);

            // Limpar cache
            const cacheKey = `${componentId}:${funnelId || 'default'}`;
            this.cache.delete(cacheKey);

            if (this.useHttp) {
                const params = new URLSearchParams();
                if (funnelId) params.set('funnelId', funnelId);
                const res = await fetch(`${this.baseUrl}/api/components/${encodeURIComponent(componentId)}/configuration?${params.toString()}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(properties)
                });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
            } else {
                // Salvar no storage real (Supabase + IndexedDB)
                await this.storage.save({
                    componentId,
                    funnelId,
                    properties,
                    version: 1,
                    lastModified: new Date(),
                    createdBy: 'api-user',
                    metadata: {
                        source: 'api'
                    }
                });
            }

            console.log(`✅ Configuration updated: ${componentId}`);

        } catch (error) {
            console.error(`❌ Error updating configuration for ${componentId}:`, error);
            throw error;
        }
    }

    /**
     * 🔧 UPDATE PROPERTY
     */
    async updateProperty(componentId: string, propertyKey: string, value: any, funnelId?: string): Promise<void> {
        try {
            console.log(`🔧 UPDATE Property: ${componentId}.${propertyKey} = ${value}`);

            // Carregar configuração atual
            const currentConfig = await this.getConfiguration(componentId, funnelId);
            
            // Atualizar propriedade específica
            const updatedConfig = {
                ...currentConfig,
                [propertyKey]: value
            };

            // Salvar configuração atualizada
            await this.updateConfiguration(componentId, updatedConfig, funnelId);

            console.log(`✅ Property updated: ${componentId}.${propertyKey}`);

        } catch (error) {
            console.error(`❌ Error updating property ${propertyKey} for ${componentId}:`, error);
            throw error;
        }
    }

    /**
     * 📊 GET STATS
     */
    async getConfigurationStats(funnelId?: string): Promise<{ 
        totalConfigurations: number; 
        byComponent: Record<string, number>;
        lastModified: string;
    }> {
        try {
            const stats = await this.storage.getStats(funnelId);
            
            return {
                totalConfigurations: stats.totalConfigurations,
                byComponent: stats.byComponent,
                lastModified: stats.lastModified.toISOString()
            };

        } catch (error) {
            console.error('❌ Error getting configuration stats:', error);
            return {
                totalConfigurations: 0,
                byComponent: {},
                lastModified: new Date().toISOString()
            };
        }
    }

    /**
     * 📦 EXPORT CONFIGURATIONS
     */
    async exportConfigurations(funnelId?: string): Promise<string> {
        try {
            console.log(`📦 EXPORT Configurations${funnelId ? ` for funnel: ${funnelId}` : ' (all)'}`);

            const backup = await this.storage.backup(funnelId);
            const exportData = {
                version: '2.0',
                timestamp: new Date().toISOString(),
                funnelId,
                configurations: backup
            };

            return JSON.stringify(exportData, null, 2);

        } catch (error) {
            console.error('❌ Error exporting configurations:', error);
            throw error;
        }
    }

    /**
     * 📥 IMPORT CONFIGURATIONS
     */
    async importConfigurations(jsonData: string): Promise<{ imported: number; errors: string[] }> {
        try {
            console.log('📥 IMPORT Configurations');

            const data = JSON.parse(jsonData);
            const configurations = data.configurations || data;
            
            const errors: string[] = [];
            let imported = 0;

            for (const [key, config] of Object.entries(configurations as Record<string, StoredConfiguration>)) {
                try {
                    await this.storage.save(config);
                    imported++;
                } catch (error) {
                    errors.push(`${key}: ${error}`);
                }
            }

            console.log(`✅ Import completed: ${imported} imported, ${errors.length} errors`);
            return { imported, errors };

        } catch (error) {
            console.error('❌ Error importing configurations:', error);
            throw error;
        }
    }

    /**
     * 🔄 RESET TO DEFAULTS
     */
    async resetToDefaults(componentId: string, funnelId?: string): Promise<void> {
        try {
            console.log(`🔄 RESET to defaults: ${componentId}`);

            // Deletar configuração atual
            await this.storage.delete(componentId, funnelId);

            // Limpar cache
            const cacheKey = `${componentId}:${funnelId || 'default'}`;
            this.cache.delete(cacheKey);

            console.log(`🔄 Reset to defaults: ${componentId}`);
        } catch (error) {
            console.error(`❌ Error resetting ${componentId}:`, error);
            throw error;
        }
    }

    /**
     * 🎯 GET COMPONENT DEFINITION
     */
    async getComponentDefinition(componentId: string): Promise<ComponentDefinition> {
        // Definições básicas para os componentes principais
        const definitions: Record<string, ComponentDefinition> = {
            'quiz-global-config': {
                id: 'quiz-global-config',
                name: 'Quiz Global Configuration',
                description: 'Configurações globais do quiz',
                category: 'global',
                properties: {
                    primaryColor: { type: 'string', default: '#B89B7A' },
                    secondaryColor: { type: 'string', default: '#432818' },
                    fontFamily: { type: 'string', default: 'Inter, sans-serif' }
                }
            },
            'quiz-theme-config': {
                id: 'quiz-theme-config',
                name: 'Quiz Theme Configuration',
                description: 'Configurações de tema visual',
                category: 'theme',
                properties: {
                    backgroundColor: { type: 'string', default: '#fefefe' },
                    textColor: { type: 'string', default: '#5b4135' },
                    borderRadius: { type: 'number', default: 8 }
                }
            },
            'quiz-options-grid': {
                id: 'quiz-options-grid',
                name: 'Quiz Options Grid',
                description: 'Grid de opções do quiz',
                category: 'question',
                properties: {
                    columns: { type: 'number', default: 2 },
                    gridGap: { type: 'number', default: 16 },
                    showShadows: { type: 'boolean', default: true }
                }
            }
        };

        return definitions[componentId] || {
            id: componentId,
            name: componentId,
            description: `Component definition for ${componentId}`,
            category: 'general',
            properties: {}
        };
    }

    /**
     * ⚙️ GET DEFAULT CONFIGURATION
     */
    private async getDefaultConfiguration(componentId: string): Promise<Record<string, any>> {
        const definition = await this.getComponentDefinition(componentId);
        const defaultConfig: Record<string, any> = {};

        for (const [key, prop] of Object.entries(definition.properties)) {
            defaultConfig[key] = prop.default;
        }

        return defaultConfig;
    }

    /**
     * 🧹 CLEAR CACHE
     */
    clearCache(): void {
        this.cache.clear();
        this.storage.clearCache();
        console.log('🧹 Configuration cache cleared');
    }

    /**
     * 📊 GET CACHE STATS
     */
    getCacheStats(): { size: number; entries: string[] } {
        return {
            size: this.cache.size,
            entries: Array.from(this.cache.keys())
        };
    }
}

// ============================================================================
// API ROUTES (para implementar no servidor)
// ============================================================================

export const configurationApiRoutes = {
    // GET /api/components/:componentId/configuration
    getConfiguration: async (componentId: string, funnelId?: string) => {
        return ConfigurationAPI.getInstance().getConfiguration(componentId, funnelId);
    },

    // PUT /api/components/:componentId/configuration  
    updateConfiguration: async (componentId: string, properties: Record<string, any>, funnelId?: string) => {
        return ConfigurationAPI.getInstance().updateConfiguration(componentId, properties, funnelId);
    },

    // POST /api/components/:componentId/properties/:propertyKey
    updateProperty: async (componentId: string, propertyKey: string, value: any, funnelId?: string) => {
        return ConfigurationAPI.getInstance().updateProperty(componentId, propertyKey, value, funnelId);
    },

    // GET /api/components/:componentId/definition
    getComponentDefinition: async (componentId: string) => {
        return ConfigurationAPI.getInstance().getComponentDefinition(componentId);
    },

    // GET /api/configurations/stats
    getStats: async (funnelId?: string) => {
        return ConfigurationAPI.getInstance().getConfigurationStats(funnelId);
    },

    // GET /api/configurations/export
    exportConfigurations: async (funnelId?: string) => {
        return ConfigurationAPI.getInstance().exportConfigurations(funnelId);
    },

    // POST /api/configurations/import
    importConfigurations: async (jsonData: string) => {
        return ConfigurationAPI.getInstance().importConfigurations(jsonData);
    },

    // POST /api/components/:componentId/reset
    resetToDefaults: async (componentId: string, funnelId?: string) => {
        return ConfigurationAPI.getInstance().resetToDefaults(componentId, funnelId);
    }
};

export default ConfigurationAPI;
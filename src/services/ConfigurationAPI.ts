/**
 * 🔌 CONFIGURATION API SERVICE
 * 
 * API REST para controle completo de configurações
 * dos componentes via /editor
 */

import { ComponentDefinition, ComponentConfigurationAPI } from '@/types/componentConfiguration';

// ============================================================================
// CONFIGURATION STORAGE
// ============================================================================

interface StoredConfiguration {
    componentId: string;
    funnelId?: string;
    properties: Record<string, any>;
    version: number;
    lastModified: Date;
    createdBy?: string;
    metadata: {
        environment: 'development' | 'staging' | 'production';
        source: 'api' | 'editor' | 'import';
    };
}

// ============================================================================
// IN-MEMORY STORAGE (Para desenvolvimento - depois substituir por DB)
// ============================================================================

class ConfigurationStorage {
    private static configurations = new Map<string, StoredConfiguration>();

    private static generateKey(componentId: string, funnelId?: string): string {
        return funnelId ? `${componentId}:${funnelId}` : componentId;
    }

    static async save(config: StoredConfiguration): Promise<void> {
        const key = this.generateKey(config.componentId, config.funnelId);
        this.configurations.set(key, {
            ...config,
            lastModified: new Date(),
            version: (this.configurations.get(key)?.version || 0) + 1
        });

        console.log(`💾 Configuration saved: ${key}`, config.properties);
    }

    static async load(componentId: string, funnelId?: string): Promise<StoredConfiguration | null> {
        const key = this.generateKey(componentId, funnelId);
        return this.configurations.get(key) || null;
    }

    static async list(funnelId?: string): Promise<StoredConfiguration[]> {
        const results: StoredConfiguration[] = [];
        for (const [key, config] of this.configurations.entries()) {
            if (!funnelId || config.funnelId === funnelId) {
                results.push(config);
            }
        }
        return results;
    }

    static async delete(componentId: string, funnelId?: string): Promise<boolean> {
        const key = this.generateKey(componentId, funnelId);
        return this.configurations.delete(key);
    }

    static async backup(): Promise<Record<string, StoredConfiguration>> {
        return Object.fromEntries(this.configurations.entries());
    }

    static async restore(backup: Record<string, StoredConfiguration>): Promise<void> {
        this.configurations.clear();
        for (const [key, config] of Object.entries(backup)) {
            this.configurations.set(key, config);
        }
    }
}

// ============================================================================
// CONFIGURATION API CLASS
// ============================================================================

export class ConfigurationAPI implements ComponentConfigurationAPI {
    private static instance: ConfigurationAPI;
    private cache = new Map<string, any>();
    private cacheTimeout = 5 * 60 * 1000; // 5 minutos
    private useHttp = typeof window !== 'undefined' && (import.meta as any)?.env?.VITE_CONFIG_API_HTTP === 'true';
    private baseUrl = typeof window !== 'undefined' ? '' : '';

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

            // Carregar do storage (fallback local em dev)
            const stored = await ConfigurationStorage.load(componentId, funnelId);

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
     * 💾 UPDATE CONFIGURATION
     */
    async updateConfiguration(
        componentId: string,
        properties: Record<string, any>,
        funnelId?: string
    ): Promise<void> {
        try {
            console.log(`💾 UPDATE Configuration: ${componentId}`, properties);

            // Validar propriedades
            const validation = await this.validateProperties(componentId, properties);
            if (!validation.isValid) {
                throw new Error(`Validation failed: ${validation.errors.map(e => e.message).join(', ')}`);
            }

            if (this.useHttp) {
                const res = await fetch(`${this.baseUrl}/api/components/${encodeURIComponent(componentId)}/configuration`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ properties, funnelId })
                });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
            } else {
                // Salvar no storage
                await ConfigurationStorage.save({
                    componentId,
                    funnelId,
                    properties,
                    version: 1,
                    lastModified: new Date(),
                    metadata: {
                        environment: 'development',
                        source: 'api'
                    }
                });
            }

            // Invalidar cache
            const cacheKey = `${componentId}:${funnelId || 'default'}`;
            this.cache.delete(cacheKey);

            // Notificar mudança em tempo real (WebSocket ou Server-Sent Events)
            await this.notifyConfigurationChange(componentId, properties, funnelId);

            console.log(`✅ Configuration updated: ${componentId}`);

        } catch (error) {
            console.error(`❌ Error updating configuration for ${componentId}:`, error);
            throw error;
        }
    }

    /**
     * 🔧 UPDATE SINGLE PROPERTY
     */
    async updateProperty(
        componentId: string,
        propertyKey: string,
        value: any,
        funnelId?: string
    ): Promise<void> {
        try {
            console.log(`🔧 UPDATE Property: ${componentId}.${propertyKey} = ${value}`);

            if (this.useHttp) {
                const res = await fetch(`${this.baseUrl}/api/components/${encodeURIComponent(componentId)}/properties/${encodeURIComponent(propertyKey)}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ value, funnelId })
                });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
            } else {
                // Carregar configuração atual
                const currentConfig = await this.getConfiguration(componentId, funnelId);

                // Atualizar propriedade específica
                const updatedConfig = {
                    ...currentConfig,
                    [propertyKey]: value
                };

                // Salvar configuração completa
                await this.updateConfiguration(componentId, updatedConfig, funnelId);
            }

            console.log(`✅ Property updated: ${componentId}.${propertyKey}`);

        } catch (error) {
            console.error(`❌ Error updating property ${propertyKey} for ${componentId}:`, error);
            throw error;
        }
    }

    /**
     * 📋 GET COMPONENT DEFINITION
     */
    async getComponentDefinition(componentId: string): Promise<ComponentDefinition> {
        // Importar definições de componentes
        const { QUIZ_COMPONENTS_DEFINITIONS } = await import('@/types/componentConfiguration');

        const definition = QUIZ_COMPONENTS_DEFINITIONS[componentId];
        if (!definition) {
            throw new Error(`Component definition not found: ${componentId}`);
        }

        return definition;
    }

    /**
     * ✅ VALIDATE PROPERTIES
     */
    private async validateProperties(
        componentId: string,
        properties: Record<string, any>
    ): Promise<{ isValid: boolean; errors: Array<{ property: string; message: string }> }> {
        try {
            const definition = await this.getComponentDefinition(componentId);
            const errors: Array<{ property: string; message: string }> = [];

            // Validar cada propriedade
            for (const propDef of definition.properties) {
                const value = properties[propDef.key];

                // Validação de required
                if (propDef.validation?.required && (value === undefined || value === null || value === '')) {
                    errors.push({
                        property: propDef.key,
                        message: `${propDef.label} é obrigatório`
                    });
                    continue;
                }

                // Validação de tipo e range
                if (value !== undefined) {
                    if (propDef.validation?.min !== undefined && typeof value === 'number' && value < propDef.validation.min) {
                        errors.push({
                            property: propDef.key,
                            message: `${propDef.label} deve ser pelo menos ${propDef.validation.min}`
                        });
                    }

                    if (propDef.validation?.max !== undefined && typeof value === 'number' && value > propDef.validation.max) {
                        errors.push({
                            property: propDef.key,
                            message: `${propDef.label} deve ser no máximo ${propDef.validation.max}`
                        });
                    }

                    // Validação customizada
                    if (propDef.validation?.custom) {
                        const customResult = propDef.validation.custom(value);
                        if (customResult !== true) {
                            errors.push({
                                property: propDef.key,
                                message: typeof customResult === 'string' ? customResult : `${propDef.label} é inválido`
                            });
                        }
                    }
                }
            }

            return {
                isValid: errors.length === 0,
                errors
            };

        } catch (error) {
            console.error('Validation error:', error);
            return {
                isValid: false,
                errors: [{ property: 'general', message: 'Erro na validação' }]
            };
        }
    }

    /**
     * ⚙️ GET DEFAULT CONFIGURATION
     */
    private async getDefaultConfiguration(componentId: string): Promise<Record<string, any>> {
        try {
            const definition = await this.getComponentDefinition(componentId);
            return definition.defaultProperties;
        } catch (error) {
            console.warn(`No default configuration for ${componentId}:`, error);
            return {};
        }
    }

    /**
     * 📢 NOTIFY CONFIGURATION CHANGE (Real-time updates)
     */
    private async notifyConfigurationChange(
        componentId: string,
        properties: Record<string, any>,
        funnelId?: string
    ): Promise<void> {
        // Implementar WebSocket ou Server-Sent Events para updates em tempo real
        // Por enquanto, apenas log
        console.log(`📢 Configuration change notification: ${componentId}`, {
            componentId,
            funnelId,
            properties,
            timestamp: new Date().toISOString()
        });

        // TODO: Implementar notificação real-time
        // - WebSocket para /editor
        // - Server-Sent Events para /quiz-estilo 
        // - Cache invalidation
    }

    // ============================================================================
    // MANAGEMENT ENDPOINTS
    // ============================================================================

    /**
     * 📊 GET CONFIGURATION STATS
     */
    async getConfigurationStats(funnelId?: string): Promise<{
        totalConfigurations: number;
        componentBreakdown: Record<string, number>;
        lastModified: Date | null;
    }> {
        const configurations = await ConfigurationStorage.list(funnelId);

        const componentBreakdown: Record<string, number> = {};
        let lastModified: Date | null = null;

        configurations.forEach(config => {
            componentBreakdown[config.componentId] = (componentBreakdown[config.componentId] || 0) + 1;
            if (!lastModified || config.lastModified > lastModified) {
                lastModified = config.lastModified;
            }
        });

        return {
            totalConfigurations: configurations.length,
            componentBreakdown,
            lastModified
        };
    }

    /**
     * 🗄️ EXPORT CONFIGURATIONS
     */
    async exportConfigurations(funnelId?: string): Promise<string> {
        const configurations = await ConfigurationStorage.list(funnelId);
        return JSON.stringify(configurations, null, 2);
    }

    /**
     * 📥 IMPORT CONFIGURATIONS
     */
    async importConfigurations(jsonData: string): Promise<void> {
        try {
            const configurations = JSON.parse(jsonData);

            for (const config of configurations) {
                await ConfigurationStorage.save(config);
            }

            // Invalidar cache
            this.cache.clear();

            console.log(`✅ Imported ${configurations.length} configurations`);

        } catch (error) {
            console.error('❌ Error importing configurations:', error);
            throw error;
        }
    }

    /**
     * 🔄 RESET TO DEFAULTS
     */
    async resetToDefaults(componentId: string, funnelId?: string): Promise<void> {
        const defaultConfig = await this.getDefaultConfiguration(componentId);
        await this.updateConfiguration(componentId, defaultConfig, funnelId);
        console.log(`🔄 Reset to defaults: ${componentId}`);
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
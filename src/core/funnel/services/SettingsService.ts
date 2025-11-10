/**
 * 🎯 SETTINGS SERVICE
 * 
 * Serviço centralizado para gerenciar configurações de funis
 * Suporte para Supabase + LocalStorage fallback
 */

import { supabase } from '@/services/integrations/supabase/customClient';
import { FunnelSettings, FunnelTheme } from '../types';
import { appLogger } from '@/lib/utils/appLogger';

// ============================================================================
// INTERFACES
// ============================================================================

export interface DefaultSettingsOptions {
    theme?: Partial<FunnelTheme>;
    analytics?: boolean;
    autoSave?: boolean;
}

export interface SettingsValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
}

// ============================================================================
// CONFIGURAÇÕES PADRÃO
// ============================================================================

export const defaultFunnelSettings: FunnelSettings = {
    autoSave: true,
    autoAdvance: false,
    progressTracking: true,
    analytics: true,
    theme: {
        primaryColor: '#3b82f6',
        secondaryColor: '#64748b',
        fontFamily: 'Inter, sans-serif',
        borderRadius: '8px',
        spacing: '16px',
        layout: 'centered',
    },
    navigation: {
        showProgress: true,
        showStepNumbers: true,
        allowBackward: true,
        showNavigationButtons: true,
        autoAdvanceDelay: 3000,
    },
    validation: {
        strictMode: false,
        requiredFields: [],
        customValidators: {},
    },
};

// ============================================================================
// SETTINGS SERVICE CLASS
// ============================================================================

export class SettingsService {
    private static instance: SettingsService;
    private cache: Map<string, FunnelSettings> = new Map();

    private constructor() { }

    /**
     * Singleton instance
     */
    static getInstance(): SettingsService {
        if (!this.instance) {
            this.instance = new SettingsService();
        }
        return this.instance;
    }

    // ============================================================================
    // CRUD OPERATIONS
    // ============================================================================

    /**
     * Carrega configurações de um funil
     */
    async loadSettings(funnelId: string): Promise<FunnelSettings> {
        appLogger.info(`📥 Carregando configurações do funil: ${funnelId}`);

        // Verificar cache primeiro
        if (this.cache.has(funnelId)) {
            appLogger.info('🚀 Configurações encontradas no cache');
            return this.cache.get(funnelId)!;
        }

        try {
            if (!supabase) {
                appLogger.warn('⚠️ Supabase não disponível, carregando do localStorage');
                return this.loadFromLocalStorage(funnelId);
            }

            const { data, error } = await supabase
                .from('funnels')
                .select('config') // Mudado de 'settings' para 'config'
                .eq('id', funnelId)
                .single();

            if (error) {
                appLogger.error('❌ Erro ao carregar configurações:', { data: [error] });

                // Se funil não existe, retornar configurações padrão
                if (error.code === 'PGRST116') {
                    appLogger.info('ℹ️ Funil não encontrado, usando configurações padrão');
                    return this.getDefaultSettings();
                }

                return this.loadFromLocalStorage(funnelId);
            }

            // Se não há configurações salvas, retornar padrão
            if (!data?.config) {
                appLogger.info('ℹ️ Nenhuma configuração encontrada, usando padrão');
                return this.getDefaultSettings();
            }

            // Mesclar com configurações padrão para garantir completude
            const settings = this.mergeWithDefaults(data.config as any); // Mudado de 'settings' para 'config'

            // Cachear para próximas consultas
            this.cache.set(funnelId, settings);

            appLogger.info('✅ Configurações carregadas:', { data: [settings] });
            return settings;
        } catch (error) {
            appLogger.error('Error in loadSettings:', { data: [error] });
            return this.loadFromLocalStorage(funnelId);
        }
    }

    /**
     * Salva configurações de um funil
     */
    async saveSettings(funnelId: string, settings: FunnelSettings): Promise<boolean> {
        appLogger.info(`💾 Salvando configurações do funil: ${funnelId}`);

        // Validar configurações
        const validation = this.validateSettings(settings);
        if (!validation.isValid) {
            appLogger.error('❌ Configurações inválidas:', { data: [validation.errors] });
            throw new Error(`Invalid settings: ${validation.errors.join(', ')}`);
        }

        try {
            if (!supabase) {
                appLogger.warn('⚠️ Supabase não disponível, salvando apenas no localStorage');
                return this.saveToLocalStorage(funnelId, settings);
            }

            // Salvar no Supabase
            const { error } = await supabase
                .from('funnels')
                .update({
                    settings: settings as any,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', funnelId);

            if (error) {
                appLogger.error('❌ Erro ao salvar configurações no Supabase:', { data: [error] });
                return this.saveToLocalStorage(funnelId, settings);
            }

            // Atualizar cache
            this.cache.set(funnelId, settings);

            // Backup no localStorage
            this.saveToLocalStorage(funnelId, settings);

            appLogger.info(`✅ Configurações salvas: ${funnelId}`);
            return true;
        } catch (error) {
            appLogger.error('Error in saveSettings:', { data: [error] });
            return this.saveToLocalStorage(funnelId, settings);
        }
    }

    /**
     * Remove configurações de um funil
     */
    async deleteSettings(funnelId: string): Promise<boolean> {
        appLogger.info(`🗑️ Removendo configurações do funil: ${funnelId}`);

        try {
            if (supabase) {
                const { error } = await supabase
                    .from('funnels')
                    .update({
                        settings: null,
                        updated_at: new Date().toISOString(),
                    })
                    .eq('id', funnelId);

                if (error) {
                    appLogger.error('❌ Erro ao remover configurações:', { data: [error] });
                }
            }

            // Remover do cache e localStorage
            this.cache.delete(funnelId);
            this.deleteFromLocalStorage(funnelId);

            appLogger.info(`✅ Configurações removidas: ${funnelId}`);
            return true;
        } catch (error) {
            appLogger.error('Error in deleteSettings:', { data: [error] });
            return false;
        }
    }

    // ============================================================================
    // UTILITY METHODS
    // ============================================================================

    /**
     * Obtém configurações padrão
     */
    getDefaultSettings(options?: DefaultSettingsOptions): FunnelSettings {
        const defaults = { ...defaultFunnelSettings };

        if (options) {
            if (options.theme) {
                defaults.theme = { ...defaults.theme, ...options.theme };
            }
            if (options.analytics !== undefined) defaults.analytics = options.analytics;
            if (options.autoSave !== undefined) defaults.autoSave = options.autoSave;
        }

        return defaults;
    }

    /**
     * Mescla configurações com padrões
     */
    private mergeWithDefaults(settings: any): FunnelSettings {
        return {
            ...defaultFunnelSettings,
            ...settings,
            theme: {
                ...defaultFunnelSettings.theme,
                ...settings?.theme,
            },
            navigation: {
                ...defaultFunnelSettings.navigation,
                ...settings?.navigation,
            },
            validation: {
                ...defaultFunnelSettings.validation,
                ...settings?.validation,
            },
        };
    }

    /**
     * Valida configurações
     */
    validateSettings(settings: FunnelSettings): SettingsValidationResult {
        const errors: string[] = [];
        const warnings: string[] = [];

        // Validações básicas
        if (!settings.theme || typeof settings.theme !== 'object') {
            errors.push('Theme must be a valid theme object');
        }

        if (typeof settings.analytics !== 'boolean') {
            errors.push('Analytics must be a boolean value');
        }

        if (typeof settings.autoSave !== 'boolean') {
            errors.push('AutoSave must be a boolean value');
        }

        // Validações de tema
        if (settings.theme) {
            if (!settings.theme.primaryColor || typeof settings.theme.primaryColor !== 'string') {
                errors.push('Theme primary color is required and must be a string');
            }

            if (!settings.theme.layout || !['centered', 'full-width', 'sidebar'].includes(settings.theme.layout)) {
                errors.push('Theme layout must be centered, full-width, or sidebar');
            }
        }

        // Validações de navegação
        if (settings.navigation) {
            if (typeof settings.navigation.autoAdvanceDelay !== 'number' || settings.navigation.autoAdvanceDelay < 0) {
                warnings.push('Auto advance delay should be a positive number');
            }
        }

        return {
            isValid: errors.length === 0,
            errors,
            warnings,
        };
    }

    /**
     * Limpa cache de configurações
     */
    clearCache(funnelId?: string): void {
        if (funnelId) {
            this.cache.delete(funnelId);
            appLogger.info(`🧹 Cache limpo para funil: ${funnelId}`);
        } else {
            this.cache.clear();
            appLogger.info('🧹 Cache completo limpo');
        }
    }

    // ============================================================================
    // LOCALSTORAGE METHODS
    // ============================================================================

    private loadFromLocalStorage(funnelId: string): FunnelSettings {
        try {
            const stored = localStorage.getItem(`funnel-settings-${funnelId}`);
            if (stored) {
                appLogger.info('📱 Configurações carregadas do localStorage');
                const settings = JSON.parse(stored);
                return this.mergeWithDefaults(settings);
            }
        } catch (error) {
            appLogger.error('❌ Erro ao carregar do localStorage:', { data: [error] });
        }

        return this.getDefaultSettings();
    }

    private saveToLocalStorage(funnelId: string, settings: FunnelSettings): boolean {
        try {
            localStorage.setItem(`funnel-settings-${funnelId}`, JSON.stringify(settings));
            appLogger.info('📱 Configurações salvas no localStorage');
            return true;
        } catch (error) {
            appLogger.error('❌ Erro ao salvar no localStorage:', { data: [error] });
            return false;
        }
    }

    private deleteFromLocalStorage(funnelId: string): void {
        try {
            localStorage.removeItem(`funnel-settings-${funnelId}`);
            appLogger.info('📱 Configurações removidas do localStorage');
        } catch (error) {
            appLogger.error('❌ Erro ao remover do localStorage:', { data: [error] });
        }
    }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const settingsService = SettingsService.getInstance();

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Helper para validar se configurações estão completas
 */
export function isSettingsComplete(settings: FunnelSettings): boolean {
    return !!(
        settings.theme &&
        settings.theme.primaryColor &&
        settings.navigation &&
        settings.validation &&
        typeof settings.analytics === 'boolean'
    );
}

/**
 * Helper para gerar configurações de teste
 */
export function generateTestSettings(_funnelId: string): FunnelSettings {
    return {
        ...defaultFunnelSettings,
        theme: {
            ...defaultFunnelSettings.theme,
            primaryColor: '#ff6b6b',
            secondaryColor: '#4ecdc4',
        },
        analytics: true,
        progressTracking: true,
        navigation: {
            ...defaultFunnelSettings.navigation,
            showProgress: true,
            allowBackward: true,
        },
    };
}

/**
 * 🎯 HOOK PARA CONFIGURAÇÕES DE FUNIL
 * 
 * Hook React para acessar configurações de forma reativa
 * Gerencia automaticamente cache, loading e re-renders
 */

import { useState, useEffect, useCallback } from 'react';
import {
    configurationService,
    type MergedConfiguration,
    type ConfigurationContext,
    getCurrentFunnelConfiguration
} from '@/services/ConfigurationService';

// ============================================================================
// TIPOS DO HOOK
// ============================================================================

export interface UseConfigurationOptions {
    funnelId?: string;
    environment?: string;
    overrides?: Partial<MergedConfiguration>;
    autoRefresh?: boolean;
    refreshInterval?: number;
}

export interface UseConfigurationReturn {
    config: MergedConfiguration | null;
    isLoading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
    updateOverrides: (overrides: Partial<MergedConfiguration>) => void;
    validate: () => { isValid: boolean; errors: string[]; warnings: string[] };
}

// ============================================================================
// HOOK PRINCIPAL
// ============================================================================

/**
 * 🎯 Hook para acessar configurações de funil
 */
export function useConfiguration(options: UseConfigurationOptions = {}): UseConfigurationReturn {
    const [config, setConfig] = useState<MergedConfiguration | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [overrides, setOverrides] = useState<Partial<MergedConfiguration> | undefined>(options.overrides);

    // Função para carregar configuração
    const loadConfiguration = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            let loadedConfig: MergedConfiguration;

            if (options.funnelId) {
                // Carregar configuração específica
                const context: ConfigurationContext = {
                    funnelId: options.funnelId,
                    environment: options.environment || 'development',
                    overrides: overrides
                };
                loadedConfig = await configurationService.getConfiguration(context);
            } else {
                // Auto-detectar funil atual
                loadedConfig = await getCurrentFunnelConfiguration();

                // Aplicar overrides se fornecidos
                if (overrides) {
                    loadedConfig = { ...loadedConfig, ...overrides };
                }
            }

            setConfig(loadedConfig);
            console.log(`✅ [useConfiguration] Configuração carregada para funil: ${loadedConfig.funnel.id}`);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao carregar configuração';
            setError(errorMessage);
            console.error(`❌ [useConfiguration] Erro ao carregar configuração:`, err);
        } finally {
            setIsLoading(false);
        }
    }, [options.funnelId, options.environment, overrides]);

    // Carregar configuração inicial
    useEffect(() => {
        loadConfiguration();
    }, [loadConfiguration]);

    // Auto-refresh se habilitado
    useEffect(() => {
        if (options.autoRefresh && options.refreshInterval) {
            const interval = setInterval(loadConfiguration, options.refreshInterval);
            return () => clearInterval(interval);
        }
    }, [options.autoRefresh, options.refreshInterval, loadConfiguration]);

    // Função para atualizar overrides
    const updateOverrides = useCallback((newOverrides: Partial<MergedConfiguration>) => {
        setOverrides(prev => ({ ...prev, ...newOverrides }));
    }, []);

    // Função de validação
    const validate = useCallback(() => {
        if (!config) {
            return { isValid: false, errors: ['Configuração não carregada'], warnings: [] };
        }
        return configurationService.validateConfiguration(config);
    }, [config]);

    return {
        config,
        isLoading,
        error,
        refresh: loadConfiguration,
        updateOverrides,
        validate
    };
}

// ============================================================================
// HOOKS ESPECIALIZADOS
// ============================================================================

/**
 * 🎯 Hook para configurações de SEO
 */
export function useSEOConfiguration(funnelId?: string) {
    const { config, isLoading, error } = useConfiguration({ funnelId });

    const metaTags = config ? configurationService.generateMetaTags(config) : null;

    return {
        seo: config?.seo || null,
        metaTags,
        isLoading,
        error
    };
}

/**
 * 🎯 Hook para configurações de tracking
 */
export function useTrackingConfiguration(funnelId?: string) {
    const { config, isLoading, error } = useConfiguration({ funnelId });

    const trackingConfig = config ? configurationService.generateTrackingConfig(config) : null;

    return {
        tracking: config?.analytics || null,
        utm: config?.utm || null,
        trackingConfig,
        isLoading,
        error
    };
}

/**
 * 🎯 Hook para configurações de tema
 */
export function useThemeConfiguration(funnelId?: string) {
    const { config, isLoading, error } = useConfiguration({ funnelId });

    return {
        branding: config?.branding || null,
        colors: config?.branding ? {
            primary: config.branding.primaryColor,
            secondary: config.branding.secondaryColor,
            accent: config.branding.accentColor
        } : null,
        fonts: config?.branding?.fontFamily || null,
        logo: config?.branding?.logoUrl || null,
        isLoading,
        error
    };
}

/**
 * 🎯 Hook para configurações de comportamento do funil
 */
export function useFunnelBehavior(funnelId?: string) {
    const { config, isLoading, error } = useConfiguration({ funnelId });

    return {
        behavior: config?.behavior || null,
        results: config?.results || null,
        webhooks: config?.webhooks || null,
        isLoading,
        error
    };
}

// ============================================================================
// HOOKS PARA CONTEXTO (SEM JSX)
// ============================================================================

/**
 * 🎯 Hook para gerenciar configuração global do app
 */
export function useGlobalConfiguration() {
    const [globalState, setGlobalState] = useState<{
        config: MergedConfiguration | null;
        funnelId: string;
        isLoading: boolean;
        error: string | null;
    }>({
        config: null,
        funnelId: 'unknown',
        isLoading: true,
        error: null
    });

    const loadGlobalConfig = useCallback(async (funnelId?: string) => {
        setGlobalState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            const config = funnelId
                ? await configurationService.getConfiguration({
                    funnelId,
                    environment: 'development'
                })
                : await getCurrentFunnelConfiguration();

            setGlobalState({
                config,
                funnelId: config.funnel.id,
                isLoading: false,
                error: null
            });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar configuração global';
            setGlobalState(prev => ({
                ...prev,
                isLoading: false,
                error: errorMessage
            }));
        }
    }, []);

    return {
        ...globalState,
        loadGlobalConfig
    };
}

// ============================================================================
// HOOKS UTILITÁRIOS
// ============================================================================

/**
 * 🔍 Hook para debug de configurações
 */
export function useConfigurationDebug(funnelId?: string) {
    const { config, isLoading, error, validate } = useConfiguration({ funnelId });

    const debugInfo = config ? {
        funnelId: config.funnel.id,
        environment: config.environment.environment,
        hasGlobalSEO: !!config.seo.defaultTitle,
        hasTracking: !!config.analytics.googleAnalytics.enabled,
        hasUTM: !!(config.utm.source && config.utm.medium),
        validation: validate()
    } : null;

    return {
        config,
        debugInfo,
        isLoading,
        error,
        validate
    };
}

/**
 * 🎛️ Hook para lista de funis disponíveis
 */
export function useAvailableFunnels() {
    const [funnels, setFunnels] = useState<string[]>([]);

    useEffect(() => {
        const availableFunnels = configurationService.getAvailableFunnels();
        setFunnels(availableFunnels);
    }, []);

    return funnels;
}

// Exports
export default useConfiguration;

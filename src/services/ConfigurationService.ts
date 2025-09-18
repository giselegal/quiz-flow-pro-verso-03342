/**
 * 🔧 CONFIGURATION SERVICE
 * 
 * Serviço responsável por gerenciar e mesclar configurações:
 * - Configurações globais do app (AppConfig)
 * - Configurações específicas do funil (FunnelConfig)
 * - Sistema de herança e sobrescrita
 */

import { APP_CONFIG, type AppConfig } from '@/config/AppConfig';
import { QUIZ21_STEPS_CONFIG, type FunnelConfig, mergeFunnelWithAppConfig } from '@/templates/funnel-configs/quiz21StepsComplete.config';

// ============================================================================
// TIPOS E INTERFACES
// ============================================================================

export interface MergedConfiguration extends AppConfig {
    funnel: FunnelConfig['funnel'];
    utm: FunnelConfig['utm'];
    behavior: FunnelConfig['behavior'];
    results: FunnelConfig['results'];
    webhooks?: FunnelConfig['webhooks'];
}

export interface ConfigurationContext {
    funnelId: string;
    environment: string;
    overrides?: Partial<MergedConfiguration>;
}

// ============================================================================
// REGISTRY DE CONFIGURAÇÕES DE FUNIS
// ============================================================================

const FUNNEL_CONFIGS_REGISTRY: Record<string, FunnelConfig> = {
    'quiz21StepsComplete': QUIZ21_STEPS_CONFIG,
    'quiz-estilo-21-steps': QUIZ21_STEPS_CONFIG, // Alias
    // Futuros funis serão adicionados aqui
    // 'personalityQuiz': PERSONALITY_QUIZ_CONFIG,
    // 'businessQuiz': BUSINESS_QUIZ_CONFIG,
};

// ============================================================================
// CONFIGURATION SERVICE CLASS
// ============================================================================

export class ConfigurationService {
    private static instance: ConfigurationService;
    private cache = new Map<string, MergedConfiguration>();
    private cacheTimeout = 5 * 60 * 1000; // 5 minutos

    private constructor() { }

    static getInstance(): ConfigurationService {
        if (!ConfigurationService.instance) {
            ConfigurationService.instance = new ConfigurationService();
        }
        return ConfigurationService.instance;
    }

    /**
     * 🎯 MÉTODO PRINCIPAL - Obtém configuração completa para um funil
     */
    async getConfiguration(context: ConfigurationContext): Promise<MergedConfiguration> {
        const cacheKey = this.generateCacheKey(context);

        // Verificar cache
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey)!;
            console.log(`✅ [ConfigService] Cache hit para ${context.funnelId}`);
            return cached;
        }

        console.log(`🔄 [ConfigService] Gerando configuração para ${context.funnelId}...`);

        // Obter configuração do funil
        const funnelConfig = this.getFunnelConfig(context.funnelId);
        if (!funnelConfig) {
            throw new Error(`Configuração não encontrada para funil: ${context.funnelId}`);
        }

        // Mesclar configurações
        const baseConfig = mergeFunnelWithAppConfig(funnelConfig, APP_CONFIG);

        // Aplicar sobrescritas de contexto
        const finalConfig: MergedConfiguration = {
            ...baseConfig,
            utm: funnelConfig.utm,
            behavior: funnelConfig.behavior,
            results: funnelConfig.results,
            webhooks: funnelConfig.webhooks,
            ...context.overrides
        };

        // Aplicar configurações específicas de ambiente
        this.applyEnvironmentOverrides(finalConfig, context.environment);

        // Cache resultado
        this.cache.set(cacheKey, finalConfig);
        this.scheduleCacheCleanup(cacheKey);

        console.log(`✅ [ConfigService] Configuração gerada para ${context.funnelId}`);
        return finalConfig;
    }

    /**
     * Obtém configuração específica do funil
     */
    private getFunnelConfig(funnelId: string): FunnelConfig | null {
        return FUNNEL_CONFIGS_REGISTRY[funnelId] || null;
    }

    /**
     * Aplica sobrescritas específicas do ambiente
     */
    private applyEnvironmentOverrides(config: MergedConfiguration, environment: string): void {
        switch (environment) {
            case 'development':
                // Em desenvolvimento, habilitar mais logs e debug
                config.analytics.googleAnalytics.enabled = true;
                config.environment.debug = true;
                config.environment.enableDevTools = true;
                break;

            case 'staging':
                // Em staging, usar IDs de teste
                config.analytics.googleAnalytics.measurementId = 'GA-STAGING-ID';
                config.analytics.googleTagManager.containerId = 'GTM-STAGING-ID';
                break;

            case 'production':
                // Em produção, usar configurações completas
                config.environment.debug = false;
                config.environment.enableDevTools = false;
                config.environment.enablePerformanceMonitoring = true;
                break;
        }
    }

    /**
     * Gera chave de cache
     */
    private generateCacheKey(context: ConfigurationContext): string {
        const overridesHash = context.overrides ?
            btoa(JSON.stringify(context.overrides)).slice(0, 8) : 'none';
        return `${context.funnelId}_${context.environment}_${overridesHash}`;
    }

    /**
     * Agenda limpeza do cache
     */
    private scheduleCacheCleanup(key: string): void {
        setTimeout(() => {
            this.cache.delete(key);
            console.log(`🗑️ [ConfigService] Cache limpo para ${key}`);
        }, this.cacheTimeout);
    }

    /**
     * Invalida cache para um funil específico
     */
    invalidateCache(funnelId?: string): void {
        if (funnelId) {
            const keysToDelete = Array.from(this.cache.keys()).filter(key =>
                key.startsWith(funnelId)
            );
            keysToDelete.forEach(key => this.cache.delete(key));
            console.log(`🗑️ [ConfigService] Cache invalidado para funil ${funnelId}`);
        } else {
            this.cache.clear();
            console.log(`🗑️ [ConfigService] Todo cache invalidado`);
        }
    }

    /**
     * Lista funis disponíveis
     */
    getAvailableFunnels(): string[] {
        return Object.keys(FUNNEL_CONFIGS_REGISTRY);
    }

    /**
     * Obtém metadados de um funil
     */
    getFunnelMetadata(funnelId: string): FunnelConfig['funnel'] | null {
        const config = this.getFunnelConfig(funnelId);
        return config?.funnel || null;
    }

    /**
     * Valida se configuração está completa
     */
    validateConfiguration(config: MergedConfiguration): {
        isValid: boolean;
        errors: string[];
        warnings: string[];
    } {
        const errors: string[] = [];
        const warnings: string[] = [];

        // Validações obrigatórias
        if (!config.funnel.id) {
            errors.push('Funnel ID é obrigatório');
        }

        if (!config.seo.defaultTitle) {
            errors.push('SEO title é obrigatório');
        }

        if (!config.branding.primaryColor) {
            errors.push('Cor primária do branding é obrigatória');
        }

        // Validações de aviso
        if (!config.analytics.googleAnalytics.measurementId.startsWith('GA-')) {
            warnings.push('Google Analytics ID deve começar com GA-');
        }

        if (config.utm.source === '' || config.utm.medium === '') {
            warnings.push('UTM source e medium devem estar preenchidos');
        }

        return {
            isValid: errors.length === 0,
            errors,
            warnings
        };
    }

    /**
     * Gera configuração para uso em meta tags
     */
    generateMetaTags(config: MergedConfiguration): Record<string, string> {
        return {
            'charset': config.seo.charset,
            'viewport': config.seo.viewport,
            'title': config.seo.defaultTitle,
            'description': config.seo.defaultDescription,
            'keywords': config.seo.defaultKeywords.join(', '),
            'og:title': config.seo.defaultTitle,
            'og:description': config.seo.defaultDescription,
            'og:image': config.seo.defaultOgImage,
            'og:site_name': config.seo.siteName,
            'og:type': 'website',
            'theme-color': config.branding.primaryColor,
            'msapplication-TileColor': config.branding.primaryColor
        };
    }

    /**
     * Gera configuração de tracking
     */
    generateTrackingConfig(config: MergedConfiguration) {
        const tracking: any = {
            analytics: config.analytics,
            utm: config.utm
        };

        if (config.webhooks?.enabled) {
            tracking.webhooks = config.webhooks;
        }

        return tracking;
    }
}

// ============================================================================
// SINGLETON EXPORT E HELPERS
// ============================================================================

export const configurationService = ConfigurationService.getInstance();

/**
 * 🎯 Helper para obter configuração rapidamente
 */
export async function getFunnelConfiguration(
    funnelId: string,
    environment: string = 'development',
    overrides?: Partial<MergedConfiguration>
): Promise<MergedConfiguration> {
    return configurationService.getConfiguration({
        funnelId,
        environment,
        overrides
    });
}

/**
 * 🎯 Helper para obter apenas configurações globais
 */
export function getGlobalConfiguration(): AppConfig {
    return APP_CONFIG;
}

/**
 * 🎯 Helper para detectar funil ativo automaticamente
 */
export async function getCurrentFunnelConfiguration(): Promise<MergedConfiguration> {
    // Detectar funil baseado na URL ou contexto
    const currentFunnelId = detectCurrentFunnel();
    const environment = APP_CONFIG.environment.environment;

    return getFunnelConfiguration(currentFunnelId, environment);
}

/**
 * Detecta qual funil está ativo baseado na URL ou contexto
 */
function detectCurrentFunnel(): string {
    if (typeof window === 'undefined') {
        return 'quiz21StepsComplete'; // Default para SSR
    }

    const pathname = window.location.pathname;

    // Mapear rotas para funis
    const routeToFunnel: Record<string, string> = {
        '/quiz': 'quiz21StepsComplete',
        '/style-quiz': 'quiz21StepsComplete',
        '/estilo': 'quiz21StepsComplete',
        // Adicionar mais mapeamentos conforme necessário
    };

    return routeToFunnel[pathname] || 'quiz21StepsComplete';
}

/**
 * 🎯 Helper para validação rápida
 */
export async function validateCurrentConfiguration(): Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
}> {
    const config = await getCurrentFunnelConfiguration();
    return configurationService.validateConfiguration(config);
}

// Export default
export default configurationService;

/**
 * 🤖 CONFIGURAÇÃO DE IA PARA FASHION QUIZ
 * 
 * Gerencia configurações, chaves de API e providers
 * para o sistema de geração de imagens de moda.
 */

export interface AIProviderConfig {
    name: string;
    apiKey: string;
    enabled: boolean;
    priority: number;
    maxRequestsPerMinute: number;
    timeout: number;
}

export interface AIConfig {
    enabled: boolean;
    defaultProvider: string;
    fallbackProvider: string;
    providers: Record<string, AIProviderConfig>;
    quiz: {
        autoGenerate: boolean;
        imageCount: number;
        imageSize: string;
        cacheEnabled: boolean;
    };
    limits: {
        maxRequestsPerMinute: number;
        maxRequestsPerHour: number;
        timeout: number;
        retryAttempts: number;
    };
    features: {
        usageTracking: boolean;
        errorReporting: boolean;
        rateLimitEnabled: boolean;
    };
}

/**
 * Configuração padrão de IA
 */
export const DEFAULT_AI_CONFIG: AIConfig = {
    enabled: false,
    defaultProvider: 'dalle3',
    fallbackProvider: 'gemini',
    providers: {
        dalle3: {
            name: 'DALL-E 3',
            apiKey: '',
            enabled: false,
            priority: 1,
            maxRequestsPerMinute: 5,
            timeout: 30000
        },
        gemini: {
            name: 'Google Gemini',
            apiKey: '',
            enabled: false,
            priority: 2,
            maxRequestsPerMinute: 10,
            timeout: 25000
        },
        'stable-diffusion': {
            name: 'Stable Diffusion',
            apiKey: '',
            enabled: false,
            priority: 3,
            maxRequestsPerMinute: 15,
            timeout: 20000
        },
        midjourney: {
            name: 'Midjourney',
            apiKey: '',
            enabled: false,
            priority: 4,
            maxRequestsPerMinute: 3,
            timeout: 60000
        }
    },
    quiz: {
        autoGenerate: true,
        imageCount: 3,
        imageSize: '1024x1024',
        cacheEnabled: true
    },
    limits: {
        maxRequestsPerMinute: 10,
        maxRequestsPerHour: 50,
        timeout: 30000,
        retryAttempts: 2
    },
    features: {
        usageTracking: true,
        errorReporting: true,
        rateLimitEnabled: true
    }
};

/**
 * Carrega configuração de IA das variáveis de ambiente
 */
export function loadAIConfig(): AIConfig {
    const config: AIConfig = JSON.parse(JSON.stringify(DEFAULT_AI_CONFIG));

    // Configurações gerais
    config.enabled = import.meta.env.VITE_AI_ENABLED === 'true';
    config.defaultProvider = import.meta.env.VITE_AI_DEFAULT_PROVIDER || 'dalle3';
    config.fallbackProvider = import.meta.env.VITE_AI_FALLBACK_PROVIDER || 'gemini';

    // Providers
    const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (openaiKey && openaiKey !== 'sua_chave_openai_aqui') {
        config.providers.dalle3.apiKey = openaiKey;
        config.providers.dalle3.enabled = true;
    }

    const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (geminiKey && geminiKey !== 'sua_chave_gemini_aqui') {
        config.providers.gemini.apiKey = geminiKey;
        config.providers.gemini.enabled = true;
    }

    const huggingfaceKey = import.meta.env.VITE_HUGGINGFACE_API_KEY;
    if (huggingfaceKey && huggingfaceKey !== 'sua_chave_huggingface_aqui') {
        config.providers['stable-diffusion'].apiKey = huggingfaceKey;
        config.providers['stable-diffusion'].enabled = true;
    }

    const midjourneyKey = import.meta.env.VITE_MIDJOURNEY_API_KEY;
    if (midjourneyKey && midjourneyKey !== 'sua_chave_midjourney_aqui') {
        config.providers.midjourney.apiKey = midjourneyKey;
        config.providers.midjourney.enabled = true;
    }

    // Configurações do quiz
    config.quiz.autoGenerate = import.meta.env.VITE_QUIZ_AI_AUTO_GENERATE !== 'false';
    config.quiz.imageCount = parseInt(import.meta.env.VITE_QUIZ_AI_IMAGE_COUNT || '3');
    config.quiz.imageSize = import.meta.env.VITE_QUIZ_AI_IMAGE_SIZE || '1024x1024';
    config.quiz.cacheEnabled = import.meta.env.VITE_QUIZ_AI_CACHE_ENABLED !== 'false';

    // Limites
    config.limits.timeout = parseInt(import.meta.env.VITE_AI_TIMEOUT || '30000');
    config.limits.retryAttempts = parseInt(import.meta.env.VITE_AI_RETRY_ATTEMPTS || '2');
    config.limits.maxRequestsPerMinute = parseInt(import.meta.env.VITE_AI_MAX_REQUESTS_PER_MINUTE || '10');
    config.limits.maxRequestsPerHour = parseInt(import.meta.env.VITE_AI_MAX_REQUESTS_PER_HOUR || '50');

    // Features
    config.features.usageTracking = import.meta.env.VITE_AI_USAGE_TRACKING !== 'false';
    config.features.errorReporting = import.meta.env.VITE_AI_ERROR_REPORTING !== 'false';
    config.features.rateLimitEnabled = import.meta.env.VITE_AI_RATE_LIMIT_ENABLED !== 'false';

    return config;
}

/**
 * Verifica se a IA está configurada e operacional
 */
export function checkAIStatus(): {
    configured: boolean;
    enabled: boolean;
    availableProviders: string[];
    primaryProvider: string | null;
    issues: string[];
} {
    const config = loadAIConfig();
    const issues: string[] = [];
    const availableProviders: string[] = [];

    // Verifica providers disponíveis
    Object.entries(config.providers).forEach(([key, provider]) => {
        if (provider.enabled && provider.apiKey) {
            availableProviders.push(key);
        }
    });

    // Validações
    if (!config.enabled) {
        issues.push('IA está desabilitada nas configurações');
    }

    if (availableProviders.length === 0) {
        issues.push('Nenhum provider de IA configurado com chave válida');
    }

    const primaryProvider = config.providers[config.defaultProvider]?.enabled
        ? config.defaultProvider
        : availableProviders[0] || null;

    if (!primaryProvider) {
        issues.push('Provider principal não está disponível');
    }

    return {
        configured: availableProviders.length > 0,
        enabled: config.enabled && availableProviders.length > 0,
        availableProviders,
        primaryProvider,
        issues
    };
}

/**
 * Hook para usar configuração de IA
 */
export function useAIConfig() {
    const config = loadAIConfig();
    const status = checkAIStatus();

    return {
        config,
        status,
        isEnabled: status.enabled,
        primaryProvider: status.primaryProvider,
        availableProviders: status.availableProviders,
        hasIssues: status.issues.length > 0,
        issues: status.issues
    };
}

/**
 * Utilitário para log de uso de IA
 */
export function logAIUsage(
    provider: string,
    action: string,
    success: boolean,
    details?: any
) {
    const config = loadAIConfig();

    if (!config.features.usageTracking) return;

    const logData = {
        timestamp: new Date().toISOString(),
        provider,
        action,
        success,
        details,
        userAgent: navigator.userAgent
    };

    console.log('🤖 AI Usage:', logData);

    // Aqui você pode integrar com analytics
    // gtag('event', 'ai_usage', logData);
}

/**
 * Utilitário para report de erros de IA
 */
export function reportAIError(
    provider: string,
    error: Error,
    context?: any
) {
    const config = loadAIConfig();

    if (!config.features.errorReporting) return;

    const errorData = {
        timestamp: new Date().toISOString(),
        provider,
        error: {
            message: error.message,
            stack: error.stack,
            name: error.name
        },
        context,
        userAgent: navigator.userAgent
    };

    console.error('🚨 AI Error:', errorData);

    // Aqui você pode integrar com serviços de monitoramento
    // Sentry.captureException(error, { extra: errorData });
}

export default { loadAIConfig, checkAIStatus, useAIConfig, logAIUsage, reportAIError };
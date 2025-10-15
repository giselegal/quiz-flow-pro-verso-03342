/**
 * 🔧 SUPABASE ERROR INTERCEPTOR & LOCAL FALLBACK SYSTEM
 * 
 * Intercepta erros 404 do Supabase e fornece dados locais para funcionamento offline
 */

// Dados de fallback para funcionamento local
const LOCAL_FALLBACK_DATA = {
    quiz_drafts: {
        id: 'funnel-quiz21StepsComplete-local',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        title: 'Quiz Local - Estilo Pessoal',
        description: 'Quiz funcionando em modo local',
        steps: [
            {
                id: 'step-1',
                type: 'question',
                title: 'Qual é o seu estilo preferido?',
                order: 1,
                content: {
                    question: 'Escolha o estilo que mais combina com você:',
                    options: [
                        { id: 'opt-1', text: 'Casual e Confortável', value: 'casual' },
                        { id: 'opt-2', text: 'Elegante e Sofisticado', value: 'elegant' },
                        { id: 'opt-3', text: 'Moderno e Ousado', value: 'modern' }
                    ]
                }
            },
            {
                id: 'step-2',
                type: 'question',
                title: 'Qual ocasião você mais frequenta?',
                order: 2,
                content: {
                    question: 'Em que situações você mais se encontra?',
                    options: [
                        { id: 'opt-1', text: 'Trabalho e Reuniões', value: 'work' },
                        { id: 'opt-2', text: 'Eventos Sociais', value: 'social' },
                        { id: 'opt-3', text: 'Dia a Dia Casual', value: 'daily' }
                    ]
                }
            },
            {
                id: 'step-result',
                type: 'result',
                title: 'Seu Resultado',
                order: 3,
                content: {
                    title: 'Descobrimos seu estilo!',
                    message: 'Baseado nas suas respostas, criamos um perfil personalizado para você.',
                    cta: {
                        text: 'Ver Recomendações',
                        url: '#recommendations'
                    }
                }
            }
        ],
        settings: {
            theme: 'default',
            colors: {
                primary: '#2563eb',
                secondary: '#64748b'
            }
        }
    },
    
    quiz_production: {
        id: 'quiz-estilo-local',
        slug: 'quiz-estilo',
        published_at: new Date().toISOString(),
        steps: [
            {
                id: 'step-1',
                type: 'question',
                title: 'Qual é o seu estilo preferido?',
                order: 1
            },
            {
                id: 'step-2', 
                type: 'question',
                title: 'Qual ocasião você mais frequenta?',
                order: 2
            },
            {
                id: 'step-result',
                type: 'result', 
                title: 'Seu Resultado',
                order: 3
            }
        ],
        runtime: {
            totalSteps: 3,
            estimatedTime: '2 minutos'
        },
        results: {
            casual: {
                title: 'Estilo Casual',
                description: 'Você prefere conforto e praticidade!'
            },
            elegant: {
                title: 'Estilo Elegante',
                description: 'Sofisticação é a sua marca!'
            },
            modern: {
                title: 'Estilo Moderno',
                description: 'Você gosta de ousar e inovar!'
            }
        },
        ui: {
            theme: 'clean',
            layout: 'centered'
        },
        settings: {
            allowBack: true,
            showProgress: true,
            autoSave: true
        }
    },

    configurations: {
        'quiz-global-config': {
            theme: {
                primaryColor: '#2563eb',
                secondaryColor: '#64748b',
                backgroundColor: '#ffffff',
                textColor: '#1f2937',
                borderRadius: '8px'
            },
            layout: {
                maxWidth: '800px',
                padding: '20px',
                centered: true
            },
            features: {
                progressBar: true,
                backButton: true,
                autoSave: true,
                analytics: false
            }
        },
        
        'quiz-theme-config': {
            colors: {
                primary: '#2563eb',
                secondary: '#64748b',
                success: '#10b981',
                warning: '#f59e0b',
                error: '#ef4444',
                background: '#ffffff',
                surface: '#f8fafc',
                text: '#1f2937'
            },
            typography: {
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: {
                    xs: '0.75rem',
                    sm: '0.875rem',
                    base: '1rem',
                    lg: '1.125rem',
                    xl: '1.25rem',
                    '2xl': '1.5rem'
                }
            },
            spacing: {
                xs: '0.5rem',
                sm: '1rem',
                md: '1.5rem',
                lg: '2rem',
                xl: '3rem'
            },
            animations: {
                duration: '200ms',
                easing: 'ease-out'
            }
        },

        'quiz-step-1': {
            type: 'question',
            title: 'Pergunta Inicial',
            subtitle: 'Selecione uma opção',
            validation: {
                required: true,
                minSelections: 1,
                maxSelections: 1
            },
            ui: {
                layout: 'vertical',
                spacing: 'normal',
                animation: 'fadeIn'
            }
        }
    }
};

// Sistema de interceptação de requisições
class SupabaseErrorInterceptor {
    static instance;
    interceptedUrls = new Set();
    fallbackCache = new Map();
    originalFetch;

    constructor() {
        this.originalFetch = window.fetch;
        this.setupInterceptor();
        this.populateCache();
        console.log('🔧 Supabase Error Interceptor ativo');
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new SupabaseErrorInterceptor();
        }
        return this.instance;
    }

    setupInterceptor() {
        const self = this;
        window.fetch = async (input, init) => {
            const url = typeof input === 'string' ? input : input.toString();
            // Detectar URLs do Supabase
            if (url.includes('supabase.co') && (url.includes('quiz_drafts') || url.includes('quiz_production'))) {
                console.log(`🔍 Interceptando requisição Supabase: ${url}`);
                // Em dev ou quando explicitamente desabilitado, usar fallback sem tocar a rede
                try {
                    const host = window.location && window.location.hostname;
                    const inDev = host === 'localhost' || host === '127.0.0.1';
                    const disableNetwork = !!localStorage.getItem('supabase:disableNetwork');
                    if (inDev || disableNetwork) {
                        console.log('🎯 Dev/local detectado. Respondendo com fallback local imediato.');
                        return self.createFallbackResponse(url);
                    }
                } catch {}
                try {
                    // Tentar requisição original primeiro
                    const response = await self.originalFetch(input, init);
                    if (response.status === 404) {
                        console.log(`📦 Fornecendo dados locais para: ${url}`);
                        return self.createFallbackResponse(url);
                    }
                    return response;
                } catch (error) {
                    console.log(`🚨 Erro na requisição Supabase, usando fallback: ${error}`);
                    return self.createFallbackResponse(url);
                }
            }
            // Para URLs normais, usar fetch original
            return self.originalFetch(input, init);
        };
    }

    populateCache() {
        // Carregar dados do localStorage se existirem
        try {
            const savedData = localStorage.getItem('supabase-fallback-cache');
            if (savedData) {
                const parsed = JSON.parse(savedData);
                Object.entries(parsed).forEach(([key, value]) => {
                    this.fallbackCache.set(key, value);
                });
            }
        } catch (error) {
            console.log('Cache local não disponível, usando dados padrão');
        }
        // Popular com dados padrão se cache vazio
        if (this.fallbackCache.size === 0) {
            Object.entries(LOCAL_FALLBACK_DATA).forEach(([key, value]) => {
                this.fallbackCache.set(key, value);
            });
        }
    }

    createFallbackResponse(url) {
        let responseData = {};
        // Determinar que tipo de dados retornar baseado na URL
        if (url.includes('quiz_drafts')) {
            responseData = [LOCAL_FALLBACK_DATA.quiz_drafts];
        } else if (url.includes('quiz_production')) {
            responseData = [LOCAL_FALLBACK_DATA.quiz_production];
        } else {
            responseData = { message: 'Fallback response' };
        }
        // Criar response mock
        const responseInit = {
            status: 200,
            statusText: 'OK (Local Fallback)',
            headers: {
                'Content-Type': 'application/json',
                'X-Fallback': 'true'
            }
        };
        return new Response(JSON.stringify(responseData), responseInit);
    }

    // Método para adicionar dados personalizados ao cache
    addToCache(key, data) {
        this.fallbackCache.set(key, data);
        this.saveCache();
    }

    // Método para salvar cache no localStorage
    saveCache() {
        try {
            const cacheObj = Object.fromEntries(this.fallbackCache.entries());
            localStorage.setItem('supabase-fallback-cache', JSON.stringify(cacheObj));
        } catch (error) {
            console.warn('Não foi possível salvar cache:', error);
        }
    }

    // Método para obter dados do cache
    getFromCache(key) {
        return this.fallbackCache.get(key);
    }

    // Método para limpar cache
    clearCache() {
        this.fallbackCache.clear();
        localStorage.removeItem('supabase-fallback-cache');
        this.populateCache();
    }

    // Métodos para configurações
    getConfiguration(configId) {
        const config = LOCAL_FALLBACK_DATA.configurations[configId];
        if (config) {
            console.log(`📋 Retornando configuração local: ${configId}`);
            return config;
        }
        // Configuração padrão genérica
        return {
            theme: 'default',
            layout: 'standard',
            timestamp: Date.now()
        };
    }
}

// Sistema de configuração local para resolver timeouts
class LocalConfigurationManager {
    static instance;
    configs = new Map();

    static getInstance() {
        if (!this.instance) {
            this.instance = new LocalConfigurationManager();
        }
        return this.instance;
    }

    constructor() {
        this.loadDefaultConfigurations();
        this.interceptConfigurationRequests();
    }

    loadDefaultConfigurations() {
        Object.entries(LOCAL_FALLBACK_DATA.configurations).forEach(([key, value]) => {
            this.configs.set(key, value);
        });
    }

    interceptConfigurationRequests() {
        // Interceptar chamadas para configurações que estão dando timeout
        let configTimeouts = 0;
        // Detectar quando há muitos timeouts de configuração
        window.addEventListener('error', (event) => {
            const message = event && event.message ? event.message : '';
            if (typeof message === 'string' && message.includes('timeout') && message.includes('config')) {
                configTimeouts++;
                console.log(`⚡ Timeout de configuração detectado (${configTimeouts})`);
                // Após 3 timeouts, forçar uso de configurações locais
                if (configTimeouts >= 3) {
                    this.forceLocalConfigurations();
                }
            }
        });
    }

    forceLocalConfigurations() {
        console.log('🔄 Forçando uso de configurações locais devido a timeouts');
        // Disparar evento para informar componentes
        window.dispatchEvent(new CustomEvent('force-local-config', {
            detail: { configurations: Object.fromEntries(this.configs.entries()) }
        }));
    }

    getConfig(configId) {
        if (this.configs.has(configId)) {
            console.log(`⚡ Configuração local carregada instantaneamente: ${configId}`);
            return this.configs.get(configId);
        }
        // Retornar configuração padrão
        return {
            loaded: true,
            timestamp: Date.now(),
            source: 'local-fallback'
        };
    }

    setConfig(configId, config) {
        this.configs.set(configId, config);
        // Salvar no localStorage
        try {
            localStorage.setItem(`config-${configId}`, JSON.stringify(config));
        } catch (error) {
            console.warn(`Não foi possível salvar configuração ${configId}:`, error);
        }
    }
}

// Inicializar sistemas ao carregar a página
let interceptor;
let configManager;

const initializeFallbackSystems = () => {
    try {
        interceptor = SupabaseErrorInterceptor.getInstance();
        configManager = LocalConfigurationManager.getInstance();
        
        console.log('✅ Sistemas de fallback inicializados com sucesso');
        
        // Expor para uso global
        window.supabaseFallback = {
            interceptor,
            configManager,
            getConfig: (id) => configManager.getConfig(id),
            addData: (key, data) => interceptor.addToCache(key, data),
            clearCache: () => interceptor.clearCache()
        };

        // Avisar que o sistema está pronto
        window.dispatchEvent(new CustomEvent('fallback-systems-ready'));
        
    } catch (error) {
        console.error('❌ Erro ao inicializar sistemas de fallback:', error);
    }
};

// Auto-inicializar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFallbackSystems);
} else {
    initializeFallbackSystems();
}

// Exportar para módulos (Node/CommonJS) – ignorado no navegador
try {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = {
            SupabaseErrorInterceptor,
            LocalConfigurationManager,
            LOCAL_FALLBACK_DATA
        };
    }
} catch {}

console.log('🔧 Supabase Error Interceptor & Local Fallback carregado');
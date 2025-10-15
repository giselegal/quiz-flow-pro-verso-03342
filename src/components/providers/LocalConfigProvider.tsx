/**
 * 🔧 FORCE LOCAL CONFIG PROVIDER
 * 
 * Sistema simples para configurações locais quando Supabase falha
 */

import { useEffect, useState, createContext, useContext } from 'react';

interface LocalConfig {
    [key: string]: any;
}

interface LocalConfigContextType {
    getConfig: (configId: string) => any;
    setConfig: (configId: string, config: any) => void;
    isUsingLocalConfig: boolean;
    forceLocal: () => void;
}

const LocalConfigContext = createContext<LocalConfigContextType | null>(null);

// Hook para usar configurações locais
export const useLocalConfig = (configId: string) => {
    const context = useContext(LocalConfigContext);
    const [config, setConfig] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!context) return;

        try {
            setLoading(true);
            setError(null);

            // Tentar obter configuração
            const localConfig = context.getConfig(configId);

            if (localConfig) {
                setConfig(localConfig);
                console.log(`⚡ Configuração local carregada: ${configId}`);
            } else {
                // Configuração padrão se não encontrar
                const defaultConfig = getDefaultConfig(configId);
                setConfig(defaultConfig);
                console.log(`📦 Usando configuração padrão para: ${configId}`);
            }
        } catch (err) {
            console.error(`❌ Erro ao carregar configuração ${configId}:`, err);
            setError(err instanceof Error ? err.message : 'Erro desconhecido');

            // Usar configuração padrão em caso de erro
            setConfig(getDefaultConfig(configId));
        } finally {
            setLoading(false);
        }
    }, [configId, context]);

    return { config, loading, error };
};

// Configurações padrão para diferentes tipos
const getDefaultConfig = (configId: string): any => {
    const defaults = {
        'quiz-global-config': {
            theme: {
                primaryColor: '#2563eb',
                secondaryColor: '#64748b',
                backgroundColor: '#ffffff',
                textColor: '#1f2937'
            },
            layout: {
                maxWidth: '800px',
                padding: '20px',
                centered: true
            },
            features: {
                progressBar: true,
                backButton: true,
                autoSave: false // Desabilitado para evitar mais requests
            },
            fallback: true,
            loadedAt: Date.now()
        },

        'quiz-theme-config': {
            colors: {
                primary: '#2563eb',
                secondary: '#64748b',
                success: '#10b981',
                warning: '#f59e0b',
                error: '#ef4444'
            },
            typography: {
                fontFamily: 'Inter, sans-serif',
                fontSize: '1rem'
            },
            fallback: true,
            loadedAt: Date.now()
        },

        'quiz-step-1': {
            type: 'question',
            title: 'Pergunta',
            validation: { required: true },
            ui: { layout: 'vertical' },
            fallback: true,
            loadedAt: Date.now()
        }
    };

    return defaults[configId as keyof typeof defaults] || {
        fallback: true,
        loadedAt: Date.now(),
        configId
    };
};

// Provider principal
export const LocalConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [configs, setConfigs] = useState<Map<string, any>>(new Map());
    const [isUsingLocalConfig, setIsUsingLocalConfig] = useState(false);

    useEffect(() => {
        // Escutar eventos do sistema de fallback
        const handleFallbackReady = () => {
            console.log('📡 Sistema de fallback pronto, carregando configurações locais...');
            setIsUsingLocalConfig(true);
            loadAllConfigs();
        };

        const handleForceLocal = (event: CustomEvent) => {
            console.log('🔄 Forçando configurações locais...');
            setIsUsingLocalConfig(true);

            if (event.detail?.configurations) {
                Object.entries(event.detail.configurations).forEach(([key, value]) => {
                    setConfigs(prev => new Map(prev.set(key, value)));
                });
            }
        };

        // Detectar timeouts repetidos
        let timeoutCount = 0;
        const originalConsoleWarn = console.warn;
        console.warn = (...args) => {
            const message = args.join(' ');
            if (message.includes('timeout') && message.includes('config')) {
                timeoutCount++;
                if (timeoutCount >= 3) {
                    console.log('🚨 Muitos timeouts detectados, forçando modo local...');
                    forceLocal();
                }
            }
            originalConsoleWarn.apply(console, args);
        };

        window.addEventListener('fallback-systems-ready', handleFallbackReady);
        window.addEventListener('force-local-config', handleForceLocal as EventListener);

        // Verificar se sistema já está pronto
        if ((window as any).supabaseFallback) {
            handleFallbackReady();
        }

        return () => {
            window.removeEventListener('fallback-systems-ready', handleFallbackReady);
            window.removeEventListener('force-local-config', handleForceLocal as EventListener);
            console.warn = originalConsoleWarn;
        };
    }, []);

    const loadAllConfigs = () => {
        const configIds = ['quiz-global-config', 'quiz-theme-config', 'quiz-step-1'];

        configIds.forEach(configId => {
            try {
                let config;

                // Tentar obter do sistema de fallback primeiro
                if ((window as any).supabaseFallback) {
                    config = (window as any).supabaseFallback.getConfig(configId);
                }

                // Se não encontrar, usar configuração padrão
                if (!config) {
                    config = getDefaultConfig(configId);
                }

                setConfigs(prev => new Map(prev.set(configId, config)));
                console.log(`📋 Configuração ${configId} carregada localmente`);

            } catch (error) {
                console.error(`❌ Erro ao carregar ${configId}:`, error);
                setConfigs(prev => new Map(prev.set(configId, getDefaultConfig(configId))));
            }
        });
    };

    const getConfig = (configId: string): any => {
        if (configs.has(configId)) {
            return configs.get(configId);
        }

        // Carregar configuração sob demanda
        const config = getDefaultConfig(configId);
        setConfigs(prev => new Map(prev.set(configId, config)));
        return config;
    };

    const setConfig = (configId: string, config: any) => {
        setConfigs(prev => new Map(prev.set(configId, config)));

        // Salvar no localStorage
        try {
            localStorage.setItem(`local-config-${configId}`, JSON.stringify(config));
        } catch (error) {
            console.warn(`Não foi possível salvar ${configId}:`, error);
        }
    };

    const forceLocal = () => {
        console.log('🔄 Forçando uso de configurações locais...');
        setIsUsingLocalConfig(true);
        loadAllConfigs();

        // Disparar evento para outros componentes
        window.dispatchEvent(new CustomEvent('local-config-forced', {
            detail: { timestamp: Date.now() }
        }));
    };

    const contextValue: LocalConfigContextType = {
        getConfig,
        setConfig,
        isUsingLocalConfig,
        forceLocal
    };

    return (
        <LocalConfigContext.Provider value={contextValue}>
            {isUsingLocalConfig && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: '#fbbf24',
                    color: '#92400e',
                    padding: '8px',
                    textAlign: 'center',
                    fontSize: '14px',
                    zIndex: 10000,
                    fontWeight: 500
                }}>
                    🔧 Modo Local Ativo - Configurações carregadas localmente devido a problemas de conexão
                </div>
            )}
            {children}
        </LocalConfigContext.Provider>
    );
};

// HOC para componentes que precisam de configuração local
export const withLocalConfig = <P extends object>(
    Component: React.ComponentType<P>,
    configId: string
) => {
    return function WrappedComponent(props: P) {
        const { config, loading, error } = useLocalConfig(configId);

        if (loading) {
            return (
                <div style={{ padding: '20px', textAlign: 'center' }}>
                    ⏳ Carregando configuração {configId}...
                </div>
            );
        }

        if (error) {
            return (
                <div style={{
                    padding: '20px',
                    textAlign: 'center',
                    backgroundColor: '#fee2e2',
                    color: '#dc2626',
                    borderRadius: '8px',
                    margin: '10px'
                }}>
                    ❌ Erro ao carregar configuração: {error}
                </div>
            );
        }

        return <Component {...props} config={config} />;
    };
};

// Hook para detectar quando está usando configuração local
export const useLocalConfigStatus = () => {
    const context = useContext(LocalConfigContext);
    return {
        isLocal: context?.isUsingLocalConfig || false,
        forceLocal: context?.forceLocal || (() => { })
    };
};

export default LocalConfigProvider;
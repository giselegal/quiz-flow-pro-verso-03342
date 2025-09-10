/**
 * 🎯 EXEMPLO DE USO DOS HOOKS DE CONFIGURAÇÃO
 * 
 * Demonstra como usar os hooks para acessar configurações
 * de forma reativa nos componentes React
 */

import { useEffect } from 'react';
import {
    useConfiguration,
    useSEOConfiguration,
    useTrackingConfiguration,
    useThemeConfiguration,
    useFunnelBehavior,
    useConfigurationDebug,
    useAvailableFunnels
} from '@/hooks/useConfiguration';

// ============================================================================
// EXEMPLO 1: HOOK BÁSICO DE CONFIGURAÇÃO
// ============================================================================

export function FunnelConfigExample() {
    const { config, isLoading, error, refresh, validate } = useConfiguration({
        funnelId: 'quiz21StepsComplete',
        autoRefresh: true,
        refreshInterval: 30000 // 30 segundos
    });

    useEffect(() => {
        if (config) {
            console.log('✅ Configuração carregada:', config);

            const validation = validate();
            if (!validation.isValid) {
                console.warn('⚠️ Problemas na configuração:', validation.errors);
            }
        }
    }, [config, validate]);

    if (isLoading) return <div>Carregando configuração...</div>;
    if (error) return <div>Erro: {error}</div>;
    if (!config) return <div>Configuração não encontrada</div>;

    return (
        <div className="funnel-config">
            <h2>Configuração do Funil: {config.funnel.name}</h2>
            <div className="config-info">
                <p><strong>ID:</strong> {config.funnel.id}</p>
                <p><strong>Versão:</strong> {config.funnel.version}</p>
                <p><strong>Ambiente:</strong> {config.environment.environment}</p>
                <p><strong>URL:</strong> {config.environment.baseUrl}</p>
            </div>

            <button onClick={refresh}>
                🔄 Atualizar Configuração
            </button>
        </div>
    );
}

// ============================================================================
// EXEMPLO 2: CONFIGURAÇÕES DE SEO
// ============================================================================

export function SEOConfigExample() {
    const { seo, metaTags, isLoading } = useSEOConfiguration('quiz21StepsComplete');

    useEffect(() => {
        if (metaTags) {
            // Atualizar meta tags do documento
            metaTags.forEach(tag => {
                let element = document.querySelector(`meta[${tag.name ? 'name' : 'property'}="${tag.name || tag.property}"]`);

                if (!element) {
                    element = document.createElement('meta');
                    if (tag.name) element.setAttribute('name', tag.name);
                    if (tag.property) element.setAttribute('property', tag.property);
                    document.head.appendChild(element);
                }

                element.setAttribute('content', tag.content);
            });
        }
    }, [metaTags]);

    if (isLoading) return <div>Carregando SEO...</div>;

    return (
        <div className="seo-config">
            <h3>Configuração SEO</h3>
            {seo && (
                <div>
                    <p><strong>Título:</strong> {seo.defaultTitle}</p>
                    <p><strong>Descrição:</strong> {seo.defaultDescription}</p>
                    <p><strong>Keywords:</strong> {seo.keywords?.join(', ')}</p>

                    <h4>Open Graph</h4>
                    <p><strong>Título OG:</strong> {seo.openGraph?.title}</p>
                    <p><strong>Imagem OG:</strong> {seo.openGraph?.image}</p>
                </div>
            )}
        </div>
    );
}

// ============================================================================
// EXEMPLO 3: CONFIGURAÇÕES DE TRACKING
// ============================================================================

export function TrackingConfigExample() {
    const { tracking, utm, trackingConfig, isLoading } = useTrackingConfiguration();

    useEffect(() => {
        if (trackingConfig) {
            // Inicializar Google Analytics
            if (trackingConfig.googleAnalytics?.enabled && trackingConfig.googleAnalytics.trackingId) {
                console.log('🔍 Inicializando GA:', trackingConfig.googleAnalytics.trackingId);
                // Aqui você inicializaria o GA4
            }

            // Inicializar Facebook Pixel
            if (trackingConfig.facebookPixel?.enabled && trackingConfig.facebookPixel.pixelId) {
                console.log('📊 Inicializando Facebook Pixel:', trackingConfig.facebookPixel.pixelId);
                // Aqui você inicializaria o Facebook Pixel
            }

            // Inicializar Google Tag Manager
            if (trackingConfig.googleTagManager?.enabled && trackingConfig.googleTagManager.containerId) {
                console.log('🏷️ Inicializando GTM:', trackingConfig.googleTagManager.containerId);
                // Aqui você inicializaria o GTM
            }
        }
    }, [trackingConfig]);

    if (isLoading) return <div>Carregando tracking...</div>;

    return (
        <div className="tracking-config">
            <h3>Configuração de Tracking</h3>

            {tracking && (
                <div>
                    <h4>Google Analytics</h4>
                    <p>Habilitado: {tracking.googleAnalytics.enabled ? 'Sim' : 'Não'}</p>
                    <p>ID: {tracking.googleAnalytics.trackingId}</p>

                    <h4>Facebook Pixel</h4>
                    <p>Habilitado: {tracking.facebookPixel.enabled ? 'Sim' : 'Não'}</p>
                    <p>ID: {tracking.facebookPixel.pixelId}</p>
                </div>
            )}

            {utm && (
                <div>
                    <h4>Parâmetros UTM</h4>
                    <p>Source: {utm.source}</p>
                    <p>Medium: {utm.medium}</p>
                    <p>Campaign: {utm.campaign}</p>
                </div>
            )}
        </div>
    );
}

// ============================================================================
// EXEMPLO 4: CONFIGURAÇÕES DE TEMA
// ============================================================================

export function ThemeConfigExample() {
    const { branding, colors, fonts, logo, isLoading } = useThemeConfiguration();

    useEffect(() => {
        if (colors) {
            // Aplicar cores CSS customizadas
            document.documentElement.style.setProperty('--primary-color', colors.primary);
            document.documentElement.style.setProperty('--secondary-color', colors.secondary);
            document.documentElement.style.setProperty('--accent-color', colors.accent);
        }

        if (fonts) {
            document.documentElement.style.setProperty('--font-family', fonts);
        }
    }, [colors, fonts]);

    if (isLoading) return <div>Carregando tema...</div>;

    return (
        <div className="theme-config">
            <h3>Configuração de Tema</h3>

            {branding && (
                <div>
                    <h4>Marca</h4>
                    <p>Nome: {branding.companyName}</p>
                    {logo && <img src={logo} alt="Logo" style={{ maxWidth: '200px' }} />}

                    <h4>Cores</h4>
                    {colors && (
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <div style={{
                                backgroundColor: colors.primary,
                                width: '50px',
                                height: '50px',
                                borderRadius: '4px'
                            }} title={`Primária: ${colors.primary}`} />
                            <div style={{
                                backgroundColor: colors.secondary,
                                width: '50px',
                                height: '50px',
                                borderRadius: '4px'
                            }} title={`Secundária: ${colors.secondary}`} />
                            <div style={{
                                backgroundColor: colors.accent,
                                width: '50px',
                                height: '50px',
                                borderRadius: '4px'
                            }} title={`Accent: ${colors.accent}`} />
                        </div>
                    )}

                    <h4>Fonte</h4>
                    <p style={{ fontFamily: fonts || 'inherit' }}>
                        {fonts || 'Fonte padrão'}
                    </p>
                </div>
            )}
        </div>
    );
}

// ============================================================================
// EXEMPLO 5: COMPORTAMENTO DO FUNIL
// ============================================================================

export function FunnelBehaviorExample() {
    const { behavior, results, webhooks, isLoading } = useFunnelBehavior();

    if (isLoading) return <div>Carregando comportamento...</div>;

    return (
        <div className="behavior-config">
            <h3>Comportamento do Funil</h3>

            {behavior && (
                <div>
                    <h4>Navegação</h4>
                    <p>Permite voltar: {behavior.allowBack ? 'Sim' : 'Não'}</p>
                    <p>Progresso automático: {behavior.autoProgress ? 'Sim' : 'Não'}</p>
                    <p>Validação em tempo real: {behavior.realTimeValidation ? 'Sim' : 'Não'}</p>

                    <h4>Timeouts</h4>
                    <p>Por questão: {behavior.questionTimeout}ms</p>
                    <p>Total: {behavior.totalTimeout}ms</p>
                </div>
            )}

            {results && (
                <div>
                    <h4>Resultados</h4>
                    <p>Mostrar resultado: {results.showScore ? 'Sim' : 'Não'}</p>
                    <p>Permitir retentativa: {results.allowRetry ? 'Sim' : 'Não'}</p>
                    <p>Compartilhamento social: {results.socialSharing ? 'Sim' : 'Não'}</p>
                </div>
            )}

            {webhooks && webhooks.length > 0 && (
                <div>
                    <h4>Webhooks</h4>
                    {webhooks.map((webhook, index) => (
                        <div key={index}>
                            <p><strong>Evento:</strong> {webhook.event}</p>
                            <p><strong>URL:</strong> {webhook.url}</p>
                            <p><strong>Ativo:</strong> {webhook.enabled ? 'Sim' : 'Não'}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ============================================================================
// EXEMPLO 6: DEBUG DE CONFIGURAÇÕES
// ============================================================================

export function ConfigurationDebugPanel() {
    const { config, debugInfo, isLoading, error, validate } = useConfigurationDebug();
    const availableFunnels = useAvailableFunnels();

    const handleValidation = () => {
        const result = validate();
        console.log('🔍 Resultado da validação:', result);

        if (result.errors.length > 0) {
            alert(`❌ Erros encontrados:\n${result.errors.join('\n')}`);
        } else {
            alert('✅ Configuração válida!');
        }
    };

    if (isLoading) return <div>Carregando debug...</div>;
    if (error) return <div>Erro no debug: {error}</div>;

    return (
        <div className="debug-panel" style={{
            background: '#f5f5f5',
            padding: '20px',
            borderRadius: '8px',
            fontFamily: 'monospace'
        }}>
            <h3>🔧 Debug Panel</h3>

            <div>
                <h4>Funis Disponíveis</h4>
                <ul>
                    {availableFunnels.map(funnel => (
                        <li key={funnel}>{funnel}</li>
                    ))}
                </ul>
            </div>

            {debugInfo && (
                <div>
                    <h4>Informações de Debug</h4>
                    <p><strong>Funil ID:</strong> {debugInfo.funnelId}</p>
                    <p><strong>Ambiente:</strong> {debugInfo.environment}</p>
                    <p><strong>SEO Global:</strong> {debugInfo.hasGlobalSEO ? '✅' : '❌'}</p>
                    <p><strong>Tracking:</strong> {debugInfo.hasTracking ? '✅' : '❌'}</p>
                    <p><strong>UTM:</strong> {debugInfo.hasUTM ? '✅' : '❌'}</p>

                    <h4>Validação</h4>
                    <p><strong>Válido:</strong> {debugInfo.validation.isValid ? '✅' : '❌'}</p>
                    {debugInfo.validation.errors.length > 0 && (
                        <div>
                            <strong>Erros:</strong>
                            <ul>
                                {debugInfo.validation.errors.map((error, index) => (
                                    <li key={index} style={{ color: 'red' }}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {debugInfo.validation.warnings.length > 0 && (
                        <div>
                            <strong>Avisos:</strong>
                            <ul>
                                {debugInfo.validation.warnings.map((warning, index) => (
                                    <li key={index} style={{ color: 'orange' }}>{warning}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            <div style={{ marginTop: '20px' }}>
                <button onClick={handleValidation} style={{
                    padding: '10px 20px',
                    background: '#007acc',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}>
                    🔍 Validar Configuração
                </button>
            </div>

            {config && (
                <details style={{ marginTop: '20px' }}>
                    <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                        📋 Configuração Completa (JSON)
                    </summary>
                    <pre style={{
                        background: 'white',
                        padding: '10px',
                        borderRadius: '4px',
                        overflow: 'auto',
                        maxHeight: '400px'
                    }}>
                        {JSON.stringify(config, null, 2)}
                    </pre>
                </details>
            )}
        </div>
    );
}

// ============================================================================
// EXEMPLO PRINCIPAL - DASHBOARD COMPLETO
// ============================================================================

export function ConfigurationDashboard() {
    return (
        <div style={{ padding: '20px' }}>
            <h1>🎯 Dashboard de Configurações</h1>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: '20px',
                marginTop: '20px'
            }}>
                <FunnelConfigExample />
                <SEOConfigExample />
                <TrackingConfigExample />
                <ThemeConfigExample />
                <FunnelBehaviorExample />
            </div>

            <div style={{ marginTop: '40px' }}>
                <ConfigurationDebugPanel />
            </div>
        </div>
    );
}

export default ConfigurationDashboard;

/**
 * 🎯 EXEMPLO DE INTEGRAÇÃO COMPLETA
 * 
 * Demonstra como integrar o sistema de configuração
 * nas páginas principais do aplicativo
 */

import React from 'react';
import { Route, Switch } from 'wouter';
import { useAutoConfiguration } from '@/utils/routeConfigIntegration';

// ============================================================================
// COMPONENTE DE LAYOUT COM CONFIGURAÇÃO AUTOMÁTICA
// ============================================================================

export function ConfiguredLayout({ children }: { children: React.ReactNode }) {
    const autoConfig = useAutoConfiguration({
        enableSEO: true,
        enableTracking: true,
        enableTheme: true
    });

    // Debug das configurações (apenas em desenvolvimento)
    React.useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            autoConfig.debug();
        }
    }, [autoConfig]);

    // Renderizar loading se ainda carregando configurações críticas
    if (autoConfig.route.isLoading) {
        return (
            <div className="loading-config">
                <div className="spinner"></div>
                <p>Carregando configurações...</p>
            </div>
        );
    }

    // Renderizar erro se houver problema
    if (autoConfig.route.error) {
        return (
            <div className="error-config">
                <h2>Erro nas Configurações</h2>
                <p>{autoConfig.route.error}</p>
                <button onClick={() => window.location.reload()}>
                    Recarregar Página
                </button>
            </div>
        );
    }

    return (
        <div
            className="configured-layout"
            style={{
                '--primary-color': autoConfig.theme?.appliedTheme.primaryColor || '#007acc',
                '--secondary-color': autoConfig.theme?.appliedTheme.secondaryColor || '#f0f0f0',
                '--accent-color': autoConfig.theme?.appliedTheme.accentColor || '#ff6b35',
                fontFamily: autoConfig.theme?.appliedTheme.fontFamily || 'system-ui, sans-serif'
            } as React.CSSProperties}
        >
            {/* Header com branding do funil */}
            {autoConfig.theme?.appliedTheme.companyName && (
                <header className="app-header">
                    {autoConfig.theme?.appliedTheme.logoUrl && (
                        <img
                            src={autoConfig.theme.appliedTheme.logoUrl}
                            alt={autoConfig.theme.appliedTheme.companyName}
                            className="company-logo"
                        />
                    )}
                    <h1>{autoConfig.theme.appliedTheme.companyName}</h1>
                </header>
            )}

            {/* Conteúdo principal */}
            <main className="app-main">
                {children}
            </main>

            {/* Footer com tracking de interações */}
            <footer className="app-footer">
                <button
                    onClick={() => {
                        autoConfig.tracking?.trackEvent('footer_interaction', {
                            action: 'support_click',
                            funnelId: autoConfig.route.currentFunnelId
                        });
                    }}
                >
                    Suporte
                </button>

                <button
                    onClick={() => {
                        autoConfig.tracking?.trackEvent('footer_interaction', {
                            action: 'privacy_click',
                            funnelId: autoConfig.route.currentFunnelId
                        });
                    }}
                >
                    Privacidade
                </button>
            </footer>
        </div>
    );
}

// ============================================================================
// PÁGINA DE QUIZ COM CONFIGURAÇÃO AUTOMÁTICA
// ============================================================================

export function QuizPage() {
    const autoConfig = useAutoConfiguration({
        customSEO: {
            title: 'Quiz Interativo - Descubra seu Perfil',
            description: 'Responda nosso quiz e descubra insights únicos sobre você'
        }
    });

    const handleQuizStart = () => {
        autoConfig.tracking?.trackEvent('quiz_started', {
            funnelId: autoConfig.route.currentFunnelId,
            timestamp: Date.now(),
            source: 'direct'
        });
    };

    const handleQuizComplete = (score: number) => {
        autoConfig.tracking?.trackEvent('quiz_completed', {
            funnelId: autoConfig.route.currentFunnelId,
            score,
            timestamp: Date.now()
        });
    };

    return (
        <div className="quiz-page">
            <div className="quiz-header">
                <h1>Quiz Interativo</h1>
                <p>Descubra insights únicos sobre você em apenas alguns minutos!</p>
            </div>

            <div className="quiz-content">
                <button
                    className="start-quiz-btn"
                    onClick={handleQuizStart}
                    style={{
                        backgroundColor: autoConfig.theme?.appliedTheme.primaryColor,
                        color: 'white',
                        border: 'none',
                        padding: '15px 30px',
                        borderRadius: '8px',
                        fontSize: '18px',
                        cursor: 'pointer'
                    }}
                >
                    Iniciar Quiz
                </button>
            </div>

            {/* Debug panel (apenas desenvolvimento) */}
            {process.env.NODE_ENV === 'development' && (
                <div className="debug-panel" style={{
                    position: 'fixed',
                    bottom: '10px',
                    right: '10px',
                    background: 'rgba(0,0,0,0.8)',
                    color: 'white',
                    padding: '10px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    zIndex: 9999
                }}>
                    <strong>Debug Info:</strong><br />
                    Funil: {autoConfig.route.currentFunnelId}<br />
                    SEO: {autoConfig.seo ? '✅' : '❌'}<br />
                    Tracking: {autoConfig.tracking ? '✅' : '❌'}<br />
                    Tema: {autoConfig.theme ? '✅' : '❌'}
                </div>
            )}
        </div>
    );
}

// ============================================================================
// PÁGINA DE ADMIN COM CONFIGURAÇÃO E AUTENTICAÇÃO
// ============================================================================

export function AdminPage() {
    const autoConfig = useAutoConfiguration({
        customSEO: {
            title: 'Painel Administrativo - Quiz Builder',
            description: 'Gerencie seus funis e configurações'
        }
    });

    // Verificar autenticação
    React.useEffect(() => {
        if (autoConfig.route.requiresAuth) {
            // Aqui você verificaria a autenticação
            const isAuthenticated = true; // Simular auth

            if (!isAuthenticated) {
                autoConfig.tracking?.trackEvent('admin_access_denied', {
                    funnelId: autoConfig.route.currentFunnelId,
                    reason: 'not_authenticated'
                });
                // Redirecionar para login
            } else {
                autoConfig.tracking?.trackEvent('admin_access_granted', {
                    funnelId: autoConfig.route.currentFunnelId,
                    timestamp: Date.now()
                });
            }
        }
    }, [autoConfig.route.requiresAuth, autoConfig.tracking]);

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1>Painel Administrativo</h1>
                <div className="admin-stats">
                    <div className="stat-card">
                        <h3>Funil Ativo</h3>
                        <p>{autoConfig.route.currentFunnelId}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Configuração</h3>
                        <p>{autoConfig.route.funnelConfig ? 'Carregada' : 'Pendente'}</p>
                    </div>
                </div>
            </div>

            <div className="admin-content">
                <div className="admin-section">
                    <h2>Configurações de SEO</h2>
                    {autoConfig.seo?.seo && (
                        <div>
                            <p><strong>Título:</strong> {autoConfig.seo.seo.defaultTitle}</p>
                            <p><strong>Descrição:</strong> {autoConfig.seo.seo.defaultDescription}</p>
                        </div>
                    )}
                </div>

                <div className="admin-section">
                    <h2>Configurações de Tracking</h2>
                    {autoConfig.tracking?.tracking && (
                        <div>
                            <p><strong>Google Analytics:</strong>
                                {autoConfig.tracking.tracking.googleAnalytics.enabled ? '✅' : '❌'}
                            </p>
                            <p><strong>Facebook Pixel:</strong>
                                {autoConfig.tracking.tracking.facebookPixel.enabled ? '✅' : '❌'}
                            </p>
                        </div>
                    )}
                </div>

                <div className="admin-section">
                    <h2>Configurações de Tema</h2>
                    {autoConfig.theme?.appliedTheme && (
                        <div>
                            <p><strong>Empresa:</strong> {autoConfig.theme.appliedTheme.companyName}</p>
                            <div className="color-preview">
                                <div
                                    style={{
                                        backgroundColor: autoConfig.theme.appliedTheme.primaryColor,
                                        width: '30px',
                                        height: '30px',
                                        display: 'inline-block',
                                        marginRight: '10px'
                                    }}
                                />
                                <span>Cor Primária: {autoConfig.theme.appliedTheme.primaryColor}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// ROTEADOR PRINCIPAL COM CONFIGURAÇÃO AUTOMÁTICA
// ============================================================================

export function AppRouter() {
    return (
        <ConfiguredLayout>
            <Switch>
                <Route path="/quiz" component={QuizPage} />
                <Route path="/admin" component={AdminPage} />
                <Route path="/">
                    <div className="home-page">
                        <h1>Bem-vindo ao Quiz Builder</h1>
                        <nav>
                            <a href="/quiz">Fazer Quiz</a>
                            <a href="/admin">Painel Admin</a>
                        </nav>
                    </div>
                </Route>
            </Switch>
        </ConfiguredLayout>
    );
}

// ============================================================================
// CSS PARA OS EXEMPLOS
// ============================================================================

export const EXAMPLE_STYLES = `
.configured-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: var(--font-family, system-ui, sans-serif);
}

.app-header {
  background: var(--primary-color, #007acc);
  color: white;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.company-logo {
  height: 40px;
  width: auto;
}

.app-main {
  flex: 1;
  padding: 2rem;
}

.app-footer {
  background: var(--secondary-color, #f0f0f0);
  padding: 1rem;
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.loading-config, .error-config {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--primary-color, #007acc);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.quiz-page {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.quiz-header {
  margin-bottom: 3rem;
}

.quiz-header h1 {
  color: var(--primary-color, #007acc);
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.admin-page {
  max-width: 1200px;
  margin: 0 auto;
}

.admin-header {
  border-bottom: 2px solid var(--secondary-color, #f0f0f0);
  padding-bottom: 2rem;
  margin-bottom: 2rem;
}

.admin-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.stat-card {
  background: var(--secondary-color, #f0f0f0);
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
}

.stat-card h3 {
  color: var(--primary-color, #007acc);
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
}

.stat-card p {
  margin: 0;
  font-weight: bold;
}

.admin-section {
  background: white;
  border: 1px solid var(--secondary-color, #f0f0f0);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.admin-section h2 {
  color: var(--primary-color, #007acc);
  margin-top: 0;
}

.color-preview {
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
}

.home-page {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.home-page nav {
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.home-page nav a {
  background: var(--primary-color, #007acc);
  color: white;
  padding: 1rem 2rem;
  text-decoration: none;
  border-radius: 8px;
  transition: opacity 0.2s;
}

.home-page nav a:hover {
  opacity: 0.8;
}
`;

export default AppRouter;

/**
 * 🚀 APP.TSX - FASE 2 CONSOLIDADA
 * 
 * Versão otimizada com arquitetura de providers consolidada:
 * ✅ UnifiedAppProvider (único provider app-level)
 * ✅ EditorProviderUnified (rotas de editor)
 * ✅ Provider lazy loading
 * ✅ Performance monitoring
 * 
 * ANTES (Provider Hell):
 * - HelmetProvider
 * - GlobalErrorBoundary
 * - ThemeProvider + CustomThemeProvider
 * - AuthProvider + SecurityProvider
 * - MonitoringProvider
 * - OptimizedProviderStack
 * = 8 providers aninhados
 * 
 * DEPOIS (Arquitetura Limpa):
 * - HelmetProvider
 * - GlobalErrorBoundary
 * - UnifiedAppProvider (consolida auth, theme, state)
 * = 3 providers principais
 */

import React, { Suspense, lazy, useEffect } from 'react';
import { Route, Router, Switch } from 'wouter';
import { HelmetProvider } from 'react-helmet-async';
import { GlobalErrorBoundary } from './components/error/GlobalErrorBoundary';
import { Toaster } from './components/ui/toaster';
import { RedirectRoute } from './components/RedirectRoute';
import { QuizErrorBoundary } from './components/RouteErrorBoundary';
import { EditorErrorBoundary } from './components/error/EditorErrorBoundary';
import { EnhancedLoadingFallback } from './components/ui/enhanced-loading-fallback';
import { PageLoadingFallback } from './components/LoadingSpinner';
import { serviceManager } from './services/core/UnifiedServiceManager';
import { setupCriticalRoutes } from '@/config/criticalRoutes.config';
import { loadTemplateOverrides } from '@/bootstrap/loadTemplateOverrides';
// 🚀 FASE 3.5: PWA Notifications
import { PWANotifications } from './components/PWANotifications';
// Remover LocalConfigProvider complexo - usando sistema JavaScript simples

// 🚀 FASE 2: Unified Provider (arquitetura consolidada)
import UnifiedAppProvider from '@/providers/UnifiedAppProvider';
import { FunnelContext } from '@/core/contexts/FunnelContext';
import { EditorProviderUnified } from '@/components/editor/EditorProviderUnified';
import { ProviderGuard } from '@/components/ProviderGuard';

// 🏠 PÁGINAS ESSENCIAIS
const Home = lazy(() => import('./pages/Home'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const NotFound = lazy(() => import('./pages/NotFound'));

// 🔍 PÁGINAS DE DIAGNÓSTICO
const TemplateDiagnosticPage = lazy(() => import('./pages/TemplateDiagnosticPage'));
const EditorBlocksDiagnosticPage = lazy(() => import('./pages/EditorBlocksDiagnosticPage'));
const PerformanceTestPage = lazy(() => import('./pages/PerformanceTestPage'));

// 🚀 EDITOR CONFIGURATION (Sprint 1 - Consolidated + Lazy Loading)
// ✅ ONDA 2: Migrar para QuizModularEditor (190 linhas) como padrão
// ❌ DEPRECADO: QuizModularProductionEditor (4.317 linhas)
const QuizModularEditor = lazy(() => import('./components/editor/quiz/QuizModularEditor'));

// 🧪 EDITOR MODULAR - FASE 1, 2, 3 (Registry Universal)
const EditorModular = lazy(() => import('./pages/EditorModular'));

// 🧪 FALLBACK: Editor legacy para compatibilidade (será removido na ONDA 3)
const QuizModularProductionEditorLegacy = lazy(() => import('./components/editor/quiz/QuizModularProductionEditor'));

// 🧪 PÁGINAS DE QUIZ
const QuizEstiloPessoalPage = lazy(() => import('./pages/QuizEstiloPessoalPage'));
const QuizAIPage = lazy(() => import('./pages/QuizAIPage'));
const QuizIntegratedPage = lazy(() => import('./pages/QuizIntegratedPage'));

// 🎯 FASE 1: Preview Sandbox (isolado)
const PreviewSandbox = lazy(() => import('./pages/PreviewSandbox'));

// 🏢 DASHBOARDS
const ModernDashboardPage = lazy(() => import('./pages/ModernDashboardPage'));
const ModernAdminDashboard = lazy(() => import('./pages/ModernAdminDashboard'));
const Phase2Dashboard = lazy(() => import('./pages/Phase2Dashboard'));

// 🎨 PÁGINAS DE TEMPLATES
const TemplatesPage = lazy(() => import('./pages/TemplatesPage'));
const SystemDiagnosticPage = lazy(() => import('./pages/SystemDiagnosticPage'));
const EditorTemplatesPage = lazy(() => import('./pages/editor-templates/index'));
const FunnelTypesPage = lazy(() => import('./pages/SimpleFunnelTypesPage'));
const SupabaseFixTestPage = lazy(() => import('./pages/SupabaseFixTestPage'));
const IndexedDBMigrationTestPage = lazy(() => import('./pages/IndexedDBMigrationTestPage'));

// 🛠️ PÁGINAS ADMIN (lazy estáveis)
const AdminAnalyticsPage = lazy(() => import('./pages/admin/AnalyticsPage'));
const AdminParticipantsPage = lazy(() => import('./pages/admin/ParticipantsPage'));
// Atenção: Alguns nomes originais não existiam (TemplatesPage, ABTestsPage).
// Substituídos pelos arquivos reais detectados no filesystem.
const AdminTemplatesPage = lazy(() => import('./pages/admin/MyTemplatesPage'));
const AdminSettingsPage = lazy(() => import('./pages/admin/SettingsPage'));
const AdminIntegrationsPage = lazy(() => import('./pages/admin/IntegrationsPage'));
const AdminABTestsPage = lazy(() => import('./pages/admin/ABTestPage'));
const AdminCreativesPage = lazy(() => import('./pages/admin/CreativesPage'));
const CanonicalAdoptionDashboard = lazy(() => import('./pages/admin/CanonicalAdoptionDashboard'));



function AppCore() {
    console.log('🚀 AppCore rendering...');

    useEffect(() => {
        console.log('🚀 App initialized with UnifiedAppProvider v2.0 (P2 Optimized)');

        // 🚀 P2: Setup critical routes preload
        setupCriticalRoutes();

        // 🔁 Carregar overrides JSON (quando habilitado por env)
        try {
            const enabled = (import.meta as any)?.env?.ENABLE_JSON_TEMPLATE_OVERRIDES || (typeof process !== 'undefined' && (process.env as any).ENABLE_JSON_TEMPLATE_OVERRIDES);
            if (enabled) {
                loadTemplateOverrides().catch(err => console.warn('⚠️ Overrides loader failed', err));
            } else {
                console.info('[TemplateOverrides] disabled by env');
            }
        } catch (err) {
            console.warn('[TemplateOverrides] init error', err);
        }

        // Initialize services with idle callback
        const initializeServices = () => {
            try {
                serviceManager.healthCheckAll().then(results => {
                    console.log('🔧 Service Health Check:', results);
                });
            } catch (error) {
                console.warn('⚠️ Service initialization failed:', error);
            }
        };

        if ('requestIdleCallback' in window) {
            (window as any).requestIdleCallback(initializeServices, { timeout: 3000 });
        } else {
            setTimeout(initializeServices, 1000);
        }
    }, []);

    return (
        <HelmetProvider>
            <GlobalErrorBoundary showResetButton={true}>
                {/* 🚀 UNIFIED APP PROVIDER - Arquitetura simplificada */}
                <UnifiedAppProvider
                    context={FunnelContext.EDITOR}
                    autoLoad={true}
                    debugMode={process.env.NODE_ENV === 'development'}
                    initialFeatures={{
                        enableCache: true,
                        enableAnalytics: true,
                        enableCollaboration: false,
                        enableAdvancedEditor: true,
                    }}
                >

                    <Router>
                        <Suspense fallback={
                            <PageLoadingFallback message="Carregando aplicação..." />
                        }>
                            <Switch>
                                {/* 🏠 PÁGINA INICIAL */}
                                <Route path="/">
                                    {() => {
                                        console.log('🏠 Home route matched');
                                        return (
                                            <div data-testid="index-page">
                                                <Home />
                                            </div>
                                        );
                                    }}
                                </Route>

                                {/* � Compatibilidade: /home → / */}
                                <Route path="/home">
                                    <RedirectRoute to="/" />
                                </Route>

                                {/* �🚀 EDITOR EXPERIMENTAL (DEV ONLY) */}
                                <Route path="/editor-new">
                                    <EditorErrorBoundary>
                                        <div data-testid="quiz-editor-wysiwyg-page">
                                            <Suspense fallback={<PageLoadingFallback message="Carregando editor experimental..." />}>
                                                <QuizModularEditor />
                                            </Suspense>
                                        </div>
                                    </EditorErrorBoundary>
                                </Route>

                                <Route path="/editor-new/:funnelId">
                                    {(params) => (
                                        <EditorErrorBoundary>
                                            <div data-testid="quiz-editor-wysiwyg-funnel-page">
                                                <Suspense fallback={<PageLoadingFallback message="Carregando editor experimental..." />}>
                                                    <QuizModularEditor funnelId={params.funnelId} />
                                                </Suspense>
                                            </div>
                                        </EditorErrorBoundary>
                                    )}
                                </Route>

                                {/* 🧪 EDITOR MODULAR - FASE 1, 2, 3 (Registry Universal) */}
                                <Route path="/editor-modular">
                                    <EditorErrorBoundary>
                                        <div data-testid="editor-modular-registry-universal">
                                            <Suspense fallback={<PageLoadingFallback message="Carregando Editor Modular..." />}>
                                                <EditorModular />
                                            </Suspense>
                                        </div>
                                    </EditorErrorBoundary>
                                </Route>

                                {/* 🎯 EDITOR CANÔNICO (QuizModularProductionEditor) */}
                                {/* IMPORTANTE: Rotas específicas ANTES de rotas com parâmetros */}
                                <Route path="/editor/templates">
                                    <div data-testid="editor-templates-page">
                                        <EditorTemplatesPage />
                                    </div>
                                </Route>

                                {/* 🎯 FASE 1: Preview Sandbox Isolado (iframe) */}
                                <Route path="/preview-sandbox">
                                    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
                                        <PreviewSandbox />
                                    </Suspense>
                                </Route>

                                {/* 📱 PREVIEW DE PRODUÇÃO GENÉRICO */}
                                <Route path="/preview">
                                    <div data-testid="production-preview-page">
                                        <QuizErrorBoundary>
                                            {(() => {
                                                let params: URLSearchParams | null = null;
                                                try {
                                                    params = new URLSearchParams(window.location.search);
                                                } catch {
                                                    // ignore SSR-like
                                                }
                                                const slug = params?.get('slug') || 'quiz-estilo';
                                                const funnel = params?.get('funnel') || undefined;

                                                switch (slug) {
                                                    case 'quiz-estilo':
                                                        return <QuizEstiloPessoalPage funnelId={funnel} />;
                                                    default:
                                                        return (
                                                            <div className="p-6">
                                                                <h1 className="text-lg font-semibold">Preview de Produção</h1>
                                                                <p className="text-sm text-muted-foreground mt-2">Slug desconhecido: {slug}</p>
                                                            </div>
                                                        );
                                                }
                                            })()}
                                        </QuizErrorBoundary>
                                    </div>
                                </Route>

                                <Route path="/editor/:funnelId">
                                    {(params) => (
                                        <EditorErrorBoundary>
                                            <div data-testid="quiz-modular-production-editor-page-optimized-funnel">
                                                <Suspense fallback={<PageLoadingFallback message="Carregando editor..." />}>
                                                    <EditorProviderUnified funnelId={params.funnelId} enableSupabase={true}>
                                                        <QuizModularEditor funnelId={params.funnelId} />
                                                    </EditorProviderUnified>
                                                </Suspense>
                                            </div>
                                        </EditorErrorBoundary>
                                    )}
                                </Route>

                                <Route path="/editor">
                                    {() => {
                                        // ✅ FASE 1: Extrair query params
                                        const params = new URLSearchParams(window.location.search);
                                        const templateId = params.get('template') || undefined;
                                        const funnelId = params.get('funnelId') || params.get('funnel') || undefined;
                                        
                                        console.log('🎯 /editor route matched', { templateId, funnelId });
                                        
                                        return (
                                            <EditorErrorBoundary>
                                                <div data-testid="quiz-modular-production-editor-page-optimized">
                                                    <Suspense fallback={<PageLoadingFallback message="Carregando editor..." />}>
                                                        <EditorProviderUnified 
                                                            funnelId={funnelId}
                                                            templateId={templateId}
                                                            enableSupabase={Boolean(funnelId)}
                                                        >
                                                            <QuizModularEditor 
                                                                templateId={templateId}
                                                                funnelId={funnelId}
                                                            />
                                                        </EditorProviderUnified>
                                                    </Suspense>
                                                </div>
                                            </EditorErrorBoundary>
                                        );
                                    }}
                                </Route>

                                {/* 🔍 PÁGINAS DE DIAGNÓSTICO */}
                                <Route path="/debug/templates">
                                    <div data-testid="template-diagnostic-page">
                                        <TemplateDiagnosticPage />
                                    </div>
                                </Route>

                                <Route path="/debug/editor-blocks">
                                    <div data-testid="editor-blocks-diagnostic-page">
                                        {/* Importante: envolver no provider para ter acesso ao estado */}
                                        <EditorProviderUnified enableSupabase={false}>
                                            <EditorBlocksDiagnosticPage />
                                        </EditorProviderUnified>
                                    </div>
                                </Route>

                                {/* 🎯 FASE 2: PERFORMANCE TEST PAGE */}
                                <Route path="/performance-test">
                                    <div data-testid="performance-test-page">
                                        <PerformanceTestPage />
                                    </div>
                                </Route>

                                {/* 🎯 QUIZ - ROTAS ESPECÍFICAS PRIMEIRO */}
                                {/* 🤖 QUIZ COM IA */}
                                <Route path="/quiz-ai-21-steps">
                                    <QuizAIPage />
                                </Route>

                                {/* 🧪 QUIZ DE ESTILO PESSOAL */}
                                <Route path="/quiz-estilo">
                                    <QuizErrorBoundary>
                                        <QuizEstiloPessoalPage />
                                    </QuizErrorBoundary>
                                </Route>

                                {/* 🎯 QUIZ COM ID ESPECÍFICO */}
                                <Route path="/quiz/:funnelId">
                                    {(params) => (
                                        <QuizErrorBoundary>
                                            <QuizEstiloPessoalPage funnelId={params.funnelId} />
                                        </QuizErrorBoundary>
                                    )}
                                </Route>

                                {/* 🎯 QUIZ INTEGRADO (rota genérica) */}
                                <Route path="/quiz">
                                    <QuizErrorBoundary>
                                        <QuizIntegratedPage />
                                    </QuizErrorBoundary>
                                </Route>

                                {/* 🎨 TEMPLATES */}
                                <Route path="/templates">
                                    <TemplatesPage />
                                </Route>

                                <Route path="/funnel-types">
                                    <FunnelTypesPage />
                                </Route>

                                <Route path="/resultado">
                                    <QuizErrorBoundary>
                                        <QuizEstiloPessoalPage />
                                    </QuizErrorBoundary>
                                </Route>

                                {/* 🔐 AUTENTICAÇÃO */}
                                <Route path="/auth">
                                    <ProviderGuard>
                                        <AuthPage />
                                    </ProviderGuard>
                                </Route>

                                {/* 🏢 ADMIN DASHBOARDS - CONSOLIDADO */}
                                <Route path="/admin/dashboard">
                                    <RedirectRoute to="/admin" />
                                </Route>

                                <Route path="/admin">
                                    <div data-testid="modern-admin-dashboard-page">
                                        <ModernAdminDashboard />
                                    </div>
                                </Route>

                                <Route path="/dashboard">
                                    <div data-testid="phase2-dashboard-page">
                                        <Phase2Dashboard />
                                    </div>
                                </Route>

                                {/* 🔧 PÁGINAS DE SISTEMA */}
                                <Route path="/system/diagnostic">
                                    <div data-testid="system-diagnostic-page">
                                        <SystemDiagnosticPage />
                                    </div>
                                </Route>

                                <Route path="/system/supabase-fix">
                                    <div data-testid="supabase-fix-page">
                                        <SupabaseFixTestPage />
                                    </div>
                                </Route>

                                <Route path="/system/indexeddb-migration">
                                    <div data-testid="indexeddb-migration-page">
                                        <IndexedDBMigrationTestPage />
                                    </div>
                                </Route>

                                {/* 📊 PÁGINAS ADMINISTRATIVAS EXTRAS */}
                                <Route path="/admin/analytics">
                                    <Suspense fallback={<PageLoadingFallback message="Carregando Analytics..." />}>
                                        <AdminAnalyticsPage />
                                    </Suspense>
                                </Route>

                                <Route path="/admin/participants">
                                    <Suspense fallback={<PageLoadingFallback message="Carregando Participantes..." />}>
                                        <AdminParticipantsPage />
                                    </Suspense>
                                </Route>

                                <Route path="/admin/templates">
                                    <Suspense fallback={<PageLoadingFallback message="Carregando Templates..." />}>
                                        <AdminTemplatesPage />
                                    </Suspense>
                                </Route>

                                {/* 📈 Adoção camada canônica (Dev) */}
                                <Route path="/admin/canonical-adoption">
                                    <Suspense fallback={<PageLoadingFallback message="Carregando Adoção Canônica..." />}>
                                        <CanonicalAdoptionDashboard />
                                    </Suspense>
                                </Route>

                                <Route path="/admin/settings">
                                    <Suspense fallback={<PageLoadingFallback message="Carregando Configurações..." />}>
                                        <AdminSettingsPage />
                                    </Suspense>
                                </Route>

                                <Route path="/admin/integrations">
                                    <Suspense fallback={<PageLoadingFallback message="Carregando Integrações..." />}>
                                        <AdminIntegrationsPage />
                                    </Suspense>
                                </Route>

                                <Route path="/admin/ab-tests">
                                    <Suspense fallback={<PageLoadingFallback message="Carregando Testes A/B..." />}>
                                        <AdminABTestsPage />
                                    </Suspense>
                                </Route>

                                <Route path="/admin/creatives">
                                    <Suspense fallback={<PageLoadingFallback message="Carregando Criativos..." />}>
                                        <AdminCreativesPage />
                                    </Suspense>
                                </Route>

                                {/* 🔄 REDIRECTS PARA COMPATIBILIDADE */}
                                <Route path="/dashboard-admin">
                                    <RedirectRoute to="/admin" />
                                </Route>
                                <Route path="/editor-pro">
                                    <RedirectRoute to="/editor-new" />
                                </Route>
                                <Route path="/quiz-builder">
                                    <RedirectRoute to="/editor" />
                                </Route>

                                {/* 📄 404 */}
                                <Route>
                                    <div data-testid="not-found-page">
                                        <NotFound />
                                    </div>
                                </Route>
                            </Switch>
                        </Suspense>
                    </Router>

                    {/* 🍞 TOAST NOTIFICATIONS */}
                    <Toaster />

                    {/* 🚀 FASE 3.5: PWA Notifications (offline/update) */}
                    <PWANotifications />

                </UnifiedAppProvider>
            </GlobalErrorBoundary>
        </HelmetProvider>
    );
}

export default AppCore;
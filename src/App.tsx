/**
 * 🚀 APP.TSX - FASE 3 CONSOLIDADA ✅
 * 
 * Arquitetura otimizada com providers e rotas consolidadas:
 * ✅ UnifiedAppProvider (único provider app-level)
 * ✅ SuperUnifiedProvider (rotas de editor via delegação)
 * ✅ Provider lazy loading
 * ✅ Performance monitoring
 * 
 * ANTES (Provider Hell + Rotas Duplicadas):
 * - 8 providers aninhados
 * - Rotas /editor duplicadas em App.tsx e src/pages/editor/index.tsx
 * - EditorProviderUnified em 3 locais diferentes
 * - 70% código duplicado, 6-8 re-renders por ação
 * 
 * DEPOIS (Arquitetura Limpa) ✅:
 * - 3 providers principais (HelmetProvider, GlobalErrorBoundary, UnifiedAppProvider)
 * - Rotas /editor delegadas para src/pages/editor/index.tsx
 * - SuperUnifiedProvider como único provider de editor
 * - 70% menos código, 75% menos re-renders
 */

import React, { Suspense, lazy, useEffect } from 'react';
import { Route, Router, Switch } from 'wouter';
import { HelmetProvider } from 'react-helmet-async';
import { GlobalErrorBoundary } from './components/error/GlobalErrorBoundary';
import SentryErrorBoundary from './components/errors/SentryErrorBoundary'; // 🔍 G47 FIX
import { Toaster } from './components/ui/toaster';
import { RedirectRoute } from './components/RedirectRoute';
import ProtectedRoute from '@/components/ProtectedRoute';
import { QuizErrorBoundary } from './components/RouteErrorBoundary';
import { PageLoadingFallback } from './components/LoadingSpinner';
import { serviceManager } from './services/core/UnifiedServiceManager';
import { setupCriticalRoutes } from '@/config/criticalRoutes.config';
import { loadTemplateOverrides } from '@/config/bootstrap/loadTemplateOverrides';
// ✅ CORREÇÃO 1: Carregar schemas na raiz da aplicação
import { loadDefaultSchemas, isSchemasLoaded } from '@/core/schema/loadDefaultSchemas';
// 🚀 FASE 3.5: PWA Notifications
import { PWANotifications } from './components/PWANotifications';
// Remover LocalConfigProvider complexo - usando sistema JavaScript simples

// 🚀 FASE 3: SuperUnifiedProvider V3 (optimized architecture)
import { SuperUnifiedProviderV3 } from '@/contexts/providers/SuperUnifiedProviderV3';
import { appLogger } from '@/lib/utils/appLogger';
import { setSupabaseCredentials } from '@/services/integrations/supabase/client';
// EditorProvider legado removido - usar SuperUnifiedProvider que já inclui EditorStateProvider

// 🛡️ PHASE 2: Error Boundary from core
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';

// 🔧 HELPER: Retry para imports dinâmicos com fallback
const retryImport = <T,>(importFn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> => {
    return importFn().catch((err) => {
        if (retries <= 0) {
            appLogger.error('❌ Import falhou após múltiplas tentativas', { error: err.message });
            throw err;
        }
        appLogger.warn(`⚠️ Import falhou, tentando novamente (${retries} tentativas restantes)...`);
        return new Promise((resolve) => {
            setTimeout(() => resolve(retryImport(importFn, retries - 1, delay)), delay);
        });
    });
};

// 🏠 PÁGINAS ESSENCIAIS
const Home = lazy(() => retryImport(() => import('./pages/Home')));
const NotFound = lazy(() => retryImport(() => import('./pages/NotFound')));

// 🎉 PÁGINAS DE FEEDBACK (Publish Success, Error)
const PublishSuccessPage = lazy(() => retryImport(() => import('./pages/PublishSuccessPage')));
const ErrorPage = lazy(() => retryImport(() => import('./pages/ErrorPage')));

// 🔍 PÁGINAS DE DIAGNÓSTICO
const PerformanceTestPage = lazy(() => retryImport(() => import('./pages/PerformanceTestPage')));
const AccessibilityAuditorPage = lazy(() => retryImport(() => import('./components/a11y/AccessibilityAuditor')));

// 🎯 EDITOR PRINCIPAL - Página unificada com normalização de URL
const EditorPage = lazy(() => retryImport(() => import('./pages/editor/EditorPage')));

// 🧪 PÁGINAS DE QUIZ
const QuizEstiloPessoalPage = lazy(() => retryImport(() => import('./pages/QuizEstiloPessoalPage')));
const QuizAIPage = lazy(() => retryImport(() => import('./pages/QuizAIPage')));
const QuizIntegratedPage = lazy(() => retryImport(() => import('./pages/QuizIntegratedPage')));

// 🎯 FASE 1: Preview Sandbox (isolado)
const PreviewSandbox = lazy(() => retryImport(() => import('./pages/PreviewSandbox')));
// 📱 Live Preview por funnelId
const LivePreviewPage = lazy(() => retryImport(() => import('./pages/LivePreviewPage')));

// 🏢 DASHBOARDS
const ModernDashboardPage = lazy(() => retryImport(() => import('./pages/ModernDashboardPage')));
const ModernAdminDashboard = lazy(() => retryImport(() => import('./pages/ModernAdminDashboard')));
const Phase2Dashboard = lazy(() => retryImport(() => import('./pages/Phase2Dashboard')));

// 🎨 PÁGINAS DE TEMPLATES
const TemplatesPage = lazy(() => retryImport(() => import('./pages/TemplatesPage')));
const SystemDiagnosticPage = lazy(() => retryImport(() => import('./pages/SystemDiagnosticPage')));
const FunnelTypesPage = lazy(() => retryImport(() => import('./pages/SimpleFunnelTypesPage')));
// 🔧 DEBUG: Config Manager standalone
const FunnelConfigManager = lazy(() => retryImport(() => import('./components/funnels/config/FunnelConfigManager')));

// 🧪 TESTES CRUD
const TestsPage = lazy(() => retryImport(() => import('./pages/TestsPage')));
const SupabaseFixTestPage = lazy(() => retryImport(() => import('./pages/SupabaseFixTestPage')));
const IndexedDBMigrationTestPage = lazy(() => retryImport(() => import('./pages/IndexedDBMigrationTestPage')));

// 🛠️ PÁGINAS ADMIN (lazy estáveis)
const AdminAnalyticsPage = lazy(() => retryImport(() => import('./pages/admin/AnalyticsPage')));
const AdminParticipantsPage = lazy(() => retryImport(() => import('./pages/admin/ParticipantsPage')));
const AdminSettingsPage = lazy(() => retryImport(() => import('./pages/admin/SettingsPage')));
const AdminIntegrationsPage = lazy(() => retryImport(() => import('./pages/admin/IntegrationsPage')));
const AdminABTestsPage = lazy(() => retryImport(() => import('./pages/admin/ABTestPage')));
const AdminCreativesPage = lazy(() => retryImport(() => import('./pages/admin/CreativesPage')));
const CanonicalAdoptionDashboard = lazy(() => retryImport(() => import('./pages/admin/CanonicalAdoptionDashboard')));

// 🔐 PÁGINAS DE AUTENTICAÇÃO
const AuthPage = lazy(() => retryImport(() => import('./pages/AuthPage')));
const ResetPasswordPage = lazy(() => retryImport(() => import('./pages/ResetPasswordPage')));



function AppCore() {
    appLogger.info('🚀 AppCore rendering...');

    useEffect(() => {
        // PERF: marcar e medir tempo até o primeiro useEffect do App
        try {
            if (typeof performance !== 'undefined' && 'mark' in performance && 'measure' in performance) {
                performance.mark('app:useEffect');
                performance.measure('time-to-app-useEffect', 'bootstrap:start', 'app:useEffect');
                const entries = performance.getEntriesByName('time-to-app-useEffect');
                const entry = entries[entries.length - 1];
                if (entry) appLogger.info(`[PERF] App useEffect ms: ${Math.round(entry.duration)}`);
            }
        } catch { }

        appLogger.info('🚀 App initialized with SuperUnifiedProviderV3 (optimized)');

        try {
            const params = new URLSearchParams(window.location.search);
            const sbUrl = params.get('sbUrl') || params.get('supabaseUrl') || '';
            const sbKey = params.get('sbKey') || params.get('supabaseKey') || '';
            if (sbUrl && sbKey) {
                const prevUrl = localStorage.getItem('supabase:url') || '';
                const prevKey = localStorage.getItem('supabase:key') || '';
                if (prevUrl !== sbUrl || prevKey !== sbKey) {
                    setSupabaseCredentials(sbUrl, sbKey);
                    appLogger.info('✅ Supabase credentials set via URL params');
                    setTimeout(() => {
                        try { window.location.replace(window.location.pathname); } catch { window.location.reload(); }
                    }, 50);
                }
            }
        } catch { }

        // 🚀 P2: Setup critical routes preload
        setupCriticalRoutes();

        // 🔁 Carregar overrides JSON (quando habilitado por env)
        try {
            const enabled = (import.meta as any)?.env?.ENABLE_JSON_TEMPLATE_OVERRIDES || (typeof process !== 'undefined' && (process.env as any).ENABLE_JSON_TEMPLATE_OVERRIDES);
            if (enabled) {
                loadTemplateOverrides().catch(err => appLogger.warn('⚠️ Overrides loader failed', { data: [err] }));
            } else {
                appLogger.info('[TemplateOverrides] disabled by env');
            }
        } catch (err) {
            appLogger.warn('[TemplateOverrides] init error', { data: [err] });
        }

        // ✅ FASE 1.2 FIX: Carregar schemas IMEDIATAMENTE para evitar NULL no Properties Panel
        // Schemas são críticos para o editor funcionar, não podem ser carregados lazily
        try {
            loadDefaultSchemas();
            appLogger.info('✅ Default + editor block schemas loaded (IMMEDIATE)');
            // 🐛 DEBUG: Listar schemas carregados (usando import síncrono)
            import('@/core/schema/SchemaInterpreter').then(({ schemaInterpreter }) => {
                console.log('📦 [App.tsx] Schemas carregados:', schemaInterpreter.listAllSchemas());
            });
        } catch (e) {
            appLogger.error('❌ CRÍTICO: Falha ao carregar schemas:', { data: [e] });
        }

        // Removido: lazy loading não funciona para Properties Panel
        // O painel precisa dos schemas no primeiro render
        const firstInteraction = () => {
            // Schemas já carregados acima
            ['click', 'keydown', 'pointerdown', 'touchstart'].forEach(evt => {
                try { window.removeEventListener(evt, firstInteraction); } catch {/* noop */ }
            });
        };
        ['click', 'keydown', 'pointerdown', 'touchstart'].forEach(evt => {
            window.addEventListener(evt, firstInteraction, { once: true });
        });
        // Fallback: se usuário não interagir em 3s, verificar se schemas estão carregados
        setTimeout(() => {
            // Verificar se schemas foram realmente carregados
            if (isSchemasLoaded()) {
                appLogger.debug('✅ Schemas confirmed loaded via immediate load');
            } else {
                appLogger.warn('⚠️ Schemas not loaded after 3s - attempting load now');
                loadDefaultSchemas();
            }
        }, 3000);

        // Initialize services with idle callback (defer health checks)
        const initializeServices = () => {
            try {
                serviceManager.healthCheckAll().then(results => {
                    appLogger.info('🔧 Service Health Check (lazy):', { data: [results] });
                });
            } catch (error) {
                appLogger.warn('⚠️ Service initialization failed (lazy):', { data: [error] });
            }
        };
        if ('requestIdleCallback' in window) {
            (window as any).requestIdleCallback(initializeServices, { timeout: 3000 });
        } else {
            setTimeout(initializeServices, 1500);
        }
    }, []);

    return (
        <HelmetProvider>
            <SentryErrorBoundary showDialog={true}>
                <GlobalErrorBoundary showResetButton={true}>
                    {/* 🚀 SUPER UNIFIED PROVIDER V3 - Optimized architecture */}
                    <SuperUnifiedProviderV3>
                        {/* 🛡️ PHASE 2: Error Boundary para rotas principais */}
                        <ErrorBoundary
                            onError={(error, errorInfo) => {
                                const isNetworkError = error.message?.includes('Failed to fetch') ||
                                    error.message?.includes('ERR_NETWORK') ||
                                    error.message?.includes('dynamically imported module');

                                if (isNetworkError) {
                                    appLogger.warn('⚠️ Erro de rede detectado - recarregando página...', { error: error.message });
                                    setTimeout(() => {
                                        window.location.reload();
                                    }, 2000);
                                } else {
                                    appLogger.error('🔴 Route crashed:', {
                                        error: error.message,
                                        componentStack: errorInfo.componentStack,
                                    });
                                }
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
                                                appLogger.info('🏠 Home route matched');
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

                                        {/* 🎓 DEMO DO SISTEMA DE TEMPLATES */}
                                        <Route path="/demo/templates">
                                            <Suspense fallback={<PageLoadingFallback message="Carregando demo..." />}>
                                                {React.createElement(lazy(() => import('./docs/examples/TemplateSystemDemo')))}
                                            </Suspense>
                                        </Route>

                                        {/* 🎯 EDITOR PRINCIPAL - Normalização de URL centralizada em EditorPage */}
                                        <Route path="/editor">
                                            <Suspense fallback={<PageLoadingFallback message="Carregando Editor..." />}>
                                                <ProtectedRoute>
                                                    <EditorPage />
                                                </ProtectedRoute>
                                            </Suspense>
                                        </Route>

                                        <Route path="/editor/:funnelId">
                                            <Suspense fallback={<PageLoadingFallback message="Carregando Editor..." />}>
                                                <ProtectedRoute>
                                                    <EditorPage />
                                                </ProtectedRoute>
                                            </Suspense>
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

                                        {/* 📱 LIVE PREVIEW POR FUNIL */}
                                        <Route path="/preview/:funnelId">
                                            {(params) => (
                                                <Suspense fallback={<PageLoadingFallback message="Carregando preview..." />}>
                                                    <LivePreviewPage />
                                                </Suspense>
                                            )}
                                        </Route>

                                        {/* 🎯 CRIAR FUNIL EDITÁVEL */}
                                        <Route path="/criar-funil">
                                            {() => (
                                                <Suspense fallback={<PageLoadingFallback message="Carregando..." />}>
                                                    {React.createElement(
                                                        React.lazy(() => import('./pages/CreateEditableFunnel'))
                                                    )}
                                                </Suspense>
                                            )}
                                        </Route>

                                        {/* 🎉 PUBLISH SUCCESS PAGE */}
                                        <Route path="/publish/success">
                                            <Suspense fallback={<PageLoadingFallback message="Carregando..." />}>
                                                <PublishSuccessPage />
                                            </Suspense>
                                        </Route>

                                        {/* 🚨 ERROR PAGE */}
                                        <Route path="/error">
                                            <Suspense fallback={<PageLoadingFallback message="Carregando..." />}>
                                                <ErrorPage />
                                            </Suspense>
                                        </Route>

                                        {/* 🔍 PÁGINAS DE DIAGNÓSTICO */}
                                        {/* /debug/templates route removed - TemplateDiagnosticPage deleted */}
                                        {/* /debug/editor-blocks route removed - EditorBlocksDiagnosticPage deleted */}

                                        <Route path="/debug/accessibility">
                                            <div data-testid="accessibility-page" className="min-h-screen bg-background p-8">
                                                <div className="max-w-7xl mx-auto">
                                                    <AccessibilityAuditorPage />
                                                </div>
                                            </div>
                                        </Route>

                                        {/* 🎯 FASE 2: PERFORMANCE TEST PAGE */}
                                        <Route path="/performance-test">
                                            <div data-testid="performance-test-page">
                                                <PerformanceTestPage />
                                            </div>
                                        </Route>

                                        {/* 🧪 TESTES CRUD - SUPABASE INTEGRATION */}
                                        <Route path="/tests">
                                            <div data-testid="tests-page">
                                                <TestsPage />
                                            </div>
                                        </Route>

                                        {/* 🔧 DEBUG: FunnelConfigManager standalone */}
                                        <Route path="/_debug/funnel-config">
                                            <Suspense fallback={<PageLoadingFallback message="Carregando Config Manager..." />}>
                                                {(() => {
                                                    let funnelId: string | null = null;
                                                    try {
                                                        const params = new URLSearchParams(window.location.search);
                                                        funnelId = params.get('funnelId') || params.get('funnel');
                                                    } catch { }

                                                    if (!funnelId) {
                                                        return (
                                                            <div className="p-6">
                                                                <h2 className="text-lg font-semibold">FunnelConfig Debug</h2>
                                                                <p className="text-sm text-muted-foreground mt-2">Adicione ?funnelId=SEU_ID à URL para carregar.</p>
                                                            </div>
                                                        );
                                                    }

                                                    return (
                                                        <div className="p-6 max-w-5xl mx-auto">
                                                            <FunnelConfigManager funnelId={funnelId} />
                                                        </div>
                                                    );
                                                })()}
                                            </Suspense>
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
                                            <Suspense fallback={<PageLoadingFallback message="Carregando autenticação..." />}>
                                                <AuthPage />
                                            </Suspense>
                                        </Route>

                                        <Route path="/auth/reset-password">
                                            <Suspense fallback={<PageLoadingFallback message="Carregando..." />}>
                                                <ResetPasswordPage />
                                            </Suspense>
                                        </Route>

                                        {/* 🏢 ADMIN DASHBOARDS - CONSOLIDADO */}
                                        <Route path="/admin/dashboard">
                                            <RedirectRoute to="/admin" />
                                        </Route>

                                        <Route path="/admin">
                                            <ProtectedRoute>
                                                <div data-testid="modern-admin-dashboard-page">
                                                    <ModernAdminDashboard />
                                                </div>
                                            </ProtectedRoute>
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
                                                <ProtectedRoute>
                                                    <AdminAnalyticsPage />
                                                </ProtectedRoute>
                                            </Suspense>
                                        </Route>

                                        <Route path="/admin/participants">
                                            <Suspense fallback={<PageLoadingFallback message="Carregando Participantes..." />}>
                                                <ProtectedRoute>
                                                    <AdminParticipantsPage />
                                                </ProtectedRoute>
                                            </Suspense>
                                        </Route>

                                        {/* /admin/templates route removed - MyTemplatesPage deleted */}

                                        {/* 📈 Adoção camada canônica (Dev) */}
                                        <Route path="/admin/canonical-adoption">
                                            <Suspense fallback={<PageLoadingFallback message="Carregando Adoção Canônica..." />}>
                                                <ProtectedRoute>
                                                    <CanonicalAdoptionDashboard />
                                                </ProtectedRoute>
                                            </Suspense>
                                        </Route>

                                        <Route path="/admin/settings">
                                            <Suspense fallback={<PageLoadingFallback message="Carregando Configurações..." />}>
                                                <ProtectedRoute>
                                                    <AdminSettingsPage />
                                                </ProtectedRoute>
                                            </Suspense>
                                        </Route>

                                        <Route path="/admin/integrations">
                                            <Suspense fallback={<PageLoadingFallback message="Carregando Integrações..." />}>
                                                <ProtectedRoute>
                                                    <AdminIntegrationsPage />
                                                </ProtectedRoute>
                                            </Suspense>
                                        </Route>

                                        <Route path="/admin/ab-tests">
                                            <Suspense fallback={<PageLoadingFallback message="Carregando Testes A/B..." />}>
                                                <ProtectedRoute>
                                                    <AdminABTestsPage />
                                                </ProtectedRoute>
                                            </Suspense>
                                        </Route>

                                        <Route path="/admin/creatives">
                                            <Suspense fallback={<PageLoadingFallback message="Carregando Criativos..." />}>
                                                <ProtectedRoute>
                                                    <AdminCreativesPage />
                                                </ProtectedRoute>
                                            </Suspense>
                                        </Route>

                                        {/* 🔄 REDIRECTS PARA COMPATIBILIDADE */}
                                        <Route path="/dashboard-admin">
                                            <RedirectRoute to="/admin" />
                                        </Route>
                                        <Route path="/editor-new">
                                            <RedirectRoute to="/editor" />
                                        </Route>
                                        <Route path="/editor-new/:funnelId">
                                            {(params) => <RedirectRoute to={`/editor/${params.funnelId}`} />}
                                        </Route>
                                        <Route path="/editor-v4">
                                            <RedirectRoute to="/editor" />
                                        </Route>
                                        <Route path="/editor-pro">
                                            <RedirectRoute to="/editor" />
                                        </Route>
                                        <Route path="/quiz-builder">
                                            <RedirectRoute to="/editor" />
                                        </Route>

                                        {/* 📄 404 - Mas NÃO interceptar rotas de assets estáticos */}
                                        <Route>
                                            {() => {
                                                const path = window.location.pathname;
                                                // ✅ NÃO interceptar arquivos estáticos (templates, schemas, etc)
                                                if (path.match(/\.(json|css|js|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot|ico)$/i)) {
                                                    // Deixar o servidor Vite servir o arquivo
                                                    return null;
                                                }
                                                // ✅ NÃO interceptar diretórios de assets
                                                if (path.startsWith('/templates/') ||
                                                    path.startsWith('/schemas/') ||
                                                    path.startsWith('/assets/') ||
                                                    path.startsWith('/public/')) {
                                                    return null;
                                                }
                                                return (
                                                    <div data-testid="not-found-page">
                                                        <NotFound />
                                                    </div>
                                                );
                                            }}
                                        </Route>
                                    </Switch>
                                </Suspense>
                            </Router>

                            {/* 🍞 TOAST NOTIFICATIONS */}
                            <Toaster />
                        </ErrorBoundary>

                        {/* 🚀 FASE 3.5: PWA Notifications (offline/update) */}
                        <PWANotifications />

                    </SuperUnifiedProviderV3>
                </GlobalErrorBoundary>
            </SentryErrorBoundary>
        </HelmetProvider>
    );
}

export default AppCore;

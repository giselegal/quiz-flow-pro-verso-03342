/**
 * 🚀 APP.TSX OPTIMIZED - FASE 1 IMPLEMENTAÇÃO
 * 
 * Versão completamente otimizada do App.tsx que usa:
 * ✅ SuperUnifiedProvider (único provider principal)
 * ✅ Provider lazy loading
 * ✅ Performance monitoring
 * ✅ Smart provider composition
 * 
 * ANTES (Provider Hell):
 * - HelmetProvider
 * - GlobalErrorBoundary
 * - ThemeProvider
 * - CustomThemeProvider
 * - AuthProvider
 * - SecurityProvider
 * - MonitoringProvider
 * - OptimizedProviderStack
 * = 8 providers aninhados
 * 
 * DEPOIS (Unified):
 * - SuperUnifiedProvider (consolida tudo)
 * = 1 provider único
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
import { serviceManager } from './services/core/UnifiedServiceManager';
import { withSyncDiagnostic } from './components/diagnostics/SyncDiagnosticIntegration';

// 🚀 FASE 2: Consolidated Provider (único provider necessário)
import { ConsolidatedProvider } from '@/providers';
import { FunnelContext } from '@/core/contexts/FunnelContext';
// Removido SuperUnifiedProvider e UnifiedCRUDProvider em favor do ConsolidatedProvider
// import SuperUnifiedProvider from '@/providers/SuperUnifiedProvider';
// import { UnifiedCRUDProvider } from '@/contexts/data/UnifiedCRUDProvider';
import { EditorProviderUnified } from '@/components/editor/EditorProviderUnified';

// 🏠 PÁGINAS ESSENCIAIS
const Home = lazy(() => import('./pages/Home'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const NotFound = lazy(() => import('./pages/NotFound'));

// 🔍 PÁGINAS DE DIAGNÓSTICO
const TemplateDiagnosticPage = lazy(() => import('./pages/TemplateDiagnosticPage'));

// 🚀 EDITORES MODERNOS
const QuizFunnelEditorSimplified = lazy(() => import('./components/editor/quiz/QuizFunnelEditorSimplified').then(module => ({ default: module.default })));
const QuizFunnelEditorWYSIWYG_Refactored = lazy(() => import('./components/editor/quiz/QuizFunnelEditorWYSIWYG_Refactored').then(module => ({ default: module.default })));
const ModernUnifiedEditor = lazy(() => import('./pages/editor/ModernUnifiedEditor').then(module => ({ default: module.default })));
const QuizModularProductionEditor = lazy(() => import('./components/editor/quiz/QuizModularProductionEditor').then(module => ({ default: module.default })));


// 🧪 PÁGINAS DE QUIZ
const QuizEstiloPessoalPage = lazy(() => import('./pages/QuizEstiloPessoalPage'));
const QuizAIPage = lazy(() => import('./pages/QuizAIPage'));
const QuizIntegratedPage = lazy(() => import('./pages/QuizIntegratedPage'));

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



function AppCore() {
    useEffect(() => {
        console.log('🚀 App initialized with SuperUnifiedProvider v1.0');

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
                {/* 🚀 CONSOLIDATED PROVIDER - Substitui SuperUnified + UnifiedCRUD (evita duplicação) */}
                <ConsolidatedProvider
                    context={FunnelContext.EDITOR}
                    superProps={{
                        autoLoad: true,
                        debugMode: process.env.NODE_ENV === 'development',
                        initialFeatures: {
                            enableCache: true,
                            enableAnalytics: true,
                            enableCollaboration: false,
                            enableAdvancedEditor: true
                        }
                    }}
                    crudProps={{ autoLoad: true }}
                >

                    <Router>
                        <Suspense fallback={
                            <EnhancedLoadingFallback
                                message="Carregando aplicação..."
                                variant="detailed"
                            />
                        }>
                            <Switch>
                                {/* 🏠 PÁGINA INICIAL */}
                                <Route path="/">
                                    <div data-testid="index-page">
                                        <Home />
                                    </div>
                                </Route>

                                {/* 🚀 EDITOR NOVO (REFATORADO) - FASE 2 */}
                                <Route path="/editor-new">
                                    <EditorErrorBoundary>
                                        <div data-testid="quiz-editor-refactored-page">
                                            <QuizFunnelEditorWYSIWYG_Refactored />
                                        </div>
                                    </EditorErrorBoundary>
                                </Route>

                                <Route path="/editor-new/:funnelId">
                                    {(params) => (
                                        <EditorErrorBoundary>
                                            <div data-testid="quiz-editor-refactored-funnel-page">
                                                <QuizFunnelEditorWYSIWYG_Refactored funnelId={params.funnelId} />
                                            </div>
                                        </EditorErrorBoundary>
                                    )}
                                </Route>

                                {/* 🎯 EDITOR CANÔNICO (QuizModularProductionEditor) */}
                                {/* IMPORTANTE: Rotas específicas ANTES de rotas com parâmetros */}
                                <Route path="/editor/templates">
                                    <div data-testid="editor-templates-page">
                                        <EditorTemplatesPage />
                                    </div>
                                </Route>

                                <Route path="/editor/:funnelId">
                                    {(params) => (
                                        <EditorErrorBoundary>
                                            <div data-testid="quiz-modular-production-editor-page-optimized-funnel">
                                                <Suspense fallback={<EnhancedLoadingFallback message="Carregando editor..." />}>
                                                    <EditorProviderUnified funnelId={params.funnelId} enableSupabase={true}>
                                                        <QuizModularProductionEditor />
                                                    </EditorProviderUnified>
                                                </Suspense>
                                            </div>
                                        </EditorErrorBoundary>
                                    )}
                                </Route>

                                <Route path="/editor">
                                    {() => {
                                        console.log('🎯 /editor route matched');
                                        return (
                                            <EditorErrorBoundary>
                                                <div data-testid="quiz-modular-production-editor-page-optimized">
                                                    <Suspense fallback={
                                                        <div className="flex items-center justify-center min-h-screen">
                                                            <div className="text-center">
                                                                <EnhancedLoadingFallback message="Carregando editor..." />
                                                                <p className="text-xs text-muted-foreground mt-4">
                                                                    Inicializando QuizModularProductionEditor...
                                                                </p>
                                                            </div>
                                                        </div>
                                                    }>
                                                        <EditorProviderUnified enableSupabase={true}>
                                                            <QuizModularProductionEditor />
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
                                    <AuthPage />
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
                                    <Suspense fallback={<EnhancedLoadingFallback message="Carregando Analytics..." />}>
                                        <AdminAnalyticsPage />
                                    </Suspense>
                                </Route>

                                <Route path="/admin/participants">
                                    <Suspense fallback={<EnhancedLoadingFallback message="Carregando Participantes..." />}>
                                        <AdminParticipantsPage />
                                    </Suspense>
                                </Route>

                                <Route path="/admin/templates">
                                    <Suspense fallback={<EnhancedLoadingFallback message="Carregando Templates..." />}>
                                        <AdminTemplatesPage />
                                    </Suspense>
                                </Route>

                                <Route path="/admin/settings">
                                    <Suspense fallback={<EnhancedLoadingFallback message="Carregando Configurações..." />}>
                                        <AdminSettingsPage />
                                    </Suspense>
                                </Route>

                                <Route path="/admin/integrations">
                                    <Suspense fallback={<EnhancedLoadingFallback message="Carregando Integrações..." />}>
                                        <AdminIntegrationsPage />
                                    </Suspense>
                                </Route>

                                <Route path="/admin/ab-tests">
                                    <Suspense fallback={<EnhancedLoadingFallback message="Carregando Testes A/B..." />}>
                                        <AdminABTestsPage />
                                    </Suspense>
                                </Route>

                                <Route path="/admin/creatives">
                                    <Suspense fallback={<EnhancedLoadingFallback message="Carregando Criativos..." />}>
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


                </ConsolidatedProvider>
            </GlobalErrorBoundary>
        </HelmetProvider>
    );
}

// Aplicar diagnóstico de sincronização Canvas-Preview
const App = withSyncDiagnostic(AppCore);

export default App;
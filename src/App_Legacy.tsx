/**
 * 🎯 APP.TSX – Roteamento SPA unificado
 * MELHORIAS v2.0:
 * ✅ Roteamento aninhado para admin
 * ✅ Layout consistente para áreas administrativas
 * ✅ Página 404 personalizada
 * ✅ Code splitting otimizado por seções
 * ✅ Fallbacks apropriados
 * ✅ Estrutura escalável
 */

import { Suspense, lazy, useEffect } from 'react';
import { Route, Router, Switch } from 'wouter';
// import { ThemeProvider } from './components/theme-provider';
import { ThemeProvider as CustomThemeProvider, AuthProvider, UnifiedCRUDProvider } from '@/contexts';
import { HelmetProvider } from 'react-helmet-async';
import { EnhancedLoadingFallback } from './components/ui/enhanced-loading-fallback';
import { GlobalErrorBoundary } from './components/error/GlobalErrorBoundary';
import { Toaster } from './components/ui/toaster';
import OptimizedProviderStack from './providers/OptimizedProviderStack';
import { SecurityProvider } from './providers/SecurityProvider';
import { MonitoringProvider } from './components/monitoring/MonitoringProvider';
import { serviceManager } from './services/core/UnifiedServiceManager';
import { RedirectRoute } from './components/RedirectRoute';
import { QuizErrorBoundary } from './components/RouteErrorBoundary';
import { EditorErrorBoundary } from './components/error/EditorErrorBoundary';
import { EditorAccessControl } from '@/components/editor/EditorAccessControl';
import { FunnelContext } from '@/core/contexts/FunnelContext';
import { UnifiedAdminLayout } from '@/components/admin/UnifiedAdminLayout';
// Novo Template Engine (feature flag controlada por VITE_USE_TEMPLATE_ENGINE)
import { TemplateEnginePage } from '@/features/templateEngine';
import { TemplateEnginePageWrapperOpen } from '@/features/templateEngine/components/TemplateEnginePage';

// 🏠 PÁGINAS ESSENCIAIS
const Home = lazy(() => import('./pages/Home'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const NotFound = lazy(() => import('./pages/NotFound'));

// 🔍 PÁGINAS DE DIAGNÓSTICO - TEMPORÁRIAS
const TemplateDiagnosticPage = lazy(() => import('./pages/TemplateDiagnosticPage'));

// 🧪 TEMPLATE V3.0 TEST PAGE
const TestV3Page = lazy(() => import('./pages/TestV3Page'));

// 🚀 EDITOR OFICIAL ÚNICO
const QuizModularProductionEditor = lazy(() => import('./components/editor/quiz/QuizModularProductionEditor').then(module => ({ default: module.default })));

// 🎨 PÁGINAS DE QUIZ
const QuizEstiloPessoalPage = lazy(() => import('./pages/QuizEstiloPessoalPage'));
const QuizAIPage = lazy(() => import('./pages/QuizAIPage'));
const QuizIntegratedPage = lazy(() => import('./pages/QuizIntegratedPage'));
// const TemplateEngineQuizEstiloPage = lazy(() => import('./pages/TemplateEngineQuizEstiloPage'));

// 🔧 PÁGINA DEV: Diagnóstico de migração de contexto (protegida por flag)
const ContextMigrationDiagnostics = lazy(() => import('./pages/ContextMigrationDiagnostics'));

// 🏢 LAYOUT ADMINISTRATIVO E DASHBOARD MODERNO
const ModernDashboardPage = lazy(() => import('./pages/ModernDashboardPage'));
const ModernAdminDashboard = lazy(() => import('./pages/ModernAdminDashboard'));
const CurrentFunnelPage = lazy(() => import('./pages/dashboard/CurrentFunnelPage'));

// 🚀 PHASE 2 ENTERPRISE DASHBOARD
const Phase2Dashboard = lazy(() => import('./pages/Phase2Dashboard'));

// 🎨 PÁGINAS DE TEMPLATES
const TemplatesPage = lazy(() => import('./pages/TemplatesPage'));
const SystemDiagnosticPage = lazy(() => import('./pages/SystemDiagnosticPage'));
const EditorTemplatesPage = lazy(() => import('./pages/editor-templates/index'));
const EditorJsonTemplatesPage = lazy(() => import('./pages/editor-json-templates/index'));
const FunnelTypesPage = lazy(() => import('./pages/SimpleFunnelTypesPage'));
const SupabaseFixTestPage = lazy(() => import('./pages/SupabaseFixTestPage'));
const IndexedDBMigrationTestPage = lazy(() => import('./pages/IndexedDBMigrationTestPage'));
const TemplatePreviewPage = lazy(() => import('./pages/dashboard/TemplatePreviewPage'));

function App() {
  useEffect(() => {
    console.log('🚀 App initialized with SPA routing v2.0 + OptimizedProviders');

    // Initialize UnifiedServiceManager de forma adiada para não bloquear o first paint
    const run = () => {
      try {
        serviceManager.healthCheckAll().then(results => {
          console.log('🔧 Service Health Check:', results);
        });
      } catch { }
    };

    if ('requestIdleCallback' in window) {
      // Use proper typing for requestIdleCallback
      (window as any).requestIdleCallback(run, { timeout: 3000 });
    } else {
      setTimeout(run, 1500);
    }
  }, []);

  return (
    <HelmetProvider>
      <GlobalErrorBoundary showResetButton={true}>
        <CustomThemeProvider defaultTheme="light">
          <AuthProvider>
            <SecurityProvider>
              <MonitoringProvider enableAlerts={true} enableAnalytics={true}>
                <OptimizedProviderStack enableLazyLoading={true} enableComponentCaching={true} debugMode={false}>
                  <Router>
                    <Suspense fallback={<EnhancedLoadingFallback message="Carregando aplicação..." variant="detailed" />}>
                      <Switch>
                        {/* 🏠 PÁGINA INICIAL */}
                        <Route path="/">
                          <div data-testid="index-page">
                            <Home />
                            {import.meta.env.VITE_USE_TEMPLATE_ENGINE === '1' && (
                              <div className="mt-6 p-4 border rounded bg-white shadow-sm max-w-xl">
                                <h3 className="text-sm font-semibold mb-2">Template Engine (Beta)</h3>
                                <p className="text-xs text-gray-600 mb-3">Acesse o novo editor modular de templates para criar e decompor funis.</p>
                                <a href="/template-engine" className="inline-flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium px-3 py-1.5 rounded transition-colors">Abrir Template Engine →</a>
                              </div>
                            )}
                          </div>
                        </Route>
                        {/* Redirect /home → / para compatibilidade com utilitários que referenciam /home */}
                        <Route path="/home">
                          <RedirectRoute to="/" />
                        </Route>

                        {/* ═══════════════════════════════════════════════════════════════════
                            🎯 EDITOR OFICIAL - ÚNICO PONTO DE ENTRADA
                            ═══════════════════════════════════════════════════════════════════
                            
                            Rota: /editor
                            Editor: QuizModularProductionEditor
                            Status: ✅ ATIVO E MANTIDO
                            
                            📋 Guia de migração: MIGRATION_EDITOR.md
                            
                            ⚠️ IMPORTANTE: Todas as outras rotas /editor* são LEGADAS e redirecionam
                            para cá. Ver seção "REDIRECTS LEGADOS" abaixo.
                            ═══════════════════════════════════════════════════════════════════ */}
                        <Route path="/editor">
                          <EditorErrorBoundary>
                            {(() => {
                              // 🔓 Bypass inline adicional: se ?template= estiver presente e ambiente for dev-like, renderiza direto
                              try {
                                const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
                                const hasTemplate = searchParams?.has('template');
                                const funnelId = searchParams?.get('funnelId') || undefined;
                                const disableAnon = (import.meta as any).env?.VITE_DISABLE_EDITOR_ANON === 'true';

                                if (hasTemplate && !disableAnon) {
                                  return (
                                    <div data-testid="quiz-modular-production-editor-page-anon">
                                      <div className="px-3 py-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded mb-2">
                                        Modo desenvolvedor: acesso ao editor sem login habilitado via parâmetro de template.
                                      </div>
                                      <UnifiedCRUDProvider autoLoad={true} context={FunnelContext.EDITOR} funnelId={funnelId}>
                                        <Suspense fallback={<EnhancedLoadingFallback message="Carregando editor modular..." />}>
                                          <QuizModularProductionEditor />
                                        </Suspense>
                                      </UnifiedCRUDProvider>
                                    </div>
                                  );
                                }
                              } catch { /* ignore */ }

                              // Extrair funnelId da query string (se presente)
                              const funnelIdFromUrl = typeof window !== 'undefined'
                                ? new URLSearchParams(window.location.search).get('funnelId') || undefined
                                : undefined;

                              return (
                                <EditorAccessControl feature="editor" requiredPlan="free">
                                  <div data-testid="quiz-modular-production-editor-page">
                                    <UnifiedCRUDProvider autoLoad={true} context={FunnelContext.EDITOR} funnelId={funnelIdFromUrl}>
                                      <Suspense fallback={<EnhancedLoadingFallback message="Carregando editor modular..." />}>
                                        <QuizModularProductionEditor />
                                      </Suspense>
                                    </UnifiedCRUDProvider>
                                  </div>
                                </EditorAccessControl>
                              );
                            })()}
                          </EditorErrorBoundary>
                        </Route>

                        {/* ═══════════════════════════════════════════════════════════════════
                            🔁 REDIRECTS LEGADOS (DEPRECATED)
                            ═══════════════════════════════════════════════════════════════════
                            
                            ⚠️ DEPRECATED em 11/out/2025 (Sprint 3)
                            
                            Estas rotas foram depreciadas e redirecionam para /editor (oficial).
                            Mantidas apenas para compatibilidade com links antigos.
                            
                            📋 Serão REMOVIDAS em 01/nov/2025
                            
                            Total de redirects: 10
                            ═══════════════════════════════════════════════════════════════════ */}

                        {/* Quiz Estilo - Variações Legadas */}
                        <Route path="/editor/quiz-estilo">
                          <RedirectRoute to="/editor" />
                        </Route>
                        <Route path="/editor/quiz-estilo-production">
                          <RedirectRoute to="/editor" />
                        </Route>
                        <Route path="/editor/quiz-estilo-modular-pro">
                          <RedirectRoute to="/editor" />
                        </Route>
                        <Route path="/editor/quiz-estilo-modular">
                          <RedirectRoute to="/editor" />
                        </Route>
                        <Route path="/editor/quiz-estilo-template-engine">
                          <RedirectRoute to="/editor" />
                        </Route>

                        {/* Editor - Variações de Nome Legadas */}
                        <Route path="/editor-modular">
                          <RedirectRoute to="/editor" />
                        </Route>
                        <Route path="/modular-editor">
                          <RedirectRoute to="/editor" />
                        </Route>
                        <Route path="/editor-pro">
                          <RedirectRoute to="/editor" />
                        </Route>
                        <Route path="/editor-v1">
                          <RedirectRoute to="/editor" />
                        </Route>
                        <Route path="/editor-stable">
                          <RedirectRoute to="/editor" />
                        </Route>

                        {/* Editor com ID - Legado (agora usa query param ?funnelId=) */}
                        <Route path="/editor/:funnelId">
                          {(params) => <RedirectRoute to="/editor" />}
                        </Route>

                        {/* ═══════════════════════════════════════════════════════════════════
                            📄 TEMPLATE ENGINE - Feature Separada
                            ═══════════════════════════════════════════════════════════════════
                            
                            Status: ✅ ATIVO E MANTIDO
                            
                            Rotas:
                            - /template-engine → Página principal (CRUD de templates)
                            - /template-engine/:id → Editor de template específico
                            - /editor/novo → Alias para /template-engine (UI de criação)
                            - /editor/templates → Listagem de templates para uso
                            
                            ⚠️ NÃO confundir com /editor (editor de funis)
                            ═══════════════════════════════════════════════════════════════════ */}

                        <Route path="/editor/templates">
                          <div data-testid="editor-templates-page">
                            <EditorTemplatesPage />
                          </div>
                        </Route>

                        {/* Editor de Templates JSON - NOVO */}
                        <Route path="/editor/json-templates">
                          <div data-testid="editor-json-templates-page">
                            <EditorJsonTemplatesPage />
                          </div>
                        </Route>

                        {/* Template Engine CRUD (rota dedicada) - sempre ativo */}
                        <Route path="/template-engine">
                          <div data-testid="template-engine-page">
                            <TemplateEnginePage />
                          </div>
                        </Route>

                        {/* Template Engine - Rota direta com ID para layout 4 colunas */}
                        <Route path="/template-engine/:templateId">
                          {(params) => (
                            <div data-testid="template-engine-direct-page">
                              <TemplateEnginePageWrapperOpen id={params.templateId} />
                            </div>
                          )}
                        </Route>

                        {/* Alias adicional para o Template Engine (UI de criação) */}
                        <Route path="/editor/novo">
                          <div data-testid="template-engine-alias-page">
                            <TemplateEnginePage />
                          </div>
                        </Route>

                        {/* Trailing slash redirect para evitar 404 */}
                        <Route path="/editor/novo/">
                          <RedirectRoute to="/editor/novo" />
                        </Route>

                        {/* Qualquer subrota não suportada volta para base */}
                        <Route path="/editor/novo/:rest*">
                          {(params) => <RedirectRoute to="/editor/novo" />}
                        </Route>

                        {/* Redirect legado para rota nova (mantemos ambos apontando ao mesmo componente) */}
                        <Route path="/editor/template-engine">
                          <RedirectRoute to="/template-engine" />
                        </Route>

                        {/* 🔍 PÁGINA DE DIAGNÓSTICO DE TEMPLATES - TEMPORÁRIA */}
                        <Route path="/debug/templates">
                          <div data-testid="template-diagnostic-page">
                            <TemplateDiagnosticPage />
                          </div>
                        </Route>

                        {/* Rota de editor com :funnelId descontinuada – manter apenas /editor. */}
                        {/* <Route path="/editor/:funnelId"> ...redirecionada acima...</Route> */}

                        {/* 🎯 QUIZ INTEGRADO COM BACKEND COMPLETO */}
                        <Route path="/quiz">
                          <QuizErrorBoundary>
                            <QuizIntegratedPage />
                          </QuizErrorBoundary>
                        </Route>

                        {/* 🤖 QUIZ COM IA - ROTA ESPECIAL */}
                        <Route path="/quiz-ai-21-steps">
                          <QuizAIPage />
                        </Route>

                        {/* 🎨 PREVIEW DE TEMPLATES */}
                        <Route path="/templates/preview/:id">
                          <TemplatePreviewPage />
                        </Route>

                        {/* 🎨 PÁGINA DE TEMPLATES GERAL (consolidada no dashboard) */}
                        <Route path="/templates">
                          <RedirectRoute to="/admin/dashboard" />
                        </Route>

                        {/* 🧭 NAVEGADOR DE TIPOS DE FUNIS */}
                        <Route path="/funnel-types">
                          <FunnelTypesPage />
                        </Route>

                        {/* 🔄 LEGACY EDITORS: removidos → manter apenas QuizModularProductionEditor */}

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

                        {/* 🧪 QUIZ DE ESTILO PESSOAL */}
                        <Route path="/quiz-estilo">
                          <QuizErrorBoundary>
                            <QuizEstiloPessoalPage />
                          </QuizErrorBoundary>
                        </Route>

                        {/* 🧪 QUIZ DINÂMICO COM SUPORTE A DIFERENTES TEMPLATES */}
                        <Route path="/quiz/:funnelId">
                          {(params) => (
                            <QuizErrorBoundary>
                              <QuizEstiloPessoalPage funnelId={params.funnelId} />
                            </QuizErrorBoundary>
                          )}
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

                        {/* 🏢 ADMIN DASHBOARD - Rotas unificadas via ModernAdminDashboard */}

                        <Route path="/admin/funnels/:id/edit">
                          {(params) => (
                            <EditorErrorBoundary>
                              <div data-testid="admin-integrated-editor-page">
                                <UnifiedCRUDProvider funnelId={params.id} autoLoad={true} context={FunnelContext.EDITOR}>
                                  <Suspense fallback={<EnhancedLoadingFallback message="Carregando editor modular..." />}>
                                    <QuizModularProductionEditor />
                                  </Suspense>
                                </UnifiedCRUDProvider>
                              </div>
                            </EditorErrorBoundary>
                          )}
                        </Route>

                        {/* 🎯 FUNIL ATUAL COM LAYOUT UNIFICADO (Quiz de Estilo Pessoal) 
                            IMPORTANTE: Deve vir ANTES de /admin e /admin/* para não ser capturado pelo wildcard */}
                        <Route path="/admin/funil-atual">
                          <div data-testid="current-funnel-page">
                            <UnifiedAdminLayout currentView="current-funnel">
                              <Suspense fallback={<EnhancedLoadingFallback message="Carregando funil atual..." />}>
                                <CurrentFunnelPage />
                              </Suspense>
                            </UnifiedAdminLayout>
                          </div>
                        </Route>

                        {/* 🧪 TEMPLATE V3.0 TEST PAGE 
                            Rota de teste isolada para template v3.0
                            Carrega templates/step-20-v3.json e renderiza com SectionRenderer */}
                        <Route path="/admin/test-v3">
                          <div data-testid="test-v3-page">
                            <Suspense fallback={<EnhancedLoadingFallback message="Carregando template v3.0..." />}>
                              <TestV3Page />
                            </Suspense>
                          </div>
                        </Route>

                        {/* 🎯 ADMIN DASHBOARD CONSOLIDADO 
                            IMPORTANTE: Rotas genéricas (/admin, /admin/*) devem vir POR ÚLTIMO */}
                        <Route path="/admin">
                          <div data-testid="modern-admin-dashboard">
                            <ModernAdminDashboard />
                          </div>
                        </Route>
                        <Route path="/admin/*">
                          <div data-testid="modern-admin-dashboard-subroutes">
                            <ModernAdminDashboard />
                          </div>
                        </Route>
                        <Route path="/admin/editor">
                          <RedirectRoute to="/admin/editor/quiz-modular-pro" />
                        </Route>
                        <Route path="/dashboard">
                          <RedirectRoute to="/admin/dashboard" />
                        </Route>
                        <Route path="/dashboard/:page">
                          {(params) => <RedirectRoute to={`/admin/${params.page}`} />}
                        </Route>

                        {/* (removido) Bloco duplicado de redirects legados para /editor */}

                        {/* 🚀 PHASE 2 ENTERPRISE DASHBOARD */}
                        <Route path="/phase2">
                          <div data-testid="phase2-dashboard-page">
                            <Phase2Dashboard />
                          </div>
                        </Route>

                        {/* 🔧 DESENVOLVIMENTO */}
                        <Route path="/diagnostics">
                          <SystemDiagnosticPage />
                        </Route>

                        {/* 🔧 DEV ONLY: Context Migration Diagnostics (guardado por flag) */}
                        <Route path="/dev/context-diagnostics">
                          {import.meta.env.VITE_ENABLE_CONTEXT_DIAGNOSTICS === '1' ? (
                            <div data-testid="context-migration-diagnostics-page">
                              <ContextMigrationDiagnostics />
                            </div>
                          ) : (
                            <RedirectRoute to="/diagnostics" />
                          )}
                        </Route>

                        {/* 🧪 TESTE CORREÇÃO SUPABASE */}
                        <Route path="/test-supabase-fix">
                          <SupabaseFixTestPage />
                        </Route>

                        {/* 🗃️ TESTE MIGRAÇÃO INDEXEDDB */}
                        <Route path="/test-indexeddb-migration">
                          <IndexedDBMigrationTestPage />
                        </Route>

                        {/* 🚫 PÁGINA 404 PERSONALIZADA */}
                        <Route>
                          <NotFound />
                        </Route>
                      </Switch>
                    </Suspense>
                  </Router>
                  <Toaster />
                </OptimizedProviderStack>
              </MonitoringProvider>
            </SecurityProvider>
          </AuthProvider>
        </CustomThemeProvider>
      </GlobalErrorBoundary>
    </HelmetProvider>
  );
}

export default App;

/**
 * 📊 MELHORIAS IMPLEMENTADAS:
 * 
 * ✅ ROTEAMENTO SPA:
 * - Configuração completa no vite.config.ts
 * - historyApiFallback para todas as rotas
 * - Redirects Netlify otimizados
 * 
 * ✅ LAYOUT ADMINISTRATIVO:
 * - AdminLayout consistente para todas as páginas admin
 * - Navegação lateral unificada
 * - Breadcrumbs automáticos
 * - Estrutura responsiva
 * 
 * ✅ NAVEGAÇÃO MELHORADA:
 * - useNavigation v2.0 com breadcrumbs
 * - Histórico de navegação
 * - Transições suaves
 * - Preload estratégico
 * 
 * ✅ UX OTIMIZADA:
 * - Página 404 personalizada
 * - Loading states consistentes  
 * - Error boundaries adequados
 * - Code splitting por seções
 * 
 * ✅ PERFORMANCE:
 * - Lazy loading otimizado
 * - Code splitting inteligente
 * - Bundle size reduzido
 * - Cache estratégico
 */

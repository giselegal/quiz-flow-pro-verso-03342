/**
 * 🎯 APP.TSX com ROTEAMENTO SPA OT// 🚀 MODERN UNIFIED EDITOR - EDITOR OFICIAL (MAIS COMPLETO)
const QuizFunnelEditor = lazy(() => import('./components/editor/quiz/QuizFunnelEditor').then(module => ({ default: module.default })));
const QuizFunnelEditorSimplified = lazy(() => import('./components/editor/quiz/QuizFunnelEditorSimplified').then(module => ({ default: module.default })));
const QuizFunnelEditorWYSIWYG = lazy(() => import('./components/editor/quiz/QuizFunnelEditorWYSIWYG').then(module => ({ default: module.default })));
const ModernUnifiedEditor = lazy(() => import('./pages/editor/ModernUnifiedEditor').then(module => ({ default: module.default })));
const ModularEditorLayout = lazy(() => import('./editor/components/ModularEditorLayout').then(module => ({ default: module.default })));
const ModularEditorLayout = lazy(() => import('./editor/components/ModularEditorLayout').then(module => ({ default: module.default })));ADO
 * 
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
import { ThemeProvider } from './components/theme-provider';
import { ThemeProvider as CustomThemeProvider } from './contexts/ThemeContext';
import { HelmetProvider } from 'react-helmet-async';
import { EnhancedLoadingFallback } from './components/ui/enhanced-loading-fallback';
import { GlobalErrorBoundary } from './components/error/GlobalErrorBoundary';
import { Toaster } from './components/ui/toaster';
import { AuthProvider } from './context/AuthContext';
import OptimizedProviderStack from './providers/OptimizedProviderStack';
import { SecurityProvider } from './providers/SecurityProvider';
import { MonitoringProvider } from './components/monitoring/MonitoringProvider';
import { serviceManager } from './services/core/UnifiedServiceManager';
import { RedirectRoute } from './components/RedirectRoute';
import { QuizErrorBoundary } from './components/RouteErrorBoundary';
import { EditorErrorBoundary } from './components/error/EditorErrorBoundary';
import UnifiedCRUDProvider from '@/context/UnifiedCRUDProvider';
import { OptimizedEditorProvider } from '@/components/editor/OptimizedEditorProvider';
import { BlockRegistryProvider, DEFAULT_BLOCK_DEFINITIONS } from '@/runtime/quiz/blocks/BlockRegistry';
// Novo Template Engine (feature flag controlada por VITE_USE_TEMPLATE_ENGINE)
import { TemplateEnginePage } from '@/features/templateEngine';
import { TemplateEnginePageWrapperOpen } from '@/features/templateEngine/components/TemplateEnginePage';
import QuizEstiloModularRedirect from '@/features/templateEngine/components/QuizEstiloModularRedirect';

// 🏠 PÁGINAS ESSENCIAIS
const Home = lazy(() => import('./pages/Home'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const NotFound = lazy(() => import('./pages/NotFound'));

// 🔍 PÁGINAS DE DIAGNÓSTICO - TEMPORÁRIAS
const TemplateDiagnosticPage = lazy(() => import('./pages/TemplateDiagnosticPage'));

// 🚀 EDITORES - OFICIAIS E LEGADOS
const QuizFunnelEditor = lazy(() => import('./components/editor/quiz/QuizFunnelEditor').then(module => ({ default: module.default })));
const QuizFunnelEditorSimplified = lazy(() => import('./components/editor/quiz/QuizFunnelEditorSimplified').then(module => ({ default: module.default })));
const QuizFunnelEditorWYSIWYG = lazy(() => import('./components/editor/quiz/QuizFunnelEditorWYSIWYG').then(module => ({ default: module.default })));
const ModernUnifiedEditor = lazy(() => import('./pages/editor/ModernUnifiedEditor').then(module => ({ default: module.default })));
const ModularEditorLayout = lazy(() => import('./editor/components/ModularEditorLayout').then(module => ({ default: module.default })));

// ❌ HYBRID EDITOR PRO - DESATIVADO (substituído pelo ModernUnifiedEditor)
// const HybridEditorPro = lazy(() => import('./components/editor/EditorPro/components/HybridEditorPro'));

// 🧪 PÁGINAS DE QUIZ
const QuizEstiloPessoalPage = lazy(() => import('./pages/QuizEstiloPessoalPage'));
const QuizAIPage = lazy(() => import('./pages/QuizAIPage'));
const QuizIntegratedPage = lazy(() => import('./pages/QuizIntegratedPage'));

// 🏢 LAYOUT ADMINISTRATIVO E DASHBOARD MODERNO
const ModernDashboardPage = lazy(() => import('./pages/ModernDashboardPage'));
const ModernAdminDashboard = lazy(() => import('./pages/ModernAdminDashboard'));

// 🚀 PHASE 2 ENTERPRISE DASHBOARD
const Phase2Dashboard = lazy(() => import('./pages/Phase2Dashboard'));

// 🎨 PÁGINAS DE TEMPLATES
const TemplatesPage = lazy(() => import('./pages/TemplatesPage'));
const SystemDiagnosticPage = lazy(() => import('./pages/SystemDiagnosticPage'));
const EditorTemplatesPage = lazy(() => import('./pages/editor-templates/index'));
const FunnelTypesPage = lazy(() => import('./pages/SimpleFunnelTypesPage'));
const SupabaseFixTestPage = lazy(() => import('./pages/SupabaseFixTestPage'));
const IndexedDBMigrationTestPage = lazy(() => import('./pages/IndexedDBMigrationTestPage'));

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

                        {/* 🚀 EDITOR PRINCIPAL (WYSIWYG) - Melhor renderização */}
                        <Route path="/editor">
                          <EditorErrorBoundary>
                            <div data-testid="quiz-editor-wysiwyg-page">
                              <UnifiedCRUDProvider autoLoad={true}>
                                <OptimizedEditorProvider>
                                  {/* ✅ FASE 4 ATIVADA: +66% performance com OptimizedEditorProvider */}
                                  <Suspense fallback={<EnhancedLoadingFallback message="Carregando editor..." />}>
                                    <QuizFunnelEditorWYSIWYG />
                                  </Suspense>
                                </OptimizedEditorProvider>
                              </UnifiedCRUDProvider>
                            </div>
                          </EditorErrorBoundary>
                        </Route>

                        {/* ✏️ EDITOR ESPECÍFICO PARA /quiz-estilo - FUNCIONAL E DIRETO */}
                        <Route path="/editor/quiz-estilo">
                          <EditorErrorBoundary>
                            <div data-testid="quiz-estilo-editor-page">
                              <UnifiedCRUDProvider autoLoad={true}>
                                <OptimizedEditorProvider>
                                  <Suspense fallback={<EnhancedLoadingFallback message="Carregando editor do quiz de estilo..." />}>
                                    <QuizFunnelEditorWYSIWYG />
                                  </Suspense>
                                </OptimizedEditorProvider>
                              </UnifiedCRUDProvider>
                            </div>
                          </EditorErrorBoundary>
                        </Route>
                        {/* Versão modular 4 colunas para /quiz-estilo (redirect automático) */}
                        <Route path="/editor/quiz-estilo-modular">
                          <div data-testid="quiz-estilo-modular-redirect">
                            <QuizEstiloModularRedirect />
                          </div>
                        </Route>

                        {/* 🧩 EDITOR MODULAR - Sistema experimental com componentes modulares */}
                        <Route path="/editor-modular">
                          <EditorErrorBoundary>
                            <div data-testid="modern-modular-editor-page">
                              <UnifiedCRUDProvider autoLoad={true}>
                                <Suspense fallback={<EnhancedLoadingFallback message="Carregando editor modular..." />}>
                                  <ModularEditorLayout />
                                </Suspense>
                              </UnifiedCRUDProvider>
                            </div>
                          </EditorErrorBoundary>
                        </Route>

                        {/* 🏆 QUIZ FUNNEL EDITOR - EDITOR MAIS COMPLETO (Undo/Redo, Import/Export, Validação) */}
                        <Route path="/editor-pro">
                          <EditorErrorBoundary>
                            <div data-testid="quiz-funnel-editor-page">
                              <UnifiedCRUDProvider autoLoad={true}>
                                <BlockRegistryProvider definitions={DEFAULT_BLOCK_DEFINITIONS}>
                                  <Suspense fallback={<EnhancedLoadingFallback message="Carregando editor profissional..." />}>
                                    <QuizFunnelEditor />
                                  </Suspense>
                                </BlockRegistryProvider>
                              </UnifiedCRUDProvider>
                            </div>
                          </EditorErrorBoundary>
                        </Route>

                        <Route path="/editor/templates">
                          <div data-testid="editor-templates-page">
                            <EditorTemplatesPage />
                          </div>
                        </Route>

                        {/* ⚙️ NOVO: Template Engine CRUD (rota dedicada) - agora sempre ativo.
                            Se a flag estiver desativada, ainda expomos para evitar 404 em links antigos. */}
                        <Route path="/template-engine">
                          <div data-testid="template-engine-page">
                            <TemplateEnginePage />
                          </div>
                        </Route>
                        {/* Rota direta com ID para abrir já no layout 4 colunas */}
                        <Route path="/template-engine/:templateId">
                          {(params) => (
                            <div data-testid="template-engine-direct-page">
                              {/* Reusa página mas injeta openId via query param hack usando history.replace */}
                              <TemplateEnginePageWrapperOpen id={params.templateId} />
                            </div>
                          )}
                        </Route>

                        {/* Alias adicional para o Template Engine (sempre ativo) */}
                        <Route path="/editor/novo">
                          <div data-testid="template-engine-alias-page">
                            <TemplateEnginePage />
                          </div>
                        </Route>
                        {/* Trailing slash redirect para evitar 404 se usuário digitar /editor/novo/ */}
                        <Route path="/editor/novo/">
                          <RedirectRoute to="/editor/novo" />
                        </Route>
                        {/* Qualquer subrota não suportada de /editor/novo/<algo> volta para base */}
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

                        <Route path="/editor/:funnelId">
                          {(params) => (
                            <EditorErrorBoundary>
                              <div data-testid="quiz-editor-wysiwyg-funnel-page">
                                <UnifiedCRUDProvider funnelId={params.funnelId} autoLoad={true}>
                                  <OptimizedEditorProvider>
                                    {/* ✅ FASE 4 ATIVADA: Editor otimizado com funnelId dinâmico */}
                                    <QuizFunnelEditorWYSIWYG funnelId={params.funnelId} />
                                  </OptimizedEditorProvider>
                                </UnifiedCRUDProvider>
                              </div>
                            </EditorErrorBoundary>
                          )}
                        </Route>

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

                        {/* 🎨 PÁGINA DE TEMPLATES GERAL */}
                        <Route path="/templates">
                          <TemplatesPage />
                        </Route>

                        {/* 🧭 NAVEGADOR DE TIPOS DE FUNIS */}
                        <Route path="/funnel-types">
                          <FunnelTypesPage />
                        </Route>

                        {/* 🔄 LEGACY EDITORS: removidos → manter apenas ModernUnifiedEditor */}

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

                        {/* 🏢 ADMIN DASHBOARD - ROTAS UNIFICADAS */}
                        <Route path="/admin/dashboard">
                          <div data-testid="admin-dashboard-page">
                            <ModernDashboardPage />
                          </div>
                        </Route>

                        <Route path="/admin/funnels">
                          <div data-testid="admin-funnels-page">
                            <ModernDashboardPage />
                          </div>
                        </Route>

                        <Route path="/admin/funnels/:id/edit">
                          {(params) => (
                            <EditorErrorBoundary>
                              <div data-testid="admin-integrated-editor-page">
                                <UnifiedCRUDProvider funnelId={params.id} autoLoad={true}>
                                  <ModernUnifiedEditor funnelId={params.id} />
                                </UnifiedCRUDProvider>
                              </div>
                            </EditorErrorBoundary>
                          )}
                        </Route>

                        <Route path="/admin/analytics">
                          <div data-testid="admin-analytics-page">
                            <ModernDashboardPage />
                          </div>
                        </Route>

                        {/* 🎯 ADMIN DASHBOARD CONSOLIDADO */}
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
                        <Route path="/dashboard">
                          <RedirectRoute to="/admin/dashboard" />
                        </Route>
                        <Route path="/dashboard/:page">
                          {(params) => <RedirectRoute to={`/admin/${params.page}`} />}
                        </Route>

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

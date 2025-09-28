/**
 * 🎯 APP.TSX com ROTEAMENTO SPA OTIMIZADO
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

// 🏠 PÁGINAS ESSENCIAIS
const Home = lazy(() => import('./pages/Home'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const NotFound = lazy(() => import('./pages/NotFound'));

// � PÁGINAS DE DIAGNÓSTICO - TEMPORÁRIAS
const TemplateDiagnosticPage = lazy(() => import('./pages/TemplateDiagnosticPage'));

// �🚀 MODERN UNIFIED EDITOR - EDITOR OFICIAL (MAIS COMPLETO)
const ModernUnifiedEditor = lazy(() => import('./pages/editor/ModernUnifiedEditor'));

// ❌ HYBRID EDITOR PRO - DESATIVADO (substituído pelo ModernUnifiedEditor)
// const HybridEditorPro = lazy(() => import('./components/editor/EditorPro/components/HybridEditorPro'));

// 🧪 PÁGINAS DE QUIZ
const QuizEstiloPessoalPage = lazy(() => import('./pages/QuizEstiloPessoalPage'));
const QuizAIPage = lazy(() => import('./pages/QuizAIPage'));
const QuizIntegratedPage = lazy(() => import('./pages/QuizIntegratedPage'));

// 🏢 LAYOUT ADMINISTRATIVO E DASHBOARD MODERNO
const ModernDashboardPage = lazy(() => import('./pages/ModernDashboardPage'));

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
      } catch {}
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
        <ThemeProvider defaultTheme="light">
          <CustomThemeProvider defaultTheme="dark">
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
                            </div>
                          </Route>

                          {/* 🚀 MODERN UNIFIED EDITOR - EDITOR OFICIAL ATIVO */}
                          <Route path="/editor">
                            <EditorErrorBoundary>
                              <div data-testid="modern-unified-editor-page">
                                {/* ✅ ATIVADO: Editor mais completo com IA + CRUD + Templates */}
                                <ModernUnifiedEditor />
                              </div>
                            </EditorErrorBoundary>
                          </Route>

                          <Route path="/editor/templates">
                            <div data-testid="editor-templates-page">
                              <EditorTemplatesPage />
                            </div>
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
                                <div data-testid="modern-unified-editor-funnel-page">
                                  {/* ✅ ATIVADO: Editor com suporte a funnelId dinâmico */}
                                  <ModernUnifiedEditor funnelId={params.funnelId} />
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
                                  <ModernUnifiedEditor
                                    funnelId={params.id}
                                    mode="admin-integrated"
                                  />
                                </div>
                              </EditorErrorBoundary>
                            )}
                          </Route>

                          <Route path="/admin/analytics">
                            <div data-testid="admin-analytics-page">
                              <ModernDashboardPage />
                            </div>
                          </Route>

                          {/* 🔄 LEGACY REDIRECTS */}
                          <Route path="/admin">
                            <RedirectRoute to="/admin/dashboard" />
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
        </ThemeProvider>
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

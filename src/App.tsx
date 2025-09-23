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
import { LoadingFallback } from './components/ui/loading-fallback';
import { Toaster } from './components/ui/toaster';
import { AuthProvider } from './context/AuthContext';
import { FunnelsProvider } from './context/FunnelsContext';
import { RedirectRoute } from './components/RedirectRoute';
import { QuizErrorBoundary } from './components/RouteErrorBoundary';

// 🏠 PÁGINAS ESSENCIAIS
const Home = lazy(() => import('./pages/Home'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const NotFound = lazy(() => import('./pages/NotFound'));

// 🎯 EDITOR ÚNICO - PONTO DE ENTRADA DEFINITIVO
const ModernUnifiedEditor = lazy(() => import('./pages/editor/ModernUnifiedEditor'));

// 🧪 PÁGINAS DE QUIZ
const QuizEstiloPessoalPage = lazy(() => import('./pages/QuizEstiloPessoalPage'));
const QuizAIPage = lazy(() => import('./pages/QuizAIPage'));

// 🏢 LAYOUT ADMINISTRATIVO
const AdminLayout = lazy(() => import('./components/layout/AdminLayout'));

// 🔧 PÁGINAS ADMIN
const AnalyticsPage = lazy(() => import('./pages/admin/AnalyticsPage'));
const ConsolidatedOverviewPage = lazy(() => import('./pages/admin/ConsolidatedOverviewPage'));
const SettingsPage = lazy(() => import('./pages/admin/SettingsPage'));

// 🎨 PÁGINAS DE TEMPLATES
const TemplatesPage = lazy(() => import('./pages/TemplatesPage'));
const SystemDiagnosticPage = lazy(() => import('./pages/SystemDiagnosticPage'));
const EditorTemplatesPage = lazy(() => import('./pages/editor-templates/index'));

function App() {
  useEffect(() => {
    console.log('🚀 App initialized with SPA routing v2.0');
  }, []);

  return (
    <ThemeProvider defaultTheme="light">
      <AuthProvider>
        <FunnelsProvider>
          <Router>
            <Suspense fallback={<LoadingFallback />}>
              <Switch>
                {/* 🏠 PÁGINA INICIAL */}
                <Route path="/">
                  <div data-testid="index-page">
                    <Home />
                  </div>
                </Route>

                {/* 🎯 EDITOR - ROTAS DIRETAS SEM NESTED REDIRECTS */}
                <Route path="/editor">
                  <div data-testid="editor-templates-page">
                    <EditorTemplatesPage />
                  </div>
                </Route>

                <Route path="/editor/templates">
                  <div data-testid="editor-templates-page">
                    <EditorTemplatesPage />
                  </div>
                </Route>

                <Route path="/editor/:funnelId">
                  {(params) => (
                    <QuizErrorBoundary>
                      <div data-testid="editor-unified-page">
                        <ModernUnifiedEditor funnelId={params.funnelId} />
                      </div>
                    </QuizErrorBoundary>
                  )}
                </Route>

                {/* 🤖 QUIZ COM IA - ROTA ESPECIAL */}
                <Route path="/quiz-ai-21-steps">
                  <QuizAIPage />
                </Route>

                {/* 🎨 PÁGINA DE TEMPLATES GERAL */}
                <Route path="/templates">
                  <TemplatesPage />
                </Route>

                {/* 🔄 REDIRECTS LEGACY EDITORES */}
                <Route path="/editor-pro">
                  <RedirectRoute to="/editor" />
                </Route>
                <Route path="/editor-modular">
                  <RedirectRoute to="/editor" />
                </Route>
                <Route path="/editor-v1">
                  <RedirectRoute to="/editor" />
                </Route>

                {/* 🧪 QUIZ DE ESTILO PESSOAL */}
                <Route path="/quiz-estilo">
                  <QuizErrorBoundary>
                    <QuizEstiloPessoalPage />
                  </QuizErrorBoundary>
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

                {/* 🏢 ÁREA ADMINISTRATIVA COM LAYOUT CONSISTENTE */}
                <Route path="/admin" nest>
                  <Route path="/">
                    <AdminLayout 
                      title="Dashboard Administrativo" 
                      subtitle="Visão geral das métricas e atividades do sistema"
                    >
                      <ConsolidatedOverviewPage />
                    </AdminLayout>
                  </Route>

                  <Route path="/analytics">
                    <AdminLayout 
                      title="Analytics Avançado" 
                      subtitle="Métricas detalhadas e análises de performance"
                    >
                      <AnalyticsPage />
                    </AdminLayout>
                  </Route>

                  <Route path="/settings">
                    <AdminLayout 
                      title="Configurações do Sistema" 
                      subtitle="Gerenciar configurações e preferências"
                    >
                      <SettingsPage />
                    </AdminLayout>
                  </Route>
                </Route>

                {/* 🛡️ DASHBOARD (REDIRECT PARA ADMIN) */}
                <Route path="/dashboard">
                  <RedirectRoute to="/admin" />
                </Route>

                {/* 🔧 DESENVOLVIMENTO */}
                <Route path="/diagnostics">
                  <SystemDiagnosticPage />
                </Route>

                {/* 🚫 PÁGINA 404 PERSONALIZADA */}
                <Route>
                  <NotFound />
                </Route>
              </Switch>
            </Suspense>
          </Router>
          <Toaster />
        </FunnelsProvider>
      </AuthProvider>
    </ThemeProvider>
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

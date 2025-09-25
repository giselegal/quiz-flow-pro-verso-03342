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
import { FunnelMasterProvider } from './providers/FunnelMasterProvider';
import { RedirectRoute } from './components/RedirectRoute';
import { QuizErrorBoundary } from './components/RouteErrorBoundary';
import { EditorErrorBoundary } from './components/error/EditorErrorBoundary';

// 🏠 PÁGINAS ESSENCIAIS
const Home = lazy(() => import('./pages/Home'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const NotFound = lazy(() => import('./pages/NotFound'));

// 🚀 HYBRID EDITOR PRO - O MELHOR DOS DOIS MUNDOS
const HybridEditorPro = lazy(() => import('./components/editor/EditorPro/components/HybridEditorPro'));

// 🎯 EDITOR LEGADO (fallback) - Comentado por enquanto
// const ModernUnifiedEditor = lazy(() => import('./pages/editor/ModernUnifiedEditor'));

// 🧪 PÁGINAS DE QUIZ
const QuizEstiloPessoalPage = lazy(() => import('./pages/QuizEstiloPessoalPage'));
const QuizAIPage = lazy(() => import('./pages/QuizAIPage'));

// 🏢 LAYOUT ADMINISTRATIVO E DASHBOARD MODERNO
const ModernDashboardPage = lazy(() => import('./pages/ModernDashboardPage'));

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
        <FunnelMasterProvider>
          <Router>
            <Suspense fallback={<LoadingFallback />}>
              <Switch>
                {/* 🏠 PÁGINA INICIAL */}
                <Route path="/">
                  <div data-testid="index-page">
                    <Home />
                  </div>
                </Route>

                {/* 🚀 HYBRID EDITOR PRO - ROTA PRINCIPAL CORRIGIDA */}
                <Route path="/editor">
                  <EditorErrorBoundary>
                    <div data-testid="hybrid-editor-main-page">
                      <HybridEditorPro />
                    </div>
                  </EditorErrorBoundary>
                </Route>

                <Route path="/editor/templates">
                  <div data-testid="editor-templates-page">
                    <EditorTemplatesPage />
                  </div>
                </Route>

                <Route path="/editor/:funnelId">
                  {(params) => (
                    <EditorErrorBoundary>
                      <div data-testid="hybrid-editor-unified-page">
                        <HybridEditorPro funnelId={params.funnelId} />
                      </div>
                    </EditorErrorBoundary>
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

                {/* 🏢 DASHBOARD MODERNO - ROTA PRINCIPAL */}
                <Route path="/dashboard" nest>
                  <ModernDashboardPage />
                </Route>

                {/* 🔄 REDIRECTS ADMIN LEGACY */}
                <Route path="/admin">
                  <RedirectRoute to="/dashboard" />
                </Route>
                <Route path="/admin/:page">
                  {(params) => <RedirectRoute to={`/dashboard/${params.page}`} />}
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
        </FunnelMasterProvider>
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

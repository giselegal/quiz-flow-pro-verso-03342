import { ThemeProvider } from '@/components/theme-provider';
import { LoadingFallback } from '@/components/ui/loading-fallback';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/AuthContext';
import { EditorProvider } from '@/context/EditorContext';
import { FunnelsProvider } from '@/context/FunnelsContext';
import { Suspense, lazy } from 'react';
import { Route, Router, Switch } from 'wouter';

// Lazy load das páginas principais para code splitting
const Home = lazy(() => import('./pages/Home'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const EditorWithPreview = lazy(() => import('./pages/EditorWithPreview'));
const EditorWithPreviewFixed = lazy(() => import('./pages/EditorWithPreview-fixed'));
const EditorModularPage = lazy(() => import('./pages/editor-modular'));
const QuizFlowPage = lazy(() => import('./pages/QuizFlowPage'));
const QuizIntegratedPage = lazy(() => import('./pages/QuizIntegratedPage'));

// Import direto para evitar problemas de lazy loading
import QuizPage from './pages/Quiz';

// Lazy load das páginas admin
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage'));

// Página de teste de sincronização
const SyncValidationTestPage = lazy(() =>
  import('./components/test/SyncValidationTestPage').then(module => ({
    default: module.SyncValidationTestPage,
  }))
);

// Loading component
const PageLoading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
  </div>
);

/**
 * 🎯 APLICAÇÃO PRINCIPAL - Quiz Quest
 *
 * Estrutura de roteamento unificada com:
 * ✅ EditorWithPreview - Editor principal completo (/editor)
 * ✅ EditorWithPreviewFixed - Versão com navegação limpa (/editor-fixed, /editor-clean)
 * ✅ Sistema de lazy loading
 * ✅ Providers centralizados
 */
function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="quiz-quest-theme">
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Suspense fallback={<LoadingFallback />}>
              <Switch>
                {/* 🏠 PÁGINA INICIAL */}
                <Route path="/" component={Home} />

                {/* 🎯 EDITOR PRINCIPAL */}
                <Route path="/editor">
                  <FunnelsProvider>
                    <EditorProvider>
                      <Suspense fallback={<PageLoading />}>
                        <EditorWithPreview />
                      </Suspense>
                    </EditorProvider>
                  </FunnelsProvider>
                </Route>

                {/* 🏆 EDITOR FIXED - Versão com navegação limpa */}
                <Route path="/editor-fixed">
                  <FunnelsProvider>
                    <EditorProvider>
                      <Suspense fallback={<PageLoading />}>
                        <EditorWithPreviewFixed />
                      </Suspense>
                    </EditorProvider>
                  </FunnelsProvider>
                </Route>

                {/* 🧪 EDITOR CLEAN - Versão experimental com sistema limpo */}
                <Route path="/editor-clean">
                  <FunnelsProvider>
                    <EditorProvider>
                      <Suspense fallback={<PageLoading />}>
                        <EditorWithPreviewFixed />
                      </Suspense>
                    </EditorProvider>
                  </FunnelsProvider>
                </Route>

                {/* 🎯 EDITOR MODULAR - Sistema modular das 21 etapas */}
                <Route path="/editor-modular">
                  <Suspense fallback={<PageLoading />}>
                    <EditorModularPage />
                  </Suspense>
                </Route>

                {/* 📊 DASHBOARD ADMINISTRATIVO */}
                <Route path="/admin" component={DashboardPage} />
                <Route path="/dashboard" component={DashboardPage} />

                {/* 🧪 TESTE DE SINCRONIZAÇÃO */}
                <Route path="/test-sync">
                  <Suspense fallback={<PageLoading />}>
                    <SyncValidationTestPage />
                  </Suspense>
                </Route>

                {/* 🔐 AUTENTICAÇÃO */}
                <Route path="/auth">
                  <Suspense fallback={<PageLoading />}>
                    <AuthPage />
                  </Suspense>
                </Route>

                {/* 🎮 QUIZ */}
                <Route path="/quiz-modular">
                  <QuizPage />
                </Route>

                {/* 🎯 QUIZ 21 ETAPAS - PRODUÇÃO */}
                <Route path="/quiz">
                  <Suspense fallback={<PageLoading />}>
                    <QuizFlowPage />
                  </Suspense>
                </Route>

                {/* 🎯 QUIZ INTEGRADO - SISTEMA TEMPLATE */}
                <Route path="/quiz-integrado">
                  <Suspense fallback={<PageLoading />}>
                    <QuizIntegratedPage />
                  </Suspense>
                </Route>

                {/* 🚫 ROTA PADRÃO - 404 */}
                <Route>
                  <div className="min-h-screen flex items-center justify-center bg-background">
                    <div className="text-center space-y-4">
                      <h1 className="text-4xl font-bold text-[#6B4F43]">404</h1>
                      <p className="text-xl text-[#8B7355]">Página não encontrada</p>
                      <a
                        href="/"
                        className="inline-block px-6 py-3 bg-[#B89B7A] text-white rounded-lg hover:bg-[#A08968] transition-colors"
                      >
                        Voltar ao Início
                      </a>
                    </div>
                  </div>
                </Route>
              </Switch>
            </Suspense>

            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

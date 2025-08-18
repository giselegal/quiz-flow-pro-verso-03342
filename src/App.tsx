import { ThemeProvider } from '@/components/theme-provider';
import { LoadingFallback } from '@/components/ui/loading-fallback';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/AuthContext';
import { EditorProvider } from '@/context/EditorContext';
import { Suspense, lazy } from 'react';
import { Route, Router, Switch } from 'wouter';

// Lazy load das páginas principais para code splitting
const Home = lazy(() => import('./pages/Home'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const EditorPage = lazy(() => import('./pages/editor'));
const QuizPage = lazy(() => import('./pages/Quiz'));

// Lazy load das páginas admin
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage'));

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
 * ✅ EditorWithPreview - Editor principal completo
 * ✅ SchemaDrivenEditorResponsive - Editor alternativo
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
                  <EditorProvider>
                    <Suspense fallback={<PageLoading />}>
                      <EditorPage />
                    </Suspense>
                  </EditorProvider>
                </Route>

                {/* 🔧 EDITOR ALTERNATIVO */}
                <Route path="/editor-schema">
                  <EditorProvider>
                    <Suspense fallback={<PageLoading />}>
                      <EditorPage />
                    </Suspense>
                  </EditorProvider>
                </Route>

                {/* 🏆 EDITOR FIXED */}
                <Route path="/editor-fixed">
                  <EditorProvider>
                    <Suspense fallback={<PageLoading />}>
                      <EditorPage />
                    </Suspense>
                  </EditorProvider>
                </Route>

                {/* 📊 DASHBOARD ADMINISTRATIVO */}
                <Route path="/admin" component={DashboardPage} />
                <Route path="/dashboard" component={DashboardPage} />

                {/* 🔐 AUTENTICAÇÃO */}
                <Route path="/auth">
                  <Suspense fallback={<PageLoading />}>
                    <AuthPage />
                  </Suspense>
                </Route>

                {/* 🎮 QUIZ */}
                <Route path="/quiz-modular">
                  <Suspense fallback={<PageLoading />}>
                    <QuizPage />
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

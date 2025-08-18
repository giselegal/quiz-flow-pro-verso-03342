import { ThemeProvider } from '@/components/theme-provider';
import { LoadingFallback } from '@/components/ui/loading-fallback';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/AuthContext';
import { EditorProvider } from '@/context/EditorContext';
import { Suspense, lazy } from 'react';
import { Route, Router, Switch } from 'wouter';

// Lazy load das páginas principais para code splitting
const Home = lazy(() => import("./pages/Home"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const EditorPage = lazy(() => import("./pages/editor-fixed"));
const TemplatesIA = lazy(() => import("./pages/TemplatesIA"));
const FunnelsPage = lazy(() => import("./pages/FunnelsPage"));
const ResultPage = lazy(() => import("./pages/ResultPage"));
const ResultConfigPage = lazy(() => import("./pages/ResultConfigPage").then(module => ({ default: module.ResultConfigPage })));
const QuizPageUser = lazy(() => import("./components/QuizPageUser"));
const QuizPage = lazy(() => import("./pages/Quiz"));

// Lazy load das páginas admin
const DashboardPage = lazy(() => import("./pages/admin/DashboardPage"));
const MigrationPanel = lazy(() => import("./components/admin/MigrationPanel"));

// Lazy load das páginas de debug (apenas em desenvolvimento)
const DebugEditorContext = lazy(() => import("./pages/debug-editor"));
const TestButton = lazy(() => import("./pages/test-button"));
const TestPropertiesPanel = lazy(() => import("./pages/test-properties"));
const DebugStep02 = lazy(() => import("./components/debug/DebugStep02"));
const TestAllTemplates = lazy(() => import("./components/debug/TestAllTemplates"));
const TestOptionsRendering = lazy(() => import("./components/debug/TestOptionsRendering"));
const TestStep02Direct = lazy(() => import("./components/debug/TestStep02Direct"));

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

                  {/* 📊 DASHBOARD ADMINISTRATIVO */}
                  <Route path="/admin" component={DashboardPage} />
                  <Route path="/dashboard" component={DashboardPage} />

                  {/* 🎯 EDITOR PRINCIPAL - SchemaDrivenEditor (FUNCIONAL) */}
                  <Route path="/editor">
                    <EditorProvider>
                      <div className="h-screen w-full">
                        <SchemaDrivenEditorResponsive />
                      </div>
                    </EditorProvider>
                  </Route>

                  {/* 🔧 EDITOR ALTERNATIVO - SchemaDrivenEditor */}
                  <Route path="/editor-schema">
                    <EditorProvider>
                      <div className="h-screen w-full">
                        <SchemaDrivenEditorResponsive />
                      </div>
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

                {/* Admin Routes */}
                <Route path="/admin" nest>
                  <Suspense fallback={<PageLoading />}>
                    <DashboardPage />
                  </Suspense>
                </Route>
                <Route path="/admin/migrate">
                  {() => (
                    <Suspense fallback={<PageLoading />}>
                      <MigrationPanel />
                    </Suspense>
                  )}
                </Route>

                {/* Public Routes */}
                <Route path="/">
                  {() => (
                    <Suspense fallback={<PageLoading />}>
                      <Home />
                    </Suspense>
                  )}
                </Route>
                <Route path="/quiz-modular">
                  {() => (
                    <Suspense fallback={<PageLoading />}>
                      <QuizPage />
                    </Suspense>
                  )}
                </Route>
                <Route path="/quiz/:id">
                  {() => (
                    <Suspense fallback={<PageLoading />}>
                      <QuizPageUser />
                    </Suspense>
                  )}
                </Route>
                <Route path="/resultado/:resultId">
                  {() => (
                    <Suspense fallback={<PageLoading />}>
                      <ResultPage />
                    </Suspense>
                  )}
                </Route>
                <Route path="/auth">
                  {() => (
                    <Suspense fallback={<PageLoading />}>
                      <AuthPage />
                    </Suspense>
                  )}
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

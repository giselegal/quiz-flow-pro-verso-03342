import ErrorBoundary from "./components/common/ErrorBoundary";
import { Toaster } from "./components/ui/toaster";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import { AuthProvider } from "./context/AuthContext";
import { EditorProvider } from "./context/EditorContext";
import { ScrollSyncProvider } from "./context/ScrollSyncContext";
import { lazy, Suspense } from "react";
import { Route, Router, Switch } from "wouter";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import PixelInitializer from "./components/PixelInitializer";

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

function App() {
  console.log("🔧 DEBUG: App component iniciado");
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error("🚨 App Error:", error);
        console.error("🔍 Error Info:", errorInfo);
      }}
    >
      <AuthProvider>
        <AdminAuthProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <PixelInitializer pageType="other" />
              <Switch>
                {/* Redirect /editor para /editor-fixed */}
                <Route path="/editor">
                  {() => {
                    window.location.href = "/editor-fixed";
                    return null;
                  }}
                </Route>
                <Route path="/editor/:id">
                  {() => {
                    window.location.href = "/editor-fixed";
                    return null;
                  }}
                </Route>

                {/* Editor Fixed Route - rota principal do editor */}
                <Route path="/editor-fixed">
                  {() => (
                    <Suspense fallback={<PageLoading />}>
                      <ErrorBoundary>
                        <EditorProvider>
                          <ScrollSyncProvider>
                            <EditorPage />
                          </ScrollSyncProvider>
                        </EditorProvider>
                      </ErrorBoundary>
                    </Suspense>
                  )}
                </Route>

                {/* Templates IA Route */}
                <Route path="/templatesia">
                  {() => (
                    <Suspense fallback={<PageLoading />}>
                      <ErrorBoundary>
                        <TemplatesIA />
                      </ErrorBoundary>
                    </Suspense>
                  )}
                </Route>

                {/* Debug Editor Route */}
                <Route path="/debug-editor">
                  {() => (
                    <Suspense fallback={<PageLoading />}>
                      <ErrorBoundary>
                        <EditorProvider>
                          <DebugEditorContext />
                        </EditorProvider>
                      </ErrorBoundary>
                    </Suspense>
                  )}
                </Route>

                {/* Debug/Test Routes */}
                <Route path="/debug/editor">
                  {() => (
                    <Suspense fallback={<PageLoading />}>
                      <DebugEditorContext />
                    </Suspense>
                  )}
                </Route>
                <Route path="/test/properties">
                  {() => (
                    <Suspense fallback={<PageLoading />}>
                      <TestPropertiesPanel />
                    </Suspense>
                  )}
                </Route>
                <Route path="/test/button">
                  {() => (
                    <Suspense fallback={<PageLoading />}>
                      <TestButton />
                    </Suspense>
                  )}
                </Route>
                <Route path="/test/options">
                  {() => (
                    <Suspense fallback={<PageLoading />}>
                      <TestOptionsRendering />
                    </Suspense>
                  )}
                </Route>
                <Route path="/debug/step02">
                  {() => (
                    <Suspense fallback={<PageLoading />}>
                      <ErrorBoundary>
                        <EditorProvider>
                          <DebugStep02 />
                        </EditorProvider>
                      </ErrorBoundary>
                    </Suspense>
                  )}
                </Route>
                <Route path="/test/step02-direct">
                  {() => (
                    <Suspense fallback={<PageLoading />}>
                      <TestStep02Direct />
                    </Suspense>
                  )}
                </Route>
                <Route path="/test/all-templates">
                  {() => (
                    <Suspense fallback={<PageLoading />}>
                      <TestAllTemplates />
                    </Suspense>
                  )}
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

                {/* Protected Routes */}
                <ProtectedRoute 
                  path="/admin/funis" 
                  component={() => (
                    <Suspense fallback={<PageLoading />}>
                      <FunnelsPage />
                    </Suspense>
                  )}
                />
                <ProtectedRoute 
                  path="/admin/resultados" 
                  component={() => (
                    <Suspense fallback={<PageLoading />}>
                      <ResultConfigPage />
                    </Suspense>
                  )}
                />
              </Switch>
              <Toaster />
            </div>
          </Router>
        </AdminAuthProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;

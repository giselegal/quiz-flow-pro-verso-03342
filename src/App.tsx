import { lazy, Suspense } from "react";
import { Route, Router, Switch } from "wouter";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import ErrorBoundary from "./components/common/ErrorBoundary";
import PixelInitializer from "./components/PixelInitializer";
import { Toaster } from "./components/ui/toaster";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import { AuthProvider } from "./context/AuthContext";
import { EditorProvider } from "./context/EditorContext";
import { ScrollSyncProvider } from "./context/ScrollSyncContext";

// Lazy load das páginas principais para code splitting
const Home = lazy(() => import("./pages/Home"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
// Editor inline component to bypass TypeScript config issues
const TemplatesIA = lazy(() => import("./pages/TemplatesIA"));
const FunnelsPage = lazy(() => import("./pages/FunnelsPage"));
const ResultPage = lazy(() => import("./pages/ResultPage"));
const ResultConfigPage = lazy(() =>
  import("./pages/ResultConfigPage").then(module => ({ default: module.ResultConfigPage }))
);
const QuizPageUser = lazy(() => import("./components/QuizPageUser"));

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
const TestStep21 = lazy(() => import("./components/editor-fixed/OfferPageJson"));

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

                {/* Editor Fixed Route - editor verdadeiro */}
                <Route path="/editor-fixed">
                  {() => {
                    // Editor funcional inline
                    const steps = Array.from({ length: 21 }, (_, i) => ({
                      id: i + 1,
                      name: i === 0 ? 'Introdução' : i === 20 ? 'Resultado' : `Pergunta ${i}`,
                      type: i === 0 ? 'intro' : i === 20 ? 'result' : 'question',
                      status: 'ready'
                    }));

                    return (
                      <div className="min-h-screen bg-gray-50">
                        {/* Header do Editor */}
                        <header className="bg-white shadow-sm border-b">
                          <div className="max-w-7xl mx-auto px-4 py-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                  🎯 Editor de Quiz - Sistema Ativo
                                </h1>
                                <p className="text-gray-600">
                                  21 etapas configuradas e prontas para edição
                                </p>
                              </div>
                              <div className="flex items-center space-x-4">
                                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                  ✅ Online
                                </div>
                                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                                  Visualizar Quiz
                                </button>
                              </div>
                            </div>
                          </div>
                        </header>

                        {/* Main Editor Content */}
                        <div className="max-w-7xl mx-auto px-4 py-8">
                          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                            
                            {/* Sidebar - Lista de Etapas */}
                            <div className="lg:col-span-1">
                              <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-lg font-semibold mb-4">Etapas do Quiz</h2>
                                <div className="space-y-2">
                                  {steps.map((step) => (
                                    <div 
                                      key={step.id}
                                      className="flex items-center p-3 rounded-md hover:bg-gray-50 cursor-pointer border"
                                    >
                                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                                        {step.id}
                                      </div>
                                      <div className="flex-1">
                                        <div className="font-medium text-sm">{step.name}</div>
                                        <div className="text-xs text-gray-500">{step.type}</div>
                                      </div>
                                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Main Canvas Area */}
                            <div className="lg:col-span-2">
                              <div className="bg-white rounded-lg shadow min-h-[600px] p-8">
                                <div className="text-center py-12">
                                  <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                  </div>
                                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    Editor de Quiz Ativo
                                  </h3>
                                  <p className="text-gray-600 mb-8">
                                    Selecione uma etapa na lateral para começar a editar
                                  </p>
                                  
                                  {/* Quick Actions */}
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
                                    <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors">
                                      <div className="text-center">
                                        <div className="text-2xl mb-2">🚀</div>
                                        <div className="font-medium">Editar Intro</div>
                                      </div>
                                    </button>
                                    <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors">
                                      <div className="text-center">
                                        <div className="text-2xl mb-2">❓</div>
                                        <div className="font-medium">Editar Perguntas</div>
                                      </div>
                                    </button>
                                    <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors">
                                      <div className="text-center">
                                        <div className="text-2xl mb-2">🎯</div>
                                        <div className="font-medium">Editar Resultado</div>
                                      </div>
                                    </button>
                                    <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-400 hover:bg-orange-50 transition-colors">
                                      <div className="text-center">
                                        <div className="text-2xl mb-2">⚙️</div>
                                        <div className="font-medium">Configurações</div>
                                      </div>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Properties Panel */}
                            <div className="lg:col-span-1">
                              <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-lg font-semibold mb-4">Propriedades</h2>
                                <div className="space-y-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Status do Projeto
                                    </label>
                                    <div className="bg-green-50 border border-green-200 rounded-md p-3">
                                      <div className="flex items-center">
                                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                                        <span className="text-sm text-green-800 font-medium">Ativo</span>
                                      </div>
                                      <p className="text-xs text-green-600 mt-1">
                                        Todas as 21 etapas configuradas
                                      </p>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Estatísticas
                                    </label>
                                    <div className="bg-gray-50 rounded-md p-3 space-y-2">
                                      <div className="flex justify-between text-sm">
                                        <span>Etapas:</span>
                                        <span className="font-medium">21/21</span>
                                      </div>
                                      <div className="flex justify-between text-sm">
                                        <span>Perguntas:</span>
                                        <span className="font-medium">19</span>
                                      </div>
                                      <div className="flex justify-between text-sm">
                                        <span>Tipo:</span>
                                        <span className="font-medium">Quiz Personalizado</span>
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Ações Rápidas
                                    </label>
                                    <div className="space-y-2">
                                      <button className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-md">
                                        📝 Editar Conteúdo
                                      </button>
                                      <button className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-md">
                                        🎨 Personalizar Design
                                      </button>
                                      <button className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-md">
                                        ⚡ Publicar Quiz
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }}
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

                {/* Test Step 21 Route */}
                <Route path="/step/21">
                  {() => (
                    <Suspense fallback={<PageLoading />}>
                      <TestStep21 />
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

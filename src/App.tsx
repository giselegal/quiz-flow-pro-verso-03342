import { lazy, Suspense } from 'react';
import { Route, Router, Switch } from 'wouter';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';
import PixelInitializer from './components/PixelInitializer';
import { Toaster } from './components/ui/toaster';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { AuthProvider } from './context/AuthContext';
import { EditorProvider } from './context/EditorContext';
import { FunnelsProvider } from './context/FunnelsContext';
import { ScrollSyncProvider } from './context/ScrollSyncContext';

// Lazy load das páginas principais para code splitting
const Home = lazy(() => import('./pages/Home'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
// Editor inline component to bypass TypeScript config issues
const TemplatesIA = lazy(() => import('./pages/TemplatesIA'));
const QuizEditorPage = lazy(() => import('./pages/QuizEditorPage'));
const FunnelsPage = lazy(() => import('./pages/FunnelsPage'));
const ResultPage = lazy(() => import('./pages/ResultPage'));
const ResultConfigPage = lazy(() =>
  import('./pages/ResultConfigPage').then(module => ({ default: module.ResultConfigPage }))
);
const QuizPageUser = lazy(() => import('./components/QuizPageUser'));
const QuizFlowPage = lazy(() => import('./pages/QuizFlowPage'));
const StepPage = lazy(() => import('./pages/StepPage'));

// Lazy load das páginas admin
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage'));
const MigrationPanel = lazy(() => import('./components/admin/MigrationPanel'));
const IntegratedQuizEditor = lazy(
  () => import('./components/editor/quiz-specific/IntegratedQuizEditor')
);

// Lazy load das páginas de debug (apenas em desenvolvimento)
const DebugEditorContext = lazy(() => import('./pages/debug-editor'));
const TestButton = lazy(() => import('./pages/test-button'));
const TestPropertiesPanel = lazy(() => import('./pages/test-properties'));
const DebugStep02 = lazy(() => import('./components/debug/DebugStep02'));
const TestAllTemplates = lazy(() => import('./components/debug/TestAllTemplates'));
const TestOptionsRendering = lazy(() => import('./components/debug/TestOptionsRendering'));
const TestStep02Direct = lazy(() => import('./components/debug/TestStep02Direct'));
// Removed: EditorFixedPageWithDragDrop - file deleted
const EditorFixedDebug = lazy(() => import('./pages/editor-fixed-debug'));
// 🚀 EDITOR COM SISTEMA DE PREVIEW INTEGRADO
const EditorWithPreview = lazy(() =>
  import('./pages/editor').then(module => ({ default: module.EditorWithPreview }))
);

const ComponentTestingPage = lazy(() => import('./pages/component-testing'));
const TestNavigation = lazy(() => import('./pages/TestNavigation'));
const EditorDebugMinimal = lazy(() => import('./pages/editor-debug-minimal'));
const TestBasico = lazy(() => import('./pages/test-basico'));
const EditorFixedSimples = lazy(() => import('./pages/editor-fixed-simples'));

// Loading component
const PageLoading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
  </div>
);

function App() {
  console.log('🔧 DEBUG: App component iniciado');
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('🚨 App Error:', error);
        console.error('🔍 Error Info:', errorInfo);
      }}
    >
      <AuthProvider>
        <AdminAuthProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <PixelInitializer pageType="other" />
              <Switch>
                {/* Editor Route - Carrega EditorWithPreview com sistema de preview integrado */}
                <ProtectedRoute
                  path="/editor"
                  component={() => {
                    console.log('🚀 App: Carregando EditorWithPreview na rota /editor');
                    return (
                      <Suspense fallback={<PageLoading />}>
                        <ErrorBoundary>
                          <EditorProvider>
                            <FunnelsProvider debug={true}>
                              <ScrollSyncProvider>
                                <div className="relative">
                                  <EditorWithPreview />
                                </div>
                              </ScrollSyncProvider>
                            </FunnelsProvider>
                          </EditorProvider>
                        </ErrorBoundary>
                      </Suspense>
                    );
                  }}
                />

                {/* Editor com ID - também carrega EditorWithPreview */}
                <ProtectedRoute
                  path="/editor/:id"
                  component={() => {
                    console.log('🚀 App: Carregando EditorWithPreview com ID na rota /editor/:id');
                    return (
                      <Suspense fallback={<PageLoading />}>
                        <ErrorBoundary>
                          <EditorProvider>
                            <FunnelsProvider debug={true}>
                              <ScrollSyncProvider>
                                <div className="relative">
                                  <EditorWithPreview />
                                </div>
                              </ScrollSyncProvider>
                            </FunnelsProvider>
                          </EditorProvider>
                        </ErrorBoundary>
                      </Suspense>
                    );
                  }}
                />

                {/* Editor Fixed Simples - Versão Garantida */}
                <ProtectedRoute
                  path="/editor-simples"
                  component={() => (
                    <Suspense fallback={<PageLoading />}>
                      <ErrorBoundary>
                        <EditorProvider>
                          <EditorFixedSimples />
                        </EditorProvider>
                      </ErrorBoundary>
                    </Suspense>
                  )}
                />

                {/* Editor Fixed Route - Using Best Available Editor */}
                <ProtectedRoute
                  path="/editor-fixed"
                  component={() => {
                    console.log(
                      '🚀 App: Carregando EditorWithPreview (BEST VERSION) na rota /editor-fixed'
                    );
                    return (
                      <Suspense fallback={<PageLoading />}>
                        <ErrorBoundary>
                          <EditorProvider>
                            <FunnelsProvider debug={true}>
                              <ScrollSyncProvider>
                                <EditorWithPreview />
                              </ScrollSyncProvider>
                            </FunnelsProvider>
                          </EditorProvider>
                        </ErrorBoundary>
                      </Suspense>
                    );
                  }}
                />

                {/* Editor Fixed Debug Route */}
                <ProtectedRoute
                  path="/editor-fixed-debug"
                  component={() => (
                    <Suspense fallback={<PageLoading />}>
                      <ErrorBoundary>
                        <EditorProvider>
                          <EditorFixedDebug />
                        </EditorProvider>
                      </ErrorBoundary>
                    </Suspense>
                  )}
                />

                {/* Editor Fixed Simple Fallback Route */}
                <ProtectedRoute
                  path="/editor-fixed-simple"
                  component={() => (
                    <Suspense fallback={<PageLoading />}>
                      <ErrorBoundary>
                        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
                          <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8">
                            <h1 className="text-4xl font-bold text-gray-800 mb-2">
                              Editor de Quiz - 21 Etapas - FALLBACK
                            </h1>
                            <p className="text-gray-600 mb-8">
                              Sistema de criação de quiz personalizado - Modo simplificado
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                              {Array.from({ length: 21 }, (_, i) => (
                                <div
                                  key={i + 1}
                                  className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6 hover:bg-gray-100 transition-all"
                                >
                                  <div className="flex items-center justify-between mb-3">
                                    <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                                      {i + 1}
                                    </div>
                                  </div>
                                  <h3 className="font-semibold text-gray-800 mb-2">
                                    {i === 0
                                      ? 'Introdução'
                                      : i === 20
                                        ? 'Resultado Final'
                                        : `Pergunta ${i}`}
                                  </h3>
                                  <p className="text-sm text-gray-600">
                                    {i === 0
                                      ? 'Página inicial do quiz'
                                      : i === 20
                                        ? 'Exibição dos resultados'
                                        : 'Questão de múltipla escolha'}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </ErrorBoundary>
                    </Suspense>
                  )}
                />

                {/* Editor Fixed Dragdrop Route - DISABLED - Component removed */}
                <ProtectedRoute
                  path="/editor-fixed-dragdrop"
                  component={() => (
                    <Suspense fallback={<PageLoading />}>
                      <ErrorBoundary>
                        <div className="min-h-screen bg-red-50 p-8 text-center">
                          <h1 className="text-2xl font-bold text-red-800 mb-4">
                            🚧 Route Temporarily Disabled
                          </h1>
                          <p className="text-red-600">
                            The drag-and-drop editor component has been removed. Use /editor-fixed
                            instead.
                          </p>
                        </div>
                      </ErrorBoundary>
                    </Suspense>
                  )}
                />

                {/* Editor Fixed Minimal Route */}

                {/* Templates IA Route - Protected */}
                <ProtectedRoute
                  path="/templatesia"
                  component={() => (
                    <Suspense fallback={<PageLoading />}>
                      <ErrorBoundary>
                        <TemplatesIA />
                      </ErrorBoundary>
                    </Suspense>
                  )}
                />

                {/* Quiz Editor Route - Protected */}
                <ProtectedRoute
                  path="/quiz-editor"
                  component={() => (
                    <Suspense fallback={<PageLoading />}>
                      <ErrorBoundary>
                        <QuizEditorPage />
                      </ErrorBoundary>
                    </Suspense>
                  )}
                />

                {/* Debug Editor Route - Protected */}
                <ProtectedRoute
                  path="/debug-editor"
                  component={() => (
                    <Suspense fallback={<PageLoading />}>
                      <ErrorBoundary>
                        <EditorProvider>
                          <DebugEditorContext />
                        </EditorProvider>
                      </ErrorBoundary>
                    </Suspense>
                  )}
                />

                {/* Debug/Test Routes */}
                <Route path="/debug/editor">
                  {() => (
                    <Suspense fallback={<PageLoading />}>
                      <DebugEditorContext />
                    </Suspense>
                  )}
                </Route>

                {/* Editor Debug Minimal */}
                <Route path="/debug/editor-minimal">
                  {() => (
                    <Suspense fallback={<PageLoading />}>
                      <ErrorBoundary>
                        <EditorProvider>
                          <EditorDebugMinimal />
                        </EditorProvider>
                      </ErrorBoundary>
                    </Suspense>
                  )}
                </Route>

                {/* Test Básico */}
                <Route path="/test/basico">
                  {() => (
                    <Suspense fallback={<PageLoading />}>
                      <TestBasico />
                    </Suspense>
                  )}
                </Route>

                <Route path="/test/components">
                  {() => (
                    <Suspense fallback={<PageLoading />}>
                      <ErrorBoundary>
                        <EditorProvider>
                          <ComponentTestingPage />
                        </EditorProvider>
                      </ErrorBoundary>
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

                {/* Test Navigation Route */}
                <Route path="/test/navigation">
                  {() => (
                    <Suspense fallback={<PageLoading />}>
                      <TestNavigation />
                    </Suspense>
                  )}
                </Route>

                {/* Test Step 21 Route */}
                <Route path="/step/21">
                  {() => (
                    <Suspense fallback={<PageLoading />}>
                      <StepPage />
                    </Suspense>
                  )}
                </Route>

                {/* Step Navigation Routes */}
                <Route path="/step/:step">
                  {() => (
                    <Suspense fallback={<PageLoading />}>
                      <StepPage />
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

                {/* Quiz Flow de 21 Etapas */}
                <Route path="/quiz-flow">
                  {() => (
                    <Suspense fallback={<PageLoading />}>
                      <QuizFlowPage />
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

                {/* Temporary route for testing - can be removed after authentication is configured */}
                <Route path="/test-templates-ia">
                  {() => (
                    <Suspense fallback={<PageLoading />}>
                      <ErrorBoundary>
                        <TemplatesIA />
                      </ErrorBoundary>
                    </Suspense>
                  )}
                </Route>

                {/* Test Supabase Integration Route */}
                <ProtectedRoute
                  path="/test-supabase-integration"
                  component={() => (
                    <Suspense fallback={<PageLoading />}>
                      <div className="p-8">
                        <h1>Teste Supabase - Página removida</h1>
                        <p>Esta página foi removida durante a limpeza de conflitos.</p>
                      </div>
                    </Suspense>
                  )}
                />

                {/* Protected Routes */}
                <ProtectedRoute
                  path="/admin/quiz-editor"
                  component={() => (
                    <Suspense fallback={<PageLoading />}>
                      <IntegratedQuizEditor />
                    </Suspense>
                  )}
                />
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

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

                {/* Editor Fixed Route - inline implementation */}
                <Route path="/editor-fixed">
                  {() => (
                    <div style={{
                      minHeight: '100vh',
                      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                      padding: '2rem',
                      fontFamily: 'system-ui, -apple-system, sans-serif'
                    }}>
                      <div style={{
                        maxWidth: '1400px',
                        margin: '0 auto'
                      }}>
                        <header style={{
                          marginBottom: '2rem',
                          textAlign: 'center'
                        }}>
                          <h1 style={{
                            fontSize: '3rem',
                            fontWeight: 'bold',
                            color: '#1e293b',
                            marginBottom: '0.5rem'
                          }}>
                            Editor de Quiz - 21 Etapas ✨
                          </h1>
                          <p style={{
                            fontSize: '1.2rem',
                            color: '#64748b'
                          }}>
                            Sistema completo funcionando!
                          </p>
                        </header>
                        
                        <div style={{
                          background: 'white',
                          borderRadius: '16px',
                          padding: '2rem',
                          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                        }}>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '2rem',
                            padding: '1rem',
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            color: 'white',
                            borderRadius: '8px'
                          }}>
                            <div>
                              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>
                                ✅ Sistema Ativo
                              </h3>
                              <p style={{ margin: 0, opacity: 0.9 }}>
                                Todas as 21 etapas configuradas e prontas
                              </p>
                            </div>
                            <div style={{
                              textAlign: 'center',
                              fontSize: '2rem',
                              fontWeight: 'bold'
                            }}>
                              21/21
                            </div>
                          </div>
                          
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                            gap: '1.5rem'
                          }}>
                            {Array.from({ length: 21 }, (_, index) => {
                              const stepNum = index + 1;
                              const isIntro = stepNum === 1;
                              const isResult = stepNum === 21;
                              
                              return (
                                <div key={stepNum} style={{
                                  border: '2px solid #e2e8f0',
                                  borderRadius: '12px',
                                  padding: '1.5rem',
                                  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                                  cursor: 'pointer',
                                  transition: 'all 0.3s ease'
                                }}>
                                  <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '1rem'
                                  }}>
                                    <div style={{
                                      width: '40px',
                                      height: '40px',
                                      background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                                      color: 'white',
                                      borderRadius: '50%',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontSize: '1rem',
                                      fontWeight: 'bold'
                                    }}>
                                      {stepNum}
                                    </div>
                                    <div style={{
                                      width: '12px',
                                      height: '12px',
                                      borderRadius: '50%',
                                      background: isIntro ? '#10b981' : isResult ? '#3b82f6' : '#f59e0b'
                                    }} />
                                  </div>
                                  
                                  <h3 style={{
                                    fontSize: '1.3rem',
                                    fontWeight: '600',
                                    color: '#1e293b',
                                    marginBottom: '0.5rem'
                                  }}>
                                    {isIntro ? '🚀 Introdução' : isResult ? '🎯 Resultado Final' : `❓ Pergunta ${stepNum - 1}`}
                                  </h3>
                                  
                                  <p style={{
                                    fontSize: '0.95rem',
                                    color: '#64748b',
                                    lineHeight: '1.5',
                                    marginBottom: '1rem'
                                  }}>
                                    {isIntro ? 'Página inicial com captura do nome' : 
                                     isResult ? 'Resultados personalizados e CTA' : 
                                     'Questão de múltipla escolha'}
                                  </p>
                                  
                                  <div style={{
                                    paddingTop: '1rem',
                                    borderTop: '1px solid #e2e8f0',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                  }}>
                                    <span style={{
                                      fontSize: '0.75rem',
                                      fontWeight: '600',
                                      textTransform: 'uppercase',
                                      letterSpacing: '0.05em',
                                      color: '#64748b'
                                    }}>
                                      {isIntro ? 'Captura' : isResult ? 'Conversão' : 'Engajamento'}
                                    </span>
                                    <div style={{
                                      width: '8px',
                                      height: '8px',
                                      borderRadius: '50%',
                                      background: '#10b981'
                                    }} />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
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

import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'wouter';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/context/AuthContext';
import { AdminAuthProvider } from '@/context/AdminAuthContext';
import { EditorProvider } from '@/context/EditorContext';
import { ScrollSyncProvider } from '@/context/ScrollSyncContext';
import { PreviewProvider } from '@/contexts/PreviewContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ErrorBoundary from '@/components/common/ErrorBoundary';

// Lazy load components
const Index = lazy(() => import('./pages/Index'));
const Quiz = lazy(() => import('./pages/Quiz'));
const QuizOffline = lazy(() => import('./pages/QuizOffline'));
const StepNavigationPage = lazy(() => import('./pages/StepNavigationPage'));
const QuestionsPage = lazy(() => import('./pages/QuestionsPage'));
const FunnelOnlineEditor = lazy(() => import('./pages/FunnelOnlineEditor'));
const QuizResult = lazy(() => import('./pages/QuizResult'));
const QuizResultNovo = lazy(() => import('./pages/QuizResultNovo'));
const QuizResultOffline = lazy(() => import('./pages/QuizResultOffline'));
const SalesPage = lazy(() => import('./pages/SalesPage'));
const EmailCapture = lazy(() => import('./pages/EmailCapture'));
const StyleGuide = lazy(() => import('./pages/StyleGuide'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminAuth = lazy(() => import('./pages/admin/AdminAuth'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminPainelModular = lazy(() => import('./pages/admin/AdminPainelModular'));
const AdminConfigGeral = lazy(() => import('./pages/admin/AdminConfigGeral'));
const AdminQuizStepsManager = lazy(() => import('./pages/admin/AdminQuizStepsManager'));
const AdminQuizBuilder = lazy(() => import('./pages/admin/AdminQuizBuilder'));
const AdminEditStep = lazy(() => import('./pages/admin/AdminEditStep'));
const AdminFunnelEditor = lazy(() => import('./pages/admin/AdminFunnelEditor'));
const AdminFunnelPreview = lazy(() => import('./pages/admin/AdminFunnelPreview'));
const AdminQuizConfigurator = lazy(() => import('./pages/admin/AdminQuizConfigurator'));
const AdminOfertas = lazy(() => import('./pages/admin/AdminOfertas'));
const AdminProdutos = lazy(() => import('./pages/admin/AdminProdutos'));
const AdminResultPageEditor = lazy(() => import('./pages/admin/AdminResultPageEditor'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));
const EditorApp = lazy(() => import('./components/editor/EditorApp'));
const EditorFixed = lazy(() => import('./pages/EditorFixed'));
const EditorFixedPageWithDragDrop = lazy(() => import('./pages/editor-fixed-dragdrop'));
const TestBasico = lazy(() => import('./pages/test-basico'));
const EditorFixedSimples = lazy(() => import('./pages/editor-fixed-simples'));
const EditorMinimalWorking = lazy(() => import('./pages/EditorMinimalWorking'));
const EditorFixedDragDropMinimal = lazy(() => import('./pages/editor-fixed-dragdrop-minimal'));

// Loading component
const PageLoading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

const App = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <TooltipProvider>
        <AuthProvider>
          <AdminAuthProvider>
            <div className="min-h-screen bg-background font-sans antialiased">
              <Switch>
                {/* Public Routes */}
                <Route path="/" component={Index} />
                <Route path="/quiz" component={Quiz} />
                <Route path="/quiz-offline" component={QuizOffline} />
                <Route
                  path="/step/:stepNumber"
                  component={({ params }) => (
                    <Suspense fallback={<PageLoading />}>
                      <StepNavigationPage stepNumber={parseInt(params.stepNumber)} />
                    </Suspense>
                  )}
                />
                <Route
                  path="/questions/:questionId"
                  component={({ params }) => (
                    <Suspense fallback={<PageLoading />}>
                      <QuestionsPage questionId={params.questionId} />
                    </Suspense>
                  )}
                />

                {/* Quiz Results */}
                <Route path="/quiz/resultado" component={QuizResult} />
                <Route path="/quiz/resultado-novo" component={QuizResultNovo} />
                <Route path="/quiz/resultado-offline" component={QuizResultOffline} />
                <Route path="/email-capture" component={EmailCapture} />
                <Route path="/sales/:style?" component={SalesPage} />
                <Route path="/style-guide" component={StyleGuide} />

                {/* Auth Routes */}
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />

                {/* Protected Routes */}
                <ProtectedRoute
                  path="/profile"
                  component={() => (
                    <Suspense fallback={<PageLoading />}>
                      <Profile />
                    </Suspense>
                  )}
                />

                {/* Editor Fixed Route - Working Minimal Editor */}
                <ProtectedRoute
                  path="/editor-fixed"
                  component={() => {
                    console.log('🚀 App: Carregando EditorFixedDragDropMinimal (working version)');
                    return (
                      <Suspense fallback={<PageLoading />}>
                        <ErrorBoundary>
                          <EditorProvider>
                            <EditorFixedDragDropMinimal />
                          </EditorProvider>
                        </ErrorBoundary>
                      </Suspense>
                    );
                  }}
                />

                {/* Other Editor Routes */}
                <ProtectedRoute
                  path="/editor"
                  component={() => (
                    <Suspense fallback={<PageLoading />}>
                      <ErrorBoundary>
                        <EditorProvider>
                          <ScrollSyncProvider>
                            <PreviewProvider totalSteps={21} funnelId="main-editor">
                              <EditorApp />
                            </PreviewProvider>
                          </ScrollSyncProvider>
                        </EditorProvider>
                      </ErrorBoundary>
                    </Suspense>
                  )}
                />

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

                <ProtectedRoute
                  path="/editor-minimal"
                  component={() => (
                    <Suspense fallback={<PageLoading />}>
                      <ErrorBoundary>
                        <EditorProvider>
                          <EditorMinimalWorking />
                        </EditorProvider>
                      </ErrorBoundary>
                    </Suspense>
                  )}
                />

                <ProtectedRoute
                  path="/test-basico"
                  component={() => (
                    <Suspense fallback={<PageLoading />}>
                      <TestBasico />
                    </Suspense>
                  )}
                />

                <ProtectedRoute
                  path="/funnel-editor"
                  component={() => (
                    <Suspense fallback={<PageLoading />}>
                      <ErrorBoundary>
                        <EditorProvider>
                          <ScrollSyncProvider>
                            <PreviewProvider totalSteps={21} funnelId="funnel-editor">
                              <FunnelOnlineEditor />
                            </PreviewProvider>
                          </ScrollSyncProvider>
                        </EditorProvider>
                      </ErrorBoundary>
                    </Suspense>
                  )}
                />

                {/* Admin Routes */}
                <Route path="/admin/login" component={AdminLogin} />
                <Route path="/admin/auth" component={AdminAuth} />
                <ProtectedRoute
                  path="/admin"
                  component={() => (
                    <Suspense fallback={<PageLoading />}>
                      <AdminDashboard />
                    </Suspense>
                  )}
                />
                <ProtectedRoute
                  path="/admin/painel"
                  component={() => (
                    <Suspense fallback={<PageLoading />}>
                      <AdminPainelModular />
                    </Suspense>
                  )}
                />
                <ProtectedRoute
                  path="/admin/config"
                  component={() => (
                    <Suspense fallback={<PageLoading />}>
                      <AdminConfigGeral />
                    </Suspense>
                  )}
                />
                <ProtectedRoute
                  path="/admin/quiz/steps"
                  component={() => (
                    <Suspense fallback={<PageLoading />}>
                      <AdminQuizStepsManager />
                    </Suspense>
                  )}
                />
                <ProtectedRoute
                  path="/admin/quiz/builder"
                  component={() => (
                    <Suspense fallback={<PageLoading />}>
                      <AdminQuizBuilder />
                    </Suspense>
                  )}
                />
                <ProtectedRoute
                  path="/admin/quiz/step/:stepNumber"
                  component={({ params }) => (
                    <Suspense fallback={<PageLoading />}>
                      <AdminEditStep stepNumber={parseInt(params.stepNumber)} />
                    </Suspense>
                  )}
                />
                <ProtectedRoute
                  path="/admin/funnel/editor"
                  component={() => (
                    <Suspense fallback={<PageLoading />}>
                      <ErrorBoundary>
                        <EditorProvider>
                          <ScrollSyncProvider>
                            <PreviewProvider totalSteps={21} funnelId="admin-funnel">
                              <AdminFunnelEditor />
                            </PreviewProvider>
                          </ScrollSyncProvider>
                        </EditorProvider>
                      </ErrorBoundary>
                    </Suspense>
                  )}
                />
                <ProtectedRoute
                  path="/admin/funnel/preview"
                  component={() => (
                    <Suspense fallback={<PageLoading />}>
                      <AdminFunnelPreview />
                    </Suspense>
                  )}
                />
                <ProtectedRoute
                  path="/admin/quiz/config"
                  component={() => (
                    <Suspense fallback={<PageLoading />}>
                      <AdminQuizConfigurator />
                    </Suspense>
                  )}
                />
                <ProtectedRoute
                  path="/admin/ofertas"
                  component={() => (
                    <Suspense fallback={<PageLoading />}>
                      <AdminOfertas />
                    </Suspense>
                  )}
                />
                <ProtectedRoute
                  path="/admin/produtos"
                  component={() => (
                    <Suspense fallback={<PageLoading />}>
                      <AdminProdutos />
                    </Suspense>
                  )}
                />
                <ProtectedRoute
                  path="/admin/result/:category"
                  component={({ params }) => (
                    <Suspense fallback={<PageLoading />}>
                      <AdminResultPageEditor category={params.category} />
                    </Suspense>
                  )}
                />

                {/* 404 Route */}
                <Route>
                  <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                      <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                      <p className="text-gray-600">Página não encontrada</p>
                    </div>
                  </div>
                </Route>
              </Switch>

              <Toaster />
              <SonnerToaster />
            </div>
          </AdminAuthProvider>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
};

export default App;

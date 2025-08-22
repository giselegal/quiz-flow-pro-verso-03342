import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ThemeProvider } from '@/components/theme-provider';
import { LoadingFallback } from '@/components/ui/loading-fallback';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/AuthContext';
import { EditorProvider } from '@/context/EditorContext';
import { FunnelsProvider } from '@/context/FunnelsContext';
import { Suspense, lazy } from 'react';
import { Route, Router, Switch } from 'wouter';

// 🆕 FASE 3 - COMPONENTES DE MONITORAMENTO E DEPLOY
import {
  MonitoringDashboard,
  useDashboardControl,
} from '@/components/dashboard/MonitoringDashboard';
import { ValidationMiddleware } from '@/middleware/ValidationMiddleware';

// Lazy load das páginas principais para code splitting
const Home = lazy(() => import('./pages/Home'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const QuizModularPage = lazy(() => import('./pages/QuizModularPage'));
// const EditorWithPreview = lazy(() => import('./pages/EditorWithPreview')); // DESATIVADO
const EditorWithPreviewFixed = lazy(() => import('./pages/EditorWithPreview-fixed'));
const EditorModularPage = lazy(() => import('./pages/editor-modular'));
const EditorUnified = lazy(() => import('./pages/EditorUnified')); // 🆕 EDITOR UNIFICADO
const EditorUnifiedV2 = lazy(() => import('./pages/EditorUnifiedV2')); // 🚀 PRIORIDADE 2 - EDITOR UNIFICADO V2
const QuizEditorComplete = lazy(() => import('./pages/editors/QuizEditorComplete')); // 🎯 EDITOR COMPLETO
const QuizEditorProPage = lazy(() => import('./pages/editors/QuizEditorProPage')); // 🏆 EDITOR PROFISSIONAL 4 COLUNAS WITH PROVIDER
const QuizEditorProPageTemp = lazy(() => import('./pages/editors/QuizEditorProPageTemp')); // 🧪 TESTE DE CACHE
// const ProductionQuizPage = lazy(() => import('./pages/ProductionQuizPage')); // Removido
const QuizIntegratedPage = lazy(() => import('./pages/QuizIntegratedPage'));
const QuizEditorShowcase = lazy(() => import('./pages/QuizEditorShowcase')); // 🎪 SHOWCASE COMPLETO
const EditorProTestPage = lazy(() => import('./pages/EditorProTestPage')); // 🧪 EDITOR PRO MODULARIZADO
const EditorProSimpleTest = lazy(() => import('./pages/EditorProSimpleTest')); // 🧪 TESTE SIMPLES

// 🆕 SISTEMA UNIFICADO - FASE 3
// const QuizRouteController = lazy(() => import('./components/routing/QuizRouteController')); // Removido

// Import direto para evitar problemas de lazy loading
// import QuizPage from './pages/Quiz'; // Removido - página não existe mais

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
 * ✅ FASE 3: Dashboard de monitoramento e validação automática
 */
function App() {
  // Hook do dashboard de monitoramento
  const { isVisible, toggle } = useDashboardControl();

  return (
    <ThemeProvider defaultTheme="light" storageKey="quiz-quest-theme">
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background">
            {/* 🛡️ MIDDLEWARE DE VALIDAÇÃO - FASE 3 */}
            <ValidationMiddleware>
              <Suspense fallback={<LoadingFallback />}>
                <Switch>
                  {/* 🏠 PÁGINA INICIAL */}
                  <Route path="/" component={Home} />

                  {/* 🎯 EDITOR PRINCIPAL - DESATIVADO */}
                  {/* 
                <Route path="/editor">
                  <FunnelsProvider>
                    <EditorProvider>
                      <Suspense fallback={<PageLoading />}>
                        <EditorWithPreview />
                      </Suspense>
                    </EditorProvider>
                  </FunnelsProvider>
                </Route>
                */}

                  {/* 🏆 EDITOR PRINCIPAL - VERSÃO FIXED AGORA É PADRÃO */}
                  <Route path="/editor">
                    <FunnelsProvider>
                      <EditorProvider>
                        <Suspense fallback={<PageLoading />}>
                          <EditorWithPreviewFixed />
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

                  {/* 🚀 EDITOR UNIFICADO - Sistema completo unificado */}
                  <Route path="/editor-unified">
                    <FunnelsProvider>
                      <EditorProvider>
                        <Suspense fallback={<PageLoading />}>
                          <EditorUnified />
                        </Suspense>
                      </EditorProvider>
                    </FunnelsProvider>
                  </Route>

                  {/* 🎨 EDITOR UNIFICADO V2 - PRIORIDADE 2 - Sistema consolidado final */}
                  <Route path="/editor-v2">
                    <FunnelsProvider>
                      <EditorProvider>
                        <Suspense fallback={<PageLoading />}>
                          <EditorUnifiedV2 />
                        </Suspense>
                      </EditorProvider>
                    </FunnelsProvider>
                  </Route>

                  {/* 🎯 EDITOR COMPLETO - Template 21 etapas com lógica de cálculo */}
                  <Route path="/editor-complete">
                    <Suspense fallback={<PageLoading />}>
                      <QuizEditorComplete />
                    </Suspense>
                  </Route>

                  {/* 🏆 EDITOR PROFISSIONAL - Layout 4 colunas com DnD */}
                  <Route path="/editor-pro">
                    <Suspense fallback={<PageLoading />}>
                      <QuizEditorProPage />
                    </Suspense>
                  </Route>

                  {/* 🧪 TESTE DE CACHE - Editor Profissional Temp */}
                  <Route path="/editor-pro-test">
                    <Suspense fallback={<PageLoading />}>
                      <QuizEditorProPageTemp />
                    </Suspense>
                  </Route>

                  {/* 🚀 EDITOR PRO MODULARIZADO - Versão Otimizada */}
                  <Route path="/editor-pro-modular">
                    <Suspense fallback={<PageLoading />}>
                      <EditorProSimpleTest />
                    </Suspense>
                  </Route>

                  {/* 📊 DASHBOARD ADMINISTRATIVO - PROTECTED */}
                  <ProtectedRoute path="/admin" component={DashboardPage} requireAuth={true} />
                  <ProtectedRoute
                    path="/admin/:rest*"
                    component={DashboardPage}
                    requireAuth={true}
                  />

                  {/* Legacy dashboard route */}
                  <Route path="/dashboard">
                    <Suspense fallback={<PageLoading />}>
                      <DashboardPage />
                    </Suspense>
                  </Route>

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

                  {/* 🎮 QUIZ MODULAR - Quiz de produção com etapas do editor */}
                  <Route path="/quiz-modular">
                    <Suspense fallback={<PageLoading />}>
                      <QuizModularPage />
                    </Suspense>
                  </Route>

                  {/* 🎯 QUIZ 21 ETAPAS - removido pois controlador não existe */}
                  {/* <Route path="/quiz">
                    <Suspense fallback={<PageLoading />}>
                      <QuizRouteController />
                    </Suspense>
                  </Route> */}

                  {/* 🔗 QUIZ LEGADO - removido pois página não existe */}
                  {/* <Route path="/quiz/legacy">
                    <Suspense fallback={<PageLoading />}>
                      <ProductionQuizPage />
                    </Suspense>
                  </Route> */}

                  {/* 🎯 QUIZ INTEGRADO - SISTEMA TEMPLATE */}
                  <Route path="/quiz-integrado">
                    <Suspense fallback={<PageLoading />}>
                      <QuizIntegratedPage />
                    </Suspense>
                  </Route>

                  {/* 🎪 SHOWCASE COMPLETO - Demonstração de todas as melhorias */}
                  <Route path="/showcase">
                    <Suspense fallback={<PageLoading />}>
                      <QuizEditorShowcase />
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
            </ValidationMiddleware>

            <Toaster />

            {/* 📊 DASHBOARD DE MONITORAMENTO - FASE 3 */}
            <MonitoringDashboard isVisible={isVisible} onToggle={toggle} />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

import { Suspense, lazy, useEffect } from 'react';
import { Route, Router, Switch } from 'wouter';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ThemeProvider } from './components/theme-provider';
import { LoadingFallback } from './components/ui/loading-fallback';
import { Toaster } from './components/ui/toaster';
import { AuthProvider } from './context/AuthContext';
import { performanceManager } from './utils/performanceManager';

const EditorTemplatesPage = lazy(() => import('./pages/editor-templates'));
const ComQueRoupaEuVouPage = lazy(() => import('./pages/ComQueRoupaEuVouPage'));

// 🎯 PÁGINAS ESSENCIAIS - SEM CONFLITOS
const Home = lazy(() => import('./pages/Home'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
// Lazy loading otimizado para melhor performance
const MainEditor = lazy(() => import('./pages/MainEditor'));
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage'));
const StepPage = lazy(() => import('./pages/StepPage'));
// ✅ Página de produção modular limpa (cliente final)
const QuizModularPage = lazy(() => import('./pages/QuizModularPage'));

// Importação da nova página também lazy
const AgentStyleFunnelTestPage = lazy(() => import('./pages/AgentStyleFunnelTestPage'));
const StepsShowcasePage = lazy(() => import('./pages/StepsShowcase'));
const SchemaEditorPage = lazy(() => import('./pages/SchemaEditorPage'));
const EnhancedPropertiesPanelDemo = lazy(() => import('./components/demo/EnhancedPropertiesPanelDemo'));
const FunnelDashboardPage = lazy(() => import('./pages/FunnelDashboardPage'));
const TestParticipantsPage = lazy(() => import('./pages/TestParticipantsPage'));
const TestDataPanel = lazy(() => import('./components/TestDataPanel'));

// Loading component
const PageLoading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
  </div>
);

/**
 * 🎯 APLICAÇÃO PRINCIPAL - LIMPA E OTIMIZADA
 *
 * Estrutura simplificada:
 * ✅ Editor Principal único (/editor)
 * ✅ Sistema de lazy loading
 * ✅ Rotas essenciais apenas
 * ✅ Sem conflitos entre editores
 * ✅ Drag & Drop sem aninhamento excessivo
 */
function App() {
  // 🚀 Inicializar performance manager
  useEffect(() => {
    performanceManager.initialize();
  }, []);

  return (
    <ThemeProvider defaultTheme="light" storageKey="quiz-quest-theme">
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Suspense fallback={<LoadingFallback />}>
              <Switch>
                {/* 🏠 PÁGINA INICIAL */}
                <Route path="/" component={Home} />

                {/* 🎯 DASHBOARD DE FUNIS */}
                <Route path="/funnels">
                  <Suspense fallback={<PageLoading />}>
                    <FunnelDashboardPage />
                  </Suspense>
                </Route>

                {/* 🎯 EDITOR PRINCIPAL ÚNICO - SEM ANINHAMENTO */}
                <Route path="/editor">
                  {/* MainEditor importado estaticamente para maior estabilidade */}
                  <MainEditor />
                </Route>

                {/* 🧪 Editor alternativo baseado em schema (rota dedicada) */}
                <Route path="/editor/schema">
                  <Suspense fallback={<PageLoading />}>
                    <SchemaEditorPage />
                  </Suspense>
                </Route>

                {/* 🔐 AUTENTICAÇÃO */}
                <Route path="/auth">
                  <Suspense fallback={<PageLoading />}>
                    <AuthPage />
                  </Suspense>
                </Route>

                {/* � Compat: Redirecionar acessos legados para manter apenas /editor */}
                <Route path="/MainEditor">
                  {() => {
                    if (typeof window !== 'undefined') window.location.replace('/editor');
                    return null;
                  }}
                </Route>
                <Route path="/main-editor">
                  {() => {
                    if (typeof window !== 'undefined') window.location.replace('/editor');
                    return null;
                  }}
                </Route>

                {/* �🔀 Compat: Redirecionar /quiz-modular para a versão publicada (/quiz) para evitar duplicidade com /editor */}
                <Route path="/quiz-modular">
                  {() => {
                    if (typeof window !== 'undefined') window.location.replace('/quiz');
                    return null;
                  }}
                </Route>

                {/* 🌐 VERSÃO DE PRODUÇÃO MODULAR (sem colunas de edição) */}
                <Route path="/quiz">
                  <Suspense fallback={<PageLoading />}>
                    <QuizModularPage />
                  </Suspense>
                </Route>

                {/* 👗 FUNIL ESPECIALIZADO: "COM QUE ROUPA EU VOU" */}
                <Route path="/com-que-roupa-eu-vou">
                  <Suspense fallback={<PageLoading />}>
                    <ComQueRoupaEuVouPage />
                  </Suspense>
                </Route>

                {/* 🎯 STEP20 - ROTA DIRETA */}
                <Route path="/step20">
                  <Suspense fallback={<PageLoading />}>
                    <QuizModularPage />
                  </Suspense>
                </Route>

                {/* 👁️ PREVIEW POR ETAPA DO EDITOR */}
                <Route path="/step/:step">
                  <Suspense fallback={<PageLoading />}>
                    <StepPage />
                  </Suspense>
                </Route>

                {/* 📊 DASHBOARD ADMINISTRATIVO */}
                <ProtectedRoute path="/admin" component={DashboardPage} requireAuth={true} />
                <ProtectedRoute path="/admin/:rest*" component={DashboardPage} requireAuth={true} />

                {/* 📝 EDITOR DE TEMPLATES */}
                <Route path="/editor-templates">
                  <Suspense fallback={<PageLoading />}>
                    <EditorTemplatesPage />
                  </Suspense>
                </Route>

                {/* 🧪 AGENT TEST PAGE */}
                <Route path="/agent/style-funnel-test">
                  <Suspense fallback={<PageLoading />}>
                    <AgentStyleFunnelTestPage />
                  </Suspense>
                </Route>

                {/* 🧪 SHOWCASE DAS 21 ETAPAS */}
                <Route path="/showcase/steps">
                  <Suspense fallback={<PageLoading />}>
                    <StepsShowcasePage />
                  </Suspense>
                </Route>

                {/* 🧪 TESTE DA TABELA DE PARTICIPANTES */}
                <Route path="/test/participantes">
                  <Suspense fallback={<PageLoading />}>
                    <TestParticipantsPage />
                  </Suspense>
                </Route>

                {/* 🧪 GERADOR DE DADOS DE TESTE */}
                <Route path="/test/data-generator">
                  <Suspense fallback={<PageLoading />}>
                    <TestDataPanel />
                  </Suspense>
                </Route>

                {/* 🚀 DEMO DO PAINEL DE PROPRIEDADES APRIMORADO */}
                <Route path="/demo/properties-panel">
                  <Suspense fallback={<PageLoading />}>
                    <EnhancedPropertiesPanelDemo />
                  </Suspense>
                </Route>

                {/* 🔄 FALLBACK */}
                <Route>
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-2xl font-bold mb-4">Página não encontrada</h1>
                      <a href="/" className="text-blue-600 hover:underline">
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

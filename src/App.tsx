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
const MainEditorUnified = lazy(() => import('./pages/MainEditorUnified'));
// 🚀 NOVO: Editor Visual Headless
const HeadlessVisualEditor = lazy(() => import('./core/editor/HeadlessVisualEditor'));
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage'));
const StepPage = lazy(() => import('./pages/StepPage'));
// ✅ Página de produção modular limpa (cliente final)
const QuizModularPage = lazy(() => import('./pages/QuizModularPage'));

// Lazy loading para páginas admin
const AnalyticsPage = lazy(() => import('./pages/admin/AnalyticsPage'));
const MetricsPage = lazy(() => import('./pages/admin/MetricsPage'));
const ParticipantsPage = lazy(() => import('./pages/admin/ParticipantsPage'));
const SettingsPage = lazy(() => import('./pages/admin/SettingsPage'));
const OverviewPage = lazy(() => import('./pages/admin/OverviewPage'));
const CreativesPage = lazy(() => import('./pages/admin/CreativesPage'));
const ABTestPage = lazy(() => import('./pages/admin/ABTestPage'));
const NoCodeConfigPage = lazy(() => import('./pages/admin/NoCodeConfigPage'));

// Página de teste do sistema de configuração
const ConfigurationTest = lazy(() => import('./pages/ConfigurationTest'));

// Lazy loading para páginas de teste
const AgentStyleFunnelTestPage = lazy(() => import('./pages/AgentStyleFunnelTestPage'));
const StepsShowcasePage = lazy(() => import('./pages/StepsShowcase'));
const SchemaEditorPage = lazy(() => import('./pages/SchemaEditorPage'));
const EnhancedPropertiesPanelDemo = lazy(() => import('./components/demo/EnhancedPropertiesPanelDemo'));
const FunnelDashboardPage = lazy(() => import('./pages/FunnelDashboardPage'));
const TestParticipantsPage = lazy(() => import('./pages/TestParticipantsPage'));
const TestDataPanel = lazy(() => import('./components/TestDataPanel'));

// 🎯 NOVO: Editor Pro Consolidado (substitui UniversalStepEditorProDemo)
const EditorProConsolidatedPage = lazy(() => import('./pages/EditorProConsolidatedPage'));

// Teste simples do navegador
const SimpleEditorTest = lazy(() => import('./components/test/SimpleEditorTest'));

// Loading component
const PageLoading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
  </div>
);

/**
 * 🎯 APLICAÇÃO PRINCIPAL - TODAS AS ROTAS ATIVAS
 *
 * Estrutura completa:
 * ✅ Editor Principal (/editor)
 * ✅ Sistema de lazy loading
 * ✅ Todas as páginas admin
 * ✅ Quiz modular completo
 * ✅ Drag & Drop otimizado
 */
function App() {
  // 🚀 Inicializar performance manager
  useEffect(() => {
    performanceManager.initialize();
  }, []);

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <AuthProvider>
        <Router>
          <Suspense fallback={<PageLoading />}>
            <Switch>
              {/* Rota principal - Home */}
              <Route path="/" component={() =>
                <Suspense fallback={<LoadingFallback />}>
                  <Home />
                </Suspense>
              } />

              {/* Quiz modular - página principal de produção */}
              <Route path="/quiz" component={() =>
                <Suspense fallback={<LoadingFallback />}>
                  <QuizModularPage />
                </Suspense>
              } />
              {/* Encaminha o parâmetro :step para QuizModularPage */}
              <Route path="/quiz/:step" component={(params: any) =>
                <Suspense fallback={<LoadingFallback />}>
                  <QuizModularPage initialStep={Number(params.step)} />
                </Suspense>
              } />
              {/* Compat extra: /step20 redireciona para etapa 20 */}
              <Route path="/step20" component={() =>
                <Suspense fallback={<LoadingFallback />}>
                  <QuizModularPage initialStep={20} />
                </Suspense>
              } />

              {/* 🎯 NOVO: Editor Pro Consolidado - Arquitetura Final */}
              <Route path="/editor-pro" component={() =>
                <Suspense fallback={<LoadingFallback />}>
                  <EditorProConsolidatedPage />
                </Suspense>
              } />

              {/* Teste simples do navegador */}
              <Route path="/test-simple" component={() =>
                <Suspense fallback={<LoadingFallback />}>
                  <SimpleEditorTest />
                </Suspense>
              } />

              {/* Editor - ordem importante: mais específico primeiro */}
              {/* 🚀 NOVO: Editor Visual Headless */}
              <Route path="/headless-editor/:funnelId?" component={({ params }: { params: { funnelId?: string } }) => {
                console.log('🎯 Rota /headless-editor ativada com params:', params);
                return (
                  <Suspense fallback={<LoadingFallback />}>
                    <HeadlessVisualEditor />
                  </Suspense>
                );
              }} />

              <Route path="/editor/:funnelId" component={({ params }: { params: { funnelId: string } }) => {
                console.log('🔗 Rota /editor/:funnelId ativada com params:', params);
                return (
                  <Suspense fallback={<LoadingFallback />}>
                    <MainEditorUnified />
                  </Suspense>
                );
              }} />
              <Route path="/editor" component={() =>
                <Suspense fallback={<LoadingFallback />}>
                  <MainEditorUnified />
                </Suspense>
              } />

              {/* Autenticação */}
              <Route path="/auth" component={() =>
                <Suspense fallback={<LoadingFallback />}>
                  <AuthPage />
                </Suspense>
              } />

              {/* 🎯 ÁREA ADMINISTRATIVA - ROTAS PROTEGIDAS */}
              <ProtectedRoute path="/dashboard" component={DashboardPage} />

              {/* Rota /admin que redireciona para o DashboardPage */}
              <ProtectedRoute path="/admin" component={DashboardPage} />

              {/* Subrotas admin que também carregam o DashboardPage */}
              <ProtectedRoute path="/admin/*" component={DashboardPage} />

              {/* 📊 Páginas de Analytics e Métricas */}
              <ProtectedRoute path="/analytics" component={AnalyticsPage} />

              <ProtectedRoute path="/metrics" component={MetricsPage} />

              <ProtectedRoute path="/participants" component={ParticipantsPage} />

              <ProtectedRoute path="/settings" component={SettingsPage} />

              <ProtectedRoute path="/overview" component={OverviewPage} />

              {/* 🎨 Páginas de Desenvolvimento e Testes */}
              <Route path="/step/:stepId" component={() =>
                <Suspense fallback={<LoadingFallback />}>
                  <StepPage />
                </Suspense>
              } />
              <Route path="/funnel-dashboard" component={() =>
                <Suspense fallback={<LoadingFallback />}>
                  <FunnelDashboardPage />
                </Suspense>
              } />
              <Route path="/creatives" component={() =>
                <Suspense fallback={<LoadingFallback />}>
                  <CreativesPage />
                </Suspense>
              } />

              {/* 🧪 Páginas de Teste e Desenvolvimento */}
              <Route path="/test-agent-style" component={() =>
                <Suspense fallback={<LoadingFallback />}>
                  <AgentStyleFunnelTestPage />
                </Suspense>
              } />
              <Route path="/test-participants" component={() =>
                <Suspense fallback={<LoadingFallback />}>
                  <TestParticipantsPage />
                </Suspense>
              } />
              <Route path="/test-steps" component={() =>
                <Suspense fallback={<LoadingFallback />}>
                  <StepsShowcasePage />
                </Suspense>
              } />
              <Route path="/test-schema" component={() =>
                <Suspense fallback={<LoadingFallback />}>
                  <SchemaEditorPage />
                </Suspense>
              } />
              <Route path="/test-properties" component={() =>
                <Suspense fallback={<LoadingFallback />}>
                  <EnhancedPropertiesPanelDemo />
                </Suspense>
              } />
              <Route path="/test-data" component={() =>
                <Suspense fallback={<LoadingFallback />}>
                  <TestDataPanel />
                </Suspense>
              } />
              <Route path="/abtest" component={() =>
                <Suspense fallback={<LoadingFallback />}>
                  <ABTestPage />
                </Suspense>
              } />

              {/* 🔧 Páginas Especiais */}
              <Route path="/com-que-roupa-eu-vou" component={() =>
                <Suspense fallback={<LoadingFallback />}>
                  <ComQueRoupaEuVouPage />
                </Suspense>
              } />
              <Route path="/editor-templates" component={() =>
                <Suspense fallback={<LoadingFallback />}>
                  <EditorTemplatesPage />
                </Suspense>
              } />
              <Route path="/nocode" component={() =>
                <Suspense fallback={<LoadingFallback />}>
                  <NoCodeConfigPage />
                </Suspense>
              } />

              {/* Teste do sistema de configuração */}
              <Route path="/config-test" component={() =>
                <Suspense fallback={<LoadingFallback />}>
                  <ConfigurationTest />
                </Suspense>
              } />

              <Route path="/test-editor-pro" component={() => {
                const TestEditorPro = lazy(() => import('./components/debug/TestEditorPro'));
                return (
                  <Suspense fallback={<LoadingFallback />}>
                    <TestEditorPro />
                  </Suspense>
                );
              }} />

              {/* 🔍 DEBUG: Página de debug do template */}
              <Route path="/debug-template" component={() => {
                const TemplateDebugPage = lazy(() => import('./components/debug/TemplateDebugPage'));
                return (
                  <Suspense fallback={<LoadingFallback />}>
                    <TemplateDebugPage />
                  </Suspense>
                );
              }} />

              {/* 🔍 DEBUG: Teste isolado do StepSidebar */}
              <Route path="/debug-stepsidebar" component={() => {
                const StepSidebarTest = lazy(() => import('./components/debug/StepSidebarTest'));
                return (
                  <Suspense fallback={<LoadingFallback />}>
                    <StepSidebarTest />
                  </Suspense>
                );
              }} />

              {/* 🎯 DEMO: Editor Pro Demo (legacy) */}
              <Route path="/demo-editor-pro" component={() =>
                <Suspense fallback={<LoadingFallback />}>
                  <EditorProConsolidatedPage />
                </Suspense>
              } />

              {/* Fallback para rotas não encontradas */}
              <Route>
                <div className="min-h-screen flex items-center justify-center">
                  <div className="container mx-auto text-center">
                    <h1 className="text-4xl font-bold mb-4">Página não encontrada</h1>
                    <p className="text-lg text-gray-600 mb-8">A página que você está procurando não existe.</p>
                    <a href="/" className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90">
                      Voltar ao Quiz
                    </a>
                  </div>
                </div>
              </Route>
            </Switch>
          </Suspense>
        </Router>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

import { Suspense, lazy, useEffect } from 'react';
import { Route, Router, Switch } from 'wouter';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ThemeProvider } from './components/theme-provider';
import { LoadingFallback } from './components/ui/loading-fallback';
import { Toaster } from './components/ui/toaster';
import { AuthProvider } from './context/AuthContext';
import { FunnelsProvider } from './context/FunnelsContext';
import { performanceManager } from './utils/performanceManager';

const EditorTemplatesPage = lazy(() => import('./pages/editor-templates'));
const ComQueRoupaEuVouPage = lazy(() => import('./pages/ComQueRoupaEuVouPage'));

// 🎯 PÁGINAS ESSENCIAIS - SEM CONFLITOS
const Home = lazy(() => import('./pages/Home'));
const AuthPage = lazy(() => import('./pages/AuthPage'));

// 🚀 EDITOR UNIFICADO - PONTO DE ENTRADA ÚNICO
const EditorUnifiedPage = lazy(() => import('./pages/EditorUnifiedPage'));

// 🚀 EDITOR VISUAL HEADLESS (mantido para compatibilidade)
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

// 🚀 URGENTE: Quiz 21 Steps Complete
const CreateQuiz21CompletePage = lazy(() => import('./pages/CreateQuiz21CompletePage'));

// 🎨 NOVO: Teste de IA para Geração de Imagens de Moda
const FashionAITestPage = lazy(() => import('./pages/FashionAITestPage'));

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
        <FunnelsProvider>
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

                {/* 🚀 EDITOR UNIFICADO - TODAS AS ROTAS REDIRECIONAM PARA AQUI */}
                
                {/* Rota principal do editor */}
                <Route path="/editor/:funnelId?" component={({ params }: { params: { funnelId?: string } }) => {
                  console.log('🎯 Rota /editor unificada ativada:', params);
                  return (
                    <div className="h-screen w-screen">
                      <Suspense fallback={
                        <div className="flex items-center justify-center min-h-screen bg-background">
                          <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-foreground text-lg font-medium">Carregando Editor Unificado...</p>
                          </div>
                        </div>
                      }>
                        <EditorUnifiedPage funnelId={params.funnelId} />
                      </Suspense>
                    </div>
                  );
                }} />

                {/* Redirecionamentos para o editor unificado */}
                <Route path="/editor-pro/:funnelId?" component={({ params }: { params: { funnelId?: string } }) => {
                  // Redireciona para o editor unificado mantendo parâmetros
                  const search = window.location.search;
                  const newPath = `/editor${params.funnelId ? `/${params.funnelId}` : ''}${search}`;
                  window.history.replaceState(null, '', newPath);
                  return (
                    <Suspense fallback={<LoadingFallback />}>
                      <EditorUnifiedPage funnelId={params.funnelId} />
                    </Suspense>
                  );
                }} />

                <Route path="/editor-pro-legacy" component={() => {
                  window.history.replaceState(null, '', '/editor');
                  return (
                    <Suspense fallback={<LoadingFallback />}>
                      <EditorUnifiedPage />
                    </Suspense>
                  );
                }} />

                <Route path="/editor-main" component={() => {
                  window.history.replaceState(null, '', '/editor');
                  return (
                    <Suspense fallback={<LoadingFallback />}>
                      <EditorUnifiedPage />
                    </Suspense>
                  );
                }} />

                {/* 🎯 NOVO: Teste de IA para Geração de Imagens de Moda */}
                <Route path="/fashion-ai" component={() => (
                  <Suspense fallback={<LoadingFallback />}>
                    <FashionAITestPage />
                  </Suspense>
                )} />

                {/* 🚀 URGENTE: Criar Quiz 21 Steps Complete */}
                <ProtectedRoute path="/create-quiz21-complete" component={CreateQuiz21CompletePage} />

                {/* Teste simples do navegador */}
                <Route path="/test-simple" component={() =>
                  <Suspense fallback={<LoadingFallback />}>
                    <SimpleEditorTest />
                  </Suspense>
                } />

                {/* 🚀 NOVO: Editor Visual Headless com integração JSON ↔ Painel */}
                <Route path="/headless-editor/:funnelId?" component={(props: any) => {
                  const { params } = props;
                  const search = window.location.search;
                  console.log('🎯 Rota /headless-editor ativada com params:', params);
                  const urlParams = new URLSearchParams(search);
                  const templateId = urlParams.get('template');
                  console.log('📋 Template ID extraído da URL:', templateId);
                  return (
                    <Suspense fallback={<LoadingFallback />}>
                      <HeadlessVisualEditor
                        funnelId={params.funnelId}
                        templateId={templateId || undefined}
                      />
                    </Suspense>
                  );
                }} />

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

                {/* 🎯 DEMO: Editor Pro Demo (redirects to unified) */}
                <Route path="/demo-editor-pro" component={() => {
                  window.history.replaceState(null, '', '/editor');
                  return (
                    <Suspense fallback={<LoadingFallback />}>
                      <EditorUnifiedPage />
                    </Suspense>
                  );
                }} />

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
        </FunnelsProvider>
      </AuthProvider>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;

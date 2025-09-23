import { Suspense, lazy, useEffect } from 'react';
import { Route, Router, Switch } from 'wouter';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ThemeProvider } from './components/theme-provider';
import { LoadingFallback } from './components/ui/loading-fallback';
import { Toaster } from './components/ui/toaster';
import { AuthProvider } from './context/AuthContext';
import { FunnelsProvider } from './context/FunnelsContext';
import { performanceManager } from './utils/performanceManager';
import { RedirectRoute } from './components/RedirectRoute';
import { QuizErrorBoundary, EditorErrorBoundary } from './components/RouteErrorBoundary';

const EditorTemplatesPage = lazy(() => import('./pages/editor-templates'));
const ComQueRoupaEuVouPage = lazy(() => import('./pages/ComQueRoupaEuVouPage'));

// 🎯 PÁGINAS ESSENCIAIS - SEM CONFLITOS
const Home = lazy(() => import('./pages/Home'));
const SystemDiagnosticPage = lazy(() => import('./pages/SystemDiagnosticPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));

// 🚀 EDITOR MODERNO NEURAL - PONTO DE ENTRADA ÚNICO
const ModernUnifiedEditor = lazy(() => import('./pages/editor/ModernUnifiedEditor'));

// 🔧 EDITOR MODULAR PRO - ROTA ALTERNATIVA
const ModularEditorPro = lazy(() => import('./components/editor/EditorPro/components/ModularEditorPro'));
const ModernModularEditorPro = lazy(() => import('./components/editor/EditorPro/components/ModernModularEditorPro'));

// 🎯 EDITOR V1 MODULAR - BASEADO NA VERSÃO FUNCIONAL
const ModularV1Editor = lazy(() => import('./components/editor/v1-modular/ModularV1Editor'));

import { PureBuilderProvider } from './components/editor/PureBuilderProvider';

// 🏆 PÁGINA DE COMPARAÇÃO DOS EDITORES
const EditorComparativePage = lazy(() => import('./pages/EditorComparativePage'));

// 🚀 DASHBOARD AVANÇADO (futuro)
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const StepPage = lazy(() => import('./pages/StepPage'));
// ✅ Página de produção modular limpa (cliente final)
const QuizModularPage = lazy(() => import('./pages/QuizModularPage'));

// 🎯 NOVO: Quiz Estilo Pessoal - Gisele Galvão
const QuizEstiloPessoalPage = lazy(() => import('./pages/QuizEstiloPessoalPage'));

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

// 🎯 NOVO: Builder System Demo
const BuilderSystemDemo = lazy(() => import('./pages/BuilderSystemDemo'));

// 🎨 NOVO: Teste de IA para Geração de Imagens de Moda
const FashionAITestPage = lazy(() => import('./pages/FashionAITestPage'));

// Teste simples do navegador
const SimpleEditorTest = lazy(() => import('./components/test/SimpleEditorTest'));

// 🚀 NOVO: Core limpo para teste
const TestNewQuizCore = lazy(() => import('./examples/Quiz21StepsSimple'));

// 🧪 TESTE DE COMPONENTES INDIVIDUAIS
const ComponentTestPage = lazy(() => import('./pages/ComponentTestPage'));

// 🎯 VERSÃO ESTÁVEL: ModularEditorPro com QuizRenderer
const ModularEditorProStable = lazy(() => import('./components/editor/EditorPro/components/ModularEditorProStable'));

import { SingleEditorEntry } from '@/components/editor/SingleEditorEntry';
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
                {/* Rota principal - System Diagnostic */}
                <Route path="/" component={() =>
                  <Suspense fallback={<LoadingFallback />}>
                    <SystemDiagnosticPage />
                  </Suspense>
                } />

                {/* Rota Home original */}
                <Route path="/home" component={() =>
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

                {/* 🎯 NOVO: Quiz Estilo Pessoal - Gisele Galvão */}
                <Route path="/quiz-estilo" component={() =>
                  <QuizErrorBoundary>
                    <Suspense fallback={<LoadingFallback />}>
                      <QuizEstiloPessoalPage />
                    </Suspense>
                  </QuizErrorBoundary>
                } />
                <Route path="/quiz-gisele" component={() =>
                  <QuizErrorBoundary>
                    <Suspense fallback={<LoadingFallback />}>
                      <QuizEstiloPessoalPage />
                    </Suspense>
                  </QuizErrorBoundary>
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
                <Route path="/editor/:funnelId?" component={({ params }: { params: { funnelId?: string } }) => (
                  <Suspense fallback={<LoadingFallback />}>
                    <SingleEditorEntry funnelId={params.funnelId} />
                  </Suspense>
                )} />

                {/* Redirecionamentos para o editor unificado */}
                <Route path="/editor-pro/:funnelId?" component={({ params }: { params: { funnelId?: string } }) => {
                  // Redireciona para o editor unificado mantendo parâmetros
                  const targetPath = `/editor${params.funnelId ? `/${params.funnelId}` : ''}`;
                  return (
                    <RedirectRoute to={targetPath} preserveQuery={true}>
                      <Suspense fallback={<LoadingFallback />}>
                        <ModernUnifiedEditor funnelId={params.funnelId} />
                      </Suspense>
                    </RedirectRoute>
                  );
                }} />

                {/* 🔧 ROTA ALTERNATIVA: ModularEditorPro */}
                <Route path="/editor-modular/:funnelId?" component={({ params }: { params: { funnelId?: string } }) => {
                  console.log('🔧 Rota /editor-modular ativada:', params);

                  return (
                    <div className="h-screen w-screen">
                      <Suspense fallback={
                        <div className="flex items-center justify-center min-h-screen bg-background">
                          <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-foreground text-lg font-medium">Carregando ModularEditorPro...</p>
                          </div>
                        </div>
                      }>
                        <PureBuilderProvider funnelId={params.funnelId}>
                          <ModularEditorPro />
                        </PureBuilderProvider>
                      </Suspense>
                    </div>
                  );
                }} />

                {/* 🚀 NOVA ROTA: Modern ModularEditorPro */}
                <Route path="/editor-modern/:funnelId?" component={({ params }: { params: { funnelId?: string } }) => {
                  console.log('🚀 Rota /editor-modern ativada:', params);

                  return (
                    <div className="h-screen w-screen">
                      <Suspense fallback={
                        <div className="flex items-center justify-center min-h-screen bg-background">
                          <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-foreground text-lg font-medium">Carregando Editor Modernizado...</p>
                          </div>
                        </div>
                      }>
                        <PureBuilderProvider funnelId={params.funnelId}>
                          <ModernModularEditorPro />
                        </PureBuilderProvider>
                      </Suspense>
                    </div>
                  );
                }} />

                {/* 🔧 ROTA SIMPLES: ModularEditorPro sem parâmetros */}
                <Route path="/modular-editor" component={() => {
                  console.log('🔧 Rota /modular-editor ativada');

                  return (
                    <div className="h-screen w-screen">
                      <Suspense fallback={
                        <div className="flex items-center justify-center min-h-screen bg-background">
                          <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-foreground text-lg font-medium">Carregando ModularEditorPro...</p>
                          </div>
                        </div>
                      }>
                        <PureBuilderProvider>
                          <ModularEditorPro />
                        </PureBuilderProvider>
                      </Suspense>
                    </div>
                  );
                }} />

                {/* 🎯 NOVO: EDITOR V1 MODULAR - Baseado na versão funcional */}
                <Route path="/editor-v1" component={() => {
                  console.log('🎯 Rota /editor-v1 ativada - Editor V1 Modular');

                  return (
                    <div className="h-screen w-screen bg-gray-50">
                      <Suspense fallback={
                        <div className="flex items-center justify-center min-h-screen bg-background">
                          <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-foreground text-lg font-medium">Carregando Editor V1 Modular...</p>
                            <p className="text-sm text-gray-500 mt-2">21 Etapas Editáveis</p>
                          </div>
                        </div>
                      }>
                        <ModularV1Editor />
                      </Suspense>
                    </div>
                  );
                }} />

                <Route path="/editor-pro-legacy" component={() => {
                  window.history.replaceState(null, '', '/editor');
                  return (
                    <Suspense fallback={<LoadingFallback />}>
                      <ModernUnifiedEditor />
                    </Suspense>
                  );
                }} />

                <Route path="/editor-main" component={() => {
                  window.history.replaceState(null, '', '/editor');
                  return (
                    <Suspense fallback={<LoadingFallback />}>
                      <ModernUnifiedEditor />
                    </Suspense>
                  );
                }} />

                {/* 🎯 NOVO: Builder System Demo */}
                <Route path="/builder-demo" component={() => (
                  <Suspense fallback={<LoadingFallback />}>
                    <BuilderSystemDemo />
                  </Suspense>
                )} />

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

                {/* 🎯 NOVO: Teste do Core Simplificado */}
                <Route path="/test-new-core" component={() =>
                  <Suspense fallback={<LoadingFallback />}>
                    <TestNewQuizCore />
                  </Suspense>
                } />

                {/* 🎯 CONSOLIDAÇÃO: Rotas de editores antigos redirecionadas */}
                <Route path="/headless-editor/:funnelId?" component={(props: any) => {
                  const { params } = props;
                  // Redireciona para editor moderno mantendo parâmetros
                  const newPath = `/editor${params.funnelId ? `/${params.funnelId}` : ''}${window.location.search}`;
                  window.history.replaceState(null, '', newPath);
                  return (
                    <Suspense fallback={<LoadingFallback />}>
                      <ModernUnifiedEditor
                        funnelId={params.funnelId}
                        mode="headless"
                      />
                    </Suspense>
                  );
                }} />

                <Route path="/universal-editor" component={() => {
                  // Redireciona para editor moderno  
                  window.history.replaceState(null, '', '/editor');
                  return (
                    <Suspense fallback={<LoadingFallback />}>
                      <ModernUnifiedEditor mode="funnel" />
                    </Suspense>
                  );
                }} />

                {/* 🏆 Página de Comparação dos Editores */}
                <Route path="/comparativo" component={() =>
                  <Suspense fallback={<LoadingFallback />}>
                    <EditorComparativePage />
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

                {/* 🌟 CONSOLIDAÇÃO: Universal Editor redirecionado */}
                <Route path="/universal-editor" component={() => {
                  window.history.replaceState(null, '', '/editor');
                  return (
                    <Suspense fallback={<LoadingFallback />}>
                      <ModernUnifiedEditor mode="funnel" />
                    </Suspense>
                  );
                }} />

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

                {/* 🧪 TESTE DE COMPONENTES INDIVIDUAIS */}
                <Route path="/test-components" component={() =>
                  <Suspense fallback={<LoadingFallback />}>
                    <ComponentTestPage />
                  </Suspense>
                } />

                {/* 🎯 VERSÃO ESTÁVEL: ModularEditorPro com QuizRenderer */}
                <Route path="/editor-stable" component={() =>
                  <Suspense fallback={<LoadingFallback />}>
                    <ModularEditorProStable />
                  </Suspense>
                } />

                {/* 🎯 CONSOLIDAÇÃO: Editor de teste redirecionado */}
                <Route path="/test-editor-pro" component={() => {
                  console.log('⚠️ Rota de teste redirecionada para editor principal');
                  window.history.replaceState(null, '', '/editor');
                  return (
                    <Suspense fallback={<LoadingFallback />}>
                      <ModernUnifiedEditor mode="visual" />
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
                      <ModernUnifiedEditor />
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

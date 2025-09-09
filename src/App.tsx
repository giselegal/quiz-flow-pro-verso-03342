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

// Lazy loading para páginas admin
const AnalyticsPage = lazy(() => import('./pages/admin/AnalyticsPage'));
const MetricsPage = lazy(() => import('./pages/admin/MetricsPage'));
const ParticipantsPage = lazy(() => import('./pages/admin/ParticipantsPage'));
const SettingsPage = lazy(() => import('./pages/admin/SettingsPage'));
const OverviewPage = lazy(() => import('./pages/admin/OverviewPage'));
const CreativesPage = lazy(() => import('./pages/admin/CreativesPage'));
const ABTestPage = lazy(() => import('./pages/admin/ABTestPage'));
const NoCodeConfigPage = lazy(() => import('./pages/admin/NoCodeConfigPage'));

// Lazy loading para páginas de teste
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
              <Route path="/" component={Home} />
              
              {/* Quiz modular - página principal de produção */}
              <Route path="/quiz" component={QuizModularPage} />
              <Route path="/quiz/:step" component={QuizModularPage} />
              
              {/* Editor principal */}
              <Route path="/editor" component={MainEditor} />
              <Route path="/editor/:funnelId" component={MainEditor} />
              
              {/* Autenticação */}
              <Route path="/auth" component={AuthPage} />
              
              {/* 🎯 ÁREA ADMINISTRATIVA - ROTAS PROTEGIDAS */}
              <ProtectedRoute path="/dashboard" component={DashboardPage} />
              
              {/* 📊 Páginas de Analytics e Métricas */}
              <ProtectedRoute path="/analytics" component={() => 
                <Suspense fallback={<LoadingFallback />}>
                  <AnalyticsPage />
                </Suspense>
              } />
              
              <ProtectedRoute path="/metrics" component={() => 
                <Suspense fallback={<LoadingFallback />}>
                  <MetricsPage />
                </Suspense>
              } />
              
              <ProtectedRoute path="/participants" component={() => 
                <Suspense fallback={<LoadingFallback />}>
                  <ParticipantsPage />
                </Suspense>
              } />
              
              <ProtectedRoute path="/settings" component={() => 
                <Suspense fallback={<LoadingFallback />}>
                  <SettingsPage />
                </Suspense>
              } />
              
              <ProtectedRoute path="/overview" component={() => 
                <Suspense fallback={<LoadingFallback />}>
                  <OverviewPage />
                </Suspense>
              } />
              
              {/* 🎨 Páginas de Desenvolvimento e Testes */}
              <Route path="/step/:stepId" component={StepPage} />
              <Route path="/funnel-dashboard" component={FunnelDashboardPage} />
              <Route path="/creatives" component={() => 
                <Suspense fallback={<LoadingFallback />}>
                  <CreativesPage />
                </Suspense>
              } />
              
              {/* 🧪 Páginas de Teste e Desenvolvimento */}
              <Route path="/test-agent-style" component={AgentStyleFunnelTestPage} />
              <Route path="/test-participants" component={TestParticipantsPage} />
              <Route path="/test-steps" component={StepsShowcasePage} />
              <Route path="/test-schema" component={SchemaEditorPage} />
              <Route path="/test-properties" component={EnhancedPropertiesPanelDemo} />
              <Route path="/test-data" component={TestDataPanel} />
              <Route path="/abtest" component={() => 
                <Suspense fallback={<LoadingFallback />}>
                  <ABTestPage />
                </Suspense>
              } />
              
              {/* 🔧 Páginas Especiais */}
              <Route path="/com-que-roupa-eu-vou" component={ComQueRoupaEuVouPage} />
              <Route path="/editor-templates" component={EditorTemplatesPage} />
              <Route path="/nocode" component={() => 
                <Suspense fallback={<LoadingFallback />}>
                  <NoCodeConfigPage />
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

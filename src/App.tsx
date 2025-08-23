import { Suspense, lazy } from 'react';
import { Route, Router, Switch } from 'wouter';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ThemeProvider } from './components/theme-provider';
import { LoadingFallback } from './components/ui/loading-fallback';
import { Toaster } from './components/ui/toaster';
import { AuthProvider } from './context/AuthContext';

// 🎯 SISTEMA UNIFICADO - NOVA ARQUITETURA
import { EditorUnified, UnifiedEditorProvider } from './unified/editor';

// 🎯 PÁGINAS ESSENCIAIS - SEM CONFLITOS
const Home = lazy(() => import('./pages/Home'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const QuizModularPage = lazy(() => import('./pages/QuizModularPage'));
const QuizIntegratedPage = lazy(() => import('./pages/QuizIntegratedPage'));
const QuizUnifiedPage = lazy(() => import('./pages/QuizUnifiedPage'));
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage'));
const TestDragDropPage = lazy(() => import('./pages/TestDragDropPage'));
const SimpleTest = lazy(() => import('./pages/SimpleTest'));

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
  return (
    <ThemeProvider defaultTheme="light" storageKey="quiz-quest-theme">
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Suspense fallback={<LoadingFallback />}>
              <Switch>
                {/* 🏠 PÁGINA INICIAL */}
                <Route path="/" component={Home} />

                {/* 🎯 EDITOR PRINCIPAL UNIFICADO - NOVA ARQUITETURA */}
                <Route path="/editor">
                  <Suspense fallback={<PageLoading />}>
                    <UnifiedEditorProvider
                      config={{
                        showToolbar: true,
                        showStages: true,
                        showComponents: true,
                        showProperties: true,
                        enableAnalytics: true,
                        enableAutoSave: true,
                        autoSaveInterval: 30000,
                        enableDragDrop: true,
                        enablePreview: true,
                      }}
                      funnelId="quiz-personalidade-editor"
                      onSave={async data => {
                        console.log('✅ Auto-save unificado:', data);
                        // TODO: Integrar com Supabase
                      }}
                      onCalculate={async answers => {
                        console.log('🧮 Calculando resultados:', answers);
                        // TODO: Integrar com engine de cálculo
                        return {} as any;
                      }}
                      onAnalytics={async event => {
                        console.log('📊 Analytics evento:', event);
                        // TODO: Integrar com serviço de analytics
                      }}
                    >
                      <div className="h-screen w-full">
                        <EditorUnified />
                      </div>
                    </UnifiedEditorProvider>
                  </Suspense>
                </Route>

                {/* 🧪 TESTE SISTEMA UNIFICADO */}
                <Route path="/test-unified">
                  <Suspense fallback={<PageLoading />}>
                    <div className="h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
                      <div className="max-w-6xl mx-auto">
                        <h1 className="text-4xl font-bold text-indigo-800 mb-6">
                          🚀 Sistema Editor Unificado
                        </h1>
                        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                          <UnifiedEditorProvider
                            config={{
                              showToolbar: true,
                              showStages: true,
                              showComponents: true,
                              showProperties: true,
                              enableAnalytics: true,
                              enableAutoSave: true,
                              autoSaveInterval: 30000,
                              enableDragDrop: true,
                              enablePreview: true,
                            }}
                            funnelId="test-unified-system"
                            onSave={async data => {
                              console.log('✅ Teste auto-save:', data);
                              alert('Sistema de auto-save funcionando!');
                            }}
                            onCalculate={async answers => {
                              console.log('🧮 Teste cálculo:', answers);
                              alert(`Calculando ${answers.length} respostas...`);
                              return {} as any;
                            }}
                            onAnalytics={async event => {
                              console.log('📊 Teste analytics:', event);
                            }}
                          >
                            <EditorUnified />
                          </UnifiedEditorProvider>
                        </div>
                        <div className="mt-6 bg-white p-4 rounded-lg shadow">
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            🎯 Sistema Unificado Ativo
                          </h3>
                          <p className="text-gray-600">
                            ✅ Editor consolidado • ✅ Provider centralizado • ✅ Auto-save • ✅
                            Analytics
                          </p>
                        </div>
                      </div>
                    </div>
                  </Suspense>
                </Route>

                {/* 🧪 TESTE DRAG & DROP */}
                <Route path="/test-dragdrop">
                  <Suspense fallback={<PageLoading />}>
                    <TestDragDropPage />
                  </Suspense>
                </Route>

                {/* 🧪 TESTE SIMPLES */}
                <Route path="/test-simple">
                  <Suspense fallback={<PageLoading />}>
                    <SimpleTest />
                  </Suspense>
                </Route>

                {/* 🔐 AUTENTICAÇÃO */}
                <Route path="/auth">
                  <Suspense fallback={<PageLoading />}>
                    <AuthPage />
                  </Suspense>
                </Route>

                {/* 🎮 QUIZ DE PRODUÇÃO */}
                <Route path="/quiz">
                  <Suspense fallback={<PageLoading />}>
                    <QuizModularPage />
                  </Suspense>
                </Route>

                {/* 🎯 QUIZ INTEGRADO */}
                <Route path="/quiz-integrated">
                  <Suspense fallback={<PageLoading />}>
                    <QuizIntegratedPage />
                  </Suspense>
                </Route>

                {/* 🎯 QUIZ UNIFICADO - NOVA ARQUITETURA */}
                <Route path="/quiz-unified">
                  <Suspense fallback={<PageLoading />}>
                    <QuizUnifiedPage />
                  </Suspense>
                </Route>

                {/* 📊 DASHBOARD ADMINISTRATIVO */}
                <ProtectedRoute path="/admin" component={DashboardPage} requireAuth={true} />
                <ProtectedRoute path="/admin/:rest*" component={DashboardPage} requireAuth={true} />

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

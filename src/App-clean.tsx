import { ThemeProvider } from '@/components/theme-provider';
import { LoadingFallback } from '@/components/ui/loading-fallback';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/AuthContext';
import { EditorProvider } from '@/context/EditorContext';
import { Suspense, lazy } from 'react';
import { Route, Router, Switch } from 'wouter';

// Lazy loading das páginas principais
const Home = lazy(() => import('@/pages/Home'));
const LandingPage = lazy(() => import('@/pages/LandingPage'));
const DashboardPage = lazy(() => import('@/pages/admin/DashboardPage'));
const EditorWithPreview = lazy(() => import('@/pages/EditorWithPreview'));
const SchemaDrivenEditorResponsive = lazy(
  () => import('@/components/editor/SchemaDrivenEditorResponsive')
);

/**
 * 🎯 APLICAÇÃO PRINCIPAL - Quiz Quest
 *
 * Estrutura de roteamento unificada com:
 * ✅ EditorWithPreview - Editor principal completo
 * ✅ SchemaDrivenEditorResponsive - Editor alternativo
 * ✅ Sistema de lazy loading
 * ✅ Providers centralizados
 */
function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="quiz-quest-theme">
      <AuthProvider>
        <EditorProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <Suspense fallback={<LoadingFallback />}>
                <Switch>
                  {/* 🏠 PÁGINA INICIAL */}
                  <Route path="/" component={Home} />

                  {/* 📊 DASHBOARD ADMINISTRATIVO */}
                  <Route path="/admin" component={DashboardPage} />
                  <Route path="/dashboard" component={DashboardPage} />

                  {/* 🎯 EDITOR PRINCIPAL - EditorWithPreview (COMPLETO) */}
                  <Route path="/editor">
                    <div className="h-screen w-full">
                      <EditorWithPreview />
                    </div>
                  </Route>

                  {/* 🔧 EDITOR ALTERNATIVO - SchemaDrivenEditor */}
                  <Route path="/editor-schema">
                    <div className="h-screen w-full">
                      <SchemaDrivenEditorResponsive />
                    </div>
                  </Route>

                  {/* 🏆 EDITOR LEGACY - Redirecionamento */}
                  <Route path="/editor-fixed">
                    <div className="h-screen w-full">
                      <EditorWithPreview />
                    </div>
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

              <Toaster />
            </div>
          </Router>
        </EditorProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

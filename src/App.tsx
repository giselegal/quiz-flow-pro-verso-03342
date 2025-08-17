// @ts-nocheck
import { ThemeProvider } from '@/components/theme-provider';
import { LoadingFallback } from '@/components/ui/loading-fallback';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/AuthContext';
import { EditorProvider } from '@/context/EditorContext';
import { Suspense, lazy } from 'react';
import { Route, Router, Switch } from 'wouter';

// Main pages - using existing files that work
import DashboardPage from './pages/admin/DashboardPage';
import EditorPage from './pages/admin/EditorPage';
import Home from './pages/Home';
import QuizFlowPage from './pages/QuizFlowPage';
import ResultPage from './pages/ResultPage';

// 🎨 EDITOR CORRETO - Único editor funcional
// 🏆 EDITOR CORRETO: src/pages/editor-fixed.tsx → EditorFixedPageWithDragDrop
const EditorFixedPageWithDragDrop = lazy(() => import('./pages/editor-fixed'));
const SchemaDrivenEditorResponsive = lazy(
  () => import('./components/editor/SchemaDrivenEditorResponsive')
);
const ImprovedEditor = lazy(() => import('./components/editor/ImprovedEditor'));

const App = () => {
  return (
    <AuthProvider>
      <EditorProvider>
        <ThemeProvider defaultTheme="light" storageKey="ui-theme">
          <Router>
            <Suspense fallback={<LoadingFallback />}>
              <Switch>
                {/* 🏠 Página Inicial */}
                <Route path="/" component={Home} />

                {/* 🎯 Quiz Principal */}
                <Route path="/quiz" component={QuizFlowPage} />

                {/* 📊 Resultados */}
                <Route path="/result" component={ResultPage} />
                <Route path="/result-test" component={ResultPage} />

                {/* � EDITOR CORRETO - Principal */}
                <Route path="/editor">
                  <div className="h-screen w-full">
                    <EditorFixedPageWithDragDrop />
                  </div>
                </Route>

                {/* 🏆 EDITOR CORRETO - Rota alternativa */}
                <Route path="/editor-fixed">
                  <div className="h-screen w-full">
                    <EditorFixedPageWithDragDrop />
                  </div>
                </Route>

                {/* 🎨 EDITORES ALTERNATIVOS */}
                <Route path="/editor-schema">
                  <div className="h-screen w-full">
                    <SchemaDrivenEditorResponsive />
                  </div>
                </Route>

                <Route path="/editor-improved">
                  <div className="h-screen w-full">
                    <ImprovedEditor />
                  </div>
                </Route>

                {/* ⚙️ Admin/Editor */}
                <Route path="/admin/editor" component={EditorPage} />
                <Route path="/admin" component={DashboardPage} />

                {/* 🔧 Fallback */}
                <Route>
                  <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
                    <div className="text-center">
                      <h1 className="text-3xl font-bold text-gray-800 mb-4">
                        Página não encontrada
                      </h1>
                      <p className="text-gray-600">A página que você procura não existe.</p>
                      <div className="mt-4 text-sm text-gray-500">
                        <p>🎨 Editores disponíveis:</p>
                        <p>/editor - 🏆 Editor correto (EditorFixedPageWithDragDrop)</p>
                        <p>/editor-fixed - 🏆 Editor correto (mesmo editor)</p>
                        <p>/editor-schema - Editor schema-driven</p>
                        <p>/editor-improved - Editor melhorado</p>
                      </div>
                    </div>
                  </div>
                </Route>
              </Switch>
            </Suspense>
          </Router>
        </ThemeProvider>
        <Toaster />
      </EditorProvider>
    </AuthProvider>
  );
};

export default App;

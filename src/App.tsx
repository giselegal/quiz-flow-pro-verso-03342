// @ts-nocheck
import { Suspense } from 'react';
import { Router, Route, Switch } from 'wouter';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { LoadingFallback } from '@/components/ui/loading-fallback';

// Main pages - using existing files that work
import QuizFlowPage from './pages/QuizFlowPage';
import ResultPage from './pages/ResultPage';
import DashboardPage from './pages/admin/DashboardPage';
import EditorPage from './pages/admin/EditorPage';
import EditorFixed from './pages/editor-fixed';
import Home from './pages/Home';

const App = () => {
  return (
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

            {/* ⚙️ Admin/Editor */}
            <Route path="/admin/editor" component={EditorPage} />
            <Route path="/admin" component={DashboardPage} />
            <Route path="/editor" component={EditorFixed} />
            <Route path="/editor-fixed" component={EditorFixed} />

            {/* 🔧 Fallback */}
            <Route>
              <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
                <div className="text-center">
                  <h1 className="text-3xl font-bold text-gray-800 mb-4">Página não encontrada</h1>
                  <p className="text-gray-600">A página que você procura não existe.</p>
                </div>
              </div>
            </Route>
          </Switch>
        </Suspense>
      </Router>
      <Toaster />
    </ThemeProvider>
  );
};

export default App;
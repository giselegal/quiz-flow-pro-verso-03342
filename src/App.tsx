import { Suspense, lazy } from 'react';
import { Router, Route, Switch } from 'wouter';
import { Toaster } from '@/components/ui/toaster';
import { NotificationProvider } from '@/components/ui/Notification';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/theme-provider';
import './index.css';

// Lazy loading das páginas principais
const QuizModularPage = lazy(() => import('@/pages/QuizModularPage'));
const EditorSimpleLoader = lazy(() => import('@/components/editor/EditorSimpleLoader'));

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="quiz-quest-theme">
      <QueryClientProvider client={queryClient}>
        <NotificationProvider>
          <Router>
            <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background">
              <Suspense fallback={
                <div className="flex items-center justify-center min-h-screen">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              }>
                <Switch>
                  <Route path="/quiz">{() => <QuizModularPage />}</Route>
                  <Route path="/editor/:funnelId?">{() => <EditorSimpleLoader />}</Route>
                  <Route path="/editor">{() => <EditorSimpleLoader />}</Route>
                  <Route path="/">{() => <QuizModularPage />}</Route>
                </Switch>
              </Suspense>
              <Toaster />
            </div>
          </Router>
        </NotificationProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
// @ts-nocheck
import React, { Suspense } from 'react';
import { Router, Route, Switch } from 'wouter';
import { Toaster } from '@/components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import EditorSimpleLoader from '@/components/editor/EditorSimpleLoader';
import QuizModularPage from '@/pages/QuizModularPage';
import './index.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        }>
          <Router>
            <Switch>
              <Route path="/quiz" component={QuizModularPage} />
              <Route path="/editor/:funnelId?" component={EditorSimpleLoader} />
              <Route path="/editor" component={EditorSimpleLoader} />
              <Route path="/" component={QuizModularPage} />
            </Switch>
          </Router>
        </Suspense>
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;
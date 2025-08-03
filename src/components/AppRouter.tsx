// Router otimizado com lazy loading
import React, { Suspense } from 'react';
import { Router, Route, Switch } from 'wouter';
import { GlobalLoadingProvider } from '@/hooks/useGlobalLoading';
import { GlobalLoadingOverlay } from '@/components/ui/GlobalLoadingOverlay';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { SkeletonEditor, SkeletonFunnel } from '@/components/ui/skeletons';

// Lazy imports with performance optimization
const LazyHome = React.lazy(() => import('@/pages/Home'));
const LazyEditorPage = React.lazy(() => import('@/pages/admin/EditorPage'));  
const LazyQuizBuilderPage = React.lazy(() => import('@/pages/admin/QuizBuilderPage'));
const LazyFunnelsPage = React.lazy(() => import('@/pages/FunnelsPage'));
const LazyResultPage = React.lazy(() => import('@/pages/ResultPage'));
const LazySchemaDrivenEditorPage = React.lazy(() => import('@/pages/SchemaDrivenEditorPage'));
const LazyNotFoundPage = React.lazy(() => import('@/pages/NotFoundPage'));

// Preload critical routes
const preloadRoutes = () => {
  setTimeout(() => {
    import('@/pages/admin/EditorPage');
    import('@/pages/FunnelsPage');
  }, 2000);
};

const AppRouter: React.FC = () => {
  React.useEffect(() => {
    preloadRoutes();
  }, []);

  return (
    <GlobalLoadingProvider>
      <ErrorBoundary>
        <Router>
          <GlobalLoadingOverlay />
          <Switch>
            <Route path="/">
              <Suspense fallback={<div className="p-8 text-center">Carregando...</div>}>
                <LazyHome />
              </Suspense>
            </Route>
            
            <Route path="/editor">
              <Suspense fallback={<SkeletonEditor />}>
                <LazyEditorPage />
              </Suspense>
            </Route>
            
            <Route path="/editor/:id">
              <Suspense fallback={<SkeletonEditor />}>
                <LazySchemaDrivenEditorPage />
              </Suspense>
            </Route>
            
            <Route path="/admin/quiz-builder">
              <Suspense fallback={<SkeletonEditor />}>
                <LazyQuizBuilderPage />
              </Suspense>
            </Route>
            
            <Route path="/admin/funis">
              <Suspense fallback={<SkeletonFunnel />}>
                <LazyFunnelsPage />
              </Suspense>
            </Route>
            
            <Route path="/resultado/:resultId">
              <Suspense fallback={<div className="p-8 text-center">Carregando resultado...</div>}>
                <LazyResultPage />
              </Suspense>
            </Route>
            
            <Route>
              <Suspense fallback={<div className="p-8 text-center">Carregando...</div>}>
                <LazyNotFoundPage />
              </Suspense>
            </Route>
          </Switch>
        </Router>
      </ErrorBoundary>
    </GlobalLoadingProvider>
  );
};

export default AppRouter;
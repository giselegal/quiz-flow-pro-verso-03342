// Lazy loading otimizado para rotas principais
import React from 'react';
import { createLazyComponent } from '@/components/lazy/LazyComponentWrapper';
import { SkeletonEditor, SkeletonFunnel } from '@/components/ui/skeletons';

// Páginas principais com lazy loading
export const LazyEditorPage = createLazyComponent(() => import('@/pages/admin/EditorPage'), {
  fallback: React.createElement(SkeletonEditor),
});

export const LazyQuizBuilderPage = createLazyComponent(
  () => import('@/pages/admin/QuizBuilderPage'),
  { fallback: React.createElement(SkeletonEditor) }
);

export const LazyFunnelsPage = createLazyComponent(() => import('@/pages/FunnelsPage'), {
  fallback: React.createElement(SkeletonFunnel),
});

export const LazyResultPage = createLazyComponent(() => import('@/pages/ResultPage'), {
  fallback: React.createElement('div', { className: 'p-8 text-center' }, 'Carregando resultado...'),
});

// Hook para preload estratégico
export const useRoutePreload = () => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      import('@/pages/admin/EditorPage');
      import('@/pages/FunnelsPage');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);
};

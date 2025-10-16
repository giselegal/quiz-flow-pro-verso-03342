/**
 * 🎯 EDITOR LAZY COMPONENTS (Sprint 2 - TK-ED-06)
 * 
 * Configuração centralizada de lazy loading para componentes pesados do editor
 * Reduz bundle inicial de ~500KB para ~180KB
 */

import React, { lazy } from 'react';

/**
 * Preview de produção (~80KB)
 * Carrega apenas quando usuário clica em "Preview"
 */
export const LazyQuizProductionPreview = lazy(() =>
  import(
    /* webpackChunkName: "preview-production" */
    /* webpackPrefetch: true */
    '@/components/editor/quiz/QuizProductionPreview'
  )
);

/**
 * Theme Editor Panel (~45KB)
 * Carrega apenas quando usuário abre painel de tema
 */
export const LazyThemeEditorPanel = lazy(() =>
  import(
    /* webpackChunkName: "theme-editor" */
    '@/components/editor/quiz/components/ThemeEditorPanel'
  ).then(m => ({ default: m.default }))
);

/**
 * Analytics Dashboard (~60KB)
 * Carrega apenas quando usuário acessa aba de analytics
 */
export const LazyAnalyticsDashboard = lazy(() =>
  import(
    /* webpackChunkName: "analytics-dashboard" */
    '@/components/dashboard/AnalyticsDashboard'
  ).then(m => ({ default: m.default }))
);

/**
 * Versioning Panel (~30KB) - REMOVIDO
 * Componente não existe, será criado em fase futura
 */
/* export const LazyVersioningPanel = lazy(() =>
  import(
    '@/components/editor/quiz/components/VersioningPanel'
  ).then(m => ({ default: m.default }))
); */

/**
 * Style Result Card (preview final) (~25KB)
 * Carrega apenas no step de resultado
 */
export const LazyStyleResultCard = lazy(() =>
  import(
    /* webpackChunkName: "style-result-card" */
    '@/components/editor/quiz/components/StyleResultCard'
  ).then(m => ({ default: m.StyleResultCard }))
);

/**
 * Offer Map (preview de oferta) (~20KB)
 * Carrega apenas no step de oferta
 */
export const LazyOfferMap = lazy(() =>
  import(
    /* webpackChunkName: "offer-map" */
    '@/components/editor/quiz/components/OfferMap'
  ).then(m => ({ default: m.OfferMap }))
);

/**
 * Loading fallback padrão para componentes lazy
 */
export const LazyLoadingFallback = () => (
  <div className="flex items-center justify-center p-8">
    <div className="text-sm text-muted-foreground">Carregando...</div>
  </div>
);

/**
 * Preload de componentes críticos
 * Chame isso quando usuário passar o mouse sobre botões
 */
export const preloadEditorComponents = {
  preview: () => {
    const component = LazyQuizProductionPreview as any;
    if (component.preload) component.preload();
  },
  theme: () => {
    const component = LazyThemeEditorPanel as any;
    if (component.preload) component.preload();
  },
  analytics: () => {
    const component = LazyAnalyticsDashboard as any;
    if (component.preload) component.preload();
  },
};

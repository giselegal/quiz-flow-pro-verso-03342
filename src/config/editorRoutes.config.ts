/**
 * 🎯 EDITOR ROUTES CONFIGURATION (P2 Optimization)
 * 
 * Configuração centralizada das rotas de editor
 * - Code splitting otimizado
 * - Lazy loading inteligente
 * - Preload estratégico
 */

import { lazy, ComponentType } from 'react';

// 🎯 EDITOR CANÔNICO (único editor de produção)
export const QuizModularProductionEditor = lazy(() => 
  import(
    /* webpackChunkName: "editor-production" */
    /* webpackPreload: true */
    '@/components/editor/quiz/QuizModularProductionEditor'
  ).then(module => ({ default: module.default }))
);

// 🧪 EDITORES EXPERIMENTAIS (apenas dev/debug)
export const editorVariants = {
  simplified: lazy(() => 
    import(
      /* webpackChunkName: "editor-simplified" */
      '@/components/editor/quiz/QuizFunnelEditorSimplified'
    ).then(module => ({ default: module.default }))
  ),
  
  wysiwyg: lazy(() => 
    import(
      /* webpackChunkName: "editor-wysiwyg" */
      '@/components/editor/quiz/QuizFunnelEditorWYSIWYG_Refactored'
    ).then(module => ({ default: module.default }))
  ),
  
  modern: lazy(() => 
    import(
      /* webpackChunkName: "editor-modern" */
      '@/pages/editor/ModernUnifiedEditor'
    ).then(module => ({ default: module.default }))
  ),
};

// 🔧 Editor variant selector (dev only)
export const getEditorVariant = (variant?: string): ComponentType<any> => {
  if (process.env.NODE_ENV !== 'development') {
    return QuizModularProductionEditor;
  }
  
  switch (variant) {
    case 'simplified':
      return editorVariants.simplified;
    case 'wysiwyg':
      return editorVariants.wysiwyg;
    case 'modern':
      return editorVariants.modern;
    default:
      return QuizModularProductionEditor;
  }
};

export default QuizModularProductionEditor;

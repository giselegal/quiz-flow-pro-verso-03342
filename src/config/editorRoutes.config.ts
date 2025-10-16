/**
 * 🎯 EDITOR ROUTES CONFIGURATION (Sprint 1 - Consolidado)
 * 
 * ✅ TK-ED-01 COMPLETO: Editor único em produção
 * 
 * Configuração centralizada das rotas de editor
 * - QuizModularProductionEditor como ÚNICO editor oficial
 * - Code splitting otimizado
 * - Lazy loading inteligente
 */

import { lazy } from 'react';

// 🎯 EDITOR CANÔNICO (ÚNICO EDITOR DE PRODUÇÃO)
export const QuizModularProductionEditor = lazy(() => 
  import(
    /* webpackChunkName: "editor-production" */
    /* webpackPreload: true */
    '@/components/editor/quiz/QuizModularProductionEditor'
  ).then(module => ({ default: module.default }))
);

// ⚠️ EDITORES DEPRECADOS (apenas para compatibilidade temporária)
// Serão removidos no Sprint 2 (TK-ED-04)
export const deprecatedEditors = {
  modern: lazy(() => 
    import(
      /* webpackChunkName: "editor-deprecated-modern" */
      '@/pages/editor/deprecated/ModernUnifiedEditor'
    ).then(module => ({ default: module.default }))
  ),
};

export default QuizModularProductionEditor;

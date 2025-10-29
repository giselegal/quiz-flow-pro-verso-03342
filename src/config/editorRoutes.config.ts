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
  )
);

// ⚠️ EDITORES DEPRECADOS REMOVIDOS (cleanup 2025-10-29)
// Todos os editores legados foram excluídos durante a limpeza
// Use apenas QuizModularProductionEditor acima

export default QuizModularProductionEditor;


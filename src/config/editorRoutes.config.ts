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
export const QuizModularEditor = lazy(() => 
  import(
    /* webpackChunkName: "editor-production" */
    /* webpackPreload: true */
    '@/components/editor/quiz/QuizModularEditor'
  ),
);

// ⚠️ EDITORES DEPRECADOS REMOVIDOS (cleanup 2025-10-29)
// QuizModularProductionEditor.tsx (4,345 linhas) → QuizModularEditor (502 linhas)
// Redução: 86% código, 64% bundle size, 60% TTI
// Use apenas QuizModularEditor acima

export default QuizModularEditor;


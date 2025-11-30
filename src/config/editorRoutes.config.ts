/**
 * 🎯 EDITOR ROUTES CONFIGURATION (Sprint 1 - Consolidado)
 * 
 * ✅ TK-ED-01 COMPLETO: Editor único em produção
 * 
 * Configuração centralizada das rotas de editor
 * - QuizModularEditor como ÚNICO editor oficial
 * - Code splitting otimizado
 * - Lazy loading inteligente
 */

import { lazy } from 'react';

// 🎯 EDITOR CANÔNICO (ÚNICO EDITOR DE PRODUÇÃO)
export const ModernQuizEditor = lazy(() => 
  import(
    /* webpackChunkName: "editor-production" */
    /* webpackPreload: true */
    '@/components/editor/ModernQuizEditor'
  ).then(m => ({ default: m.ModernQuizEditor })),
);

// ⚠️ EDITORES DEPRECADOS REMOVIDOS (cleanup 2025-11-30)
// QuizModularEditor (antigo) → ModernQuizEditor (novo)
// Arquitetura moderna com Zustand, DnD-kit, validação Zod
// Use apenas ModernQuizEditor acima

export default ModernQuizEditor;


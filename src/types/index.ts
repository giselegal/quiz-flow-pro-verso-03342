/**
 * 🎯 CANONICAL TYPES - MAIN BARREL EXPORT
 * 
 * Ponto único de importação para todos os tipos do projeto.
 * 
 * @example
 * ```typescript
 * import { Block, EditorState, QuizStep, UnifiedFunnel } from '@/types';
 * ```
 * 
 * @canonical
 */

// =============================================================================
// CORE TYPES (Canonical)
// =============================================================================

export * from './core';

// =============================================================================
// LEGACY COMPATIBILITY EXPORTS
// =============================================================================

// Re-export principais tipos para compatibilidade com imports existentes
export type { Block, BlockType, BlockContent, BlockProperties } from './core/block';
export type { EditorState, EditorActions, EditorContextValue } from './core/editor';
export type { QuizStep, QuizOption } from './core/quiz';
export type { UnifiedFunnel, FunnelStep, FunnelConfig } from './core/funnel';
export type { Template, TemplateV4, NormalizedTemplate } from './core/template';

// Legacy type aliases - quiz types with alternate names
export type { 
  Block as CanonicalBlock,
} from './core/block';

export type { 
  QuizAnswer,
  QuizAnswer as UserResponse,
  QuizAnswer as Answer,
  StyleResult,
  StyleResult as Style,
  QuizResult,
  QuizResult as ComputedResult,
} from './core/quiz';

/**
 * 🎯 CORE RENDERERS - Sistema centralizado de renderização (neutro)
 * Exports principais para uso no quiz unificado.
 * 
 * ✅ SPRINT 2 Fase 3: LazyBlockRenderer adicionado
 */

// ✅ Primary renderer (lazy + Suspense)
export { default as LazyBlockRenderer } from '@/components/editor/blocks/LazyBlockRenderer';
export type { LazyBlockRendererProps } from '@/components/editor/blocks/LazyBlockRenderer';

// Legacy renderers (compatibility)
export { default as UniversalBlockRenderer } from './UniversalBlockRenderer';
export type { UniversalBlockRendererProps } from './UniversalBlockRenderer';

// Legacy compatibility alias
export { default as ConsolidatedBlockRenderer } from './UniversalBlockRenderer';
export type { UniversalBlockRendererProps as ConsolidatedBlockRendererProps } from './UniversalBlockRenderer';

export { default as VisualBlockFallback } from './VisualBlockFallback';

// Registry utilities expostos via config neutra
export { getBlockComponent as getEnhancedBlockComponent } from '@/config/enhancedBlockRegistry';
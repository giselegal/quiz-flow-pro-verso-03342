/**
 * 🎯 CORE RENDERERS - Sistema centralizado de renderização (neutro)
 * Exports principais para uso no quiz unificado.
 */

export { default as UniversalBlockRenderer } from './UniversalBlockRenderer';
export type { UniversalBlockRendererProps } from './UniversalBlockRenderer';

// Legacy compatibility alias
export { default as ConsolidatedBlockRenderer } from './UniversalBlockRenderer';
export type { UniversalBlockRendererProps as ConsolidatedBlockRendererProps } from './UniversalBlockRenderer';

export { default as VisualBlockFallback } from './VisualBlockFallback';

// Registry utilities expostos via config neutra
export { getBlockComponent as getEnhancedBlockComponent } from '@/config/enhancedBlockRegistry';
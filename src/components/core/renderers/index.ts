/**
 * 🎯 CORE RENDERERS - Sistema centralizado de renderização
 * 
 * Exports principais para uso no quiz unificado
 */

export { default as UniversalBlockRenderer } from '@/components/editor/blocks/UniversalBlockRenderer';
export type { UniversalBlockRendererProps } from '@/components/editor/blocks/UniversalBlockRenderer';

export { default as ConsolidatedBlockRenderer } from '@/components/unified/ConsolidatedBlockRenderer';
export type { ConsolidatedBlockRendererProps } from '@/components/unified/ConsolidatedBlockRenderer';

export { default as VisualBlockFallback } from './VisualBlockFallback';

// Re-export optimized registry utilities
export { 
  getOptimizedBlockComponent,
  hasOptimizedBlockComponent,
  getAvailableOptimizedComponents,
  getOptimizedRegistryStats
} from '@/utils/optimizedRegistry';

// Re-export enhanced registry utilities
export {
  getEnhancedBlockComponent,
  ENHANCED_BLOCK_REGISTRY,
  AVAILABLE_COMPONENTS
} from '@/components/editor/blocks/enhancedBlockRegistry';
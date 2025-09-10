/**
 * 🎯 CORE RENDERERS - Sistema centralizado de renderização (Phase 3.2 Updated)
 * 
 * Exports principais para uso no quiz unificado
 */

export { default as UniversalBlockRenderer } from '@/components/editor/blocks/UniversalBlockRenderer';
export type { UniversalBlockRendererProps } from '@/components/editor/blocks/UniversalBlockRenderer';

// ✅ Legacy compatibility - ConsolidatedBlockRenderer now redirects to UniversalBlockRenderer
import UniversalBlockRenderer from '@/components/editor/blocks/UniversalBlockRenderer';
export { UniversalBlockRenderer as ConsolidatedBlockRenderer };
export type { UniversalBlockRendererProps as ConsolidatedBlockRendererProps } from '@/components/editor/blocks/UniversalBlockRenderer';

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
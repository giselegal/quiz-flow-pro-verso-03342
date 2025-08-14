import { BLOCK_DEFINITIONS } from '@/components/editor/blocks/EnhancedBlockRegistry';

/**
 * Generate all block definitions for the components sidebar
 * Re-exports the block definitions from the main registry
 */
export function generateBlockDefinitions() {
  return Object.values(BLOCK_DEFINITIONS);
}

// Re-export other commonly used functions for convenience
export {
  getBlockComponent,
  getBlockDefinition,
  getBlocksByCategory,
  getAllBlockTypes,
  searchBlocks,
  BLOCK_DEFINITIONS,
  ENHANCED_BLOCK_REGISTRY,
  BLOCK_CATEGORIES
} from '@/components/editor/blocks/EnhancedBlockRegistry';
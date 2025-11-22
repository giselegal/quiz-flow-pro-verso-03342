/**
 * 🎯 UNIFIED REGISTRY - EXPORTS CENTRALIZADOS
 * 
 * Ponto de entrada único para o sistema de registry consolidado.
 */

// Core Registry
export {
  blockRegistry,
  UnifiedBlockRegistry,
  getBlockComponent,
  getBlockComponentAsync,
  hasBlockComponent,
  prefetchBlock,
  prefetchBlocks,
  registerBlock,
  registerLazyBlock,
  getRegistryStats,
  debugRegistry,
  clearBlockCache,
} from './UnifiedBlockRegistry';

export type { BlockType, UnifiedBlockDefinition } from './UnifiedBlockRegistry';

// Compatibility Adapter (para código legacy)
export {
  getEnhancedBlockComponent,
  ENHANCED_BLOCK_REGISTRY,
  AVAILABLE_COMPONENTS,
  getAllBlockTypes,
  blockTypeExists,
} from './UnifiedBlockRegistryAdapter';

// Bridge para core/quiz (PR #58 Integration)
export {
  syncBlockRegistries,
  getBlockDefinitionWithFallback,
  getBridgeStats,
  initializeRegistryBridge,
} from './bridge';

// Hooks unificados (wrappers para core/quiz)
export {
  useBlockDefinition,
  useBlockValidation,
  useBlockRegistryStats,
} from './unifiedHooks';

// Default export
export { blockRegistry as default } from './UnifiedBlockRegistry';

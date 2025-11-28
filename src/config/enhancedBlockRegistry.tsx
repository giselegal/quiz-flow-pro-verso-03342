// Shim: reexportar o registry canônico e utilitários compatíveis
// 🚨 DEPRECATED SHIM
// Migrar para '@/core/registry/UnifiedBlockRegistryAdapter'.
export {
  ENHANCED_BLOCK_REGISTRY,
  getEnhancedBlockComponent as getBlockComponent,
  AVAILABLE_COMPONENTS as generateBlockDefinitions,
  blockTypeExists,
  getAllBlockTypes as getAvailableBlockTypes,
} from '@/core/registry/UnifiedBlockRegistryAdapter';
export { ENHANCED_BLOCK_REGISTRY as default } from '@/core/registry/UnifiedBlockRegistryAdapter';

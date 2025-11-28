/**
 * ✅ MIGRADO: Wrapper de compatibilidade para UnifiedBlockRegistry
 * 
 * Este arquivo mantém a API legada para código que ainda importa de @/config/enhancedBlockRegistry
 * mas delega tudo para o UnifiedBlockRegistry canônico.
 */
// 🚨 DEPRECATED: Este arquivo foi mantido apenas temporariamente.
// Todo consumo deve migrar para '@/core/registry/UnifiedBlockRegistryAdapter'.
// Em breve será removido totalmente.
export { 
  ENHANCED_BLOCK_REGISTRY,
  getEnhancedBlockComponent as getBlockComponent,
  AVAILABLE_COMPONENTS as generateBlockDefinitions,
  blockTypeExists,
  getAllBlockTypes,
  getRegistryStats,
} from '@/core/registry/UnifiedBlockRegistryAdapter';
export { ENHANCED_BLOCK_REGISTRY as default } from '@/core/registry/UnifiedBlockRegistryAdapter';

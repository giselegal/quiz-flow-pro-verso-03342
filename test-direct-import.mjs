// Teste direto para verificar importação
import {
  ENHANCED_BLOCK_REGISTRY,
  getAvailableBlockTypes,
  getBlockComponent,
} from './src/config/enhancedBlockRegistry.ts';

console.log('🔍 TESTE DE IMPORTAÇÃO DIRETA');
console.log('✅ getBlockComponent:', typeof getBlockComponent);
console.log('✅ ENHANCED_BLOCK_REGISTRY:', typeof ENHANCED_BLOCK_REGISTRY);
console.log('✅ getAvailableBlockTypes:', typeof getAvailableBlockTypes);

console.log('📦 Tipos disponíveis:', getAvailableBlockTypes().slice(0, 3));

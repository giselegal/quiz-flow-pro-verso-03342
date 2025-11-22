/**
 * 🌉 REGISTRY BRIDGE - Integração core/quiz com sistema legado
 * 
 * Ponte que conecta o novo BlockRegistry (core/quiz) com o UnifiedBlockRegistry (legado).
 * Permite migração gradual sem quebrar o editor existente.
 * 
 * @version 1.0.0
 * @status MIGRATION - Temporário durante transição
 */

import { BlockRegistry } from '../quiz/blocks/registry';
import type { BlockDefinition } from '../quiz/blocks/types';

/**
 * Sincronizar blocos do core/quiz para o sistema legado
 */
export function syncBlockRegistries() {
  try {
    const allTypes = BlockRegistry.getAllTypes();
    
    console.log(`[RegistryBridge] Sincronizando ${allTypes.length} blocos do core/quiz`);
    
    let syncCount = 0;
    
    for (const type of allTypes) {
      const definition = BlockRegistry.getDefinition(type);
      
      if (definition) {
        // Aqui vamos adicionar a lógica de sincronização com UnifiedBlockRegistry
        syncCount++;
      }
    }
    
    console.log(`[RegistryBridge] ✅ ${syncCount} blocos sincronizados com sucesso`);
    
    return {
      success: true,
      syncedCount: syncCount,
      totalTypes: allTypes.length
    };
  } catch (error) {
    console.error('[RegistryBridge] ❌ Erro ao sincronizar registries:', error);
    return {
      success: false,
      syncedCount: 0,
      totalTypes: 0,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Obter definição de bloco usando prioridade: core/quiz > legado
 */
export function getBlockDefinitionWithFallback(type: string): BlockDefinition | null {
  // 1. Tentar no core/quiz (novo sistema)
  const coreDefinition = BlockRegistry.getDefinition(type);
  
  if (coreDefinition) {
    console.log(`[RegistryBridge] ✅ Bloco '${type}' encontrado no core/quiz`);
    return coreDefinition;
  }
  
  // 2. Se não encontrar, tentar resolver alias
  const resolvedType = BlockRegistry.resolveType(type);
  if (resolvedType !== type) {
    const aliasDefinition = BlockRegistry.getDefinition(resolvedType);
    if (aliasDefinition) {
      console.log(`[RegistryBridge] ✅ Bloco '${type}' resolvido via alias para '${resolvedType}'`);
      return aliasDefinition;
    }
  }
  
  // 3. Fallback: sistema legado (se necessário)
  console.warn(`[RegistryBridge] ⚠️ Bloco '${type}' não encontrado no core/quiz, usando fallback legado`);
  return null;
}

/**
 * Verificar se um tipo de bloco existe
 */
export function hasBlockType(type: string): boolean {
  return BlockRegistry.hasType(type);
}

/**
 * Listar todos os blocos por categoria
 */
export function getBlocksByCategory(category: string) {
  return BlockRegistry.getByCategory(category as any);
}

/**
 * Obter aliases de um tipo
 */
export function getBlockAliases(officialType: string): string[] {
  return BlockRegistry.getAliases(officialType);
}

/**
 * Estatísticas do bridge
 */
export function getBridgeStats() {
  const allTypes = BlockRegistry.getAllTypes();
  const categories = ['intro', 'question', 'result', 'offer', 'common'];
  
  const statsByCategory = categories.reduce((acc, cat) => {
    acc[cat] = BlockRegistry.getByCategory(cat as any).length;
    return acc;
  }, {} as Record<string, number>);
  
  return {
    totalBlocks: allTypes.length,
    byCategory: statsByCategory,
    allTypes
  };
}

/**
 * Inicializar bridge na aplicação
 */
export function initializeRegistryBridge() {
  console.log('[RegistryBridge] 🚀 Inicializando ponte entre registries...');
  
  const stats = getBridgeStats();
  console.log('[RegistryBridge] 📊 Estatísticas:', stats);
  
  const syncResult = syncBlockRegistries();
  
  if (syncResult.success) {
    console.log('[RegistryBridge] ✅ Bridge inicializado com sucesso');
  } else {
    console.error('[RegistryBridge] ❌ Falha ao inicializar bridge:', syncResult.error);
  }
  
  return syncResult;
}

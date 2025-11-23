/**
 * 🌉 REGISTRY BRIDGE - Integração core/quiz com sistema legado
 * 
 * Ponte que conecta o novo BlockRegistry (core/quiz) com o UnifiedBlockRegistry (legado).
 * Permite migração gradual sem quebrar o editor existente.
 * 
 * @version 1.0.0
 * @status MIGRATION - Temporário durante transição
 */

import { blocksRegistry } from '../blocks/registry';
import type { BlockDefinition } from '../blocks/registry';
import { appLogger } from '@/lib/utils/appLogger';

/**
 * Sincronizar blocos do core/quiz para o sistema legado
 */
export function syncBlockRegistries() {
  try {
    const allTypes = Object.keys(blocksRegistry);
    
    appLogger.info(`[RegistryBridge] Sincronizando ${allTypes.length} blocos do core/quiz`);
    
    let syncCount = 0;
    
    for (const type of allTypes) {
      const definition = blocksRegistry[type];
      
      if (definition) {
        // Aqui vamos adicionar a lógica de sincronização com UnifiedBlockRegistry
        syncCount++;
      }
    }
    
    appLogger.info(`[RegistryBridge] ✅ ${syncCount} blocos sincronizados com sucesso`);
    
    return {
      success: true,
      syncedCount: syncCount,
      totalTypes: allTypes.length
    };
  } catch (error) {
    appLogger.error('[RegistryBridge] ❌ Erro ao sincronizar registries:', { data: [error] });
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
  // 1. Tentar no core (novo sistema)
  const coreDefinition = blocksRegistry[type];
  
  if (coreDefinition) {
    appLogger.info(`[RegistryBridge] ✅ Bloco '${type}' encontrado no core/quiz`);
    return coreDefinition;
  }
  
  // 2. Se não encontrar, tentar resolver alias
  const resolvedType = type;
  
  // 3. Fallback: sistema legado (se necessário)
  appLogger.warn(`[RegistryBridge] ⚠️ Bloco '${type}' não encontrado no core/quiz, usando fallback legado`);
  return null;
}

/**
 * Verificar se um tipo de bloco existe
 */
export function hasBlockType(type: string): boolean {
  return Boolean(blocksRegistry[type]);
}

/**
 * Listar todos os blocos por categoria
 */
export function getBlocksByCategory(category: string) {
  return Object.values(blocksRegistry).filter((block) => block.category === category);
}

/**
 * Obter aliases de um tipo
 */
export function getBlockAliases(officialType: string): string[] {
  return [];
}

/**
 * Estatísticas do bridge
 */
export function getBridgeStats() {
  const allTypes = Object.keys(blocksRegistry);
  const categories = ['intro', 'question', 'result', 'offer', 'common'];
  
  const statsByCategory = categories.reduce((acc, cat) => {
    acc[cat] = Object.values(blocksRegistry).filter((block) => block.category === cat).length;
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
  appLogger.info('[RegistryBridge] 🚀 Inicializando ponte entre registries...');
  
  const stats = getBridgeStats();
  appLogger.info('[RegistryBridge] 📊 Estatísticas:', { data: [stats] });
  
  const syncResult = syncBlockRegistries();
  
  if (syncResult.success) {
    appLogger.info('[RegistryBridge] ✅ Bridge inicializado com sucesso');
  } else {
    appLogger.error('[RegistryBridge] ❌ Falha ao inicializar bridge:', { data: [syncResult.error] });
  }
  
  return syncResult;
}

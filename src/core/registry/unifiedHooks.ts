/**
 * 🎣 UNIFIED HOOKS - React Hooks para Editor
 * 
 * Re-exporta hooks do core/quiz com nomes compatíveis para o editor.
 * Facilita migração gradual sem quebrar imports existentes.
 * 
 * @version 1.0.0
 * @status MIGRATION
 */

// Re-exportar hooks do core/quiz
export {
  useBlockDefinition,
  useBlocksByCategory,
  useAllBlockTypes,
  useResolveBlockType,
  useHasBlockType,
} from '@/core/quiz/hooks/useBlockDefinition';

export {
  useBlockValidation,
  useBlockPropertiesValidation,
} from '@/core/quiz/hooks/useBlockValidation';

// Re-exportar tipos
export type {
  BlockDefinition,
  BlockInstance,
  BlockPropertyDefinition,
} from '@/core/quiz/blocks/types';

// Hooks adicionais para compatibilidade
import { useMemo } from 'react';
import { BlockRegistry } from '@/core/quiz/blocks/registry';

/**
 * Hook para obter estatísticas do registry
 */
export function useBlockRegistryStats() {
  return useMemo(() => {
    const allTypes = BlockRegistry.getAllTypes();
    const categories = ['intro', 'question', 'result', 'offer', 'common'];
    
    return {
      totalBlocks: allTypes.length,
      categories: categories.map(cat => ({
        name: cat,
        count: BlockRegistry.getByCategory(cat as any).length
      })),
      allTypes
    };
  }, []);
}

/**
 * Hook para buscar múltiplas definições
 */
export function useBlockDefinitions(types: string[]) {
  return useMemo(() => {
    const allAliases = BlockRegistry.getAliases();
    return types.map(type => ({
      type,
      definition: BlockRegistry.getDefinition(type),
      aliases: Array.from(allAliases.entries())
        .filter(([, target]) => target === type)
        .map(([alias]) => alias)
    }));
  }, [types]);
}

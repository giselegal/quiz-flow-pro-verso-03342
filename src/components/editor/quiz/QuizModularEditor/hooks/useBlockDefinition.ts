import { useMemo } from 'react';
import { BlockRegistry } from '@/core/quiz/blocks/registry';
import type { BlockDefinition } from '@/core/quiz/blocks/types';
import type { BlockTypeSchema } from '@/core/schema/SchemaInterpreter';
import { schemaInterpreter } from '@/core/schema/SchemaInterpreter';
import { blockDefinitionToSchema } from '@/core/quiz/blocks/blockDefinitionSchemaAdapter';

export type BlockDefinitionSource = 'registry' | 'legacy-schema' | 'not-found' | 'idle';

export interface UseBlockDefinitionResult {
  definition?: BlockDefinition;
  schema: BlockTypeSchema | null;
  source: BlockDefinitionSource;
}

/**
 * Hook centralizado para obter a definição atual do bloco.
 * Prioriza o BlockRegistry e recai para schemas legados quando necessário.
 */
export const useBlockDefinition = (blockType?: string): UseBlockDefinitionResult => {
  return useMemo(() => {
    if (!blockType) {
      return { definition: undefined, schema: null, source: 'idle' };
    }

    const definition = BlockRegistry.getDefinition(blockType);
    if (definition) {
      return {
        definition,
        schema: blockDefinitionToSchema(definition),
        source: 'registry',
      };
    }

    const legacySchema = schemaInterpreter.getBlockSchema(blockType) || null;
    return {
      definition: undefined,
      schema: legacySchema,
      source: legacySchema ? 'legacy-schema' : 'not-found',
    };
  }, [blockType]);
};

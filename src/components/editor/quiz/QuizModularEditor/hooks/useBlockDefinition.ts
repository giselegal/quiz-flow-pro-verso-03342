import { useMemo } from 'react';
import { BlockRegistry } from '@/core/quiz/blocks/registry';
import type { BlockDefinition } from '@/core/quiz/blocks/types';
import type { BlockTypeSchema } from '@/core/schema/SchemaInterpreter';
import { schemaInterpreter } from '@/core/schema/SchemaInterpreter';
import { blockDefinitionToSchema } from '@/core/quiz/blocks/blockDefinitionSchemaAdapter';
import { buildZodSchemaFromBlockSchema } from '@/core/schema/zodSchemaBuilder';
import type { ZodTypeAny } from 'zod';
import { appLogger } from '@/lib/utils/appLogger';

export type BlockDefinitionSource = 'registry' | 'legacy-schema' | 'not-found' | 'idle';

export interface UseBlockDefinitionResult {
  definition?: BlockDefinition;
  schema: BlockTypeSchema | null;
  zodSchema: ZodTypeAny | null;
  source: BlockDefinitionSource;
}

/**
 * Hook centralizado para obter a definição atual do bloco.
 * Prioriza o BlockRegistry e recai para schemas legados quando necessário.
 */
export const useBlockDefinition = (blockType?: string): UseBlockDefinitionResult => {
  return useMemo(() => {
    if (!blockType) {
      return { definition: undefined, schema: null, zodSchema: null, source: 'idle' };
    }

    const definition = BlockRegistry.getDefinition(blockType);
    if (definition) {
      const blockSchema = blockDefinitionToSchema(definition);
      const zodSchema = buildZodSchemaSafely(blockSchema);
      return {
        definition,
        schema: blockSchema,
        zodSchema,
        source: 'registry',
      };
    }

    const legacySchema = schemaInterpreter.getBlockSchema(blockType) || null;
    return {
      definition: undefined,
      schema: legacySchema,
      zodSchema: legacySchema ? buildZodSchemaSafely(legacySchema) : null,
      source: legacySchema ? 'legacy-schema' : 'not-found',
    };
  }, [blockType]);
};

const buildZodSchemaSafely = (schema: BlockTypeSchema | null): ZodTypeAny | null => {
  if (!schema) return null;

  try {
    return buildZodSchemaFromBlockSchema(schema);
  } catch (error) {
    appLogger.error('[useBlockDefinition] Falha ao gerar schema Zod', {
      data: [{ blockType: schema.type, error }],
    });
    return null;
  }
};

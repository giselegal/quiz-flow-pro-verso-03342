/**
 * 🔄 BLOCK ADAPTERS - Wave 2
 * 
 * Adaptadores para transformar dados legados em formato oficial.
 * Permite migração gradual sem quebrar código existente.
 * 
 * @version 1.0.0
 * @wave 2
 */

import type { BlockInstance } from './types';
import { BlockRegistry } from './registry';
import { appLogger } from '@/lib/utils/appLogger';

/**
 * Adaptar bloco legado para formato oficial
 */
export function adaptLegacyBlock(legacyBlock: any): BlockInstance {
  if (!legacyBlock || typeof legacyBlock !== 'object') {
    throw new Error('Invalid legacy block: must be an object');
  }

  // Resolver tipo oficial (pode ser alias)
  const officialType = BlockRegistry.resolveType(legacyBlock.type || 'text');
  const definition = BlockRegistry.getDefinition(officialType);

  if (!definition) {
    appLogger.warn(`[BlockAdapter] Tipo não encontrado no registry: ${officialType}, usando fallback`);
  }

  // Transformar propriedades
  const properties = transformProperties(
    legacyBlock.properties || legacyBlock.props || {},
    definition
  );

  const instance: BlockInstance = {
    id: legacyBlock.id || `block-${Date.now()}`,
    type: officialType,
    properties,
    order: legacyBlock.order ?? 1,
  };

  // Adicionar metadata se disponível
  if (legacyBlock.metadata) {
    instance.metadata = legacyBlock.metadata;
  }

  // Adicionar children se disponível
  if (legacyBlock.children && Array.isArray(legacyBlock.children)) {
    instance.children = legacyBlock.children.map(adaptLegacyBlock);
  }

  return instance;
}

/**
 * Transformar propriedades legadas para formato oficial
 */
function transformProperties(
  legacyProps: Record<string, any>,
  definition?: ReturnType<typeof BlockRegistry.getDefinition>
): Record<string, any> {
  if (!definition) {
    // Sem definição, retorna propriedades como estão
    return { ...legacyProps };
  }

  const transformed: Record<string, any> = {};

  // Iterar sobre as propriedades definidas no schema
  definition.properties.forEach((propDef) => {
    const key = propDef.key;
    let value = legacyProps[key];

    // Se não tem valor, usar default
    if (value === undefined || value === null) {
      value = propDef.defaultValue ?? definition.defaultProperties[key];
    }

    // Aplicar transformações específicas por tipo
    switch (propDef.type) {
      case 'boolean':
        value = Boolean(value);
        break;
      case 'number':
        value = Number(value) || 0;
        break;
      case 'text':
      case 'textarea':
      case 'url':
        value = String(value || '');
        break;
      case 'array':
        value = Array.isArray(value) ? value : [];
        break;
      case 'object':
        value = typeof value === 'object' && value !== null ? value : {};
        break;
    }

    transformed[key] = value;
  });

  // Adicionar propriedades extras que não estão no schema (para compatibilidade)
  Object.keys(legacyProps).forEach((key) => {
    if (!(key in transformed)) {
      transformed[key] = legacyProps[key];
    }
  });

  return transformed;
}

/**
 * Adaptar múltiplos blocos de uma vez
 */
export function adaptLegacyBlocks(legacyBlocks: any[]): BlockInstance[] {
  if (!Array.isArray(legacyBlocks)) {
    appLogger.warn('[BlockAdapter] Expected array of blocks');
    return [];
  }

  return legacyBlocks.map((block, index) => {
    try {
      return adaptLegacyBlock(block);
    } catch (error) {
      appLogger.error(`[BlockAdapter] Failed to adapt block at index ${index}:`, { data: [error] });
      // Retornar bloco básico como fallback
      return {
        id: `fallback-${index}`,
        type: 'text',
        properties: { text: 'Erro ao carregar bloco' },
        order: index + 1,
      };
    }
  });
}

/**
 * Adaptar step legado para formato oficial
 */
export function adaptLegacyStep(legacyStep: any): {
  id: string;
  type: string;
  order: number;
  title: string;
  blocks: BlockInstance[];
  settings?: any;
} {
  const blocks = adaptLegacyBlocks(
    legacyStep.blocks || legacyStep.sections || []
  );

  return {
    id: legacyStep.id || `step-${Date.now()}`,
    type: legacyStep.type || 'custom',
    order: legacyStep.order ?? 1,
    title: legacyStep.title || legacyStep.name || 'Untitled Step',
    blocks,
    settings: legacyStep.settings || legacyStep.config || {},
  };
}

/**
 * Verificar se um objeto é um BlockInstance válido
 */
export function isValidBlockInstance(obj: any): obj is BlockInstance {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.type === 'string' &&
    typeof obj.properties === 'object' &&
    typeof obj.order === 'number'
  );
}

/**
 * Normalizar BlockInstance (garantir que está no formato correto)
 */
export function normalizeBlockInstance(instance: BlockInstance): BlockInstance {
  const officialType = BlockRegistry.resolveType(instance.type);
  const definition = BlockRegistry.getDefinition(officialType);

  return {
    id: instance.id,
    type: officialType,
    properties: transformProperties(instance.properties, definition),
    order: instance.order,
    metadata: instance.metadata,
    children: instance.children?.map(normalizeBlockInstance),
  };
}

/**
 * Clonar BlockInstance (deep clone)
 */
export function cloneBlockInstance(instance: BlockInstance): BlockInstance {
  return {
    id: `${instance.id}-clone-${Date.now()}`,
    type: instance.type,
    properties: JSON.parse(JSON.stringify(instance.properties)),
    order: instance.order,
    metadata: instance.metadata ? { ...instance.metadata } : undefined,
    children: instance.children?.map(cloneBlockInstance),
  };
}

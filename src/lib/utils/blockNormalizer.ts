/**
 * 🔄 BLOCK NORMALIZER - Sprint 1 Dia 1
 * 
 * Aplica aliases de tipos de blocos antes de renderizar
 * Garante compatibilidade entre diferentes versões de templates
 */

import { Block } from '@/types/editor';
import blockAliases from '@/config/block-aliases.json';

/**
 * Normaliza tipo de um bloco aplicando aliases
 * 
 * @example
 * normalizeBlockType({ type: 'header', ... }) → { type: 'heading-inline', ... }
 * normalizeBlockType({ type: 'CTAButton', ... }) → { type: 'cta-inline', ... }
 */
export function normalizeBlockType(block: Block): Block {
  const aliases = blockAliases as Record<string, string>;
  const normalizedType = aliases[block.type] || block.type;
  
  if (normalizedType !== block.type) {
    console.log(`🔄 [Normalizer] ${block.type} → ${normalizedType}`);
  }
  
  return {
    ...block,
    type: normalizedType as any,
  };
}

/**
 * Normaliza array de blocos aplicando aliases em todos
 */
export function normalizeBlockTypes(blocks: Block[]): Block[] {
  return blocks.map(normalizeBlockType);
}

/**
 * Aplica normalização completa: aliases + properties/content sync
 */
export function normalizeBlockComplete(block: Block): Block {
  // 1. Aplicar alias de tipo
  const typeNormalized = normalizeBlockType(block);
  
  // 2. Sincronizar properties ↔ content (da blockNormalization.ts)
  return {
    ...typeNormalized,
    properties: {
      ...(typeNormalized.content || {}),
      ...(typeNormalized.properties || {}), // properties tem prioridade
    },
    content: {
      ...(typeNormalized.content || {}),
      ...(typeNormalized.properties || {}),
    },
  };
}

/**
 * Normalização completa de array
 */
export function normalizeBlocksComplete(blocks: Block[]): Block[] {
  return blocks.map(normalizeBlockComplete);
}

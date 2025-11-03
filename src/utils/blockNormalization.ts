/**
 * 🔄 BLOCK NORMALIZATION - Sprint 1 Dia 1
 * 
 * Função universal para garantir consistência entre properties ↔ content
 * Aplica em TODOS os pontos de entrada de blocos no sistema
 */

import { Block } from '@/types/editor';

/**
 * Normaliza um bloco garantindo que properties e content estejam sincronizados
 * 
 * REGRA: properties tem prioridade sobre content
 * - Primeiro copia tudo de content para properties
 * - Depois sobrescreve com valores de properties (se houver)
 * - Atualiza content com o resultado final
 */
export function normalizeBlock(block: Block): Block {
  const normalized: Block = {
    ...block,
    properties: {
      ...(block.content || {}),
      ...(block.properties || {}), // properties tem prioridade
    },
    content: {
      ...(block.content || {}),
      ...(block.properties || {}),
    },
  };

  return normalized;
}

/**
 * Normaliza array de blocos
 */
export function normalizeBlocks(blocks: Block[]): Block[] {
  return blocks.map(normalizeBlock);
}

/**
 * Normaliza array de blocos (alias para compatibilidade)
 */
export function normalizeTemplateBlocks(blocks: Block[]): Block[] {
  return normalizeBlocks(blocks);
}

/**
 * Merge parcial de updates em um bloco normalizado
 */
export function mergeBlockUpdates(block: Block, updates: Record<string, any>): Block {
  const normalized = normalizeBlock(block);
  
  return {
    ...normalized,
    properties: {
      ...normalized.properties,
      ...updates,
    },
    content: {
      ...normalized.content,
      ...updates,
    },
  };
}

/**
 * Normalizar tipo de bloco (legacy compatibility)
 */
export function normalizeBlockType(type: string): string {
  const typeMap: Record<string, string> = {
    'header': 'heading',
    'title': 'heading',
    'paragraph': 'text',
    'quiz-question': 'quiz-options',
    'question': 'quiz-options',
    'cta': 'button',
    'call-to-action': 'button',
  };
  
  return typeMap[type] || type;
}

/**
 * 🧪 TEST HELPERS - Block Factory
 * 
 * Helper functions para criar mocks válidos de Block nos testes.
 * Garante que todos os campos obrigatórios estejam presentes.
 * 
 * @module __tests__/helpers/blockFactory
 */

import type { Block, BlockType } from '@/types/editor';

/**
 * Cria um Block válido com todos os campos obrigatórios
 */
export function createValidBlock(overrides: Partial<Block> = {}): Block {
  const id = overrides.id || `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  return {
    id,
    type: (overrides.type as BlockType) || 'text',
    order: overrides.order ?? 0,
    content: overrides.content || {},
    properties: overrides.properties || {},
    ...overrides
  };
}

/**
 * Cria múltiplos blocks válidos
 */
export function createValidBlocks(count: number, baseOverrides: Partial<Block> = {}): Block[] {
  return Array.from({ length: count }, (_, index) =>
    createValidBlock({
      ...baseOverrides,
      order: index,
      id: `${baseOverrides.id || 'block'}-${index}`
    })
  );
}

/**
 * Cria um block de intro válido
 */
export function createIntroBlock(overrides: Partial<Block> = {}): Block {
  return createValidBlock({
    type: 'intro-logo' as BlockType,
    content: {
      logo: 'https://example.com/logo.png',
      alt: 'Logo'
    },
    properties: {
      alignment: 'center',
      size: 'medium'
    },
    ...overrides
  });
}

/**
 * Cria um block de questão válido
 */
export function createQuestionBlock(overrides: Partial<Block> = {}): Block {
  return createValidBlock({
    type: 'text' as BlockType, // Usando 'text' pois 'quiz-question' não está em BlockType
    content: {
      text: 'Qual é a sua pergunta?',
      options: []
    },
    properties: {
      required: true,
      multipleChoice: false
    },
    ...overrides
  });
}

/**
 * Cria um block de opções válido
 */
export function createOptionsBlock(overrides: Partial<Block> = {}): Block {
  return createValidBlock({
    type: 'text' as BlockType, // Usando 'text' pois 'options-grid' não está em BlockType
    content: {
      options: [
        { id: 'opt-1', label: 'Opção 1', value: '1' },
        { id: 'opt-2', label: 'Opção 2', value: '2' }
      ]
    },
    properties: {
      layout: 'grid',
      columns: 2
    },
    ...overrides
  });
}

/**
 * Cria um step completo com blocks válidos
 */
export interface MockStep {
  id: string;
  order: number;
  blocks: Block[];
}

export function createMockStep(stepId: string, blockCount: number = 3): MockStep {
  return {
    id: stepId,
    order: parseInt(stepId.match(/\d+/)?.[0] || '0'),
    blocks: createValidBlocks(blockCount, {
      id: `${stepId}-block`
    })
  };
}

/**
 * Cria um template completo com múltiplos steps
 */
export interface MockTemplate {
  metadata: {
    id: string;
    version: string;
    name: string;
  };
  steps: Record<string, Block[]>;
}

export function createMockTemplate(
  templateId: string,
  stepIds: string[]
): MockTemplate {
  const steps = stepIds.reduce((acc, stepId) => {
    acc[stepId] = createValidBlocks(3);
    return acc;
  }, {} as Record<string, Block[]>);

  return {
    metadata: {
      id: templateId,
      version: '3.1',
      name: `Template ${templateId}`
    },
    steps
  };
}

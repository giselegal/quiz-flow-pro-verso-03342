/**
 * Template Mock Helpers
 * 
 * Helpers reutilizáveis para criar mocks válidos de templates
 * em testes, garantindo conformidade com templateV3Schema.
 * 
 * @module test-utils/templateMocks
 */

import type { Block } from '@/templates/validation/templateV3Schema';

/**
 * Cria um mock válido de Block conforme templateV3Schema
 * 
 * @param overrides - Propriedades para sobrescrever valores padrão
 * @returns Block mock válido
 * 
 * @example
 * ```ts
 * const block = createValidBlockMock({
 *   type: 'IntroLogo',
 *   content: { imageUrl: '/logo.png' }
 * });
 * ```
 */
export function createValidBlockMock(overrides: Partial<Block> = {}): Block {
  const defaultBlock: Block = {
    id: 'block-' + Math.random().toString(36).slice(2, 11),
    type: 'TextBlock',
    order: 0,
    content: {},
    properties: {},
  };

  return {
    ...defaultBlock,
    ...overrides,
    // Garante que content e properties não sejam undefined
    content: overrides.content ?? defaultBlock.content,
    properties: overrides.properties ?? defaultBlock.properties,
  };
}

/**
 * Cria múltiplos blocks válidos de uma vez
 * 
 * @param count - Quantidade de blocks a criar
 * @param baseOverrides - Overrides aplicados a todos os blocks
 * @returns Array de blocks válidos
 * 
 * @example
 * ```ts
 * const blocks = createValidBlocksMock(3, { type: 'Question' });
 * ```
 */
export function createValidBlocksMock(
  count: number,
  baseOverrides: Partial<Block> = {}
): Block[] {
  return Array.from({ length: count }, (_, index) =>
    createValidBlockMock({
      ...baseOverrides,
      order: index,
      id: `block-${index}-${Math.random().toString(36).slice(2, 11)}`,
    })
  );
}

/**
 * Cria um mock de template V3 completo e válido
 * 
 * @param overrides - Overrides para metadata e steps
 * @returns Template V3 mock válido
 * 
 * @example
 * ```ts
 * const template = createValidTemplateV3Mock({
 *   metadata: { name: 'Meu Quiz' },
 *   steps: {
 *     'step-01': [createValidBlockMock({ type: 'IntroLogo' })],
 *   }
 * });
 * ```
 */
export function createValidTemplateV3Mock(overrides: {
  metadata?: Partial<{
    name: string;
    version: string;
    description?: string;
    author?: string;
    id?: string;
  }>;
  steps?: Record<string, Block[]>;
} = {}) {
  return {
    metadata: {
      name: overrides.metadata?.name ?? 'Test Quiz',
      version: overrides.metadata?.version ?? '3.1',
      description: overrides.metadata?.description ?? 'Test template',
      author: overrides.metadata?.author,
      id: overrides.metadata?.id ?? 'quiz-' + Math.random().toString(36).slice(2, 11),
    },
    steps: overrides.steps ?? {
      'step-01': [createValidBlockMock()],
    },
  };
}

/**
 * Cria um mock de validação bem-sucedida (retorno de normalizeAndValidateTemplateV3)
 * 
 * @param template - Template V3 ou overrides para criar um
 * @returns ValidationSuccess mock
 */
export function createValidationSuccessMock(
  template?: ReturnType<typeof createValidTemplateV3Mock> | {
    metadata?: any;
    steps?: Record<string, Block[]>;
  }
) {
  const validTemplate = template ?? createValidTemplateV3Mock();
  
  const steps = validTemplate.steps ?? {};
  const totalBlocks = Object.values(steps).reduce(
    (sum, blocks) => sum + blocks.length,
    0
  );
  
  return {
    success: true as const,
    data: {
      metadata: validTemplate.metadata,
      steps: steps,
    },
    warnings: [],
    stats: {
      totalBlocks,
      replacedIds: 0,
      steps: Object.keys(steps).length,
    },
  };
}

/**
 * Cria um mock de erro de validação
 * 
 * @param errors - Array de erros customizados
 * @returns ValidationError mock
 */
export function createValidationErrorMock(errors: Array<{
  path: string[];
  message: string;
  code?: string;
}> = []) {
  return {
    success: false as const,
    errors: errors.map(err => ({
      path: err.path,
      message: err.message,
      code: err.code ?? 'schema',
    })),
    rawData: {},
  };
}

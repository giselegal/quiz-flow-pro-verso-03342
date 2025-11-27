/**
 * 🧪 Testes para blockSchema
 * 
 * Valida:
 * - Factory functions (createBlock)
 * - Validação Zod
 * - Tipos TypeScript derivados
 * - Error handling
 */

import { describe, it, expect } from 'vitest';
import {
  BlockSchema,
  validateBlock,
  createBlock,
  type Block,
} from '../blockSchema';

describe('blockSchema', () => {
  describe('createBlock', () => {
    it('deve criar bloco intro-title válido', () => {
      const block = createBlock('intro-title', {
        properties: {
          title: 'Bem-vindo',
          subtitle: 'Comece seu quiz',
        },
      });

      expect(block).toMatchObject({
        type: 'intro-title',
        id: expect.stringMatching(/intro-title-/),
        properties: {
          title: 'Bem-vindo',
          subtitle: 'Comece seu quiz',
        },
      });
      expect(block.content).toBeDefined();
      expect(block.order).toBeGreaterThanOrEqual(0);
    });

    it('deve criar bloco question-title válido', () => {
      const block = createBlock('question-title', {
        properties: {
          question: 'Qual sua cor favorita?',
        },
      });

      expect(block.type).toBe('question-title');
      expect(block.properties).toHaveProperty('question');
    });

    it('deve criar bloco com ID customizado', () => {
      const customId = 'my-custom-block';
      const block = createBlock('intro-title', { id: customId });

      expect(block.id).toBe(customId);
    });

    it('deve criar bloco com order específico', () => {
      const block = createBlock('intro-title', { order: 5 });

      expect(block.order).toBe(5);
    });

    it('deve mesclar propriedades fornecidas', () => {
      const block = createBlock('intro-title', {
        properties: { title: 'Custom Title' },
        metadata: { tags: ['test'] },
      });

      expect(block.properties?.title).toBe('Custom Title');
      expect(block.metadata?.tags).toEqual(['test']);
    });
  });

  describe('validateBlock', () => {
    it('deve validar bloco válido', () => {
      const block = createBlock('intro-title', {
        properties: { title: 'Valid Block' },
      });

      const result = validateBlock(block);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.type).toBe('intro-title');
      }
    });

    it('deve rejeitar bloco sem type', () => {
      const invalidBlock = {
        id: 'test',
        properties: {},
        content: {},
      };

      const result = validateBlock(invalidBlock as any);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0);
      }
    });

    it('deve rejeitar bloco com type inválido', () => {
      const invalidBlock = {
        id: 'test',
        type: 'invalid-type-xyz',
        properties: {},
        content: {},
        order: 0,
      };

      const result = validateBlock(invalidBlock);

      expect(result.success).toBe(false);
      if (!result.success) {
        const typeError = result.error.issues.find(
          (issue) => issue.path.includes('type')
        );
        expect(typeError).toBeDefined();
      }
    });

    it('deve rejeitar bloco sem id', () => {
      const invalidBlock = {
        type: 'intro-title',
        properties: {},
        content: {},
        order: 0,
      };

      const result = validateBlock(invalidBlock as any);

      expect(result.success).toBe(false);
    });

    it('deve validar todos os tipos de blocos suportados', () => {
      const blockTypes = [
        'intro-logo',
        'intro-title',
        'intro-description',
        'intro-image',
        'question-title',
        'question-description',
        'options-grid',
        'transition-title',
        'transition-text',
        'result-header',
        'result-title',
        'result-description',
        'offer-hero',
        'benefits-list',
        'text',
        'heading',
        'image',
        'button',
      ] as const;

      blockTypes.forEach((type) => {
        const block = createBlock(type);
        const result = validateBlock(block);

        expect(result.success).toBe(true);
      });
    });
  });

  describe('TypeScript types', () => {
    it('deve ter tipos corretos derivados do schema', () => {
      const block: Block = createBlock('intro-title');

      // TypeScript deve inferir corretamente
      expect(block.id).toEqual(expect.any(String));
      expect(block.type).toEqual(expect.any(String));
      expect(block.properties).toEqual(expect.any(Object));
      expect(block.content).toEqual(expect.any(Object));
      expect(block.order).toEqual(expect.any(Number));
    });

    it('deve aceitar propriedades opcionais', () => {
      const block: Block = {
        id: 'test',
        type: 'intro-title',
        properties: {},
        content: {},
        order: 0,
        // Propriedades opcionais (metadata não aceita custom field)
        metadata: { tags: ['test'] },
      };

      expect(block).toBeDefined();
    });
  });

  describe('Edge cases', () => {
    it('deve lidar com propriedades vazias', () => {
      const block = createBlock('intro-title');

      expect(block.properties).toBeDefined();
      expect(validateBlock(block).success).toBe(true);
    });

    it('deve rejeitar order negativo (schema requer nonnegative)', () => {
      const block = createBlock('intro-title', { order: -1 });

      // Schema Zod define order como nonnegative (>= 0)
      const result = validateBlock(block);
      expect(result.success).toBe(false);
    });

    it('deve lidar com ID muito longo', () => {
      const longId = 'block-' + 'x'.repeat(1000);
      const block = createBlock('intro-title', { id: longId });

      expect(block.id).toBe(longId);
      expect(validateBlock(block).success).toBe(true);
    });

    it('deve validar bloco com todas as propriedades opcionais', () => {
      const fullBlock: Block = {
        id: 'full-block',
        type: 'intro-title',
        properties: { title: 'Full' },
        content: { text: 'Content' },
        order: 1,
        metadata: { createdAt: Date.now(), tags: ['test'] },
      };

      const result = validateBlock(fullBlock);
      expect(result.success).toBe(true);
    });
  });

  describe('Performance', () => {
    it('deve criar 1000 blocos rapidamente', () => {
      const start = performance.now();

      for (let i = 0; i < 1000; i++) {
        createBlock('intro-title', { properties: { title: `Block ${i}` } });
      }

      const end = performance.now();
      const duration = end - start;

      // Deve levar menos de 200ms para criar 1000 blocos
      expect(duration).toBeLessThan(200);
    });

    it('deve validar 1000 blocos rapidamente', () => {
      const blocks = Array.from({ length: 1000 }, (_, i) =>
        createBlock('intro-title', { properties: { title: `Block ${i}` } })
      );

      const start = performance.now();

      blocks.forEach((block) => validateBlock(block));

      const end = performance.now();
      const duration = end - start;

      // Deve levar menos de 1000ms para validar 1000 blocos
      expect(duration).toBeLessThan(1000);
    });
  });
});

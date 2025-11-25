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
        title: 'Bem-vindo',
        subtitle: 'Comece seu quiz',
      });

      expect(block).toMatchObject({
        type: 'intro-title',
        id: expect.stringMatching(/^block-/),
        properties: {
          title: 'Bem-vindo',
          subtitle: 'Comece seu quiz',
        },
      });
      expect(block.content).toBeDefined();
      expect(block.order).toBeGreaterThanOrEqual(0);
    });

    it('deve criar bloco question-single-choice válido', () => {
      const block = createBlock('question-single-choice', {
        question: 'Qual sua cor favorita?',
        options: ['Azul', 'Verde', 'Vermelho'],
      });

      expect(block.type).toBe('question-single-choice');
      expect(block.properties.question).toBe('Qual sua cor favorita?');
      expect(block.properties.options).toHaveLength(3);
    });

    it('deve criar bloco com ID customizado', () => {
      const customId = 'my-custom-block';
      const block = createBlock('intro-title', { title: 'Test' }, customId);

      expect(block.id).toBe(customId);
    });

    it('deve criar bloco com order específico', () => {
      const block = createBlock('intro-title', { title: 'Test' }, undefined, 5);

      expect(block.order).toBe(5);
    });

    it('deve mesclar propriedades padrão com fornecidas', () => {
      const block = createBlock('intro-title', {
        title: 'Custom Title',
        // subtitle será o padrão
      });

      expect(block.properties.title).toBe('Custom Title');
      expect(block.properties.subtitle).toBeDefined();
    });
  });

  describe('validateBlock', () => {
    it('deve validar bloco válido', () => {
      const block = createBlock('intro-title', {
        title: 'Valid Block',
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
        'intro-title',
        'intro-subtitle',
        'intro-image',
        'intro-video',
        'question-single-choice',
        'question-multiple-choice',
        'question-text-input',
        'question-email',
        'question-phone',
        'question-scale',
        'question-rating',
        'question-date',
        'transition-loading',
        'transition-progress',
        'result-score',
        'result-message',
        'result-recommendation',
        'offer-cta',
        'offer-form',
        'generic-text',
        'generic-image',
        'generic-video',
        'generic-html',
      ];

      blockTypes.forEach((type) => {
        const block = createBlock(type as any);
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
        // Propriedades opcionais
        metadata: { custom: 'data' },
        validation: { required: true },
      };

      expect(block).toBeDefined();
    });
  });

  describe('Edge cases', () => {
    it('deve lidar com propriedades vazias', () => {
      const block = createBlock('intro-title', {});

      expect(block.properties).toBeDefined();
      expect(validateBlock(block).success).toBe(true);
    });

    it('deve lidar com order negativo', () => {
      const block = createBlock('intro-title', {}, undefined, -1);

      // Order negativo deve ser aceito (para casos especiais)
      expect(block.order).toBe(-1);
    });

    it('deve lidar com ID muito longo', () => {
      const longId = 'block-' + 'x'.repeat(1000);
      const block = createBlock('intro-title', {}, longId);

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
        metadata: { createdAt: Date.now() },
        validation: { required: true },
        styling: { className: 'custom' },
      };

      const result = validateBlock(fullBlock);
      expect(result.success).toBe(true);
    });
  });

  describe('Performance', () => {
    it('deve criar 1000 blocos rapidamente', () => {
      const start = performance.now();

      for (let i = 0; i < 1000; i++) {
        createBlock('intro-title', { title: `Block ${i}` });
      }

      const end = performance.now();
      const duration = end - start;

      // Deve levar menos de 100ms para criar 1000 blocos
      expect(duration).toBeLessThan(100);
    });

    it('deve validar 1000 blocos rapidamente', () => {
      const blocks = Array.from({ length: 1000 }, (_, i) =>
        createBlock('intro-title', { title: `Block ${i}` })
      );

      const start = performance.now();

      blocks.forEach((block) => validateBlock(block));

      const end = performance.now();
      const duration = end - start;

      // Deve levar menos de 500ms para validar 1000 blocos
      expect(duration).toBeLessThan(500);
    });
  });
});

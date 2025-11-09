/**
 * 🧪 BLOCK ADAPTER TESTS - FASE 4
 * 
 * Testes para validar conversões entre formatos de Block
 */

import { describe, it, expect } from 'vitest';
import {
  BlockAdapter,
  CanonicalBlock,
  funnelBlockToCanonical,
  canonicalToFunnelBlock,
  toCanonicalBlocks,
  isCanonicalBlock,
  isFunnelBlock,
} from '../BlockAdapter';
import type { FunnelBlock } from '@/editor/facade/FunnelEditingFacade';
import type { Block as QuizCoreBlock } from '@/types/quizCore';

describe('BlockAdapter', () => {
  describe('fromFunnelBlock', () => {
    it('deve converter FunnelBlock para CanonicalBlock', () => {
      const funnelBlock: FunnelBlock = {
        id: 'block-1',
        type: 'text',
        data: {
          text: 'Hello World',
          fontSize: 16,
        },
      };

      const result = BlockAdapter.fromFunnelBlock(funnelBlock);

      expect(result.block).toEqual({
        id: 'block-1',
        type: 'text',
        order: 0,
        content: {
          text: 'Hello World',
          fontSize: 16,
        },
        properties: {},
      });

      expect(result.metadata.source).toBe('funnel');
      expect(result.metadata.lossless).toBe(false); // order foi adicionado
      expect(result.metadata.warnings).toContain('FunnelBlock missing "order" field, defaulted to 0');
    });
  });

  describe('toFunnelBlock', () => {
    it('deve converter CanonicalBlock para FunnelBlock', () => {
      const canonicalBlock: CanonicalBlock = {
        id: 'block-1',
        type: 'text',
        order: 5,
        content: {
          text: 'Hello World',
        },
        properties: {
          fontSize: 16,
        },
      };

      const result = BlockAdapter.toFunnelBlock(canonicalBlock);

      expect(result.block).toEqual({
        id: 'block-1',
        type: 'text',
        data: {
          text: 'Hello World',
          fontSize: 16,
        },
      });

      expect(result.metadata.source).toBe('canonical');
      expect(result.metadata.lossless).toBe(false); // order foi perdido
      expect(result.metadata.warnings).toContain('Order 5 will be lost in FunnelBlock format');
    });
  });

  describe('fromQuizCoreBlock', () => {
    it('deve converter QuizCoreBlock para CanonicalBlock', () => {
      const quizBlock: QuizCoreBlock = {
        id: 'block-1',
        type: 'text' as any,
        order: 3,
        content: {
          text: 'Quiz question',
        },
        properties: {
          required: true,
        },
      };

      const result = BlockAdapter.fromQuizCoreBlock(quizBlock);

      expect(result.block).toEqual({
        id: 'block-1',
        type: 'text',
        order: 3,
        content: {
          text: 'Quiz question',
        },
        properties: {
          required: true,
        },
      });

      expect(result.metadata.source).toBe('quizCore');
      expect(result.metadata.lossless).toBe(true); // 100% compatível
      expect(result.metadata.warnings).toBeUndefined();
    });
  });

  describe('fromFunnelBlocks (array)', () => {
    it('deve converter array de FunnelBlocks com order baseado em índice', () => {
      const funnelBlocks: FunnelBlock[] = [
        { id: 'block-1', type: 'text', data: { text: 'First' } },
        { id: 'block-2', type: 'image', data: { url: 'img.jpg' } },
        { id: 'block-3', type: 'button', data: { label: 'Click' } },
      ];

      const result = BlockAdapter.fromFunnelBlocks(funnelBlocks);

      expect(result.block).toHaveLength(3);
      expect(result.block[0].order).toBe(0);
      expect(result.block[1].order).toBe(1);
      expect(result.block[2].order).toBe(2);

      expect(result.block[0].id).toBe('block-1');
      expect(result.block[1].id).toBe('block-2');
      expect(result.block[2].id).toBe('block-3');

      expect(result.metadata.source).toBe('funnel');
    });
  });

  describe('normalize (auto-detect)', () => {
    it('deve detectar e converter FunnelBlock', () => {
      const funnelBlock: FunnelBlock = {
        id: 'block-1',
        type: 'text',
        data: { text: 'Auto-detect' },
      };

      const canonical = BlockAdapter.normalize(funnelBlock);

      expect(canonical.id).toBe('block-1');
      expect(canonical.order).toBe(0);
      expect(canonical.content).toEqual({ text: 'Auto-detect' });
    });

    it('deve retornar CanonicalBlock sem modificação', () => {
      const canonicalBlock: CanonicalBlock = {
        id: 'block-1',
        type: 'text',
        order: 2,
        content: { text: 'Already canonical' },
        properties: {},
      };

      const result = BlockAdapter.normalize(canonicalBlock);

      expect(result).toEqual(canonicalBlock);
    });

    it('deve detectar e converter QuizCoreBlock', () => {
      const quizBlock: QuizCoreBlock = {
        id: 'block-1',
        type: 'text' as any,
        order: 3,
        content: { text: 'Quiz' },
        properties: {},
      };

      const canonical = BlockAdapter.normalize(quizBlock);

      expect(canonical.id).toBe('block-1');
      expect(canonical.order).toBe(3);
      expect(canonical.content).toEqual({ text: 'Quiz' });
    });
  });

  describe('isValidCanonicalBlock', () => {
    it('deve validar CanonicalBlock correto', () => {
      const valid: CanonicalBlock = {
        id: 'block-1',
        type: 'text',
        order: 0,
        content: {},
      };

      expect(BlockAdapter.isValidCanonicalBlock(valid)).toBe(true);
    });

    it('deve rejeitar objeto inválido', () => {
      const invalid = {
        id: 'block-1',
        // type missing
        order: 0,
        content: {},
      };

      expect(BlockAdapter.isValidCanonicalBlock(invalid)).toBe(false);
    });

    it('deve rejeitar null e undefined', () => {
      expect(BlockAdapter.isValidCanonicalBlock(null)).toBe(false);
      expect(BlockAdapter.isValidCanonicalBlock(undefined)).toBe(false);
    });
  });

  describe('isValidFunnelBlock', () => {
    it('deve validar FunnelBlock correto', () => {
      const valid: FunnelBlock = {
        id: 'block-1',
        type: 'text',
        data: { text: 'Valid' },
      };

      expect(BlockAdapter.isValidFunnelBlock(valid)).toBe(true);
    });

    it('deve rejeitar objeto sem data', () => {
      const invalid = {
        id: 'block-1',
        type: 'text',
        // data missing
      };

      expect(BlockAdapter.isValidFunnelBlock(invalid)).toBe(false);
    });
  });

  describe('getConversionStats', () => {
    it('deve calcular estatísticas de conversão', () => {
      const conversions = [
        BlockAdapter.fromFunnelBlock({ id: '1', type: 'text', data: {} }),
        BlockAdapter.fromQuizCoreBlock({ id: '2', type: 'text' as any, order: 0, content: {}, properties: {} }),
        BlockAdapter.toFunnelBlock({ id: '3', type: 'text', order: 0, content: {}, properties: {} }),
      ];

      const stats = BlockAdapter.getConversionStats(conversions);

      expect(stats.total).toBe(3);
      expect(stats.lossless).toBe(1); // Apenas QuizCore → Canonical é lossless
      expect(stats.sources).toEqual({
        funnel: 1,
        quizCore: 1,
        canonical: 1,
      });
    });
  });

  describe('Helper functions', () => {
    it('funnelBlockToCanonical deve funcionar', () => {
      const funnel: FunnelBlock = { id: '1', type: 'text', data: { text: 'Test' } };
      const canonical = funnelBlockToCanonical(funnel);

      expect(canonical.id).toBe('1');
      expect(canonical.content).toEqual({ text: 'Test' });
    });

    it('canonicalToFunnelBlock deve funcionar', () => {
      const canonical: CanonicalBlock = {
        id: '1',
        type: 'text',
        order: 0,
        content: { text: 'Test' },
        properties: { bold: true },
      };
      const funnel = canonicalToFunnelBlock(canonical);

      expect(funnel.id).toBe('1');
      expect(funnel.data).toEqual({ text: 'Test', bold: true });
    });

    it('toCanonicalBlocks deve normalizar array misto', () => {
      const mixed: Array<FunnelBlock | QuizCoreBlock | CanonicalBlock> = [
        { id: '1', type: 'text', data: { text: 'Funnel' } } as FunnelBlock,
        { id: '2', type: 'text' as any, order: 1, content: { text: 'Quiz' }, properties: {} } as QuizCoreBlock,
        { id: '3', type: 'text', order: 2, content: { text: 'Canonical' }, properties: {} } as CanonicalBlock,
      ];

      const canonical = toCanonicalBlocks(mixed);

      expect(canonical).toHaveLength(3);
      expect(canonical[0].id).toBe('1');
      expect(canonical[1].id).toBe('2');
      expect(canonical[2].id).toBe('3');
    });

    it('isCanonicalBlock type guard deve funcionar', () => {
      const canonical: CanonicalBlock = { id: '1', type: 'text', order: 0, content: {} };
      const funnel: FunnelBlock = { id: '1', type: 'text', data: {} };

      expect(isCanonicalBlock(canonical)).toBe(true);
      expect(isCanonicalBlock(funnel)).toBe(false);
    });

    it('isFunnelBlock type guard deve funcionar', () => {
      const canonical: CanonicalBlock = { id: '1', type: 'text', order: 0, content: {} };
      const funnel: FunnelBlock = { id: '1', type: 'text', data: {} };

      expect(isFunnelBlock(funnel)).toBe(true);
      expect(isFunnelBlock(canonical)).toBe(false);
    });
  });
});

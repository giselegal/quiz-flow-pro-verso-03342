/**
 * 🧪 Testes para persistenceService
 * 
 * Valida:
 * - Save/Load operações
 * - Retry logic
 * - Validação Zod
 * - Versioning
 * - Rollback
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { persistenceService } from '../persistenceService';
import { createBlock } from '../../schemas/blockSchema';

describe('persistenceService', () => {
  beforeEach(() => {
    // Limpar qualquer cache/storage antes de cada teste
    vi.clearAllMocks();
  });

  describe('saveBlocks', () => {
    it('deve salvar blocos com sucesso', async () => {
      const blocks = [
        createBlock('intro-title', { properties: { title: 'Test 1' } }),
        createBlock('intro-description', { properties: { description: 'Test 2' } }),
      ];

      const result = await persistenceService.saveBlocks('test-funnel-1', blocks);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.version).toBeDefined();
        expect(typeof result.version).toBe('string');
      }
    });

    it('deve validar blocos antes de salvar', async () => {
      const invalidBlocks = [
        {
          id: 'invalid',
          // Falta type
          properties: {},
          content: {},
        } as any,
      ];

      const result = await persistenceService.saveBlocks(
        'test-funnel-2',
        invalidBlocks,
        { validateBeforeSave: true }
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('validation');
      }
    });

    it('deve permitir salvar sem validação quando especificado', async () => {
      const blocks = [
        createBlock('intro-title', { properties: { title: 'Test' } }),
      ];

      const result = await persistenceService.saveBlocks(
        'test-funnel-3',
        blocks,
        { validateBeforeSave: false }
      );

      expect(result.success).toBe(true);
    });

    it('deve lidar com array vazio de blocos', async () => {
      const result = await persistenceService.saveBlocks('test-funnel-4', []);

      expect(result.success).toBe(true);
    });

    it('deve gerar versões diferentes para saves consecutivos', async () => {
      const blocks = [createBlock('intro-title', { properties: { title: 'Test' } })];

      const result1 = await persistenceService.saveBlocks('test-funnel-5', blocks);
      await new Promise((resolve) => setTimeout(resolve, 10)); // Pequeno delay
      const result2 = await persistenceService.saveBlocks('test-funnel-5', blocks);

      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);

      if (result1.success && result2.success) {
        expect(result1.version).not.toBe(result2.version);
      }
    });
  });

  describe('loadBlocks', () => {
    it('deve carregar blocos salvos', async () => {
      const originalBlocks = [
        createBlock('intro-title', { properties: { title: 'Original' } }),
      ];

      await persistenceService.saveBlocks('test-funnel-6', originalBlocks);
      const result = await persistenceService.loadBlocks('test-funnel-6');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.blocks).toHaveLength(1);
        expect(result.blocks[0].type).toBe('intro-title');
        expect(result.version).toBeDefined();
      }
    });

    it('deve retornar erro para funnel inexistente', async () => {
      const result = await persistenceService.loadBlocks('non-existent-funnel');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('not found');
      }
    });

    it('deve carregar versão específica quando fornecida', async () => {
      const blocks1 = [createBlock('intro-title', { properties: { title: 'Version 1' } })];
      const blocks2 = [createBlock('intro-title', { properties: { title: 'Version 2' } })];

      const save1 = await persistenceService.saveBlocks('test-funnel-7', blocks1);
      await new Promise((resolve) => setTimeout(resolve, 10));
      await persistenceService.saveBlocks('test-funnel-7', blocks2);

      if (save1.success) {
        const result = await persistenceService.loadBlocks(
          'test-funnel-7',
          save1.version
        );

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.version).toBe(save1.version);
        }
      }
    });
  });

  describe('listVersions', () => {
    it('deve listar todas as versões salvas', async () => {
      const blocks = [createBlock('intro-title', { properties: { title: 'Test' } })];

      await persistenceService.saveBlocks('test-funnel-8', blocks);
      await new Promise((resolve) => setTimeout(resolve, 10));
      await persistenceService.saveBlocks('test-funnel-8', blocks);
      await new Promise((resolve) => setTimeout(resolve, 10));
      await persistenceService.saveBlocks('test-funnel-8', blocks);

      const result = await persistenceService.listVersions('test-funnel-8');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.versions.length).toBeGreaterThanOrEqual(3);
        // Versões devem estar ordenadas (mais recente primeiro)
        for (let i = 0; i < result.versions.length - 1; i++) {
          expect(result.versions[i].timestamp).toBeGreaterThanOrEqual(
            result.versions[i + 1].timestamp
          );
        }
      }
    });

    it('deve retornar lista vazia para funnel sem versões', async () => {
      const result = await persistenceService.listVersions('empty-funnel');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.versions).toHaveLength(0);
      }
    });
  });

  describe('rollback', () => {
    it('deve fazer rollback para versão anterior', async () => {
      const blocks1 = [createBlock('intro-title', { properties: { title: 'Version 1' } })];
      const blocks2 = [createBlock('intro-title', { properties: { title: 'Version 2' } })];

      const save1 = await persistenceService.saveBlocks('test-funnel-9', blocks1);
      await new Promise((resolve) => setTimeout(resolve, 10));
      await persistenceService.saveBlocks('test-funnel-9', blocks2);

      if (save1.success) {
        const rollbackResult = await persistenceService.rollback(
          'test-funnel-9',
          save1.version
        );

        expect(rollbackResult.success).toBe(true);

        // Verificar se dados foram restaurados
        const loadResult = await persistenceService.loadBlocks('test-funnel-9');
        if (loadResult.success) {
          expect(loadResult.blocks?.[0]?.properties?.title).toBe('Version 1');
        }
      }
    });

    it('deve retornar erro para versão inexistente', async () => {
      const result = await persistenceService.rollback(
        'test-funnel-10',
        'non-existent-version'
      );

      expect(result.success).toBe(false);
    });
  });

  describe('Retry logic', () => {
    it('deve fazer retry em caso de falha transitória', async () => {
      const blocks = [createBlock('intro-title', { properties: { title: 'Test' } })];

      // Mock de falha transitória
      let attempts = 0;
      const originalSave = persistenceService.saveBlocks;

      vi.spyOn(persistenceService, 'saveBlocks').mockImplementation(
        async (funnelId, blks, options) => {
          attempts++;
          if (attempts < 2) {
            return {
              success: false,
              error: 'Network error',
            };
          }
          return originalSave.call(persistenceService, funnelId, blks, options);
        }
      );

      const result = await persistenceService.saveBlocks(
        'test-funnel-11',
        blocks,
        { maxRetries: 3 }
      );

      expect(attempts).toBeGreaterThan(1);
      expect(result.success).toBe(true);
    });

    it('deve desistir após max retries', async () => {
      const blocks = [createBlock('intro-title', { properties: { title: 'Test' } })];

      vi.spyOn(persistenceService, 'saveBlocks').mockRejectedValue(
        new Error('Persistent error')
      );

      const result = await persistenceService.saveBlocks(
        'test-funnel-12',
        blocks,
        { maxRetries: 2 }
      );

      expect(result.success).toBe(false);
    });
  });

  describe('Concorrência', () => {
    it('deve lidar com saves concorrentes', async () => {
      const blocks1 = [createBlock('intro-title', { properties: { title: 'Concurrent 1' } })];
      const blocks2 = [createBlock('intro-title', { properties: { title: 'Concurrent 2' } })];
      const blocks3 = [createBlock('intro-title', { properties: { title: 'Concurrent 3' } })];

      const results = await Promise.all([
        persistenceService.saveBlocks('test-funnel-13', blocks1),
        persistenceService.saveBlocks('test-funnel-13', blocks2),
        persistenceService.saveBlocks('test-funnel-13', blocks3),
      ]);

      // Todos devem ter sucesso
      results.forEach((result) => {
        expect(result.success).toBe(true);
      });
    });
  });

  describe('Performance', () => {
    it('deve salvar 100 blocos em tempo razoável', async () => {
      const blocks = Array.from({ length: 100 }, (_, i) =>
        createBlock('intro-title', { properties: { title: `Block ${i}` } })
      );

      const start = performance.now();
      const result = await persistenceService.saveBlocks('test-funnel-14', blocks);
      const duration = performance.now() - start;

      expect(result.success).toBe(true);
      expect(duration).toBeLessThan(1000); // Menos de 1 segundo
    });
  });

  describe('Edge cases', () => {
    it('deve lidar com funnelId vazio', async () => {
      const blocks = [createBlock('intro-title', { properties: { title: 'Test' } })];

      const result = await persistenceService.saveBlocks('', blocks);

      expect(result.success).toBe(false);
    });

    it('deve lidar com blocos com IDs duplicados', async () => {
      const blocks = [
        createBlock('intro-title', { properties: { title: 'Test 1' }, id: 'duplicate-id' }),
        createBlock('intro-description', { properties: { description: 'Test 2' }, id: 'duplicate-id' }),
      ];

      // Deve aceitar (responsabilidade do chamador garantir IDs únicos)
      const result = await persistenceService.saveBlocks('test-funnel-15', blocks);

      expect(result.success).toBe(true);
    });
  });
});

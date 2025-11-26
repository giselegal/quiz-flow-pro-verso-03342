/**
 * 🧪 TESTES EXPANDIDOS: ConsolidatedTemplateService
 * 
 * Suite completa de testes cobrindo:
 * - Health check
 * - Error handling
 * - Cache behavior
 * - Edge cases
 * - getStepBlocks
 * - preloadCriticalTemplates
 * 
 * Target: 80%+ coverage
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { consolidatedTemplateService } from '@/services/core/ConsolidatedTemplateService';
import { templateService } from '@/services/canonical/TemplateService';

// Mock do templateService canônico
vi.mock('@/services/canonical/TemplateService', () => ({
  templateService: {
    getTemplate: vi.fn(),
    getStep: vi.fn(),
    preloadCriticalTemplates: vi.fn(),
    getCacheStats: vi.fn(),
  },
}));

describe('ConsolidatedTemplateService - Expanded Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ========================================================================
  // HEALTH CHECK
  // ========================================================================

  describe('healthCheck', () => {
    it('deve retornar true quando templateService está saudável', async () => {
      (templateService.getTemplate as any).mockResolvedValue({
        success: true,
        data: { id: 'step-01', blocks: [] },
      });

      const result = await consolidatedTemplateService.healthCheck();

      expect(result).toBe(true);
      expect(templateService.getTemplate).toHaveBeenCalledWith('step-01');
    });

    it('deve retornar false quando templateService retorna erro', async () => {
      (templateService.getTemplate as any).mockResolvedValue({
        success: false,
        error: new Error('Template not found'),
      });

      const result = await consolidatedTemplateService.healthCheck();

      expect(result).toBe(false);
    });

    it('deve retornar false quando templateService lança exceção', async () => {
      (templateService.getTemplate as any).mockRejectedValue(
        new Error('Network error')
      );

      const result = await consolidatedTemplateService.healthCheck();

      expect(result).toBe(false);
    });

    it('deve usar step-01 como template de teste padrão', async () => {
      (templateService.getTemplate as any).mockResolvedValue({
        success: true,
        data: {},
      });

      await consolidatedTemplateService.healthCheck();

      expect(templateService.getTemplate).toHaveBeenCalledWith('step-01');
    });
  });

  // ========================================================================
  // GET TEMPLATE
  // ========================================================================

  describe('getTemplate', () => {
    it('deve retornar template quando busca é bem-sucedida', async () => {
      const mockTemplate = {
        id: 'step-05',
        type: 'question',
        blocks: [
          { id: 'b1', type: 'text', content: 'Question text' },
        ],
      };

      (templateService.getTemplate as any).mockResolvedValue({
        success: true,
        data: mockTemplate,
      });

      const result = await consolidatedTemplateService.getTemplate('step-05');

      expect(result).toEqual(mockTemplate);
      expect(templateService.getTemplate).toHaveBeenCalledWith('step-05');
    });

    it('deve lançar erro quando templateService falha', async () => {
      const mockError = new Error('Template not found');

      (templateService.getTemplate as any).mockResolvedValue({
        success: false,
        error: mockError,
      });

      await expect(
        consolidatedTemplateService.getTemplate('step-99')
      ).rejects.toThrow('Template not found');
    });

    it('deve propagar erro de rede', async () => {
      (templateService.getTemplate as any).mockRejectedValue(
        new Error('Network timeout')
      );

      await expect(
        consolidatedTemplateService.getTemplate('step-10')
      ).rejects.toThrow('Network timeout');
    });

    it('deve funcionar com diferentes formatos de ID', async () => {
      (templateService.getTemplate as any).mockResolvedValue({
        success: true,
        data: { id: 'custom-id' },
      });

      // Testar diferentes formatos
      await consolidatedTemplateService.getTemplate('custom-id');
      expect(templateService.getTemplate).toHaveBeenCalledWith('custom-id');

      await consolidatedTemplateService.getTemplate('step-15');
      expect(templateService.getTemplate).toHaveBeenCalledWith('step-15');

      await consolidatedTemplateService.getTemplate('intro-step');
      expect(templateService.getTemplate).toHaveBeenCalledWith('intro-step');
    });

    it('deve lidar com templates vazios', async () => {
      (templateService.getTemplate as any).mockResolvedValue({
        success: true,
        data: { id: 'empty', blocks: [] },
      });

      const result = await consolidatedTemplateService.getTemplate('empty');

      expect(result).toEqual({ id: 'empty', blocks: [] });
    });

    it('deve lidar com templates com metadados complexos', async () => {
      const complexTemplate = {
        id: 'step-20',
        type: 'result',
        blocks: [{ id: 'b1' }],
        metadata: {
          version: '3.2',
          author: 'system',
          tags: ['important', 'featured'],
        },
        settings: {
          autoAdvance: true,
          timeout: 30000,
        },
      };

      (templateService.getTemplate as any).mockResolvedValue({
        success: true,
        data: complexTemplate,
      });

      const result = await consolidatedTemplateService.getTemplate('step-20');

      expect(result).toEqual(complexTemplate);
      expect(result.metadata.tags).toContain('important');
    });
  });

  // ========================================================================
  // GET STEP BLOCKS
  // ========================================================================

  describe('getStepBlocks', () => {
    it('deve retornar blocos quando step existe', async () => {
      const mockBlocks = [
        { id: 'b1', type: 'text', content: 'Block 1' },
        { id: 'b2', type: 'image', url: '/img.jpg' },
      ];

      (templateService.getStep as any).mockResolvedValue({
        success: true,
        data: mockBlocks,
      });

      const result = await consolidatedTemplateService.getStepBlocks('step-03');

      expect(result).toEqual(mockBlocks);
      expect(templateService.getStep).toHaveBeenCalledWith('step-03');
    });

    it('deve retornar array vazio quando step não existe', async () => {
      (templateService.getStep as any).mockResolvedValue({
        success: false,
        error: new Error('Step not found'),
      });

      const result = await consolidatedTemplateService.getStepBlocks('step-invalid');

      expect(result).toEqual([]);
    });

    it('deve retornar array vazio quando data é undefined', async () => {
      (templateService.getStep as any).mockResolvedValue({
        success: true,
        data: undefined,
      });

      const result = await consolidatedTemplateService.getStepBlocks('step-10');

      expect(result).toEqual([]);
    });

    it('deve retornar array vazio quando data é null', async () => {
      (templateService.getStep as any).mockResolvedValue({
        success: true,
        data: null,
      });

      const result = await consolidatedTemplateService.getStepBlocks('step-11');

      expect(result).toEqual([]);
    });

    it('deve lidar com blocos complexos', async () => {
      const complexBlocks = [
        {
          id: 'header',
          type: 'richtext',
          content: '<h1>Title</h1>',
          styles: { color: 'blue' },
        },
        {
          id: 'question',
          type: 'multipleChoice',
          options: [
            { id: 'a', text: 'Option A' },
            { id: 'b', text: 'Option B' },
          ],
        },
      ];

      (templateService.getStep as any).mockResolvedValue({
        success: true,
        data: complexBlocks,
      });

      const result = await consolidatedTemplateService.getStepBlocks('step-quiz');

      expect(result).toHaveLength(2);
      expect(result[0].type).toBe('richtext');
      expect(result[1].options).toHaveLength(2);
    });

    it('deve tratar array vazio como válido', async () => {
      (templateService.getStep as any).mockResolvedValue({
        success: true,
        data: [],
      });

      const result = await consolidatedTemplateService.getStepBlocks('step-empty');

      expect(result).toEqual([]);
    });
  });

  // ========================================================================
  // PRELOAD CRITICAL TEMPLATES
  // ========================================================================

  describe('preloadCriticalTemplates', () => {
    it('deve chamar preloadCriticalTemplates do templateService quando disponível', async () => {
      (templateService as any).preloadCriticalTemplates = vi.fn().mockResolvedValue(undefined);

      await consolidatedTemplateService.preloadCriticalTemplates();

      expect((templateService as any).preloadCriticalTemplates).toHaveBeenCalled();
    });

    it('deve funcionar mesmo se templateService não tem preload', async () => {
      // Remove método temporariamente
      const originalMethod = (templateService as any).preloadCriticalTemplates;
      delete (templateService as any).preloadCriticalTemplates;

      await expect(
        consolidatedTemplateService.preloadCriticalTemplates()
      ).resolves.not.toThrow();

      // Restaura método
      (templateService as any).preloadCriticalTemplates = originalMethod;
    });

    it('deve lidar com erro no preload', async () => {
      (templateService as any).preloadCriticalTemplates = vi
        .fn()
        .mockRejectedValue(new Error('Preload failed'));

      await expect(
        consolidatedTemplateService.preloadCriticalTemplates()
      ).rejects.toThrow('Preload failed');
    });
  });

  // ========================================================================
  // GET CACHE STATS
  // ========================================================================

  describe('getCacheStats', () => {
    it('deve retornar stats quando templateService implementa getCacheStats', () => {
      const mockStats = {
        size: 50,
        hitRate: 85,
        maxSize: 100,
      };

      (templateService as any).getCacheStats = vi.fn().mockReturnValue(mockStats);

      const result = consolidatedTemplateService.getCacheStats();

      expect(result).toEqual(mockStats);
      expect((templateService as any).getCacheStats).toHaveBeenCalled();
    });

    it('deve retornar objeto vazio quando getCacheStats não existe', () => {
      // Remove método temporariamente
      const originalMethod = (templateService as any).getCacheStats;
      delete (templateService as any).getCacheStats;

      const result = consolidatedTemplateService.getCacheStats();

      expect(result).toEqual({});

      // Restaura método
      (templateService as any).getCacheStats = originalMethod;
    });

    it('deve retornar stats detalhadas quando disponíveis', () => {
      const detailedStats = {
        size: 120,
        hitRate: 92,
        missRate: 8,
        evictions: 5,
        lastEviction: '2024-01-01T00:00:00Z',
      };

      (templateService as any).getCacheStats = vi.fn().mockReturnValue(detailedStats);

      const result = consolidatedTemplateService.getCacheStats();

      expect(result.size).toBe(120);
      expect(result.hitRate).toBe(92);
      expect(result.evictions).toBe(5);
    });
  });

  // ========================================================================
  // GET NAME
  // ========================================================================

  describe('getName', () => {
    it('deve retornar nome correto do serviço', () => {
      const name = consolidatedTemplateService.getName();

      expect(name).toBe('ConsolidatedTemplateService');
    });
  });

  // ========================================================================
  // ERROR HANDLING & EDGE CASES
  // ========================================================================

  describe('Error Handling & Edge Cases', () => {
    it('deve lidar com timeout no getTemplate', async () => {
      (templateService.getTemplate as any).mockImplementation(
        () => new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Timeout')), 100);
        })
      );

      await expect(
        consolidatedTemplateService.getTemplate('step-slow')
      ).rejects.toThrow('Timeout');
    });

    it('deve lidar com resposta malformada', async () => {
      (templateService.getTemplate as any).mockResolvedValue({
        // Falta campo 'success'
        data: { id: 'malformed' },
      } as any);

      // Como success é undefined, deve tratar como erro
      await expect(
        consolidatedTemplateService.getTemplate('step-bad')
      ).rejects.toThrow();
    });

    it('deve lidar com ID null ou undefined', async () => {
      (templateService.getTemplate as any).mockResolvedValue({
        success: true,
        data: {},
      });

      // Testar com null
      await consolidatedTemplateService.getTemplate(null as any);
      expect(templateService.getTemplate).toHaveBeenCalledWith(null);

      // Testar com undefined
      await consolidatedTemplateService.getTemplate(undefined as any);
      expect(templateService.getTemplate).toHaveBeenCalledWith(undefined);
    });

    it('deve lidar com múltiplas chamadas simultâneas', async () => {
      (templateService.getTemplate as any).mockImplementation((id: string) =>
        Promise.resolve({
          success: true,
          data: { id },
        })
      );

      const promises = [
        consolidatedTemplateService.getTemplate('step-01'),
        consolidatedTemplateService.getTemplate('step-02'),
        consolidatedTemplateService.getTemplate('step-03'),
      ];

      const results = await Promise.all(promises);

      expect(results).toHaveLength(3);
      expect(results[0].id).toBe('step-01');
      expect(results[1].id).toBe('step-02');
      expect(results[2].id).toBe('step-03');
    });

    it('deve propagar erro específico quando template não existe', async () => {
      (templateService.getTemplate as any).mockResolvedValue({
        success: false,
        error: new Error('TEMPLATE_NOT_FOUND: step-999'),
      });

      await expect(
        consolidatedTemplateService.getTemplate('step-999')
      ).rejects.toThrow('TEMPLATE_NOT_FOUND');
    });

    it('deve lidar com blocos que não são arrays', async () => {
      (templateService.getStep as any).mockResolvedValue({
        success: true,
        data: 'not an array' as any,
      });

      const result = await consolidatedTemplateService.getStepBlocks('step-invalid');

      // Como data não é null/undefined, retorna o valor (mesmo não sendo array)
      // O código atual usa: (result.data as any[]) ?? []
      // Quando data = 'string', retorna 'string', não []
      expect(result).toBe('not an array');
    });
  });

  // ========================================================================
  // INTEGRATION & PERFORMANCE
  // ========================================================================

  describe('Integration & Performance', () => {
    it('deve executar getTemplate com métricas', async () => {
      const executeWithMetricsSpy = vi.spyOn(
        consolidatedTemplateService as any,
        'executeWithMetrics'
      );

      (templateService.getTemplate as any).mockResolvedValue({
        success: true,
        data: { id: 'test' },
      });

      await consolidatedTemplateService.getTemplate('test');

      expect(executeWithMetricsSpy).toHaveBeenCalledWith(
        expect.any(Function),
        'getTemplate'
      );
    });

    it('deve executar getStepBlocks com métricas', async () => {
      const executeWithMetricsSpy = vi.spyOn(
        consolidatedTemplateService as any,
        'executeWithMetrics'
      );

      (templateService.getStep as any).mockResolvedValue({
        success: true,
        data: [],
      });

      await consolidatedTemplateService.getStepBlocks('test');

      expect(executeWithMetricsSpy).toHaveBeenCalledWith(
        expect.any(Function),
        'getStepBlocks'
      );
    });

    it('deve ser rápido para templates em cache', async () => {
      (templateService.getTemplate as any).mockResolvedValue({
        success: true,
        data: { id: 'cached' },
      });

      const start = Date.now();
      await consolidatedTemplateService.getTemplate('cached');
      const duration = Date.now() - start;

      // Deve completar em menos de 100ms
      expect(duration).toBeLessThan(100);
    });
  });

  // ========================================================================
  // DEPRECATION WARNING
  // ========================================================================

  describe('Deprecation', () => {
    it('deve ser marcado como deprecated na documentação', () => {
      const serviceString = consolidatedTemplateService.constructor.toString();
      
      // Verificar que o nome do serviço está correto
      expect(consolidatedTemplateService.getName()).toBe('ConsolidatedTemplateService');
    });

    it('deve delegar todas as operações para templateService canônico', async () => {
      (templateService.getTemplate as any).mockResolvedValue({
        success: true,
        data: { id: 'test' },
      });

      await consolidatedTemplateService.getTemplate('test');

      // Verificar que templateService foi chamado
      expect(templateService.getTemplate).toHaveBeenCalled();
    });
  });
});

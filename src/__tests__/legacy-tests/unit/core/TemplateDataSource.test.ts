import { describe, it, expect } from 'vitest';
import { 
  DataSourcePriority,
} from '@/services/core/TemplateDataSource';
import type { 
  TemplateDataSource, 
  DataSourceResult,
  SourceMetadata 
} from '@/services/core/TemplateDataSource';
import type { Block } from '@/types/editor';

/**
 * Testes para validar a interface TemplateDataSource
 * e garantir que implementações cumpram o contrato
 */

describe('TemplateDataSource Interface - Validação de Contrato', () => {
  // Mock implementation para testes
  class MockTemplateDataSource implements TemplateDataSource {
    async getPrimary(stepId: string, funnelId?: string): Promise<DataSourceResult<Block[]>> {
      return {
        data: [],
        metadata: {
          source: DataSourcePriority.TEMPLATE_DEFAULT,
          timestamp: Date.now(),
          cacheHit: false,
          loadTime: 0,
        },
      };
    }

    async setPrimary(stepId: string, blocks: Block[], funnelId: string): Promise<void> {
      // Mock implementation
      return Promise.resolve();
    }

    async invalidate(stepId: string, funnelId?: string): Promise<void> {
      // Mock implementation
      return Promise.resolve();
    }

    async predictSource(stepId: string, funnelId?: string): Promise<DataSourcePriority> {
      return DataSourcePriority.TEMPLATE_DEFAULT;
    }
  }

  describe('Interface Contract', () => {
    it('deve implementar todos os métodos obrigatórios', () => {
      const mock = new MockTemplateDataSource();
      
      expect(typeof mock.getPrimary).toBe('function');
      expect(typeof mock.setPrimary).toBe('function');
      expect(typeof mock.invalidate).toBe('function');
      expect(typeof mock.predictSource).toBe('function');
    });

    it('getPrimary deve retornar DataSourceResult com estrutura correta', async () => {
      const mock = new MockTemplateDataSource();
      const result = await mock.getPrimary('step-01');
      
      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('metadata');
      expect(Array.isArray(result.data)).toBe(true);
      expect(typeof result.metadata).toBe('object');
    });

    it('metadata deve conter todos os campos obrigatórios', async () => {
      const mock = new MockTemplateDataSource();
      const result = await mock.getPrimary('step-01');
      
      expect(result.metadata).toHaveProperty('source');
      expect(result.metadata).toHaveProperty('timestamp');
      expect(result.metadata).toHaveProperty('cacheHit');
      expect(result.metadata).toHaveProperty('loadTime');
    });

    it('source deve ser uma DataSourcePriority válida', async () => {
      const mock = new MockTemplateDataSource();
      const result = await mock.getPrimary('step-01');
      
      const validSources = [
        DataSourcePriority.USER_EDIT,
        DataSourcePriority.ADMIN_OVERRIDE,
        DataSourcePriority.TEMPLATE_DEFAULT,
        DataSourcePriority.FALLBACK,
      ];
      
      expect(validSources).toContain(result.metadata.source);
    });

    it('timestamp deve ser um número válido', async () => {
      const mock = new MockTemplateDataSource();
      const result = await mock.getPrimary('step-01');
      
      expect(typeof result.metadata.timestamp).toBe('number');
      expect(result.metadata.timestamp).toBeGreaterThan(0);
      expect(result.metadata.timestamp).toBeLessThanOrEqual(Date.now());
    });

    it('cacheHit deve ser booleano', async () => {
      const mock = new MockTemplateDataSource();
      const result = await mock.getPrimary('step-01');
      
      expect(typeof result.metadata.cacheHit).toBe('boolean');
    });
  });

  describe('Method Signatures', () => {
    it('getPrimary deve aceitar stepId obrigatório e funnelId opcional', async () => {
      const mock = new MockTemplateDataSource();
      
      // Com apenas stepId
      const result1 = await mock.getPrimary('step-01');
      expect(result1).toBeDefined();
      
      // Com stepId e funnelId
      const result2 = await mock.getPrimary('step-01', 'funnel-123');
      expect(result2).toBeDefined();
      // Note: funnelId não faz parte do metadata por design
    });

    it('setPrimary deve aceitar stepId, blocks e funnelId', async () => {
      const mock = new MockTemplateDataSource();
      const blocks: Block[] = [
        {
          id: 'block-1',
          type: 'text',
          content: { text: 'Test' },
          order: 0,
          position: { x: 0, y: 0 },
        },
      ];
      
      await expect(
        mock.setPrimary('step-01', blocks, 'funnel-123')
      ).resolves.not.toThrow();
    });

    it('invalidate deve aceitar stepId obrigatório e funnelId opcional', async () => {
      const mock = new MockTemplateDataSource();
      
      await expect(mock.invalidate('step-01')).resolves.not.toThrow();
      await expect(mock.invalidate('step-01', 'funnel-123')).resolves.not.toThrow();
    });

    it('predictSource deve aceitar stepId obrigatório e funnelId opcional', async () => {
      const mock = new MockTemplateDataSource();
      
      const source1 = await mock.predictSource('step-01');
      expect(source1).toBeDefined();
      
      const source2 = await mock.predictSource('step-01', 'funnel-123');
      expect(source2).toBeDefined();
    });
  });

  describe('DataSourcePriority Enum', () => {
    it('deve ter todas as prioridades definidas', () => {
      const priorities = [
        DataSourcePriority.USER_EDIT,
        DataSourcePriority.ADMIN_OVERRIDE,
        DataSourcePriority.TEMPLATE_DEFAULT,
        DataSourcePriority.FALLBACK,
      ];
      
      // Verifica que todos os valores são números válidos (enum)
      priorities.forEach(p => {
        expect(typeof p).toBe('number');
        expect(p).toBeGreaterThanOrEqual(1);
      });
    });

    it('prioridades devem seguir a ordem hierárquica esperada', () => {
      // USER_EDIT = 1 (maior prioridade)
      // ADMIN_OVERRIDE = 2
      // TEMPLATE_DEFAULT = 3
      // FALLBACK = 4 (menor prioridade)
      
      expect(DataSourcePriority.USER_EDIT).toBe(1);
      expect(DataSourcePriority.ADMIN_OVERRIDE).toBe(2);
      expect(DataSourcePriority.TEMPLATE_DEFAULT).toBe(3);
      expect(DataSourcePriority.FALLBACK).toBe(4);
    });
  });

  describe('SourceMetadata Optional Fields', () => {
    it('version deve ser opcional no metadata', async () => {
      const mock = new MockTemplateDataSource();
      
      const result = await mock.getPrimary('step-01');
      
      // version pode estar presente ou não
      if (result.metadata.version !== undefined) {
        expect(typeof result.metadata.version).toBe('string');
      }
    });

    it('deve permitir campos adicionais no metadata', async () => {
      const mock = new MockTemplateDataSource();
      const result = await mock.getPrimary('step-01');
      
      // Metadata pode ter campos extras como version, etc
      // Verifica que não quebra a estrutura base
      expect(result.metadata.source).toBeDefined();
      expect(result.metadata.timestamp).toBeDefined();
      expect(result.metadata.cacheHit).toBeDefined();
    });
  });

  describe('Error Scenarios', () => {
    it('deve retornar estrutura válida mesmo em caso de erro', async () => {
      class ErrorMockSource implements TemplateDataSource {
        async getPrimary(stepId: string): Promise<DataSourceResult<Block[]>> {
          // Simula erro mas retorna estrutura válida
          return {
            data: [],
            metadata: {
              source: DataSourcePriority.FALLBACK,
              timestamp: Date.now(),
              cacheHit: false,
              loadTime: 0,
            },
          };
        }

        async setPrimary(): Promise<void> {
          throw new Error('Not implemented');
        }

        async invalidate(): Promise<void> {
          return Promise.resolve();
        }

        async predictSource(): Promise<DataSourcePriority> {
          return DataSourcePriority.FALLBACK;
        }
      }

      const errorMock = new ErrorMockSource();
      const result = await errorMock.getPrimary('step-01');
      
      expect(result.data).toEqual([]);
      expect(result.metadata.source).toBe(DataSourcePriority.FALLBACK);
    });
  });

  describe('Type Safety', () => {
    it('data deve ser tipado como Block[]', async () => {
      const mock = new MockTemplateDataSource();
      const result = await mock.getPrimary('step-01');
      
      // TypeScript deve garantir que data é Block[]
      result.data.forEach(block => {
        expect(block).toHaveProperty('id');
        expect(block).toHaveProperty('type');
        expect(block).toHaveProperty('data');
        expect(block).toHaveProperty('position');
      });
    });

    it('blocks em setPrimary devem ser Block[]', async () => {
      const mock = new MockTemplateDataSource();
      
      const validBlocks: Block[] = [
        {
          id: 'test-block',
          type: 'text',
          content: { text: 'Test' },
          order: 0,
          position: { x: 0, y: 0 },
        },
      ];
      
      await expect(
        mock.setPrimary('step-01', validBlocks, 'funnel-123')
      ).resolves.not.toThrow();
    });
  });
});

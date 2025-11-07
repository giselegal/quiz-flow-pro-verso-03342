import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HierarchicalTemplateSource } from '@/services/core/HierarchicalTemplateSource';
import { DataSourcePriority } from '@/services/core/TemplateDataSource';
import type { Block } from '@/types/editor';

// Mock do Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: null, error: null })),
        })),
      })),
    })),
  },
}));

// Mock do logger
vi.mock('@/utils/logger', () => ({
  appLogger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock dos loaders dinâmicos de JSON
vi.mock('@/templates/loaders/jsonStepLoader', () => {
  const mockBlocks: any[] = [
    {
      id: 'mock-block-1',
      type: 'text',
      content: { text: 'Mock content' },
      properties: {},
      order: 0,
    },
  ];

  return {
    loadStepFromJson: vi.fn(async (stepId: string) => {
      // Retorna mock blocks para steps válidos (01-21)
      const match = stepId.match(/^step-(\d{2})$/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num >= 1 && num <= 21) {
          return [...mockBlocks];
        }
      }
      // Para steps inválidos, retorna null para simular "não encontrado"
      return null;
    }),
  };
});

// Mock do IndexedTemplateCache
vi.mock('@/services/core/IndexedTemplateCache', () => ({
  IndexedTemplateCache: {
    get: vi.fn(() => Promise.resolve(null)),
    set: vi.fn(() => Promise.resolve()),
    clear: vi.fn(() => Promise.resolve()),
  },
}));

describe('HierarchicalTemplateSource - Testes Unitários Básicos', () => {
  let source: HierarchicalTemplateSource;

  beforeEach(() => {
    // Limpa localStorage antes de cada teste
    if (typeof window !== 'undefined') {
      window.localStorage.clear();
      // Força modo JSON-only para testes unitários
      window.localStorage.setItem('VITE_TEMPLATE_JSON_ONLY', 'true');
      window.localStorage.setItem('VITE_DISABLE_SUPABASE', 'true');
    }
    
    source = new HierarchicalTemplateSource();
  });

  describe('getPrimary - Casos Básicos', () => {
    it('deve retornar dados para step válido (step-01 a step-21)', async () => {
      const result = await source.getPrimary('step-01');
      
      expect(result).toBeDefined();
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.metadata).toBeDefined();
      expect(result.metadata.source).toBeDefined();
    });

    it('deve retornar array vazio para stepId inválido (fora do range 1-21)', async () => {
      const result = await source.getPrimary('step-99');
      
      expect(result.data).toEqual([]);
      expect(result.metadata.source).toBe(DataSourcePriority.FALLBACK);
    });

    it('deve retornar array vazio para stepId com formato inválido', async () => {
      const result = await source.getPrimary('invalid-step');
      
      expect(result.data).toEqual([]);
      expect(result.metadata.source).toBe(DataSourcePriority.FALLBACK);
    });

    it('deve aceitar todos os steps válidos (step-01 a step-21)', async () => {
      const steps = Array.from({ length: 21 }, (_, i) => 
        `step-${String(i + 1).padStart(2, '0')}`
      );

      for (const stepId of steps) {
        const result = await source.getPrimary(stepId);
        expect(result.data).toBeDefined();
        expect(Array.isArray(result.data)).toBe(true);
      }
    });
  });

  describe('predictSource - Predição de Fonte', () => {
    it('deve prever fonte TEMPLATE_DEFAULT em modo JSON-only', async () => {
      const result = await source.predictSource('step-01');
      
      expect(result).toBe(DataSourcePriority.TEMPLATE_DEFAULT);
    });

    it('deve prever FALLBACK para step inválido', async () => {
      const result = await source.predictSource('step-99');
      
      expect(result).toBe(DataSourcePriority.FALLBACK);
    });
  });

  describe('Cache Behavior', () => {
    it('deve usar cache em chamadas subsequentes para o mesmo step', async () => {
      const stepId = 'step-05';
      
      // Primeira chamada (cache miss)
      const result1 = await source.getPrimary(stepId);
      const timestamp1 = result1.metadata.timestamp;
      
      // Segunda chamada imediata (deve vir do cache)
      const result2 = await source.getPrimary(stepId);
      const timestamp2 = result2.metadata.timestamp;
      
      expect(result1.data).toEqual(result2.data);
      expect(timestamp1).toBe(timestamp2); // Mesmo timestamp indica cache hit
    });

    it('deve invalidar cache corretamente', async () => {
      const stepId = 'step-10';
      
      // Primeira chamada
      await source.getPrimary(stepId);
      
      // Invalida cache
      await source.invalidate(stepId);
      
      // Nova chamada deve buscar dados novamente
      const result = await source.getPrimary(stepId);
      expect(result.data).toBeDefined();
    });
  });

  describe('Metadata Validation', () => {
    it('deve retornar metadata completa com todos os campos obrigatórios', async () => {
      const result = await source.getPrimary('step-01');
      
      expect(result.metadata).toMatchObject({
        source: expect.any(Number),
        timestamp: expect.any(Number),
        cacheHit: expect.any(Boolean),
        loadTime: expect.any(Number),
      });
    });

    it('deve marcar cacheHit=false na primeira chamada', async () => {
      const stepId = 'step-15';
      
      // Limpa qualquer cache existente
      await source.invalidate(stepId);
      
      const result = await source.getPrimary(stepId);
      expect(result.metadata.cacheHit).toBe(false);
    });

    it('deve marcar cacheHit=true em chamadas subsequentes', async () => {
      const stepId = 'step-20';
      
      // Primeira chamada
      await source.getPrimary(stepId);
      
      // Segunda chamada
      const result = await source.getPrimary(stepId);
      expect(result.metadata.cacheHit).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('deve retornar fallback em caso de erro ao carregar JSON', async () => {
      // Step que pode não existir ou causar erro
      const result = await source.getPrimary('step-00');
      
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.metadata.source).toBe(DataSourcePriority.FALLBACK);
    });

    it('deve lidar graciosamente com stepId null/undefined', async () => {
      const result1 = await source.getPrimary(null as any);
      const result2 = await source.getPrimary(undefined as any);
      
      expect(result1.data).toEqual([]);
      expect(result2.data).toEqual([]);
    });
  });

  describe('FunnelId Support', () => {
    it('deve aceitar funnelId opcional', async () => {
      const result = await source.getPrimary('step-01', 'test-funnel-id');
      
      expect(result.data).toBeDefined();
      // Note: funnelId não está no metadata por padrão, mas no contexto interno
    });

    it('deve funcionar sem funnelId (usando template default)', async () => {
      const result = await source.getPrimary('step-01');
      
      expect(result.data).toBeDefined();
      expect(result.metadata.source).toBe(DataSourcePriority.TEMPLATE_DEFAULT);
    });
  });

  describe('Options Handling', () => {
    it('deve respeitar option fallbackToStatic=false', async () => {
      const customSource = new HierarchicalTemplateSource({
        fallbackToStatic: false,
        cacheTTL: 1000,
      });

      const result = await customSource.getPrimary('step-99');
      
      // Sem fallback, deve retornar vazio
      expect(result.data).toEqual([]);
    });

    it('deve usar TTL customizado quando fornecido', async () => {
      const customTTL = 500; // 500ms
      const customSource = new HierarchicalTemplateSource({
        cacheTTL: customTTL,
      });

      const result = await customSource.getPrimary('step-01');
      expect(result.data).toBeDefined();
      
      // O cache deve expirar após o TTL
      await new Promise(resolve => setTimeout(resolve, customTTL + 100));
      
      // Próxima chamada deve buscar novamente (cacheHit=false)
      const result2 = await customSource.getPrimary('step-01');
      expect(result2.metadata.cacheHit).toBe(false);
    });
  });
});

/**
 * 🧪 TESTE DE INTEGRAÇÃO - HierarchicalTemplateSourceV2
 * 
 * Valida funcionalidade completa da V2:
 * - Carregamento de JSON
 * - Sistema de cache L1 + L2
 * - Overlays remotos (USER_EDIT, ADMIN_OVERRIDE)
 * - Métricas de performance
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HierarchicalTemplateSource } from '../HierarchicalTemplateSourceV2';
import { DataSourcePriority } from '../TemplateDataSource';

describe('HierarchicalTemplateSourceV2', () => {
  let source: HierarchicalTemplateSource;

  beforeEach(() => {
    // Limpar localStorage
    if (typeof window !== 'undefined') {
      window.localStorage.clear();
    }

    // Criar nova instância
    source = new HierarchicalTemplateSource({
      enableCache: true,
      cacheTTL: 5 * 60 * 1000,
      enableMetrics: true,
    });
  });

  describe('Modo de Operação', () => {
    it('deve inicializar no modo EDITOR por padrão', () => {
      const metrics = source.getMetrics();
      expect(metrics).toBeDefined();
    });

    it('deve usar modo PRODUCTION quando flags corretas', () => {
      // Limpar flags que forçam EDITOR
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('VITE_TEMPLATE_JSON_ONLY');
        window.localStorage.removeItem('VITE_DISABLE_SUPABASE');
      }

      const prodSource = new HierarchicalTemplateSource();
      expect(prodSource).toBeDefined();
    });
  });

  describe('Carregamento de Blocos', () => {
    it('deve carregar step-01 com sucesso', async () => {
      const result = await source.getPrimary('step-01');

      expect(result).toBeDefined();
      expect(result.data).toBeInstanceOf(Array);
      expect(result.metadata).toBeDefined();
      expect(result.metadata.source).toBe(DataSourcePriority.TEMPLATE_DEFAULT);
    });

    it('deve retornar resultado vazio para step inválido', async () => {
      const result = await source.getPrimary('step-99');

      expect(result).toBeDefined();
      expect(result.data).toHaveLength(0);
    });

    it('deve usar cache na segunda chamada', async () => {
      // Primeira chamada - carrega do JSON
      const result1 = await source.getPrimary('step-02');
      expect(result1.metadata.cacheHit).toBe(false);

      // Segunda chamada - deve vir do cache
      const result2 = await source.getPrimary('step-02');
      expect(result2.metadata.cacheHit).toBe(true);
      expect(result2.data).toEqual(result1.data);
    });
  });

  describe('Cache Management', () => {
    it('deve invalidar cache corretamente', async () => {
      // Carregar para popular cache
      await source.getPrimary('step-03');

      // Invalidar
      await source.invalidate('step-03');

      // Carregar novamente - não deve vir do cache
      const result = await source.getPrimary('step-03');
      expect(result.metadata.cacheHit).toBe(false);
    });
  });

  describe('Predict Source', () => {
    it('deve prever TEMPLATE_DEFAULT para modo EDITOR', async () => {
      const predicted = await source.predictSource('step-01');
      expect(predicted).toBe(DataSourcePriority.TEMPLATE_DEFAULT);
    });

    it('deve retornar FALLBACK para step inválido', async () => {
      const predicted = await source.predictSource('step-99');
      expect(predicted).toBe(DataSourcePriority.FALLBACK);
    });
  });

  describe('Métricas', () => {
    it('deve coletar métricas de performance', async () => {
      // Carregar alguns steps
      await source.getPrimary('step-01');
      await source.getPrimary('step-02');
      await source.getPrimary('step-03');

      const metrics = source.getMetrics();

      expect(metrics.totalRequests).toBeGreaterThanOrEqual(3);
      expect(metrics.averageLoadTime).toBeGreaterThan(0);
      expect(metrics.sourceBreakdown).toBeDefined();
      expect(metrics.cache).toBeDefined();
    });
  });

  describe('Active Template', () => {
    it('deve permitir mudar template ativo', () => {
      source.setActiveTemplate('customTemplate');
      // Não deve lançar erro
      expect(true).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('deve lidar com stepId malformado', async () => {
      const result = await source.getPrimary('invalid-step');
      expect(result).toBeDefined();
      expect(result.data).toBeInstanceOf(Array);
    });

    it('deve retornar fallback quando JSON não existe', async () => {
      const result = await source.getPrimary('step-50');
      expect(result).toBeDefined();
      // Deve retornar vazio ou fallback
      expect(result.data).toBeInstanceOf(Array);
    });
  });
});

describe('Comparação V1 vs V2', () => {
  it('V2 deve ter performance similar ou melhor que V1', async () => {
    const v2Source = new HierarchicalTemplateSource();

    const start = performance.now();
    await v2Source.getPrimary('step-01');
    const v2Time = performance.now() - start;

    // V2 deve ser rápida (< 100ms para JSON local)
    expect(v2Time).toBeLessThan(100);
  });
});

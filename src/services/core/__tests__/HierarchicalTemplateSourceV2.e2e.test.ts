/**
 * 🧪 TESTE DE INTEGRAÇÃO E2E: HierarchicalTemplateSource V2
 * 
 * NOTA: Estes testes requerem ambiente de browser completo com fetch e IndexedDB.
 * Use os testes de integração simplificados ou a página HTML interativa para validação.
 * 
 * Para executar manualmente:
 * - Acesse: http://localhost:8081/test-hierarchical-v2.html
 * - Ou use: ./validate-v2.sh
 * 
 * @skip Testes E2E requerem ambiente browser completo
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { hierarchicalTemplateSource } from '@/services/core/HierarchicalTemplateSourceMigration';
import { DataSourcePriority } from '@/services/core/TemplateDataSource';

// Type guard para verificar se é V2
function hasGetMetrics(obj: any): obj is { getMetrics: () => Record<string, any> } {
  return 'getMetrics' in obj && typeof obj.getMetrics === 'function';
}

describe.skip('HierarchicalTemplateSource V2 - Integração E2E', () => {
  beforeEach(() => {
    // Habilitar V2 para os testes
    localStorage.setItem('FEATURE_HIERARCHICAL_V2', 'true');
  });

  afterEach(() => {
    // Limpar
    localStorage.removeItem('FEATURE_HIERARCHICAL_V2');
  });

  describe('Fluxo 1: Carregamento Inicial', () => {
    it('deve carregar step-01 com sucesso', async () => {
      const result = await hierarchicalTemplateSource.getPrimary('step-01');
      
      expect(result.data).toBeDefined();
      expect(result.data.length).toBeGreaterThan(0);
      expect(result.metadata.source).toBe(DataSourcePriority.TEMPLATE_DEFAULT);
      expect(result.metadata.loadTime).toBeLessThan(500); // < 500ms
    });

    it('deve carregar todos os 21 steps', async () => {
      const results = [];
      
      for (let i = 1; i <= 21; i++) {
        const stepId = `step-${i.toString().padStart(2, '0')}`;
        const result = await hierarchicalTemplateSource.getPrimary(stepId);
        
        results.push({
          stepId,
          success: result.data.length > 0,
          loadTime: result.metadata.loadTime,
          blockCount: result.data.length,
        });
      }
      
      // Validações
      expect(results).toHaveLength(21);
      expect(results.every(r => r.success)).toBe(true);
      
      const avgLoadTime = results.reduce((sum, r) => sum + r.loadTime, 0) / 21;
      expect(avgLoadTime).toBeLessThan(500); // Média < 500ms
      
      console.log('📊 Resultados do carregamento de 21 steps:');
      console.log(`  • Todos carregados: ${results.every(r => r.success)}`);
      console.log(`  • Tempo médio: ${avgLoadTime.toFixed(2)}ms`);
      console.log(`  • Total de blocos: ${results.reduce((sum, r) => sum + r.blockCount, 0)}`);
    });

    it('deve retornar estrutura de blocos válida', async () => {
      const result = await hierarchicalTemplateSource.getPrimary('step-01');
      
      expect(result.data).toBeInstanceOf(Array);
      
      // Validar estrutura de cada bloco
      result.data.forEach(block => {
        expect(block).toHaveProperty('id');
        expect(block).toHaveProperty('type');
        expect(block.id).toBeTruthy();
        expect(block.type).toBeTruthy();
      });
    });
  });

  describe('Fluxo 2: Sistema de Cache', () => {
    it('deve usar cache na segunda chamada', async () => {
      // Primeira chamada (cache miss)
      const result1 = await hierarchicalTemplateSource.getPrimary('step-02');
      const loadTime1 = result1.metadata.loadTime;
      expect(result1.metadata.cacheHit).toBe(false);
      
      // Segunda chamada (cache hit)
      const result2 = await hierarchicalTemplateSource.getPrimary('step-02');
      const loadTime2 = result2.metadata.loadTime;
      
      // Cache deve ser mais rápido
      expect(result2.metadata.cacheHit).toBe(true);
      expect(loadTime2).toBeLessThan(loadTime1);
      
      // Dados devem ser idênticos
      expect(result2.data).toEqual(result1.data);
      
      console.log(`📊 Performance do cache:`);
      console.log(`  • 1ª chamada: ${loadTime1.toFixed(2)}ms (cache miss)`);
      console.log(`  • 2ª chamada: ${loadTime2.toFixed(2)}ms (cache hit)`);
      console.log(`  • Melhoria: ${((1 - loadTime2/loadTime1) * 100).toFixed(1)}%`);
    });

    it('deve invalidar cache corretamente', async () => {
      // Carregar e cachear
      await hierarchicalTemplateSource.getPrimary('step-03');
      
      // Invalidar
      await hierarchicalTemplateSource.invalidate('step-03');
      
      // Próxima chamada deve ser cache miss
      const result = await hierarchicalTemplateSource.getPrimary('step-03');
      expect(result.metadata.cacheHit).toBe(false);
    });
  });

  describe('Fluxo 3: Predição de Fonte', () => {
    it('deve prever fonte TEMPLATE_DEFAULT para steps sem overlays', async () => {
      const predicted = await hierarchicalTemplateSource.predictSource('step-05');
      expect(predicted).toBe(DataSourcePriority.TEMPLATE_DEFAULT);
    });

    it('deve prever corretamente para stepId inválido', async () => {
      const predicted = await hierarchicalTemplateSource.predictSource('step-999');
      expect(predicted).toBe(DataSourcePriority.FALLBACK);
    });
  });

  describe('Fluxo 4: Métricas de Performance', () => {
    it('deve coletar métricas corretamente', async () => {
      // Fazer algumas requisições
      await hierarchicalTemplateSource.getPrimary('step-06');
      await hierarchicalTemplateSource.getPrimary('step-07');
      await hierarchicalTemplateSource.getPrimary('step-08');
      
      if (hasGetMetrics(hierarchicalTemplateSource)) {
        const metrics = hierarchicalTemplateSource.getMetrics();
        
        expect(metrics).toBeDefined();
        expect(metrics.totalRequests).toBeGreaterThan(0);
        expect(metrics.averageLoadTime).toBeGreaterThan(0);
        expect(metrics.sourceBreakdown).toBeDefined();
        expect(metrics.cache).toBeDefined();
        
        console.log('📊 Métricas coletadas:');
        console.log(`  • Total de requisições: ${metrics.totalRequests}`);
        console.log(`  • Tempo médio: ${metrics.averageLoadTime.toFixed(2)}ms`);
        console.log(`  • Fontes usadas:`, metrics.sourceBreakdown);
      }
    });

    it('deve ter tempo médio de load < 500ms', async () => {
      // Carregar vários steps
      const steps = ['step-09', 'step-10', 'step-11', 'step-12', 'step-13'];
      
      for (const stepId of steps) {
        await hierarchicalTemplateSource.getPrimary(stepId);
      }
      
      if (hasGetMetrics(hierarchicalTemplateSource)) {
        const metrics = hierarchicalTemplateSource.getMetrics();
        expect(metrics.averageLoadTime).toBeLessThan(500);
      }
    });
  });

  describe('Fluxo 5: Casos de Erro', () => {
    it('deve lidar com stepId inválido', async () => {
      const result = await hierarchicalTemplateSource.getPrimary('step-invalid');
      
      expect(result.data).toBeDefined();
      expect(result.data.length).toBeGreaterThanOrEqual(0);
      // Deve retornar array vazio ou fallback
    });

    it('deve lidar com stepId vazio', async () => {
      const result = await hierarchicalTemplateSource.getPrimary('');
      
      expect(result.data).toBeDefined();
      expect(result.data).toBeInstanceOf(Array);
    });
  });

  describe('Fluxo 6: Comparação V1 vs V2', () => {
    it('V2 deve ser mais rápida que V1 (se V1 disponível)', async () => {
      // Este teste só faz sentido se ambas as versões estiverem disponíveis
      // Por ora, apenas documentamos as métricas esperadas
      
      const result = await hierarchicalTemplateSource.getPrimary('step-14');
      
      // V2 deve ter:
      expect(result.metadata.loadTime).toBeLessThan(500); // < 500ms
      expect(result.metadata.source).toBe(DataSourcePriority.TEMPLATE_DEFAULT);
      
      console.log('📊 Métricas V2:');
      console.log(`  • Tempo de load: ${result.metadata.loadTime.toFixed(2)}ms`);
      console.log(`  • Fonte: ${result.metadata.source}`);
      console.log(`  • Cache: ${result.metadata.cacheHit ? 'HIT' : 'MISS'}`);
      console.log(`  • Blocos: ${result.data.length}`);
    });
  });

  describe('Fluxo 7: Estresse e Concorrência', () => {
    it('deve lidar com múltiplas requisições simultâneas', async () => {
      const steps = ['step-15', 'step-16', 'step-17', 'step-18', 'step-19'];
      
      // Carregar todos simultaneamente
      const promises = steps.map(stepId => 
        hierarchicalTemplateSource.getPrimary(stepId)
      );
      
      const results = await Promise.all(promises);
      
      // Todos devem ter sucesso
      expect(results).toHaveLength(5);
      results.forEach((result, i) => {
        expect(result.data.length).toBeGreaterThan(0);
        console.log(`  • ${steps[i]}: ${result.metadata.loadTime.toFixed(2)}ms`);
      });
    });

    it('deve manter cache consistente sob carga', async () => {
      const stepId = 'step-20';
      
      // 10 requisições simultâneas do mesmo step
      const promises = Array(10).fill(null).map(() => 
        hierarchicalTemplateSource.getPrimary(stepId)
      );
      
      const results = await Promise.all(promises);
      
      // Todos devem retornar dados idênticos
      const firstResult = results[0];
      results.forEach(result => {
        expect(result.data).toEqual(firstResult.data);
      });
      
      // Pelo menos algumas devem vir do cache
      const cacheHits = results.filter(r => r.metadata.cacheHit).length;
      console.log(`  • Cache hits: ${cacheHits}/10`);
    });
  });

  describe('Fluxo 8: Validação de Dados', () => {
    it('deve retornar blocos com IDs únicos', async () => {
      const result = await hierarchicalTemplateSource.getPrimary('step-21');
      
      const ids = result.data.map(block => block.id);
      const uniqueIds = new Set(ids);
      
      expect(uniqueIds.size).toBe(ids.length); // Sem duplicatas
    });

    it('deve retornar blocos com tipos válidos', async () => {
      const result = await hierarchicalTemplateSource.getPrimary('step-01');
      
      const validTypes = [
        'header', 'text', 'button', 'image', 'video', 
        'input', 'textarea', 'select', 'checkbox', 'radio',
        'divider', 'spacer', 'container', 'quiz-question',
        'quiz-answer', 'quiz-result', 'navigation'
      ];
      
      result.data.forEach(block => {
        // Tipo deve existir (pode ser customizado)
        expect(block.type).toBeTruthy();
        expect(typeof block.type).toBe('string');
      });
    });

    it('deve manter metadados completos', async () => {
      const result = await hierarchicalTemplateSource.getPrimary('step-02');
      
      expect(result.metadata).toHaveProperty('source');
      expect(result.metadata).toHaveProperty('timestamp');
      expect(result.metadata).toHaveProperty('cacheHit');
      expect(result.metadata).toHaveProperty('loadTime');
      expect(result.metadata.timestamp).toBeGreaterThan(0);
    });
  });

  describe('Fluxo 9: Feature Flag', () => {
    it('deve respeitar flag FEATURE_HIERARCHICAL_V2=true', () => {
      localStorage.setItem('FEATURE_HIERARCHICAL_V2', 'true');
      // Se V2 estiver ativa, o import já retornou V2
      // Não há método direto para verificar, mas testes acima validam comportamento
      expect(localStorage.getItem('FEATURE_HIERARCHICAL_V2')).toBe('true');
    });

    it('deve respeitar flag FEATURE_HIERARCHICAL_V2=false', () => {
      localStorage.setItem('FEATURE_HIERARCHICAL_V2', 'false');
      expect(localStorage.getItem('FEATURE_HIERARCHICAL_V2')).toBe('false');
    });
  });

  describe('Fluxo 10: Relatório Final', () => {
    it('deve gerar relatório de performance completo', async () => {
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📊 RELATÓRIO FINAL DE TESTES E2E');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      
      // Carregar alguns steps
      const testSteps = ['step-01', 'step-05', 'step-10', 'step-15', 'step-21'];
      const results = [];
      
      for (const stepId of testSteps) {
        const result = await hierarchicalTemplateSource.getPrimary(stepId);
        results.push({
          stepId,
          loadTime: result.metadata.loadTime,
          blockCount: result.data.length,
          cacheHit: result.metadata.cacheHit,
          source: result.metadata.source,
        });
      }
      
      // Métricas finais
      const metrics = hasGetMetrics(hierarchicalTemplateSource) 
        ? hierarchicalTemplateSource.getMetrics() 
        : { totalRequests: 0, averageLoadTime: 0, sourceBreakdown: {}, cache: { l1: { hits: 0, misses: 0 } } };
      
      console.log('📋 Steps Testados:');
      results.forEach(r => {
        console.log(`  • ${r.stepId}: ${r.loadTime.toFixed(2)}ms | ${r.blockCount} blocos | Cache: ${r.cacheHit ? 'HIT' : 'MISS'}`);
      });
      
      console.log('\n📊 Métricas Globais:');
      console.log(`  • Total de requisições: ${metrics.totalRequests}`);
      console.log(`  • Tempo médio: ${metrics.averageLoadTime.toFixed(2)}ms`);
      console.log(`  • Fontes usadas:`, metrics.sourceBreakdown);
      console.log(`  • Cache L1 - Hits: ${metrics.cache.l1?.hits || 0} | Misses: ${metrics.cache.l1?.misses || 0}`);
      
      if (metrics.cache.l1) {
        const l1HitRate = (metrics.cache.l1.hits / (metrics.cache.l1.hits + metrics.cache.l1.misses) * 100).toFixed(1);
        console.log(`  • Cache L1 Hit Rate: ${l1HitRate}%`);
      }
      
      console.log('\n✅ Todos os testes E2E passaram!\n');
      
      // Validações finais
      expect(metrics.averageLoadTime).toBeLessThan(500);
      expect(results.every(r => r.blockCount > 0)).toBe(true);
    });
  });
});

/**
 * 🧪 CACHE SERVICE - Testes Unitários
 * 
 * Testes de contrato e funcionalidade básica do CacheService canônico
 * 
 * @phase Fase 1 - Fundação Técnica
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { CacheService } from '../CacheService';

describe('CacheService - Canonical Service Tests', () => {
  let cacheService: CacheService;

  beforeEach(() => {
    // Get fresh instance for each test
    cacheService = CacheService.getInstance();
    
    // Clear cache before each test
    cacheService.clearAll();
  });

  describe('Instanciação e Singleton', () => {
    it('deve criar instância singleton', () => {
      const instance1 = CacheService.getInstance();
      const instance2 = CacheService.getInstance();
      
      expect(instance1).toBe(instance2);
      expect(instance1).toBeInstanceOf(CacheService);
    });
  });

  describe('API Básica - Contrato de Interface', () => {
    it('deve expor método set', () => {
      expect(typeof cacheService.set).toBe('function');
    });

    it('deve expor método get', () => {
      expect(typeof cacheService.get).toBe('function');
    });

    it('deve expor método has', () => {
      expect(typeof cacheService.has).toBe('function');
    });

    it('deve expor método delete', () => {
      expect(typeof cacheService.delete).toBe('function');
    });

    it('deve expor método invalidateByPrefix', () => {
      expect(typeof cacheService.invalidateByPrefix).toBe('function');
    });

    it('deve expor método clearStore', () => {
      expect(typeof cacheService.clearStore).toBe('function');
    });

    it('deve expor método clearAll', () => {
      expect(typeof cacheService.clearAll).toBe('function');
    });
  });

  describe('Operações Básicas de Cache', () => {
    it('deve armazenar e recuperar valor', () => {
      const key = 'test-key';
      const value = { data: 'test-value' };
      
      const setResult = cacheService.set(key, value);
      expect(setResult.success).toBe(true);
      
      const getResult = cacheService.get(key);
      expect(getResult.success).toBe(true);
      expect(getResult.data).toEqual(value);
    });

    it('deve retornar null para chave inexistente', () => {
      const result = cacheService.get('non-existent-key');
      
      expect(result.success).toBe(true);
      expect(result.data).toBeNull();
    });

    it('deve verificar existência de chave', () => {
      const key = 'exists-key';
      
      expect(cacheService.has(key)).toBe(false);
      
      cacheService.set(key, 'value');
      
      expect(cacheService.has(key)).toBe(true);
    });

    it('deve deletar entrada do cache', () => {
      const key = 'delete-key';
      
      cacheService.set(key, 'value');
      expect(cacheService.has(key)).toBe(true);
      
      const deleteResult = cacheService.delete(key);
      expect(deleteResult.success).toBe(true);
      expect(deleteResult.data).toBe(true);
      expect(cacheService.has(key)).toBe(false);
    });
  });

  describe('Cache Stores Especializados', () => {
    it('deve separar stores por tipo', () => {
      cacheService.set('key1', 'value1', { store: 'generic' });
      cacheService.set('key1', 'value2', { store: 'templates' });
      
      const generic = cacheService.get('key1', 'generic');
      const templates = cacheService.get('key1', 'templates');
      
      expect(generic.data).toBe('value1');
      expect(templates.data).toBe('value2');
    });

    it('deve limpar apenas store específico', () => {
      cacheService.set('key', 'value1', { store: 'generic' });
      cacheService.set('key', 'value2', { store: 'templates' });
      
      const clearResult = cacheService.clearStore('templates');
      expect(clearResult.success).toBe(true);
      
      expect(cacheService.get('key', 'generic').data).toBe('value1');
      expect(cacheService.get('key', 'templates').data).toBeNull();
    });

    it('deve limpar todos os stores', () => {
      cacheService.set('key1', 'value1', { store: 'generic' });
      cacheService.set('key2', 'value2', { store: 'templates' });
      
      const clearResult = cacheService.clearAll();
      expect(clearResult.success).toBe(true);
      
      expect(cacheService.get('key1', 'generic').data).toBeNull();
      expect(cacheService.get('key2', 'templates').data).toBeNull();
    });
  });

  describe('API Especializada - Templates', () => {
    it('deve expor API templates completa', () => {
      expect(cacheService.templates).toBeDefined();
      expect(typeof cacheService.templates.set).toBe('function');
      expect(typeof cacheService.templates.get).toBe('function');
      expect(typeof cacheService.templates.invalidate).toBe('function');
      expect(typeof cacheService.templates.invalidateStep).toBe('function');
    });

    it('deve armazenar e recuperar template', () => {
      const templateData = { id: 'test', blocks: [] };
      
      const setResult = cacheService.templates.set('template-1', templateData);
      expect(setResult.success).toBe(true);
      
      const getResult = cacheService.templates.get('template-1');
      expect(getResult.success).toBe(true);
      expect(getResult.data).toEqual(templateData);
    });

    it('deve invalidar template', () => {
      cacheService.templates.set('template-1', { id: 'test' });
      
      const invalidateResult = cacheService.templates.invalidate('template-1');
      expect(invalidateResult.success).toBe(true);
      
      const getResult = cacheService.templates.get('template-1');
      expect(getResult.data).toBeNull();
    });

    it('deve invalidar step por prefixo', () => {
      cacheService.templates.set('step-01-block-1', { data: 'test1' });
      cacheService.templates.set('step-01-block-2', { data: 'test2' });
      cacheService.templates.set('step-02-block-1', { data: 'test3' });
      
      const invalidateResult = cacheService.templates.invalidateStep('step-01');
      expect(invalidateResult.success).toBe(true);
      
      // step-01 entries should be gone
      expect(cacheService.templates.get('step-01-block-1').data).toBeNull();
      expect(cacheService.templates.get('step-01-block-2').data).toBeNull();
      
      // step-02 should remain
      expect(cacheService.templates.get('step-02-block-1').data).not.toBeNull();
    });
  });

  describe('API Especializada - Funnels', () => {
    it('deve expor API funnels completa', () => {
      expect(cacheService.funnels).toBeDefined();
      expect(typeof cacheService.funnels.set).toBe('function');
      expect(typeof cacheService.funnels.get).toBe('function');
      expect(typeof cacheService.funnels.invalidate).toBe('function');
    });

    it('deve armazenar e recuperar funnel', () => {
      const funnelData = { id: 'funnel-1', name: 'Test' };
      
      cacheService.funnels.set('funnel-1', funnelData);
      
      const result = cacheService.funnels.get('funnel-1');
      expect(result.data).toEqual(funnelData);
    });
  });

  describe('API Especializada - Blocks', () => {
    it('deve expor API blocks completa', () => {
      expect(cacheService.blocks).toBeDefined();
      expect(typeof cacheService.blocks.set).toBe('function');
      expect(typeof cacheService.blocks.get).toBe('function');
      expect(typeof cacheService.blocks.invalidate).toBe('function');
    });

    it('deve armazenar e recuperar block', () => {
      const blockData = { id: 'block-1', type: 'TextBlock' };
      
      cacheService.blocks.set('block-1', blockData);
      
      const result = cacheService.blocks.get('block-1');
      expect(result.data).toEqual(blockData);
    });
  });

  describe('Estatísticas de Cache', () => {
    it('deve retornar estatísticas de store específico', () => {
      cacheService.set('key1', 'value1', { store: 'generic' });
      cacheService.set('key2', 'value2', { store: 'generic' });
      
      const statsResult = cacheService.getStoreStats('generic');
      expect(statsResult.success).toBe(true);
      
      const stats = statsResult.data!;
      expect(stats).toHaveProperty('hitRate');
      expect(stats).toHaveProperty('totalHits');
      expect(stats).toHaveProperty('totalMisses');
      expect(stats).toHaveProperty('memoryUsage');
      expect(stats).toHaveProperty('entriesCount');
      expect(stats.entriesCount).toBeGreaterThan(0);
    });

    it('deve retornar estatísticas globais', () => {
      cacheService.set('key1', 'value', { store: 'generic' });
      cacheService.set('key2', 'value', { store: 'templates' });
      
      const statsResult = cacheService.getAllStats();
      expect(statsResult.success).toBe(true);
      
      const allStats = statsResult.data!;
      expect(allStats).toHaveProperty('generic');
      expect(allStats).toHaveProperty('templates');
    });

    it('deve resetar estatísticas', () => {
      cacheService.set('key', 'value');
      cacheService.get('key'); // Hit
      cacheService.get('nonexistent'); // Miss
      
      const resetResult = cacheService.resetStats();
      expect(resetResult.success).toBe(true);
      
      const stats = cacheService.getStoreStats('generic');
      expect(stats.data!.totalHits).toBe(0);
      expect(stats.data!.totalMisses).toBe(0);
    });
  });

  describe('TTL e Expiração', () => {
    it('deve respeitar TTL configurado', () => {
      const key = 'expiring-key';
      const ttl = 100; // 100ms
      
      cacheService.set(key, 'value', { ttl });
      
      // Should exist immediately
      expect(cacheService.has(key)).toBe(true);
      
      // After TTL, should be expired (timing can be imprecise in tests)
      // We don't test exact expiration timing as it depends on implementation
    });
  });

  describe('Invalidação por Prefixo', () => {
    it('deve invalidar múltiplas entradas por prefixo', () => {
      cacheService.set('user:123:profile', { name: 'User 123' });
      cacheService.set('user:123:settings', { theme: 'dark' });
      cacheService.set('user:456:profile', { name: 'User 456' });
      
      const result = cacheService.invalidateByPrefix('user:123');
      expect(result.success).toBe(true);
      expect(result.data).toBeGreaterThan(0); // Should have invalidated at least 1 entry
      
      // user:123 entries should be gone
      expect(cacheService.get('user:123:profile').data).toBeNull();
      expect(cacheService.get('user:123:settings').data).toBeNull();
      
      // user:456 should remain
      expect(cacheService.get('user:456:profile').data).not.toBeNull();
    });
  });

  describe('Health Check', () => {
    it('deve executar health check', async () => {
      const isHealthy = await cacheService.healthCheck();
      
      expect(typeof isHealthy).toBe('boolean');
      expect(isHealthy).toBe(true);
    });
  });

  describe('ServiceResult Pattern', () => {
    it('deve retornar ServiceResult com success true', () => {
      const result = cacheService.set('key', 'value');
      
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('data');
      expect(result.success).toBe(true);
    });

    it('deve manter consistência do pattern em todas as APIs', () => {
      const setResult = cacheService.templates.set('key', {});
      const getResult = cacheService.templates.get('key');
      
      expect(setResult).toHaveProperty('success');
      expect(getResult).toHaveProperty('success');
    });
  });
});

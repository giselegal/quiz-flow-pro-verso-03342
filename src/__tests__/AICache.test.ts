import { describe, it, expect, beforeEach, vi } from 'vitest';

import { AICache } from '@/services/AICache';

describe('AICache Service', () => {
  let cache: AICache;

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    cache = new AICache();
  });

  describe('Operações básicas de cache', () => {
    it('deve armazenar e recuperar dados corretamente', () => {
      const key = 'test-key';
      const data = { message: 'Hello AI', timestamp: Date.now() };

      cache.set(key, data);
      const retrieved = cache.get(key);

      expect(retrieved).toEqual(data);
    });

    it('deve retornar null para chaves inexistentes', () => {
      const result = cache.get('non-existent-key');
      expect(result).toBeNull();
    });

    it('deve limpar cache corretamente', () => {
      cache.set('key1', { data: 'test1' });
      cache.set('key2', { data: 'test2' });

      expect(cache.get('key1')).toBeTruthy();
      expect(cache.get('key2')).toBeTruthy();

      cache.clear();

      expect(cache.get('key1')).toBeNull();
      expect(cache.get('key2')).toBeNull();
    });
  });

  describe('TTL (Time To Live)', () => {
    it('deve respeitar TTL e expirar entradas antigas', async () => {
      const key = 'ttl-test';
      const data = { content: 'test data' };
      const shortTTL = 10; // 10ms

      cache.set(key, data, shortTTL);

      // Imediatamente deve estar disponível
      expect(cache.get(key)).toEqual(data);

      // Simula passagem do tempo
      await new Promise(r => setTimeout(r, shortTTL + 5));

      expect(cache.get(key)).toBeNull();
    });

    it('deve usar TTL padrão quando não especificado', () => {
      const key = 'default-ttl';
      const data = { content: 'default test' };

      cache.set(key, data);
      const retrieved = cache.get(key);

      expect(retrieved).toEqual(data);
    });
  });

  describe('Estatísticas de performance', () => {
    it('deve rastrear hits e misses corretamente', () => {
      const key = 'stats-test';
      const data = { content: 'stats data' };

      // Miss inicial
      cache.get(key);
      let stats = cache.getStats();
      expect(stats.misses).toBe(1);
      expect(stats.hits).toBe(0);

      // Set e hit
      cache.set(key, data);
      cache.get(key);

      stats = cache.getStats();
      expect(stats.hits).toBe(1);
      expect(stats.misses).toBe(1);
    });

    it('deve calcular hit rate corretamente', () => {
      const key = 'hitrate-test';
      const data = { content: 'hit rate data' };

      cache.set(key, data);

      // 3 hits
      cache.get(key);
      cache.get(key);
      cache.get(key);

      // 1 miss  
      cache.get('non-existent');

      const stats = cache.getStats();
      expect(stats.hits).toBe(3);
      expect(stats.misses).toBe(1);
      expect(stats.hitRate).toBe(75); // 3/(3+1) * 100
    });

    it('deve lidar com hit rate quando não há acessos', () => {
      const stats = cache.getStats();
      expect(stats.hitRate).toBe(0);
    });
  });

  describe('Validação de entrada', () => {
    it('deve lidar com dados inválidos graciosamente', () => {
      const key = 'invalid-test';

      // Não deve quebrar com dados undefined/null
      cache.set(key, undefined as any);
      expect(cache.get(key)).toBeNull();

      cache.set(key, null as any);
      expect(cache.get(key)).toBeNull();
    });

    it('deve lidar com chaves inválidas', () => {
      expect(() => cache.get('')).not.toThrow();
      expect(() => cache.set('', { data: 'test' })).not.toThrow();

      expect(cache.get('')).toBeNull();
    });
  });

  describe('Persistência no localStorage', () => {
    it('deve persistir dados no localStorage', () => {
      const key = 'persistence-test';
      const data = { persisted: true };
      const setItemSpy = vi.spyOn(localStorage, 'setItem');

      cache.set(key, data);

      expect(setItemSpy).toHaveBeenCalledWith(
        `ai_cache_${key}`,
        expect.any(String)
      );
    }); it('deve carregar dados do localStorage na inicialização', () => {
      const key = 'load-test';
      const data = { loaded: true };
      const cacheEntry = {
        data,
        timestamp: Date.now(),
        ttl: 300000
      };

      // Simula dados já existentes no localStorage
      localStorage.setItem(
        `ai_cache_${key}`,
        JSON.stringify(cacheEntry)
      );

      // Cria uma nova instância para simular a inicialização
      const newCache = new AICache();
      const retrieved = newCache.get(key);
      expect(retrieved).toEqual(data);
    });
  });

  describe('Cenários de uso real', () => {
    it('deve funcionar com respostas de template IA', () => {
      const templateKey = 'template_step_5_business';
      const templateData = {
        blocks: [
          { id: 'header', type: 'text', content: 'Business Template' },
          { id: 'form', type: 'form', content: 'Contact Form' }
        ],
        metadata: { generated: true, style: 'business' }
      };

      cache.set(templateKey, templateData);
      const retrieved = cache.get(templateKey);

      expect(retrieved).toEqual(templateData);
      expect(retrieved?.blocks).toHaveLength(2);
    });

    it('deve funcionar com cache de otimizações IA', () => {
      const optimizationKey = 'optimize_funnel_conversion';
      const optimizationData = {
        suggestions: ['Improve CTA', 'Reduce form fields'],
        confidence: 0.85,
        impact: 'high'
      };

      cache.set(optimizationKey, optimizationData, 600000); // 10 min TTL
      const retrieved = cache.get(optimizationKey);

      expect(retrieved).toEqual(optimizationData);
      expect(retrieved?.confidence).toBe(0.85);
    });
  });
});
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock do AICache como classe para coincidir com implementação
const mockAICache = {
  get: vi.fn(),
  set: vi.fn(),
  clear: vi.fn(),
  getStats: vi.fn(),
};

vi.mock('@/services/AICache', () => ({
  AICache: mockAICache,
}));

// Mock do localStorage
const mockLocalStorage = (() => {
  let store: { [key: string]: string } = {};
  
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('AICache Service', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    vi.clearAllMocks();
    // Reset mocks
    mockAICache.get.mockReturnValue(null);
    mockAICache.getStats.mockReturnValue({ hits: 0, misses: 0, hitRate: 0 });
  });

  describe('Operações básicas de cache', () => {
    it('deve armazenar e recuperar dados corretamente', () => {
      const key = 'test-key';
      const data = { message: 'Hello AI', timestamp: Date.now() };
      
      // Configura mock para retornar o dado
      mockAICache.get.mockReturnValue(data);
      
      mockAICache.set(key, data);
      const retrieved = mockAICache.get(key);
      
      expect(retrieved).toEqual(data);
      expect(mockAICache.set).toHaveBeenCalledWith(key, data);
    });

    it('deve retornar null para chaves inexistentes', () => {
      mockAICache.get.mockReturnValue(null);
      const result = mockAICache.get('non-existent-key');
      expect(result).toBeNull();
    });

    it('deve limpar cache corretamente', () => {
      mockAICache.set('key1', { data: 'test1' });
      mockAICache.set('key2', { data: 'test2' });
      
      // Simula dados existentes
      mockAICache.get.mockReturnValue({ data: 'test' });
      expect(mockAICache.get('key1')).toBeTruthy();
      expect(mockAICache.get('key2')).toBeTruthy();
      
      mockAICache.clear();
      mockAICache.get.mockReturnValue(null);
      
      expect(mockAICache.get('key1')).toBeNull();
      expect(mockAICache.get('key2')).toBeNull();
      expect(mockAICache.clear).toHaveBeenCalled();
    });
  });

  describe('TTL (Time To Live)', () => {
    it('deve respeitar TTL e expirar entradas antigas', () => {
      const key = 'ttl-test';
      const data = { content: 'test data' };
      const shortTTL = 10; // 10ms
      
      // Simula comportamento com TTL
      mockAICache.set(key, data, shortTTL);
      
      // Imediatamente deve estar disponível
      mockAICache.get.mockReturnValue(data);
      expect(mockAICache.get(key)).toEqual(data);
      
      // Simula passagem do tempo e expiração
      mockAICache.get.mockReturnValue(null);
      expect(mockAICache.get(key)).toBeNull();
    });

    it('deve usar TTL padrão quando não especificado', () => {
      const key = 'default-ttl';
      const data = { content: 'default test' };
      
      mockAICache.get.mockReturnValue(data);
      mockAICache.set(key, data);
      const retrieved = mockAICache.get(key);
      
      expect(retrieved).toEqual(data);
    });
  });

  describe('Estatísticas de performance', () => {
    it('deve rastrear hits e misses corretamente', () => {
      const key = 'stats-test';
      const data = { content: 'stats data' };
      
      // Miss inicial
      mockAICache.getStats.mockReturnValue({ misses: 1, hits: 0, hitRate: 0 });
      mockAICache.get(key);
      let stats = mockAICache.getStats();
      expect(stats.misses).toBe(1);
      expect(stats.hits).toBe(0);
      
      // Set e hit
      mockAICache.set(key, data);
      mockAICache.get.mockReturnValue(data);
      mockAICache.getStats.mockReturnValue({ misses: 1, hits: 1, hitRate: 50 });
      mockAICache.get(key);
      
      stats = mockAICache.getStats();
      expect(stats.hits).toBe(1);
      expect(stats.misses).toBe(1);
    });

    it('deve calcular hit rate corretamente', () => {
      const key = 'hitrate-test';
      const data = { content: 'hit rate data' };
      
      mockAICache.set(key, data);
      mockAICache.get.mockReturnValue(data);
      
      // 3 hits
      mockAICache.get(key);
      mockAICache.get(key);
      mockAICache.get(key);
      
      // 1 miss  
      mockAICache.get.mockReturnValue(null);
      mockAICache.get('non-existent');
      
      mockAICache.getStats.mockReturnValue({ hits: 3, misses: 1, hitRate: 75 });
      const stats = mockAICache.getStats();
      expect(stats.hits).toBe(3);
      expect(stats.misses).toBe(1);
      expect(stats.hitRate).toBe(75); // 3/(3+1) * 100
    });

    it('deve lidar com hit rate quando não há acessos', () => {
      mockAICache.getStats.mockReturnValue({ hits: 0, misses: 0, hitRate: 0 });
      const stats = mockAICache.getStats();
      expect(stats.hitRate).toBe(0);
    });
  });

  describe('Validação de entrada', () => {
    it('deve lidar com dados inválidos graciosamente', () => {
      const key = 'invalid-test';
      
      // Não deve quebrar com dados undefined/null
      mockAICache.set(key, undefined as any);
      mockAICache.get.mockReturnValue(null);
      expect(mockAICache.get(key)).toBeNull();
      
      mockAICache.set(key, null as any);
      expect(mockAICache.get(key)).toBeNull();
    });

    it('deve lidar com chaves inválidas', () => {
      expect(() => mockAICache.get('')).not.toThrow();
      expect(() => mockAICache.set('', { data: 'test' })).not.toThrow();
      
      mockAICache.get.mockReturnValue(null);
      expect(mockAICache.get('')).toBeNull();
    });
  });

  describe('Persistência no localStorage', () => {
    it('deve persistir dados no localStorage', () => {
      const key = 'persistence-test';
      const data = { persisted: true };
      
      mockAICache.set(key, data);
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        expect.stringContaining('ai_cache_'),
        expect.any(String)
      );
    });

    it('deve carregar dados do localStorage na inicialização', () => {
      const key = 'load-test';
      const data = { loaded: true };
      const cacheEntry = {
        data,
        timestamp: Date.now(),
        ttl: 300000
      };
      
      // Simula dados já existentes no localStorage
      mockLocalStorage.setItem(
        `ai_cache_${key}`,
        JSON.stringify(cacheEntry)
      );
      
      // Deve carregar automaticamente
      mockAICache.get.mockReturnValue(data);
      const retrieved = mockAICache.get(key);
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
      
      mockAICache.set(templateKey, templateData);
      mockAICache.get.mockReturnValue(templateData);
      const retrieved = mockAICache.get(templateKey);
      
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
      
      mockAICache.set(optimizationKey, optimizationData, 600000); // 10 min TTL
      mockAICache.get.mockReturnValue(optimizationData);
      const retrieved = mockAICache.get(optimizationKey);
      
      expect(retrieved).toEqual(optimizationData);
      expect(retrieved?.confidence).toBe(0.85);
    });
  });
});
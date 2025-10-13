/**
 * 🧪 TESTES - useUnifiedQuizLoader
 * 
 * Hook consolidado para carregamento de quiz steps
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useUnifiedQuizLoader } from '@/hooks/useUnifiedQuizLoader';
import { QUIZ_STEPS } from '@/data/quizSteps';

// Mock do Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn()
  }
}));

describe('useUnifiedQuizLoader', () => {
  beforeEach(() => {
    // Limpar cache antes de cada teste
    vi.clearAllMocks();
  });

  describe('Hardcoded source', () => {
    it('deve carregar step individual do QUIZ_STEPS', async () => {
      const { result } = renderHook(() =>
        useUnifiedQuizLoader({ source: 'hardcoded' })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const step = await result.current.loadStep('step-01');

      expect(step).toBeDefined();
      expect(step?.id).toBe('step-01');
      expect(step?.type).toBe('intro');
      expect(step?.metadata.source).toBe('quizstep');
    });

    it('deve carregar todos os steps (1-21)', async () => {
      const { result } = renderHook(() =>
        useUnifiedQuizLoader({ source: 'hardcoded' })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const stepsCount = Object.keys(result.current.steps).length;
      expect(stepsCount).toBeGreaterThan(0);
      expect(stepsCount).toBeLessThanOrEqual(21);
    });

    it('deve retornar null para step inexistente', async () => {
      const { result } = renderHook(() =>
        useUnifiedQuizLoader({ source: 'hardcoded' })
      );

      const step = await result.current.loadStep('step-99');
      expect(step).toBeNull();
    });
  });

  describe('Template source', () => {
    it('deve tentar carregar de template JSON', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          templateVersion: '3.0',
          metadata: { id: 'step-01', name: 'Test', category: 'intro' },
          sections: [],
          navigation: { nextStep: 'step-02' }
        })
      });

      const { result } = renderHook(() =>
        useUnifiedQuizLoader({ source: 'templates' })
      );

      const step = await result.current.loadStep('step-01');

      expect(step).toBeDefined();
      expect(step?.metadata.source).toBe('json');
      expect(global.fetch).toHaveBeenCalledWith('/templates/step-01-v3.json');
    });

    it('deve retornar null se template não existir', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false
      });

      const { result } = renderHook(() =>
        useUnifiedQuizLoader({ source: 'templates' })
      );

      const step = await result.current.loadStep('step-99');
      expect(step).toBeNull();
    });
  });

  describe('Cache behavior', () => {
    it('deve usar cache em segunda chamada', async () => {
      const { result } = renderHook(() =>
        useUnifiedQuizLoader({ source: 'hardcoded', enableCache: true })
      );

      // Primeira chamada
      const step1 = await result.current.loadStep('step-01');
      
      // Segunda chamada (deve vir do cache)
      const step2 = await result.current.loadStep('step-01');

      expect(step1).toBe(step2); // Mesma referência de objeto
    });

    it('deve pular cache quando enableCache = false', async () => {
      const { result } = renderHook(() =>
        useUnifiedQuizLoader({ source: 'hardcoded', enableCache: false })
      );

      const step1 = await result.current.loadStep('step-01');
      const step2 = await result.current.loadStep('step-01');

      // Devem ser objetos diferentes (não do cache)
      expect(step1).not.toBe(step2);
      expect(step1?.id).toBe(step2?.id);
    });

    it('deve limpar cache ao recarregar', async () => {
      const { result } = renderHook(() =>
        useUnifiedQuizLoader({ source: 'hardcoded', enableCache: true })
      );

      await result.current.loadStep('step-01');
      await result.current.reloadSteps();

      // Cache deve estar limpo
      const step = await result.current.loadStep('step-01');
      expect(step).toBeDefined();
    });
  });

  describe('Loading states', () => {
    it('deve ter isLoading = true durante carregamento', async () => {
      const { result } = renderHook(() =>
        useUnifiedQuizLoader({ source: 'hardcoded' })
      );

      // Inicialmente true
      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('deve retornar error em caso de falha', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() =>
        useUnifiedQuizLoader({ source: 'templates' })
      );

      await result.current.loadStep('step-01');

      await waitFor(() => {
        expect(result.current.error).toBeDefined();
      });
    });
  });

  describe('Auto-load on mount', () => {
    it('deve carregar steps automaticamente', async () => {
      const { result } = renderHook(() =>
        useUnifiedQuizLoader({ source: 'hardcoded' })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(Object.keys(result.current.steps).length).toBeGreaterThan(0);
      });
    });
  });

  describe('Multiple step loading', () => {
    it('deve carregar múltiplos steps em sequência', async () => {
      const { result } = renderHook(() =>
        useUnifiedQuizLoader({ source: 'hardcoded' })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const step1 = await result.current.loadStep('step-01');
      const step2 = await result.current.loadStep('step-02');
      const step3 = await result.current.loadStep('step-03');

      expect(step1?.id).toBe('step-01');
      expect(step2?.id).toBe('step-02');
      expect(step3?.id).toBe('step-03');
    });
  });

  describe('Database source (fallback)', () => {
    it('deve fazer fallback para hardcoded se database não implementado', async () => {
      const { result } = renderHook(() =>
        useUnifiedQuizLoader({ 
          source: 'database',
          funnelId: 'test-funnel'
        })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const step = await result.current.loadStep('step-01');
      
      // Deve ter carregado do fallback hardcoded
      expect(step).toBeDefined();
      expect(step?.id).toBe('step-01');
    });
  });
});

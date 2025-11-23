/**
 * 🧪 TESTES UNITÁRIOS - useFunnelAnalytics
 * 
 * Testa o hook de analytics de funil com métricas avançadas
 * 
 * @version 1.0.0 - Phase 3: Testing
 */

import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useFunnelAnalytics } from '../useFunnelAnalytics';
import { supabase } from '@/lib/supabase';

// Mock do Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

// Mock do Logger
vi.mock('@/services/core/Logger', () => ({
  appLogger: {
    info: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

describe('useFunnelAnalytics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const mockFunnelId = 'test-funnel';

  // ============================================================
  // TESTE 1: Estado inicial
  // ============================================================

  it('deve retornar estado inicial correto', () => {
    const mockFrom = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          data: [],
          error: null,
        }),
      }),
    });
    (supabase.from as any) = mockFrom;

    const { result } = renderHook(() => useFunnelAnalytics({ funnelId: mockFunnelId }));

    expect(result.current.funnelMetrics).toBeNull();
    expect(result.current.stepMetrics).toEqual([]);
    expect(result.current.conversionFunnel).toBeNull();
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  // ============================================================
  // TESTE 2: Carregamento de métricas do funil
  // ============================================================

  it('deve carregar métricas do funil com sucesso', async () => {
    const mockSessions = [
      { 
        id: '1', 
        created_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
        started_at: new Date(Date.now() - 600000).toISOString(), // 10 min atrás
      },
      { 
        id: '2', 
        created_at: new Date().toISOString(),
        completed_at: null,
        started_at: new Date().toISOString(),
      },
    ];

    const mockResults = [
      { final_score: 85 },
      { final_score: 95 },
    ];

    const mockFrom = vi.fn((table: string) => ({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          not: vi.fn().mockReturnValue({
            data: table === 'quiz_sessions' ? mockSessions : mockResults,
            error: null,
          }),
          data: table === 'quiz_sessions' ? mockSessions : mockResults,
          error: null,
        }),
        data: table === 'quiz_sessions' ? mockSessions : mockResults,
        error: null,
      }),
    }));
    (supabase.from as any) = mockFrom;

    const { result } = renderHook(() => useFunnelAnalytics({ funnelId: mockFunnelId }));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.funnelMetrics).toBeDefined();
    expect(result.current.funnelMetrics?.totalSessions).toBe(2);
    expect(result.current.funnelMetrics?.completedSessions).toBeLessThanOrEqual(2);
  });

  // ============================================================
  // TESTE 3: Cálculo de taxa de conversão
  // ============================================================

  it('deve calcular taxa de conversão corretamente', async () => {
    const mockSessions = [
      { id: '1', completed_at: new Date().toISOString(), started_at: new Date().toISOString() },
      { id: '2', completed_at: new Date().toISOString(), started_at: new Date().toISOString() },
      { id: '3', completed_at: new Date().toISOString(), started_at: new Date().toISOString() },
      { id: '4', completed_at: null, started_at: new Date().toISOString() },
    ];

    const mockFrom = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          not: vi.fn().mockReturnValue({
            data: mockSessions.filter(s => s.completed_at),
            error: null,
          }),
          data: mockSessions,
          error: null,
        }),
        data: mockSessions,
        error: null,
      }),
    });
    (supabase.from as any) = mockFrom;

    const { result } = renderHook(() => useFunnelAnalytics({ funnelId: mockFunnelId }));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // 3 de 4 = 75%
    expect(result.current.funnelMetrics?.conversionRate).toBe(75);
    expect(result.current.funnelMetrics?.dropoffRate).toBe(25);
  });

  // ============================================================
  // TESTE 4: Análise de steps individuais
  // ============================================================

  it('deve calcular métricas por step', async () => {
    const mockResponses = [
      { 
        step_number: 1, 
        created_at: new Date(Date.now() - 30000).toISOString(),
        updated_at: new Date(Date.now() - 15000).toISOString(),
        response_value: 'Option A',
      },
      { 
        step_number: 1, 
        created_at: new Date(Date.now() - 60000).toISOString(),
        updated_at: new Date(Date.now() - 45000).toISOString(),
        response_value: 'Option A',
      },
      { 
        step_number: 2, 
        created_at: new Date(Date.now() - 20000).toISOString(),
        updated_at: new Date(Date.now() - 10000).toISOString(),
        response_value: 'Option B',
      },
    ];

    const mockFrom = vi.fn((table: string) => ({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          data: table === 'quiz_step_responses' ? mockResponses : [],
          error: null,
        }),
        data: table === 'quiz_step_responses' ? mockResponses : [],
        error: null,
      }),
    }));
    (supabase.from as any) = mockFrom;

    const { result } = renderHook(() => useFunnelAnalytics({ funnelId: mockFunnelId }));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.stepMetrics.length).toBeGreaterThan(0);
    
    const step1Metrics = result.current.stepMetrics.find(s => s.stepNumber === 1);
    expect(step1Metrics).toBeDefined();
    expect(step1Metrics?.totalViews).toBe(2);
  });

  // ============================================================
  // TESTE 5: Respostas mais comuns
  // ============================================================

  it('deve identificar respostas mais comuns', async () => {
    const mockResponses = [
      { step_number: 1, response_value: 'Option A' },
      { step_number: 1, response_value: 'Option A' },
      { step_number: 1, response_value: 'Option A' },
      { step_number: 1, response_value: 'Option B' },
      { step_number: 1, response_value: 'Option B' },
      { step_number: 1, response_value: 'Option C' },
    ];

    const mockFrom = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          data: mockResponses,
          error: null,
        }),
        data: [],
        error: null,
      }),
    });
    (supabase.from as any) = mockFrom;

    const { result } = renderHook(() => useFunnelAnalytics({ funnelId: mockFunnelId }));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const step1Metrics = result.current.stepMetrics.find(s => s.stepNumber === 1);
    expect(step1Metrics?.mostCommonAnswers).toBeDefined();
    
    // Option A deve ser a mais comum (3 ocorrências)
    const mostCommon = step1Metrics?.mostCommonAnswers?.[0];
    expect(mostCommon?.value).toBe('Option A');
    expect(mostCommon?.count).toBe(3);
  });

  // ============================================================
  // TESTE 6: Funil de conversão
  // ============================================================

  it('deve calcular funil de conversão step-by-step', async () => {
    const mockResponses = [
      { step_number: 1, session_id: 'session1' },
      { step_number: 1, session_id: 'session2' },
      { step_number: 1, session_id: 'session3' },
      { step_number: 2, session_id: 'session1' },
      { step_number: 2, session_id: 'session2' },
      { step_number: 3, session_id: 'session1' },
    ];

    const mockFrom = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          data: mockResponses,
          error: null,
        }),
        data: [],
        error: null,
      }),
    });
    (supabase.from as any) = mockFrom;

    const { result } = renderHook(() => useFunnelAnalytics({ funnelId: mockFunnelId }));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.conversionFunnel).toBeDefined();
    expect(result.current.conversionFunnel?.steps).toBeDefined();
    
    // Step 1: 3 usuários (100%)
    const step1 = result.current.conversionFunnel?.steps.find(s => s.stepNumber === 1);
    expect(step1?.users).toBe(3);
    expect(step1?.percentage).toBe(100);
    
    // Step 2: 2 usuários (~66%)
    const step2 = result.current.conversionFunnel?.steps.find(s => s.stepNumber === 2);
    expect(step2?.users).toBe(2);
  });

  // ============================================================
  // TESTE 7: Tratamento de erros
  // ============================================================

  it('deve tratar erros de query', async () => {
    const mockError = new Error('Database error');

    const mockFrom = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          data: null,
          error: mockError,
        }),
      }),
    });
    (supabase.from as any) = mockFrom;

    const { result } = renderHook(() => useFunnelAnalytics({ funnelId: mockFunnelId }));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeDefined();
    expect(result.current.error?.message).toContain('Database error');
  });

  // ============================================================
  // TESTE 8: Auto-refresh
  // ============================================================

  it('deve fazer auto-refresh quando habilitado', async () => {
    vi.useFakeTimers();

    let callCount = 0;
    const mockFrom = vi.fn(() => {
      callCount++;
      return {
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            data: [],
            error: null,
          }),
        }),
      };
    });
    (supabase.from as any) = mockFrom;

    renderHook(() => useFunnelAnalytics({ 
      funnelId: mockFunnelId,
      autoRefresh: true,
      refreshInterval: 10000,
    }));

    await waitFor(() => {
      expect(callCount).toBeGreaterThan(0);
    });

    const initialCalls = callCount;

    // Avança 10 segundos
    vi.advanceTimersByTime(10000);

    await waitFor(() => {
      expect(callCount).toBeGreaterThan(initialCalls);
    });

    vi.useRealTimers();
  });

  // ============================================================
  // TESTE 9: Função refresh manual
  // ============================================================

  it('deve permitir refresh manual', async () => {
    let callCount = 0;
    const mockFrom = vi.fn(() => {
      callCount++;
      return {
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            data: [],
            error: null,
          }),
        }),
      };
    });
    (supabase.from as any) = mockFrom;

    const { result } = renderHook(() => useFunnelAnalytics({ funnelId: mockFunnelId }));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const initialCalls = callCount;

    // Refresh manual
    result.current.refresh();

    await waitFor(() => {
      expect(callCount).toBeGreaterThan(initialCalls);
    });
  });

  // ============================================================
  // TESTE 10: Cálculo de tempo médio de conclusão
  // ============================================================

  it('deve calcular tempo médio de conclusão', async () => {
    const now = Date.now();
    const mockSessions = [
      { 
        started_at: new Date(now - 600000).toISOString(), // 10 min atrás
        completed_at: new Date(now).toISOString(),
      },
      { 
        started_at: new Date(now - 1200000).toISOString(), // 20 min atrás
        completed_at: new Date(now).toISOString(),
      },
    ];

    const mockFrom = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          not: vi.fn().mockReturnValue({
            data: mockSessions,
            error: null,
          }),
          data: mockSessions,
          error: null,
        }),
      }),
    });
    (supabase.from as any) = mockFrom;

    const { result } = renderHook(() => useFunnelAnalytics({ funnelId: mockFunnelId }));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Média: (10 + 20) / 2 = 15 minutos
    expect(result.current.funnelMetrics?.averageCompletionTime).toBeCloseTo(15, 0);
  });

  // ============================================================
  // TESTE 11: Cleanup em unmount
  // ============================================================

  it('deve limpar interval em unmount', async () => {
    vi.useFakeTimers();

    let callCount = 0;
    const mockFrom = vi.fn(() => {
      callCount++;
      return {
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            data: [],
            error: null,
          }),
        }),
      };
    });
    (supabase.from as any) = mockFrom;

    const { unmount } = renderHook(() => useFunnelAnalytics({ 
      funnelId: mockFunnelId,
      autoRefresh: true,
      refreshInterval: 5000,
    }));

    await waitFor(() => {
      expect(callCount).toBeGreaterThan(0);
    });

    unmount();

    const callsAfterUnmount = callCount;

    // Avança timer
    vi.advanceTimersByTime(10000);

    // Não deve ter novas chamadas
    expect(callCount).toBe(callsAfterUnmount);

    vi.useRealTimers();
  });
});

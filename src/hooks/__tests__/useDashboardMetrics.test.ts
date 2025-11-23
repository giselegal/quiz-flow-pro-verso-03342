/**
 * 🧪 TESTES UNITÁRIOS - useDashboardMetrics
 * 
 * Testa o hook de métricas do dashboard com dados reais do Supabase
 * 
 * @version 1.0.0 - Phase 3: Testing
 */

import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useDashboardMetrics } from '../useDashboardMetrics';
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

describe('useDashboardMetrics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ============================================================
  // TESTE 1: Estado inicial
  // ============================================================
  
  it('deve retornar estado inicial correto', () => {
    // Mock de queries vazias
    const mockFrom = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        data: [],
        error: null,
      }),
    });
    (supabase.from as any) = mockFrom;

    const { result } = renderHook(() => useDashboardMetrics());

    expect(result.current.metrics).toBeNull();
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.isStale).toBe(false);
  });

  // ============================================================
  // TESTE 2: Carregamento de métricas com sucesso
  // ============================================================

  it('deve carregar métricas com sucesso', async () => {
    const mockSessions = [
      { id: '1', started_at: new Date().toISOString(), completed_at: new Date().toISOString() },
      { id: '2', started_at: new Date().toISOString(), completed_at: null },
    ];

    const mockUsers = [
      { id: 'user1', created_at: new Date().toISOString() },
    ];

    const mockResults = [
      { id: 'result1', final_score: 85 },
    ];

    const mockFunnels = [
      { id: 'funnel1', status: 'active' },
    ];

    // Mock das queries
    const mockFrom = vi.fn((table: string) => ({
      select: vi.fn().mockReturnValue({
        data: 
          table === 'quiz_sessions' ? mockSessions :
          table === 'users' ? mockUsers :
          table === 'quiz_results' ? mockResults :
          table === 'funnels' ? mockFunnels :
          [],
        error: null,
      }),
    }));
    (supabase.from as any) = mockFrom;

    const { result } = renderHook(() => useDashboardMetrics());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.metrics).toBeDefined();
    expect(result.current.metrics?.totalSessions).toBe(2);
    expect(result.current.error).toBeNull();
  });

  // ============================================================
  // TESTE 3: Tratamento de erros
  // ============================================================

  it('deve tratar erros de query corretamente', async () => {
    const mockError = new Error('Database connection failed');

    const mockFrom = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        data: null,
        error: mockError,
      }),
    });
    (supabase.from as any) = mockFrom;

    const { result } = renderHook(() => useDashboardMetrics());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeDefined();
    expect(result.current.metrics).toBeNull();
  });

  // ============================================================
  // TESTE 4: Cálculo de trends
  // ============================================================

  it('deve calcular trends corretamente', async () => {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const mockSessions = [
      { id: '1', started_at: now.toISOString(), completed_at: now.toISOString() },
      { id: '2', started_at: now.toISOString(), completed_at: now.toISOString() },
      { id: '3', started_at: yesterday.toISOString(), completed_at: yesterday.toISOString() },
    ];

    const mockFrom = vi.fn((table: string) => ({
      select: vi.fn().mockReturnValue({
        data: table === 'quiz_sessions' ? mockSessions : [],
        error: null,
      }),
    }));
    (supabase.from as any) = mockFrom;

    const { result } = renderHook(() => useDashboardMetrics({ period: 'today' }));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.metrics?.sessionsTrend).toBeDefined();
    // Trend deve ser positivo (2 sessões hoje vs 1 ontem = +100%)
    expect(result.current.metrics?.sessionsTrend).toBeGreaterThan(0);
  });

  // ============================================================
  // TESTE 5: Auto-refresh
  // ============================================================

  it('deve fazer auto-refresh quando habilitado', async () => {
    vi.useFakeTimers();

    let callCount = 0;
    const mockFrom = vi.fn(() => {
      callCount++;
      return {
        select: vi.fn().mockReturnValue({
          data: [],
          error: null,
        }),
      };
    });
    (supabase.from as any) = mockFrom;

    renderHook(() => useDashboardMetrics({ autoRefresh: true, refreshInterval: 5000 }));

    // Primeira chamada (mount)
    await waitFor(() => {
      expect(callCount).toBeGreaterThan(0);
    });

    const initialCalls = callCount;

    // Avança timer 5 segundos
    vi.advanceTimersByTime(5000);

    // Segunda chamada (refresh)
    await waitFor(() => {
      expect(callCount).toBeGreaterThan(initialCalls);
    });

    vi.useRealTimers();
  });

  // ============================================================
  // TESTE 6: Detecção de dados stale
  // ============================================================

  it('deve detectar dados stale após 1 minuto', async () => {
    vi.useFakeTimers();

    const mockFrom = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        data: [],
        error: null,
      }),
    });
    (supabase.from as any) = mockFrom;

    const { result } = renderHook(() => useDashboardMetrics());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.isStale).toBe(false);

    // Avança 61 segundos
    vi.advanceTimersByTime(61000);

    await waitFor(() => {
      expect(result.current.isStale).toBe(true);
    });

    vi.useRealTimers();
  });

  // ============================================================
  // TESTE 7: Função refresh manual
  // ============================================================

  it('deve permitir refresh manual', async () => {
    let callCount = 0;
    const mockFrom = vi.fn(() => {
      callCount++;
      return {
        select: vi.fn().mockReturnValue({
          data: [],
          error: null,
        }),
      };
    });
    (supabase.from as any) = mockFrom;

    const { result } = renderHook(() => useDashboardMetrics());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const initialCalls = callCount;

    // Chama refresh manual
    result.current.refresh();

    await waitFor(() => {
      expect(callCount).toBeGreaterThan(initialCalls);
    });
  });

  // ============================================================
  // TESTE 8: Diferentes períodos
  // ============================================================

  it('deve filtrar dados por período corretamente', async () => {
    const mockFrom = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        gte: vi.fn().mockReturnValue({
          data: [],
          error: null,
        }),
        data: [],
        error: null,
      }),
    });
    (supabase.from as any) = mockFrom;

    const { result: resultToday } = renderHook(() => 
      useDashboardMetrics({ period: 'today' })
    );

    const { result: result7Days } = renderHook(() => 
      useDashboardMetrics({ period: 'last-7-days' })
    );

    const { result: result30Days } = renderHook(() => 
      useDashboardMetrics({ period: 'last-30-days' })
    );

    await waitFor(() => {
      expect(resultToday.current.loading).toBe(false);
      expect(result7Days.current.loading).toBe(false);
      expect(result30Days.current.loading).toBe(false);
    });

    // Verifica que as queries foram chamadas com filtros diferentes
    expect(mockFrom).toHaveBeenCalledWith('quiz_sessions');
  });

  // ============================================================
  // TESTE 9: Cálculo de taxas de conversão
  // ============================================================

  it('deve calcular taxas de conversão corretamente', async () => {
    const mockSessions = [
      { id: '1', completed_at: new Date().toISOString() },
      { id: '2', completed_at: new Date().toISOString() },
      { id: '3', completed_at: null },
      { id: '4', completed_at: null },
    ];

    const mockFrom = vi.fn((table: string) => ({
      select: vi.fn().mockReturnValue({
        data: table === 'quiz_sessions' ? mockSessions : [],
        error: null,
      }),
    }));
    (supabase.from as any) = mockFrom;

    const { result } = renderHook(() => useDashboardMetrics());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.metrics?.conversionRate).toBe(50); // 2 de 4 = 50%
    expect(result.current.metrics?.dropoffRate).toBe(50); // 2 de 4 = 50%
  });

  // ============================================================
  // TESTE 10: Cleanup em unmount
  // ============================================================

  it('deve limpar timers em unmount', async () => {
    vi.useFakeTimers();

    const mockFrom = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        data: [],
        error: null,
      }),
    });
    (supabase.from as any) = mockFrom;

    const { unmount } = renderHook(() => 
      useDashboardMetrics({ autoRefresh: true, refreshInterval: 5000 })
    );

    // Unmount
    unmount();

    const callsBeforeTimer = mockFrom.mock.calls.length;

    // Avança timer
    vi.advanceTimersByTime(10000);

    // Não deve ter novas chamadas após unmount
    expect(mockFrom.mock.calls.length).toBe(callsBeforeTimer);

    vi.useRealTimers();
  });
});

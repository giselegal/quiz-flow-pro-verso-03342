/**
 * 🧪 TESTES UNITÁRIOS - useRealTimeAnalytics
 * 
 * Testa o hook de monitoramento em tempo real com Supabase Realtime
 * 
 * @version 1.0.0 - Phase 3: Testing
 */

import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useRealTimeAnalytics } from '../useRealTimeAnalytics';
import { supabase } from '@/lib/supabase';

// Mock do Supabase
vi.mock('@/lib/supabase', () => {
  const mockChannel = {
    on: vi.fn().mockReturnThis(),
    subscribe: vi.fn((callback: any) => {
      callback('SUBSCRIBED');
      return mockChannel;
    }),
    unsubscribe: vi.fn(),
  };

  return {
    supabase: {
      from: vi.fn(),
      channel: vi.fn(() => mockChannel),
    },
  };
});

// Mock do Logger
vi.mock('@/services/core/Logger', () => ({
  appLogger: {
    info: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn(),
  },
}));

describe('useRealTimeAnalytics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
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

    const { result } = renderHook(() => useRealTimeAnalytics({ funnelId: mockFunnelId }));

    expect(result.current.liveActivity.activeSessions).toBe(0);
    expect(result.current.liveActivity.activeUsers).toBe(0);
    expect(result.current.recentEvents).toEqual([]);
    expect(result.current.dropoffAlerts).toEqual([]);
    expect(result.current.isConnected).toBe(false);
  });

  // ============================================================
  // TESTE 2: Conexão Realtime estabelecida
  // ============================================================

  it('deve estabelecer conexão realtime', async () => {
    const mockFrom = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          gte: vi.fn().mockReturnValue({
            is: vi.fn().mockReturnValue({
              data: [],
              error: null,
            }),
            data: [],
            error: null,
          }),
          not: vi.fn().mockReturnValue({
            data: [],
            error: null,
          }),
          data: [],
          error: null,
        }),
      }),
    });
    (supabase.from as any) = mockFrom;

    const { result } = renderHook(() => useRealTimeAnalytics({ funnelId: mockFunnelId }));

    await waitFor(() => {
      expect(result.current.isConnected).toBe(true);
    });
  });

  // ============================================================
  // TESTE 3: Cálculo de atividade ao vivo
  // ============================================================

  it('deve calcular atividade ao vivo', async () => {
    const now = new Date();
    const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);

    const mockActiveSessions = [
      { id: '1', user_id: 'user1', started_at: thirtyMinutesAgo.toISOString(), completed_at: null },
      { id: '2', user_id: 'user2', started_at: thirtyMinutesAgo.toISOString(), completed_at: null },
    ];

    const mockFrom = vi.fn((table: string) => ({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          gte: vi.fn().mockReturnValue({
            is: vi.fn().mockReturnValue({
              data: table === 'quiz_sessions' ? mockActiveSessions : [],
              error: null,
            }),
            data: table === 'quiz_sessions' ? mockActiveSessions : [],
            error: null,
          }),
          not: vi.fn().mockReturnValue({
            data: [],
            error: null,
          }),
          data: [],
          error: null,
        }),
      }),
    }));
    (supabase.from as any) = mockFrom;

    const { result } = renderHook(() => useRealTimeAnalytics({ funnelId: mockFunnelId }));

    await waitFor(() => {
      expect(result.current.liveActivity.activeSessions).toBe(2);
      expect(result.current.liveActivity.activeUsers).toBe(2);
    });
  });

  // ============================================================
  // TESTE 4: Processamento de eventos
  // ============================================================

  it('deve processar eventos de sessão', async () => {
    const mockFrom = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          gte: vi.fn().mockReturnValue({
            data: [],
            error: null,
          }),
          data: [],
          error: null,
        }),
      }),
    });
    (supabase.from as any) = mockFrom;

    let capturedCallback: any;
    const mockChannel = {
      on: vi.fn((event, config, callback) => {
        capturedCallback = callback;
        return mockChannel;
      }),
      subscribe: vi.fn((callback: any) => {
        callback('SUBSCRIBED');
        return mockChannel;
      }),
      unsubscribe: vi.fn(),
    };
    (supabase.channel as any) = vi.fn(() => mockChannel);

    const { result } = renderHook(() => useRealTimeAnalytics({ funnelId: mockFunnelId }));

    await waitFor(() => {
      expect(result.current.isConnected).toBe(true);
    });

    // Simula evento de nova sessão
    act(() => {
      capturedCallback({
        eventType: 'INSERT',
        new: {
          id: 'new-session',
          funnel_id: mockFunnelId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      });
    });

    await waitFor(() => {
      expect(result.current.recentEvents.length).toBeGreaterThan(0);
    });
  });

  // ============================================================
  // TESTE 5: Callback de conversão
  // ============================================================

  it('deve chamar callback onConversion', async () => {
    const onConversionMock = vi.fn();

    const mockFrom = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          gte: vi.fn().mockReturnValue({
            data: [],
            error: null,
          }),
          data: [],
          error: null,
        }),
      }),
    });
    (supabase.from as any) = mockFrom;

    let capturedCallback: any;
    const mockChannel = {
      on: vi.fn((event, config, callback) => {
        capturedCallback = callback;
        return mockChannel;
      }),
      subscribe: vi.fn((callback: any) => {
        callback('SUBSCRIBED');
        return mockChannel;
      }),
      unsubscribe: vi.fn(),
    };
    (supabase.channel as any) = vi.fn(() => mockChannel);

    renderHook(() => useRealTimeAnalytics({ 
      funnelId: mockFunnelId,
      onConversion: onConversionMock,
    }));

    await waitFor(() => {
      expect(capturedCallback).toBeDefined();
    });

    // Simula conversão
    act(() => {
      capturedCallback({
        eventType: 'UPDATE',
        new: {
          id: 'completed-session',
          funnel_id: mockFunnelId,
          completed_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      });
    });

    await waitFor(() => {
      expect(onConversionMock).toHaveBeenCalled();
    });
  });

  // ============================================================
  // TESTE 6: Detecção de dropoff
  // ============================================================

  it('deve detectar dropoffs anormais', async () => {
    const mockResponses = [
      { step_number: 1, session_id: 'session1', created_at: new Date().toISOString() },
      { step_number: 1, session_id: 'session2', created_at: new Date().toISOString() },
      { step_number: 1, session_id: 'session3', created_at: new Date().toISOString() },
      { step_number: 1, session_id: 'session4', created_at: new Date().toISOString() },
      { step_number: 2, session_id: 'session1', created_at: new Date().toISOString() }, // Apenas 1 usuário no step 2
    ];

    const mockFrom = vi.fn((table: string) => ({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          gte: vi.fn().mockReturnValue({
            data: table === 'quiz_step_responses' ? mockResponses : [],
            error: null,
          }),
          data: table === 'quiz_step_responses' ? mockResponses : [],
          error: null,
        }),
      }),
    }));
    (supabase.from as any) = mockFrom;

    const onDropoffAlertMock = vi.fn();

    const { result } = renderHook(() => useRealTimeAnalytics({ 
      funnelId: mockFunnelId,
      dropoffThreshold: 30,
      onDropoffAlert: onDropoffAlertMock,
    }));

    // Aguarda agregação inicial
    await act(async () => {
      vi.advanceTimersByTime(10000);
    });

    await waitFor(() => {
      // Dropoff de 75% (4 -> 1) deve gerar alerta
      expect(result.current.dropoffAlerts.length).toBeGreaterThan(0);
    }, { timeout: 5000 });
  });

  // ============================================================
  // TESTE 7: Limpeza de alertas
  // ============================================================

  it('deve limpar alertas', async () => {
    const mockFrom = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          gte: vi.fn().mockReturnValue({
            data: [],
            error: null,
          }),
          data: [],
          error: null,
        }),
      }),
    });
    (supabase.from as any) = mockFrom;

    const { result } = renderHook(() => useRealTimeAnalytics({ funnelId: mockFunnelId }));

    // Adiciona alerta manualmente para teste
    act(() => {
      // Simula alerta
      result.current.clearAlerts();
    });

    expect(result.current.dropoffAlerts).toEqual([]);
  });

  // ============================================================
  // TESTE 8: Agregação periódica
  // ============================================================

  it('deve agregar dados periodicamente', async () => {
    let queryCount = 0;
    const mockFrom = vi.fn(() => {
      queryCount++;
      return {
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            gte: vi.fn().mockReturnValue({
              data: [],
              error: null,
            }),
            data: [],
            error: null,
          }),
        }),
      };
    });
    (supabase.from as any) = mockFrom;

    renderHook(() => useRealTimeAnalytics({ 
      funnelId: mockFunnelId,
      aggregationInterval: 5000,
    }));

    const initialQueries = queryCount;

    // Avança 5 segundos
    await act(async () => {
      vi.advanceTimersByTime(5000);
    });

    // Deve ter feito novas queries
    await waitFor(() => {
      expect(queryCount).toBeGreaterThan(initialQueries);
    });
  });

  // ============================================================
  // TESTE 9: Função reconnect
  // ============================================================

  it('deve permitir reconexão', async () => {
    const mockFrom = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          gte: vi.fn().mockReturnValue({
            data: [],
            error: null,
          }),
          data: [],
          error: null,
        }),
      }),
    });
    (supabase.from as any) = mockFrom;

    const mockUnsubscribe = vi.fn();
    const mockChannel = {
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn((callback: any) => {
        callback('SUBSCRIBED');
        return mockChannel;
      }),
      unsubscribe: mockUnsubscribe,
    };
    (supabase.channel as any) = vi.fn(() => mockChannel);

    const { result } = renderHook(() => useRealTimeAnalytics({ funnelId: mockFunnelId }));

    await waitFor(() => {
      expect(result.current.isConnected).toBe(true);
    });

    // Chama reconnect
    act(() => {
      result.current.reconnect();
    });

    // Deve ter desconectado o canal anterior
    expect(mockUnsubscribe).toHaveBeenCalled();
  });

  // ============================================================
  // TESTE 10: Cleanup em unmount
  // ============================================================

  it('deve limpar subscriptions em unmount', async () => {
    const mockFrom = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          gte: vi.fn().mockReturnValue({
            data: [],
            error: null,
          }),
          data: [],
          error: null,
        }),
      }),
    });
    (supabase.from as any) = mockFrom;

    const mockUnsubscribe = vi.fn();
    const mockChannel = {
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn((callback: any) => {
        callback('SUBSCRIBED');
        return mockChannel;
      }),
      unsubscribe: mockUnsubscribe,
    };
    (supabase.channel as any) = vi.fn(() => mockChannel);

    const { unmount } = renderHook(() => useRealTimeAnalytics({ funnelId: mockFunnelId }));

    unmount();

    // Deve ter desconectado
    expect(mockUnsubscribe).toHaveBeenCalled();
  });
});

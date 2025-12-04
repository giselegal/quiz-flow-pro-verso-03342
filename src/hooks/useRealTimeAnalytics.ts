/**
 * 🔴 HOOK DE ANALYTICS EM TEMPO REAL - FASE 2 TASK 8
 * 
 * Monitoramento em tempo real usando Supabase Realtime subscriptions:
 * - Live updates de sessões ativas
 * - Notificações de conversões
 * - Monitoramento de dropoffs em tempo real
 * - Dashboard de atividade ao vivo
 * 
 * @version 1.0.0 - Supabase Realtime Integration
 * @author Quiz Flow Pro - Verso 03342
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { appLogger } from '@/lib/utils/appLogger';

// ============================================================
// INTERFACES DE DADOS EM TEMPO REAL
// ============================================================

/**
 * Atividade ao vivo no funil
 */
export interface LiveActivity {
  /** Sessões ativas no momento */
  activeSessions: number;
  /** Usuários únicos ativos */
  activeUsers: number;
  /** Conversões nas últimas 5 minutos */
  recentConversions: number;
  /** Taxa de conversão atual */
  currentConversionRate: number;
  /** Último update */
  lastUpdate: Date;
}

/**
 * Evento de sessão em tempo real
 */
export interface SessionEvent {
  /** ID da sessão */
  sessionId: string;
  /** ID do funil */
  funnelId: string;
  /** Tipo de evento */
  eventType: 'started' | 'completed' | 'abandoned';
  /** Step atual (se aplicável) */
  currentStep?: number;
  /** Timestamp do evento */
  timestamp: Date;
  /** Dados adicionais */
  metadata?: Record<string, any>;
}

/**
 * Alerta de dropoff
 */
export interface DropoffAlert {
  /** ID do alerta */
  alertId: string;
  /** Step onde ocorreu o dropoff */
  stepNumber: number;
  /** Taxa de dropoff detectada */
  dropoffRate: number;
  /** Número de usuários afetados */
  affectedUsers: number;
  /** Severidade do alerta */
  severity: 'low' | 'medium' | 'high' | 'critical';
  /** Timestamp do alerta */
  timestamp: Date;
}

/**
 * Estatísticas de step em tempo real
 */
export interface LiveStepStats {
  /** Número do step */
  stepNumber: number;
  /** Usuários ativos neste step */
  activeUsers: number;
  /** Tempo médio de permanência (segundos) */
  averageTimeSpent: number;
  /** Taxa de conclusão atual */
  completionRate: number;
  /** Último update */
  lastUpdate: Date;
}

// ============================================================
// CONFIGURAÇÕES DO HOOK
// ============================================================

export interface UseRealTimeAnalyticsOptions {
  /** ID do funil para monitorar */
  funnelId?: string;
  /** Threshold para alerta de dropoff (%) */
  dropoffThreshold?: number;
  /** Intervalo de agregação (ms) */
  aggregationInterval?: number;
  /** Ativar notificações de conversão */
  enableConversionNotifications?: boolean;
  /** Callback para eventos de conversão */
  onConversion?: (event: SessionEvent) => void;
  /** Callback para alertas de dropoff */
  onDropoffAlert?: (alert: DropoffAlert) => void;
}

// ============================================================
// HOOK PRINCIPAL - useRealTimeAnalytics
// ============================================================

export function useRealTimeAnalytics(options: UseRealTimeAnalyticsOptions = {}) {
  const {
    funnelId = 'quiz-21-steps-integrated',
    dropoffThreshold = 30,
    aggregationInterval = 10000, // 10 segundos
    enableConversionNotifications = true,
    onConversion,
    onDropoffAlert,
  } = options;

  // ============================================================
  // ESTADO
  // ============================================================

  const [liveActivity, setLiveActivity] = useState<LiveActivity>({
    activeSessions: 0,
    activeUsers: 0,
    recentConversions: 0,
    currentConversionRate: 0,
    lastUpdate: new Date(),
  });

  const [recentEvents, setRecentEvents] = useState<SessionEvent[]>([]);
  const [dropoffAlerts, setDropoffAlerts] = useState<DropoffAlert[]>([]);
  const [liveStepStats, setLiveStepStats] = useState<LiveStepStats[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // ============================================================
  // REFS
  // ============================================================

  const channelRef = useRef<RealtimeChannel | null>(null);
  const aggregationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const eventBufferRef = useRef<SessionEvent[]>([]);

  // ============================================================
  // FUNÇÃO: Calcular atividade ao vivo
  // ============================================================

  const calculateLiveActivity = useCallback(async () => {
    try {
      const now = new Date();
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

      // Sessões ativas (iniciadas nos últimos 30 minutos e não completadas)
      const { data: activeSessions, error: activeError } = await supabase
        .from('quiz_sessions')
        .select('id, user_id')
        .eq('funnel_id', funnelId)
        .gte('started_at', new Date(now.getTime() - 30 * 60 * 1000).toISOString())
        .is('completed_at', null);

      if (activeError) throw activeError;

      // Conversões recentes (últimos 5 minutos)
      const { data: recentConversions, error: conversionError } = await supabase
        .from('quiz_sessions')
        .select('id')
        .eq('funnel_id', funnelId)
        .not('completed_at', 'is', null)
        .gte('completed_at', fiveMinutesAgo.toISOString());

      if (conversionError) throw conversionError;

      // Taxa de conversão atual (últimas 24 horas)
      const { data: allSessions, error: allError } = await supabase
        .from('quiz_sessions')
        .select('id, completed_at')
        .eq('funnel_id', funnelId)
        .gte('started_at', new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString());

      if (allError) throw allError;

      const totalSessions = allSessions?.length || 0;
      const completedSessions = allSessions?.filter((s: any) => s.completed_at)?.length || 0;
      const conversionRate = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;

      // Usuários únicos
      const uniqueUsers = new Set(activeSessions?.map((s: any) => s.user_id)).size;

      setLiveActivity({
        activeSessions: activeSessions?.length || 0,
        activeUsers: uniqueUsers,
        recentConversions: recentConversions?.length || 0,
        currentConversionRate: conversionRate,
        lastUpdate: new Date(),
      });

      appLogger.info('Live activity calculated', {
        activeSessions: activeSessions?.length,
        recentConversions: recentConversions?.length,
        conversionRate,
      });
    } catch (err) {
      appLogger.error('Failed to calculate live activity', { error: err });
      setError(err instanceof Error ? err : new Error('Failed to calculate live activity'));
    }
  }, [funnelId]);

  // ============================================================
  // FUNÇÃO: Calcular estatísticas de step ao vivo
  // ============================================================

  const calculateLiveStepStats = useCallback(async () => {
    try {
      const now = new Date();
      const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);

      // Buscar respostas recentes por step
      const { data: responses, error: responseError } = await supabase
        .from('quiz_step_responses')
        .select('step_number, session_id, created_at')
        .gte('created_at', thirtyMinutesAgo.toISOString());

      if (responseError) throw responseError;

      // Agrupar por step
      const stepMap = new Map<number, { sessions: Set<string>; times: number[] }>();

      responses?.forEach((response: any) => {
        if (!stepMap.has(response.step_number)) {
          stepMap.set(response.step_number, { sessions: new Set(), times: [] });
        }
        const stepData = stepMap.get(response.step_number)!;
        stepData.sessions.add(response.session_id);
        
        // Calcular tempo desde criação (aproximação)
        const timeSpent = (now.getTime() - new Date(response.created_at).getTime()) / 1000;
        if (timeSpent < 600) { // Apenas últimos 10 minutos
          stepData.times.push(timeSpent);
        }
      });

      // Calcular stats por step
      const stats: LiveStepStats[] = Array.from(stepMap.entries()).map(([stepNumber, data]) => {
        const avgTime = data.times.length > 0
          ? data.times.reduce((a, b) => a + b, 0) / data.times.length
          : 0;

        // Taxa de conclusão (aproximada)
        const completionRate = Math.min(100, (data.sessions.size / liveActivity.activeSessions) * 100);

        return {
          stepNumber,
          activeUsers: data.sessions.size,
          averageTimeSpent: avgTime,
          completionRate,
          lastUpdate: new Date(),
        };
      });

      setLiveStepStats(stats.sort((a, b) => a.stepNumber - b.stepNumber));

      appLogger.debug('Live step stats calculated', { totalSteps: stats.length });
    } catch (err) {
      appLogger.error('Failed to calculate live step stats', { error: err });
    }
  }, [liveActivity.activeSessions]);

  // ============================================================
  // FUNÇÃO: Detectar dropoffs anormais
  // ============================================================

  const detectDropoffAlerts = useCallback((stepStats: LiveStepStats[]) => {
    const alerts: DropoffAlert[] = [];

    for (let i = 0; i < stepStats.length - 1; i++) {
      const currentStep = stepStats[i];
      const nextStep = stepStats[i + 1];

      if (currentStep.activeUsers > 0) {
        const dropoffRate = ((currentStep.activeUsers - nextStep.activeUsers) / currentStep.activeUsers) * 100;

        if (dropoffRate >= dropoffThreshold) {
          const severity: DropoffAlert['severity'] =
            dropoffRate >= 80 ? 'critical' :
            dropoffRate >= 60 ? 'high' :
            dropoffRate >= 40 ? 'medium' : 'low';

          const alert: DropoffAlert = {
            alertId: `${currentStep.stepNumber}-${Date.now()}`,
            stepNumber: currentStep.stepNumber,
            dropoffRate,
            affectedUsers: currentStep.activeUsers - nextStep.activeUsers,
            severity,
            timestamp: new Date(),
          };

          alerts.push(alert);

          if (onDropoffAlert) {
            onDropoffAlert(alert);
          }
        }
      }
    }

    if (alerts.length > 0) {
      setDropoffAlerts(prev => [...alerts, ...prev].slice(0, 10)); // Manter apenas últimos 10
      appLogger.warn('Dropoff alerts detected', { count: alerts.length });
    }
  }, [dropoffThreshold, onDropoffAlert]);

  // ============================================================
  // FUNÇÃO: Processar evento de sessão
  // ============================================================

  const processSessionEvent = useCallback((event: SessionEvent) => {
    // Adicionar ao buffer
    eventBufferRef.current.push(event);

    // Adicionar aos eventos recentes
    setRecentEvents(prev => [event, ...prev].slice(0, 20)); // Manter últimos 20

    // Notificar conversão
    if (event.eventType === 'completed' && enableConversionNotifications && onConversion) {
      onConversion(event);
    }

    appLogger.debug('Session event processed', { 
      eventType: event.eventType, 
      sessionId: event.sessionId 
    });
  }, [enableConversionNotifications, onConversion]);

  // ============================================================
  // EFEITO: Setup Supabase Realtime
  // ============================================================

  useEffect(() => {
    let mounted = true;

    const setupRealtime = async () => {
      try {
        // Criar canal de realtime
        const channel = supabase.channel(`analytics-${funnelId}`, {
          config: {
            broadcast: { self: true },
            presence: { key: 'analytics' },
          },
        });

        // Subscrever a mudanças em quiz_sessions
        channel.on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'quiz_sessions',
            filter: `funnel_id=eq.${funnelId}`,
          },
          (payload: any) => {
            if (!mounted) return;

            const session = payload.new as any;
            const eventType: SessionEvent['eventType'] = 
              payload.eventType === 'INSERT' ? 'started' :
              session.completed_at ? 'completed' : 'abandoned';

            const event: SessionEvent = {
              sessionId: session.id,
              funnelId: session.funnel_id,
              eventType,
              currentStep: session.current_step,
              timestamp: new Date(session.updated_at || session.created_at),
              metadata: session,
            };

            processSessionEvent(event);
          }
        );

        // Subscribe ao canal
        channel.subscribe((status: any) => {
          if (status === 'SUBSCRIBED' && mounted) {
            setIsConnected(true);
            appLogger.info('Realtime connection established', { funnelId });
          } else if (status === 'CHANNEL_ERROR') {
            setIsConnected(false);
            setError(new Error('Realtime connection error'));
            appLogger.error('Realtime connection failed');
          }
        });

        channelRef.current = channel;

        // Calcular atividade inicial
        await calculateLiveActivity();
        await calculateLiveStepStats();
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to setup realtime'));
          appLogger.error('Realtime setup failed', { error: err });
        }
      }
    };

    setupRealtime();

    return () => {
      mounted = false;
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        appLogger.info('Realtime connection closed');
      }
    };
  }, [funnelId, calculateLiveActivity, calculateLiveStepStats, processSessionEvent]);

  // ============================================================
  // EFEITO: Agregação periódica
  // ============================================================

  useEffect(() => {
    aggregationTimerRef.current = setInterval(async () => {
      await calculateLiveActivity();
      await calculateLiveStepStats();

      // Detectar alertas de dropoff
      if (liveStepStats.length > 0) {
        detectDropoffAlerts(liveStepStats);
      }

      // Limpar buffer de eventos
      eventBufferRef.current = [];
    }, aggregationInterval);

    return () => {
      if (aggregationTimerRef.current) {
        clearInterval(aggregationTimerRef.current);
      }
    };
  }, [aggregationInterval, calculateLiveActivity, calculateLiveStepStats, detectDropoffAlerts, liveStepStats]);

  // ============================================================
  // FUNÇÃO: Reconectar
  // ============================================================

  const reconnect = useCallback(async () => {
    if (channelRef.current) {
      await supabase.removeChannel(channelRef.current);
    }
    setError(null);
    setIsConnected(false);
    window.location.reload(); // Força reinicialização
  }, []);

  // ============================================================
  // FUNÇÃO: Limpar alertas
  // ============================================================

  const clearAlerts = useCallback(() => {
    setDropoffAlerts([]);
    appLogger.info('Dropoff alerts cleared');
  }, []);

  // ============================================================
  // RETORNO DO HOOK
  // ============================================================

  return {
    // Estado
    liveActivity,
    recentEvents,
    dropoffAlerts,
    liveStepStats,
    isConnected,
    error,

    // Ações
    reconnect,
    clearAlerts,
    refresh: calculateLiveActivity,
  };
}

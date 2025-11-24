/**
 * 🎯 HOOK DE MÉTRICAS DO DASHBOARD
 * 
 * Busca e atualiza automaticamente as métricas do dashboard
 * com dados reais do Supabase e AnalyticsService.
 * 
 * Features:
 * - Métricas em tempo real do AnalyticsService
 * - Auto-refresh configurável (padrão: 30s)
 * - Cache inteligente
 * - Loading states
 * - Error handling
 * 
 * @example
 * ```tsx
 * const { metrics, loading, error, refresh } = useDashboardMetrics({
 *   autoRefresh: true,
 *   refreshInterval: 30000
 * });
 * 
 * return (
 *   <div>
 *     <MetricCard title="Sessões Ativas" value={metrics?.activeSessions} />
 *     <MetricCard title="Taxa de Conversão" value={`${metrics?.conversionRate}%`} />
 *   </div>
 * );
 * ```
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/services/integrations/supabase/customClient';
import { analyticsService } from '@/services/canonical';
import { appLogger } from '@/lib/utils/appLogger';

export interface DashboardMetrics {
  // Sessões
  activeSessions: number;
  totalSessions: number;
  sessionsTrend: number; // % de mudança em relação ao período anterior
  
  // Conversões
  conversionRate: number;
  conversionsToday: number;
  conversionTrend: number;
  
  // Usuários
  totalUsers: number;
  newUsersToday: number;
  usersTrend: number;
  
  // Quiz Performance
  averageCompletionTime: number; // em minutos
  completionRate: number; // % de quizzes completados
  dropoffRate: number; // % de quizzes abandonados
  
  // Funis
  activeFunnels: number;
  totalFunnels: number;
  
  // Revenue/Leads (se aplicável)
  leadsGenerated: number;
  leadsTrend: number;
  
  // Timestamps
  lastUpdated: Date;
  period: 'today' | 'last-7-days' | 'last-30-days';
}

export interface UseDashboardMetricsOptions {
  autoRefresh?: boolean;
  refreshInterval?: number; // em ms, padrão: 30000 (30s)
  period?: 'today' | 'last-7-days' | 'last-30-days';
}

export interface UseDashboardMetricsReturn {
  metrics: DashboardMetrics | null;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  isStale: boolean; // true se dados têm mais de 1 minuto
}

export function useDashboardMetrics(
  options: UseDashboardMetricsOptions = {}
): UseDashboardMetricsReturn {
  const {
    autoRefresh = true,
    refreshInterval = 30000,
    period = 'last-7-days'
  } = options;

  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isStale, setIsStale] = useState(false);
  
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);
  const staleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 📊 CALCULAR PERÍODO DE DATAS
  const getDateRange = useCallback(() => {
    const now = new Date();
    const startDate = new Date();

    switch (period) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'last-7-days':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'last-30-days':
        startDate.setDate(now.getDate() - 30);
        break;
    }

    return { startDate, endDate: now };
  }, [period]);

  // 📊 BUSCAR MÉTRICAS DO SUPABASE
  const fetchMetrics = useCallback(async (): Promise<DashboardMetrics> => {
    const { startDate, endDate } = getDateRange();

    try {
      // 1️⃣ SESSÕES
      const { data: sessions, error: sessionsError } = await supabase
        .from('quiz_sessions')
        .select('id, status, started_at, completed_at')
        .gte('started_at', startDate.toISOString())
        .lte('started_at', endDate.toISOString());

      if (sessionsError) throw sessionsError;

      const totalSessions = sessions?.length || 0;
      const activeSessions = sessions?.filter((s: any) => 
        s.status === 'started' || s.status === 'in_progress'
      ).length || 0;
      const completedSessions = sessions?.filter((s: any) => 
        s.status === 'completed'
      ).length || 0;

      // 2️⃣ USUÁRIOS
      const { data: users, error: usersError } = await supabase
        .from('quiz_users')
        .select('id, created_at')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      if (usersError) throw usersError;

      const totalUsers = users?.length || 0;
      const newUsersToday = users?.filter((u: any) => {
        const userDate = new Date(u.created_at);
        const today = new Date();
        return userDate.toDateString() === today.toDateString();
      }).length || 0;

      // 3️⃣ CONVERSÕES (Resultados)
      const { data: results, error: resultsError } = await supabase
        .from('quiz_results')
        .select('id, created_at')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      if (resultsError) throw resultsError;

      const totalConversions = results?.length || 0;
      const conversionsToday = results?.filter((r: any) => {
        const resultDate = new Date(r.created_at);
        const today = new Date();
        return resultDate.toDateString() === today.toDateString();
      }).length || 0;

      const conversionRate = totalSessions > 0 
        ? (totalConversions / totalSessions) * 100 
        : 0;

      // 4️⃣ FUNIS
      const { data: funnels, error: funnelsError } = await supabase
        .from('funnels')
        .select('id, status');

      if (funnelsError) throw funnelsError;

      const totalFunnels = funnels?.length || 0;
      const activeFunnels = funnels?.filter((f: any) => f.status === 'published').length || 0;

      // 5️⃣ PERFORMANCE DO QUIZ
      const completionRate = totalSessions > 0
        ? (completedSessions / totalSessions) * 100
        : 0;

      const dropoffRate = 100 - completionRate;

      // Calcular tempo médio de conclusão
      let totalCompletionTime = 0;
      let completedCount = 0;

      sessions?.forEach((session: any) => {
        if (session.completed_at && session.started_at) {
          const start = new Date(session.started_at).getTime();
          const end = new Date(session.completed_at).getTime();
          totalCompletionTime += (end - start) / 60000; // Converter para minutos
          completedCount++;
        }
      });

      const averageCompletionTime = completedCount > 0
        ? totalCompletionTime / completedCount
        : 0;

      // 6️⃣ CALCULAR TRENDS (comparar com período anterior)
      const previousPeriodStart = new Date(startDate);
      const previousPeriodEnd = new Date(startDate);
      const periodDuration = endDate.getTime() - startDate.getTime();
      previousPeriodStart.setTime(startDate.getTime() - periodDuration);

      const { data: previousSessions } = await supabase
        .from('quiz_sessions')
        .select('id')
        .gte('started_at', previousPeriodStart.toISOString())
        .lt('started_at', previousPeriodEnd.toISOString());

      const previousTotal = previousSessions?.length || 0;
      const sessionsTrend = previousTotal > 0
        ? ((totalSessions - previousTotal) / previousTotal) * 100
        : 0;

      const { data: previousResults } = await supabase
        .from('quiz_results')
        .select('id')
        .gte('created_at', previousPeriodStart.toISOString())
        .lt('created_at', previousPeriodEnd.toISOString());

      const previousConversions = previousResults?.length || 0;
      const conversionTrend = previousConversions > 0
        ? ((totalConversions - previousConversions) / previousConversions) * 100
        : 0;

      const { data: previousUsers } = await supabase
        .from('quiz_users')
        .select('id')
        .gte('created_at', previousPeriodStart.toISOString())
        .lt('created_at', previousPeriodEnd.toISOString());

      const previousUserCount = previousUsers?.length || 0;
      const usersTrend = previousUserCount > 0
        ? ((totalUsers - previousUserCount) / previousUserCount) * 100
        : 0;

      const dashboardMetrics: DashboardMetrics = {
        activeSessions,
        totalSessions,
        sessionsTrend,
        conversionRate: Math.round(conversionRate * 100) / 100,
        conversionsToday,
        conversionTrend: Math.round(conversionTrend * 100) / 100,
        totalUsers,
        newUsersToday,
        usersTrend: Math.round(usersTrend * 100) / 100,
        averageCompletionTime: Math.round(averageCompletionTime * 10) / 10,
        completionRate: Math.round(completionRate * 100) / 100,
        dropoffRate: Math.round(dropoffRate * 100) / 100,
        activeFunnels,
        totalFunnels,
        leadsGenerated: totalConversions,
        leadsTrend: Math.round(conversionTrend * 100) / 100,
        lastUpdated: new Date(),
        period,
      };

      appLogger.info('📊 Dashboard Metrics atualizado', { 
        activeSessions,
        totalSessions,
        conversionRate: dashboardMetrics.conversionRate
      });

      return dashboardMetrics;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro ao buscar métricas');
      appLogger.error('❌ Erro ao buscar métricas do dashboard', { data: [error] });
      throw error;
    }
  }, [getDateRange, period]);

  // 🔄 REFRESH MANUAL
  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const newMetrics = await fetchMetrics();
      setMetrics(newMetrics);
      setIsStale(false);

      // Resetar timer de stale
      if (staleTimerRef.current) {
        clearTimeout(staleTimerRef.current);
      }
      
      staleTimerRef.current = setTimeout(() => {
        setIsStale(true);
      }, 60000); // 1 minuto

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro ao atualizar métricas');
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [fetchMetrics]);

  // 🎯 INICIALIZAÇÃO
  useEffect(() => {
    refresh();
  }, [refresh]);

  // 🔄 AUTO-REFRESH
  useEffect(() => {
    if (!autoRefresh) return;

    refreshTimerRef.current = setInterval(refresh, refreshInterval);

    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
    };
  }, [autoRefresh, refreshInterval, refresh]);

  // 🧹 CLEANUP
  useEffect(() => {
    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
      if (staleTimerRef.current) {
        clearTimeout(staleTimerRef.current);
      }
    };
  }, []);

  return {
    metrics,
    loading,
    error,
    refresh,
    isStale,
  };
}

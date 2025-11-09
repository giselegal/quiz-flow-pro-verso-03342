import { BaseCanonicalService, ServiceResult } from '@/services/canonical/types';
import { supabase } from '@/services/integrations/supabase/customClient';
import type { DashboardMetrics } from '@/services/canonical/DataService';
import { CanonicalServicesMonitor } from '@/services/canonical/monitoring';

// Helpers exportados para testes
export function computeAverageSessionDuration(sessions: Array<any>): number {
  if (!sessions?.length) return 0;
  const durations: number[] = [];
  for (const s of sessions) {
    const start = s?.started_at ? new Date(s.started_at).getTime() : null;
    const end = s?.ended_at ? new Date(s.ended_at).getTime() : null;
    if (start && end && end > start) durations.push((end - start) / 1000);
  }
  if (!durations.length) return 0;
  return durations.reduce((acc, v) => acc + v, 0) / durations.length;
}

export function computeBounceRate(sessions: Array<any>, analyticsToday: Array<any>): number {
  const totalSessions = sessions?.length || 0;
  if (!totalSessions) return 0;
  const eventsBySession = new Map<string, number>();
  for (const a of analyticsToday || []) {
    const sid = a?.session_id ? String(a.session_id) : undefined;
    if (!sid) continue;
    eventsBySession.set(sid, (eventsBySession.get(sid) || 0) + 1);
  }
  let bounces = 0;
  for (const s of sessions) {
    const sid = s?.id ? String(s.id) : undefined;
    const count = sid ? (eventsBySession.get(sid) || 0) : 0;
    if (count <= 1) bounces += 1;
  }
  return (bounces / totalSessions) * 100;
}

export class AnalyticsDataService extends BaseCanonicalService {
  private static instance: AnalyticsDataService;

  private constructor() {
    super('AnalyticsDataService', '0.1.0');
  }

  static getInstance(): AnalyticsDataService {
    if (!this.instance) this.instance = new AnalyticsDataService();
    return this.instance;
  }

  protected async onInitialize(): Promise<void> {}
  protected async onDispose(): Promise<void> {}

  async getDashboardMetrics(): Promise<ServiceResult<DashboardMetrics>> {
    CanonicalServicesMonitor.trackUsage(this.name, 'getDashboardMetrics');
    try {
      // Define recortes de tempo
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const startOfDayISO = startOfDay.toISOString();
      const fiveMinutesAgoISO = new Date(now.getTime() - 5 * 60 * 1000).toISOString();

      // Buscas baseadas no novo esquema (quiz_sessions, quiz_analytics)
      // Observação: usamos <any> para tolerar variações de schema/tipagem gerada durante a migração.
      const [sessionsRes, analyticsTodayRes, recentActivityRes] = await Promise.all([
        (supabase
          .from('quiz_sessions' as any) as any)
          .select('id, started_at, ended_at, user_id')
          .gte('started_at', startOfDayISO),
        (supabase
          .from('quiz_analytics' as any) as any)
          .select('metric_name, metric_value, session_id, user_id, recorded_at')
          .gte('recorded_at', startOfDayISO),
        (supabase
          .from('quiz_analytics' as any) as any)
          .select('user_id, recorded_at')
          .gte('recorded_at', fiveMinutesAgoISO)
          .not('user_id', 'is', null),
      ]);

      const sessions: any[] = ((sessionsRes as any)?.data as any[]) || [];
      const analyticsToday: any[] = ((analyticsTodayRes as any)?.data as any[]) || [];
      const recentActivity: any[] = ((recentActivityRes as any)?.data as any[]) || [];

      // Usuários ativos (distinct user_id nos últimos 5 minutos)
      const activeUserSet = new Set<string>();
      for (const row of recentActivity) {
        if (row?.user_id) activeUserSet.add(String(row.user_id));
      }
      const activeUsersNow = activeUserSet.size;

      // Total de sessões do dia
      const totalSessions = sessions.length;

      // Conversões e Receita a partir de métricas do dia
      const conversionMetricNames = new Set(['conversion', 'quiz_completed', 'purchase']);
      const revenueMetricNames = new Set(['revenue', 'purchase_value', 'order_value', 'conversion_value']);

      let conversions = 0;
      let totalRevenue = 0;
      for (const a of analyticsToday) {
        const name = String(a?.metric_name || '').toLowerCase();
        if (conversionMetricNames.has(name)) conversions += 1;
        if (revenueMetricNames.has(name)) totalRevenue += Number(a?.metric_value || 0) || 0;
      }

      // Duração média de sessões encerradas no dia
      const averageSessionDuration = computeAverageSessionDuration(sessions);

      // Bounce rate: sessões com 0 ou 1 evento no dia
      const bounceRate = computeBounceRate(sessions, analyticsToday);

      const metrics: DashboardMetrics = {
        activeUsersNow,
        totalSessions,
        conversionRate: totalSessions && conversions ? (conversions / totalSessions) * 100 : 0,
        totalRevenue,
        averageSessionDuration,
        bounceRate,
      };

      return this.createResult(metrics);
    } catch (error) {
      return this.createError(error as Error);
    }
  }
}

export const analyticsDataService = AnalyticsDataService.getInstance();

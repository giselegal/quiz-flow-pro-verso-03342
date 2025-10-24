import { BaseCanonicalService, ServiceResult } from '@/services/canonical/types';
import { supabase } from '@/integrations/supabase/customClient';
import type { DashboardMetrics } from '@/services/canonical/DataService';
import { CanonicalServicesMonitor } from '@/services/canonical/monitoring';

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
      const today = new Date().toISOString().split('T')[0];

      const { count: activeUsers } = await supabase
        .from('active_user_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)
        .gte('last_activity', new Date(Date.now() - 5 * 60 * 1000).toISOString());

      const { count: totalSessions } = await supabase
        .from('quiz_sessions')
        .select('*', { count: 'exact', head: true })
        .gte('started_at', today);

      const { count: conversions } = await supabase
        .from('quiz_conversions')
        .select('*', { count: 'exact', head: true })
        .gte('converted_at', today);

      const { data: revenueData } = await supabase
        .from('quiz_conversions')
        .select('conversion_value')
        .gte('converted_at', today);

      const totalRevenue = revenueData?.reduce((sum: number, item: any) => sum + (Number(item.conversion_value) || 0), 0) || 0;

      const { data: analyticsData } = await supabase
        .from('session_analytics')
        .select('*')
        .eq('date', today)
        .maybeSingle();

      const metrics: DashboardMetrics = {
        activeUsersNow: activeUsers || 0,
        totalSessions: totalSessions || 0,
        conversionRate: totalSessions && conversions ? (conversions / totalSessions) * 100 : 0,
        totalRevenue,
        averageSessionDuration: analyticsData?.average_duration_seconds || 0,
        bounceRate: analyticsData?.bounce_rate || 0,
      };

      return this.createResult(metrics);
    } catch (error) {
      return this.createError(error as Error);
    }
  }
}

export const analyticsDataService = AnalyticsDataService.getInstance();

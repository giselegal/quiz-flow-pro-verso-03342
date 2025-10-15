/**
 * 🚀 ENHANCED UNIFIED DATA SERVICE - FASE 4
 * 
 * Serviço central para dados do admin dashboard
 * Integrado com Supabase para dados reais
 */

import { supabase } from '@/integrations/supabase/customClient';

export interface DashboardMetrics {
  activeUsersNow: number;
  totalSessions: number;
  conversionRate: number;
  totalRevenue: number;
  averageSessionDuration: number;
  bounceRate: number;
}

export interface ActivityRecord {
  id: string;
  user_id: string | null;
  activity_type: string;
  activity_description: string;
  entity_type: string | null;
  entity_id: string | null;
  created_at: string | null;
  metadata?: any;
}

export interface SessionData {
  id: string;
  funnel_id: string;
  quiz_user_id: string;
  status: string;
  current_step: number | null;
  started_at: string;
  completed_at?: string | null;
  last_activity: string;
}

export class EnhancedUnifiedDataService {
  private static instance: EnhancedUnifiedDataService;

  static getInstance(): EnhancedUnifiedDataService {
    if (!this.instance) {
      this.instance = new EnhancedUnifiedDataService();
    }
    return this.instance;
  }

  /**
   * Obter métricas do dashboard em tempo real
   */
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    try {
      // Usuários ativos agora (últimos 5 minutos)
      const { count: activeUsers } = await supabase
        .from('active_user_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)
        .gte('last_activity', new Date(Date.now() - 5 * 60 * 1000).toISOString());

      // Total de sessões hoje
      const today = new Date().toISOString().split('T')[0];
      const { count: totalSessions } = await supabase
        .from('quiz_sessions')
        .select('*', { count: 'exact', head: true })
        .gte('started_at', today);

      // Conversões hoje
      const { count: conversions } = await supabase
        .from('quiz_conversions')
        .select('*', { count: 'exact', head: true })
        .gte('converted_at', today);

      // Receita total
      const { data: revenueData } = await supabase
        .from('quiz_conversions')
        .select('conversion_value')
        .gte('converted_at', today);

      const totalRevenue = revenueData?.reduce(
        (sum, item) => sum + (Number(item.conversion_value) || 0),
        0
      ) || 0;

      // Analytics agregados (fallback para dados mockados se não houver)
      const { data: analyticsData } = await supabase
        .from('session_analytics')
        .select('*')
        .eq('date', today)
        .maybeSingle();

      return {
        activeUsersNow: activeUsers || 0,
        totalSessions: totalSessions || 0,
        conversionRate: totalSessions && conversions 
          ? (conversions / totalSessions) * 100 
          : 0,
        totalRevenue,
        averageSessionDuration: analyticsData?.average_duration_seconds || 0,
        bounceRate: analyticsData?.bounce_rate || 0,
      };
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error);
      // Fallback para dados mockados
      return {
        activeUsersNow: 0,
        totalSessions: 0,
        conversionRate: 0,
        totalRevenue: 0,
        averageSessionDuration: 0,
        bounceRate: 0,
      };
    }
  }

  /**
   * Obter atividades recentes
   */
  async getRecentActivities(limit: number = 10): Promise<ActivityRecord[]> {
    try {
      const { data, error } = await supabase
        .from('user_activities')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      return [];
    }
  }

  /**
   * Obter sessões ativas
   */
  async getActiveSessions(limit: number = 20): Promise<SessionData[]> {
    try {
      const { data, error } = await supabase
        .from('quiz_sessions')
        .select('*')
        .eq('status', 'active')
        .order('last_activity', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching active sessions:', error);
      return [];
    }
  }

  /**
   * Registrar nova atividade
   */
  async logActivity(
    activityType: string,
    description: string,
    entityType?: string,
    entityId?: string,
    metadata?: any
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_activities')
        .insert({
          activity_type: activityType,
          activity_description: description,
          entity_type: entityType,
          entity_id: entityId,
          metadata: metadata || {},
          ip_address: null,
          user_agent: navigator.userAgent,
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  }

  /**
   * Atualizar analytics agregados
   */
  async updateSessionAnalytics(
    date: string,
    funnelId: string,
    metrics: Partial<{
      total_sessions: number;
      completed_sessions: number;
      abandoned_sessions: number;
      average_duration_seconds: number;
      conversion_rate: number;
      total_revenue: number;
      unique_users: number;
      bounce_rate: number;
    }>
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('session_analytics')
        .upsert({
          date,
          funnel_id: funnelId,
          ...metrics,
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error updating session analytics:', error);
    }
  }

  /**
   * Obter pontos de abandono
   */
  async getDropoffPoints(funnelId?: string): Promise<Record<string, number>> {
    try {
      let query = supabase
        .from('quiz_sessions')
        .select('current_step, status');

      if (funnelId) {
        query = query.eq('funnel_id', funnelId);
      }

      const { data, error } = await query.eq('status', 'abandoned');

      if (error) throw error;

      // Agrupar por step
      const dropoffs: Record<string, number> = {};
      data?.forEach((session: any) => {
        const step = `step-${session.current_step}`;
        dropoffs[step] = (dropoffs[step] || 0) + 1;
      });

      return dropoffs;
    } catch (error) {
      console.error('Error fetching dropoff points:', error);
      return {};
    }
  }

  /**
   * Legacy methods para compatibilidade
   */
  async getBackupData() {
    return { data: [], metadata: {} };
  }

  async loadTemplate(templateId: string) {
    return { id: templateId, data: {} };
  }
}

export const enhancedUnifiedDataService = EnhancedUnifiedDataService.getInstance();

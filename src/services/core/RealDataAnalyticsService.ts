/**
 * 📊 REAL DATA ANALYTICS SERVICE (LEGACY)
 * STATUS: DEPRECATED – substituído por enhancedUnifiedDataServiceAdapter + unifiedAnalyticsEngine.
 * SUNSET PLAN:
 *   - Último dia para dependências diretas: 2025-10-05
 *   - Verificação de ausência de imports: 2025-10-15
 *   - Remoção final: 2025-10-31
 */

import { BaseUnifiedService } from './UnifiedServiceManager';
import { supabase } from '@/integrations/supabase/client';

// ============================================================================
// TYPES
// ============================================================================

export interface RealMetrics {
  // Core Metrics
  totalSessions: number;
  activeSessions: number;
  completedSessions: number;
  abandonedSessions: number;
  conversionRate: number;

  // Performance Metrics
  averageCompletionTime: number;
  averageSessionDuration: number;
  dropOffRate: number;

  // User Behavior
  deviceStats: Array<{ device: string; count: number; percentage: number }>;
  hourlyActivity: Array<{ hour: number; count: number }>;
  dailyTrends: Array<{ date: string; sessions: number; completions: number }>;

  // Business Metrics
  leadGeneration: number;
  topPerformingFunnels: Array<{ id: string; name: string; sessions: number; rate: number }>;

  // Real-time Data
  activeUsersNow: number;
  recentActivity: Array<{ sessionId: string; funnelId: string; timestamp: string; event: string }>;

  // Metadata
  lastUpdated: Date;
  dataSource: 'supabase';
}

export interface ParticipantData {
  sessionId: string;
  userId?: string;
  funnelId: string;
  funnelName: string;
  startedAt: Date;
  completedAt?: Date;
  currentStep: number;
  totalSteps: number;
  status: 'active' | 'completed' | 'abandoned';
  deviceType: string;
  responses: number;
  completionPercentage: number;
  timeSpent: number;
  finalResult?: {
    resultType: string;
    resultTitle: string;
  };
}

// ============================================================================
// REAL DATA ANALYTICS SERVICE
// ============================================================================

export class RealDataAnalyticsService extends BaseUnifiedService {
  constructor() {
    super({
      name: 'RealDataAnalyticsService',
      priority: 1,
      cacheTTL: 120000, // 2 minutes for real-time feel
      retryAttempts: 3,
      timeout: 15000
    });
  }

  getName(): string {
    return 'RealDataAnalyticsService';
  }

  async healthCheck(): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('quiz_sessions')
        .select('count(*)')
        .limit(1);

      return !error;
    } catch (error) {
      return false;
    }
  }

  // ========================================================================
  // REAL METRICS DASHBOARD
  // ========================================================================

  async getRealMetrics(): Promise<RealMetrics> {
    return this.executeWithMetrics(async () => {
      const cacheKey = 'real-metrics-dashboard';
      const cached = this.getCached<RealMetrics>(cacheKey);
      if (cached) return cached;

      // Fetch all core data in parallel
      const [
        { data: sessions },
        { data: funnels },
        { data: results },
        { data: analytics }
      ] = await Promise.all([
        supabase.from('quiz_sessions').select('*'),
        supabase.from('funnels').select('id, name'),
        supabase.from('quiz_results').select('*'),
        supabase.from('quiz_analytics').select('*')
      ]);

      const sessionsData = sessions || [];
      const funnelsMap = new Map((funnels || []).map(f => [f.id, f.name]));

      // Core metrics calculation
      const totalSessions = sessionsData.length;
      const activeSessions = sessionsData.filter(s => s.status === 'active').length;
      const completedSessions = sessionsData.filter(s => s.status === 'completed').length;
      const abandonedSessions = sessionsData.filter(s => s.status === 'abandoned').length;
      const conversionRate = totalSessions > 0 ?
        Math.round((completedSessions / totalSessions) * 100 * 10) / 10 : 0;

      // Performance metrics
      const completedWithTime = sessionsData.filter(s => s.status === 'completed' && s.started_at && s.completed_at);
      const averageCompletionTime = completedWithTime.length > 0 ?
        Math.round(completedWithTime.reduce((sum, session) => {
          const start = new Date(session.started_at).getTime();
          const end = new Date(session.completed_at!).getTime();
          return sum + (end - start);
        }, 0) / completedWithTime.length / 1000) : 0; // seconds

      const averageSessionDuration = sessionsData.length > 0 ?
        Math.round(sessionsData.reduce((sum, session) => {
          const start = new Date(session.started_at).getTime();
          const end = session.last_activity ? new Date(session.last_activity).getTime() : Date.now();
          return sum + (end - start);
        }, 0) / sessionsData.length / 1000) : 0;

      const dropOffRate = totalSessions > 0 ?
        Math.round((abandonedSessions / totalSessions) * 100 * 10) / 10 : 0;

      // Device statistics
      const deviceCounts = new Map<string, number>();
      sessionsData.forEach(session => {
        const metadata = session.metadata as any;
        const device = metadata?.device_info?.type || 'unknown';
        deviceCounts.set(device, (deviceCounts.get(device) || 0) + 1);
      });

      const deviceStats = Array.from(deviceCounts.entries()).map(([device, count]) => ({
        device,
        count,
        percentage: Math.round((count / totalSessions) * 100 * 10) / 10
      })).sort((a, b) => b.count - a.count);

      // Hourly activity
      const hourlyMap = new Map<number, number>();
      sessionsData.forEach(session => {
        const hour = new Date(session.started_at).getHours();
        hourlyMap.set(hour, (hourlyMap.get(hour) || 0) + 1);
      });

      const hourlyActivity = Array.from({ length: 24 }, (_, hour) => ({
        hour,
        count: hourlyMap.get(hour) || 0
      }));

      // Daily trends (last 14 days)
      const dailyMap = new Map<string, { sessions: number; completions: number }>();
      const last14Days = Array.from({ length: 14 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      });

      sessionsData.forEach(session => {
        const date = session.started_at.split('T')[0];
        const current = dailyMap.get(date) || { sessions: 0, completions: 0 };
        current.sessions++;
        if (session.status === 'completed') current.completions++;
        dailyMap.set(date, current);
      });

      const dailyTrends = last14Days.map(date => ({
        date: date.split('-').slice(1).reverse().join('/'), // MM/DD format
        sessions: dailyMap.get(date)?.sessions || 0,
        completions: dailyMap.get(date)?.completions || 0
      })).reverse();

      // Top performing funnels
      const funnelStats = new Map<string, { sessions: number; completions: number }>();
      sessionsData.forEach(session => {
        const current = funnelStats.get(session.funnel_id) || { sessions: 0, completions: 0 };
        current.sessions++;
        if (session.status === 'completed') current.completions++;
        funnelStats.set(session.funnel_id, current);
      });

      const topPerformingFunnels = Array.from(funnelStats.entries())
        .map(([id, stats]) => ({
          id,
          name: funnelsMap.get(id) || 'Unknown Funnel',
          sessions: stats.sessions,
          rate: stats.sessions > 0 ? Math.round((stats.completions / stats.sessions) * 100) : 0
        }))
        .sort((a, b) => b.sessions - a.sessions)
        .slice(0, 5);

      // Real-time metrics
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      const activeUsersNow = sessionsData.filter(s =>
        s.last_activity && s.last_activity > fiveMinutesAgo
      ).length;

      const recentActivity = (analytics || [])
        .filter(a => a.timestamp > fiveMinutesAgo)
        .slice(0, 10)
        .map(activity => ({
          sessionId: activity.session_id || 'unknown',
          funnelId: activity.funnel_id,
          timestamp: activity.timestamp,
          event: activity.event_type
        }));

      const leadGeneration = (results || []).length;

      const metrics: RealMetrics = {
        totalSessions,
        activeSessions,
        completedSessions,
        abandonedSessions,
        conversionRate,
        averageCompletionTime,
        averageSessionDuration,
        dropOffRate,
        deviceStats,
        hourlyActivity,
        dailyTrends,
        leadGeneration,
        topPerformingFunnels,
        activeUsersNow,
        recentActivity,
        lastUpdated: new Date(),
        dataSource: 'supabase'
      };

      this.setCached(cacheKey, metrics, 120000); // 2 minutes
      return metrics;
    }, 'getRealMetrics');
  }

  // ========================================================================
  // PARTICIPANTS DATA
  // ========================================================================

  async getParticipantsData(limit: number = 50, offset: number = 0): Promise<{
    participants: ParticipantData[];
    total: number;
  }> {
    return this.executeWithMetrics(async () => {
      const cacheKey = `participants-${limit}-${offset}`;
      const cached = this.getCached<any>(cacheKey);
      if (cached) return cached;

      // Get sessions with count
      const { data: sessions, error: sessionsError, count } = await supabase
        .from('quiz_sessions')
        .select('*', { count: 'exact' })
        .order('started_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (sessionsError) {
        throw new Error(`Failed to fetch sessions: ${sessionsError.message}`);
      }

      // Get funnels for names
      const { data: funnels } = await supabase
        .from('funnels')
        .select('id, name');

      const funnelsMap = new Map((funnels || []).map(f => [f.id, f.name]));

      // Get results and responses for these sessions
      const sessionIds = (sessions || []).map(s => s.id);

      const [{ data: results }, { data: responses }] = await Promise.all([
        supabase.from('quiz_results').select('*').in('session_id', sessionIds),
        supabase.from('quiz_step_responses').select('session_id').in('session_id', sessionIds)
      ]);

      const resultsMap = new Map((results || []).map(r => [r.session_id, r]));
      const responsesMap = new Map<string, number>();

      (responses || []).forEach(r => {
        responsesMap.set(r.session_id, (responsesMap.get(r.session_id) || 0) + 1);
      });

      const participants: ParticipantData[] = (sessions || []).map(session => {
        const result = resultsMap.get(session.id);
        const responseCount = responsesMap.get(session.id) || 0;

        let timeSpent = 0;
        if (session.completed_at && session.started_at) {
          const start = new Date(session.started_at).getTime();
          const end = new Date(session.completed_at).getTime();
          timeSpent = Math.round((end - start) / 1000); // seconds
        } else if (session.last_activity && session.started_at) {
          const start = new Date(session.started_at).getTime();
          const end = new Date(session.last_activity).getTime();
          timeSpent = Math.round((end - start) / 1000);
        }

        const metadata = session.metadata as any;
        const deviceType = metadata?.device_info?.type || 'unknown';
        const completionPercentage = (session.total_steps || 0) > 0 ?
          Math.round(((session.current_step || 0) / (session.total_steps || 1)) * 100) : 0;

        return {
          sessionId: session.id,
          userId: session.quiz_user_id,
          funnelId: session.funnel_id,
          funnelName: funnelsMap.get(session.funnel_id) || 'Unknown Funnel',
          startedAt: new Date(session.started_at),
          completedAt: session.completed_at ? new Date(session.completed_at) : undefined,
          currentStep: session.current_step || 0,
          totalSteps: session.total_steps || 0,
          status: session.status as 'active' | 'completed' | 'abandoned',
          deviceType,
          responses: responseCount,
          completionPercentage,
          timeSpent,
          finalResult: result ? {
            resultType: result.result_type || 'Unknown',
            resultTitle: result.result_title || 'No title'
          } : undefined
        };
      });

      const data = {
        participants,
        total: count || 0
      };

      this.setCached(cacheKey, data, 180000); // 3 minutes
      return data;
    }, 'getParticipantsData');
  }

  // ========================================================================
  // BUSINESS INTELLIGENCE
  // ========================================================================

  async getBusinessIntelligence(): Promise<{
    totalRevenue: number;
    leadQuality: number;
    customerAcquisitionCost: number;
    lifetimeValue: number;
    monthlyGrowth: number;
    conversionFunnel: Array<{ step: string; conversion: number }>;
  }> {
    return this.executeWithMetrics(async () => {
      const cacheKey = 'business-intelligence';
      const cached = this.getCached<any>(cacheKey);
      if (cached) return cached;

      // Mock business data for now - replace with real business logic
      const intelligence = {
        totalRevenue: 0, // Implement revenue calculation
        leadQuality: 85, // Based on completion rates and engagement
        customerAcquisitionCost: 0,
        lifetimeValue: 0,
        monthlyGrowth: 12.5,
        conversionFunnel: [
          { step: 'Landing', conversion: 100 },
          { step: 'Quiz Start', conversion: 75 },
          { step: 'Mid-Point', conversion: 65 },
          { step: 'Completion', conversion: 45 },
          { step: 'Lead Capture', conversion: 38 }
        ]
      };

      this.setCached(cacheKey, intelligence, 300000); // 5 minutes
      return intelligence;
    }, 'getBusinessIntelligence');
  }
}

// ============================================================================
// EXPORT SINGLETON
// ============================================================================

export const realDataAnalyticsService = new RealDataAnalyticsService();
export default realDataAnalyticsService;
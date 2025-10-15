/**
 * 🎯 CONSOLIDATED FUNNEL SERVICE
 * 
 * Serviço unificado para gerenciar todos os aspectos dos funnels
 * Integra com o UnifiedServiceManager e usa dados reais do Supabase
 */

import { BaseUnifiedService } from './UnifiedServiceManager';
import { supabase } from '@/integrations/supabase/customClient';

// ============================================================================
// TYPES
// ============================================================================

export interface FunnelData {
  id: string;
  name: string;
  description?: string | null;
  user_id: string | null;
  is_published: boolean | null;
  version: number | null;
  settings?: any;
  created_at: string | null;
  updated_at: string | null;
}

export interface FunnelMetrics {
  id: string;
  name: string;
  totalSessions: number;
  completedSessions: number;
  conversionRate: number;
  averageTime: number;
  lastActivity?: string;
  status: 'active' | 'inactive' | 'draft';
}

export interface FunnelAnalytics {
  funnelId: string;
  sessions: number;
  completions: number;
  abandonment: number;
  averageSteps: number;
  deviceBreakdown: Array<{ device: string; count: number }>;
  dailyActivity: Array<{ date: string; sessions: number }>;
}

// ============================================================================
// CONSOLIDATED FUNNEL SERVICE
// ============================================================================

export class ConsolidatedFunnelService extends BaseUnifiedService {
  constructor() {
    super({
      name: 'ConsolidatedFunnelService',
      priority: 1,
      cacheTTL: 300000, // 5 minutes
      retryAttempts: 3,
      timeout: 10000
    });
  }

  getName(): string {
    return 'ConsolidatedFunnelService';
  }

  async healthCheck(): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('funnels')
        .select('count(*)')
        .limit(1);
      
      return !error;
    } catch (error) {
      return false;
    }
  }

  // ========================================================================
  // FUNNEL MANAGEMENT
  // ========================================================================

  async getAllFunnels(): Promise<FunnelData[]> {
    return this.executeWithMetrics(async () => {
      const cacheKey = 'all-funnels';
      const cached = this.getCached<FunnelData[]>(cacheKey);
      if (cached) return cached;

      const { data, error } = await supabase
        .from('funnels')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch funnels: ${error.message}`);
      }

      const funnels = data || [];
      this.setCached(cacheKey, funnels, 300000); // 5 minutes
      return funnels;
    }, 'getAllFunnels');
  }

  async getFunnelById(id: string): Promise<FunnelData | null> {
    return this.executeWithMetrics(async () => {
      const cacheKey = `funnel-${id}`;
      const cached = this.getCached<FunnelData>(cacheKey);
      if (cached) return cached;

      const { data, error } = await supabase
        .from('funnels')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw new Error(`Failed to fetch funnel: ${error.message}`);
      }

      const funnel = data;
      this.setCached(cacheKey, funnel, 300000);
      return funnel;
    }, 'getFunnelById');
  }

  // ========================================================================
  // FUNNEL METRICS
  // ========================================================================

  async getFunnelMetrics(): Promise<FunnelMetrics[]> {
    return this.executeWithMetrics(async () => {
      const cacheKey = 'funnel-metrics';
      const cached = this.getCached<FunnelMetrics[]>(cacheKey);
      if (cached) return cached;

      // Get all funnels
      const funnels = await this.getAllFunnels();
      
      // Get sessions for each funnel
      const { data: sessions } = await supabase
        .from('quiz_sessions')
        .select('funnel_id, status, started_at, completed_at');

      const sessionsMap = new Map<string, any[]>();
      (sessions || []).forEach(session => {
        const funnelSessions = sessionsMap.get(session.funnel_id) || [];
        funnelSessions.push(session);
        sessionsMap.set(session.funnel_id, funnelSessions);
      });

      const metrics: FunnelMetrics[] = funnels.map(funnel => {
        const funnelSessions = sessionsMap.get(funnel.id) || [];
        const completedSessions = funnelSessions.filter(s => s.status === 'completed');
        
        let averageTime = 0;
        if (completedSessions.length > 0) {
          const totalTime = completedSessions.reduce((sum, session) => {
            if (session.completed_at && session.started_at) {
              const start = new Date(session.started_at).getTime();
              const end = new Date(session.completed_at).getTime();
              return sum + (end - start);
            }
            return sum;
          }, 0);
          averageTime = Math.round(totalTime / completedSessions.length / 1000); // seconds
        }

        const lastSession = funnelSessions.sort((a, b) => 
          new Date(b.started_at).getTime() - new Date(a.started_at).getTime()
        )[0];

        return {
          id: funnel.id,
          name: funnel.name,
          totalSessions: funnelSessions.length,
          completedSessions: completedSessions.length,
          conversionRate: funnelSessions.length > 0 ? 
            Math.round((completedSessions.length / funnelSessions.length) * 100) : 0,
          averageTime,
          lastActivity: lastSession?.started_at,
          status: funnel.is_published ? 
            (funnelSessions.length > 0 ? 'active' : 'inactive') : 'draft'
        };
      });

      this.setCached(cacheKey, metrics, 180000); // 3 minutes
      return metrics;
    }, 'getFunnelMetrics');
  }

  async getFunnelAnalytics(funnelId: string): Promise<FunnelAnalytics> {
    return this.executeWithMetrics(async () => {
      const cacheKey = `funnel-analytics-${funnelId}`;
      const cached = this.getCached<FunnelAnalytics>(cacheKey);
      if (cached) return cached;

      const { data: sessions } = await supabase
        .from('quiz_sessions')
        .select('*')
        .eq('funnel_id', funnelId);

      const { data: responses } = await supabase
        .from('quiz_step_responses')
        .select('session_id, step_number')
        .in('session_id', (sessions || []).map(s => s.id));

      const sessionsData = sessions || [];
      const completedSessions = sessionsData.filter(s => s.status === 'completed');
      const abandonedSessions = sessionsData.filter(s => s.status === 'abandoned');

      // Calculate average steps
      const totalSteps = (responses || []).length;
      const averageSteps = sessionsData.length > 0 ? 
        Math.round(totalSteps / sessionsData.length) : 0;

      // Device breakdown
      const deviceCounts = new Map<string, number>();
      sessionsData.forEach(session => {
        const metadata = session.metadata as any;
        const device = metadata?.device_info?.type || 'unknown';
        deviceCounts.set(device, (deviceCounts.get(device) || 0) + 1);
      });

      const deviceBreakdown = Array.from(deviceCounts.entries()).map(([device, count]) => ({
        device,
        count
      }));

      // Daily activity (last 7 days)
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      }).reverse();

      const dailyActivity = last7Days.map(date => {
        const daySessions = sessionsData.filter(s => 
          s.started_at.startsWith(date)
        );
        return {
          date: date.split('-').slice(1).reverse().join('/'), // MM/DD format
          sessions: daySessions.length
        };
      });

      const analytics: FunnelAnalytics = {
        funnelId,
        sessions: sessionsData.length,
        completions: completedSessions.length,
        abandonment: abandonedSessions.length,
        averageSteps,
        deviceBreakdown,
        dailyActivity
      };

      this.setCached(cacheKey, analytics, 300000);
      return analytics;
    }, 'getFunnelAnalytics');
  }

  // ========================================================================
  // FUNNEL OPERATIONS
  // ========================================================================

  async createFunnel(data: Omit<FunnelData, 'created_at' | 'updated_at'>): Promise<FunnelData> {
    return this.executeWithMetrics(async () => {
      const now = new Date().toISOString();
      const funnelData = {
        ...data,
        created_at: now,
        updated_at: now
      };

      const { data: result, error } = await supabase
        .from('funnels')
        .insert([funnelData])
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create funnel: ${error.message}`);
      }

      // Clear cache
      this.clearCache();
      
      return result;
    }, 'createFunnel');
  }

  async updateFunnel(id: string, updates: Partial<FunnelData>): Promise<FunnelData> {
    return this.executeWithMetrics(async () => {
      const { data, error } = await supabase
        .from('funnels')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update funnel: ${error.message}`);
      }

      // Clear cache
      this.clearCache();
      
      return data;
    }, 'updateFunnel');
  }

  async deleteFunnel(id: string): Promise<void> {
    return this.executeWithMetrics(async () => {
      const { error } = await supabase
        .from('funnels')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(`Failed to delete funnel: ${error.message}`);
      }

      // Clear cache
      this.clearCache();
    }, 'deleteFunnel');
  }

  // ========================================================================
  // DASHBOARD SUMMARY
  // ========================================================================

  async getDashboardSummary(): Promise<{
    totalFunnels: number;
    activeFunnels: number;
    draftFunnels: number;
    totalSessions: number;
    totalCompletions: number;
    averageConversionRate: number;
  }> {
    return this.executeWithMetrics(async () => {
      const cacheKey = 'dashboard-summary';
      const cached = this.getCached<any>(cacheKey);
      if (cached) return cached;

      const [funnels, { data: sessions }] = await Promise.all([
        this.getAllFunnels(),
        supabase.from('quiz_sessions').select('status, funnel_id')
      ]);

      const activeFunnels = funnels.filter(f => f.is_published).length;
      const draftFunnels = funnels.filter(f => !f.is_published).length;
      const totalSessions = sessions?.length || 0;
      const totalCompletions = sessions?.filter(s => s.status === 'completed').length || 0;
      
      // Calculate average conversion rate across all funnels
      const metrics = await this.getFunnelMetrics();
      const averageConversionRate = metrics.length > 0 ? 
        Math.round(metrics.reduce((sum, m) => sum + m.conversionRate, 0) / metrics.length) : 0;

      const summary = {
        totalFunnels: funnels.length,
        activeFunnels,
        draftFunnels,
        totalSessions,
        totalCompletions,
        averageConversionRate
      };

      this.setCached(cacheKey, summary, 180000); // 3 minutes
      return summary;
    }, 'getDashboardSummary');
  }

  // ========================================================================
  // CACHE STATS FOR REGISTRY
  // ========================================================================

  getCacheStats(): { size: number; hitRate: number } {
    return {
      size: this.cache.size,
      hitRate: 85 // Mock hit rate for now
    };
  }
}

// ============================================================================
// EXPORT SINGLETON
// ============================================================================

export const consolidatedFunnelService = new ConsolidatedFunnelService();
export default consolidatedFunnelService;
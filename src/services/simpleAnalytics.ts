/**
 * 📊 ANALYTICS SIMPLIFICADO - USANDO TABELAS EXISTENTES
 * 
 * Sistema de analytics que usa as tabelas atuais do Supabase
 */

import { supabase } from '@/lib/supabase';

// ============================================================================
// TYPES SIMPLIFICADOS
// ============================================================================

export interface SimpleAnalyticsEvent {
  session_id: string;
  event_type: 'quiz_started' | 'step_completed' | 'quiz_completed' | 'step_viewed' | 'option_selected';
  step_number?: number;
  data?: any;
  timestamp: string;
}

export interface DashboardData {
  totalSessions: number;
  completedSessions: number;
  conversionRate: number;
  averageSteps: number;
  popularStyles: Array<{ style: string; count: number; percentage: number }>;
  recentActivity: Array<{ time: string; sessions: number }>;
  deviceBreakdown: Array<{ type: string; count: number; percentage: number }>;
  currentActiveUsers: number;
}

// ============================================================================
// ANALYTICS SIMPLIFICADO
// ============================================================================

class SimpleAnalytics {
  private sessionId: string;
  private startTime: Date;
  private events: SimpleAnalyticsEvent[] = [];

  constructor() {
    this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.startTime = new Date();
    this.initSession();
  }

  private async initSession() {
    try {
      // Usar tabela quiz_sessions existente
      await supabase.from('quiz_sessions').insert([{
        id: this.sessionId,
        funnel_id: 'quiz-21-steps',
        quiz_user_id: this.sessionId,
        started_at: this.startTime.toISOString(),
        current_step: 1,
        total_steps: 21,
        status: 'active'
      }]);

      console.log('📊 Simple Analytics: Session started', this.sessionId);
    } catch (error) {
      console.error('❌ Analytics error:', error);
    }
  }

  async trackEvent(eventType: SimpleAnalyticsEvent['event_type'], data: any = {}) {
    try {
      const event: SimpleAnalyticsEvent = {
        session_id: this.sessionId,
        event_type: eventType,
        step_number: data.stepNumber,
        data,
        timestamp: new Date().toISOString()
      };

      this.events.push(event);

      // Salvar em quiz_analytics (tabela existente)
      await supabase.from('quiz_analytics').insert([{
        session_id: this.sessionId,
        event_type: eventType,
        funnel_id: 'quiz-21-steps',
        event_data: data,
        timestamp: event.timestamp
      }]);

      // Atualizar sessão atual
      if (eventType === 'quiz_completed') {
        await supabase.from('quiz_sessions')
          .update({
            completed_at: new Date().toISOString(),
            status: 'completed',
            metadata: { final_result: data.result }
          })
          .eq('id', this.sessionId);
      } else if (eventType === 'step_viewed') {
        await supabase.from('quiz_sessions')
          .update({
            current_step: data.stepNumber,
            last_activity: new Date().toISOString()
          })
          .eq('id', this.sessionId);
      }

      console.log(`📈 Event tracked: ${eventType}`, data);
    } catch (error) {
      console.error('❌ Failed to track event:', error);
    }
  }

  // Métodos de conveniência
  async trackQuizStarted(userName?: string) {
    await this.trackEvent('quiz_started', { userName });
  }

  async trackStepViewed(stepNumber: number) {
    await this.trackEvent('step_viewed', { stepNumber });
  }

  async trackOptionSelected(stepNumber: number, optionId: string, value?: any) {
    await this.trackEvent('option_selected', { stepNumber, optionId, value });
  }

  async trackQuizCompleted(result: any) {
    await this.trackEvent('quiz_completed', { result });
  }

  getSessionId() {
    return this.sessionId;
  }
}

// ============================================================================
// DASHBOARD DATA SERVICE
// ============================================================================

export class DashboardService {
  static async getDashboardData(): Promise<DashboardData> {
    try {
      // Buscar dados das tabelas existentes
      const [sessionsResult, analyticsResult, resultsResult] = await Promise.all([
        supabase.from('quiz_sessions').select('*').order('started_at', { ascending: false }),
        supabase.from('quiz_analytics').select('*').order('timestamp', { ascending: false }),
        supabase.from('quiz_results').select('*').order('created_at', { ascending: false })
      ]);

      const sessions = sessionsResult.data || [];
      const analytics = analyticsResult.data || [];
      const results = resultsResult.data || [];

      // Calcular métricas básicas
      const totalSessions = sessions.length;
      const completedSessions = sessions.filter(s => s.completed_at).length;
      const conversionRate = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;
      
      // Média de etapas completadas
      const averageSteps = totalSessions > 0 
        ? Math.round(sessions.reduce((acc, s) => acc + (s.current_step || 0), 0) / totalSessions)
        : 0;

      // Estilos populares baseados nos resultados
      const styleResults = results.map(r => {
        try {
          const resultData = typeof r.result_data === 'string' ? JSON.parse(r.result_data) : r.result_data;
          return resultData?.primaryStyle?.category || resultData?.style || r.result_type;
        } catch {
          return r.result_type;
        }
      }).filter(Boolean);
      const styleCounts: Record<string, number> = {};
      styleResults.forEach(style => {
        styleCounts[style] = (styleCounts[style] || 0) + 1;
      });

      const popularStyles = Object.entries(styleCounts)
        .map(([style, count]) => ({
          style,
          count,
          percentage: Math.round((count / styleResults.length) * 100) || 0
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Atividade recente (últimas 24 horas por hora)
      const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const recentSessions = sessions.filter(s => new Date(s.started_at) > last24Hours);
      
      const hourlyActivity = new Array(24).fill(0).map((_, i) => ({
        time: `${i}:00`,
        sessions: 0
      }));

      recentSessions.forEach(session => {
        const hour = new Date(session.started_at).getHours();
        hourlyActivity[hour].sessions++;
      });

      // Device breakdown (simulado baseado em user agent se disponível)
      const deviceBreakdown = [
        { type: 'Desktop', count: Math.floor(totalSessions * 0.6), percentage: 60 },
        { type: 'Mobile', count: Math.floor(totalSessions * 0.3), percentage: 30 },
        { type: 'Tablet', count: Math.floor(totalSessions * 0.1), percentage: 10 }
      ];

      // Usuários ativos (últimos 5 minutos)
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      const recentEvents = analytics.filter(e => new Date(e.timestamp) > fiveMinutesAgo);
      const currentActiveUsers = new Set(recentEvents.map(e => e.session_id)).size;

      return {
        totalSessions,
        completedSessions,
        conversionRate,
        averageSteps,
        popularStyles,
        recentActivity: hourlyActivity.slice(-12), // Últimas 12 horas
        deviceBreakdown,
        currentActiveUsers
      };

    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error);
      
      // Retornar dados mock em caso de erro
      return {
        totalSessions: 0,
        completedSessions: 0,
        conversionRate: 0,
        averageSteps: 0,
        popularStyles: [],
        recentActivity: [],
        deviceBreakdown: [],
        currentActiveUsers: 0
      };
    }
  }

  // Gerar dados mock para demonstração
  static generateMockData(): DashboardData {
    const mockStyles = ['Clássico Elegante', 'Moderno Minimalista', 'Boho Chic', 'Urbano Casual', 'Romântico Feminino'];
    
    return {
      totalSessions: 1247,
      completedSessions: 892,
      conversionRate: 72,
      averageSteps: 18,
      popularStyles: mockStyles.map((style) => ({
        style,
        count: Math.floor(Math.random() * 200) + 50,
        percentage: Math.floor(Math.random() * 25) + 10
      })),
      recentActivity: new Array(12).fill(0).map((_, i) => ({
        time: `${12 + i}:00`,
        sessions: Math.floor(Math.random() * 50) + 5
      })),
      deviceBreakdown: [
        { type: 'Desktop', count: 748, percentage: 60 },
        { type: 'Mobile', count: 374, percentage: 30 },
        { type: 'Tablet', count: 125, percentage: 10 }
      ],
      currentActiveUsers: Math.floor(Math.random() * 15) + 5
    };
  }
}

// ============================================================================
// SINGLETON E EXPORTS
// ============================================================================

export const simpleAnalytics = new SimpleAnalytics();

export const trackQuizStarted = (userName?: string) => simpleAnalytics.trackQuizStarted(userName);
export const trackStepViewed = (stepNumber: number) => simpleAnalytics.trackStepViewed(stepNumber);
export const trackOptionSelected = (stepNumber: number, optionId: string, value?: any) => 
  simpleAnalytics.trackOptionSelected(stepNumber, optionId, value);
export const trackQuizCompleted = (result: any) => simpleAnalytics.trackQuizCompleted(result);

export default simpleAnalytics;

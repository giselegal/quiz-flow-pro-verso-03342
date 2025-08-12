// =============================================================================
// SISTEMA DE ANALYTICS BÁSICO
// Tracking de métricas essenciais do quiz/funil
// =============================================================================

import { supabase } from '../lib/supabase';

// =============================================================================
// TIPOS
// =============================================================================

export interface AnalyticsEvent {
  id?: string;
  quiz_id: string;
  user_id?: string;
  session_id: string;
  event_type:
    | 'quiz_started'
    | 'question_answered'
    | 'quiz_completed'
    | 'page_viewed'
    | 'button_clicked'
    | 'form_submitted';
  event_data: Record<string, any>;
  timestamp: string;
  user_agent?: string;
  ip_address?: string;
  page_url?: string;
}

export interface AnalyticsMetrics {
  quiz_id: string;
  total_views: number;
  total_starts: number;
  total_completions: number;
  completion_rate: number;
  average_time: number;
  bounce_rate: number;
  conversion_rate: number;
  last_updated: string;
}

export interface ConversionFunnel {
  step_name: string;
  step_order: number;
  total_users: number;
  drop_off_rate: number;
  conversion_rate: number;
}

// =============================================================================
// SERVIÇO DE ANALYTICS
// =============================================================================

export class AnalyticsService {
  private static instance: AnalyticsService;
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // =============================================================================
  // TRACKING DE EVENTOS
  // =============================================================================

  async trackEvent(event: Omit<AnalyticsEvent, 'id' | 'timestamp' | 'session_id'>): Promise<void> {
    try {
      const eventData: AnalyticsEvent = {
        ...event,
        session_id: this.sessionId,
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
        page_url: window.location.href,
      };

      console.log('📊 [Analytics] Tracking event:', eventData);

      // Placeholder - analytics_events table doesn't exist
      console.log('Would track event:', eventData);
      // Fallback para localStorage se Supabase falhar
      this.saveEventLocally(eventData);
    } catch (error) {
      console.error('❌ [Analytics] Error tracking event:', error);
      this.saveEventLocally(event as AnalyticsEvent);
    }
  }

  private saveEventLocally(event: AnalyticsEvent): void {
    try {
      const localEvents = JSON.parse(localStorage.getItem('analytics_events') || '[]');
      localEvents.push(event);
      localStorage.setItem('analytics_events', JSON.stringify(localEvents));
      console.log('💾 [Analytics] Event saved locally');
    } catch (error) {
      console.error('❌ [Analytics] Failed to save event locally:', error);
    }
  }

  // =============================================================================
  // MÉTODOS DE TRACKING ESPECÍFICOS
  // =============================================================================

  async trackQuizStart(quizId: string, userId?: string): Promise<void> {
    await this.trackEvent({
      quiz_id: quizId,
      user_id: userId,
      event_type: 'quiz_started',
      event_data: {
        start_time: new Date().toISOString(),
      },
    });
  }

  async trackQuestionAnswer(
    quizId: string,
    questionId: string,
    answer: any,
    userId?: string
  ): Promise<void> {
    await this.trackEvent({
      quiz_id: quizId,
      user_id: userId,
      event_type: 'question_answered',
      event_data: {
        question_id: questionId,
        answer: answer,
        answer_time: new Date().toISOString(),
      },
    });
  }

  async trackQuizCompletion(quizId: string, result: any, userId?: string): Promise<void> {
    await this.trackEvent({
      quiz_id: quizId,
      user_id: userId,
      event_type: 'quiz_completed',
      event_data: {
        result: result,
        completion_time: new Date().toISOString(),
      },
    });
  }

  async trackPageView(quizId: string, pageId: string, userId?: string): Promise<void> {
    await this.trackEvent({
      quiz_id: quizId,
      user_id: userId,
      event_type: 'page_viewed',
      event_data: {
        page_id: pageId,
        view_time: new Date().toISOString(),
      },
    });
  }

  async trackButtonClick(
    quizId: string,
    buttonId: string,
    buttonText: string,
    userId?: string
  ): Promise<void> {
    await this.trackEvent({
      quiz_id: quizId,
      user_id: userId,
      event_type: 'button_clicked',
      event_data: {
        button_id: buttonId,
        button_text: buttonText,
        click_time: new Date().toISOString(),
      },
    });
  }

  async trackFormSubmission(quizId: string, formData: any, userId?: string): Promise<void> {
    await this.trackEvent({
      quiz_id: quizId,
      user_id: userId,
      event_type: 'form_submitted',
      event_data: {
        form_data: formData,
        submit_time: new Date().toISOString(),
      },
    });
  }

  // =============================================================================
  // ANÁLISE DE MÉTRICAS
  // =============================================================================

  async getQuizMetrics(quizId: string): Promise<AnalyticsMetrics | null> {
    try {
      // Placeholder - analytics_events table doesn't exist
      console.log('Would get quiz metrics for:', quizId);
      return null;
    } catch (error) {
      console.error('❌ [Analytics] Error getting metrics:', error);
      return null;
    }
  }

  private calculateMetrics(
    events: AnalyticsEvent[]
  ): Omit<AnalyticsMetrics, 'quiz_id' | 'last_updated'> {
    const totalViews = events.filter(e => e.event_type === 'page_viewed').length;
    const totalStarts = events.filter(e => e.event_type === 'quiz_started').length;
    const totalCompletions = events.filter(e => e.event_type === 'quiz_completed').length;

    const completionRate = totalStarts > 0 ? (totalCompletions / totalStarts) * 100 : 0;
    const conversionRate = totalViews > 0 ? (totalCompletions / totalViews) * 100 : 0;
    const bounceRate = totalViews > 0 ? ((totalViews - totalStarts) / totalViews) * 100 : 0;

    // Calcular tempo médio (simplificado)
    const startEvents = events.filter(e => e.event_type === 'quiz_started');
    const completionEvents = events.filter(e => e.event_type === 'quiz_completed');

    let averageTime = 0;
    if (startEvents.length > 0 && completionEvents.length > 0) {
      const times = completionEvents
        .map(completion => {
          const start = startEvents.find(s => s.session_id === completion.session_id);
          if (start) {
            return new Date(completion.timestamp).getTime() - new Date(start.timestamp).getTime();
          }
          return 0;
        })
        .filter(time => time > 0);

      if (times.length > 0) {
        averageTime = times.reduce((sum, time) => sum + time, 0) / times.length;
      }
    }

    return {
      total_views: totalViews,
      total_starts: totalStarts,
      total_completions: totalCompletions,
      completion_rate: Math.round(completionRate * 100) / 100,
      average_time: Math.round(averageTime / 1000), // em segundos
      bounce_rate: Math.round(bounceRate * 100) / 100,
      conversion_rate: Math.round(conversionRate * 100) / 100,
    };
  }

  async getConversionFunnel(quizId: string): Promise<ConversionFunnel[]> {
    try {
      // Placeholder - analytics_events table doesn't exist
      console.log('Would get conversion funnel for:', quizId);
      return [];
    } catch (error) {
      console.error('❌ [Analytics] Error getting conversion funnel:', error);
      return [];
    }
  }

  // =============================================================================
  // SINCRONIZAÇÃO DE DADOS LOCAIS
  // =============================================================================

  async syncLocalEvents(): Promise<void> {
    try {
      const localEvents = JSON.parse(localStorage.getItem('analytics_events') || '[]');

      if (localEvents.length === 0) {
        return;
      }

      console.log(`🔄 [Analytics] Syncing ${localEvents.length} local events...`);

      // Placeholder - analytics_events table doesn't exist
      console.log(`Would sync ${localEvents.length} local events`);
    } catch (error) {
      console.error('❌ [Analytics] Error syncing local events:', error);
    }
  }
}

// =============================================================================
// INSTÂNCIA SINGLETON
// =============================================================================

export const analytics = AnalyticsService.getInstance();

// =============================================================================
// HOOKS PARA REACT
// =============================================================================

export const useAnalytics = () => {
  return {
    trackQuizStart: analytics.trackQuizStart.bind(analytics),
    trackQuestionAnswer: analytics.trackQuestionAnswer.bind(analytics),
    trackQuizCompletion: analytics.trackQuizCompletion.bind(analytics),
    trackPageView: analytics.trackPageView.bind(analytics),
    trackButtonClick: analytics.trackButtonClick.bind(analytics),
    trackFormSubmission: analytics.trackFormSubmission.bind(analytics),
    getQuizMetrics: analytics.getQuizMetrics.bind(analytics),
    getConversionFunnel: analytics.getConversionFunnel.bind(analytics),
    syncLocalEvents: analytics.syncLocalEvents.bind(analytics),
  };
};

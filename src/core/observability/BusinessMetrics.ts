/**
 * 📊 BUSINESS METRICS DASHBOARD - PHASE 3: OBSERVABILITY
 * Coleta e análise de métricas de negócio em tempo real
 */

import { structuredLogger } from './StructuredLogger';

export interface UserInteraction {
  action: string;
  component: string;
  timestamp: number;
  userId?: string;
  sessionId: string;
  metadata?: Record<string, any>;
}

export interface ConversionEvent {
  event: string;
  value?: number;
  currency?: string;
  timestamp: number;
  funnelStep?: number;
  userId?: string;
  sessionId: string;
}

export interface BusinessMetricsSnapshot {
  totalInteractions: number;
  uniqueUsers: number;
  conversionRate: number;
  averageSessionDuration: number;
  topActions: Array<{ action: string; count: number }>;
  funnelDropoffs: Array<{ step: number; dropoffRate: number }>;
  timestamp: number;
}

class BusinessMetrics {
  private interactions: UserInteraction[] = [];
  private conversions: ConversionEvent[] = [];
  private sessionStart: number;
  private sessionId: string;
  private flushInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.sessionStart = Date.now();
    this.sessionId = this.generateSessionId();
    this.setupAutoFlush();
    this.setupEventListeners();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private setupAutoFlush() {
    // Flush metrics every 60 seconds
    this.flushInterval = setInterval(() => {
      this.flushMetrics();
    }, 60000);
  }

  private setupEventListeners() {
    if (typeof window === 'undefined') return;

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.trackInteraction('page_hidden', 'document');
      } else {
        this.trackInteraction('page_visible', 'document');
      }
    });

    // Track before unload
    window.addEventListener('beforeunload', () => {
      this.trackInteraction('session_end', 'window', {
        sessionDuration: Date.now() - this.sessionStart
      });
      this.flushMetrics();
    });
  }

  /**
   * Rastrear interação do usuário
   */
  trackInteraction(
    action: string,
    component: string,
    metadata?: Record<string, any>,
    userId?: string
  ) {
    const interaction: UserInteraction = {
      action,
      component,
      timestamp: Date.now(),
      userId,
      sessionId: this.sessionId,
      metadata
    };

    this.interactions.push(interaction);
    
    structuredLogger.info('User interaction tracked', {
      action,
      component,
      userId,
      category: 'user_interaction',
      ...metadata
    });

    // Keep only last 1000 interactions in memory
    if (this.interactions.length > 1000) {
      this.interactions = this.interactions.slice(-1000);
    }
  }

  /**
   * Rastrear evento de conversão
   */
  trackConversion(
    event: string,
    value?: number,
    currency = 'USD',
    funnelStep?: number,
    userId?: string
  ) {
    const conversion: ConversionEvent = {
      event,
      value,
      currency,
      timestamp: Date.now(),
      funnelStep,
      userId,
      sessionId: this.sessionId
    };

    this.conversions.push(conversion);
    
    structuredLogger.info('Conversion event tracked', {
      event,
      value,
      currency,
      funnelStep,
      userId,
      category: 'conversion'
    });

    // Keep only last 100 conversions in memory
    if (this.conversions.length > 100) {
      this.conversions = this.conversions.slice(-100);
    }
  }

  /**
   * Rastrear progresso no funil
   */
  trackFunnelStep(step: number, stepName: string, userId?: string) {
    this.trackInteraction('funnel_step', 'funnel', {
      step,
      stepName,
      progress: `${step}/21` // Assuming 21-step funnel
    }, userId);
  }

  /**
   * Rastrear abandono no funil
   */
  trackFunnelDropoff(step: number, reason?: string, userId?: string) {
    this.trackInteraction('funnel_dropoff', 'funnel', {
      step,
      reason,
      sessionDuration: Date.now() - this.sessionStart
    }, userId);
  }

  /**
   * Rastrear erro de UI
   */
  trackUIError(error: string, component: string, severity: 'low' | 'medium' | 'high' = 'medium') {
    this.trackInteraction('ui_error', component, {
      error,
      severity,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      url: typeof window !== 'undefined' ? window.location.href : ''
    });
  }

  /**
   * Obter snapshot das métricas atuais
   */
  getSnapshot(): BusinessMetricsSnapshot {
    const now = Date.now();
    const uniqueUsers = new Set(
      this.interactions
        .filter(i => i.userId)
        .map(i => i.userId)
    ).size;

    const totalInteractions = this.interactions.length;
    const totalConversions = this.conversions.length;
    const conversionRate = totalInteractions > 0 ? (totalConversions / totalInteractions) * 100 : 0;
    
    // Calculate average session duration
    const sessionDurations = this.interactions
      .filter(i => i.action === 'session_end' && i.metadata?.sessionDuration)
      .map(i => i.metadata!.sessionDuration as number);
    
    const averageSessionDuration = sessionDurations.length > 0 
      ? sessionDurations.reduce((a, b) => a + b, 0) / sessionDurations.length 
      : now - this.sessionStart;

    // Top actions
    const actionCounts: Record<string, number> = {};
    this.interactions.forEach(i => {
      actionCounts[i.action] = (actionCounts[i.action] || 0) + 1;
    });
    
    const topActions = Object.entries(actionCounts)
      .map(([action, count]) => ({ action, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Funnel dropoffs
    const funnelSteps: Record<number, number> = {};
    const funnelDropoffs: Record<number, number> = {};
    
    this.interactions.forEach(i => {
      if (i.action === 'funnel_step' && i.metadata?.step) {
        const step = i.metadata.step as number;
        funnelSteps[step] = (funnelSteps[step] || 0) + 1;
      } else if (i.action === 'funnel_dropoff' && i.metadata?.step) {
        const step = i.metadata.step as number;
        funnelDropoffs[step] = (funnelDropoffs[step] || 0) + 1;
      }
    });

    const funnelDropoffRates = Object.keys(funnelSteps).map(step => {
      const stepNum = parseInt(step);
      const completed = funnelSteps[stepNum] || 0;
      const dropped = funnelDropoffs[stepNum] || 0;
      const total = completed + dropped;
      const dropoffRate = total > 0 ? (dropped / total) * 100 : 0;
      
      return { step: stepNum, dropoffRate };
    });

    return {
      totalInteractions,
      uniqueUsers,
      conversionRate,
      averageSessionDuration,
      topActions,
      funnelDropoffs: funnelDropoffRates,
      timestamp: now
    };
  }

  /**
   * Obter métricas específicas do funil
   */
  getFunnelMetrics() {
    const funnelInteractions = this.interactions.filter(i => 
      i.component === 'funnel' && i.metadata?.step
    );

    const stepMetrics: Record<number, {
      entries: number;
      completions: number;
      dropoffs: number;
      averageTime: number;
    }> = {};

    funnelInteractions.forEach(interaction => {
      const step = interaction.metadata!.step as number;
      
      if (!stepMetrics[step]) {
        stepMetrics[step] = { entries: 0, completions: 0, dropoffs: 0, averageTime: 0 };
      }

      if (interaction.action === 'funnel_step') {
        stepMetrics[step].entries++;
      } else if (interaction.action === 'funnel_dropoff') {
        stepMetrics[step].dropoffs++;
      }
    });

    return stepMetrics;
  }

  /**
   * Flush metrics to analytics service
   */
  private async flushMetrics() {
    if (this.interactions.length === 0 && this.conversions.length === 0) return;

    const snapshot = this.getSnapshot();
    
    try {
      // Send to analytics service
      await this.sendToAnalytics(snapshot);
      
      structuredLogger.info('Business metrics flushed', {
        totalInteractions: snapshot.totalInteractions,
        uniqueUsers: snapshot.uniqueUsers,
        conversionRate: snapshot.conversionRate,
        category: 'business_metrics'
      });
    } catch (error) {
      structuredLogger.error('Failed to flush business metrics', { error });
    }
  }

  private async sendToAnalytics(snapshot: BusinessMetricsSnapshot) {
    // Implementation would send to your analytics service
    // For now, just log to structured logger
    structuredLogger.info('Analytics snapshot', {
      snapshot,
      category: 'analytics'
    });
  }

  /**
   * Get real-time dashboard data
   */
  getDashboardData() {
    const snapshot = this.getSnapshot();
    const funnelMetrics = this.getFunnelMetrics();
    
    return {
      overview: {
        totalInteractions: snapshot.totalInteractions,
        uniqueUsers: snapshot.uniqueUsers,
        conversionRate: `${snapshot.conversionRate.toFixed(2)}%`,
        avgSessionDuration: `${Math.round(snapshot.averageSessionDuration / 1000)}s`
      },
      topActions: snapshot.topActions.slice(0, 5),
      funnelHealth: {
        totalSteps: Object.keys(funnelMetrics).length,
        averageDropoffRate: snapshot.funnelDropoffs.reduce((sum, item) => sum + item.dropoffRate, 0) / Math.max(snapshot.funnelDropoffs.length, 1),
        criticalDropoffs: snapshot.funnelDropoffs.filter(item => item.dropoffRate > 20)
      },
      recentActivity: this.interactions.slice(-10).reverse()
    };
  }

  destroy() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
    this.flushMetrics();
  }
}

// Singleton instance
export const businessMetrics = new BusinessMetrics();

export default businessMetrics;

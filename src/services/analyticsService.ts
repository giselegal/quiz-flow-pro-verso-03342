/**
 * 📊 ANALYTICS SERVICE - Sistema de Analytics e Métricas Avançadas
 */

export interface Metric {
  id: string;
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
  category: 'performance' | 'collaboration' | 'versioning' | 'usage' | 'system';
  tags: Record<string, string>;
  metadata?: Record<string, any>;
}

export interface AnalyticsEvent {
  id: string;
  type: string;
  userId: string;
  funnelId: string;
  sessionId?: string;
  timestamp: Date;
  properties: Record<string, any>;
  context: {
    userAgent: string;
    url: string;
    referrer?: string;
    screenResolution: string;
    timezone: string;
  };
}

export interface Alert {
  id: string;
  type: 'performance' | 'collaboration' | 'versioning' | 'usage' | 'system';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  threshold: number;
  currentValue: number;
  timestamp: Date;
  resolved: boolean;
  resolvedAt?: Date;
  resolvedBy?: string;
}

class AnalyticsService {
  private metrics: Map<string, Metric[]> = new Map();
  private events: AnalyticsEvent[] = [];
  private alerts: Alert[] = [];

  constructor() {
    console.log('✅ AnalyticsService inicializado');
  }

  async recordMetric(
    name: string,
    value: number,
    unit: string,
    category: Metric['category'],
    tags: Record<string, string> = {}
  ): Promise<Metric> {
    const metric: Metric = {
      id: `metric_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      value,
      unit,
      timestamp: new Date(),
      category,
      tags
    };

    const categoryMetrics = this.metrics.get(category) || [];
    categoryMetrics.push(metric);
    this.metrics.set(category, categoryMetrics);

    console.log(`📊 Métrica registrada: ${name} = ${value} ${unit}`);
    return metric;
  }

  async recordEvent(
    type: string,
    userId: string,
    funnelId: string,
    properties: Record<string, any> = {}
  ): Promise<AnalyticsEvent> {
    const event: AnalyticsEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      userId,
      funnelId,
      timestamp: new Date(),
      properties,
      context: {
        userAgent: navigator.userAgent,
        url: window.location.href,
        referrer: document.referrer,
        screenResolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    };

    this.events.push(event);
    console.log(`🎯 Evento registrado: ${type} para usuário ${userId}`);
    return event;
  }

  getMetricsByCategory(category: Metric['category']): Metric[] {
    return this.metrics.get(category) || [];
  }

  getEventsByType(type: string): AnalyticsEvent[] {
    return this.events.filter(e => e.type === type);
  }

  getActiveAlerts(): Alert[] {
    return this.alerts.filter(a => !a.resolved);
  }
}

export const analyticsService = new AnalyticsService();
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

export class AnalyticsService {
    private metrics: Map<string, Metric[]> = new Map();
    private events: AnalyticsEvent[] = [];
    private alerts: Alert[] = [];
    private sessionMetrics: Record<string, number> = {};

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

    trackEvent(eventName: string, properties: Record<string, any> = {}): void {
        console.log(`📊 Tracking event: ${eventName}`, properties);
    }

    // Métodos adicionais usados por useMonitoring (no-op / simples por enquanto)
    trackError(error: Error, component?: string) {
        console.log('🚨 trackError', { message: error.message, component });
        this.recordMetric('errors.total', 1, 'count', 'system', { component: component || 'unknown' });
    }

    trackPerformance(metric: string, value: number, unit: string = 'ms') {
        this.recordMetric(metric, value, unit, 'performance');
        this.sessionMetrics[metric] = value;
    }

    trackEditorAction(action: string, details: Record<string, any> = {}) {
        console.log('🛠️ editorAction', action, details);
        this.recordEvent('editor_action', details.userId || 'anonymous', details.funnelId || 'unknown', { action, ...details });
    }

    getSessionMetrics() {
        return { ...this.sessionMetrics };
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

// Export singleton instance
export const analyticsService = new AnalyticsService();

// Missing exports for AnalyticsDashboard
export interface AnalyticsMetrics {
    total_views: number;
    total_starts: number;
    total_completions: number;
    completion_rate: number;
    conversion_rate: number;
    bounce_rate: number;
    average_time: number;
    last_updated: string;
}

export interface ConversionFunnel {
    step_name: string;
    total_users: number;
    conversion_rate: number;
    drop_off_rate: number;
}

export const useAnalytics = () => ({
    getQuizMetrics: async (quizId: string): Promise<AnalyticsMetrics> => ({
        total_views: 0,
        total_starts: 0,
        total_completions: 0,
        completion_rate: 0,
        conversion_rate: 0,
        bounce_rate: 0,
        average_time: 0,
        last_updated: new Date().toISOString(),
    }),
    getConversionFunnel: async (quizId: string): Promise<ConversionFunnel[]> => [],
    syncLocalEvents: async () => Promise.resolve(),
});
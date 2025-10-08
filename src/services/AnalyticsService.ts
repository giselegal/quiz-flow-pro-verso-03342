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
    private storageKey = 'analytics.v1';
    private maxStoredEvents = 200;
    private maxStoredMetricsPerCategory = 100;

    constructor() {
        console.log('✅ AnalyticsService inicializado');
        this.restoreFromStorage();
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
        this.persistToStorage();
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
        this.pruneIfNeeded();
        this.persistToStorage();
        return event;
    }

    trackEvent(eventName: string, properties: Record<string, any> = {}): void {
        console.log(`📊 Tracking event: ${eventName}`, properties);
        // Mapear para recordEvent mínimo (anônimo/sem funil) para rastreabilidade leve
        this.recordEvent(eventName, 'anonymous', 'unknown', properties).catch(() => { /* noop */ });
    }

    // Métodos adicionais usados por useMonitoring (no-op / simples por enquanto)
    trackError(error: Error, component?: string) {
        console.log('🚨 trackError', { message: error.message, component });
        this.recordMetric('errors.total', 1, 'count', 'system', { component: component || 'unknown' });
        this.recordEvent('error', 'anonymous', 'unknown', { message: error.message, component }).catch(() => { /* noop */ });
    }

    trackPerformance(metric: string, value: number, unit: string = 'ms') {
        this.recordMetric(metric, value, unit, 'performance');
        this.sessionMetrics[metric] = value;
        this.persistToStorage();
    }

    trackEditorAction(action: string, details: Record<string, any> = {}) {
        console.log('🛠️ editorAction', action, details);
        this.recordEvent('editor_action', details.userId || 'anonymous', details.funnelId || 'unknown', { action, ...details });
    }

    getSessionMetrics() {
        return { ...this.sessionMetrics };
    }

    // =============================================================
    // Local Persistence (Browser Only)
    // =============================================================
    private isBrowser(): boolean {
        return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
    }

    private persistToStorage() {
        if (!this.isBrowser()) return;
        try {
            const payload = {
                metrics: Array.from(this.metrics.entries()).map(([cat, arr]) => [cat, arr]),
                events: this.events,
                sessionMetrics: this.sessionMetrics,
                ts: Date.now()
            };
            localStorage.setItem(this.storageKey, JSON.stringify(payload));
        } catch (e) {
            // Falha silenciosa
        }
    }

    private restoreFromStorage() {
        if (!this.isBrowser()) return;
        try {
            const raw = localStorage.getItem(this.storageKey);
            if (!raw) return;
            const data = JSON.parse(raw);
            if (data.metrics) {
                data.metrics.forEach(([cat, arr]: [string, any[]]) => {
                    this.metrics.set(cat, arr.map(m => ({ ...m, timestamp: new Date(m.timestamp) })));
                });
            }
            if (data.events) {
                this.events = data.events.map((e: any) => ({ ...e, timestamp: new Date(e.timestamp) }));
            }
            if (data.sessionMetrics) this.sessionMetrics = data.sessionMetrics;
        } catch (e) {
            // Ignora corrupção
        }
    }

    private pruneIfNeeded() {
        // Limitar eventos
        if (this.events.length > this.maxStoredEvents) {
            this.events.splice(0, this.events.length - this.maxStoredEvents);
        }
        // Limitar métricas por categoria
        for (const [cat, arr] of this.metrics.entries()) {
            if (arr.length > this.maxStoredMetricsPerCategory) {
                this.metrics.set(cat, arr.slice(-this.maxStoredMetricsPerCategory));
            }
        }
    }

    flushStorage() {
        if (!this.isBrowser()) return;
        try {
            localStorage.removeItem(this.storageKey);
        } catch { /* noop */ }
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
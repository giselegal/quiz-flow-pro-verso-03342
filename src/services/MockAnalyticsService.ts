/**
 * 📊 MOCK ANALYTICS SERVICE - Temporário para resolver dependências
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

// Mock service
export const analyticsService = {
    trackEvent: (event: Partial<AnalyticsEvent>) => {
        console.log('📊 Mock Analytics Event:', event);
    },
    recordMetric: (metric: Partial<Metric>) => {
        console.log('📊 Mock Analytics Metric:', metric);
    },
    getMetrics: () => [] as Metric[],
    getEvents: () => [] as AnalyticsEvent[],
    getAlerts: () => [] as Alert[],
    createAlert: (alert: Partial<Alert>) => {
        console.log('📊 Mock Analytics Alert:', alert);
    },
    resolveAlert: (alertId: string) => {
        console.log('📊 Mock Alert Resolved:', alertId);
    }
};

export default analyticsService;
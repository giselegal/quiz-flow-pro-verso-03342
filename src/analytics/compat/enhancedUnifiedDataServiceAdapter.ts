/**
 * Adapter de compatibilidade para substituir EnhancedUnifiedDataService.
 * Fornece apenas métodos mínimos usados pelos dashboards até migração completa.
 * Futuro: remover após convergir tudo em unifiedAnalyticsEngine/unifiedEventTracker.
 */
import { unifiedAnalyticsEngine } from '@/analytics/UnifiedAnalyticsEngine';

// Tipos simplificados
export interface RealtimeMetricsSnapshot {
    activeUsers: number;
    funnelId?: string;
    timestamp: string;
    styleDistribution?: Record<string, number>;
    answersHeatmap?: Record<string, any>;
    // Dashboard properties
    totalSessions: number;
    completedSessions: number;
    conversionRate: number;
    conversionsByHour: Array<{ hour: string; conversions: number }>;
    topDevices: Array<{ name: string; count: number; percentage: number }>;
    activeUsersRealTime: number;
}

export const enhancedUnifiedDataServiceAdapter = {
    DEPRECATED: true,
    async getRealTimeMetrics(funnelId?: string): Promise<RealtimeMetricsSnapshot> {
        const snap = await unifiedAnalyticsEngine.getRealtimeSnapshot(funnelId || 'default');
        const styles = await unifiedAnalyticsEngine.getStyleDistribution(funnelId || 'default');
        const summary = await unifiedAnalyticsEngine.getFunnelSummary(funnelId || 'default');
        
        return {
            activeUsers: snap.activeUsers || 0,
            funnelId,
            timestamp: new Date().toISOString(),
            styleDistribution: styles.reduce((acc, s) => ({ ...acc, [s.style]: s.count }), {}),
            answersHeatmap: {},
            // Dashboard properties
            totalSessions: summary.totalSessions || 0,
            completedSessions: summary.completedSessions || 0,
            conversionRate: summary.conversionRate || 0,
            conversionsByHour: [],
            topDevices: [
                { name: 'Desktop', count: 0, percentage: 50 },
                { name: 'Mobile', count: 0, percentage: 35 },
                { name: 'Tablet', count: 0, percentage: 15 }
            ],
            activeUsersRealTime: snap.activeUsers || 0
        };
    },
    async getAdvancedAnalytics(_opts: any) {
        return { trends: [], anomalies: [], generatedAt: new Date().toISOString() };
    },
    async getModelPerformance() { return { accuracy: 0, drift: 0, updatedAt: new Date().toISOString() }; },
    async getFacebookMetrics() { return { impressions: 0, clicks: 0, cpc: 0 }; },
    async getIntegrationStatus() { return { integrations: [] }; },
    async getTemplateModels() { return []; },
    async getActiveFunnels() { return []; },
    async getABTests() { return []; },
    async getCreatives() { return []; },
    async getParticipants() { return []; },
    async getStyleDistribution(funnelId?: string) {
        const styles = await unifiedAnalyticsEngine.getStyleDistribution(funnelId || 'default');
        return styles.reduce((acc, s) => ({ ...acc, [s.style]: s.count }), {});
    },
    async getAnswerHeatmap(funnelId?: string) {
        return {};
    }
};

export const EnhancedUnifiedDataService = enhancedUnifiedDataServiceAdapter; // alias legacy
export default enhancedUnifiedDataServiceAdapter;

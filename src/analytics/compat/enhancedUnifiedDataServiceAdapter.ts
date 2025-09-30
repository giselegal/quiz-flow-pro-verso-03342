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
}

export const enhancedUnifiedDataServiceAdapter = {
    DEPRECATED: true,
    async getRealTimeMetrics(funnelId?: string): Promise<RealtimeMetricsSnapshot> {
        const snap = unifiedAnalyticsEngine.getRealtimeSnapshot(funnelId || 'default');
        return {
            activeUsers: snap.activeUsers || 0,
            funnelId,
            timestamp: new Date().toISOString(),
            styleDistribution: snap.styleDistribution || {},
            answersHeatmap: snap.answersHeatmap || {}
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
        const snap = unifiedAnalyticsEngine.getRealtimeSnapshot(funnelId || 'default');
        return snap.styleDistribution || {};
    },
    async getAnswerHeatmap(funnelId?: string) {
        const snap = unifiedAnalyticsEngine.getRealtimeSnapshot(funnelId || 'default');
        return snap.answersHeatmap || {};
    }
};

export const EnhancedUnifiedDataService = enhancedUnifiedDataServiceAdapter; // alias legacy
export default enhancedUnifiedDataServiceAdapter;

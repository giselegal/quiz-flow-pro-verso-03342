/**
 * Adapter de compatibilidade para substituir uso de analyticsService.
 * Converte chamadas comuns para unifiedEventTracker / unifiedAnalyticsEngine.
 * Remover após migração completa.
 */
import { unifiedEventTracker } from '@/analytics/UnifiedEventTracker';
import { unifiedAnalyticsEngine } from '@/analytics/UnifiedAnalyticsEngine';

interface TrackGenericEventArgs {
    funnelId: string;
    type: string;
    userId?: string;
    sessionId?: string;
    payload?: any;
}

const sessionCache = new Map<string, string>();
function ensureSession(funnelId: string, provided?: string): string {
    if (provided) return provided;
    if (!sessionCache.has(funnelId)) {
        sessionCache.set(funnelId, `sess_${Date.now()}_${Math.random().toString(36).slice(2)}`);
    }
    return sessionCache.get(funnelId)!;
}

export const analyticsServiceAdapter = {
    DEPRECATED: true,
    trackEvent({ funnelId, type, userId, sessionId, payload }: TrackGenericEventArgs) {
        const sid = ensureSession(funnelId, sessionId);
        unifiedEventTracker.track({
            type: type as any,
            funnelId,
            sessionId: sid,
            userId: userId || 'anonymous',
            payload: payload || {},
            context: { source: 'legacy-service-adapter' }
        });
    },
    trackQuizStart(funnelId: string, userId?: string) {
        this.trackEvent({ funnelId, type: 'quiz_started', userId });
    },
    trackQuestionAnswer(funnelId: string, questionId: string, answer: any, userId?: string) {
        this.trackEvent({ funnelId, type: 'question_answered', userId, payload: { questionId, answer } });
    },
    trackQuizCompletion(funnelId: string, result: any, userId?: string) {
        this.trackEvent({ funnelId, type: 'quiz_completed', userId, payload: { result } });
        this.trackEvent({ funnelId, type: 'conversion', userId, payload: { result } });
    },
    // Métricas agregadas
    getFunnelSummary(funnelId: string) { return unifiedAnalyticsEngine.getFunnelSummary(funnelId); },
    getRealtimeSnapshot(funnelId: string) { return unifiedAnalyticsEngine.getRealtimeSnapshot(funnelId); },
    flush() { return unifiedEventTracker.flush({ force: true }); },
    // Métodos legacy simulados para compat temporária -------------------
    addEventListener(_cb: (...args: any[]) => void) { /* noop legacy */ },
    removeEventListener(_cb: (...args: any[]) => void) { /* noop */ },
    getRealTimeMetrics() { return { totalSessions: 0, completionRate: 0, averageTimeToComplete: 0, performanceMetrics: { averageLoadTime: 0 }, styleDistribution: {}, dropOff: {} }; },
    getEventsInTimeRange(_start: string, _end: string) { return [] as any[]; },
    getAnswerHeatmap() { return {}; },
    getDropOffAnalysis() { return []; },
    // Stub adicional usado por alguns serviços (ReportGenerator / QuizPageIntegrationService)
    getMetricsByCategory(_category: string) { return [] as any[]; },
    exportMetricsAsJSON() { return JSON.stringify({ generatedAt: new Date().toISOString() }); }
};

export const analyticsService = analyticsServiceAdapter; // nome legado
export default analyticsServiceAdapter;

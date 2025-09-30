/**
 * Adapter de compatibilidade para migração gradual do antigo analyticsEngine
 * para o pipeline unificado (UnifiedEventTracker + UnifiedAnalyticsEngine).
 *
 * Objetivo: permitir troca de import sem refatorar chamadas imediatamente.
 * Após migração completa, remover este arquivo.
 */

import { unifiedEventTracker } from '@/analytics/UnifiedEventTracker';
import { unifiedAnalyticsEngine } from '@/analytics/UnifiedAnalyticsEngine';

interface TrackBaseArgs { funnelId: string; userId?: string; sessionId?: string; }
interface TrackQuizStartArgs extends TrackBaseArgs { }
interface TrackQuestionAnswerArgs extends TrackBaseArgs { questionId: string; answer: any; }
interface TrackQuizCompletionArgs extends TrackBaseArgs { result: any; }

const sessionCache = new Map<string, string>();
function ensureSession(funnelId: string, provided?: string): string {
    if (provided) return provided;
    if (!sessionCache.has(funnelId)) {
        sessionCache.set(funnelId, `sess_${Date.now()}_${Math.random().toString(36).slice(2)}`);
    }
    return sessionCache.get(funnelId)!;
}

// Tipos mínimos replicados do engine legado para não precisar importar o arquivo depreciado
export interface ABTestExperiment {
    id: string; name: string; description: string; funnelId: string; status: string;
    variants: Array<{ id: string; name: string; description: string; weight: number; isControl: boolean; changes: any[] }>;
    trafficSplit: number; startDate: Date; endDate?: Date; hypothesis: string;
    successMetric: { type: string; name: string; description: string }; createdBy: string; organizationId: string;
    results?: any;
}

export interface PerformanceAlert {
    id: string; type: string; severity: 'low' | 'medium' | 'high' | 'critical'; title: string; description: string;
    funnelId: string; stepId?: string; threshold: number; currentValue: number; triggeredAt: Date; resolved: boolean; resolvedAt?: Date;
}

export const analyticsEngineAdapter = {
    __ADAPTER__: true,
    DEPRECATED: true,
    async trackQuizStart({ funnelId, userId, sessionId }: TrackQuizStartArgs) {
        const sid = ensureSession(funnelId, sessionId);
        unifiedEventTracker.track({
            type: 'quiz_started',
            funnelId,
            sessionId: sid,
            userId: userId || 'anonymous',
            payload: { startedAt: new Date().toISOString() },
            context: { source: 'legacy-adapter' }
        });
    },
    async trackQuestionAnswer({ funnelId, userId, sessionId, questionId, answer }: TrackQuestionAnswerArgs) {
        const sid = ensureSession(funnelId, sessionId);
        unifiedEventTracker.track({
            type: 'question_answered',
            funnelId,
            sessionId: sid,
            userId: userId || 'anonymous',
            stepId: questionId,
            payload: { questionId, answer, answeredAt: new Date().toISOString() },
            context: { source: 'legacy-adapter' }
        });
    },
    async trackQuizCompletion({ funnelId, userId, sessionId, result }: TrackQuizCompletionArgs) {
        const sid = ensureSession(funnelId, sessionId);
        const ts = new Date().toISOString();
        unifiedEventTracker.track({
            type: 'quiz_completed',
            funnelId,
            sessionId: sid,
            userId: userId || 'anonymous',
            payload: { result, completedAt: ts },
            context: { source: 'legacy-adapter' }
        });
        unifiedEventTracker.track({
            type: 'conversion',
            funnelId,
            sessionId: sid,
            userId: userId || 'anonymous',
            payload: { quizResult: result, completedAt: ts },
            context: { source: 'legacy-adapter' }
        });
    },
    async getFunnelSummary(funnelId: string) {
        return unifiedAnalyticsEngine.getFunnelSummary(funnelId);
    },
    async getRealtimeSnapshot(funnelId: string) {
        return unifiedAnalyticsEngine.getRealtimeSnapshot(funnelId);
    },
    async flush() { await unifiedEventTracker.flush({ force: true }); }
    ,
    trackGoogleAnalyticsEvent(eventName: string, params?: Record<string, any>) {
        // Mantém compat com chamadas existentes que esperam integração GA
        try {
            if (typeof window !== 'undefined' && (window as any).gtag) {
                (window as any).gtag('event', eventName, params || {});
            }
        } catch { }
        unifiedEventTracker.track({
            type: 'custom',
            funnelId: params?.funnel_id || 'global',
            sessionId: params?.session_id || `sess_${Date.now()}`,
            userId: params?.user_id || 'anonymous',
            payload: { gaEvent: eventName, ...params },
            context: { source: 'legacy-adapter-ga' }
        } as any);
    }
};

export const analyticsEngine = analyticsEngineAdapter; // nome legado compat
export default analyticsEngineAdapter;

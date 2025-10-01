import { useCallback, useEffect, useMemo, useRef } from 'react';
import { unifiedEventTracker } from './UnifiedEventTracker';
import { unifiedAnalyticsEngine } from './UnifiedAnalyticsEngine';
import type {
    FunnelSummary,
    RealtimeSnapshot,
    TimeRange,
    UnifiedAnalyticsEvent
} from './types';

export interface UseUnifiedAnalyticsOptions {
    funnelId: string;              // obrigatorio (quiz ou funil)
    sessionId?: string;            // se não fornecido é gerado
    userId?: string;               // opcional
    autoSessionStart?: boolean;    // default true => emite session_start + quiz_started
    context?: Record<string, any>; // contexto global inicial
    source?: string;               // default 'web'
}

export interface UseUnifiedAnalyticsApi {
    sessionId: string;
    trackSessionStart: () => void;
    trackStepView: (stepId: string) => void;
    trackAnswer: (stepId: string, answer: any) => void;
    trackCompletion: (payload?: Record<string, any>) => void;
    trackEditorAction: (action: string, details?: Record<string, any>) => void;
    flush: () => Promise<void>;
    getFunnelSummary: (range?: TimeRange) => Promise<FunnelSummary>;
    getRealtimeSnapshot: () => Promise<RealtimeSnapshot>;
    getStyleDistribution: (range?: TimeRange) => Promise<ReturnType<typeof unifiedAnalyticsEngine.getStyleDistribution>>;
    getStepDropoff: (range?: TimeRange) => Promise<ReturnType<typeof unifiedAnalyticsEngine.getStepDropoff>>;
}

function generateSessionId() {
    return `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function useUnifiedAnalytics(options: UseUnifiedAnalyticsOptions): UseUnifiedAnalyticsApi {
    const {
        funnelId,
        userId,
        sessionId: providedSession,
        autoSessionStart = true,
        context,
        source = 'web'
    } = options;

    const sessionRef = useRef<string>(providedSession || generateSessionId());
    const startedRef = useRef<boolean>(false);

    // Configurar contexto global inicial
    useEffect(() => {
        if (context) {
            unifiedEventTracker.setGlobalContext(context);
        }
        return () => {
            unifiedEventTracker.clearGlobalContext();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const baseTrack = useCallback((partial: Omit<UnifiedAnalyticsEvent, 'sessionId' | 'funnelId' | 'userId' | 'source'> & { userId?: string; source?: string }) => {
        unifiedEventTracker.track({
            sessionId: sessionRef.current,
            funnelId,
            userId,
            source,
            ...partial
        });
    }, [funnelId, userId, source]);

    const trackSessionStart = useCallback(() => {
        if (startedRef.current) return;
        startedRef.current = true;
        baseTrack({ type: 'session_start' });
        // Para quiz/funil padronizamos também quiz_started (caso aplicável)
        baseTrack({ type: 'quiz_started' });
    }, [baseTrack]);

    const trackStepView = useCallback((stepId: string) => {
        baseTrack({ type: 'step_viewed', stepId });
    }, [baseTrack]);

    const trackAnswer = useCallback((stepId: string, answer: any) => {
        baseTrack({ type: 'question_answered', stepId, payload: { answer } });
    }, [baseTrack]);

    const trackCompletion = useCallback((payload?: Record<string, any>) => {
        baseTrack({ type: 'quiz_completed', payload });
        baseTrack({ type: 'conversion', payload });
        baseTrack({ type: 'session_end' });
    }, [baseTrack]);

    const trackEditorAction = useCallback((action: string, details?: Record<string, any>) => {
        baseTrack({ type: 'editor_action', payload: { action, ...(details || {}) } });
    }, [baseTrack]);

    const flush = useCallback(async () => { await unifiedEventTracker.flush({ force: true }); }, []);

    // Auto start
    useEffect(() => {
        if (autoSessionStart) {
            trackSessionStart();
        }
    }, [autoSessionStart, trackSessionStart]);

    // API de leitura
    const getFunnelSummary = useCallback((range?: TimeRange) => unifiedAnalyticsEngine.getFunnelSummary(funnelId, range), [funnelId]);
    const getRealtimeSnapshot = useCallback(() => unifiedAnalyticsEngine.getRealtimeSnapshot(funnelId), [funnelId]);
    const getStyleDistribution = useCallback((range?: TimeRange) => unifiedAnalyticsEngine.getStyleDistribution(funnelId, range), [funnelId]);
    const getStepDropoff = useCallback((range?: TimeRange) => unifiedAnalyticsEngine.getStepDropoff(funnelId, range), [funnelId]);

    return useMemo(() => ({
        sessionId: sessionRef.current,
        trackSessionStart,
        trackStepView,
        trackAnswer,
        trackCompletion,
        trackEditorAction,
        flush,
        getFunnelSummary,
        getRealtimeSnapshot,
        getStyleDistribution,
        getStepDropoff
    }), [trackSessionStart, trackStepView, trackAnswer, trackCompletion, trackEditorAction, flush, getFunnelSummary, getRealtimeSnapshot, getStyleDistribution, getStepDropoff]);
}

export default useUnifiedAnalytics;

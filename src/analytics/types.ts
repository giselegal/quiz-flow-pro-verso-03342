/**
 * Unified Analytics - Type Definitions
 * Centraliza todos os tipos compartilhados entre Tracker e Engine.
 */

export type UnifiedEventType =
    | 'quiz_started'
    | 'question_answered'
    | 'quiz_completed'
    | 'step_viewed'
    | 'step_completed'
    | 'step_navigation'
    | 'conversion'
    | 'error'
    | 'performance_metric'
    | 'editor_action'
    | 'session_start'
    | 'session_end';

export interface DeviceInfo {
    type: 'desktop' | 'mobile' | 'tablet';
    os?: string;
    browser?: string;
    screen?: string; // ex: 1920x1080
    viewport?: string; // ex: 1280x720
}

export interface EventContextUTM {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
}

export interface EventExperimentContext {
    id: string;
    variant: string;
}

export interface EventContext {
    locale?: string;
    referrer?: string;
    utm?: EventContextUTM;
    experiment?: EventExperimentContext;
    ipHash?: string; // opcional futuramente
    [k: string]: any; // extensível
}

export interface UnifiedAnalyticsEvent {
    type: UnifiedEventType;
    occurredAt?: Date; // default: now
    sessionId: string;
    userId?: string;
    funnelId: string; // quizId ou funnel genérico
    stepId?: string;
    payload?: Record<string, any>;
    context?: Partial<EventContext>;
    device?: Partial<DeviceInfo>; // pode ser preenchido pelo tracker automaticamente
    source?: string; // default: 'web'
}

export interface StoredUnifiedEvent {
    id: string; // uuid
    occurred_at: string;
    received_at: string;
    session_id: string;
    user_id: string | null;
    funnel_id: string;
    step_id: string | null;
    event_type: UnifiedEventType;
    payload: Record<string, any> | null;
    device: DeviceInfo | null;
    ctx: EventContext | null;
    source: string;
    version: number;
}

export interface FlushResult {
    attempted: number;
    succeeded: number;
    failed: number;
    durationMs: number;
    error?: any;
}

export interface FunnelSummary {
    funnelId: string;
    totalSessions: number;
    activeSessions: number;
    completedSessions: number;
    conversionRate: number;
    avgTimeToCompleteSec: number;
    startedAt: string; // first event time in range
    updatedAt: string; // generation time
}

export interface RealtimeSnapshot {
    funnelId: string;
    activeUsers?: number; // opcional para compatibilidade com adapters parciais
    recentEvents: number;
    recentCompletions: number;
    avgStepTimeSec?: number;
    generatedAt: string;
}

// Extended realtime metrics for dashboards
export interface RealtimeMetricsSnapshot extends RealtimeSnapshot {
    totalSessions: number;
    completedSessions: number;
    conversionRate: number;
    conversionsByHour?: Array<{ hour: string; conversions: number }>;
    topDevices?: Array<{ name: string; count: number }>;
    activeUsersRealTime?: number;
    styleDistribution?: StyleSlice[];
    answersHeatmap?: AnswerDistribution[];
}

export interface StepDropoff {
    stepId: string;
    entrances: number;
    exits: number;
    dropoffRate: number;
    avgTimeSec?: number;
}

export interface StyleSlice {
    style: string;
    count: number;
    percentage: number;
}

export interface DeviceBreakdownCounts {
    desktop: number;
    mobile: number;
    tablet: number;
}

export interface AnswerDistributionOption {
    value: string;
    count: number;
    percentage: number;
}

export interface AnswerDistribution {
    stepId: string;
    options: AnswerDistributionOption[];
    total: number;
}

// -------------------------
// Métricas avançadas de funil
// -------------------------
export interface CommonPath {
    sequence: string[]; // ordem de steps visitados
    count: number;
    percentage: number; // relativo ao total de sessões analisadas
}

export interface CumulativeAbandonment {
    stepId: string;
    reached: number; // sessões que chegaram neste step
    completedAfter: number; // dessas, quantas completaram o funil posteriormente
    abandonmentRate: number; // (reached - completedAfter)/reached * 100
}

export interface StepTransitionTime {
    fromStep: string;
    toStep: string;
    avgTimeSec: number; // tempo médio entre view de fromStep e view de toStep
    samples: number;
}

export type TimeRange = '24h' | '7d' | '30d' | '90d';

export type InvalidateScope =
    | 'all'
    | 'realtime'
    | 'funnel'
    | 'style'
    | 'step'
    | 'device';

export interface UnifiedEventTracker {
    setGlobalContext(ctx: Partial<EventContext>): void;
    clearGlobalContext(): void;
    track(event: UnifiedAnalyticsEvent): void;
    trackBatch(events: UnifiedAnalyticsEvent[]): void;
    flush(options?: { force?: boolean }): Promise<FlushResult>;
    getBufferSize(): number;
    onFlush(listener: (result: FlushResult) => void): () => void;
    enable(): void;
    disable(): void;
}

export interface UnifiedAnalyticsEngine {
    getFunnelSummary(funnelId: string, range?: TimeRange): Promise<FunnelSummary>;
    getRealtimeSnapshot(funnelId: string): Promise<RealtimeSnapshot>;
    getStepDropoff(funnelId: string, range?: TimeRange): Promise<StepDropoff[]>;
    getStyleDistribution(funnelId: string, range?: TimeRange): Promise<StyleSlice[]>;
    getDeviceBreakdown(funnelId: string, range?: TimeRange): Promise<DeviceBreakdownCounts>;
    getAnswerDistribution(
        funnelId: string,
        questionStepId: string,
        range?: TimeRange
    ): Promise<AnswerDistribution>;
    getSessionPathSamples(funnelId: string, limit?: number): Promise<string[][]>;
    // Avançadas
    getCommonPaths(funnelId: string, range?: TimeRange, limit?: number): Promise<CommonPath[]>;
    getCumulativeAbandonment(funnelId: string, range?: TimeRange): Promise<CumulativeAbandonment[]>;
    getStepTransitionTimes(funnelId: string, range?: TimeRange): Promise<StepTransitionTime[]>;
    warmCache(funnelId: string): Promise<void>;
    invalidate(scope: InvalidateScope, funnelId?: string): void;
}

export const UNIFIED_ANALYTICS_VERSION = 1;

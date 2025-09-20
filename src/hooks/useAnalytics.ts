/**
 * 📊 HOOK DE ANALYTICS REACT
 * Hook personalizado para integração com AnalyticsEngine
 * 
 * Fornece métodos simples para tracking de eventos, métricas
 * e experimentos A/B nos componentes React.
 */

import { useCallback, useEffect, useState } from 'react';
import { analyticsEngine, FunnelMetrics, ComponentMetrics, PerformanceMetricsDashboard, PerformanceMetric } from '@/services/analyticsEngine';

// ============================================================================
// TIPOS E INTERFACES
// ============================================================================

export interface UseAnalyticsOptions {
    userId?: string;
    sessionId?: string;
    funnelId?: string;
    componentId?: string;
    autoTrack?: boolean;
}

export interface AnalyticsHookResult {
    // Event Tracking
    trackEvent: (eventType: string, properties?: Record<string, any>) => void;
    trackInteraction: (elementId: string, action: string, properties?: Record<string, any>) => void;
    trackStepProgress: (stepId: string, completed: boolean, properties?: Record<string, any>) => void;
    trackConversion: (properties?: Record<string, any>) => void;

    // Metrics
    funnelMetrics: FunnelMetrics | null;
    componentMetrics: ComponentMetrics | null;
    isLoadingMetrics: boolean;
    refreshMetrics: () => void;

    // A/B Testing
    experimentVariant: string | null;
    assignToExperiment: (experimentId: string) => string | null;

    // Performance
    startTimer: (timerName: string) => void;
    endTimer: (timerName: string, properties?: Record<string, any>) => void;
    trackPerformanceMetric: (metric: PerformanceMetric) => void;
    performanceMetrics: PerformanceMetricsDashboard | null;
    isLoadingPerformance: boolean;
    refreshPerformanceMetrics: () => void;
}

// ============================================================================
// HOOK PRINCIPAL
// ============================================================================

export function useAnalytics(options: UseAnalyticsOptions = {}): AnalyticsHookResult {
    const {
        userId = 'anonymous',
        sessionId: providedSessionId,
        funnelId,
        componentId,
        autoTrack = true
    } = options;

    // ============================================================================
    // ESTADOS
    // ============================================================================

    const [sessionId] = useState(providedSessionId || generateSessionId());
    const [funnelMetrics, setFunnelMetrics] = useState<FunnelMetrics | null>(null);
    const [componentMetrics, setComponentMetrics] = useState<ComponentMetrics | null>(null);
    const [isLoadingMetrics, setIsLoadingMetrics] = useState(false);
    const [experimentVariant, setExperimentVariant] = useState<string | null>(null);
    const [timers] = useState<Map<string, number>>(new Map());
    const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetricsDashboard | null>(null);
    const [isLoadingPerformance, setIsLoadingPerformance] = useState(false);

    // ============================================================================
    // EVENT TRACKING
    // ============================================================================

    const trackEvent = useCallback((
        eventType: string,
        properties: Record<string, any> = {}
    ) => {
        if (!funnelId) {
            console.warn('useAnalytics: funnelId is required for event tracking');
            return;
        }

        analyticsEngine.trackEvent({
            type: eventType as any,
            funnelId,
            componentId,
            userId,
            sessionId,
            properties,
            metadata: getCurrentEventMetadata()
        });
    }, [funnelId, componentId, userId, sessionId]);

    const trackInteraction = useCallback((
        elementId: string,
        action: string,
        properties: Record<string, any> = {}
    ) => {
        trackEvent('component_clicked', {
            elementId,
            action,
            componentId: componentId || elementId,
            ...properties
        });
    }, [trackEvent, componentId]);

    const trackStepProgress = useCallback((
        stepId: string,
        completed: boolean,
        properties: Record<string, any> = {}
    ) => {
        const eventType = completed ? 'step_completed' : 'step_entered';
        trackEvent(eventType, {
            stepId,
            completed,
            ...properties
        });
    }, [trackEvent]);

    const trackConversion = useCallback((properties: Record<string, any> = {}) => {
        trackEvent('conversion_completed', properties);
    }, [trackEvent]);

    // ============================================================================
    // MÉTRICAS
    // ============================================================================

    const refreshMetrics = useCallback(async () => {
        if (!funnelId && !componentId) return;

        setIsLoadingMetrics(true);
        try {
            if (funnelId) {
                const metrics = await analyticsEngine.getFunnelMetrics(funnelId);
                setFunnelMetrics(metrics);
            }

            if (componentId) {
                const metrics = await analyticsEngine.getComponentMetrics(componentId);
                setComponentMetrics(metrics);
            }
        } catch (error) {
            console.error('Error refreshing metrics:', error);
        } finally {
            setIsLoadingMetrics(false);
        }
    }, [funnelId, componentId]);

    // ============================================================================
    // A/B TESTING
    // ============================================================================

    const assignToExperiment = useCallback((experimentId: string): string | null => {
        const variant = analyticsEngine.assignVariant(experimentId, userId, sessionId);
        if (variant) {
            setExperimentVariant(variant);
        }
        return variant;
    }, [userId, sessionId]);

    // ============================================================================
    // PERFORMANCE TIMERS
    // ============================================================================

    const startTimer = useCallback((timerName: string) => {
        timers.set(timerName, Date.now());
    }, [timers]);

    const endTimer = useCallback((timerName: string, properties: Record<string, any> = {}) => {
        const startTime = timers.get(timerName);
        if (startTime) {
            const duration = Date.now() - startTime;
            timers.delete(timerName);

            trackEvent('performance_measured', {
                timerName,
                duration,
                ...properties
            });
        }
    }, [timers, trackEvent]);

    const trackPerformanceMetric = useCallback((metric: PerformanceMetric) => {
        analyticsEngine.trackPerformanceMetric(metric);
    }, []);

    const refreshPerformanceMetrics = useCallback(async () => {
        setIsLoadingPerformance(true);
        try {
            const metrics = await analyticsEngine.getPerformanceMetricsDashboard();
            setPerformanceMetrics(metrics);
        } catch (error) {
            console.error('Error refreshing performance metrics:', error);
        } finally {
            setIsLoadingPerformance(false);
        }
    }, []);

    // ============================================================================
    // AUTO-TRACKING EFFECTS
    // ============================================================================

    // Auto-track page/component mount
    useEffect(() => {
        if (autoTrack && funnelId) {
            trackEvent('step_entered', {
                stepId: componentId || 'unknown',
                autoTracked: true
            });
        }
    }, [autoTrack, funnelId, componentId, trackEvent]);

    // Auto-refresh metrics
    useEffect(() => {
        if (funnelId || componentId) {
            refreshMetrics();
        }
    }, [funnelId, componentId, refreshMetrics]);

    // Auto-track visibility changes
    useEffect(() => {
        if (!autoTrack || !funnelId) return;

        const handleVisibilityChange = () => {
            if (document.hidden) {
                trackEvent('step_abandoned', {
                    stepId: componentId || 'unknown',
                    reason: 'visibility_hidden',
                    autoTracked: true
                });
            } else {
                trackEvent('step_entered', {
                    stepId: componentId || 'unknown',
                    reason: 'visibility_visible',
                    autoTracked: true
                });
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [autoTrack, funnelId, componentId, trackEvent]);

    // ============================================================================
    // RETURN HOOK RESULT
    // ============================================================================

    return {
        trackEvent,
        trackInteraction,
        trackStepProgress,
        trackConversion,
        funnelMetrics,
        componentMetrics,
        isLoadingMetrics,
        refreshMetrics,
        experimentVariant,
        assignToExperiment,
        startTimer,
        endTimer,
        trackPerformanceMetric,
        performanceMetrics,
        isLoadingPerformance,
        refreshPerformanceMetrics
    };
}

// ============================================================================
// HOOKS ESPECIALIZADOS
// ============================================================================

/**
 * Hook especializado para tracking de funis
 */
export function useFunnelAnalytics(funnelId: string, userId?: string) {
    return useAnalytics({
        funnelId,
        userId,
        autoTrack: true
    });
}

/**
 * Hook especializado para tracking de componentes
 */
export function useComponentAnalytics(componentId: string, funnelId?: string) {
    return useAnalytics({
        componentId,
        funnelId,
        autoTrack: true
    });
}

/**
 * Hook para experimentos A/B
 */
export function useABTest(experimentId: string, userId?: string) {
    const analytics = useAnalytics({ userId });
    const [variant, setVariant] = useState<string | null>(null);

    useEffect(() => {
        const assignedVariant = analytics.assignToExperiment(experimentId);
        setVariant(assignedVariant);
    }, [experimentId, analytics]);

    return {
        variant,
        trackEvent: analytics.trackEvent,
        trackConversion: analytics.trackConversion
    };
}

// ============================================================================
// MÉTODOS AUXILIARES
// ============================================================================

function generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function getCurrentEventMetadata() {
    return {
        userAgent: navigator?.userAgent || 'unknown',
        device: {
            type: detectDeviceType(),
            os: detectOS(),
            browser: detectBrowser(),
            screenResolution: `${screen?.width || 0}x${screen?.height || 0}`,
            viewportSize: `${window?.innerWidth || 0}x${window?.innerHeight || 0}`
        },
        location: {
            country: 'BR', // Via IP geolocation em produção
            region: 'SP',
            city: 'São Paulo',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        referrer: document?.referrer || 'direct',
        utm: extractUTMParams()
    };
}

function detectDeviceType(): 'desktop' | 'tablet' | 'mobile' {
    if (typeof window === 'undefined') return 'desktop';

    const userAgent = navigator.userAgent;
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
        return 'tablet';
    }
    if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) {
        return 'mobile';
    }
    return 'desktop';
}

function detectOS(): string {
    if (typeof window === 'undefined') return 'unknown';

    const userAgent = navigator.userAgent;
    if (userAgent.indexOf('Windows') !== -1) return 'Windows';
    if (userAgent.indexOf('Mac') !== -1) return 'macOS';
    if (userAgent.indexOf('Linux') !== -1) return 'Linux';
    if (userAgent.indexOf('Android') !== -1) return 'Android';
    if (userAgent.indexOf('iOS') !== -1) return 'iOS';
    return 'Unknown';
}

function detectBrowser(): string {
    if (typeof window === 'undefined') return 'unknown';

    const userAgent = navigator.userAgent;
    if (userAgent.indexOf('Chrome') !== -1) return 'Chrome';
    if (userAgent.indexOf('Firefox') !== -1) return 'Firefox';
    if (userAgent.indexOf('Safari') !== -1) return 'Safari';
    if (userAgent.indexOf('Edge') !== -1) return 'Edge';
    return 'Unknown';
}

function extractUTMParams() {
    if (typeof window === 'undefined') return {};

    const urlParams = new URLSearchParams(window.location.search);
    return {
        source: urlParams.get('utm_source') || undefined,
        medium: urlParams.get('utm_medium') || undefined,
        campaign: urlParams.get('utm_campaign') || undefined,
        term: urlParams.get('utm_term') || undefined,
        content: urlParams.get('utm_content') || undefined
    };
}

export default useAnalytics;
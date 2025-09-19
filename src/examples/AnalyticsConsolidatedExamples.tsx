/**
 * 🎯 EXEMPLO PRÁTICO - SISTEMA ANALYTICS CONSOLIDADO
 * 
 * Demonstra como usar o novo AnalyticsEngine unificado
 * em diferentes cenários do QuizFlow Pro.
 */

import React, { useEffect } from 'react';
import { analyticsEngine } from '@/services/analyticsEngine';
import { useAnalytics, useFunnelAnalytics, useABTest } from '@/hooks/useAnalytics';

// ============================================================================
// EXEMPLO 1: TRACKING DIRETO COM ANALYTICSENGINE
// ============================================================================

export const DirectAnalyticsExample = () => {
    useEffect(() => {
        // 📊 Google Analytics Events
        analyticsEngine.trackGoogleAnalyticsEvent('page_view', {
            page_title: 'Quiz Example',
            page_location: window.location.href
        });

        // 🎯 Quiz-specific tracking
        analyticsEngine.trackQuizStart('quiz-example-123', 'user-456');

        // 🔥 Internal analytics (mais avançado)
        analyticsEngine.trackEvent({
            type: 'funnel_started',
            funnelId: 'quiz-example-123',
            userId: 'user-456',
            sessionId: 'session-789',
            properties: {
                source: 'direct',
                campaign: 'example-demo'
            },
            metadata: {
                userAgent: navigator.userAgent,
                device: { type: 'desktop', os: 'Windows', browser: 'Chrome', screenResolution: '1920x1080', viewportSize: '1920x1080' },
                location: { country: 'BR', region: 'SP', city: 'São Paulo', timezone: 'America/Sao_Paulo' },
                referrer: 'direct',
                utm: { source: 'direct', campaign: 'example-demo' }
            }
        });

    }, []);

    return <div>Analytics tracking initiated...</div>;
};

// ============================================================================
// EXEMPLO 2: USANDO REACT HOOKS (RECOMENDADO)
// ============================================================================

export const HookAnalyticsExample: React.FC<{ funnelId: string; userId: string }> = ({
    funnelId,
    userId
}) => {
    const analytics = useFunnelAnalytics(funnelId, userId);

    const handleQuestionAnswer = (questionId: string, answer: string) => {
        analytics.trackEvent('question_answered', {
            questionId,
            answer,
            timestamp: new Date().toISOString()
        });

        // Opcional: também track no Google Analytics
        analyticsEngine.trackGoogleAnalyticsEvent('quiz_question_answered', {
            quiz_id: funnelId,
            question_id: questionId,
            answer
        });
    };

    const handleQuizComplete = (result: any) => {
        analytics.trackConversion({
            result,
            completionTime: Date.now()
        });

        // Track conversão no Google Analytics
        analyticsEngine.trackGoogleAnalyticsEvent('quiz_completed', {
            quiz_id: funnelId,
            result: result.score,
            category: result.category
        });
    };

    return (
        <div>
            <h3>Quiz Metrics</h3>
            {analytics.funnelMetrics && (
                <div>
                    <p>Conversion Rate: {analytics.funnelMetrics.conversionRate.toFixed(1)}%</p>
                    <p>Total Sessions: {analytics.funnelMetrics.totalSessions}</p>
                    <p>Unique Users: {analytics.funnelMetrics.uniqueUsers}</p>
                </div>
            )}

            <button onClick={() => handleQuestionAnswer('q1', 'option-a')}>
                Answer Question 1
            </button>

            <button onClick={() => handleQuizComplete({ score: 85, category: 'expert' })}>
                Complete Quiz
            </button>
        </div>
    );
};

// ============================================================================
// EXEMPLO 3: A/B TESTING
// ============================================================================

export const ABTestExample: React.FC<{ userId: string }> = ({ userId }) => {
    const abTest = useABTest('cta-button-test', userId);

    const getButtonText = () => {
        switch (abTest.variant) {
            case 'control': return 'Começar Agora';
            case 'variant-a': return 'Iniciar Teste';
            case 'variant-b': return 'Descobrir Resultado';
            default: return 'Começar Agora';
        }
    };

    const handleCTAClick = () => {
        abTest.trackEvent('button_clicked', {
            variant: abTest.variant,
            buttonText: getButtonText()
        });

        // Se foi uma conversão
        abTest.trackConversion({
            variant: abTest.variant,
            conversionValue: 100
        });
    };

    return (
        <div>
            <h3>A/B Test: CTA Button</h3>
            <p>Variant: {abTest.variant || 'loading...'}</p>

            <button
                onClick={handleCTAClick}
                style={{
                    backgroundColor: abTest.variant === 'variant-b' ? '#ff6b6b' : '#4ecdc4'
                }}
            >
                {getButtonText()}
            </button>
        </div>
    );
};

// ============================================================================
// EXEMPLO 4: COMPONENT COM AUTO-TRACKING
// ============================================================================

export const AutoTrackingComponent: React.FC<{
    componentId: string;
    funnelId: string;
    userId: string
}> = ({ componentId, funnelId, userId }) => {
    const { trackInteraction, startTimer, endTimer } = useAnalytics({
        componentId,
        funnelId,
        userId,
        autoTrack: true // Auto-track mount/unmount
    });

    const handleInteraction = (action: string) => {
        trackInteraction(componentId, action, {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        });
    };

    const handleLongTask = async () => {
        startTimer('long-task');

        // Simular tarefa longa
        await new Promise(resolve => setTimeout(resolve, 2000));

        endTimer('long-task', {
            taskType: 'simulation',
            success: true
        });
    };

    return (
        <div>
            <h3>Auto-Tracking Component</h3>
            <button onClick={() => handleInteraction('click')}>
                Track Click
            </button>
            <button onClick={() => handleInteraction('hover')}>
                Track Hover
            </button>
            <button onClick={handleLongTask}>
                Track Long Task
            </button>
        </div>
    );
};

// ============================================================================
// EXEMPLO 5: DASHBOARD DE MÉTRICAS EM TEMPO REAL
// ============================================================================

export const RealTimeMetricsExample: React.FC<{ funnelId: string }> = ({ funnelId }) => {
    const [metrics, setMetrics] = React.useState<any>(null);
    const [alerts, setAlerts] = React.useState<any[]>([]);

    useEffect(() => {
        const fetchMetrics = async () => {
            const funnelMetrics = await analyticsEngine.getFunnelMetrics(funnelId, '7d');
            setMetrics(funnelMetrics);
        };

        fetchMetrics();

        // Refresh metrics every 30 seconds
        const interval = setInterval(fetchMetrics, 30000);
        return () => clearInterval(interval);
    }, [funnelId]);

    if (!metrics) return <div>Loading metrics...</div>;

    return (
        <div>
            <h3>📊 Real-Time Metrics</h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
                    <h4>Conversion Rate</h4>
                    <p style={{ fontSize: '2rem', color: '#4ecdc4' }}>
                        {metrics.conversionRate.toFixed(1)}%
                    </p>
                </div>

                <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
                    <h4>Total Sessions</h4>
                    <p style={{ fontSize: '2rem', color: '#45b7d1' }}>
                        {metrics.totalSessions.toLocaleString()}
                    </p>
                </div>

                <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
                    <h4>Unique Users</h4>
                    <p style={{ fontSize: '2rem', color: '#96ceb4' }}>
                        {metrics.uniqueUsers.toLocaleString()}
                    </p>
                </div>
            </div>

            <div style={{ marginTop: '2rem' }}>
                <h4>Device Breakdown</h4>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <span>Desktop: {metrics.deviceBreakdown.desktop}</span>
                    <span>Mobile: {metrics.deviceBreakdown.mobile}</span>
                    <span>Tablet: {metrics.deviceBreakdown.tablet}</span>
                </div>
            </div>

            {alerts.length > 0 && (
                <div style={{ marginTop: '2rem' }}>
                    <h4>🚨 Active Alerts</h4>
                    {alerts.map(alert => (
                        <div key={alert.id} style={{
                            padding: '0.5rem',
                            backgroundColor: '#ffe6e6',
                            borderRadius: '4px',
                            margin: '0.5rem 0'
                        }}>
                            <strong>{alert.title}</strong>
                            <p>{alert.description}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// ============================================================================
// EXEMPLO 6: MIGRAÇÃO DE CÓDIGO ANTIGO
// ============================================================================

// ❌ CÓDIGO ANTIGO (não usar mais):
/*
import { trackEvent, trackCustomEvent } from '@/utils/analytics';
import { analyticsService } from '@/services/analyticsService';

// Old way
trackEvent('button_click', { button: 'cta-primary' });
trackCustomEvent('quiz', 'completed', 'personality-test', 100);
await analyticsService.trackQuizStart('quiz-123', 'user-456');
*/

// ✅ CÓDIGO NOVO (usar):
export const MigratedCodeExample = () => {
    const userId = 'user-456';
    const funnelId = 'quiz-123';

    // Using hooks (recommended for React components)
    const { trackEvent, trackConversion } = useAnalytics({ funnelId, userId });

    const handleButtonClick = () => {
        // Internal tracking (more detailed)
        trackEvent('component_clicked', {
            component: 'cta-primary',
            timestamp: new Date().toISOString()
        });

        // Google Analytics (for external tools)
        analyticsEngine.trackGoogleAnalyticsEvent('button_click', {
            button: 'cta-primary'
        });
    };

    const handleQuizComplete = async () => {
        // Quiz-specific method
        await analyticsEngine.trackQuizCompletion(funnelId, {
            score: 100,
            category: 'personality-test'
        }, userId);

        // Also track as conversion
        trackConversion({
            score: 100,
            category: 'personality-test'
        });
    };

    return (
        <div>
            <button onClick={handleButtonClick}>Track Button Click</button>
            <button onClick={handleQuizComplete}>Complete Quiz</button>
        </div>
    );
};

export default {
    DirectAnalyticsExample,
    HookAnalyticsExample,
    ABTestExample,
    AutoTrackingComponent,
    RealTimeMetricsExample,
    MigratedCodeExample
};
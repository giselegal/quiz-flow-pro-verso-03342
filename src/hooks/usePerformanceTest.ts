import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * 📊 USE PERFORMANCE TEST - HOOK DE PERFORMANCE
 * 
 * Monitoramento em tempo real de métricas de performance
 */

interface PerformanceMetrics {
    // Métricas de rendering
    renderTime: number;
    reRenderCount: number;

    // Métricas de memória
    memoryUsage: number;
    memoryLeaks: number;

    // Métricas de rede
    networkLatency: number;
    cacheHitRate: number;

    // Métricas de usuário
    userInteractionLatency: number;
    timeToInteractive: number;

    // Métricas de bundle
    bundleSize: number;
    chunkLoadTime: number;

    // Métricas de erro
    errorRate: number;
    errorCount: number;
}

interface PerformanceThresholds {
    renderTime: number;
    memoryUsage: number;
    networkLatency: number;
    userInteractionLatency: number;
    errorRate: number;
}

interface PerformanceAlert {
    type: 'warning' | 'critical';
    metric: keyof PerformanceMetrics;
    value: number;
    threshold: number;
    message: string;
    timestamp: number;
}

interface UsePerformanceTestOptions {
    enabled?: boolean;
    interval?: number;
    thresholds?: Partial<PerformanceThresholds>;
    onAlert?: (alert: PerformanceAlert) => void;
    trackMemoryLeaks?: boolean;
    trackNetworkCalls?: boolean;
}

interface PerformanceTestResult {
    metrics: PerformanceMetrics;
    alerts: PerformanceAlert[];
    isOptimal: boolean;
    recommendations: string[];
    startTest: () => void;
    stopTest: () => void;
    resetMetrics: () => void;
    generateReport: () => PerformanceReport;
}

interface PerformanceReport {
    summary: {
        overallScore: number;
        testDuration: number;
        totalAlerts: number;
        criticalIssues: number;
    };
    metrics: PerformanceMetrics;
    alerts: PerformanceAlert[];
    recommendations: string[];
    timestamp: string;
}

const DEFAULT_THRESHOLDS: PerformanceThresholds = {
    renderTime: 100, // ms
    memoryUsage: 70,  // %
    networkLatency: 300, // ms
    userInteractionLatency: 50, // ms
    errorRate: 1 // %
};

export function usePerformanceTest(
    componentName: string,
    options: UsePerformanceTestOptions = {}
): PerformanceTestResult {

    const {
        enabled = true,
        interval = 1000,
        thresholds = {},
        onAlert,
        trackMemoryLeaks = true,
        trackNetworkCalls = true
    } = options;

    // Estados
    const [metrics, setMetrics] = useState<PerformanceMetrics>({
        renderTime: 0,
        reRenderCount: 0,
        memoryUsage: 0,
        memoryLeaks: 0,
        networkLatency: 0,
        cacheHitRate: 0,
        userInteractionLatency: 0,
        timeToInteractive: 0,
        bundleSize: 0,
        chunkLoadTime: 0,
        errorRate: 0,
        errorCount: 0
    });

    const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
    const [isTestRunning, setIsTestRunning] = useState(false);
    const [testStartTime, setTestStartTime] = useState<number>(0);

    // Refs para tracking
    const renderCountRef = useRef(0);
    const lastRenderTimeRef = useRef(0);
    const networkCallsRef = useRef<{ start: number; end?: number; cached?: boolean }[]>([]);
    const memoryBaselineRef = useRef<number>(0);
    const intervalRef = useRef<NodeJS.Timeout>();

    // Thresholds consolidados
    const finalThresholds = { ...DEFAULT_THRESHOLDS, ...thresholds };

    // 🎯 Monitoramento de re-renders
    useEffect(() => {
        if (!enabled) return;

        renderCountRef.current++;
        const now = performance.now();

        if (lastRenderTimeRef.current > 0) {
            const renderTime = now - lastRenderTimeRef.current;
            setMetrics(prev => ({
                ...prev,
                renderTime,
                reRenderCount: renderCountRef.current
            }));
        }

        lastRenderTimeRef.current = now;
    });

    // 📊 Coleta de métricas de performance
    const collectMetrics = useCallback(async () => {
        if (!enabled || !isTestRunning) return;

        try {
            // 🧠 Métricas de memória
            const memoryInfo = (performance as any).memory;
            const currentMemory = memoryInfo ? memoryInfo.usedJSHeapSize : 0;
            const memoryUsage = memoryInfo ?
                (memoryInfo.usedJSHeapSize / memoryInfo.totalJSHeapSize) * 100 : 0;

            // Detectar vazamentos de memória apenas se habilitado
            let memoryLeaks = 0;
            if (trackMemoryLeaks) {
                if (memoryBaselineRef.current === 0) {
                    memoryBaselineRef.current = currentMemory;
                }
                memoryLeaks = currentMemory > memoryBaselineRef.current * 1.5 ? 1 : 0;
            }

            // 🌐 Métricas de rede
            const networkCalls = networkCallsRef.current;
            const completedCalls = networkCalls.filter(call => call.end);
            const avgLatency = completedCalls.length > 0
                ? completedCalls.reduce((sum, call) => sum + (call.end! - call.start), 0) / completedCalls.length
                : 0;

            const cachedCalls = networkCalls.filter(call => call.cached).length;
            const cacheHitRate = networkCalls.length > 0
                ? (cachedCalls / networkCalls.length) * 100
                : 0;

            // ⚡ Métricas de interação
            const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
            const timeToInteractive = navigationTiming
                ? navigationTiming.domInteractive - navigationTiming.fetchStart
                : 0;

            // 📦 Métricas de bundle (simuladas)
            const bundleEntries = performance.getEntriesByType('resource')
                .filter(entry => entry.name.includes('.js') || entry.name.includes('.css'));

            const bundleSize = bundleEntries.reduce((total, entry) => {
                const resourceEntry = entry as PerformanceResourceTiming;
                return total + (resourceEntry.transferSize || 0);
            }, 0) / 1024; // KB

            const chunkLoadTime = bundleEntries.length > 0
                ? bundleEntries.reduce((total, entry) => total + entry.duration, 0) / bundleEntries.length
                : 0;

            // 🚨 Métricas de erro (mockadas)
            const errorCount = (window as any).__performance_errors__ || 0;
            const errorRate = testStartTime > 0
                ? (errorCount / ((Date.now() - testStartTime) / 1000)) * 100
                : 0;

            // Atualizar métricas
            const newMetrics: PerformanceMetrics = {
                renderTime: metrics.renderTime,
                reRenderCount: renderCountRef.current,
                memoryUsage,
                memoryLeaks,
                networkLatency: avgLatency,
                cacheHitRate,
                userInteractionLatency: 0, // Será atualizado por eventos de interação
                timeToInteractive,
                bundleSize,
                chunkLoadTime,
                errorRate,
                errorCount
            };

            setMetrics(newMetrics);

            // Verificar alertas
            checkThresholds(newMetrics);

        } catch (error) {
            console.warn(`[PerformanceTest:${componentName}] Error collecting metrics:`, error);
        }
    }, [enabled, isTestRunning, componentName, metrics.renderTime]);

    // 🚨 Verificação de thresholds
    const checkThresholds = useCallback((currentMetrics: PerformanceMetrics) => {
        const newAlerts: PerformanceAlert[] = [];

        Object.entries(finalThresholds).forEach(([key, threshold]) => {
            const metricKey = key as keyof PerformanceMetrics;
            const value = currentMetrics[metricKey] as number;

            if (value > threshold) {
                const alertType = value > threshold * 1.5 ? 'critical' : 'warning';

                newAlerts.push({
                    type: alertType,
                    metric: metricKey,
                    value,
                    threshold,
                    message: `${metricKey} (${value.toFixed(2)}) exceeds threshold (${threshold})`,
                    timestamp: Date.now()
                });
            }
        });

        if (newAlerts.length > 0) {
            setAlerts(prev => [...prev, ...newAlerts]);
            newAlerts.forEach(alert => {
                console.warn(`[PerformanceAlert:${componentName}]`, alert);
                onAlert?.(alert);
            });
        }
    }, [finalThresholds, componentName, onAlert]);

    // 🚀 Iniciar teste
    const startTest = useCallback(() => {
        if (!enabled) return;

        setIsTestRunning(true);
        setTestStartTime(Date.now());
        setAlerts([]);
        renderCountRef.current = 0;
        networkCallsRef.current = [];
        memoryBaselineRef.current = 0;

        // Configurar interval para coleta de métricas
        intervalRef.current = setInterval(collectMetrics, interval);

        // Interceptar network calls se habilitado
        if (trackNetworkCalls) {
            setupNetworkTracking();
        }

        console.log(`[PerformanceTest:${componentName}] Test started`);
    }, [enabled, componentName, interval, collectMetrics, trackNetworkCalls]);

    // ⏹️ Parar teste
    const stopTest = useCallback(() => {
        setIsTestRunning(false);

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        console.log(`[PerformanceTest:${componentName}] Test stopped`);
    }, [componentName]);

    // 🔄 Reset de métricas
    const resetMetrics = useCallback(() => {
        setMetrics({
            renderTime: 0,
            reRenderCount: 0,
            memoryUsage: 0,
            memoryLeaks: 0,
            networkLatency: 0,
            cacheHitRate: 0,
            userInteractionLatency: 0,
            timeToInteractive: 0,
            bundleSize: 0,
            chunkLoadTime: 0,
            errorRate: 0,
            errorCount: 0
        });
        setAlerts([]);
        renderCountRef.current = 0;
    }, []);

    // 📊 Gerar relatório
    const generateReport = useCallback((): PerformanceReport => {
        const criticalAlerts = alerts.filter(alert => alert.type === 'critical');
        const testDuration = testStartTime > 0 ? Date.now() - testStartTime : 0;

        // Calcular score geral (0-100)
        const scores = {
            renderTime: Math.max(0, 100 - (metrics.renderTime / finalThresholds.renderTime) * 100),
            memoryUsage: Math.max(0, 100 - (metrics.memoryUsage / finalThresholds.memoryUsage) * 100),
            networkLatency: Math.max(0, 100 - (metrics.networkLatency / finalThresholds.networkLatency) * 100),
            errorRate: Math.max(0, 100 - (metrics.errorRate / finalThresholds.errorRate) * 100)
        };

        const overallScore = Object.values(scores).reduce((sum, score) => sum + score, 0) / Object.keys(scores).length;

        // Gerar recomendações
        const recommendations = generateRecommendations(metrics, alerts);

        return {
            summary: {
                overallScore: Math.round(overallScore),
                testDuration,
                totalAlerts: alerts.length,
                criticalIssues: criticalAlerts.length
            },
            metrics,
            alerts,
            recommendations,
            timestamp: new Date().toISOString()
        };
    }, [alerts, testStartTime, metrics, finalThresholds]);

    // 🎯 Setup de tracking de rede
    const setupNetworkTracking = useCallback(() => {
        // Interceptar fetch calls
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            const start = performance.now();
            networkCallsRef.current.push({ start });

            try {
                const response = await originalFetch(...args);
                const end = performance.now();
                const lastCall = networkCallsRef.current[networkCallsRef.current.length - 1];
                if (lastCall) {
                    lastCall.end = end;
                    lastCall.cached = response.headers.get('x-cache') === 'HIT';
                }
                return response;
            } catch (error) {
                const end = performance.now();
                const lastCall = networkCallsRef.current[networkCallsRef.current.length - 1];
                if (lastCall) lastCall.end = end;
                throw error;
            }
        };
    }, []);

    // 💡 Gerar recomendações
    const generateRecommendations = useCallback((
        metrics: PerformanceMetrics,
        alerts: PerformanceAlert[]
    ): string[] => {
        const recommendations: string[] = [];

        // Adicionar recomendações baseadas em alertas críticos
        if (alerts.some(alert => alert.type === 'critical')) {
            recommendations.push('🚨 Problemas críticos de performance detectados - ação imediata necessária');
        }

        if (metrics.renderTime > finalThresholds.renderTime) {
            recommendations.push('Consider implementing React.memo() for expensive components');
            recommendations.push('Use useMemo() and useCallback() to prevent unnecessary re-renders');
        }

        if (metrics.memoryUsage > finalThresholds.memoryUsage) {
            recommendations.push('Check for memory leaks in useEffect cleanup functions');
            recommendations.push('Implement virtualization for large lists');
        }

        if (metrics.networkLatency > finalThresholds.networkLatency) {
            recommendations.push('Implement request caching and batching');
            recommendations.push('Consider using CDN for static assets');
        }

        if (metrics.reRenderCount > 20) {
            recommendations.push('Optimize component hierarchy to reduce re-renders');
            recommendations.push('Split large components into smaller, focused components');
        }

        if (metrics.bundleSize > 1000) {
            recommendations.push('Implement code splitting and lazy loading');
            recommendations.push('Analyze bundle with tools like webpack-bundle-analyzer');
        }

        return recommendations;
    }, [finalThresholds]);

    // ✅ Verificar se performance está ótima
    const isOptimal = alerts.filter(alert => alert.type === 'critical').length === 0 &&
        metrics.renderTime < finalThresholds.renderTime &&
        metrics.memoryUsage < finalThresholds.memoryUsage;

    // Cleanup
    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    return {
        metrics,
        alerts,
        isOptimal,
        recommendations: generateRecommendations(metrics, alerts),
        startTest,
        stopTest,
        resetMetrics,
        generateReport
    };
}

export type {
    PerformanceMetrics,
    PerformanceAlert,
    PerformanceTestResult,
    PerformanceReport,
    UsePerformanceTestOptions
};
/**
 * 🚀 PERFORMANCE PROFILER CUSTOMIZADO
 * 
 * Sistema de monitoramento de performance para componentes do editor
 * com métricas customizadas e relatórios de gargalos
 */

import React, { Profiler, ProfilerOnRenderCallback, useEffect, useRef, useState } from 'react';

// Tipos para métricas customizadas
export interface PerformanceMetrics {
    componentName: string;
    renderTime: number;
    renderCount: number;
    phase: 'mount' | 'update' | 'nested-update';
    actualDuration: number;
    baseDuration: number;
    startTime: number;
    commitTime: number;
    interactions: Set<any>;
}

export interface PerformanceReport {
    slowestComponents: PerformanceMetrics[];
    mostRenderedComponents: PerformanceMetrics[];
    totalRenderTime: number;
    averageRenderTime: number;
    renderCount: number;
    timestamp: Date;
    warnings: string[];
}

// Store global para métricas
class PerformanceStore {
    private metrics: Map<string, PerformanceMetrics[]> = new Map();
    private renderThreshold = 50; // Aumentar threshold para 50ms (mais realista)
    private renderCountThreshold = 15; // Permitir mais renders em desenvolvimento

    addMetric(metric: PerformanceMetrics) {
        const existing = this.metrics.get(metric.componentName) || [];
        existing.push(metric);

        // Manter apenas últimos 100 renders por componente
        if (existing.length > 100) {
            existing.shift();
        }

        this.metrics.set(metric.componentName, existing);

        // Alertas em tempo real
        this.checkPerformanceWarnings(metric);
    }

    private checkPerformanceWarnings(metric: PerformanceMetrics) {
        // Desabilitar warnings em produção para evitar spam no console
        if (process.env.NODE_ENV === 'production') {
            return;
        }

        // Alerta para renders lentos
        if (metric.actualDuration > this.renderThreshold) {
            console.warn(`🐌 Slow render detected in ${metric.componentName}: ${metric.actualDuration.toFixed(2)}ms`);
        }

        // Alerta para muitos re-renders
        const recentRenders = this.getRecentRenders(metric.componentName, 1000); // 1 segundo
        if (recentRenders.length > this.renderCountThreshold) {
            console.warn(`🔄 Excessive re-renders in ${metric.componentName}: ${recentRenders.length} renders in 1s`);
        }
    }

    private getRecentRenders(componentName: string, timeWindowMs: number): PerformanceMetrics[] {
        const metrics = this.metrics.get(componentName) || [];
        const cutoffTime = Date.now() - timeWindowMs;
        return metrics.filter(m => m.commitTime > cutoffTime);
    }

    generateReport(): PerformanceReport {
        const allMetrics: PerformanceMetrics[] = [];
        const warnings: string[] = [];

        // Consolidar todas as métricas
        for (const [componentName, metrics] of this.metrics.entries()) {
            allMetrics.push(...metrics);

            // Verificar problemas de performance
            const avgRenderTime = metrics.reduce((sum, m) => sum + m.actualDuration, 0) / metrics.length;
            const totalRenders = metrics.length;

            if (avgRenderTime > this.renderThreshold) {
                warnings.push(`${componentName}: Tempo médio de render alto (${avgRenderTime.toFixed(2)}ms)`);
            }

            if (totalRenders > 50) {
                warnings.push(`${componentName}: Muitos re-renders (${totalRenders})`);
            }
        }

        // Componentes mais lentos (média)
        const componentAverages = Array.from(this.metrics.entries())
            .map(([name, metrics]) => ({
                componentName: name,
                averageTime: metrics.reduce((sum, m) => sum + m.actualDuration, 0) / metrics.length,
                renderCount: metrics.length,
                totalTime: metrics.reduce((sum, m) => sum + m.actualDuration, 0)
            }))
            .sort((a, b) => b.averageTime - a.averageTime);

        // Componentes com mais renders
        const mostRendered = componentAverages
            .sort((a, b) => b.renderCount - a.renderCount);

        const totalRenderTime = allMetrics.reduce((sum, m) => sum + m.actualDuration, 0);
        const renderCount = allMetrics.length;

        return {
            slowestComponents: componentAverages.slice(0, 10).map(avg => ({
                componentName: avg.componentName,
                renderTime: avg.averageTime,
                renderCount: avg.renderCount,
                phase: 'update' as const,
                actualDuration: avg.averageTime,
                baseDuration: avg.averageTime,
                startTime: 0,
                commitTime: Date.now(),
                interactions: new Set()
            })),
            mostRenderedComponents: mostRendered.slice(0, 10).map(avg => ({
                componentName: avg.componentName,
                renderTime: avg.averageTime,
                renderCount: avg.renderCount,
                phase: 'update' as const,
                actualDuration: avg.averageTime,
                baseDuration: avg.averageTime,
                startTime: 0,
                commitTime: Date.now(),
                interactions: new Set()
            })),
            totalRenderTime,
            averageRenderTime: renderCount > 0 ? totalRenderTime / renderCount : 0,
            renderCount,
            timestamp: new Date(),
            warnings
        };
    }

    clear() {
        this.metrics.clear();
    }

    getComponentMetrics(componentName: string): PerformanceMetrics[] {
        return this.metrics.get(componentName) || [];
    }

    getAllComponentNames(): string[] {
        return Array.from(this.metrics.keys());
    }
}

// Instância global do store
export const performanceStore = new PerformanceStore();

// Hook para acessar métricas em tempo real
export const usePerformanceMetrics = () => {
    const [report, setReport] = useState<PerformanceReport | null>(null);
    const intervalRef = useRef<NodeJS.Timeout>();

    const startMonitoring = (intervalMs = 5000) => {
        if (intervalRef.current) clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
            setReport(performanceStore.generateReport());
        }, intervalMs);
    };

    const stopMonitoring = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = undefined;
        }
    };

    const generateReport = () => {
        const newReport = performanceStore.generateReport();
        setReport(newReport);
        return newReport;
    };

    useEffect(() => {
        return () => {
            stopMonitoring();
        };
    }, []);

    return {
        report,
        startMonitoring,
        stopMonitoring,
        generateReport,
        clearMetrics: () => performanceStore.clear()
    };
};

// Componente Profiler customizado
interface PerformanceProfilerProps {
    id: string;
    children: React.ReactNode;
    enableLogging?: boolean;
    onRender?: (metrics: PerformanceMetrics) => void;
}

export const PerformanceProfiler: React.FC<PerformanceProfilerProps> = ({
    id,
    children,
    enableLogging = false,
    onRender
}) => {
    // Em produção, apenas renderizar children sem profiling para evitar overhead
    if (process.env.NODE_ENV === 'production' && !enableLogging) {
        return <>{children}</>;
    }

    const onRenderCallback: ProfilerOnRenderCallback = (
        profilerID: string,
        phase: "mount" | "update" | "nested-update",
        actualDuration: number,
        baseDuration: number,
        startTime: number,
        commitTime: number
    ) => {
        const metric: PerformanceMetrics = {
            componentName: profilerID,
            renderTime: actualDuration,
            renderCount: 1,
            phase,
            actualDuration,
            baseDuration,
            startTime,
            commitTime,
            interactions: new Set()
        };

        // Adicionar ao store global
        performanceStore.addMetric(metric);

        // Callback customizado
        onRender?.(metric);

        // Log opcional
        if (enableLogging) {
            console.log(`📊 ${id} rendered in ${actualDuration.toFixed(2)}ms (${phase})`);
        }
    };

    return (
        <Profiler id={id} onRender={onRenderCallback}>
            {children}
        </Profiler>
    );
};

// Higher-Order Component para wrapping automático
export const withPerformanceProfiler = <P extends object>(
    WrappedComponent: React.ComponentType<P>,
    profileId?: string
) => {
    const WithPerformanceProfiler = (props: P) => {
        const componentName = profileId || WrappedComponent.displayName || WrappedComponent.name || 'Component';

        return (
            <PerformanceProfiler id={componentName}>
                <WrappedComponent {...props} />
            </PerformanceProfiler>
        );
    };

    WithPerformanceProfiler.displayName = `withPerformanceProfiler(${WrappedComponent.displayName || WrappedComponent.name})`;

    return WithPerformanceProfiler;
};

// Hook para detectar renders desnecessários
export const useRenderTracker = (componentName: string, dependencies: any[]) => {
    const renderCountRef = useRef(0);
    const prevDepsRef = useRef(dependencies);

    renderCountRef.current++;

    const depsChanged = prevDepsRef.current.some((dep, index) =>
        dep !== dependencies[index]
    );

    if (renderCountRef.current > 1 && !depsChanged) {
        console.warn(`🔄 Unnecessary render in ${componentName} (render #${renderCountRef.current})`);
    }

    prevDepsRef.current = dependencies;

    return {
        renderCount: renderCountRef.current,
        unnecessaryRender: renderCountRef.current > 1 && !depsChanged
    };
};

// Componente de debug para mostrar métricas em tempo real
export const PerformanceDebugPanel: React.FC = () => {
    const { report, startMonitoring, stopMonitoring, generateReport } = usePerformanceMetrics();
    const [isVisible, setIsVisible] = useState(false);
    const [isMonitoring, setIsMonitoring] = useState(false);

    const toggleMonitoring = () => {
        if (isMonitoring) {
            stopMonitoring();
            setIsMonitoring(false);
        } else {
            startMonitoring(2000);
            setIsMonitoring(true);
        }
    };

    if (!isVisible) {
        return (
            <button
                onClick={() => setIsVisible(true)}
                className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 z-50"
                style={{ fontSize: '12px' }}
            >
                📊 Performance
            </button>
        );
    }

    return (
        <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-xl p-4 max-w-md z-50">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold">Performance Monitor</h3>
                <button
                    onClick={() => setIsVisible(false)}
                    className="text-gray-500 hover:text-gray-700"
                >
                    ✕
                </button>
            </div>

            <div className="space-y-2 text-xs">
                <div className="flex gap-2">
                    <button
                        onClick={toggleMonitoring}
                        className={`px-2 py-1 rounded ${isMonitoring ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
                    >
                        {isMonitoring ? 'Stop' : 'Start'}
                    </button>
                    <button
                        onClick={generateReport}
                        className="px-2 py-1 bg-blue-500 text-white rounded"
                    >
                        Refresh
                    </button>
                </div>

                {report && (
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                        <div className="font-medium">
                            Total: {report.renderCount} renders, {report.totalRenderTime.toFixed(2)}ms
                        </div>

                        {report.warnings.length > 0 && (
                            <div className="text-red-600">
                                <div className="font-medium">⚠️ Warnings:</div>
                                {report.warnings.slice(0, 3).map((warning, i) => (
                                    <div key={i} className="text-xs">{warning}</div>
                                ))}
                            </div>
                        )}

                        <div>
                            <div className="font-medium">🐌 Slowest:</div>
                            {report.slowestComponents.slice(0, 5).map((comp, i) => (
                                <div key={i} className="text-xs">
                                    {comp.componentName}: {comp.renderTime.toFixed(2)}ms
                                </div>
                            ))}
                        </div>

                        <div>
                            <div className="font-medium">🔄 Most Rendered:</div>
                            {report.mostRenderedComponents.slice(0, 5).map((comp, i) => (
                                <div key={i} className="text-xs">
                                    {comp.componentName}: {comp.renderCount}x
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

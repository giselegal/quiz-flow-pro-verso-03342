/**
 * 🎯 FASE 2: INSTRUMENTAÇÃO DE RE-RENDERS
 * 
 * Componente para medir e reportar re-renders em tempo real
 * Utiliza React Profiler API para métricas precisas
 * 
 * Uso:
 * ```tsx
 * <RenderProfiler id="EditorProviderUnified" logToConsole>
 *   <EditorProviderUnified>
 *     {children}
 *   </EditorProviderUnified>
 * </RenderProfiler>
 * ```
 */

import React, { Profiler, ProfilerOnRenderCallback, useRef, useState, useEffect } from 'react';

interface RenderMetrics {
    id: string;
    phase: 'mount' | 'update' | 'nested-update';
    actualDuration: number;
    baseDuration: number;
    startTime: number;
    commitTime: number;
    renderCount: number;
}

interface RenderProfilerProps {
    id: string;
    children: React.ReactNode;
    logToConsole?: boolean;
    showOverlay?: boolean;
    onMetricsUpdate?: (metrics: RenderMetrics) => void;
}

const renderMetricsStore: Map<string, RenderMetrics[]> = new Map();

export const RenderProfiler: React.FC<RenderProfilerProps> = ({
    id,
    children,
    logToConsole = false,
    showOverlay = false,
    onMetricsUpdate,
}) => {
    const renderCountRef = useRef(0);
    const [localMetrics, setLocalMetrics] = useState<RenderMetrics | null>(null);

    const onRender: ProfilerOnRenderCallback = (
        profilerId,
        phase,
        actualDuration,
        baseDuration,
        startTime,
        commitTime
    ) => {
        renderCountRef.current += 1;

        const metrics: RenderMetrics = {
            id: profilerId,
            phase,
            actualDuration,
            baseDuration,
            startTime,
            commitTime,
            renderCount: renderCountRef.current,
        };

        // Armazenar no store global
        if (!renderMetricsStore.has(profilerId)) {
            renderMetricsStore.set(profilerId, []);
        }
        renderMetricsStore.get(profilerId)!.push(metrics);

        // Log no console se habilitado
        if (logToConsole) {
            console.log(`[PROFILER] ${profilerId} (${phase})`, {
                renderCount: metrics.renderCount,
                actualDuration: `${actualDuration.toFixed(2)}ms`,
                baseDuration: `${baseDuration.toFixed(2)}ms`,
                commitTime: new Date(commitTime).toISOString(),
            });
        }

        // Callback customizado
        if (onMetricsUpdate) {
            onMetricsUpdate(metrics);
        }

        // Atualizar estado local para overlay
        if (showOverlay) {
            setLocalMetrics(metrics);
        }
    };

    return (
        <>
            <Profiler id={id} onRender={onRender}>
                {children}
            </Profiler>
            {showOverlay && localMetrics && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: 10,
                        right: 10,
                        background: 'rgba(0, 0, 0, 0.8)',
                        color: 'white',
                        padding: '10px',
                        borderRadius: '5px',
                        fontSize: '12px',
                        zIndex: 9999,
                        fontFamily: 'monospace',
                    }}
                >
                    <div><strong>{id}</strong></div>
                    <div>Renders: {localMetrics.renderCount}</div>
                    <div>Last: {localMetrics.actualDuration.toFixed(2)}ms</div>
                    <div>Phase: {localMetrics.phase}</div>
                </div>
            )}
        </>
    );
};

/**
 * Hook para acessar métricas de um profiler específico
 */
export function useRenderMetrics(id: string): RenderMetrics[] {
    const [metrics, setMetrics] = useState<RenderMetrics[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            const stored = renderMetricsStore.get(id);
            if (stored && stored.length !== metrics.length) {
                setMetrics([...stored]);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [id, metrics.length]);

    return metrics;
}

/**
 * Função para obter estatísticas agregadas de todos os profilers
 */
export function getRenderStats(): Record<string, {
    totalRenders: number;
    avgDuration: number;
    maxDuration: number;
    minDuration: number;
}> {
    const stats: Record<string, any> = {};

    renderMetricsStore.forEach((metrics, id) => {
        const durations = metrics.map(m => m.actualDuration);
        stats[id] = {
            totalRenders: metrics.length,
            avgDuration: durations.reduce((a, b) => a + b, 0) / durations.length,
            maxDuration: Math.max(...durations),
            minDuration: Math.min(...durations),
        };
    });

    return stats;
}

/**
 * Função para resetar métricas (útil para comparações antes/depois)
 */
export function resetRenderMetrics(id?: string): void {
    if (id) {
        renderMetricsStore.delete(id);
    } else {
        renderMetricsStore.clear();
    }
}

/**
 * Hook para registrar re-renders de um componente específico
 * (alternativa leve ao Profiler completo)
 */
export function useRenderCounter(componentName: string, logToConsole = false): number {
    const renderCountRef = useRef(0);

    useEffect(() => {
        renderCountRef.current += 1;
        if (logToConsole) {
            console.log(`[RENDER] ${componentName} renderizado ${renderCountRef.current}x`);
        }
    });

    return renderCountRef.current;
}

/**
 * Componente de dashboard para visualizar métricas em tempo real
 */
export const RenderMetricsDashboard: React.FC = () => {
    const [stats, setStats] = useState<ReturnType<typeof getRenderStats>>({});

    useEffect(() => {
        const interval = setInterval(() => {
            setStats(getRenderStats());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    if (Object.keys(stats).length === 0) {
        return (
            <div style={{ padding: '20px', fontFamily: 'monospace' }}>
                <h3>📊 Render Metrics Dashboard</h3>
                <p>Nenhuma métrica coletada ainda.</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', fontFamily: 'monospace', background: '#f5f5f5' }}>
            <h3>📊 Render Metrics Dashboard</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                <thead>
                    <tr style={{ background: '#333', color: 'white' }}>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Component</th>
                        <th style={{ padding: '10px', textAlign: 'right' }}>Total Renders</th>
                        <th style={{ padding: '10px', textAlign: 'right' }}>Avg Duration</th>
                        <th style={{ padding: '10px', textAlign: 'right' }}>Max Duration</th>
                        <th style={{ padding: '10px', textAlign: 'right' }}>Min Duration</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(stats).map(([id, stat]) => (
                        <tr key={id} style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={{ padding: '10px' }}>{id}</td>
                            <td style={{ padding: '10px', textAlign: 'right' }}>{stat.totalRenders}</td>
                            <td style={{ padding: '10px', textAlign: 'right' }}>
                                {stat.avgDuration.toFixed(2)}ms
                            </td>
                            <td style={{ padding: '10px', textAlign: 'right' }}>
                                {stat.maxDuration.toFixed(2)}ms
                            </td>
                            <td style={{ padding: '10px', textAlign: 'right' }}>
                                {stat.minDuration.toFixed(2)}ms
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button
                onClick={() => resetRenderMetrics()}
                style={{
                    marginTop: '20px',
                    padding: '10px 20px',
                    background: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                }}
            >
                Reset Metrics
            </button>
        </div>
    );
};

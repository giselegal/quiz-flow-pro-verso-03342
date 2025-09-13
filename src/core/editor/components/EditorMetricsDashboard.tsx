// @ts-nocheck
/**
 * 📊 DASHBOARD DE MÉTRICAS DO EDITOR
 * 
 * Dashboard completo para visualização em tempo real das métricas
 * de performance, uso e observabilidade do editor de funis
 */


import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import {
    EditorMetricsProvider,
    EditorMetricData,
    EditorPerformanceSnapshot,
    EditorValidationMetrics,
    EditorLoadingMetrics,
    EditorFallbackMetrics,
    EditorUsageMetrics
} from '../interfaces/EditorInterfaces';

// ============================================================================
// TIPOS E INTERFACES
// ============================================================================

interface MetricsDashboardProps {
    metricsProvider: EditorMetricsProvider;
    funnelId?: string;
    refreshInterval?: number;
    showRealTimeData?: boolean;
    showPerformanceChart?: boolean;
    showErrorAnalysis?: boolean;
}

interface DashboardState {
    metrics: EditorMetricData[];
    performanceReport: any;
    isLoading: boolean;
    error: string | null;
    lastUpdated: Date | null;
}

interface MetricCard {
    title: string;
    value: string | number;
    unit?: string;
    trend?: 'up' | 'down' | 'stable';
    color?: 'green' | 'yellow' | 'red' | 'blue';
    description?: string;
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export const EditorMetricsDashboard: React.FC<MetricsDashboardProps> = ({
    metricsProvider,
    funnelId,
    refreshInterval = 30000, // 30 segundos
    showRealTimeData = true,
    showPerformanceChart = true,
    showErrorAnalysis = true
}) => {
    const [state, setState] = useState<DashboardState>({
        metrics: [],
        performanceReport: null,
        isLoading: false,
        error: null,
        lastUpdated: null
    });

    // ============================================================================
    // FETCH DE DADOS
    // ============================================================================

    const fetchMetrics = useCallback(async () => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            const [metrics, performanceReport] = await Promise.all([
                metricsProvider.getMetrics({
                    funnelId,
                    from: new Date(Date.now() - 24 * 60 * 60 * 1000) // últimas 24h
                }),
                metricsProvider.getPerformanceReport(funnelId)
            ]);

            setState(prev => ({
                ...prev,
                metrics,
                performanceReport,
                isLoading: false,
                lastUpdated: new Date()
            }));
        } catch (error) {
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: error instanceof Error ? error.message : 'Failed to fetch metrics'
            }));
        }
    }, [metricsProvider, funnelId]);

    // Auto-refresh
    useEffect(() => {
        fetchMetrics();

        if (showRealTimeData && refreshInterval > 0) {
            const interval = setInterval(fetchMetrics, refreshInterval);
            return () => clearInterval(interval);
        }
    }, [fetchMetrics, showRealTimeData, refreshInterval]);

    // ============================================================================
    // CÁLCULO DE MÉTRICAS
    // ============================================================================

    const getMetricCards = useCallback((): MetricCard[] => {
        if (!state.performanceReport) return [];

        return [
            {
                title: 'Tempo Médio de Carregamento',
                value: Math.round(state.performanceReport.averageLoadTime),
                unit: 'ms',
                color: state.performanceReport.averageLoadTime > 2000 ? 'red' :
                    state.performanceReport.averageLoadTime > 1000 ? 'yellow' : 'green',
                description: 'Tempo médio para carregar funis'
            },
            {
                title: 'Tempo Médio de Salvamento',
                value: Math.round(state.performanceReport.averageSaveTime),
                unit: 'ms',
                color: state.performanceReport.averageSaveTime > 1000 ? 'red' :
                    state.performanceReport.averageSaveTime > 500 ? 'yellow' : 'green',
                description: 'Tempo médio para salvar alterações'
            },
            {
                title: 'Tempo de Validação',
                value: Math.round(state.performanceReport.averageValidationTime),
                unit: 'ms',
                color: state.performanceReport.averageValidationTime > 500 ? 'red' :
                    state.performanceReport.averageValidationTime > 200 ? 'yellow' : 'green',
                description: 'Tempo médio para validar conteúdo'
            },
            {
                title: 'Taxa de Erro',
                value: (state.performanceReport.errorRate * 100).toFixed(1),
                unit: '%',
                color: state.performanceReport.errorRate > 0.05 ? 'red' :
                    state.performanceReport.errorRate > 0.02 ? 'yellow' : 'green',
                description: 'Percentage de operações que falharam'
            },
            {
                title: 'Taxa de Fallback',
                value: (state.performanceReport.fallbackRate * 100).toFixed(1),
                unit: '%',
                color: state.performanceReport.fallbackRate > 0.02 ? 'red' :
                    state.performanceReport.fallbackRate > 0.01 ? 'yellow' : 'green',
                description: 'Frequência de uso de sistemas de fallback'
            },
            {
                title: 'Score de Performance',
                value: Math.round(state.performanceReport.performanceScore),
                unit: '/100',
                color: state.performanceReport.performanceScore < 70 ? 'red' :
                    state.performanceReport.performanceScore < 85 ? 'yellow' : 'green',
                description: 'Score geral de performance do editor'
            }
        ];
    }, [state.performanceReport]);

    // ============================================================================
    // ANÁLISE DE TENDÊNCIAS
    // ============================================================================

    const getRecentTrends = useCallback(() => {
        const last1h = state.metrics.filter(m =>
            m.timestamp > new Date(Date.now() - 60 * 60 * 1000)
        );
        const last24h = state.metrics.filter(m =>
            m.timestamp > new Date(Date.now() - 24 * 60 * 60 * 1000)
        );

        return {
            totalOperations: last24h.length,
            operationsLastHour: last1h.length,
            errors: last24h.filter(m => m.type === 'error_count').length,
            avgLoadTime: last24h.filter(m => m.type === 'load_time')
                .reduce((acc, m, _, arr) => acc + m.value / arr.length, 0),
            topOperations: this.getMostFrequentOperations(last24h)
        };
    }, [state.metrics]);

    const getMostFrequentOperations = (metrics: EditorMetricData[]) => {
        const counts: Record<string, number> = {};
        metrics.forEach(m => {
            counts[m.operation] = (counts[m.operation] || 0) + 1;
        });

        return Object.entries(counts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([operation, count]) => ({ operation, count }));
    };

    // ============================================================================
    // RENDER
    // ============================================================================

    if (state.error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Erro ao carregar métricas</h3>
                        <div className="mt-2 text-sm text-red-700">
                            <p>{state.error}</p>
                        </div>
                        <div className="mt-4">
                            <button
                                onClick={fetchMetrics}
                                className="bg-red-100 px-3 py-2 rounded text-sm text-red-800 hover:bg-red-200"
                            >
                                Tentar Novamente
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const metricCards = getMetricCards();
    const trends = getRecentTrends();

    return (
        <div className="space-y-6 p-6 bg-gray-50">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        📊 Dashboard de Métricas do Editor
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                        {funnelId ? `Funil: ${funnelId}` : 'Todos os funis'} •
                        Última atualização: {state.lastUpdated?.toLocaleTimeString() || 'Nunca'}
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={fetchMetrics}
                        disabled={state.isLoading}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        {state.isLoading ? '⏳ Carregando...' : '🔄 Atualizar'}
                    </button>
                </div>
            </div>

            {/* Cards de Métricas Principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {metricCards.map((card, index) => (
                    <MetricCardComponent key={index} {...card} />
                ))}
            </div>

            {/* Tendências Recentes */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Tendências Recentes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{trends.totalOperations}</div>
                        <div className="text-sm text-gray-600">Operações (24h)</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{trends.operationsLastHour}</div>
                        <div className="text-sm text-gray-600">Operações (1h)</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{trends.errors}</div>
                        <div className="text-sm text-gray-600">Erros (24h)</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">
                            {trends.avgLoadTime ? Math.round(trends.avgLoadTime) : 0}ms
                        </div>
                        <div className="text-sm text-gray-600">Tempo Médio de Load</div>
                    </div>
                </div>
            </div>

            {/* Operações Mais Frequentes */}
            {trends.topOperations && trends.topOperations.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">🔥 Operações Mais Frequentes</h3>
                    <div className="space-y-2">
                        {trends.topOperations.map((item, index) => (
                            <div key={index} className="flex justify-between items-center py-2">
                                <span className="text-gray-700 capitalize">
                                    {item.operation.replace(/_/g, ' ')}
                                </span>
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                                    {item.count}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Issues e Recomendações */}
            {state.performanceReport && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Issues */}
                    {state.performanceReport.issues?.length > 0 && (
                        <div className="bg-red-50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-red-800 mb-4">🚨 Issues Identificadas</h3>
                            <ul className="space-y-2">
                                {state.performanceReport.issues.map((issue: string, index: number) => (
                                    <li key={index} className="text-sm text-red-700 flex items-start">
                                        <span className="text-red-500 mr-2">•</span>
                                        {issue}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Recomendações */}
                    {state.performanceReport.recommendations?.length > 0 && (
                        <div className="bg-green-50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-green-800 mb-4">💡 Recomendações</h3>
                            <ul className="space-y-2">
                                {state.performanceReport.recommendations.map((rec: string, index: number) => (
                                    <li key={index} className="text-sm text-green-700 flex items-start">
                                        <span className="text-green-500 mr-2">•</span>
                                        {rec}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            {/* Status de Tempo Real */}
            {showRealTimeData && (
                <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse mr-2"></div>
                            <span className="text-blue-800 font-medium">Monitoramento Ativo</span>
                        </div>
                        <span className="text-blue-600 text-sm">
                            Atualizando a cada {refreshInterval / 1000}s
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

// ============================================================================
// COMPONENTE AUXILIAR - CARD DE MÉTRICA
// ============================================================================

const MetricCardComponent: React.FC<MetricCard> = ({
    title,
    value,
    unit,
    color = 'blue',
    description
}) => {
    const colorClasses = {
        green: 'border-green-200 bg-green-50',
        yellow: 'border-yellow-200 bg-yellow-50',
        red: 'border-red-200 bg-red-50',
        blue: 'border-blue-200 bg-blue-50'
    };

    const valueColorClasses = {
        green: 'text-green-600',
        yellow: 'text-yellow-600',
        red: 'text-red-600',
        blue: 'text-blue-600'
    };

    return (
        <div className={`border rounded-lg p-4 ${colorClasses[color]}`}>
            <div className="flex justify-between items-start mb-2">
                <h4 className="text-sm font-medium text-gray-700">{title}</h4>
                <div className={`text-2xl font-bold ${valueColorClasses[color]}`}>
                    {value}{unit && <span className="text-sm font-normal">{unit}</span>}
                </div>
            </div>
            {description && (
                <p className="text-xs text-gray-600 mt-2">{description}</p>
            )}
        </div>
    );
};

// ============================================================================
// COMPONENTE SIMPLIFICADO PARA TESTES
// ============================================================================

export const EditorMetricsDashboardSimple: React.FC<{
    metricsProvider: EditorMetricsProvider;
    funnelId?: string;
}> = ({ metricsProvider, funnelId }) => {
    const [metrics, setMetrics] = useState<EditorMetricData[]>([]);
    const [report, setReport] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            const [metricsData, reportData] = await Promise.all([
                metricsProvider.getMetrics({ funnelId }),
                metricsProvider.getPerformanceReport(funnelId)
            ]);
            setMetrics(metricsData);
            setReport(reportData);
        };

        fetchData();
    }, [metricsProvider, funnelId]);

    if (!report) {
        return <div>Carregando métricas...</div>;
    }

    return (
        <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="text-lg font-bold mb-4">📊 Métricas do Editor</h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <div className="text-lg font-semibold">{Math.round(report.averageLoadTime)}ms</div>
                    <div className="text-sm text-gray-600">Tempo de Carregamento</div>
                </div>
                <div>
                    <div className="text-lg font-semibold">{(report.errorRate * 100).toFixed(1)}%</div>
                    <div className="text-sm text-gray-600">Taxa de Erro</div>
                </div>
            </div>

            <div className="text-sm text-gray-600">
                Score: {Math.round(report.performanceScore)}/100 •
                Métricas coletadas: {metrics.length}
            </div>
        </div>
    );
};

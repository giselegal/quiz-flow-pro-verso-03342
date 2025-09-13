/**
 * 📊 PERFORMANCE DASHBOARD - Painel de Monitoramento Visual
 * 
 * Dashboard interativo para monitoramento de performance em tempo real
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
    Activity,
    BarChart3,
    Clock,
    Database,
    RefreshCw,
    Trash2,
    TrendingUp,
    AlertTriangle,
    CheckCircle,
    XCircle
} from 'lucide-react';

interface PerformanceMetric {
    component: string;
    renders: number;
    avgTime: number;
    totalTime: number;
    lastRender: number;
}

interface CacheStats {
    totalCaches: number;
    totalHits: number;
    totalMisses: number;
    hitRate: () => string;
    cachesByComponent: Record<string, any>;
}

export const PerformanceDashboard: React.FC = () => {
    const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
    const [cacheStats, setCacheStats] = useState<CacheStats | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [refreshInterval, setRefreshInterval] = useState(2000);

    // Coletar métricas de performance
    const collectMetrics = useCallback(() => {
        const profilerData = (window as any).__PERFORMANCE_PROFILER_DATA__ || {};

        const metricsArray = Object.entries(profilerData)
            .map(([component, data]: [string, any]) => ({
                component,
                renders: data.renderCount || 0,
                avgTime: data.renderCount > 0 ? (data.totalTime || 0) / data.renderCount : 0,
                totalTime: data.totalTime || 0,
                lastRender: data.lastRender || 0
            }))
            .sort((a, b) => b.renders - a.renders);

        setMetrics(metricsArray);
    }, []);

    // Coletar estatísticas de cache
    const collectCacheStats = useCallback(() => {
        const cacheData = (window as any).__ADVANCED_MEMO_CACHE_STATS__ || {};

        const totalHits = Object.values(cacheData).reduce((sum: number, stats: any) => sum + (stats.hits || 0), 0);
        const totalMisses = Object.values(cacheData).reduce((sum: number, stats: any) => sum + (stats.misses || 0), 0);

        setCacheStats({
            totalCaches: Object.keys(cacheData).length,
            totalHits,
            totalMisses,
            hitRate: () => {
                const total = totalHits + totalMisses;
                return total > 0 ? (totalHits / total * 100).toFixed(1) + '%' : '0%';
            },
            cachesByComponent: cacheData
        });
    }, []);

    // Atualizar métricas periodicamente
    useEffect(() => {
        collectMetrics();
        collectCacheStats();

        if (autoRefresh) {
            const interval = setInterval(() => {
                collectMetrics();
                collectCacheStats();
            }, refreshInterval);

            return () => clearInterval(interval);
        }
    }, [autoRefresh, refreshInterval, collectMetrics, collectCacheStats]);

    // Limpar todos os caches
    const clearAllCaches = useCallback(() => {
        if ((window as any).__ADVANCED_MEMO_CLEAR_ALL__) {
            (window as any).__ADVANCED_MEMO_CLEAR_ALL__();
            collectCacheStats();
            console.log('🧹 Todos os caches foram limpos');
        }
    }, [collectCacheStats]);

    // Resetar métricas de render
    const resetRenderMetrics = useCallback(() => {
        (window as any).__PERFORMANCE_PROFILER_DATA__ = {};
        setMetrics([]);
        console.log('🔄 Métricas de render resetadas');
    }, []);

    // Obter cor do badge baseado na performance
    const getPerformanceBadgeColor = (avgTime: number) => {
        if (avgTime < 8) return 'default'; // Bom
        if (avgTime < 16) return 'secondary'; // Aceitável
        return 'destructive'; // Ruim (>16ms = 60fps)
    };

    // Obter ícone de status de performance
    const getPerformanceIcon = (avgTime: number) => {
        if (avgTime < 8) return <CheckCircle className="h-4 w-4 text-green-500" />;
        if (avgTime < 16) return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
        return <XCircle className="h-4 w-4 text-red-500" />;
    };

    // Toggle do painel
    if (!isVisible && process.env.NODE_ENV !== 'development') return null;

    return (
        <>
            {/* Toggle Button */}
            {!isVisible && (
                <Button
                    onClick={() => setIsVisible(true)}
                    className="fixed bottom-4 right-4 z-50 bg-blue-600 hover:bg-blue-700"
                    size="sm"
                >
                    <Activity className="h-4 w-4 mr-2" />
                    Performance
                </Button>
            )}

            {/* Dashboard */}
            {isVisible && (
                <div className="fixed bottom-4 right-4 z-50 w-96 max-h-96 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-gray-50 p-3 border-b flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-blue-600" />
                            <h3 className="font-semibold text-sm">Performance Monitor</h3>
                            {autoRefresh && (
                                <Badge variant="outline" className="text-xs">
                                    Auto {refreshInterval}ms
                                </Badge>
                            )}
                        </div>
                        <Button
                            onClick={() => setIsVisible(false)}
                            variant="ghost"
                            size="sm"
                            className="p-1"
                        >
                            ✕
                        </Button>
                    </div>

                    {/* Content */}
                    <div className="p-3 max-h-80 overflow-y-auto">
                        {/* Controls */}
                        <div className="flex gap-2 mb-3">
                            <Button
                                onClick={() => setAutoRefresh(!autoRefresh)}
                                variant={autoRefresh ? 'default' : 'outline'}
                                size="sm"
                                className="flex-1"
                            >
                                <RefreshCw className={`h-3 w-3 mr-1 ${autoRefresh ? 'animate-spin' : ''}`} />
                                Auto
                            </Button>
                            <Button onClick={clearAllCaches} variant="outline" size="sm">
                                <Database className="h-3 w-3 mr-1" />
                                Clear Cache
                            </Button>
                            <Button onClick={resetRenderMetrics} variant="outline" size="sm">
                                <Trash2 className="h-3 w-3 mr-1" />
                                Reset
                            </Button>
                        </div>

                        {/* Cache Stats */}
                        {cacheStats && (
                            <Card className="mb-3">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-xs flex items-center gap-2">
                                        <Database className="h-3 w-3" />
                                        Cache Performance
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div>
                                            <span className="text-gray-600">Hit Rate:</span>
                                            <div className="font-mono font-bold text-green-600">
                                                {cacheStats.hitRate()}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Caches:</span>
                                            <div className="font-mono font-bold">
                                                {cacheStats.totalCaches}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Hits:</span>
                                            <div className="font-mono text-green-600">
                                                {cacheStats.totalHits}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Misses:</span>
                                            <div className="font-mono text-red-600">
                                                {cacheStats.totalMisses}
                                            </div>
                                        </div>
                                    </div>
                                    <Progress
                                        value={parseFloat(cacheStats.hitRate())}
                                        className="mt-2 h-1"
                                    />
                                </CardContent>
                            </Card>
                        )}

                        {/* Render Metrics */}
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs flex items-center gap-2">
                                    <BarChart3 className="h-3 w-3" />
                                    Component Renders
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                                {metrics.length === 0 ? (
                                    <div className="text-xs text-gray-500 py-2">
                                        Nenhuma métrica coletada ainda...
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {metrics.slice(0, 6).map((metric) => (
                                            <div
                                                key={metric.component}
                                                className="flex items-center justify-between text-xs border-b border-gray-100 pb-2"
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-medium truncate">
                                                        {metric.component.replace('Optimized', '').replace('-', ' ')}
                                                    </div>
                                                    <div className="text-gray-500 flex items-center gap-2">
                                                        <span>{metric.renders} renders</span>
                                                        <span>•</span>
                                                        <span>{metric.avgTime.toFixed(1)}ms avg</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {getPerformanceIcon(metric.avgTime)}
                                                    <Badge
                                                        variant={getPerformanceBadgeColor(metric.avgTime) as any}
                                                        className="text-xs"
                                                    >
                                                        {metric.avgTime.toFixed(1)}ms
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))}

                                        {metrics.length > 6 && (
                                            <div className="text-xs text-gray-500 text-center pt-1">
                                                +{metrics.length - 6} componentes adicionais
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Performance Tips */}
                        <div className="mt-3 p-2 bg-blue-50 rounded text-xs">
                            <div className="flex items-center gap-2 font-medium text-blue-800 mb-1">
                                <TrendingUp className="h-3 w-3" />
                                Dicas de Performance
                            </div>
                            <ul className="text-blue-700 space-y-1 text-xs">
                                <li>• &lt;8ms: Excelente performance ✅</li>
                                <li>• 8-16ms: Performance aceitável ⚠️</li>
                                <li>• &gt;16ms: Requer otimização ❌</li>
                                <li>• Cache hit rate &gt;80%: Ideal 🎯</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PerformanceDashboard;

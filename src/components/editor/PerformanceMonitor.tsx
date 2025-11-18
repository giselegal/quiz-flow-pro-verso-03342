/**
 * 📊 WAVE 2: Performance Monitor Dashboard
 * 
 * Dashboard em tempo real para monitorar:
 * - TTI (Time to Interactive)
 * - Cache Hit Rate
 * - Network requests (404s)
 * - Selection state
 * - Memory usage
 */

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cacheManager } from '@/lib/cache/CacheManager';
import { networkMonitor } from '@/lib/monitoring/NetworkMonitor';
import { Activity, Database, Network, Clock, AlertTriangle } from 'lucide-react';

interface PerformanceMetrics {
    tti: number;
    fcp: number;
    lcp: number;
    cacheHitRate: number;
    networkRequests: number;
    errors404: number;
    memoryUsage: number;
    selectedBlockId: string | null;
    selectedBlockType: string | null;
    selectionChainValid: boolean;
    // FASE 3: Métricas FASE 1/2
    masterFileRequests: number; // Requests ao quiz21-complete.json
    warmupCompleted: boolean; // Warmup de cache executado
    prefetchCount: number; // Steps prefetchados
    cacheMemorySize: number; // Items em L1 cache
}

interface PerformanceMonitorProps {
    selectedBlockId?: string | null;
    selectedBlockType?: string | null;
}

export function PerformanceMonitor({
    selectedBlockId = null,
    selectedBlockType = null
}: PerformanceMonitorProps = {}) {
    const [metrics, setMetrics] = useState<PerformanceMetrics>({
        tti: 0,
        fcp: 0,
        lcp: 0,
        cacheHitRate: 0,
        networkRequests: 0,
        errors404: 0,
        memoryUsage: 0,
        selectedBlockId: selectedBlockId || null,
        selectedBlockType: selectedBlockType || null,
        selectionChainValid: !!(selectedBlockId && selectedBlockType),
        // FASE 3
        masterFileRequests: 0,
        warmupCompleted: false,
        prefetchCount: 0,
        cacheMemorySize: 0,
    });

    const [isExpanded, setIsExpanded] = useState(false);
    const [alerts, setAlerts] = useState<string[]>([]);

    // FASE 3: Detectar problemas de performance
    const checkPerformanceAlerts = (updatedMetrics: PerformanceMetrics) => {
        const newAlerts: string[] = [];

        if (updatedMetrics.tti > 1000) {
            newAlerts.push(`⚠️ TTI alto: ${updatedMetrics.tti}ms (target: <1000ms)`);
        }

        if (updatedMetrics.cacheHitRate < 80) {
            newAlerts.push(`⚠️ Cache hit rate baixo: ${updatedMetrics.cacheHitRate.toFixed(1)}% (target: >80%)`);
        }

        if (updatedMetrics.errors404 > 5) {
            newAlerts.push(`⚠️ Muitos 404s: ${updatedMetrics.errors404} (target: <5)`);
        }

        if (updatedMetrics.memoryUsage > 150) {
            newAlerts.push(`⚠️ Memória alta: ${updatedMetrics.memoryUsage}MB (considere: <150MB)`);
        }

        setAlerts(newAlerts);

        // FASE 3: Notificações críticas (apenas 1x por sessão para evitar spam)
        if (typeof window !== 'undefined') {
            // TTI crítico
            if (updatedMetrics.tti > 2000 && !(window as any).__perfCriticalNotified) {
                console.error('[PerformanceMonitor] CRITICAL: TTI muito alto!', {
                    tti: updatedMetrics.tti,
                    cacheHitRate: updatedMetrics.cacheHitRate,
                    errors404: updatedMetrics.errors404,
                });
                (window as any).__perfCriticalNotified = true;
            }

            // 404s excessivos
            if (updatedMetrics.errors404 > 20 && !(window as any).__perf404Notified) {
                console.warn('[PerformanceMonitor] WARNING: Muitos 404s detectados!', {
                    errors404: updatedMetrics.errors404,
                    failedPaths: networkMonitor.getStats().failedPaths.slice(-5),
                });
                (window as any).__perf404Notified = true;
            }
        }
    };

    useEffect(() => {
        // Coletar Web Vitals
        const collectWebVitals = () => {
            if (typeof window === 'undefined' || !window.performance) return;

            const perfData = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

            setMetrics(prev => ({
                ...prev,
                tti: perfData.domInteractive - perfData.fetchStart,
                fcp: perfData.responseEnd - perfData.fetchStart,
                lcp: perfData.loadEventEnd - perfData.fetchStart,
            }));
        };

        // Coletar Cache Stats (FASE 3: incluir memorySize)
        const collectCacheStats = () => {
            const stats = cacheManager.getStats();
            setMetrics(prev => {
                const updated = {
                    ...prev,
                    cacheHitRate: stats.hitRate,
                    cacheMemorySize: stats.memorySize,
                };
                checkPerformanceAlerts(updated);
                return updated;
            });
        };

        // Coletar Network Stats (FASE 3: usar NetworkMonitor real)
        const collectNetworkStats = () => {
            const networkStats = networkMonitor.getStats();

            setMetrics(prev => {
                const updated = {
                    ...prev,
                    networkRequests: networkStats.totalRequests,
                    errors404: networkStats.errors404,
                    masterFileRequests: networkStats.masterFileRequests,
                };
                checkPerformanceAlerts(updated);
                return updated;
            });
        };

        // Coletar Memory Usage
        const collectMemoryStats = () => {
            if (typeof window === 'undefined' || !(performance as any).memory) return;

            const memory = (performance as any).memory;
            const usedMB = memory.usedJSHeapSize / 1048576; // Bytes to MB

            setMetrics(prev => ({
                ...prev,
                memoryUsage: Math.round(usedMB),
            }));
        };

        // Atualizar seleção (recebido via props)
        const updateSelection = () => {
            setMetrics(prev => ({
                ...prev,
                selectedBlockId,
                selectedBlockType,
                selectionChainValid: !!(selectedBlockId && selectedBlockType),
            }));
        };

        // Coletar métricas inicialmente
        collectWebVitals();
        collectCacheStats();
        collectNetworkStats();
        collectMemoryStats();
        updateSelection();

        // Atualizar a cada 5 segundos
        const interval = setInterval(() => {
            collectCacheStats();
            collectNetworkStats();
            collectMemoryStats();
        }, 5000);

        return () => clearInterval(interval);
    }, [selectedBlockId, selectedBlockType]);

    const getStatusColor = (metric: string, value: number): string => {
        switch (metric) {
            case 'tti':
                if (value < 1000) return 'text-green-600';
                if (value < 2000) return 'text-yellow-600';
                return 'text-red-600';

            case 'cacheHitRate':
                if (value > 80) return 'text-green-600';
                if (value > 50) return 'text-yellow-600';
                return 'text-red-600';

            case 'errors404':
                if (value < 5) return 'text-green-600';
                if (value < 15) return 'text-yellow-600';
                return 'text-red-600';

            default:
                return 'text-gray-600';
        }
    };

    const getStatusBadge = (metric: string, value: number): React.ReactNode => {
        const isGood = (() => {
            switch (metric) {
                case 'tti': return value < 1000;
                case 'cacheHitRate': return value > 80;
                case 'errors404': return value < 5;
                default: return true;
            }
        })();

        return (
            <Badge variant={isGood ? 'default' : 'destructive'} className="text-xs">
                {isGood ? '✅ OK' : '⚠️ ATENÇÃO'}
            </Badge>
        );
    };

    if (!isExpanded) {
        // Compact view
        return (
            <div
                className="fixed bottom-4 right-4 z-50 cursor-pointer"
                onClick={() => setIsExpanded(true)}
            >
                <Card className="p-3 bg-white/95 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow">
                    <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-blue-600 animate-pulse" />
                        <span className="text-xs font-semibold">Performance Monitor</span>
                        <Badge variant="secondary" className="text-[10px]">
                            {metrics.cacheHitRate.toFixed(0)}% cache
                        </Badge>
                    </div>
                </Card>
            </div>
        );
    }

    // Expanded view
    return (
        <div className="fixed bottom-4 right-4 z-50 w-80">
            <Card className="bg-white/95 backdrop-blur-sm shadow-2xl">
                {/* Header */}
                <div className="p-3 border-b bg-gradient-to-r from-blue-50 to-blue-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Activity className="w-5 h-5 text-blue-600" />
                            <h3 className="font-bold text-sm">Performance Monitor</h3>
                        </div>
                        <button
                            onClick={() => setIsExpanded(false)}
                            className="text-gray-500 hover:text-gray-700 text-xs"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Metrics */}
                <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                    {/* TTI */}
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-500" />
                            <div>
                                <div className="text-xs font-medium">TTI</div>
                                <div className="text-[10px] text-gray-500">Time to Interactive</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className={`text-sm font-bold ${getStatusColor('tti', metrics.tti)}`}>
                                {metrics.tti > 0 ? `${metrics.tti}ms` : '-'}
                            </div>
                            {metrics.tti > 0 && getStatusBadge('tti', metrics.tti)}
                        </div>
                    </div>

                    {/* Cache Hit Rate */}
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                            <Database className="w-4 h-4 text-green-500" />
                            <div>
                                <div className="text-xs font-medium">Cache Hit Rate</div>
                                <div className="text-[10px] text-gray-500">L1 + L2 combinados</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className={`text-sm font-bold ${getStatusColor('cacheHitRate', metrics.cacheHitRate)}`}>
                                {metrics.cacheHitRate.toFixed(1)}%
                            </div>
                            {getStatusBadge('cacheHitRate', metrics.cacheHitRate)}
                        </div>
                    </div>

                    {/* Network Requests */}
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                            <Network className="w-4 h-4 text-purple-500" />
                            <div>
                                <div className="text-xs font-medium">Network</div>
                                <div className="text-[10px] text-gray-500">Total requests</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm font-bold text-gray-700">
                                {metrics.networkRequests}
                            </div>
                        </div>
                    </div>

                    {/* 404 Errors */}
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-orange-500" />
                            <div>
                                <div className="text-xs font-medium">404 Errors</div>
                                <div className="text-[10px] text-gray-500">Failed requests</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className={`text-sm font-bold ${getStatusColor('errors404', metrics.errors404)}`}>
                                {metrics.errors404}
                            </div>
                            {getStatusBadge('errors404', metrics.errors404)}
                        </div>
                    </div>

                    {/* Memory Usage */}
                    {metrics.memoryUsage > 0 && (
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                                <Activity className="w-4 h-4 text-red-500" />
                                <div>
                                    <div className="text-xs font-medium">Memory</div>
                                    <div className="text-[10px] text-gray-500">JS Heap Size</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-bold text-gray-700">
                                    {metrics.memoryUsage} MB
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Selection Debug (WAVE 3) */}
                    <div className="pt-3 border-t">
                        <div className="text-[10px] font-semibold text-gray-500 mb-2">🎯 SELEÇÃO ATIVA (DEBUG)</div>
                        <div className="space-y-2">
                            <div>
                                <div className="text-[10px] text-gray-600 mb-1">Block ID:</div>
                                <div className="text-xs font-mono bg-gray-50 p-1 rounded break-all">
                                    {metrics.selectedBlockId || <span className="text-gray-400">nenhum</span>}
                                </div>
                            </div>
                            <div>
                                <div className="text-[10px] text-gray-600 mb-1">Block Type:</div>
                                <div className="text-xs font-mono bg-gray-50 p-1 rounded">
                                    {metrics.selectedBlockType || <span className="text-gray-400">nenhum</span>}
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] text-gray-600">Selection Chain:</span>
                                {metrics.selectionChainValid ? (
                                    <Badge variant="default" className="text-[9px]">✅ VÁLIDA</Badge>
                                ) : (
                                    <Badge variant="destructive" className="text-[9px]">❌ QUEBRADA</Badge>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* FASE 1/2 Metrics */}
                    <div className="pt-3 border-t">
                        <div className="text-[10px] font-semibold text-gray-500 mb-2">🚀 FASE 1/2 STATUS</div>
                        <div className="space-y-1 text-[10px]">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Master File Requests:</span>
                                <span className="font-mono font-medium">{metrics.masterFileRequests}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Cache Memory (L1):</span>
                                <span className="font-mono font-medium">{metrics.cacheMemorySize} items</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Prefetch Count:</span>
                                <span className="font-mono font-medium">{metrics.prefetchCount}</span>
                            </div>
                            <div className="mt-2 pt-2 border-t">
                                <div className="text-[10px] font-semibold mb-1">📊 FASE 1 Score</div>
                                <div className="text-xs">
                                    {(() => {
                                        const { score, verdict } = networkMonitor.getFase1Score();
                                        return (
                                            <>
                                                <div className="font-bold text-blue-600">{score}/100</div>
                                                <div className="text-[9px] mt-1">{verdict}</div>
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Alerts */}
                    {alerts.length > 0 && (
                        <div className="pt-3 border-t">
                            <div className="text-[10px] font-semibold text-red-600 mb-2">⚠️ ALERTAS</div>
                            <div className="space-y-1">
                                {alerts.map((alert, i) => (
                                    <div key={i} className="text-[10px] text-red-600 bg-red-50 p-1 rounded">
                                        {alert}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Targets */}
                    <div className="pt-3 border-t">
                        <div className="text-[10px] font-semibold text-gray-500 mb-2">🎯 TARGETS (WAVE 2)</div>
                        <div className="space-y-1 text-[10px]">
                            <div className="flex justify-between">
                                <span className="text-gray-600">TTI:</span>
                                <span className="font-medium">&lt; 1000ms</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Cache:</span>
                                <span className="font-medium">&gt; 80%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">404s:</span>
                                <span className="font-medium">&lt; 5</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}

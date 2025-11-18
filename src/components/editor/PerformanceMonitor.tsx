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
import { Activity, Database, Network, Clock, AlertTriangle } from 'lucide-react';

interface PerformanceMetrics {
    tti: number;
    fcp: number;
    lcp: number;
    cacheHitRate: number;
    networkRequests: number;
    errors404: number;
    memoryUsage: number;
}

export function PerformanceMonitor() {
    const [metrics, setMetrics] = useState<PerformanceMetrics>({
        tti: 0,
        fcp: 0,
        lcp: 0,
        cacheHitRate: 0,
        networkRequests: 0,
        errors404: 0,
        memoryUsage: 0,
    });

    const [isExpanded, setIsExpanded] = useState(false);

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

        // Coletar Cache Stats
        const collectCacheStats = () => {
            const stats = cacheManager.getStats();
            setMetrics(prev => ({
                ...prev,
                cacheHitRate: stats.hitRate,
            }));
        };

        // Coletar Network Stats
        const collectNetworkStats = () => {
            if (typeof window === 'undefined' || !window.performance) return;

            const resources = window.performance.getEntriesByType('resource') as PerformanceResourceTiming[];
            const total = resources.length;
            const errors = resources.filter(r => {
                // Tentar detectar 404s por padrões comuns
                return r.name.includes('404') || r.duration === 0;
            }).length;

            setMetrics(prev => ({
                ...prev,
                networkRequests: total,
                errors404: errors,
            }));
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

        // Coletar métricas inicialmente
        collectWebVitals();
        collectCacheStats();
        collectNetworkStats();
        collectMemoryStats();

        // Atualizar a cada 5 segundos
        const interval = setInterval(() => {
            collectCacheStats();
            collectNetworkStats();
            collectMemoryStats();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

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

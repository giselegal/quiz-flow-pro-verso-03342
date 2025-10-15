/**
 * 📊 PERFORMANCE MONITOR - Monitoramento de Performance do Preview
 * 
 * Sistema completo de métricas e alertas de performance para o preview ao vivo
 */

import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Activity,
    Clock,
    Database,
    AlertTriangle,
    CheckCircle,
    TrendingUp,
    TrendingDown,
    BarChart3,
    Settings
} from 'lucide-react';
import { useLiveCanvasPreview } from '@/hooks/useLiveCanvasPreview';

// ============================================================================
// TYPES
// ============================================================================

interface PerformanceAlert {
    id: string;
    type: 'warning' | 'error' | 'info';
    message: string;
    timestamp: number;
    value?: number;
    threshold?: number;
}

interface PerformanceThresholds {
    maxUpdateTime: number;        // ms
    minCacheEfficiency: number;   // 0-1
    maxErrorRate: number;         // 0-1
    maxUpdatesPerSecond: number;  // number
}

interface PerformanceTrend {
    timestamp: number;
    updateTime: number;
    cacheEfficiency: number;
    errorRate: number;
    updatesPerSecond: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const DEFAULT_THRESHOLDS: PerformanceThresholds = {
    maxUpdateTime: 100,           // 100ms
    minCacheEfficiency: 0.7,      // 70%
    maxErrorRate: 0.1,            // 10%
    maxUpdatesPerSecond: 15       // 15/sec
};

const TREND_HISTORY_SIZE = 50;    // Keep last 50 measurements
const ALERT_COOLDOWN = 5000;      // 5s between same alerts

// ============================================================================
// PERFORMANCE MONITOR COMPONENT
// ============================================================================

interface PreviewPerformanceMonitorProps {
    steps: any[];
    selectedStepId?: string;
    thresholds?: Partial<PerformanceThresholds>;
    onAlert?: (alert: PerformanceAlert) => void;
    enablePersistentStats?: boolean;
    className?: string;
}

export const PreviewPerformanceMonitor: React.FC<PreviewPerformanceMonitorProps> = ({
    steps,
    selectedStepId,
    thresholds: userThresholds,
    onAlert,
    enablePersistentStats = true,
    className
}) => {
    // ===== CONFIGURATION =====
    const thresholds: PerformanceThresholds = {
        ...DEFAULT_THRESHOLDS,
        ...userThresholds
    };

    // ===== LIVE PREVIEW HOOK =====
    const {
        metrics,
        state,
        isActive,
        hasError,
        errorMessage
    } = useLiveCanvasPreview(steps, selectedStepId, {
        enableDebounce: true,
        debounceDelay: 300,
        enableCache: true,
        enableDebug: process.env.NODE_ENV === 'development'
    });

    // ===== STATE =====
    const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
    const [trends, setTrends] = useState<PerformanceTrend[]>([]);
    const [showDetails, setShowDetails] = useState(false);
    const [isCollecting, setIsCollecting] = useState(true);

    // ===== REFS =====
    const alertCooldownRef = useRef<Map<string, number>>(new Map());
    const trendIntervalRef = useRef<NodeJS.Timeout>();

    // ===== ALERT SYSTEM =====
    const createAlert = (
        type: PerformanceAlert['type'],
        message: string,
        value?: number,
        threshold?: number
    ): PerformanceAlert => ({
        id: `${type}-${Date.now()}-${Math.random()}`,
        type,
        message,
        timestamp: Date.now(),
        value,
        threshold
    });

    const addAlert = (alert: PerformanceAlert) => {
        const alertKey = `${alert.type}-${alert.message}`;
        const lastAlert = alertCooldownRef.current.get(alertKey);

        // Cooldown check
        if (lastAlert && Date.now() - lastAlert < ALERT_COOLDOWN) {
            return;
        }

        alertCooldownRef.current.set(alertKey, Date.now());
        setAlerts(prev => [alert, ...prev.slice(0, 9)]); // Keep last 10 alerts
        onAlert?.(alert);

        // Console logging for development
        if (process.env.NODE_ENV === 'development') {
            const logFn = alert.type === 'error' ? console.error :
                alert.type === 'warning' ? console.warn : console.info;
            logFn(`📊 Preview Alert [${alert.type}]:`, alert.message, alert.value);
        }
    };

    // ===== PERFORMANCE ANALYSIS =====
    useEffect(() => {
        if (!isActive || !metrics) return;

        // Update Time Alert
        if (metrics.averageUpdateTime > thresholds.maxUpdateTime) {
            addAlert(createAlert(
                'warning',
                `Preview update time is slow: ${metrics.averageUpdateTime.toFixed(1)}ms`,
                metrics.averageUpdateTime,
                thresholds.maxUpdateTime
            ));
        }

        // Cache Efficiency Alert
        if (metrics.cacheEfficiency < thresholds.minCacheEfficiency) {
            addAlert(createAlert(
                'warning',
                `Cache efficiency is low: ${(metrics.cacheEfficiency * 100).toFixed(1)}%`,
                metrics.cacheEfficiency,
                thresholds.minCacheEfficiency
            ));
        }

        // Error Rate Alert
        if (metrics.errorRate > thresholds.maxErrorRate) {
            addAlert(createAlert(
                'error',
                `High error rate: ${(metrics.errorRate * 100).toFixed(1)}%`,
                metrics.errorRate,
                thresholds.maxErrorRate
            ));
        }

        // Updates Per Second Alert
        if (metrics.updatesPerSecond > thresholds.maxUpdatesPerSecond) {
            addAlert(createAlert(
                'warning',
                `High update frequency: ${metrics.updatesPerSecond.toFixed(1)}/sec`,
                metrics.updatesPerSecond,
                thresholds.maxUpdatesPerSecond
            ));
        }
    }, [metrics, isActive, thresholds]);

    // ===== TREND COLLECTION =====
    useEffect(() => {
        if (!isCollecting || !isActive) return;

        trendIntervalRef.current = setInterval(() => {
            if (metrics) {
                const trend: PerformanceTrend = {
                    timestamp: Date.now(),
                    updateTime: metrics.averageUpdateTime,
                    cacheEfficiency: metrics.cacheEfficiency,
                    errorRate: metrics.errorRate,
                    updatesPerSecond: metrics.updatesPerSecond
                };

                setTrends(prev => [trend, ...prev.slice(0, TREND_HISTORY_SIZE - 1)]);
            }
        }, 2000); // Collect every 2 seconds

        return () => {
            if (trendIntervalRef.current) {
                clearInterval(trendIntervalRef.current);
            }
        };
    }, [isCollecting, isActive, metrics]);

    // ===== TREND ANALYSIS =====
    const trendAnalysis = React.useMemo(() => {
        if (trends.length < 10) return null;

        const recent = trends.slice(0, 10);
        const older = trends.slice(10, 20);

        const avgRecent = recent.reduce((sum, t) => sum + t.updateTime, 0) / recent.length;
        const avgOlder = older.reduce((sum, t) => sum + t.updateTime, 0) / older.length;

        return {
            updateTimeTrend: avgRecent > avgOlder ? 'worse' : 'better',
            updateTimeDelta: Math.abs(avgRecent - avgOlder),
            recentAvg: avgRecent,
            olderAvg: avgOlder
        };
    }, [trends]);

    // ===== RENDER HELPERS =====
    const getStatusColor = () => {
        if (!isActive) return 'bg-gray-500';
        if (hasError) return 'bg-red-500';

        const hasWarnings = alerts.some(a => a.type === 'warning' || a.type === 'error');
        return hasWarnings ? 'bg-yellow-500' : 'bg-green-500';
    };

    const formatValue = (value: number, unit: string) => {
        return `${value.toFixed(1)}${unit}`;
    };

    if (!isActive) {
        return (
            <div className={`p-2 bg-gray-100 rounded text-xs text-gray-600 ${className}`}>
                📊 Performance Monitor (Inactive)
            </div>
        );
    }

    return (
        <Card className={`w-full ${className}`}>
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        Performance Monitor
                        <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
                    </CardTitle>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowDetails(!showDetails)}
                        >
                            <BarChart3 className="w-3 h-3" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsCollecting(!isCollecting)}
                        >
                            <Settings className={`w-3 h-3 ${isCollecting ? 'text-green-600' : 'text-gray-400'}`} />
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-0 space-y-3">
                {/* Current Metrics */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Update Time:</span>
                        <Badge variant={metrics.averageUpdateTime > thresholds.maxUpdateTime ? 'destructive' : 'secondary'}>
                            {formatValue(metrics.averageUpdateTime, 'ms')}
                        </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Cache Hit:</span>
                        <Badge variant={metrics.cacheEfficiency < thresholds.minCacheEfficiency ? 'destructive' : 'secondary'}>
                            {formatValue(metrics.cacheEfficiency * 100, '%')}
                        </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Updates:</span>
                        <Badge variant="outline">
                            {metrics.totalUpdates}
                        </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Error Rate:</span>
                        <Badge variant={metrics.errorRate > thresholds.maxErrorRate ? 'destructive' : 'secondary'}>
                            {formatValue(metrics.errorRate * 100, '%')}
                        </Badge>
                    </div>
                </div>

                {/* Trend Indicator */}
                {trendAnalysis && (
                    <div className="flex items-center gap-1 text-xs">
                        <span className="text-muted-foreground">Trend:</span>
                        {trendAnalysis.updateTimeTrend === 'better' ? (
                            <TrendingUp className="w-3 h-3 text-green-600" />
                        ) : (
                            <TrendingDown className="w-3 h-3 text-red-600" />
                        )}
                        <span className={trendAnalysis.updateTimeTrend === 'better' ? 'text-green-600' : 'text-red-600'}>
                            {formatValue(trendAnalysis.updateTimeDelta, 'ms')}
                        </span>
                    </div>
                )}

                {/* Recent Alerts */}
                {alerts.length > 0 && (
                    <div className="space-y-1">
                        <div className="text-xs font-medium text-muted-foreground">Recent Alerts:</div>
                        {alerts.slice(0, 3).map(alert => (
                            <div key={alert.id} className="flex items-start gap-1 text-xs">
                                {alert.type === 'error' ? (
                                    <AlertTriangle className="w-3 h-3 text-red-500 flex-shrink-0 mt-0.5" />
                                ) : alert.type === 'warning' ? (
                                    <AlertTriangle className="w-3 h-3 text-yellow-500 flex-shrink-0 mt-0.5" />
                                ) : (
                                    <CheckCircle className="w-3 h-3 text-blue-500 flex-shrink-0 mt-0.5" />
                                )}
                                <span className="text-muted-foreground line-clamp-2">{alert.message}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Detailed View */}
                {showDetails && (
                    <div className="border-t pt-2 space-y-2 text-xs">
                        <div className="font-medium">Detailed Statistics:</div>
                        <div className="grid grid-cols-1 gap-1">
                            <div>Steps Count: {steps.length}</div>
                            <div>Updates/sec: {formatValue(metrics.updatesPerSecond, '')}</div>
                            <div>State Updates: {state.updateCount}</div>
                            <div>Cache Hits: {state.cacheHits}</div>
                            <div>Cache Misses: {state.cacheMisses}</div>
                            <div>Trends Collected: {trends.length}</div>
                            <div>Alerts Generated: {alerts.length}</div>
                        </div>

                        {hasError && (
                            <div className="bg-red-50 p-2 rounded border text-red-700">
                                <div className="font-medium">Current Error:</div>
                                <div>{errorMessage}</div>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default PreviewPerformanceMonitor;
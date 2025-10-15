/**
 * 📊 PERFORMANCE DASHBOARD - Dashboard Consolidado de Performance
 * 
 * Dashboard completo que agrupa métricas de cache, rendering, WebSocket,
 * A/B testing e performance geral do sistema de preview.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Alert, AlertDescription } from '../../ui/alert';
import {
    BarChart3,
    Activity,
    Zap,
    Database,
    Wifi,
    Clock,
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    CheckCircle,
    Settings,
    Download,
    RefreshCw
} from 'lucide-react';

// Hooks
import { useAdvancedCache } from '../../../hooks/useAdvancedCache';
import { useRenderOptimization } from '../../../hooks/useRenderOptimization';
import { useAdvancedWebSocket } from '../../../hooks/useAdvancedWebSocket';
import { useFeatureFlags } from '../testing/FeatureFlagSystem';
import { useLiveCanvasPreview } from '../../../hooks/useLiveCanvasPreview';

// ============================================================================
// TYPES
// ============================================================================

interface PerformanceSnapshot {
    timestamp: number;
    cache: {
        hitRate: number;
        size: number;
        memoryUsage: number;
        hits: number;
        misses: number;
    };
    rendering: {
        totalRenders: number;
        skippedRenders: number;
        avgRenderTime: number;
        efficiency: number;
    };
    websocket: {
        isConnected: boolean;
        latency: number;
        messageCount: number;
        rateLimitRemaining: number;
    };
    preview: {
        updateTime: number;
        cacheEfficiency: number;
        errorRate: number;
        updatesPerSecond: number;
    };
}

interface AlertThresholds {
    cacheHitRate: { warning: number; critical: number };
    renderTime: { warning: number; critical: number };
    websocketLatency: { warning: number; critical: number };
    errorRate: { warning: number; critical: number };
    memoryUsage: { warning: number; critical: number };
}

// ============================================================================
// PERFORMANCE DASHBOARD COMPONENT
// ============================================================================

export const PerformanceDashboard: React.FC<{
    steps?: any[];
    selectedStepId?: string;
    className?: string;
    enableExport?: boolean;
    autoRefresh?: boolean;
    refreshInterval?: number;
}> = ({
    steps = [],
    selectedStepId,
    className = '',
    enableExport = true,
    autoRefresh = true,
    refreshInterval = 2000
}) => {
        // ===== HOOKS =====
        const { metrics: cacheMetrics } = useAdvancedCache('preview');
        const renderOptimization = useRenderOptimization();
        const { state: websocketState } = useAdvancedWebSocket({
            url: 'ws://localhost:3001/ws',
            reconnectInterval: 3000,
            maxReconnectAttempts: 5,
            heartbeatInterval: 30000,
            messageTimeout: 10000,
            enableCompression: true,
            rateLimit: { maxMessages: 100, windowMs: 60000 },
            debug: false
        });
        const featureFlags = useFeatureFlags();
        const livePreview = useLiveCanvasPreview(steps, selectedStepId, {
            enableDebounce: true,
            debounceDelay: 300,
            enableCache: true,
            cacheTTL: 30000,
            enableDebug: false
        });

        // ===== STATE =====
        const [snapshots, setSnapshots] = useState<PerformanceSnapshot[]>([]);
        const [alerts, setAlerts] = useState<Array<{
            id: string;
            type: 'warning' | 'critical' | 'info';
            message: string;
            timestamp: number;
        }>>([]);
        const [showRawData, setShowRawData] = useState(false);
        const [selectedMetric, setSelectedMetric] = useState<string>('overview');

        // ===== THRESHOLDS =====
        const thresholds: AlertThresholds = {
            cacheHitRate: { warning: 0.8, critical: 0.6 },
            renderTime: { warning: 100, critical: 500 },
            websocketLatency: { warning: 100, critical: 300 },
            errorRate: { warning: 0.01, critical: 0.05 },
            memoryUsage: { warning: 50 * 1024 * 1024, critical: 100 * 1024 * 1024 }
        };

        // ===== COLLECT METRICS =====
        const collectSnapshot = useMemo((): PerformanceSnapshot => {
            return {
                timestamp: Date.now(),
                cache: {
                    hitRate: cacheMetrics?.hitRate || 0,
                    size: cacheMetrics?.totalSize || 0,
                    memoryUsage: cacheMetrics?.memoryUsage || 0,
                    hits: cacheMetrics?.hits || 0,
                    misses: cacheMetrics?.misses || 0
                },
                rendering: {
                    totalRenders: renderOptimization.metrics.totalRenders,
                    skippedRenders: renderOptimization.metrics.skippedRenders,
                    avgRenderTime: renderOptimization.metrics.avgRenderTime,
                    efficiency: renderOptimization.metrics.renderEfficiency
                },
                websocket: {
                    isConnected: websocketState.isConnected,
                    latency: websocketState.latency,
                    messageCount: websocketState.messageQueue.length,
                    rateLimitRemaining: 0 // TODO: Get from websocket
                },
                preview: {
                    updateTime: livePreview.metrics?.averageUpdateTime || 0,
                    cacheEfficiency: livePreview.metrics?.cacheEfficiency || 0,
                    errorRate: livePreview.metrics?.errorRate || 0,
                    updatesPerSecond: livePreview.metrics?.updatesPerSecond || 0
                }
            };
        }, [cacheMetrics, renderOptimization.metrics, websocketState, livePreview]);

        // ===== EFFECTS =====
        useEffect(() => {
            if (autoRefresh) {
                const interval = setInterval(() => {
                    const snapshot = collectSnapshot;

                    setSnapshots(prev => {
                        const newSnapshots = [snapshot, ...prev.slice(0, 99)]; // Keep last 100

                        // Check for alerts
                        checkAlerts(snapshot);

                        return newSnapshots;
                    });
                }, refreshInterval);

                return () => clearInterval(interval);
            }
        }, [autoRefresh, refreshInterval, collectSnapshot]);

        // ===== ALERT SYSTEM =====
        const checkAlerts = (snapshot: PerformanceSnapshot) => {
            const newAlerts: typeof alerts = [];

            // Cache Hit Rate
            if (snapshot.cache.hitRate < thresholds.cacheHitRate.critical) {
                newAlerts.push({
                    id: `cache-critical-${Date.now()}`,
                    type: 'critical',
                    message: `Cache hit rate critically low: ${(snapshot.cache.hitRate * 100).toFixed(1)}%`,
                    timestamp: Date.now()
                });
            } else if (snapshot.cache.hitRate < thresholds.cacheHitRate.warning) {
                newAlerts.push({
                    id: `cache-warning-${Date.now()}`,
                    type: 'warning',
                    message: `Cache hit rate below optimal: ${(snapshot.cache.hitRate * 100).toFixed(1)}%`,
                    timestamp: Date.now()
                });
            }

            // Render Time
            if (snapshot.rendering.avgRenderTime > thresholds.renderTime.critical) {
                newAlerts.push({
                    id: `render-critical-${Date.now()}`,
                    type: 'critical',
                    message: `Render time critically high: ${snapshot.rendering.avgRenderTime.toFixed(1)}ms`,
                    timestamp: Date.now()
                });
            } else if (snapshot.rendering.avgRenderTime > thresholds.renderTime.warning) {
                newAlerts.push({
                    id: `render-warning-${Date.now()}`,
                    type: 'warning',
                    message: `Render time above optimal: ${snapshot.rendering.avgRenderTime.toFixed(1)}ms`,
                    timestamp: Date.now()
                });
            }

            // WebSocket Latency
            if (snapshot.websocket.latency > thresholds.websocketLatency.critical) {
                newAlerts.push({
                    id: `ws-critical-${Date.now()}`,
                    type: 'critical',
                    message: `WebSocket latency critically high: ${snapshot.websocket.latency}ms`,
                    timestamp: Date.now()
                });
            } else if (snapshot.websocket.latency > thresholds.websocketLatency.warning) {
                newAlerts.push({
                    id: `ws-warning-${Date.now()}`,
                    type: 'warning',
                    message: `WebSocket latency above optimal: ${snapshot.websocket.latency}ms`,
                    timestamp: Date.now()
                });
            }

            // Memory Usage  
            if (snapshot.cache.memoryUsage > thresholds.memoryUsage.critical) {
                newAlerts.push({
                    id: `memory-critical-${Date.now()}`,
                    type: 'critical',
                    message: `Memory usage critically high: ${(snapshot.cache.memoryUsage / 1024 / 1024).toFixed(1)}MB`,
                    timestamp: Date.now()
                });
            }

            if (newAlerts.length > 0) {
                setAlerts(prev => [...newAlerts, ...prev.slice(0, 49)]); // Keep last 50
            }
        };

        // ===== CALCULATIONS =====
        const currentSnapshot = snapshots[0];
        const previousSnapshot = snapshots[1];

        const trends = useMemo(() => {
            if (!currentSnapshot || !previousSnapshot) {
                return {
                    cacheHitRate: 0,
                    renderTime: 0,
                    websocketLatency: 0,
                    memoryUsage: 0
                };
            }

            return {
                cacheHitRate: currentSnapshot.cache.hitRate - previousSnapshot.cache.hitRate,
                renderTime: currentSnapshot.rendering.avgRenderTime - previousSnapshot.rendering.avgRenderTime,
                websocketLatency: currentSnapshot.websocket.latency - previousSnapshot.websocket.latency,
                memoryUsage: currentSnapshot.cache.memoryUsage - previousSnapshot.cache.memoryUsage
            };
        }, [currentSnapshot, previousSnapshot]);

        // ===== EXPORT FUNCTIONALITY =====
        const exportData = () => {
            const exportObj = {
                timestamp: Date.now(),
                snapshots: snapshots.slice(0, 20), // Last 20 snapshots
                alerts: alerts.slice(0, 10),        // Last 10 alerts
                thresholds,
                metadata: {
                    stepsCount: steps.length,
                    selectedStepId,
                    featureFlags: featureFlags.flags || {}
                }
            };

            const blob = new Blob([JSON.stringify(exportObj, null, 2)], {
                type: 'application/json'
            });

            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `performance-report-${new Date().toISOString().slice(0, 10)}.json`;
            a.click();
            URL.revokeObjectURL(url);
        };

        // ===== RENDER HELPERS =====
        const renderMetricCard = (
            title: string,
            value: string | number,
            trend?: number,
            unit?: string,
            status?: 'good' | 'warning' | 'critical'
        ) => (
            <Card className="h-24">
                <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-muted-foreground">{title}</p>
                            <p className="text-lg font-semibold">
                                {typeof value === 'number' ? value.toFixed(1) : value}
                                {unit && <span className="text-xs text-muted-foreground ml-1">{unit}</span>}
                            </p>
                        </div>

                        <div className="text-right">
                            {status && (
                                <div className={`w-2 h-2 rounded-full mb-1 ${status === 'good' ? 'bg-green-500' :
                                    status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                                    }`} />
                            )}

                            {trend !== undefined && trend !== 0 && (
                                <div className={`flex items-center text-xs ${trend > 0 ? 'text-red-500' : 'text-green-500'
                                    }`}>
                                    {trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                    <span className="ml-1">{Math.abs(trend).toFixed(1)}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        );

        const renderOverview = () => (
            <div className="space-y-4">
                {/* Alerts */}
                {alerts.length > 0 && (
                    <div className="space-y-2">
                        {alerts.slice(0, 3).map(alert => (
                            <Alert key={alert.id} className={
                                alert.type === 'critical' ? 'border-red-500' :
                                    alert.type === 'warning' ? 'border-yellow-500' : ''
                            }>
                                {alert.type === 'critical' ? <AlertTriangle className="h-4 w-4" /> :
                                    alert.type === 'warning' ? <AlertTriangle className="h-4 w-4" /> :
                                        <CheckCircle className="h-4 w-4" />}
                                <AlertDescription>
                                    {alert.message}
                                    <span className="text-xs text-muted-foreground ml-2">
                                        {new Date(alert.timestamp).toLocaleTimeString()}
                                    </span>
                                </AlertDescription>
                            </Alert>
                        ))}
                    </div>
                )}

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {renderMetricCard(
                        'Cache Hit Rate',
                        currentSnapshot?.cache.hitRate ? (currentSnapshot.cache.hitRate * 100) : 0,
                        trends.cacheHitRate,
                        '%',
                        currentSnapshot?.cache.hitRate ? (
                            currentSnapshot.cache.hitRate >= thresholds.cacheHitRate.warning ? 'good' :
                                currentSnapshot.cache.hitRate >= thresholds.cacheHitRate.critical ? 'warning' : 'critical'
                        ) : undefined
                    )}

                    {renderMetricCard(
                        'Avg Render Time',
                        currentSnapshot?.rendering.avgRenderTime || 0,
                        trends.renderTime,
                        'ms',
                        currentSnapshot?.rendering.avgRenderTime ? (
                            currentSnapshot.rendering.avgRenderTime <= thresholds.renderTime.warning ? 'good' :
                                currentSnapshot.rendering.avgRenderTime <= thresholds.renderTime.critical ? 'warning' : 'critical'
                        ) : undefined
                    )}

                    {renderMetricCard(
                        'WebSocket Latency',
                        currentSnapshot?.websocket.latency || 0,
                        trends.websocketLatency,
                        'ms',
                        currentSnapshot?.websocket.isConnected ? 'good' : 'critical'
                    )}

                    {renderMetricCard(
                        'Memory Usage',
                        currentSnapshot?.cache.memoryUsage ? (currentSnapshot.cache.memoryUsage / 1024 / 1024) : 0,
                        trends.memoryUsage / 1024 / 1024,
                        'MB',
                        currentSnapshot?.cache.memoryUsage ? (
                            currentSnapshot.cache.memoryUsage <= thresholds.memoryUsage.warning ? 'good' :
                                currentSnapshot.cache.memoryUsage <= thresholds.memoryUsage.critical ? 'warning' : 'critical'
                        ) : undefined
                    )}
                </div>

                {/* System Status */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">System Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span>Cache System</span>
                            <Badge variant={currentSnapshot?.cache.hitRate && currentSnapshot.cache.hitRate > 0.8 ? "default" : "destructive"}>
                                {currentSnapshot?.cache.hitRate ? 'Active' : 'Inactive'}
                            </Badge>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <span>Render Optimization</span>
                            <Badge variant={renderOptimization.config.enableRenderProfiling ? "default" : "outline"}>
                                {renderOptimization.config.enableRenderProfiling ? 'Enabled' : 'Disabled'}
                            </Badge>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <span>WebSocket Connection</span>
                            <Badge variant={currentSnapshot?.websocket.isConnected ? "default" : "destructive"}>
                                {currentSnapshot?.websocket.isConnected ? 'Connected' : 'Disconnected'}
                            </Badge>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <span>Preview Updates</span>
                            <Badge variant="outline">
                                {currentSnapshot?.preview.updatesPerSecond?.toFixed(1) || '0'}/s
                            </Badge>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );

        // ===== MAIN RENDER =====
        return (
            <div className={`performance-dashboard ${className}`}>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <BarChart3 className="w-5 h-5" />
                            Performance Dashboard
                        </CardTitle>

                        <div className="flex items-center gap-2">
                            <Badge variant={autoRefresh ? "default" : "outline"} className="text-xs">
                                <Activity className="w-3 h-3 mr-1" />
                                {autoRefresh ? 'Live' : 'Static'}
                            </Badge>

                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowRawData(!showRawData)}
                            >
                                <Settings className="w-4 h-4" />
                            </Button>

                            {enableExport && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={exportData}
                                    disabled={snapshots.length === 0}
                                >
                                    <Download className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    </CardHeader>

                    <CardContent>
                        <Tabs value={selectedMetric} onValueChange={setSelectedMetric}>
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="overview">Overview</TabsTrigger>
                                <TabsTrigger value="cache">Cache</TabsTrigger>
                                <TabsTrigger value="rendering">Rendering</TabsTrigger>
                                <TabsTrigger value="network">Network</TabsTrigger>
                            </TabsList>

                            <TabsContent value="overview" className="mt-4">
                                {renderOverview()}
                            </TabsContent>

                            <TabsContent value="cache" className="mt-4">
                                <div className="grid grid-cols-2 gap-4">
                                    {renderMetricCard('Hit Rate', (currentSnapshot?.cache.hitRate || 0) * 100, undefined, '%')}
                                    {renderMetricCard('Total Size', currentSnapshot?.cache.size || 0, undefined, 'entries')}
                                    {renderMetricCard('Hits', currentSnapshot?.cache.hits || 0)}
                                    {renderMetricCard('Misses', currentSnapshot?.cache.misses || 0)}
                                </div>
                            </TabsContent>

                            <TabsContent value="rendering" className="mt-4">
                                <div className="grid grid-cols-2 gap-4">
                                    {renderMetricCard('Total Renders', currentSnapshot?.rendering.totalRenders || 0)}
                                    {renderMetricCard('Skipped Renders', currentSnapshot?.rendering.skippedRenders || 0)}
                                    {renderMetricCard('Avg Render Time', currentSnapshot?.rendering.avgRenderTime || 0, undefined, 'ms')}
                                    {renderMetricCard('Efficiency', (currentSnapshot?.rendering.efficiency || 0) * 100, undefined, '%')}
                                </div>
                            </TabsContent>

                            <TabsContent value="network" className="mt-4">
                                <div className="grid grid-cols-2 gap-4">
                                    {renderMetricCard('Connection Status', currentSnapshot?.websocket.isConnected ? 'Connected' : 'Disconnected')}
                                    {renderMetricCard('Latency', currentSnapshot?.websocket.latency || 0, undefined, 'ms')}
                                    {renderMetricCard('Message Queue', currentSnapshot?.websocket.messageCount || 0)}
                                    {renderMetricCard('Updates/sec', currentSnapshot?.preview.updatesPerSecond || 0)}
                                </div>
                            </TabsContent>
                        </Tabs>

                        {/* Raw Data (Debug Mode) */}
                        {showRawData && (
                            <Card className="mt-4">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm">Raw Data</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <pre className="text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                                        {JSON.stringify(currentSnapshot, null, 2)}
                                    </pre>
                                </CardContent>
                            </Card>
                        )}
                    </CardContent>
                </Card>
            </div>
        );
    };

export default PerformanceDashboard;
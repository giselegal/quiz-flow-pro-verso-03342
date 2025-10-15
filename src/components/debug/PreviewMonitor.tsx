/**
 * 🔍 MONITOR DE PREVIEW - Sistema de Debug para Canvas
 * 
 * Componente de desenvolvimento para monitorar o estado do preview
 * e diagnosticar problemas de performance/loading
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { configurationCache } from '@/utils/ConfigurationCache';
import { supabaseInterceptor } from '@/utils/SupabaseInterceptor';
import {
    Activity,
    Database,
    Clock,
    AlertTriangle,
    CheckCircle,
    Wifi,
    WifiOff,
    RefreshCw
} from 'lucide-react';

interface PreviewMonitorProps {
    isVisible?: boolean;
    position?: 'top-right' | 'bottom-right' | 'bottom-left';
}

interface MonitorStats {
    cacheStats: any;
    interceptorStats: any;
    performanceMetrics: {
        loadTime: number;
        apiCalls: number;
        cacheHits: number;
        errors: number;
    };
    componentStatus: {
        [key: string]: {
            loading: boolean;
            error: string | null;
            lastUpdate: Date | null;
        };
    };
}

const PreviewMonitor: React.FC<PreviewMonitorProps> = ({
    isVisible = process.env.NODE_ENV === 'development',
    position = 'bottom-right'
}) => {
    const [expanded, setExpanded] = useState(false);
    const [stats, setStats] = useState<MonitorStats>({
        cacheStats: {},
        interceptorStats: {},
        performanceMetrics: {
            loadTime: 0,
            apiCalls: 0,
            cacheHits: 0,
            errors: 0
        },
        componentStatus: {}
    });

    // Atualizar estatísticas a cada segundo
    useEffect(() => {
        if (!isVisible) return;

        const interval = setInterval(() => {
            updateStats();
        }, 1000);

        return () => clearInterval(interval);
    }, [isVisible]);

    const updateStats = () => {
        try {
            const cacheStats = configurationCache.getStats();
            const interceptorStats = supabaseInterceptor.getStatus();

            setStats(prev => ({
                ...prev,
                cacheStats,
                interceptorStats,
                performanceMetrics: {
                    ...prev.performanceMetrics,
                    cacheHits: cacheStats.size
                }
            }));
        } catch (error) {
            console.warn('Erro ao atualizar stats do monitor:', error);
        }
    };

    const getPositionClass = () => {
        switch (position) {
            case 'top-right':
                return 'top-4 right-4';
            case 'bottom-left':
                return 'bottom-4 left-4';
            case 'bottom-right':
            default:
                return 'bottom-4 right-4';
        }
    };

    const clearCache = () => {
        configurationCache.clear();
        updateStats();
    };

    const toggleInterceptor = () => {
        if (stats.interceptorStats.active) {
            supabaseInterceptor.deactivate();
        } else {
            supabaseInterceptor.activate();
        }
        updateStats();
    };

    if (!isVisible) return null;

    return (
        <div className={`fixed ${getPositionClass()} z-50 max-w-sm`}>
            {/* Botão de toggle */}
            {!expanded && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setExpanded(true)}
                    className="mb-2 bg-white/90 backdrop-blur-sm border-stone-200 shadow-sm"
                >
                    <Activity className="w-4 h-4 mr-2" />
                    Preview Monitor
                    <Badge variant="secondary" className="ml-2 text-xs">
                        {stats.cacheStats.size || 0}
                    </Badge>
                </Button>
            )}

            {/* Painel expandido */}
            {expanded && (
                <Card className="bg-white/95 backdrop-blur-sm border-stone-200 shadow-lg">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <Activity className="w-4 h-4" />
                                Preview Monitor
                            </CardTitle>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setExpanded(false)}
                            >
                                ×
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-3 text-xs">
                        {/* Cache Status */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Database className="w-3 h-3" />
                                <span>Cache</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                    {stats.cacheStats.size || 0} items
                                </Badge>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearCache}
                                    className="h-6 px-2"
                                >
                                    Clear
                                </Button>
                            </div>
                        </div>

                        {/* Memory Usage */}
                        {stats.cacheStats.memoryUsage && (
                            <div className="text-xs text-muted-foreground">
                                Memory: {stats.cacheStats.memoryUsage}
                            </div>
                        )}

                        {/* Interceptor Status */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {stats.interceptorStats.active ? (
                                    <Wifi className="w-3 h-3 text-green-500" />
                                ) : (
                                    <WifiOff className="w-3 h-3 text-red-500" />
                                )}
                                <span>Interceptor</span>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={toggleInterceptor}
                                className="h-6 px-2"
                            >
                                {stats.interceptorStats.active ? 'OFF' : 'ON'}
                            </Button>
                        </div>

                        {/* Performance Metrics */}
                        <div className="space-y-1">
                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    Cache Hits
                                </span>
                                <Badge variant="secondary" className="text-xs">
                                    {stats.performanceMetrics.cacheHits}
                                </Badge>
                            </div>
                        </div>

                        {/* Cache Keys */}
                        {stats.cacheStats.keys && stats.cacheStats.keys.length > 0 && (
                            <div className="space-y-1">
                                <div className="text-xs font-medium">Cached Items:</div>
                                <div className="space-y-1 max-h-20 overflow-y-auto">
                                    {stats.cacheStats.keys.slice(0, 5).map((key: string) => (
                                        <div key={key} className="text-xs text-muted-foreground truncate">
                                            {key}
                                        </div>
                                    ))}
                                    {stats.cacheStats.keys.length > 5 && (
                                        <div className="text-xs text-muted-foreground">
                                            +{stats.cacheStats.keys.length - 5} more...
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2 pt-2 border-t">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={updateStats}
                                className="h-6 px-2 flex-1"
                            >
                                <RefreshCw className="w-3 h-3 mr-1" />
                                Refresh
                            </Button>
                        </div>

                        {/* Environment Info */}
                        <div className="text-xs text-muted-foreground border-t pt-2">
                            Env: {process.env.NODE_ENV} |
                            Time: {new Date().toLocaleTimeString()}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default PreviewMonitor;
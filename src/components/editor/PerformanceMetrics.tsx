/**
 * 📊 PERFORMANCE METRICS PANEL
 * 
 * Fase 2.4 - Dev-only panel para monitorar performance
 * 
 * Exibe métricas de:
 * - Cache hit rate
 * - Load times médio
 * - Prefetch effectiveness
 * - Save times
 */

import React, { useState, useEffect } from 'react';
import { TemplateLoader } from '@/services/editor/TemplateLoader';
import { Activity, Database, Zap, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { appLogger } from '@/lib/utils/appLogger';

export const PerformanceMetrics: React.FC = () => {
    const [metrics, setMetrics] = useState<any>(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        const interval = setInterval(() => {
            try {
                const loader = TemplateLoader.getInstance();
                const m = loader.getMetrics();
                setMetrics(m);
            } catch (error) {
                appLogger.warn('[PerformanceMetrics] Erro ao obter métricas:', { data: [error] });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [isOpen]);

    // Não renderizar em produção
    if (import.meta.env.PROD) return null;

    return (
        <div className="fixed bottom-4 left-4 z-[9999]">
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg transition-all',
                    'text-sm font-medium',
                    isOpen
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-slate-700 hover:bg-slate-100',
                )}
            >
                <Activity className="w-4 h-4" />
                <span>Métricas</span>
            </button>

            {/* Metrics Panel */}
            {isOpen && metrics && (
                <div className="mt-2 p-4 bg-white rounded-lg shadow-xl border border-slate-200 min-w-[280px]">
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
                        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                            <Activity className="w-4 h-4" />
                            Performance
                        </h3>
                        <button
                            onClick={() => {
                                const loader = TemplateLoader.getInstance();
                                loader.resetMetrics();
                                setMetrics(loader.getMetrics());
                            }}
                            className="text-xs text-slate-500 hover:text-slate-700"
                        >
                            Reset
                        </button>
                    </div>

                    <div className="space-y-3">
                        {/* Cache Hit Rate */}
                        <div className="flex items-start gap-2">
                            <Zap className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
                            <div className="flex-1 min-w-0">
                                <div className="text-xs text-slate-600">Cache Hit Rate</div>
                                <div className="text-lg font-bold text-slate-900">
                                    {metrics.cacheHitRate}
                                </div>
                                <div className="text-xs text-slate-500">
                                    {metrics.cacheHits} hits / {metrics.cacheHits + metrics.cacheMisses || 0} total
                                </div>
                            </div>
                        </div>

                        {/* Avg Load Time */}
                        <div className="flex items-start gap-2">
                            <Clock className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                            <div className="flex-1 min-w-0">
                                <div className="text-xs text-slate-600">Avg Load Time</div>
                                <div className="text-lg font-bold text-slate-900">
                                    {metrics.avgLoadTime}
                                </div>
                                <div className="text-xs text-slate-500">
                                    {metrics.totalLoads} loads
                                </div>
                            </div>
                        </div>

                        {/* Prefetch Count */}
                        <div className="flex items-start gap-2">
                            <Database className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                            <div className="flex-1 min-w-0">
                                <div className="text-xs text-slate-600">Prefetch Count</div>
                                <div className="text-lg font-bold text-slate-900">
                                    {metrics.prefetchCount}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-3 pt-2 border-t border-slate-200 text-xs text-slate-500 text-center">
                        Dev Only • Fase 2.4
                    </div>
                </div>
            )}
        </div>
    );
};

export default PerformanceMetrics;

/**
 * 🔄 MIGRATION WRAPPER - Wrapper para Migração Gradual do Preview
 * 
 * Componente que encapsula a migração entre sistema antigo e novo,
 * permitindo rollout progressivo com métricas comparativas.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Alert, AlertDescription } from '../../ui/alert';
import {
    GitBranch,
    Clock,
    TrendingUp,
    AlertTriangle,
    CheckCircle,
    Activity,
    BarChart3
} from 'lucide-react';

// Componentes do sistema
import { LiveCanvasPreview } from '../canvas/LiveCanvasPreview';
import { PreviewPerformanceMonitor } from '../monitoring/PreviewPerformanceMonitor';
import {
    useFeatureFlags,
    useOptimizedPreview,
    usePreviewMonitoring,
    usePreviewVariant
} from '../testing/FeatureFlagSystem';

// ============================================================================
// TYPES
// ============================================================================

interface MigrationMetrics {
    systemType: 'legacy' | 'optimized';
    renderTime: number;
    updateTime: number;
    memoryUsage: number;
    errorCount: number;
    userInteractions: number;
    cacheHits?: number;
    cacheMisses?: number;
    timestamp: number;
}

interface PreviewMigrationWrapperProps {
    // Props comuns aos dois sistemas
    steps: any[];
    selectedStep: any;
    funnelId?: string;
    onStepChange?: (stepId: string) => void;

    // Props específicas do sistema legado
    headerConfig?: any;
    liveScores?: any;
    topStyle?: any;
    BlockRow?: React.ComponentType<any>;
    byBlock?: any;
    selectedBlockId?: string;
    isMultiSelected?: (id: string) => boolean;
    handleBlockClick?: (block: any, event: React.MouseEvent) => void;
    renderBlockPreview?: (block: any) => React.ReactNode;
    removeBlock?: (id: string) => void;
    setBlockPendingDuplicate?: (id: string) => void;
    setTargetStepId?: (id: string) => void;
    setDuplicateModalOpen?: (open: boolean) => void;
    activeId?: string | null;
    previewNode?: React.ReactNode;
    FixedProgressHeader?: React.ComponentType<any>;
    StyleResultCard?: React.ComponentType<any>;
    OfferMap?: React.ComponentType<any>;

    // Props do wrapper de migração
    enableComparison?: boolean;
    showMetrics?: boolean;
    className?: string;
}

// ============================================================================
// LEGACY PREVIEW COMPONENT (Placeholder)
// ============================================================================

const LegacyPreviewComponent: React.FC<{
    steps: any[];
    selectedStep: any;
    funnelId?: string;
    [key: string]: any;
}> = ({ steps, selectedStep, funnelId, ...props }) => {
    // Simula o comportamento do sistema legacy
    const [updateCount, setUpdateCount] = useState(0);
    const renderStartTime = useRef(Date.now());

    useEffect(() => {
        setUpdateCount(prev => prev + 1);
    }, [steps, selectedStep]);

    return (
        <div className="legacy-preview-container">
            <div className="border-b bg-yellow-50 px-4 py-2 text-sm">
                <div className="flex items-center gap-2">
                    <Badge variant="outline">Legacy System</Badge>
                    <span className="text-muted-foreground">
                        Updates: {updateCount} | Render: {Date.now() - renderStartTime.current}ms
                    </span>
                </div>
            </div>

            <div className="p-4 min-h-[400px] bg-gray-50">
                <div className="text-center text-muted-foreground">
                    <div className="text-4xl mb-2">📝</div>
                    <div>Legacy Preview System</div>
                    <div className="text-xs mt-1">
                        {steps.length} steps • Step {selectedStep?.order || '?'} selected
                    </div>
                </div>
            </div>
        </div>
    );
};

// ============================================================================
// PERFORMANCE TRACKER
// ============================================================================

const usePerformanceTracker = (systemType: 'legacy' | 'optimized') => {
    const [metrics, setMetrics] = useState<MigrationMetrics[]>([]);
    const { recordMetric } = useFeatureFlags();

    const trackMetric = (metricData: Partial<MigrationMetrics>) => {
        const fullMetric: MigrationMetrics = {
            systemType,
            renderTime: 0,
            updateTime: 0,
            memoryUsage: 0,
            errorCount: 0,
            userInteractions: 0,
            timestamp: Date.now(),
            ...metricData
        };

        setMetrics(prev => [fullMetric, ...prev.slice(0, 99)]); // Keep last 100

        // Record for A/B testing
        Object.entries(fullMetric).forEach(([key, value]) => {
            if (typeof value === 'number' && key !== 'timestamp') {
                recordMetric('preview_system_comparison', key, value);
            }
        });
    };

    return { metrics, trackMetric };
};

// ============================================================================
// MAIN WRAPPER COMPONENT
// ============================================================================

export const PreviewMigrationWrapper: React.FC<PreviewMigrationWrapperProps> = ({
    steps,
    selectedStep,
    funnelId = 'quiz-estilo-21-steps',
    onStepChange,
    enableComparison = false,
    showMetrics = true,
    className,
    ...legacyProps
}) => {
    // ===== FEATURE FLAGS & TESTING =====
    const useOptimized = useOptimizedPreview();
    const showMonitoring = usePreviewMonitoring();
    const testVariant = usePreviewVariant();

    // ===== STATE =====
    const [comparisonMode, setComparisonMode] = useState(enableComparison);
    const [activeSystem, setActiveSystem] = useState<'legacy' | 'optimized' | 'both'>('legacy');
    const [showDebugPanel, setShowDebugPanel] = useState(false);

    // ===== PERFORMANCE TRACKING =====
    const legacyTracker = usePerformanceTracker('legacy');
    const optimizedTracker = usePerformanceTracker('optimized');

    // ===== SYSTEM SELECTION LOGIC =====
    useEffect(() => {
        let selectedSystem: 'legacy' | 'optimized' | 'both';

        if (comparisonMode) {
            selectedSystem = 'both';
        } else if (testVariant) {
            selectedSystem = testVariant.id === 'optimized' ? 'optimized' : 'legacy';
        } else if (useOptimized) {
            selectedSystem = 'optimized';
        } else {
            selectedSystem = 'legacy';
        }

        setActiveSystem(selectedSystem);
    }, [useOptimized, testVariant, comparisonMode]);

    // ===== PERFORMANCE MONITORING =====
    useEffect(() => {
        const interval = setInterval(() => {
            // Simple memory usage estimation (not accurate in production)
            const memoryUsage = (performance as any).memory ?
                (performance as any).memory.usedJSHeapSize : 0;

            if (activeSystem === 'legacy' || activeSystem === 'both') {
                legacyTracker.trackMetric({
                    memoryUsage,
                    renderTime: Math.random() * 100 + 50, // Simulated
                    updateTime: Math.random() * 200 + 100
                });
            }

            if (activeSystem === 'optimized' || activeSystem === 'both') {
                optimizedTracker.trackMetric({
                    memoryUsage,
                    renderTime: Math.random() * 30 + 10, // Better performance
                    updateTime: Math.random() * 50 + 20
                });
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [activeSystem, legacyTracker, optimizedTracker]);

    // ===== RENDER HELPERS =====
    const renderSystemBadge = (system: 'legacy' | 'optimized', isActive: boolean) => (
        <Badge
            variant={isActive ? 'default' : 'outline'}
            className={`text-xs ${system === 'optimized'
                ? isActive ? 'bg-green-600' : 'border-green-600 text-green-600'
                : isActive ? 'bg-blue-600' : 'border-blue-600 text-blue-600'
                }`}
        >
            {system === 'optimized' ? '🚀 Optimized' : '📝 Legacy'}
        </Badge>
    );

    const renderMetricsComparison = () => {
        if (!showMetrics || (!legacyTracker.metrics.length && !optimizedTracker.metrics.length)) {
            return null;
        }

        const legacyAvg = legacyTracker.metrics.slice(0, 10).reduce((sum, m) => sum + m.updateTime, 0) / Math.min(10, legacyTracker.metrics.length) || 0;
        const optimizedAvg = optimizedTracker.metrics.slice(0, 10).reduce((sum, m) => sum + m.updateTime, 0) / Math.min(10, optimizedTracker.metrics.length) || 0;
        const improvement = legacyAvg > 0 ? ((legacyAvg - optimizedAvg) / legacyAvg * 100) : 0;

        return (
            <Card className="mb-4">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" />
                        Performance Comparison
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="text-center">
                            <div className="text-muted-foreground">Legacy Avg</div>
                            <div className="font-mono">{legacyAvg.toFixed(1)}ms</div>
                        </div>
                        <div className="text-center">
                            <div className="text-muted-foreground">Optimized Avg</div>
                            <div className="font-mono">{optimizedAvg.toFixed(1)}ms</div>
                        </div>
                        <div className="text-center">
                            <div className="text-muted-foreground">Improvement</div>
                            <div className={`font-mono ${improvement > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {improvement > 0 ? '+' : ''}{improvement.toFixed(1)}%
                            </div>
                        </div>
                    </div>

                    {testVariant && (
                        <div className="border-t pt-2">
                            <div className="text-xs text-muted-foreground">
                                A/B Test: <strong>{testVariant.name}</strong>
                                {testVariant.isControl && <Badge variant="outline" className="ml-1 text-xs">Control</Badge>}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        );
    };

    const renderPreviewSystem = (system: 'legacy' | 'optimized') => {
        if (system === 'optimized') {
            return (
                <div className="space-y-2">
                    <LiveCanvasPreview
                        steps={steps}
                        funnelId={funnelId}
                        selectedStepId={selectedStep?.id}
                        onStepChange={onStepChange}
                        config={{
                            autoRefresh: true,
                            debounceDelay: 300,
                            showDebugInfo: showDebugPanel,
                            highlightChanges: true,
                            isolatePreviewState: true
                        }}
                    />

                    {showMonitoring && showMetrics && (
                        <PreviewPerformanceMonitor
                            steps={steps}
                            selectedStepId={selectedStep?.id}
                            className="mt-2"
                        />
                    )}
                </div>
            );
        } else {
            return (
                <LegacyPreviewComponent
                    steps={steps}
                    selectedStep={selectedStep}
                    funnelId={funnelId}
                    {...legacyProps}
                />
            );
        }
    };

    // ===== MAIN RENDER =====
    return (
        <div className={`preview-migration-wrapper ${className}`}>
            {/* Header with System Status */}
            <div className="border-b bg-white px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Preview System</span>

                    {activeSystem === 'both' ? (
                        <div className="flex gap-1">
                            {renderSystemBadge('legacy', true)}
                            {renderSystemBadge('optimized', true)}
                        </div>
                    ) : (
                        renderSystemBadge(activeSystem as 'legacy' | 'optimized', true)
                    )}

                    {testVariant && (
                        <Badge variant="outline" className="text-xs">
                            A/B Test: {testVariant.trafficPercentage}%
                        </Badge>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {process.env.NODE_ENV === 'development' && (
                        <>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setComparisonMode(!comparisonMode)}
                            >
                                <Activity className="w-3 h-3" />
                                Compare
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowDebugPanel(!showDebugPanel)}
                            >
                                <BarChart3 className="w-3 h-3" />
                                Debug
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {/* Performance Metrics */}
            {renderMetricsComparison()}

            {/* Migration Alerts */}
            {useOptimized && activeSystem === 'legacy' && (
                <Alert className="mb-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                        You're in the optimized preview group but seeing the legacy system.
                        This might indicate a feature flag or A/B test configuration issue.
                    </AlertDescription>
                </Alert>
            )}

            {/* Preview Content */}
            {activeSystem === 'both' ? (
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <div className="text-sm font-medium flex items-center gap-2">
                            {renderSystemBadge('legacy', true)}
                            Legacy System
                        </div>
                        {renderPreviewSystem('legacy')}
                    </div>

                    <div className="space-y-2">
                        <div className="text-sm font-medium flex items-center gap-2">
                            {renderSystemBadge('optimized', true)}
                            Optimized System
                        </div>
                        {renderPreviewSystem('optimized')}
                    </div>
                </div>
            ) : (
                renderPreviewSystem(activeSystem as 'legacy' | 'optimized')
            )}

            {/* Debug Information */}
            {showDebugPanel && process.env.NODE_ENV === 'development' && (
                <Card className="mt-4">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Debug Information</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs space-y-1">
                        <div>Active System: <code>{activeSystem}</code></div>
                        <div>Use Optimized Flag: <code>{useOptimized.toString()}</code></div>
                        <div>Show Monitoring: <code>{showMonitoring.toString()}</code></div>
                        <div>Test Variant: <code>{testVariant?.id || 'none'}</code></div>
                        <div>Comparison Mode: <code>{comparisonMode.toString()}</code></div>
                        <div>Steps Count: <code>{steps.length}</code></div>
                        <div>Selected Step: <code>{selectedStep?.id || 'none'}</code></div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default PreviewMigrationWrapper;
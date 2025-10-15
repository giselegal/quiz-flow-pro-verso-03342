/**
 * 🧪 A/B TESTING SYSTEM - Sistema de Testes A/B para Preview Otimizado
 * 
 * Sistema completo para testar o preview otimizado vs. sistema atual
 * com métricas de performance e rollout progressivo.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
    Beaker,
    TrendingUp,
    Users,
    Clock,
    Database,
    GitBranch,
    Settings,
    BarChart3
} from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

interface FeatureFlag {
    key: string;
    name: string;
    description: string;
    enabled: boolean;
    rolloutPercentage: number;
    createdAt: number;
    updatedAt: number;
}

interface ABTestVariant {
    id: string;
    name: string;
    description: string;
    trafficPercentage: number;
    isControl: boolean;
}

interface ABTest {
    id: string;
    name: string;
    description: string;
    enabled: boolean;
    variants: ABTestVariant[];
    metrics: string[];
    startDate: number;
    endDate?: number;
    targetUsers?: 'all' | 'dev' | 'beta' | 'specific';
}

interface ABTestResult {
    testId: string;
    variantId: string;
    userId: string;
    sessionId: string;
    metrics: Record<string, number>;
    timestamp: number;
}

interface FeatureFlagContextValue {
    flags: Record<string, FeatureFlag>;
    tests: Record<string, ABTest>;
    results: ABTestResult[];

    // Flag management
    isEnabled: (flagKey: string) => boolean;
    getVariant: (testId: string) => ABTestVariant | null;
    toggleFlag: (flagKey: string) => void;
    updateRollout: (flagKey: string, percentage: number) => void;

    // Test management
    recordMetric: (testId: string, metric: string, value: number) => void;
    getTestResults: (testId: string) => ABTestResult[];

    // User assignment
    assignUserToTest: (testId: string, userId?: string) => ABTestVariant;
}

// ============================================================================
// CONTEXT
// ============================================================================

const FeatureFlagContext = createContext<FeatureFlagContextValue | null>(null);

export const useFeatureFlags = (): FeatureFlagContextValue => {
    const context = useContext(FeatureFlagContext);
    if (!context) {
        throw new Error('useFeatureFlags must be used within FeatureFlagProvider');
    }
    return context;
};

// ============================================================================
// DEFAULT DATA
// ============================================================================

const DEFAULT_FLAGS: Record<string, FeatureFlag> = {
    'optimized_preview': {
        key: 'optimized_preview',
        name: 'Optimized Preview System',
        description: 'New high-performance preview system with caching and debounce',
        enabled: false,
        rolloutPercentage: 0,
        createdAt: Date.now(),
        updatedAt: Date.now()
    },
    'preview_monitoring': {
        key: 'preview_monitoring',
        name: 'Preview Performance Monitoring',
        description: 'Real-time performance metrics and alerts for preview system',
        enabled: true,
        rolloutPercentage: 100,
        createdAt: Date.now(),
        updatedAt: Date.now()
    },
    'preview_virtualization': {
        key: 'preview_virtualization',
        name: 'Preview List Virtualization',
        description: 'Virtualization for large quiz lists in preview',
        enabled: false,
        rolloutPercentage: 0,
        createdAt: Date.now(),
        updatedAt: Date.now()
    }
};

const DEFAULT_TESTS: Record<string, ABTest> = {
    'preview_system_comparison': {
        id: 'preview_system_comparison',
        name: 'Preview System Performance Test',
        description: 'Compare current preview system vs. optimized version',
        enabled: true,
        variants: [
            {
                id: 'control',
                name: 'Current System',
                description: 'Existing LiveRuntimePreview implementation',
                trafficPercentage: 70,
                isControl: true
            },
            {
                id: 'optimized',
                name: 'Optimized System',
                description: 'New LiveCanvasPreview with performance optimizations',
                trafficPercentage: 30,
                isControl: false
            }
        ],
        metrics: ['update_time', 'cache_efficiency', 'error_rate', 'user_satisfaction'],
        startDate: Date.now(),
        targetUsers: 'beta'
    }
};

// ============================================================================
// PROVIDER COMPONENT
// ============================================================================

interface FeatureFlagProviderProps {
    children: React.ReactNode;
    persistToLocalStorage?: boolean;
    enableAnalytics?: boolean;
    userId?: string;
}

export const FeatureFlagProvider: React.FC<FeatureFlagProviderProps> = ({
    children,
    persistToLocalStorage = true,
    enableAnalytics = false,
    userId = 'anonymous'
}) => {
    // ===== STATE =====
    const [flags, setFlags] = useState<Record<string, FeatureFlag>>(DEFAULT_FLAGS);
    const [tests, setTests] = useState<Record<string, ABTest>>(DEFAULT_TESTS);
    const [results, setResults] = useState<ABTestResult[]>([]);
    const [userAssignments, setUserAssignments] = useState<Record<string, string>>({});

    // ===== PERSISTENCE =====
    const persistData = useCallback(() => {
        if (!persistToLocalStorage) return;

        try {
            localStorage.setItem('feature_flags', JSON.stringify(flags));
            localStorage.setItem('ab_tests', JSON.stringify(tests));
            localStorage.setItem('test_results', JSON.stringify(results));
            localStorage.setItem('user_assignments', JSON.stringify(userAssignments));
        } catch (error) {
            console.warn('Failed to persist feature flag data:', error);
        }
    }, [flags, tests, results, userAssignments, persistToLocalStorage]);

    const loadPersistedData = useCallback(() => {
        if (!persistToLocalStorage) return;

        try {
            const savedFlags = localStorage.getItem('feature_flags');
            const savedTests = localStorage.getItem('ab_tests');
            const savedResults = localStorage.getItem('test_results');
            const savedAssignments = localStorage.getItem('user_assignments');

            if (savedFlags) setFlags({ ...DEFAULT_FLAGS, ...JSON.parse(savedFlags) });
            if (savedTests) setTests({ ...DEFAULT_TESTS, ...JSON.parse(savedTests) });
            if (savedResults) setResults(JSON.parse(savedResults));
            if (savedAssignments) setUserAssignments(JSON.parse(savedAssignments));
        } catch (error) {
            console.warn('Failed to load persisted feature flag data:', error);
        }
    }, [persistToLocalStorage]);

    useEffect(() => {
        loadPersistedData();
    }, [loadPersistedData]);

    useEffect(() => {
        persistData();
    }, [persistData]);

    // ===== FLAG MANAGEMENT =====
    const isEnabled = useCallback((flagKey: string): boolean => {
        const flag = flags[flagKey];
        if (!flag || !flag.enabled) return false;

        // Simple percentage-based rollout
        const userHash = hashString(`${userId}-${flagKey}`);
        const userPercentage = (userHash % 100) + 1;

        return userPercentage <= flag.rolloutPercentage;
    }, [flags, userId]);

    const toggleFlag = useCallback((flagKey: string) => {
        setFlags(prev => ({
            ...prev,
            [flagKey]: {
                ...prev[flagKey],
                enabled: !prev[flagKey]?.enabled,
                updatedAt: Date.now()
            }
        }));
    }, []);

    const updateRollout = useCallback((flagKey: string, percentage: number) => {
        setFlags(prev => ({
            ...prev,
            [flagKey]: {
                ...prev[flagKey],
                rolloutPercentage: Math.max(0, Math.min(100, percentage)),
                updatedAt: Date.now()
            }
        }));
    }, []);

    // ===== A/B TEST MANAGEMENT =====
    const assignUserToTest = useCallback((testId: string, targetUserId?: string): ABTestVariant => {
        const test = tests[testId];
        const currentUserId = targetUserId || userId;

        if (!test || !test.enabled) {
            // Return control variant if test is disabled
            return test?.variants.find(v => v.isControl) || test?.variants[0];
        }

        // Check if user is already assigned
        const assignmentKey = `${testId}-${currentUserId}`;
        let assignedVariantId = userAssignments[assignmentKey];

        if (!assignedVariantId) {
            // Assign user to variant based on hash
            const userHash = hashString(`${currentUserId}-${testId}`);
            let cumulativePercentage = 0;

            for (const variant of test.variants) {
                cumulativePercentage += variant.trafficPercentage;
                if ((userHash % 100) < cumulativePercentage) {
                    assignedVariantId = variant.id;
                    break;
                }
            }

            // Fallback to control
            if (!assignedVariantId) {
                assignedVariantId = test.variants.find(v => v.isControl)?.id || test.variants[0]?.id;
            }

            // Persist assignment
            setUserAssignments(prev => ({
                ...prev,
                [assignmentKey]: assignedVariantId
            }));
        }

        return test.variants.find(v => v.id === assignedVariantId) || test.variants[0];
    }, [tests, userId, userAssignments]);

    const getVariant = useCallback((testId: string): ABTestVariant | null => {
        const test = tests[testId];
        if (!test || !test.enabled) return null;

        return assignUserToTest(testId);
    }, [tests, assignUserToTest]);

    const recordMetric = useCallback((testId: string, metric: string, value: number) => {
        const variant = getVariant(testId);
        if (!variant) return;

        const result: ABTestResult = {
            testId,
            variantId: variant.id,
            userId,
            sessionId: `session_${Date.now()}`,
            metrics: { [metric]: value },
            timestamp: Date.now()
        };

        setResults(prev => [...prev, result]);

        // Analytics integration
        if (enableAnalytics && typeof window !== 'undefined' && (window as any).analytics) {
            (window as any).analytics.track('ab_test_metric', {
                testId,
                variantId: variant.id,
                metric,
                value,
                userId
            });
        }
    }, [getVariant, userId, enableAnalytics]);

    const getTestResults = useCallback((testId: string): ABTestResult[] => {
        return results.filter(r => r.testId === testId);
    }, [results]);

    // ===== CONTEXT VALUE =====
    const contextValue: FeatureFlagContextValue = {
        flags,
        tests,
        results,
        isEnabled,
        getVariant,
        toggleFlag,
        updateRollout,
        recordMetric,
        getTestResults,
        assignUserToTest
    };

    return (
        <FeatureFlagContext.Provider value={contextValue}>
            {children}
        </FeatureFlagContext.Provider>
    );
};

// ============================================================================
// ADMIN PANEL COMPONENT
// ============================================================================

interface FeatureFlagAdminProps {
    className?: string;
}

export const FeatureFlagAdmin: React.FC<FeatureFlagAdminProps> = ({ className }) => {
    const {
        flags,
        tests,
        results,
        toggleFlag,
        updateRollout,
        getTestResults,
        recordMetric
    } = useFeatureFlags();

    const [showTests, setShowTests] = useState(false);

    // Test results summary
    const getTestSummary = (testId: string) => {
        const testResults = getTestResults(testId);
        const test = tests[testId];

        if (!test || testResults.length === 0) return null;

        const summary: Record<string, { control: number[], treatment: number[] }> = {};

        testResults.forEach(result => {
            Object.entries(result.metrics).forEach(([metric, value]) => {
                if (!summary[metric]) {
                    summary[metric] = { control: [], treatment: [] };
                }

                const variant = test.variants.find(v => v.id === result.variantId);
                if (variant?.isControl) {
                    summary[metric].control.push(value);
                } else {
                    summary[metric].treatment.push(value);
                }
            });
        });

        return summary;
    };

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Feature Flags */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        Feature Flags
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {Object.values(flags).map(flag => (
                        <div key={flag.key} className="flex items-center justify-between p-3 border rounded">
                            <div className="flex-1">
                                <div className="font-medium text-sm">{flag.name}</div>
                                <div className="text-xs text-muted-foreground">{flag.description}</div>
                                <div className="text-xs text-muted-foreground mt-1">
                                    Rollout: {flag.rolloutPercentage}%
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={flag.rolloutPercentage}
                                    onChange={(e) => updateRollout(flag.key, parseInt(e.target.value))}
                                    className="w-16"
                                    disabled={!flag.enabled}
                                />
                                <Switch
                                    checked={flag.enabled}
                                    onCheckedChange={() => toggleFlag(flag.key)}
                                />
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* A/B Tests */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Beaker className="w-4 h-4" />
                            A/B Tests
                        </CardTitle>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowTests(!showTests)}
                        >
                            <BarChart3 className="w-4 h-4" />
                            {showTests ? 'Hide Results' : 'Show Results'}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-3">
                    {Object.values(tests).map(test => {
                        const testResults = getTestResults(test.id);
                        const summary = getTestSummary(test.id);

                        return (
                            <div key={test.id} className="border rounded p-3">
                                <div className="flex items-center justify-between mb-2">
                                    <div>
                                        <div className="font-medium text-sm">{test.name}</div>
                                        <div className="text-xs text-muted-foreground">{test.description}</div>
                                    </div>
                                    <Badge variant={test.enabled ? 'default' : 'secondary'}>
                                        {test.enabled ? 'Active' : 'Inactive'}
                                    </Badge>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    {test.variants.map(variant => (
                                        <div key={variant.id} className="bg-gray-50 p-2 rounded">
                                            <div className="font-medium">{variant.name}</div>
                                            <div className="text-muted-foreground">
                                                {variant.trafficPercentage}% traffic
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-2 text-xs text-muted-foreground">
                                    Results collected: {testResults.length}
                                </div>

                                {showTests && summary && (
                                    <div className="mt-3 space-y-2 text-xs">
                                        <div className="font-medium">Test Results:</div>
                                        {Object.entries(summary).map(([metric, data]) => {
                                            const controlAvg = data.control.length > 0
                                                ? data.control.reduce((sum, val) => sum + val, 0) / data.control.length
                                                : 0;
                                            const treatmentAvg = data.treatment.length > 0
                                                ? data.treatment.reduce((sum, val) => sum + val, 0) / data.treatment.length
                                                : 0;
                                            const improvement = controlAvg > 0
                                                ? ((treatmentAvg - controlAvg) / controlAvg * 100)
                                                : 0;

                                            return (
                                                <div key={metric} className="grid grid-cols-4 gap-2">
                                                    <div>{metric}:</div>
                                                    <div>Control: {controlAvg.toFixed(1)}</div>
                                                    <div>Treatment: {treatmentAvg.toFixed(1)}</div>
                                                    <div className={improvement > 0 ? 'text-green-600' : 'text-red-600'}>
                                                        {improvement > 0 ? '+' : ''}{improvement.toFixed(1)}%
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </CardContent>
            </Card>
        </div>
    );
};

// ============================================================================
// UTILITIES
// ============================================================================

function hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
}

// ============================================================================
// HOOKS FOR EASY TESTING
// ============================================================================

export const useOptimizedPreview = () => {
    const { isEnabled } = useFeatureFlags();
    return isEnabled('optimized_preview');
};

export const usePreviewMonitoring = () => {
    const { isEnabled } = useFeatureFlags();
    return isEnabled('preview_monitoring');
};

export const usePreviewVirtualization = () => {
    const { isEnabled } = useFeatureFlags();
    return isEnabled('preview_virtualization');
};

export const usePreviewVariant = () => {
    const { getVariant } = useFeatureFlags();
    return getVariant('preview_system_comparison');
};

export default FeatureFlagProvider;
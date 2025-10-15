/**
 * 🎭 useLiveCanvasPreview - Hook para Preview ao Vivo
 * 
 * Hook que gerencia o estado e sincronização do preview em tempo real
 * com otimizações de performance e controle de estado.
 */

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useQuizRuntimeRegistry } from '@/runtime/quiz/QuizRuntimeRegistry';

// ============================================================================
// TYPES
// ============================================================================

export interface LivePreviewOptions {
    /** Habilitar debounce automático */
    enableDebounce?: boolean;
    /** Delay do debounce em ms */
    debounceDelay?: number;
    /** Habilitar cache de states */
    enableCache?: boolean;
    /** TTL do cache em ms */
    cacheTTL?: number;
    /** Habilitar logs de debug */
    enableDebug?: boolean;
    /** Máximo de updates por segundo */
    maxUpdatesPerSecond?: number;
    /** Isolamento de estado do preview */
    isolatePreviewState?: boolean;
}

export interface LivePreviewState {
    isActive: boolean;
    isUpdating: boolean;
    lastUpdate: number;
    updateCount: number;
    errorCount: number;
    lastError?: string;
    cacheHits: number;
    cacheMisses: number;
}

export interface LivePreviewMetrics {
    totalUpdates: number;
    averageUpdateTime: number;
    cacheEfficiency: number;
    errorRate: number;
    updatesPerSecond: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const DEFAULT_OPTIONS: Required<LivePreviewOptions> = {
    enableDebounce: true,
    debounceDelay: 300,
    enableCache: true,
    cacheTTL: 30000, // 30s
    enableDebug: false,
    maxUpdatesPerSecond: 10,
    isolatePreviewState: true
};

// ============================================================================
// DEBOUNCE UTILITY
// ============================================================================

function useDebounce<T>(value: T, delay: number, enabled: boolean = true): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        if (!enabled) {
            setDebouncedValue(value);
            return;
        }

        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay, enabled]);

    return debouncedValue;
}

// ============================================================================
// RATE LIMITER UTILITY
// ============================================================================

function useRateLimiter(maxCallsPerSecond: number) {
    const callTimestamps = useRef<number[]>([]);

    const canCall = useCallback(() => {
        const now = Date.now();
        const oneSecondAgo = now - 1000;
        
        // Remove timestamps antigos
        callTimestamps.current = callTimestamps.current.filter(
            timestamp => timestamp > oneSecondAgo
        );
        
        return callTimestamps.current.length < maxCallsPerSecond;
    }, [maxCallsPerSecond]);

    const recordCall = useCallback(() => {
        callTimestamps.current.push(Date.now());
    }, []);

    return { canCall, recordCall };
}

// ============================================================================
// CACHE UTILITY
// ============================================================================

interface CacheEntry<T> {
    data: T;
    timestamp: number;
    hits: number;
}

function useCache<T>(ttl: number, enabled: boolean = true) {
    const cache = useRef<Map<string, CacheEntry<T>>>(new Map());
    const stats = useRef({ hits: 0, misses: 0 });

    const get = useCallback((key: string): T | null => {
        if (!enabled) return null;

        const entry = cache.current.get(key);
        if (!entry) {
            stats.current.misses++;
            return null;
        }

        const now = Date.now();
        if (now - entry.timestamp > ttl) {
            cache.current.delete(key);
            stats.current.misses++;
            return null;
        }

        entry.hits++;
        stats.current.hits++;
        return entry.data;
    }, [enabled, ttl]);

    const set = useCallback((key: string, data: T) => {
        if (!enabled) return;

        cache.current.set(key, {
            data,
            timestamp: Date.now(),
            hits: 0
        });
    }, [enabled]);

    const clear = useCallback(() => {
        cache.current.clear();
        stats.current = { hits: 0, misses: 0 };
    }, []);

    const getStats = useCallback(() => {
        return {
            size: cache.current.size,
            ...stats.current,
            efficiency: stats.current.hits / (stats.current.hits + stats.current.misses) || 0
        };
    }, []);

    return { get, set, clear, getStats };
}

// ============================================================================
// MAIN HOOK
// ============================================================================

export function useLiveCanvasPreview(
    steps: any[],
    selectedStepId: string | undefined,
    userOptions: LivePreviewOptions = {}
) {
    // ===== CONFIGURATION =====
    const options = useMemo(() => ({
        ...DEFAULT_OPTIONS,
        ...userOptions
    }), [userOptions]);

    // ===== STATE =====
    const [state, setState] = useState<LivePreviewState>({
        isActive: false,
        isUpdating: false,
        lastUpdate: Date.now(),
        updateCount: 0,
        errorCount: 0,
        cacheHits: 0,
        cacheMisses: 0
    });

    // ===== UTILITIES =====
    const debouncedSteps = useDebounce(steps, options.debounceDelay, options.enableDebounce);
    const debouncedSelectedStepId = useDebounce(selectedStepId, options.debounceDelay, options.enableDebounce);
    
    const { canCall: canUpdate, recordCall: recordUpdate } = useRateLimiter(options.maxUpdatesPerSecond);
    const { get: getFromCache, set: setInCache, getStats: getCacheStats } = useCache(
        options.cacheTTL, 
        options.enableCache
    );

    // ===== REGISTRY =====
    const { setSteps: setRegistrySteps, version } = useQuizRuntimeRegistry();

    // ===== REFS =====
    const lastStepsHashRef = useRef<string>('');
    const updateTimesRef = useRef<number[]>([]);
    const isolatedStateRef = useRef<any>(null);

    // ===== PREVIEW CONTROL =====
    const activate = useCallback(() => {
        setState(prev => ({ ...prev, isActive: true }));
        
        if (options.enableDebug) {
            console.log('🎭 Live preview activated');
        }
    }, [options.enableDebug]);

    const deactivate = useCallback(() => {
        setState(prev => ({ ...prev, isActive: false, isUpdating: false }));
        
        if (options.enableDebug) {
            console.log('🎭 Live preview deactivated');
        }
    }, [options.enableDebug]);

    const toggle = useCallback(() => {
        setState(prev => {
            const newActive = !prev.isActive;
            
            if (options.enableDebug) {
                console.log(`🎭 Live preview ${newActive ? 'activated' : 'deactivated'}`);
            }
            
            return {
                ...prev,
                isActive: newActive,
                isUpdating: newActive ? prev.isUpdating : false
            };
        });
    }, [options.enableDebug]);

    // ===== MANUAL UPDATE =====
    const forceUpdate = useCallback(() => {
        if (!state.isActive) return;

        setState(prev => ({ ...prev, isUpdating: true }));
        
        try {
            const runtimeMap = convertStepsToRuntimeMap(steps);
            setRegistrySteps(runtimeMap);
            
            setState(prev => ({
                ...prev,
                isUpdating: false,
                lastUpdate: Date.now(),
                updateCount: prev.updateCount + 1
            }));

            if (options.enableDebug) {
                console.log('🎭 Manual preview update completed');
            }
        } catch (error) {
            setState(prev => ({
                ...prev,
                isUpdating: false,
                errorCount: prev.errorCount + 1,
                lastError: error instanceof Error ? error.message : 'Unknown error'
            }));

            if (options.enableDebug) {
                console.error('🎭 Manual preview update failed:', error);
            }
        }
    }, [state.isActive, steps, setRegistrySteps, options.enableDebug]);

    // ===== AUTO UPDATE EFFECT =====
    useEffect(() => {
        if (!state.isActive) return;

        const stepsHash = JSON.stringify({
            steps: debouncedSteps,
            selectedStepId: debouncedSelectedStepId
        });

        // Skip se não houve mudanças
        if (stepsHash === lastStepsHashRef.current) return;

        // Check rate limit
        if (!canUpdate()) {
            if (options.enableDebug) {
                console.warn('🎭 Preview update rate limited');
            }
            return;
        }

        // Check cache
        const cachedResult = getFromCache(stepsHash);
        if (cachedResult && options.enableCache) {
            setState(prev => ({
                ...prev,
                cacheHits: prev.cacheHits + 1,
                lastUpdate: Date.now()
            }));
            
            if (options.enableDebug) {
                console.log('🎭 Preview update served from cache');
            }
            return;
        }

        setState(prev => ({ ...prev, isUpdating: true }));
        
        const updateStartTime = Date.now();
        
        try {
            const runtimeMap = convertStepsToRuntimeMap(debouncedSteps);
            
            // Isolamento de estado se habilitado
            if (options.isolatePreviewState) {
                isolatedStateRef.current = {
                    steps: { ...runtimeMap },
                    selectedStep: debouncedSelectedStepId,
                    timestamp: Date.now()
                };
            }
            
            setRegistrySteps(runtimeMap);
            recordUpdate();
            
            // Cache result
            if (options.enableCache) {
                setInCache(stepsHash, runtimeMap);
                setState(prev => ({ ...prev, cacheMisses: prev.cacheMisses + 1 }));
            }
            
            // Track update time
            const updateTime = Date.now() - updateStartTime;
            updateTimesRef.current.push(updateTime);
            
            // Keep only last 10 update times
            if (updateTimesRef.current.length > 10) {
                updateTimesRef.current = updateTimesRef.current.slice(-10);
            }
            
            lastStepsHashRef.current = stepsHash;
            
            setState(prev => ({
                ...prev,
                isUpdating: false,
                lastUpdate: Date.now(),
                updateCount: prev.updateCount + 1,
                lastError: undefined
            }));

            if (options.enableDebug) {
                console.log('🎭 Auto preview update completed in', updateTime + 'ms');
            }
        } catch (error) {
            setState(prev => ({
                ...prev,
                isUpdating: false,
                errorCount: prev.errorCount + 1,
                lastError: error instanceof Error ? error.message : 'Unknown error'
            }));

            if (options.enableDebug) {
                console.error('🎭 Auto preview update failed:', error);
            }
        }
    }, [
        state.isActive,
        debouncedSteps,
        debouncedSelectedStepId,
        canUpdate,
        recordUpdate,
        getFromCache,
        setInCache,
        setRegistrySteps,
        options.enableCache,
        options.isolatePreviewState,
        options.enableDebug
    ]);

    // ===== METRICS CALCULATION =====
    const metrics = useMemo((): LivePreviewMetrics => {
        const cacheStats = getCacheStats();
        const avgUpdateTime = updateTimesRef.current.length > 0
            ? updateTimesRef.current.reduce((a, b) => a + b, 0) / updateTimesRef.current.length
            : 0;
        
        const totalOperations = state.updateCount + state.errorCount;
        const errorRate = totalOperations > 0 ? state.errorCount / totalOperations : 0;
        
        // Calculate updates per second (last 10 updates)
        const now = Date.now();
        const recentUpdates = updateTimesRef.current.length;
        const timeSinceFirstUpdate = recentUpdates > 0 ? now - state.lastUpdate + updateTimesRef.current[0] : 1000;
        const updatesPerSecond = recentUpdates > 0 ? (recentUpdates / timeSinceFirstUpdate) * 1000 : 0;
        
        return {
            totalUpdates: state.updateCount,
            averageUpdateTime: avgUpdateTime,
            cacheEfficiency: cacheStats.efficiency,
            errorRate,
            updatesPerSecond
        };
    }, [state, getCacheStats]);

    // ===== ISOLATED STATE ACCESS =====
    const getIsolatedState = useCallback(() => {
        return options.isolatePreviewState ? isolatedStateRef.current : null;
    }, [options.isolatePreviewState]);

    // ===== RETURN API =====
    return {
        // State
        state,
        metrics,
        version,
        
        // Controls
        activate,
        deactivate,
        toggle,
        forceUpdate,
        
        // Data Access
        debouncedSteps,
        debouncedSelectedStepId,
        getIsolatedState,
        
        // Utils
        isActive: state.isActive,
        isUpdating: state.isUpdating,
        hasError: !!state.lastError,
        errorMessage: state.lastError
    };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function convertStepsToRuntimeMap(steps: any[]): Record<string, any> {
    const runtimeMap: Record<string, any> = {};
    
    steps.forEach((step, index) => {
        const stepId = step.id || `step-${String(index + 1).padStart(2, '0')}`;
        
        runtimeMap[stepId] = {
            id: stepId,
            type: step.type || 'question',
            order: step.order || (index + 1),
            questionText: step.questionText || step.title || '',
            options: step.options || [],
            blocks: step.blocks || [],
            timestamp: Date.now(),
            ...step
        };
    });
    
    return runtimeMap;
}

export default useLiveCanvasPreview;
import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo, ReactNode, useRef } from 'react';

export interface PerformanceMetrics {
    providersLoaded: number;
    renderCount: number;
    cacheHitRate: number;
    averageRenderTime: number;
    memoryUsage: number;
    lastOptimization: number;
}

const initialPerformance: PerformanceMetrics = {
    providersLoaded: 0,
    renderCount: 0,
    cacheHitRate: 0,
    averageRenderTime: 0,
    memoryUsage: 0,
    lastOptimization: Date.now(),
};

export type PerformanceAction =
    | { type: 'UPDATE_PERFORMANCE'; payload: Partial<PerformanceMetrics> }
    | { type: 'INCREMENT_RENDER' };

function performanceReducer(state: PerformanceMetrics, action: PerformanceAction): PerformanceMetrics {
    switch (action.type) {
        case 'UPDATE_PERFORMANCE':
            return { ...state, ...action.payload };
        case 'INCREMENT_RENDER':
            return { ...state, renderCount: state.renderCount + 1 };
        default:
            return state;
    }
}

interface PerformanceContextValue {
    metrics: PerformanceMetrics;
    trackRender: () => void;
    setPerformance: (updates: Partial<PerformanceMetrics>) => void;
}

const PerformanceContext = createContext<PerformanceContextValue | undefined>(undefined);

export const PerformanceProvider = ({ children }: { children: ReactNode }) => {
    const [metrics, dispatch] = useReducer(performanceReducer, initialPerformance);
    const mountStartRef = useRef<number>(performance.now());

    useEffect(() => {
        const end = performance.now();
        const renderTime = end - mountStartRef.current;
        dispatch({ type: 'UPDATE_PERFORMANCE', payload: { averageRenderTime: renderTime } });
    }, []);

    const trackRender = useCallback(() => {
        dispatch({ type: 'INCREMENT_RENDER' });
    }, []);

    const setPerformance = useCallback((updates: Partial<PerformanceMetrics>) => {
        dispatch({ type: 'UPDATE_PERFORMANCE', payload: { ...updates, lastOptimization: Date.now() } });
    }, []);

    const value = useMemo(() => ({ metrics, trackRender, setPerformance }), [metrics, trackRender, setPerformance]);

    return <PerformanceContext.Provider value={value}>{children}</PerformanceContext.Provider>;
};

export function usePerformance() {
    const ctx = useContext(PerformanceContext);
    if (!ctx) throw new Error('usePerformance deve ser usado dentro de PerformanceProvider');
    return ctx;
}

/**
 * ⚡ SMART RENDERING OPTIMIZER - Otimizador Inteligente de Rendering
 */

import React, { 
    useRef, 
    useState, 
    useEffect, 
    useCallback, 
    useMemo,
    memo,
    createContext,
    useContext
} from 'react';

// ============================================================================
// TYPES
// ============================================================================

interface RenderOptimizationConfig {
    enableVirtualization: boolean;
    viewportBuffer: number;
    diffingStrategy: 'shallow' | 'deep' | 'smart';
    batchingDelay: number;
    memoizationLevel: 'none' | 'basic' | 'aggressive';
    enableRenderProfiling: boolean;
}

interface RenderMetrics {
    totalRenders: number;
    skippedRenders: number;
    avgRenderTime: number;
    lastRenderTime: number;
    renderEfficiency: number;
    memoryUsage: number;
}

// ============================================================================
// SMART DIFFER
// ============================================================================

class SmartDiffer {
    private static cache = new Map<string, any>();
    
    static shouldUpdate(
        prevProps: any, 
        nextProps: any, 
        strategy: 'shallow' | 'deep' | 'smart' = 'smart'
    ): boolean {
        switch (strategy) {
            case 'shallow':
                return this.shallowCompare(prevProps, nextProps);
            case 'deep':
                return this.deepCompare(prevProps, nextProps);
            case 'smart':
                return this.smartCompare(prevProps, nextProps);
            default:
                return true;
        }
    }
    
    private static shallowCompare(prev: any, next: any): boolean {
        const prevKeys = Object.keys(prev || {});
        const nextKeys = Object.keys(next || {});
        
        if (prevKeys.length !== nextKeys.length) return true;
        
        for (const key of prevKeys) {
            if (prev[key] !== next[key]) return true;
        }
        
        return false;
    }
    
    private static deepCompare(prev: any, next: any): boolean {
        return JSON.stringify(prev) !== JSON.stringify(next);
    }
    
    private static smartCompare(prev: any, next: any): boolean {
        const cacheKey = this.generateCacheKey(prev, next);
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }
        
        let shouldUpdate = false;
        
        const criticalProps = ['steps', 'selectedStep', 'selectedBlockId', 'isVisible'];
        for (const prop of criticalProps) {
            if (prev?.[prop] !== next?.[prop]) {
                shouldUpdate = true;
                break;
            }
        }
        
        if (!shouldUpdate) {
            shouldUpdate = this.shallowCompare(prev, next);
        }
        
        this.cache.set(cacheKey, shouldUpdate);
        
        // Limpar cache se muito grande
        if (this.cache.size > 1000) {
            const entries = Array.from(this.cache.entries());
            const toKeep = entries.slice(-500);
            this.cache.clear();
            toKeep.forEach(([key, value]) => this.cache.set(key, value));
        }
        
        return shouldUpdate;
    }
    
    private static generateCacheKey(prev: any, next: any): string {
        try {
            const criticalPrev = this.extractCriticalProps(prev);
            const criticalNext = this.extractCriticalProps(next);
            return `${JSON.stringify(criticalPrev)}_${JSON.stringify(criticalNext)}`;
        } catch {
            return `${Date.now()}_${Math.random()}`;
        }
    }
    
    private static extractCriticalProps(obj: any): any {
        if (!obj) return {};
        
        const critical = ['id', 'type', 'order', 'visible', 'selected'];
        const result: any = {};
        
        critical.forEach(key => {
            if (obj[key] !== undefined) {
                result[key] = obj[key];
            }
        });
        
        return result;
    }
}

// ============================================================================
// RENDER PROFILER
// ============================================================================

interface RenderProfileEntry {
    componentName: string;
    renderTime: number;
    timestamp: number;
    propsChanged: string[];
    wasSkipped: boolean;
}

class RenderProfiler {
    private static profiles: RenderProfileEntry[] = [];
    private static isEnabled = false;
    
    static enable(): void {
        this.isEnabled = true;
    }
    
    static disable(): void {
        this.isEnabled = false;
    }
    
    static profile<T>(
        componentName: string,
        renderFn: () => T,
        prevProps?: any,
        nextProps?: any
    ): T {
        if (!this.isEnabled) {
            return renderFn();
        }
        
        const startTime = performance.now();
        const result = renderFn();
        const endTime = performance.now();
        
        const propsChanged = this.getChangedProps(prevProps, nextProps);
        
        const entry: RenderProfileEntry = {
            componentName,
            renderTime: endTime - startTime,
            timestamp: Date.now(),
            propsChanged,
            wasSkipped: false
        };
        
        this.profiles.push(entry);
        
        // Limitar histórico
        if (this.profiles.length > 1000) {
            this.profiles = this.profiles.slice(-1000);
        }
        
        return result;
    }
    
    static recordSkipped(componentName: string): void {
        if (!this.isEnabled) return;
        
        const entry: RenderProfileEntry = {
            componentName,
            renderTime: 0,
            timestamp: Date.now(),
            propsChanged: [],
            wasSkipped: true
        };
        
        this.profiles.push(entry);
    }
    
    static getMetrics(): RenderMetrics {
        const totalRenders = this.profiles.length;
        const skippedRenders = this.profiles.filter(p => p.wasSkipped).length;
        const actualRenders = this.profiles.filter(p => !p.wasSkipped);
        
        const avgRenderTime = actualRenders.length > 0 
            ? actualRenders.reduce((sum, p) => sum + p.renderTime, 0) / actualRenders.length
            : 0;
            
        const lastRenderTime = actualRenders.length > 0 
            ? actualRenders[actualRenders.length - 1].renderTime
            : 0;
            
        const renderEfficiency = totalRenders > 0 
            ? (totalRenders - skippedRenders) / totalRenders
            : 1;
        
        return {
            totalRenders,
            skippedRenders,
            avgRenderTime,
            lastRenderTime,
            renderEfficiency,
            memoryUsage: (performance as any).memory?.usedJSHeapSize || 0
        };
    }
    
    static clear(): void {
        this.profiles = [];
    }
    
    private static getChangedProps(prev?: any, next?: any): string[] {
        if (!prev || !next) return [];
        
        const changed: string[] = [];
        const allKeys = new Set([...Object.keys(prev), ...Object.keys(next)]);
        
        allKeys.forEach(key => {
            if (prev[key] !== next[key]) {
                changed.push(key);
            }
        });
        
        return changed;
    }
}

// ============================================================================
// RENDER OPTIMIZATION CONTEXT
// ============================================================================

interface RenderOptimizationContextType {
    config: RenderOptimizationConfig;
    metrics: RenderMetrics;
    updateConfig: (newConfig: Partial<RenderOptimizationConfig>) => void;
    clearMetrics: () => void;
    enableProfiling: () => void;
    disableProfiling: () => void;
}

const RenderOptimizationContext = createContext<RenderOptimizationContextType | null>(null);

export const useRenderOptimizationConfig = () => {
    const [currentConfig, setCurrentConfig] = useState<RenderOptimizationConfig>({
        enableVirtualization: false,
        viewportBuffer: 5,
        diffingStrategy: 'smart',
        batchingDelay: 16,
        memoizationLevel: 'basic',
        enableRenderProfiling: process.env.NODE_ENV === 'development'
    });
    
    const [metrics, setMetrics] = useState<RenderMetrics>({
        totalRenders: 0,
        skippedRenders: 0,
        avgRenderTime: 0,
        lastRenderTime: 0,
        renderEfficiency: 1,
        memoryUsage: 0
    });
    
    useEffect(() => {
        if (!currentConfig.enableRenderProfiling) return;
        
        const interval = setInterval(() => {
            setMetrics(RenderProfiler.getMetrics());
        }, 1000);
        
        return () => clearInterval(interval);
    }, [currentConfig.enableRenderProfiling]);
    
    const updateConfig = useCallback((newConfig: Partial<RenderOptimizationConfig>) => {
        setCurrentConfig(prev => ({ ...prev, ...newConfig }));
    }, []);
    
    const clearMetrics = useCallback(() => {
        RenderProfiler.clear();
        setMetrics({
            totalRenders: 0,
            skippedRenders: 0,
            avgRenderTime: 0,
            lastRenderTime: 0,
            renderEfficiency: 1,
            memoryUsage: 0
        });
    }, []);
    
    const enableProfiling = useCallback(() => {
        RenderProfiler.enable();
        updateConfig({ enableRenderProfiling: true });
    }, [updateConfig]);
    
    const disableProfiling = useCallback(() => {
        RenderProfiler.disable();
        updateConfig({ enableRenderProfiling: false });
    }, [updateConfig]);
    
    return {
        config: currentConfig,
        metrics,
        updateConfig,
        clearMetrics,
        enableProfiling,
        disableProfiling
    };
};

export const useRenderOptimization = useRenderOptimizationConfig;

// ============================================================================
// OPTIMIZED COMPONENT WRAPPER
// ============================================================================

export const useOptimizedCallback = <T extends (...args: any[]) => any>(
    callback: T,
    deps: React.DependencyList,
    delay: number = 0
): T => {
    const timeoutRef = useRef<NodeJS.Timeout>();
    
    return useCallback((...args: Parameters<T>) => {
        if (delay > 0) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                callback(...args);
            }, delay);
        } else {
            return callback(...args);
        }
    }, deps) as T;
};

export { SmartDiffer, RenderProfiler };

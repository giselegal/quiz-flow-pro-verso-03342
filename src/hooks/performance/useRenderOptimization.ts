import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

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

class SmartDiffer {
    private static cache = new Map<string, any>();
    
    static shouldUpdate(prevProps: any, nextProps: any, strategy: 'shallow' | 'deep' | 'smart' = 'smart'): boolean {
        if (strategy === 'shallow') {
            return this.shallowCompare(prevProps, nextProps);
        }
        return JSON.stringify(prevProps) !== JSON.stringify(nextProps);
    }
    
    private static shallowCompare(prev: any, next: any): boolean {
        if (!prev && !next) return false;
        if (!prev || !next) return true;
        
        const prevKeys = Object.keys(prev);
        const nextKeys = Object.keys(next);
        
        if (prevKeys.length !== nextKeys.length) return true;
        
        for (const key of prevKeys) {
            if (prev[key] !== next[key]) return true;
        }
        
        return false;
    }
}

class RenderProfiler {
    private static profiles: any[] = [];
    private static isEnabled = false;
    
    static enable(): void {
        this.isEnabled = true;
    }
    
    static disable(): void {
        this.isEnabled = false;
    }
    
    static getMetrics(): RenderMetrics {
        return {
            totalRenders: this.profiles.length,
            skippedRenders: 0,
            avgRenderTime: 0,
            lastRenderTime: 0,
            renderEfficiency: 1,
            memoryUsage: 0
        };
    }
    
    static clear(): void {
        this.profiles = [];
    }
}

export const useRenderOptimization = (config: Partial<RenderOptimizationConfig> = {}) => {
    const [currentConfig, setCurrentConfig] = useState<RenderOptimizationConfig>({
        enableVirtualization: false,
        viewportBuffer: 5,
        diffingStrategy: 'smart',
        batchingDelay: 16,
        memoizationLevel: 'basic',
        enableRenderProfiling: false,
        ...config
    });
    
    const [metrics, setMetrics] = useState<RenderMetrics>({
        totalRenders: 0,
        skippedRenders: 0,
        avgRenderTime: 0,
        lastRenderTime: 0,
        renderEfficiency: 1,
        memoryUsage: 0
    });
    
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

export { SmartDiffer, RenderProfiler };
export type { RenderOptimizationConfig, RenderMetrics };

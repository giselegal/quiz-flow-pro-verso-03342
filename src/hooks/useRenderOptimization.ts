/**
 * ⚡ SMART RENDERING OPTIMIZER - Otimizador Inteligente de Rendering
 * 
 * Sistema avançado de otimização de rendering que detecta mudanças mínimas,
 * aplica virtualization inteligente e otimiza re-renders desnecessários.
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
    viewportBuffer: number;        // Items extras para renderizar fora da viewport
    diffingStrategy: 'shallow' | 'deep' | 'smart';
    batchingDelay: number;         // ms para batching de updates
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

interface VirtualizationState {
    scrollTop: number;
    itemHeight: number;
    containerHeight: number;
    visibleStartIndex: number;
    visibleEndIndex: number;
    totalItems: number;
}

interface RenderProfileEntry {
    componentName: string;
    renderTime: number;
    timestamp: number;
    propsChanged: string[];
    wasSkipped: boolean;
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
        const prevKeys = Object.keys(prev);
        const nextKeys = Object.keys(next);
        
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
        // Cache da comparação
        const cacheKey = this.generateCacheKey(prev, next);
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }
        
        let shouldUpdate = false;
        
        // Verificar props críticas primeiro (mais prováveis de mudar)
        const criticalProps = ['steps', 'selectedStep', 'selectedBlockId', 'isVisible'];
        for (const prop of criticalProps) {
            if (prev[prop] !== next[prop]) {
                shouldUpdate = true;
                break;
            }
        }
        
        // Se props críticas não mudaram, fazer verificação mais leve
        if (!shouldUpdate) {
            shouldUpdate = this.shallowCompare(prev, next);
        }
        
        // Cache resultado
        this.cache.set(cacheKey, shouldUpdate);
        
        // Limpar cache periodicamente
        if (this.cache.size > 1000) {
            const entries = Array.from(this.cache.entries());
            const toKeep = entries.slice(-500); // Manter últimas 500
            this.cache.clear();
            toKeep.forEach(([key, value]) => this.cache.set(key, value));
        }
        
        return shouldUpdate;
    }
    
    private static generateCacheKey(prev: any, next: any): string {
        // Gerar key baseada em hashes das props críticas
        try {
            const criticalPrev = this.extractCriticalProps(prev);
            const criticalNext = this.extractCriticalProps(next);
            return `${JSON.stringify(criticalPrev)}_${JSON.stringify(criticalNext)}`;
        } catch {
            return `${Date.now()}_${Math.random()}`;
        }
    }
    
    private static extractCriticalProps(obj: any): any {
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
        
        // Manter apenas últimas 1000 entries
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
    
    static getProfile(): RenderProfileEntry[] {
        return [...this.profiles];
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
// VIRTUALIZATION HOOK
// ============================================================================

export const useVirtualization = (
    items: any[],
    itemHeight: number,
    containerHeight: number,
    buffer: number = 5
) => {
    const [scrollTop, setScrollTop] = useState(0);
    const scrollElementRef = useRef<HTMLElement>(null);
    
    const virtualState = useMemo((): VirtualizationState => {
        const totalItems = items.length;
        const visibleCount = Math.ceil(containerHeight / itemHeight);
        const startIndex = Math.floor(scrollTop / itemHeight);
        const endIndex = Math.min(startIndex + visibleCount + buffer, totalItems);
        const bufferedStartIndex = Math.max(0, startIndex - buffer);
        
        return {
            scrollTop,
            itemHeight,
            containerHeight,
            visibleStartIndex: bufferedStartIndex,
            visibleEndIndex: endIndex,
            totalItems
        };
    }, [items.length, itemHeight, containerHeight, scrollTop, buffer]);
    
    const visibleItems = useMemo(() => {
        return items.slice(virtualState.visibleStartIndex, virtualState.visibleEndIndex);
    }, [items, virtualState.visibleStartIndex, virtualState.visibleEndIndex]);
    
    const handleScroll = useCallback((event: Event) => {
        const target = event.target as HTMLElement;
        setScrollTop(target.scrollTop);
    }, []);
    
    useEffect(() => {
        const element = scrollElementRef.current;
        if (element) {
            element.addEventListener('scroll', handleScroll);
            return () => element.removeEventListener('scroll', handleScroll);
        }
    }, [handleScroll]);
    
    const getItemProps = useCallback((index: number) => {
        const actualIndex = virtualState.visibleStartIndex + index;
        const offsetY = actualIndex * itemHeight;
        
        return {
            style: {
                position: 'absolute' as const,
                top: offsetY,
                height: itemHeight,
                width: '100%'
            },
            'data-index': actualIndex
        };
    }, [virtualState.visibleStartIndex, itemHeight]);
    
    const containerProps = {
        ref: scrollElementRef,
        style: {
            height: containerHeight,
            overflow: 'auto',
            position: 'relative' as const
        }
    };
    
    const innerProps = {
        style: {
            height: virtualState.totalItems * itemHeight,
            position: 'relative' as const
        }
    };
    
    return {
        containerProps,
        innerProps,
        visibleItems,
        getItemProps,
        virtualState
    };
};

// ============================================================================
// OPTIMIZED COMPONENT WRAPPER
// ============================================================================

export const withRenderOptimization = <P extends {}>(
    Component: React.ComponentType<P>,
    config: Partial<RenderOptimizationConfig> = {}
) => {
    const defaultConfig: RenderOptimizationConfig = {
        enableVirtualization: false,
        viewportBuffer: 5,
        diffingStrategy: 'smart',
        batchingDelay: 16,
        memoizationLevel: 'basic',
        enableRenderProfiling: process.env.NODE_ENV === 'development'
    };
    
    const finalConfig = { ...defaultConfig, ...config };
    
    const OptimizedComponent = memo<P>((props) => {
        const prevPropsRef = useRef<P>();
        const renderCountRef = useRef(0);
        const lastRenderTime = useRef(0);
        
        // Batching de updates
        const [batchedProps, setBatchedProps] = useState<P>(props);
        const batchTimeoutRef = useRef<NodeJS.Timeout>();
        
        useEffect(() => {
            if (finalConfig.batchingDelay > 0) {
                clearTimeout(batchTimeoutRef.current);
                batchTimeoutRef.current = setTimeout(() => {
                    setBatchedProps(props);
                }, finalConfig.batchingDelay);
            } else {
                setBatchedProps(props);
            }
            
            return () => clearTimeout(batchTimeoutRef.current);
        }, [props]);
        
        // Render profiling
        useEffect(() => {
            if (finalConfig.enableRenderProfiling) {
                renderCountRef.current++;
                lastRenderTime.current = performance.now();
                
                if (renderCountRef.current % 100 === 0) {
                    console.log(`[${Component.name}] Renders: ${renderCountRef.current}`);
                }
            }
        });
        
        // Render otimizado
        return useMemo(() => {
            if (finalConfig.enableRenderProfiling) {
                return RenderProfiler.profile(
                    Component.displayName || Component.name || 'Anonymous',
                    () => <Component {...batchedProps} />,
                    prevPropsRef.current,
                    batchedProps
                );
            }
            
            return <Component {...batchedProps} />;
        }, [batchedProps]);
    }, (prevProps, nextProps) => {
        // Custom comparison
        const shouldUpdate = SmartDiffer.shouldUpdate(
            prevProps,
            nextProps,
            finalConfig.diffingStrategy
        );
        
        if (!shouldUpdate && finalConfig.enableRenderProfiling) {
            RenderProfiler.recordSkipped(
                Component.displayName || Component.name || 'Anonymous'
            );
        }
        
        return !shouldUpdate;
    });
    
    OptimizedComponent.displayName = `OptimizedComponent(${Component.displayName || Component.name})`;
    
    return OptimizedComponent;
};

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

export const RenderOptimizationProvider: React.FC<{
    children: React.ReactNode;
    config?: Partial<RenderOptimizationConfig>;
}> = ({ children, config = {} }) => {
    const [currentConfig, setCurrentConfig] = useState<RenderOptimizationConfig>({
        enableVirtualization: false,
        viewportBuffer: 5,
        diffingStrategy: 'smart',
        batchingDelay: 16,
        memoizationLevel: 'basic',
        enableRenderProfiling: process.env.NODE_ENV === 'development',
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
    
    // Atualizar métricas periodicamente
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
    
    const contextValue: RenderOptimizationContextType = {
        config: currentConfig,
        metrics,
        updateConfig,
        clearMetrics,
        enableProfiling,
        disableProfiling
    };
    
    return (
        <RenderOptimizationContext.Provider value={contextValue}>
            {children}
        </RenderOptimizationContext.Provider>
    );
};

export const useRenderOptimization = () => {
    const context = useContext(RenderOptimizationContext);
    if (!context) {
        throw new Error('useRenderOptimization must be used within RenderOptimizationProvider');
    }
    return context;
};

// ============================================================================
// UTILITY HOOKS
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

export const useOptimizedMemo = <T>(
    factory: () => T,
    deps: React.DependencyList,
    compareStrategy: 'shallow' | 'deep' = 'shallow'
): T => {
    const prevDepsRef = useRef<React.DependencyList>();
    const memoizedValueRef = useRef<T>();
    
    const shouldRecompute = !prevDepsRef.current || 
        SmartDiffer.shouldUpdate(prevDepsRef.current, deps, compareStrategy);
    
    if (shouldRecompute) {
        memoizedValueRef.current = factory();
        prevDepsRef.current = deps;
    }
    
    return memoizedValueRef.current!;
};

export { SmartDiffer, RenderProfiler };
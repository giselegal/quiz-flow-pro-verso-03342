/**/**

 * ⚡ SMART RENDERING OPTIMIZER - Otimizador Inteligente de Rendering * ⚡ SMART RENDERING OPTIMIZER - Otimizador Inteligente de Rendering

 *  */

 * Sistema avançado de otimização de rendering que detecta mudanças mínimas,

 * aplica virtualization inteligente e otimiza re-renders desnecessários.import React, { 

 */    useRef, 

    useState, 

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';    useEffect, 

    useCallback, 

// ============================================================================    useMemo,

// TYPES    memo,

// ============================================================================    createContext,

    useContext

interface RenderOptimizationConfig {} from 'react';

    enableVirtualization: boolean;

    viewportBuffer: number;// ============================================================================

    diffingStrategy: 'shallow' | 'deep' | 'smart';// TYPES

    batchingDelay: number;// ============================================================================

    memoizationLevel: 'none' | 'basic' | 'aggressive';

    enableRenderProfiling: boolean;interface RenderOptimizationConfig {

}    enableVirtualization: boolean;

    viewportBuffer: number;

interface RenderMetrics {    diffingStrategy: 'shallow' | 'deep' | 'smart';

    totalRenders: number;    batchingDelay: number;

    skippedRenders: number;    memoizationLevel: 'none' | 'basic' | 'aggressive';

    avgRenderTime: number;    enableRenderProfiling: boolean;

    lastRenderTime: number;}

    renderEfficiency: number;

    memoryUsage: number;interface RenderMetrics {

}    totalRenders: number;

    skippedRenders: number;

interface VirtualizationState {    avgRenderTime: number;

    scrollTop: number;    lastRenderTime: number;

    itemHeight: number;    renderEfficiency: number;

    containerHeight: number;    memoryUsage: number;

    visibleStartIndex: number;}

    visibleEndIndex: number;

    totalItems: number;// ============================================================================

}// SMART DIFFER

// ============================================================================

interface RenderProfileEntry {

    componentName: string;class SmartDiffer {

    renderTime: number;    private static cache = new Map<string, any>();

    timestamp: number;    

    propsChanged: string[];    static shouldUpdate(

    wasSkipped: boolean;        prevProps: any, 

}        nextProps: any, 

        strategy: 'shallow' | 'deep' | 'smart' = 'smart'

// ============================================================================    ): boolean {

// SMART DIFFER        switch (strategy) {

// ============================================================================            case 'shallow':

                return this.shallowCompare(prevProps, nextProps);

class SmartDiffer {            case 'deep':

    private static cache = new Map<string, any>();                return this.deepCompare(prevProps, nextProps);

                case 'smart':

    static shouldUpdate(                return this.smartCompare(prevProps, nextProps);

        prevProps: any,             default:

        nextProps: any,                 return true;

        strategy: 'shallow' | 'deep' | 'smart' = 'smart'        }

    ): boolean {    }

        switch (strategy) {    

            case 'shallow':    private static shallowCompare(prev: any, next: any): boolean {

                return this.shallowCompare(prevProps, nextProps);        const prevKeys = Object.keys(prev || {});

            case 'deep':        const nextKeys = Object.keys(next || {});

                return this.deepCompare(prevProps, nextProps);        

            case 'smart':        if (prevKeys.length !== nextKeys.length) return true;

                return this.smartCompare(prevProps, nextProps);        

            default:        for (const key of prevKeys) {

                return true;            if (prev[key] !== next[key]) return true;

        }        }

    }        

            return false;

    private static shallowCompare(prev: any, next: any): boolean {    }

        if (!prev && !next) return false;    

        if (!prev || !next) return true;    private static deepCompare(prev: any, next: any): boolean {

                return JSON.stringify(prev) !== JSON.stringify(next);

        const prevKeys = Object.keys(prev);    }

        const nextKeys = Object.keys(next);    

            private static smartCompare(prev: any, next: any): boolean {

        if (prevKeys.length !== nextKeys.length) return true;        const cacheKey = this.generateCacheKey(prev, next);

                if (this.cache.has(cacheKey)) {

        for (const key of prevKeys) {            return this.cache.get(cacheKey);

            if (prev[key] !== next[key]) return true;        }

        }        

                let shouldUpdate = false;

        return false;        

    }        const criticalProps = ['steps', 'selectedStep', 'selectedBlockId', 'isVisible'];

            for (const prop of criticalProps) {

    private static deepCompare(prev: any, next: any): boolean {            if (prev?.[prop] !== next?.[prop]) {

        return JSON.stringify(prev) !== JSON.stringify(next);                shouldUpdate = true;

    }                break;

                }

    private static smartCompare(prev: any, next: any): boolean {        }

        const cacheKey = this.generateCacheKey(prev, next);        

        if (this.cache.has(cacheKey)) {        if (!shouldUpdate) {

            return this.cache.get(cacheKey);            shouldUpdate = this.shallowCompare(prev, next);

        }        }

                

        let shouldUpdate = false;        this.cache.set(cacheKey, shouldUpdate);

                

        // Propriedades críticas que sempre forçam update        // Limpar cache se muito grande

        const criticalProps = ['steps', 'selectedStep', 'selectedBlockId', 'isVisible'];        if (this.cache.size > 1000) {

        for (const prop of criticalProps) {            const entries = Array.from(this.cache.entries());

            if (prev?.[prop] !== next?.[prop]) {            const toKeep = entries.slice(-500);

                shouldUpdate = true;            this.cache.clear();

                break;            toKeep.forEach(([key, value]) => this.cache.set(key, value));

            }        }

        }        

                return shouldUpdate;

        if (!shouldUpdate) {    }

            shouldUpdate = this.shallowCompare(prev, next);    

        }    private static generateCacheKey(prev: any, next: any): string {

                try {

        this.cache.set(cacheKey, shouldUpdate);            const criticalPrev = this.extractCriticalProps(prev);

                    const criticalNext = this.extractCriticalProps(next);

        // Limpar cache se muito grande            return `${JSON.stringify(criticalPrev)}_${JSON.stringify(criticalNext)}`;

        if (this.cache.size > 1000) {        } catch {

            const entries = Array.from(this.cache.entries());            return `${Date.now()}_${Math.random()}`;

            const toKeep = entries.slice(-500);        }

            this.cache.clear();    }

            toKeep.forEach(([key, value]) => this.cache.set(key, value));    

        }    private static extractCriticalProps(obj: any): any {

                if (!obj) return {};

        return shouldUpdate;        

    }        const critical = ['id', 'type', 'order', 'visible', 'selected'];

            const result: any = {};

    private static generateCacheKey(prev: any, next: any): string {        

        try {        critical.forEach(key => {

            const criticalPrev = this.extractCriticalProps(prev);            if (obj[key] !== undefined) {

            const criticalNext = this.extractCriticalProps(next);                result[key] = obj[key];

            return `${JSON.stringify(criticalPrev)}_${JSON.stringify(criticalNext)}`;            }

        } catch {        });

            return `${Date.now()}_${Math.random()}`;        

        }        return result;

    }    }

    }

    private static extractCriticalProps(obj: any): any {

        if (!obj) return {};// ============================================================================

        // RENDER PROFILER

        const critical = ['id', 'type', 'order', 'visible', 'selected'];// ============================================================================

        const result: any = {};

        interface RenderProfileEntry {

        critical.forEach(key => {    componentName: string;

            if (obj[key] !== undefined) {    renderTime: number;

                result[key] = obj[key];    timestamp: number;

            }    propsChanged: string[];

        });    wasSkipped: boolean;

        }

        return result;

    }class RenderProfiler {

}    private static profiles: RenderProfileEntry[] = [];

    private static isEnabled = false;

// ============================================================================    

// RENDER PROFILER    static enable(): void {

// ============================================================================        this.isEnabled = true;

    }

class RenderProfiler {    

    private static profiles: RenderProfileEntry[] = [];    static disable(): void {

    private static isEnabled = false;        this.isEnabled = false;

        }

    static enable(): void {    

        this.isEnabled = true;    static profile<T>(

    }        componentName: string,

            renderFn: () => T,

    static disable(): void {        prevProps?: any,

        this.isEnabled = false;        nextProps?: any

    }    ): T {

            if (!this.isEnabled) {

    static profile<T>(            return renderFn();

        componentName: string,        }

        renderFn: () => T,        

        prevProps?: any,        const startTime = performance.now();

        nextProps?: any        const result = renderFn();

    ): T {        const endTime = performance.now();

        if (!this.isEnabled) {        

            return renderFn();        const propsChanged = this.getChangedProps(prevProps, nextProps);

        }        

                const entry: RenderProfileEntry = {

        const startTime = performance.now();            componentName,

        const result = renderFn();            renderTime: endTime - startTime,

        const endTime = performance.now();            timestamp: Date.now(),

                    propsChanged,

        const propsChanged = this.getChangedProps(prevProps, nextProps);            wasSkipped: false

                };

        const entry: RenderProfileEntry = {        

            componentName,        this.profiles.push(entry);

            renderTime: endTime - startTime,        

            timestamp: Date.now(),        // Limitar histórico

            propsChanged,        if (this.profiles.length > 1000) {

            wasSkipped: false            this.profiles = this.profiles.slice(-1000);

        };        }

                

        this.profiles.push(entry);        return result;

            }

        // Limitar histórico    

        if (this.profiles.length > 1000) {    static recordSkipped(componentName: string): void {

            this.profiles = this.profiles.slice(-1000);        if (!this.isEnabled) return;

        }        

                const entry: RenderProfileEntry = {

        return result;            componentName,

    }            renderTime: 0,

                timestamp: Date.now(),

    static recordSkipped(componentName: string): void {            propsChanged: [],

        if (!this.isEnabled) return;            wasSkipped: true

                };

        const entry: RenderProfileEntry = {        

            componentName,        this.profiles.push(entry);

            renderTime: 0,    }

            timestamp: Date.now(),    

            propsChanged: [],    static getMetrics(): RenderMetrics {

            wasSkipped: true        const totalRenders = this.profiles.length;

        };        const skippedRenders = this.profiles.filter(p => p.wasSkipped).length;

                const actualRenders = this.profiles.filter(p => !p.wasSkipped);

        this.profiles.push(entry);        

    }        const avgRenderTime = actualRenders.length > 0 

                ? actualRenders.reduce((sum, p) => sum + p.renderTime, 0) / actualRenders.length

    static getMetrics(): RenderMetrics {            : 0;

        const totalRenders = this.profiles.length;            

        const skippedRenders = this.profiles.filter(p => p.wasSkipped).length;        const lastRenderTime = actualRenders.length > 0 

        const actualRenders = this.profiles.filter(p => !p.wasSkipped);            ? actualRenders[actualRenders.length - 1].renderTime

                    : 0;

        const avgRenderTime = actualRenders.length > 0             

            ? actualRenders.reduce((sum, p) => sum + p.renderTime, 0) / actualRenders.length        const renderEfficiency = totalRenders > 0 

            : 0;            ? (totalRenders - skippedRenders) / totalRenders

                        : 1;

        const lastRenderTime = actualRenders.length > 0         

            ? actualRenders[actualRenders.length - 1].renderTime        return {

            : 0;            totalRenders,

                        skippedRenders,

        const renderEfficiency = totalRenders > 0             avgRenderTime,

            ? (totalRenders - skippedRenders) / totalRenders            lastRenderTime,

            : 1;            renderEfficiency,

                    memoryUsage: (performance as any).memory?.usedJSHeapSize || 0

        return {        };

            totalRenders,    }

            skippedRenders,    

            avgRenderTime,    static clear(): void {

            lastRenderTime,        this.profiles = [];

            renderEfficiency,    }

            memoryUsage: (performance as any).memory?.usedJSHeapSize || 0    

        };    private static getChangedProps(prev?: any, next?: any): string[] {

    }        if (!prev || !next) return [];

            

    static clear(): void {        const changed: string[] = [];

        this.profiles = [];        const allKeys = new Set([...Object.keys(prev), ...Object.keys(next)]);

    }        

            allKeys.forEach(key => {

    private static getChangedProps(prev?: any, next?: any): string[] {            if (prev[key] !== next[key]) {

        if (!prev || !next) return [];                changed.push(key);

                    }

        const changed: string[] = [];        });

        const allKeys = new Set([...Object.keys(prev), ...Object.keys(next)]);        

                return changed;

        allKeys.forEach(key => {    }

            if (prev[key] !== next[key]) {}

                changed.push(key);

            }// ============================================================================

        });// RENDER OPTIMIZATION CONTEXT

        // ============================================================================

        return changed;

    }interface RenderOptimizationContextType {

}    config: RenderOptimizationConfig;

    metrics: RenderMetrics;

// ============================================================================    updateConfig: (newConfig: Partial<RenderOptimizationConfig>) => void;

// VIRTUALIZATION HOOK    clearMetrics: () => void;

// ============================================================================    enableProfiling: () => void;

    disableProfiling: () => void;

export const useVirtualization = (}

    items: any[],

    itemHeight: number,const RenderOptimizationContext = createContext<RenderOptimizationContextType | null>(null);

    containerHeight: number,

    buffer: number = 5export const useRenderOptimizationConfig = () => {

) => {    const [currentConfig, setCurrentConfig] = useState<RenderOptimizationConfig>({

    const [scrollTop, setScrollTop] = useState(0);        enableVirtualization: false,

    const scrollElementRef = useRef<HTMLElement>(null);        viewportBuffer: 5,

            diffingStrategy: 'smart',

    const virtualState = useMemo((): VirtualizationState => {        batchingDelay: 16,

        const totalItems = items.length;        memoizationLevel: 'basic',

        const visibleCount = Math.ceil(containerHeight / itemHeight);        enableRenderProfiling: process.env.NODE_ENV === 'development'

        const startIndex = Math.floor(scrollTop / itemHeight);    });

        const endIndex = Math.min(startIndex + visibleCount + buffer, totalItems);    

        const bufferedStartIndex = Math.max(0, startIndex - buffer);    const [metrics, setMetrics] = useState<RenderMetrics>({

                totalRenders: 0,

        return {        skippedRenders: 0,

            scrollTop,        avgRenderTime: 0,

            itemHeight,        lastRenderTime: 0,

            containerHeight,        renderEfficiency: 1,

            visibleStartIndex: bufferedStartIndex,        memoryUsage: 0

            visibleEndIndex: endIndex,    });

            totalItems    

        };    useEffect(() => {

    }, [items.length, itemHeight, containerHeight, scrollTop, buffer]);        if (!currentConfig.enableRenderProfiling) return;

            

    const visibleItems = useMemo(() => {        const interval = setInterval(() => {

        return items.slice(virtualState.visibleStartIndex, virtualState.visibleEndIndex);            setMetrics(RenderProfiler.getMetrics());

    }, [items, virtualState.visibleStartIndex, virtualState.visibleEndIndex]);        }, 1000);

            

    const handleScroll = useCallback((event: Event) => {        return () => clearInterval(interval);

        const target = event.target as HTMLElement;    }, [currentConfig.enableRenderProfiling]);

        setScrollTop(target.scrollTop);    

    }, []);    const updateConfig = useCallback((newConfig: Partial<RenderOptimizationConfig>) => {

            setCurrentConfig(prev => ({ ...prev, ...newConfig }));

    useEffect(() => {    }, []);

        const element = scrollElementRef.current;    

        if (element) {    const clearMetrics = useCallback(() => {

            element.addEventListener('scroll', handleScroll);        RenderProfiler.clear();

            return () => element.removeEventListener('scroll', handleScroll);        setMetrics({

        }            totalRenders: 0,

    }, [handleScroll]);            skippedRenders: 0,

                avgRenderTime: 0,

    const getItemProps = useCallback((index: number) => {            lastRenderTime: 0,

        const actualIndex = virtualState.visibleStartIndex + index;            renderEfficiency: 1,

        const offsetY = actualIndex * itemHeight;            memoryUsage: 0

                });

        return {    }, []);

            style: {    

                position: 'absolute' as const,    const enableProfiling = useCallback(() => {

                top: offsetY,        RenderProfiler.enable();

                height: itemHeight,        updateConfig({ enableRenderProfiling: true });

                width: '100%'    }, [updateConfig]);

            },    

            'data-index': actualIndex    const disableProfiling = useCallback(() => {

        };        RenderProfiler.disable();

    }, [virtualState.visibleStartIndex, itemHeight]);        updateConfig({ enableRenderProfiling: false });

        }, [updateConfig]);

    const containerProps = {    

        ref: scrollElementRef,    return {

        style: {        config: currentConfig,

            height: containerHeight,        metrics,

            overflow: 'auto',        updateConfig,

            position: 'relative' as const        clearMetrics,

        }        enableProfiling,

    };        disableProfiling

        };

    const innerProps = {};

        style: {

            height: virtualState.totalItems * itemHeight,export const useRenderOptimization = useRenderOptimizationConfig;

            position: 'relative' as const

        }// ============================================================================

    };// OPTIMIZED COMPONENT WRAPPER

    // ============================================================================

    return {

        containerProps,export const useOptimizedCallback = <T extends (...args: any[]) => any>(

        innerProps,    callback: T,

        visibleItems,    deps: React.DependencyList,

        getItemProps,    delay: number = 0

        virtualState): T => {

    };    const timeoutRef = useRef<NodeJS.Timeout>();

};    

    return useCallback((...args: Parameters<T>) => {

// ============================================================================        if (delay > 0) {

// MAIN HOOK            clearTimeout(timeoutRef.current);

// ============================================================================            timeoutRef.current = setTimeout(() => {

                callback(...args);

export const useRenderOptimization = (            }, delay);

    config: Partial<RenderOptimizationConfig> = {}        } else {

) => {            return callback(...args);

    const [currentConfig, setCurrentConfig] = useState<RenderOptimizationConfig>({        }

        enableVirtualization: false,    }, deps) as T;

        viewportBuffer: 5,};

        diffingStrategy: 'smart',

        batchingDelay: 16,export { SmartDiffer, RenderProfiler };

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

// ============================================================================
// EXPORTS
// ============================================================================

export { SmartDiffer, RenderProfiler };
export type { RenderOptimizationConfig, RenderMetrics, VirtualizationState };
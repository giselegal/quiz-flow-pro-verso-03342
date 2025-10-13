// @ts-nocheck
/**
 * 🧠 ADVANCED MEMOIZATION SYSTEM
 * 
 * Sistema avançado de memoização para otimizar performance de componentes React
 * com strategies inteligentes e cache adaptativos
 */

import React, { useMemo, useCallback, useRef, useEffect, memo, ComponentType, useState } from 'react';

// Tipos para estratégias de memoização
interface MemoizationOptions {
    strategy?: 'shallow' | 'deep' | 'custom' | 'smart';
    cacheSize?: number;
    ttl?: number; // Time to live em ms
    dependencies?: any[];
    equalityFn?: (prev: any, next: any) => boolean;
    debugKey?: string;
}

interface CacheEntry<T> {
    value: T;
    timestamp: number;
    hitCount: number;
    dependencies?: any[];
}

// Cache global com TTL e LRU
class AdvancedCache<T> {
    private cache = new Map<string, CacheEntry<T>>();
    private maxSize: number;
    private defaultTTL: number;
    private hitRates = new Map<string, number>();

    constructor(maxSize = 100, defaultTTL = 300000) { // 5 min default
        this.maxSize = maxSize;
        this.defaultTTL = defaultTTL;
    }

    set(key: string, value: T, ttl?: number, dependencies?: any[]): void {
        // Implementar LRU eviction se necessário
        if (this.cache.size >= this.maxSize) {
            const oldestKey = this.findOldestKey();
            if (oldestKey) {
                this.cache.delete(oldestKey);
                this.hitRates.delete(oldestKey);
            }
        }

        this.cache.set(key, {
            value,
            timestamp: Date.now(),
            hitCount: 0,
            dependencies
        });
    }

    get(key: string, ttl?: number): T | undefined {
        const entry = this.cache.get(key);
        if (!entry) return undefined;

        const maxAge = ttl || this.defaultTTL;
        const isExpired = Date.now() - entry.timestamp > maxAge;

        if (isExpired) {
            this.cache.delete(key);
            this.hitRates.delete(key);
            return undefined;
        }

        // Update hit statistics
        entry.hitCount++;
        const currentHitRate = this.hitRates.get(key) || 0;
        this.hitRates.set(key, currentHitRate + 1);

        return entry.value;
    }

    has(key: string): boolean {
        const entry = this.cache.get(key);
        if (!entry) return false;

        const isExpired = Date.now() - entry.timestamp > this.defaultTTL;
        if (isExpired) {
            this.cache.delete(key);
            this.hitRates.delete(key);
            return false;
        }

        return true;
    }

    invalidate(key: string): boolean {
        const deleted = this.cache.delete(key);
        this.hitRates.delete(key);
        return deleted;
    }

    invalidateByPattern(pattern: RegExp): number {
        let invalidated = 0;
        for (const key of this.cache.keys()) {
            if (pattern.test(key)) {
                this.cache.delete(key);
                this.hitRates.delete(key);
                invalidated++;
            }
        }
        return invalidated;
    }

    clear(): void {
        this.cache.clear();
        this.hitRates.clear();
    }

    getStats() {
        const totalKeys = this.cache.size;
        const totalHits = Array.from(this.hitRates.values()).reduce((sum, hits) => sum + hits, 0);
        const averageHits = totalKeys > 0 ? totalHits / totalKeys : 0;

        return {
            size: totalKeys,
            maxSize: this.maxSize,
            totalHits,
            averageHits,
            hitRate: totalHits > 0 ? (totalHits / (totalHits + totalKeys)) * 100 : 0
        };
    }

    private findOldestKey(): string | undefined {
        let oldestKey: string | undefined;
        let oldestTime = Date.now();

        for (const [key, entry] of this.cache.entries()) {
            if (entry.timestamp < oldestTime) {
                oldestTime = entry.timestamp;
                oldestKey = key;
            }
        }

        return oldestKey;
    }
}

// Cache singleton para toda aplicação
const globalMemoCache = new AdvancedCache<any>(200, 600000); // 10 min TTL

// Utility para criar chaves de cache estáveis
const createCacheKey = (prefix: string, deps: any[]): string => {
    try {
        const depsString = JSON.stringify(deps, (key, value) => {
            if (typeof value === 'function') return value.toString();
            if (value instanceof Date) return value.toISOString();
            if (value instanceof RegExp) return value.toString();
            return value;
        });
        return `${prefix}:${depsString}`;
    } catch (error) {
        // Fallback for circular references
        return `${prefix}:${deps.map(d => typeof d).join('-')}:${Date.now()}`;
    }
};

// Deep equality check otimizado
const deepEqual = (a: any, b: any): boolean => {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (typeof a !== typeof b) return false;

    if (typeof a === 'object') {
        if (Array.isArray(a) !== Array.isArray(b)) return false;

        const keysA = Object.keys(a);
        const keysB = Object.keys(b);

        if (keysA.length !== keysB.length) return false;

        for (const key of keysA) {
            if (!keysB.includes(key) || !deepEqual(a[key], b[key])) {
                return false;
            }
        }

        return true;
    }

    return false;
};

// Hook otimizado para memoização de valores computados
export const useAdvancedMemo = <T>(
    factory: () => T,
    options: MemoizationOptions = {}
): T => {
    const {
        dependencies = [],
        strategy = 'shallow',
        ttl,
        debugKey,
        equalityFn = strategy === 'deep' ? deepEqual : Object.is,
        cacheSize = 50
    } = options;

    // Cache key deve ser estável para cada combinação de deps e debugKey
    const cacheKey = useMemo(() => createCacheKey(debugKey || 'memo', dependencies), [debugKey, ...dependencies]);
    const depsRef = useRef(dependencies);
    const resultRef = useRef<T>();

    // Check cache first
    const cached = globalMemoCache.get(cacheKey, ttl);
    if (cached !== undefined) {
        const entry = (globalMemoCache as any)['cache'].get(cacheKey) as CacheEntry<T> | undefined;
        if (entry && equalityFn(entry.dependencies, dependencies)) {
            if (debugKey) {
                console.log(`📋 Cache hit for: ${debugKey}`);
            }
            return cached;
        }
    }

    const result = useMemo(() => {
        const startTime = performance.now();

        // Check if dependencies changed
        if (resultRef.current !== undefined && equalityFn(depsRef.current, dependencies)) {
            if (debugKey) {
                console.log(`🎯 Dependency match for: ${debugKey}`);
            }
            return resultRef.current;
        }

        const computed = factory();
        const computeTime = performance.now() - startTime;

        if (debugKey && computeTime > 10) {
            console.warn(`🐌 Slow computation in ${debugKey}: ${computeTime.toFixed(2)}ms`);
        }

        // Update cache
        globalMemoCache.set(cacheKey, computed, ttl, dependencies);
        depsRef.current = dependencies;
        resultRef.current = computed;

        if (debugKey) {
            console.log(`✨ Computed ${debugKey} in ${computeTime.toFixed(2)}ms`);
        }

        return computed;
    }, [cacheKey, ...dependencies]);

    return result;
};

// Hook otimizado para memoização de callbacks
export const useAdvancedCallback = <T extends (...args: any[]) => any>(
    callback: T,
    options: MemoizationOptions = {}
): T => {
    const {
        dependencies = [],
        debugKey,
        ttl,
        equalityFn = Object.is
    } = options;

    const depsRef = useRef(dependencies);
    const callbackRef = useRef<T>(callback);

    useEffect(() => {
        if (!equalityFn(depsRef.current, dependencies)) {
            callbackRef.current = callback;
            depsRef.current = dependencies;
            if (debugKey) {
                console.log(`🔄 Callback updated: ${debugKey}`);
            }
        }
    }, [callback, equalityFn, dependencies, debugKey]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useCallback(((...args: any[]) => {
        return callbackRef.current(...args);
    }) as T, [JSON.stringify(dependencies)]);
};

// HOC para memoização automática de componentes
interface MemoComponentOptions extends MemoizationOptions {
    displayName?: string;
    propWhitelist?: string[];
    propBlacklist?: string[];
}

export const withAdvancedMemo = <P extends object>(
    Component: ComponentType<P>,
    options: MemoComponentOptions = {}
) => {
    const {
        strategy = 'shallow',
        equalityFn,
        debugKey,
        displayName,
        propWhitelist,
        propBlacklist
    } = options;

    const MemoizedComponent = memo(Component, (prevProps, nextProps) => {
        const filterProps = (props: P): Partial<P> => {
            if (propWhitelist) {
                return Object.fromEntries(
                    Object.entries(props).filter(([key]) => propWhitelist.includes(key))
                ) as Partial<P>;
            }
            if (propBlacklist) {
                return Object.fromEntries(
                    Object.entries(props).filter(([key]) => !propBlacklist.includes(key))
                ) as Partial<P>;
            }
            return props;
        };

        const filteredPrev = filterProps(prevProps);
        const filteredNext = filterProps(nextProps);

        const isEqual = equalityFn
            ? equalityFn(filteredPrev, filteredNext)
            : strategy === 'deep'
                ? deepEqual(filteredPrev, filteredNext)
                : Object.is(filteredPrev, filteredNext);

        if (debugKey && !isEqual) {
            console.log(`🔄 Re-render triggered for: ${debugKey}`, {
                prevProps: filteredPrev,
                nextProps: filteredNext
            });
        }

        return isEqual;
    });

    MemoizedComponent.displayName = displayName || `withAdvancedMemo(${Component.displayName || Component.name})`;

    return MemoizedComponent;
};

// Hook para monitorar performance de renders
export const useRenderPerformance = (componentName: string) => {
    const renderCountRef = useRef(0);
    const lastRenderTime = useRef(Date.now());
    const renderTimes = useRef<number[]>([]);

    useEffect(() => {
        renderCountRef.current++;
        const now = Date.now();
        const renderDuration = now - lastRenderTime.current;

        renderTimes.current.push(renderDuration);

        // Keep only last 10 renders
        if (renderTimes.current.length > 10) {
            renderTimes.current.shift();
        }

        lastRenderTime.current = now;

        const averageRenderTime = renderTimes.current.reduce((sum, time) => sum + time, 0) / renderTimes.current.length;

        if (renderCountRef.current > 1 && renderDuration > 16) { // > 60fps
            console.warn(`🐌 Slow render in ${componentName}: ${renderDuration}ms (avg: ${averageRenderTime.toFixed(2)}ms)`);
        }

        if (renderCountRef.current % 10 === 0) {
            console.log(`📊 ${componentName} rendered ${renderCountRef.current} times, avg: ${averageRenderTime.toFixed(2)}ms`);
        }
    });

    return {
        renderCount: renderCountRef.current,
        averageRenderTime: renderTimes.current.reduce((sum, time) => sum + time, 0) / renderTimes.current.length,
        lastRenderDuration: renderTimes.current[renderTimes.current.length - 1] || 0
    };
};

// Utility para limpeza de cache
export const cacheUtils = {
    invalidatePattern: (pattern: RegExp) => globalMemoCache.invalidateByPattern(pattern),
    invalidateKey: (key: string) => globalMemoCache.invalidate(key),
    clearAll: () => globalMemoCache.clear(),
    getStats: () => globalMemoCache.getStats(),
    cleanup: () => {
        const keys = Array.from((globalMemoCache as any)['cache'].keys());
        keys.forEach(key => globalMemoCache.get(key)); // Força verificação de TTL
    }
};

// Hook para monitoramento automático de cache
export const useCacheMonitoring = (intervalMs = 30000) => {
    const [stats, setStats] = useState(globalMemoCache.getStats());

    useEffect(() => {
        const interval = setInterval(() => {
            cacheUtils.cleanup(); // Limpar expirados
            setStats(globalMemoCache.getStats());
        }, intervalMs);

        return () => clearInterval(interval);
    }, [intervalMs]);

    return stats;
};

// Presets para componentes específicos do editor
export const EditorMemoPresets = {
    HeavyComponent: (Component: ComponentType<any>) =>
        withAdvancedMemo(Component, {
            strategy: 'deep',
            debugKey: 'HeavyComponent',
            ttl: 300000 // 5 min
        }),
    Sidebar: (Component: ComponentType<any>) =>
        withAdvancedMemo(Component, {
            strategy: 'shallow',
            debugKey: 'EditorSidebar',
            propBlacklist: ['timestamp', 'debug'] // Ignore props que mudam frequentemente
        }),
    Canvas: (Component: ComponentType<any>) =>
        withAdvancedMemo(Component, {
            strategy: 'shallow',
            debugKey: 'EditorCanvas',
            propWhitelist: ['blocks', 'selectedBlock', 'mode']
        }),
    PropertiesPanel: (Component: ComponentType<any>) =>
        withAdvancedMemo(Component, {
            strategy: 'deep',
            debugKey: 'PropertiesPanel',
            ttl: 600000 // 10 min
        })
};
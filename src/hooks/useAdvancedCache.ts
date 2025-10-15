/**
 * 🚀 ADVANCED CACHE SYSTEM - Sistema de Cache Avançado Multi-Level
 * 
 * Sistema de cache inteligente com múltiplas camadas, invalidação automática
 * e otimizações específicas para o preview do quiz.
 */

import { useState, useEffect, useRef, useCallback } from 'react';

// ============================================================================
// TYPES
// ============================================================================

interface CacheEntry<T = any> {
    data: T;
    timestamp: number;
    accessCount: number;
    lastAccessed: number;
    ttl: number;
    size?: number;
    dependencies?: string[];
}

interface CacheConfig {
    maxSize: number;           // Máximo de entries
    defaultTTL: number;        // TTL padrão em ms
    maxMemoryMB: number;       // Limite de memória em MB
    persistentKeys?: string[]; // Keys que persistem entre sessões
    enableCompression?: boolean;
    enableMetrics?: boolean;
}

interface CacheMetrics {
    hits: number;
    misses: number;
    evictions: number;
    totalSize: number;
    memoryUsage: number;
    hitRate: number;
    avgAccessTime: number;
}

interface CacheStrategy {
    name: 'LRU' | 'LFU' | 'TTL' | 'SIZE';
    priority: number;
}

// ============================================================================
// ADVANCED CACHE CLASS
// ============================================================================

class AdvancedCache<T = any> {
    private cache = new Map<string, CacheEntry<T>>();
    private config: CacheConfig;
    private metrics: CacheMetrics;
    private persistentStorage: Storage | null = null;
    
    constructor(config: Partial<CacheConfig> = {}) {
        this.config = {
            maxSize: 1000,
            defaultTTL: 5 * 60 * 1000, // 5 minutos
            maxMemoryMB: 50,
            enableCompression: false,
            enableMetrics: true,
            ...config
        };
        
        this.metrics = {
            hits: 0,
            misses: 0,
            evictions: 0,
            totalSize: 0,
            memoryUsage: 0,
            hitRate: 0,
            avgAccessTime: 0
        };
        
        // Verificar se localStorage está disponível
        try {
            this.persistentStorage = localStorage;
            this.loadPersistentCache();
        } catch (e) {
            console.warn('Cache persistente não disponível:', e);
        }
        
        // Cleanup periódico
        this.startCleanupTimer();
    }
    
    // ===== CORE METHODS =====
    
    set(
        key: string, 
        data: T, 
        options: {
            ttl?: number;
            dependencies?: string[];
            persist?: boolean;
            compress?: boolean;
        } = {}
    ): void {
        const startTime = performance.now();
        
        try {
            const entry: CacheEntry<T> = {
                data,
                timestamp: Date.now(),
                accessCount: 0,
                lastAccessed: Date.now(),
                ttl: options.ttl || this.config.defaultTTL,
                dependencies: options.dependencies,
                size: this.calculateSize(data)
            };
            
            // Verificar limites antes de inserir
            this.ensureCapacity(entry.size || 0);
            
            // Inserir no cache
            this.cache.set(key, entry);
            
            // Persistir se solicitado
            if (options.persist && this.persistentStorage) {
                this.persistEntry(key, entry);
            }
            
            // Atualizar métricas
            if (this.config.enableMetrics) {
                this.updateMetrics('set', performance.now() - startTime);
            }
            
        } catch (error) {
            console.error('Erro ao salvar no cache:', error);
        }
    }
    
    get(key: string): T | null {
        const startTime = performance.now();
        
        try {
            const entry = this.cache.get(key);
            
            if (!entry) {
                if (this.config.enableMetrics) {
                    this.metrics.misses++;
                    this.updateHitRate();
                }
                return null;
            }
            
            // Verificar TTL
            if (this.isExpired(entry)) {
                this.cache.delete(key);
                if (this.config.enableMetrics) {
                    this.metrics.misses++;
                    this.updateHitRate();
                }
                return null;
            }
            
            // Atualizar estatísticas da entry
            entry.accessCount++;
            entry.lastAccessed = Date.now();
            
            // Atualizar métricas
            if (this.config.enableMetrics) {
                this.metrics.hits++;
                this.updateHitRate();
                this.updateMetrics('get', performance.now() - startTime);
            }
            
            return entry.data;
            
        } catch (error) {
            console.error('Erro ao recuperar do cache:', error);
            return null;
        }
    }
    
    has(key: string): boolean {
        const entry = this.cache.get(key);
        return entry !== undefined && !this.isExpired(entry);
    }
    
    delete(key: string): boolean {
        const deleted = this.cache.delete(key);
        
        // Remover do storage persistente
        if (this.persistentStorage) {
            this.persistentStorage.removeItem(`cache_${key}`);
        }
        
        return deleted;
    }
    
    clear(): void {
        this.cache.clear();
        
        // Limpar storage persistente
        if (this.persistentStorage && this.config.persistentKeys) {
            this.config.persistentKeys.forEach(key => {
                this.persistentStorage!.removeItem(`cache_${key}`);
            });
        }
        
        this.resetMetrics();
    }
    
    // ===== INVALIDATION METHODS =====
    
    invalidateByDependency(dependency: string): number {
        let invalidated = 0;
        
        for (const [key, entry] of Array.from(this.cache.entries())) {
            if (entry.dependencies?.includes(dependency)) {
                this.cache.delete(key);
                invalidated++;
            }
        }
        
        return invalidated;
    }
    
    invalidateByPattern(pattern: RegExp): number {
        let invalidated = 0;
        
        for (const key of Array.from(this.cache.keys())) {
            if (pattern.test(key)) {
                this.cache.delete(key);
                invalidated++;
            }
        }
        
        return invalidated;
    }
    
    // ===== OPTIMIZATION METHODS =====
    
    preload(keys: Array<{ key: string; loader: () => Promise<T> }>): Promise<void[]> {
        return Promise.all(
            keys.map(async ({ key, loader }) => {
                if (!this.has(key)) {
                    try {
                        const data = await loader();
                        this.set(key, data);
                    } catch (error) {
                        console.warn(`Preload failed for ${key}:`, error);
                    }
                }
            })
        );
    }
    
    warmup(hotKeys: string[]): void {
        // Move hot keys para o início do Map (mais eficiente)
        hotKeys.forEach(key => {
            const entry = this.cache.get(key);
            if (entry) {
                this.cache.delete(key);
                this.cache.set(key, entry);
            }
        });
    }
    
    // ===== UTILITY METHODS =====
    
    private ensureCapacity(newEntrySize: number): void {
        // Verificar limite de entries
        while (this.cache.size >= this.config.maxSize) {
            this.evictLeastUsed();
        }
        
        // Verificar limite de memória
        const currentMemoryMB = this.metrics.memoryUsage / (1024 * 1024);
        const newEntryMB = newEntrySize / (1024 * 1024);
        
        while (currentMemoryMB + newEntryMB > this.config.maxMemoryMB) {
            this.evictLargest();
        }
    }
    
    private evictLeastUsed(): void {
        let oldestKey = '';
        let oldestTime = Date.now();
        
        for (const [key, entry] of Array.from(this.cache.entries())) {
            if (entry.lastAccessed < oldestTime) {
                oldestTime = entry.lastAccessed;
                oldestKey = key;
            }
        }
        
        if (oldestKey) {
            this.cache.delete(oldestKey);
            this.metrics.evictions++;
        }
    }
    
    private evictLargest(): void {
        let largestKey = '';
        let largestSize = 0;
        
        for (const [key, entry] of Array.from(this.cache.entries())) {
            const size = entry.size || 0;
            if (size > largestSize) {
                largestSize = size;
                largestKey = key;
            }
        }
        
        if (largestKey) {
            this.cache.delete(largestKey);
            this.metrics.evictions++;
        }
    }
    
    private isExpired(entry: CacheEntry<T>): boolean {
        return Date.now() - entry.timestamp > entry.ttl;
    }
    
    private calculateSize(data: T): number {
        try {
            return JSON.stringify(data).length;
        } catch {
            return 0;
        }
    }
    
    private updateMetrics(operation: 'get' | 'set', duration: number): void {
        // Atualizar tempo médio de acesso
        const totalOps = this.metrics.hits + this.metrics.misses;
        this.metrics.avgAccessTime = 
            (this.metrics.avgAccessTime * (totalOps - 1) + duration) / totalOps;
        
        // Atualizar uso de memória
        this.metrics.memoryUsage = Array.from(this.cache.values())
            .reduce((total, entry) => total + (entry.size || 0), 0);
    }
    
    private updateHitRate(): void {
        const total = this.metrics.hits + this.metrics.misses;
        this.metrics.hitRate = total > 0 ? this.metrics.hits / total : 0;
    }
    
    private resetMetrics(): void {
        this.metrics = {
            hits: 0,
            misses: 0,
            evictions: 0,
            totalSize: 0,
            memoryUsage: 0,
            hitRate: 0,
            avgAccessTime: 0
        };
    }
    
    private persistEntry(key: string, entry: CacheEntry<T>): void {
        try {
            const persistKey = `cache_${key}`;
            const persistData = {
                data: entry.data,
                timestamp: entry.timestamp,
                ttl: entry.ttl
            };
            this.persistentStorage!.setItem(persistKey, JSON.stringify(persistData));
        } catch (error) {
            console.warn('Falha ao persistir cache:', error);
        }
    }
    
    private loadPersistentCache(): void {
        if (!this.persistentStorage || !this.config.persistentKeys) return;
        
        this.config.persistentKeys.forEach(key => {
            try {
                const persistKey = `cache_${key}`;
                const stored = this.persistentStorage!.getItem(persistKey);
                
                if (stored) {
                    const parsed = JSON.parse(stored);
                    const entry: CacheEntry<T> = {
                        data: parsed.data,
                        timestamp: parsed.timestamp,
                        accessCount: 0,
                        lastAccessed: Date.now(),
                        ttl: parsed.ttl
                    };
                    
                    if (!this.isExpired(entry)) {
                        this.cache.set(key, entry);
                    }
                }
            } catch (error) {
                console.warn(`Falha ao carregar cache persistente para ${key}:`, error);
            }
        });
    }
    
    private startCleanupTimer(): void {
        setInterval(() => {
            this.cleanup();
        }, 60000); // Cleanup a cada minuto
    }
    
    private cleanup(): void {
        const now = Date.now();
        const keysToDelete: string[] = [];
        
        for (const [key, entry] of Array.from(this.cache.entries())) {
            if (this.isExpired(entry)) {
                keysToDelete.push(key);
            }
        }
        
        keysToDelete.forEach(key => this.cache.delete(key));
    }
    
    // ===== PUBLIC GETTERS =====
    
    getMetrics(): CacheMetrics {
        return { ...this.metrics };
    }
    
    getSize(): number {
        return this.cache.size;
    }
    
    getKeys(): string[] {
        return Array.from(this.cache.keys());
    }
    
    getConfig(): CacheConfig {
        return { ...this.config };
    }
}

// ============================================================================
// REACT HOOK
// ============================================================================

export const useAdvancedCache = <T = any>(
    namespace: string = 'default',
    config?: Partial<CacheConfig>
) => {
    const cacheRef = useRef<AdvancedCache<T>>();
    const [metrics, setMetrics] = useState<CacheMetrics>();
    
    // Inicializar cache
    useEffect(() => {
        if (!cacheRef.current) {
            cacheRef.current = new AdvancedCache<T>({
                persistentKeys: [`${namespace}_persistent`],
                ...config
            });
        }
    }, [namespace, config]);
    
    // Atualizar métricas periodicamente
    useEffect(() => {
        const interval = setInterval(() => {
            if (cacheRef.current) {
                setMetrics(cacheRef.current.getMetrics());
            }
        }, 1000);
        
        return () => clearInterval(interval);
    }, []);
    
    const cache = cacheRef.current!;
    
    const memoizedGet = useCallback((key: string) => {
        return cache?.get(`${namespace}:${key}`) || null;
    }, [namespace]);
    
    const memoizedSet = useCallback((
        key: string, 
        data: T, 
        options?: Parameters<typeof cache.set>[2]
    ) => {
        cache?.set(`${namespace}:${key}`, data, options);
    }, [namespace]);
    
    const memoizedHas = useCallback((key: string) => {
        return cache?.has(`${namespace}:${key}`) || false;
    }, [namespace]);
    
    const memoizedDelete = useCallback((key: string) => {
        return cache?.delete(`${namespace}:${key}`) || false;
    }, [namespace]);
    
    const invalidateNamespace = useCallback(() => {
        if (cache) {
            return cache.invalidateByPattern(new RegExp(`^${namespace}:`));
        }
        return 0;
    }, [namespace]);
    
    return {
        get: memoizedGet,
        set: memoizedSet,
        has: memoizedHas,
        delete: memoizedDelete,
        clear: () => cache?.clear(),
        invalidateNamespace,
        invalidateByDependency: (dep: string) => cache?.invalidateByDependency(dep),
        preload: (keys: Array<{ key: string; loader: () => Promise<T> }>) => 
            cache?.preload(keys.map(({ key, loader }) => ({ 
                key: `${namespace}:${key}`, 
                loader 
            }))),
        warmup: (keys: string[]) => 
            cache?.warmup(keys.map(key => `${namespace}:${key}`)),
        metrics,
        size: cache?.getSize() || 0
    };
};

export default AdvancedCache;
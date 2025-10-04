/**
 * 🧠 INTELLIGENT CACHE PROVIDER - FASE 1
 * 
 * Sistema de cache avançado que otimiza performance através de:
 * ✅ Multi-layer caching (Memory + IndexedDB + LocalStorage)
 * ✅ Intelligent cache invalidation
 * ✅ Selective data persistence
 * ✅ Automatic garbage collection
 * ✅ Performance metrics tracking
 */

import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
    useRef,
    ReactNode,
    useMemo
} from 'react';

// 🎯 CACHE CONFIGURATION
interface CacheConfig {
    maxMemorySize: number; // MB
    maxIndexedDBSize: number; // MB
    maxLocalStorageSize: number; // MB
    defaultTTL: number; // milliseconds
    gcInterval: number; // milliseconds
    compressionEnabled: boolean;
    encryptionEnabled: boolean;
}

const DEFAULT_CACHE_CONFIG: CacheConfig = {
    maxMemorySize: 50, // 50MB
    maxIndexedDBSize: 100, // 100MB
    maxLocalStorageSize: 10, // 10MB
    defaultTTL: 300000, // 5 minutes
    gcInterval: 60000, // 1 minute
    compressionEnabled: true,
    encryptionEnabled: false
};

// 🎯 CACHE ENTRY
interface CacheEntry<T = any> {
    key: string;
    data: T;
    timestamp: number;
    ttl: number;
    accessCount: number;
    lastAccessed: number;
    size: number;
    compressed: boolean;
    encrypted: boolean;
    tags: string[];
}

// 🎯 CACHE STATISTICS
interface CacheStats {
    memoryCache: {
        entries: number;
        totalSize: number;
        hitRate: number;
        missRate: number;
    };
    indexedDBCache: {
        entries: number;
        totalSize: number;
        hitRate: number;
        missRate: number;
    };
    localStorageCache: {
        entries: number;
        totalSize: number;
        hitRate: number;
        missRate: number;
    };
    overall: {
        totalEntries: number;
        totalSize: number;
        overallHitRate: number;
        gcRuns: number;
        lastGC: number;
    };
}

// 🎯 CACHE LAYER INTERFACE
interface CacheLayer {
    get<T>(key: string): Promise<CacheEntry<T> | null>;
    set<T>(key: string, entry: CacheEntry<T>): Promise<boolean>;
    delete(key: string): Promise<boolean>;
    clear(): Promise<boolean>;
    keys(): Promise<string[]>;
    size(): Promise<number>;
}

// 🎯 MEMORY CACHE LAYER
class MemoryCacheLayer implements CacheLayer {
    private cache = new Map<string, CacheEntry>();
    private maxSize: number;
    private stats = { hits: 0, misses: 0 };

    constructor(maxSizeMB: number) {
        this.maxSize = maxSizeMB * 1024 * 1024; // Convert to bytes
    }

    async get<T>(key: string): Promise<CacheEntry<T> | null> {
        const entry = this.cache.get(key);
        
        if (!entry) {
            this.stats.misses++;
            return null;
        }

        // Check if expired
        if (Date.now() - entry.timestamp > entry.ttl) {
            this.cache.delete(key);
            this.stats.misses++;
            return null;
        }

        // Update access stats
        entry.accessCount++;
        entry.lastAccessed = Date.now();
        this.stats.hits++;

        return entry as CacheEntry<T>;
    }

    async set<T>(key: string, entry: CacheEntry<T>): Promise<boolean> {
        // Check if we need to make space
        while (this.getCurrentSize() + entry.size > this.maxSize) {
            if (!this.evictLRU()) {
                return false; // Can't make space
            }
        }

        this.cache.set(key, entry);
        return true;
    }

    async delete(key: string): Promise<boolean> {
        return this.cache.delete(key);
    }

    async clear(): Promise<boolean> {
        this.cache.clear();
        return true;
    }

    async keys(): Promise<string[]> {
        return Array.from(this.cache.keys());
    }

    async size(): Promise<number> {
        return this.getCurrentSize();
    }

    getStats() {
        const total = this.stats.hits + this.stats.misses;
        return {
            hits: this.stats.hits,
            misses: this.stats.misses,
            hitRate: total > 0 ? this.stats.hits / total : 0
        };
    }

    private getCurrentSize(): number {
        let size = 0;
        for (const entry of this.cache.values()) {
            size += entry.size;
        }
        return size;
    }

    private evictLRU(): boolean {
        if (this.cache.size === 0) return false;

        let oldestKey: string | null = null;
        let oldestTime = Date.now();

        for (const [key, entry] of this.cache.entries()) {
            if (entry.lastAccessed < oldestTime) {
                oldestTime = entry.lastAccessed;
                oldestKey = key;
            }
        }

        if (oldestKey) {
            this.cache.delete(oldestKey);
            return true;
        }

        return false;
    }
}

// 🎯 INDEXEDDB CACHE LAYER
class IndexedDBCacheLayer implements CacheLayer {
    private dbName = 'QuizCacheDB';
    private storeName = 'cache';
    private version = 1;
    private db: IDBDatabase | null = null;

    constructor() {
        this.initDB();
    }

    private async initDB(): Promise<void> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    const store = db.createObjectStore(this.storeName, { keyPath: 'key' });
                    store.createIndex('timestamp', 'timestamp', { unique: false });
                    store.createIndex('tags', 'tags', { unique: false, multiEntry: true });
                }
            };
        });
    }

    async get<T>(key: string): Promise<CacheEntry<T> | null> {
        if (!this.db) await this.initDB();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.get(key);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                const entry = request.result;
                
                if (!entry) {
                    resolve(null);
                    return;
                }

                // Check if expired
                if (Date.now() - entry.timestamp > entry.ttl) {
                    this.delete(key);
                    resolve(null);
                    return;
                }

                resolve(entry);
            };
        });
    }

    async set<T>(key: string, entry: CacheEntry<T>): Promise<boolean> {
        if (!this.db) await this.initDB();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.put(entry);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(true);
        });
    }

    async delete(key: string): Promise<boolean> {
        if (!this.db) await this.initDB();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.delete(key);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(true);
        });
    }

    async clear(): Promise<boolean> {
        if (!this.db) await this.initDB();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.clear();

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(true);
        });
    }

    async keys(): Promise<string[]> {
        if (!this.db) await this.initDB();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.getAllKeys();

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result as string[]);
        });
    }

    async size(): Promise<number> {
        if (!this.db) await this.initDB();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.count();

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
        });
    }
}

// 🎯 LOCALSTORAGE CACHE LAYER
class LocalStorageCacheLayer implements CacheLayer {
    private prefix = 'QuizCache_';
    private maxSize: number;

    constructor(maxSizeMB: number) {
        this.maxSize = maxSizeMB * 1024 * 1024; // Convert to bytes
    }

    async get<T>(key: string): Promise<CacheEntry<T> | null> {
        try {
            const item = localStorage.getItem(this.prefix + key);
            if (!item) return null;

            const entry = JSON.parse(item) as CacheEntry<T>;

            // Check if expired
            if (Date.now() - entry.timestamp > entry.ttl) {
                localStorage.removeItem(this.prefix + key);
                return null;
            }

            return entry;
        } catch (error) {
            console.warn('LocalStorage cache get error:', error);
            return null;
        }
    }

    async set<T>(key: string, entry: CacheEntry<T>): Promise<boolean> {
        try {
            const serialized = JSON.stringify(entry);
            
            // Check size limit
            if (this.getCurrentSize() + serialized.length > this.maxSize) {
                return false;
            }

            localStorage.setItem(this.prefix + key, serialized);
            return true;
        } catch (error) {
            console.warn('LocalStorage cache set error:', error);
            return false;
        }
    }

    async delete(key: string): Promise<boolean> {
        try {
            localStorage.removeItem(this.prefix + key);
            return true;
        } catch (error) {
            console.warn('LocalStorage cache delete error:', error);
            return false;
        }
    }

    async clear(): Promise<boolean> {
        try {
            const keys = Object.keys(localStorage).filter(key => key.startsWith(this.prefix));
            keys.forEach(key => localStorage.removeItem(key));
            return true;
        } catch (error) {
            console.warn('LocalStorage cache clear error:', error);
            return false;
        }
    }

    async keys(): Promise<string[]> {
        try {
            return Object.keys(localStorage)
                .filter(key => key.startsWith(this.prefix))
                .map(key => key.substring(this.prefix.length));
        } catch (error) {
            console.warn('LocalStorage cache keys error:', error);
            return [];
        }
    }

    async size(): Promise<number> {
        return this.getCurrentSize();
    }

    private getCurrentSize(): number {
        let size = 0;
        for (const key in localStorage) {
            if (key.startsWith(this.prefix)) {
                size += localStorage[key].length;
            }
        }
        return size;
    }
}

// 🎯 INTELLIGENT CACHE MANAGER
class IntelligentCacheManager {
    private memoryLayer: MemoryCacheLayer;
    private indexedDBLayer: IndexedDBCacheLayer;
    private localStorageLayer: LocalStorageCacheLayer;
    private config: CacheConfig;
    private stats = {
        totalHits: 0,
        totalMisses: 0,
        gcRuns: 0,
        lastGC: Date.now()
    };

    constructor(config: CacheConfig = DEFAULT_CACHE_CONFIG) {
        this.config = config;
        this.memoryLayer = new MemoryCacheLayer(config.maxMemorySize);
        this.indexedDBLayer = new IndexedDBCacheLayer();
        this.localStorageLayer = new LocalStorageCacheLayer(config.maxLocalStorageSize);

        // Start garbage collection
        this.startGarbageCollection();
    }

    async get<T>(key: string): Promise<T | null> {
        // Try memory first (fastest)
        let entry = await this.memoryLayer.get<T>(key);
        if (entry) {
            this.stats.totalHits++;
            return this.deserializeData(entry.data);
        }

        // Try IndexedDB next (persistent)
        entry = await this.indexedDBLayer.get<T>(key);
        if (entry) {
            this.stats.totalHits++;
            // Promote to memory cache
            await this.memoryLayer.set(key, entry);
            return this.deserializeData(entry.data);
        }

        // Try LocalStorage last (limited space)
        entry = await this.localStorageLayer.get<T>(key);
        if (entry) {
            this.stats.totalHits++;
            // Promote to higher layers
            await this.memoryLayer.set(key, entry);
            await this.indexedDBLayer.set(key, entry);
            return this.deserializeData(entry.data);
        }

        this.stats.totalMisses++;
        return null;
    }

    async set<T>(
        key: string, 
        data: T, 
        options: {
            ttl?: number;
            tags?: string[];
            persistent?: boolean;
            priority?: 'high' | 'medium' | 'low';
        } = {}
    ): Promise<boolean> {
        const {
            ttl = this.config.defaultTTL,
            tags = [],
            persistent = false,
            priority = 'medium'
        } = options;

        const serializedData = this.serializeData(data);
        const entry: CacheEntry<any> = {
            key,
            data: serializedData,
            timestamp: Date.now(),
            ttl,
            accessCount: 0,
            lastAccessed: Date.now(),
            size: JSON.stringify(serializedData).length,
            compressed: this.config.compressionEnabled,
            encrypted: this.config.encryptionEnabled,
            tags
        };

        let success = false;

        // Always try to store in memory for fast access
        if (priority === 'high' || priority === 'medium') {
            success = await this.memoryLayer.set(key, entry) || success;
        }

        // Store in IndexedDB for persistence
        if (persistent || priority === 'high') {
            success = await this.indexedDBLayer.set(key, entry) || success;
        }

        // Store in LocalStorage for small, frequently accessed items
        if (entry.size < 1024 && priority === 'high') { // < 1KB
            success = await this.localStorageLayer.set(key, entry) || success;
        }

        return success;
    }

    async delete(key: string): Promise<boolean> {
        const results = await Promise.allSettled([
            this.memoryLayer.delete(key),
            this.indexedDBLayer.delete(key),
            this.localStorageLayer.delete(key)
        ]);

        return results.some(result => result.status === 'fulfilled' && result.value);
    }

    async clear(tags?: string[]): Promise<boolean> {
        if (!tags) {
            // Clear all layers
            const results = await Promise.allSettled([
                this.memoryLayer.clear(),
                this.indexedDBLayer.clear(),
                this.localStorageLayer.clear()
            ]);
            return results.every(result => result.status === 'fulfilled' && result.value);
        }

        // Clear by tags (more complex implementation needed)
        // For now, just clear memory
        return await this.memoryLayer.clear();
    }

    async getStats(): Promise<CacheStats> {
        const memoryStats = this.memoryLayer.getStats();
        
        return {
            memoryCache: {
                entries: (await this.memoryLayer.keys()).length,
                totalSize: await this.memoryLayer.size(),
                hitRate: memoryStats.hitRate,
                missRate: 1 - memoryStats.hitRate
            },
            indexedDBCache: {
                entries: await this.indexedDBLayer.size(),
                totalSize: 0, // Would need more complex calculation
                hitRate: 0, // Would need tracking
                missRate: 1
            },
            localStorageCache: {
                entries: (await this.localStorageLayer.keys()).length,
                totalSize: await this.localStorageLayer.size(),
                hitRate: 0, // Would need tracking
                missRate: 1
            },
            overall: {
                totalEntries: 0, // Sum of all layers
                totalSize: 0, // Sum of all layers
                overallHitRate: this.stats.totalHits / (this.stats.totalHits + this.stats.totalMisses),
                gcRuns: this.stats.gcRuns,
                lastGC: this.stats.lastGC
            }
        };
    }

    private serializeData(data: any): any {
        if (this.config.compressionEnabled) {
            // Simple compression simulation (would use actual compression library)
            return { compressed: true, data: JSON.stringify(data) };
        }
        return data;
    }

    private deserializeData(data: any): any {
        if (data && data.compressed) {
            return JSON.parse(data.data);
        }
        return data;
    }

    private startGarbageCollection() {
        setInterval(async () => {
            await this.runGarbageCollection();
        }, this.config.gcInterval);
    }

    private async runGarbageCollection() {
        this.stats.gcRuns++;
        this.stats.lastGC = Date.now();

        // Remove expired entries from all layers
        const layers = [this.memoryLayer, this.indexedDBLayer, this.localStorageLayer];
        
        for (const layer of layers) {
            const keys = await layer.keys();
            for (const key of keys) {
                const entry = await layer.get(key);
                if (entry && Date.now() - entry.timestamp > entry.ttl) {
                    await layer.delete(key);
                }
            }
        }
    }
}

// 🎯 CONTEXT TYPE
interface IntelligentCacheContextType {
    cache: IntelligentCacheManager;
    get: <T>(key: string) => Promise<T | null>;
    set: <T>(key: string, data: T, options?: any) => Promise<boolean>;
    delete: (key: string) => Promise<boolean>;
    clear: (tags?: string[]) => Promise<boolean>;
    getStats: () => Promise<CacheStats>;
}

// 🎯 CONTEXT
const IntelligentCacheContext = createContext<IntelligentCacheContextType | null>(null);

// 🎯 PROVIDER
interface IntelligentCacheProviderProps {
    children: ReactNode;
    config?: Partial<CacheConfig>;
    debugMode?: boolean;
}

export const IntelligentCacheProvider: React.FC<IntelligentCacheProviderProps> = ({
    children,
    config = {},
    debugMode = false
}) => {
    const cacheManagerRef = useRef<IntelligentCacheManager | null>(null);
    const [stats, setStats] = useState<CacheStats | null>(null);

    // Initialize cache manager
    if (!cacheManagerRef.current) {
        const finalConfig = { ...DEFAULT_CACHE_CONFIG, ...config };
        cacheManagerRef.current = new IntelligentCacheManager(finalConfig);
    }

    const cacheManager = cacheManagerRef.current;

    // Update stats periodically
    useEffect(() => {
        if (debugMode) {
            const interval = setInterval(async () => {
                const newStats = await cacheManager.getStats();
                setStats(newStats);
            }, 5000); // Update every 5 seconds

            return () => clearInterval(interval);
        }
    }, [cacheManager, debugMode]);

    const contextValue = useMemo<IntelligentCacheContextType>(() => ({
        cache: cacheManager,
        get: <T>(key: string) => cacheManager.get<T>(key),
        set: <T>(key: string, data: T, options?: any) => cacheManager.set(key, data, options),
        delete: (key: string) => cacheManager.delete(key),
        clear: (tags?: string[]) => cacheManager.clear(tags),
        getStats: () => cacheManager.getStats()
    }), [cacheManager]);

    // Debug logging
    useEffect(() => {
        if (debugMode && stats) {
            console.log('🧠 Intelligent Cache Stats:', stats);
        }
    }, [debugMode, stats]);

    return (
        <IntelligentCacheContext.Provider value={contextValue}>
            {children}
            {debugMode && stats && (
                <div style={{
                    position: 'fixed',
                    top: '10px',
                    left: '10px',
                    background: 'rgba(0,0,0,0.8)',
                    color: 'white',
                    padding: '10px',
                    borderRadius: '5px',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    zIndex: 9999,
                    maxWidth: '300px'
                }}>
                    <h4>Cache Stats</h4>
                    <div>Hit Rate: {(stats.overall.overallHitRate * 100).toFixed(1)}%</div>
                    <div>Memory Entries: {stats.memoryCache.entries}</div>
                    <div>GC Runs: {stats.overall.gcRuns}</div>
                </div>
            )}
        </IntelligentCacheContext.Provider>
    );
};

// 🎯 HOOK
export const useIntelligentCache = () => {
    const context = useContext(IntelligentCacheContext);
    if (!context) {
        throw new Error('useIntelligentCache must be used within IntelligentCacheProvider');
    }
    return context;
};

// 🎯 SPECIALIZED CACHE HOOKS
export const useCachedData = <T>(
    key: string,
    fetcher: () => Promise<T>,
    options: {
        ttl?: number;
        refreshInterval?: number;
        persistent?: boolean;
    } = {}
) => {
    const { get, set } = useIntelligentCache();
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // Try cache first
            const cached = await get<T>(key);
            if (cached) {
                setData(cached);
                setLoading(false);
                return cached;
            }

            // Fetch fresh data
            const fresh = await fetcher();
            await set(key, fresh, options);
            setData(fresh);
            return fresh;
        } catch (err) {
            setError(err as Error);
            return null;
        } finally {
            setLoading(false);
        }
    }, [key, fetcher, get, set, options]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Auto refresh
    useEffect(() => {
        if (options.refreshInterval) {
            const interval = setInterval(fetchData, options.refreshInterval);
            return () => clearInterval(interval);
        }
    }, [fetchData, options.refreshInterval]);

    return { data, loading, error, refetch: fetchData };
};

export default IntelligentCacheProvider;
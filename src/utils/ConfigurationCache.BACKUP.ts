/**
 * 🚀 CACHE SIMPLES PARA CONFIGURAÇÕES DO EDITOR
 * 
 * Cache em memória para configurações de componentes
 * evitando múltiplas calls à API durante preview/edição
 */

interface CacheEntry<T> {
    data: T;
    timestamp: number;
    ttl: number; // Time to live in milliseconds
}

class ConfigurationCache {
    private cache = new Map<string, CacheEntry<any>>();
    private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutos

    /**
     * Buscar item do cache
     */
    get<T>(key: string): T | null {
        const entry = this.cache.get(key);
        
        if (!entry) {
            return null;
        }

        // Verificar se expirou
        if (Date.now() - entry.timestamp > entry.ttl) {
            this.cache.delete(key);
            return null;
        }

        return entry.data as T;
    }

    /**
     * Armazenar item no cache
     */
    set<T>(key: string, data: T, ttl?: number): void {
        const entry: CacheEntry<T> = {
            data,
            timestamp: Date.now(),
            ttl: ttl || this.DEFAULT_TTL
        };

        this.cache.set(key, entry);
    }

    /**
     * Verificar se item existe no cache e é válido
     */
    has(key: string): boolean {
        return this.get(key) !== null;
    }

    /**
     * Remover item do cache
     */
    delete(key: string): void {
        this.cache.delete(key);
    }

    /**
     * Limpar todo o cache
     */
    clear(): void {
        this.cache.clear();
    }

    /**
     * Remover itens expirados
     */
    cleanup(): void {
        const now = Date.now();
        
        for (const [key, entry] of this.cache.entries()) {
            if (now - entry.timestamp > entry.ttl) {
                this.cache.delete(key);
            }
        }
    }

    /**
     * Estatísticas do cache
     */
    getStats() {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys()),
            memoryUsage: this.estimateMemoryUsage()
        };
    }

    private estimateMemoryUsage(): string {
        const size = JSON.stringify(Array.from(this.cache.entries())).length;
        if (size < 1024) return `${size} bytes`;
        if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
        return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    }
}

// Singleton instance
export const configurationCache = new ConfigurationCache();

// Auto cleanup a cada 10 minutos
if (typeof window !== 'undefined') {
    setInterval(() => {
        configurationCache.cleanup();
    }, 10 * 60 * 1000);
}

export default configurationCache;
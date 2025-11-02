/**
 * Optimized Image Storage Service - Stub
 * TODO: Implementar otimização e armazenamento de imagens
 */

export interface ImageOptimizationOptions {
    quality?: number;
    maxWidth?: number;
    maxHeight?: number;
    format?: 'webp' | 'jpeg' | 'png';
}

export interface OptimizedImageResult {
    url: string;
    optimizedSize: number;
    originalSize: number;
    compressionRatio: number;
}

type CacheEntry = {
    url: string;
    size: number;
    createdAt: number;
};

export class OptimizedImageStorage {
    private cache: Map<string, CacheEntry> = new Map();

    async optimizeAndStore(
        file: File,
        options?: ImageOptimizationOptions
    ): Promise<OptimizedImageResult> {
        console.warn('OptimizedImageStorage: Stub implementation');
        throw new Error('OptimizedImageStorage not implemented yet');
    }

    async getOptimizedUrl(originalUrl: string): Promise<string> {
        console.warn('OptimizedImageStorage: Stub implementation');
        return originalUrl;
    }

    /**
     * Obtém uma imagem do cache ou executa o fetcher para obtê-la e gerar uma URL otimizada
     * Retorna uma URL (object URL) utilizável em <img src="..." />
     */
    async getCachedImage(
        key: string,
        fetcher: () => Promise<Blob>,
        _options?: ImageOptimizationOptions
    ): Promise<string> {
        const hit = this.cache.get(key);
        if (hit) return hit.url;

        // Busca e cria object URL; não aplicamos otimização real neste stub
        const blob = await fetcher();
        const objectUrl = URL.createObjectURL(blob);
        this.cache.set(key, { url: objectUrl, size: (blob as any).size || 0, createdAt: Date.now() });
        return objectUrl;
    }

    async getStats(): Promise<{
        totalSize: string;
        count: number;
        averageCompression: number;
        oldestImage: number | null;
        newestImage: number | null;
    }> {
        const entries = Array.from(this.cache.values());
        const totalBytes = entries.reduce((sum, e) => sum + (e.size || 0), 0);
        const oldest = entries.length ? Math.min(...entries.map(e => e.createdAt)) : null;
        const newest = entries.length ? Math.max(...entries.map(e => e.createdAt)) : null;
        const totalSize = `${(totalBytes / 1024).toFixed(1)} KB`;
        return {
            totalSize,
            count: entries.length,
            averageCompression: 0,
            oldestImage: oldest,
            newestImage: newest,
        };
    }

    async clearCache(): Promise<void> {
        for (const entry of this.cache.values()) {
            try { URL.revokeObjectURL(entry.url); } catch {}
        }
        this.cache.clear();
    }
}

export const optimizedImageStorage = new OptimizedImageStorage();

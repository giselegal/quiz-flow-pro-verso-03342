import { appLogger } from '@/lib/utils/appLogger';
/**
 * Optimized Image Storage Service
 * Provides image optimization and caching with compression
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
    originalSize: number;
    createdAt: number;
};

export class OptimizedImageStorage {
    private cache: Map<string, CacheEntry> = new Map();
    private readonly STORAGE_KEY = 'optimized-images-metadata';
    private readonly MAX_CACHE_SIZE = 50 * 1024 * 1024; // 50MB

    /**
     * Optimize and store an image file
     */
    async optimizeAndStore(
        file: File,
        options?: ImageOptimizationOptions
    ): Promise<OptimizedImageResult> {
        const defaultOptions: Required<ImageOptimizationOptions> = {
            quality: options?.quality ?? 0.8,
            maxWidth: options?.maxWidth ?? 1920,
            maxHeight: options?.maxHeight ?? 1080,
            format: options?.format ?? 'webp',
        };

        try {
            const originalSize = file.size;
            
            // Create an image element to load the file
            const img = await this.loadImage(file);
            
            // Calculate new dimensions maintaining aspect ratio
            const { width, height } = this.calculateDimensions(
                img.width,
                img.height,
                defaultOptions.maxWidth,
                defaultOptions.maxHeight
            );
            
            // Create canvas and draw resized image
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            
            if (!ctx) {
                throw new Error('Failed to get canvas context');
            }
            
            ctx.drawImage(img, 0, 0, width, height);
            
            // Convert to blob with specified quality
            const mimeType = `image/${defaultOptions.format}`;
            const blob = await new Promise<Blob>((resolve, reject) => {
                canvas.toBlob(
                    (result) => {
                        if (result) resolve(result);
                        else reject(new Error('Failed to create blob'));
                    },
                    mimeType,
                    defaultOptions.quality
                );
            });
            
            const optimizedSize = blob.size;
            const objectUrl = URL.createObjectURL(blob);
            
            // Cache the result
            const key = file.name;
            this.cache.set(key, {
                url: objectUrl,
                size: optimizedSize,
                originalSize,
                createdAt: Date.now(),
            });
            
            // Check and manage cache size
            await this.manageCacheSize();
            
            const compressionRatio = originalSize > 0 ? (1 - optimizedSize / originalSize) * 100 : 0;
            
            appLogger.info('[OptimizedImageStorage] Image optimized', {
                data: [{ name: file.name, originalSize, optimizedSize, compressionRatio }]
            });
            
            return {
                url: objectUrl,
                optimizedSize,
                originalSize,
                compressionRatio,
            };
        } catch (error) {
            appLogger.error('[OptimizedImageStorage] Failed to optimize image', { data: [error] });
            // Fallback: return original file as object URL
            const objectUrl = URL.createObjectURL(file);
            return {
                url: objectUrl,
                optimizedSize: file.size,
                originalSize: file.size,
                compressionRatio: 0,
            };
        }
    }

    /**
     * Get optimized URL for an existing image URL
     */
    async getOptimizedUrl(originalUrl: string): Promise<string> {
        // Check cache first
        const cached = this.cache.get(originalUrl);
        if (cached) {
            appLogger.debug('[OptimizedImageStorage] Cache hit', { data: [originalUrl] });
            return cached.url;
        }

        try {
            // Fetch the image
            const response = await fetch(originalUrl);
            const blob = await response.blob();
            const file = new File([blob], 'downloaded-image', { type: blob.type });
            
            // Optimize it
            const result = await this.optimizeAndStore(file, {
                quality: 0.85,
                maxWidth: 1920,
                maxHeight: 1080,
            });
            
            // Cache with original URL as key
            this.cache.set(originalUrl, {
                url: result.url,
                size: result.optimizedSize,
                originalSize: result.originalSize,
                createdAt: Date.now(),
            });
            
            return result.url;
        } catch (error) {
            appLogger.warn('[OptimizedImageStorage] Failed to optimize URL, returning original', { 
                data: [originalUrl, error] 
            });
            return originalUrl;
        }
    }

    /**
     * Get cached image or fetch and optimize it
     */
    async getCachedImage(
        key: string,
        fetcher: () => Promise<Blob>,
        options?: ImageOptimizationOptions
    ): Promise<string> {
        const hit = this.cache.get(key);
        if (hit) {
            appLogger.debug('[OptimizedImageStorage] Cache hit', { data: [key] });
            return hit.url;
        }

        try {
            const blob = await fetcher();
            const file = new File([blob], key, { type: blob.type });
            const result = await this.optimizeAndStore(file, options);
            
            // Cache with provided key
            this.cache.set(key, {
                url: result.url,
                size: result.optimizedSize,
                originalSize: result.originalSize,
                createdAt: Date.now(),
            });
            
            return result.url;
        } catch (error) {
            appLogger.error('[OptimizedImageStorage] Failed to cache image', { data: [key, error] });
            throw error;
        }
    }

    /**
     * Get storage statistics
     */
    async getStats(): Promise<{
        totalSize: string;
        count: number;
        averageCompression: number;
        oldestImage: number | null;
        newestImage: number | null;
    }> {
        const entries = Array.from(this.cache.values());
        const totalBytes = entries.reduce((sum, e) => sum + e.size, 0);
        const totalOriginalBytes = entries.reduce((sum, e) => sum + e.originalSize, 0);
        const oldest = entries.length ? Math.min(...entries.map(e => e.createdAt)) : null;
        const newest = entries.length ? Math.max(...entries.map(e => e.createdAt)) : null;
        
        const averageCompression = totalOriginalBytes > 0 
            ? ((1 - totalBytes / totalOriginalBytes) * 100)
            : 0;
        
        const totalSize = `${(totalBytes / 1024 / 1024).toFixed(2)} MB`;
        
        return {
            totalSize,
            count: entries.length,
            averageCompression: Math.round(averageCompression),
            oldestImage: oldest,
            newestImage: newest,
        };
    }

    /**
     * Clear all cached images
     */
    async clearCache(): Promise<void> {
        for (const entry of this.cache.values()) {
            try { 
                URL.revokeObjectURL(entry.url); 
            } catch (error) {
                appLogger.warn('[OptimizedImageStorage] Failed to revoke ObjectURL', { data: [error] });
            }
        }
        this.cache.clear();
        appLogger.info('[OptimizedImageStorage] Cache cleared');
    }

    // =========================================================================
    // PRIVATE HELPER METHODS
    // =========================================================================

    /**
     * Load image from file
     */
    private loadImage(file: File): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = URL.createObjectURL(file);
        });
    }

    /**
     * Calculate new dimensions maintaining aspect ratio
     */
    private calculateDimensions(
        originalWidth: number,
        originalHeight: number,
        maxWidth: number,
        maxHeight: number
    ): { width: number; height: number } {
        let width = originalWidth;
        let height = originalHeight;

        if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
        }

        if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
        }

        return { width: Math.round(width), height: Math.round(height) };
    }

    /**
     * Manage cache size by removing oldest entries if over limit
     */
    private async manageCacheSize(): Promise<void> {
        const entries = Array.from(this.cache.entries());
        const totalSize = entries.reduce((sum, [, entry]) => sum + entry.size, 0);
        
        if (totalSize > this.MAX_CACHE_SIZE) {
            // Sort by creation date and remove oldest
            entries.sort((a, b) => a[1].createdAt - b[1].createdAt);
            
            let removedSize = 0;
            const toRemove = Math.ceil(entries.length * 0.2); // Remove oldest 20%
            
            for (let i = 0; i < toRemove && i < entries.length; i++) {
                const [key, entry] = entries[i];
                try {
                    URL.revokeObjectURL(entry.url);
                } catch (error) {
                    appLogger.warn('[OptimizedImageStorage] Failed to revoke ObjectURL', { data: [error] });
                }
                this.cache.delete(key);
                removedSize += entry.size;
            }
            
            appLogger.info('[OptimizedImageStorage] Cache cleanup performed', {
                data: [{ removed: toRemove, freedSize: `${(removedSize / 1024 / 1024).toFixed(2)} MB` }]
            });
        }
    }
}

export const optimizedImageStorage = new OptimizedImageStorage();

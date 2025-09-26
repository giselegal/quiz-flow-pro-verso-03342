/**
 * 🪝 HOOK CUSTOMIZADO - Imagens Otimizadas (Versão Corrigida)
 * 
 * Hook para facilitar o uso do sistema de imagens otimizadas
 */

import { useState, useEffect, useCallback } from 'react';
import { optimizedImageStorage } from '../services/OptimizedImageStorage';

export interface UseOptimizedImageOptions {
    quality?: number;
    format?: 'webp' | 'png' | 'jpeg';
    maxWidth?: number;
    maxHeight?: number;
    enableCache?: boolean;
}

export interface UseOptimizedImageResult {
    optimizedSrc: string | null;
    isLoading: boolean;
    error: string | null;
    compressionRatio: number;
    fileSize: string;
    reload: () => void;
}

/**
 * Hook para otimizar e cachear imagens automaticamente
 */
export const useOptimizedImage = (
    originalSrc: string,
    options: UseOptimizedImageOptions = {}
): UseOptimizedImageResult => {
    const {
        quality = 0.8,
        format = 'webp',
        maxWidth,
        maxHeight,
        enableCache = true
    } = options;

    const [optimizedSrc, setOptimizedSrc] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [compressionRatio, setCompressionRatio] = useState(0);
    const [fileSize, setFileSize] = useState('');

    const optimizeImage = useCallback(async () => {
        if (!originalSrc) return;

        setIsLoading(true);
        setError(null);

        try {
            const optimizedUrl = await optimizedImageStorage.getCachedImage(
                originalSrc,
                async () => {
                    // Fallback para baixar a imagem
                    const response = await fetch(originalSrc);
                    if (!response.ok) throw new Error('Falha ao baixar imagem');
                    return await response.blob();
                },
                {
                    quality,
                    format,
                    maxWidth,
                    maxHeight
                }
            );

            setOptimizedSrc(optimizedUrl);
            // Como getCachedImage retorna apenas a URL, não temos acesso aos stats
            setCompressionRatio(0);
            setFileSize('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao otimizar imagem');
            // Fallback para imagem original
            setOptimizedSrc(originalSrc);
        } finally {
            setIsLoading(false);
        }
    }, [originalSrc, quality, format, maxWidth, maxHeight]);

    useEffect(() => {
        optimizeImage();
    }, [optimizeImage]);

    return {
        optimizedSrc,
        isLoading,
        error,
        compressionRatio,
        fileSize,
        reload: optimizeImage
    };
};

/**
 * Hook para gerenciar múltiplas imagens otimizadas
 */
export const useOptimizedImages = (
    images: Array<{ id: string; src: string; options?: UseOptimizedImageOptions }>
) => {
    const [results, setResults] = useState<Record<string, UseOptimizedImageResult>>({});
    const [globalLoading, setGlobalLoading] = useState(false);

    useEffect(() => {
        const optimizeImages = async () => {
            setGlobalLoading(true);
            const newResults: Record<string, UseOptimizedImageResult> = {};

            for (const image of images) {
                try {
                    const optimizedUrl = await optimizedImageStorage.getCachedImage(
                        image.src,
                        async () => {
                            const response = await fetch(image.src);
                            if (!response.ok) throw new Error('Falha ao baixar imagem');
                            return await response.blob();
                        },
                        image.options || {}
                    );
                    newResults[image.id] = {
                        optimizedSrc: optimizedUrl,
                        isLoading: false,
                        error: null,
                        compressionRatio: 0,
                        fileSize: '',
                        reload: () => { } // Implementar se necessário
                    };
                } catch (err) {
                    newResults[image.id] = {
                        optimizedSrc: image.src,
                        isLoading: false,
                        error: err instanceof Error ? err.message : 'Erro ao otimizar',
                        compressionRatio: 0,
                        fileSize: '',
                        reload: () => { }
                    };
                }
            }

            setResults(newResults);
            setGlobalLoading(false);
        };

        if (images.length > 0) {
            optimizeImages();
        }
    }, [images]);

    return {
        results,
        isLoading: globalLoading,
        totalImages: images.length,
        optimizedImages: Object.keys(results).length
    };
};

/**
 * Hook para estatísticas do cache de imagens
 */
export const useImageCacheStats = () => {
    const [stats, setStats] = useState<{
        totalSize: string;
        count: number;
        averageCompression: number;
        oldestEntry: Date | null;
        newestEntry: Date | null;
    } | null>(null);

    const [isLoading, setIsLoading] = useState(false);

    const loadStats = useCallback(async () => {
        setIsLoading(true);
        try {
            const cacheStats = await optimizedImageStorage.getStats();
            setStats({
                totalSize: cacheStats.totalSize,
                count: cacheStats.count,
                averageCompression: cacheStats.averageCompression,
                oldestEntry: cacheStats.oldestImage ? new Date(cacheStats.oldestImage) : null,
                newestEntry: cacheStats.newestImage ? new Date(cacheStats.newestImage) : null
            });
        } catch (err) {
            console.error('❌ Erro ao carregar estatísticas:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const clearCache = useCallback(async () => {
        try {
            await optimizedImageStorage.clearCache();
            await loadStats(); // Recarregar estatísticas
            return true;
        } catch (err) {
            console.error('❌ Erro ao limpar cache:', err);
            return false;
        }
    }, [loadStats]);

    useEffect(() => {
        loadStats();
    }, [loadStats]);

    return {
        stats,
        isLoading,
        loadStats,
        clearCache
    };
};

/**
 * Hook para precarregar imagens em lote
 */
export const useImagePreloader = () => {
    const [loadingImages, setLoadingImages] = useState<Set<string>>(new Set());

    const preloadImage = useCallback(async (
        src: string,
        options: UseOptimizedImageOptions = {}
    ) => {
        if (loadingImages.has(src)) return;

        setLoadingImages(prev => new Set(prev).add(src));

        try {
            await optimizedImageStorage.getCachedImage(
                src,
                async () => {
                    const response = await fetch(src);
                    if (!response.ok) throw new Error('Falha ao baixar imagem');
                    return await response.blob();
                },
                {
                    quality: 0.7, // Qualidade mais baixa para preload
                    format: 'webp',
                    ...options
                }
            );
        } catch (err) {
            console.warn('⚠️ Erro no preload da imagem:', src, err);
        } finally {
            setLoadingImages(prev => {
                const newSet = new Set(prev);
                newSet.delete(src);
                return newSet;
            });
        }
    }, [loadingImages]);

    const preloadImages = useCallback(async (
        images: Array<{ src: string; options?: UseOptimizedImageOptions }>
    ) => {
        const promises = images.map(img => preloadImage(img.src, img.options));
        await Promise.allSettled(promises);
    }, [preloadImage]);

    return {
        preloadImage,
        preloadImages,
        isPreloading: loadingImages.size > 0,
        preloadingCount: loadingImages.size
    };
};

/**
 * Hook para conversão de formato de imagem
 */
export const useImageFormatConverter = () => {
    const [isConverting, setIsConverting] = useState(false);

    const convertImage = useCallback(async (
        src: string,
        targetFormat: 'webp' | 'png' | 'jpeg',
        quality: number = 0.8
    ): Promise<string> => {
        setIsConverting(true);
        try {
            const result = await optimizedImageStorage.getCachedImage(
                src,
                async () => {
                    const response = await fetch(src);
                    if (!response.ok) throw new Error('Falha ao baixar imagem');
                    return await response.blob();
                },
                {
                    format: targetFormat,
                    quality
                }
            );
            return result;
        } finally {
            setIsConverting(false);
        }
    }, []);

    const convertToWebP = useCallback((src: string, quality?: number) =>
        convertImage(src, 'webp', quality), [convertImage]);

    const convertToPNG = useCallback((src: string, quality?: number) =>
        convertImage(src, 'png', quality), [convertImage]);

    const convertToJPEG = useCallback((src: string, quality?: number) =>
        convertImage(src, 'jpeg', quality), [convertImage]);

    return {
        convertImage,
        convertToWebP,
        convertToPNG,
        convertToJPEG,
        isConverting
    };
};

/**
 * Hook para monitoramento de performance de imagens
 */
export const useImagePerformanceMonitor = () => {
    const [metrics, setMetrics] = useState<{
        loadTime: number;
        transferSize: number;
        compressionRatio: number;
        cacheHit: boolean;
    } | null>(null);

    const measureImageLoad = useCallback(async (
        src: string,
        options: UseOptimizedImageOptions = {}
    ) => {
        const startTime = performance.now();

        try {
            const result = await optimizedImageStorage.getCachedImage(
                src,
                async () => {
                    const response = await fetch(src);
                    if (!response.ok) throw new Error('Falha ao baixar imagem');
                    return await response.blob();
                },
                options
            );
            const endTime = performance.now();

            setMetrics({
                loadTime: endTime - startTime,
                transferSize: 0, // Não temos acesso ao tamanho com getCachedImage
                compressionRatio: 0, // Não temos acesso à compressão com getCachedImage
                cacheHit: false // Não temos informação de cache hit
            });

            return result;
        } catch (err) {
            console.error('❌ Erro na medição de performance:', err);
            throw err;
        }
    }, []);

    return {
        metrics,
        measureImageLoad
    };
};

// Exportar todos os hooks
export default {
    useOptimizedImage,
    useOptimizedImages,
    useImageCacheStats,
    useImagePreloader,
    useImageFormatConverter,
    useImagePerformanceMonitor
};
/**
 * 🖼️ IMAGE STORAGE SERVICE - IndexedDB Otimizado
 * 
 * Sistema completo para armazenar e otimizar imagens no IndexedDB
 * com cache inteligente, compressão e diferentes formatos
 */

// ============================================================================
// TIPOS E INTERFACES
// ============================================================================

interface ImageData {
    id: string;
    originalUrl: string;
    blob: Blob;
    mimeType: string;
    size: number;
    width: number;
    height: number;
    optimized: boolean;
    quality: number;
    timestamp: number;
    metadata: {
        originalSize: number;
        compressionRatio: number;
        format: 'webp' | 'png' | 'jpeg';
    };
}

interface ImageOptions {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number; // 0.1 to 1.0
    format?: 'webp' | 'png' | 'jpeg';
    enableProgressive?: boolean;
}

interface ImageCacheConfig {
    dbName: string;
    storeName: string;
    version: number;
    maxSize: number; // em MB
    maxAge: number; // em milissegundos
}

// ============================================================================
// CONFIGURAÇÃO DO INDEXEDDB
// ============================================================================

const DEFAULT_CONFIG: ImageCacheConfig = {
    dbName: 'QuizQuestImageCache',
    storeName: 'optimizedImages',
    version: 1,
    maxSize: 50, // 50MB
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
};

// ============================================================================
// SERVIÇO PRINCIPAL
// ============================================================================

class OptimizedImageStorage {
    private db: IDBDatabase | null = null;
    private config: ImageCacheConfig;

    constructor(config: Partial<ImageCacheConfig> = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config };
    }

    // ========================================================================
    // INICIALIZAÇÃO DO BANCO
    // ========================================================================

    async initialize(): Promise<void> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.config.dbName, this.config.version);

            request.onerror = () => {
                console.error('❌ Erro ao abrir IndexedDB:', request.error);
                reject(request.error);
            };

            request.onsuccess = () => {
                this.db = request.result;
                console.log('✅ IndexedDB inicializado com sucesso');
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;

                if (!db.objectStoreNames.contains(this.config.storeName)) {
                    const store = db.createObjectStore(this.config.storeName, { keyPath: 'id' });
                    store.createIndex('timestamp', 'timestamp', { unique: false });
                    store.createIndex('originalUrl', 'originalUrl', { unique: false });
                    console.log('📦 Object store criado:', this.config.storeName);
                }
            };
        });
    }

    // ========================================================================
    // OTIMIZAÇÃO DE IMAGENS
    // ========================================================================

    async optimizeImage(
        file: File | Blob,
        options: ImageOptions = {}
    ): Promise<{ blob: Blob; metadata: ImageData['metadata'] }> {
        const {
            maxWidth = 800,
            maxHeight = 600,
            quality = 0.8,
            format = 'webp'
        } = options;

        return new Promise((resolve, reject) => {
            const img = new Image();
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                reject(new Error('Canvas context não disponível'));
                return;
            }

            img.onload = () => {
                // Calcular dimensões otimizadas
                const { width: newWidth, height: newHeight } = this.calculateOptimalSize(
                    img.width,
                    img.height,
                    maxWidth,
                    maxHeight
                );

                // Configurar canvas
                canvas.width = newWidth;
                canvas.height = newHeight;

                // Aplicar otimizações de qualidade
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';

                // Desenhar imagem otimizada
                ctx.drawImage(img, 0, 0, newWidth, newHeight);

                // Converter para blob otimizado
                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            reject(new Error('Falha ao otimizar imagem'));
                            return;
                        }

                        const originalSize = file.size;
                        const optimizedSize = blob.size;
                        const compressionRatio = ((originalSize - optimizedSize) / originalSize) * 100;

                        resolve({
                            blob,
                            metadata: {
                                originalSize,
                                compressionRatio: Math.round(compressionRatio * 100) / 100,
                                format: format as 'webp' | 'png' | 'jpeg'
                            }
                        });
                    },
                    this.getMimeType(format),
                    quality
                );
            };

            img.onerror = () => reject(new Error('Erro ao carregar imagem'));

            // Carregar imagem
            if (file instanceof File) {
                img.src = URL.createObjectURL(file);
            } else {
                img.src = URL.createObjectURL(file);
            }
        });
    }

    // ========================================================================
    // ARMAZENAMENTO NO INDEXEDDB
    // ========================================================================

    async storeImage(
        url: string,
        file: File | Blob,
        options: ImageOptions = {}
    ): Promise<string> {
        if (!this.db) {
            await this.initialize();
        }

        const id = this.generateImageId(url);

        // Verificar se já existe
        const existing = await this.getImage(id);
        if (existing) {
            console.log('🔄 Imagem já existe no cache:', id);
            return existing;
        }

        try {
            // Otimizar imagem
            const { blob, metadata } = await this.optimizeImage(file, options);

            // Obter dimensões da imagem
            const dimensions = await this.getImageDimensions(blob);

            // Criar objeto de dados
            const imageData: ImageData = {
                id,
                originalUrl: url,
                blob,
                mimeType: blob.type,
                size: blob.size,
                width: dimensions.width,
                height: dimensions.height,
                optimized: true,
                quality: options.quality || 0.8,
                timestamp: Date.now(),
                metadata
            };

            // Verificar limite de espaço
            await this.enforceStorageLimit();

            // Salvar no IndexedDB
            await this.saveToDB(imageData);

            console.log('✅ Imagem otimizada e salva:', {
                id,
                originalSize: metadata.originalSize,
                optimizedSize: blob.size,
                compressionRatio: metadata.compressionRatio,
                format: metadata.format
            });

            return URL.createObjectURL(blob);

        } catch (error) {
            console.error('❌ Erro ao armazenar imagem:', error);
            throw error;
        }
    }

    // ========================================================================
    // RECUPERAÇÃO DE IMAGENS
    // ========================================================================

    async getImage(id: string): Promise<string | null> {
        if (!this.db) {
            await this.initialize();
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([this.config.storeName], 'readonly');
            const store = transaction.objectStore(this.config.storeName);
            const request = store.get(id);

            request.onsuccess = () => {
                const result = request.result as ImageData;

                if (!result) {
                    resolve(null);
                    return;
                }

                // Verificar se não expirou
                if (this.isExpired(result.timestamp)) {
                    this.deleteImage(id);
                    resolve(null);
                    return;
                }

                // Criar URL do blob
                const imageUrl = URL.createObjectURL(result.blob);
                resolve(imageUrl);
            };

            request.onerror = () => {
                console.error('❌ Erro ao recuperar imagem:', request.error);
                reject(request.error);
            };
        });
    }

    // ========================================================================
    // CACHE INTELIGENTE
    // ========================================================================

    async getCachedImage(
        url: string,
        fallback?: () => Promise<File | Blob>,
        options: ImageOptions = {}
    ): Promise<string> {
        const id = this.generateImageId(url);

        // Tentar recuperar do cache
        const cached = await this.getImage(id);
        if (cached) {
            console.log('🎯 Imagem carregada do cache:', id);
            return cached;
        }

        // Se não estiver no cache, baixar e otimizar
        console.log('📥 Baixando e otimizando imagem:', url);

        try {
            let imageBlob: File | Blob;

            if (fallback) {
                imageBlob = await fallback();
            } else {
                // Baixar da URL
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                imageBlob = await response.blob();
            }

            // Armazenar e retornar
            return await this.storeImage(url, imageBlob, options);

        } catch (error) {
            console.error('❌ Erro ao baixar imagem:', error);
            throw error;
        }
    }

    // ========================================================================
    // GERENCIAMENTO DE ESPAÇO
    // ========================================================================

    async enforceStorageLimit(): Promise<void> {
        const usage = await this.getStorageUsage();
        const limitBytes = this.config.maxSize * 1024 * 1024; // MB para bytes

        if (usage.totalSize < limitBytes) {
            return;
        }

        console.log('⚠️ Limite de armazenamento atingido, limpando cache...');

        // Obter todas as imagens ordenadas por timestamp (mais antigas primeiro)
        const allImages = await this.getAllImages();
        allImages.sort((a, b) => a.timestamp - b.timestamp);

        let currentSize = usage.totalSize;
        const targetSize = limitBytes * 0.8; // Limpar até 80% do limite

        for (const image of allImages) {
            if (currentSize <= targetSize) break;

            await this.deleteImage(image.id);
            currentSize -= image.size;
            console.log('🗑️ Imagem removida do cache:', image.id);
        }
    }

    async getStorageUsage(): Promise<{ count: number; totalSize: number; }> {
        if (!this.db) await this.initialize();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([this.config.storeName], 'readonly');
            const store = transaction.objectStore(this.config.storeName);
            const request = store.getAll();

            request.onsuccess = () => {
                const images = request.result as ImageData[];
                const totalSize = images.reduce((sum, img) => sum + img.size, 0);

                resolve({
                    count: images.length,
                    totalSize
                });
            };

            request.onerror = () => reject(request.error);
        });
    }

    // ========================================================================
    // MÉTODOS AUXILIARES PRIVADOS
    // ========================================================================

    private calculateOptimalSize(
        originalWidth: number,
        originalHeight: number,
        maxWidth: number,
        maxHeight: number
    ): { width: number; height: number } {
        const aspectRatio = originalWidth / originalHeight;

        let newWidth = originalWidth;
        let newHeight = originalHeight;

        if (newWidth > maxWidth) {
            newWidth = maxWidth;
            newHeight = newWidth / aspectRatio;
        }

        if (newHeight > maxHeight) {
            newHeight = maxHeight;
            newWidth = newHeight * aspectRatio;
        }

        return {
            width: Math.round(newWidth),
            height: Math.round(newHeight)
        };
    }

    private getMimeType(format: string): string {
        const mimeTypes = {
            webp: 'image/webp',
            png: 'image/png',
            jpeg: 'image/jpeg'
        };
        return mimeTypes[format as keyof typeof mimeTypes] || mimeTypes.webp;
    }

    private generateImageId(url: string): string {
        return btoa(url).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
    }

    private isExpired(timestamp: number): boolean {
        return Date.now() - timestamp > this.config.maxAge;
    }

    private async getImageDimensions(blob: Blob): Promise<{ width: number; height: number }> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                resolve({ width: img.width, height: img.height });
            };
            img.onerror = () => reject(new Error('Erro ao obter dimensões'));
            img.src = URL.createObjectURL(blob);
        });
    }

    private async saveToDB(imageData: ImageData): Promise<void> {
        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([this.config.storeName], 'readwrite');
            const store = transaction.objectStore(this.config.storeName);
            const request = store.put(imageData);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    private async getAllImages(): Promise<ImageData[]> {
        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([this.config.storeName], 'readonly');
            const store = transaction.objectStore(this.config.storeName);
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    private async deleteImage(id: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([this.config.storeName], 'readwrite');
            const store = transaction.objectStore(this.config.storeName);
            const request = store.delete(id);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    // ========================================================================
    // MÉTODOS PÚBLICOS UTILITÁRIOS
    // ========================================================================

    async clearCache(): Promise<void> {
        if (!this.db) await this.initialize();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([this.config.storeName], 'readwrite');
            const store = transaction.objectStore(this.config.storeName);
            const request = store.clear();

            request.onsuccess = () => {
                console.log('🧹 Cache de imagens limpo');
                resolve();
            };
            request.onerror = () => reject(request.error);
        });
    }

    async getStats(): Promise<{
        count: number;
        totalSize: string;
        averageCompression: number;
        oldestImage: number;
        newestImage: number;
    }> {
        const images = await this.getAllImages();

        if (images.length === 0) {
            return {
                count: 0,
                totalSize: '0 MB',
                averageCompression: 0,
                oldestImage: 0,
                newestImage: 0
            };
        }

        const totalSize = images.reduce((sum, img) => sum + img.size, 0);
        const averageCompression = images.reduce((sum, img) => sum + img.metadata.compressionRatio, 0) / images.length;
        const timestamps = images.map(img => img.timestamp);

        return {
            count: images.length,
            totalSize: `${(totalSize / (1024 * 1024)).toFixed(2)} MB`,
            averageCompression: Math.round(averageCompression * 100) / 100,
            oldestImage: Math.min(...timestamps),
            newestImage: Math.max(...timestamps)
        };
    }
}

// ============================================================================
// INSTÂNCIA SINGLETON
// ============================================================================

export const optimizedImageStorage = new OptimizedImageStorage();

// ============================================================================
// HOOK REACT PARA USO FÁCIL
// ============================================================================

import { useState, useEffect } from 'react';

export function useOptimizedImage(
    url: string,
    options: ImageOptions = {}
): {
    imageUrl: string | null;
    loading: boolean;
    error: string | null;
    reload: () => void;
} {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadImage = async () => {
        try {
            setLoading(true);
            setError(null);

            const cachedUrl = await optimizedImageStorage.getCachedImage(url, undefined, options);
            setImageUrl(cachedUrl);

        } catch (err) {
            console.error('❌ Erro ao carregar imagem otimizada:', err);
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
            setImageUrl(url); // Fallback para URL original
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadImage();
    }, [url]);

    return {
        imageUrl,
        loading,
        error,
        reload: loadImage
    };
}

export default OptimizedImageStorage;
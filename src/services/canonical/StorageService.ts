/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║                      STORAGE SERVICE - CANONICAL                         ║
 * ╠══════════════════════════════════════════════════════════════════════════╣
 * ║ Serviço unificado para gerenciamento de armazenamento                   ║
 * ║                                                                          ║
 * ║ CONSOLIDATES (7 services → 1):                                          ║
 * ║  1. SupabaseStorageClient     - Supabase Storage API                    ║
 * ║  2. FileUploadService         - File upload handling                    ║
 * ║  3. ImageStorageService       - Image optimization & storage            ║
 * ║  4. AssetManager              - Asset lifecycle management              ║
 * ║  5. MediaStorageService       - Media file handling                     ║
 * ║  6. StorageProvider           - Storage abstraction layer               ║
 * ║  7. LocalStorageService       - Browser localStorage                    ║
 * ║                                                                          ║
 * ║ FEATURES:                                                                ║
 * ║  • File upload/download/delete (Supabase Storage)                       ║
 * ║  • Image optimization (resize, compress, format conversion)             ║
 * ║  • Browser storage (localStorage, IndexedDB)                            ║
 * ║  • Public/private URLs                                                   ║
 * ║  • Quota management                                                      ║
 * ║  • File metadata tracking                                                ║
 * ║  • Cache control with TTL                                                ║
 * ║  • Batch operations                                                      ║
 * ║                                                                          ║
 * ║ ARCHITECTURE:                                                            ║
 * ║  • BaseCanonicalService lifecycle                                        ║
 * ║  • Result<T> pattern                                                     ║
 * ║  • Singleton pattern                                                     ║
 * ║  • Specialized APIs (files, images, browser)                            ║
 * ║  • Built-in caching                                                      ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 */

import { BaseCanonicalService, ServiceResult } from './types';
import { supabase } from '@/integrations/supabase/customClient';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

/**
 * File upload parameters
 */
export interface UploadFileParams {
  file: File | Blob;
  path: string;
  bucket?: string;
  cacheControl?: string;
  contentType?: string;
  upsert?: boolean;
  onProgress?: (progress: UploadProgress) => void;
}

/**
 * Upload progress tracking
 */
export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

/**
 * Upload result
 */
export interface UploadResult {
  path: string;
  publicUrl: string;
  size: number;
  mimeType: string;
  uploadedAt: Date;
}

/**
 * Download file parameters
 */
export interface DownloadFileParams {
  path: string;
  bucket?: string;
}

/**
 * Delete file parameters
 */
export interface DeleteFileParams {
  path: string;
  bucket?: string;
}

/**
 * List files parameters
 */
export interface ListFilesParams {
  path?: string;
  bucket?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'name' | 'created_at' | 'updated_at';
  order?: 'asc' | 'desc';
}

/**
 * File metadata
 */
export interface FileMetadata {
  name: string;
  path: string;
  size: number;
  mimeType: string;
  createdAt: Date;
  updatedAt: Date;
  publicUrl?: string;
}

/**
 * Image optimization options
 */
export interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0-1
  format?: 'webp' | 'jpeg' | 'png';
  maintainAspectRatio?: boolean;
}

/**
 * Optimized image result
 */
export interface OptimizedImage {
  blob: Blob;
  width: number;
  height: number;
  size: number;
  format: string;
  compressionRatio: number;
}

/**
 * Browser storage types
 */
export type BrowserStorageType = 'localStorage' | 'sessionStorage' | 'indexedDB';

/**
 * Browser storage item
 */
export interface BrowserStorageItem<T = any> {
  key: string;
  value: T;
  expiresAt?: number;
  createdAt: number;
}

/**
 * Storage quota information
 */
export interface StorageQuota {
  usage: number;
  quota: number;
  available: number;
  percentage: number;
}

/**
 * Storage service options
 */
export interface StorageServiceOptions {
  defaultBucket?: string;
  defaultCacheControl?: string;
  enableImageOptimization?: boolean;
  defaultImageQuality?: number;
  maxUploadSize?: number; // bytes
  allowedMimeTypes?: string[];
  browserStoragePrefix?: string;
  indexedDBName?: string;
  indexedDBVersion?: number;
}

// ============================================================================
// STORAGE SERVICE
// ============================================================================

/**
 * Unified storage service for file management and browser storage
 */
export class StorageService extends BaseCanonicalService {
  private static instance: StorageService | null = null;
  
  private readonly defaultBucket: string;
  private readonly defaultCacheControl: string;
  private readonly enableImageOptimization: boolean;
  private readonly defaultImageQuality: number;
  private readonly maxUploadSize: number;
  private readonly allowedMimeTypes: string[];
  private readonly browserStoragePrefix: string;
  private readonly indexedDBName: string;
  private readonly indexedDBVersion: number;
  
  // Cache for public URLs (path -> url)
  private urlCache: Map<string, { url: string; expiresAt: number }> = new Map();
  private readonly URL_CACHE_TTL = 3600000; // 1 hour
  
  // IndexedDB instance
  private indexedDB: IDBDatabase | null = null;

  private constructor(options: StorageServiceOptions = {}) {
    super('StorageService', '1.0.0');
    
    this.defaultBucket = options.defaultBucket || 'uploads';
    this.defaultCacheControl = options.defaultCacheControl || '3600';
    this.enableImageOptimization = options.enableImageOptimization ?? true;
    this.defaultImageQuality = options.defaultImageQuality || 0.85;
    this.maxUploadSize = options.maxUploadSize || 50 * 1024 * 1024; // 50MB
    this.allowedMimeTypes = options.allowedMimeTypes || [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
      'video/mp4', 'video/webm',
      'application/pdf',
      'text/plain',
    ];
    this.browserStoragePrefix = options.browserStoragePrefix || 'qfp_';
    this.indexedDBName = options.indexedDBName || 'QuizFlowProStorage';
    this.indexedDBVersion = options.indexedDBVersion || 1;
  }

  static getInstance(options?: StorageServiceOptions): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService(options);
    }
    return StorageService.instance;
  }

  protected async onInitialize(): Promise<void> {
    this.log('Initializing StorageService...');
    
    // Initialize IndexedDB
    if (typeof window !== 'undefined' && window.indexedDB) {
      await this.initializeIndexedDB();
    }
    
    this.log('StorageService initialized successfully');
  }

  protected async onDispose(): Promise<void> {
    this.log('Disposing StorageService...');
    
    // Clear caches
    this.urlCache.clear();
    
    // Close IndexedDB
    if (this.indexedDB) {
      this.indexedDB.close();
      this.indexedDB = null;
    }
    
    this.log('StorageService disposed');
  }

  async healthCheck(): Promise<boolean> {
    try {
      // Check Supabase Storage availability
      const { data, error } = await supabase.storage.listBuckets();
      
      if (error) {
        this.error('Storage health check failed:', error.message);
        return false;
      }

      // Check browser storage availability
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('__test__', 'test');
          localStorage.removeItem('__test__');
        } catch (e) {
          this.error('Browser storage not available');
          return false;
        }
      }

      return true;
    } catch (error) {
      this.error('Health check error:', error);
      return false;
    }
  }

  // ============================================================================
  // FILE OPERATIONS (Supabase Storage)
  // ============================================================================

  /**
   * Upload a file to Supabase Storage
   */
  async uploadFile(params: UploadFileParams): Promise<ServiceResult<UploadResult>> {
    try {
      const bucket = params.bucket || this.defaultBucket;
      
      // Validate file size
      const fileSize = params.file instanceof File ? params.file.size : params.file.size;
      if (fileSize > this.maxUploadSize) {
        return {
          success: false,
          error: new Error(`File size exceeds maximum allowed (${this.maxUploadSize} bytes)`),
        };
      }

      // Validate mime type
      const mimeType = params.contentType || (params.file instanceof File ? params.file.type : 'application/octet-stream');
      if (this.allowedMimeTypes.length > 0 && !this.allowedMimeTypes.includes(mimeType)) {
        return {
          success: false,
          error: new Error(`File type not allowed: ${mimeType}`),
        };
      }

      // Upload to Supabase
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(params.path, params.file, {
          cacheControl: params.cacheControl || this.defaultCacheControl,
          contentType: params.contentType,
          upsert: params.upsert ?? false,
        });

      if (error) {
        return {
          success: false,
          error: new Error(`Upload failed: ${error.message}`),
        };
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      // Cache the URL
      this.cachePublicUrl(data.path, publicUrl);

      const result: UploadResult = {
        path: data.path,
        publicUrl,
        size: fileSize,
        mimeType,
        uploadedAt: new Date(),
      };

      this.log('File uploaded successfully:', result.path);
      return { success: true, data: result };

    } catch (error) {
      this.error('Upload file error:', error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Upload failed'),
      };
    }
  }

  /**
   * Download a file from Supabase Storage
   */
  async downloadFile(params: DownloadFileParams): Promise<ServiceResult<Blob>> {
    try {
      const bucket = params.bucket || this.defaultBucket;

      const { data, error } = await supabase.storage
        .from(bucket)
        .download(params.path);

      if (error) {
        return {
          success: false,
          error: new Error(`Download failed: ${error.message}`),
        };
      }

      this.log('File downloaded successfully:', params.path);
      return { success: true, data };

    } catch (error) {
      this.error('Download file error:', error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Download failed'),
      };
    }
  }

  /**
   * Delete a file from Supabase Storage
   */
  async deleteFile(params: DeleteFileParams): Promise<ServiceResult<void>> {
    try {
      const bucket = params.bucket || this.defaultBucket;

      const { error } = await supabase.storage
        .from(bucket)
        .remove([params.path]);

      if (error) {
        return {
          success: false,
          error: new Error(`Delete failed: ${error.message}`),
        };
      }

      // Remove from URL cache
      this.urlCache.delete(params.path);

      this.log('File deleted successfully:', params.path);
      return { success: true, data: undefined };

    } catch (error) {
      this.error('Delete file error:', error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Delete failed'),
      };
    }
  }

  /**
   * List files in a path
   */
  async listFiles(params: ListFilesParams = {}): Promise<ServiceResult<FileMetadata[]>> {
    try {
      const bucket = params.bucket || this.defaultBucket;
      const path = params.path || '';

      const { data, error } = await supabase.storage
        .from(bucket)
        .list(path, {
          limit: params.limit,
          offset: params.offset,
          sortBy: { column: params.sortBy || 'name', order: params.order || 'asc' },
        });

      if (error) {
        return {
          success: false,
          error: new Error(`List files failed: ${error.message}`),
        };
      }

      const files: FileMetadata[] = data.map((file: any) => ({
        name: file.name,
        path: path ? `${path}/${file.name}` : file.name,
        size: file.metadata?.size || 0,
        mimeType: file.metadata?.mimetype || 'application/octet-stream',
        createdAt: new Date(file.created_at),
        updatedAt: new Date(file.updated_at),
        publicUrl: this.getCachedPublicUrl(file.name) || undefined,
      }));

      return { success: true, data: files };

    } catch (error) {
      this.error('List files error:', error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error('List files failed'),
      };
    }
  }

  /**
   * Get public URL for a file
   */
  getPublicUrl(path: string, bucket?: string): ServiceResult<string> {
    try {
      // Check cache first
      const cached = this.getCachedPublicUrl(path);
      if (cached) {
        return { success: true, data: cached };
      }

      const bucketName = bucket || this.defaultBucket;
      
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(path);

      // Cache the URL
      this.cachePublicUrl(path, publicUrl);

      return { success: true, data: publicUrl };

    } catch (error) {
      this.error('Get public URL error:', error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Get public URL failed'),
      };
    }
  }

  /**
   * Delete multiple files
   */
  async deleteFiles(paths: string[], bucket?: string): Promise<ServiceResult<void>> {
    try {
      const bucketName = bucket || this.defaultBucket;

      const { error } = await supabase.storage
        .from(bucketName)
        .remove(paths);

      if (error) {
        return {
          success: false,
          error: new Error(`Delete files failed: ${error.message}`),
        };
      }

      // Remove from cache
      paths.forEach(path => this.urlCache.delete(path));

      this.log(`Deleted ${paths.length} files successfully`);
      return { success: true, data: undefined };

    } catch (error) {
      this.error('Delete files error:', error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Delete files failed'),
      };
    }
  }

  // ============================================================================
  // IMAGE OPTIMIZATION
  // ============================================================================

  /**
   * Optimize an image (resize, compress, convert format)
   */
  async optimizeImage(
    file: File | Blob,
    options: ImageOptimizationOptions = {},
  ): Promise<ServiceResult<OptimizedImage>> {
    try {
      if (!this.enableImageOptimization) {
        return {
          success: false,
          error: new Error('Image optimization is disabled'),
        };
      }

      // Load image
      const img = await this.loadImage(file);
      
      // Calculate new dimensions
      let { width, height } = img;
      const maxWidth = options.maxWidth || width;
      const maxHeight = options.maxHeight || height;

      if (options.maintainAspectRatio !== false) {
        const ratio = Math.min(maxWidth / width, maxHeight / height, 1);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      } else {
        width = Math.min(width, maxWidth);
        height = Math.min(height, maxHeight);
      }

      // Create canvas
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        return {
          success: false,
          error: new Error('Failed to get canvas context'),
        };
      }

      // Draw resized image
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to blob
      const quality = options.quality ?? this.defaultImageQuality;
      const format = options.format || 'webp';
      const mimeType = `image/${format}`;

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (result) => {
            if (result) resolve(result);
            else reject(new Error('Failed to create blob'));
          },
          mimeType,
          quality,
        );
      });

      const originalSize = file.size;
      const optimizedSize = blob.size;
      const compressionRatio = originalSize > 0 ? optimizedSize / originalSize : 1;

      const result: OptimizedImage = {
        blob,
        width,
        height,
        size: optimizedSize,
        format,
        compressionRatio,
      };

      this.log('Image optimized:', {
        originalSize: `${(originalSize / 1024).toFixed(2)} KB`,
        optimizedSize: `${(optimizedSize / 1024).toFixed(2)} KB`,
        compressionRatio: `${(compressionRatio * 100).toFixed(1)}%`,
      });

      return { success: true, data: result };

    } catch (error) {
      this.error('Optimize image error:', error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Image optimization failed'),
      };
    }
  }

  /**
   * Upload an optimized image
   */
  async uploadOptimizedImage(
    file: File,
    path: string,
    options: ImageOptimizationOptions & { bucket?: string } = {},
  ): Promise<ServiceResult<UploadResult>> {
    try {
      // Optimize the image
      const optimizeResult = await this.optimizeImage(file, options);
      
      if (!optimizeResult.success) {
        return optimizeResult;
      }

      // Upload the optimized image
      const uploadResult = await this.uploadFile({
        file: optimizeResult.data.blob,
        path,
        bucket: options.bucket,
        contentType: `image/${optimizeResult.data.format}`,
      });

      return uploadResult;

    } catch (error) {
      this.error('Upload optimized image error:', error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Upload optimized image failed'),
      };
    }
  }

  // ============================================================================
  // BROWSER STORAGE (localStorage, sessionStorage, IndexedDB)
  // ============================================================================

  /**
   * Set item in browser storage
   */
  setItem<T>(key: string, value: T, expiresIn?: number): ServiceResult<void> {
    try {
      if (typeof window === 'undefined') {
        return {
          success: false,
          error: new Error('Browser storage not available'),
        };
      }

      const item: BrowserStorageItem<T> = {
        key,
        value,
        createdAt: Date.now(),
        expiresAt: expiresIn ? Date.now() + expiresIn : undefined,
      };

      const prefixedKey = this.browserStoragePrefix + key;
      localStorage.setItem(prefixedKey, JSON.stringify(item));

      return { success: true, data: undefined };

    } catch (error) {
      this.error('Set item error:', error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Set item failed'),
      };
    }
  }

  /**
   * Get item from browser storage
   */
  getItem<T>(key: string): ServiceResult<T | null> {
    try {
      if (typeof window === 'undefined') {
        return { success: true, data: null };
      }

      const prefixedKey = this.browserStoragePrefix + key;
      const stored = localStorage.getItem(prefixedKey);

      if (!stored) {
        return { success: true, data: null };
      }

      const item: BrowserStorageItem<T> = JSON.parse(stored);

      // Check expiration
      if (item.expiresAt && item.expiresAt < Date.now()) {
        localStorage.removeItem(prefixedKey);
        return { success: true, data: null };
      }

      return { success: true, data: item.value };

    } catch (error) {
      this.error('Get item error:', error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Get item failed'),
      };
    }
  }

  /**
   * Remove item from browser storage
   */
  removeItem(key: string): ServiceResult<void> {
    try {
      if (typeof window === 'undefined') {
        return { success: true, data: undefined };
      }

      const prefixedKey = this.browserStoragePrefix + key;
      localStorage.removeItem(prefixedKey);

      return { success: true, data: undefined };

    } catch (error) {
      this.error('Remove item error:', error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Remove item failed'),
      };
    }
  }

  /**
   * Clear all items with prefix
   */
  clearAll(): ServiceResult<void> {
    try {
      if (typeof window === 'undefined') {
        return { success: true, data: undefined };
      }

      const keysToRemove: string[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.browserStoragePrefix)) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach(key => localStorage.removeItem(key));

      this.log(`Cleared ${keysToRemove.length} items from browser storage`);
      return { success: true, data: undefined };

    } catch (error) {
      this.error('Clear all error:', error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Clear all failed'),
      };
    }
  }

  /**
   * Get storage quota information
   */
  async getQuota(): Promise<ServiceResult<StorageQuota>> {
    try {
      if (typeof navigator === 'undefined' || !navigator.storage || !navigator.storage.estimate) {
        return {
          success: false,
          error: new Error('Storage quota API not available'),
        };
      }

      const estimate = await navigator.storage.estimate();
      const usage = estimate.usage || 0;
      const quota = estimate.quota || 0;
      const available = quota - usage;
      const percentage = quota > 0 ? (usage / quota) * 100 : 0;

      const result: StorageQuota = {
        usage,
        quota,
        available,
        percentage,
      };

      return { success: true, data: result };

    } catch (error) {
      this.error('Get quota error:', error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Get quota failed'),
      };
    }
  }

  // ============================================================================
  // SPECIALIZED APIs
  // ============================================================================

  /**
   * Files API - Supabase Storage operations
   */
  readonly files = {
    upload: this.uploadFile.bind(this),
    download: this.downloadFile.bind(this),
    delete: this.deleteFile.bind(this),
    deleteMany: this.deleteFiles.bind(this),
    list: this.listFiles.bind(this),
    getPublicUrl: this.getPublicUrl.bind(this),
  };

  /**
   * Images API - Image optimization and upload
   */
  readonly images = {
    optimize: this.optimizeImage.bind(this),
    upload: this.uploadOptimizedImage.bind(this),
  };

  /**
   * Browser API - Browser storage operations
   */
  readonly browser = {
    set: this.setItem.bind(this),
    get: this.getItem.bind(this),
    remove: this.removeItem.bind(this),
    clear: this.clearAll.bind(this),
    getQuota: this.getQuota.bind(this),
  };

  // ============================================================================
  // PRIVATE HELPERS
  // ============================================================================

  private cachePublicUrl(path: string, url: string): void {
    this.urlCache.set(path, {
      url,
      expiresAt: Date.now() + this.URL_CACHE_TTL,
    });
  }

  private getCachedPublicUrl(path: string): string | null {
    const cached = this.urlCache.get(path);
    
    if (!cached) {
      return null;
    }

    if (cached.expiresAt < Date.now()) {
      this.urlCache.delete(path);
      return null;
    }

    return cached.url;
  }

  private loadImage(file: File | Blob): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load image'));
      };

      img.src = url;
    });
  }

  private async initializeIndexedDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.indexedDBName, this.indexedDBVersion);

      request.onerror = () => {
        this.error('IndexedDB initialization error:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.indexedDB = request.result;
        this.log('IndexedDB initialized successfully');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains('storage')) {
          const store = db.createObjectStore('storage', { keyPath: 'key' });
          store.createIndex('expiresAt', 'expiresAt', { unique: false });
          store.createIndex('createdAt', 'createdAt', { unique: false });
          this.log('IndexedDB object store created');
        }
      };
    });
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default StorageService;

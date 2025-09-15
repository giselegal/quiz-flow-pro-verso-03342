/**
 * Sistema de cache de imagens usando IndexedDB
 * Armazena placeholders e imagens localmente para performance e offline
 */

interface CachedImage {
  id: string;
  blob: Blob;
  timestamp: number;
  url: string;
  metadata?: {
    width?: number;
    height?: number;
    type?: string;
    originalUrl?: string;
  };
}

class ImageCacheManager {
  private dbName = 'QuizQuestImageCache';
  private dbVersion = 1;
  private storeName = 'images';
  private db: IDBDatabase | null = null;
  private initPromise: Promise<void> | null = null;
  
  // Cache em memória para URLs já processadas
  private urlCache = new Map<string, string>();
  
  // TTL padrão: 7 dias
  private defaultTTL = 7 * 24 * 60 * 60 * 1000;

  constructor() {
    this.initPromise = this.initDB();
  }

  private async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
          store.createIndex('timestamp', 'timestamp', { unique: false });
          store.createIndex('url', 'url', { unique: false });
        }
      };
    });
  }

  private async ensureDB(): Promise<IDBDatabase> {
    if (!this.db) {
      await this.initPromise;
    }
    
    if (!this.db) {
      throw new Error('Falha ao inicializar IndexedDB');
    }
    
    return this.db;
  }

  private generateImageId(url: string, width?: number, height?: number): string {
    const params = width && height ? `_${width}x${height}` : '';
    return `img_${btoa(url).replace(/[^a-zA-Z0-9]/g, '')}${params}`;
  }

  /**
   * Gera um placeholder SVG
   */
  private generatePlaceholderSVG(
    width: number = 300,
    height: number = 200,
    text: string = 'Imagem',
    backgroundColor: string = '#f1f5f9',
    textColor: string = '#64748b'
  ): Blob {
    const svgContent = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${backgroundColor}"/>
        <text 
          x="50%" 
          y="50%" 
          font-family="system-ui, -apple-system, sans-serif" 
          font-size="${Math.min(width, height) / 10}"
          fill="${textColor}" 
          text-anchor="middle" 
          dominant-baseline="middle"
        >${text}</text>
      </svg>
    `;

    return new Blob([svgContent], { type: 'image/svg+xml' });
  }

  /**
   * Armazena uma imagem no cache
   */
  async storeImage(
    url: string, 
    blob: Blob, 
    metadata?: CachedImage['metadata']
  ): Promise<string> {
    try {
      const db = await this.ensureDB();
      const id = this.generateImageId(url, metadata?.width, metadata?.height);
      
      const cachedImage: CachedImage = {
        id,
        blob,
        timestamp: Date.now(),
        url,
        metadata,
      };

      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      
      await new Promise<void>((resolve, reject) => {
        const request = store.put(cachedImage);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      // Criar URL do blob e armazenar em cache de memória
      const blobUrl = URL.createObjectURL(blob);
      this.urlCache.set(id, blobUrl);
      
      return blobUrl;
    } catch (error) {
      console.warn('Erro ao armazenar imagem no cache:', error);
      throw error;
    }
  }

  /**
   * Recupera uma imagem do cache
   */
  async getImage(
    url: string, 
    width?: number, 
    height?: number
  ): Promise<string | null> {
    try {
      const id = this.generateImageId(url, width, height);
      
      // Verificar cache de memória primeiro
      if (this.urlCache.has(id)) {
        return this.urlCache.get(id)!;
      }

      const db = await this.ensureDB();
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);

      const cachedImage = await new Promise<CachedImage | null>((resolve) => {
        const request = store.get(id);
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => resolve(null);
      });

      if (!cachedImage) {
        return null;
      }

      // Verificar TTL
      const now = Date.now();
      if (now - cachedImage.timestamp > this.defaultTTL) {
        // Imagem expirada, remover do cache
        this.removeImage(id);
        return null;
      }

      // Criar URL do blob e armazenar em cache de memória
      const blobUrl = URL.createObjectURL(cachedImage.blob);
      this.urlCache.set(id, blobUrl);
      
      return blobUrl;
    } catch (error) {
      console.warn('Erro ao recuperar imagem do cache:', error);
      return null;
    }
  }

  /**
   * Remove uma imagem do cache
   */
  async removeImage(id: string): Promise<void> {
    try {
      // Limpar cache de memória
      if (this.urlCache.has(id)) {
        URL.revokeObjectURL(this.urlCache.get(id)!);
        this.urlCache.delete(id);
      }

      const db = await this.ensureDB();
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);

      await new Promise<void>((resolve, reject) => {
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.warn('Erro ao remover imagem do cache:', error);
    }
  }

  /**
   * Cria um placeholder e armazena no cache
   */
  async getOrCreatePlaceholder(
    width: number = 300,
    height: number = 200,
    text: string = 'Imagem',
    backgroundColor: string = '#f1f5f9',
    textColor: string = '#64748b'
  ): Promise<string> {
    const placeholderUrl = `placeholder://${width}x${height}/${text}/${backgroundColor}/${textColor}`;
    
    // Tentar recuperar do cache primeiro
    const cached = await this.getImage(placeholderUrl, width, height);
    if (cached) {
      return cached;
    }

    // Criar novo placeholder
    const blob = this.generatePlaceholderSVG(width, height, text, backgroundColor, textColor);
    
    try {
      return await this.storeImage(placeholderUrl, blob, {
        width,
        height,
        type: 'image/svg+xml',
        originalUrl: placeholderUrl,
      });
    } catch (error) {
      // Fallback para data URL se IndexedDB falhar
      console.warn('Fallback para data URL devido a erro no cache:', error);
      return URL.createObjectURL(blob);
    }
  }

  /**
   * Limpa imagens expiradas do cache
   */
  async cleanExpiredImages(): Promise<void> {
    try {
      const db = await this.ensureDB();
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const index = store.index('timestamp');

      const now = Date.now();
      const expiredTime = now - this.defaultTTL;

      const request = index.openCursor(IDBKeyRange.upperBound(expiredTime));
      
      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor) {
          const id = cursor.value.id;
          cursor.delete();
          
          // Limpar cache de memória
          if (this.urlCache.has(id)) {
            URL.revokeObjectURL(this.urlCache.get(id)!);
            this.urlCache.delete(id);
          }
          
          cursor.continue();
        }
      };
    } catch (error) {
      console.warn('Erro ao limpar imagens expiradas:', error);
    }
  }

  /**
   * Obtém estatísticas do cache
   */
  async getCacheStats(): Promise<{
    totalImages: number;
    totalSize: number;
    oldestImage: number;
    newestImage: number;
  }> {
    try {
      const db = await this.ensureDB();
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);

      return new Promise((resolve) => {
        const request = store.getAll();
        request.onsuccess = () => {
          const images = request.result as CachedImage[];
          
          let totalSize = 0;
          let oldestImage = Date.now();
          let newestImage = 0;

          images.forEach(img => {
            totalSize += img.blob.size;
            if (img.timestamp < oldestImage) oldestImage = img.timestamp;
            if (img.timestamp > newestImage) newestImage = img.timestamp;
          });

          resolve({
            totalImages: images.length,
            totalSize,
            oldestImage: images.length > 0 ? oldestImage : 0,
            newestImage: images.length > 0 ? newestImage : 0,
          });
        };
        request.onerror = () => resolve({
          totalImages: 0,
          totalSize: 0,
          oldestImage: 0,
          newestImage: 0,
        });
      });
    } catch (error) {
      return {
        totalImages: 0,
        totalSize: 0,
        oldestImage: 0,
        newestImage: 0,
      };
    }
  }

  /**
   * Limpa todo o cache
   */
  async clearCache(): Promise<void> {
    try {
      // Limpar cache de memória
      for (const [, url] of this.urlCache.entries()) {
        URL.revokeObjectURL(url);
      }
      this.urlCache.clear();

      const db = await this.ensureDB();
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);

      await new Promise<void>((resolve, reject) => {
        const request = store.clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.warn('Erro ao limpar cache:', error);
    }
  }
}

// Instância global do gerenciador de cache
export const imageCache = new ImageCacheManager();

// Placeholders pré-definidos mais comuns
export const PLACEHOLDERS = {
  LOGO_96: () => imageCache.getOrCreatePlaceholder(96, 96, 'Logo', '#e2e8f0', '#64748b'),
  LOGO_128: () => imageCache.getOrCreatePlaceholder(128, 128, 'Logo', '#e2e8f0', '#64748b'),
  IMAGE_300_200: () => imageCache.getOrCreatePlaceholder(300, 200, 'Imagem', '#f1f5f9', '#64748b'),
  IMAGE_400_300: () => imageCache.getOrCreatePlaceholder(400, 300, 'Imagem', '#f1f5f9', '#64748b'),
  QUIZ_ELEGANT: () => imageCache.getOrCreatePlaceholder(300, 200, 'Elegante', '#b89b7a', '#ffffff'),
  QUIZ_CASUAL: () => imageCache.getOrCreatePlaceholder(300, 200, 'Casual', '#432818', '#ffffff'),
  LOADING: () => imageCache.getOrCreatePlaceholder(400, 300, 'Carregando...', '#B89B7A', '#FFFFFF'),
  ERROR: () => imageCache.getOrCreatePlaceholder(400, 300, 'Erro ao carregar', '#EF4444', '#FFFFFF'),
};

// Hook React para usar o cache de imagens
export const useImageCache = () => {
  return {
    getImage: imageCache.getImage.bind(imageCache),
    storeImage: imageCache.storeImage.bind(imageCache),
    getOrCreatePlaceholder: imageCache.getOrCreatePlaceholder.bind(imageCache),
    cleanExpiredImages: imageCache.cleanExpiredImages.bind(imageCache),
    getCacheStats: imageCache.getCacheStats.bind(imageCache),
    clearCache: imageCache.clearCache.bind(imageCache),
    placeholders: PLACEHOLDERS,
  };
};
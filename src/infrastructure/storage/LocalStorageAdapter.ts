/**
 * 🎯 LOCAL STORAGE ADAPTER - Infrastructure Implementation
 * 
 * Adaptador para armazenamento local usando localStorage.
 * Implementa padrões de cache e persistência para dados do editor.
 */

export interface StorageAdapter {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T): boolean;
  remove(key: string): boolean;
  clear(): boolean;
  exists(key: string): boolean;
  keys(): string[];
  size(): number;
}

export interface CacheOptions {
  ttl?: number; // Time to live em segundos
  maxSize?: number; // Tamanho máximo do cache
  compress?: boolean; // Compressão dos dados
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl?: number;
  compressed?: boolean;
}

export class LocalStorageAdapter implements StorageAdapter {
  private readonly prefix: string;
  private readonly defaultOptions: CacheOptions;

  constructor(prefix: string = 'lovable_', defaultOptions: CacheOptions = {}) {
    this.prefix = prefix;
    this.defaultOptions = {
      ttl: 3600, // 1 hora por padrão
      maxSize: 100, // Máximo 100 entradas
      compress: false,
      ...defaultOptions
    };
  }

  // 🔍 Basic Storage Operations
  get<T>(key: string): T | null {
    try {
      const fullKey = this.getFullKey(key);
      const item = localStorage.getItem(fullKey);
      
      if (!item) return null;

      const entry: CacheEntry<T> = JSON.parse(item);
      
      // Verificar se expirou
      if (this.isExpired(entry)) {
        this.remove(key);
        return null;
      }

      // Descomprimir se necessário
      let data = entry.data;
      if (entry.compressed && typeof data === 'string') {
        data = this.decompress(data) as T;
      }

      return data;
    } catch (error) {
      console.error('Error getting from localStorage:', error);
      return null;
    }
  }

  set<T>(key: string, value: T, options?: CacheOptions): boolean {
    try {
      const fullKey = this.getFullKey(key);
      const opts = { ...this.defaultOptions, ...options };
      
      // Verificar limites de tamanho
      if (opts.maxSize && this.size() >= opts.maxSize) {
        this.evictOldest();
      }

      let data: T | string = value;
      let compressed = false;

      // Comprimir se necessário
      if (opts.compress && typeof value === 'object') {
        data = this.compress(JSON.stringify(value));
        compressed = true;
      }

      const entry: CacheEntry<T | string> = {
        data,
        timestamp: Date.now(),
        ttl: opts.ttl,
        compressed
      };

      localStorage.setItem(fullKey, JSON.stringify(entry));
      return true;
    } catch (error) {
      console.error('Error setting to localStorage:', error);
      // Tentar limpar espaço e tentar novamente
      this.clearExpired();
      try {
        const fullKey = this.getFullKey(key);
        const entry: CacheEntry<T> = {
          data: value,
          timestamp: Date.now(),
          ttl: options?.ttl || this.defaultOptions.ttl
        };
        localStorage.setItem(fullKey, JSON.stringify(entry));
        return true;
      } catch {
        return false;
      }
    }
  }

  remove(key: string): boolean {
    try {
      const fullKey = this.getFullKey(key);
      localStorage.removeItem(fullKey);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  }

  clear(): boolean {
    try {
      const keys = this.keys();
      keys.forEach(key => {
        const fullKey = this.getFullKey(key);
        localStorage.removeItem(fullKey);
      });
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }

  exists(key: string): boolean {
    const fullKey = this.getFullKey(key);
    const item = localStorage.getItem(fullKey);
    
    if (!item) return false;

    try {
      const entry: CacheEntry<any> = JSON.parse(item);
      if (this.isExpired(entry)) {
        this.remove(key);
        return false;
      }
      return true;
    } catch {
      // Item corrompido, remover
      this.remove(key);
      return false;
    }
  }

  keys(): string[] {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.prefix)) {
        keys.push(key.substring(this.prefix.length));
      }
    }
    return keys;
  }

  size(): number {
    return this.keys().length;
  }

  // 🔍 Advanced Cache Operations
  getWithMetadata<T>(key: string): { data: T | null; metadata: { timestamp: number; ttl?: number; size: number } | null } {
    try {
      const fullKey = this.getFullKey(key);
      const item = localStorage.getItem(fullKey);
      
      if (!item) return { data: null, metadata: null };

      const entry: CacheEntry<T> = JSON.parse(item);
      
      if (this.isExpired(entry)) {
        this.remove(key);
        return { data: null, metadata: null };
      }

      let data = entry.data;
      if (entry.compressed && typeof data === 'string') {
        data = this.decompress(data) as T;
      }

      return {
        data,
        metadata: {
          timestamp: entry.timestamp,
          ttl: entry.ttl,
          size: item.length
        }
      };
    } catch (error) {
      console.error('Error getting with metadata:', error);
      return { data: null, metadata: null };
    }
  }

  updateTTL(key: string, newTTL: number): boolean {
    try {
      const fullKey = this.getFullKey(key);
      const item = localStorage.getItem(fullKey);
      
      if (!item) return false;

      const entry: CacheEntry<any> = JSON.parse(item);
      entry.ttl = newTTL;
      entry.timestamp = Date.now(); // Reset timestamp
      
      localStorage.setItem(fullKey, JSON.stringify(entry));
      return true;
    } catch (error) {
      console.error('Error updating TTL:', error);
      return false;
    }
  }

  clearExpired(): number {
    let cleared = 0;
    const keys = this.keys();
    
    keys.forEach(key => {
      const fullKey = this.getFullKey(key);
      try {
        const item = localStorage.getItem(fullKey);
        if (item) {
          const entry: CacheEntry<any> = JSON.parse(item);
          if (this.isExpired(entry)) {
            localStorage.removeItem(fullKey);
            cleared++;
          }
        }
      } catch {
        // Item corrompido, remover
        localStorage.removeItem(fullKey);
        cleared++;
      }
    });

    return cleared;
  }

  getStats(): {
    totalKeys: number;
    totalSize: number;
    expiredKeys: number;
    oldestEntry: number | null;
    newestEntry: number | null;
  } {
    const keys = this.keys();
    let totalSize = 0;
    let expiredKeys = 0;
    let oldestTimestamp: number | null = null;
    let newestTimestamp: number | null = null;

    keys.forEach(key => {
      const fullKey = this.getFullKey(key);
      try {
        const item = localStorage.getItem(fullKey);
        if (item) {
          totalSize += item.length;
          const entry: CacheEntry<any> = JSON.parse(item);
          
          if (this.isExpired(entry)) {
            expiredKeys++;
          }

          if (oldestTimestamp === null || entry.timestamp < oldestTimestamp) {
            oldestTimestamp = entry.timestamp;
          }
          
          if (newestTimestamp === null || entry.timestamp > newestTimestamp) {
            newestTimestamp = entry.timestamp;
          }
        }
      } catch {
        expiredKeys++;
      }
    });

    return {
      totalKeys: keys.length,
      totalSize,
      expiredKeys,
      oldestEntry: oldestTimestamp,
      newestEntry: newestTimestamp
    };
  }

  // 🔍 Batch Operations
  multiGet<T>(keys: string[]): Record<string, T | null> {
    const result: Record<string, T | null> = {};
    keys.forEach(key => {
      result[key] = this.get<T>(key);
    });
    return result;
  }

  multiSet<T>(items: Record<string, T>, options?: CacheOptions): Record<string, boolean> {
    const result: Record<string, boolean> = {};
    Object.entries(items).forEach(([key, value]) => {
      result[key] = this.set(key, value, options);
    });
    return result;
  }

  multiRemove(keys: string[]): Record<string, boolean> {
    const result: Record<string, boolean> = {};
    keys.forEach(key => {
      result[key] = this.remove(key);
    });
    return result;
  }

  // 🔍 Search and Filter
  findKeys(pattern: RegExp): string[] {
    return this.keys().filter(key => pattern.test(key));
  }

  findByPrefix(prefix: string): Record<string, any> {
    const result: Record<string, any> = {};
    const keys = this.keys().filter(key => key.startsWith(prefix));
    
    keys.forEach(key => {
      result[key] = this.get(key);
    });
    
    return result;
  }

  // 🔍 Private Helper Methods
  private getFullKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  private isExpired(entry: CacheEntry<any>): boolean {
    if (!entry.ttl) return false;
    return Date.now() - entry.timestamp > entry.ttl * 1000;
  }

  private evictOldest(): void {
    const keys = this.keys();
    let oldestKey = '';
    let oldestTimestamp = Date.now();

    keys.forEach(key => {
      const fullKey = this.getFullKey(key);
      try {
        const item = localStorage.getItem(fullKey);
        if (item) {
          const entry: CacheEntry<any> = JSON.parse(item);
          if (entry.timestamp < oldestTimestamp) {
            oldestTimestamp = entry.timestamp;
            oldestKey = key;
          }
        }
      } catch {
        // Item corrompido, considerar para remoção
        oldestKey = key;
        oldestTimestamp = 0;
      }
    });

    if (oldestKey) {
      this.remove(oldestKey);
    }
  }

  private compress(data: string): string {
    // Implementação simples de compressão usando RLE (Run Length Encoding)
    // Em um cenário real, você usaria uma biblioteca como pako ou lz-string
    try {
      return data.replace(/(.)\1{2,}/g, (match, char) => {
        return `${char}${match.length}`;
      });
    } catch {
      return data;
    }
  }

  private decompress(compressed: string): string {
    // Decompressão correspondente
    try {
      return compressed.replace(/(.)\d+/g, (match, char) => {
        const count = parseInt(match.substring(1));
        return char.repeat(count);
      });
    } catch {
      return compressed;
    }
  }
}

// 🔍 Specialized Storage Adapters
export class EditorStorageAdapter extends LocalStorageAdapter {
  constructor() {
    super('editor_', {
      ttl: 7200, // 2 horas
      maxSize: 50,
      compress: true
    });
  }

  saveEditorState(sessionId: string, state: any): boolean {
    return this.set(`session_${sessionId}`, state, { ttl: 7200 });
  }

  loadEditorState(sessionId: string): any {
    return this.get(`session_${sessionId}`);
  }

  saveStepBlocks(stepKey: string, blocks: any[]): boolean {
    return this.set(`blocks_${stepKey}`, blocks, { ttl: 3600 });
  }

  loadStepBlocks(stepKey: string): any[] {
    return this.get(`blocks_${stepKey}`) || [];
  }

  clearEditorData(): boolean {
    const editorKeys = this.findKeys(/^(session_|blocks_|template_)/);
    const results = this.multiRemove(editorKeys);
    return Object.values(results).every(success => success);
  }
}

export class QuizStorageAdapter extends LocalStorageAdapter {
  constructor() {
    super('quiz_', {
      ttl: 1800, // 30 minutos
      maxSize: 20,
      compress: false
    });
  }

  saveQuizSession(sessionId: string, sessionData: any): boolean {
    return this.set(`session_${sessionId}`, sessionData);
  }

  loadQuizSession(sessionId: string): any {
    return this.get(`session_${sessionId}`);
  }

  saveQuizAnswers(sessionId: string, answers: any[]): boolean {
    return this.set(`answers_${sessionId}`, answers);
  }

  loadQuizAnswers(sessionId: string): any[] {
    return this.get(`answers_${sessionId}`) || [];
  }

  saveQuizResult(sessionId: string, result: any): boolean {
    return this.set(`result_${sessionId}`, result, { ttl: 86400 }); // 24 horas
  }

  loadQuizResult(sessionId: string): any {
    return this.get(`result_${sessionId}`);
  }
}

export class FunnelStorageAdapter extends LocalStorageAdapter {
  constructor() {
    super('funnel_', {
      ttl: 3600, // 1 hora
      maxSize: 30,
      compress: true
    });
  }

  saveFunnelDraft(funnelId: string, draftData: any): boolean {
    return this.set(`draft_${funnelId}`, draftData);
  }

  loadFunnelDraft(funnelId: string): any {
    return this.get(`draft_${funnelId}`);
  }

  saveFunnelTemplate(templateId: string, templateData: any): boolean {
    return this.set(`template_${templateId}`, templateData, { ttl: 86400 }); // 24 horas
  }

  loadFunnelTemplate(templateId: string): any {
    return this.get(`template_${templateId}`);
  }

  clearFunnelDrafts(): boolean {
    const draftKeys = this.findKeys(/^draft_/);
    const results = this.multiRemove(draftKeys);
    return Object.values(results).every(success => success);
  }
}
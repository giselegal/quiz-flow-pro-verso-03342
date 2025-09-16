/**
 * 🧠 SISTEMA DE CACHE INTELIGENTE - FASE 4
 * 
 * Cache multi-camadas com:
 * - Context splitting para reduzir re-renders
 * - Memoização automática de componentes pesados
 * - Cache persistente otimizado (memory + localStorage + Supabase)
 * - Invalidação inteligente baseada em dependências
 */

import { StorageService } from '@/services/core/StorageService';
import { unifiedQuizStorage } from '@/services/core/UnifiedQuizStorage';
import { PerformanceOptimizer } from '@/utils/performanceOptimizer';

interface CacheEntry<T = unknown> {
  data: T;
  timestamp: number;
  accessCount: number;
  dependencies: string[];
  ttl: number; // Time to live in milliseconds
  priority: 'low' | 'medium' | 'high' | 'critical';
}

interface CacheStats {
  hitRate: number;
  totalSize: number;
  entriesCount: number;
  memoryUsage: number;
  storageUsage: number;
}

export class IntelligentCacheSystem {
  private memoryCache = new Map<string, CacheEntry>();
  private dependencyMap = new Map<string, Set<string>>(); // dependency -> keys that depend on it
  private accessLog = new Map<string, number[]>(); // key -> recent access times
  private maxMemorySize = 50 * 1024 * 1024; // 50MB limit
  private maxEntries = 1000;
  private cleanupTimer: number | null = null;

  constructor() {
    this.startCleanupScheduler();
    this.loadFromPersistentStorage();
  }

  /**
   * 🎯 GET - Recupera dados do cache com fallback inteligente
   */
  async get<T>(
    key: string,
    factory?: () => Promise<T> | T,
    options: {
      ttl?: number;
      dependencies?: string[];
      priority?: CacheEntry['priority'];
      useStorage?: boolean;
    } = {}
  ): Promise<T | null> {
    const {
      ttl = 300000, // 5 minutes default
      dependencies = [],
      priority = 'medium',
      useStorage = true
    } = options;

    // 1. Tentar memory cache primeiro
    const memoryEntry = this.memoryCache.get(key);
    if (memoryEntry && this.isValidEntry(memoryEntry)) {
      this.updateAccessStats(key);
      return memoryEntry.data as T;
    }

    // 2. Tentar storage persistente se habilitado
    if (useStorage) {
      const storageData = await this.getFromStorage<T>(key);
      if (storageData) {
        // Promover para memory cache
        this.setInMemory(key, storageData, { ttl, dependencies, priority });
        return storageData;
      }
    }

    // 3. Se tem factory, usar para gerar dados
    if (factory) {
      try {
        const data = await factory();
        this.set(key, data, { ttl, dependencies, priority, useStorage });
        return data;
      } catch (error) {
        console.error(`[Cache] Factory failed for key ${key}:`, error);
        return null;
      }
    }

    return null;
  }

  /**
   * 🎯 SET - Armazena dados no cache com estratégia inteligente
   */
  set<T>(
    key: string,
    data: T,
    options: {
      ttl?: number;
      dependencies?: string[];
      priority?: CacheEntry['priority'];
      useStorage?: boolean;
    } = {}
  ): void {
    const {
      ttl = 300000,
      dependencies = [],
      priority = 'medium',
      useStorage = true
    } = options;

    // Memory cache
    this.setInMemory(key, data, { ttl, dependencies, priority });

    // Storage persistente para dados importantes
    if (useStorage && (priority === 'high' || priority === 'critical')) {
      PerformanceOptimizer.schedule(() => {
        this.setInStorage(key, data, ttl);
      }, 100, 'message');
    }

    // Atualizar mapa de dependências
    dependencies.forEach(dep => {
      if (!this.dependencyMap.has(dep)) {
        this.dependencyMap.set(dep, new Set());
      }
      this.dependencyMap.get(dep)!.add(key);
    });
  }

  /**
   * 🎯 INVALIDATE - Invalida cache baseado em dependências
   */
  invalidate(dependencyOrKey: string, cascade = true): void {
    // Invalidar chave direta
    this.memoryCache.delete(dependencyOrKey);
    this.removeFromStorage(dependencyOrKey);

    // Invalidar dependentes se cascade ativo
    if (cascade) {
      const dependentKeys = this.dependencyMap.get(dependencyOrKey);
      if (dependentKeys) {
        dependentKeys.forEach(key => {
          this.memoryCache.delete(key);
          this.removeFromStorage(key);
        });
        this.dependencyMap.delete(dependencyOrKey);
      }
    }
  }

  /**
   * 🎯 PREFETCH - Pré-carrega dados importantes
   */
  async prefetch<T>(
    key: string,
    factory: () => Promise<T> | T,
    options: {
      priority?: CacheEntry['priority'];
      dependencies?: string[];
    } = {}
  ): Promise<void> {
    const { priority = 'low', dependencies = [] } = options;

    // Só prefetch se não existir
    if (!this.memoryCache.has(key)) {
      try {
        const data = await factory();
        this.set(key, data, {
          ttl: 600000, // 10 minutes for prefetched data
          dependencies,
          priority,
          useStorage: priority !== 'low'
        });
      } catch (error) {
        console.warn(`[Cache] Prefetch failed for ${key}:`, error);
      }
    }
  }

  /**
   * 🎯 STATS - Estatísticas do cache
   */
  getStats(): CacheStats {
    const entries = Array.from(this.memoryCache.values());
    const totalHits = Array.from(this.accessLog.values())
      .reduce((sum, accesses) => sum + accesses.length, 0);
    const totalRequests = totalHits + this.memoryCache.size; // Aproximação

    return {
      hitRate: totalRequests > 0 ? totalHits / totalRequests : 0,
      totalSize: this.calculateMemoryUsage(),
      entriesCount: this.memoryCache.size,
      memoryUsage: this.calculateMemoryUsage(),
      storageUsage: this.calculateStorageUsage()
    };
  }

  /**
   * 🧹 CLEANUP - Limpeza inteligente baseada em LRU e prioridade
   */
  cleanup(force = false): void {
    const now = Date.now();
    const entries = Array.from(this.memoryCache.entries());

    // Remover entradas expiradas
    entries.forEach(([key, entry]) => {
      if (!this.isValidEntry(entry)) {
        this.memoryCache.delete(key);
      }
    });

    // Se ainda excede limites, aplicar LRU
    if (force || this.memoryCache.size > this.maxEntries || this.calculateMemoryUsage() > this.maxMemorySize) {
      this.applyLRUCleanup();
    }
  }

  // ==================== MÉTODOS PRIVADOS ====================

  private setInMemory<T>(
    key: string,
    data: T,
    options: {
      ttl: number;
      dependencies: string[];
      priority: CacheEntry['priority'];
    }
  ): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      accessCount: 1,
      dependencies: options.dependencies,
      ttl: options.ttl,
      priority: options.priority
    };

    this.memoryCache.set(key, entry);
    this.updateAccessStats(key);
  }

  private async getFromStorage<T>(key: string): Promise<T | null> {
    try {
      const stored = StorageService.safeGetJSON<{
        data: T;
        timestamp: number;
        ttl: number;
      }>(`cache_${key}`);

      if (stored && Date.now() - stored.timestamp < stored.ttl) {
        return stored.data;
      }
    } catch (error) {
      console.warn(`[Cache] Storage read failed for ${key}:`, error);
    }
    return null;
  }

  private setInStorage<T>(key: string, data: T, ttl: number): void {
    try {
      StorageService.safeSetJSON(`cache_${key}`, {
        data,
        timestamp: Date.now(),
        ttl
      });
    } catch (error) {
      console.warn(`[Cache] Storage write failed for ${key}:`, error);
    }
  }

  private removeFromStorage(key: string): void {
    StorageService.safeRemove(`cache_${key}`);
  }

  private isValidEntry(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp < entry.ttl;
  }

  private updateAccessStats(key: string): void {
    const now = Date.now();
    const entry = this.memoryCache.get(key);
    
    if (entry) {
      entry.accessCount++;
    }

    // Log de acesso para LRU
    if (!this.accessLog.has(key)) {
      this.accessLog.set(key, []);
    }
    
    const accesses = this.accessLog.get(key)!;
    accesses.push(now);
    
    // Manter apenas últimos 10 acessos
    if (accesses.length > 10) {
      accesses.shift();
    }
  }

  private applyLRUCleanup(): void {
    const entries = Array.from(this.memoryCache.entries());
    
    // Ordenar por prioridade e último acesso
    entries.sort(([keyA, entryA], [keyB, entryB]) => {
      const priorityWeights = { critical: 4, high: 3, medium: 2, low: 1 };
      const weightA = priorityWeights[entryA.priority];
      const weightB = priorityWeights[entryB.priority];
      
      if (weightA !== weightB) {
        return weightB - weightA; // Maior prioridade primeiro
      }
      
      // Se mesma prioridade, usar último acesso
      const lastAccessA = this.accessLog.get(keyA)?.[0] || 0;
      const lastAccessB = this.accessLog.get(keyB)?.[0] || 0;
      return lastAccessA - lastAccessB; // Mais antigo primeiro
    });

    // Remover 25% das entradas menos importantes
    const toRemove = Math.ceil(entries.length * 0.25);
    entries.slice(0, toRemove).forEach(([key]) => {
      this.memoryCache.delete(key);
      this.accessLog.delete(key);
    });
  }

  private calculateMemoryUsage(): number {
    let size = 0;
    this.memoryCache.forEach((entry) => {
      size += JSON.stringify(entry.data).length * 2; // Aproximação UTF-16
    });
    return size;
  }

  private calculateStorageUsage(): number {
    // Aproximação baseada nas chaves do localStorage
    return Object.keys(localStorage).filter(key => key.startsWith('cache_')).length * 1024;
  }

  private startCleanupScheduler(): void {
    this.cleanupTimer = PerformanceOptimizer.scheduleInterval(
      () => this.cleanup(),
      60000, // Cleanup a cada minuto
      'timeout',
      { cancelOnNav: false, label: 'cache-cleanup' }
    ) as number;
  }

  private loadFromPersistentStorage(): void {
    // Carregar configurações de cache importantes
    PerformanceOptimizer.schedule(async () => {
      const data = unifiedQuizStorage.loadData();
      if (data) {
        this.set('unified-quiz-data', data, {
          ttl: 3600000, // 1 hora
          priority: 'critical',
          dependencies: ['quiz-progress', 'user-selections'],
          useStorage: true
        });
      }
    }, 100, 'message');
  }

  destroy(): void {
    if (this.cleanupTimer) {
      PerformanceOptimizer.cancelInterval(this.cleanupTimer);
    }
    this.memoryCache.clear();
    this.dependencyMap.clear();
    this.accessLog.clear();
  }
}

// Singleton instance
export const intelligentCache = new IntelligentCacheSystem();
export default intelligentCache;
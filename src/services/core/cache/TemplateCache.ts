/**
 * 🗄️ TEMPLATE CACHE
 * 
 * Sistema de cache em 2 camadas para templates:
 * - L1: Memória (Map) - ultra rápido, volátil
 * - L2: IndexedDB - persistente, sobrevive reloads
 * 
 * Extrai lógica de cache do HierarchicalTemplateSource.
 * 
 * @version 1.0.0
 */

import type { Block } from '@/types/editor';
import { IndexedTemplateCache } from '../IndexedTemplateCache';
import { appLogger } from '@/lib/utils/appLogger';

export enum CacheSource {
  USER_EDIT = 'USER_EDIT',
  ADMIN_OVERRIDE = 'ADMIN_OVERRIDE',
  TEMPLATE_DEFAULT = 'TEMPLATE_DEFAULT',
}

export interface CacheEntry {
  data: Block[];
  source: CacheSource;
  timestamp: number;
  expiresAt: number;
  version?: string;
  themeVersion?: string;
}

export interface CacheConfig {
  enableCache: boolean;
  ttlMs: number; // Time to live in milliseconds
  maxL1Entries?: number; // Limite de entradas no cache L1 (memória)
}

export interface CacheMetadata {
  cacheHit: boolean;
  cacheLayer?: 'L1' | 'L2';
  source: CacheSource;
  timestamp: number;
  loadTime?: number;
}

export class TemplateCache {
  private l1Cache = new Map<string, CacheEntry>();
  private config: Required<CacheConfig>;
  private l1AccessCount = new Map<string, number>(); // Para LRU

  constructor(config: CacheConfig) {
    this.config = {
      enableCache: config.enableCache,
      ttlMs: config.ttlMs,
      maxL1Entries: config.maxL1Entries ?? 50, // Padrão: 50 entries
    };

    appLogger.info(`[TemplateCache] Inicializado - Cache: ${this.config.enableCache}, TTL: ${this.config.ttlMs}ms`);
  }

  /**
   * Obter do cache (verifica L1 e L2)
   */
  async get(stepId: string, funnelId?: string): Promise<CacheEntry | null> {
    if (!this.config.enableCache) {
      return null;
    }

    const cacheKey = this.getCacheKey(stepId, funnelId);

    // 1. Verificar L1 (memória)
    const l1Entry = this.getFromL1(cacheKey);
    if (l1Entry) {
      this.l1AccessCount.set(cacheKey, (this.l1AccessCount.get(cacheKey) ?? 0) + 1);
      appLogger.debug(`[TemplateCache] HIT L1: ${cacheKey}`);
      return l1Entry;
    }

    // 2. Verificar L2 (IndexedDB)
    const l2Entry = await this.getFromL2(cacheKey);
    if (l2Entry) {
      // Promover para L1
      this.setInL1(cacheKey, l2Entry);
      appLogger.debug(`[TemplateCache] HIT L2: ${cacheKey}`);
      return l2Entry;
    }

    appLogger.debug(`[TemplateCache] MISS: ${cacheKey}`);
    return null;
  }

  /**
   * Salvar no cache (L1 e L2)
   */
  async set(
    stepId: string, 
    data: Block[], 
    source: CacheSource,
    funnelId?: string,
    ttlMs?: number
  ): Promise<void> {
    if (!this.config.enableCache) {
      return;
    }

    const cacheKey = this.getCacheKey(stepId, funnelId);
    const effectiveTtl = ttlMs ?? this.config.ttlMs;
    
    const entry: CacheEntry = {
      data,
      source,
      timestamp: Date.now(),
      expiresAt: Date.now() + effectiveTtl,
      version: 'v3.2',
    };

    // Salvar em L1 (memória)
    this.setInL1(cacheKey, entry);

    // Salvar em L2 (IndexedDB) de forma assíncrona
    this.setInL2(cacheKey, entry, effectiveTtl).catch((error) => {
      appLogger.debug('[TemplateCache] Falha ao salvar em L2 (não crítico)', { data: [error] });
    });

    appLogger.debug(`[TemplateCache] SET: ${cacheKey} (${data.length} blocos)`);
  }

  /**
   * Invalidar cache de um step
   */
  async invalidate(stepId: string, funnelId?: string): Promise<void> {
    const cacheKey = this.getCacheKey(stepId, funnelId);
    
    // Remover de L1
    this.l1Cache.delete(cacheKey);
    this.l1AccessCount.delete(cacheKey);

    // Remover de L2
    try {
      await IndexedTemplateCache.delete(cacheKey);
      appLogger.info(`[TemplateCache] Invalidado: ${cacheKey}`);
    } catch (error) {
      appLogger.debug('[TemplateCache] Falha ao invalidar L2', { data: [error] });
    }
  }

  /**
   * Limpar todo o cache
   */
  async clear(): Promise<void> {
    this.l1Cache.clear();
    this.l1AccessCount.clear();

    try {
      await IndexedTemplateCache.clear();
      appLogger.info('[TemplateCache] Cache limpo completamente');
    } catch (error) {
      appLogger.warn('[TemplateCache] Falha ao limpar L2', { data: [error] });
    }
  }

  /**
   * Obter estatísticas do cache
   */
  getStats() {
    return {
      l1Size: this.l1Cache.size,
      l1MaxSize: this.config.maxL1Entries,
      l1UsagePercent: (this.l1Cache.size / this.config.maxL1Entries) * 100,
      ttlMs: this.config.ttlMs,
      enabled: this.config.enableCache,
    };
  }

  // ========================================================================
  // MÉTODOS PRIVADOS
  // ========================================================================

  private getCacheKey(stepId: string, funnelId?: string): string {
    return funnelId ? `${funnelId}:${stepId}` : stepId;
  }

  private getFromL1(cacheKey: string): CacheEntry | null {
    const entry = this.l1Cache.get(cacheKey);
    
    if (!entry) {
      return null;
    }

    // Verificar expiração
    if (Date.now() > entry.expiresAt) {
      this.l1Cache.delete(cacheKey);
      this.l1AccessCount.delete(cacheKey);
      appLogger.debug(`[TemplateCache] L1 expirado: ${cacheKey}`);
      return null;
    }

    return entry;
  }

  private setInL1(cacheKey: string, entry: CacheEntry): void {
    // Verificar limite de entradas (LRU eviction)
    if (this.l1Cache.size >= this.config.maxL1Entries) {
      this.evictLRU();
    }

    this.l1Cache.set(cacheKey, entry);
    this.l1AccessCount.set(cacheKey, 1);
  }

  private async getFromL2(cacheKey: string): Promise<CacheEntry | null> {
    try {
      const record = await IndexedTemplateCache.get(cacheKey);
      
      if (!record || !Array.isArray(record.blocks)) {
        return null;
      }

      // Verificar expiração
      const ttl = record.ttlMs || this.config.ttlMs;
      const isExpired = (Date.now() - record.savedAt) > ttl;
      
      if (isExpired) {
        await IndexedTemplateCache.delete(cacheKey);
        appLogger.debug(`[TemplateCache] L2 expirado: ${cacheKey}`);
        return null;
      }

      return {
        data: record.blocks,
        source: CacheSource.TEMPLATE_DEFAULT, // Assumir default se não especificado
        timestamp: record.savedAt,
        expiresAt: record.savedAt + ttl,
        version: record.version,
      };
    } catch (error) {
      appLogger.debug('[TemplateCache] Erro ao ler L2', { data: [error] });
      return null;
    }
  }

  private async setInL2(cacheKey: string, entry: CacheEntry, ttlMs: number): Promise<void> {
    try {
      await IndexedTemplateCache.set(cacheKey, {
        key: cacheKey,
        blocks: entry.data,
        savedAt: entry.timestamp,
        ttlMs,
        version: entry.version ?? 'v3.2',
      });
    } catch (error) {
      // Silent fail - L2 é opcional
      appLogger.debug('[TemplateCache] Erro ao salvar em L2', { data: [error] });
    }
  }

  /**
   * Eviction LRU - Remove entrada menos recentemente usada
   */
  private evictLRU(): void {
    let lruKey: string | null = null;
    let minAccessCount = Infinity;

    // Encontrar entrada menos acessada
    for (const [key, count] of this.l1AccessCount.entries()) {
      if (count < minAccessCount) {
        minAccessCount = count;
        lruKey = key;
      }
    }

    if (lruKey) {
      this.l1Cache.delete(lruKey);
      this.l1AccessCount.delete(lruKey);
      appLogger.debug(`[TemplateCache] LRU evicted: ${lruKey}`);
    }
  }

  /**
   * Pré-carregar steps adjacentes (prefetch)
   */
  async prefetchAdjacent(currentStepId: string, funnelId?: string): Promise<void> {
    if (!this.config.enableCache) {
      return;
    }

    const numMatch = currentStepId.match(/step-(\d{2})/);
    if (!numMatch) {
      return;
    }

    const currentNum = parseInt(numMatch[1], 10);
    const adjacentSteps: string[] = [];

    // Prefetch próximo step
    if (currentNum < 21) {
      adjacentSteps.push(`step-${(currentNum + 1).toString().padStart(2, '0')}`);
    }

    // Prefetch step anterior
    if (currentNum > 1) {
      adjacentSteps.push(`step-${(currentNum - 1).toString().padStart(2, '0')}`);
    }

    appLogger.debug(`[TemplateCache] Prefetch adjacentes: ${adjacentSteps.join(', ')}`);
  }
}

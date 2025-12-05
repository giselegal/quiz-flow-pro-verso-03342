/**
 * 🔄 TEMPLATE CACHE - FACADE DE COMPATIBILIDADE
 * @deprecated Use `cacheService.templates` de '@/services' ao invés deste arquivo
 * 
 * Este arquivo foi convertido para facade que delega ao cacheService canônico.
 * Mantido apenas para compatibilidade com imports existentes.
 * 
 * MIGRAÇÃO:
 * ```typescript
 * // ❌ ANTES
 * import { templateCache, TemplateCache } from '@/services/TemplateCache';
 * templateCache.get('step-01', 'quiz21StepsComplete');
 * 
 * // ✅ DEPOIS
 * import { cacheService } from '@/services';
 * cacheService.templates.get('step-01');
 * ```
 */

import { cacheService } from '@/services/canonical/CacheService';
import { appLogger } from '@/lib/utils/appLogger';
import type { Block } from '@/types/editor';

// ============================================================================
// TIPOS LEGADOS (Mantidos para compatibilidade)
// ============================================================================

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  hits: number;
}

interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  hitRate: number;
}

// ============================================================================
// CLASSE LEGADA (Delega para cacheService)
// ============================================================================

/**
 * @deprecated Use `cacheService.templates` ao invés desta classe
 */
export class TemplateCache {
  private stats = { hits: 0, misses: 0 };

  constructor(_ttlMinutes: number = 5) {
    appLogger.warn('[DEPRECATED] TemplateCache class → use cacheService.templates');
  }

  /**
   * @deprecated Use `cacheService.templates.get(key)`
   */
  get(stepId: string, _templateId: string = 'quiz21StepsComplete'): Block[] | null {
    const key = `template:${stepId}`;
    const result = cacheService.templates.get<Block[]>(key);
    
    if (result.success && result.data) {
      this.stats.hits++;
      return result.data;
    }
    
    this.stats.misses++;
    return null;
  }

  /**
   * @deprecated Use `cacheService.templates.set(key, value)`
   */
  set(stepId: string, data: Block[], _templateId: string = 'quiz21StepsComplete'): void {
    const key = `template:${stepId}`;
    cacheService.templates.set(key, data);
  }

  /**
   * @deprecated Use `cacheService.templates.get(key)`
   */
  getMaster(_templateId: string = 'quiz21StepsComplete'): Record<string, Block[]> | null {
    const key = 'template:master';
    const result = cacheService.templates.get<Record<string, Block[]>>(key);
    return result.success ? result.data : null;
  }

  /**
   * @deprecated Use `cacheService.templates.set(key, value)`
   */
  setMaster(templateId: string, data: Record<string, Block[]>): void {
    const key = 'template:master';
    cacheService.templates.set(key, data);
  }

  /**
   * @deprecated
   */
  getStepFromMaster(stepId: string, templateId: string = 'quiz21StepsComplete'): Block[] | null {
    const master = this.getMaster(templateId);
    if (!master) return null;
    return master[stepId] || null;
  }

  /**
   * @deprecated
   */
  async preloadAdjacent(_currentStepNumber: number, _templateId: string = 'quiz21StepsComplete'): Promise<void> {
    // No-op - preload handled by templateService
  }

  /**
   * @deprecated Use `cacheService.templates.invalidate(key)`
   */
  invalidate(stepId: string, _templateId: string = 'quiz21StepsComplete'): void {
    const key = `template:${stepId}`;
    cacheService.templates.invalidate(key);
  }

  /**
   * @deprecated Use `cacheService.templates.invalidate(key)`
   */
  invalidateMaster(_templateId: string = 'quiz21StepsComplete'): void {
    cacheService.templates.invalidate('template:master');
  }

  /**
   * @deprecated Use `cacheService.clearStore('templates')`
   */
  clear(): void {
    cacheService.clearStore('templates');
    this.stats = { hits: 0, misses: 0 };
  }

  /**
   * @deprecated
   */
  getStats(): CacheStats {
    const total = this.stats.hits + this.stats.misses;
    return {
      hits: this.stats.hits,
      misses: this.stats.misses,
      size: 0, // Cache interno não expõe size diretamente
      hitRate: total > 0 ? (this.stats.hits / total) * 100 : 0,
    };
  }

  /**
   * @deprecated
   */
  logStats(): void {
    const stats = this.getStats();
    appLogger.info('[TemplateCache] Stats:', { data: [stats] });
  }
}

// ============================================================================
// SINGLETON LEGADO (Compatibilidade)
// ============================================================================

/** @deprecated Use `cacheService.templates` */
export const templateCache = new TemplateCache(5);

// Expor para debug
if (typeof window !== 'undefined') {
  (window as any).__templateCache = templateCache;
  appLogger.warn('[DEPRECATED] __templateCache → use cacheService.templates');
}

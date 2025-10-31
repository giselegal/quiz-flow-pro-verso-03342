/**
 * 🎯 CACHE MANAGER - High-Level API
 * 
 * API simplificada para gerenciamento de cache no Quiz Flow Pro.
 * Abstrai complexidade do HybridCacheStrategy para uso fácil.
 * 
 * USAGE:
 * ```typescript
 * import { cacheManager } from '@/services/CacheManager';
 * 
 * // Salvar funnel com cache offline
 * await cacheManager.cacheFunnel(funnelId, funnelData);
 * 
 * // Recuperar funnel (memória ou disk)
 * const funnel = await cacheManager.getFunnel(funnelId);
 * 
 * // Auto-save draft
 * await cacheManager.saveDraft(funnelId, draftData);
 * ```
 */

import { hybridCache, HybridCacheStrategy } from './core/HybridCacheStrategy';
import { appLogger } from '@/utils/logger';
import { performanceProfiler } from '@/utils/performanceProfiler';

interface FunnelData {
  id: string;
  name: string;
  steps: any[];
  [key: string]: any;
}

interface TemplateData {
  id: string;
  name: string;
  content: any;
  [key: string]: any;
}

interface DraftData {
  funnelId: string;
  content: any;
  timestamp: number;
  autoSaved?: boolean;
}

export class CacheManager {
  private static instance: CacheManager;
  private hybridCache: HybridCacheStrategy;

  // TTLs configuráveis
  private readonly TTL = {
    FUNNEL: 30 * 60 * 1000, // 30 minutos
    TEMPLATE: 60 * 60 * 1000, // 1 hora
    DRAFT: 24 * 60 * 60 * 1000, // 24 horas
    METADATA: 10 * 60 * 1000, // 10 minutos
  };

  private constructor() {
    this.hybridCache = hybridCache;
  }

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  // ==================== FUNNELS ====================

  /**
   * Cacheia funnel completo (memória + disk)
   */
  async cacheFunnel(funnelId: string, data: FunnelData): Promise<boolean> {
    performanceProfiler.start('cacheFunnel', 'cache');

    try {
      const success = await this.hybridCache.set(
        `funnel:${funnelId}`,
        data,
        {
          ttl: this.TTL.FUNNEL,
          memoryStore: 'funnels',
          diskStore: 'funnels',
          persistToDisk: true,
        }
      );

      if (success) {
        appLogger.debug(`✅ Funnel cached: ${funnelId}`);
      }

      performanceProfiler.end('cacheFunnel');
      return success;
    } catch (error) {
      appLogger.error('[CacheManager] cacheFunnel failed:', error);
      performanceProfiler.end('cacheFunnel');
      return false;
    }
  }

  /**
   * Recupera funnel do cache
   */
  async getFunnel(funnelId: string): Promise<FunnelData | null> {
    performanceProfiler.start('getFunnel', 'cache');

    try {
      const funnel = await this.hybridCache.get<FunnelData>(
        `funnel:${funnelId}`,
        {
          memoryStore: 'funnels',
          diskStore: 'funnels',
          promoteOnHit: true,
        }
      );

      performanceProfiler.end('getFunnel');
      return funnel;
    } catch (error) {
      appLogger.error('[CacheManager] getFunnel failed:', error);
      performanceProfiler.end('getFunnel');
      return null;
    }
  }

  /**
   * Remove funnel do cache
   */
  async invalidateFunnel(funnelId: string): Promise<void> {
    await this.hybridCache.invalidate(`funnel:${funnelId}`, {
      memoryStore: 'funnels',
      diskStore: 'funnels',
    });
    appLogger.debug(`🗑️  Funnel cache invalidated: ${funnelId}`);
  }

  // ==================== TEMPLATES ====================

  /**
   * Cacheia template
   */
  async cacheTemplate(templateId: string, data: TemplateData): Promise<boolean> {
    return await this.hybridCache.set(
      `template:${templateId}`,
      data,
      {
        ttl: this.TTL.TEMPLATE,
        memoryStore: 'templates',
        diskStore: 'templates',
        persistToDisk: true,
      }
    );
  }

  /**
   * Recupera template do cache
   */
  async getTemplate(templateId: string): Promise<TemplateData | null> {
    return await this.hybridCache.get<TemplateData>(
      `template:${templateId}`,
      {
        memoryStore: 'templates',
        diskStore: 'templates',
        promoteOnHit: true,
      }
    );
  }

  /**
   * Invalida template
   */
  async invalidateTemplate(templateId: string): Promise<void> {
    await this.hybridCache.invalidate(`template:${templateId}`, {
      memoryStore: 'templates',
      diskStore: 'templates',
    });
  }

  // ==================== DRAFTS (Auto-save) ====================

  /**
   * Salva draft automaticamente
   */
  async saveDraft(funnelId: string, content: any): Promise<boolean> {
    const draftData: DraftData = {
      funnelId,
      content,
      timestamp: Date.now(),
      autoSaved: true,
    };

    const success = await this.hybridCache.set(
      `draft:${funnelId}`,
      draftData,
      {
        ttl: this.TTL.DRAFT,
        memoryStore: 'generic',
        diskStore: 'drafts',
        persistToDisk: true,
      }
    );

    if (success) {
      appLogger.debug(`💾 Draft auto-saved: ${funnelId}`);
    }

    return success;
  }

  /**
   * Recupera último draft
   */
  async getDraft(funnelId: string): Promise<DraftData | null> {
    return await this.hybridCache.get<DraftData>(
      `draft:${funnelId}`,
      {
        memoryStore: 'generic',
        diskStore: 'drafts',
        promoteOnHit: false, // Não promover drafts para L1
      }
    );
  }

  /**
   * Remove draft após salvar definitivamente
   */
  async clearDraft(funnelId: string): Promise<void> {
    await this.hybridCache.delete(`draft:${funnelId}`, {
      memoryStore: 'generic',
      diskStore: 'drafts',
    });
    appLogger.debug(`🗑️  Draft cleared: ${funnelId}`);
  }

  /**
   * Lista todos os drafts disponíveis
   */
  async listDrafts(): Promise<string[]> {
    // TODO: Implementar scan de IndexedDB
    return [];
  }

  // ==================== UTILITIES ====================

  /**
   * Pré-carrega funnels recentes
   */
  async warmupRecentFunnels(funnelIds: string[]): Promise<number> {
    const keys = funnelIds.map((id) => `funnel:${id}`);
    return await this.hybridCache.warmup(keys, {
      memoryStore: 'funnels',
      diskStore: 'funnels',
    });
  }

  /**
   * Limpa cache de funnels
   */
  async clearFunnelsCache(): Promise<void> {
    await this.hybridCache.clear({
      memoryStore: 'funnels',
      diskStore: 'funnels',
    });
    appLogger.debug('🧹 Funnels cache cleared');
  }

  /**
   * Limpa cache de templates
   */
  async clearTemplatesCache(): Promise<void> {
    await this.hybridCache.clear({
      memoryStore: 'templates',
      diskStore: 'templates',
    });
    appLogger.debug('🧹 Templates cache cleared');
  }

  /**
   * Limpa todos os drafts
   */
  async clearAllDrafts(): Promise<void> {
    await this.hybridCache.clear({
      memoryStore: 'generic',
      diskStore: 'drafts',
    });
    appLogger.debug('🧹 All drafts cleared');
  }

  /**
   * Estatísticas de cache
   */
  getCacheStats() {
    return this.hybridCache.getMetrics();
  }

  /**
   * Relatório detalhado
   */
  generateReport(): string {
    return this.hybridCache.generateReport();
  }

  /**
   * Reseta estatísticas
   */
  resetStats(): void {
    this.hybridCache.resetMetrics();
  }
}

// Singleton instance
export const cacheManager = CacheManager.getInstance();

// Expor para debugging no console
if (typeof window !== 'undefined') {
  (window as any).__cacheManager = cacheManager;
}

export default cacheManager;

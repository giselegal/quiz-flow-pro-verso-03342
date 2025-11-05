/**
 * 🎯 USE UNIFIED CACHE HOOK - FASE 2
 * 
 * Hook para acessar o UnifiedCacheService de forma reativa
 * com suporte a sincronização automática via eventos
 * 
 * @version 1.0.0
 * @date 2025-01-17
 */

import { useEffect, useState, useCallback, useMemo } from 'react';
import { unifiedCacheService, CacheStats, CacheEntryType } from '@/services/unified/UnifiedCacheService';

interface UseUnifiedCacheOptions {
  /** Auto-refresh stats (default: false) */
  autoRefresh?: boolean;
  /** Refresh interval em ms (default: 5000) */
  refreshInterval?: number;
}

interface UseUnifiedCacheReturn {
  // Core operations
  get: <T = any>(key: string) => T | undefined;
  set: <T = any>(key: string, data: T, type?: CacheEntryType, ttl?: number) => void;
  has: (key: string) => boolean;
  delete: (key: string) => boolean;
  clear: () => void;
  
  // Invalidation
  invalidatePattern: (pattern: string | RegExp) => number;
  invalidateType: (type: CacheEntryType) => number;
  invalidateStep: (stepKey: string) => void;
  invalidateFunnel: (funnelId: string) => void;
  
  // Stats
  stats: CacheStats;
  hitRate: number;
  
  // Utilities
  keys: () => string[];
}

/**
 * Hook para acessar cache unificado
 */
export function useUnifiedCache(options?: UseUnifiedCacheOptions): UseUnifiedCacheReturn {
  const { autoRefresh = false, refreshInterval = 5000 } = options || {};
  
  const [stats, setStats] = useState<CacheStats>(() => unifiedCacheService.getStats());

  // Atualizar stats quando cache mudar
  useEffect(() => {
    const unsubscribe = unifiedCacheService.subscribe(() => {
      setStats(unifiedCacheService.getStats());
    });

    return unsubscribe;
  }, []);

  // Auto-refresh opcional
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setStats(unifiedCacheService.getStats());
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  // Wrapper methods para compatibilidade com hooks
  const get = useCallback(<T = any>(key: string): T | undefined => {
    return unifiedCacheService.get<T>(key);
  }, []);

  const set = useCallback(<T = any>(
    key: string,
    data: T,
    type: CacheEntryType = 'metadata',
    ttl?: number
  ): void => {
    unifiedCacheService.set(key, data, type, ttl);
  }, []);

  const has = useCallback((key: string): boolean => {
    return unifiedCacheService.has(key);
  }, []);

  const deleteKey = useCallback((key: string): boolean => {
    return unifiedCacheService.delete(key);
  }, []);

  const clear = useCallback((): void => {
    unifiedCacheService.clear();
  }, []);

  const invalidatePattern = useCallback((pattern: string | RegExp): number => {
    return unifiedCacheService.invalidatePattern(pattern);
  }, []);

  const invalidateType = useCallback((type: CacheEntryType): number => {
    return unifiedCacheService.invalidateType(type);
  }, []);

  const invalidateStep = useCallback((stepKey: string): void => {
    unifiedCacheService.invalidateStep(stepKey);
  }, []);

  const invalidateFunnel = useCallback((funnelId: string): void => {
    unifiedCacheService.invalidateFunnel(funnelId);
  }, []);

  const keys = useCallback((): string[] => {
    return unifiedCacheService.keys();
  }, []);

  const hitRate = useMemo(() => stats.hitRate, [stats.hitRate]);

  return {
    get,
    set,
    has,
    delete: deleteKey,
    clear,
    invalidatePattern,
    invalidateType,
    invalidateStep,
    invalidateFunnel,
    stats,
    hitRate,
    keys,
  };
}

/**
 * Hook para monitorar métricas de cache
 */
export function useCacheMetrics(autoRefresh = true, refreshInterval = 3000) {
  const { stats, hitRate } = useUnifiedCache({ autoRefresh, refreshInterval });
  
  return {
    stats,
    hitRate,
    performance: {
      efficiency: hitRate * 100,
      totalSize: stats.totalSize,
      totalEntries: stats.totalEntries,
    },
  };
}

/**
 * Hook para cache de step específico
 */
export function useStepCache(stepKey: string) {
  const cache = useUnifiedCache();
  
  const getBlocks = useCallback(() => {
    return cache.get(stepKey) ?? [];
  }, [cache, stepKey]);
  
  const setBlocks = useCallback((blocks: any[]) => {
    cache.set(stepKey, blocks, 'step');
  }, [cache, stepKey]);
  
  const invalidate = useCallback(() => {
    cache.invalidateStep(stepKey);
  }, [cache, stepKey]);
  
  return {
    getBlocks,
    setBlocks,
    invalidate,
  };
}

export default useUnifiedCache;

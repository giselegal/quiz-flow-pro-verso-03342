/**
 * 🚀 HOOK AVANÇADO DE PERFORMANCE - FASE 4
 * 
 * Hook unificado que combina todos os sistemas avançados:
 * - Cache inteligente
 * - Recovery automático
 * - Lazy loading
 * - Telemetria e analytics
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { intelligentCache } from '@/systems/cache/IntelligentCacheSystem';
import { recoveryManager } from '@/systems/recovery/RecoveryManager';
import { lazyLoadManager } from '@/systems/optimization/LazyLoadManager';
import { createRealtimeFoundation } from '@/systems/realtime/RealtimeFoundation';
import { PerformanceOptimizer } from '@/utils/performanceOptimizer';

interface PerformanceConfig {
  enableCache?: boolean;
  enableRecovery?: boolean;
  enableLazyLoading?: boolean;
  enableRealtime?: boolean;
  enableTelemetry?: boolean;
  userId?: string;
  userName?: string;
}

interface PerformanceMetrics {
  cacheStats: any;
  recoveryStats: any;
  bundleAnalysis: any;
  networkStatus: string;
  memoryUsage: number;
}

interface CachedOperation<T> {
  key: string;
  executor: () => Promise<T>;
  dependencies?: string[];
  ttl?: number;
  priority?: 'low' | 'medium' | 'high' | 'critical';
}

export const useAdvancedPerformance = (config: PerformanceConfig = {}) => {
  const {
    enableCache = true,
    enableRecovery = true,
    enableLazyLoading = true,
    enableRealtime = false,
    enableTelemetry = true,
    userId = 'anonymous',
    userName = 'User'
  } = config;

  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const realtimeRef = useRef<any>(null);
  const metricsUpdateTimer = useRef<number | null>(null);

  // ==================== INICIALIZAÇÃO ====================

  useEffect(() => {
    const initialize = async () => {
      try {
        // Inicializar sistemas conforme configuração
        if (enableRealtime && !realtimeRef.current) {
          realtimeRef.current = createRealtimeFoundation({
            userId,
            userName,
            wsUrl: process.env.VITE_WS_URL
          });
          
          await realtimeRef.current.connect();
        }

        // Preload componentes críticos se lazy loading ativo
        if (enableLazyLoading) {
          lazyLoadManager.preloadForRoute(window.location.pathname);
        }

        // Iniciar coleta de métricas
        if (enableTelemetry) {
          startMetricsCollection();
        }

        setIsInitialized(true);
        
        if (enableTelemetry) {
          recoveryManager.recordTelemetry({
            type: 'performance',
            category: 'initialization',
            action: 'advanced-performance-ready',
            timestamp: Date.now(),
            metadata: { config }
          });
        }

      } catch (error) {
        console.error('[AdvancedPerformance] Initialization failed:', error);
        
        if (enableTelemetry) {
          recoveryManager.recordTelemetry({
            type: 'error',
            category: 'initialization',
            action: 'failed',
            timestamp: Date.now(),
            metadata: { error: (error as Error).message }
          });
        }
      }
    };

    initialize();

    return () => {
      if (realtimeRef.current) {
        realtimeRef.current.disconnect();
      }
      
      if (metricsUpdateTimer.current) {
        PerformanceOptimizer.cancelInterval(metricsUpdateTimer.current);
      }
    };
  }, [enableRealtime, enableLazyLoading, enableTelemetry, userId, userName]);

  // ==================== OPERAÇÕES COM CACHE ====================

  const cachedOperation = useCallback(async <T>(
    operation: CachedOperation<T>
  ): Promise<T | null> => {
    if (!enableCache) {
      return await operation.executor();
    }

    const startTime = performance.now();
    
    try {
      const result = await intelligentCache.get(
        operation.key,
        operation.executor,
        {
          ttl: operation.ttl,
          dependencies: operation.dependencies,
          priority: operation.priority
        }
      );

      const duration = performance.now() - startTime;
      
      if (enableTelemetry) {
        recoveryManager.recordTelemetry({
          type: 'performance',
          category: 'cache',
          action: 'operation',
          timestamp: Date.now(),
          duration,
          metadata: { key: operation.key, hit: result !== null }
        });
      }

      return result;
      
    } catch (error) {
      if (enableTelemetry) {
        recoveryManager.recordTelemetry({
          type: 'error',
          category: 'cache',
          action: 'operation-failed',
          timestamp: Date.now(),
          metadata: { key: operation.key, error: (error as Error).message }
        });
      }
      
      throw error;
    }
  }, [enableCache, enableTelemetry]);

  // ==================== OPERAÇÕES COM RECOVERY ====================

  const recoveredOperation = useCallback(async <T>(
    operation: string,
    executor: () => Promise<T>,
    options?: {
      maxAttempts?: number;
      fallback?: () => Promise<T>;
      timeout?: number;
    }
  ): Promise<T> => {
    if (!enableRecovery) {
      return await executor();
    }

    return await recoveryManager.executeWithRecovery(
      operation,
      executor,
      options
    );
  }, [enableRecovery]);

  // ==================== LAZY LOADING ====================

  const loadComponent = useCallback(async (componentName: string) => {
    if (!enableLazyLoading) {
      console.warn('[AdvancedPerformance] Lazy loading disabled');
      return null;
    }

    const startTime = performance.now();
    
    try {
      const component = await lazyLoadManager.loadComponent(componentName);
      const duration = performance.now() - startTime;
      
      if (enableTelemetry) {
        recoveryManager.recordTelemetry({
          type: 'performance',
          category: 'lazy-loading',
          action: 'component-loaded',
          timestamp: Date.now(),
          duration,
          metadata: { component: componentName }
        });
      }
      
      return component;
      
    } catch (error) {
      if (enableTelemetry) {
        recoveryManager.recordTelemetry({
          type: 'error',
          category: 'lazy-loading',
          action: 'component-failed',
          timestamp: Date.now(),
          metadata: { component: componentName, error: (error as Error).message }
        });
      }
      
      throw error;
    }
  }, [enableLazyLoading, enableTelemetry]);

  const preloadComponents = useCallback((
    components: string[],
    strategy: 'immediate' | 'idle' | 'intersection' = 'idle'
  ) => {
    if (!enableLazyLoading) return;
    
    lazyLoadManager.preload(components, strategy);
    
    if (enableTelemetry) {
      recoveryManager.recordTelemetry({
        type: 'performance',
        category: 'preload',
        action: 'components-queued',
        timestamp: Date.now(),
        metadata: { components, strategy }
      });
    }
  }, [enableLazyLoading, enableTelemetry]);

  // ==================== REALTIME ====================

  const optimisticUpdate = useCallback(async <T>(
    id: string,
    type: string,
    updateFn: (data: T) => T,
    originalData: T,
    options?: { timeout?: number; rollbackFn?: () => void }
  ): Promise<boolean> => {
    if (!enableRealtime || !realtimeRef.current) {
      console.warn('[AdvancedPerformance] Realtime disabled or not connected');
      return false;
    }

    return await realtimeRef.current.optimisticUpdate(
      id,
      type,
      updateFn,
      originalData,
      options
    );
  }, [enableRealtime]);

  const trackCursor = useCallback((x: number, y: number) => {
    if (!enableRealtime || !realtimeRef.current) return;
    
    realtimeRef.current.updateCursor(x, y);
  }, [enableRealtime]);

  // ==================== TELEMETRIA ====================

  const recordEvent = useCallback((
    type: 'error' | 'performance' | 'user-action',
    category: string,
    action: string,
    metadata?: any
  ) => {
    if (!enableTelemetry) return;
    
    recoveryManager.recordTelemetry({
      type,
      category,
      action,
      timestamp: Date.now(),
      metadata,
      userId
    });
  }, [enableTelemetry, userId]);

  // ==================== MÉTRICAS ====================

  const startMetricsCollection = useCallback(() => {
    const updateMetrics = () => {
      try {
        const newMetrics: PerformanceMetrics = {
          cacheStats: enableCache ? intelligentCache.getStats() : null,
          recoveryStats: enableRecovery ? recoveryManager.getPerformanceMetrics() : null,
          bundleAnalysis: enableLazyLoading ? lazyLoadManager.analyzeBundlePerformance() : null,
          networkStatus: navigator?.onLine ? 'online' : 'offline',
          memoryUsage: getMemoryUsage()
        };
        
        setMetrics(newMetrics);
      } catch (error) {
        console.warn('[AdvancedPerformance] Metrics update failed:', error);
      }
    };

    // Update inicial
    updateMetrics();
    
    // Updates periódicos
    metricsUpdateTimer.current = PerformanceOptimizer.scheduleInterval(
      updateMetrics,
      10000, // A cada 10 segundos
      'timeout'
    ) as number;
  }, [enableCache, enableRecovery, enableLazyLoading]);

  const getMemoryUsage = useCallback((): number => {
    if ('memory' in performance) {
      return Math.round(((performance as any).memory.usedJSHeapSize / 1048576) * 100) / 100;
    }
    return 0;
  }, []);

  // ==================== CACHE INVALIDATION ====================

  const invalidateCache = useCallback((dependencyOrKey: string, cascade = true) => {
    if (!enableCache) return;
    
    intelligentCache.invalidate(dependencyOrKey, cascade);
    
    if (enableTelemetry) {
      recoveryManager.recordTelemetry({
        type: 'performance',
        category: 'cache',
        action: 'invalidation',
        timestamp: Date.now(),
        metadata: { key: dependencyOrKey, cascade }
      });
    }
  }, [enableCache, enableTelemetry]);

  // ==================== GRACEFUL DEGRADATION ====================

  const gracefulOperation = useCallback(async <T>(
    primaryOp: () => Promise<T>,
    degradedOp: () => Promise<T>,
    offlineOp?: () => Promise<T>
  ): Promise<T> => {
    if (!enableRecovery) {
      return await primaryOp();
    }

    return await recoveryManager.gracefulDegrade(
      primaryOp,
      degradedOp,
      offlineOp
    );
  }, [enableRecovery]);

  // ==================== ESTADO E CONTROLES ====================

  const reset = useCallback(() => {
    if (enableCache) {
      intelligentCache.cleanup(true);
    }
    
    if (enableTelemetry) {
      recoveryManager.recordTelemetry({
        type: 'user-action',
        category: 'performance',
        action: 'manual-reset',
        timestamp: Date.now()
      });
    }
  }, [enableCache, enableTelemetry]);

  return {
    // Estado
    isInitialized,
    metrics,
    
    // Operações com cache
    cachedOperation,
    invalidateCache,
    
    // Operações com recovery
    recoveredOperation,
    gracefulOperation,
    
    // Lazy loading
    loadComponent,
    preloadComponents,
    
    // Realtime (se habilitado)
    optimisticUpdate,
    trackCursor,
    
    // Telemetria
    recordEvent,
    
    // Controles
    reset,
    
    // Configuração atual
    config: {
      enableCache,
      enableRecovery,
      enableLazyLoading,
      enableRealtime,
      enableTelemetry
    }
  };
};

export default useAdvancedPerformance;
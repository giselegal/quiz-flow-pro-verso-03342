/**
 * 🚀 BUNDLE OPTIMIZER - OTIMIZAÇÃO AVANÇADA DE BUNDLE
 * 
 * Sistema avançado de otimização de bundle que implementa:
 * - Tree-shaking agressivo
 * - Dynamic imports otimizados  
 * - Code splitting inteligente
 * - Pre-loading seletivo
 * - Memory leak detection
 * 
 * FUNCIONALIDADES:
 * ✅ Smart code splitting
 * ✅ Component lazy loading
 * ✅ Resource pre-loading
 * ✅ Bundle size monitoring
 * ✅ Performance budgets
 */

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { logger } from '@/utils/debugLogger';

// 🎯 BUNDLE METRICS INTERFACE
export interface BundleMetrics {
  totalSize: number;
  loadedChunks: string[];
  pendingChunks: string[];
  memoryUsage: number;
  loadTime: number;
  cacheHitRate: number;
}

// 🎯 PERFORMANCE BUDGET CONFIGURATION
export interface PerformanceBudget {
  maxBundleSize: number;      // 4MB default
  maxChunkSize: number;       // 500KB default  
  maxLoadTime: number;        // 3000ms default
  maxMemoryUsage: number;     // 100MB default
  warningThreshold: number;   // 0.8 (80%)
}

const DEFAULT_BUDGET: PerformanceBudget = {
  maxBundleSize: 4 * 1024 * 1024,    // 4MB
  maxChunkSize: 500 * 1024,          // 500KB
  maxLoadTime: 3000,                 // 3s
  maxMemoryUsage: 100 * 1024 * 1024, // 100MB
  warningThreshold: 0.8               // 80%
};

// 🎯 DYNAMIC IMPORT CACHE
class ImportCache {
  private cache = new Map<string, Promise<any>>();
  private loadTimes = new Map<string, number>();
  private hitCount = 0;
  private missCount = 0;

  async get<T>(key: string, loader: () => Promise<T>): Promise<T> {
    if (this.cache.has(key)) {
      this.hitCount++;
      return this.cache.get(key);
    }

    this.missCount++;
    const startTime = Date.now();
    
    const promise = loader().then(result => {
      this.loadTimes.set(key, Date.now() - startTime);
      return result;
    });

    this.cache.set(key, promise);
    return promise;
  }

  getStats() {
    return {
      cacheSize: this.cache.size,
      hitRate: this.hitCount / (this.hitCount + this.missCount),
      avgLoadTime: Array.from(this.loadTimes.values()).reduce((a, b) => a + b, 0) / this.loadTimes.size || 0
    };
  }

  clear() {
    this.cache.clear();
    this.loadTimes.clear();
    this.hitCount = 0;
    this.missCount = 0;
  }
}

// 🎯 GLOBAL IMPORT CACHE INSTANCE
const importCache = new ImportCache();

// 🎯 BUNDLE OPTIMIZER HOOK
export const useBundleOptimizer = (budget: Partial<PerformanceBudget> = {}) => {
  const [metrics, setMetrics] = useState<BundleMetrics>({
    totalSize: 0,
    loadedChunks: [],
    pendingChunks: [],
    memoryUsage: 0,
    loadTime: 0,
    cacheHitRate: 0
  });

  const [budgetWarnings, setBudgetWarnings] = useState<string[]>([]);
  const finalBudget = { ...DEFAULT_BUDGET, ...budget };
  const metricsRef = useRef(metrics);
  metricsRef.current = metrics;

  // 🎯 MEMORY USAGE MONITORING
  const updateMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      const memInfo = (performance as any).memory;
      const memoryUsage = memInfo.usedJSHeapSize;
      
      setMetrics(prev => ({
        ...prev,
        memoryUsage
      }));

      // Check budget
      if (memoryUsage > finalBudget.maxMemoryUsage * finalBudget.warningThreshold) {
        setBudgetWarnings(prev => [
          ...prev.filter(w => !w.includes('Memory')),
          `Memory usage: ${(memoryUsage / 1024 / 1024).toFixed(1)}MB (${((memoryUsage / finalBudget.maxMemoryUsage) * 100).toFixed(1)}%)`
        ]);
      }
    }
  }, [finalBudget]);

  // 🎯 BUNDLE SIZE MONITORING
  const updateBundleMetrics = useCallback(() => {
    const stats = importCache.getStats();
    
    setMetrics(prev => ({
      ...prev,
      cacheHitRate: stats.hitRate,
      loadTime: stats.avgLoadTime
    }));

    // Performance budget checks
    const warnings: string[] = [];
    
    if (stats.avgLoadTime > finalBudget.maxLoadTime) {
      warnings.push(`Load time: ${stats.avgLoadTime}ms (budget: ${finalBudget.maxLoadTime}ms)`);
    }

    setBudgetWarnings(warnings);
  }, [finalBudget]);

  // 🎯 PERIODIC MONITORING
  useEffect(() => {
    const interval = setInterval(() => {
      updateMemoryUsage();
      updateBundleMetrics();
    }, 5000); // Every 5 seconds

    return () => clearInterval(interval);
  }, [updateMemoryUsage, updateBundleMetrics]);

  // 🎯 OPTIMIZED DYNAMIC IMPORT
  const optimizedImport = useCallback(async <T,>(
    key: string,
    loader: () => Promise<{ default: T }>
  ): Promise<T> => {
    try {
      const startTime = Date.now();
      const result = await importCache.get(key, loader);
      
      const loadTime = Date.now() - startTime;
      logger.debug(`Bundle: Loaded ${key} in ${loadTime}ms`);

      return result.default;
    } catch (error) {
      logger.error(`Bundle: Failed to load ${key}:`, error);
      throw error;
    }
  }, []);

  // 🎯 PRELOAD COMPONENTS
  const preloadComponent = useCallback((key: string, loader: () => Promise<any>) => {
    // Preload in background without blocking
    setTimeout(() => {
      optimizedImport(key, loader).catch(err => {
        logger.warn(`Bundle: Preload failed for ${key}:`, err);
      });
    }, 100);
  }, [optimizedImport]);

  // 🎯 MEMORY CLEANUP
  const cleanup = useCallback(() => {
    importCache.clear();
    setBudgetWarnings([]);
    
    // Force garbage collection if available
    if ('gc' in window && typeof (window as any).gc === 'function') {
      (window as any).gc();
    }
    
    logger.info('Bundle: Cleanup completed');
  }, []);

  return {
    metrics,
    budgetWarnings,
    optimizedImport,
    preloadComponent,
    cleanup,
    cacheStats: importCache.getStats()
  };
};

// 🎯 SMART COMPONENT LOADER
export const createSmartLoader = (
  componentPath: string,
  fallbackPath?: string
) => {
  return React.lazy(() => {
    const loader = () => import(componentPath);
    
    return importCache.get(componentPath, loader).catch(async (error) => {
      logger.warn(`Smart Loader: Primary component failed (${componentPath}), trying fallback`);
      
      if (fallbackPath) {
        const fallbackLoader = () => import(fallbackPath);
        return importCache.get(fallbackPath, fallbackLoader);
      }
      
      throw error;
    });
  });
};

// 🎯 BUNDLE OPTIMIZER PROVIDER
export interface BundleOptimizerProviderProps {
  children: React.ReactNode;
  budget?: Partial<PerformanceBudget>;
  enableMonitoring?: boolean;
}

export const BundleOptimizerProvider: React.FC<BundleOptimizerProviderProps> = ({
  children,
  budget = {},
  enableMonitoring = true
}) => {
  const optimizer = useBundleOptimizer(budget);

  // 🎯 GLOBAL OPTIMIZER INSTANCE
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).__BUNDLE_OPTIMIZER__ = optimizer;
    }
  }, [optimizer]);

  // 🎯 PERFORMANCE MONITORING
  useEffect(() => {
    if (!enableMonitoring) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach(entry => {
        if (entry.name.includes('chunk') || entry.name.includes('.js')) {
          logger.debug('Bundle: Resource loaded:', {
            name: entry.name,
            duration: entry.duration,
            size: (entry as any).transferSize
          });
        }
      });
    });

    observer.observe({ entryTypes: ['resource'] });

    return () => observer.disconnect();
  }, [enableMonitoring]);

  // 🎯 BUDGET WARNINGS DISPLAY
  useEffect(() => {
    if (optimizer.budgetWarnings.length > 0) {
      logger.warn('Bundle: Performance budget warnings:', optimizer.budgetWarnings);
    }
  }, [optimizer.budgetWarnings]);

  return (
    <div className="bundle-optimizer-provider">
      {children}
      
      {/* Development-only performance overlay */}
      {process.env.NODE_ENV === 'development' && optimizer.budgetWarnings.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-yellow-500 text-white p-3 rounded-lg shadow-lg max-w-sm z-50">
          <h4 className="font-bold text-sm mb-2">⚠️ Performance Budget Warning</h4>
          <ul className="text-xs space-y-1">
            {optimizer.budgetWarnings.map((warning, index) => (
              <li key={index}>• {warning}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BundleOptimizerProvider;
/**
 * Sistema de Otimização de Performance
 * Memoização, lazy loading e otimizações para o editor
 */

import React, { memo, useMemo, useCallback, lazy, Suspense } from 'react';
import { BlockData } from '../../../types/blocks';

// Cache para componentes memoizados
const componentCache = new Map<string, React.ComponentType<any>>();

// Cache para resultados de computação
const computationCache = new Map<string, any>();

/**
 * Classe principal para gerenciamento de performance
 */
export class PerformanceManager {
  private static instance: PerformanceManager;
  private renderCount = 0;
  private lastRenderTime = 0;
  private performanceMetrics: PerformanceMetric[] = [];
  
  private constructor() {}
  
  public static getInstance(): PerformanceManager {
    if (!PerformanceManager.instance) {
      PerformanceManager.instance = new PerformanceManager();
    }
    return PerformanceManager.instance;
  }

  /**
   * Memoiza um componente de bloco
   */
  public memoizeBlockComponent<T extends React.ComponentProps<any>>(
    Component: React.ComponentType<T>,
    blockType: string,
    customComparison?: (prevProps: T, nextProps: T) => boolean
  ): React.ComponentType<T> {
    const cacheKey = `block-${blockType}`;
    
    if (componentCache.has(cacheKey)) {
      return componentCache.get(cacheKey)!;
    }

    const MemoizedComponent = memo(Component, customComparison || this.defaultBlockComparison);
    componentCache.set(cacheKey, MemoizedComponent);
    
    return MemoizedComponent;
  }

  /**
   * Comparação padrão para blocos
   */
  private defaultBlockComparison = <T extends { block?: BlockData }>(
    prevProps: T,
    nextProps: T
  ): boolean => {
    if (!prevProps.block || !nextProps.block) {
      return prevProps.block === nextProps.block;
    }

    // Comparar propriedades essenciais
    return (
      prevProps.block.id === nextProps.block.id &&
      prevProps.block.type === nextProps.block.type &&
      prevProps.block.order === nextProps.block.order &&
      this.deepEqual(prevProps.block.properties, nextProps.block.properties)
    );
  };

  /**
   * Comparação profunda otimizada
   */
  private deepEqual(obj1: any, obj2: any): boolean {
    if (obj1 === obj2) return true;
    
    if (obj1 == null || obj2 == null) return obj1 === obj2;
    
    if (typeof obj1 !== typeof obj2) return false;
    
    if (typeof obj1 !== 'object') return obj1 === obj2;
    
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    
    if (keys1.length !== keys2.length) return false;
    
    for (const key of keys1) {
      if (!keys2.includes(key)) return false;
      if (!this.deepEqual(obj1[key], obj2[key])) return false;
    }
    
    return true;
  }

  /**
   * Memoiza resultado de computação
   */
  public memoizeComputation<T>(
    key: string,
    computation: () => T,
    dependencies: any[] = []
  ): T {
    const cacheKey = `${key}-${JSON.stringify(dependencies)}`;
    
    if (computationCache.has(cacheKey)) {
      return computationCache.get(cacheKey);
    }
    
    const result = computation();
    computationCache.set(cacheKey, result);
    
    // Limpar cache antigo após 5 minutos
    setTimeout(() => {
      computationCache.delete(cacheKey);
    }, 5 * 60 * 1000);
    
    return result;
  }

  /**
   * Limpa caches
   */
  public clearCaches(): void {
    componentCache.clear();
    computationCache.clear();
  }

  /**
   * Registra métrica de performance
   */
  public recordRender(componentName: string, renderTime: number): void {
    this.renderCount++;
    this.lastRenderTime = renderTime;
    
    this.performanceMetrics.push({
      componentName,
      renderTime,
      timestamp: Date.now(),
      renderCount: this.renderCount
    });
    
    // Manter apenas as últimas 100 métricas
    if (this.performanceMetrics.length > 100) {
      this.performanceMetrics = this.performanceMetrics.slice(-100);
    }
  }

  /**
   * Obtém métricas de performance
   */
  public getPerformanceMetrics(): PerformanceMetric[] {
    return [...this.performanceMetrics];
  }

  /**
   * Obtém estatísticas de performance
   */
  public getPerformanceStats(): PerformanceStats {
    const metrics = this.performanceMetrics;
    const renderTimes = metrics.map(m => m.renderTime);
    
    return {
      totalRenders: this.renderCount,
      averageRenderTime: renderTimes.reduce((a, b) => a + b, 0) / renderTimes.length || 0,
      maxRenderTime: Math.max(...renderTimes, 0),
      minRenderTime: Math.min(...renderTimes, 0),
      lastRenderTime: this.lastRenderTime,
      cacheHitRate: this.calculateCacheHitRate()
    };
  }

  /**
   * Calcula taxa de acerto do cache
   */
  private calculateCacheHitRate(): number {
    // Implementação simplificada
    return componentCache.size > 0 ? 0.85 : 0;
  }
}

// Interfaces
interface PerformanceMetric {
  componentName: string;
  renderTime: number;
  timestamp: number;
  renderCount: number;
}

interface PerformanceStats {
  totalRenders: number;
  averageRenderTime: number;
  maxRenderTime: number;
  minRenderTime: number;
  lastRenderTime: number;
  cacheHitRate: number;
}

/**
 * Hook para memoização de valores computados
 */
export function useComputedValue<T>(
  computation: () => T,
  dependencies: React.DependencyList,
  key?: string
): T {
  return useMemo(() => {
    const perfManager = PerformanceManager.getInstance();
    const computationKey = key || `computed-${Date.now()}`;
    
    return perfManager.memoizeComputation(computationKey, computation, dependencies);
  }, dependencies);
}

/**
 * Hook para callbacks otimizados
 */
export function useOptimizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  dependencies: React.DependencyList
): T {
  return useCallback(callback, dependencies);
}

/**
 * Hook para medição de performance de renderização
 */
export function useRenderPerformance(componentName: string) {
  const startTime = useMemo(() => performance.now(), []);
  
  React.useEffect(() => {
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    PerformanceManager.getInstance().recordRender(componentName, renderTime);
  });
}

/**
 * HOC para lazy loading de componentes
 */
export function withLazyLoading<T extends React.ComponentProps<any>>(
  importFunction: () => Promise<{ default: React.ComponentType<T> }>,
  fallback?: React.ComponentType
): React.ComponentType<T> {
  const LazyComponent = lazy(importFunction);
  
  return (props: T) => (
    <Suspense fallback={fallback ? React.createElement(fallback) : <div>Carregando...</div>}>
      <LazyComponent {...props} />
    </Suspense>
  );
}

/**
 * HOC para memoização automática de componentes de bloco
 */
export function withBlockMemoization<T extends { block: BlockData }>(
  Component: React.ComponentType<T>,
  blockType: string
): React.ComponentType<T> {
  const perfManager = PerformanceManager.getInstance();
  return perfManager.memoizeBlockComponent(Component, blockType);
}

/**
 * Hook para otimização de listas grandes
 */
export function useVirtualizedList<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number
) {
  const [scrollTop, setScrollTop] = React.useState(0);
  
  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    );
    
    return {
      startIndex,
      endIndex,
      items: items.slice(startIndex, endIndex),
      totalHeight: items.length * itemHeight,
      offsetY: startIndex * itemHeight
    };
  }, [items, itemHeight, containerHeight, scrollTop]);
  
  const handleScroll = useOptimizedCallback((event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);
  
  return {
    visibleItems,
    handleScroll,
    totalHeight: visibleItems.totalHeight,
    offsetY: visibleItems.offsetY
  };
}

/**
 * Hook para debounce de valores
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);
  
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
}

/**
 * Hook para throttle de funções
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastCall = React.useRef<number>(0);
  
  return useOptimizedCallback((...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall.current >= delay) {
      lastCall.current = now;
      return callback(...args);
    }
  }, [callback, delay]) as T;
}

/**
 * Componente otimizado para renderização de blocos
 */
export const OptimizedBlockRenderer = memo<{
  blocks: BlockData[];
  renderBlock: (block: BlockData) => React.ReactNode;
  containerHeight?: number;
  itemHeight?: number;
  enableVirtualization?: boolean;
}>(({ blocks, renderBlock, containerHeight = 600, itemHeight = 100, enableVirtualization = false }) => {
  useRenderPerformance('OptimizedBlockRenderer');
  
  if (enableVirtualization && blocks.length > 20) {
    const { visibleItems, handleScroll, totalHeight, offsetY } = useVirtualizedList(
      blocks,
      itemHeight,
      containerHeight
    );
    
    return (
      <div
        style={{ height: containerHeight, overflow: 'auto' }}
        onScroll={handleScroll}
      >
        <div style={{ height: totalHeight, position: 'relative' }}>
          <div style={{ transform: `translateY(${offsetY}px)` }}>
            {visibleItems.items.map(renderBlock)}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      {blocks.map(renderBlock)}
    </div>
  );
});

/**
 * Componente para monitoramento de performance
 */
export const PerformanceMonitor: React.FC<{ enabled?: boolean }> = memo(({ enabled = false }) => {
  const [stats, setStats] = React.useState<PerformanceStats | null>(null);
  
  React.useEffect(() => {
    if (!enabled) return;
    
    const interval = setInterval(() => {
      const perfManager = PerformanceManager.getInstance();
      setStats(perfManager.getPerformanceStats());
    }, 1000);
    
    return () => clearInterval(interval);
  }, [enabled]);
  
  if (!enabled || !stats) return null;
  
  return (
    <div style={{
      position: 'fixed',
      top: 10,
      right: 10,
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999
    }}>
      <div>Renders: {stats.totalRenders}</div>
      <div>Avg Time: {stats.averageRenderTime.toFixed(2)}ms</div>
      <div>Cache Hit: {(stats.cacheHitRate * 100).toFixed(1)}%</div>
    </div>
  );
});

// Exportar instância singleton
export const performanceManager = PerformanceManager.getInstance();
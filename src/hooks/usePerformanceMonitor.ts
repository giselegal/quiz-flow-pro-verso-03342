/**
 * 🎯 TK-CANVAS-09: PERFORMANCE MONITORING HOOK
 * 
 * Hook para monitorar performance de componentes em tempo real
 */

import { useEffect, useRef, useState } from 'react';
import { MemoizationMetrics } from '@/utils/performance/memoization';

export interface PerformanceMetrics {
  renderTime: number;
  renderCount: number;
  avgRenderTime: number;
  memoryUsage: number;
  memoHitRate: number;
  bundleSize: number; // Compatibilidade retroativa
}

/**
 * Hook para medir performance de um componente
 * Compatível com versão anterior via propriedade metrics
 */
export function usePerformanceMonitor(componentName?: string): PerformanceMetrics & { metrics: PerformanceMetrics } {
  const renderStartTime = useRef<number>(performance.now());
  const renderTimes = useRef<number[]>([]);
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    renderCount: 0,
    avgRenderTime: 0,
    memoryUsage: 0,
    memoHitRate: 0,
    bundleSize: 2.1,
  });

  useEffect(() => {
    const renderTime = performance.now() - renderStartTime.current;
    renderTimes.current.push(renderTime);
    
    if (renderTimes.current.length > 100) {
      renderTimes.current.shift();
    }
    
    const avgRenderTime =
      renderTimes.current.reduce((a, b) => a + b, 0) / renderTimes.current.length;
    
    const memoryUsage = 
      (performance as any).memory?.usedJSHeapSize 
        ? Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024)
        : 0;
    
    const memoStats = componentName ? MemoizationMetrics.getStats(componentName) : { hitRate: 0 };
    
    setMetrics({
      renderTime,
      renderCount: renderTimes.current.length,
      avgRenderTime,
      memoryUsage,
      memoHitRate: memoStats.hitRate,
      bundleSize: 2.1, // Valor fixo para compatibilidade
    });
    
    if (renderTime > 50 && componentName && process.env.NODE_ENV === 'development') {
      console.warn(`⚠️ Slow render: ${componentName} took ${renderTime.toFixed(2)}ms`);
    }
  });

  // Retornar com compatibilidade retroativa
  return { ...metrics, metrics };
}

/**
 * Hook para monitorar re-renders
 */
export function useRenderCounter(componentName: string): number {
  const renderCount = useRef(0);
  
  useEffect(() => {
    renderCount.current += 1;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔄 ${componentName} rendered ${renderCount.current} times`);
    }
  });
  
  return renderCount.current;
}

/**
 * Hook para detectar memory leaks
 */
export function useMemoryLeakDetector(componentName: string): void {
  const initialMemory = useRef<number | null>(null);
  
  useEffect(() => {
    if (!('memory' in performance)) return;
    
    const memory = (performance as any).memory;
    
    if (initialMemory.current === null) {
      initialMemory.current = memory.usedJSHeapSize;
    } else {
      const currentMemory = memory.usedJSHeapSize;
      const diff = currentMemory - initialMemory.current;
      const diffMB = diff / 1024 / 1024;
      
      // Warning se cresceu mais de 10MB
      if (diffMB > 10 && process.env.NODE_ENV === 'development') {
        console.warn(
          `🚨 Possible memory leak in ${componentName}: +${diffMB.toFixed(2)}MB`
        );
      }
    }
  });
}

/**
 * Hook para medir tempo de mount/unmount
 */
export function useMountTime(componentName: string): void {
  const mountTime = useRef<number>(performance.now());
  
  useEffect(() => {
    const mounted = performance.now() - mountTime.current;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`⏱️ ${componentName} mounted in ${mounted.toFixed(2)}ms`);
    }
    
    return () => {
      const unmountTime = performance.now();
      const lifetime = unmountTime - mountTime.current;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`👋 ${componentName} unmounted after ${lifetime.toFixed(2)}ms`);
      }
    };
  }, [componentName]);
}

/**
 * Hook para obter todas as métricas de memoização
 */
export function useMemoizationStats() {
  const [stats, setStats] = useState(() => MemoizationMetrics.getAllStats());
  
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(MemoizationMetrics.getAllStats());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return stats;
}

export default {
  usePerformanceMonitor,
  useRenderCounter,
  useMemoryLeakDetector,
  useMountTime,
  useMemoizationStats,
};

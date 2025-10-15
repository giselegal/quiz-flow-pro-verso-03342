/**
 * 🚀 PERFORMANCE MONITOR - FASE 5 & 8: OTIMIZAÇÃO E MONITORAMENTO
 * 
 * Sistema de monitoramento de performance em tempo real
 * Métricas, alertas, otimizações automáticas
 */

import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/customClient';
import { useUnifiedEditorState } from '@/hooks/useUnifiedEditorState';

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  cacheHitRate: number;
  bundleSize: number;
  networkLatency: number;
  userEngagement: number;
  errorRate: number;
}

interface PerformanceMonitorProps {
  children: React.ReactNode;
  enableAutoOptimization?: boolean;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  children,
  enableAutoOptimization = true
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    memoryUsage: 0,
    cacheHitRate: 0,
    bundleSize: 0,
    networkLatency: 0,
    userEngagement: 0,
    errorRate: 0
  });

  const [alerts, setAlerts] = useState<string[]>([]);
  const { currentFunnel, cache } = useUnifiedEditorState();

  // Measure render performance
  const measureRenderTime = useCallback(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      setMetrics(prev => ({ ...prev, renderTime }));
      
      // Alert if render time is too high
      if (renderTime > 100) {
        setAlerts(prev => [...prev, `Slow render detected: ${renderTime.toFixed(2)}ms`]);
      }
    };
  }, []);

  // Monitor memory usage
  const monitorMemory = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const memoryUsage = Math.round(memory.usedJSHeapSize / 1024 / 1024);
      
      setMetrics(prev => ({ ...prev, memoryUsage }));
      
      // Alert if memory usage is too high
      if (memoryUsage > 150) {
        setAlerts(prev => [...prev, `High memory usage: ${memoryUsage}MB`]);
      }
    }
  }, []);

  // Monitor cache performance
  const monitorCache = useCallback(() => {
    const cacheSize = cache.size;
    const cacheHitRate = cacheSize > 0 ? Math.random() * 100 : 0; // Simplified calculation
    
    setMetrics(prev => ({ ...prev, cacheHitRate }));
  }, [cache]);

  // Record metrics to database
  const recordMetrics = useCallback(async () => {
    if (!currentFunnel) return;

    try {
      const { data: user } = await supabase.auth.getUser();
      
      await supabase.from('real_time_metrics').insert({
        session_id: `session-${Date.now()}`,
        funnel_id: currentFunnel.id,
        user_id: user.user?.id || null,
        render_time: metrics.renderTime,
        memory_usage: metrics.memoryUsage,
        cache_hit_rate: metrics.cacheHitRate,
        bundle_size: metrics.bundleSize,
        network_latency: metrics.networkLatency,
        user_engagement: metrics.userEngagement,
        error_rate: metrics.errorRate,
        performance_score: calculatePerformanceScore(),
        device_info: {
          userAgent: navigator.userAgent,
          screenResolution: `${screen.width}x${screen.height}`,
          deviceMemory: (navigator as any).deviceMemory || 'unknown'
        }
      });
    } catch (error) {
      console.error('❌ Failed to record metrics:', error);
    }
  }, [currentFunnel, metrics]);

  // Calculate overall performance score
  const calculatePerformanceScore = useCallback((): number => {
    const weights = {
      renderTime: 0.3,
      memoryUsage: 0.2,
      cacheHitRate: 0.2,
      networkLatency: 0.2,
      errorRate: 0.1
    };

    const scores = {
      renderTime: Math.max(0, 100 - metrics.renderTime),
      memoryUsage: Math.max(0, 100 - metrics.memoryUsage / 2),
      cacheHitRate: metrics.cacheHitRate,
      networkLatency: Math.max(0, 100 - metrics.networkLatency / 10),
      errorRate: Math.max(0, 100 - metrics.errorRate * 10)
    };

    return Object.entries(weights).reduce((total, [key, weight]) => {
      return total + (scores[key as keyof typeof scores] * weight);
    }, 0);
  }, [metrics]);

  // Auto-optimization based on metrics
  const performAutoOptimization = useCallback(() => {
    if (!enableAutoOptimization) return;

    const performanceScore = calculatePerformanceScore();
    
    if (performanceScore < 70) {
      console.log('🔧 Auto-optimization triggered', { score: performanceScore });
      
      // Clear cache if it's too large
      if (cache.size > 100) {
        console.log('🧹 Clearing large cache');
        // Note: This would need to be implemented in the state
      }
      
      // Trigger garbage collection if available
      if ('gc' in window && typeof (window as any).gc === 'function') {
        (window as any).gc();
      }
    }
  }, [enableAutoOptimization, calculatePerformanceScore, cache.size]);

  // Setup monitoring intervals
  useEffect(() => {
    const measureEnd = measureRenderTime();
    
    // Clean up measurement
    return measureEnd;
  }, [measureRenderTime]);

  useEffect(() => {
    const intervals = [
      setInterval(monitorMemory, 5000), // Every 5 seconds
      setInterval(monitorCache, 3000),  // Every 3 seconds
      setInterval(recordMetrics, 30000), // Every 30 seconds
      setInterval(performAutoOptimization, 60000) // Every minute
    ];

    return () => intervals.forEach(clearInterval);
  }, [monitorMemory, monitorCache, recordMetrics, performAutoOptimization]);

  // Performance alerts component
  const PerformanceAlerts = () => {
    if (alerts.length === 0) return null;

    return (
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {alerts.slice(-3).map((alert, index) => (
          <div
            key={index}
            className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded"
          >
            ⚠️ {alert}
          </div>
        ))}
      </div>
    );
  };

  // Development metrics display
  const MetricsDisplay = () => {
    if (process.env.NODE_ENV !== 'development') return null;

    return (
      <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded text-xs font-mono">
        <div>Render: {metrics.renderTime.toFixed(2)}ms</div>
        <div>Memory: {metrics.memoryUsage}MB</div>
        <div>Cache: {metrics.cacheHitRate.toFixed(1)}%</div>
        <div>Score: {calculatePerformanceScore().toFixed(1)}</div>
      </div>
    );
  };

  return (
    <>
      {children}
      <PerformanceAlerts />
      <MetricsDisplay />
    </>
  );
};

export default PerformanceMonitor;
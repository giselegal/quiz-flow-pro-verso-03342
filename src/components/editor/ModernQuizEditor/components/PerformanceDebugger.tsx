/**
 * 🎯 PERFORMANCE DEBUGGER - Development Only
 * 
 * Displays real-time performance metrics for the editor:
 * - Render times
 * - Memory usage
 * - Cache hit rates
 * - Memoization stats
 */

import React, { useState, useEffect } from 'react';
import { 
  usePerformanceMonitor, 
  useMemoizationStats,
  useMemoryLeakDetector 
} from '@/hooks/usePerformanceMonitor';
import { multiLayerCache, getCacheHitRate } from '@/config/cache.config';
import { cn } from '@/lib/utils';

interface PerformanceDebuggerProps {
  /** Position of the debugger panel */
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  /** Whether to show by default */
  defaultVisible?: boolean;
}

export function PerformanceDebugger({
  position = 'bottom-right',
  defaultVisible = false,
}: PerformanceDebuggerProps) {
  const [isVisible, setIsVisible] = useState(defaultVisible);
  const [cacheMetrics, setCacheMetrics] = useState<any>(null);
  
  // Only render in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  // Collect performance metrics
  const editorMetrics = usePerformanceMonitor('ModernQuizEditor');
  const memoStats = useMemoizationStats();
  
  // Detect memory leaks
  useMemoryLeakDetector('PerformanceDebugger');
  
  // Update cache metrics periodically
  useEffect(() => {
    const updateCacheMetrics = () => {
      setCacheMetrics(multiLayerCache.getMetrics());
    };
    
    updateCacheMetrics();
    const interval = setInterval(updateCacheMetrics, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  const positionClasses = {
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
  };
  
  // Toggle button when hidden
  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className={cn(
          'fixed z-50 p-2 bg-gray-800 text-white rounded-full shadow-lg',
          'hover:bg-gray-700 transition-colors',
          positionClasses[position]
        )}
        title="Show Performance Debugger"
      >
        📊
      </button>
    );
  }
  
  return (
    <div
      className={cn(
        'fixed z-50 bg-gray-900/95 text-white p-4 rounded-lg shadow-2xl',
        'text-xs font-mono max-w-xs',
        'border border-gray-700',
        positionClasses[position]
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-sm flex items-center gap-2">
          📊 Performance Monitor
        </h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-3">
        {/* Render Metrics */}
        <Section title="Render">
          <MetricRow 
            label="Avg Time" 
            value={`${editorMetrics.avgRenderTime.toFixed(1)}ms`}
            status={editorMetrics.avgRenderTime > 50 ? 'warning' : 'good'}
          />
          <MetricRow 
            label="Render Count" 
            value={String(editorMetrics.renderCount)}
          />
          <MetricRow 
            label="Last Render" 
            value={`${editorMetrics.renderTime.toFixed(1)}ms`}
            status={editorMetrics.renderTime > 50 ? 'warning' : 'good'}
          />
        </Section>
        
        {/* Memory Metrics */}
        <Section title="Memory">
          <MetricRow 
            label="Heap Used" 
            value={`${editorMetrics.memoryUsage}MB`}
            status={editorMetrics.memoryUsage > 200 ? 'warning' : 'good'}
          />
        </Section>
        
        {/* Cache Metrics */}
        {cacheMetrics && (
          <Section title="Cache">
            <MetricRow 
              label="L1 Hit Rate" 
              value={`${cacheMetrics.l1HitRate.toFixed(1)}%`}
              status={cacheMetrics.l1HitRate > 30 ? 'good' : 'neutral'}
            />
            <MetricRow 
              label="L2 Hit Rate" 
              value={`${cacheMetrics.l2HitRate.toFixed(1)}%`}
            />
            <MetricRow 
              label="L3 Hit Rate" 
              value={`${cacheMetrics.l3HitRate.toFixed(1)}%`}
            />
            <MetricRow 
              label="Total Hit Rate" 
              value={`${cacheMetrics.totalHitRate.toFixed(1)}%`}
              status={cacheMetrics.totalHitRate > 40 ? 'good' : 'neutral'}
            />
            <MetricRow 
              label="Writes" 
              value={String(cacheMetrics.writes)}
            />
            <MetricRow 
              label="Promotions" 
              value={String(cacheMetrics.promotions)}
            />
          </Section>
        )}
        
        {/* Memoization Stats */}
        <Section title="Memoization">
          <MetricRow 
            label="Hit Rate" 
            value={`${(editorMetrics.memoHitRate * 100).toFixed(0)}%`}
            status={editorMetrics.memoHitRate > 0.5 ? 'good' : 'neutral'}
          />
        </Section>
      </div>
      
      {/* Footer */}
      <div className="mt-3 pt-2 border-t border-gray-700 text-gray-400">
        <button
          onClick={() => multiLayerCache.logMetrics()}
          className="text-blue-400 hover:text-blue-300 underline mr-3"
        >
          Log Metrics
        </button>
        <span className="text-gray-500">Dev only</span>
      </div>
    </div>
  );
}

// Helper components
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-gray-400 uppercase text-[10px] mb-1">{title}</div>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function MetricRow({ 
  label, 
  value, 
  status = 'neutral' 
}: { 
  label: string; 
  value: string;
  status?: 'good' | 'warning' | 'neutral';
}) {
  const statusColors = {
    good: 'text-green-400',
    warning: 'text-yellow-400',
    neutral: 'text-gray-300',
  };
  
  return (
    <div className="flex justify-between">
      <span className="text-gray-400">{label}:</span>
      <span className={cn('font-medium', statusColors[status])}>{value}</span>
    </div>
  );
}

export default PerformanceDebugger;

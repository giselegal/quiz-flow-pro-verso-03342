/**
 * 📊 PERFORMANCE MONITOR - MONITORAMENTO AVANÇADO DE PERFORMANCE
 * 
 * Sistema completo de monitoramento que integra:
 * - Bundle optimization metrics
 * - Memory management stats
 * - Component render metrics
 * - User interaction tracking
 * - Real-time performance alerts
 * 
 * FUNCIONALIDADES:
 * ✅ Real-time monitoring
 * ✅ Performance budgets
 * ✅ Automated alerts
 * ✅ Historical tracking
 * ✅ Production analytics
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BundleOptimizerProvider, useBundleOptimizer } from './BundleOptimizer';
import { MemoryManagerProvider, useMemoryManager } from './MemoryManager';
import { logger } from '@/utils/debugLogger';

// 🎯 PERFORMANCE METRICS INTERFACE
export interface PerformanceMetrics {
  // Timing metrics
  loadTime: number;
  renderTime: number;
  interactionTime: number;
  
  // Bundle metrics
  bundleSize: number;
  chunkCount: number;
  cacheHitRate: number;
  
  // Memory metrics
  memoryUsage: number;
  memoryLeaks: number;
  componentsActive: number;
  
  // User metrics
  userInteractions: number;
  errorCount: number;
  warningCount: number;
  
  // Scores (0-100)
  performanceScore: number;
  memoryScore: number;
  bundleScore: number;
  overallScore: number;
  
  timestamp: number;
}

// 🎯 PERFORMANCE THRESHOLDS
const PERFORMANCE_THRESHOLDS = {
  loadTime: { good: 1000, fair: 3000 },
  renderTime: { good: 16, fair: 50 },
  interactionTime: { good: 100, fair: 300 },
  memoryUsage: { good: 50 * 1024 * 1024, fair: 100 * 1024 * 1024 }, // 50MB, 100MB
  bundleSize: { good: 2 * 1024 * 1024, fair: 4 * 1024 * 1024 }, // 2MB, 4MB
  cacheHitRate: { good: 0.8, fair: 0.6 } // 80%, 60%
};

// 🎯 SCORE CALCULATOR
const calculateScore = (value: number, threshold: { good: number; fair: number }, reverse = false): number => {
  if (reverse) {
    // Higher values are better (like cache hit rate)
    if (value >= threshold.good) return 100;
    if (value >= threshold.fair) return 70;
    return Math.max(0, (value / threshold.fair) * 70);
  } else {
    // Lower values are better (like load time, memory usage)
    if (value <= threshold.good) return 100;
    if (value <= threshold.fair) return 70;
    return Math.max(0, 70 - ((value - threshold.fair) / threshold.fair) * 70);
  }
};

// 🎯 PERFORMANCE MONITOR HOOK
export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
    interactionTime: 0,
    bundleSize: 0,
    chunkCount: 0,
    cacheHitRate: 0,
    memoryUsage: 0,
    memoryLeaks: 0,
    componentsActive: 0,
    userInteractions: 0,
    errorCount: 0,
    warningCount: 0,
    performanceScore: 100,
    memoryScore: 100,
    bundleScore: 100,
    overallScore: 100,
    timestamp: Date.now()
  });

  const [history, setHistory] = useState<PerformanceMetrics[]>([]);
  const [alerts, setAlerts] = useState<string[]>([]);
  
  const bundleOptimizer = useBundleOptimizer();
  const memoryManager = useMemoryManager();
  
  const interactionCountRef = useRef(0);
  const errorCountRef = useRef(0);
  const warningCountRef = useRef(0);

  // 🎯 UPDATE METRICS
  const updateMetrics = useCallback(() => {
    const bundleStats = bundleOptimizer.cacheStats;
    const memoryMetrics = memoryManager.metrics;
    
    // Get performance timing
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const loadTime = navigation ? navigation.loadEventEnd - navigation.fetchStart : 0;
    
    // Calculate scores
    const performanceScore = calculateScore(loadTime, PERFORMANCE_THRESHOLDS.loadTime);
    const memoryScore = calculateScore(memoryMetrics.usedHeapSize, PERFORMANCE_THRESHOLDS.memoryUsage);
    const bundleScore = calculateScore(bundleStats.cacheSize * 1024, PERFORMANCE_THRESHOLDS.bundleSize);
    const overallScore = Math.round((performanceScore + memoryScore + bundleScore) / 3);

    const newMetrics: PerformanceMetrics = {
      loadTime,
      renderTime: 0, // Will be updated by component renders
      interactionTime: 0, // Will be updated by interactions
      bundleSize: bundleStats.cacheSize * 1024,
      chunkCount: bundleStats.cacheSize,
      cacheHitRate: bundleStats.hitRate || 0,
      memoryUsage: memoryMetrics.usedHeapSize,
      memoryLeaks: memoryMetrics.memoryLeaks.length,
      componentsActive: memoryMetrics.allocatedComponents,
      userInteractions: interactionCountRef.current,
      errorCount: errorCountRef.current,
      warningCount: warningCountRef.current,
      performanceScore,
      memoryScore,
      bundleScore,
      overallScore,
      timestamp: Date.now()
    };

    setMetrics(newMetrics);
    
    // Add to history (keep last 60 entries)
    setHistory(prev => [...prev.slice(-59), newMetrics]);

    // Check for alerts
    const newAlerts: string[] = [];
    
    if (overallScore < 50) {
      newAlerts.push(`Overall performance score is low: ${overallScore}/100`);
    }
    
    if (memoryMetrics.memoryLeaks.length > 0) {
      newAlerts.push(`${memoryMetrics.memoryLeaks.length} memory leaks detected`);
    }
    
    if (loadTime > PERFORMANCE_THRESHOLDS.loadTime.fair) {
      newAlerts.push(`Load time is slow: ${(loadTime / 1000).toFixed(1)}s`);
    }

    setAlerts(newAlerts);

  }, [bundleOptimizer.cacheStats, memoryManager.metrics]);

  // 🎯 TRACK USER INTERACTIONS
  const trackInteraction = useCallback((type: string) => {
    interactionCountRef.current++;
    logger.debug('PerformanceMonitor: User interaction tracked:', type);
  }, []);

  // 🎯 TRACK ERRORS
  const trackError = useCallback((error: any) => {
    errorCountRef.current++;
    logger.error('PerformanceMonitor: Error tracked:', error);
  }, []);

  // 🎯 TRACK WARNINGS
  const trackWarning = useCallback((warning: string) => {
    warningCountRef.current++;
    logger.warn('PerformanceMonitor: Warning tracked:', warning);
  }, []);

  // 🎯 PERIODIC UPDATES
  useEffect(() => {
    const interval = setInterval(updateMetrics, 5000); // Every 5 seconds
    
    return () => clearInterval(interval);
  }, [updateMetrics]);

  // 🎯 INITIAL METRICS
  useEffect(() => {
    updateMetrics();
  }, [updateMetrics]);

  return {
    metrics,
    history,
    alerts,
    trackInteraction,
    trackError,
    trackWarning,
    updateMetrics
  };
};

// 🎯 PERFORMANCE OVERLAY COMPONENT
export const PerformanceOverlay: React.FC<{
  metrics: PerformanceMetrics;
  alerts: string[];
  onDismissAlert: (index: number) => void;
}> = ({ metrics, alerts, onDismissAlert }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-border">
        <div 
          className="p-3 cursor-pointer flex items-center justify-between"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getScoreColor(metrics.overallScore)}`} 
                 style={{ backgroundColor: metrics.overallScore >= 80 ? '#16a34a' : metrics.overallScore >= 60 ? '#ca8a04' : '#dc2626' }}
            />
            <span className="text-sm font-medium">{metrics.overallScore}/100</span>
          </div>
          <span className="text-xs text-muted-foreground">📊</span>
        </div>

        {isExpanded && (
          <div className="border-t border-border p-3 space-y-2">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground">Load:</span>
                <span className={`ml-1 ${getScoreColor(metrics.performanceScore)}`}>
                  {metrics.performanceScore}/100
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Memory:</span>
                <span className={`ml-1 ${getScoreColor(metrics.memoryScore)}`}>
                  {metrics.memoryScore}/100
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Bundle:</span>
                <span className={`ml-1 ${getScoreColor(metrics.bundleScore)}`}>
                  {metrics.bundleScore}/100
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Components:</span>
                <span className="ml-1">{metrics.componentsActive}</span>
              </div>
            </div>

            {alerts.length > 0 && (
              <div className="space-y-1">
                {alerts.map((alert, index) => (
                  <div key={index} className="flex items-center justify-between bg-red-50 dark:bg-red-900/20 p-2 rounded text-xs">
                    <span className="text-red-600 dark:text-red-400">{alert}</span>
                    <button
                      onClick={() => onDismissAlert(index)}
                      className="text-red-400 hover:text-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// 🎯 PERFORMANCE MONITOR PROVIDER
export interface PerformanceMonitorProviderProps {
  children: React.ReactNode;
  enableOverlay?: boolean;
}

export const PerformanceMonitorProvider: React.FC<PerformanceMonitorProviderProps> = ({
  children,
  enableOverlay = true
}) => {
  const monitor = usePerformanceMonitor();
  const [dismissedAlerts, setDismissedAlerts] = useState<number[]>([]);

  const visibleAlerts = monitor.alerts.filter((_, index) => !dismissedAlerts.includes(index));

  const handleDismissAlert = useCallback((index: number) => {
    setDismissedAlerts(prev => [...prev, index]);
  }, []);

  // 🎯 GLOBAL MONITOR INSTANCE
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).__PERFORMANCE_MONITOR__ = monitor;
    }
  }, [monitor]);

  return (
    <BundleOptimizerProvider>
      <MemoryManagerProvider>
        <div className="performance-monitor-provider">
          {children}
          
          {enableOverlay && (
            <PerformanceOverlay
              metrics={monitor.metrics}
              alerts={visibleAlerts}
              onDismissAlert={handleDismissAlert}
            />
          )}
        </div>
      </MemoryManagerProvider>
    </BundleOptimizerProvider>
  );
};

export default PerformanceMonitorProvider;

/**
 * 🎯 FASE 4.1 - Performance Monitor
 * 
 * Sistema completo de monitoramento de performance
 * Real User Monitoring (RUM) com métricas detalhadas
 * 
 * FEATURES:
 * - Time to Interactive (TTI)
 * - Component re-renders tracking
 * - Bundle size monitoring
 * - Memory usage tracking
 * - Custom metrics
 * - Alerting para degradação
 * 
 * @phase FASE 4 - Monitoramento e Otimização
 */

import { appLogger } from '@/lib/utils/appLogger';

// ============================================================================
// TYPES
// ============================================================================

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: 'ms' | 'bytes' | 'count' | 'percentage';
  timestamp: number;
  metadata?: Record<string, any>;
}

export interface PerformanceAlert {
  metric: string;
  threshold: number;
  currentValue: number;
  severity: 'warning' | 'critical';
  timestamp: number;
}

export interface PerformanceReport {
  metrics: PerformanceMetric[];
  alerts: PerformanceAlert[];
  summary: {
    avgTTI: number;
    avgReRenders: number;
    memoryUsage: number;
    bundleSize: number;
  };
  period: {
    start: number;
    end: number;
  };
}

// ============================================================================
// PERFORMANCE MONITOR
// ============================================================================

class PerformanceMonitorService {
  private metrics: PerformanceMetric[] = [];
  private alerts: PerformanceAlert[] = [];
  private thresholds = {
    tti: 2000,           // Time to Interactive < 2s
    reRenders: 3,        // Re-renders per action < 3
    memoryMB: 100,       // Memory usage < 100MB
    bundleSizeMB: 1,     // Bundle size < 1MB per chunk
  };
  
  private reRenderCounts = new Map<string, number>();
  private observers: PerformanceObserver[] = [];

  /**
   * Inicializar monitoramento
   */
  initialize() {
    if (typeof window === 'undefined') return;
    
    appLogger.info('🎯 [PerformanceMonitor] Inicializando monitoramento...');
    
    // Track TTI
    this.trackTTI();
    
    // Track bundle sizes
    this.trackBundleSize();
    
    // Track memory usage
    this.trackMemoryUsage();
    
    // Setup Web Vitals
    this.setupWebVitals();
    
    appLogger.info('✅ [PerformanceMonitor] Monitoramento inicializado');
  }

  /**
   * Track Time to Interactive (TTI)
   */
  private trackTTI() {
    if (typeof window === 'undefined' || !window.performance) return;
    
    const observeTTI = () => {
      const perfData = window.performance.timing;
      const tti = perfData.domInteractive - perfData.navigationStart;
      
      this.recordMetric({
        name: 'TTI',
        value: tti,
        unit: 'ms',
        timestamp: Date.now(),
        metadata: { type: 'page-load' },
      });
      
      if (tti > this.thresholds.tti) {
        this.recordAlert({
          metric: 'TTI',
          threshold: this.thresholds.tti,
          currentValue: tti,
          severity: tti > this.thresholds.tti * 1.5 ? 'critical' : 'warning',
          timestamp: Date.now(),
        });
      }
      
      appLogger.info(`⏱️ [PerformanceMonitor] TTI: ${tti}ms`);
    };
    
    if (document.readyState === 'complete') {
      observeTTI();
    } else {
      window.addEventListener('load', observeTTI);
    }
  }

  /**
   * Track component re-renders
   */
  trackReRender(componentName: string) {
    const count = (this.reRenderCounts.get(componentName) || 0) + 1;
    this.reRenderCounts.set(componentName, count);
    
    this.recordMetric({
      name: 'component-rerender',
      value: count,
      unit: 'count',
      timestamp: Date.now(),
      metadata: { component: componentName },
    });
    
    // Check threshold
    if (count > this.thresholds.reRenders) {
      this.recordAlert({
        metric: 'component-rerender',
        threshold: this.thresholds.reRenders,
        currentValue: count,
        severity: count > this.thresholds.reRenders * 2 ? 'critical' : 'warning',
        timestamp: Date.now(),
      });
      
      appLogger.warn(
        `⚠️ [PerformanceMonitor] ${componentName} re-renderizado ${count} vezes (threshold: ${this.thresholds.reRenders})`
      );
    }
  }

  /**
   * Reset re-render count for a component
   */
  resetReRenderCount(componentName: string) {
    this.reRenderCounts.delete(componentName);
  }

  /**
   * Track bundle size
   */
  private trackBundleSize() {
    if (typeof window === 'undefined' || !window.performance) return;
    
    try {
      const resources = window.performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      const jsResources = resources.filter(r => r.name.endsWith('.js'));
      
      const totalSize = jsResources.reduce((sum, r) => sum + (r.transferSize || 0), 0);
      const totalSizeMB = totalSize / (1024 * 1024);
      
      this.recordMetric({
        name: 'bundle-size',
        value: totalSizeMB,
        unit: 'bytes',
        timestamp: Date.now(),
        metadata: { 
          files: jsResources.length,
          breakdown: jsResources.map(r => ({
            name: r.name.split('/').pop(),
            size: Math.round((r.transferSize || 0) / 1024),
          }))
        },
      });
      
      appLogger.info(`📦 [PerformanceMonitor] Bundle size: ${totalSizeMB.toFixed(2)}MB (${jsResources.length} arquivos)`);
    } catch (error) {
      appLogger.error('❌ [PerformanceMonitor] Erro ao rastrear bundle size:', error);
    }
  }

  /**
   * Track memory usage
   */
  private trackMemoryUsage() {
    if (typeof window === 'undefined') return;
    
    const trackMemory = () => {
      // @ts-ignore - performance.memory é uma API experimental
      const memory = (window.performance as any)?.memory;
      
      if (memory) {
        const usedMB = memory.usedJSHeapSize / (1024 * 1024);
        
        this.recordMetric({
          name: 'memory-usage',
          value: usedMB,
          unit: 'bytes',
          timestamp: Date.now(),
          metadata: {
            total: Math.round(memory.totalJSHeapSize / (1024 * 1024)),
            limit: Math.round(memory.jsHeapSizeLimit / (1024 * 1024)),
          },
        });
        
        if (usedMB > this.thresholds.memoryMB) {
          this.recordAlert({
            metric: 'memory-usage',
            threshold: this.thresholds.memoryMB,
            currentValue: usedMB,
            severity: usedMB > this.thresholds.memoryMB * 1.5 ? 'critical' : 'warning',
            timestamp: Date.now(),
          });
        }
        
        appLogger.debug(`💾 [PerformanceMonitor] Memory: ${usedMB.toFixed(2)}MB`);
      }
    };
    
    // Track inicialmente e depois a cada 30s
    trackMemory();
    setInterval(trackMemory, 30000);
  }

  /**
   * Setup Web Vitals monitoring
   */
  private setupWebVitals() {
    if (typeof window === 'undefined' || !window.PerformanceObserver) return;
    
    try {
      // Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        
        this.recordMetric({
          name: 'LCP',
          value: lastEntry.renderTime || lastEntry.loadTime,
          unit: 'ms',
          timestamp: Date.now(),
          metadata: { element: lastEntry.element?.tagName },
        });
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);
      
      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.recordMetric({
            name: 'FID',
            value: entry.processingStart - entry.startTime,
            unit: 'ms',
            timestamp: Date.now(),
            metadata: { type: entry.name },
          });
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.push(fidObserver);
      
      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        
        this.recordMetric({
          name: 'CLS',
          value: clsValue,
          unit: 'count',
          timestamp: Date.now(),
        });
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(clsObserver);
      
      appLogger.info('✅ [PerformanceMonitor] Web Vitals configurados');
    } catch (error) {
      appLogger.warn('⚠️ [PerformanceMonitor] Erro ao configurar Web Vitals:', error);
    }
  }

  /**
   * Record custom metric
   */
  recordMetric(metric: PerformanceMetric) {
    this.metrics.push(metric);
    
    // Manter apenas últimos 1000 metrics
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }
  }

  /**
   * Record alert
   */
  private recordAlert(alert: PerformanceAlert) {
    this.alerts.push(alert);
    
    // Log alert
    const emoji = alert.severity === 'critical' ? '🔴' : '⚠️';
    appLogger.warn(
      `${emoji} [PerformanceMonitor] ALERT: ${alert.metric} = ${alert.currentValue} (threshold: ${alert.threshold})`
    );
    
    // Manter apenas últimos 100 alerts
    if (this.alerts.length > 100) {
      this.alerts = this.alerts.slice(-100);
    }
  }

  /**
   * Get performance report
   */
  getReport(periodMs: number = 60000): PerformanceReport {
    const now = Date.now();
    const start = now - periodMs;
    
    const periodMetrics = this.metrics.filter(m => m.timestamp >= start);
    const periodAlerts = this.alerts.filter(a => a.timestamp >= start);
    
    // Calculate averages
    const ttiMetrics = periodMetrics.filter(m => m.name === 'TTI');
    const avgTTI = ttiMetrics.length > 0
      ? ttiMetrics.reduce((sum, m) => sum + m.value, 0) / ttiMetrics.length
      : 0;
    
    const reRenderMetrics = periodMetrics.filter(m => m.name === 'component-rerender');
    const avgReRenders = reRenderMetrics.length > 0
      ? reRenderMetrics.reduce((sum, m) => sum + m.value, 0) / reRenderMetrics.length
      : 0;
    
    const memoryMetrics = periodMetrics.filter(m => m.name === 'memory-usage');
    const memoryUsage = memoryMetrics.length > 0
      ? memoryMetrics[memoryMetrics.length - 1].value
      : 0;
    
    const bundleMetrics = periodMetrics.filter(m => m.name === 'bundle-size');
    const bundleSize = bundleMetrics.length > 0
      ? bundleMetrics[bundleMetrics.length - 1].value
      : 0;
    
    return {
      metrics: periodMetrics,
      alerts: periodAlerts,
      summary: {
        avgTTI: Math.round(avgTTI),
        avgReRenders: Math.round(avgReRenders * 10) / 10,
        memoryUsage: Math.round(memoryUsage * 10) / 10,
        bundleSize: Math.round(bundleSize * 100) / 100,
      },
      period: { start, end: now },
    };
  }

  /**
   * Clear all data
   */
  clear() {
    this.metrics = [];
    this.alerts = [];
    this.reRenderCounts.clear();
    appLogger.info('🧹 [PerformanceMonitor] Dados limpos');
  }

  /**
   * Cleanup
   */
  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.clear();
    appLogger.info('🛑 [PerformanceMonitor] Monitoramento encerrado');
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const performanceMonitor = new PerformanceMonitorService();

// Auto-initialize em ambiente browser
if (typeof window !== 'undefined') {
  performanceMonitor.initialize();
}

export default performanceMonitor;

// @ts-nocheck
import React from 'react';

// Performance monitoring e analytics
interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  loadTime: number;
  bundleSize: number;
  renderTime: number;
  interactionTime: number;
}

interface AnalyticsEvent {
  name: string;
  category: 'performance' | 'user' | 'error' | 'bundle';
  data: Record<string, any>;
  timestamp: number;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetrics = {
    fps: 0,
    memoryUsage: 0,
    loadTime: 0,
    bundleSize: 0,
    renderTime: 0,
    interactionTime: 0,
  };
  private events: AnalyticsEvent[] = [];
  private isMonitoring = false;

  static getInstance() {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startMonitoring() {
    if (this.isMonitoring) return;
    this.isMonitoring = true;

    // FPS monitoring
    this.monitorFPS();

    // Memory monitoring
    this.monitorMemory();

    // Bundle size monitoring
    this.monitorBundleSize();

    // Core Web Vitals
    this.monitorWebVitals();

    console.log('🚀 Performance monitoring started');
  }

  stopMonitoring() {
    this.isMonitoring = false;
    console.log('⏹️ Performance monitoring stopped');
  }

  private monitorFPS() {
    let frames = 0;
    let lastTime = performance.now();

    const countFrame = () => {
      frames++;
      const currentTime = performance.now();

      if (currentTime >= lastTime + 1000) {
        this.metrics.fps = Math.round((frames * 1000) / (currentTime - lastTime));
        this.trackEvent('fps-update', 'performance', { fps: this.metrics.fps });

        frames = 0;
        lastTime = currentTime;
      }

      if (this.isMonitoring) {
        requestAnimationFrame(countFrame);
      }
    };

    requestAnimationFrame(countFrame);
  }

  private monitorMemory() {
    if (!('memory' in performance)) return;

    const checkMemory = () => {
      const memory = (performance as any).memory;
      if (memory) {
        this.metrics.memoryUsage = memory.usedJSHeapSize;
        this.trackEvent('memory-usage', 'performance', {
          usedHeap: memory.usedJSHeapSize,
          totalHeap: memory.totalJSHeapSize,
          limit: memory.jsHeapSizeLimit,
        });
      }
    };

    // Usar requestIdleCallback para evitar violations
    const scheduleMemoryCheck = () => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          checkMemory();
          // Reagendar apenas se ainda estiver monitorando
          if (this.isMonitoring) {
            setTimeout(scheduleMemoryCheck, 10000); // Reduzido para 10s
          }
        });
      } else {
        // Fallback mais otimizado
        setTimeout(() => {
          checkMemory();
          if (this.isMonitoring) {
            setTimeout(scheduleMemoryCheck, 10000);
          }
        }, 16); // Frame-time aware
      }
    };

    scheduleMemoryCheck();
  }

  private monitorBundleSize() {
    if (!('getEntriesByType' in performance)) return;

    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    const jsResources = resources.filter(r => r.name.includes('.js'));

    const totalSize = jsResources.reduce((total, resource) => total + resource.transferSize, 0);
    this.metrics.bundleSize = totalSize;

    this.trackEvent('bundle-size', 'performance', {
      totalSize,
      resourceCount: jsResources.length,
      resources: jsResources.map(r => ({
        name: r.name,
        size: r.transferSize,
        loadTime: r.responseEnd - r.fetchStart,
      })),
    });
  }

  private monitorWebVitals() {
    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver(list => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];

        this.trackEvent('lcp', 'performance', {
          value: lastEntry.startTime,
          rating:
            lastEntry.startTime > 4000
              ? 'poor'
              : lastEntry.startTime > 2500
                ? 'needs-improvement'
                : 'good',
        });
      });

      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          const fid = (entry as any).processingStart - entry.startTime;

          this.trackEvent('fid', 'performance', {
            value: fid,
            rating: fid > 300 ? 'poor' : fid > 100 ? 'needs-improvement' : 'good',
          });
        }
      });

      fidObserver.observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }

        this.trackEvent('cls', 'performance', {
          value: clsValue,
          rating: clsValue > 0.25 ? 'poor' : clsValue > 0.1 ? 'needs-improvement' : 'good',
        });
      });

      clsObserver.observe({ entryTypes: ['layout-shift'] });
    }
  }

  trackEvent(name: string, category: AnalyticsEvent['category'], data: Record<string, any>) {
    const event: AnalyticsEvent = {
      name,
      category,
      data,
      timestamp: Date.now(),
    };

    this.events.push(event);

    // Keep only last 1000 events
    if (this.events.length > 1000) {
      this.events = this.events.slice(-1000);
    }

    // Log critical events
    if (category === 'error' || (category === 'performance' && this.isCriticalMetric(name, data))) {
      console.warn(`[Performance] ${name}:`, data);
    }
  }

  private isCriticalMetric(name: string, data: any): boolean {
    return (
      (name === 'fps-update' && data.fps < 30) ||
      (name === 'high-memory-usage' && data.usage > 90) ||
      (name === 'lcp' && data.rating === 'poor') ||
      (name === 'fid' && data.rating === 'poor') ||
      (name === 'cls' && data.rating === 'poor')
    );
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  getEvents(category?: AnalyticsEvent['category']): AnalyticsEvent[] {
    return category ? this.events.filter(event => event.category === category) : [...this.events];
  }

  exportData() {
    return {
      metrics: this.getMetrics(),
      events: this.getEvents(),
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
    };
  }

  // Generate performance report
  generateReport() {
    const metrics = this.getMetrics();
    const events = this.getEvents();

    const report = {
      summary: {
        fps: metrics.fps,
        memoryUsage: metrics.memoryUsage,
        bundleSize: Math.round(metrics.bundleSize / 1024), // KB
        overallScore: this.calculateScore(metrics),
      },
      issues: this.findIssues(events),
      recommendations: this.getRecommendations(metrics, events),
    };

    console.log('📊 Performance Report:', report);
    return report;
  }

  private calculateScore(metrics: PerformanceMetrics): number {
    let score = 100;

    if (metrics.fps < 60) score -= 60 - metrics.fps;
    if (metrics.memoryUsage > 50) score -= metrics.memoryUsage - 50;
    if (metrics.bundleSize > 500000) score -= Math.round((metrics.bundleSize - 500000) / 10000);

    return Math.max(0, score);
  }

  private findIssues(events: AnalyticsEvent[]): string[] {
    const issues = [];

    const highMemoryEvents = events.filter(e => e.name === 'high-memory-usage');
    if (highMemoryEvents.length > 0) {
      issues.push(`Memory usage exceeded 80% ${highMemoryEvents.length} times`);
    }

    const lowFpsEvents = events.filter(e => e.name === 'fps-update' && e.data.fps < 30);
    if (lowFpsEvents.length > 0) {
      issues.push(`FPS dropped below 30 ${lowFpsEvents.length} times`);
    }

    return issues;
  }

  private getRecommendations(metrics: PerformanceMetrics, events: AnalyticsEvent[]): string[] {
    const recommendations = [];

    if (metrics.fps < 45) {
      recommendations.push('Consider implementing React.memo for heavy components');
    }

    if (metrics.memoryUsage > 70) {
      recommendations.push('Review component cleanup and event listener removal');
    }

    if (metrics.bundleSize > 1000000) {
      recommendations.push('Implement code splitting and lazy loading');
    }

    return recommendations;
  }
}

// Hook para usar performance monitoring
export const usePerformanceMonitoring = () => {
  React.useEffect(() => {
    const monitor = PerformanceMonitor.getInstance();
    monitor.startMonitoring();

    return () => monitor.stopMonitoring();
  }, []);

  return PerformanceMonitor.getInstance();
};

export default PerformanceMonitor;

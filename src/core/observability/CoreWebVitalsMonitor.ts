/**
 * 📊 CORE WEB VITALS MONITOR - PHASE 3: OBSERVABILITY
 * Monitoramento automático dos Core Web Vitals
 */

import { structuredLogger } from './StructuredLogger';

export interface WebVitalMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  timestamp: number;
}

export interface PerformanceMetrics {
  lcp?: WebVitalMetric; // Largest Contentful Paint
  fid?: WebVitalMetric; // First Input Delay
  cls?: WebVitalMetric; // Cumulative Layout Shift
  fcp?: WebVitalMetric; // First Contentful Paint
  ttfb?: WebVitalMetric; // Time to First Byte
}

class CoreWebVitalsMonitor {
  private metrics: PerformanceMetrics = {};
  private observers: PerformanceObserver[] = [];
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  private initialize() {
    if (this.isInitialized || typeof window === 'undefined') return;
    
    this.isInitialized = true;
    
    // Monitor LCP (Largest Contentful Paint)
    this.observeLCP();
    
    // Monitor FID (First Input Delay)
    this.observeFID();
    
    // Monitor CLS (Cumulative Layout Shift)
    this.observeCLS();
    
    // Monitor FCP (First Contentful Paint)
    this.observeFCP();
    
    // Monitor TTFB (Time to First Byte)
    this.observeTTFB();
    
    structuredLogger.info('Core Web Vitals monitoring initialized');
  }

  private observeLCP() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        if (lastEntry) {
          const lcp = this.createMetric('LCP', lastEntry.startTime);
          this.metrics.lcp = lcp;
          this.reportMetric(lcp);
        }
      });
      
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(observer);
    } catch (error) {
      structuredLogger.warn('Failed to observe LCP', { error });
    }
  }

  private observeFID() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        
        entries.forEach((entry) => {
          if (entry.entryType === 'first-input') {
            const fid = this.createMetric('FID', (entry as any).processingStart - entry.startTime);
            this.metrics.fid = fid;
            this.reportMetric(fid);
          }
        });
      });
      
      observer.observe({ entryTypes: ['first-input'] });
      this.observers.push(observer);
    } catch (error) {
      structuredLogger.warn('Failed to observe FID', { error });
    }
  }

  private observeCLS() {
    try {
      let clsValue = 0;
      
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        
        entries.forEach((entry) => {
          if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        });
        
        const cls = this.createMetric('CLS', clsValue);
        this.metrics.cls = cls;
      });
      
      observer.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(observer);
      
      // Report final CLS on page hide
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          const cls = this.createMetric('CLS', clsValue);
          this.metrics.cls = cls;
          this.reportMetric(cls);
        }
      });
    } catch (error) {
      structuredLogger.warn('Failed to observe CLS', { error });
    }
  }

  private observeFCP() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            const fcp = this.createMetric('FCP', entry.startTime);
            this.metrics.fcp = fcp;
            this.reportMetric(fcp);
          }
        });
      });
      
      observer.observe({ entryTypes: ['paint'] });
      this.observers.push(observer);
    } catch (error) {
      structuredLogger.warn('Failed to observe FCP', { error });
    }
  }

  private observeTTFB() {
    try {
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (navigationEntry) {
        const ttfb = this.createMetric('TTFB', navigationEntry.responseStart - navigationEntry.requestStart);
        this.metrics.ttfb = ttfb;
        this.reportMetric(ttfb);
      }
    } catch (error) {
      structuredLogger.warn('Failed to observe TTFB', { error });
    }
  }

  private createMetric(name: string, value: number): WebVitalMetric {
    const rating = this.getRating(name, value);
    
    return {
      name,
      value: Math.round(value),
      rating,
      delta: 0, // Could be calculated from previous measurements
      id: this.generateId(),
      timestamp: Date.now()
    };
  }

  private getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    const thresholds = {
      LCP: { good: 2500, poor: 4000 },
      FID: { good: 100, poor: 300 },
      CLS: { good: 0.1, poor: 0.25 },
      FCP: { good: 1800, poor: 3000 },
      TTFB: { good: 800, poor: 1800 }
    };

    const threshold = thresholds[name as keyof typeof thresholds];
    if (!threshold) return 'good';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  }

  private generateId(): string {
    return `metric_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private reportMetric(metric: WebVitalMetric) {
    const logLevel = metric.rating === 'poor' ? 'warn' : 'info';
    
    structuredLogger[logLevel](`Core Web Vital: ${metric.name}`, {
      metric: metric.name,
      value: metric.value,
      rating: metric.rating,
      id: metric.id,
      category: 'performance'
    });

    // Send to analytics if available
    if (typeof window !== 'undefined' && 'gtag' in window) {
      const gtag = (window as any).gtag;
      if (typeof gtag === 'function') {
        gtag('event', metric.name, {
          event_category: 'Web Vitals',
          value: Math.round(metric.value),
          custom_parameter_1: metric.rating,
          non_interaction: true
        });
      }
    }
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  getMetricsSummary() {
    const metrics = this.getMetrics();
    
    return {
      hasGoodLCP: metrics.lcp?.rating === 'good',
      hasGoodFID: metrics.fid?.rating === 'good',
      hasGoodCLS: metrics.cls?.rating === 'good',
      overallScore: this.calculateOverallScore(),
      recommendations: this.getRecommendations()
    };
  }

  private calculateOverallScore(): number {
    const metrics = this.getMetrics();
    let totalScore = 0;
    let metricsCount = 0;

    Object.values(metrics).forEach(metric => {
      if (metric) {
        metricsCount++;
        switch (metric.rating) {
          case 'good': totalScore += 100; break;
          case 'needs-improvement': totalScore += 50; break;
          case 'poor': totalScore += 0; break;
        }
      }
    });

    return metricsCount > 0 ? Math.round(totalScore / metricsCount) : 0;
  }

  private getRecommendations(): string[] {
    const recommendations: string[] = [];
    const metrics = this.getMetrics();

    if (metrics.lcp && metrics.lcp.rating === 'poor') {
      recommendations.push('Optimize images and reduce server response times to improve LCP');
    }

    if (metrics.fid && metrics.fid.rating === 'poor') {
      recommendations.push('Reduce JavaScript execution time to improve FID');
    }

    if (metrics.cls && metrics.cls.rating === 'poor') {
      recommendations.push('Avoid layout shifts by setting dimensions for images and ads');
    }

    return recommendations;
  }

  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.isInitialized = false;
  }
}

// Singleton instance
export const coreWebVitalsMonitor = new CoreWebVitalsMonitor();

export default coreWebVitalsMonitor;
/**
 * 🎯 OBSERVABILITY MANAGER - PHASE 3: CONSOLIDATED MONITORING
 * Gerenciador central de todas as funcionalidades de observabilidade
 */

import { structuredLogger, LogLevel } from './StructuredLogger';
import { coreWebVitalsMonitor } from './CoreWebVitalsMonitor';
import { businessMetrics } from './BusinessMetrics';

export interface ObservabilityConfig {
  enableStructuredLogging: boolean;
  enableWebVitalsMonitoring: boolean;
  enableBusinessMetrics: boolean;
  logLevel: LogLevel;
  flushInterval: number;
}

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'critical';
  performance: {
    score: number;
    rating: 'good' | 'needs-improvement' | 'poor';
    recommendations: string[];
  };
  business: {
    conversionRate: number;
    dropoffRate: number;
    activeUsers: number;
  };
  errors: {
    count: number;
    criticalCount: number;
    recentErrors: Array<{
      message: string;
      component: string;
      timestamp: number;
    }>;
  };
  timestamp: number;
}

class ObservabilityManager {
  private config: ObservabilityConfig;
  private isInitialized = false;
  private healthCheckInterval: NodeJS.Timeout | null = null;
  private errorBuffer: Array<{ message: string; component: string; timestamp: number }> = [];

  constructor(config: Partial<ObservabilityConfig> = {}) {
    this.config = {
      enableStructuredLogging: true,
      enableWebVitalsMonitoring: true,
      enableBusinessMetrics: true,
      logLevel: import.meta.env.DEV ? LogLevel.DEBUG : LogLevel.INFO,
      flushInterval: 30000,
      ...config
    };
  }

  /**
   * Inicializar todos os sistemas de observabilidade
   */
  initialize() {
    if (this.isInitialized) return;

    this.isInitialized = true;

    // Initialize structured logging
    if (this.config.enableStructuredLogging) {
      structuredLogger.info('Observability Manager initialized', {
        config: this.config,
        category: 'system'
      });
    }

    // Web Vitals já são inicializados automaticamente no constructor
    if (this.config.enableWebVitalsMonitoring) {
      structuredLogger.info('Core Web Vitals monitoring enabled');
    }

    // Business Metrics já são inicializados automaticamente no constructor
    if (this.config.enableBusinessMetrics) {
      structuredLogger.info('Business metrics tracking enabled');
    }

    // Setup health monitoring
    this.setupHealthMonitoring();

    // Setup error boundary
    this.setupGlobalErrorHandling();

    structuredLogger.info('🎯 Observability Manager fully initialized', {
      features: {
        structuredLogging: this.config.enableStructuredLogging,
        webVitals: this.config.enableWebVitalsMonitoring,
        businessMetrics: this.config.enableBusinessMetrics
      }
    });
  }

  /**
   * Setup periodic health monitoring
   */
  private setupHealthMonitoring() {
    this.healthCheckInterval = setInterval(() => {
      this.performHealthCheck();
    }, this.config.flushInterval);
  }

  /**
   * Setup global error handling
   */
  private setupGlobalErrorHandling() {
    if (typeof window === 'undefined') return;

    // Capture unhandled errors
    window.addEventListener('error', (event) => {
      this.logError('Unhandled JavaScript error', 'global', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error?.stack
      });
    });

    // Capture unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.logError('Unhandled promise rejection', 'global', {
        reason: event.reason,
        stack: event.reason?.stack
      });
    });
  }

  /**
   * Perform system health check
   */
  private performHealthCheck() {
    const health = this.getSystemHealth();
    
    if (health.status === 'critical') {
      structuredLogger.critical('System health is critical', {
        health,
        category: 'health_check'
      });
    } else if (health.status === 'degraded') {
      structuredLogger.warn('System health is degraded', {
        health,
        category: 'health_check'
      });
    } else {
      structuredLogger.debug('System health check passed', {
        health,
        category: 'health_check'
      });
    }
  }

  /**
   * Log error with context
   */
  logError(message: string, component: string, context: Record<string, any> = {}) {
    const errorEntry = {
      message,
      component,
      timestamp: Date.now()
    };

    this.errorBuffer.push(errorEntry);
    
    // Keep only last 50 errors
    if (this.errorBuffer.length > 50) {
      this.errorBuffer.shift();
    }

    structuredLogger.error(message, {
      component,
      ...context,
      category: 'error'
    });

    // Track as business metric
    if (this.config.enableBusinessMetrics) {
      businessMetrics.trackUIError(message, component, 'medium');
    }
  }

  /**
   * Track user interaction
   */
  trackInteraction(action: string, component: string, metadata?: Record<string, any>) {
    if (!this.config.enableBusinessMetrics) return;

    businessMetrics.trackInteraction(action, component, metadata);
    
    structuredLogger.debug('User interaction tracked', {
      action,
      component,
      metadata,
      category: 'interaction'
    });
  }

  /**
   * Track conversion event
   */
  trackConversion(event: string, value?: number, funnelStep?: number) {
    if (!this.config.enableBusinessMetrics) return;

    businessMetrics.trackConversion(event, value, 'USD', funnelStep);
    
    structuredLogger.info('Conversion tracked', {
      event,
      value,
      funnelStep,
      category: 'conversion'
    });
  }

  /**
   * Get comprehensive system health
   */
  getSystemHealth(): SystemHealth {
    // Performance metrics
    const webVitalsSnapshot = coreWebVitalsMonitor.getMetricsSummary();
    const performanceScore = webVitalsSnapshot.overallScore;
    
    let performanceRating: 'good' | 'needs-improvement' | 'poor' = 'good';
    if (performanceScore < 50) performanceRating = 'poor';
    else if (performanceScore < 80) performanceRating = 'needs-improvement';

    // Business metrics
    const businessSnapshot = businessMetrics.getSnapshot();
    const avgDropoffRate = businessSnapshot.funnelDropoffs.reduce(
      (sum, item) => sum + item.dropoffRate, 0
    ) / Math.max(businessSnapshot.funnelDropoffs.length, 1);

    // Error analysis
    const recentErrors = this.errorBuffer.slice(-10);
    const criticalErrorCount = recentErrors.filter(
      error => error.message.includes('critical') || error.message.includes('Critical')
    ).length;

    // Determine overall system status
    let status: 'healthy' | 'degraded' | 'critical' = 'healthy';
    
    if (criticalErrorCount > 3 || performanceRating === 'poor' || avgDropoffRate > 40) {
      status = 'critical';
    } else if (recentErrors.length > 5 || performanceRating === 'needs-improvement' || avgDropoffRate > 20) {
      status = 'degraded';
    }

    return {
      status,
      performance: {
        score: performanceScore,
        rating: performanceRating,
        recommendations: webVitalsSnapshot.recommendations
      },
      business: {
        conversionRate: businessSnapshot.conversionRate,
        dropoffRate: avgDropoffRate,
        activeUsers: businessSnapshot.uniqueUsers
      },
      errors: {
        count: recentErrors.length,
        criticalCount: criticalErrorCount,
        recentErrors
      },
      timestamp: Date.now()
    };
  }

  /**
   * Get dashboard data for admin interface
   */
  getDashboardData() {
    const systemHealth = this.getSystemHealth();
    const businessData = businessMetrics.getDashboardData();
    const webVitalsMetrics = coreWebVitalsMonitor.getMetrics();

    return {
      systemHealth,
      business: businessData,
      performance: {
        webVitals: webVitalsMetrics,
        summary: coreWebVitalsMonitor.getMetricsSummary()
      },
      realTimeStats: {
        activeSession: businessMetrics['sessionId'],
        sessionDuration: Date.now() - businessMetrics['sessionStart'],
        errorRate: (systemHealth.errors.count / Math.max(businessData.overview.totalInteractions, 1)) * 100
      }
    };
  }

  /**
   * Export all collected data for analysis
   */
  exportData() {
    return {
      businessMetrics: businessMetrics.getSnapshot(),
      webVitals: coreWebVitalsMonitor.getMetrics(),
      errors: [...this.errorBuffer],
      systemHealth: this.getSystemHealth(),
      config: this.config,
      exportedAt: new Date().toISOString()
    };
  }

  /**
   * Cleanup and destroy all observers
   */
  destroy() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }

    coreWebVitalsMonitor.destroy();
    businessMetrics.destroy();
    
    structuredLogger.info('Observability Manager destroyed');
    this.isInitialized = false;
  }
}

// Singleton instance
export const observabilityManager = new ObservabilityManager();

// Initialize automatically in browser environment
if (typeof window !== 'undefined') {
  observabilityManager.initialize();
}

export default observabilityManager;

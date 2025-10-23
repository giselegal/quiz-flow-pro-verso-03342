/**
 * 📡 MONITORING SERVICE - Canonical Service for System Monitoring
 * 
 * Consolidates monitoring, error tracking, and health checks:
 * - Error tracking and logging
 * - Performance monitoring
 * - Health checks for all services
 * - System metrics collection
 * - Alert management
 * - Browser performance API integration
 * 
 * CONSOLIDATES:
 * - Error tracking scattered across codebase
 * - Performance monitoring utilities
 * - Health check implementations
 */

import { BaseCanonicalService, ServiceResult } from './types';
import { CacheService } from './CacheService';
import { TemplateService } from './TemplateService';
import { DataService } from './DataService';
import { ValidationService } from './ValidationService';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface ErrorReport {
  id: string;
  timestamp: Date;
  message: string;
  stack?: string;
  component?: string;
  userId?: string;
  context?: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolved: boolean;
}

export interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
  category: 'load' | 'runtime' | 'network' | 'render' | 'custom';
  tags?: Record<string, string>;
}

export interface HealthStatus {
  service: string;
  healthy: boolean;
  lastCheck: Date;
  responseTime?: number;
  error?: string;
  details?: Record<string, any>;
}

export interface SystemMetrics {
  memory?: {
    used: number;
    total: number;
    percentage: number;
  };
  performance?: {
    loadTime: number;
    domContentLoaded: number;
    firstPaint?: number;
    firstContentfulPaint?: number;
  };
  errors: {
    total: number;
    byComponent: Record<string, number>;
    bySeverity: Record<string, number>;
  };
  services: {
    total: number;
    healthy: number;
    unhealthy: number;
  };
}

export interface Alert {
  id: string;
  type: 'performance' | 'error' | 'health' | 'security';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  timestamp: Date;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
}

// ============================================================================
// MONITORING SERVICE - MAIN CLASS
// ============================================================================

export class MonitoringService extends BaseCanonicalService {
  private static instance: MonitoringService;
  private errorReports: ErrorReport[] = [];
  private performanceMetrics: PerformanceMetric[] = [];
  private healthChecks: Map<string, HealthStatus> = new Map();
  private alertsList: Alert[] = [];
  
  private readonly MAX_ERRORS = 100;
  private readonly MAX_METRICS = 500;
  private readonly MAX_ALERTS = 50;
  private readonly HEALTH_CHECK_INTERVAL = 60000; // 1 minute
  
  private healthCheckTimer?: NodeJS.Timeout;

  private constructor() {
    super('MonitoringService', '1.0.0', { debug: false });
  }

  static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  protected async onInitialize(): Promise<void> {
    this.log('Initializing MonitoringService...');
    
    try {
      // Setup browser error handler
      if (typeof window !== 'undefined') {
        this.setupGlobalErrorHandler();
        this.setupPerformanceMonitoring();
      }
      
      // Start periodic health checks
      this.startHealthChecks();
      
      this.log('MonitoringService initialized successfully');
    } catch (error) {
      this.error('Failed to initialize MonitoringService', error);
      throw error;
    }
  }

  protected async onDispose(): Promise<void> {
    this.log('Disposing MonitoringService...');
    
    // Stop health checks
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
    }
    
      // Clear data
    this.errorReports = [];
    this.performanceMetrics = [];
    this.healthChecks.clear();
    this.alertsList = [];
  }

  async healthCheck(): Promise<boolean> {
    return this.state === 'ready';
  }

  // ============================================================================
  // ERROR TRACKING
  // ============================================================================

  /**
   * Track error
   */
  trackError(
    error: Error | string,
    component?: string,
    context?: Record<string, any>,
    severity: ErrorReport['severity'] = 'medium'
  ): ServiceResult<ErrorReport> {
    try {
      const errorMessage = error instanceof Error ? error.message : error;
      const errorStack = error instanceof Error ? error.stack : undefined;

      const report: ErrorReport = {
        id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        message: errorMessage,
        stack: errorStack,
        component,
        context,
        severity,
        resolved: false
      };

      this.errorReports.push(report);
      this.pruneErrors();

      // Log to console in dev mode
      if (this.options.debug) {
        console.error(`[${severity.toUpperCase()}] Error in ${component || 'unknown'}:`, errorMessage);
        if (errorStack) console.error(errorStack);
      }

      // Create alert for high/critical errors
      if (severity === 'high' || severity === 'critical') {
        this.createAlert({
          type: 'error',
          severity,
          title: `${severity.toUpperCase()} Error in ${component || 'System'}`,
          message: errorMessage
        });
      }

      return { success: true, data: report };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err : new Error('Failed to track error')
      };
    }
  }

  /**
   * Get all error reports
   */
  getErrors(filters?: {
    component?: string;
    severity?: ErrorReport['severity'];
    resolved?: boolean;
    limit?: number;
  }): ServiceResult<ErrorReport[]> {
    try {
      let filtered = [...this.errorReports];

      if (filters?.component) {
        filtered = filtered.filter(e => e.component === filters.component);
      }

      if (filters?.severity) {
        filtered = filtered.filter(e => e.severity === filters.severity);
      }

      if (filters?.resolved !== undefined) {
        filtered = filtered.filter(e => e.resolved === filters.resolved);
      }

      if (filters?.limit) {
        filtered = filtered.slice(0, filters.limit);
      }

      return { success: true, data: filtered };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Failed to get errors')
      };
    }
  }

  /**
   * Mark error as resolved
   */
  resolveError(errorId: string): ServiceResult<void> {
    const error = this.errorReports.find(e => e.id === errorId);
    if (error) {
      error.resolved = true;
      return { success: true, data: undefined };
    }
    return {
      success: false,
      error: new Error('Error not found')
    };
  }

  /**
   * Clear all errors
   */
  clearErrors(): void {
    this.errorReports = [];
  }

  // ============================================================================
  // PERFORMANCE MONITORING
  // ============================================================================

  /**
   * Track performance metric
   */
  trackMetric(
    name: string,
    value: number,
    unit: string,
    category: PerformanceMetric['category'] = 'custom',
    tags?: Record<string, string>
  ): ServiceResult<PerformanceMetric> {
    try {
      const metric: PerformanceMetric = {
        id: `metric_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name,
        value,
        unit,
        timestamp: new Date(),
        category,
        tags
      };

      this.performanceMetrics.push(metric);
      this.pruneMetrics();

      if (this.options.debug) {
        this.log(`Metric: ${name} = ${value} ${unit}`);
      }

      return { success: true, data: metric };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Failed to track metric')
      };
    }
  }

  /**
   * Get performance metrics
   */
  getMetrics(filters?: {
    category?: PerformanceMetric['category'];
    name?: string;
    limit?: number;
  }): ServiceResult<PerformanceMetric[]> {
    try {
      let filtered = [...this.performanceMetrics];

      if (filters?.category) {
        filtered = filtered.filter(m => m.category === filters.category);
      }

      if (filters?.name) {
        filtered = filtered.filter(m => m.name === filters.name);
      }

      if (filters?.limit) {
        filtered = filtered.slice(-filters.limit);
      }

      return { success: true, data: filtered };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Failed to get metrics')
      };
    }
  }

  /**
   * Capture browser performance metrics
   */
  capturePagePerformance(): ServiceResult<PerformanceMetric[]> {
    if (typeof window === 'undefined' || !window.performance) {
      return {
        success: false,
        error: new Error('Performance API not available')
      };
    }

    const captured: PerformanceMetric[] = [];

    try {
      const timing = window.performance.timing;
      const navigation = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

      if (navigation) {
        // Load time
        this.trackMetric('page.loadTime', navigation.loadEventEnd - navigation.fetchStart, 'ms', 'load');
        
        // DOM content loaded
        this.trackMetric('page.domContentLoaded', navigation.domContentLoadedEventEnd - navigation.fetchStart, 'ms', 'load');
        
        // DNS lookup
        this.trackMetric('page.dnsLookup', navigation.domainLookupEnd - navigation.domainLookupStart, 'ms', 'network');
        
        // TCP connection
        this.trackMetric('page.tcpConnection', navigation.connectEnd - navigation.connectStart, 'ms', 'network');
      }

      // Paint metrics
      const paintEntries = window.performance.getEntriesByType('paint');
      paintEntries.forEach(entry => {
        this.trackMetric(`page.${entry.name}`, entry.startTime, 'ms', 'render');
      });

      return { success: true, data: captured };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Failed to capture performance')
      };
    }
  }

  // ============================================================================
  // HEALTH CHECKS
  // ============================================================================

  /**
   * Perform health check on all services
   */
  async checkAllServices(): Promise<ServiceResult<HealthStatus[]>> {
    try {
      const services = [
        { name: 'Cache', instance: CacheService.getInstance() },
        { name: 'Template', instance: TemplateService.getInstance() },
        { name: 'Data', instance: DataService.getInstance() },
        { name: 'Validation', instance: ValidationService.getInstance() }
      ];

      const statuses: HealthStatus[] = [];

      for (const { name, instance } of services) {
        const startTime = Date.now();
        try {
          const healthy = await instance.healthCheck();
          const responseTime = Date.now() - startTime;

          const status: HealthStatus = {
            service: name,
            healthy,
            lastCheck: new Date(),
            responseTime
          };

          this.healthChecks.set(name, status);
          statuses.push(status);

          // Create alert if service is unhealthy
          if (!healthy) {
            this.createAlert({
              type: 'health',
              severity: 'high',
              title: `${name}Service is unhealthy`,
              message: `Health check failed for ${name}Service`
            });
          }
        } catch (error) {
          const status: HealthStatus = {
            service: name,
            healthy: false,
            lastCheck: new Date(),
            error: error instanceof Error ? error.message : 'Unknown error'
          };

          this.healthChecks.set(name, status);
          statuses.push(status);
        }
      }

      return { success: true, data: statuses };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Health check failed')
      };
    }
  }

  /**
   * Get health status for specific service
   */
  getServiceHealth(serviceName: string): ServiceResult<HealthStatus | null> {
    const status = this.healthChecks.get(serviceName);
    return {
      success: true,
      data: status || null
    };
  }

  /**
   * Get all health statuses
   */
  getAllHealthStatuses(): ServiceResult<HealthStatus[]> {
    return {
      success: true,
      data: Array.from(this.healthChecks.values())
    };
  }

  // ============================================================================
  // SYSTEM METRICS
  // ============================================================================

  /**
   * Get comprehensive system metrics
   */
  getSystemMetrics(): ServiceResult<SystemMetrics> {
    try {
      // Memory info (if available)
      let memory;
      if (typeof window !== 'undefined' && (performance as any).memory) {
        const mem = (performance as any).memory;
        memory = {
          used: mem.usedJSHeapSize,
          total: mem.totalJSHeapSize,
          percentage: (mem.usedJSHeapSize / mem.totalJSHeapSize) * 100
        };
      }

      // Performance info
      let performanceInfo;
      if (typeof window !== 'undefined' && window.performance?.timing) {
        const timing = window.performance.timing;
        performanceInfo = {
          loadTime: timing.loadEventEnd - timing.navigationStart,
          domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart
        };
      }

      // Error statistics
      const errorsByComponent: Record<string, number> = {};
      const errorsBySeverity: Record<string, number> = {};
      
      this.errorReports.forEach(error => {
        if (error.component) {
          errorsByComponent[error.component] = (errorsByComponent[error.component] || 0) + 1;
        }
        errorsBySeverity[error.severity] = (errorsBySeverity[error.severity] || 0) + 1;
      });

      // Service health statistics
      const healthStatuses = Array.from(this.healthChecks.values());
      const healthyCount = healthStatuses.filter(s => s.healthy).length;

      const metrics: SystemMetrics = {
        memory,
        performance: performanceInfo,
        errors: {
          total: this.errorReports.length,
          byComponent: errorsByComponent,
          bySeverity: errorsBySeverity
        },
        services: {
          total: healthStatuses.length,
          healthy: healthyCount,
          unhealthy: healthStatuses.length - healthyCount
        }
      };

      return { success: true, data: metrics };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Failed to get system metrics')
      };
    }
  }

  // ============================================================================
  // ALERTS
  // ============================================================================

  /**
   * Create alert
   */
  private createAlert(params: {
    type: Alert['type'];
    severity: Alert['severity'];
    title: string;
    message: string;
  }): Alert {
    const alert: Alert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: params.type,
      severity: params.severity,
      title: params.title,
      message: params.message,
      timestamp: new Date(),
      acknowledged: false
    };

    this.alertsList.push(alert);
    this.pruneAlerts();

    return alert;
  }

  /**
   * Get alerts
   */
  getAlerts(filters?: {
    type?: Alert['type'];
    severity?: Alert['severity'];
    acknowledged?: boolean;
    limit?: number;
  }): ServiceResult<Alert[]> {
    try {
      let filtered = [...this.alerts];

      if (filters?.type) {
        filtered = filtered.filter(a => a.type === filters.type);
      }

      if (filters?.severity) {
        filtered = filtered.filter(a => a.severity === filters.severity);
      }

      if (filters?.acknowledged !== undefined) {
        filtered = filtered.filter(a => a.acknowledged === filters.acknowledged);
      }

      if (filters?.limit) {
        filtered = filtered.slice(-filters.limit);
      }

      return { success: true, data: filtered };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Failed to get alerts')
      };
    }
  }

  /**
   * Acknowledge alert
   */
  acknowledgeAlert(alertId: string, acknowledgedBy?: string): ServiceResult<void> {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      alert.acknowledgedBy = acknowledgedBy;
      alert.acknowledgedAt = new Date();
      return { success: true, data: undefined };
    }
    return {
      success: false,
      error: new Error('Alert not found')
    };
  }

  // ============================================================================
  // PRIVATE HELPERS
  // ============================================================================

  private setupGlobalErrorHandler(): void {
    window.addEventListener('error', (event) => {
      this.trackError(
        event.error || event.message,
        'GlobalErrorHandler',
        {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        },
        'high'
      );
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.trackError(
        event.reason,
        'UnhandledPromiseRejection',
        {},
        'high'
      );
    });
  }

  private setupPerformanceMonitoring(): void {
    if (window.performance && window.performance.getEntriesByType) {
      // Capture initial page load metrics after window load
      window.addEventListener('load', () => {
        setTimeout(() => {
          this.capturePagePerformance();
        }, 0);
      });
    }
  }

  private startHealthChecks(): void {
    // Immediate check
    this.checkAllServices();

    // Periodic checks
    this.healthCheckTimer = setInterval(() => {
      this.checkAllServices();
    }, this.HEALTH_CHECK_INTERVAL);
  }

  private pruneErrors(): void {
    if (this.errors.length > this.MAX_ERRORS) {
      this.errors = this.errors.slice(-this.MAX_ERRORS);
    }
  }

  private pruneMetrics(): void {
    if (this.metrics.length > this.MAX_METRICS) {
      this.metrics = this.metrics.slice(-this.MAX_METRICS);
    }
  }

  private pruneAlerts(): void {
    if (this.alerts.length > this.MAX_ALERTS) {
      this.alerts = this.alerts.slice(-this.MAX_ALERTS);
    }
  }

  // ============================================================================
  // SPECIALIZED API
  // ============================================================================

  readonly errors = {
    track: (error: Error | string, component?: string, context?: Record<string, any>, severity?: ErrorReport['severity']) =>
      this.trackError(error, component, context, severity),
    get: (filters?: Parameters<typeof this.getErrors>[0]) =>
      this.getErrors(filters),
    resolve: (errorId: string) =>
      this.resolveError(errorId),
    clear: () =>
      this.clearErrors()
  };

  readonly performance = {
    track: (name: string, value: number, unit: string, category?: PerformanceMetric['category'], tags?: Record<string, string>) =>
      this.trackMetric(name, value, unit, category, tags),
    get: (filters?: Parameters<typeof this.getMetrics>[0]) =>
      this.getMetrics(filters),
    capturePage: () =>
      this.capturePagePerformance()
  };

  readonly health = {
    checkAll: () =>
      this.checkAllServices(),
    getService: (serviceName: string) =>
      this.getServiceHealth(serviceName),
    getAll: () =>
      this.getAllHealthStatuses()
  };

  readonly alerts = {
    get: (filters?: Parameters<typeof this.getAlerts>[0]) =>
      this.getAlerts(filters),
    acknowledge: (alertId: string, acknowledgedBy?: string) =>
      this.acknowledgeAlert(alertId, acknowledgedBy)
  };

  readonly system = {
    getMetrics: () =>
      this.getSystemMetrics()
  };
}

// Export singleton instance
export const monitoringService = MonitoringService.getInstance();

/**
 * Hook para monitoramento de segurança e métricas do sistema
 * Fase 5: Security & Production Hardening
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SecurityMetric {
  service_name: string;
  metric_name: string;
  metric_value: number;
  metric_unit?: string;
  status?: 'healthy' | 'warning' | 'critical';
  metadata?: Record<string, any>;
}

interface SecurityEvent {
  event_type: string;
  event_data?: Record<string, any>;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

interface SystemStatus {
  overall_status: 'healthy' | 'warning' | 'critical';
  timestamp: string;
  summary: {
    metrics_count: number;
    critical_metrics: number;
    warning_metrics: number;
    security_events: number;
    critical_events: number;
    high_severity_events: number;
  };
  recent_critical_metrics: any[];
  recent_critical_events: any[];
}

interface HealthCheckResult {
  timestamp: string;
  services: {
    database: {
      status: string;
      latency: number;
      error?: string;
    };
    edge_functions: {
      status: string;
      latency: number;
      error?: string;
    };
  };
  overall_status: string;
}

export const useSecurityMonitor = () => {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [healthStatus, setHealthStatus] = useState<HealthCheckResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Performance metrics tracking
  const [performanceMetrics, setPerformanceMetrics] = useState({
    pageLoadTime: 0,
    renderTime: 0,
    networkLatency: 0,
    errorRate: 0
  });

  const recordMetric = useCallback(async (metric: SecurityMetric) => {
    try {
      const { data, error } = await supabase.functions.invoke('security-monitor/record-metric', {
        body: metric
      });
      
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Erro ao registrar métrica:', err);
      throw err;
    }
  }, []);

  const logSecurityEvent = useCallback(async (event: SecurityEvent) => {
    try {
      const { data, error } = await supabase.functions.invoke('security-monitor/log-security-event', {
        body: event
      });
      
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Erro ao registrar evento de segurança:', err);
      throw err;
    }
  }, []);

  const checkHealth = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('security-monitor/health-check');
      
      if (error) throw error;
      
      setHealthStatus(data);
      return data;
    } catch (err) {
      console.error('Erro no health check:', err);
      setError(err instanceof Error ? err.message : 'Erro no health check');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getSystemStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('security-monitor/system-status');
      
      if (error) throw error;
      
      setSystemStatus(data);
      return data;
    } catch (err) {
      console.error('Erro ao obter status do sistema:', err);
      setError(err instanceof Error ? err.message : 'Erro ao obter status');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getMetrics = useCallback(async (serviceName?: string, hours: number = 24) => {
    try {
      const params = new URLSearchParams();
      if (serviceName) params.append('service', serviceName);
      params.append('hours', hours.toString());

      const { data, error } = await supabase.functions.invoke(
        `security-monitor/get-metrics?${params.toString()}`
      );
      
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Erro ao obter métricas:', err);
      throw err;
    }
  }, []);

  // Auto-track performance metrics
  useEffect(() => {
    const trackPageLoad = () => {
      if (typeof window !== 'undefined' && window.performance) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        const pageLoadTime = navigation.loadEventEnd - navigation.startTime;
        const renderTime = navigation.domContentLoadedEventEnd - navigation.startTime;
        
        setPerformanceMetrics(prev => ({
          ...prev,
          pageLoadTime,
          renderTime
        }));

        // Record metrics to backend
        recordMetric({
          service_name: 'frontend',
          metric_name: 'page_load_time',
          metric_value: pageLoadTime,
          metric_unit: 'ms',
          status: pageLoadTime > 3000 ? 'warning' : 'healthy'
        }).catch(console.error);

        recordMetric({
          service_name: 'frontend',
          metric_name: 'render_time',
          metric_value: renderTime,
          metric_unit: 'ms',
          status: renderTime > 1500 ? 'warning' : 'healthy'
        }).catch(console.error);
      }
    };

    // Track on load and route changes
    if (document.readyState === 'complete') {
      trackPageLoad();
    } else {
      window.addEventListener('load', trackPageLoad);
    }

    return () => window.removeEventListener('load', trackPageLoad);
  }, [recordMetric]);

  // Auto health check periodically
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await checkHealth();
        await getSystemStatus();
      } catch (err) {
        // Handled by individual functions
      }
    }, 5 * 60 * 1000); // Every 5 minutes

    // Initial check
    checkHealth();
    getSystemStatus();

    return () => clearInterval(interval);
  }, [checkHealth, getSystemStatus]);

  // Track user errors
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      logSecurityEvent({
        event_type: 'frontend_error',
        event_data: {
          message: event.message,
          filename: event.filename,
          line: event.lineno,
          column: event.colno,
          stack: event.error?.stack,
          user_agent: navigator.userAgent
        },
        severity: 'medium'
      }).catch(console.error);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      logSecurityEvent({
        event_type: 'unhandled_promise_rejection',
        event_data: {
          reason: event.reason?.toString(),
          stack: event.reason?.stack,
          user_agent: navigator.userAgent
        },
        severity: 'high'
      }).catch(console.error);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [logSecurityEvent]);

  return {
    // State
    systemStatus,
    healthStatus,
    performanceMetrics,
    isLoading,
    error,

    // Actions
    recordMetric,
    logSecurityEvent,
    checkHealth,
    getSystemStatus,
    getMetrics,

    // Computed
    isSystemHealthy: systemStatus?.overall_status === 'healthy',
    hasCriticalIssues: systemStatus?.overall_status === 'critical',
    hasWarnings: systemStatus?.overall_status === 'warning'
  };
};
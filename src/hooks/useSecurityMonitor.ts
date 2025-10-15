/**
 * 🔒 SECURITY MONITOR HOOK - FASE 1: INTEGRAÇÃO BACKEND
 * Hook para conectar com o edge function security-monitor
 */

import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/customClient';

interface SystemStatus {
  overall_status: 'healthy' | 'warning' | 'critical';
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
  summary?: {
    metrics_count: number;
    critical_metrics: number;
    warning_metrics: number;
    security_events: number;
    critical_events: number;
    high_severity_events: number;
  };
}

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

export const useSecurityMonitor = () => {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recordMetric = useCallback(async (metric: SecurityMetric) => {
    try {
      if (!supabase?.functions?.invoke) {
        console.warn('⚠️ Supabase functions not available');
        return null;
      }

      const { data, error } = await supabase.functions.invoke('security-monitor/record-metric', {
        body: metric
      });

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error recording metric:', err);
      throw err;
    }
  }, []);

  const logSecurityEvent = useCallback(async (event: SecurityEvent) => {
    try {
      if (!supabase?.functions?.invoke) {
        console.warn('⚠️ Supabase functions not available');
        return null;
      }

      const { data, error } = await supabase.functions.invoke('security-monitor/log-security-event', {
        body: event
      });

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error logging security event:', err);
      throw err;
    }
  }, []);

  const checkHealth = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!supabase?.functions?.invoke) {
        setError('Supabase functions not available');
        return null;
      }

      const { data, error } = await supabase.functions.invoke('security-monitor/health-check');

      if (error) throw error;
      
      setHealthStatus(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Health check failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getSystemStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!supabase?.functions?.invoke) {
        setError('Supabase functions not available');
        return null;
      }

      const { data, error } = await supabase.functions.invoke('security-monitor/system-status');

      if (error) throw error;
      
      setSystemStatus(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'System status check failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getMetrics = useCallback(async (serviceName?: string, hours: number = 24) => {
    try {
      setIsLoading(true);
      setError(null);

      if (!supabase?.functions?.invoke) {
        setError('Supabase functions not available');
        return [];
      }

      const params = new URLSearchParams();
      if (serviceName) params.append('service', serviceName);
      params.append('hours', hours.toString());

      const { data, error } = await supabase.functions.invoke(
        `security-monitor/get-metrics?${params.toString()}`
      );

      if (error) throw error;
      
      setPerformanceMetrics(data?.metrics || []);
      return data?.metrics || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get metrics';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-refresh system status
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      getSystemStatus().catch(console.error);
    }, 30000); // 30 seconds

    // Initial check
    getSystemStatus().catch(console.error);

    return () => clearInterval(refreshInterval);
  }, [getSystemStatus]);

  // Calculate derived states
  const isSystemHealthy = systemStatus?.overall_status === 'healthy';
  const hasCriticalIssues = systemStatus?.overall_status === 'critical';
  const hasWarnings = systemStatus?.overall_status === 'warning';

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
    isSystemHealthy,
    hasCriticalIssues,
    hasWarnings
  };
};
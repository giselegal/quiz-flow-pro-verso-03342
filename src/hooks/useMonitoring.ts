/**
 * 📊 MONITORING HOOK - Phase 3 Implementation
 * Hook para integração fácil com sistema de monitoramento
 */

import { useEffect, useCallback, useState } from 'react';
import { healthCheckService, type HealthStatus } from '@/services/monitoring/HealthCheckService';
import { analyticsService } from '@/services/AnalyticsService';
import { errorTrackingService, type ErrorReport } from '@/services/monitoring/ErrorTrackingService';

export interface MonitoringState {
  healthStatus: HealthStatus | null;
  isHealthy: boolean;
  lastError: ErrorReport | null;
  errorCount: number;
  isMonitoring: boolean;
}

export const useMonitoring = (options?: {
  autoStart?: boolean;
  healthCheckInterval?: number;
  trackComponent?: string;
}) => {
  const [state, setState] = useState<MonitoringState>({
    healthStatus: null,
    isHealthy: true,
    lastError: null,
    errorCount: 0,
    isMonitoring: false
  });

  const { autoStart = true, healthCheckInterval = 30000, trackComponent } = options || {};

  // Inicializar monitoramento
  useEffect(() => {
    if (autoStart) {
      startMonitoring();
    }

    return () => {
      stopMonitoring();
    };
  }, [autoStart]);

  // Escutar mudanças de saúde
  useEffect(() => {
    const handleHealthChange = (status: HealthStatus) => {
      setState(prev => ({
        ...prev,
        healthStatus: status,
        isHealthy: status.status === 'healthy'
      }));
    };

    healthCheckService.onHealthChange(handleHealthChange);
  }, []);

  // Escutar erros
  useEffect(() => {
    const handleError = (error: ErrorReport) => {
      setState(prev => ({
        ...prev,
        lastError: error,
        errorCount: prev.errorCount + 1
      }));
    };

    errorTrackingService.onError(handleError);

    return () => {
      errorTrackingService.offError(handleError);
    };
  }, []);

  /**
   * Iniciar monitoramento
   */
  const startMonitoring = useCallback(async () => {
    try {
      healthCheckService.startMonitoring(healthCheckInterval);
      
      // Verificação inicial
      const initialHealth = await healthCheckService.performHealthCheck();
      setState(prev => ({
        ...prev,
        healthStatus: initialHealth,
        isHealthy: initialHealth.status === 'healthy',
        isMonitoring: true
      }));

      console.log('📊 Monitoring started');
    } catch (error) {
      console.error('Failed to start monitoring:', error);
    }
  }, [healthCheckInterval]);

  /**
   * Parar monitoramento
   */
  const stopMonitoring = useCallback(() => {
    healthCheckService.stopMonitoring();
    setState(prev => ({
      ...prev,
      isMonitoring: false
    }));

    console.log('📊 Monitoring stopped');
  }, []);

  /**
   * Verificar saúde manualmente
   */
  const checkHealth = useCallback(async () => {
    try {
      const health = await healthCheckService.performHealthCheck();
      setState(prev => ({
        ...prev,
        healthStatus: health,
        isHealthy: health.status === 'healthy'
      }));
      return health;
    } catch (error) {
      console.error('Health check failed:', error);
      return null;
    }
  }, []);

  /**
   * Rastrear evento
   */
  const trackEvent = useCallback((eventName: string, properties?: Record<string, any>) => {
    analyticsService.trackEvent({
      event_name: eventName,
      event_category: trackComponent || 'component',
      custom_parameters: {
        component: trackComponent,
        ...properties
      }
    });
  }, [trackComponent]);

  /**
   * Rastrear erro
   */
  const trackError = useCallback((error: Error | string, context?: Record<string, any>) => {
    const errorId = errorTrackingService.captureError(error, {
      component: trackComponent,
      metadata: context
    });

    // Também rastrear no analytics
    analyticsService.trackError(
      typeof error === 'string' ? new Error(error) : error,
      trackComponent
    );

    return errorId;
  }, [trackComponent]);

  /**
   * Rastrear performance
   */
  const trackPerformance = useCallback((metric: string, value: number, unit?: string) => {
    analyticsService.trackPerformance(metric, value, unit);
  }, []);

  /**
   * Rastrear ação do editor
   */
  const trackEditorAction = useCallback((action: string, details?: Record<string, any>) => {
    analyticsService.trackEditorAction(action, {
      component: trackComponent,
      ...details
    });
  }, [trackComponent]);

  /**
   * Obter estatísticas de erro
   */
  const getErrorStats = useCallback(() => {
    return errorTrackingService.getErrorStats();
  }, []);

  /**
   * Obter métricas da sessão
   */
  const getSessionMetrics = useCallback(() => {
    return analyticsService.getSessionMetrics();
  }, []);

  /**
   * Limpar erros
   */
  const clearErrors = useCallback((filter?: { level?: string; component?: string }) => {
    errorTrackingService.clearErrors(filter);
    setState(prev => ({
      ...prev,
      errorCount: 0,
      lastError: null
    }));
  }, []);

  return {
    // Estado
    ...state,
    
    // Ações
    startMonitoring,
    stopMonitoring,
    checkHealth,
    
    // Tracking
    trackEvent,
    trackError,
    trackPerformance,
    trackEditorAction,
    
    // Dados
    getErrorStats,
    getSessionMetrics,
    clearErrors,
    
    // Utilitários
    isServiceHealthy: (serviceName: string) => {
      if (!state.healthStatus) return null;
      const service = state.healthStatus.services[serviceName as keyof typeof state.healthStatus.services];
      return service?.status === 'up';
    },
    
    getServiceHealth: (serviceName: string) => {
      if (!state.healthStatus) return null;
      return state.healthStatus.services[serviceName as keyof typeof state.healthStatus.services];
    }
  };
};

/**
 * Hook específico para componentes do editor
 */
export const useEditorMonitoring = (componentName: string) => {
  const monitoring = useMonitoring({ 
    trackComponent: componentName,
    autoStart: true 
  });

  // Auto-track mount/unmount
  useEffect(() => {
    monitoring.trackEvent('component_mounted', { component: componentName });
    
    return () => {
      monitoring.trackEvent('component_unmounted', { component: componentName });
    };
  }, [componentName, monitoring]);

  return monitoring;
};

/**
 * Hook para alertas críticos
 */
export const useMonitoringAlerts = () => {
  const [alerts, setAlerts] = useState<Array<{
    id: string;
    type: 'error' | 'warning' | 'info';
    message: string;
    timestamp: string;
  }>>([]);

  useEffect(() => {
    const handleError = (error: ErrorReport) => {
      if (error.level === 'error') {
        setAlerts(prev => [{
          id: error.id,
          type: 'error',
          message: error.message,
          timestamp: error.timestamp
        }, ...prev.slice(0, 9)]); // Manter apenas 10 alertas
      }
    };

    const handleHealthChange = (status: HealthStatus) => {
      if (status.status === 'unhealthy') {
        setAlerts(prev => [{
          id: `health_${Date.now()}`,
          type: 'error',
          message: 'Sistema em estado crítico',
          timestamp: status.timestamp
        }, ...prev.slice(0, 9)]);
      }
    };

    errorTrackingService.onError(handleError);
    healthCheckService.onHealthChange(handleHealthChange);

    return () => {
      errorTrackingService.offError(handleError);
    };
  }, []);

  const dismissAlert = useCallback((id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  }, []);

  const clearAllAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  return {
    alerts,
    dismissAlert,
    clearAllAlerts,
    hasAlerts: alerts.length > 0,
    errorCount: alerts.filter(a => a.type === 'error').length
  };
};
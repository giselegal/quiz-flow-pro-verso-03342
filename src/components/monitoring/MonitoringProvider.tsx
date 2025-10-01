/**
 * 📊 MONITORING PROVIDER - Phase 3 Implementation
 * Provider para contexto global de monitoramento
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { healthCheckService, type HealthStatus } from '@/services/monitoring/HealthCheckService';
import { analyticsService } from '@/services/monitoring/AnalyticsService';
import { errorTrackingService, type ErrorReport } from '@/services/monitoring/ErrorTrackingService';
import { useToast } from '@/hooks/use-toast';

interface MonitoringContextType {
  healthStatus: HealthStatus | null;
  isHealthy: boolean;
  errorCount: number;
  lastError: ErrorReport | null;
  isMonitoring: boolean;
  startMonitoring: () => void;
  stopMonitoring: () => void;
  trackEvent: (name: string, properties?: Record<string, any>) => void;
  trackError: (error: Error | string, context?: Record<string, any>) => string;
}

const MonitoringContext = createContext<MonitoringContextType | null>(null);

interface MonitoringProviderProps {
  children: React.ReactNode;
  enableAlerts?: boolean;
  healthCheckInterval?: number;
  enableAnalytics?: boolean;
}

export const MonitoringProvider: React.FC<MonitoringProviderProps> = ({
  children,
  enableAlerts = true,
  healthCheckInterval = 30000,
  enableAnalytics = true
}) => {
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [errorCount, setErrorCount] = useState(0);
  const [lastError, setLastError] = useState<ErrorReport | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const { toast } = useToast();

  const isHealthy = healthStatus?.status === 'healthy' || false;

  useEffect(() => {
    // Inicializar serviços
    if (enableAnalytics) {
      analyticsService.initialize();
    }

    // Configurar listeners
    const handleHealthChange = (status: HealthStatus) => {
      setHealthStatus(status);
      
      // Alertas críticos
      if (enableAlerts && status.status === 'unhealthy') {
        toast({
          title: "⚠️ Sistema Crítico",
          description: "Detectados problemas no sistema. Verificando...",
          variant: "destructive"
        });
      }
    };

    const handleError = (error: ErrorReport) => {
      setLastError(error);
      setErrorCount(prev => prev + 1);

      // Alertas de erro crítico
      if (enableAlerts && error.level === 'error') {
        toast({
          title: "🚨 Erro Detectado",
          description: error.message.substring(0, 100),
          variant: "destructive"
        });
      }
    };

    healthCheckService.onHealthChange(handleHealthChange);
    errorTrackingService.onError(handleError);

    // Iniciar monitoramento automático
    startMonitoring();

    return () => {
      stopMonitoring();
      errorTrackingService.offError(handleError);
    };
  }, [enableAlerts, enableAnalytics, toast]);

  const startMonitoring = () => {
    if (!isMonitoring) {
      healthCheckService.startMonitoring(healthCheckInterval);
      setIsMonitoring(true);
      
      if (enableAnalytics) {
        analyticsService.trackEvent({
          event_name: 'monitoring_started',
          event_category: 'system'
        });
      }
    }
  };

  const stopMonitoring = () => {
    if (isMonitoring) {
      healthCheckService.stopMonitoring();
      setIsMonitoring(false);
      
      if (enableAnalytics) {
        analyticsService.trackEvent({
          event_name: 'monitoring_stopped',
          event_category: 'system'
        });
      }
    }
  };

  const trackEvent = (name: string, properties?: Record<string, any>) => {
    if (enableAnalytics) {
      analyticsService.trackEvent({
        event_name: name,
        event_category: 'application',
        custom_parameters: properties
      });
    }
  };

  const trackError = (error: Error | string, context?: Record<string, any>): string => {
    return errorTrackingService.captureError(error, {
      component: 'application',
      metadata: context
    });
  };

  const contextValue: MonitoringContextType = {
    healthStatus,
    isHealthy,
    errorCount,
    lastError,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    trackEvent,
    trackError
  };

  return (
    <MonitoringContext.Provider value={contextValue}>
      {children}
    </MonitoringContext.Provider>
  );
};

export const useMonitoringContext = (): MonitoringContextType => {
  const context = useContext(MonitoringContext);
  if (!context) {
    throw new Error('useMonitoringContext must be used within a MonitoringProvider');
  }
  return context;
};

/**
 * HOC para componentes que precisam de monitoramento
 */
export const withMonitoring = <P extends object>(
  Component: React.ComponentType<P>,
  componentName?: string
) => {
  const WrappedComponent: React.FC<P> = (props) => {
    const { trackEvent, trackError } = useMonitoringContext();

    useEffect(() => {
      trackEvent('component_mounted', { component: componentName });
      
      return () => {
        trackEvent('component_unmounted', { component: componentName });
      };
    }, [trackEvent]);

    // Adicionar error boundary
    const enhancedProps = {
      ...props,
      onError: (error: Error) => {
        trackError(error, { component: componentName });
        // Chamar onError original se existir
        if ('onError' in props && typeof props.onError === 'function') {
          (props.onError as Function)(error);
        }
      }
    };

    return <Component {...enhancedProps} />;
  };

  WrappedComponent.displayName = `withMonitoring(${componentName || Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

export default MonitoringProvider;
/**
 * 🎯 OBSERVABILITY HOOKS - PHASE 3: REACT INTEGRATION
 * Hooks para integração fácil com o sistema de observabilidade
 */

import { useEffect, useCallback, useRef, useState } from 'react';
import { observabilityManager } from '@/core/observability/ObservabilityManager';
import { structuredLogger } from '@/core/observability/StructuredLogger';

/**
 * Hook principal de observabilidade
 */
export const useObservability = (componentName: string) => {
  const componentLogger = structuredLogger;
  
  // Track component mount/unmount
  useEffect(() => {
    observabilityManager.trackInteraction('component_mounted', componentName);
    
    return () => {
      observabilityManager.trackInteraction('component_unmounted', componentName);
    };
  }, [componentName]);

  const trackInteraction = useCallback((action: string, metadata?: Record<string, any>) => {
    observabilityManager.trackInteraction(action, componentName, metadata);
  }, [componentName]);

  const trackError = useCallback((message: string, context?: Record<string, any>) => {
    observabilityManager.logError(message, componentName, context);
  }, [componentName]);

  const trackConversion = useCallback((event: string, value?: number, funnelStep?: number) => {
    observabilityManager.trackConversion(event, value, funnelStep);
  }, []);

  return {
    trackInteraction,
    trackError,
    trackConversion,
    logger: componentLogger
  };
};

/**
 * Hook para monitoramento de performance de componentes
 */
export const usePerformanceMonitoring = (componentName: string) => {
  const renderStartTime = useRef<number>();
  const renderCount = useRef(0);

  useEffect(() => {
    renderStartTime.current = performance.now();
    renderCount.current += 1;
  });

  useEffect(() => {
    if (renderStartTime.current) {
      const renderTime = performance.now() - renderStartTime.current;
      
      if (renderTime > 16) { // More than 1 frame (16ms at 60fps)
        structuredLogger.warn(`Slow render detected in ${componentName}`, {
          renderTime: renderTime.toFixed(2),
          renderCount: renderCount.current,
          component: componentName,
          category: 'performance'
        });
      }
    }
  });

  return {
    renderCount: renderCount.current
  };
};

/**
 * Hook para rastreamento de interações de usuário
 */
export const useUserTracking = () => {
  const trackClick = useCallback((element: string, metadata?: Record<string, any>) => {
    observabilityManager.trackInteraction('click', element, metadata);
  }, []);

  const trackPageView = useCallback((page: string, metadata?: Record<string, any>) => {
    observabilityManager.trackInteraction('page_view', page, {
      url: window.location.href,
      referrer: document.referrer,
      ...metadata
    });
  }, []);

  const trackFormSubmission = useCallback((formName: string, success: boolean, metadata?: Record<string, any>) => {
    observabilityManager.trackInteraction(
      success ? 'form_submit_success' : 'form_submit_error', 
      formName, 
      metadata
    );
  }, []);

  return {
    trackClick,
    trackPageView,
    trackFormSubmission
  };
};

/**
 * Hook para monitoramento de funil
 */
export const useFunnelTracking = () => {
  const trackFunnelStep = useCallback((step: number, stepName: string, metadata?: Record<string, any>) => {
    observabilityManager.trackInteraction('funnel_step', 'funnel', {
      step,
      stepName,
      progress: `${step}/21`,
      ...metadata
    });
  }, []);

  const trackFunnelCompletion = useCallback((metadata?: Record<string, any>) => {
    observabilityManager.trackConversion('funnel_completed', undefined, 21);
    observabilityManager.trackInteraction('funnel_completed', 'funnel', metadata);
  }, []);

  const trackFunnelDropoff = useCallback((step: number, reason?: string, metadata?: Record<string, any>) => {
    observabilityManager.trackInteraction('funnel_dropoff', 'funnel', {
      step,
      reason,
      ...metadata
    });
  }, []);

  return {
    trackFunnelStep,
    trackFunnelCompletion,
    trackFunnelDropoff
  };
};

/**
 * Hook para monitoramento de erros
 */
export const useErrorTracking = () => {
  const trackError = useCallback((error: Error, context: string, metadata?: Record<string, any>) => {
    observabilityManager.logError(error.message, context, {
      stack: error.stack,
      name: error.name,
      ...metadata
    });
  }, []);

  const trackAPIError = useCallback((endpoint: string, status: number, message: string, metadata?: Record<string, any>) => {
    observabilityManager.logError(`API Error: ${message}`, 'api', {
      endpoint,
      status,
      message,
      ...metadata
    });
  }, []);

  return {
    trackError,
    trackAPIError
  };
};

/**
 * Hook para obter dados do dashboard
 */
export const useDashboardData = (autoRefresh = true, interval = 10000) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const dashboardData = observabilityManager.getDashboardData();
      setData(dashboardData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    
    if (autoRefresh) {
      const intervalId = setInterval(fetchData, interval);
      return () => clearInterval(intervalId);
    }
  }, [fetchData, autoRefresh, interval]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
};
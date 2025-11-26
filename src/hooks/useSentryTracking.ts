/**
 * 🎯 SENTRY MONITORING HOOKS - Sprint 1
 * 
 * Hooks React para facilitar integração com Sentry e business metrics
 * 
 * @module SentryHooks
 */

import { useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import { businessMetrics } from '@/lib/monitoring/businessMetrics';
import { addSentryBreadcrumb } from '@/config/sentry.config';

/**
 * Hook para rastrear pageviews automaticamente
 */
export function useSentryPageTracking() {
  const location = useLocation();

  useEffect(() => {
    // Rastrear navegação
    addSentryBreadcrumb({
      category: 'navigation',
      message: `Navigated to ${location.pathname}`,
      level: 'info',
      data: {
        pathname: location.pathname,
        search: location.search,
      },
    });

    // Atualizar tag
    Sentry.setTag('current_page', location.pathname);

    // Transaction para performance
    Sentry.startSpan(
      {
        name: `pageview.${location.pathname}`,
        op: 'navigation',
      },
      () => {}
    );
  }, [location]);
}

/**
 * Hook para rastrear sessão de quiz
 */
export function useQuizSessionTracking(
  sessionId: string | undefined,
  funnelId: string | undefined,
  totalSteps: number = 21
) {
  const sessionStarted = useRef(false);

  useEffect(() => {
    if (!sessionId || !funnelId || sessionStarted.current) return;

    // Iniciar rastreamento
    businessMetrics.startSession(sessionId, funnelId, totalSteps);
    sessionStarted.current = true;

    // Cleanup ao desmontar
    return () => {
      // Não limpar automaticamente - deixar para trackCompletion ou trackDropOff
    };
  }, [sessionId, funnelId, totalSteps]);

  const trackStep = useCallback(
    (stepNumber: number) => {
      if (!sessionId) return;
      businessMetrics.trackStepProgress(sessionId, stepNumber);
    },
    [sessionId]
  );

  const trackCompletion = useCallback(() => {
    if (!sessionId) return;
    businessMetrics.trackCompletion(sessionId);
  }, [sessionId]);

  const trackDropOff = useCallback(
    (stepNumber: number, reason?: string) => {
      if (!sessionId) return;
      businessMetrics.trackDropOff(sessionId, stepNumber, reason);
    },
    [sessionId]
  );

  const trackError = useCallback(
    (stepNumber: number, error: Error) => {
      if (!sessionId) return;
      businessMetrics.trackStepError(sessionId, stepNumber, error);
    },
    [sessionId]
  );

  return {
    trackStep,
    trackCompletion,
    trackDropOff,
    trackError,
  };
}

/**
 * Hook para rastrear performance de componentes
 */
export function useComponentPerformance(componentName: string) {
  const startTime = useRef<number>(Date.now());

  useEffect(() => {
    // Marcar montagem
    const mountTime = Date.now() - startTime.current;

    if (mountTime > 1000) {
      // Alertar se componente demorou muito para montar
      Sentry.startSpan(
        {
          name: `component.mount.slow`,
          op: 'performance',
          attributes: {
            component_name: componentName,
            mount_time_ms: mountTime,
          },
        },
        () => {}
      );
    }

    addSentryBreadcrumb({
      category: 'ui',
      message: `Component ${componentName} mounted`,
      level: 'debug',
      data: {
        componentName,
        mountTime,
      },
    });

    // Cleanup
    return () => {
      const lifecycleTime = Date.now() - startTime.current;

      addSentryBreadcrumb({
        category: 'ui',
        message: `Component ${componentName} unmounted`,
        level: 'debug',
        data: {
          componentName,
          lifecycleTime,
        },
      });
    };
  }, [componentName]);
}

/**
 * Hook para rastrear user actions
 */
export function useUserActionTracking() {
  const trackAction = useCallback((actionName: string, data?: Record<string, any>) => {
    addSentryBreadcrumb({
      category: 'user',
      message: `User action: ${actionName}`,
      level: 'info',
      data,
    });

    // Transaction para ações importantes
    if (['submit', 'purchase', 'signup'].some((key) => actionName.includes(key))) {
      Sentry.startSpan(
        {
          name: `user.${actionName}`,
          op: 'interaction',
          attributes: data || {},
        },
        () => {}
      );
    }
  }, []);

  const trackClick = useCallback(
    (elementName: string, data?: Record<string, any>) => {
      trackAction(`click.${elementName}`, data);
    },
    [trackAction]
  );

  const trackInput = useCallback(
    (fieldName: string, data?: Record<string, any>) => {
      trackAction(`input.${fieldName}`, data);
    },
    [trackAction]
  );

  return {
    trackAction,
    trackClick,
    trackInput,
  };
}

/**
 * Hook para rastrear erros customizados
 */
export function useSentryErrorHandler() {
  const captureError = useCallback((error: Error, context?: Record<string, any>) => {
    Sentry.withScope((scope) => {
      if (context) {
        scope.setContext('custom_error', context);
      }
      Sentry.captureException(error);
    });
  }, []);

  const captureMessage = useCallback(
    (message: string, level: Sentry.SeverityLevel = 'info', context?: Record<string, any>) => {
      Sentry.withScope((scope) => {
        if (context) {
          scope.setContext('custom_message', context);
        }
        Sentry.captureMessage(message, level);
      });
    },
    []
  );

  return {
    captureError,
    captureMessage,
  };
}

/**
 * Hook para rastrear API calls
 */
export function useAPITracking() {
  const trackAPICall = useCallback(
    (endpoint: string, method: string, duration: number, status: number) => {
      addSentryBreadcrumb({
        category: 'http',
        message: `${method} ${endpoint}`,
        level: status >= 400 ? 'error' : 'info',
        data: {
          endpoint,
          method,
          duration,
          status,
        },
      });

      // Transaction para chamadas lentas ou com erro
      if (duration > 3000 || status >= 400) {
        Sentry.startSpan(
          {
            name: `api.${method}.${endpoint}`,
            op: 'http.client',
            attributes: {
              duration_ms: duration,
              status,
              endpoint,
              method,
            },
          },
          () => {}
        );
      }
    },
    []
  );

  return { trackAPICall };
}

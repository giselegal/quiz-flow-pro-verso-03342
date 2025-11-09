/**
 * 🔍 SENTRY CONFIGURATION - G47 FIX
 * 
 * Configuração centralizada do Sentry para error tracking e monitoring.
 * 
 * FEATURES:
 * ✅ Error tracking automático
 * ✅ Performance monitoring
 * ✅ Breadcrumbs para debugging
 * ✅ User context tracking
 * ✅ Release tracking
 * ✅ Environment separation (dev/staging/prod)
 */

import * as Sentry from '@sentry/react';

export interface SentryConfig {
  dsn?: string;
  environment: string;
  enabled: boolean;
  tracesSampleRate: number;
  replaysSessionSampleRate: number;
  replaysOnErrorSampleRate: number;
}

/**
 * Configuração do Sentry baseada no ambiente
 */
export const sentryConfig: SentryConfig = {
  // DSN do Sentry (substituir com o real em produção)
  dsn: import.meta.env.VITE_SENTRY_DSN || '',
  
  // Environment detection
  environment: import.meta.env.MODE || 'development',
  
  // Habilitar apenas em produção ou quando explicitamente configurado
  enabled: import.meta.env.MODE === 'production' || import.meta.env.VITE_SENTRY_ENABLED === 'true',
  
  // Performance Monitoring - 10% em produção, 100% em dev
  tracesSampleRate: import.meta.env.MODE === 'production' ? 0.1 : 1.0,
  
  // Session Replay - 10% das sessões normais
  replaysSessionSampleRate: 0.1,
  
  // Session Replay - 100% das sessões com erro
  replaysOnErrorSampleRate: 1.0,
};

/**
 * Inicializar Sentry com configuração otimizada
 */
export function initializeSentry(): void {
  if (!sentryConfig.enabled) {
    console.info('[Sentry] Desabilitado no ambiente:', sentryConfig.environment);
    return;
  }

  if (!sentryConfig.dsn) {
    console.warn('[Sentry] DSN não configurado - Sentry não será inicializado');
    return;
  }

  Sentry.init({
    dsn: sentryConfig.dsn,
    environment: sentryConfig.environment,
    
    // Performance Monitoring
    integrations: [
      // Browser Tracing para performance
      Sentry.browserTracingIntegration(),
      
      // Session Replay para debugging visual
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
      
      // Breadcrumbs para contexto
      Sentry.breadcrumbsIntegration({
        console: true,
        dom: true,
        fetch: true,
        history: true,
        xhr: true,
      }),
    ],
    
    // Performance sampling
    tracesSampleRate: sentryConfig.tracesSampleRate,
    
    // Session Replay sampling
    replaysSessionSampleRate: sentryConfig.replaysSessionSampleRate,
    replaysOnErrorSampleRate: sentryConfig.replaysOnErrorSampleRate,
    
    // Release tracking (vem do build)
    release: import.meta.env.VITE_APP_VERSION || 'development',
    
    // Configurações adicionais
    beforeSend(event, hint) {
      // Filtrar erros de extensões do browser
      if (event.exception) {
        const error = hint.originalException;
        if (error && typeof error === 'object' && 'message' in error) {
          const message = String(error.message);
          // Ignorar erros de extensões
          if (
            message.includes('chrome-extension://') ||
            message.includes('moz-extension://') ||
            message.includes('safari-extension://')
          ) {
            return null;
          }
        }
      }
      
      return event;
    },
    
    // Ignorar erros conhecidos e não-críticos
    ignoreErrors: [
      // Erros de rede que não podemos controlar
      'Network request failed',
      'Failed to fetch',
      'NetworkError',
      
      // Erros de browser/extensões
      'ResizeObserver loop limit exceeded',
      'Non-Error promise rejection captured',
      
      // Erros de third-party scripts
      'Script error',
    ],
    
    // Configurar beforeBreadcrumb para adicionar contexto
    beforeBreadcrumb(breadcrumb, hint) {
      // Adicionar dados extras em breadcrumbs de fetch
      if (breadcrumb.category === 'fetch') {
        const url = breadcrumb.data?.url;
        if (url) {
          breadcrumb.data = {
            ...breadcrumb.data,
            timestamp: new Date().toISOString(),
          };
        }
      }
      
      return breadcrumb;
    },
  });

  console.info('[Sentry] Inicializado com sucesso', {
    environment: sentryConfig.environment,
    tracesSampleRate: sentryConfig.tracesSampleRate,
  });
}

/**
 * Adicionar contexto do usuário ao Sentry
 */
export function setSentryUser(user: { id: string; email?: string; username?: string }): void {
  if (!sentryConfig.enabled) return;
  
  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.username,
  });
}

/**
 * Remover contexto do usuário (logout)
 */
export function clearSentryUser(): void {
  if (!sentryConfig.enabled) return;
  Sentry.setUser(null);
}

/**
 * Adicionar contexto customizado (funnel, step, etc.)
 */
export function setSentryContext(key: string, context: Record<string, any>): void {
  if (!sentryConfig.enabled) return;
  Sentry.setContext(key, context);
}

/**
 * Adicionar tag customizada
 */
export function setSentryTag(key: string, value: string): void {
  if (!sentryConfig.enabled) return;
  Sentry.setTag(key, value);
}

/**
 * Capturar erro manualmente
 */
export function captureSentryError(error: Error, context?: Record<string, any>): void {
  if (!sentryConfig.enabled) return;
  
  if (context) {
    Sentry.withScope((scope) => {
      Object.entries(context).forEach(([key, value]) => {
        scope.setExtra(key, value);
      });
      Sentry.captureException(error);
    });
  } else {
    Sentry.captureException(error);
  }
}

/**
 * Capturar mensagem manualmente
 */
export function captureSentryMessage(message: string, level: Sentry.SeverityLevel = 'info'): void {
  if (!sentryConfig.enabled) return;
  Sentry.captureMessage(message, level);
}

/**
 * Adicionar breadcrumb manualmente
 */
export function addSentryBreadcrumb(breadcrumb: Sentry.Breadcrumb): void {
  if (!sentryConfig.enabled) return;
  Sentry.addBreadcrumb(breadcrumb);
}

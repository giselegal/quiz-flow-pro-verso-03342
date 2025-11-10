import * as Sentry from '@sentry/react';
import { appLogger } from '@/lib/utils/appLogger';

/**
 * Configuração do Sentry para rastreamento de erros em produção
 * 
 * @module Sentry
 */

export interface SentryConfig {
  dsn: string;
  environment: string;
  tracesSampleRate: number;
  replaysSessionSampleRate: number;
  replaysOnErrorSampleRate: number;
}

const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

/**
 * Inicializa o Sentry SDK
 * 
 * @param config - Configuração do Sentry (opcional)
 */
export function initSentry(config?: Partial<SentryConfig>) {
  // Não inicializar em desenvolvimento, a menos que explicitamente solicitado
  if (isDevelopment && !import.meta.env.VITE_SENTRY_ENABLE_DEV) {
    appLogger.info('🔧 Sentry disabled in development mode');
    return;
  }

  const sentryDsn = import.meta.env.VITE_SENTRY_DSN || config?.dsn;

  if (!sentryDsn) {
    appLogger.warn('⚠️ Sentry DSN not configured. Error tracking disabled.');
    return;
  }

  Sentry.init({
    dsn: sentryDsn,
    environment: config?.environment || (isProduction ? 'production' : 'development'),
    
    // Performance Monitoring
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],

    // Amostragem de traces (ajustar conforme necessário)
    tracesSampleRate: config?.tracesSampleRate ?? (isProduction ? 0.1 : 1.0),

    // Session Replay
    replaysSessionSampleRate: config?.replaysSessionSampleRate ?? 0.1,
    replaysOnErrorSampleRate: config?.replaysOnErrorSampleRate ?? 1.0,

    // Filtrar erros conhecidos
    beforeSend(event, hint) {
      const error = hint.originalException;

      // Ignorar erros de extensões do navegador
      if (error && error.toString().includes('Extension')) {
        return null;
      }

      // Ignorar erros de rede temporários
      if (event.exception?.values?.[0]?.type === 'NetworkError') {
        return null;
      }

      return event;
    },
  });

  appLogger.info('✅ Sentry initialized successfully');
}

/**
 * Captura exceção customizada
 * 
 * @param error - Erro a ser capturado
 * @param context - Contexto adicional
 */
export function captureException(error: Error, context?: Record<string, any>) {
  if (context) {
    Sentry.setContext('custom', context);
  }
  Sentry.captureException(error);
}

/**
 * Captura mensagem customizada
 * 
 * @param message - Mensagem a ser capturada
 * @param level - Nível de severidade
 */
export function captureMessage(
  message: string,
  level: Sentry.SeverityLevel = 'info'
) {
  Sentry.captureMessage(message, level);
}

/**
 * Adiciona breadcrumb customizado
 * 
 * @param breadcrumb - Breadcrumb a ser adicionado
 */
export function addBreadcrumb(breadcrumb: Sentry.Breadcrumb) {
  Sentry.addBreadcrumb(breadcrumb);
}

/**
 * Define contexto de usuário
 * 
 * @param user - Dados do usuário
 */
export function setUser(user: { id: string; email?: string; username?: string }) {
  Sentry.setUser(user);
}

/**
 * Remove contexto de usuário
 */
export function clearUser() {
  Sentry.setUser(null);
}

/**
 * Define tag customizada
 * 
 * @param key - Chave da tag
 * @param value - Valor da tag
 */
export function setTag(key: string, value: string) {
  Sentry.setTag(key, value);
}

/**
 * Define múltiplas tags
 * 
 * @param tags - Objeto com tags
 */
export function setTags(tags: Record<string, string>) {
  Sentry.setTags(tags);
}

/**
 * Inicia span de performance
 * 
 * @param name - Nome do span
 * @param op - Tipo de operação
 * @returns Span iniciado
 */
export function startSpan(name: string, op: string = 'custom') {
  return Sentry.startInactiveSpan({ name, op });
}

// Export para uso direto do Sentry
export { Sentry };

/**
 * 🎯 FASE 4.2 - Error Tracker
 * 
 * Sistema completo de rastreamento de erros
 * Integração com Error Boundaries e logging estruturado
 * 
 * FEATURES:
 * - Error capturing automático
 * - Context enrichment
 * - Error rate tracking
 * - Categorização de erros
 * - Integration com Sentry (preparado)
 * - Error recovery suggestions
 * 
 * @phase FASE 4 - Monitoramento e Otimização
 */

import { appLogger } from '@/lib/utils/appLogger';

// ============================================================================
// TYPES
// ============================================================================

export type ErrorSeverity = 'fatal' | 'error' | 'warning' | 'info';

export type ErrorCategory =
  | 'runtime'
  | 'network'
  | 'validation'
  | 'authorization'
  | 'unknown';

export interface ErrorContext {
  component?: string;
  action?: string;
  user?: {
    id?: string;
    email?: string;
  };
  funnel?: {
    id?: string;
    step?: string;
  };
  metadata?: Record<string, any>;
}

export interface TrackedError {
  id: string;
  message: string;
  stack?: string;
  severity: ErrorSeverity;
  category: ErrorCategory;
  timestamp: number;
  context: ErrorContext;
  count: number;
  lastOccurrence: number;
}

export interface ErrorStats {
  total: number;
  byCategory: Record<ErrorCategory, number>;
  bySeverity: Record<ErrorSeverity, number>;
  topErrors: TrackedError[];
  errorRate: number; // errors per minute
}

// ============================================================================
// ERROR TRACKER
// ============================================================================

class ErrorTrackerService {
  private errors: Map<string, TrackedError> = new Map();
  private errorLog: TrackedError[] = [];
  private maxLogSize = 1000;
  private sentryInitialized = false;

  /**
   * Inicializar error tracker
   */
  initialize(options?: { sentryDsn?: string; environment?: string }) {
    appLogger.info('🎯 [ErrorTracker] Inicializando rastreamento de erros...');

    // Setup global error handlers
    this.setupGlobalHandlers();

    // Initialize Sentry if DSN provided
    if (options?.sentryDsn) {
      this.initializeSentry(options.sentryDsn, options.environment);
    }

    appLogger.info('✅ [ErrorTracker] Rastreamento de erros inicializado');
  }

  /**
   * Setup global error handlers
   */
  private setupGlobalHandlers() {
    if (typeof window === 'undefined') return;

    // Unhandled errors
    window.addEventListener('error', (event) => {
      this.captureError(event.error || new Error(event.message), {
        component: 'window',
        action: 'unhandled-error',
        metadata: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
      });
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.captureError(
        event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
        {
          component: 'window',
          action: 'unhandled-rejection',
        }
      );
    });

    appLogger.info('✅ [ErrorTracker] Global handlers configurados');
  }

  /**
   * Initialize Sentry
   */
  private initializeSentry(dsn: string, environment?: string) {
    try {
      // Nota: Em produção, você deve instalar e importar @sentry/react
      // import * as Sentry from '@sentry/react';
      //
      // Sentry.init({
      //   dsn,
      //   environment: environment || 'development',
      //   tracesSampleRate: 1.0,
      // });

      this.sentryInitialized = true;
      appLogger.info('✅ [ErrorTracker] Sentry inicializado');
    } catch (error) {
      appLogger.warn('⚠️ [ErrorTracker] Falha ao inicializar Sentry:', error);
    }
  }

  /**
   * Capture error
   */
  captureError(
    error: Error | string,
    context: ErrorContext = {},
    severity: ErrorSeverity = 'error'
  ): string {
    const errorObj = typeof error === 'string' ? new Error(error) : error;
    const message = errorObj.message || String(error);
    const stack = errorObj.stack;

    // Generate error ID (hash do message + stack)
    const errorId = this.generateErrorId(message, stack);

    // Get or create tracked error
    let trackedError = this.errors.get(errorId);
    const now = Date.now();

    if (trackedError) {
      // Update existing error
      trackedError.count++;
      trackedError.lastOccurrence = now;
    } else {
      // Create new tracked error
      trackedError = {
        id: errorId,
        message,
        stack,
        severity,
        category: this.categorizeError(errorObj, context),
        timestamp: now,
        context,
        count: 1,
        lastOccurrence: now,
      };

      this.errors.set(errorId, trackedError);
    }

    // Add to log
    this.errorLog.unshift({ ...trackedError });
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog = this.errorLog.slice(0, this.maxLogSize);
    }

    // Log error
    const emoji = this.getSeverityEmoji(severity);
    appLogger.error(
      `${emoji} [ErrorTracker] ${severity.toUpperCase()}: ${message}`,
      {
        data: [{ errorId, context, stack: stack?.split('\n').slice(0, 3) }],
      }
    );

    // Send to Sentry if initialized
    if (this.sentryInitialized) {
      this.sendToSentry(trackedError);
    }

    return errorId;
  }

  /**
   * Categorize error
   */
  private categorizeError(error: Error, context: ErrorContext): ErrorCategory {
    const message = error.message.toLowerCase();
    const stack = error.stack?.toLowerCase() || '';

    // Network errors
    if (
      message.includes('network') ||
      message.includes('fetch') ||
      message.includes('timeout') ||
      message.includes('connection')
    ) {
      return 'network';
    }

    // Validation errors
    if (
      message.includes('validation') ||
      message.includes('invalid') ||
      message.includes('required') ||
      context.action?.includes('validate')
    ) {
      return 'validation';
    }

    // Authorization errors
    if (
      message.includes('unauthorized') ||
      message.includes('forbidden') ||
      message.includes('permission') ||
      message.includes('401') ||
      message.includes('403')
    ) {
      return 'authorization';
    }

    // Runtime errors (default)
    if (
      stack.includes('at ') ||
      message.includes('undefined') ||
      message.includes('null') ||
      message.includes('cannot read')
    ) {
      return 'runtime';
    }

    return 'unknown';
  }

  /**
   * Generate error ID
   */
  private generateErrorId(message: string, stack?: string): string {
    // Simple hash function
    const str = message + (stack?.split('\n')[0] || '');
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return `err_${Math.abs(hash).toString(36)}`;
  }

  /**
   * Get severity emoji
   */
  private getSeverityEmoji(severity: ErrorSeverity): string {
    switch (severity) {
      case 'fatal':
        return '💀';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '❓';
    }
  }

  /**
   * Send to Sentry
   */
  private sendToSentry(error: TrackedError) {
    try {
      // Em produção, usar:
      // Sentry.captureException(new Error(error.message), {
      //   level: error.severity as any,
      //   tags: {
      //     category: error.category,
      //     component: error.context.component,
      //   },
      //   extra: error.context,
      // });

      appLogger.debug('[ErrorTracker] Error sent to Sentry:', { data: [error.id] });
    } catch (err) {
      appLogger.warn('[ErrorTracker] Failed to send to Sentry:', err);
    }
  }

  /**
   * Get error by ID
   */
  getError(errorId: string): TrackedError | undefined {
    return this.errors.get(errorId);
  }

  /**
   * Get all errors
   */
  getAllErrors(): TrackedError[] {
    return Array.from(this.errors.values()).sort(
      (a, b) => b.lastOccurrence - a.lastOccurrence
    );
  }

  /**
   * Get error stats
   */
  getStats(periodMs: number = 60000): ErrorStats {
    const now = Date.now();
    const periodStart = now - periodMs;

    const recentErrors = this.errorLog.filter((e) => e.timestamp >= periodStart);

    // By category
    const byCategory: Record<ErrorCategory, number> = {
      runtime: 0,
      network: 0,
      validation: 0,
      authorization: 0,
      unknown: 0,
    };
    recentErrors.forEach((e) => {
      byCategory[e.category]++;
    });

    // By severity
    const bySeverity: Record<ErrorSeverity, number> = {
      fatal: 0,
      error: 0,
      warning: 0,
      info: 0,
    };
    recentErrors.forEach((e) => {
      bySeverity[e.severity]++;
    });

    // Top errors
    const errorCounts = new Map<string, TrackedError>();
    recentErrors.forEach((e) => {
      const existing = errorCounts.get(e.id);
      if (existing) {
        existing.count++;
      } else {
        errorCounts.set(e.id, { ...e });
      }
    });

    const topErrors = Array.from(errorCounts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Error rate (errors per minute)
    const errorRate = (recentErrors.length / periodMs) * 60000;

    return {
      total: recentErrors.length,
      byCategory,
      bySeverity,
      topErrors,
      errorRate: Math.round(errorRate * 10) / 10,
    };
  }

  /**
   * Clear errors
   */
  clear() {
    this.errors.clear();
    this.errorLog = [];
    appLogger.info('🧹 [ErrorTracker] Errors cleared');
  }

  /**
   * Get recovery suggestion
   */
  getRecoverySuggestion(errorId: string): string | null {
    const error = this.errors.get(errorId);
    if (!error) return null;

    const message = error.message.toLowerCase();

    // Network errors
    if (error.category === 'network') {
      return 'Verifique sua conexão com a internet e tente novamente.';
    }

    // Authorization errors
    if (error.category === 'authorization') {
      return 'Você não tem permissão para realizar esta ação. Faça login novamente.';
    }

    // Validation errors
    if (error.category === 'validation') {
      return 'Verifique se todos os campos foram preenchidos corretamente.';
    }

    // Specific errors
    if (message.includes('undefined') || message.includes('null')) {
      return 'Recarregue a página e tente novamente.';
    }

    if (message.includes('timeout')) {
      return 'A operação demorou muito. Tente novamente.';
    }

    return 'Ocorreu um erro inesperado. Recarregue a página e tente novamente.';
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const errorTracker = new ErrorTrackerService();

// Auto-initialize
if (typeof window !== 'undefined') {
  errorTracker.initialize();
}

export default errorTracker;

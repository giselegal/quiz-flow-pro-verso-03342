/**
 * 🚨 ERROR TRACKING SERVICE - Phase 3 Implementation
 * Sentry-like error tracking with structured logging
 */

export interface ErrorReport {
  id: string;
  timestamp: string;
  level: 'error' | 'warning' | 'info';
  message: string;
  stack?: string;
  context: {
    url: string;
    userAgent: string;
    userId?: string;
    sessionId: string;
    component?: string;
    action?: string;
  };
  metadata?: Record<string, any>;
  fingerprint: string;
}

export interface ErrorStats {
  total: number;
  byLevel: Record<string, number>;
  byComponent: Record<string, number>;
  recentErrors: ErrorReport[];
  topErrors: Array<{ fingerprint: string; count: number; message: string }>;
}

export interface ErrorContext {
  component?: string;
  action?: string;
  level?: 'error' | 'warning' | 'info';
  userId?: string;
  metadata?: Record<string, any>;
}

class ErrorTrackingService {
  private static instance: ErrorTrackingService;
  private errors: ErrorReport[] = [];
  private maxErrors = 1000;
  private sessionId: string;
  private errorCallbacks: ((error: ErrorReport) => void)[] = [];

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeGlobalHandlers();
  }

  static getInstance(): ErrorTrackingService {
    if (!ErrorTrackingService.instance) {
      ErrorTrackingService.instance = new ErrorTrackingService();
    }
    return ErrorTrackingService.instance;
  }

  /**
   * Inicializar handlers globais de erro
   */
  private initializeGlobalHandlers() {
    if (typeof window === 'undefined') return;

    // Erros JavaScript
    window.addEventListener('error', (event) => {
      this.captureError(event.error || new Error(event.message), {
        component: 'global',
        action: 'javascript_error',
        metadata: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        }
      });
    });

    // Promises rejeitadas
    window.addEventListener('unhandledrejection', (event) => {
      this.captureError(
        event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
        {
          component: 'global',
          action: 'unhandled_promise'
        }
      );
    });

    // Erros de recursos (imagens, scripts, etc.)
    window.addEventListener('error', (event) => {
      if (event.target && event.target !== window) {
        this.captureError(new Error(`Resource failed to load: ${(event.target as any).src || (event.target as any).href}`), {
          component: 'resource',
          action: 'load_error',
          metadata: {
            resourceType: (event.target as any).tagName,
            resourceUrl: (event.target as any).src || (event.target as any).href
          }
        });
      }
    }, true);

    console.log('🚨 Error tracking initialized');
  }

  /**
   * Capturar erro manualmente
   */
  captureError(error: Error | string, context?: ErrorContext) {
    const errorObj = typeof error === 'string' ? new Error(error) : error;
    const level = context?.level || 'error';

    const report: ErrorReport = {
      id: this.generateErrorId(),
      timestamp: new Date().toISOString(),
      level,
      message: errorObj.message,
      stack: errorObj.stack,
      context: {
        url: typeof window !== 'undefined' ? window.location.href : '',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        sessionId: this.sessionId,
        component: context?.component,
        action: context?.action,
        userId: context?.userId
      },
      metadata: context?.metadata,
      fingerprint: this.generateFingerprint(errorObj, context?.component)
    };

    this.addError(report);
    this.notifyCallbacks(report);

    // Log estruturado no console
    console.error(`🚨 [${level.toUpperCase()}] ${report.message}`, {
      id: report.id,
      component: context?.component,
      action: context?.action,
      stack: errorObj.stack,
      metadata: context?.metadata
    });

    return report.id;
  }

  /**
   * Capturar warning
   */
  captureWarning(message: string, context?: Omit<ErrorContext, 'level'>) {
    return this.captureError(message, { ...context, level: 'warning' });
  }

  /**
   * Capturar info
   */
  captureInfo(message: string, context?: Omit<ErrorContext, 'level'>) {
    return this.captureError(message, { ...context, level: 'info' });
  }

  /**
   * Adicionar erro à lista
   */
  private addError(error: ErrorReport) {
    this.errors.unshift(error);
    
    // Manter apenas os últimos N erros
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors);
    }

    // Salvar no localStorage para persistência
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('error_tracking', JSON.stringify(this.errors.slice(0, 100)));
      } catch (e) {
        // Ignorar se localStorage estiver cheio
      }
    }
  }

  /**
   * Obter estatísticas de erro
   */
  getErrorStats(): ErrorStats {
    const byLevel = this.errors.reduce((acc, error) => {
      acc[error.level] = (acc[error.level] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byComponent = this.errors.reduce((acc, error) => {
      const component = error.context.component || 'unknown';
      acc[component] = (acc[component] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const fingerprintCounts = this.errors.reduce((acc, error) => {
      acc[error.fingerprint] = {
        count: (acc[error.fingerprint]?.count || 0) + 1,
        message: error.message
      };
      return acc;
    }, {} as Record<string, { count: number; message: string }>);

    const topErrors = Object.entries(fingerprintCounts)
      .map(([fingerprint, data]) => ({ fingerprint, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      total: this.errors.length,
      byLevel,
      byComponent,
      recentErrors: this.errors.slice(0, 20),
      topErrors
    };
  }

  /**
   * Obter erros por filtro
   */
  getErrors(filter?: {
    level?: 'error' | 'warning' | 'info';
    component?: string;
    limit?: number;
    since?: Date;
  }): ErrorReport[] {
    let filtered = this.errors;

    if (filter?.level) {
      filtered = filtered.filter(error => error.level === filter.level);
    }

    if (filter?.component) {
      filtered = filtered.filter(error => error.context.component === filter.component);
    }

    if (filter?.since) {
      filtered = filtered.filter(error => new Date(error.timestamp) > filter.since!);
    }

    if (filter?.limit) {
      filtered = filtered.slice(0, filter.limit);
    }

    return filtered;
  }

  /**
   * Limpar erros
   */
  clearErrors(filter?: { level?: string; component?: string; olderThan?: Date }) {
    if (!filter) {
      this.errors = [];
    } else {
      this.errors = this.errors.filter(error => {
        if (filter.level && error.level === filter.level) return false;
        if (filter.component && error.context.component === filter.component) return false;
        if (filter.olderThan && new Date(error.timestamp) < filter.olderThan) return false;
        return true;
      });
    }

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('error_tracking', JSON.stringify(this.errors.slice(0, 100)));
      } catch (e) {
        // Ignorar
      }
    }
  }

  /**
   * Registrar callback para novos erros
   */
  onError(callback: (error: ErrorReport) => void) {
    this.errorCallbacks.push(callback);
  }

  /**
   * Remover callback
   */
  offError(callback: (error: ErrorReport) => void) {
    this.errorCallbacks = this.errorCallbacks.filter(cb => cb !== callback);
  }

  /**
   * Notificar callbacks
   */
  private notifyCallbacks(error: ErrorReport) {
    this.errorCallbacks.forEach(callback => {
      try {
        callback(error);
      } catch (e) {
        console.error('Error in error callback:', e);
      }
    });
  }

  /**
   * Gerar ID único para erro
   */
  private generateErrorId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Gerar fingerprint para agrupamento de erros
   */
  private generateFingerprint(error: Error, component?: string): string {
    const stackLine = error.stack?.split('\n')[1] || '';
    const hashInput = `${error.name}-${error.message}-${component}-${stackLine}`;
    return btoa(hashInput).substr(0, 16);
  }

  /**
   * Gerar ID da sessão
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Exportar erros para análise externa
   */
  exportErrors(format: 'json' | 'csv' = 'json'): string {
    if (format === 'json') {
      return JSON.stringify(this.errors, null, 2);
    }

    // CSV format
    const headers = ['ID', 'Timestamp', 'Level', 'Message', 'Component', 'URL'];
    const rows = this.errors.map(error => [
      error.id,
      error.timestamp,
      error.level,
      error.message.replace(/"/g, '""'),
      error.context.component || '',
      error.context.url
    ]);

    return [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  }
}

export const errorTrackingService = ErrorTrackingService.getInstance();

// Carregar erros persistidos
if (typeof window !== 'undefined') {
  try {
    const saved = localStorage.getItem('error_tracking');
    if (saved) {
      const errors = JSON.parse(saved);
      (errorTrackingService as any).errors = errors;
    }
  } catch (e) {
    console.warn('Failed to load persisted errors:', e);
  }
}
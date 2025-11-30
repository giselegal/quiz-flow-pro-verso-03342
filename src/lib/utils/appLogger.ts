/**
 * 🔧 AppLogger - Sistema de logging estruturado canônico
 * 
 * Substitui console.log/warn/error por sistema estruturado
 * com níveis, contexto e suporte para ambientes Node/Edge/Browser
 * 
 * @usage
 * ```ts
 * import { appLogger } from '@/lib/utils/appLogger';
 * 
 * appLogger.info('User logged in', { userId: '123' });
 * appLogger.warn('Rate limit approaching', { requests: 95, limit: 100 });
 * appLogger.error('API call failed', error, { endpoint: '/api/quiz' });
 * appLogger.debug('Cache hit', { key: 'template-123' });
 * ```
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export type LogContext = Record<string, unknown>;

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  error?: Error;
  stack?: string;
}

export interface LoggerOptions {
  minLevel?: LogLevel;
  enableConsole?: boolean;
  enableRemote?: boolean;
  remoteEndpoint?: string;
  environment?: 'development' | 'production' | 'test' | 'edge';
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

class AppLogger {
  private options: Required<LoggerOptions>;
  private buffer: LogEntry[] = [];
  private readonly MAX_BUFFER_SIZE = 100;

  constructor(options: LoggerOptions = {}) {
    this.options = {
      minLevel: ((import.meta as any)?.env?.PROD ? 'info' : 'debug'),
      enableConsole: !!((import.meta as any)?.env?.DEV) || ((import.meta as any)?.env?.VITE_DEBUG_LOGS === 'true'),
      enableRemote: false, // ❌ DESABILITADO: não há backend /api/logs
      remoteEndpoint: ((import.meta as any)?.env?.VITE_LOG_REMOTE_ENDPOINT || '/api/logs'),
      environment: this.detectEnvironment(),
      ...options,
    };
  }

  private detectEnvironment(): 'development' | 'production' | 'test' | 'edge' {
    // Edge Function detection (Deno)
    if (typeof (globalThis as any).Deno !== 'undefined') {
      return 'edge';
    }
    
    // Node.js environment
    if (typeof process !== 'undefined' && process.env) {
      if (process.env.NODE_ENV === 'test') return 'test';
      if (process.env.NODE_ENV === 'production') return 'production';
      return 'development';
    }
    
    // Browser fallback
    return 'development';
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[this.options.minLevel];
  }

  private formatMessage(entry: LogEntry): string {
    const parts = [
      `[${entry.timestamp}]`,
      `[${entry.level.toUpperCase()}]`,
      entry.message,
    ];

    if (entry.context && Object.keys(entry.context).length > 0) {
      parts.push(JSON.stringify(entry.context));
    }

    if (entry.error) {
      parts.push(`Error: ${entry.error.message}`);
      if (entry.stack) {
        parts.push(`\n${entry.stack}`);
      }
    }

    return parts.join(' ');
  }

  private log(level: LogLevel, message: string, errorOrContext?: unknown, context?: LogContext): void {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
    };

    // Handle overloaded parameters
    if (errorOrContext instanceof Error) {
      entry.error = errorOrContext;
      entry.stack = errorOrContext.stack;
      entry.context = context;
    } else if (typeof errorOrContext === 'object' && errorOrContext !== null) {
      // Se já veio um objeto, usar diretamente
      entry.context = errorOrContext as LogContext;
    } else if (typeof errorOrContext !== 'undefined') {
      // Para valores primitivos (string/number/etc) encapsular como data
      entry.context = { data: [errorOrContext] } as LogContext;
    }

    // Buffer management
    this.buffer.push(entry);
    if (this.buffer.length > this.MAX_BUFFER_SIZE) {
      this.buffer.shift();
    }

    // Console output (dev/test only by default)
    if (this.options.enableConsole) {
      const formattedMessage = this.formatMessage(entry);
      
      switch (level) {
        case 'debug':
          console.log(`🔍 ${formattedMessage}`);
          break;
        case 'info':
          console.log(`ℹ️ ${formattedMessage}`);
          break;
        case 'warn':
          console.warn(`⚠️ ${formattedMessage}`);
          break;
        case 'error':
          console.error(`❌ ${formattedMessage}`);
          break;
      }
    }

    // Remote logging (production)
    if (this.options.enableRemote && level !== 'debug') {
      this.sendToRemote(entry).catch((err) => {
        // Fallback to console if remote fails
        console.error('Failed to send log to remote:', err);
      });
    }
  }

  private async sendToRemote(entry: LogEntry): Promise<void> {
    // Only send in browser/node with fetch available
    if (typeof window === 'undefined' || typeof window.fetch === 'undefined') return;

    try {
      await window.fetch(this.options.remoteEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
    } catch (error) {
      // Silent fail - don't want logging to break the app
    }
  }

  /**
   * Log debug message (development only)
   */
  debug(message: string, contextOrData?: unknown): void {
    // Aceita qualquer payload adicional e trata objetos como contexto estruturado
    this.log('debug', message, contextOrData);
  }

  /**
   * Log informational message
   */
  info(message: string, contextOrData?: unknown): void {
    // Compat: aceita unknown e converte objetos para contexto
    this.log('info', message, contextOrData);
  }

  /**
   * Log warning message
   */
  warn(message: string, contextOrData?: unknown): void {
    // Compat: aceita unknown e converte objetos para contexto
    this.log('warn', message, contextOrData);
  }

  /**
   * Log error message
   */
  error(message: string, error?: unknown | LogContext, context?: LogContext): void {
    this.log('error', message, error, context);
  }

  /**
   * Get recent logs from buffer
   */
  getRecentLogs(count: number = 50): LogEntry[] {
    return this.buffer.slice(-count);
  }

  /**
   * Clear log buffer
   */
  clearBuffer(): void {
    this.buffer = [];
  }

  /**
   * Update logger options at runtime
   */
  configure(options: Partial<LoggerOptions>): void {
    this.options = { ...this.options, ...options };
  }

  /**
   * Create child logger with preset context
   */
  child(context: LogContext): ChildLogger {
    return new ChildLogger(this, context);
  }
}

/**
 * Child logger that inherits from parent with additional context
 */
class ChildLogger {
  constructor(
    private parent: AppLogger,
    private defaultContext: LogContext,
  ) {}

  private mergeContext(context?: LogContext): LogContext {
    return { ...this.defaultContext, ...context };
  }

  debug(message: string, context?: LogContext): void {
    this.parent.debug(message, this.mergeContext(context));
  }

  info(message: string, context?: LogContext): void {
    this.parent.info(message, this.mergeContext(context));
  }

  warn(message: string, context?: LogContext): void {
    this.parent.warn(message, this.mergeContext(context));
  }

  error(message: string, error?: Error | LogContext, context?: LogContext): void {
    if (error instanceof Error) {
      this.parent.error(message, error, this.mergeContext(context));
    } else {
      this.parent.error(message, this.mergeContext(error));
    }
  }
}

// Singleton instance
export const appLogger = new AppLogger();

// Named exports for convenience
export const logger = appLogger;
export const log = appLogger;

// Export class for custom instances
export { AppLogger, ChildLogger };

/**
 * Create a logger for specific module/component
 * @example
 * const logger = createLogger({ module: 'TemplateService' });
 * logger.info('Template loaded', { templateId: '123' });
 */
export function createLogger(context: LogContext): ChildLogger {
  return appLogger.child(context);
}

/**
 * Migration helper: compatible with console.* for gradual migration
 * @deprecated Use appLogger methods directly
 */
export const compatLogger = {
  log: (...args: unknown[]) => appLogger.info(String(args[0]), { args: args.slice(1) }),
  info: (...args: unknown[]) => appLogger.info(String(args[0]), { args: args.slice(1) }),
  warn: (...args: unknown[]) => appLogger.warn(String(args[0]), { args: args.slice(1) }),
  error: (...args: unknown[]) => appLogger.error(String(args[0]), undefined, { args: args.slice(1) }),
  debug: (...args: unknown[]) => appLogger.debug(String(args[0]), { args: args.slice(1) }),
};

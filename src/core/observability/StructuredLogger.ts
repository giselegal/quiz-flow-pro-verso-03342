/**
 * 📊 STRUCTURED LOGGER - PHASE 3: OBSERVABILITY
 * Sistema de logging estruturado com níveis e contexto
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  CRITICAL = 4
}

export interface LogEntry {
  timestamp: number;
  level: LogLevel;
  message: string;
  context: Record<string, any>;
  stack?: string;
  userId?: string;
  sessionId: string;
}

export interface LoggerConfig {
  minLevel: LogLevel;
  enableConsole: boolean;
  enableRemote: boolean;
  maxBufferSize: number;
  flushInterval: number;
}

class StructuredLogger {
  private config: LoggerConfig;
  private buffer: LogEntry[] = [];
  private sessionId: string;
  private flushTimer: NodeJS.Timeout | null = null;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      minLevel: import.meta.env.DEV ? LogLevel.DEBUG : LogLevel.INFO,
      enableConsole: import.meta.env.DEV,
      enableRemote: !import.meta.env.DEV,
      maxBufferSize: 100,
      flushInterval: 30000, // 30s
      ...config
    };

    this.sessionId = this.generateSessionId();
    this.setupAutoFlush();
    this.setupUnloadHandler();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private setupAutoFlush() {
    if (this.config.enableRemote) {
      this.flushTimer = setInterval(() => {
        this.flush();
      }, this.config.flushInterval);
    }
  }

  private setupUnloadHandler() {
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.flush(true);
      });
    }
  }

  private createLogEntry(
    level: LogLevel, 
    message: string, 
    context: Record<string, any> = {}
  ): LogEntry {
    return {
      timestamp: Date.now(),
      level,
      message,
      context: {
        url: typeof window !== 'undefined' ? window.location.href : '',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        ...context
      },
      stack: level >= LogLevel.ERROR ? new Error().stack : undefined,
      userId: context.userId,
      sessionId: this.sessionId
    };
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.config.minLevel;
  }

  private addToBuffer(entry: LogEntry) {
    this.buffer.push(entry);
    
    if (this.buffer.length >= this.config.maxBufferSize) {
      this.flush();
    }
  }

  debug(message: string, context: Record<string, any> = {}) {
    if (!this.shouldLog(LogLevel.DEBUG)) return;
    
    const entry = this.createLogEntry(LogLevel.DEBUG, message, context);
    
    if (this.config.enableConsole) {
      console.debug(`🔍 ${message}`, context);
    }
    
    this.addToBuffer(entry);
  }

  info(message: string, context: Record<string, any> = {}) {
    if (!this.shouldLog(LogLevel.INFO)) return;
    
    const entry = this.createLogEntry(LogLevel.INFO, message, context);
    
    if (this.config.enableConsole) {
      console.info(`ℹ️ ${message}`, context);
    }
    
    this.addToBuffer(entry);
  }

  warn(message: string, context: Record<string, any> = {}) {
    if (!this.shouldLog(LogLevel.WARN)) return;
    
    const entry = this.createLogEntry(LogLevel.WARN, message, context);
    
    if (this.config.enableConsole) {
      console.warn(`⚠️ ${message}`, context);
    }
    
    this.addToBuffer(entry);
  }

  error(message: string, context: Record<string, any> = {}) {
    if (!this.shouldLog(LogLevel.ERROR)) return;
    
    const entry = this.createLogEntry(LogLevel.ERROR, message, context);
    
    if (this.config.enableConsole) {
      console.error(`❌ ${message}`, context);
    }
    
    this.addToBuffer(entry);
  }

  critical(message: string, context: Record<string, any> = {}) {
    const entry = this.createLogEntry(LogLevel.CRITICAL, message, context);
    
    if (this.config.enableConsole) {
      console.error(`🚨 CRITICAL: ${message}`, context);
    }
    
    this.addToBuffer(entry);
    
    // Flush immediately for critical errors
    this.flush(true);
  }

  async flush(immediate = false) {
    if (this.buffer.length === 0) return;
    
    const entries = [...this.buffer];
    this.buffer = [];
    
    if (this.config.enableRemote) {
      try {
        // Send to remote logging service
        await this.sendToRemote(entries, immediate);
      } catch (error) {
        // Fallback to console if remote fails
        console.warn('Failed to send logs to remote service:', error);
        entries.forEach(entry => {
          console.log('Buffered log:', entry);
        });
      }
    }
  }

  private async sendToRemote(entries: LogEntry[], immediate = false) {
    const body = JSON.stringify({ entries, immediate });
    
    if (immediate && 'sendBeacon' in navigator) {
      // Use sendBeacon for immediate sends (e.g., page unload)
      navigator.sendBeacon('/api/logs', body);
    } else {
      // Use fetch for regular sends
      await fetch('/api/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body
      });
    }
  }

  getBuffer(): LogEntry[] {
    return [...this.buffer];
  }

  clearBuffer() {
    this.buffer = [];
  }

  destroy() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    this.flush(true);
  }
}

// Singleton instance
export const structuredLogger = new StructuredLogger();

// Context-aware logging hooks
export const useLogger = (component: string) => {
  return {
    debug: (message: string, context = {}) => 
      structuredLogger.debug(message, { component, ...context }),
    info: (message: string, context = {}) => 
      structuredLogger.info(message, { component, ...context }),
    warn: (message: string, context = {}) => 
      structuredLogger.warn(message, { component, ...context }),
    error: (message: string, context = {}) => 
      structuredLogger.error(message, { component, ...context }),
    critical: (message: string, context = {}) => 
      structuredLogger.critical(message, { component, ...context })
  };
};

export default structuredLogger;
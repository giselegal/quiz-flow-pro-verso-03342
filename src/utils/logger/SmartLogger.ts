/**
 * 🚀 PRODUCTION-SAFE LOGGER
 * 
 * Sistema de logging inteligente que elimina debug logs em produção
 * mantendo apenas logs essenciais para monitoramento e debugging
 * 
 * FUNCIONALIDADES:
 * ✅ Conditional logging baseado no ambiente
 * ✅ Log levels configuráveis
 * ✅ Performance metrics integradas
 * ✅ Error tracking e reporting
 * ✅ Memory-efficient operations
 * ✅ Context-aware logging
 */

export enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
    CRITICAL = 4
}

export interface LogEntry {
    level: LogLevel;
    message: string;
    context?: string;
    data?: any;
    timestamp: number;
    stack?: string;
}

export interface LoggerConfig {
    // Environment-based configuration
    isDevelopment: boolean;
    isProduction: boolean;
    minLevel: LogLevel;

    // Performance settings
    maxBufferSize: number;
    flushInterval: number;

    // Output configuration
    enableConsole: boolean;
    enableRemote: boolean;
    remoteEndpoint?: string;

    // Context filtering
    enabledContexts: string[];
    disabledContexts: string[];
}

/**
 * 🎯 SMART LOGGER CLASS
 */
class SmartLogger {
    private config: LoggerConfig;
    private buffer: LogEntry[] = [];
    private flushTimer: NodeJS.Timeout | null = null;

    constructor(config?: Partial<LoggerConfig>) {
        // Auto-detect environment
        const isDevelopment = process.env.NODE_ENV === 'development' ||
            typeof window !== 'undefined' && window.location.hostname === 'localhost';

        const isProduction = process.env.NODE_ENV === 'production';

        this.config = {
            isDevelopment,
            isProduction,
            minLevel: isProduction ? LogLevel.WARN : LogLevel.DEBUG,
            maxBufferSize: 100,
            flushInterval: 5000, // 5 seconds
            enableConsole: !isProduction || false, // Disable console in production by default
            enableRemote: isProduction,
            enabledContexts: [],
            disabledContexts: [],
            ...config
        };

        this.startFlushTimer();
    }

    /**
     * Check if logging is enabled for this level and context
     */
    private shouldLog(level: LogLevel, context?: string): boolean {
        // Level check
        if (level < this.config.minLevel) return false;

        // Context filtering
        if (context) {
            if (this.config.disabledContexts.includes(context)) return false;
            if (this.config.enabledContexts.length > 0 && !this.config.enabledContexts.includes(context)) return false;
        }

        return true;
    }

    /**
     * Core logging method
     */
    private log(level: LogLevel, message: string, data?: any, context?: string): void {
        if (!this.shouldLog(level, context)) return;

        const entry: LogEntry = {
            level,
            message,
            context,
            data,
            timestamp: Date.now(),
            stack: level >= LogLevel.ERROR ? new Error().stack : undefined
        };

        // Add to buffer
        this.buffer.push(entry);

        // Trim buffer if needed
        if (this.buffer.length > this.config.maxBufferSize) {
            this.buffer.shift();
        }

        // Console output (only if enabled)
        if (this.config.enableConsole) {
            this.outputToConsole(entry);
        }

        // Immediate flush for critical errors
        if (level >= LogLevel.CRITICAL) {
            this.flush();
        }
    }

    /**
     * Output to console with appropriate styling
     */
    private outputToConsole(entry: LogEntry): void {
        const { level, message, context, data } = entry;
        const contextStr = context ? `[${context}]` : '';
        const timestamp = new Date(entry.timestamp).toISOString();

        switch (level) {
            case LogLevel.DEBUG:
                console.debug(`🐛 ${timestamp} ${contextStr}`, message, data || '');
                break;
            case LogLevel.INFO:
                console.info(`ℹ️ ${timestamp} ${contextStr}`, message, data || '');
                break;
            case LogLevel.WARN:
                console.warn(`⚠️ ${timestamp} ${contextStr}`, message, data || '');
                break;
            case LogLevel.ERROR:
                console.error(`❌ ${timestamp} ${contextStr}`, message, data || '');
                if (entry.stack) console.error(entry.stack);
                break;
            case LogLevel.CRITICAL:
                console.error(`🚨 CRITICAL ${timestamp} ${contextStr}`, message, data || '');
                if (entry.stack) console.error(entry.stack);
                break;
        }
    }

    /**
     * Flush buffer to remote endpoint
     */
    private async flush(): Promise<void> {
        if (!this.config.enableRemote || this.buffer.length === 0) return;

        const entries = [...this.buffer];
        this.buffer = [];

        try {
            if (this.config.remoteEndpoint) {
                await fetch(this.config.remoteEndpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ entries })
                });
            }
        } catch (error) {
            // Fallback: restore entries to buffer
            this.buffer.unshift(...entries.slice(-10)); // Keep only last 10 entries
            console.error('Failed to flush logs to remote endpoint:', error);
        }
    }

    /**
     * Start flush timer
     */
    private startFlushTimer(): void {
        if (this.flushTimer) clearInterval(this.flushTimer);

        this.flushTimer = setInterval(() => {
            this.flush();
        }, this.config.flushInterval);
    }

    // ===== PUBLIC API =====

    debug(message: string, data?: any, context?: string): void {
        this.log(LogLevel.DEBUG, message, data, context);
    }

    info(message: string, data?: any, context?: string): void {
        this.log(LogLevel.INFO, message, data, context);
    }

    warn(message: string, data?: any, context?: string): void {
        this.log(LogLevel.WARN, message, data, context);
    }

    error(message: string, data?: any, context?: string): void {
        this.log(LogLevel.ERROR, message, data, context);
    }

    critical(message: string, data?: any, context?: string): void {
        this.log(LogLevel.CRITICAL, message, data, context);
    }

    // ===== PERFORMANCE LOGGING =====

    /**
     * Log performance metrics
     */
    performance(name: string, duration: number, context?: string): void {
        if (duration > 100) { // Only log slow operations
            this.warn(`Slow operation: ${name}`, { duration: `${duration.toFixed(2)}ms` }, context);
        } else {
            this.debug(`Performance: ${name}`, { duration: `${duration.toFixed(2)}ms` }, context);
        }
    }

    /**
     * Measure function execution time
     */
    measureAsync<T>(name: string, fn: () => Promise<T>, context?: string): Promise<T> {
        const start = performance.now();
        return fn().finally(() => {
            const duration = performance.now() - start;
            this.performance(name, duration, context);
        });
    }

    measureSync<T>(name: string, fn: () => T, context?: string): T {
        const start = performance.now();
        try {
            return fn();
        } finally {
            const duration = performance.now() - start;
            this.performance(name, duration, context);
        }
    }

    // ===== RENDER LOGGING =====

    /**
     * Log component renders (only in development)
     */
    render(componentName: string, props?: any, context?: string): void {
        if (!this.config.isDevelopment) return;
        this.debug(`🎨 Render: ${componentName}`, props, context || 'render');
    }

    /**
     * Log slow renders
     */
    slowRender(componentName: string, duration: number, props?: any): void {
        this.warn(`🐌 Slow render: ${componentName}`, {
            duration: `${duration.toFixed(2)}ms`,
            props
        }, 'render');
    }

    // ===== CACHE LOGGING =====

    cacheHit(key: string, context?: string): void {
        this.debug(`🚀 Cache hit: ${key}`, undefined, context || 'cache');
    }

    cacheMiss(key: string, context?: string): void {
        this.debug(`💨 Cache miss: ${key}`, undefined, context || 'cache');
    }

    cacheStats(stats: any, context?: string): void {
        this.info('Cache stats', stats, context || 'cache');
    }

    // ===== API LOGGING =====

    apiRequest(method: string, url: string, data?: any): void {
        this.debug(`🌐 API ${method}`, { url, data }, 'api');
    }

    apiResponse(method: string, url: string, status: number, duration: number): void {
        if (status >= 400) {
            this.error(`🌐 API ${method} failed`, { url, status, duration: `${duration}ms` }, 'api');
        } else if (duration > 1000) {
            this.warn(`🌐 Slow API ${method}`, { url, status, duration: `${duration}ms` }, 'api');
        } else {
            this.debug(`🌐 API ${method} success`, { url, status, duration: `${duration}ms` }, 'api');
        }
    }

    // ===== CONFIGURATION =====

    updateConfig(updates: Partial<LoggerConfig>): void {
        this.config = { ...this.config, ...updates };
        this.startFlushTimer();
    }

    getBuffer(): LogEntry[] {
        return [...this.buffer];
    }

    clearBuffer(): void {
        this.buffer = [];
    }

    // ===== CLEANUP =====

    destroy(): void {
        if (this.flushTimer) {
            clearInterval(this.flushTimer);
            this.flushTimer = null;
        }
        this.flush(); // Final flush
    }
}

// ===== GLOBAL LOGGER INSTANCE =====

export const logger = new SmartLogger();

// ===== DEVELOPMENT HELPERS =====

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    (window as any).__LOGGER__ = logger;
    (window as any).__ENABLE_DEBUG_LOGS__ = () => {
        logger.updateConfig({ minLevel: LogLevel.DEBUG, enableConsole: true });
    };
    (window as any).__DISABLE_DEBUG_LOGS__ = () => {
        logger.updateConfig({ minLevel: LogLevel.WARN, enableConsole: false });
    };
}

// ===== REACT INTEGRATION =====

export const useLogger = (context?: string) => {
    const contextLogger = {
        debug: (message: string, data?: any) => logger.debug(message, data, context),
        info: (message: string, data?: any) => logger.info(message, data, context),
        warn: (message: string, data?: any) => logger.warn(message, data, context),
        error: (message: string, data?: any) => logger.error(message, data, context),
        critical: (message: string, data?: any) => logger.critical(message, data, context),
        render: (componentName: string, props?: any) => logger.render(componentName, props, context),
        performance: (name: string, duration: number) => logger.performance(name, duration, context),
    };

    return contextLogger;
};

// ===== DECORATOR FOR PERFORMANCE MEASUREMENT =====

export function measurePerformance(context?: string) {
    return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
        const method = descriptor.value;

        descriptor.value = function (...args: any[]) {
            return logger.measureSync(`${target.constructor.name}.${propertyName}`, () => {
                return method.apply(this, args);
            }, context);
        };

        return descriptor;
    };
}

// ===== CLEANUP ON WINDOW UNLOAD =====

if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
        logger.destroy();
    });
}
// src/utils/logging/LoggerFactory.ts
import LoggerService from './LoggerService';
import { createLoggerConfig, getConfigForEnvironment, LoggingFeatures } from './LoggerConfig';
import type { LoggerConfig } from './LoggerConfig';

// Singleton logger instance
let globalLogger: LoggerService | null = null;

/**
 * Factory para criar e configurar o logger global
 */
export class LoggerFactory {
    /**
     * Cria um logger com configuração customizada
     */
    static create(config: Partial<LoggerConfig> = {}): LoggerService {
        const finalConfig = createLoggerConfig(config);
        return new LoggerService(finalConfig);
    }

    /**
     * Obtém ou cria o logger global baseado no ambiente
     */
    static getGlobalLogger(): LoggerService {
        if (!globalLogger) {
            globalLogger = this.create(getConfigForEnvironment());
            this.configureGlobalLogger(globalLogger);
        }
        return globalLogger;
    }

    /**
     * Reconfigura o logger global
     */
    static reconfigureGlobalLogger(config: Partial<LoggerConfig>): LoggerService {
        if (globalLogger) {
            globalLogger.close();
        }

        globalLogger = this.create(config);
        this.configureGlobalLogger(globalLogger);
        return globalLogger;
    }

    /**
     * Cria um logger para desenvolvimento com todas as funcionalidades
     */
    static createDevelopmentLogger(): LoggerService {
        return this.create({
            environment: 'development',
            minLevel: 'DEBUG',
            includePerformance: true,
            includeStackTrace: true,
            enableStorage: true,
            defaultFormatter: 'dev'
        });
    }

    /**
     * Cria um logger para produção otimizado
     */
    static createProductionLogger(): LoggerService {
        return this.create({
            environment: 'production',
            minLevel: 'WARN',
            includePerformance: false,
            includeStackTrace: false,
            enableStorage: true,
            defaultFormatter: 'json',
            batchSize: 50,
            flushInterval: 10000,
            remoteEndpoint: import.meta.env.VITE_LOGGING_ENDPOINT
        });
    }

    /**
     * Cria um logger para testes
     */
    static createTestLogger(): LoggerService {
        return this.create({
            environment: 'test',
            minLevel: 'ERROR',
            enableStorage: false,
            includePerformance: false,
            defaultFormatter: 'json',
            batchSize: 1,
            flushInterval: 100
        });
    }

    /**
     * Configura o logger global com filtros e transports adicionais
     */
    private static configureGlobalLogger(logger: LoggerService): void {
        // Add sensitive data filter in production
        if (import.meta.env.NODE_ENV === 'production') {
            import('./filters/SensitiveDataFilter').then(({ SensitiveDataFilter }) => {
                logger.addFilter(new SensitiveDataFilter());
            });
        }

        // Add rate limit filter if enabled
        if (LoggingFeatures.MAX_LOG_BUFFER_SIZE > 0) {
            import('./filters/RateLimitFilter').then(({ RateLimitFilter }) => {
                logger.addFilter(new RateLimitFilter({
                    maxLogsPerSecond: 10,
                    maxLogsPerMinute: 300,
                    burstLimit: 20
                }));
            });
        }

        // Setup global error handler
        this.setupGlobalErrorHandler(logger);

        // Setup cleanup on page unload
        this.setupCleanupHandlers(logger);
    }

    /**
     * Configura captura de erros globais
     */
    private static setupGlobalErrorHandler(logger: LoggerService): void {
        // Capture unhandled errors
        window.addEventListener('error', (event) => {
            logger.error('global', 'Unhandled error', {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                error: event.error
            });
        });

        // Capture unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            logger.error('global', 'Unhandled promise rejection', {
                reason: event.reason,
                promise: event.promise
            });
        });

        // Capture console errors (optional, be careful not to create infinite loops)
        if (import.meta.env.VITE_CAPTURE_CONSOLE_ERRORS === 'true') {
            const originalError = console.error;
            console.error = (...args) => {
                originalError.apply(console, args);
                logger.error('console', 'Console error', { args });
            };
        }
    }

    /**
     * Configura handlers de cleanup
     */
    private static setupCleanupHandlers(logger: LoggerService): void {
        // Flush logs before page unload
        window.addEventListener('beforeunload', () => {
            logger.flush().catch(console.warn);
        });

        // Cleanup on page visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                logger.flush().catch(console.warn);
            }
        });

        // Periodic cleanup in long-running sessions
        setInterval(() => {
            logger.flush().catch(console.warn);
        }, LoggingFeatures.LOG_FLUSH_INTERVAL);
    }

    /**
     * Destroy the global logger
     */
    static async destroyGlobalLogger(): Promise<void> {
        if (globalLogger) {
            await globalLogger.close();
            globalLogger = null;
        }
    }
}

/**
 * Convenience function para obter o logger global
 */
export const getLogger = (): LoggerService => {
    return LoggerFactory.getGlobalLogger();
};

/**
 * Hook para React components
 */
export const useLogger = () => {
    return getLogger();
};

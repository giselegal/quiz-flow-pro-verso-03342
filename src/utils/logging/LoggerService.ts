// src/utils/logging/LoggerService.ts
import { LoggerConfig } from './LoggerConfig';
import { LevelFilter } from './filters/LevelFilter';
import { ContextFilter } from './filters/ContextFilter';
import { BlockedContextFilter } from './filters/BlockedContextFilter';
import { PerformanceFilter } from './filters/PerformanceFilter';
import { ConsoleTransport } from './transports/ConsoleTransport';
import { StorageTransport } from './transports/StorageTransport';
import { RemoteTransport } from './transports/RemoteTransport';
import { DefaultFormatter } from './formatters/DefaultFormatter';
import { JSONFormatter } from './formatters/JSONFormatter';
import { DevelopmentFormatter } from './formatters/DevelopmentFormatter';
import { StorageService } from '@/services/core/StorageService';

export interface LogLevel {
    TRACE: 0;
    DEBUG: 1;
    INFO: 2;
    WARN: 3;
    ERROR: 4;
    FATAL: 5;
}

export interface LogEntry {
    timestamp: string;
    level: keyof LogLevel;
    context: string;
    message: string;
    data?: any;
    sessionId?: string;
    userId?: string;
    stackTrace?: string;
    performance?: {
        duration?: number;
        memory?: number;
    };
}

export interface LogTransport {
    log(entry: LogEntry): Promise<void> | void;
    flush?(): Promise<void>;
    close?(): Promise<void>;
}

export interface LogFilter {
    shouldLog(entry: LogEntry): boolean;
}

export interface LogFormatter {
    format(entry: LogEntry): string;
}

// LoggerConfig is imported from ./LoggerConfig

class LoggerService {
    private transports: LogTransport[] = [];
    private filters: LogFilter[] = [];
    private config: LoggerConfig;
    private sessionId: string;
    private formatters: Map<string, LogFormatter> = new Map();

    constructor(config: LoggerConfig) {
        this.config = config;
        this.sessionId = this.generateSessionId();
        this.setupDefaultFormatters();
        this.setupDefaultTransports();
        this.setupDefaultFilters();
    }

    // Métodos principais de logging
    trace(context: string, message: string, data?: any): void {
        this.log('TRACE', context, message, data);
    }

    debug(context: string, message: string, data?: any): void {
        this.log('DEBUG', context, message, data);
    }

    info(context: string, message: string, data?: any): void {
        this.log('INFO', context, message, data);
    }

    warn(context: string, message: string, data?: any): void {
        this.log('WARN', context, message, data);
    }

    error(context: string, message: string, error?: Error | any): void {
        const logData = error instanceof Error ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
            ...(error as any).cause && { cause: (error as any).cause }
        } : error;

        this.log('ERROR', context, message, logData);
    }

    fatal(context: string, message: string, error?: Error | any): void {
        this.log('FATAL', context, message, error);
    }

    // Métodos de conveniência para contextos específicos
    editor = {
        blockAdded: (blockType: string, stageId: string, blockId: string) =>
            this.info('editor', 'Block added', { blockType, stageId, blockId, action: 'add_block' }),

        blockUpdated: (blockId: string, updates: any) =>
            this.debug('editor', 'Block updated', { blockId, updateKeys: Object.keys(updates), action: 'update_block' }),

        templateLoaded: (templateId: string, loadTime: number) =>
            this.info('editor', 'Template loaded', { templateId, loadTime, action: 'load_template' }),

        savePerformed: (funnelId: string, blockCount: number, saveTime: number) =>
            this.info('editor', 'Project saved', { funnelId, blockCount, saveTime, action: 'save_project' }),

        errorOccurred: (operation: string, error: Error) =>
            this.error('editor', `Editor error during ${operation}`, error)
    };

    storage = {
        migrationStarted: (itemCount: number) =>
            this.info('storage', 'Migration started', { itemCount, action: 'migration_start' }),

        migrationCompleted: (migratedCount: number, duration: number) =>
            this.info('storage', 'Migration completed', { migratedCount, duration, action: 'migration_complete' }),

        cacheHit: (key: string, namespace: string) =>
            this.trace('storage', 'Cache hit', { key, namespace, action: 'cache_hit' }),

        cacheMiss: (key: string, namespace: string) =>
            this.trace('storage', 'Cache miss', { key, namespace, action: 'cache_miss' }),

        fallbackUsed: (operation: string, reason: string) =>
            this.warn('storage', 'Fallback storage used', { operation, reason, action: 'fallback_used' })
    };

    performance = {
        slowRender: (componentName: string, renderTime: number) =>
            this.warn('performance', 'Slow render detected', {
                componentName,
                renderTime,
                threshold: 16.67,
                action: 'slow_render'
            }),

        heavyComputation: (operation: string, duration: number) =>
            this.info('performance', 'Heavy computation completed', { operation, duration, action: 'heavy_computation' }),

        memoryUsage: (component: string, heapUsed: number) =>
            this.debug('performance', 'Memory usage recorded', { component, heapUsed, action: 'memory_usage' })
    };

    // Core logging method
    private async log(
        level: keyof LogLevel,
        context: string,
        message: string,
        data?: any
    ): Promise<void> {
        const entry: LogEntry = {
            timestamp: new Date().toISOString(),
            level,
            context,
            message,
            data,
            sessionId: this.sessionId,
            userId: this.getCurrentUserId(),
            stackTrace: this.shouldIncludeStackTrace(level) ? this.getStackTrace() : undefined,
            performance: this.collectPerformanceData()
        };

        // Apply filters
        if (!this.shouldLog(entry)) {
            return;
        }

        // Send to all transports
        const promises = this.transports.map(transport => {
            try {
                return transport.log(entry);
            } catch (error) {
                // Fallback to console if transport fails
                console.error('Transport error:', error);
                return Promise.resolve();
            }
        });

        if (promises.length > 0) {
            await Promise.allSettled(promises);
        } else {
            // Emergency fallback to console
            console.log(`[${level}] ${context}: ${message}`, data);
        }
    }

    private shouldLog(entry: LogEntry): boolean {
        return this.filters.every(filter => {
            try {
                return filter.shouldLog(entry);
            } catch (error) {
                console.warn('Filter error:', error);
                return true; // Fail open
            }
        });
    }

    private generateSessionId(): string {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private getCurrentUserId(): string | undefined {
        try {
            // Integration with auth system
            return (window as any).currentUserId ||
                StorageService.safeGetString('currentUserId') ||
                sessionStorage.getItem('currentUserId') ||
                undefined;
        } catch {
            return undefined;
        }
    }

    private getStackTrace(): string {
        try {
            return new Error().stack?.split('\n').slice(3, 8).join('\n') || '';
        } catch {
            return '';
        }
    }

    private shouldIncludeStackTrace(level: keyof LogLevel): boolean {
        if (!this.config.includeStackTrace) return false;

        const LogLevel = { TRACE: 0, DEBUG: 1, INFO: 2, WARN: 3, ERROR: 4, FATAL: 5 };
        return LogLevel[level] >= LogLevel.ERROR;
    }

    private collectPerformanceData(): { duration?: number; memory?: number } | undefined {
        if (!this.config.includePerformance) return undefined;

        try {
            return {
                memory: (performance as any).memory?.usedJSHeapSize,
                duration: performance.now()
            };
        } catch {
            return undefined;
        }
    }

    // Configuration methods
    addTransport(transport: LogTransport): void {
        this.transports.push(transport);
    }

    removeTransport(transport: LogTransport): void {
        const index = this.transports.indexOf(transport);
        if (index > -1) {
            this.transports.splice(index, 1);
        }
    }

    addFilter(filter: LogFilter): void {
        this.filters.push(filter);
    }

    removeFilter(filter: LogFilter): void {
        const index = this.filters.indexOf(filter);
        if (index > -1) {
            this.filters.splice(index, 1);
        }
    }

    setFormatter(context: string, formatter: LogFormatter): void {
        this.formatters.set(context, formatter);
    }

    // Runtime configuration changes
    setMinLevel(level: keyof LogLevel): void {
        this.config.minLevel = level;
        // Update level filters
        this.filters = this.filters.filter(filter => !(filter instanceof LevelFilter));
        this.addFilter(new LevelFilter(level));
    }

    setAllowedContexts(contexts: string[]): void {
        this.config.allowedContexts = contexts;
        // Update context filters
        this.filters = this.filters.filter(filter => !(filter instanceof ContextFilter));
        this.addFilter(new ContextFilter(contexts));
    }

    // Setup methods
    private setupDefaultTransports(): void {
        // Console transport for development
        if (this.config.environment === 'development') {
            this.addTransport(new ConsoleTransport(this.config));
        }

        // Storage transport for persistence
        if (this.config.enableStorage) {
            this.addTransport(new StorageTransport(this.config));
        }

        // Remote transport for production monitoring
        if (this.config.remoteEndpoint) {
            this.addTransport(new RemoteTransport(this.config));
        }
    }

    private setupDefaultFilters(): void {
        // Level filter
        this.addFilter(new LevelFilter(this.config.minLevel));

        // Context filter
        if (this.config.allowedContexts?.length) {
            this.addFilter(new ContextFilter(this.config.allowedContexts));
        }

        // Blocked contexts filter
        if (this.config.blockedContexts?.length) {
            this.addFilter(new BlockedContextFilter(this.config.blockedContexts));
        }

        // Performance filter
        if (this.config.performanceThreshold) {
            this.addFilter(new PerformanceFilter(this.config.performanceThreshold));
        }
    }

    private setupDefaultFormatters(): void {
        this.setFormatter('default', new DefaultFormatter());
        this.setFormatter('json', new JSONFormatter());
        this.setFormatter('dev', new DevelopmentFormatter());
    }

    // Lifecycle methods
    async flush(): Promise<void> {
        const flushPromises = this.transports
            .map(transport => transport.flush?.())
            .filter(Boolean) as Promise<void>[];

        if (flushPromises.length > 0) {
            await Promise.allSettled(flushPromises);
        }
    }

    async close(): Promise<void> {
        await this.flush();

        const closePromises = this.transports
            .map(transport => transport.close?.())
            .filter(Boolean) as Promise<void>[];

        if (closePromises.length > 0) {
            await Promise.allSettled(closePromises);
        }
    }
}

export default LoggerService;

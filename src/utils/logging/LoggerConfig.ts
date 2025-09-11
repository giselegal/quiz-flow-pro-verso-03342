// src/utils/logging/LoggerConfig.ts
export interface LoggerConfig {
    environment: 'development' | 'staging' | 'production' | 'test';
    minLevel: keyof LogLevel;
    allowedContexts?: string[];
    blockedContexts?: string[];
    includePerformance: boolean;
    performanceThreshold?: number;
    batchSize?: number;
    flushInterval?: number;
    enableStorage: boolean;
    maxStorageSize?: number;
    storageRetention?: number;
    remoteEndpoint?: string;
    remoteHeaders?: Record<string, string>;
    defaultFormatter: string;
    timestampFormat?: string;
    includeStackTrace: boolean;
    includeSessionData: boolean;
}

export interface LogLevel {
    TRACE: 0;
    DEBUG: 1;
    INFO: 2;
    WARN: 3;
    ERROR: 4;
    FATAL: 5;
}

export const createLoggerConfig = (
    overrides: Partial<LoggerConfig> = {}
): LoggerConfig => {
    const environment = (import.meta.env.NODE_ENV || 'development') as LoggerConfig['environment'];

    const baseConfig: LoggerConfig = {
        environment,
        minLevel: getMinLevelForEnvironment(environment),
        includePerformance: environment === 'development',
        enableStorage: environment !== 'test',
        defaultFormatter: environment === 'development' ? 'dev' : 'json',
        includeStackTrace: environment === 'development',
        includeSessionData: true,
        batchSize: environment === 'production' ? 10 : 1,
        flushInterval: environment === 'production' ? 5000 : 1000,
        maxStorageSize: 50 * 1024 * 1024, // 50MB
        storageRetention: 7 * 24 * 60 * 60 * 1000, // 7 days
        ...overrides
    };

    return baseConfig;
};

const getMinLevelForEnvironment = (env: string): keyof LogLevel => {
    switch (env) {
        case 'production': return 'WARN';
        case 'staging': return 'INFO';
        case 'test': return 'ERROR';
        case 'development':
        default: return 'DEBUG';
    }
};

// Environment-specific configs
export const developmentConfig = createLoggerConfig({
    minLevel: 'DEBUG',
    includePerformance: true,
    includeStackTrace: true,
    defaultFormatter: 'dev',
    allowedContexts: undefined, // Log all contexts
    enableStorage: true,
    // Enable debug contexts in development
    blockedContexts: undefined
});

export const productionConfig = createLoggerConfig({
    minLevel: 'WARN',
    includePerformance: false,
    includeStackTrace: false,
    defaultFormatter: 'json',
    batchSize: 50,
    flushInterval: 10000,
    remoteEndpoint: import.meta.env.VITE_LOGGING_ENDPOINT,
    remoteHeaders: {
        'Authorization': `Bearer ${import.meta.env.VITE_LOGGING_API_KEY}`,
        'Content-Type': 'application/json'
    },
    // Block debug contexts in production
    blockedContexts: ['trace', 'debug-performance', 'dev-tools']
});

export const testConfig = createLoggerConfig({
    minLevel: 'ERROR',
    enableStorage: false,
    includePerformance: false,
    defaultFormatter: 'json',
    includeStackTrace: false,
    // Only allow test-related contexts
    allowedContexts: ['test', 'error'],
    flushInterval: 100, // Quick flush for tests
    batchSize: 1
});

export const stagingConfig = createLoggerConfig({
    minLevel: 'INFO',
    includePerformance: true,
    includeStackTrace: true,
    defaultFormatter: 'json',
    enableStorage: true,
    remoteEndpoint: import.meta.env.VITE_STAGING_LOGGING_ENDPOINT,
    remoteHeaders: {
        'Authorization': `Bearer ${import.meta.env.VITE_STAGING_LOGGING_API_KEY}`,
        'Content-Type': 'application/json'
    }
});

// Config selector based on environment
export const getConfigForEnvironment = (): LoggerConfig => {
    const env = import.meta.env.NODE_ENV || 'development';

    switch (env) {
        case 'production':
            return productionConfig;
        case 'staging':
            return stagingConfig;
        case 'test':
            return testConfig;
        case 'development':
        default:
            return developmentConfig;
    }
};

// Feature flags for logging
export const LoggingFeatures = {
    ENABLE_REMOTE_LOGGING: import.meta.env.VITE_ENABLE_REMOTE_LOGGING === 'true',
    ENABLE_PERFORMANCE_LOGGING: import.meta.env.VITE_ENABLE_PERFORMANCE_LOGGING !== 'false',
    ENABLE_STORAGE_LOGGING: import.meta.env.VITE_ENABLE_STORAGE_LOGGING !== 'false',
    ENABLE_DEBUG_CONTEXT: import.meta.env.VITE_ENABLE_DEBUG_LOGGING === 'true',
    MAX_LOG_BUFFER_SIZE: parseInt(import.meta.env.VITE_MAX_LOG_BUFFER_SIZE || '1000'),
    LOG_FLUSH_INTERVAL: parseInt(import.meta.env.VITE_LOG_FLUSH_INTERVAL || '5000')
};

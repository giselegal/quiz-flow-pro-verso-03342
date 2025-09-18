// src/utils/logging/index.ts
// Entry point para o sistema de logging

// Core classes
export { default as LoggerService } from './LoggerService';
export { LoggerFactory, getLogger, useLogger } from './LoggerFactory';
export {
    createLoggerConfig,
    getConfigForEnvironment,
    LoggingFeatures,
    type LoggerConfig
} from './LoggerConfig';

// Core interfaces and types from LoggerService
export type {
    LogLevel,
    LogEntry,
    LogTransport,
    LogFilter,
    LogFormatter
} from './LoggerService';

// Import for type alias
import LoggerService from './LoggerService';

// Filters
export { LevelFilter } from './filters/LevelFilter';
export { ContextFilter } from './filters/ContextFilter';
export { BlockedContextFilter } from './filters/BlockedContextFilter';
export { PerformanceFilter } from './filters/PerformanceFilter';
export { RateLimitFilter } from './filters/RateLimitFilter';
export { SensitiveDataFilter } from './filters/SensitiveDataFilter';

// Formatters
export { DevelopmentFormatter } from './formatters/DevelopmentFormatter';
export { JSONFormatter } from './formatters/JSONFormatter';
export { DefaultFormatter } from './formatters/DefaultFormatter';
export { CompactFormatter } from './formatters/CompactFormatter';

// Transports
export { ConsoleTransport } from './transports/ConsoleTransport';
export { StorageTransport } from './transports/StorageTransport';
export { RemoteTransport } from './transports/RemoteTransport';

// Utility types for external usage
export type LoggerInstance = LoggerService;

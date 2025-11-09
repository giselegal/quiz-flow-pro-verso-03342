// src/utils/logging/index.ts
// Entry point para o sistema de logging

// Core classes (IMPORT LAZY SAFE)
// Evitar que consumidores que só precisem de tipos puxem toda a árvore.
export type { LogLevel, LogEntry, LogTransport, LogFilter, LogFormatter } from './LoggerService';
export type { LoggerConfig } from './LoggerConfig';

// Exports dinâmicos principais - funções utilitárias que realmente inicializam logger
// Mantidas para compatibilidade; módulos críticos agora usam proxy lazy.
export { LoggerFactory, getLogger, useLogger } from './LoggerFactory';
export {
    createLoggerConfig,
    getConfigForEnvironment,
    LoggingFeatures,
} from './LoggerConfig';

// Removidos exports diretos de filtros/formatters/transports para reduzir bundle default.
// Consumidores avançados devem importar diretamente do caminho específico ex:
// import { RateLimitFilter } from '@/lib/utils/logging/filters/RateLimitFilter';


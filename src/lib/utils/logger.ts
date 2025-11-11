// Thin re-export shim to unify logger usage across the codebase.
// Canonical implementation lives in './appLogger'.
export { appLogger, logger, log, createLogger, AppLogger, ChildLogger, compatLogger } from './appLogger';

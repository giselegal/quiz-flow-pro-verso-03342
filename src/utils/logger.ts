/**
 * 🚀 Logger unificado com níveis e desativação automática em produção.
 * - Em NODE_ENV==='production': apenas warn/error são emitidos
 * - Em desenvolvimento: todos os níveis (controláveis por flag localStorage:log:level)
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerOptions {
    namespace?: string;
    minLevel?: LogLevel; // Forçar nível mínimo
}

const LEVEL_PRIORITY: Record<LogLevel, number> = {
    debug: 10,
    info: 20,
    warn: 30,
    error: 40,
};

const DEFAULT_DEV_LEVEL: LogLevel = 'debug';
const DEFAULT_PROD_LEVEL: LogLevel = 'warn';

function resolveMinLevel(): LogLevel {
    try {
        if (typeof window !== 'undefined') {
            const stored = window.localStorage.getItem('log:level') as LogLevel | null;
            if (stored && LEVEL_PRIORITY[stored] !== undefined) return stored;
        }
    } catch { }
    return process.env.NODE_ENV === 'production' ? DEFAULT_PROD_LEVEL : DEFAULT_DEV_LEVEL;
}

export function createLogger(options: LoggerOptions = {}) {
    const minLevel = options.minLevel || resolveMinLevel();
    const ns = options.namespace ? `[${options.namespace}]` : '';

    const shouldLog = (level: LogLevel) => LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[minLevel];
    const format = (level: LogLevel, msg: any) => {
        const time = new Date().toISOString().split('T')[1].replace('Z', '');
        return `${time} ${level.toUpperCase()} ${ns} :: ${msg}`;
    };

    const base = {
        debug: (msg: any, data?: any) => shouldLog('debug') && console.debug(format('debug', msg), data || ''),
        info: (msg: any, data?: any) => shouldLog('info') && console.info(format('info', msg), data || ''),
        warn: (msg: any, data?: any) => shouldLog('warn') && console.warn(format('warn', msg), data || ''),
        error: (msg: any, data?: any) => console.error(format('error', msg), data || ''),
    };

    return base;
}

// Logger padrão de aplicação
export const appLogger = createLogger({ namespace: 'App' });

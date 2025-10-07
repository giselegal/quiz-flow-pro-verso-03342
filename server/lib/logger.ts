/*
 * Logger estruturado simples.
 * - Níveis: trace, debug, info, warn, error
 * - Controle via env LOG_LEVEL (default: info)
 * - Formato: JSON por linha { level, ts, msg, ...fields }
 * - logEvent(eventName, fields, level=info)
 */

export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error';

const LEVEL_ORDER: Record<LogLevel, number> = {
    trace: 10,
    debug: 20,
    info: 30,
    warn: 40,
    error: 50,
};

function currentThreshold(): number {
    const env = (process.env.LOG_LEVEL || 'info').toLowerCase();
    if (env in LEVEL_ORDER) return LEVEL_ORDER[env as LogLevel];
    return LEVEL_ORDER.info;
}

const threshold = currentThreshold();

function emit(level: LogLevel, msg: string, fields?: Record<string, any>) {
    if (LEVEL_ORDER[level] < threshold) return;
    const rec = {
        level,
        ts: new Date().toISOString(),
        msg,
        ...fields,
    };
    try {
        // eslint-disable-next-line no-console
        console.log(JSON.stringify(rec));
    } catch (e) {
        // fallback best effort
        // eslint-disable-next-line no-console
        console.log(`[log-fail] ${level} ${msg}`);
    }
}

export const logger = {
    trace: (msg: string, f?: Record<string, any>) => emit('trace', msg, f),
    debug: (msg: string, f?: Record<string, any>) => emit('debug', msg, f),
    info: (msg: string, f?: Record<string, any>) => emit('info', msg, f),
    warn: (msg: string, f?: Record<string, any>) => emit('warn', msg, f),
    error: (msg: string, f?: Record<string, any>) => emit('error', msg, f),
    logEvent: (event: string, fields?: Record<string, any>, level: LogLevel = 'info') => emit(level, event, { evt: event, ...fields }),
};

export function withCorrelation(base: Record<string, any>, correlationId?: string) {
    return { correlationId, ...base };
}

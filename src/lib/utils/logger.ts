import { StorageService } from '@/services/core/StorageService';
import { captureSentryError, captureSentryMessage, addSentryBreadcrumb } from '@/config/sentry.config';
import type * as Sentry from '@sentry/react';
import { appLogger } from '@/lib/utils/appLogger';

/**
 * 🚀 Logger unificado com níveis e desativação automática em produção.
 * 
 * FEATURES (G47 FIX):
 * ✅ Integração com Sentry para error tracking
 * ✅ Breadcrumbs automáticos para contexto
 * ✅ Níveis configuráveis por ambiente
 * 
 * - Em NODE_ENV==='production': apenas warn/error são emitidos
 * - Em desenvolvimento: todos os níveis (controláveis por flag localStorage:log:level)
 * - Errors e warns são enviados ao Sentry automaticamente
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
            const stored = StorageService.safeGetString('log:level') as LogLevel | null;
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
        // Aceita argumentos adicionais para compatibilidade retroativa.
        // Preferir usar (message: string, meta?: object) nos novos pontos de log.
        debug: (msg: any, ...rest: any[]) => {
            if (!shouldLog('debug')) return;
            
            // Console log
            appLogger.debug(String(format('debug', msg)), { data: [...rest] });
            
            // Sentry breadcrumb (apenas se tiver meta)
            if (rest.length > 0 && typeof rest[0] === 'object') {
                addSentryBreadcrumb({
                    message: String(msg),
                    level: 'debug' as Sentry.SeverityLevel,
                    data: rest[0],
                    category: ns.replace(/[\[\]]/g, '') || 'app',
                });
            }
        },
        
        info: (msg: any, ...rest: any[]) => {
            if (!shouldLog('info')) return;
            
            // Console log
            appLogger.info(String(format('info', msg)), { data: [...rest] });
            
            // Sentry breadcrumb
            if (rest.length > 0 && typeof rest[0] === 'object') {
                addSentryBreadcrumb({
                    message: String(msg),
                    level: 'info' as Sentry.SeverityLevel,
                    data: rest[0],
                    category: ns.replace(/[\[\]]/g, '') || 'app',
                });
            }
        },
        
        warn: (msg: any, ...rest: any[]) => {
            if (!shouldLog('warn')) return;
            
            // Console log
            appLogger.warn(String(format('warn', msg)), { data: [...rest] });
            
            // Sentry breadcrumb + message (warnings são rastreados)
            const meta = rest.length > 0 && typeof rest[0] === 'object' ? rest[0] : {};
            
            addSentryBreadcrumb({
                message: String(msg),
                level: 'warning' as Sentry.SeverityLevel,
                data: meta,
                category: ns.replace(/[\[\]]/g, '') || 'app',
            });
            
            // Capturar warning no Sentry (apenas em produção ou com flag)
            if (process.env.NODE_ENV === 'production') {
                captureSentryMessage(String(msg), 'warning' as Sentry.SeverityLevel);
            }
        },
        
        error: (msg: any, ...rest: any[]) => {
            // Errors sempre são logados
            appLogger.error(String(format('error', msg)), { data: [...rest] });
            
            const meta = rest.length > 0 && typeof rest[0] === 'object' ? rest[0] : {};
            
            // Sentry breadcrumb
            addSentryBreadcrumb({
                message: String(msg),
                level: 'error' as Sentry.SeverityLevel,
                data: meta,
                category: ns.replace(/[\[\]]/g, '') || 'app',
            });
            
            // Capturar erro no Sentry
            // Se meta.error é um Error object, capturar como exceção
            // Caso contrário, capturar como mensagem
            if (meta.error instanceof Error) {
                captureSentryError(meta.error, meta);
            } else {
                captureSentryMessage(String(msg), 'error' as Sentry.SeverityLevel);
            }
        },
    };

    return base;
}

// Logger padrão de aplicação
export const appLogger = createLogger({ namespace: 'App' });

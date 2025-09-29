/* StructuredLogger consolidado */
import { eventBus } from '@/core/events/eventBus';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'success';

export interface StructuredLogEvent {
    type: 'log.event';
    level: LogLevel;
    ts: number;
    scope?: string;
    message: string;
    data?: any;
    notify?: boolean; // se true dispara toast
}

class StructuredLogger {
    private enabled = true;
    private levelOrder: Record<LogLevel, number> = { debug: 10, info: 20, success: 25, warn: 30, error: 40 };
    private currentMin: LogLevel = 'debug';

    setEnabled(v: boolean) { this.enabled = v; }
    setMinLevel(level: LogLevel) { this.currentMin = level; }

    private shouldLog(level: LogLevel) {
        return this.enabled && this.levelOrder[level] >= this.levelOrder[this.currentMin];
    }

    private emit(level: LogLevel, message: string, data?: any, opts?: { scope?: string; notify?: boolean }) {
        if (!this.shouldLog(level)) return;
        const payload: StructuredLogEvent = {
            type: 'log.event',
            level,
            ts: Date.now(),
            scope: opts?.scope,
            message,
            data,
            notify: opts?.notify
        };
        // Console formatado
        const prefix = `[${new Date(payload.ts).toISOString()}][${payload.level.toUpperCase()}]${payload.scope ? '[' + payload.scope + ']' : ''}`;
        // eslint-disable-next-line no-console
        if (level === 'error') console.error(prefix, message, data || '');
        else if (level === 'warn') console.warn(prefix, message, data || '');
        else console.log(prefix, message, data || '');

        eventBus.publish(payload as any);
    }

    debug(msg: string, data?: any, scope?: string) { this.emit('debug', msg, data, { scope }); }
    info(msg: string, data?: any, scope?: string) { this.emit('info', msg, data, { scope }); }
    success(msg: string, data?: any, scope?: string) { this.emit('success', msg, data, { scope, notify: true }); }
    warn(msg: string, data?: any, scope?: string) { this.emit('warn', msg, data, { scope, notify: true }); }
    error(msg: string, data?: any, scope?: string) { this.emit('error', msg, data, { scope, notify: true }); }
}

export const logger = new StructuredLogger();

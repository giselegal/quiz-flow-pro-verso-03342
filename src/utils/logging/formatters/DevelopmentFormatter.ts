// src/utils/logging/formatters/DevelopmentFormatter.ts
import type { LogEntry, LogLevel } from '../LoggerService';
import type { LogFormatter } from './LogFormatter';

export class DevelopmentFormatter implements LogFormatter {
    format(entry: LogEntry): string {
        const emoji = this.getLevelEmoji(entry.level);
        const timestamp = new Date(entry.timestamp).toLocaleTimeString();
        const context = entry.context.toUpperCase().padEnd(8);

        let message = `${emoji} [${timestamp}] ${context} ${entry.message}`;

        if (entry.sessionId) {
            message += ` [${entry.sessionId.substring(0, 8)}]`;
        }

        if (entry.userId) {
            message += ` [user:${entry.userId}]`;
        }

        if (entry.data) {
            const dataStr = typeof entry.data === 'object'
                ? JSON.stringify(entry.data, null, 2)
                : String(entry.data);
            message += `\n   📄 Data: ${dataStr}`;
        }

        if (entry.performance?.duration) {
            message += `\n   ⚡ Performance: ${entry.performance.duration.toFixed(2)}ms`;
        }

        if (entry.performance?.memory) {
            const memoryMB = (entry.performance.memory / 1024 / 1024).toFixed(2);
            message += ` | Memory: ${memoryMB}MB`;
        }

        if (entry.stackTrace) {
            message += `\n   🔍 Stack:\n${entry.stackTrace}`;
        }

        return message;
    }

    private getLevelEmoji(level: keyof LogLevel): string {
        const emojis: Record<keyof LogLevel, string> = {
            TRACE: '🔍',
            DEBUG: '🐛',
            INFO: 'ℹ️',
            WARN: '⚠️',
            ERROR: '❌',
            FATAL: '💥'
        };
        return emojis[level];
    }
}

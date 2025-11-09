// src/utils/logging/formatters/DefaultFormatter.ts
import type { LogEntry } from '../LoggerService';
import type { LogFormatter } from './LogFormatter';

export class DefaultFormatter implements LogFormatter {
    format(entry: LogEntry): string {
        const timestamp = new Date(entry.timestamp).toISOString();
        const level = entry.level.padEnd(5);
        const context = entry.context.padEnd(10);

        let message = `${timestamp} [${level}] ${context} ${entry.message}`;

        if (entry.data) {
            const dataStr = typeof entry.data === 'object'
                ? JSON.stringify(entry.data)
                : String(entry.data);
            message += ` | ${dataStr}`;
        }

        if (entry.performance?.duration) {
            message += ` | ${entry.performance.duration.toFixed(2)}ms`;
        }

        return message;
    }
}

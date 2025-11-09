// src/utils/logging/formatters/CompactFormatter.ts
import type { LogEntry } from '../LoggerService';
import type { LogFormatter } from './LogFormatter';

export class CompactFormatter implements LogFormatter {
    format(entry: LogEntry): string {
        const time = new Date(entry.timestamp).toLocaleTimeString('pt-BR');
        const level = entry.level.substring(0, 1); // T, D, I, W, E, F
        const context = entry.context.substring(0, 4); // First 4 chars

        let message = `${time} ${level}:${context} ${entry.message}`;

        // Only add essential data in compact mode
        if (entry.level === 'ERROR' || entry.level === 'FATAL') {
            if (entry.data && typeof entry.data === 'object' && 'message' in entry.data) {
                message += ` | ${entry.data.message}`;
            }
        }

        return message;
    }
}

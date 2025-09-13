// src/utils/logging/formatters/JSONFormatter.ts
import type { LogEntry } from '../LoggerService';
import type { LogFormatter } from './LogFormatter';

export class JSONFormatter implements LogFormatter {
    format(entry: LogEntry): string {
        try {
            return JSON.stringify(entry, null, 0);
        } catch (error) {
            // Handle circular references or other JSON issues
            return JSON.stringify({
                ...entry,
                data: '[Serialization Error]',
                error: error instanceof Error ? error.message : String(error)
            });
        }
    }
}

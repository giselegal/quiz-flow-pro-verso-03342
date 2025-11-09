// src/utils/logging/formatters/LogFormatter.ts
import type { LogEntry } from '../LoggerService';

export interface LogFormatter {
    format(entry: LogEntry): string;
}

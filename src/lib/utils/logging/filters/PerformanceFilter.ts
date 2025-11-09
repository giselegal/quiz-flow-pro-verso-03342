// src/utils/logging/filters/PerformanceFilter.ts
import type { LogFilter, LogEntry } from '../LoggerService';

export class PerformanceFilter implements LogFilter {
    constructor(private threshold: number) { }

    shouldLog(entry: LogEntry): boolean {
        // Only apply performance filtering to trace/debug levels
        if (entry.level === 'TRACE' || entry.level === 'DEBUG') {
            const memory = entry.performance?.memory || 0;
            return memory < this.threshold;
        }
        return true;
    }

    setThreshold(threshold: number): void {
        this.threshold = threshold;
    }

    getThreshold(): number {
        return this.threshold;
    }
}

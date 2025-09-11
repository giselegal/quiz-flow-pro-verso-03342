// src/utils/logging/filters/LevelFilter.ts
import type { LogFilter, LogEntry, LogLevel } from '../LoggerService';

export class LevelFilter implements LogFilter {
    private minLevel: number;
    private readonly levels: Record<keyof LogLevel, number> = {
        TRACE: 0,
        DEBUG: 1,
        INFO: 2,
        WARN: 3,
        ERROR: 4,
        FATAL: 5
    };

    constructor(minLevel: keyof LogLevel) {
        this.minLevel = this.levels[minLevel];
    }

    shouldLog(entry: LogEntry): boolean {
        return this.levels[entry.level] >= this.minLevel;
    }

    setMinLevel(level: keyof LogLevel): void {
        this.minLevel = this.levels[level];
    }

    getMinLevel(): keyof LogLevel {
        const entries = Object.entries(this.levels) as [keyof LogLevel, number][];
        const found = entries.find(([, value]) => value === this.minLevel);
        return found ? found[0] : 'DEBUG';
    }
}

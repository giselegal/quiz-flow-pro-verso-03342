// src/utils/logging/filters/RateLimitFilter.ts
import type { LogFilter, LogEntry } from '../LoggerService';

interface RateLimitConfig {
    maxLogsPerSecond: number;
    maxLogsPerMinute: number;
    burstLimit: number;
}

export class RateLimitFilter implements LogFilter {
    private logTimestamps: number[] = [];
    private burstCount: number = 0;
    private lastResetTime: number = Date.now();

    constructor(private config: RateLimitConfig) { }

    shouldLog(entry: LogEntry): boolean {
        const now = Date.now();

        // Reset burst counter every second
        if (now - this.lastResetTime >= 1000) {
            this.burstCount = 0;
            this.lastResetTime = now;
        }

        // Check burst limit
        if (this.burstCount >= this.config.burstLimit) {
            return false;
        }

        // Clean old timestamps
        this.cleanOldTimestamps(now);

        // Check per-second limit
        const recentLogs = this.logTimestamps.filter(timestamp => now - timestamp < 1000);
        if (recentLogs.length >= this.config.maxLogsPerSecond) {
            return false;
        }

        // Check per-minute limit
        const lastMinuteLogs = this.logTimestamps.filter(timestamp => now - timestamp < 60000);
        if (lastMinuteLogs.length >= this.config.maxLogsPerMinute) {
            return false;
        }

        // Allow log
        this.logTimestamps.push(now);
        this.burstCount++;

        return true;
    }

    private cleanOldTimestamps(now: number): void {
        // Keep only timestamps from the last minute
        this.logTimestamps = this.logTimestamps.filter(timestamp => now - timestamp < 60000);
    }

    getStats(): { recentCount: number; totalBlocked: number } {
        const now = Date.now();
        const recentCount = this.logTimestamps.filter(timestamp => now - timestamp < 1000).length;
        return {
            recentCount,
            totalBlocked: this.burstCount
        };
    }
}

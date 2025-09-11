// src/utils/logging/transports/StorageTransport.ts
import type { LogTransport, LogEntry } from '../LoggerService';
import type { LoggerConfig } from '../LoggerConfig';

export class StorageTransport implements LogTransport {
    private config: LoggerConfig;
    private buffer: LogEntry[] = [];
    private flushTimer?: number;
    private readonly storageKey = 'app-logs';
    private readonly tempStorageKey = 'app-logs-temp';

    constructor(config: LoggerConfig) {
        this.config = config;
        this.setupPeriodicFlush();
        this.cleanupOldEntries();
    }

    async log(entry: LogEntry): Promise<void> {
        this.buffer.push(entry);

        if (this.buffer.length >= (this.config.batchSize || 10)) {
            await this.flush();
        }
    }

    async flush(): Promise<void> {
        if (this.buffer.length === 0) return;

        try {
            const entries = [...this.buffer];
            this.buffer = [];

            const stored = this.getStoredEntries();
            const combined = [...stored, ...entries];

            // Keep only recent entries within size limit
            const filtered = this.filterEntries(combined);

            localStorage.setItem(this.storageKey, JSON.stringify(filtered));
        } catch (error) {
            console.warn('Failed to store logs:', error);
            // Try to store in session storage as fallback
            try {
                const recentLogs = this.buffer.slice(-100);
                sessionStorage.setItem(this.tempStorageKey, JSON.stringify(recentLogs));
            } catch {
                // Silent fallback failure - we can't do much more
            }
        }
    }

    private getStoredEntries(): LogEntry[] {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : [];
        } catch {
            // Try session storage fallback
            try {
                const temp = sessionStorage.getItem(this.tempStorageKey);
                return temp ? JSON.parse(temp) : [];
            } catch {
                return [];
            }
        }
    }

    private filterEntries(entries: LogEntry[]): LogEntry[] {
        const now = Date.now();
        const retention = this.config.storageRetention || (7 * 24 * 60 * 60 * 1000);

        // Filter by age
        const recent = entries.filter(entry => {
            const entryTime = new Date(entry.timestamp).getTime();
            return (now - entryTime) < retention;
        });

        // Filter by size
        const maxSize = this.config.maxStorageSize || (50 * 1024 * 1024);
        let currentSize = 0;
        const result: LogEntry[] = [];

        // Keep most recent entries first
        for (let i = recent.length - 1; i >= 0; i--) {
            const entry = recent[i];
            const entrySize = JSON.stringify(entry).length;

            if (currentSize + entrySize > maxSize) {
                break;
            }

            result.unshift(entry);
            currentSize += entrySize;
        }

        return result;
    }

    private setupPeriodicFlush(): void {
        const interval = this.config.flushInterval || 5000;
        this.flushTimer = window.setInterval(() => {
            this.flush().catch(console.warn);
        }, interval);
    }

    private cleanupOldEntries(): void {
        // Clean up immediately on init
        const stored = this.getStoredEntries();
        const filtered = this.filterEntries(stored);

        if (filtered.length !== stored.length) {
            try {
                localStorage.setItem(this.storageKey, JSON.stringify(filtered));
            } catch {
                // Silent cleanup failure
            }
        }
    }

    // Public methods for log management
    getLogs(count?: number, fromTime?: Date): LogEntry[] {
        const stored = this.getStoredEntries();
        let filtered = stored;

        if (fromTime) {
            const fromTimestamp = fromTime.getTime();
            filtered = stored.filter(entry => {
                return new Date(entry.timestamp).getTime() >= fromTimestamp;
            });
        }

        if (count) {
            filtered = filtered.slice(-count);
        }

        return filtered;
    }

    clearLogs(): void {
        try {
            localStorage.removeItem(this.storageKey);
            sessionStorage.removeItem(this.tempStorageKey);
            this.buffer = [];
        } catch (error) {
            console.warn('Failed to clear logs:', error);
        }
    }

    getStorageStats(): { entryCount: number; sizeBytes: number; oldestEntry?: Date } {
        const entries = this.getStoredEntries();
        const sizeBytes = JSON.stringify(entries).length;

        let oldestEntry: Date | undefined;
        if (entries.length > 0) {
            oldestEntry = new Date(entries[0].timestamp);
        }

        return {
            entryCount: entries.length,
            sizeBytes,
            oldestEntry
        };
    }

    async close(): Promise<void> {
        if (this.flushTimer) {
            clearInterval(this.flushTimer);
        }
        await this.flush();
    }
}

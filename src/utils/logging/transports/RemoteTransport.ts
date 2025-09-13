// src/utils/logging/transports/RemoteTransport.ts
import type { LogTransport, LogEntry } from '../LoggerService';
import type { LoggerConfig } from '../LoggerConfig';

interface RemoteLogPayload {
    logs: LogEntry[];
    metadata: {
        source: string;
        version: string;
        timestamp: string;
        userAgent?: string;
        url?: string;
    };
}

export class RemoteTransport implements LogTransport {
    private config: LoggerConfig;
    private buffer: LogEntry[] = [];
    private flushTimer?: number;
    private isOnline: boolean = navigator.onLine;
    private retryCount: number = 0;
    private maxRetries: number = 3;
    private retryTimeout?: number;

    constructor(config: LoggerConfig) {
        this.config = config;
        this.setupNetworkMonitoring();
        this.setupPeriodicFlush();
    }

    async log(entry: LogEntry): Promise<void> {
        this.buffer.push(entry);

        if (this.buffer.length >= (this.config.batchSize || 50)) {
            await this.flush();
        }
    }

    async flush(): Promise<void> {
        if (this.buffer.length === 0 || !this.isOnline) return;
        if (!this.config.remoteEndpoint) return;

        const entries = [...this.buffer];
        this.buffer = [];

        const payload: RemoteLogPayload = {
            logs: entries,
            metadata: {
                source: 'quiz-quest-challenge-verse',
                version: import.meta.env.VITE_APP_VERSION || '1.0.0',
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                url: window.location.href
            }
        };

        try {
            const response = await this.sendToRemote(payload);

            if (response.ok) {
                this.retryCount = 0;
                return;
            }

            throw new Error(`HTTP ${response.status}: ${response.statusText}`);

        } catch (error) {
            console.warn('Failed to send logs to remote endpoint:', error);

            // Store failed entries back to buffer for retry
            this.buffer.unshift(...entries);

            // Limit buffer size to prevent memory issues
            if (this.buffer.length > 1000) {
                this.buffer = this.buffer.slice(-500);
            }

            // Schedule retry with exponential backoff
            this.scheduleRetry();
        }
    }

    private async sendToRemote(payload: RemoteLogPayload): Promise<Response> {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

        try {
            const response = await fetch(this.config.remoteEndpoint!, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.config.remoteHeaders
                },
                body: JSON.stringify(payload),
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            return response;

        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }

    private scheduleRetry(): void {
        if (this.retryCount >= this.maxRetries) {
            console.warn('Max retry attempts reached, dropping logs');
            this.buffer = []; // Clear buffer to prevent memory leak
            this.retryCount = 0;
            return;
        }

        if (this.retryTimeout) {
            clearTimeout(this.retryTimeout);
        }

        // Exponential backoff: 2^retryCount * 1000ms
        const delay = Math.pow(2, this.retryCount) * 1000;
        this.retryCount++;

        this.retryTimeout = window.setTimeout(() => {
            this.flush().catch(console.warn);
        }, delay);
    }

    private setupNetworkMonitoring(): void {
        window.addEventListener('online', () => {
            this.isOnline = true;
            // Try to flush buffered logs when coming back online
            setTimeout(() => {
                this.flush().catch(console.warn);
            }, 1000);
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
        });
    }

    private setupPeriodicFlush(): void {
        const interval = this.config.flushInterval || 10000;
        this.flushTimer = window.setInterval(() => {
            this.flush().catch(console.warn);
        }, interval);
    }

    // Public methods
    getBufferStats(): { count: number; oldestEntry?: Date; isOnline: boolean } {
        let oldestEntry: Date | undefined;
        if (this.buffer.length > 0) {
            oldestEntry = new Date(this.buffer[0].timestamp);
        }

        return {
            count: this.buffer.length,
            oldestEntry,
            isOnline: this.isOnline
        };
    }

    forceFlush(): Promise<void> {
        return this.flush();
    }

    clearBuffer(): void {
        this.buffer = [];
        this.retryCount = 0;
        if (this.retryTimeout) {
            clearTimeout(this.retryTimeout);
            this.retryTimeout = undefined;
        }
    }

    async close(): Promise<void> {
        if (this.flushTimer) {
            clearInterval(this.flushTimer);
        }

        if (this.retryTimeout) {
            clearTimeout(this.retryTimeout);
        }

        // Final flush attempt
        await this.flush();
    }
}

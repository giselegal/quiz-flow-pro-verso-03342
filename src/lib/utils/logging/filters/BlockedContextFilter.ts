// src/utils/logging/filters/BlockedContextFilter.ts
import type { LogFilter, LogEntry } from '../LoggerService';

export class BlockedContextFilter implements LogFilter {
    constructor(private blockedContexts: string[]) { }

    shouldLog(entry: LogEntry): boolean {
        return !this.blockedContexts.includes(entry.context);
    }

    addBlockedContext(context: string): void {
        if (!this.blockedContexts.includes(context)) {
            this.blockedContexts.push(context);
        }
    }

    removeBlockedContext(context: string): void {
        const index = this.blockedContexts.indexOf(context);
        if (index > -1) {
            this.blockedContexts.splice(index, 1);
        }
    }

    getBlockedContexts(): string[] {
        return [...this.blockedContexts];
    }
}

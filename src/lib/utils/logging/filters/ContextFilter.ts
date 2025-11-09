// src/utils/logging/filters/ContextFilter.ts
import type { LogFilter, LogEntry } from '../LoggerService';

export class ContextFilter implements LogFilter {
    constructor(private allowedContexts: string[]) { }

    shouldLog(entry: LogEntry): boolean {
        return this.allowedContexts.includes(entry.context);
    }

    addContext(context: string): void {
        if (!this.allowedContexts.includes(context)) {
            this.allowedContexts.push(context);
        }
    }

    removeContext(context: string): void {
        const index = this.allowedContexts.indexOf(context);
        if (index > -1) {
            this.allowedContexts.splice(index, 1);
        }
    }

    getAllowedContexts(): string[] {
        return [...this.allowedContexts];
    }
}

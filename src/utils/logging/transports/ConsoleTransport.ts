// src/utils/logging/transports/ConsoleTransport.ts
import type { LogTransport, LogEntry } from '../LoggerService';
import type { LoggerConfig } from '../LoggerConfig';
import type { LogFormatter } from '../formatters/LogFormatter';
import { DevelopmentFormatter } from '../formatters/DevelopmentFormatter';

export class ConsoleTransport implements LogTransport {
    private formatter: LogFormatter;
    private config: LoggerConfig;

    constructor(config: LoggerConfig, formatter?: LogFormatter) {
        this.config = config;
        this.formatter = formatter || new DevelopmentFormatter();
    }

    log(entry: LogEntry): void {
        const formatted = this.formatter.format(entry);

        switch (entry.level) {
            case 'TRACE':
            case 'DEBUG':
                console.debug(formatted);
                break;
            case 'INFO':
                console.info(formatted);
                break;
            case 'WARN':
                console.warn(formatted);
                break;
            case 'ERROR':
            case 'FATAL':
                console.error(formatted);
                if (entry.data && this.config.includeStackTrace) {
                    console.error('Additional data:', entry.data);
                }
                break;
        }
    }

    setFormatter(formatter: LogFormatter): void {
        this.formatter = formatter;
    }

    getFormatter(): LogFormatter {
        return this.formatter;
    }
}

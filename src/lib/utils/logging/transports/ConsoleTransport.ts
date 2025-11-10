// src/utils/logging/transports/ConsoleTransport.ts
import type { LogTransport, LogEntry } from '../LoggerService';
import type { LoggerConfig } from '../LoggerConfig';
import type { LogFormatter } from '../formatters/LogFormatter';
import { DevelopmentFormatter } from '../formatters/DevelopmentFormatter';
import { appLogger } from '@/lib/utils/appLogger';

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
                appLogger.debug(String(formatted));
                break;
            case 'INFO':
                appLogger.info(String(formatted));
                break;
            case 'WARN':
                appLogger.warn(String(formatted));
                break;
            case 'ERROR':
            case 'FATAL':
                appLogger.error(String(formatted));
                if (entry.data && this.config.includeStackTrace) {
                    appLogger.error('Additional data:', { data: [entry.data] });
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

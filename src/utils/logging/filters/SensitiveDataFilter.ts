// src/utils/logging/filters/SensitiveDataFilter.ts
import type { LogFilter, LogEntry } from '../LoggerService';

interface SensitivePattern {
    pattern: RegExp;
    replacement: string;
}

export class SensitiveDataFilter implements LogFilter {
    private sensitivePatterns: SensitivePattern[] = [
        // Credit card numbers
        { pattern: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, replacement: '[CARD-REDACTED]' },

        // Email addresses (partial redaction)
        { pattern: /(\w+)@(\w+\.\w+)/g, replacement: '$1***@$2' },

        // Phone numbers
        { pattern: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, replacement: '[PHONE-REDACTED]' },

        // API keys and tokens
        { pattern: /\b[A-Za-z0-9]{32,}\b/g, replacement: '[TOKEN-REDACTED]' },

        // Passwords
        { pattern: /"password"\s*:\s*"[^"]*"/gi, replacement: '"password": "[REDACTED]"' },
        { pattern: /'password'\s*:\s*'[^']*'/gi, replacement: "'password': '[REDACTED]'" },

        // Authorization headers
        { pattern: /authorization:\s*bearer\s+[^\s]+/gi, replacement: 'authorization: bearer [REDACTED]' },

        // Social security numbers
        { pattern: /\b\d{3}-?\d{2}-?\d{4}\b/g, replacement: '[SSN-REDACTED]' },
    ];

    private customPatterns: SensitivePattern[] = [];

    shouldLog(entry: LogEntry): boolean {
        // This filter doesn't block logs, it sanitizes them
        this.sanitizeEntry(entry);
        return true;
    }

    addPattern(pattern: RegExp, replacement: string): void {
        this.customPatterns.push({ pattern, replacement });
    }

    removeCustomPattern(index: number): void {
        if (index >= 0 && index < this.customPatterns.length) {
            this.customPatterns.splice(index, 1);
        }
    }

    private sanitizeEntry(entry: LogEntry): void {
        const allPatterns = [...this.sensitivePatterns, ...this.customPatterns];

        // Sanitize message
        entry.message = this.sanitizeString(entry.message, allPatterns);

        // Sanitize data
        if (entry.data) {
            entry.data = this.sanitizeData(entry.data, allPatterns);
        }

        // Sanitize stack trace
        if (entry.stackTrace) {
            entry.stackTrace = this.sanitizeString(entry.stackTrace, allPatterns);
        }
    }

    private sanitizeString(text: string, patterns: SensitivePattern[]): string {
        let sanitized = text;

        for (const { pattern, replacement } of patterns) {
            sanitized = sanitized.replace(pattern, replacement);
        }

        return sanitized;
    }

    private sanitizeData(data: any, patterns: SensitivePattern[]): any {
        if (typeof data === 'string') {
            return this.sanitizeString(data, patterns);
        }

        if (Array.isArray(data)) {
            return data.map(item => this.sanitizeData(item, patterns));
        }

        if (data && typeof data === 'object') {
            const sanitized: any = {};

            for (const [key, value] of Object.entries(data)) {
                // Check if the key itself is sensitive
                const sanitizedKey = this.sanitizeString(key, patterns);
                sanitized[sanitizedKey] = this.sanitizeData(value, patterns);
            }

            return sanitized;
        }

        return data;
    }

    getPatternCount(): { default: number; custom: number } {
        return {
            default: this.sensitivePatterns.length,
            custom: this.customPatterns.length
        };
    }
}

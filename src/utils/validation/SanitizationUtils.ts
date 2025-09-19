/**
 * 🧹 SANITIZATION UTILITIES - CONSOLIDAÇÃO FASE 1
 * 
 * Consolida funcionalidades de sanitização dispersas:
 * - HTML sanitization (from blockValidation.ts)
 * - URL sanitization (from blockValidation.ts)
 * - Data cleaning and normalization
 * - Security validation
 * 
 * ✅ BENEFÍCIOS:
 * - Funções de sanitização reutilizáveis
 * - Segurança centralizada
 * - Performance otimizada
 * - Extensível para novos tipos de dados
 */

// =============================================
// HTML SANITIZATION
// =============================================

/**
 * Sanitizes HTML content removing dangerous elements
 */
export function sanitizeHtml(html: string): string {
    if (!html || typeof html !== 'string') return '';

    return html
        // Remove script tags completely
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        // Remove potentially dangerous tags
        .replace(/<(iframe|object|embed|link|meta|style)\b[^>]*>/gi, '')
        // Remove javascript: protocols
        .replace(/javascript:/gi, '')
        // Remove on* event handlers
        .replace(/\s+on\w+\s*=/gi, '')
        // Remove data: protocols except images
        .replace(/data:(?!image\/)/gi, 'data-removed:')
        // Clean up extra whitespace
        .replace(/\s+/g, ' ')
        .trim();
}

/**
 * Strips all HTML tags, keeping only text content
 */
export function stripHtml(html: string): string {
    if (!html || typeof html !== 'string') return '';

    return html
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, ' ')
        .trim();
}

/**
 * Allows only safe HTML tags for rich text content
 */
export function sanitizeRichText(html: string): string {
    if (!html || typeof html !== 'string') return '';

    const allowedTags = ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 'ul', 'ol', 'li', 'a', 'span'];
    const allowedAttributes = ['href', 'title', 'class'];

    // First, remove dangerous content
    let sanitized = sanitizeHtml(html);

    // Then allow only specific tags
    const tagRegex = /<\/?(\w+)([^>]*)>/g;
    sanitized = sanitized.replace(tagRegex, (_match: string, tagName: string, attributes: string) => {
        if (!allowedTags.includes(tagName.toLowerCase())) {
            return ''; // Remove disallowed tags
        }

        // For allowed tags, sanitize attributes
        if (attributes) {
            const cleanAttributes = attributes.replace(/(\w+)=["']([^"']*)["']/g, (_attrMatch: string, attrName: string, attrValue: string) => {
                if (allowedAttributes.includes(attrName.toLowerCase())) {
                    // Additional validation for href
                    if (attrName.toLowerCase() === 'href') {
                        attrValue = sanitizeUrl(attrValue);
                    }
                    return `${attrName}="${attrValue}"`;
                }
                return '';
            });
            return `<${tagName}${cleanAttributes}>`;
        }

        return `<${tagName}>`;
    });

    return sanitized;
}

// =============================================
// URL SANITIZATION
// =============================================

/**
 * Sanitizes URLs to prevent XSS and malicious protocols
 */
export function sanitizeUrl(url: string): string {
    if (!url || typeof url !== 'string') return '';

    const trimmedUrl = url.trim();

    // Block dangerous protocols
    const dangerousProtocols = [
        'javascript:', 'data:', 'vbscript:', 'file:', 'ftp:',
        'jar:', 'chrome:', 'chrome-extension:', 'moz-extension:'
    ];

    const lowerUrl = trimmedUrl.toLowerCase();

    if (dangerousProtocols.some(protocol => lowerUrl.startsWith(protocol))) {
        return '';
    }

    // Allow only safe protocols
    const safeProtocols = ['http://', 'https://', '/', './', '../', 'mailto:', 'tel:'];
    const isSafeProtocol = safeProtocols.some(protocol =>
        lowerUrl.startsWith(protocol) || !lowerUrl.includes(':')
    );

    if (!isSafeProtocol) {
        return '';
    }

    // Additional URL validation
    try {
        if (trimmedUrl.includes('://')) {
            new URL(trimmedUrl); // Validate URL format
        }
    } catch {
        return '';
    }

    return trimmedUrl;
}

/**
 * Validates and normalizes email addresses
 */
export function sanitizeEmail(email: string): string {
    if (!email || typeof email !== 'string') return '';

    const trimmed = email.trim().toLowerCase();

    // Basic email regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (emailRegex.test(trimmed)) {
        return trimmed;
    }

    return '';
}

// =============================================
// STRING SANITIZATION
// =============================================

/**
 * Cleans and normalizes text input
 */
export function sanitizeText(text: string, options: {
    maxLength?: number;
    allowNewlines?: boolean;
    allowSpecialChars?: boolean;
} = {}): string {
    if (!text || typeof text !== 'string') return '';

    const {
        maxLength = 10000,
        allowNewlines = true,
        allowSpecialChars = true
    } = options;

    let sanitized = text
        // Normalize whitespace
        .replace(/[\r\n\t]/g, allowNewlines ? '\n' : ' ')
        .replace(/\s+/g, allowNewlines ? ((match: string) => match.includes('\n') ? '\n' : ' ') : ' ')
        .trim();

    // Remove special characters if not allowed
    if (!allowSpecialChars) {
        sanitized = sanitized.replace(/[^\w\s\-_.@]/g, '');
    }

    // Limit length
    if (sanitized.length > maxLength) {
        sanitized = sanitized.substring(0, maxLength).trim();
    }

    return sanitized;
}

/**
 * Sanitizes file names
 */
export function sanitizeFileName(fileName: string): string {
    if (!fileName || typeof fileName !== 'string') return '';

    return fileName
        .trim()
        // Remove path separators and dangerous characters
        .replace(/[<>:"/\\|?*\x00-\x1f]/g, '')
        // Remove leading/trailing dots and spaces
        .replace(/^[\s.]+|[\s.]+$/g, '')
        // Limit length
        .substring(0, 255);
}

// =============================================
// NUMERIC SANITIZATION
// =============================================

/**
 * Sanitizes and validates numeric input
 */
export function sanitizeNumber(
    value: any,
    options: {
        min?: number;
        max?: number;
        allowFloat?: boolean;
        allowNegative?: boolean;
    } = {}
): number | null {
    const {
        min = Number.MIN_SAFE_INTEGER,
        max = Number.MAX_SAFE_INTEGER,
        allowFloat = true,
        allowNegative = true
    } = options;

    // Convert to number
    let num: number;
    if (typeof value === 'string') {
        num = allowFloat ? parseFloat(value) : parseInt(value, 10);
    } else if (typeof value === 'number') {
        num = value;
    } else {
        return null;
    }

    // Validate
    if (isNaN(num) || !isFinite(num)) {
        return null;
    }

    // Check negative
    if (!allowNegative && num < 0) {
        return null;
    }

    // Apply bounds
    if (num < min) num = min;
    if (num > max) num = max;

    // Round if not allowing floats
    if (!allowFloat) {
        num = Math.round(num);
    }

    return num;
}

// =============================================
// OBJECT SANITIZATION
// =============================================

/**
 * Deep sanitizes object properties
 */
export function sanitizeObject(
    obj: any,
    options: {
        maxDepth?: number;
        allowedKeys?: string[];
        sanitizers?: Record<string, (value: any) => any>;
    } = {}
): any {
    const { maxDepth = 10, allowedKeys, sanitizers = {} } = options;

    if (maxDepth <= 0 || obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(item => sanitizeObject(item, { ...options, maxDepth: maxDepth - 1 }));
    }

    const sanitized: any = {};

    for (const [key, value] of Object.entries(obj)) {
        // Skip keys not in allowlist if provided
        if (allowedKeys && !allowedKeys.includes(key)) {
            continue;
        }

        // Apply custom sanitizer if available
        if (sanitizers[key]) {
            sanitized[key] = sanitizers[key](value);
            continue;
        }

        // Default sanitization based on type
        if (typeof value === 'string') {
            // Apply different sanitization based on key name
            if (key.toLowerCase().includes('email')) {
                sanitized[key] = sanitizeEmail(value);
            } else if (key.toLowerCase().includes('url') || key.toLowerCase().includes('href')) {
                sanitized[key] = sanitizeUrl(value);
            } else if (key.toLowerCase().includes('html') || key.toLowerCase().includes('content')) {
                sanitized[key] = sanitizeRichText(value);
            } else {
                sanitized[key] = sanitizeText(value);
            }
        } else if (typeof value === 'number') {
            sanitized[key] = sanitizeNumber(value);
        } else if (typeof value === 'object') {
            sanitized[key] = sanitizeObject(value, { ...options, maxDepth: maxDepth - 1 });
        } else {
            sanitized[key] = value;
        }
    }

    return sanitized;
}

// =============================================
// VALIDATION HELPERS
// =============================================

/**
 * Checks if a color value is valid
 */
export function isValidColor(color: string): boolean {
    if (!color || typeof color !== 'string') return false;

    // Hex colors
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) return true;

    // RGB/RGBA colors  
    if (/^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+(?:\s*,\s*[\d.]+)?\s*\)$/.test(color)) return true;

    // HSL/HSLA colors
    if (/^hsla?\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%(?:\s*,\s*[\d.]+)?\s*\)$/.test(color)) return true;

    // CSS named colors (basic set)
    const namedColors = [
        'transparent', 'black', 'white', 'red', 'green', 'blue', 'yellow',
        'purple', 'orange', 'pink', 'gray', 'grey', 'brown', 'cyan', 'magenta'
    ];

    return namedColors.includes(color.toLowerCase());
}

/**
 * Checks if a font size value is valid
 */
export function isValidFontSize(fontSize: string): boolean {
    if (!fontSize || typeof fontSize !== 'string') return false;
    return /^\d+(px|em|rem|%|pt|pc|in|cm|mm|ex|ch|vw|vh|vmin|vmax)$/.test(fontSize.trim());
}

/**
 * Validates CSS unit values
 */
export function sanitizeCssUnit(value: string | number, defaultUnit = 'px'): string {
    if (typeof value === 'number') {
        return `${value}${defaultUnit}`;
    }

    if (typeof value === 'string') {
        const trimmed = value.trim();
        if (/^\d+$/.test(trimmed)) {
            return `${trimmed}${defaultUnit}`;
        }
        if (isValidFontSize(trimmed)) {
            return trimmed;
        }
    }

    return `0${defaultUnit}`;
}
// Placeholder parser simples
// Suporta: {userName}, {resultStyle}, {score:estilo}
// context exemplo: { userName: 'Ana', resultStyle: 'classico', scores: { classico: 12 } }

export interface PlaceholderContext {
    userName?: string;
    resultStyle?: string;
    scores?: Record<string, number>;
    [key: string]: any;
}

const PLACEHOLDER_REGEX = /\{([a-zA-Z0-9_:-]+)\}/g;

export function replacePlaceholders(text: string, context: PlaceholderContext): string {
    if (!text) return '';
    return text.replace(PLACEHOLDER_REGEX, (_, raw) => {
        if (raw === 'userName') return context.userName || '';
        if (raw === 'resultStyle') return context.resultStyle || '';
        if (raw.startsWith('score:')) {
            const style = raw.split(':')[1];
            return String(context.scores?.[style] ?? '0');
        }
        // fallback generic key
        return context[raw] !== undefined ? String(context[raw]) : '';
    });
}

export function hasPlaceholders(text: string): boolean {
    return PLACEHOLDER_REGEX.test(text);
}

export function extractPlaceholders(text: string): string[] {
    const set = new Set<string>();
    text.replace(PLACEHOLDER_REGEX, (_, raw) => { set.add(raw); return ''; });
    return Array.from(set);
}
export function normalizeStepId(raw: string): string {
    if (!raw) return raw;
    const trimmed = raw.trim();
    // Mantém IDs existentes se já seguem padrão simples; senão, normaliza para lowercase e substitui espaços
    const normalized = trimmed.toLowerCase().replace(/\s+/g, '-');
    return normalized;
}

export function generateBlockId(prefix = 'blk'): string {
    const rnd = typeof crypto !== 'undefined' && typeof (crypto as any).randomUUID === 'function'
        ? (crypto as any).randomUUID()
        : Math.random().toString(36).slice(2, 10);
    return `${prefix}-${rnd}`;
}

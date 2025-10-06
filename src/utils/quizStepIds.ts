/**
 * Utilidades para normalização e compatibilidade de IDs de steps
 * Padronização oficial: step-XX (zero padded)
 */

const PADDED_REGEX = /^step-\d{2}$/;
const LEGACY_REGEX = /^step-\d{1}$/;

export function normalizeStepId(id: string | null | undefined): string {
    if (!id) return 'step-01';
    if (PADDED_REGEX.test(id)) return id; // já padded
    if (LEGACY_REGEX.test(id)) {
        const n = id.replace('step-', '');
        return `step-${n.padStart(2, '0')}`;
    }
    // fallback: tentar extrair número
    const digits = id.replace(/[^0-9]/g, '');
    if (digits) return `step-${digits.padStart(2, '0')}`;
    return 'step-01';
}

/** Retorna variantes possíveis (padded + legacy) para lookup */
export function stepIdVariants(id: string): string[] {
    const normalized = normalizeStepId(id);
    const legacy = normalized.replace('step-0', 'step-');
    return normalized === legacy ? [normalized] : [normalized, legacy];
}

/** Lookup seguro em um mapa de steps com suporte a ambos formatos */
export function safeGetStep<T extends Record<string, any>>(map: T, id: string) {
    for (const variant of stepIdVariants(id)) {
        if (variant in map) return map[variant];
    }
    return undefined;
}

/** Avança baseado em uma lista (STEP_ORDER) tolerando formatos mistos */
export function getNextFromOrder(order: string[], current: string): string {
    const paddedOrder = order.map(normalizeStepId);
    const idx = paddedOrder.indexOf(normalizeStepId(current));
    return paddedOrder[idx + 1] || paddedOrder[idx] || 'step-01';
}

export function getPreviousFromOrder(order: string[], current: string): string {
    const paddedOrder = order.map(normalizeStepId);
    const idx = paddedOrder.indexOf(normalizeStepId(current));
    return idx > 0 ? paddedOrder[idx - 1] : paddedOrder[0];
}

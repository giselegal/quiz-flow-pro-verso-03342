// 🔁 Step Mapping Utilities
// Fonte única para conversão step<number> <-> step-<number>

export function toStepKey(stepNumber: number): string {
    if (!Number.isFinite(stepNumber) || stepNumber < 1) return 'step-1';
    return `step-${Math.floor(stepNumber)}`;
}

export function toStepNumber(stepKey: string | number | null | undefined): number {
    if (typeof stepKey === 'number') return stepKey >= 1 ? stepKey : 1;
    if (!stepKey || typeof stepKey !== 'string') return 1;
    const match = stepKey.match(/^step-(\d{1,3})$/i);
    if (!match) return 1;
    const n = parseInt(match[1], 10);
    return n >= 1 ? n : 1;
}

export function normalizeStep(step: string | number): { key: string; number: number } {
    const number = toStepNumber(step);
    return { number, key: toStepKey(number) };
}

export function isValidStepKey(stepKey: string, max: number = 100): boolean {
    const n = toStepNumber(stepKey);
    return n >= 1 && n <= max && toStepKey(n) === stepKey;
}

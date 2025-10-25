// Configuração centralizada do total de etapas do quiz
// Fonte: variável de ambiente ou fallback seguro

export function getTotalSteps(): number {
    const envVal = (import.meta as any)?.env?.VITE_TOTAL_STEPS;
    const n = Number(envVal);
    if (Number.isFinite(n) && n > 0) return Math.floor(n);
    // Fallback atual: 20 etapas ativas (v3)
    return 20;
}

export const TOTAL_STEPS = getTotalSteps();

export function isValidStep(step: number): boolean {
    return Number.isFinite(step) && step >= 1 && step <= TOTAL_STEPS;
}

/**
 * Utilidades para conversão de identificadores de etapas.
 */

/** Converte 'step-01' | 'step-1' em índice numérico 1. Defaults to 1 se inválido. */
export const stepIdToIndex = (stepId: string): number => {
  const m = String(stepId).trim().match(/^step-(\d{1,2})$/);
  if (!m) return 1;
  return parseInt(m[1], 10);
};

/** Converte índice numérico em id padronizado 'step-01'. */
export const stepIndexToId = (index: number): string => {
  const safe = Number.isFinite(index) && index > 0 ? index : 1;
  return `step-${safe.toString().padStart(2, '0')}`;
};

/** Normaliza possíveis formatos ('step-1', 'step-01', 1) para id 'step-01'. */
export const normalizeStepIdentifier = (value: string | number): string => {
  if (typeof value === 'number') return stepIndexToId(value);
  const idx = stepIdToIndex(value);
  return stepIndexToId(idx);
};


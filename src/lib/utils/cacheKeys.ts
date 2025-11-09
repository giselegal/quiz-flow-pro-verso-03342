/**
 * 🔑 Cache Keys Helpers
 * Padroniza as chaves de cache e normaliza stepIds (step-1 → step-01)
 */

export const normalizeStepId = (id: string): string => {
  const m = String(id).match(/^step-(\d{1,2})$/);
  if (m) {
    return `step-${parseInt(m[1], 10).toString().padStart(2, '0')}`;
  }
  return id;
};

export const masterTemplateKey = (): string => 'master:quiz21-complete.json';

export const stepBlocksKey = (stepId: string): string => {
  const n = normalizeStepId(stepId);
  return `step:${n}:blocks`;
};

export const masterBlocksKey = (stepId: string): string => {
  const n = normalizeStepId(stepId);
  return `masterBlocks:${n}`;
};

export const templateKey = (stepId: string): string => {
  const n = normalizeStepId(stepId);
  return `template:${n}`;
};

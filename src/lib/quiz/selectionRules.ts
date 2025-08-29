// Regras centralizadas de validação de seleções no quiz/editor
// Mantém as mesmas faixas usadas anteriormente e permite futura configuração

const normalizeStepNumber = (step: unknown): number | null => {
  if (typeof step === 'number' && Number.isFinite(step)) return step;
  if (typeof step === 'string') {
    const digits = parseInt(step.replace(/\D/g, ''), 10);
    return Number.isFinite(digits) ? digits : null;
  }
  return null;
};

export const isFiniteStep = (step: unknown): step is number => normalizeStepNumber(step) !== null;

export const isScoringPhase = (step: unknown): boolean => {
  const n = normalizeStepNumber(step);
  return n !== null && n >= 2 && n <= 11; // 3 obrigatórias
};

export const isStrategicPhase = (step: unknown): boolean => {
  const n = normalizeStepNumber(step);
  return n !== null && n >= 13 && n <= 18; // 1 obrigatória
};

export interface SelectionConfig {
  requiredSelections?: number;
  minSelections?: number;
}

export interface SelectionValidityResult {
  effectiveRequiredSelections: number;
  isValid: boolean;
}

export function getEffectiveRequiredSelections(
  step: unknown,
  config: SelectionConfig
): number {
  if (isScoringPhase(step)) return 3;
  if (isStrategicPhase(step)) return 1;
  const { requiredSelections, minSelections } = config || {};
  return requiredSelections || minSelections || 1;
}

export function computeSelectionValidity(
  step: unknown,
  selectionCount: number,
  config: SelectionConfig
): SelectionValidityResult {
  const effectiveRequiredSelections = getEffectiveRequiredSelections(step, config);
  return {
    effectiveRequiredSelections,
    isValid: selectionCount >= effectiveRequiredSelections,
  };
}

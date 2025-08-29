// Regras centralizadas de validação de seleções no quiz/editor
// Mantém as mesmas faixas usadas anteriormente e permite futura configuração

export const isFiniteStep = (step: unknown): step is number =>
  typeof step === 'number' && Number.isFinite(step);

export const isScoringPhase = (step: unknown): boolean =>
  isFiniteStep(step as number) && (step as number) >= 2 && (step as number) <= 11; // 3 obrigatórias

export const isStrategicPhase = (step: unknown): boolean =>
  isFiniteStep(step as number) && (step as number) >= 13 && (step as number) <= 18; // 1 obrigatória

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

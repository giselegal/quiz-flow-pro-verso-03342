import { computeSelectionValidity, getEffectiveRequiredSelections, isScoringPhase, isStrategicPhase } from '@/lib/quiz/selectionRules';

export const FlowCore = {
  // Mapeia etapa (2–11) → ids esperados pelo motor (q1..q10)
  mapStepToQuestionId(stepNum: number): string | null {
    if (stepNum >= 2 && stepNum <= 11) return `q${stepNum - 1}`;
    return null;
  },

  // Centraliza decisão de auto-avançar considerando configs do bloco e da etapa
  shouldAutoAdvance(
    params: {
      isValid: boolean;
      stepConfig?: { autoAdvanceOnComplete?: boolean; autoAdvanceDelay?: number } | undefined;
      blockConfig?: { autoAdvanceOnComplete?: boolean; autoAdvanceDelay?: number } | undefined;
    }
  ): { proceed: boolean; delay: number } {
    const { isValid, stepConfig, blockConfig } = params;
    const enabled = (blockConfig?.autoAdvanceOnComplete ?? stepConfig?.autoAdvanceOnComplete) ?? false;
    const delay = (blockConfig?.autoAdvanceDelay ?? stepConfig?.autoAdvanceDelay) ?? 1500;
    return { proceed: !!isValid && !!enabled, delay };
  },
};

export const SelectionRules = {
  computeSelectionValidity,
  getEffectiveRequiredSelections,
  isScoringPhase,
  isStrategicPhase,
};

// Compat shim para quizStepsComplete (Fase 0)
// Exporta estrutura mínima para funções esperadas: default quizSteps, normalizeStepBlocks, getBlocksForStep

import type { Block } from '@/types/editor';

const quizSteps: Record<string, { blocks: Block[] }> = {
  'step-01': { blocks: [] },
  'step-02': { blocks: [] },
  'step-03': { blocks: [] },
  'step-04': { blocks: [] },
  'step-05': { blocks: [] },
  'step-06': { blocks: [] },
  'step-07': { blocks: [] },
  'step-08': { blocks: [] },
  'step-09': { blocks: [] },
  'step-10': { blocks: [] },
  'step-11': { blocks: [] },
  'step-12': { blocks: [] },
  'step-13': { blocks: [] },
  'step-14': { blocks: [] },
  'step-15': { blocks: [] },
  'step-16': { blocks: [] },
  'step-17': { blocks: [] },
  'step-18': { blocks: [] },
  'step-19': { blocks: [] },
  'step-20': { blocks: [] },
  'step-21': { blocks: [] },
};

export function normalizeStepBlocks(blocks: Block[] = []): Block[] {
  return Array.isArray(blocks) ? blocks : [];
}

// Aceita (stepId) ou (stepNumber, stepBlocksMap) conforme chamadas legadas
export function getBlocksForStep(step: string | number, stepBlocksMap?: Record<string, Block[]>): Block[] {
  const stepKey = typeof step === 'number' ? `step-${String(step).padStart(2, '0')}` : step;
  if (stepBlocksMap && typeof stepBlocksMap === 'object') {
    const fromMap = stepBlocksMap[stepKey];
    return normalizeStepBlocks(fromMap || []);
  }
  const entry = quizSteps[stepKey];
  return normalizeStepBlocks(entry?.blocks || []);
}

export default quizSteps;
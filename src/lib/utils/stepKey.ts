// Utilitários padronizados para trabalhar com chaves de etapas ("step-<n>")
// Mantém compatibilidade com a normalização já existente em quizStepsComplete.ts

import quizSteps, { normalizeStepBlocks } from '@/config/quizStepsComplete';
const parseStepKeyInternal = (quizSteps as any).parseStepKey as (
  k: string | number
) => number | null;

/**
 * Constrói a chave canônica da etapa.
 * Aceita números ou strings como "1", "01", "step-1", "step-01".
 */
export function makeStepKey(step: number | string): string {
  if (typeof step === 'number') return `step-${Math.max(1, Math.floor(step))}`;
  const parsed = parseStepKeyInternal(step);
  if (parsed && Number.isFinite(parsed)) return `step-${parsed}`;
  // Fallback básico: extrai dígitos e tenta converter
  const m = String(step).match(/(\d{1,2})/);
  const n = m ? parseInt(m[1], 10) : NaN;
  return Number.isFinite(n) ? `step-${n}` : 'step-1';
}

/**
 * Extrai o número da etapa a partir de uma chave ou string/number solto.
 * Retorna NaN se não conseguir inferir.
 */
export function getStepNumberFromKey(key: string | number): number {
  if (typeof key === 'number') return Math.max(1, Math.floor(key));
  const parsed = parseStepKeyInternal(key);
  if (parsed && Number.isFinite(parsed)) return parsed;
  const m = String(key).match(/(\d{1,2})/);
  const n = m ? parseInt(m[1], 10) : NaN;
  return Number.isFinite(n) ? n : Number.NaN;
}

/**
 * Normaliza um mapa de stepBlocks para apenas chaves canônicas "step-<n>".
 * Wrapper fino sobre normalizeStepBlocks já existente.
 */
export function normalizeStepBlocksMap(raw?: Record<string | number, unknown> | null) {
  return normalizeStepBlocks(raw as any);
}

// Reexporta a função de parsing canônica para usos avançados
export { parseStepKeyInternal as parseStepKey };

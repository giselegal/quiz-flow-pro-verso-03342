// Utilitários padronizados para trabalhar com chaves de etapas ("step-<n>")

import type { Block } from '@/types/editor';

// Tipos para compatibilidade
export type EditorBlock = Block;
export type RawStepBlocks = Record<string | number, unknown>;
export type StepBlocks = Record<string, Block[]>;

/**
 * Extrai o número de uma chave de step.
 * Aceita: "step-1", "step-01", "1", 1, etc.
 */
function parseStepKeyInternal(key: string | number): number | null {
  if (typeof key === 'number') {
    return Number.isFinite(key) ? Math.floor(key) : null;
  }
  // Tenta extrair número de formatos como "step-1", "step-01", "1", "01"
  const match = String(key).match(/(\d{1,2})/);
  if (match) {
    const num = parseInt(match[1], 10);
    return Number.isFinite(num) ? num : null;
  }
  return null;
}

/**
 * Gera chaves candidatas para um step.
 */
export function candidateKeysForStep(step: number | string): Array<string | number> {
  const n = typeof step === 'number' ? step : parseInt(String(step), 10);
  const keys: Array<string | number> = [];
  if (!Number.isFinite(n) || Number.isNaN(n)) {
    keys.push(String(step));
    return keys;
  }
  keys.push(`step-${n}`);
  keys.push(`step${n}`);
  keys.push(String(n));
  keys.push(n);
  return keys;
}

/**
 * Obtém blocos para um step específico de um mapa de stepBlocks.
 */
export function getBlocksForStep(step: number | string, stepBlocks?: RawStepBlocks | null): Block[] | undefined {
  if (!stepBlocks) return undefined;

  const candidates = candidateKeysForStep(step);

  for (const key of candidates) {
    const raw = (stepBlocks as Record<string, unknown>)[String(key)];
    if (!raw) continue;

    if (Array.isArray(raw)) {
      return raw as Block[];
    }
  }

  return undefined;
}

/**
 * Normaliza um mapa de blocos por step para chaves canônicas "step-N".
 */
export function normalizeStepBlocks(
  raw?: Record<string | number, Block[]> | null
): Record<string, Block[]> {
  if (!raw) return {};
  
  const normalized: Record<string, Block[]> = {};
  
  for (const [key, blocks] of Object.entries(raw)) {
    const stepNum = parseStepKeyInternal(key);
    if (stepNum !== null && Array.isArray(blocks)) {
      const canonicalKey = `step-${stepNum}`;
      normalized[canonicalKey] = blocks;
    }
  }
  
  return normalized;
}

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
 */
export function normalizeStepBlocksMap(raw?: Record<string | number, unknown> | null) {
  return normalizeStepBlocks(raw as Record<string | number, Block[]>);
}

// Exporta a função de parsing canônica para usos avançados
export { parseStepKeyInternal as parseStepKey };

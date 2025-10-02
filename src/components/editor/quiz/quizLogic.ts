import { QUIZ_STEPS, type QuizStep } from '@/data/quizSteps';

export interface ComputeResultOutput {
  primary?: string;
  secondary: string[];
  scores: Record<string, { total: number; steps: Set<string>; firstIndex: number }>;
}

// Extrai multiplicador de questionNumber estilo "3 de 7 (x2)" ou "(x3)"
function extractMultiplier(questionNumber?: string): number {
  if (!questionNumber) return 1;
  const m = questionNumber.match(/x(\d+)/i);
  if (!m) return 1;
  const val = parseInt(m[1]!, 10);
  return Number.isFinite(val) && val > 0 ? val : 1;
}

/**
 * Cálculo avançado de resultado.
 * steps: lista de steps (question) com suas opções escolhidas em answers.
 * answers: mapping stepId -> array de optionIds selecionadas.
 */
export function computeResultAdvanced(steps: QuizStep[], answers: Record<string, string[]>): ComputeResultOutput {
  const score: Record<string, { total: number; steps: Set<string>; firstIndex: number }> = {};
  let globalIndex = 0;
  for (const st of steps) {
    if (st.type !== 'question') continue;
    const selected = answers[st.id] || [];
    if (!selected.length) continue;
    const multiplier = extractMultiplier((st as any).questionNumber);
    for (const optId of selected) {
      if (!score[optId]) score[optId] = { total: 0, steps: new Set(), firstIndex: globalIndex };
      score[optId].total += 1 * multiplier;
      score[optId].steps.add(st.id);
      globalIndex++;
    }
  }
  const entries = Object.entries(score);
  if (!entries.length) {
    return { primary: undefined, secondary: [], scores: score };
  }
  entries.sort((a, b) => {
    const A = a[1];
    const B = b[1];
    if (B.total !== A.total) return B.total - A.total; // maior pontuação
    if (B.steps.size !== A.steps.size) return B.steps.size - A.steps.size; // maior diversidade
    return A.firstIndex - B.firstIndex; // ordem de aparição
  });
  return { primary: entries[0][0], secondary: entries.slice(1, 4).map(e => e[0]), scores: score };
}

/** Seleciona oferta com base em estilos calculados e respostas estratégicas */
export function selectOfferCandidate(offerMap: Record<string, any> | undefined, primary?: string, secondary: string[] = [], strategicAnswers?: Record<string, string>): any | null {
  if (!offerMap || Object.keys(offerMap).length === 0) return null;
  const candidateKeys = [primary, ...secondary].filter(Boolean) as string[];
  for (const k of candidateKeys) {
    if (k && offerMap[k]) return offerMap[k];
  }
  if (strategicAnswers) {
    const finalKey = Object.values(strategicAnswers).slice(-1)[0];
    if (finalKey && offerMap[finalKey]) return offerMap[finalKey];
  }
  return Object.values(offerMap)[0] || null;
}

// ===== Ciclo =====
export interface CycleReport { hasCycle: boolean; path: string[]; cycles: string[][] }
export function detectCycle(steps: { id: string; nextStep?: string | null }[]): CycleReport {
  const idMap = new Map(steps.map(s => [s.id, s] as const));
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const cycles: string[][] = [];
  const pathStack: string[] = [];
  function dfs(id: string): boolean {
    if (visiting.has(id)) {
      const idx = pathStack.indexOf(id);
      if (idx !== -1) cycles.push(pathStack.slice(idx).concat(id));
      return true;
    }
    if (visited.has(id)) return false;
    visiting.add(id); pathStack.push(id);
    const step = idMap.get(id);
    if (step?.nextStep && idMap.has(step.nextStep)) {
      if (dfs(step.nextStep)) { visiting.delete(id); pathStack.pop(); visited.add(id); return true; }
    }
    visiting.delete(id); pathStack.pop(); visited.add(id); return false;
  }
  for (const s of steps) if (!visited.has(s.id)) dfs(s.id);
  return { hasCycle: cycles.length > 0, path: cycles[0] || [], cycles };
}

// ===== Persistência (facilita testes) =====
export function persistResultPayload(userName: string, primary?: string, secondary?: string[]) {
  try {
    const payload = {
      userName,
      primaryStyle: primary,
      secondaryStyles: secondary,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('quizResultPayload', JSON.stringify(payload));
    return true;
  } catch {
    return false;
  }
}

export function persistOffer(offer: any) {
  try {
    localStorage.setItem('quizSelectedOffer', JSON.stringify(offer));
    return true;
  } catch {
    return false;
  }
}

// Util para obter steps default (pode ser usado em testes de integração simples)
export function getDefaultSteps(): QuizStep[] {
  return Object.entries(QUIZ_STEPS).map(([id, st]) => ({ id, ...st })) as any;
}

export default {
  computeResultAdvanced,
  selectOfferCandidate,
  detectCycle,
  persistResultPayload,
  persistOffer,
  getDefaultSteps
};
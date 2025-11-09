import type { QuizStepV3 as QuizStep } from '@/types/quiz';
import { toUnaccentedStyleId } from '@/lib/utils/styleIds';

export interface ScoringRules {
  speedBonusThreshold?: number; // em segundos
  speedBonusPoints?: number;    // pontos extras por step rápido
  streakMultiplier?: number;    // multiplicador aplicado sobre o bônus quando em streak
  completionBonus?: number;     // pontos extras ao concluir
  penaltyForSkip?: number;      // penalidade por step pulado
}

export interface Telemetry {
  durations?: Record<string, number>; // stepId -> duração em segundos
  skipped?: Record<string, boolean>;  // stepId -> pulado
  completed?: Record<string, boolean>; // stepId -> concluído
}

export interface ApplyBonusesInput {
  baseScores: Record<string, number>;
  answers: Record<string, string[]>;
  steps: Record<string, QuizStep>;
  rules?: ScoringRules;
  telemetry?: Telemetry;
}

export interface ApplyBonusesOutput {
  scores: Record<string, number>;
  orderedStyleIds: string[];
}

/**
 * Aplica regras globais de pontuação sobre os scores base.
 * Estratégia:
 * - speedBonus: distribui pontos extras para os estilos selecionados no step rápido
 *   (divide igualmente entre as seleções do step).
 * - streakMultiplier: multiplica somente o bônus de speed quando o step atual e o anterior
 *   forem rápidos (streak simples de consecutivos).
 * - completionBonus: credita no estilo primário atual (após speed/penalties) — decisão pragmática.
 * - penaltyForSkip: subtrai do estilo primário quando step marcado como pulado.
 */
export function applyRuntimeBonuses({ baseScores, answers, steps, rules, telemetry }: ApplyBonusesInput): ApplyBonusesOutput {
  const out: Record<string, number> = { ...baseScores };
  const r = rules || {};
  const t = telemetry || {};

  const isFast = (stepId: string): boolean => {
    const thr = (r.speedBonusThreshold ?? 0);
    if (!thr) return false;
    const d = t.durations?.[stepId];
    if (typeof d !== 'number' || d <= 0) return false;
    return d < thr;
  };

  // Processar em ordem de step-01 .. step-21 se disponível
  const stepIds = Object.keys(steps).sort();
  let prevFast = false;

  for (const stepId of stepIds) {
    const step = steps[stepId];
    if (!step || step.type !== 'question') continue;

    const selections = answers[stepId];
    const hasSelections = Array.isArray(selections) && selections.length > 0;

    // Penalty por SKIP explícito
    if (t.skipped?.[stepId] && (r.penaltyForSkip ?? 0) > 0) {
      // aplica no estilo mais forte atual
      const primary = getPrimary(out);
      out[primary] = Math.max(0, out[primary] - (r.penaltyForSkip as number));
    }

    // Speed bonus
    if (hasSelections && isFast(stepId) && (r.speedBonusPoints ?? 0) > 0) {
      const baseBonus = (r.speedBonusPoints as number);
      const bonus = prevFast && (r.streakMultiplier ?? 0) > 0
        ? baseBonus * (r.streakMultiplier as number)
        : baseBonus;

      const perSelection = bonus / selections.length;
      for (const raw of selections) {
        const style = toUnaccentedStyleId(raw);
        if (typeof out[style] !== 'number') continue;
        out[style] += perSelection;
      }
      prevFast = true;
    } else {
      prevFast = false;
    }
  }

  // Completion bonus — se todos os steps de question com respostas
  if ((r.completionBonus ?? 0) > 0) {
    const allQuestionSteps = stepIds.filter(id => steps[id]?.type === 'question');
    const allAnswered = allQuestionSteps.every(id => Array.isArray(answers[id]) && answers[id]!.length > 0);
    if (allAnswered) {
      const primary = getPrimary(out);
      out[primary] += (r.completionBonus as number);
    }
  }

  const ordered = Object.keys(out).sort((a, b) => out[b] - out[a] || a.localeCompare(b, 'pt-BR'));
  return { scores: out, orderedStyleIds: ordered };
}

function getPrimary(scores: Record<string, number>): string {
  return Object.keys(scores).sort((a, b) => scores[b] - scores[a] || a.localeCompare(b, 'pt-BR'))[0];
}

export default applyRuntimeBonuses;

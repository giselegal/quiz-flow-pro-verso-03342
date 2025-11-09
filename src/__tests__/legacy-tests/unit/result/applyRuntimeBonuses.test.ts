import { describe, it, expect } from 'vitest';
import { applyRuntimeBonuses } from '@/lib/utils/result/applyRuntimeBonuses';

describe('applyRuntimeBonuses', () => {
  const steps = {
    'step-02': { id: 'step-02', type: 'question', options: [{ id: 'natural', text: 'N' }, { id: 'classico', text: 'C' }] },
    'step-03': { id: 'step-03', type: 'question', options: [{ id: 'natural', text: 'N' }] },
  } as any;

  it('aplica speed bonus quando duração < threshold', () => {
    const baseScores = { natural: 1, classico: 0, contemporaneo: 0, elegante: 0, romantico: 0, sexy: 0, dramatico: 0, criativo: 0 };
    const answers = { 'step-02': ['natural', 'classico'] } as Record<string, string[]>;
    const rules = { speedBonusThreshold: 10, speedBonusPoints: 2 };
    const telemetry = { durations: { 'step-02': 5 } };
    const out = applyRuntimeBonuses({ baseScores, answers, steps, rules, telemetry });
    // 2 pontos extras divididos entre 2 seleções: +1 em cada estilo
    expect(out.scores.natural).toBeCloseTo(2);
    expect(out.scores.classico).toBeCloseTo(1);
  });

  it('aplica streakMultiplier ao bônus de speed quando consecutivo', () => {
    const baseScores = { natural: 1, classico: 1, contemporaneo: 0, elegante: 0, romantico: 0, sexy: 0, dramatico: 0, criativo: 0 };
    const answers = { 'step-02': ['natural'], 'step-03': ['natural'] } as Record<string, string[]>;
    const rules = { speedBonusThreshold: 10, speedBonusPoints: 2, streakMultiplier: 1.5 };
    const telemetry = { durations: { 'step-02': 5, 'step-03': 3 } };
    const out = applyRuntimeBonuses({ baseScores, answers, steps, rules, telemetry });
    // step-02: +2 para natural; step-03 (streak): +3 para natural
    expect(out.scores.natural).toBeCloseTo(1 + 2 + 3);
  });

  it('aplica completionBonus ao estilo primário quando todas perguntas respondidas', () => {
    const baseScores = { natural: 3, classico: 1, contemporaneo: 0, elegante: 0, romantico: 0, sexy: 0, dramatico: 0, criativo: 0 };
    const answers = { 'step-02': ['natural'], 'step-03': ['natural'] } as Record<string, string[]>;
    const rules = { completionBonus: 5 };
    const telemetry = { durations: {} };
    const out = applyRuntimeBonuses({ baseScores, answers, steps, rules, telemetry });
    expect(out.scores.natural).toBeCloseTo(8);
  });

  it('aplica penaltyForSkip no estilo primário atual', () => {
    const baseScores = { natural: 5, classico: 1, contemporaneo: 0, elegante: 0, romantico: 0, sexy: 0, dramatico: 0, criativo: 0 };
    const answers = { 'step-02': ['classico'] } as Record<string, string[]>;
    const rules = { penaltyForSkip: 2 };
    const telemetry = { durations: {}, skipped: { 'step-03': true } };
    const out = applyRuntimeBonuses({ baseScores, answers, steps, rules, telemetry });
    expect(out.scores.natural).toBeCloseTo(3);
  });
});

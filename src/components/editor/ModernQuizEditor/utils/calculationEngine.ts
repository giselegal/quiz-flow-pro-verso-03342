import { z } from 'zod';
import type { QuizSchema } from '@/schemas/quiz-schema.zod';

export const AnswerSchema = z.object({
  blockId: z.string(),
  value: z.any(),
});
export type Answer = z.infer<typeof AnswerSchema>;

export const RuleSchema = z.object({
  weight: z.number().default(1),
  // mapping of option value -> points (for options blocks)
  pointsMap: z.record(z.string(), z.number()).optional(),
  // numeric scaling: multiply value and clamp
  numericScale: z.object({ mul: z.number().default(1), min: z.number().optional(), max: z.number().optional() }).optional(),
});
export type Rule = z.infer<typeof RuleSchema>;

export const CalculationConfigSchema = z.object({
  categoryThresholds: z.array(z.object({ label: z.string(), min: z.number(), max: z.number() })).default([]),
});
export type CalculationConfig = z.infer<typeof CalculationConfigSchema>;

export const ResultSchema = z.object({
  totalScore: z.number(),
  category: z.string().optional(),
  byStep: z.array(z.object({ stepId: z.string(), score: z.number() })).default([]),
});
export type Result = z.infer<typeof ResultSchema>;

export function computeStepScore(step: any, answers: Answer[], rules: Record<string, Rule>): number {
  const blocks: any[] = step?.blocks || [];
  let score = 0;
  for (const b of blocks) {
    const ans = answers.find(a => a.blockId === b.id);
    if (!ans) continue;
    const rule = rules[b.id] || { weight: 1 };
    let local = 0;
    if (Array.isArray(b.properties?.options) && typeof ans.value === 'string') {
      const pm = rule.pointsMap || {};
      local = pm[ans.value] ?? 0;
    } else if (typeof ans.value === 'number') {
      const ns = rule.numericScale;
      local = ns ? ans.value * (ns.mul ?? 1) : ans.value;
      if (ns?.min !== undefined) local = Math.max(local, ns.min!);
      if (ns?.max !== undefined) local = Math.min(local, ns.max!);
    }
    score += local * (rule.weight ?? 1);
  }
  return score;
}

export function computeQuizResult(quiz: QuizSchema, answers: Answer[], rules: Record<string, Rule>, config?: CalculationConfig): Result {
  const byStep = (quiz.steps || []).map((s: any) => ({ stepId: s.id, score: computeStepScore(s, answers, rules) }));
  const totalScore = byStep.reduce((acc, s) => acc + s.score, 0);
  let category: string | undefined;
  const thresholds = config?.categoryThresholds || [];
  for (const t of thresholds) {
    if (totalScore >= t.min && totalScore <= t.max) {
      category = t.label;
      break;
    }
  }
  return { totalScore, category, byStep };
}

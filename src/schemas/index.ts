// src/schemas/index.ts
import { z } from 'zod';
import { IntroStepSchema } from './intro.schema';
import { QuestionStepSchema } from './question.schema';
import { StrategicQuestionStepSchema } from './strategicQuestion.schema';
import { TransitionStepSchema } from './transition.schema';
import { ResultStepSchema } from './result.schema';
import { OfferStepSchema } from './offer.schema';

export const SCHEMAS: Record<string, z.ZodTypeAny> = {
  intro: IntroStepSchema,
  question: QuestionStepSchema,
  'strategic-question': StrategicQuestionStepSchema,
  transition: TransitionStepSchema,
  'transition-result': TransitionStepSchema,
  result: ResultStepSchema,
  offer: OfferStepSchema,
};

// Versão global atual dos schemas (mantida como número para integração simples)
export const LATEST_SCHEMA_VERSION = 1;

// migrações futuras por tipo e versão
const MIGRATIONS: Record<string, Record<number, (p: any) => any>> = {
  question: { 1: (p: any) => p },
  intro: { 1: (p: any) => p },
  'strategic-question': { 1: (p: any) => p },
  transition: { 1: (p: any) => p },
  'transition-result': { 1: (p: any) => p },
  result: { 1: (p: any) => p },
  offer: { 1: (p: any) => p },
};

export function migrateProps(type: string, props: any) {
  const current = Number(props?.schemaVersion || 1);
  // Em cenário real, 'latest' poderia variar por tipo; por ora mantemos global = 1
  const latest = Math.max(1, LATEST_SCHEMA_VERSION);
  let next = { ...(props || {}) };
  for (let v = current + 1; v <= latest; v++) {
    const fn = MIGRATIONS[type]?.[v];
    if (typeof fn === 'function') next = fn(next);
  }
  next.schemaVersion = latest;
  return next;
}

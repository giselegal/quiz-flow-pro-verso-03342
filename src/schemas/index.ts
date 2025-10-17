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

export const LATEST_SCHEMA_VERSION: Record<string, number> = {
  intro: 1,
  question: 1,
  'strategic-question': 1,
  transition: 1,
  'transition-result': 1,
  result: 1,
  offer: 1,
};

// migrações futuras por tipo e versão
const MIGRATIONS: Record<string, Record<number, (p: any) => any>> = {
  question: {},
  intro: {},
  'strategic-question': {},
  transition: {},
  'transition-result': {},
  result: {},
  offer: {},
};

export function migrateProps(type: string, props: any) {
  const current = Number(props?.schemaVersion || 1);
  const latest = LATEST_SCHEMA_VERSION[type] || current;
  let next = { ...props };
  for (let v = current + 1; v <= latest; v++) {
    const fn = MIGRATIONS[type]?.[v];
    if (fn) next = fn(next);
  }
  next.schemaVersion = latest;
  return next;
}

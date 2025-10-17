// src/schemas/index.ts
import { z } from 'zod';

export const TransitionSchema = z.object({
  title: z.string().optional().default('Quase lá'),
  text: z.string().optional().default(''),
  showContinueButton: z.boolean().default(true),
  continueButtonText: z.string().optional().default('Continuar'),
  allowHtml: z.boolean().optional().default(false),
});

export const ResultSchema = z.object({
  titleTemplate: z.string().optional().default('Seu resultado'),
  primaryStyleId: z.string().optional().nullable(),
  showPrimaryStyleCard: z.boolean().optional().default(true),
  showSecondaryStyles: z.boolean().optional().default(false),
  secondaryStylesCount: z.number().int().min(0).max(4).optional().default(2),
  offersToShow: z.array(z.string()).optional().default([]),
});

export const OfferEntrySchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  description: z.string().optional().default(''),
  price: z.number().nullable().optional(),
  currency: z.string().optional().default('BRL'),
  image: z.string().url().nullable().optional(),
  ctaLabel: z.string().optional().default('Aproveitar'),
  ctaUrl: z.string().url().nullable().optional(),
  metadata: z.record(z.any()).optional().default({}),
});

export const OfferSchema = z.object({
  offerMap: z.record(z.string(), OfferEntrySchema).default({}),
});

export const QuestionSchema = z.object({
  question: z.string().min(1),
  options: z.array(z.object({
    id: z.string().optional(),
    label: z.string().optional(),
    text: z.string().optional(),
    value: z.string().optional(),
    points: z.number().optional(),
    image: z.string().optional().nullable(),
  })).min(2),
  multiSelect: z.boolean().optional(),
  requiredSelections: z.number().optional(),
  maxSelections: z.number().optional(),
  autoAdvance: z.boolean().optional(),
  showNextButton: z.boolean().optional(),
  nextButtonText: z.string().optional(),
  showImages: z.boolean().optional(),
  layout: z.enum(['auto','grid','list']).optional(),
});

export const IntroSchema = z.object({
  title: z.string().min(1).default('Bem-vindo'),
  subtitle: z.string().optional(),
  cta: z.string().optional().default('Começar'),
  logoUrl: z.string().url().optional(),
  backgroundImage: z.string().url().optional(),
  layout: z.enum(['centered','left','right']).optional().default('centered'),
});

export const SCHEMAS: Record<string, any> = {
  intro: IntroSchema,
  question: QuestionSchema,
  'strategic-question': QuestionSchema,
  transition: TransitionSchema,
  'transition-result': TransitionSchema,
  result: ResultSchema,
  offer: OfferSchema,
};

export const LATEST_SCHEMA_VERSION = 1;

export function migrateProps(type: string, props: any) {
  // Placeholder de migração; manter compatibilidade futura
  return props;
}

export type SchemaMap = typeof SCHEMAS;
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

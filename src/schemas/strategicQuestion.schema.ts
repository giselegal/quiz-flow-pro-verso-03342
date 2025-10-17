// src/schemas/strategicQuestion.schema.ts
import { z } from 'zod';
import { OptionSchema } from './option';

export const StrategicQuestionStepSchema = z.object({
  schemaVersion: z.number().int().default(1),
  question: z.string().min(1),
  allowSkip: z.boolean().optional().default(false),
  categoryMapping: z.record(z.string()).optional().default({}),
  options: z.array(OptionSchema).min(1),
});

export type StrategicQuestionStepProps = z.infer<typeof StrategicQuestionStepSchema>;

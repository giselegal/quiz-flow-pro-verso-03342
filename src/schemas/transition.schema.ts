// src/schemas/transition.schema.ts
import { z } from 'zod';

export const TransitionStepSchema = z.object({
  schemaVersion: z.number().int().default(1),
  title: z.string().optional().default('Quase lá'),
  text: z.string().optional().default(''),
  showContinueButton: z.boolean().optional().default(true),
  continueButtonText: z.string().optional().default('Continuar'),
  allowHtml: z.boolean().optional().default(false),
});

export type TransitionStepProps = z.infer<typeof TransitionStepSchema>;

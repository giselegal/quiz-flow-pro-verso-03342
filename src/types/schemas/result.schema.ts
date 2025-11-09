// src/schemas/result.schema.ts
import { z } from 'zod';

export const ResultStepSchema = z.object({
  schemaVersion: z.number().int().default(1),
  titleTemplate: z.string().optional().default('Seu resultado: {{resultStyle}}'),
  subtitleTemplate: z.string().optional().default('Veja os detalhes abaixo'),
  showPrimaryStyleCard: z.boolean().optional().default(true),
  primaryStyleId: z.string().optional().nullable(),
  showSecondaryStyles: z.boolean().optional().default(true),
  secondaryStylesCount: z.number().int().min(0).max(5).default(2),
  offersToShow: z.array(z.string()).optional().default([]),
});

export type ResultStepProps = z.infer<typeof ResultStepSchema>;

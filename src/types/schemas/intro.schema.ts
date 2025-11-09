// src/schemas/intro.schema.ts
import { z } from 'zod';

export const IntroStepSchema = z.object({
  schemaVersion: z.number().int().default(1),
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional().default(''),
  logoUrl: z.string().url().nullable().optional().default(null),
  backgroundImage: z.string().url().nullable().optional().default(null),
  cta: z.string().optional().default('Começar'),
  showProgress: z.boolean().optional().default(true),
  layout: z.enum(['centered', 'split', 'cover']).default('centered'),
  styles: z
    .object({
      titleSize: z.string().optional().default('2xl'),
      subtitleSize: z.string().optional().default('base'),
      titleColor: z.string().optional().default('#432818'),
    })
    .optional()
    .default({}),
});

export type IntroStepProps = z.infer<typeof IntroStepSchema>;

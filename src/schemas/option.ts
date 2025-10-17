// src/schemas/option.ts
import { z } from 'zod';

export const OptionSchema = z
  .object({
    id: z.string().optional(),
    label: z.string().min(1, 'Label is required'),
    value: z.string().optional(),
    image: z.string().url().nullable().optional(),
    points: z.number().optional().default(0),
    metadata: z.record(z.any()).optional().default({}),
  })
  .transform((opt) => {
    return { ...opt };
  });

export type Option = z.infer<typeof OptionSchema>;

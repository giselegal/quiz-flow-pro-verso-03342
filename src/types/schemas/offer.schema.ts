// src/schemas/offer.schema.ts
import { z } from 'zod';

export const OfferEntrySchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  description: z.string().optional().default(''),
  price: z.number().nonnegative().optional().nullable(),
  currency: z.string().optional().default('BRL'),
  image: z.string().url().optional().nullable(),
  ctaLabel: z.string().optional().default('Aproveitar'),
  ctaUrl: z.string().url().optional().nullable(),
  metadata: z.record(z.any()).optional().default({}),
});

export const OfferStepSchema = z.object({
  schemaVersion: z.number().int().default(1),
  layout: z.enum(['single', 'carousel', 'grid']).default('single'),
  offerMap: z.record(OfferEntrySchema).optional().default({}),
  showPrice: z.boolean().optional().default(true),
  ctaBehavior: z.enum(['link', 'submitForm']).default('link'),
});

export type OfferStepProps = z.infer<typeof OfferStepSchema>;

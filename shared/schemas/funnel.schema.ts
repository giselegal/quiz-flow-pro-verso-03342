/**
 * Shared Funnel Schemas
 * Used by both frontend and backend for validation
 */

import { z } from 'zod';

// Step Schema
export const StepSchema = z.object({
  id: z.string().min(1, 'ID é obrigatório'),
  order: z.number().int().positive('Order deve ser positivo'),
  type: z.enum(['question', 'result', 'transition']).optional(),
  blocks: z.array(z.any()).optional(),
  nextStep: z.string().optional(),
});

// Funnel Settings Schema
export const FunnelSettingsSchema = z.object({
  theme: z.object({
    primaryColor: z.string().optional(),
    secondaryColor: z.string().optional(),
    fontFamily: z.string().optional(),
  }).optional(),
  analytics: z.object({
    enabled: z.boolean().optional(),
    trackingId: z.string().optional(),
    googleAnalyticsId: z.string().optional(),
    facebookPixelId: z.string().optional(),
  }).optional(),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    ogImage: z.string().url().optional(),
  }).optional(),
  advanced: z.object({
    customCss: z.string().optional(),
    customJs: z.string().optional(),
    redirectUrl: z.string().url().optional(),
  }).optional(),
});

// Funnel Schema
export const FunnelSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres').max(100, 'Nome muito longo'),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug inválido (apenas letras minúsculas, números e hífens)').optional(),
  description: z.string().max(500, 'Descrição muito longa').optional(),
  user_id: z.string().optional(),
  steps: z.array(StepSchema),
  settings: FunnelSettingsSchema.optional(),
  published: z.boolean().optional(),
  public_url: z.string().url().optional().nullable(),
  version: z.number().int().positive().optional(),
});

// Create Funnel Input Schema
export const CreateFunnelSchema = FunnelSchema.omit({
  id: true,
  version: true,
});

// Update Funnel Input Schema
export const UpdateFunnelSchema = FunnelSchema.partial().omit({
  id: true,
});

// Funnel Query Params Schema
export const FunnelQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  userId: z.string().optional(),
  published: z.coerce.boolean().optional(),
  include: z.string().optional(),
});

// Types
export type Step = z.infer<typeof StepSchema>;
export type FunnelSettings = z.infer<typeof FunnelSettingsSchema>;
export type Funnel = z.infer<typeof FunnelSchema>;
export type CreateFunnelInput = z.infer<typeof CreateFunnelSchema>;
export type UpdateFunnelInput = z.infer<typeof UpdateFunnelSchema>;
export type FunnelQuery = z.infer<typeof FunnelQuerySchema>;

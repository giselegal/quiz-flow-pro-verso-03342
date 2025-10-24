import { z } from 'zod';

// Schema básico e seguro para JSON v3.0
export const JSONv3SectionSchema = z.object({
  type: z.string().min(1),
  id: z.string().min(1),
  // Conteúdo canônico v3
  content: z.record(z.any()).optional().default({}),
  // Alias/variações comuns encontradas no projeto
  properties: z.record(z.any()).optional().default({}),
  props: z.record(z.any()).optional(),
  style: z.record(z.any()).optional(),
  animation: z.record(z.any()).optional(),
});

export const JSONv3NavigationSchema = z.object({
  nextStep: z.string().nullable(),
  prevStep: z.string().nullable().optional(),
  allowBack: z.boolean().optional(),
  requiresUserInput: z.boolean().optional(),
});

export const JSONv3MetadataSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  category: z.string().min(1),
  tags: z.array(z.string()).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  author: z.string().optional(),
});

export const JSONv3ThemeSchema = z.object({
  colors: z.record(z.string()).optional(),
  fonts: z.record(z.string()).optional(),
  spacing: z.record(z.number()).optional(),
  borderRadius: z.record(z.number()).optional(),
}).optional();

export const JSONv3TemplateSchema = z.object({
  templateVersion: z.string().min(1),
  // Alias legado para compatibilidade com consumidores antigos
  type: z.string().optional(),
  metadata: JSONv3MetadataSchema,
  theme: JSONv3ThemeSchema,
  sections: z.array(JSONv3SectionSchema).nonempty(),
  validation: z.record(z.any()).optional(),
  navigation: JSONv3NavigationSchema,
  analytics: z.object({
    events: z.array(z.string()).optional(),
    trackingId: z.string().optional(),
  }).optional(),
  // Campos adicionais para SEO/URLs/AB Test/Tracking (opcionais e retrocompatíveis)
  seo: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      keywords: z.array(z.string()).optional(),
      canonicalUrl: z.string().url().optional(),
      robots: z.string().optional(),
      openGraph: z.record(z.any()).optional(),
      twitter: z.record(z.any()).optional(),
    })
    .optional(),
  urls: z
    .object({
      base: z.string().url().optional(),
      salesPage: z.string().url().optional(),
      privacyPolicy: z.string().url().optional(),
      termsOfService: z.string().url().optional(),
    })
    .optional(),
  abTest: z
    .object({
      active: z.boolean().default(false).optional(),
      variant: z.enum(['A', 'B']).optional(),
      variants: z.record(z.any()).optional(),
      allocation: z
        .object({ A: z.number().min(0).max(100), B: z.number().min(0).max(100) })
        .optional(),
    })
    .optional(),
  tracking: z
    .object({
      facebookPixelId: z.string().optional(),
      googleTagId: z.string().optional(),
      utm: z
        .object({
          source: z.string().optional(),
          medium: z.string().optional(),
          campaign: z.string().optional(),
          term: z.string().optional(),
          content: z.string().optional(),
        })
        .optional(),
      events: z.record(z.any()).optional(),
    })
    .optional(),
  scoring: z
    .object({
      method: z.enum(['points', 'weights']).optional(),
      categories: z.array(z.string()).optional(),
      options: z.record(z.object({ category: z.string(), points: z.number().optional() })).optional(),
    })
    .optional(),
});

export type JSONv3TemplateParsed = z.infer<typeof JSONv3TemplateSchema>;

export function parseJSONv3(input: unknown): JSONv3TemplateParsed {
  return JSONv3TemplateSchema.parse(input);
}

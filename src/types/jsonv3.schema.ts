import { z } from 'zod';

// Schema básico e seguro para JSON v3.0
export const JSONv3SectionSchema = z.object({
  type: z.string().min(1),
  id: z.string().min(1),
  content: z.record(z.any()).default({}),
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
  metadata: JSONv3MetadataSchema,
  theme: JSONv3ThemeSchema,
  sections: z.array(JSONv3SectionSchema).nonempty(),
  validation: z.record(z.any()).optional(),
  navigation: JSONv3NavigationSchema,
  analytics: z.object({
    events: z.array(z.string()).optional(),
    trackingId: z.string().optional(),
  }).optional(),
});

export type JSONv3TemplateParsed = z.infer<typeof JSONv3TemplateSchema>;

export function parseJSONv3(input: unknown): JSONv3TemplateParsed {
  return JSONv3TemplateSchema.parse(input);
}

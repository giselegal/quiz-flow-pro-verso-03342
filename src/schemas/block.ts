import { z } from 'zod';

// Schema mínimo e tolerante para validar blocos vindos do JSON/serviços
export const blockSchema = z.object({
  id: z.string().min(1),
  type: z.string().min(1),
  order: z.number().int().nonnegative().optional().default(0),
  properties: z.record(z.any()).optional().default({}),
  content: z.record(z.any()).optional().default({}),
  parentId: z.string().optional(),
});

export const blockArraySchema = z.array(blockSchema);

export type BlockSchema = z.infer<typeof blockSchema>;

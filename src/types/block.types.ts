import { z } from 'zod';

// Fonte canônica: esquema Zod
export const BlockSchema = z.object({
  id: z.string(),
  type: z.string(),
  props: z.record(z.unknown()).default({}),
  children: z.array(z.lazy(() => BlockSchema)).optional(),
});

// Tipo derivado
export type Block = z.infer<typeof BlockSchema>;

// Props de componentes de bloco
export interface BlockComponentProps<T = unknown> {
  block: Block;
  isEditing?: boolean;
  onUpdate?: (updates: Partial<Block>) => void;
  customProps?: T;
}

// Re-exports para retrocompatibilidade
export type { Block as BlockType };
export type { BlockComponentProps as BlockProps };

import { z } from 'zod';

// Definição de tipo canônico
export interface Block {
  id: string;
  type: string;
  props?: Record<string, unknown>;
  children?: Block[];
}

// Esquema Zod (sem inferência recursiva direta para evitar erros de TS)
export const BlockSchema: z.ZodType<Block> = z.object({
  id: z.string(),
  type: z.string(),
  props: z.record(z.unknown()).optional(),
  // Usa z.any() para crianças para evitar laço de tipo no inicializador
  children: z.array(z.any()).optional(),
});

// Props de componentes de bloco
export interface BlockComponentProps<T = unknown> {
  block: Block;
  isEditing?: boolean;
  onUpdate?: (updates: Partial<Block>) => void;
  customProps?: T;
}

// Re-exports para retrocompatibilidade
export type { BlockComponentProps as BlockProps };

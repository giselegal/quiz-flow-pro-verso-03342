// Clean minimal definitions to unblock type-check and imports.
// Minimal, single-definition blocks types to unblock incremental work.
// Minimal, single-definition blocks types to unblock incremental work.
export type Block = {
  id: string;
  type: string;
  properties?: Record<string, any>;
  content?: Record<string, any>;
  order?: number;
  parentId?: string | null;
  stageId?: string | null;
};

export type BlockData = Block;

export type BlockComponentProps<T extends Block = Block> = {
  block: T;
  onUpdate?: (patch: Partial<T>) => void;
  onSelect?: (id: string | null) => void;
  // Common props used across editor components
  isSelected?: boolean;
  onClick?: () => void;
  onPropertyChange?: (patch: Partial<T['properties']>) => void;
  className?: string;
  onValidate?: () => void;
  children?: any;
};

// Relaxed BlockType alias to avoid tight union mismatches during incremental migration
export type BlockType = string;

export const createDefaultBlock = (type: string, stageId?: string | null): Block => ({
  id: `${type}-${Date.now()}`,
  type,
  properties: {},
  content: {},
  order: 1,
  parentId: null,
  stageId: stageId ?? null,
});

export default Block;

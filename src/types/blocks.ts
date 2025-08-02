
export interface BlockData {
  id: string;
  type: string;
  properties: Record<string, any>;
  content: Record<string, any>;
  order: number;
}

export interface BlockDefinition {
  type: string;
  name: string;
  description: string;
  category: string;
  icon: any;
  defaultProps: Record<string, any>;
}

export const createBlockData = (type: string): BlockData => ({
  id: `block-${Date.now()}`,
  type,
  properties: {},
  content: {},
  order: 0
});

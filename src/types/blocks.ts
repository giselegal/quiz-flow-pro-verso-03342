
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

export interface BlockComponentProps {
  id?: string;
  block: BlockData;
  type?: string;
  properties?: Record<string, any>;
  isSelected?: boolean;
  isEditing?: boolean;
  onClick?: () => void;
  onPropertyChange?: (key: string, value: any) => void;
  className?: string;
}

export const createBlockData = (type: string): BlockData => ({
  id: `block-${Date.now()}`,
  type,
  properties: {},
  content: {},
  order: 0
});

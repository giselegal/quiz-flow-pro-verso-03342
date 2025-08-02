
// Tipos base para o sistema de blocos schema-driven

export interface BlockData {
  id: string;
  type: string;
  properties: Record<string, any>;
  content?: Record<string, any>; // Added for compatibility
}

export interface BlockComponentProps {
  block: BlockData;
  isSelected?: boolean;
  isEditing?: boolean;
  onClick?: () => void;
  onPropertyChange?: (key: string, value: any) => void;
  className?: string;
}

// Tipos específicos para quiz
export interface QuizAnswer {
  id: string;
  text: string;
  value: string;
  weight?: number;
}

export interface QuizOption {
  id: string;
  text: string;
  value: string;
  weight?: number;
}

export interface BlockDefinition {
  type: string;
  name: string;
  description: string;
  category: string;
  icon?: any; // Added icon property
  properties: { [key: string]: any };
  defaultContent?: any; // Made optional
}

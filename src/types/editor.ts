
import { LucideIcon } from 'lucide-react';

export interface PropertySchema {
  type: 'string' | 'number' | 'boolean' | 'select' | 'textarea' | 'array';
  default: any;
  label: string;
  description?: string;
  options?: Array<{ value: string; label: string }>;
}

export interface BlockDefinition {
  type: string;
  name: string;
  description: string;
  category: string;
  icon: LucideIcon;
  component: React.ComponentType<any>;
  properties: Record<string, PropertySchema>;
  label: string;
  defaultProps: Record<string, any>;
}

export type BlockType = 'headline' | 'text' | 'image' | 'button' | 'spacer';

export interface EditableContent {
  title?: string;
  text?: string;
  url?: string;
  alt?: string;
  width?: string;
  height?: string;
  borderRadius?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  fontSize?: string;
  alignment?: 'left' | 'center' | 'right' | 'justify';
  subtitle?: string;
  style?: string;
  borderWidth?: string;
  borderStyle?: string;
  borderColor?: string;
  type?: string;
  buttonColor?: string;
}

export interface Block {
  id: string;
  type: BlockType;
  content: EditableContent;
  order: number;
}

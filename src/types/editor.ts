
import { BlockType } from './quiz';

export interface EditorState {
  selectedBlockId: string | null;
  isPreviewing: boolean;
  blocks: Block[];
  isGlobalStylesOpen: boolean;
}

export interface BlockManipulationActions {
  handleAddBlock: (type: BlockType) => string;
  handleUpdateBlock: (id: string, content: any) => void;
  handleDeleteBlock: (id: string) => void;
  handleReorderBlocks: (sourceIndex: number, destinationIndex: number) => void;
}

export interface EditorProps {
  selectedStyle: {
    category: string;
    score: number;
    percentage: number;
  };
  onShowTemplates?: () => void;
  initialConfig?: any;
}

export interface EditableContent {
  [key: string]: any;
}

export interface EditorBlock {
  id: string;
  type: string;
  content: EditableContent;
  order: number;
  properties?: Record<string, any>;
  visible?: boolean;
}

export interface Block extends EditorBlock {
  content: EditableContent;
}

export interface BlockDefinition {
  type: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  component: React.ComponentType<any>;
  properties: {
    [key: string]: {
      type: 'text' | 'textarea' | 'number' | 'boolean' | 'color' | 'image' | 'select';
      label: string;
      defaultValue?: any;
      options?: string[];
    };
  };
  label: string;
  defaultProps: Record<string, any>;
}

export interface EditorConfig {
  title: string;
  description: string;
  blocks: Block[];
  globalStyles?: {
    primaryColor?: string;
    secondaryColor?: string;
    textColor?: string;
    backgroundColor?: string;
    fontFamily?: string;
  };
}

// Export BlockType from quiz types
export type { BlockType } from './quiz';

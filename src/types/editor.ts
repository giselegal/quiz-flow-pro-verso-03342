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

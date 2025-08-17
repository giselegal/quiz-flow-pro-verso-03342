import { Block } from './editor';

export interface EditorState {
  selectedBlockId: string | null;
  isPreviewing: boolean;
  blocks: Block[];
  isGlobalStylesOpen: boolean;
}

export interface EditorAction {
  type:
    | 'SET_BLOCKS'
    | 'ADD_BLOCK'
    | 'UPDATE_BLOCK'
    | 'DELETE_BLOCK'
    | 'SET_SELECTED_BLOCK'
    | 'SET_PREVIEW_MODE'
    | 'SET_GLOBAL_STYLES_OPEN';
  payload: any;
}

export interface BlockManipulationActions {
  handleAddBlock: (type: Block['type']) => string;
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

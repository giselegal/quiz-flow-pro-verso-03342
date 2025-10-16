import { EditorBlock, EditableContent, Block, BlockType } from './editor';

export interface EditorActions {
  // Block operations (legacy - compatibilidade)
  addBlock: (type: EditorBlock['type']) => string;
  updateBlock: (id: string, content: Partial<EditableContent>) => void;
  deleteBlock: (id: string) => void;
  reorderBlocks: (startIndex: number, endIndex: number) => void;
  
  // NEW: Flat block operations
  moveBlockToStep?: (blockId: string, targetStepId: string) => Promise<void>;
  duplicateBlock?: (blockId: string, targetStepId?: string) => Promise<void>;
  getBlocksForStep?: (stepId: string) => Block[];
}

export interface EditorThemeActions {
  updateTheme: (theme: Partial<any>) => void;
}

export interface EditorTemplateActions {
  saveAsTemplate: (name: string) => void;
  loadTemplate: (name: string) => boolean;
}

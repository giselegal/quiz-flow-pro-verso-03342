import type { Block } from './block.types';

export interface EditorState {
  currentStepId: string | null;
  selectedBlockId: string | null;
  mode: 'edit' | 'preview';
  isDirty: boolean;
  lastSaved: Date | null;
}

export interface EditorActions {
  selectStep: (stepId: string) => void;
  selectBlock: (blockId: string | null) => void;
  setMode: (mode: 'edit' | 'preview') => void;
  addBlock: (stepId: string | number, block: Block) => void;
  updateBlock: (stepId: string | number, blockId: string, updates: Partial<Block>) => void;
  removeBlock: (stepId: string | number, blockId: string) => void;
  save: () => Promise<void> | void;
}

export interface EditorAPI extends EditorState, EditorActions {}

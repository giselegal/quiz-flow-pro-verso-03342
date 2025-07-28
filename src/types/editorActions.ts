
import { EditorBlock, EditableContent } from './editor';

export interface EditorActions {
  addBlock: (type: EditorBlock['type']) => string;
  updateBlock: (id: string, content: Partial<EditableContent>) => void;
  deleteBlock: (id: string) => void;
  reorderBlocks: (startIndex: number, endIndex: number) => void;
}

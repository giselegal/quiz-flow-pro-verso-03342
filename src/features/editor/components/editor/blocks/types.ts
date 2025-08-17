import { EditorBlock } from '@/types/editor';

export interface BlockEditorProps {
  block: EditorBlock;
  onUpdate: (content: any) => void;
}

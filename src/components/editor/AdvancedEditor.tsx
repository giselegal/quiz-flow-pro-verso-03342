import type { BlockData } from '@/types/blocks';

export interface AdvancedEditorProps {
  initialBlocks?: BlockData[];
  onSave?: (blocks: BlockData[]) => Promise<void>;
  onPreview?: (blocks: BlockData[]) => void;
  className?: string;
}

export default function AdvancedEditor(_props: AdvancedEditorProps) {
  // Placeholder editor (implementation WIP)
  return null;
}


import { EditableContent, BlockType } from '@/types/editor';
import { createDefaultBlock } from '../components/editor/blocks/ModularBlockSystem';

export const getDefaultContentForType = (type: BlockType): EditableContent => {
  // Use the modular system to create default content
  const defaultBlock = createDefaultBlock(type);
  return defaultBlock.content || defaultBlock.properties || {};
};

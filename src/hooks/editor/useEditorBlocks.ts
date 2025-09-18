import { useCallback } from 'react';
import { EditorBlock, EditorConfig, EditableContent } from '@/types/editor';
import { EditorActions } from '@/types/editorActions';
import { getDefaultContentForType } from '@/utils/editorDefaults';
import { generateId } from '@/utils/idGenerator';

export const useEditorBlocks = (
  config: EditorConfig,
  setConfig: (config: EditorConfig) => void
): EditorActions => {
  const addBlock = useCallback(
    (type: EditorBlock['type']) => {
      const blocks = Array.isArray(config.blocks) ? config.blocks : [];
      const blocksLength = blocks.length;
      const newBlock: EditorBlock = {
        id: generateId(),
        type,
        content: getDefaultContentForType(type),
        order: blocksLength,
      };

      setConfig({
        ...config,
        blocks: [...blocks, newBlock] as any,
      });

      return newBlock.id;
    },
    [config, setConfig]
  );

  const updateBlock = useCallback(
    (id: string, content: Partial<EditableContent>) => {
      const blocks = Array.isArray(config.blocks) ? config.blocks : [];
      setConfig({
        ...config,
        blocks: blocks.map((block: EditorBlock) =>
          block.id === id ? { ...block, content: { ...block.content, ...content } } : block
        ) as any,
      });
    },
    [config, setConfig]
  );

  const deleteBlock = useCallback(
    (id: string) => {
      const blocks = Array.isArray(config.blocks) ? config.blocks : [];
      setConfig({
        ...config,
        blocks: blocks
          .filter((block: EditorBlock) => block.id !== id)
          .map((block: EditorBlock, index: number) => ({
            ...block,
            order: index,
          })) as any,
      });
    },
    [config, setConfig]
  );

  const reorderBlocks = useCallback(
    (startIndex: number, endIndex: number) => {
      const blocks = Array.isArray(config.blocks) ? config.blocks : [];
      const newBlocks = Array.from(blocks);
      const [removed] = newBlocks.splice(startIndex, 1);
      newBlocks.splice(endIndex, 0, removed);

      setConfig({
        ...config,
        blocks: newBlocks.map((block: EditorBlock, index: number) => ({
          ...block,
          order: index,
        })) as any,
      });
    },
    [config, setConfig]
  );

  return {
    addBlock,
    updateBlock,
    deleteBlock,
    reorderBlocks,
  };
};

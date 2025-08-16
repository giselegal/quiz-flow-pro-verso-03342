
import { useCallback } from 'react';
import { Block, EditorConfig, EditableContent } from '@/types/editor';
import { EditorActions } from '@/types/editorActions';
import { getDefaultContentForType } from '@/utils/editorDefaults';
import { generateId } from '@/utils/idGenerator';

export const useEditorBlocks = (
  config: EditorConfig,
  setConfig: (config: EditorConfig) => void
): EditorActions => {
  const addBlock = useCallback(
    (type: Block['type']) => {
      const blocksLength = config.blocks.length;
      const newBlock: Block = {
        id: generateId(),
        type,
        content: getDefaultContentForType(type),
        order: blocksLength,
        properties: {},
      };

      setConfig({
        ...config,
        blocks: ([...config.blocks, newBlock] as any),
      });

      return newBlock.id;
    },
    [config, setConfig]
  );

  const updateBlock = useCallback(
    (id: string, content: Partial<EditableContent>) => {
      setConfig({
        ...config,
        blocks: (config.blocks.map((block: Block) =>
          block.id === id ? { ...block, content: { ...block.content, ...content } } : block
        ) as any),
      });
    },
    [config, setConfig]
  );

  const deleteBlock = useCallback(
    (id: string) => {
      setConfig({
        ...config,
        blocks: (config.blocks
          .filter((block: Block) => block.id !== id)
          .map((block: Block, index: number) => ({
            ...block,
            order: index,
          })) as any),
      });
    },
    [config, setConfig]
  );

  const reorderBlocks = useCallback(
    (startIndex: number, endIndex: number) => {
      const newBlocks = Array.from(config.blocks);
      const [removed] = newBlocks.splice(startIndex, 1);
      newBlocks.splice(endIndex, 0, removed);

      setConfig({
        ...config,
        blocks: (newBlocks.map((block: Block, index: number) => ({
          ...block,
          order: index,
        })) as any),
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

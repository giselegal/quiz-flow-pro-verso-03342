import { useState, useCallback } from "react";
import { EditorBlock, EditorConfig, EditableContent } from "@/types/editor";
import { EditorActions } from "@/types/editorActions";
import { getDefaultContentForType } from "@/utils/editorDefaults";
import { generateId } from "@/utils/idGenerator";

export const useEditorBlocks = (
  config: EditorConfig,
  setConfig: (config: EditorConfig) => void
): EditorActions => {
  const addBlock = useCallback(
    (type: EditorBlock["type"]) => {
      const blocksLength = config.blocks.length;
      const newBlock: EditorBlock = {
        id: generateId(),
        type,
        content: getDefaultContentForType(type),
        order: blocksLength,
      };

      setConfig({
        ...config,
        blocks: [...config.blocks, newBlock],
      });

      return newBlock.id;
    },
    [config, setConfig]
  );

  const updateBlock = useCallback(
    (id: string, content: Partial<EditableContent>) => {
      setConfig({
        ...config,
        blocks: config.blocks.map((block: EditorBlock) =>
          block.id === id ? { ...block, content: { ...block.content, ...content } } : block
        ),
      });
    },
    [config, setConfig]
  );

  const deleteBlock = useCallback(
    (id: string) => {
      setConfig({
        ...config,
        blocks: config.blocks
          .filter((block: EditorBlock) => block.id !== id)
          .map((block: EditorBlock, index: number) => ({
            ...block,
            order: index,
          })),
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
        blocks: newBlocks.map((block: EditorBlock, index: number) => ({
          ...block,
          order: index,
        })),
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

import { useState, useCallback } from "react";
import { Block } from "@/types/editor";
import { generateId } from "@/utils/idGenerator";
import { getDefaultContentForType } from "@/utils/editorDefaults";

export const useBlockOperations = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  const updateBlocks = useCallback((newBlocks: Block[]) => {
    setBlocks(newBlocks);
  }, []);

  const handleAddBlock = useCallback(
    (type: Block["type"]) => {
      const newBlock: Block = {
        id: generateId(),
        type,
        order: blocks.length,
        content: getDefaultContentForType(type),
      };

      setBlocks(prev => [...prev, newBlock]);
      setSelectedBlockId(newBlock.id);

      return newBlock.id;
    },
    [blocks]
  );

  const handleUpdateBlock = useCallback((id: string, content: any) => {
    setBlocks(prev =>
      prev.map(block =>
        block.id === id ? { ...block, content: { ...block.content, ...content } } : block
      )
    );
  }, []);

  const handleDeleteBlock = useCallback((id: string) => {
    setBlocks(prev => {
      const filteredBlocks = prev
        .filter(block => block.id !== id)
        .map((block, index) => ({ ...block, order: index }));
      return filteredBlocks;
    });

    setSelectedBlockId(null);
  }, []);

  const handleReorderBlocks = useCallback((sourceIndex: number, destinationIndex: number) => {
    setBlocks(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(sourceIndex, 1);
      result.splice(destinationIndex, 0, removed);

      return result.map((block, index) => ({
        ...block,
        order: index,
      }));
    });
  }, []);

  return {
    blocks,
    selectedBlockId,
    setSelectedBlockId,
    updateBlocks,
    actions: {
      handleAddBlock,
      handleUpdateBlock,
      handleDeleteBlock,
      handleReorderBlocks,
    },
  };
};

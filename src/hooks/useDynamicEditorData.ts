import { Block, BlockType } from "@/types/editor";
import { useCallback, useState } from "react";

interface DynamicEditorDataReturn {
  blocks: Block[];
  selectedBlockId: string | null;
  addBlock: (type: string) => string;
  updateBlock: (id: string, updates: Partial<Block>) => void;
  deleteBlock: (id: string) => void;
  selectBlock: (id: string | null) => void;
  reorderBlocks: (startIndex: number, endIndex: number) => void;
}

export const useDynamicEditorData = (): DynamicEditorDataReturn => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  const addBlock = useCallback(
    (type: string): string => {
      // 🎯 SISTEMA 1: ID Semântico para blocos dinâmicos
      const blockNumber = blocks.length + 1;
      const newBlock: Block = {
        id: `editor-block-${type}-${blockNumber}`,
        type: type as BlockType,
        content: getDefaultContent(type),
        order: blocks.length,
        properties: {},
      };

      setBlocks(prev => [...prev, newBlock]);
      return newBlock.id;
    },
    [blocks.length]
  );

  const updateBlock = useCallback((id: string, updates: Partial<Block>) => {
    setBlocks(prev => prev.map(block => (block.id === id ? { ...block, ...updates } : block)));
  }, []);

  const deleteBlock = useCallback(
    (id: string) => {
      setBlocks(prev => prev.filter(block => block.id !== id));
      if (selectedBlockId === id) {
        setSelectedBlockId(null);
      }
    },
    [selectedBlockId]
  );

  const selectBlock = useCallback((id: string | null) => {
    setSelectedBlockId(id);
  }, []);

  const reorderBlocks = useCallback((startIndex: number, endIndex: number) => {
    setBlocks(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result.map((block, index) => ({ ...block, order: index }));
    });
  }, []);

  return {
    blocks,
    selectedBlockId,
    addBlock,
    updateBlock,
    deleteBlock,
    selectBlock,
    reorderBlocks,
  };
};

function getDefaultContent(type: string): Record<string, any> {
  switch (type) {
    case "text":
      return { text: "Digite seu texto aqui..." };
    case "heading":
      return { text: "Novo título", level: "h2" };
    case "image":
      return { imageUrl: "", alt: "Imagem" };
    case "button":
      return { text: "Clique aqui", url: "#" };
    case "spacer":
      return { height: 40 };
    default:
      return {};
  }
}

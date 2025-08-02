
import { useState } from 'react';
import { Block } from '@/types/editor';

export const useEditor = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);

  const actions = {
    addBlock: (type: string) => {
      const newBlock: Block = {
        id: Date.now().toString(),
        type,
        content: {},
        order: blocks.length,
        properties: {}
      };
      setBlocks(prev => [...prev, newBlock]);
      return newBlock.id;
    },
    updateBlock: (id: string, updates: any) => {
      setBlocks(prev => prev.map(block => 
        block.id === id ? { ...block, ...updates } : block
      ));
    },
    deleteBlock: (id: string) => {
      setBlocks(prev => prev.filter(block => block.id !== id));
    },
    reorderBlocks: (startIndex: number, endIndex: number) => {
      setBlocks(prev => {
        const result = Array.from(prev);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
      });
    }
  };

  return {
    blocks,
    actions
  };
};


import { useState } from 'react';
import { Block } from '@/types/editor';

export const useEditor = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);

  const config = {
    blocks,
    title: 'Editor',
    description: ''
  };

  const addBlock = (type: string) => {
    const newBlock: Block = {
      id: Date.now().toString(),
      type,
      content: {},
      order: blocks.length,
      properties: {}
    };
    setBlocks(prev => [...prev, newBlock]);
    return newBlock.id;
  };

  const updateBlock = (id: string, updates: any) => {
    setBlocks(prev => prev.map(block => 
      block.id === id ? { ...block, ...updates } : block
    ));
  };

  const deleteBlock = (id: string) => {
    setBlocks(prev => prev.filter(block => block.id !== id));
  };

  const reorderBlocks = (startIndex: number, endIndex: number) => {
    setBlocks(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  };

  const actions = {
    addBlock,
    updateBlock,
    deleteBlock,
    reorderBlocks
  };

  return {
    blocks,
    config,
    addBlock,
    updateBlock,
    deleteBlock,
    reorderBlocks,
    actions
  };
};

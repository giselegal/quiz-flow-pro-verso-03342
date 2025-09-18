import { Block, BlockType } from '@/types/editor';
import { useState } from 'react';

export const useEditor = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);

  const config = {
    blocks,
    title: 'Editor',
    description: '',
  };

  const addBlock = (type: string) => {
    // 🎯 SISTEMA 1: ID Semântico para blocos do editor
    const blockNumber = blocks.length + 1;
    const newBlock: Block = {
      id: `editor-block-${type}-${blockNumber}`,
      type: type as BlockType,
      content: {},
      order: blocks.length,
      properties: {},
    };
    setBlocks(prev => [...prev, newBlock]);
    return newBlock.id;
  };

  const updateBlock = (id: string, updates: any) => {
    setBlocks(prev => prev.map(block => (block.id === id ? { ...block, ...updates } : block)));
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

  const setAllBlocks = (newBlocks: Block[]) => {
    setBlocks(newBlocks);
  };

  const clearAllBlocks = () => {
    setBlocks([]);
  };

  const actions = {
    addBlock,
    updateBlock,
    deleteBlock,
    reorderBlocks,
    setAllBlocks,
    clearAllBlocks,
  };

  return {
    blocks,
    config,
    addBlock,
    updateBlock,
    deleteBlock,
    reorderBlocks,
    setAllBlocks,
    clearAllBlocks,
    actions,
  };
};

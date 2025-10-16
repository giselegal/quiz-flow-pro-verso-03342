/**
 * 🎯 OPTIMIZED BLOCK OPERATIONS - SPRINT 3 (TK-ED-08)
 * 
 * Hook refatorado para operações com blocos.
 * 
 * MELHORIAS:
 * ✅ Modular e focado
 * ✅ Type-safe
 * ✅ Performance otimizada
 * ✅ Callbacks estáveis
 */

import { useCallback } from 'react';
import { useUnifiedApp } from '@/contexts/UnifiedAppProvider';
import { Block, BlockType } from '@/types/editor';
import { nanoid } from 'nanoid';

interface BlockOperationsReturn {
  // Selection
  selectedBlockId: string | null;
  selectBlock: (blockId: string | null) => void;
  
  // CRUD Operations
  addBlock: (type: BlockType, properties?: Record<string, any>) => string;
  updateBlock: (blockId: string, updates: Partial<Block>) => void;
  deleteBlock: (blockId: string) => void;
  duplicateBlock: (blockId: string) => void;
  
  // Bulk Operations
  clearAllBlocks: () => void;
  
  // Queries
  getBlock: (blockId: string) => Block | undefined;
  getAllBlocks: () => Block[];
}

export const useOptimizedBlockOperations = (): BlockOperationsReturn => {
  const { state, actions } = useUnifiedApp();
  const { blocks, selectedBlockId } = state;

  // Selection
  const selectBlock = useCallback((blockId: string | null) => {
    actions.selectBlock(blockId);
  }, [actions]);

  // Add block
  const addBlock = useCallback((type: BlockType, properties: Record<string, any> = {}) => {
    const newBlock: Block = {
      id: `block-${nanoid(8)}`,
      type,
      content: {},
      properties,
      order: blocks.length,
    };
    
    actions.addBlock(newBlock);
    actions.selectBlock(newBlock.id);
    
    return newBlock.id;
  }, [blocks.length, actions]);

  // Update block
  const updateBlock = useCallback((blockId: string, updates: Partial<Block>) => {
    actions.updateBlock(blockId, updates);
  }, [actions]);

  // Delete block
  const deleteBlock = useCallback((blockId: string) => {
    actions.deleteBlock(blockId);
  }, [actions]);

  // Duplicate block
  const duplicateBlock = useCallback((blockId: string) => {
    const originalBlock = blocks.find(b => b.id === blockId);
    if (!originalBlock) return;

    const duplicatedBlock: Block = {
      ...originalBlock,
      id: `block-${nanoid(8)}`,
      order: originalBlock.order + 1,
    };

    actions.addBlock(duplicatedBlock);
  }, [blocks, actions]);

  // Clear all blocks
  const clearAllBlocks = useCallback(() => {
    blocks.forEach(block => actions.deleteBlock(block.id));
    actions.selectBlock(null);
  }, [blocks, actions]);

  // Queries
  const getBlock = useCallback((blockId: string) => {
    return blocks.find(b => b.id === blockId);
  }, [blocks]);

  const getAllBlocks = useCallback(() => {
    return [...blocks];
  }, [blocks]);

  return {
    selectedBlockId,
    selectBlock,
    addBlock,
    updateBlock,
    deleteBlock,
    duplicateBlock,
    clearAllBlocks,
    getBlock,
    getAllBlocks,
  };
};

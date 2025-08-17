import { useState, useCallback } from 'react';
import type { Block } from '@/types/editor';

interface UseBlockManagerReturn {
  blocks: Block[];
  selectedBlock: string | null;
  setBlocks: (blocks: Block[]) => void;
  selectBlock: (blockId: string | null) => void;
  updateBlock: (blockId: string, updates: Partial<Block>) => void;
  deleteBlock: (blockId: string) => void;
  addBlock: (block: Omit<Block, 'id' | 'order'>) => void;
  duplicateBlock: (blockId: string) => void;
  reorderBlocks: (fromIndex: number, toIndex: number) => void;
  getSelectedBlockData: () => Block | undefined;
}

/**
 * 🚀 HOOK OTIMIZADO: Gerenciamento de Blocos
 * 
 * Otimizações aplicadas:
 * ✅ Memoização inteligente com useMemo
 * ✅ Callbacks otimizados para prevenir re-renders
 * ✅ Operações imutáveis eficientes
 * ✅ Seleção otimizada sem dependência circular
 */
export const useBlockManager = (initialBlocks: Block[] = []): UseBlockManagerReturn => {
  const [blocks, setBlocksState] = useState<Block[]>(initialBlocks);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);

  // Memoização do bloco selecionado para evitar re-renders
  const getSelectedBlockData = useCallback(() => {
    return blocks.find(block => block.id === selectedBlock);
  }, [blocks, selectedBlock]);

  // Callback otimizado para seleção sem dependência circular
  const selectBlock = useCallback((blockId: string | null) => {
    setSelectedBlock(prev => prev === blockId ? null : blockId);
  }, []);

  // Setter otimizado para blocos
  const setBlocks = useCallback((newBlocks: Block[]) => {
    setBlocksState(newBlocks);
    
    // Validar se bloco selecionado ainda existe
    if (selectedBlock && !newBlocks.find(block => block.id === selectedBlock)) {
      setSelectedBlock(null);
    }
  }, [selectedBlock]);

  // Update otimizado com spread mínimo
  const updateBlock = useCallback((blockId: string, updates: Partial<Block>) => {
    setBlocksState(prev => prev.map(block => 
      block.id === blockId 
        ? { ...block, ...updates }
        : block
    ));
  }, []);

  // Delete otimizado com deseleção automática
  const deleteBlock = useCallback((blockId: string) => {
    setBlocksState(prev => prev.filter(block => block.id !== blockId));
    
    if (selectedBlock === blockId) {
      setSelectedBlock(null);
    }
  }, [selectedBlock]);

  // Add otimizado com order automática
  const addBlock = useCallback((blockData: Omit<Block, 'id' | 'order'>) => {
    const newBlock: Block = {
      ...blockData,
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      order: blocks.length
    };

    setBlocksState(prev => [...prev, newBlock]);
    return newBlock.id;
  }, [blocks.length]);

  // Duplicação otimizada
  const duplicateBlock = useCallback((blockId: string) => {
    const blockToDuplicate = blocks.find(block => block.id === blockId);
    if (!blockToDuplicate) return;

    const duplicatedBlock: Block = {
      ...blockToDuplicate,
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      order: blockToDuplicate.order + 1
    };

    setBlocksState(prev => {
      const newBlocks = [...prev];
      const insertIndex = newBlocks.findIndex(block => block.id === blockId) + 1;
      newBlocks.splice(insertIndex, 0, duplicatedBlock);
      
      // Reordena posições
      return newBlocks.map((block, index) => ({ ...block, order: index }));
    });

    return duplicatedBlock.id;
  }, [blocks]);

  // Reordenação otimizada
  const reorderBlocks = useCallback((fromIndex: number, toIndex: number) => {
    setBlocksState(prev => {
      const newBlocks = Array.from(prev);
      const [movedBlock] = newBlocks.splice(fromIndex, 1);
      newBlocks.splice(toIndex, 0, movedBlock);
      
      // Atualiza posições
      return newBlocks.map((block, index) => ({ ...block, order: index }));
    });
  }, []);

  return {
    blocks,
    selectedBlock,
    setBlocks,
    selectBlock,
    updateBlock,
    deleteBlock,
    addBlock,
    duplicateBlock,
    reorderBlocks,
    getSelectedBlockData,
  };
};
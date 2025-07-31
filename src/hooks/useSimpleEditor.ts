import { useState, useCallback } from 'react';
import { BlockData } from "@/types/blocks"

interface SimpleFunnelData {
  id: string;
  name: string;
  pages: SimplePageData[];
}

interface SimplePageData {
  id: string;
  name: string;
  blocks: BlockData[];
}

export const useSimpleEditor = () => {
  const [funnel, setFunnel] = useState<SimpleFunnelData>({
    id: 'default-funnel',
    name: 'Novo Funil',
    pages: [{
      id: 'page-1',
      name: 'Página 1',
      blocks: []
    }]
  });
  
  const [currentPageId] = useState('page-1');
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  
  const currentPage = funnel.pages.find(p => p.id === currentPageId) || null;
  const selectedBlock = currentPage?.blocks.find(b => b.id === selectedBlockId) || null;
  
  const addBlock = useCallback((blockData: Omit<BlockData, 'id'>) => {
    console.log('🎯 SIMPLE DEBUG: addBlock called with:', blockData);
    
    const newBlock: BlockData = {
      ...blockData,
      id: `block-${Date.now()}`,
    };
    
    console.log('🎯 SIMPLE DEBUG: newBlock created:', newBlock);
    
    setFunnel(prev => ({
      ...prev,
      pages: prev.pages.map(page =>
        page.id === currentPageId
          ? { ...page, blocks: [...page.blocks, newBlock] }
          : page
      )
    }));
    
    setSelectedBlockId(newBlock.id);
    console.log('✅ SIMPLE DEBUG: Block added successfully');
  }, [currentPageId]);
  
  const updateBlock = useCallback((blockId: string, updates: Partial<BlockData>) => {
    setFunnel(prev => ({
      ...prev,
      pages: prev.pages.map(page =>
        page.id === currentPageId
          ? {
              ...page,
              blocks: page.blocks.map(block =>
                block.id === blockId ? { ...block, ...updates } : block
              )
            }
          : page
      )
    }));
  }, [currentPageId]);
  
  const deleteBlock = useCallback((blockId: string) => {
    setFunnel(prev => ({
      ...prev,
      pages: prev.pages.map(page =>
        page.id === currentPageId
          ? {
              ...page,
              blocks: page.blocks.filter(block => block.id !== blockId)
            }
          : page
      )
    }));
    
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
    }
  }, [currentPageId, selectedBlockId]);
  
  const setSelectedBlock = useCallback((blockId: string | null) => {
    setSelectedBlockId(blockId);
  }, []);
  
  return {
    funnel,
    currentPage,
    selectedBlock,
    selectedBlockId,
    addBlock,
    updateBlock,
    deleteBlock,
    setSelectedBlock,
    isLoading: false,
    isSaving: false
  };
};

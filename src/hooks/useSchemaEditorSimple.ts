import { useState, useEffect, useCallback } from 'react';
import { schemaDrivenFunnelService, type SchemaDrivenFunnelData, type SchemaDrivenPageData } from '@/services/schemaDrivenFunnelService';
import { type BlockData } from "@/types/blocks"

interface UseSchemaEditorSimpleReturn {
  funnel: SchemaDrivenFunnelData | null;
  currentPage: SchemaDrivenPageData | null;
  selectedBlock: BlockData | null;
  isLoading: boolean;
  isSaving: boolean;
  currentPageId: string | null;
  selectedBlockId: string | null;
  setCurrentPage: (pageId: string) => void;
  addBlock: (blockData: Omit<BlockData, 'id'>) => void;
  updateBlock: (blockId: string, updates: Partial<BlockData>) => void;
  deleteBlock: (blockId: string) => void;
  setSelectedBlock: (blockId: string | null) => void;
  saveFunnel: (manual?: boolean) => Promise<void>;
}

export const useSchemaEditorSimple = (initialFunnelId?: string): UseSchemaEditorSimpleReturn => {
  const [funnel, setFunnel] = useState<SchemaDrivenFunnelData | null>(null);
  const [currentPageId, setCurrentPageId] = useState<string | null>(null);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Computed values
  const currentPage = funnel?.pages?.find(page => page.id === currentPageId) || null;
  const selectedBlock = currentPage?.blocks?.find(block => block.id === selectedBlockId) || null;

  // Inicialização simples sem loops
  useEffect(() => {
    console.log('🚀 useSchemaEditorSimple: Iniciando com funnelId:', initialFunnelId);
    
    const initializeFunnel = async () => {
      try {
        let funnelData: SchemaDrivenFunnelData;
        
        if (initialFunnelId) {
          // Tentar carregar funil específico
          const loadedFunnel = await schemaDrivenFunnelService.loadFunnel(initialFunnelId);
          funnelData = loadedFunnel || schemaDrivenFunnelService.createDefaultFunnel();
        } else {
          // Criar funil padrão
          funnelData = schemaDrivenFunnelService.createDefaultFunnel();
        }
        
        console.log('✅ useSchemaEditorSimple: Funil inicializado com', funnelData.pages.length, 'páginas');
        
        setFunnel(funnelData);
        setCurrentPageId(funnelData.pages[0]?.id || null);
        setSelectedBlockId(null);
        
      } catch (error) {
        console.error('❌ useSchemaEditorSimple: Erro na inicialização:', error);
        // Fallback para funil padrão
        const defaultFunnel = schemaDrivenFunnelService.createDefaultFunnel();
        setFunnel(defaultFunnel);
        setCurrentPageId(defaultFunnel.pages[0]?.id || null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeFunnel();
  }, []); // Removido initialFunnelId das dependências para evitar loops

  // Ações básicas
  const setCurrentPage = useCallback((pageId: string) => {
    setCurrentPageId(pageId);
    setSelectedBlockId(null);
  }, []);

  const addBlock = useCallback((blockData: Omit<BlockData, 'id'>) => {
    if (!currentPageId || !funnel) return;
    
    const newBlock: BlockData = {
      ...blockData,
      id: `block-${Date.now()}`,
    };

    const updatedFunnel = {
      ...funnel,
      pages: funnel.pages.map(page =>
        page.id === currentPageId
          ? { ...page, blocks: [...page.blocks, newBlock] }
          : page
      )
    };

    setFunnel(updatedFunnel);
    setSelectedBlockId(newBlock.id);
  }, [currentPageId, funnel]);

  const updateBlock = useCallback((blockId: string, updates: Partial<BlockData>) => {
    if (!currentPageId || !funnel) return;

    const updatedFunnel = {
      ...funnel,
      pages: funnel.pages.map(page =>
        page.id === currentPageId
          ? {
              ...page,
              blocks: page.blocks.map(block =>
                block.id === blockId ? { ...block, ...updates } : block
              )
            }
          : page
      )
    };

    setFunnel(updatedFunnel);
  }, [currentPageId, funnel]);

  const deleteBlock = useCallback((blockId: string) => {
    if (!currentPageId || !funnel) return;

    const updatedFunnel = {
      ...funnel,
      pages: funnel.pages.map(page =>
        page.id === currentPageId
          ? { ...page, blocks: page.blocks.filter(block => block.id !== blockId) }
          : page
      )
    };

    setFunnel(updatedFunnel);

    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
    }
  }, [currentPageId, funnel, selectedBlockId]);

  const setSelectedBlock = useCallback((blockId: string | null) => {
    setSelectedBlockId(blockId);
  }, []);

  const saveFunnel = useCallback(async (manual: boolean = true) => {
    if (!funnel) return;
    
    setIsSaving(true);
    try {
      await schemaDrivenFunnelService.saveFunnel(funnel, !manual);
      console.log('✅ Funil salvo com sucesso');
    } catch (error) {
      console.error('❌ Erro ao salvar funil:', error);
    } finally {
      setIsSaving(false);
    }
  }, [funnel]);

  return {
    funnel,
    currentPage,
    selectedBlock,
    isLoading,
    isSaving,
    currentPageId,
    selectedBlockId,
    setCurrentPage,
    addBlock,
    updateBlock,
    deleteBlock,
    setSelectedBlock,
    saveFunnel,
  };
};

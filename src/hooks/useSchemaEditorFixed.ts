import { useState, useEffect, useCallback, useRef } from 'react';
import { schemaDrivenFunnelService, type SchemaDrivenFunnelData, type SchemaDrivenPageData, type AutoSaveState } from '@/services/schemaDrivenFunnelService';
import { type BlockData } from '@/components/editor/blocks';
import { useToast } from '@/hooks/use-toast';

interface UseSchemaEditorReturn {
  // Estado do funil
  funnel: SchemaDrivenFunnelData | null;
  currentPage: SchemaDrivenPageData | null;
  selectedBlock: BlockData | null;
  
  // Estados de loading/saving
  isLoading: boolean;
  isSaving: boolean;
  autoSaveState: AutoSaveState;
  
  // Seleções
  currentPageId: string | null;
  selectedBlockId: string | null;
  
  // Ações do funil
  createNewFunnel: () => void;
  loadFunnel: (funnelId: string) => Promise<void>;
  saveFunnel: (manual?: boolean) => Promise<void>;
  
  // Ações de página
  addPage: (pageData: Omit<SchemaDrivenPageData, 'id' | 'order'>) => void;
  updatePage: (pageId: string, updates: Partial<SchemaDrivenPageData>) => void;
  deletePage: (pageId: string) => void;
  setCurrentPage: (pageId: string) => void;
  
  // Ações de bloco
  addBlock: (blockData: Omit<BlockData, 'id'>) => void;
  updateBlock: (blockId: string, updates: Partial<BlockData>) => void;
  deleteBlock: (blockId: string) => Promise<void>;
  reorderBlocks: (newBlocks: BlockData[]) => void;
  setSelectedBlock: (blockId: string | null) => void;
  
  // Configurações
  updateFunnelConfig: (updates: Partial<SchemaDrivenFunnelData['config']>) => void;
  updatePageSettings: (pageId: string, settings: Partial<SchemaDrivenPageData['settings']>) => void;
  
  // Versionamento
  getVersionHistory: () => any[];
  restoreVersion: (versionId: string) => Promise<void>;
  
  // Auto-save controls
  enableAutoSave: (interval?: number) => void;
  disableAutoSave: () => void;
}

export const useSchemaEditorFixed = (initialFunnelId?: string): UseSchemaEditorReturn => {
  const [funnel, setFunnel] = useState<SchemaDrivenFunnelData | null>(null);
  const [currentPageId, setCurrentPageId] = useState<string | null>(null);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [autoSaveState, setAutoSaveState] = useState<AutoSaveState>(schemaDrivenFunnelService.getAutoSaveState());
  
  const { toast } = useToast();
  const initializedRef = useRef(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Computed values
  const currentPage = funnel?.pages?.find(page => page.id === currentPageId) || null;
  const selectedBlock = currentPage?.blocks?.find(block => block.id === selectedBlockId) || null;

  // Salvar funil localmente com controle de quota
  const saveToLocal = useCallback((funnelData: SchemaDrivenFunnelData) => {
    try {
      schemaDrivenFunnelService.saveLocalFunnel(funnelData);
    } catch (error) {
      console.warn('⚠️ Failed to save to localStorage (quota exceeded):', error);
      try {
        localStorage.removeItem('schema-driven-versions');
        schemaDrivenFunnelService.saveLocalFunnel(funnelData);
      } catch (secondError) {
        console.error('❌ Critical: Unable to save even after cleanup:', secondError);
      }
    }
  }, []);

  // Atualizar estado do funil de forma imutável
  const updateFunnelState = useCallback((updater: (prev: SchemaDrivenFunnelData) => SchemaDrivenFunnelData) => {
    setFunnel(prev => {
      if (!prev) return null;
      const updated = updater(prev);
      console.log('🔄 Funnel state updated:', updated.lastModified);
      saveToLocal(updated);
      
      // Marcar que há mudanças pendentes para o auto-save
      schemaDrivenFunnelService.markPendingChanges();
      
      return updated;
    });
  }, [saveToLocal]);

  // Ações do funil
  const createNewFunnel = useCallback(async () => {
    setIsLoading(true);
    try {
      const defaultFunnel = schemaDrivenFunnelService.createDefaultFunnel();
      const createdFunnel = await schemaDrivenFunnelService.createFunnel(defaultFunnel);
      
      setFunnel(createdFunnel);
      setCurrentPageId(createdFunnel.pages[0]?.id || null);
      setSelectedBlockId(null);
      
      toast({
        title: "Novo funil criado!",
        description: "Funil criado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao criar funil",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const loadFunnel = useCallback(async (funnelId: string) => {
    if (!funnelId || typeof funnelId !== 'string') {
      console.error('❌ loadFunnel called with invalid ID:', funnelId);
      return;
    }
    
    setIsLoading(true);
    try {
      const loadedFunnel = await schemaDrivenFunnelService.loadFunnel(funnelId);
      
      if (loadedFunnel) {
        setFunnel(loadedFunnel);
        setCurrentPageId(loadedFunnel.pages[0]?.id || null);
        setSelectedBlockId(null);
        
        toast({
          title: "Funil carregado!",
          description: `Funil "${loadedFunnel.name}" carregado com sucesso.`,
        });
      } else {
        throw new Error('Funil não encontrado');
      }
    } catch (error) {
      toast({
        title: "Erro ao carregar funil",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const saveFunnel = useCallback(async (manual: boolean = true) => {
    if (!funnel) return;
    
    // Evitar salvamentos simultâneos
    if (isSaving) {
      console.log('⏳ Save already in progress, skipping...');
      return;
    }
    
    setIsSaving(true);
    try {
      const savedFunnel = await schemaDrivenFunnelService.saveFunnel(funnel, !manual);
      setFunnel(savedFunnel);
      
      if (manual) {
        toast({
          title: "Funil salvo!",
          description: "Todas as alterações foram salvas.",
        });
      } else {
        console.log('💾 Auto-save completed successfully');
      }
      // Limpar o estado de mudanças pendentes após o salvamento bem-sucedido
      schemaDrivenFunnelService.clearPendingChanges();
    } catch (error) {
      console.error('❌ Save error:', error);
      if (manual) {
        toast({
          title: "Erro ao salvar",
          description: error instanceof Error ? error.message : "Erro desconhecido",
          variant: "destructive",
        });
      }
    } finally {
      setIsSaving(false);
    }
  }, [funnel, toast, isSaving]);

  // Auto-save removido - salvamento apenas manual
  // O sistema de auto-save foi desabilitado por causar problemas

  // Efeito para lidar com o carregamento inicial do funil
  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      if (initialFunnelId) {
        loadFunnel(initialFunnelId);
      } else {
        createNewFunnel();
      }
    }
  }, [initialFunnelId, loadFunnel, createNewFunnel]);

  // Efeito para salvar ao sair da página
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (schemaDrivenFunnelService.hasPendingChanges()) {
        event.preventDefault();
        event.returnValue = ''; // Required for Chrome
        saveFunnel(false); // Tenta salvar antes de sair
        return 'Você tem alterações não salvas. Deseja realmente sair?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [saveFunnel]);

  // Ações de página
  const addPage = useCallback((pageData: Omit<SchemaDrivenPageData, 'id' | 'order'>) => {
    updateFunnelState(prev => ({
      ...prev,
      pages: [
        ...prev.pages,
        {
          ...pageData,
          id: `page-${Date.now()}`,
          order: prev.pages.length + 1,
        } as SchemaDrivenPageData
      ]
    }));
  }, [updateFunnelState]);

  const updatePage = useCallback((pageId: string, updates: Partial<SchemaDrivenPageData>) => {
    console.log('🔄 updatePage called:', { pageId, updates });
    updateFunnelState(prev => {
      const updatedFunnel = {
        ...prev,
        pages: prev.pages.map(page =>
          page.id === pageId ? { ...page, ...updates } : page
        ),
        lastModified: new Date()
      };
      console.log('📝 Page updated in funnel state:', updatedFunnel);
      return updatedFunnel;
    });
  }, [updateFunnelState]);

  const deletePage = useCallback((pageId: string) => {
    updateFunnelState(prev => ({
      ...prev,
      pages: prev.pages.filter(page => page.id !== pageId)
    }));
    
    if (currentPageId === pageId) {
      setCurrentPageId(null);
      setSelectedBlockId(null);
    }
  }, [updateFunnelState, currentPageId]);

  const setCurrentPage = useCallback((pageId: string) => {
    setCurrentPageId(pageId);
    setSelectedBlockId(null);
  }, []);

  // Ações de bloco
  const addBlock = useCallback((blockData: Omit<BlockData, 'id'>) => {
    if (!currentPageId) {
      console.warn('❌ Cannot add block: no current page selected');
      return;
    }
    
    const newBlock: BlockData = {
      ...blockData,
      id: `block-${Date.now()}`,
    };

    console.log('➕ Adding block:', { currentPageId, blockType: blockData.type, blockId: newBlock.id });

    updateFunnelState(prev => ({
      ...prev,
      pages: prev.pages.map(page =>
        page.id === currentPageId
          ? { ...page, blocks: [...page.blocks, newBlock] }
          : page
      )
    }));
  }, [currentPageId, updateFunnelState]);

  const updateBlock = useCallback((blockId: string, updates: Partial<BlockData>) => {
    console.log('🔄 Updating block:', { blockId, updates });
    
    updateFunnelState(prev => ({
      ...prev,
      pages: prev.pages.map(page => ({
        ...page,
        blocks: page.blocks.map(block =>
          block.id === blockId ? { ...block, ...updates } : block
        )
      }))
    }));
  }, [updateFunnelState]);

  const deleteBlock = useCallback(async (blockId: string) => {
    updateFunnelState(prev => ({
      ...prev,
      pages: prev.pages.map(page => ({
        ...page,
        blocks: page.blocks.filter(block => block.id !== blockId)
      }))
    }));
    
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
    }
    
    // Forçar salvamento imediato após exclusão
    await saveFunnel(false);
  }, [updateFunnelState, selectedBlockId, saveFunnel]);

  const reorderBlocks = useCallback((newBlocks: BlockData[]) => {
    if (!currentPageId) return;
    
    updateFunnelState(prev => ({
      ...prev,
      pages: prev.pages.map(page =>
        page.id === currentPageId
          ? { ...page, blocks: newBlocks }
          : page
      )
    }));
  }, [currentPageId, updateFunnelState]);

  const setSelectedBlock = useCallback((blockId: string | null) => {
    setSelectedBlockId(blockId);
  }, []);

  // Configurações
  const updateFunnelConfig = useCallback((updates: Partial<SchemaDrivenFunnelData['config']>) => {
    updateFunnelState(prev => ({
      ...prev,
      config: { ...prev.config, ...updates }
    }));
  }, [updateFunnelState]);

  const updatePageSettings = useCallback((pageId: string, settings: Partial<SchemaDrivenPageData['settings']>) => {
    updateFunnelState(prev => ({
      ...prev,
      pages: prev.pages.map(page =>
        page.id === pageId
          ? { ...page, settings: { ...page.settings, ...settings } }
          : page
      )
    }));
  }, [updateFunnelState]);

  // Versionamento
  const getVersionHistory = useCallback(() => {
    if (!funnel) return [];
    return schemaDrivenFunnelService.getVersionHistory(funnel.id);
  }, [funnel]);

  const restoreVersion = useCallback(async (versionId: string) => {
    if (!funnel) return;
    
    const restoredFunnel = schemaDrivenFunnelService.restoreVersion(funnel.id, versionId);
    if (restoredFunnel) {
      setFunnel(restoredFunnel);
      setCurrentPageId(restoredFunnel.pages[0]?.id || null);
      setSelectedBlockId(null);
      
      toast({
        title: "Versão restaurada!",
        description: "O funil foi restaurado para a versão selecionada.",
      });
    }
  }, [funnel, toast]);

  // Auto-save controls
  const enableAutoSave = useCallback((interval: number = 10) => {
    schemaDrivenFunnelService.enableAutoSave(interval);
  }, []);

  const disableAutoSave = useCallback(() => {
    schemaDrivenFunnelService.disableAutoSave();
  }, []);

  // Inicializar funil apenas uma vez
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    if (initialFunnelId && typeof initialFunnelId === 'string') {
      console.log('🔄 Loading funnel with ID:', initialFunnelId);
      loadFunnel(initialFunnelId);
    } else {
      console.log('🆕 Creating default funnel');
      const defaultFunnel = schemaDrivenFunnelService.createDefaultFunnel();
      console.log('🔍 DEBUG - Funnel criado:', {
        id: defaultFunnel.id,
        name: defaultFunnel.name,
        pagesCount: defaultFunnel.pages.length,
        pageNames: defaultFunnel.pages.map(p => p.name),
        firstPageBlocks: defaultFunnel.pages[0]?.blocks?.length || 0
      });
      
      setFunnel(defaultFunnel);
      setCurrentPageId(defaultFunnel.pages[0]?.id || null);
      
      try {
        schemaDrivenFunnelService.saveLocalFunnel(defaultFunnel);
      } catch (error) {
        console.warn('⚠️ Failed to save default funnel to localStorage:', error);
      }
      
      console.log('🎯 Funil carregado com', defaultFunnel.pages.length, 'etapas:', defaultFunnel.pages.map(p => p.name));
    }
  }, [initialFunnelId, loadFunnel]);

  // Atualizar estado do auto-save menos frequentemente
  useEffect(() => {
    const updateAutoSaveState = () => {
      setAutoSaveState(schemaDrivenFunnelService.getAutoSaveState());
    };

    const interval = setInterval(updateAutoSaveState, 10000); // 10 segundos
    return () => clearInterval(interval);
  }, []);

  // Auto-save desabilitado - salvamento apenas manual
  useEffect(() => {
    // schemaDrivenFunnelService.enableAutoSave(60); // Auto-save removido
    
    return () => {
      schemaDrivenFunnelService.destroy();
    };
  }, []);

  return {
    // Estado
    funnel,
    currentPage,
    selectedBlock,
    isLoading,
    isSaving,
    autoSaveState,
    currentPageId,
    selectedBlockId,
    
    // Ações do funil
    createNewFunnel,
    loadFunnel,
    saveFunnel,
    
    // Ações de página
    addPage,
    updatePage,
    deletePage,
    setCurrentPage,
    
    // Ações de bloco
    addBlock,
    updateBlock,
    deleteBlock,
    reorderBlocks,
    setSelectedBlock,
    
    // Configurações
    updateFunnelConfig,
    updatePageSettings,
    
    // Versionamento
    getVersionHistory,
    restoreVersion,
    
    // Auto-save
    enableAutoSave,
    disableAutoSave,
  };
};
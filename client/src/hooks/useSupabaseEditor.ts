import { useState, useEffect, useCallback, useRef } from 'react';
import { SupabaseFunnelService, type FunnelSchema, type FunnelPage } from '@/services/supabaseFunnelService';
import { type BlockData } from '@/components/editor/blocks';
import { useToast } from '@/hooks/use-toast';

export type AutoSaveState = 'idle' | 'saving' | 'saved' | 'error';

interface UseSupabaseEditorReturn {
  // Estado do funil
  funnel: FunnelSchema | null;
  currentPage: FunnelPage | null;
  selectedBlock: BlockData | null;
  
  // Estados de loading/saving
  isLoading: boolean;
  isSaving: boolean;
  autoSaveState: AutoSaveState;
  
  // Seleções
  currentPageId: string | null;
  selectedBlockId: string | null;
  
  // Ações do funil
  createNewFunnel: (name?: string) => Promise<void>;
  loadFunnel: (funnelId: string) => Promise<void>;
  saveFunnel: (manual?: boolean) => Promise<void>;
  publishFunnel: () => Promise<void>;
  
  // Ações de página
  addPage: (pageData: Omit<FunnelPage, 'id' | 'pageOrder'>) => void;
  updatePage: (pageId: string, updates: Partial<FunnelPage>) => void;
  deletePage: (pageId: string) => void;
  setCurrentPage: (pageId: string) => void;
  
  // Ações de bloco
  addBlock: (blockData: Omit<BlockData, 'id'>) => void;
  updateBlock: (blockId: string, updates: Partial<BlockData>) => void;
  deleteBlock: (blockId: string) => void;
  reorderBlocks: (newBlocks: BlockData[]) => void;
  setSelectedBlock: (blockId: string | null) => void;
  
  // Configurações
  updateFunnelConfig: (updates: Partial<FunnelSchema>) => void;
  
  // Auto-save controls
  enableAutoSave: (interval?: number) => void;
  disableAutoSave: () => void;
  forceSync: () => Promise<void>;
}

export const useSupabaseEditor = (initialFunnelId?: string): UseSupabaseEditorReturn => {
  console.log('🚀 useSupabaseEditor INIT:', { initialFunnelId, timestamp: new Date().toISOString() });
  
  // Estados principais
  const [funnel, setFunnel] = useState<FunnelSchema | null>(null);
  const [currentPageId, setCurrentPageId] = useState<string | null>(null);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [autoSaveState, setAutoSaveState] = useState<AutoSaveState>('idle');
  
  const { toast } = useToast();
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingChangesRef = useRef(false);

  // Computed values
  const currentPage = funnel?.pages?.find(page => page.id === currentPageId) || null;
  const selectedBlock = currentPage?.blocks?.find(block => block.id === selectedBlockId) || null;

  // Função para gerar IDs únicos
  const generateId = useCallback(() => {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Atualizar estado do funil de forma imutável
  const updateFunnelState = useCallback((updater: (prev: FunnelSchema) => FunnelSchema) => {
    setFunnel(prev => {
      if (!prev) return null;
      const updated = updater({ ...prev });
      pendingChangesRef.current = true;
      console.log('🔄 Funnel state updated:', updated.id);
      return updated;
    });
  }, []);

  // Salvar funnel no Supabase
  const saveFunnel = useCallback(async (manual = true) => {
    if (!funnel) {
      console.warn('⚠️ saveFunnel: No funnel to save!');
      return;
    }

    if (isSaving) {
      console.log('⏳ Salvamento já em andamento, ignorando...');
      return;
    }

    try {
      setIsSaving(true);
      setAutoSaveState('saving');
      
      console.log('💾 Salvando funnel no Supabase:', funnel.id);
      
      const result = await SupabaseFunnelService.saveFunnel(funnel);
      
      if (result.success && result.funnel) {
        setFunnel(result.funnel);
        pendingChangesRef.current = false;
        setAutoSaveState('saved');
        
        if (manual) {
          toast({
            title: "✅ Salvo com sucesso!",
            description: `Funnel "${funnel.name}" foi salvo no Supabase.`,
          });
        }
        
        // Reset para idle após 2 segundos
        setTimeout(() => setAutoSaveState('idle'), 2000);
        
      } else {
        throw new Error(result.error || 'Erro desconhecido ao salvar');
      }
      
    } catch (error) {
      console.error('❌ Erro ao salvar funnel:', error);
      setAutoSaveState('error');
      
      toast({
        title: "❌ Erro ao salvar",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
      
      // Reset para idle após 3 segundos
      setTimeout(() => setAutoSaveState('idle'), 3000);
    } finally {
      setIsSaving(false);
    }
  }, [funnel, isSaving, toast]);

  // Carregar funnel por ID
  const loadFunnel = useCallback(async (funnelId: string) => {
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      console.log('📖 Carregando funnel:', funnelId);
      
      const result = await SupabaseFunnelService.getFunnelById(funnelId);
      
      if (result.success && result.funnel) {
        setFunnel(result.funnel);
        setCurrentPageId(result.funnel.pages[0]?.id || null);
        setSelectedBlockId(null);
        pendingChangesRef.current = false;
        
        console.log('✅ Funnel carregado:', result.funnel.name);
        
        toast({
          title: "✅ Funnel carregado!",
          description: `"${result.funnel.name}" foi carregado com sucesso.`,
        });
        
      } else {
        throw new Error(result.error || 'Funnel não encontrado');
      }
      
    } catch (error) {
      console.error('❌ Erro ao carregar funnel:', error);
      toast({
        title: "❌ Erro ao carregar",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, toast]);

  // Criar novo funnel
  const createNewFunnel = useCallback(async (name?: string) => {
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      console.log('🆕 Criando novo funnel...');
      
      const result = await SupabaseFunnelService.createNewFunnel(
        name || `Novo Funnel ${new Date().toLocaleDateString()}`
      );
      
      if (result.success && result.funnel) {
        setFunnel(result.funnel);
        setCurrentPageId(result.funnel.pages[0]?.id || null);
        setSelectedBlockId(null);
        pendingChangesRef.current = false;
        
        console.log('✅ Novo funnel criado:', result.funnel.id);
        
        toast({
          title: "✅ Funnel criado!",
          description: `"${result.funnel.name}" foi criado com sucesso.`,
        });
        
      } else {
        throw new Error(result.error || 'Erro ao criar funnel');
      }
      
    } catch (error) {
      console.error('❌ Erro ao criar funnel:', error);
      toast({
        title: "❌ Erro ao criar",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, toast]);

  // Publicar funnel
  const publishFunnel = useCallback(async () => {
    if (!funnel || isSaving) return;
    
    try {
      setIsSaving(true);
      console.log('🚀 Publicando funnel:', funnel.id);
      
      const result = await SupabaseFunnelService.publishFunnel(funnel.id);
      
      if (result.success) {
        updateFunnelState(prev => ({ ...prev, isPublished: true }));
        
        toast({
          title: "🚀 Funnel publicado!",
          description: `"${funnel.name}" está agora público e acessível.`,
        });
        
        // Salvar as mudanças
        setTimeout(() => saveFunnel(false), 500);
        
      } else {
        throw new Error(result.error || 'Erro ao publicar');
      }
      
    } catch (error) {
      console.error('❌ Erro ao publicar funnel:', error);
      toast({
        title: "❌ Erro ao publicar",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }, [funnel, isSaving, updateFunnelState, saveFunnel, toast]);

  // Ações de página
  const addPage = useCallback((pageData: Omit<FunnelPage, 'id' | 'pageOrder'>) => {
    if (!funnel) return;
    
    const newPageId = generateId();
    const newPage: FunnelPage = {
      ...pageData,
      id: newPageId,
      funnelId: funnel.id,
      pageOrder: funnel.pages.length + 1,
      blocks: pageData.blocks || [],
    };
    
    updateFunnelState(prev => ({
      ...prev,
      pages: [...prev.pages, newPage]
    }));
    
    setCurrentPageId(newPageId);
    console.log('📄 Nova página adicionada:', newPageId);
  }, [funnel, generateId, updateFunnelState]);

  const updatePage = useCallback((pageId: string, updates: Partial<FunnelPage>) => {
    if (!funnel) return;
    
    updateFunnelState(prev => ({
      ...prev,
      pages: prev.pages.map(page =>
        page.id === pageId ? { ...page, ...updates } : page
      )
    }));
    
    console.log('📝 Página atualizada:', pageId);
  }, [funnel, updateFunnelState]);

  const deletePage = useCallback((pageId: string) => {
    if (!funnel || funnel.pages.length <= 1) return;
    
    updateFunnelState(prev => ({
      ...prev,
      pages: prev.pages
        .filter(page => page.id !== pageId)
        .map((page, index) => ({ ...page, pageOrder: index + 1 }))
    }));
    
    if (currentPageId === pageId) {
      setCurrentPageId(funnel.pages[0]?.id || null);
    }
    
    console.log('🗑️ Página deletada:', pageId);
  }, [funnel, currentPageId, updateFunnelState]);

  const setCurrentPage = useCallback((pageId: string) => {
    setCurrentPageId(pageId);
    setSelectedBlockId(null);
    console.log('🎯 Página selecionada:', pageId);
  }, []);

  // Ações de bloco
  const addBlock = useCallback((blockData: Omit<BlockData, 'id'>) => {
    if (!currentPage) return;
    
    const newBlockId = generateId();
    const newBlock: BlockData = {
      ...blockData,
      id: newBlockId,
    };
    
    updatePage(currentPage.id, {
      blocks: [...(currentPage.blocks || []), newBlock]
    });
    
    setSelectedBlockId(newBlockId);
    console.log('🧱 Novo bloco adicionado:', newBlockId);
  }, [currentPage, generateId, updatePage]);

  const updateBlock = useCallback((blockId: string, updates: Partial<BlockData>) => {
    if (!currentPage) return;
    
    updatePage(currentPage.id, {
      blocks: currentPage.blocks?.map(block =>
        block.id === blockId ? { ...block, ...updates } : block
      ) || []
    });
    
    console.log('🔧 Bloco atualizado:', blockId);
  }, [currentPage, updatePage]);

  const deleteBlock = useCallback((blockId: string) => {
    if (!currentPage) return;
    
    updatePage(currentPage.id, {
      blocks: currentPage.blocks?.filter(block => block.id !== blockId) || []
    });
    
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
    }
    
    console.log('🗑️ Bloco deletado:', blockId);
  }, [currentPage, selectedBlockId, updatePage]);

  const reorderBlocks = useCallback((newBlocks: BlockData[]) => {
    if (!currentPage) return;
    
    updatePage(currentPage.id, { blocks: newBlocks });
    console.log('🔄 Blocos reordenados');
  }, [currentPage, updatePage]);

  const setSelectedBlock = useCallback((blockId: string | null) => {
    setSelectedBlockId(blockId);
    console.log('🎯 Bloco selecionado:', blockId);
  }, []);

  // Configurações
  const updateFunnelConfig = useCallback((updates: Partial<FunnelSchema>) => {
    if (!funnel) return;
    
    updateFunnelState(prev => ({ ...prev, ...updates }));
    console.log('⚙️ Configurações do funnel atualizadas');
  }, [funnel, updateFunnelState]);

  // Auto-save
  const enableAutoSave = useCallback((interval = 30000) => {
    disableAutoSave();
    
    autoSaveTimerRef.current = setInterval(() => {
      if (pendingChangesRef.current && !isSaving) {
        console.log('💾 Auto-save triggered');
        saveFunnel(false);
      }
    }, interval);
    
    console.log('✅ Auto-save habilitado:', interval + 'ms');
  }, [isSaving, saveFunnel]);

  const disableAutoSave = useCallback(() => {
    if (autoSaveTimerRef.current) {
      clearInterval(autoSaveTimerRef.current);
      autoSaveTimerRef.current = null;
      console.log('❌ Auto-save desabilitado');
    }
  }, []);

  const forceSync = useCallback(async () => {
    if (funnel) {
      await saveFunnel(false);
    }
  }, [funnel, saveFunnel]);

  // Inicialização
  useEffect(() => {
    if (initialFunnelId) {
      loadFunnel(initialFunnelId);
    } else {
      // Criar um funnel padrão se não houver ID inicial
      createNewFunnel();
    }
    
    // Habilitar auto-save por padrão
    enableAutoSave();
    
    // Cleanup
    return () => {
      disableAutoSave();
    };
  }, [initialFunnelId]); // Apenas na inicialização

  console.log('🔍 useSupabaseEditor STATE:', {
    funnelExists: !!funnel,
    funnelId: funnel?.id,
    currentPageId,
    selectedBlockId,
    isLoading,
    isSaving,
    autoSaveState,
    pendingChanges: pendingChangesRef.current
  });

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
    publishFunnel,
    
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
    
    // Auto-save
    enableAutoSave,
    disableAutoSave,
    forceSync,
  };
};

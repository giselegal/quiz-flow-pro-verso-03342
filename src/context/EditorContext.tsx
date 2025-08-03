
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { EditorBlock } from '@/types/editor';

interface EditorContextType {
  // Estado centralizado unificado
  stageBlocks: Record<string, EditorBlock[]>;
  activeStageId: string;
  selectedBlockId: string | null;
  
  // Actions com validação automática
  actions: {
    setActiveStage: (stageId: string) => void;
    addBlock: (type: string, stageId?: string) => string;
    updateBlock: (id: string, updates: Partial<EditorBlock>) => void;
    deleteBlock: (id: string) => void;
    reorderBlocks: (stageId: string, startIndex: number, endIndex: number) => void;
    getBlocksForStage: (stageId: string) => EditorBlock[];
    setSelectedBlockId: (id: string | null) => void;
    clearStageBlocks: (stageId: string) => void;
  };
  
  // Estado UI
  isPreviewing: boolean;
  setIsPreviewing: (preview: boolean) => void;
  
  // DEPRECATED - mantido para compatibilidade
  blocks: EditorBlock[];
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
};

export const EditorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // ✅ ESTADO UNIFICADO
  const [stageBlocks, setStageBlocks] = useState<Record<string, EditorBlock[]>>({});
  const [activeStageId, setActiveStageId] = useState<string>('step-1');
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  
  // ✅ VALIDAÇÃO DE ETAPAS
  const validateStageId = useCallback((stageId: string): boolean => {
    const validStages = Array.from({ length: 21 }, (_, i) => `step-${i + 1}`);
    return validStages.includes(stageId);
  }, []);

  // ✅ MUDANÇA DE ETAPA COM VALIDAÇÃO
  const setActiveStage = useCallback((stageId: string) => {
    if (!validateStageId(stageId)) {
      console.warn(`🚨 EditorContext: Etapa inválida "${stageId}"`);
      return; // Falha segura
    }
    
    console.log('🔄 EditorContext: Mudando para etapa:', stageId);
    setActiveStageId(stageId);
    setSelectedBlockId(null); // Reset automático
  }, [validateStageId]);

  // ✅ ADICIONAR BLOCO COM VALIDAÇÃO
  const addBlock = useCallback((type: string, stageId?: string): string => {
    const targetStage = stageId || activeStageId;
    
    if (!validateStageId(targetStage)) {
      console.warn(`🚨 EditorContext: Tentativa de adicionar bloco à etapa inválida "${targetStage}"`);
      return '';
    }

    const newBlock: EditorBlock = {
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: type as EditorBlock['type'],
      content: getDefaultContent(type),
      order: (stageBlocks[targetStage] || []).length
    };
    
    setStageBlocks(prev => ({
      ...prev,
      [targetStage]: [...(prev[targetStage] || []), newBlock]
    }));
    
    console.log('✅ EditorContext: Bloco adicionado à etapa:', targetStage, 'ID:', newBlock.id);
    return newBlock.id;
  }, [activeStageId, stageBlocks, validateStageId]);

  // ✅ ATUALIZAR BLOCO
  const updateBlock = useCallback((id: string, updates: Partial<EditorBlock>) => {
    setStageBlocks(prev => {
      const newStageBlocks = { ...prev };
      for (const stageId in newStageBlocks) {
        newStageBlocks[stageId] = newStageBlocks[stageId].map(block => 
          block.id === id ? { ...block, ...updates } : block
        );
      }
      return newStageBlocks;
    });
  }, []);

  // ✅ DELETAR BLOCO
  const deleteBlock = useCallback((id: string) => {
    setStageBlocks(prev => {
      const newStageBlocks = { ...prev };
      for (const stageId in newStageBlocks) {
        newStageBlocks[stageId] = newStageBlocks[stageId].filter(block => block.id !== id);
      }
      return newStageBlocks;
    });
    
    if (selectedBlockId === id) {
      setSelectedBlockId(null);
    }
  }, [selectedBlockId]);

  // ✅ REORDENAR BLOCOS POR ETAPA
  const reorderBlocks = useCallback((stageId: string, startIndex: number, endIndex: number) => {
    if (!validateStageId(stageId)) {
      console.warn(`🚨 EditorContext: Tentativa de reordenar blocos na etapa inválida "${stageId}"`);
      return;
    }

    setStageBlocks(prev => {
      const stageBlocksList = prev[stageId] || [];
      const result = Array.from(stageBlocksList);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      
      return {
        ...prev,
        [stageId]: result.map((block, index) => ({ ...block, order: index }))
      };
    });
  }, [validateStageId]);

  // ✅ ACESSO SEGURO AOS BLOCOS DA ETAPA
  const getBlocksForStage = useCallback((stageId: string): EditorBlock[] => {
    if (!validateStageId(stageId)) {
      console.warn(`🚨 EditorContext: Tentativa de acessar etapa inválida "${stageId}"`);
      return [];
    }
    return stageBlocks[stageId] || [];
  }, [stageBlocks, validateStageId]);

  // ✅ LIMPAR BLOCOS DA ETAPA
  const clearStageBlocks = useCallback((stageId: string) => {
    if (!validateStageId(stageId)) {
      console.warn(`🚨 EditorContext: Tentativa de limpar etapa inválida "${stageId}"`);
      return;
    }
    
    setStageBlocks(prev => ({
      ...prev,
      [stageId]: []
    }));
  }, [validateStageId]);

  const getDefaultContent = (type: string) => {
    switch (type) {
      case 'header':
        return { title: 'Novo Cabeçalho', subtitle: 'Subtítulo' };
      case 'text':
        return { text: 'Novo texto. Clique para editar.' };
      case 'image':
        return { imageUrl: '', imageAlt: 'Imagem', caption: '' };
      case 'button':
        return { buttonText: 'Clique aqui', buttonUrl: '#' };
      case 'quiz-question':
        return { 
          question: 'Nova pergunta?', 
          options: [
            { id: '1', text: 'Opção 1' },
            { id: '2', text: 'Opção 2' }
          ]
        };
      default:
        return { text: `Novo ${type}` };
    }
  };

  // ✅ DEPRECATED: Manter compatibilidade
  const blocks = stageBlocks[activeStageId] || [];

  return (
    <EditorContext.Provider value={{
      // Estado unificado
      stageBlocks,
      activeStageId,
      selectedBlockId,
      
      // Actions validadas
      actions: {
        setActiveStage,
        addBlock,
        updateBlock,
        deleteBlock,
        reorderBlocks,
        getBlocksForStage,
        setSelectedBlockId,
        clearStageBlocks
      },
      
      // Estado UI
      isPreviewing,
      setIsPreviewing,
      
      // DEPRECATED
      blocks
    }}>
      {children}
    </EditorContext.Provider>
  );
};

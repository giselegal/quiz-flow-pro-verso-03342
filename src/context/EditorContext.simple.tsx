import React, { createContext, ReactNode, useCallback, useContext, useState } from 'react';
import { EditorBlock, FunnelStage } from '../types/editor';

// ✅ CONTEXTO SIMPLIFICADO - APENAS O ESSENCIAL PARA FUNCIONAR
interface SimpleEditorContextType {
  // Estado básico
  stages: FunnelStage[];
  activeStageId: string;
  selectedBlockId: string | null;

  // Estado UI
  uiState: {
    isPreviewing: boolean;
    setIsPreviewing: (value: boolean) => void;
    viewportSize: 'sm' | 'md' | 'lg' | 'xl';
    setViewportSize: (size: 'sm' | 'md' | 'lg' | 'xl') => void;
  };

  // Actions básicas
  stageActions: {
    setActiveStage: (stageId: string) => void;
  };

  blockActions: {
    addBlock: (type: string, stageId?: string) => Promise<string>;
    addBlockAtPosition: (type: string, position: number, stageId?: string) => Promise<string>;
    updateBlock: (blockId: string, updates: Partial<EditorBlock>) => Promise<void>;
    deleteBlock: (blockId: string) => Promise<void>;
    reorderBlocks: (blockIds: string[], stageId?: string) => Promise<void>;
    setSelectedBlockId: (blockId: string | null) => void;
  };

  // Computed
  computed: {
    currentBlocks: EditorBlock[];
    selectedBlock: EditorBlock | undefined;
  };

  // Persistência simples
  persistenceActions: {
    saveFunnel: () => Promise<{ success: boolean; error?: string }>;
  };
}

const SimpleEditorContext = createContext<SimpleEditorContextType | undefined>(undefined);

export const useEditor = () => {
  const context = useContext(SimpleEditorContext);
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
};

export const EditorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  console.log('🚀 SimpleEditorProvider: Iniciando provider simplificado');
  console.log('🎯 SimpleEditorProvider: Children recebidos:', !!children);

  // Estados básicos
  const [activeStageId, setActiveStageId] = useState('step-01');
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [viewportSize, setViewportSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('lg');

  // Estados de dados
  const [stages] = useState<FunnelStage[]>([
    {
      id: 'step-01',
      name: 'Introdução',
      order: 1,
      type: 'intro',
      description: 'Etapa de introdução do funil',
      isActive: true,
      metadata: {
        blocksCount: 0,
        lastModified: new Date(),
        isCustom: false,
        templateBlocks: [],
      },
    },
  ]);

  const [stageBlocks, setStageBlocks] = useState<Record<string, EditorBlock[]>>({
    'step-01': [],
  });

  // ✅ COMPUTED VALUES
  const currentBlocks = stageBlocks[activeStageId] || [];
  const selectedBlock = currentBlocks.find(block => block.id === selectedBlockId);

  // ✅ ACTIONS SIMPLIFICADAS
  const addBlock = useCallback(async (type: string, stageId?: string): Promise<string> => {
    const targetStageId = stageId || activeStageId;
    const newBlockId = `block-${type}-${Date.now()}`;
    
    const newBlock: EditorBlock = {
      id: newBlockId,
      type: type as any,
      content: {
        text: `Novo bloco ${type}`,
      },
      properties: {},
      order: currentBlocks.length,
    };

    setStageBlocks(prev => ({
      ...prev,
      [targetStageId]: [...(prev[targetStageId] || []), newBlock],
    }));

    console.log('✅ Bloco adicionado:', newBlockId, 'tipo:', type);
    return newBlockId;
  }, [activeStageId, currentBlocks.length]);

  const updateBlock = useCallback(async (blockId: string, updates: Partial<EditorBlock>): Promise<void> => {
    setStageBlocks(prev => {
      const newStageBlocks = { ...prev };
      
      for (const stageId in newStageBlocks) {
        const blocks = newStageBlocks[stageId];
        const blockIndex = blocks.findIndex(b => b.id === blockId);
        
        if (blockIndex >= 0) {
            newStageBlocks[stageId] = [
              ...blocks.slice(0, blockIndex),
              { 
                ...blocks[blockIndex], 
                ...updates,
              },
              ...blocks.slice(blockIndex + 1),
            ];
          break;
        }
      }
      
      return newStageBlocks;
    });
    
    console.log('✅ Bloco atualizado:', blockId);
  }, []);

  const deleteBlock = useCallback(async (blockId: string): Promise<void> => {
    setStageBlocks(prev => {
      const newStageBlocks = { ...prev };
      
      for (const stageId in newStageBlocks) {
        newStageBlocks[stageId] = newStageBlocks[stageId].filter(b => b.id !== blockId);
      }
      
      return newStageBlocks;
    });

    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
    }

    console.log('✅ Bloco deletado:', blockId);
  }, [selectedBlockId]);

  const addBlockAtPosition = useCallback(async (type: string, position: number, stageId?: string): Promise<string> => {
    const targetStageId = stageId || activeStageId;
    const newBlockId = `block-${type}-${Date.now()}`;
    
    const newBlock: EditorBlock = {
      id: newBlockId,
      type: type as any,
      content: {
        text: `Novo bloco ${type}`,
      },
      properties: {},
      order: position,
    };

    setStageBlocks(prev => {
      const existingBlocks = prev[targetStageId] || [];
      const newBlocks = [...existingBlocks];
      newBlocks.splice(position, 0, newBlock);
      
      // Reordenar os orders
      newBlocks.forEach((block, index) => {
        block.order = index;
      });

      return {
        ...prev,
        [targetStageId]: newBlocks,
      };
    });

    console.log('✅ Bloco adicionado na posição:', position, 'ID:', newBlockId, 'tipo:', type);
    return newBlockId;
  }, [activeStageId]);

  const reorderBlocks = useCallback(async (blockIds: string[], stageId?: string): Promise<void> => {
    const targetStageId = stageId || activeStageId;
    
    setStageBlocks(prev => {
      const existingBlocks = prev[targetStageId] || [];
      const reorderedBlocks = blockIds.map(id => {
        const block = existingBlocks.find(b => b.id === id);
        return block;
      }).filter(Boolean) as EditorBlock[];

      // Atualizar ordem
      reorderedBlocks.forEach((block, index) => {
        block.order = index;
      });

      return {
        ...prev,
        [targetStageId]: reorderedBlocks,
      };
    });

    console.log('✅ Blocos reordenados:', blockIds.length);
  }, [activeStageId]);

  const saveFunnel = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    console.log('💾 Salvando funil...');
    // Simular salvamento
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('✅ Funil salvo com sucesso!');
    return { success: true };
  }, []);

  const contextValue: SimpleEditorContextType = {
    stages,
    activeStageId,
    selectedBlockId,
    
    uiState: {
      isPreviewing,
      setIsPreviewing,
      viewportSize,
      setViewportSize,
    },

    stageActions: {
      setActiveStage: setActiveStageId,
    },

    blockActions: {
      addBlock,
      addBlockAtPosition,
      updateBlock,
      deleteBlock,
      reorderBlocks,
      setSelectedBlockId,
    },

    computed: {
      currentBlocks,
      selectedBlock,
    },

    persistenceActions: {
      saveFunnel,
    },
  };

  console.log('✅ SimpleEditorProvider: Context value criado:', {
    stagesCount: stages.length,
    activeStageId,
    blocksCount: currentBlocks.length,
  });

  return (
    <SimpleEditorContext.Provider value={contextValue}>
      {children}
    </SimpleEditorContext.Provider>
  );
};

export default EditorProvider;
import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { EditorBlock, FunnelStage } from '@/types/editor';

// ✅ INTERFACE UNIFICADA DO CONTEXTO
interface EditorContextType {
  // ═══════════════════════════════════════════════
  // 🏗️ ESTADO CENTRALIZADO (ÚNICA FONTE DE VERDADE)
  // ═══════════════════════════════════════════════
  stages: FunnelStage[];                        // ✅ ETAPAS INTEGRADAS NO EDITOR
  activeStageId: string;                        // ✅ ETAPA ATIVA ATUAL
  selectedBlockId: string | null;               // ✅ BLOCO SELECIONADO
  
  // ═══════════════════════════════════════════════
  // 🔧 ACTIONS ORGANIZADAS POR CATEGORIA
  // ═══════════════════════════════════════════════
  stageActions: {
    setActiveStage: (stageId: string) => void;
    addStage: (stage?: Partial<FunnelStage>) => string;
    removeStage: (stageId: string) => void;
    updateStage: (stageId: string, updates: Partial<FunnelStage>) => void;
  };
  
  blockActions: {
    addBlock: (type: string, stageId?: string) => string;
    deleteBlock: (blockId: string) => void;
    updateBlock: (blockId: string, updates: Partial<EditorBlock>) => void;
    setSelectedBlockId: (blockId: string | null) => void;
    getBlocksForStage: (stageId: string) => EditorBlock[];
  };
  
  uiState: {
    isPreviewing: boolean;
    setIsPreviewing: (value: boolean) => void;
    viewportSize: 'sm' | 'md' | 'lg' | 'xl';
    setViewportSize: (size: 'sm' | 'md' | 'lg' | 'xl') => void;
  };
  
  // ═══════════════════════════════════════════════
  // 📊 COMPUTED VALUES (OTIMIZADOS)
  // ═══════════════════════════════════════════════
  computed: {
    currentBlocks: EditorBlock[];
    selectedBlock: EditorBlock | undefined;
    totalBlocks: number;
    stageCount: number;
  };
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
  console.log('🔥 EditorProvider: INICIANDO PROVIDER!');
  
  // ═══════════════════════════════════════════════
  // 🏗️ ESTADO PRINCIPAL CENTRALIZADO
  // ═══════════════════════════════════════════════
  const [stages, setStages] = useState<FunnelStage[]>(() => {
    // ✅ INICIALIZAÇÃO SÍNCRONA NO ESTADO INICIAL
    console.log('🚀 EditorProvider: Inicializando stages no useState');
    
    const stageTemplates = [
      { name: 'Introdução', type: 'intro' as const, description: 'Página de apresentação do quiz' },
      { name: 'Q1 - Profissão', type: 'question' as const, description: 'Qual é a sua profissão atual?' },
      { name: 'Q2 - Experiência', type: 'question' as const, description: 'Anos de experiência profissional' },
      { name: 'Q3 - Setor', type: 'question' as const, description: 'Em qual setor você trabalha?' },
      { name: 'Q4 - Desafios', type: 'question' as const, description: 'Principais desafios profissionais' },
      { name: 'Q5 - Objetivos', type: 'question' as const, description: 'Objetivos de carreira' },
      { name: 'Q6 - Habilidades', type: 'question' as const, description: 'Habilidades que deseja desenvolver' },
      { name: 'Q7 - Motivação', type: 'question' as const, description: 'O que mais te motiva no trabalho?' },
      { name: 'Q8 - Aprendizado', type: 'question' as const, description: 'Preferência de aprendizado' },
      { name: 'Q9 - Liderança', type: 'question' as const, description: 'Experiência em liderança' },
      { name: 'Q10 - Futuro', type: 'question' as const, description: 'Visão de futuro profissional' },
      { name: 'Transição', type: 'transition' as const, description: 'Preparando seus resultados...' },
      { name: 'Resultado 1', type: 'result' as const, description: 'Resultado Inovador' },
      { name: 'Resultado 2', type: 'result' as const, description: 'Resultado Estratégico' },
      { name: 'Resultado 3', type: 'result' as const, description: 'Resultado Executivo' },
      { name: 'Resultado 4', type: 'result' as const, description: 'Resultado Colaborativo' },
      { name: 'Resultado 5', type: 'result' as const, description: 'Resultado Técnico' },
      { name: 'Resultado 6', type: 'result' as const, description: 'Resultado Analítico' },
      { name: 'Lead Magnet', type: 'lead' as const, description: 'Captura de email' },
      { name: 'Oferta', type: 'offer' as const, description: 'Página de vendas' },
      { name: 'Finalização', type: 'final' as const, description: 'Conclusão e próximos passos' }
    ];

    const initialStages = stageTemplates.map((template, index) => ({
      id: `step-${index + 1}`,
      name: template.name,
      order: index + 1,
      type: template.type,
      description: template.description,
      isActive: index === 0,
      metadata: {
        blocksCount: 0,
        lastModified: new Date(),
        isCustom: false
      }
    }));
    
    console.log('✅ EditorProvider: 21 stages criadas no useState:', initialStages.length);
    return initialStages;
  });
  
  const [stageBlocks, setStageBlocks] = useState<Record<string, EditorBlock[]>>(() => {
    // ✅ INICIALIZAR BLOCOS VAZIOS PARA CADA ETAPA
    const initialBlocks: Record<string, EditorBlock[]> = {};
    for (let i = 1; i <= 21; i++) {
      initialBlocks[`step-${i}`] = [];
    }
    console.log('✅ EditorProvider: Blocos vazios inicializados para 21 etapas');
    return initialBlocks;
  });
  
  const [activeStageId, setActiveStageId] = useState<string>('step-1');
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  // ═══════════════════════════════════════════════
  // 🎨 UI STATE
  // ═══════════════════════════════════════════════
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [viewportSize, setViewportSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('lg');

  // ✅ DEBUG LOGGING
  console.log('📊 EditorProvider: Estado atual:', {
    stagesCount: stages.length,
    activeStageId,
    blocksKeys: Object.keys(stageBlocks).length
  });

  // ═══════════════════════════════════════════════
  // 🔍 VALIDAÇÃO E UTILITÁRIOS
  // ═══════════════════════════════════════════════
  const validateStageId = useCallback((stageId: string): boolean => {
    const isValid = stages.some(stage => stage.id === stageId);
    console.log(`🔍 EditorContext: Validando stage ${stageId}:`, isValid);
    return isValid;
  }, [stages]);

  const getStageById = useCallback((stageId: string): FunnelStage | undefined => {
    return stages.find(stage => stage.id === stageId);
  }, [stages]);

  // ═══════════════════════════════════════════════
  // 🎯 STAGE ACTIONS (GERENCIAMENTO DE ETAPAS)
  // ═══════════════════════════════════════════════
  const setActiveStage = useCallback((stageId: string) => {
    console.log('🔄 EditorContext: Mudando etapa ativa para:', stageId);
    
    if (!validateStageId(stageId)) {
      console.warn('⚠️ EditorContext: Etapa inválida:', stageId);
      return;
    }
    
    setActiveStageId(stageId);
    setSelectedBlockId(null);
    console.log('✅ EditorContext: Etapa ativa alterada para:', stageId);
  }, [validateStageId]);

  const addStage = useCallback((stageData?: Partial<FunnelStage>): string => {
    const newStageId = `step-${stages.length + 1}`;
    const newStage: FunnelStage = {
      id: newStageId,
      name: stageData?.name || `Nova Etapa ${stages.length + 1}`,
      order: stages.length + 1,
      type: stageData?.type || 'question',
      description: stageData?.description || 'Nova etapa personalizada',
      isActive: false,
      metadata: {
        blocksCount: 0,
        lastModified: new Date(),
        isCustom: true
      }
    };

    setStages(prev => [...prev, newStage]);
    setStageBlocks(prev => ({ ...prev, [newStageId]: [] }));
    
    console.log('➕ EditorContext: Nova etapa adicionada:', newStageId);
    return newStageId;
  }, [stages.length]);

  const removeStage = useCallback((stageId: string) => {
    if (!validateStageId(stageId)) {
      console.warn('⚠️ EditorContext: Tentativa de remover etapa inválida:', stageId);
      return;
    }

    setStages(prev => prev.filter(stage => stage.id !== stageId));
    setStageBlocks(prev => {
      const updated = { ...prev };
      delete updated[stageId];
      return updated;
    });

    if (activeStageId === stageId) {
      const remainingStages = stages.filter(stage => stage.id !== stageId);
      if (remainingStages.length > 0) {
        setActiveStageId(remainingStages[0].id);
      }
    }

    console.log('🗑️ EditorContext: Etapa removida:', stageId);
  }, [validateStageId, activeStageId, stages]);

  const updateStage = useCallback((stageId: string, updates: Partial<FunnelStage>) => {
    if (!validateStageId(stageId)) {
      console.warn('⚠️ EditorContext: Tentativa de atualizar etapa inválida:', stageId);
      return;
    }

    setStages(prev => prev.map(stage => 
      stage.id === stageId 
        ? { ...stage, ...updates, metadata: { ...stage.metadata, lastModified: new Date() } }
        : stage
    ));

    console.log('📝 EditorContext: Etapa atualizada:', stageId, updates);
  }, [validateStageId]);

  // ═══════════════════════════════════════════════
  // 🧩 BLOCK ACTIONS (GERENCIAMENTO DE BLOCOS)
  // ═══════════════════════════════════════════════
  const addBlock = useCallback((type: string, targetStageId?: string): string => {
    const stageId = targetStageId || activeStageId;
    
    if (!validateStageId(stageId)) {
      console.warn('⚠️ EditorContext: Tentativa de adicionar bloco em etapa inválida:', stageId);
      return '';
    }

    const blockId = `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const currentStageBlocks = stageBlocks[stageId] || [];
    
    const newBlock: EditorBlock = {
      id: blockId,
      type: type as any,
      content: { text: `Novo ${type}`, title: `Título do ${type}` },
      order: currentStageBlocks.length + 1,
      properties: {}
    };

    setStageBlocks(prev => ({
      ...prev,
      [stageId]: [...(prev[stageId] || []), newBlock]
    }));

    updateStage(stageId, { 
      metadata: { 
        ...getStageById(stageId)?.metadata,
        blocksCount: currentStageBlocks.length + 1 
      }
    });

    console.log('➕ EditorContext: Bloco adicionado:', blockId, 'tipo:', type, 'etapa:', stageId);
    return blockId;
  }, [activeStageId, validateStageId, stageBlocks, updateStage, getStageById]);

  const deleteBlock = useCallback((blockId: string) => {
    let deletedFromStage = '';
    
    setStageBlocks(prev => {
      const updated = { ...prev };
      
      for (const stageId in updated) {
        const blocks = updated[stageId];
        const blockIndex = blocks.findIndex(block => block.id === blockId);
        
        if (blockIndex !== -1) {
          updated[stageId] = blocks.filter(block => block.id !== blockId);
          deletedFromStage = stageId;
          break;
        }
      }
      
      return updated;
    });

    if (deletedFromStage) {
      const stage = getStageById(deletedFromStage);
      if (stage) {
        updateStage(deletedFromStage, {
          metadata: {
            ...stage.metadata,
            blocksCount: Math.max(0, (stage.metadata?.blocksCount || 1) - 1)
          }
        });
      }
    }

    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
    }

    console.log('🗑️ EditorContext: Bloco removido:', blockId, 'da etapa:', deletedFromStage);
  }, [selectedBlockId, getStageById, updateStage]);

  const updateBlock = useCallback((blockId: string, updates: Partial<EditorBlock>) => {
    setStageBlocks(prev => {
      const updated = { ...prev };
      
      for (const stageId in updated) {
        const blocks = updated[stageId];
        const blockIndex = blocks.findIndex(block => block.id === blockId);
        
        if (blockIndex !== -1) {
          updated[stageId] = blocks.map(block => 
            block.id === blockId 
              ? { ...block, ...updates }
              : block
          );
          break;
        }
      }
      
      return updated;
    });

    console.log('📝 EditorContext: Bloco atualizado:', blockId, updates);
  }, []);

  const getBlocksForStage = useCallback((stageId: string): EditorBlock[] => {
    const blocks = stageBlocks[stageId] || [];
    console.log(`📦 EditorContext: Obtendo blocos para etapa ${stageId}:`, blocks.length);
    return blocks;
  }, [stageBlocks]);

  // ═══════════════════════════════════════════════
  // 📊 COMPUTED VALUES (PERFORMANCE OTIMIZADA)
  // ═══════════════════════════════════════════════
  const currentBlocks = getBlocksForStage(activeStageId);
  const selectedBlock = selectedBlockId 
    ? currentBlocks.find(block => block.id === selectedBlockId)
    : undefined;
  const totalBlocks = Object.values(stageBlocks).reduce((total, blocks) => total + blocks.length, 0);
  const stageCount = stages.length;

  // Debug logging para computed values
  console.log('📊 EditorContext: Computed values:', {
    activeStageId,
    currentBlocks: currentBlocks.length,
    selectedBlock: selectedBlock?.id || 'none',
    totalBlocks,
    stageCount
  });

  // ═══════════════════════════════════════════════
  // 🎯 CONTEXT VALUE (INTERFACE COMPLETA)
  // ═══════════════════════════════════════════════
  const contextValue: EditorContextType = {
    stages,
    activeStageId,
    selectedBlockId,
    
    stageActions: {
      setActiveStage,
      addStage,
      removeStage,
      updateStage
    },
    
    blockActions: {
      addBlock,
      deleteBlock,
      updateBlock,
      setSelectedBlockId,
      getBlocksForStage
    },
    
    uiState: {
      isPreviewing,
      setIsPreviewing,
      viewportSize,
      setViewportSize
    },
    
    computed: {
      currentBlocks,
      selectedBlock,
      totalBlocks,
      stageCount
    }
  };

  console.log('🎯 EditorContext: Providing context value com', stages.length, 'etapas');

  return (
    <EditorContext.Provider value={contextValue}>
      {children}
    </EditorContext.Provider>
  );
};

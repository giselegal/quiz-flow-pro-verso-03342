
import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { EditorBlock } from '@/types/editor';

// ✅ INTERFACE UNIFICADA DO CONTEXTO
interface EditorContextType {
  // ═══════════════════════════════════════════════
  // 🏗️ ESTADO CENTRALIZADO (ÚNICA FONTE DE VERDADE)
  // ═══════════════════════════════════════════════
  stages: FunnelStage[];                        // ✅ ETAPAS INTEGRADAS NO EDITOR
  stageBlocks: Record<string, EditorBlock[]>;   // ✅ BLOCOS POR ETAPA
  activeStageId: string;                        // ✅ ETAPA ATIVA
  selectedBlockId: string | null;              // ✅ BLOCO SELECIONADO
  
  // ═══════════════════════════════════════════════
  // 🎯 ACTIONS PARA GERENCIAMENTO DE ETAPAS
  // ═══════════════════════════════════════════════
  stageActions: {
    initializeStages: () => void;              // ✅ INICIALIZAR 21 ETAPAS
    setActiveStage: (stageId: string) => void; // ✅ SELECIONAR ETAPA
    addStage: () => string;                    // ✅ ADICIONAR NOVA ETAPA
    removeStage: (stageId: string) => void;    // ✅ REMOVER ETAPA
    updateStage: (stageId: string, updates: Partial<FunnelStage>) => void; // ✅ ATUALIZAR ETAPA
    getStageById: (stageId: string) => FunnelStage | undefined; // ✅ BUSCAR ETAPA
  };
  
  // ═══════════════════════════════════════════════
  // 🧩 ACTIONS PARA GERENCIAMENTO DE BLOCOS
  // ═══════════════════════════════════════════════
  blockActions: {
    addBlock: (type: string, stageId?: string) => string;           // ✅ ADICIONAR BLOCO
    updateBlock: (id: string, updates: Partial<EditorBlock>) => void; // ✅ ATUALIZAR BLOCO
    deleteBlock: (id: string) => void;                             // ✅ DELETAR BLOCO
    reorderBlocks: (stageId: string, startIndex: number, endIndex: number) => void; // ✅ REORDENAR
    getBlocksForStage: (stageId: string) => EditorBlock[];         // ✅ OBTER BLOCOS
    clearStageBlocks: (stageId: string) => void;                   // ✅ LIMPAR BLOCOS
    setSelectedBlockId: (id: string | null) => void;              // ✅ SELECIONAR BLOCO
  };
  
  // ═══════════════════════════════════════════════
  // 🎨 ESTADO DE UI
  // ═══════════════════════════════════════════════
  uiState: {
    isPreviewing: boolean;
    setIsPreviewing: (preview: boolean) => void;
    viewportSize: 'sm' | 'md' | 'lg' | 'xl';
    setViewportSize: (size: 'sm' | 'md' | 'lg' | 'xl') => void;
  };
  
  // ═══════════════════════════════════════════════
  // 📊 ESTATÍSTICAS E COMPUTED VALUES
  // ═══════════════════════════════════════════════
  computed: {
    currentBlocks: EditorBlock[];               // ✅ BLOCOS DA ETAPA ATIVA
    selectedBlock: EditorBlock | undefined;     // ✅ BLOCO SELECIONADO
    totalBlocks: number;                        // ✅ TOTAL DE BLOCOS
    stageCount: number;                         // ✅ NÚMERO DE ETAPAS
  };
  
  // ═══════════════════════════════════════════════
  // 🔧 COMPATIBILITY (DEPRECATED)
  // ═══════════════════════════════════════════════
  blocks: EditorBlock[];  // ✅ MANTIDO PARA COMPATIBILIDADE
}

// ✅ INTERFACE DA ETAPA DO FUNIL
interface FunnelStage {
  id: string;
  name: string;
  order: number;
  type: 'intro' | 'question' | 'transition' | 'result' | 'lead' | 'offer' | 'final';
  description: string;
  isActive: boolean;
  metadata?: {
    blocksCount?: number;
    lastModified?: Date;
    isCustom?: boolean;
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
  // ═══════════════════════════════════════════════
  // 🏗️ ESTADO PRINCIPAL
  // ═══════════════════════════════════════════════
  const [stages, setStages] = useState<FunnelStage[]>([]);
  const [stageBlocks, setStageBlocks] = useState<Record<string, EditorBlock[]>>({});
  const [activeStageId, setActiveStageId] = useState<string>('step-1');
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  
  // ═══════════════════════════════════════════════
  // 🎨 UI STATE
  // ═══════════════════════════════════════════════
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [viewportSize, setViewportSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('lg');

  // ═══════════════════════════════════════════════
  // 🚀 INICIALIZAÇÃO AUTOMÁTICA DAS 21 ETAPAS
  // ═══════════════════════════════════════════════
  const create21DefaultStages = useCallback((): FunnelStage[] => {
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

    return stageTemplates.map((template, index) => ({
      id: `step-${index + 1}`,
      name: template.name,
      order: index + 1,
      type: template.type,
      description: template.description,
      isActive: index === 0, // Primeira etapa ativa
      metadata: {
        blocksCount: 0,
        lastModified: new Date(),
        isCustom: false
      }
    }));
  }, []);

  // ✅ INICIALIZAÇÃO AUTOMÁTICA NO MOUNT
  const initializeStages = useCallback(() => {
    console.log('🚀 EditorContext: Inicializando 21 etapas automaticamente...');
    const defaultStages = create21DefaultStages();
    setStages(defaultStages);
    
    // Inicializar blocos vazios para cada etapa
    const initialBlocks: Record<string, EditorBlock[]> = {};
    defaultStages.forEach(stage => {
      initialBlocks[stage.id] = [];
    });
    setStageBlocks(initialBlocks);
    
    console.log('✅ EditorContext: 21 etapas inicializadas com sucesso');
  }, [create21DefaultStages]);

  // ✅ AUTO-INICIALIZAÇÃO NO PRIMEIRO RENDER
  useEffect(() => {
    if (stages.length === 0) {
      initializeStages();
    }
  }, [stages.length, initializeStages]);

  // ═══════════════════════════════════════════════
  // 🔍 VALIDAÇÃO E UTILITÁRIOS
  // ═══════════════════════════════════════════════
  const validateStageId = useCallback((stageId: string): boolean => {
    return stages.some(stage => stage.id === stageId);
  }, [stages]);

  const getStageById = useCallback((stageId: string): FunnelStage | undefined => {
    return stages.find(stage => stage.id === stageId);
  }, [stages]);

  // ═══════════════════════════════════════════════
  // 🎯 STAGE ACTIONS
  // ═══════════════════════════════════════════════
  const setActiveStage = useCallback((stageId: string) => {
    if (!validateStageId(stageId)) {
      console.warn(`🚨 EditorContext: Etapa inválida "${stageId}"`);
      return;
    }
    
    console.log('🔄 EditorContext: Mudando para etapa:', stageId);
    
    // Atualizar state das etapas
    setStages(prev => prev.map(stage => ({
      ...stage,
      isActive: stage.id === stageId
    })));
    
    setActiveStageId(stageId);
    setSelectedBlockId(null); // Reset seleção de bloco
  }, [validateStageId]);

  const addStage = useCallback((): string => {
    const newStageId = `step-${stages.length + 1}`;
    const newStage: FunnelStage = {
      id: newStageId,
      name: `Etapa ${stages.length + 1}`,
      order: stages.length + 1,
      type: 'question',
      description: 'Nova etapa criada',
      isActive: false,
      metadata: {
        blocksCount: 0,
        lastModified: new Date(),
        isCustom: true
      }
    };
    
    setStages(prev => [...prev, newStage]);
    setStageBlocks(prev => ({ ...prev, [newStageId]: [] }));
    
    console.log('✅ EditorContext: Nova etapa adicionada:', newStageId);
    return newStageId;
  }, [stages.length]);

  const removeStage = useCallback((stageId: string) => {
    if (!validateStageId(stageId)) {
      console.warn(`🚨 EditorContext: Tentativa de remover etapa inválida "${stageId}"`);
      return;
    }
    
    // Não permitir remoção se só há uma etapa
    if (stages.length <= 1) {
      console.warn('🚨 EditorContext: Não é possível remover a última etapa');
      return;
    }
    
    setStages(prev => prev.filter(stage => stage.id !== stageId));
    setStageBlocks(prev => {
      const newBlocks = { ...prev };
      delete newBlocks[stageId];
      return newBlocks;
    });
    
    // Se a etapa ativa foi removida, ativar a primeira
    if (activeStageId === stageId) {
      const remainingStages = stages.filter(stage => stage.id !== stageId);
      if (remainingStages.length > 0) {
        setActiveStage(remainingStages[0].id);
      }
    }
    
    console.log('✅ EditorContext: Etapa removida:', stageId);
  }, [validateStageId, stages, activeStageId, setActiveStage]);

  const updateStage = useCallback((stageId: string, updates: Partial<FunnelStage>) => {
    if (!validateStageId(stageId)) {
      console.warn(`🚨 EditorContext: Tentativa de atualizar etapa inválida "${stageId}"`);
      return;
    }
    
    setStages(prev => prev.map(stage => 
      stage.id === stageId 
        ? { 
            ...stage, 
            ...updates,
            metadata: {
              ...stage.metadata,
              ...updates.metadata,
              lastModified: new Date()
            }
          }
        : stage
    ));
    
    console.log('✅ EditorContext: Etapa atualizada:', stageId, updates);
  }, [validateStageId]);

  // ═══════════════════════════════════════════════
  // 🧩 BLOCK ACTIONS
  // ═══════════════════════════════════════════════
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
    
    // Atualizar contador de blocos na etapa
    updateStage(targetStage, {
      metadata: {
        blocksCount: (stageBlocks[targetStage] || []).length + 1
      }
    });
    
    console.log('✅ EditorContext: Bloco adicionado à etapa:', targetStage, 'ID:', newBlock.id);
    return newBlock.id;
  }, [activeStageId, stageBlocks, validateStageId, updateStage]);

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

  const deleteBlock = useCallback((id: string) => {
    setStageBlocks(prev => {
      const newStageBlocks = { ...prev };
      for (const stageId in newStageBlocks) {
        const originalLength = newStageBlocks[stageId].length;
        newStageBlocks[stageId] = newStageBlocks[stageId].filter(block => block.id !== id);
        
        // Se algum bloco foi removido, atualizar contador
        if (newStageBlocks[stageId].length !== originalLength) {
          updateStage(stageId, {
            metadata: { blocksCount: newStageBlocks[stageId].length }
          });
        }
      }
      return newStageBlocks;
    });
    
    if (selectedBlockId === id) {
      setSelectedBlockId(null);
    }
  }, [selectedBlockId, updateStage]);

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

  const getBlocksForStage = useCallback((stageId: string): EditorBlock[] => {
    if (!validateStageId(stageId)) {
      console.warn(`🚨 EditorContext: Tentativa de acessar etapa inválida "${stageId}"`);
      return [];
    }
    return stageBlocks[stageId] || [];
  }, [stageBlocks, validateStageId]);

  const clearStageBlocks = useCallback((stageId: string) => {
    if (!validateStageId(stageId)) {
      console.warn(`🚨 EditorContext: Tentativa de limpar etapa inválida "${stageId}"`);
      return;
    }
    
    setStageBlocks(prev => ({ ...prev, [stageId]: [] }));
    updateStage(stageId, { metadata: { blocksCount: 0 } });
  }, [validateStageId, updateStage]);

  // ═══════════════════════════════════════════════
  // 🎨 CONTEÚDO PADRÃO PARA BLOCOS
  // ═══════════════════════════════════════════════
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

  // ═══════════════════════════════════════════════
  // 📊 COMPUTED VALUES
  // ═══════════════════════════════════════════════
  const currentBlocks = getBlocksForStage(activeStageId);
  const selectedBlock = currentBlocks.find(block => block.id === selectedBlockId);
  const totalBlocks = Object.values(stageBlocks).reduce((sum, blocks) => sum + blocks.length, 0);
  const stageCount = stages.length;

  // ═══════════════════════════════════════════════
  // 🔧 COMPATIBILITY (DEPRECATED)
  // ═══════════════════════════════════════════════
  const blocks = currentBlocks; // Para compatibilidade

  return (
    <EditorContext.Provider value={{
      // Estado centralizado
      stages,
      stageBlocks,
      activeStageId,
      selectedBlockId,
      
      // Stage actions
      stageActions: {
        initializeStages,
        setActiveStage,
        addStage,
        removeStage,
        updateStage,
        getStageById
      },
      
      // Block actions
      blockActions: {
        addBlock,
        updateBlock,
        deleteBlock,
        reorderBlocks,
        getBlocksForStage,
        clearStageBlocks,
        setSelectedBlockId
      },
      
      // UI State
      uiState: {
        isPreviewing,
        setIsPreviewing,
        viewportSize,
        setViewportSize
      },
      
      // Computed values
      computed: {
        currentBlocks,
        selectedBlock,
        totalBlocks,
        stageCount
      },
      
      // DEPRECATED - compatibility
      blocks
    }}>
      {children}
    </EditorContext.Provider>
  );
};

// ✅ EXPORT DO TIPO DA ETAPA PARA USO EXTERNO
export type { FunnelStage };
export type { EditorContextType };

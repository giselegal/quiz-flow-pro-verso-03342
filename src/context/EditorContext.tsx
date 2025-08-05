import { createEditorAdapter } from "@/adapters/EditorDatabaseAdapter";
import { getAllSteps, getStepTemplate } from "@/config/stepTemplatesMapping";
import { EditorBlock, FunnelStage } from "@/types/editor";
import React, { createContext, ReactNode, useCallback, useContext, useState } from "react";

// ✅ INTERFACE UNIFICADA DO CONTEXTO
interface EditorContextType {
  // ═══════════════════════════════════════════════
  // 🏗️ ESTADO CENTRALIZADO (ÚNICA FONTE DE VERDADE)
  // ═══════════════════════════════════════════════
  stages: FunnelStage[]; // ✅ ETAPAS INTEGRADAS NO EDITOR
  activeStageId: string; // ✅ ETAPA ATIVA ATUAL
  selectedBlockId: string | null; // ✅ BLOCO SELECIONADO

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
    addBlockAtPosition: (type: string, position: number, stageId?: string) => string;
    duplicateBlock: (blockId: string, stageId?: string) => string;
    deleteBlock: (blockId: string) => void;
    updateBlock: (blockId: string, updates: Partial<EditorBlock>) => void;
    reorderBlocks: (blockIds: string[], stageId?: string) => void;
    setSelectedBlockId: (blockId: string | null) => void;
    getBlocksForStage: (stageId: string) => EditorBlock[];
  };

  uiState: {
    isPreviewing: boolean;
    setIsPreviewing: (value: boolean) => void;
    viewportSize: "sm" | "md" | "lg" | "xl";
    setViewportSize: (size: "sm" | "md" | "lg" | "xl") => void;
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

  // ═══════════════════════════════════════════════
  // 📊 COMPUTED VALUES (PERFORMANCE OTIMIZADA)
  // ═══════════════════════════════════════════════
  const currentBlocks = getBlocksForStage(activeStageId);
  const selectedBlock = selectedBlockId
    ? currentBlocks.find(block => block.id === selectedBlockId)
    : undefined;
  const totalBlocks = Object.values(stageBlocks).reduce(
    (total, blocks) => total + blocks.length,
    0
  );
  const stageCount = stages.length;

  // ═══════════════════════════════════════════════
  // 🔌 FUNÇÕES DO MODO BANCO DE DADOS
  // ═══════════════════════════════════════════════

  const setDatabaseMode = useCallback(
    (enabled: boolean) => {
      console.log(`🔧 EditorContext: Modo banco ${enabled ? "ativado" : "desativado"}`);
      setDatabaseModeEnabled(enabled);
      adapter.setDatabaseMode(enabled);
    },
    [adapter]
  );

  const setQuizId = useCallback(
    (quizId: string) => {
      console.log(`🔧 EditorContext: Quiz ID alterado para: ${quizId}`);
      setCurrentQuizId(quizId);
      adapter.setQuizId(quizId);
    },
    [adapter]
  );

  const migrateToDatabase = useCallback(async (): Promise<boolean> => {
    console.log("🚀 EditorContext: Iniciando migração para banco...");
    try {
      const success = await adapter.migrateLocalToDatabase();
      if (success) {
        setDatabaseModeEnabled(true);
        adapter.setDatabaseMode(true);
        console.log("✅ EditorContext: Migração concluída, modo banco ativado");
      }
      return success;
    } catch (error) {
      console.error("❌ EditorContext: Erro na migração:", error);
      return false;
    }
  }, [adapter]);

  const getStats = useCallback(async () => {
    try {
      return await adapter.getQuizStats();
    } catch (error) {
      console.error("❌ EditorContext: Erro ao obter estatísticas:", error);
      return { error: String(error) };
    }
  }, [adapter]);

  // Debug logging para computed values
  console.log("📊 EditorContext: Computed values:", {
    activeStageId,
    currentBlocks: currentBlocks.length,
    selectedBlock: selectedBlock?.id || "none",
    totalBlocks,
    stageCount,
    databaseMode: databaseModeEnabled,
    quizId: currentQuizId,
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
      updateStage,
    },

    blockActions: {
      addBlock,
      addBlockAtPosition,
      duplicateBlock,
      deleteBlock,
      updateBlock,
      reorderBlocks,
      setSelectedBlockId,
      getBlocksForStage,
    },

    uiState: {
      isPreviewing,
      setIsPreviewing,
      viewportSize,
      setViewportSize,
    },

    computed: {
      currentBlocks,
      selectedBlock,
      totalBlocks,
      stageCount,
    },

    databaseMode: {
      isEnabled: databaseModeEnabled,
      quizId: currentQuizId,
      setDatabaseMode,
      setQuizId,
      migrateToDatabase,
      getStats,
    },
  };

  console.log("🎯 EditorContext: Providing context value com", stages.length, "etapas");

  return <EditorContext.Provider value={contextValue}>{children}</EditorContext.Provider>;
};

// Adicionar após linha 160
const [isInitialized, setIsInitialized] = useState(false);

// Adicionar useEffect para controlar inicialização
useEffect(() => {
  if (stages.length === 21 && !isInitialized) {
    console.log("✅ EditorProvider: Todas as 21 etapas inicializadas");
    setIsInitialized(true);
  }
}, [stages.length, isInitialized]);

// Adicionar ao contexto (linha 691)
const contextValue = {
  stages,
  activeStageId,
  selectedBlockId,
  isInitialized, // ← ADICIONAR ESTA LINHA
  stageActions: {
    setActiveStage,
    addStage,
    removeStage,
    updateStage,
  },

  blockActions: {
    addBlock,
    addBlockAtPosition,
    duplicateBlock,
    deleteBlock,
    updateBlock,
    reorderBlocks,
    setSelectedBlockId,
    getBlocksForStage,
  },

  uiState: {
    isPreviewing,
    setIsPreviewing,
    viewportSize,
    setViewportSize,
  },

  computed: {
    currentBlocks,
    selectedBlock,
    totalBlocks,
    stageCount,
  },

  databaseMode: {
    isEnabled: databaseModeEnabled,
    quizId: currentQuizId,
    setDatabaseMode,
    setQuizId,
    migrateToDatabase,
    getStats,
  },
  isInitialized,
};

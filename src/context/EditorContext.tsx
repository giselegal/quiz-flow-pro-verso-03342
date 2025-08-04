import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from "react";
import { EditorBlock, FunnelStage } from "@/types/editor";
import {
  getStepTemplate,
  getStepInfo,
  getAllSteps,
} from "@/config/stepTemplatesMapping";

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
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error("useEditor must be used within an EditorProvider");
  }
  return context;
};

export const EditorProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  console.log("🔥 EditorProvider: INICIANDO PROVIDER!");

  // ═══════════════════════════════════════════════
  // 🏗️ ESTADO PRINCIPAL CENTRALIZADO
  // ═══════════════════════════════════════════════
  const [stages, setStages] = useState<FunnelStage[]>(() => {
    // ✅ INICIALIZAÇÃO SÍNCRONA NO ESTADO INICIAL COM TEMPLATES ESPECÍFICOS
    console.log(
      "🚀 EditorProvider: Inicializando stages com templates específicos",
    );

    // ✅ USAR TEMPLATES ESPECÍFICOS DAS ETAPAS
    const allStepTemplates = getAllSteps();
    console.log(
      "📋 EditorProvider: Templates carregados:",
      allStepTemplates.length,
    );

    const initialStages = allStepTemplates.map((stepTemplate, index) => ({
      id: `step-${stepTemplate.stepNumber}`,
      name: stepTemplate.name,
      order: stepTemplate.stepNumber,
      type:
        stepTemplate.stepNumber === 1
          ? ("intro" as const)
          : stepTemplate.stepNumber <= 14
            ? ("question" as const)
            : stepTemplate.stepNumber === 15
              ? ("transition" as const)
              : stepTemplate.stepNumber === 16
                ? ("processing" as const)
                : stepTemplate.stepNumber >= 17 && stepTemplate.stepNumber <= 19
                  ? ("result" as const)
                  : stepTemplate.stepNumber === 20
                    ? ("lead" as const)
                    : ("offer" as const),
      description: stepTemplate.description,
      isActive: stepTemplate.stepNumber === 1,
      metadata: {
        blocksCount: 0,
        lastModified: new Date(),
        isCustom: false,
        templateBlocks: getStepTemplate(stepTemplate.stepNumber), // ✅ CARREGAR BLOCOS DO TEMPLATE
      },
    }));

    console.log(
      "✅ EditorProvider: 21 stages criadas com templates específicos:",
      initialStages.length,
    );
    return initialStages;
  });

  const [stageBlocks, setStageBlocks] = useState<Record<string, EditorBlock[]>>(
    () => {
      // ✅ INICIALIZAR BLOCOS VAZIOS PARA CADA ETAPA
      const initialBlocks: Record<string, EditorBlock[]> = {};
      for (let i = 1; i <= 21; i++) {
        initialBlocks[`step-${i}`] = [];
      }
      console.log(
        "✅ EditorProvider: Blocos vazios inicializados para 21 etapas",
      );
      return initialBlocks;
    },
  );

  const [activeStageId, setActiveStageId] = useState<string>("step-1");
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  // ═══════════════════════════════════════════════
  // 🎨 UI STATE
  // ═══════════════════════════════════════════════
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [viewportSize, setViewportSize] = useState<"sm" | "md" | "lg" | "xl">(
    "lg",
  );

  // ✅ DEBUG LOGGING
  console.log("📊 EditorProvider: Estado atual:", {
    stagesCount: stages.length,
    activeStageId,
    blocksKeys: Object.keys(stageBlocks).length,
  });

  // ═══════════════════════════════════════════════
  // 🔍 VALIDAÇÃO E UTILITÁRIOS
  // ═══════════════════════════════════════════════
  const validateStageId = useCallback(
    (stageId: string): boolean => {
      const isValid = stages.some((stage) => stage.id === stageId);
      console.log(`🔍 EditorContext: Validando stage ${stageId}:`, isValid);
      return isValid;
    },
    [stages],
  );

  const getStageById = useCallback(
    (stageId: string): FunnelStage | undefined => {
      return stages.find((stage) => stage.id === stageId);
    },
    [stages],
  );

  // ═══════════════════════════════════════════════
  // 🎯 STAGE ACTIONS (GERENCIAMENTO DE ETAPAS)
  // ═══════════════════════════════════════════════

  const setActiveStage = useCallback(
    (stageId: string) => {
      console.log("🔄 EditorContext: Mudando etapa ativa para:", stageId);

      if (!validateStageId(stageId)) {
        console.warn("⚠️ EditorContext: Etapa inválida:", stageId);
        return;
      }

      setActiveStageId(stageId);
      setSelectedBlockId(null);

      // ✅ CARREGAR TEMPLATE SE A ETAPA ESTIVER VAZIA
      const currentBlocks = stageBlocks[stageId] || [];
      if (currentBlocks.length === 0) {
        console.log(
          `🎨 EditorContext: Etapa ${stageId} vazia, carregando template...`,
        );
        // Usar timeout para garantir que updateStage esteja disponível
        setTimeout(() => loadStageTemplate(stageId), 0);
      }

      console.log("✅ EditorContext: Etapa ativa alterada para:", stageId);
    },
    [validateStageId, stageBlocks],
  );

  const addStage = useCallback(
    (stageData?: Partial<FunnelStage>): string => {
      const newStageId = `step-${stages.length + 1}`;
      const newStage: FunnelStage = {
        id: newStageId,
        name: stageData?.name || `Nova Etapa ${stages.length + 1}`,
        order: stages.length + 1,
        type: stageData?.type || "question",
        description: stageData?.description || "Nova etapa personalizada",
        isActive: false,
        metadata: {
          blocksCount: 0,
          lastModified: new Date(),
          isCustom: true,
        },
      };

      setStages((prev) => [...prev, newStage]);
      setStageBlocks((prev) => ({ ...prev, [newStageId]: [] }));

      console.log("➕ EditorContext: Nova etapa adicionada:", newStageId);
      return newStageId;
    },
    [stages.length],
  );

  const removeStage = useCallback(
    (stageId: string) => {
      if (!validateStageId(stageId)) {
        console.warn(
          "⚠️ EditorContext: Tentativa de remover etapa inválida:",
          stageId,
        );
        return;
      }

      setStages((prev) => prev.filter((stage) => stage.id !== stageId));
      setStageBlocks((prev) => {
        const updated = { ...prev };
        delete updated[stageId];
        return updated;
      });

      if (activeStageId === stageId) {
        const remainingStages = stages.filter((stage) => stage.id !== stageId);
        if (remainingStages.length > 0) {
          setActiveStageId(remainingStages[0].id);
        }
      }

      console.log("🗑️ EditorContext: Etapa removida:", stageId);
    },
    [validateStageId, activeStageId, stages],
  );

  const updateStage = useCallback(
    (stageId: string, updates: Partial<FunnelStage>) => {
      if (!validateStageId(stageId)) {
        console.warn(
          "⚠️ EditorContext: Tentativa de atualizar etapa inválida:",
          stageId,
        );
        return;
      }

      setStages((prev) =>
        prev.map((stage) =>
          stage.id === stageId
            ? {
                ...stage,
                ...updates,
                metadata: { ...stage.metadata, lastModified: new Date() },
              }
            : stage,
        ),
      );

      console.log("📝 EditorContext: Etapa atualizada:", stageId, updates);
    },
    [validateStageId],
  );

  // ✅ FUNÇÃO PARA CARREGAR BLOCOS DE TEMPLATE
  const loadStageTemplate = useCallback(
    (stageId: string) => {
      const stage = stages.find((s) => s.id === stageId);
      if (!stage) return;

      const stepNumber = parseInt(stageId.replace("step-", ""));
      const templateBlocks = getStepTemplate(stepNumber);

      if (templateBlocks && templateBlocks.length > 0) {
        console.log(
          `🎨 EditorContext: Carregando ${templateBlocks.length} blocos de template para etapa ${stepNumber}`,
        );

        // Converter blocos de template para EditorBlocks
        const editorBlocks: EditorBlock[] = templateBlocks.map(
          (block, index) => ({
            id: `${stageId}-block-${index + 1}`,
            type: block.type as any,
            content: block.properties || block.content || {},
            order: index + 1,
            properties: block.properties || {},
          }),
        );

        // Atualizar os blocos da etapa
        setStageBlocks((prev) => ({
          ...prev,
          [stageId]: editorBlocks,
        }));

        // Atualizar contagem de blocos na metadata
        updateStage(stageId, {
          metadata: {
            ...stage.metadata,
            blocksCount: editorBlocks.length,
          },
        });

        console.log(
          `✅ EditorContext: ${editorBlocks.length} blocos carregados para etapa ${stepNumber}`,
        );
      }
    },
    [stages, updateStage],
  );

  // ═══════════════════════════════════════════════
  // 🧩 BLOCK ACTIONS (GERENCIAMENTO DE BLOCOS)
  // ═══════════════════════════════════════════════
  const addBlock = useCallback(
    (type: string, targetStageId?: string): string => {
      const stageId = targetStageId || activeStageId;

      if (!validateStageId(stageId)) {
        console.warn(
          "⚠️ EditorContext: Tentativa de adicionar bloco em etapa inválida:",
          stageId,
        );
        return "";
      }

      const blockId = `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const currentStageBlocks = stageBlocks[stageId] || [];

      const newBlock: EditorBlock = {
        id: blockId,
        type: type as any,
        content: { text: `Novo ${type}`, title: `Título do ${type}` },
        order: currentStageBlocks.length + 1,
        properties: {},
      };

      setStageBlocks((prev) => ({
        ...prev,
        [stageId]: [...(prev[stageId] || []), newBlock],
      }));

      updateStage(stageId, {
        metadata: {
          ...getStageById(stageId)?.metadata,
          blocksCount: currentStageBlocks.length + 1,
        },
      });

      console.log(
        "➕ EditorContext: Bloco adicionado:",
        blockId,
        "tipo:",
        type,
        "etapa:",
        stageId,
      );
      return blockId;
    },
    [activeStageId, validateStageId, stageBlocks, updateStage, getStageById],
  );

  const addBlockAtPosition = useCallback(
    (type: string, position: number, targetStageId?: string): string => {
      const stageId = targetStageId || activeStageId;

      if (!validateStageId(stageId)) {
        console.warn(
          "⚠️ EditorContext: Tentativa de adicionar bloco em etapa inválida:",
          stageId,
        );
        return "";
      }

      const blockId = `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const currentStageBlocks = stageBlocks[stageId] || [];

      const newBlock: EditorBlock = {
        id: blockId,
        type: type as any,
        content: { text: `Novo ${type}`, title: `Título do ${type}` },
        order: position + 1, // order baseado na posição
        properties: {},
      };

      // Inserir o bloco na posição específica
      const updatedBlocks = [...currentStageBlocks];
      updatedBlocks.splice(position, 0, newBlock);

      // Reordenar os outros blocos
      const reorderedBlocks = updatedBlocks.map((block, index) => ({
        ...block,
        order: index + 1,
      }));

      setStageBlocks((prev) => ({
        ...prev,
        [stageId]: reorderedBlocks,
      }));

      updateStage(stageId, {
        metadata: {
          ...getStageById(stageId)?.metadata,
          blocksCount: reorderedBlocks.length,
        },
      });

      console.log(
        "➕ EditorContext: Bloco adicionado na posição:",
        position,
        "blockId:",
        blockId,
        "tipo:",
        type,
        "etapa:",
        stageId,
      );
      return blockId;
    },
    [activeStageId, validateStageId, stageBlocks, updateStage, getStageById],
  );

  const reorderBlocks = useCallback(
    (blockIds: string[], targetStageId?: string) => {
      const stageId = targetStageId || activeStageId;

      if (!validateStageId(stageId)) {
        console.warn(
          "⚠️ EditorContext: Tentativa de reordenar blocos em etapa inválida:",
          stageId,
        );
        return;
      }

      const currentStageBlocks = stageBlocks[stageId] || [];
      
      if (blockIds.length !== currentStageBlocks.length) {
        console.warn(
          "⚠️ EditorContext: Número de blockIds não confere com blocos existentes",
          blockIds.length,
          "vs",
          currentStageBlocks.length,
        );
        return;
      }

      // Reordenar blocos baseado na ordem dos IDs
      const reorderedBlocks = blockIds.map((blockId, index) => {
        const block = currentStageBlocks.find(b => b.id === blockId);
        if (!block) {
          console.warn("⚠️ EditorContext: Bloco não encontrado:", blockId);
          return null;
        }
        return {
          ...block,
          order: index + 1,
        };
      }).filter(Boolean) as EditorBlock[];

      setStageBlocks((prev) => ({
        ...prev,
        [stageId]: reorderedBlocks,
      }));

      console.log(
        "🔄 EditorContext: Blocos reordenados na etapa:",
        stageId,
        "nova ordem:",
        blockIds,
      );
    },
    [activeStageId, validateStageId, stageBlocks],
  );

  const deleteBlock = useCallback(
    (blockId: string) => {
      let deletedFromStage = "";

      setStageBlocks((prev) => {
        const updated = { ...prev };

        for (const stageId in updated) {
          const blocks = updated[stageId];
          const blockIndex = blocks.findIndex((block) => block.id === blockId);

          if (blockIndex !== -1) {
            updated[stageId] = blocks.filter((block) => block.id !== blockId);
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
              blocksCount: Math.max(0, (stage.metadata?.blocksCount || 1) - 1),
            },
          });
        }
      }

      if (selectedBlockId === blockId) {
        setSelectedBlockId(null);
      }

      console.log(
        "🗑️ EditorContext: Bloco removido:",
        blockId,
        "da etapa:",
        deletedFromStage,
      );
    },
    [selectedBlockId, getStageById, updateStage],
  );

  const updateBlock = useCallback(
    (blockId: string, updates: Partial<EditorBlock>) => {
      setStageBlocks((prev) => {
        const updated = { ...prev };

        for (const stageId in updated) {
          const blocks = updated[stageId];
          const blockIndex = blocks.findIndex((block) => block.id === blockId);

          if (blockIndex !== -1) {
            updated[stageId] = blocks.map((block) =>
              block.id === blockId ? { ...block, ...updates } : block,
            );
            break;
          }
        }

        return updated;
      });

      console.log("📝 EditorContext: Bloco atualizado:", blockId, updates);
    },
    [],
  );

  const getBlocksForStage = useCallback(
    (stageId: string): EditorBlock[] => {
      const blocks = stageBlocks[stageId] || [];
      console.log(
        `📦 EditorContext: Obtendo blocos para etapa ${stageId}:`,
        blocks.length,
      );
      return blocks;
    },
    [stageBlocks],
  );

  // ═══════════════════════════════════════════════
  // 📊 COMPUTED VALUES (PERFORMANCE OTIMIZADA)
  // ═══════════════════════════════════════════════
  const currentBlocks = getBlocksForStage(activeStageId);
  const selectedBlock = selectedBlockId
    ? currentBlocks.find((block) => block.id === selectedBlockId)
    : undefined;
  const totalBlocks = Object.values(stageBlocks).reduce(
    (total, blocks) => total + blocks.length,
    0,
  );
  const stageCount = stages.length;

  // Debug logging para computed values
  console.log("📊 EditorContext: Computed values:", {
    activeStageId,
    currentBlocks: currentBlocks.length,
    selectedBlock: selectedBlock?.id || "none",
    totalBlocks,
    stageCount,
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
  };

  console.log(
    "🎯 EditorContext: Providing context value com",
    stages.length,
    "etapas",
  );

  return (
    <EditorContext.Provider value={contextValue}>
      {children}
    </EditorContext.Provider>
  );
};

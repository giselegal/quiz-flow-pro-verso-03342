// EditorDatabaseAdapter removed - using direct context state management
import { getAllSteps, getStepTemplate } from "@/config/stepTemplatesMapping";
import { EditorBlock, FunnelStage } from "@/types/editor";
import { TemplateManager } from "@/utils/TemplateManager";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

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
  // 🔌 SISTEMA DE COMPONENTES REUTILIZÁVEIS
  // ═══════════════════════════════════════════════
  databaseMode: {
    isEnabled: boolean;
    quizId: string;
    setDatabaseMode: (enabled: boolean) => void;
    setQuizId: (quizId: string) => void;
    migrateToDatabase: () => Promise<boolean>;
    getStats: () => Promise<any>;
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

export const EditorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  console.log("🔥 EditorProvider: INICIANDO PROVIDER!");

  // ═══════════════════════════════════════════════
  // 🔌 INICIALIZAR ADAPTER DO BANCO DE DADOS
  // ═══════════════════════════════════════════════
  // Database adapter removed - using direct state management only
  const adapter = {
    setDatabaseMode: (_enabled: boolean) => {},
    setQuizId: (_quizId: string) => {},
    migrateLocalToDatabase: () => Promise.resolve(false),
    getQuizStats: () => Promise.resolve({ error: "Database adapter not available" }),
  };

  // Estado do modo banco
  const [databaseModeEnabled, setDatabaseModeEnabled] = useState(false);
  const [currentQuizId, setCurrentQuizId] = useState("quiz-demo-id");

  // ═══════════════════════════════════════════════
  // 🏗️ ESTADO PRINCIPAL CENTRALIZADO
  // ═══════════════════════════════════════════════
  const [stages, setStages] = useState<FunnelStage[]>(() => {
    // ✅ INICIALIZAÇÃO SÍNCRONA NO ESTADO INICIAL COM TEMPLATES ESPECÍFICOS
    console.log("🚀 EditorProvider: Inicializando stages com templates específicos");

    // ✅ USAR TEMPLATES ESPECÍFICOS DAS ETAPAS
    const allStepTemplates = getAllSteps();
    console.log("📋 EditorProvider: Templates carregados:", allStepTemplates.length);
    console.log(
      "📋 EditorProvider: Templates detalhados:",
      allStepTemplates.map(t => ({
        stepNumber: t.stepNumber,
        name: t.name,
        hasFunction: typeof t.templateFunction === "function",
      }))
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
      initialStages.length
    );
    return initialStages;
  });

  const [stageBlocks, setStageBlocks] = useState<Record<string, EditorBlock[]>>(() => {
    // ✅ INICIALIZAR BLOCOS COM TEMPLATES ESPECÍFICOS PARA AS PRIMEIRAS ETAPAS
    const initialBlocks: Record<string, EditorBlock[]> = {};

    // Carregar template especificamente para as primeiras etapas
    for (let i = 1; i <= 21; i++) {
      const stageId = `step-${i}`;

      // Carregar template imediatamente para as primeiras etapas
      if (i <= 3) {
        try {
          const templateBlocks = getStepTemplate(i);
          console.log(
            `🎨 Inicialização: Carregando template para etapa ${i}:`,
            templateBlocks?.length || 0
          );

          if (templateBlocks && templateBlocks.length > 0) {
            initialBlocks[stageId] = templateBlocks.map(
              (block: { id: any; type: any; properties: any; content: any }, index: number) => {
                console.log(
                  `🔧 Inicialização: Processando bloco ${index} da etapa ${i}:`,
                  block.type
                );
                return {
                  id: block.id || `${stageId}-block-${index + 1}`,
                  type: block.type as any,
                  content: block.properties || block.content || {},
                  order: index + 1,
                  properties: block.properties || {},
                };
              }
            );
            console.log(
              `✅ Inicialização: ${initialBlocks[stageId].length} blocos carregados para etapa ${i}`
            );
          } else {
            console.warn(`⚠️ Inicialização: Nenhum template encontrado para etapa ${i}`);
            initialBlocks[stageId] = [];
          }
        } catch (error) {
          console.error(`❌ Inicialização: Erro ao carregar template da etapa ${i}:`, error);
          initialBlocks[stageId] = [];
        }
      } else {
        initialBlocks[stageId] = [];
      }
    }

    console.log("✅ EditorProvider: Blocos inicializados com templates das primeiras etapas");
    return initialBlocks;
  });

  const [activeStageId, setActiveStageId] = useState<string>("step-1");
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  // ✅ PRÉ-CARREGAMENTO DE TEMPLATES JSON
  useEffect(() => {
    console.log("🚀 EditorProvider: Iniciando pré-carregamento de templates JSON");
    TemplateManager.preloadCommonTemplates()
      .then(() => {
        console.log("✅ Templates JSON pré-carregados com sucesso");
      })
      .catch(error => {
        console.warn("⚠️ Erro no pré-carregamento de templates JSON:", error);
      });
  }, []);

  // ═══════════════════════════════════════════════
  // 🎨 UI STATE
  // ═══════════════════════════════════════════════
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [viewportSize, setViewportSize] = useState<"sm" | "md" | "lg" | "xl">("lg");

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
      const isValid = stages.some(stage => stage.id === stageId);
      console.log(`🔍 EditorContext: Validando stage ${stageId}:`, isValid);
      return isValid;
    },
    [stages]
  );

  const getStageById = useCallback(
    (stageId: string): FunnelStage | undefined => {
      return stages.find(stage => stage.id === stageId);
    },
    [stages]
  );

  // ═══════════════════════════════════════════════
  // 🎯 STAGE ACTIONS (GERENCIAMENTO DE ETAPAS)
  // ═══════════════════════════════════════════════

  // ✅ FUNÇÃO PARA CARREGAR BLOCOS DE TEMPLATE JSON (SISTEMA HÍBRIDO)
  const loadStageTemplate = useCallback(
    async (stageId: string) => {
      const stage = stages.find(s => s.id === stageId);
      if (!stage) return;

      const stepNumber = parseInt(stageId.replace("step-", ""));

      console.log(`🎨 EditorContext: Carregando template JSON para etapa ${stepNumber}`);

      try {
        // 🚀 PRIORIZAR SISTEMA JSON
        let templateBlocks;

        try {
          console.log(`📄 Tentando carregar template JSON para step-${stepNumber}`);
          templateBlocks = await TemplateManager.loadStepBlocks(stageId);
          console.log(`✅ Template JSON carregado:`, templateBlocks?.length || 0, "blocos");
        } catch (jsonError) {
          console.warn(`⚠️ JSON template falhou, usando TSX fallback:`, jsonError);
          // FALLBACK: usar sistema TSX antigo
          templateBlocks = getStepTemplate(stepNumber);
          console.log(`📦 Template TSX fallback:`, templateBlocks?.length || 0, "blocos");
        }

        if (templateBlocks && templateBlocks.length > 0) {
          const editorBlocks: EditorBlock[] = templateBlocks.map(
            (block: { id: any; type: any; properties: any; content: any }, index: number) => {
              console.log(`🔧 Processando bloco ${index}:`, {
                id: block.id,
                type: block.type,
                hasProperties: !!block.properties,
                hasContent: !!block.content,
              });
              return {
                id: block.id || `${stageId}-block-${index + 1}`,
                type: block.type as any,
                content: block.properties || block.content || {},
                order: index + 1,
                properties: block.properties || {},
              };
            }
          );

          console.log(`💾 Salvando ${editorBlocks.length} blocos para etapa ${stepNumber}`);
          setStageBlocks(prev => ({
            ...prev,
            [stageId]: editorBlocks,
          }));

          // Chamar updateStage diretamente
          setStages(prev =>
            prev.map(stage =>
              stage.id === stageId
                ? {
                    ...stage,
                    metadata: {
                      ...stage.metadata,
                      blocksCount: editorBlocks.length,
                      lastModified: new Date(),
                    },
                  }
                : stage
            )
          );

          console.log(
            `✅ EditorContext: ${editorBlocks.length} blocos carregados para etapa ${stepNumber} via JSON`
          );
        } else {
          console.warn(`⚠️ EditorContext: Nenhum template encontrado para etapa ${stepNumber}`);
        }
      } catch (error) {
        console.error(`❌ EditorContext: Erro ao carregar template da etapa ${stepNumber}:`, error);
      }
    },
    [stages]
  );

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
      console.log(`🔍 EditorContext: Etapa ${stageId} tem ${currentBlocks.length} blocos`);

      if (currentBlocks.length === 0) {
        console.log(`🎨 EditorContext: Etapa ${stageId} vazia, carregando template JSON...`);
        // Executar carregamento assíncrono do template JSON
        loadStageTemplate(stageId).catch(error => {
          console.error(`❌ Erro ao carregar template para ${stageId}:`, error);
        });
      } else {
        console.log(
          `📋 EditorContext: Etapa ${stageId} já tem blocos:`,
          currentBlocks.map(b => b.type)
        );
      }

      console.log("✅ EditorContext: Etapa ativa alterada para:", stageId);
    },
    [validateStageId, stageBlocks, loadStageTemplate]
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

      setStages(prev => [...prev, newStage]);
      setStageBlocks(prev => ({ ...prev, [newStageId]: [] }));

      console.log("➕ EditorContext: Nova etapa adicionada:", newStageId);
      return newStageId;
    },
    [stages.length]
  );

  const removeStage = useCallback(
    (stageId: string) => {
      if (!validateStageId(stageId)) {
        console.warn("⚠️ EditorContext: Tentativa de remover etapa inválida:", stageId);
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

      console.log("🗑️ EditorContext: Etapa removida:", stageId);
    },
    [validateStageId, activeStageId, stages]
  );

  const updateStage = useCallback(
    (stageId: string, updates: Partial<FunnelStage>) => {
      if (!validateStageId(stageId)) {
        console.warn("⚠️ EditorContext: Tentativa de atualizar etapa inválida:", stageId);
        return;
      }

      setStages(prev =>
        prev.map(stage =>
          stage.id === stageId
            ? {
                ...stage,
                ...updates,
                metadata: { ...stage.metadata, lastModified: new Date() },
              }
            : stage
        )
      );

      console.log("📝 EditorContext: Etapa atualizada:", stageId, updates);
    },
    [validateStageId]
  );

  // 🧩 BLOCK ACTIONS (GERENCIAMENTO DE BLOCOS)
  // ═══════════════════════════════════════════════
  const addBlock = useCallback(
    (type: string, targetStageId?: string): string => {
      const stageId = targetStageId || activeStageId;

      if (!validateStageId(stageId)) {
        console.warn("⚠️ EditorContext: Tentativa de adicionar bloco em etapa inválida:", stageId);
        return "";
      }

      // 🎯 SISTEMA 1: ID Semântico ao invés de timestamp
      const currentStageBlocks = stageBlocks[stageId] || [];
      const blockOrder = currentStageBlocks.length + 1;
      const blockId = `${stageId}-block-${type}-${blockOrder}`;

      const newBlock: EditorBlock = {
        id: blockId,
        type: type as any,
        content: { text: `Novo ${type}`, title: `Título do ${type}` },
        order: blockOrder,
        properties: {},
      };

      setStageBlocks(prev => ({
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
        "➕ EditorContext: Bloco adicionado (Sistema Semântico):",
        blockId,
        "tipo:",
        type,
        "etapa:",
        stageId
      );
      return blockId;
    },
    [activeStageId, validateStageId, stageBlocks, updateStage, getStageById]
  );

  const addBlockAtPosition = useCallback(
    (type: string, position: number, targetStageId?: string): string => {
      const stageId = targetStageId || activeStageId;

      if (!validateStageId(stageId)) {
        console.warn("⚠️ EditorContext: Tentativa de adicionar bloco em etapa inválida:", stageId);
        return "";
      }

      // 🎯 SISTEMA 1: ID Semântico com posição
      const blockId = `${stageId}-block-${type}-pos-${position + 1}`;
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

      setStageBlocks(prev => ({
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
        "➕ EditorContext: Bloco adicionado na posição (Sistema Semântico):",
        position,
        "blockId:",
        blockId,
        "tipo:",
        type,
        "etapa:",
        stageId
      );
      return blockId;
    },
    [activeStageId, validateStageId, stageBlocks, updateStage, getStageById]
  );

  // 🎯 SISTEMA 1: FUNÇÃO DE DUPLICAÇÃO SEMÂNTICA
  const duplicateBlock = useCallback(
    (blockId: string, targetStageId?: string): string => {
      const stageId = targetStageId || activeStageId;

      if (!validateStageId(stageId)) {
        console.warn("⚠️ EditorContext: Tentativa de duplicar bloco em etapa inválida:", stageId);
        return "";
      }

      const currentStageBlocks = stageBlocks[stageId] || [];
      const blockToDuplicate = currentStageBlocks.find(b => b.id === blockId);

      if (!blockToDuplicate) {
        console.warn("⚠️ EditorContext: Bloco para duplicar não encontrado:", blockId);
        return "";
      }

      // Gerar ID semântico para duplicação
      const duplicateNumber =
        currentStageBlocks.filter(b => b.type === blockToDuplicate.type).length + 1;

      const duplicatedBlockId = `${stageId}-block-${blockToDuplicate.type}-copy-${duplicateNumber}`;

      const duplicatedBlock: EditorBlock = {
        ...JSON.parse(JSON.stringify(blockToDuplicate)), // Deep clone
        id: duplicatedBlockId,
        order: currentStageBlocks.length + 1,
      };

      setStageBlocks(prev => ({
        ...prev,
        [stageId]: [...(prev[stageId] || []), duplicatedBlock],
      }));

      updateStage(stageId, {
        metadata: {
          ...getStageById(stageId)?.metadata,
          blocksCount: currentStageBlocks.length + 1,
        },
      });

      console.log(
        "🔄 EditorContext: Bloco duplicado (Sistema Semântico):",
        duplicatedBlockId,
        "original:",
        blockId
      );
      return duplicatedBlockId;
    },
    [activeStageId, validateStageId, stageBlocks, updateStage, getStageById]
  );

  const reorderBlocks = useCallback(
    (blockIds: string[], targetStageId?: string) => {
      const stageId = targetStageId || activeStageId;

      if (!validateStageId(stageId)) {
        console.warn("⚠️ EditorContext: Tentativa de reordenar blocos em etapa inválida:", stageId);
        return;
      }

      const currentStageBlocks = stageBlocks[stageId] || [];

      if (blockIds.length !== currentStageBlocks.length) {
        console.warn(
          "⚠️ EditorContext: Número de blockIds não confere com blocos existentes",
          blockIds.length,
          "vs",
          currentStageBlocks.length
        );
        return;
      }

      // Reordenar blocos baseado na ordem dos IDs
      const reorderedBlocks = blockIds
        .map((blockId, index) => {
          const block = currentStageBlocks.find(b => b.id === blockId);
          if (!block) {
            console.warn("⚠️ EditorContext: Bloco não encontrado:", blockId);
            return null;
          }
          return {
            ...block,
            order: index + 1,
          };
        })
        .filter(Boolean) as EditorBlock[];

      setStageBlocks(prev => ({
        ...prev,
        [stageId]: reorderedBlocks,
      }));

      console.log(
        "🔄 EditorContext: Blocos reordenados na etapa:",
        stageId,
        "nova ordem:",
        blockIds
      );
    },
    [activeStageId, validateStageId, stageBlocks]
  );

  const deleteBlock = useCallback(
    (blockId: string) => {
      let deletedFromStage = "";

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
              blocksCount: Math.max(0, (stage.metadata?.blocksCount || 1) - 1),
            },
          });
        }
      }

      if (selectedBlockId === blockId) {
        setSelectedBlockId(null);
      }

      console.log("🗑️ EditorContext: Bloco removido:", blockId, "da etapa:", deletedFromStage);
    },
    [selectedBlockId, getStageById, updateStage]
  );

  const updateBlock = useCallback((blockId: string, updates: Partial<EditorBlock>) => {
    console.log("🔧 EditorContext updateBlock chamado:", { blockId, updates });

    setStageBlocks(prev => {
      const updated = { ...prev };

      for (const stageId in updated) {
        const blocks = updated[stageId];
        const blockIndex = blocks.findIndex(block => block.id === blockId);

        if (blockIndex !== -1) {
          updated[stageId] = blocks.map(block => {
            if (block.id === blockId) {
              console.log("🔧 Bloco encontrado, estado atual:", block);

              // Criar uma nova cópia do bloco
              const updatedBlock = { ...block };

              // Processar cada propriedade de atualização separadamente
              Object.entries(updates).forEach(([key, value]) => {
                console.log(`🔧 Processando update: ${key} =`, value);

                if (key === "properties") {
                  // ✅ CORREÇÃO CRÍTICA: Para properties, fazer merge completo
                  updatedBlock.properties = {
                    ...block.properties,
                    ...(value as Record<string, any>),
                  };
                  console.log("🔧 Properties merged:", updatedBlock.properties);

                  // ✅ TAMBÉM SINCRONIZAR COM CONTENT para compatibilidade
                  updatedBlock.content = {
                    ...block.content,
                    ...(value as Record<string, any>),
                  };
                  console.log("🔧 Content também sincronizado:", updatedBlock.content);
                } else if (key === "content") {
                  // Para content, fazer um merge profundo preservando imutabilidade
                  updatedBlock.content = {
                    ...block.content,
                    ...(value as Record<string, any>),
                  };
                  console.log("🔧 Content atualizado:", updatedBlock.content);
                } else {
                  // ✅ CORREÇÃO: Para campos individuais, atualizar tanto properties quanto content
                  if (block.content && typeof value !== "object") {
                    updatedBlock.content = {
                      ...block.content,
                      [key]: value,
                    };
                    console.log("🔧 Content direto atualizado:", updatedBlock.content);
                  }

                  if (block.properties) {
                    updatedBlock.properties = {
                      ...block.properties,
                      [key]: value,
                    };
                    console.log("🔧 Properties direto atualizada:", updatedBlock.properties);
                  } else {
                    // Para outras propriedades, atualização direta com casting seguro
                    (updatedBlock as any)[key] = value;
                    console.log(`🔧 Propriedade direta ${key} atualizada:`, value);
                  }
                }
              });

              console.log("🔧 Bloco final atualizado:", updatedBlock);
              return updatedBlock;
            }
            return block;
          });
          break;
        }
      }

      return updated;
    });

    console.log("📝 EditorContext: Bloco atualizado:", blockId, updates);
  }, []);

  const getBlocksForStage = useCallback(
    (stageId: string): EditorBlock[] => {
      const blocks = stageBlocks[stageId] || [];
      console.log(`📦 EditorContext: Obtendo blocos para etapa ${stageId}:`, blocks.length);
      return blocks;
    },
    [stageBlocks]
  );

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

  // ✅ INICIALIZAÇÃO AUTOMÁTICA - CARREGAR TEMPLATE DA ETAPA ATIVA
  useEffect(() => {
    console.log("🚀 EditorContext: useEffect de inicialização executado");
    console.log("📋 EditorContext: activeStageId:", activeStageId);
    console.log("📋 EditorContext: currentBlocks.length:", currentBlocks.length);

    // Só carregar se a etapa ativa não tiver blocos (evitar sobrescrever blocos já carregados)
    if (activeStageId && currentBlocks.length === 0) {
      console.log(`🎨 EditorContext: Carregando template automaticamente para ${activeStageId}`);
      loadStageTemplate(activeStageId);
    } else if (currentBlocks.length > 0) {
      console.log(
        `📋 EditorContext: Etapa ${activeStageId} já tem ${currentBlocks.length} blocos carregados - mantendo dados`
      );
    } else {
      console.log(`📋 EditorContext: Etapa ${activeStageId} inválida ou sem dados para carregar`);
    }
  }, [activeStageId]); // ✅ Remover currentBlocks.length das dependências para evitar loops

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

import { CanvasDropZone } from "@/components/editor/canvas/CanvasDropZone";
import { DndProvider } from "@/components/editor/dnd/DndProvider";
import EnhancedComponentsSidebar from "@/components/editor/EnhancedComponentsSidebar";
import { FunnelSettingsPanel } from "@/components/editor/funnel-settings/FunnelSettingsPanel";
import { FunnelStagesPanel } from "@/components/editor/funnel/FunnelStagesPanel";
import { FourColumnLayout } from "@/components/editor/layout/FourColumnLayout";
import { EditorToolbar } from "@/components/enhanced-editor/toolbar/EditorToolbar";
import EnhancedUniversalPropertiesPanel from "@/components/universal/EnhancedUniversalPropertiesPanel";
import { generateBlockDefinitions, getRegistryStats } from "@/config/enhancedBlockRegistry";
import { useEditor } from "@/context/EditorContext";
import { useSyncedScroll } from "@/hooks/useSyncedScroll";
import { Type } from "lucide-react";
import React, { useState } from "react";

const EditorFixedPageWithDragDrop: React.FC = () => {
  console.log("🔥 EditorFixedPage: PÁGINA RENDERIZANDO COM DRAG&DROP!");

  // Hook para scroll sincronizado
  const { scrollRef } = useSyncedScroll({ source: "canvas" });

  // Estado para controlar o painel de configurações
  const [showFunnelSettings, setShowFunnelSettings] = useState(false);

  // ✅ USAR NOVA ESTRUTURA UNIFICADA DO EDITORCONTEXT
  const {
    stages,
    activeStageId,
    selectedBlockId,
    stageActions: { setActiveStage },
    blockActions: {
      addBlock,
      addBlockAtPosition,
      getBlocksForStage,
      setSelectedBlockId,
      deleteBlock,
      updateBlock,
      reorderBlocks,
    },
    uiState: { isPreviewing, setIsPreviewing, viewportSize, setViewportSize },
    computed: { currentBlocks, selectedBlock, totalBlocks, stageCount },
  } = useEditor();

  console.log("🔥 EditorFixedPage: Dados do editor:", {
    stages: stages?.length || 0,
    activeStageId,
    selectedBlockId,
    currentBlocks: currentBlocks?.length || 0,
    totalBlocks,
    stageCount,
  });

  // 🔍 DEBUG ESPECÍFICO PARA PAINEL DE PROPRIEDADES
  console.log("🎯 DEBUG Painel Propriedades:", {
    selectedBlockId: selectedBlockId,
    selectedBlock: selectedBlock
      ? {
          id: selectedBlock.id,
          type: selectedBlock.type,
          hasContent: !!selectedBlock.content,
          hasProperties: !!selectedBlock.properties,
          propertiesKeys: selectedBlock.properties ? Object.keys(selectedBlock.properties) : [],
          propertiesValues: selectedBlock.properties,
          contentKeys: selectedBlock.content ? Object.keys(selectedBlock.content) : [],
          contentValues: selectedBlock.content,
        }
      : null,
    currentBlocksDetailed: currentBlocks?.map(b => ({ id: b.id, type: b.type })) || [],
    shouldShowPanel: !isPreviewing && selectedBlock,
  });

  // Mostrar estatísticas do registry
  const registryStats = getRegistryStats();

  // Obter todas as definições de blocos para properties
  const allBlockDefinitions = generateBlockDefinitions();

  // Função para obter blockDefinition com propriedades reais
  const getBlockDefinitionForType = (type: string) => {
    const definition = allBlockDefinitions.find(def => def.type === type);
    if (definition) {
      return definition;
    }

    // Fallback com propriedades padrão para qualquer componente
    return {
      type: type,
      name: type.charAt(0).toUpperCase() + type.slice(1).replace(/[-_]/g, " "),
      label: type.charAt(0).toUpperCase() + type.slice(1).replace(/[-_]/g, " "),
      description: `Componente ${type}`,
      category: "basic",
      icon: Type,
      component: React.Fragment,
      defaultProps: {},
      properties: {
        text: {
          type: "string" as const,
          label: "Texto",
          default: "",
          description: "Conteúdo de texto do componente",
        },
        title: {
          type: "string" as const,
          label: "Título",
          default: "",
          description: "Título do componente",
        },
        visible: {
          type: "boolean" as const,
          label: "Visível",
          default: true,
          description: "Controla se o componente está visível",
        },
        className: {
          type: "string" as const,
          label: "Classes CSS",
          default: "",
          description: "Classes CSS customizadas",
        },
      },
    };
  };

  // ✅ VIEWPORT RESPONSIVE CONFIGURATION
  const getCanvasClassName = () => {
    const baseClasses =
      "transition-all duration-500 ease-out mx-auto bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl shadow-stone-200/40 border border-stone-200/30 ring-1 ring-stone-100/20";

    switch (viewportSize) {
      case "sm":
        return `${baseClasses} w-[375px] min-h-[600px]`;
      case "md":
        return `${baseClasses} w-[768px] min-h-[800px]`;
      case "lg":
      case "xl":
      default:
        return `${baseClasses} w-full max-w-4xl min-h-[900px]`;
    }
  };

  // Handler para salvar (placeholder)
  const handleSave = () => {
    console.log("💾 Salvando editor...");
  };

  // Handler para deletar bloco
  const handleDeleteBlock = (blockId: string) => {
    if (window.confirm("Tem certeza que deseja deletar este bloco?")) {
      deleteBlock(blockId);
      console.log(`🗑️ Bloco ${blockId} deletado`);
    }
  };

  // ✅ NAVEGAÇÃO SIMPLIFICADA (CALLBACK OPCIONAL)
  const handleStageSelect = (stageId: string) => {
    console.log("🔄 Editor: Callback de mudança de etapa recebido:", stageId);
    // O EditorContext já gerencia tudo internamente
    // Este callback é apenas para compatibilidade
  };

  return (
    <DndProvider
      blocks={(currentBlocks || []).map(block => ({
        id: block.id,
        type: block.type,
        properties: block.properties || {},
      }))}
      onBlocksReorder={newBlocksData => {
        console.log("🔄 Reordenando blocos:", newBlocksData);

        const newBlockIds = newBlocksData.map(b => b.id);
        const oldBlockIds = (currentBlocks || []).map(b => b.id);

        if (oldBlockIds.length !== newBlockIds.length) {
          console.warn("⚠️ Reordenação abortada: quantidade de blocos não confere");
          return;
        }

        // Usar a nova função reorderBlocks do contexto
        reorderBlocks(newBlockIds, activeStageId || undefined);
        console.log("✅ Blocos reordenados com sucesso usando EditorContext");
      }}
      onBlockAdd={(blockType, position) => {
        console.log(`➕ Adicionando bloco ${blockType} na posição ${position}`);

        if (position !== undefined && position >= 0) {
          // Usar a nova função addBlockAtPosition para inserção atômica
          const blockId = addBlockAtPosition(blockType, position, activeStageId || undefined);
          console.log(
            `✅ Bloco ${blockType} (${blockId}) adicionado na posição ${position} usando EditorContext`
          );
        } else {
          // Fallback para adicionar no final
          const blockId = addBlock(blockType, activeStageId || undefined);
          console.log(`✅ Bloco ${blockType} (${blockId}) adicionado no final`);
        }
      }}
      onBlockSelect={blockId => {
        setSelectedBlockId(blockId);
      }}
      selectedBlockId={selectedBlockId || undefined}
      onBlockUpdate={(blockId, updates) => {
        updateBlock(blockId, updates as any);
      }}
    >
      <div className="h-screen flex flex-col bg-gradient-to-br from-stone-50/80 via-stone-100/60 to-stone-150/40 relative">
        {/* Overlay sutil para mais elegância */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand/[0.02] via-transparent to-brand-dark/[0.01] pointer-events-none"></div>

        <div className="relative z-10">
          <EditorToolbar
            isPreviewing={isPreviewing}
            onTogglePreview={() => setIsPreviewing(!isPreviewing)}
            onSave={handleSave}
            viewportSize={viewportSize}
            onViewportSizeChange={setViewportSize}
            onShowFunnelSettings={() => setShowFunnelSettings(true)}
          />

          {/* Top Bar - Otimizado */}
          <div className="bg-gradient-to-r from-amber-50/95 via-yellow-50/90 to-amber-50/95 border-b border-amber-200/50 backdrop-blur-md px-3 py-2 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-lg font-semibold text-stone-700">
                  Editor de Funil - Etapa {activeStageId}
                </h1>
                <div className="text-sm text-stone-500">
                  {totalBlocks} componente{totalBlocks !== 1 ? "s" : ""} • {stageCount} etapa
                  {stageCount !== 1 ? "s" : ""}
                </div>
              </div>
            </div>
          </div>

          <FourColumnLayout
            stagesPanel={<FunnelStagesPanel onStageSelect={handleStageSelect} />}
            componentsPanel={<EnhancedComponentsSidebar />}
            canvas={
              <div
                ref={scrollRef}
                className="p-2 overflow-auto h-full bg-gradient-to-br from-stone-50/50 via-white/30 to-stone-100/40 backdrop-blur-sm"
              >
                <div className={getCanvasClassName()}>
                  <CanvasDropZone
                    blocks={currentBlocks}
                    selectedBlockId={selectedBlockId}
                    isPreviewing={isPreviewing}
                    activeStageId={activeStageId}
                    stageCount={stageCount}
                    onSelectBlock={setSelectedBlockId}
                    onUpdateBlock={updateBlock}
                    onDeleteBlock={handleDeleteBlock}
                  />
                </div>
              </div>
            }
            propertiesPanel={
              !isPreviewing && selectedBlock ? (
                <EnhancedUniversalPropertiesPanel
                  selectedBlock={{
                    id: selectedBlock.id,
                    type: selectedBlock.type,
                    properties: {
                      ...(selectedBlock.properties || {}),
                      ...(selectedBlock.content || {}),
                    },
                  }}
                  onUpdate={(blockId, updates) => {
                    updateBlock(blockId, updates);
                  }}
                  onClose={() => setSelectedBlockId(null)}
                />
              ) : !isPreviewing ? (
                <div className="h-full p-4 flex items-center justify-center text-stone-500">
                  <div className="text-center">
                    <p className="text-sm">Selecione um bloco para editar propriedades</p>
                    <p className="text-xs text-stone-400 mt-1">
                      Painel Universal ativo • Drag & Drop habilitado
                    </p>
                  </div>
                </div>
              ) : null
            }
          />
        </div>

        {/* Painel de Configurações do Funil */}
        {showFunnelSettings && (
          <FunnelSettingsPanel
            funnelId={activeStageId || "default"}
            isOpen={showFunnelSettings}
            onClose={() => setShowFunnelSettings(false)}
          />
        )}
      </div>
    </DndProvider>
  );
};

export default EditorFixedPageWithDragDrop;

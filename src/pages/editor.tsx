import React, { useState } from "react";

// Editor Components
import { CanvasDropZone } from "@/components/editor/canvas/CanvasDropZone";
import CombinedComponentsPanel from "@/components/editor/CombinedComponentsPanel";
import { DndProvider } from "@/components/editor/dnd/DndProvider";
import { FunnelSettingsPanel } from "@/components/editor/funnel-settings/FunnelSettingsPanel";
import { FunnelStagesPanel } from "@/components/editor/funnel/FunnelStagesPanel";
import { FourColumnLayout } from "@/components/editor/layout/FourColumnLayout";
import { EditorToolbar } from "@/components/enhanced-editor/toolbar/EditorToolbar";
// ✅ NOVO: Importar o painel inteligente de propriedades
import IntelligentPropertiesPanel from "@/components/editor/properties/IntelligentPropertiesPanel";

// Context & Hooks
import { useEditor } from "@/context/EditorContext";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { usePropertyHistory } from "@/hooks/usePropertyHistory";
import { useSyncedScroll } from "@/hooks/useSyncedScroll";

/**
 * Editor Fixed - Versão Corrigida do Editor Principal
 *
 * Editor de funil com drag & drop completo, incluindo:
 * - Layout de 4 colunas responsivo
 * - Sistema avançado de drag & drop
 * - Painel universal de propriedades
 * - Atalhos de teclado e histórico de mudanças
 * - Preview mode e viewport responsivo
 * - Sistema de ativação automática de 21 etapas
 */
const EditorFixedPageWithDragDrop: React.FC = () => {
  // Hooks para funcionalidades avançadas
  const { scrollRef } = useSyncedScroll({ source: "canvas" });
  const propertyHistory = usePropertyHistory();

  // Estado local
  const [showFunnelSettings, setShowFunnelSettings] = useState(false);

  // Editor Context - Estado centralizado do editor
  const {
    activeStageId,
    selectedBlockId,
    blockActions: {
      addBlock,
      addBlockAtPosition,
      setSelectedBlockId,
      deleteBlock,
      updateBlock,
      reorderBlocks,
    },
    uiState: { isPreviewing, setIsPreviewing, viewportSize, setViewportSize },
    computed: { currentBlocks, selectedBlock, totalBlocks, stageCount },
  } = useEditor();

  // Configuração de viewport responsivo
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

  // Handlers de eventos
  const handleSave = () => {
    console.log("💾 Salvando editor...");
  };

  const handleDeleteBlock = (blockId: string) => {
    if (window.confirm("Tem certeza que deseja deletar este bloco?")) {
      deleteBlock(blockId);
      setSelectedBlockId(null);
    }
  };

  const handleStageSelect = (_stageId: string) => {
    // O EditorContext já gerencia internamente
  };

  // Função para determinar tipo de etapa baseado no ID da etapa ativa
  const getStepTypeFromStageId = (
    stageId: string | null
  ):
    | "intro"
    | "question"
    | "transition"
    | "strategic"
    | "processing"
    | "result"
    | "lead"
    | "offer" => {
    if (!stageId) return "intro";

    const stepNumber = getStepNumberFromStageId(stageId);

    if (stepNumber === 1) return "intro";
    if (stepNumber >= 2 && stepNumber <= 14) return "question";
    if (stepNumber === 15 || stepNumber === 19) return "transition";
    if (stepNumber === 16) return "processing";
    if (stepNumber >= 17 && stepNumber <= 18) return "result";
    if (stepNumber === 20) return "lead";
    if (stepNumber === 21) return "offer";

    return "question"; // fallback
  };

  const getStepNumberFromStageId = (stageId: string | null): number => {
    if (!stageId) return 1;
    const match = stageId.match(/step-(\d+)/);
    return match ? parseInt(match[1], 10) : 1;
  };

  // Configurar atalhos de teclado
  useKeyboardShortcuts({
    onUndo: propertyHistory.undo,
    onRedo: propertyHistory.redo,
    onDelete: selectedBlockId ? () => handleDeleteBlock(selectedBlockId) : undefined,
    canUndo: propertyHistory.canUndo,
    canRedo: propertyHistory.canRedo,
    hasSelectedBlock: !!selectedBlockId,
  });

  return (
    <DndProvider
      blocks={(currentBlocks || []).map(block => ({
        id: block.id,
        type: block.type,
        properties: block.properties || {},
      }))}
      onBlocksReorder={newBlocksData => {
        const newBlockIds = newBlocksData.map(b => b.id);
        const oldBlockIds = (currentBlocks || []).map(b => b.id);

        if (oldBlockIds.length !== newBlockIds.length) {
          console.warn("⚠️ Reordenação abortada: quantidade de blocos não confere");
          return;
        }

        reorderBlocks(newBlockIds, activeStageId || undefined);
      }}
      onBlockAdd={(blockType, position) => {
        if (position !== undefined && position >= 0) {
          addBlockAtPosition(blockType, position, activeStageId || undefined);
        } else {
          addBlock(blockType, activeStageId || undefined);
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
          <div style={{ borderColor: "#E5DDD5" }}>
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
            componentsPanel={
              <CombinedComponentsPanel
                currentStepNumber={getStepNumberFromStageId(activeStageId)}
              />
            }
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
                <IntelligentPropertiesPanel
                  selectedBlock={{
                    id: selectedBlock.id,
                    type: selectedBlock.type,
                    properties: {
                      ...(selectedBlock.properties || {}),
                      ...(selectedBlock.content || {}),
                    },
                  }}
                  stepType={getStepTypeFromStageId(activeStageId)}
                  stepNumber={getStepNumberFromStageId(activeStageId)}
                  onUpdate={(blockId: string, updates: Record<string, any>) => {
                    updateBlock(blockId, updates);
                  }}
                  onClose={() => setSelectedBlockId(null)}
                  onPreview={() => setIsPreviewing(true)}
                  onReset={() => {
                    // TODO: Implementar reset para propriedades padrão
                    console.log("Reset proprieties for block:", selectedBlock.id);
                  }}
                />
              ) : !isPreviewing ? (
                <div className="h-full p-4 flex items-center justify-center text-stone-500">
                  <div className="text-center">
                    <p className="text-sm">Selecione um bloco para editar propriedades</p>
                    <p className="text-xs text-stone-400 mt-1">
                      Painel Inteligente ativo • Drag & Drop habilitado
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

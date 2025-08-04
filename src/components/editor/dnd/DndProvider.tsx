import { dragDropDebugger, performanceMonitor } from "@/utils/development";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import React from "react";
import { createPortal } from "react-dom";

// Tipo local para BlockData
interface BlockData {
  id: string;
  type: string;
  properties: Record<string, any>;
}

interface DndProviderProps {
  children: React.ReactNode;
  blocks: BlockData[];
  onBlocksReorder: (newBlocks: BlockData[]) => void;
  onBlockAdd: (blockType: string, position?: number) => void;
  onBlockSelect: (blockId: string) => void;
  selectedBlockId?: string;
  onBlockUpdate: (blockId: string, updates: Partial<BlockData>) => void;
}

export const DndProvider: React.FC<DndProviderProps> = ({
  children,
  blocks,
  onBlocksReorder,
  onBlockAdd,
  onBlockSelect,
  selectedBlockId,
  onBlockUpdate,
}) => {
  const [activeBlock, setActiveBlock] = React.useState<BlockData | null>(null);

  // Debug: Log de inicialização
  React.useEffect(() => {
    console.log("🚀 DndProvider montado! Blocks:", blocks.length);
  }, []);

  React.useEffect(() => {
    console.log(
      "📦 Blocks atualizados no DndProvider:",
      blocks.map(b => ({ id: b.id, type: b.type }))
    );
  }, [blocks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // Reduzir distância para ativação mais fácil
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 50, // Reduzir delay para responsividade
        tolerance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;

    performanceMonitor.startTiming("drag-operation");

    // DEBUG CRÍTICO: Log completo dos dados do active
    console.log("🟢 DragStart COMPLETO:", {
      "active.id": active.id,
      "active.data": active.data,
      "active.data.current": active.data.current,
      "active.data.current?.type": active.data.current?.type,
      "active.data.current?.blockType": active.data.current?.blockType,
      "Object.keys(active)": Object.keys(active),
      "Object.keys(active.data)": active.data ? Object.keys(active.data) : "NO DATA",
      "JSON.stringify(active.data.current)": JSON.stringify(active.data.current),
    });

    // Use enhanced debugging
    dragDropDebugger.logDragStart({
      id: active.id,
      type: active.data.current?.type,
      blockType: active.data.current?.blockType,
      data: active.data.current,
    });

    // FIXME: Verificação mais robusta dos dados
    if (!active.data.current) {
      dragDropDebugger.logError("active.data.current está undefined!", {
        activeId: active.id,
        activeKeys: Object.keys(active),
        dataKeys: active.data ? Object.keys(active.data) : "data é undefined",
      });
      return;
    }

    if (!active.data.current.type) {
      dragDropDebugger.logError("active.data.current.type está undefined!", {
        activeId: active.id,
        data: active.data.current,
        dataKeys: Object.keys(active.data.current),
      });
      return;
    }

    dragDropDebugger.logSuccess("Dados válidos detectados", {
      type: active.data.current.type,
      blockType: active.data.current.blockType,
      allData: active.data.current,
    });

    // 🎯 Haptic feedback para dispositivos móveis
    if ("vibrate" in navigator) {
      navigator.vibrate(50);
    }

    // Configurar activeBlock baseado no tipo
    if (active.data.current?.type === "sidebar-component") {
      // Para componentes do sidebar, criar um objeto temporário
      setActiveBlock({
        id: active.id.toString(),
        type: active.data.current.blockType,
        properties: {},
      });
    } else {
      // Para blocos existentes, buscar no array
      const activeBlockData = blocks.find(block => block.id === active.id);
      setActiveBlock(activeBlockData || null);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) {
      console.log("🟡 DragOver: over é null - não está sobre nenhuma drop zone");
      return;
    }

    console.log("🟡 DragOver:", {
      activeId: active.id,
      overId: over.id,
      activeType: active.data.current?.type,
      overType: over.data.current?.type,
      overData: over.data.current,
    });

    // Se estamos arrastando de um sidebar (componente novo)
    if (active.data.current?.type === "sidebar-component") {
      // Detectar drop zones múltiplas
      if (
        over.data.current?.type === "canvas-drop-zone" ||
        over.id === "canvas-drop-zone" ||
        over.id?.toString().startsWith("drop-zone-")
      ) {
        console.log("✅ Sidebar -> Canvas detectado durante DragOver");

        // Log da posição específica se for uma drop zone numerada
        if (over.id?.toString().startsWith("drop-zone-")) {
          const positionMatch = over.id.toString().match(/drop-zone-(\d+)/);
          if (positionMatch) {
            console.log("📍 Posição específica detectada:", positionMatch[1]);
          }
        }
        return;
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveBlock(null);
    performanceMonitor.endTiming("drag-operation");

    // Use enhanced debugging
    dragDropDebugger.logDragEnd({
      activeId: active.id,
      overId: over?.id,
      activeType: active.data.current?.type,
      overType: over?.data.current?.type,
      activeData: active.data.current,
      overData: over?.data.current,
      success: !!over,
    });

    if (!over) {
      dragDropDebugger.logError("Sem over target - drag cancelado");
      return;
    }

    // Reordenar blocos existentes no canvas
    if (
      active.data.current?.type === "canvas-block" &&
      over.data.current?.type === "canvas-block"
    ) {
      const activeIndex = blocks.findIndex(block => block.id === active.id);
      const overIndex = blocks.findIndex(block => block.id === over.id);

      console.log(`🔄 Reordenando: ${active.id} (${activeIndex}) -> ${over.id} (${overIndex})`);

      if (activeIndex !== overIndex && activeIndex !== -1 && overIndex !== -1) {
        const newBlocks = arrayMove(blocks, activeIndex, overIndex);
        console.log(
          "📦 Nova ordem dos blocos:",
          newBlocks.map(b => b.id)
        );
        onBlocksReorder(newBlocks);
      }
      return;
    }

    // Adicionar novo bloco do sidebar
    if (
      active.data.current?.type === "sidebar-component" &&
      (over.data.current?.type === "canvas-drop-zone" ||
        over.id === "canvas-drop-zone" ||
        over.id?.toString().startsWith("drop-zone-"))
    ) {
      const blockType = active.data.current.blockType;

      // Calcular posição baseada no ID da drop zone
      let position = blocks.length; // Default: adicionar no final

      if (over.id?.toString().startsWith("drop-zone-")) {
        // Extrair posição do ID: "drop-zone-0", "drop-zone-1", etc.
        const positionMatch = over.id.toString().match(/drop-zone-(\d+)/);
        if (positionMatch) {
          position = parseInt(positionMatch[1], 10);
        }
      } else if (over.data.current?.position !== undefined) {
        // Usar posição dos dados da drop zone
        position = over.data.current.position;
      }

      console.log("✅ SUCESSO: Adicionando bloco:", blockType, "na posição:", position);
      console.log("📍 Drop zone info:", {
        overId: over.id,
        overType: over.data.current?.type,
        calculatedPosition: position,
        totalBlocks: blocks.length,
      });

      // Garantir que o callback existe
      if (typeof onBlockAdd === "function") {
        onBlockAdd(blockType, position);
        dragDropDebugger.logSuccess("onBlockAdd chamado", { blockType, position });
      } else {
        dragDropDebugger.logError("onBlockAdd não é uma função");
      }
      return;
    }

    // Debug: Log quando não há match
    dragDropDebugger.logError("Nenhuma condição de drop atendida", {
      activeType: active.data.current?.type,
      overType: over.data.current?.type,
      activeId: active.id,
      overId: over.id,
      // Debugging específico para sidebar-component
      isSidebarComponent: active.data.current?.type === "sidebar-component",
      isCanvasDropZoneType: over.data.current?.type === "canvas-drop-zone",
      isCanvasDropZoneId: over.id === "canvas-drop-zone",
      isDropZonePattern: over.id?.toString().startsWith("drop-zone-"),
      overIdString: over.id?.toString(),
    });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter} // Mudando para closestCenter que é mais confiável
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {/* Remover SortableContext temporariamente para testar se há conflito */}
      {children}

      {/* Drag Overlay aprimorado para preview premium */}
      {createPortal(
        <DragOverlay>
          {activeBlock ? (
            <div
              className="
              bg-white/95 backdrop-blur-md shadow-2xl rounded-xl 
              border-2 border-brand/60 ring-1 ring-brand/30
              transform rotate-2 scale-105 p-4
              animate-pulse transition-all duration-200
              min-w-[200px]
            "
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-brand/10 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-brand rounded-sm"></div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-stone-800">{activeBlock.type}</div>
                  <div className="text-xs text-stone-500">Arrastando componente...</div>
                </div>
              </div>
            </div>
          ) : null}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
};

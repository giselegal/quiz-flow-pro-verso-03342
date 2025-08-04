import React, { useState } from "react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { useEditor } from "@/context/EditorContext";
import EnhancedComponentsSidebar from "./EnhancedComponentsSidebar";
import { CanvasDropZone } from "./canvas/CanvasDropZone";
import { PropertyPanel } from "./PropertyPanel";
import { DndProvider } from "./dnd/DndProvider";

interface SchemaDrivenEditorResponsiveProps {
  funnelId?: string;
  className?: string;
}

const SchemaDrivenEditorResponsive: React.FC<
  SchemaDrivenEditorResponsiveProps
> = ({ funnelId, className = "" }) => {
  const {
    computed: { currentBlocks, selectedBlock },
    selectedBlockId,
    blockActions: { setSelectedBlockId, addBlock, updateBlock, deleteBlock },
    uiState: { isPreviewing, setIsPreviewing },
  } = useEditor();

  return (
    <div className={`h-full w-full bg-gray-50 ${className}`}>
      <DndProvider
        blocks={currentBlocks.map((block) => ({
          id: block.id,
          type: block.type,
          properties: block.properties || {},
        }))}
        onBlocksReorder={(newBlocks) => {
          console.log("🔄 Reordenando blocos via schema editor:", newBlocks);
          // TODO: Implementar reordenação no EditorContext
        }}
        onBlockAdd={(blockType, position) => {
          const blockId = addBlock(blockType);
          console.log(
            `➕ Bloco ${blockType} adicionado via schema editor na posição ${position}`,
          );
        }}
        onBlockSelect={(blockId) => {
          setSelectedBlockId(blockId);
        }}
        selectedBlockId={selectedBlockId || undefined}
        onBlockUpdate={(blockId, updates) => {
          updateBlock(blockId, updates as any);
        }}
      >
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Sidebar de componentes */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <EnhancedComponentsSidebar />
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Canvas principal */}
          <ResizablePanel defaultSize={55}>
            <CanvasDropZone
              blocks={currentBlocks}
              selectedBlockId={selectedBlockId}
              isPreviewing={isPreviewing}
              activeStageId="1" // TODO: Integrar com sistema de stages
              stageCount={1} // TODO: Integrar com sistema de stages
              onSelectBlock={setSelectedBlockId}
              onUpdateBlock={updateBlock}
              onDeleteBlock={deleteBlock}
            />
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Painel de propriedades */}
          <ResizablePanel defaultSize={25}>
            <PropertyPanel
              selectedBlock={selectedBlock || null}
              onUpdateBlock={updateBlock}
              onDeleteBlock={deleteBlock}
              onClose={() => setSelectedBlockId(null)}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </DndProvider>
    </div>
  );
};

export default SchemaDrivenEditorResponsive;

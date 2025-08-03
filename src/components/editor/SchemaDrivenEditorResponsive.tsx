
import React, { useState } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { useEditor } from '@/context/EditorContext';
import { ComponentsSidebar } from './sidebar/ComponentsSidebar';
import { EditorCanvas } from './canvas/EditorCanvas';
import { PropertyPanel } from './PropertyPanel';

interface SchemaDrivenEditorResponsiveProps {
  funnelId?: string;
  className?: string;
}

const SchemaDrivenEditorResponsive: React.FC<SchemaDrivenEditorResponsiveProps> = ({
  funnelId,
  className = ''
}) => {
  const {
    computed: { currentBlocks, selectedBlock },
    selectedBlockId,
    blockActions: { setSelectedBlockId, addBlock, updateBlock, deleteBlock },
    uiState: { isPreviewing, setIsPreviewing }
  } = useEditor();

  return (
    <div className={`h-full w-full bg-gray-50 ${className}`}>
      <ResizablePanelGroup direction="horizontal" className="h-full">
        {/* Sidebar de componentes */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <ComponentsSidebar onComponentSelect={addBlock} />
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Canvas principal */}
        <ResizablePanel defaultSize={55}>
          <EditorCanvas
            blocks={currentBlocks}
            selectedBlockId={selectedBlockId}
            onSelectBlock={setSelectedBlockId}
            onUpdateBlock={updateBlock}
            onDeleteBlock={deleteBlock}
            onReorderBlocks={() => {}} // TODO: implementar reorder
            isPreviewing={isPreviewing}
            viewportSize="lg"
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
    </div>
  );
};

export default SchemaDrivenEditorResponsive;

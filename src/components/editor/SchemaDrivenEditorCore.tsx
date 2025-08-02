
import React, { useState } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { EditorProvider } from '@/context/EditorContext';
import { ComponentsSidebar } from './sidebar/ComponentsSidebar';
import { EditorCanvas } from './canvas/EditorCanvas';
import { AdvancedPropertyPanel } from './AdvancedPropertyPanel';

interface SchemaDrivenEditorCoreProps {
  funnelId?: string;
  className?: string;
}

export const SchemaDrivenEditorCore: React.FC<SchemaDrivenEditorCoreProps> = ({
  funnelId,
  className = ''
}) => {
  const [isPreviewing, setIsPreviewing] = useState(false);

  return (
    <EditorProvider>
      <SchemaDrivenEditorCoreContent 
        funnelId={funnelId}
        className={className}
        isPreviewing={isPreviewing}
        setIsPreviewing={setIsPreviewing}
      />
    </EditorProvider>
  );
};

interface SchemaDrivenEditorCoreContentProps {
  funnelId?: string;
  className: string;
  isPreviewing: boolean;
  setIsPreviewing: (value: boolean) => void;
}

const SchemaDrivenEditorCoreContent: React.FC<SchemaDrivenEditorCoreContentProps> = ({
  funnelId,
  className,
  isPreviewing,
  setIsPreviewing
}) => {
  const {
    blocks,
    selectedBlockId,
    setSelectedBlockId,
    actions
  } = useEditor();

  const selectedBlock = blocks.find(block => block.id === selectedBlockId);

  return (
    <div className={`h-full w-full bg-gray-50 ${className}`}>
      <ResizablePanelGroup direction="horizontal" className="h-full">
        {/* Sidebar de componentes */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <ComponentsSidebar onComponentSelect={actions.addBlock} />
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Canvas principal */}
        <ResizablePanel defaultSize={55}>
          <EditorCanvas
            blocks={blocks}
            selectedBlockId={selectedBlockId}
            onSelectBlock={setSelectedBlockId}
            onUpdateBlock={actions.updateBlock}
            onDeleteBlock={actions.deleteBlock}
            onReorderBlocks={actions.reorderBlocks}
            isPreviewing={isPreviewing}
            viewportSize="lg"
          />
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Painel de propriedades */}
        <ResizablePanel defaultSize={25}>
          <AdvancedPropertyPanel
            selectedBlock={selectedBlock || null}
            onUpdateBlock={actions.updateBlock}
            onDeleteBlock={actions.deleteBlock}
            onClose={() => setSelectedBlockId(null)}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

// Import necessário que estava faltando
import { useEditor } from '@/context/EditorContext';

export default SchemaDrivenEditorCore;

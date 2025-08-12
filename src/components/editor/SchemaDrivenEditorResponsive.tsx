import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { useEditor } from '@/context/EditorContext';
import { CanvasDropZone } from './canvas/CanvasDropZone';
import { PropertyPanel } from './PropertyPanel';
import ComponentsSidebar from './sidebar/ComponentsSidebar';

interface SchemaDrivenEditorResponsiveProps {
  funnelId?: string;
  className?: string;
}

const SchemaDrivenEditorResponsive: React.FC<SchemaDrivenEditorResponsiveProps> = ({
  funnelId: _funnelId,
  className = '',
}) => {
  const {
    computed: { currentBlocks, selectedBlock },
    selectedBlockId,
    blockActions: { setSelectedBlockId, addBlock, updateBlock, deleteBlock },
    uiState: { isPreviewing },
  } = useEditor();

  const handleComponentSelect = (type: string) => {
    const blockId = addBlock(type);
    setSelectedBlockId(blockId);
    console.log(`➕ Bloco ${type} adicionado via editor responsivo`);
  };

  const handleUpdateSelectedBlock = (updates: any) => {
    if (selectedBlockId) {
      updateBlock(selectedBlockId, updates);
    }
  };

  return (
    <div className={`h-full w-full bg-gray-50 ${className}`}>
      <ResizablePanelGroup direction="horizontal" className="h-full">
        {/* Sidebar de componentes */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <ComponentsSidebar onComponentSelect={handleComponentSelect} />
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Canvas principal */}
        <ResizablePanel defaultSize={55}>
          <CanvasDropZone
            blocks={currentBlocks}
            selectedBlockId={selectedBlockId}
            isPreviewing={isPreviewing}
            onSelectBlock={setSelectedBlockId}
            onUpdateBlock={updateBlock}
            onDeleteBlock={deleteBlock}
          />
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Painel de propriedades */}
        <ResizablePanel defaultSize={25}>
          <PropertyPanel selectedComponent={selectedBlock} onUpdate={handleUpdateSelectedBlock} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default SchemaDrivenEditorResponsive;

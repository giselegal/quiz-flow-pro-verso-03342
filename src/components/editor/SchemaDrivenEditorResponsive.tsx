import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { useEditor } from '@/context/EditorContext';
import { useFunnelNavigation } from '@/hooks/useFunnelNavigation';
import { CanvasDropZone } from './canvas/CanvasDropZone';
import { PropertyPanel } from './PropertyPanel';
import ComponentsSidebar from './sidebar/ComponentsSidebar';
import { FunnelNavigation } from '../editor-fixed/FunnelNavigation';

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
  } = useEditor();

  const funnelNavigation = useFunnelNavigation();

  const handleComponentSelect = async (type: string) => {
    try {
      const blockId = await addBlock(type);
      if (blockId) {
        setSelectedBlockId(blockId);
        console.log(`➕ Bloco ${type} adicionado via editor responsivo`);
      }
    } catch (error) {
      console.error('❌ Erro ao adicionar bloco:', error);
    }
  };

  const handleUpdateSelectedBlock = async (updates: any) => {
    if (selectedBlockId) {
      try {
        await updateBlock(selectedBlockId, updates);
        console.log('✅ Bloco atualizado via editor responsivo:', selectedBlockId);
      } catch (error) {
        console.error('❌ Erro ao atualizar bloco:', error);
      }
    }
  };

  return (
    <div className={`h-full w-full bg-gray-50 ${className}`}>
      {/* Navigation Header */}
      <div className="h-16 border-b bg-white flex items-center px-4">
        <FunnelNavigation
          currentStep={funnelNavigation.currentStepNumber}
          totalSteps={funnelNavigation.totalSteps}
          onStepChange={funnelNavigation.navigateToStep}
          onSave={funnelNavigation.handleSave}
          onPreview={funnelNavigation.handlePreview}
          isSaving={funnelNavigation.isSaving}
          canNavigateNext={funnelNavigation.canNavigateNext}
          canNavigatePrevious={funnelNavigation.canNavigatePrevious}
        />
      </div>
      
      <ResizablePanelGroup direction="horizontal" className="h-[calc(100%-4rem)]">
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

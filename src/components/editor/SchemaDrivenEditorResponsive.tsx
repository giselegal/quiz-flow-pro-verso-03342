import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { useEditor } from '@/context/EditorContext';
import { useFunnelNavigation } from '@/hooks/useFunnelNavigation';
import { CanvasDropZone } from './canvas/CanvasDropZone';
import { EnhancedUniversalPropertiesPanel } from '@/components/universal/EnhancedUniversalPropertiesPanel';
import ComponentsSidebar from './sidebar/ComponentsSidebar';
// FunnelNavigation removido - componente não mais disponível
// import { FunnelNavigation } from '../editor-fixed/FunnelNavigation';

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
      const blockId = await addBlock(type as any); // Type assertion for compatibility
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
        {/* FunnelNavigation removido durante limpeza de conflitos */}
        <div className="bg-gray-100 p-4 rounded-lg text-sm text-gray-600">
          <div className="flex items-center justify-between">
            <span>
              Etapa {funnelNavigation.currentStepNumber} de {funnelNavigation.totalSteps}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  funnelNavigation.navigateToStep(funnelNavigation.currentStepNumber - 1)
                }
                disabled={!funnelNavigation.canNavigatePrevious}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                onClick={() =>
                  funnelNavigation.navigateToStep(funnelNavigation.currentStepNumber + 1)
                }
                disabled={!funnelNavigation.canNavigateNext}
                className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
              >
                Próxima
              </button>
            </div>
          </div>
        </div>
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
          <EnhancedUniversalPropertiesPanel selectedBlock={selectedBlock || null} onUpdate={handleUpdateSelectedBlock} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default SchemaDrivenEditorResponsive;

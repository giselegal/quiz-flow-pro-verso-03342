import React from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { useEditor } from '@/context/EditorContext';
import { usePropertyHistory } from '@/hooks/usePropertyHistory';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { CanvasDropZone } from './canvas/CanvasDropZone';
import { EnhancedUniversalPropertiesPanel } from '@/components/universal/EnhancedUniversalPropertiesPanel';
import ComponentsSidebar from './sidebar/ComponentsSidebar';
import FunnelNavbar from '../live-editor/navbar/FunnelNavbar';

interface EnhancedLiveEditorProps {
  funnelId?: string;
  className?: string;
}

const EnhancedLiveEditor: React.FC<EnhancedLiveEditorProps> = ({
  funnelId: _funnelId,
  className = '',
}) => {
  const {
    computed: { currentBlocks, selectedBlock },
    selectedBlockId,
    blockActions: { setSelectedBlockId, addBlock, updateBlock, deleteBlock },
    uiState: { isPreviewing, setIsPreviewing, viewportSize, setViewportSize },
    persistenceActions: { saveFunnel },
  } = useEditor();

  const propertyHistory = usePropertyHistory();

  // State for advanced features
  const [publishLoading, setPublishLoading] = React.useState(false);
  const [saveLoading, setSaveLoading] = React.useState(false);

  const handleComponentSelect = async (type: string) => {
    try {
      const blockId = await addBlock(type);
      if (blockId) {
        setSelectedBlockId(blockId);
        console.log(`➕ Bloco ${type} adicionado via live editor`);
      }
    } catch (error) {
      console.error('❌ Erro ao adicionar bloco:', error);
    }
  };

  const handleUpdateSelectedBlock = async (updates: any) => {
    if (selectedBlockId) {
      try {
        await updateBlock(selectedBlockId, updates);
        console.log('✅ Bloco atualizado via live editor:', selectedBlockId);
      } catch (error) {
        console.error('❌ Erro ao atualizar bloco:', error);
      }
    }
  };

  const handleSave = async () => {
    setSaveLoading(true);
    try {
      console.log('💾 Iniciando salvamento...');
      const result = await saveFunnel();
      if (result.success) {
        console.log('✅ Projeto salvo com sucesso!');
        // You could add a toast notification here
      } else {
        console.error('❌ Erro no salvamento:', result.error);
      }
    } catch (error) {
      console.error('❌ Erro inesperado ao salvar:', error);
    } finally {
      setSaveLoading(false);
    }
  };

  const handlePublish = async () => {
    setPublishLoading(true);
    try {
      console.log('🚀 Iniciando publicação...');
      // Add your publish logic here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      console.log('✅ Projeto publicado com sucesso!');
      // You could add a toast notification here
    } catch (error) {
      console.error('❌ Erro ao publicar:', error);
    } finally {
      setPublishLoading(false);
    }
  };

  const handleDeleteBlock = (blockId: string) => {
    if (window.confirm('Tem certeza que deseja deletar este bloco?')) {
      deleteBlock(blockId);
      setSelectedBlockId(null);
    }
  };

  // Configure keyboard shortcuts
  useKeyboardShortcuts({
    onUndo: propertyHistory.undo,
    onRedo: propertyHistory.redo,
    onDelete: selectedBlockId ? () => handleDeleteBlock(selectedBlockId) : undefined,
    canUndo: propertyHistory.canUndo,
    canRedo: propertyHistory.canRedo,
    hasSelectedBlock: !!selectedBlockId,
  });

  // Get canvas classes based on viewport size for responsive preview
  const getCanvasClassName = () => {
    const baseClasses = 'transition-all duration-300 ease-out mx-auto bg-white rounded-lg shadow-lg border';

    switch (viewportSize) {
      case 'sm':
        return `${baseClasses} w-[375px] min-h-[600px]`;
      case 'md':
        return `${baseClasses} w-[768px] min-h-[800px]`;
      case 'lg':
      case 'xl':
      default:
        return `${baseClasses} w-full min-h-[900px]`;
    }
  };

  return (
    <div className={`h-screen w-full bg-gray-50 flex flex-col ${className}`}>
      {/* Enhanced Funnel Navbar */}
      <FunnelNavbar
        onSave={handleSave}
        onPublish={handlePublish}
        onUndo={propertyHistory.undo}
        onRedo={propertyHistory.redo}
        canUndo={propertyHistory.canUndo}
        canRedo={propertyHistory.canRedo}
        isPreviewing={isPreviewing}
        onTogglePreview={() => setIsPreviewing(!isPreviewing)}
        viewportSize={viewportSize}
        onViewportSizeChange={setViewportSize}
      />

      {/* Main Editor Layout */}
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Sidebar de componentes */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <div className="h-full border-r border-gray-200">
            <ComponentsSidebar onComponentSelect={handleComponentSelect} />
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Canvas principal */}
        <ResizablePanel defaultSize={55}>
          <div className="h-full p-4 bg-gray-50 overflow-auto">
            <div className={getCanvasClassName()}>
              <CanvasDropZone
                blocks={currentBlocks}
                selectedBlockId={selectedBlockId}
                onSelectBlock={setSelectedBlockId}
                onUpdateBlock={updateBlock}
                onDeleteBlock={handleDeleteBlock}
              />
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Painel de propriedades */}
        <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
          <div className="h-full border-l border-gray-200">
            {selectedBlock && !isPreviewing ? (
              <EnhancedUniversalPropertiesPanel
                selectedBlock={selectedBlock}
                onUpdate={handleUpdateSelectedBlock}
                onClose={() => setSelectedBlockId(null)}
                onDelete={() => {
                  if (selectedBlockId) {
                    handleDeleteBlock(selectedBlockId);
                  }
                }}
              />
            ) : (
              <div className="h-full flex items-center justify-center p-4">
                <div className="text-center text-gray-500">
                  {isPreviewing ? (
                    <>
                      <h3 className="font-medium mb-2">Modo Preview Ativo</h3>
                      <p className="text-sm">Desative o preview para editar propriedades</p>
                    </>
                  ) : (
                    <>
                      <h3 className="font-medium mb-2">Selecione um Componente</h3>
                      <p className="text-sm">Clique em um bloco no canvas para editar suas propriedades</p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* Loading states (optional) */}
      {(saveLoading || publishLoading) && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span>
                {saveLoading ? 'Salvando projeto...' : 'Publicando projeto...'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedLiveEditor;
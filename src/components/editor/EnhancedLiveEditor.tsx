import React from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { useEditor } from '@/context/EditorContext.simple';
import { usePropertyHistory } from '@/hooks/usePropertyHistory.simple';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts.simple';
import { CanvasDropZone } from './canvas/CanvasDropZone.simple';
import { EnhancedUniversalPropertiesPanel } from '@/components/universal/EnhancedUniversalPropertiesPanel.simple';
import FunnelStagesPanel from './funnel/FunnelStagesPanel.simple';
import ComponentsSidebar from './components/ComponentsSidebar';
import FunnelNavbar from '@/components/funnel/FunnelNavbar';

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
    uiState: { isPreviewing, viewportSize },
  } = useEditor();

  const propertyHistory = usePropertyHistory();

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
    const baseClasses =
      'transition-all duration-300 ease-out mx-auto bg-white rounded-lg shadow-lg border';

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
      {/* Navigation Toolbar */}
      <FunnelNavbar />

      {/* Main Editor Layout - 4 Columns */}
      <ResizablePanelGroup direction="horizontal" className="flex-1 bg-gray-50">
        {/* Column 1: Stages Panel - MAIS VISÍVEL */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30} className="min-w-[220px]">
          <div className="h-full bg-white border-r-2 border-gray-300 shadow-sm">
            <div className="p-2 border-b bg-blue-50">
              <h4 className="font-semibold text-blue-800 text-sm">📊 PAINEL DE ETAPAS</h4>
            </div>
            <FunnelStagesPanel />
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle className="w-1 bg-gray-300 hover:bg-blue-400" />

        {/* Column 2: Components Sidebar */}
        <ResizablePanel defaultSize={22} minSize={18} maxSize={32} className="min-w-[270px]">
          <div className="h-full bg-gray-50 border-r-2 border-gray-300 shadow-sm">
            <div className="p-2 border-b bg-green-50">
              <h4 className="font-semibold text-green-800 text-sm">🧩 COMPONENTES</h4>
            </div>
            <ComponentsSidebar onComponentSelect={handleComponentSelect} />
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Column 3: Canvas Principal */}
        <ResizablePanel defaultSize={40} minSize={30} className="min-w-[400px]">
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

        {/* Column 4: Properties Panel */}
        <ResizablePanel defaultSize={25} minSize={20} maxSize={35} className="min-w-[300px]">
          <div className="h-full border-l border-gray-200 bg-card/30">
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
                      <p className="text-sm">
                        Clique em um bloco no canvas para editar suas propriedades
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default EnhancedLiveEditor;

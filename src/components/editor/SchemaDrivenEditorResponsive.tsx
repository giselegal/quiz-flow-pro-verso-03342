
import React, { useState, useCallback, useMemo } from 'react';
// import { DndProvider } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Plus, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEditor } from '@/hooks/useEditor';
import { UniversalBlockRenderer } from './blocks/UniversalBlockRenderer';
import type { BlockData } from '../../types/blocks';

interface SchemaDrivenEditorResponsiveProps {
  funnelId?: string;
  className?: string;
}

const AVAILABLE_BLOCKS = [
  { type: 'heading', name: 'Título', icon: '📝', category: 'text' },
  { type: 'text', name: 'Texto', icon: '📄', category: 'text' },
  { type: 'image', name: 'Imagem', icon: '🖼️', category: 'media' },
  { type: 'button', name: 'Botão', icon: '🔘', category: 'interactive' },
  { type: 'cta', name: 'Call to Action', icon: '🎯', category: 'interactive' },
  { type: 'options-grid', name: 'Grade de Opções', icon: '⚏', category: 'quiz' },
  { type: 'vertical-canvas-header', name: 'Cabeçalho Quiz', icon: '🏷️', category: 'quiz' },
];

const SchemaDrivenEditorResponsive: React.FC<SchemaDrivenEditorResponsiveProps> = ({
  funnelId,
  className
}) => {
  const { config, addBlock, updateBlock, deleteBlock, saveConfig } = useEditor();
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);

  const handleAddBlock = useCallback((blockType: string) => {
    const newBlockId = addBlock(blockType as any);
    setSelectedBlockId(newBlockId);
  }, [addBlock]);

  const handleSaveInline = useCallback((blockId: string, updates: Partial<BlockData>) => {
    updateBlock(blockId, updates.properties || {});
  }, [updateBlock]);

  const handleBlockClick = useCallback((blockId: string) => {
    if (!isPreviewing) {
      setSelectedBlockId(blockId);
    }
  }, [isPreviewing]);

  const sortedBlocks = useMemo(() => {
    return [...config.blocks].sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [config.blocks]);

  return (
    // <DndProvider backend={HTML5Backend}>
      <div className={cn('h-full flex flex-col bg-gray-50', className)}>
        {/* Header */}
        <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-2">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">Editor Visual</h1>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPreviewing(!isPreviewing)}
                className="flex items-center gap-2"
              >
                {isPreviewing ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {isPreviewing ? 'Editar' : 'Visualizar'}
              </Button>
              <Button onClick={saveConfig} size="sm">
                Salvar
              </Button>
            </div>
          </div>
        </div>

        <ResizablePanelGroup direction="horizontal" className="flex-1">
          {/* Components Sidebar */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <div className="h-full bg-white border-r border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-medium text-gray-900">Componentes</h2>
              </div>
              <ScrollArea className="h-full p-4">
                <div className="space-y-2">
                  {AVAILABLE_BLOCKS.map((block) => (
                    <Button
                      key={block.type}
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddBlock(block.type)}
                      className="w-full justify-start text-left"
                      disabled={isPreviewing}
                    >
                      <span className="mr-2">{block.icon}</span>
                      {block.name}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Canvas */}
          <ResizablePanel defaultSize={60}>
            <div className="h-full bg-gray-50 overflow-hidden">
              <ScrollArea className="h-full p-6">
                <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm min-h-96">
                  <div className="p-6">
                    {sortedBlocks.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
                        <Plus className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-gray-500 text-center">
                          Arraste componentes da barra lateral para começar
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {sortedBlocks.map((block) => {
                          const blockData: BlockData = {
                            id: block.id,
                            type: block.type,
                            properties: block.content || {},
                            order: block.order || 0
                          };

                          return (
                            <div
                              key={block.id}
                              className={cn(
                                'transition-all duration-200',
                                selectedBlockId === block.id && !isPreviewing && 
                                'ring-2 ring-blue-500 rounded-lg'
                              )}
                            >
                              <UniversalBlockRenderer
                                block={blockData}
                                isSelected={selectedBlockId === block.id}
                                onClick={() => handleBlockClick(block.id)}
                                onSaveInline={handleSaveInline}
                                disabled={isPreviewing}
                              />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </ScrollArea>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Properties Panel */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <div className="h-full bg-white border-l border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-medium text-gray-900">Propriedades</h2>
              </div>
              <div className="p-4">
                {selectedBlockId ? (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Bloco selecionado: {selectedBlockId}
                    </p>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        deleteBlock(selectedBlockId);
                        setSelectedBlockId(null);
                      }}
                      className="w-full"
                    >
                      Deletar Bloco
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    Selecione um bloco para editar suas propriedades
                  </p>
                )}
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    // </DndProvider>
  );
};

export default SchemaDrivenEditorResponsive;

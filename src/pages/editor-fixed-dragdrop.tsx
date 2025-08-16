import React, { useState, useCallback, useMemo } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useEditor } from '@/context/EditorContext';
import { useSyncedScroll } from '@/hooks/useSyncedScroll';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import SortableBlockItem from '@/components/editor/SortableBlockItem';
import UniversalPropertiesPanel from '@/components/universal/SimplifiedUniversalPropertiesPanel';
import { BlockRenderer } from '@/components/editor/BlockRenderer';
import { EDITOR_BLOCKS_MAP } from '@/config/editorBlocksMapping';
import { BlockType } from '@/types/BlockType';
import { cn } from '@/lib/utils';
import { 
  Plus, 
  Settings, 
  Eye, 
  Save, 
  Trash2,
  Layout,
  Layers,
  FileText,
  MousePointer,
  Move,
  Palette
} from 'lucide-react';

const EditorFixedPageWithDragDrop: React.FC = () => {
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'blocks' | 'properties'>('blocks');

  const editorContext = useEditor();
  const {
    blocks,
    selectedBlock,
    addBlock,
    updateBlock,
    deleteBlock,
    reorderBlocks,
    selectBlock,
    duplicateBlock,
    clearSelection,
    quizState,
  } = editorContext;

  // ✅ DEBUG: Log do estado do quiz com null check
  console.log('🎯 Editor Quiz State:', {
    userName: quizState?.userName || 'N/A',
    answersCount: quizState?.answers?.length || 0,
    isCompleted: quizState?.isQuizCompleted || false,
  });

  // Safe scroll sync with try-catch
  const { scrollRef: canvasScrollRef } = useSyncedScroll({ 
    source: 'canvas',
    enabled: true 
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex(block => block.id === active.id);
      const newIndex = blocks.findIndex(block => block.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const reorderedBlocks = arrayMove(blocks, oldIndex, newIndex);
        reorderBlocks(reorderedBlocks);
      }
    }
  }, [blocks, reorderBlocks]);

  const availableBlockTypes = useMemo(() => {
    return Object.keys(EDITOR_BLOCKS_MAP).map(type => ({
      type: type as BlockType,
      name: type.charAt(0).toUpperCase() + type.slice(1),
      icon: getBlockIcon(type),
    }));
  }, []);

  const handleAddBlock = useCallback((blockType: string) => {
    console.log('🔥 Adding block:', blockType);
    try {
      addBlock(blockType as BlockType);
    } catch (error) {
      console.error('❌ Error adding block:', error);
    }
  }, [addBlock]);

  const handleSelectBlock = useCallback((blockId: string) => {
    setSelectedBlockId(blockId);
    selectBlock(blockId);
    setActiveTab('properties');
  }, [selectBlock]);

  const handleUpdateBlock = useCallback((blockId: string, updates: any) => {
    updateBlock(blockId, updates);
  }, [updateBlock]);

  const handleDeleteBlock = useCallback((blockId: string) => {
    deleteBlock(blockId);
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
      clearSelection();
      setActiveTab('blocks');
    }
  }, [deleteBlock, selectedBlockId, clearSelection]);

  const handleDuplicateBlock = useCallback((blockId: string) => {
    duplicateBlock(blockId);
  }, [duplicateBlock]);

  const handleCloseProperties = useCallback(() => {
    setSelectedBlockId(null);
    clearSelection();
    setActiveTab('blocks');
  }, [clearSelection]);

  // ✅ SAFE BLOCK CREATION: Fixed BlockType conversion
  const createNewBlock = (type: string): any => {
    return {
      id: `block-${Date.now()}`,
      type: type as BlockType,
      properties: {},
      content: { text: `Novo ${type}` },
      order: blocks.length,
    };
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar - Lista de Blocos */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Layout className="w-5 h-5 text-indigo-600" />
            <h2 className="font-semibold text-gray-900">Editor de Componentes</h2>
          </div>
          
          <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
            <Button
              variant={activeTab === 'blocks' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('blocks')}
              className="flex-1"
            >
              <Layers className="w-4 h-4 mr-1" />
              Blocos
            </Button>
            <Button
              variant={activeTab === 'properties' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('properties')}
              className="flex-1"
            >
              <Settings className="w-4 h-4 mr-1" />
              Propriedades
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 p-4">
          {activeTab === 'blocks' && (
            <div className="space-y-4">
              {/* Adicionar Novos Blocos */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Adicionar Componente
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {availableBlockTypes.map(({ type, name, icon }) => (
                    <Button
                      key={type}
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddBlock(type)}
                      className="w-full justify-start"
                    >
                      {icon}
                      {name}
                    </Button>
                  ))}
                </CardContent>
              </Card>

              {/* Lista de Blocos Atuais */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    Componentes ({blocks.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={blocks.map(block => block.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-2">
                        {blocks.map((block) => (
                          <SortableBlockItem
                            key={block.id}
                            block={block}
                            isSelected={selectedBlockId === block.id}
                            onSelect={() => handleSelectBlock(block.id)}
                            onDelete={() => handleDeleteBlock(block.id)}
                            onDuplicate={() => handleDuplicateBlock(block.id)}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                  
                  {blocks.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Layers className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Nenhum componente adicionado</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'properties' && (
            <div>
              {selectedBlock ? (
                <UniversalPropertiesPanel
                  selectedBlock={selectedBlock}
                  onUpdate={handleUpdateBlock}
                  onDelete={handleDeleteBlock}
                  onClose={handleCloseProperties}
                />
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Settings className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Selecione um componente para editar suas propriedades</p>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Canvas - Preview */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">Preview do Funnel</span>
              <Badge variant="secondary">{blocks.length} componentes</Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Save className="w-4 h-4 mr-1" />
                Salvar
              </Button>
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-1" />
                Visualizar
              </Button>
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div 
          ref={canvasScrollRef}
          className="flex-1 overflow-y-auto bg-gray-50 p-6"
        >
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[600px]">
              <div className="p-6 space-y-4">
                {blocks.map((block) => (
                  <div
                    key={block.id}
                    className={cn(
                      "relative group transition-all duration-200 rounded-lg",
                      selectedBlockId === block.id && "ring-2 ring-indigo-500 ring-offset-2"
                    )}
                    onClick={() => handleSelectBlock(block.id)}
                  >
                    {/* Block Selection Overlay */}
                    {selectedBlockId === block.id && (
                      <div className="absolute -top-8 left-0 flex items-center gap-1 z-10">
                        <Badge variant="default" className="text-xs">
                          {block.type}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicateBlock(block.id);
                          }}
                          className="h-6 w-6 p-0"
                        >
                          <Move className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteBlock(block.id);
                          }}
                          className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    )}

                    <div className="hover:bg-gray-50 transition-colors duration-200 p-2 rounded">
                      <BlockRenderer block={block} />
                    </div>
                  </div>
                ))}

                {/* Empty State */}
                {blocks.length === 0 && (
                  <div className="text-center py-16 text-gray-500">
                    <MousePointer className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">Canvas Vazio</h3>
                    <p className="text-sm">Adicione componentes da barra lateral para começar a construir seu funnel</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function for block icons
function getBlockIcon(type: string) {
  const icons: Record<string, React.ReactNode> = {
    text: <FileText className="w-4 h-4 mr-2" />,
    header: <Layout className="w-4 h-4 mr-2" />,
    button: <MousePointer className="w-4 h-4 mr-2" />,
    image: <Palette className="w-4 h-4 mr-2" />,
  };
  
  return icons[type] || <Layout className="w-4 h-4 mr-2" />;
}

export default EditorFixedPageWithDragDrop;

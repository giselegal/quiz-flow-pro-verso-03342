import React, { useState, useCallback, useMemo } from 'react';
import { useEditor } from '@/context/EditorContext';
import { useSyncedScroll } from '@/hooks/useSyncedScroll';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
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

const EditorPage: React.FC = () => {
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'blocks' | 'properties'>('blocks');

  const {
    blocks,
    selectedBlock,
    addBlock,
    updateBlock,
    deleteBlock,
    selectBlock,
    duplicateBlock,
    clearSelection,
  } = useEditor();

  const { scrollRef: canvasScrollRef } = useSyncedScroll({ 
    source: 'canvas',
    enabled: true 
  });

  const availableBlockTypes = useMemo(() => {
    return Object.keys(EDITOR_BLOCKS_MAP).map(type => ({
      type: type as BlockType,
      name: type.charAt(0).toUpperCase() + type.slice(1),
      icon: getBlockIcon(type),
    }));
  }, []);

  const handleAddBlock = useCallback((blockType: string) => {
    addBlock(blockType as BlockType);
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

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Layout className="w-5 h-5 text-indigo-600" />
            <h2 className="font-semibold text-gray-900">Editor Principal</h2>
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
              {/* Add Block Section */}
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

              {/* Blocks List */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    Componentes ({blocks.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {blocks.map((block) => (
                      <div
                        key={block.id}
                        className={cn(
                          "p-3 border rounded-lg cursor-pointer transition-all hover:border-indigo-300",
                          selectedBlockId === block.id 
                            ? "border-indigo-500 bg-indigo-50" 
                            : "border-gray-200"
                        )}
                        onClick={() => handleSelectBlock(block.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-sm">{block.type}</div>
                            <div className="text-xs text-gray-500 truncate">
                              {block.id}
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
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
                              variant="ghost"
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
                        </div>
                      </div>
                    ))}
                  </div>
                  
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
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Propriedades</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCloseProperties}
                    >
                      ×
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">ID</label>
                      <input 
                        className="w-full p-2 border rounded text-sm"
                        value={selectedBlock.id} 
                        disabled 
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Tipo</label>
                      <input 
                        className="w-full p-2 border rounded text-sm"
                        value={selectedBlock.type} 
                        disabled 
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Settings className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Selecione um componente</p>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Canvas */}
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">Preview</span>
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
                      "relative group transition-all duration-200 rounded-lg p-2",
                      selectedBlockId === block.id && "ring-2 ring-indigo-500 ring-offset-2"
                    )}
                    onClick={() => handleSelectBlock(block.id)}
                  >
                    <BlockRenderer block={block} />
                  </div>
                ))}

                {blocks.length === 0 && (
                  <div className="text-center py-16 text-gray-500">
                    <MousePointer className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">Canvas Vazio</h3>
                    <p className="text-sm">Adicione componentes da barra lateral</p>
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

function getBlockIcon(type: string) {
  const icons: Record<string, React.ReactNode> = {
    text: <FileText className="w-4 h-4 mr-2" />,
    header: <Layout className="w-4 h-4 mr-2" />,
    button: <MousePointer className="w-4 h-4 mr-2" />,
    image: <Palette className="w-4 h-4 mr-2" />,
  };
  
  return icons[type] || <Layout className="w-4 h-4 mr-2" />;
}

export default EditorPage;

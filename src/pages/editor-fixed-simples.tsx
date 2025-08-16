import React, { useState, useCallback } from 'react';
import { useEditor } from '@/context/EditorContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { BlockRenderer } from '@/components/editor/BlockRenderer';
import { EDITOR_BLOCKS_MAP } from '@/config/editorBlocksMapping';
import { BlockType } from '@/types/BlockType';
import { Plus, Save, Eye, Trash2, Copy, Settings } from 'lucide-react';

const EditorFixedSimples: React.FC = () => {
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  
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

  const availableBlockTypes = Object.keys(EDITOR_BLOCKS_MAP);

  const handleAddBlock = useCallback((blockType: string) => {
    console.log('Adding block:', blockType);
    addBlock(blockType as BlockType);
  }, [addBlock]);

  const handleSelectBlock = useCallback((blockId: string) => {
    setSelectedBlockId(blockId);
    selectBlock(blockId);
  }, [selectBlock]);

  const handleUpdateBlock = useCallback((blockId: string, updates: any) => {
    updateBlock(blockId, updates);
  }, [updateBlock]);

  const handleDeleteBlock = useCallback((blockId: string) => {
    deleteBlock(blockId);
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
      clearSelection();
    }
  }, [deleteBlock, selectedBlockId, clearSelection]);

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-gray-900 mb-4">Editor Simples</h2>
          
          {/* Add Block Buttons */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Adicionar Componente</Label>
            <div className="grid grid-cols-2 gap-2">
              {availableBlockTypes.map((type) => (
                <Button
                  key={type}
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddBlock(type)}
                  className="text-xs"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  {type}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Blocks List */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Componentes ({blocks.length})</Label>
            
            {blocks.map((block) => (
              <Card 
                key={block.id}
                className={`cursor-pointer transition-colors ${
                  selectedBlockId === block.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => handleSelectBlock(block.id)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">{block.type}</div>
                      <div className="text-xs text-gray-500">ID: {block.id}</div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          duplicateBlock(block.id);
                        }}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteBlock(block.id);
                        }}
                        className="h-6 w-6 p-0 text-red-600"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {blocks.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <div className="text-sm">Nenhum componente</div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Properties Panel */}
        {selectedBlock && (
          <div className="p-4 border-t bg-gray-50">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                <Label className="font-medium">Propriedades</Label>
              </div>
              
              <div className="space-y-2">
                <div>
                  <Label className="text-xs">ID</Label>
                  <Input 
                    value={selectedBlock.id} 
                    disabled 
                    className="h-8 text-xs"
                  />
                </div>
                
                <div>
                  <Label className="text-xs">Tipo</Label>
                  <Input 
                    value={selectedBlock.type} 
                    disabled 
                    className="h-8 text-xs"
                  />
                </div>

                {selectedBlock.content?.text && (
                  <div>
                    <Label className="text-xs">Texto</Label>
                    <Input
                      value={selectedBlock.content.text}
                      onChange={(e) => handleUpdateBlock(selectedBlock.id, {
                        content: { ...selectedBlock.content, text: e.target.value }
                      })}
                      className="h-8 text-xs"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              <span className="font-medium">Preview</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Save className="w-4 h-4 mr-1" />
                Salvar
              </Button>
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm border min-h-[600px] p-6">
            <div className="space-y-4">
              {blocks.map((block) => (
                <div
                  key={block.id}
                  className={`relative group rounded p-2 transition-all ${
                    selectedBlockId === block.id 
                      ? 'ring-2 ring-blue-500 bg-blue-50' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleSelectBlock(block.id)}
                >
                  <BlockRenderer block={block} />
                </div>
              ))}

              {blocks.length === 0 && (
                <div className="text-center py-16 text-gray-500">
                  <div className="text-lg font-medium mb-2">Canvas Vazio</div>
                  <div className="text-sm">Adicione componentes para começar</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorFixedSimples;

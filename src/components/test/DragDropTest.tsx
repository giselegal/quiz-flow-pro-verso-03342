import React from 'react';
import { DndProvider } from '../editor/dnd/DndProvider';
import { DroppableCanvas } from '../editor/dnd/DroppableCanvas';
import { DraggableComponentItem } from '../editor/dnd/DraggableComponentItem';
import { Type, Image, Star } from 'lucide-react';

// Mock block data com tipos flexíveis
const mockBlocks: any[] = [
  {
    id: 'text-1',
    type: 'text',
    properties: { title: 'Título de Exemplo', content: 'Conteúdo de exemplo' }
  },
  {
    id: 'image-1', 
    type: 'image',
    properties: { src: '', alt: 'Imagem de exemplo' }
  }
];

const mockComponents = [
  { type: 'text', name: 'Texto', icon: <Type className="w-4 h-4" /> },
  { type: 'image', name: 'Imagem', icon: <Image className="w-4 h-4" /> },
  { type: 'rating', name: 'Avaliação', icon: <Star className="w-4 h-4" /> }
];

export const DragDropTest: React.FC = () => {
  const [blocks, setBlocks] = React.useState(mockBlocks);
  const [selectedBlockId, setSelectedBlockId] = React.useState<string | undefined>();

  const handleBlocksReorder = (newBlocks: any[]) => {
    setBlocks(newBlocks);
    console.log('✅ Blocks reordered:', newBlocks);
  };

  const handleBlockAdd = (blockType: string, position?: number) => {
    const newBlock: any = {
      id: `${blockType}-${Date.now()}`,
      type: blockType,
      properties: { title: `Novo ${blockType}` }
    };

    const newBlocks = [...blocks];
    if (position !== undefined) {
      newBlocks.splice(position, 0, newBlock);
    } else {
      newBlocks.push(newBlock);
    }

    setBlocks(newBlocks);
    console.log('✅ Block added:', newBlock);
  };

  const handleBlockUpdate = (blockId: string, updates: any) => {
    setBlocks(prev => prev.map(block => 
      block.id === blockId ? { ...block, ...updates } : block
    ));
    console.log('✅ Block updated:', blockId, updates);
  };

  return (
    <div className="h-screen flex bg-gray-50">
      <DndProvider
        blocks={blocks}
        onBlocksReorder={handleBlocksReorder}
        onBlockAdd={handleBlockAdd}
        onBlockSelect={setSelectedBlockId}
        selectedBlockId={selectedBlockId}
        onBlockUpdate={handleBlockUpdate}
      >
        {/* Sidebar with draggable components */}
        <div className="w-80 bg-white border-r border-gray-200 p-4">
          <h3 className="text-lg font-semibold mb-4">Componentes</h3>
          <div className="space-y-2">
            {mockComponents.map((component) => (
              <DraggableComponentItem
                key={component.type}
                blockType={component.type}
                title={component.name}
                description={`Adicionar ${component.name.toLowerCase()}`}
                icon={component.icon}
              />
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">🎯 Teste Drag & Drop</h2>
            <DroppableCanvas
              blocks={blocks}
              selectedBlockId={selectedBlockId}
              onBlockSelect={setSelectedBlockId}
              onBlockDelete={(blockId) => {
                setBlocks(prev => prev.filter(block => block.id !== blockId));
                console.log('✅ Block deleted:', blockId);
              }}
              onBlockDuplicate={(blockId) => {
                const block = blocks.find(b => b.id === blockId);
                if (block) {
                  const newBlock = { ...block, id: `${block.type}-${Date.now()}` };
                  setBlocks(prev => [...prev, newBlock]);
                  console.log('✅ Block duplicated:', newBlock);
                }
              }}
              onBlockToggleVisibility={(blockId) => {
                const block = blocks.find(b => b.id === blockId);
                if (block) {
                  handleBlockUpdate(blockId, {
                    properties: { ...block.properties, hidden: !block.properties?.hidden }
                  });
                }
              }}
              onSaveInline={handleBlockUpdate}
              onAddBlock={handleBlockAdd}
            />

            {/* Debug Info */}
            <div className="mt-8 p-4 bg-white rounded-lg border">
              <h4 className="font-semibold mb-2">Debug Info:</h4>
              <p className="text-sm text-gray-600">Blocos: {blocks.length}</p>
              <p className="text-sm text-gray-600">Selecionado: {selectedBlockId || 'Nenhum'}</p>
              <details className="mt-2">
                <summary className="cursor-pointer text-sm font-medium">Ver estrutura</summary>
                <pre className="text-xs mt-2 p-2 bg-gray-100 rounded overflow-auto">
                  {JSON.stringify(blocks, null, 2)}
                </pre>
              </details>
            </div>
          </div>
        </div>
      </DndProvider>
    </div>
  );
};

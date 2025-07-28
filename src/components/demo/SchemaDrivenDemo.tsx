
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BlockDefinition, BlockData, Block } from '@/types/blocks';

// Mock block definitions with proper types
const mockBlockDefinitions: BlockDefinition[] = [
  {
    id: 'text-block',
    type: 'text',
    name: 'Text Block',
    category: 'Content',
    isNew: true,
    description: 'Add text content'
  },
  {
    id: 'image-block',
    type: 'image',
    name: 'Image Block',
    category: 'Media',
    isNew: false,
    description: 'Add images'
  }
];

const SchemaDrivenDemo: React.FC = () => {
  const [selectedBlock, setSelectedBlock] = useState<BlockDefinition | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);

  const handleBlockSelect = (block: BlockDefinition) => {
    setSelectedBlock(block);
  };

  const handleAddBlock = (blockDef: BlockDefinition) => {
    const newBlock: Block = {
      id: `${blockDef.type}-${Date.now()}`,
      type: blockDef.type,
      content: {
        text: blockDef.type === 'text' ? 'Sample text' : '',
        src: blockDef.type === 'image' ? 'https://via.placeholder.com/300x200' : ''
      }
    };
    setBlocks([...blocks, newBlock]);
  };

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <div className="w-80 border-r bg-gray-50 p-4">
        <h2 className="text-lg font-semibold mb-4">Block Library</h2>
        <div className="space-y-2">
          {mockBlockDefinitions.map((block) => (
            <Card
              key={block.id}
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => handleBlockSelect(block)}
            >
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{block.name}</h3>
                    <p className="text-sm text-gray-600">{block.description}</p>
                  </div>
                  {block.isNew && (
                    <Badge variant="secondary" className="text-xs">New</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        <Tabs defaultValue="canvas" className="h-full">
          <TabsList>
            <TabsTrigger value="canvas">Canvas</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="canvas" className="h-full">
            <div className="border rounded-lg p-4 h-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Canvas</h2>
                {selectedBlock && (
                  <Button onClick={() => handleAddBlock(selectedBlock)}>
                    Add {selectedBlock.name}
                  </Button>
                )}
              </div>
              
              <div className="space-y-4">
                {blocks.map((block) => (
                  <Card key={block.id} className="p-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{block.type} Block</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setBlocks(blocks.filter(b => b.id !== block.id))}
                      >
                        Remove
                      </Button>
                    </div>
                    <div className="mt-2">
                      {block.type === 'text' && (
                        <p>{block.content.text}</p>
                      )}
                      {block.type === 'image' && (
                        <img src={block.content.src} alt="Block content" className="max-w-xs" />
                      )}
                    </div>
                  </Card>
                ))}
                
                {blocks.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    Select a block from the sidebar to get started
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="preview">
            <div className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4">Preview</h2>
              <div className="space-y-4">
                {blocks.map((block) => (
                  <div key={block.id}>
                    {block.type === 'text' && (
                      <p className="text-lg">{block.content.text}</p>
                    )}
                    {block.type === 'image' && (
                      <img src={block.content.src} alt="Content" className="max-w-md rounded" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SchemaDrivenDemo;

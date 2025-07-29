
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { blockComponents } from './BlockComponents';

interface Block {
  id: string;
  type: string;
  content: any;
}

export default function BlocksDemo() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);

  const addBlock = (type: string) => {
    const newBlock: Block = {
      id: Date.now().toString(),
      type,
      content: getDefaultContent(type)
    };
    setBlocks([...blocks, newBlock]);
  };

  const getDefaultContent = (type: string) => {
    switch (type) {
      case 'text':
        return { text: 'Texto de exemplo' };
      case 'question':
        return { question: 'Pergunta de exemplo?', options: ['Opção 1', 'Opção 2'] };
      case 'image':
        return { imageUrl: 'https://via.placeholder.com/300x200', alt: 'Imagem de exemplo' };
      default:
        return {};
    }
  };

  const updateBlock = (id: string, content: any) => {
    setBlocks(blocks.map(block => 
      block.id === id ? { ...block, content } : block
    ));
  };

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter(block => block.id !== id));
  };

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Demonstração de Blocos</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Componentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.keys(blockComponents).map((type) => (
                  <Button
                    key={type}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => addBlock(type)}
                  >
                    <Plus size={16} className="mr-2" />
                    {type === 'text' && 'Texto'}
                    {type === 'question' && 'Pergunta'}
                    {type === 'image' && 'Imagem'}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="space-y-4">
            {blocks.map((block) => {
              const BlockComponent = blockComponents[block.type];
              if (!BlockComponent) return null;

              return (
                <Card key={block.id} className="relative">
                  <CardContent className="p-4">
                    <BlockComponent
                      content={block.content}
                      onUpdate={(content) => updateBlock(block.id, content)}
                      onDelete={() => deleteBlock(block.id)}
                    />
                  </CardContent>
                </Card>
              );
            })}

            {blocks.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-gray-500">
                    Nenhum bloco adicionado. Use os componentes da sidebar para começar.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

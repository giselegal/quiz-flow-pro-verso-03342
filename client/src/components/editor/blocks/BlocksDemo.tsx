
import React, { useState } from 'react';
import { blockComponents } from './BlockComponents';
import { EditorBlock } from '@/types/editor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function BlocksDemo() {
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [editingBlock, setEditingBlock] = useState<string | null>(null);

  const demoBlocks: EditorBlock[] = [
    {
      id: 'header-1',
      type: 'header',
      order: 0,
      content: { text: 'Título Principal' }
    },
    {
      id: 'text-1',
      type: 'text',
      order: 1,
      content: { text: 'Este é um exemplo de texto. Você pode editá-lo clicando no botão de edição.' }
    },
    {
      id: 'image-1',
      type: 'image',
      order: 2,
      content: { 
        src: 'https://via.placeholder.com/400x200',
        alt: 'Imagem de exemplo'
      }
    },
    {
      id: 'button-1',
      type: 'button',
      order: 3,
      content: { 
        text: 'Clique aqui',
        backgroundColor: '#3b82f6'
      }
    },
    {
      id: 'spacer-1',
      type: 'spacer',
      order: 4,
      content: { height: 60 }
    },
    {
      id: 'quiz-1',
      type: 'quiz-question',
      order: 5,
      content: {
        question: 'Qual é a resposta correta?',
        options: [
          { text: 'Opção A', isCorrect: false },
          { text: 'Opção B', isCorrect: true },
          { text: 'Opção C', isCorrect: false },
          { text: 'Opção D', isCorrect: false }
        ]
      }
    },
    {
      id: 'testimonial-1',
      type: 'testimonial',
      order: 6,
      content: {
        text: 'Este produto mudou minha vida! Recomendo para todos.',
        author: 'João Silva'
      }
    }
  ];

  const handleBlockUpdate = (blockId: string, content: any) => {
    console.log('Updating block:', blockId, content);
  };

  const handleBlockSelect = (blockId: string) => {
    setSelectedBlock(blockId);
    setEditingBlock(null);
  };

  const handleBlockEdit = (blockId: string) => {
    setEditingBlock(blockId);
  };

  const renderBlock = (block: EditorBlock) => {
    const BlockComponent = blockComponents[block.type];
    
    if (!BlockComponent) {
      return (
        <div key={block.id} className="p-4 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500">Componente não encontrado: {block.type}</p>
        </div>
      );
    }

    return (
      <div key={block.id} className="mb-4">
        <BlockComponent
          content={block.content}
          isSelected={selectedBlock === block.id}
          isEditing={editingBlock === block.id}
          onUpdate={(content) => handleBlockUpdate(block.id, content)}
          onSelect={() => handleBlockSelect(block.id)}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Demonstração de Blocos
          </h1>
          <p className="text-gray-600">
            Explore os diferentes tipos de blocos disponíveis no editor
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Controles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedBlock && (
                  <div>
                    <h3 className="font-medium mb-2">Bloco Selecionado</h3>
                    <Badge variant="secondary">{selectedBlock}</Badge>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setSelectedBlock(null)}
                  >
                    Limpar Seleção
                  </Button>
                  {selectedBlock && (
                    <Button 
                      size="sm"
                      onClick={() => handleBlockEdit(selectedBlock)}
                    >
                      Editar Bloco
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="preview" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="code">Código</TabsTrigger>
              </TabsList>
              
              <TabsContent value="preview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Preview dos Blocos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {demoBlocks.map(renderBlock)}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="code">
                <Card>
                  <CardHeader>
                    <CardTitle>Estrutura dos Blocos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                      <code>{JSON.stringify(demoBlocks, null, 2)}</code>
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

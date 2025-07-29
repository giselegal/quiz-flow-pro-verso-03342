
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { blockComponents } from './BlockComponents';
import { EditableContent } from '@/types/editor';

const BlocksDemo: React.FC = () => {
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);

  // Sample block data with proper types
  const sampleBlocks = [
    {
      id: '1',
      type: 'header',
      content: {
        title: 'Título Principal',
        textColor: '#333333'
      } as EditableContent
    },
    {
      id: '2',
      type: 'text',
      content: {
        text: 'Este é um exemplo de bloco de texto.',
        textColor: '#666666'
      } as EditableContent
    },
    {
      id: '3',
      type: 'image',
      content: {
        imageUrl: 'https://via.placeholder.com/400x200',
        imageAlt: 'Imagem de exemplo'
      } as EditableContent
    },
    {
      id: '4',
      type: 'button',
      content: {
        buttonText: 'Clique Aqui',
        buttonUrl: '#',
        textColor: '#ffffff'
      } as EditableContent
    },
    {
      id: '5',
      type: 'spacer',
      content: {
        height: '50px'
      } as EditableContent
    },
    {
      id: '6',
      type: 'quiz-question',
      content: {
        question: 'Qual é a sua cor favorita?',
        options: [
          { id: '1', text: 'Azul', isCorrect: false },
          { id: '2', text: 'Verde', isCorrect: true },
          { id: '3', text: 'Vermelho', isCorrect: false },
          { id: '4', text: 'Amarelo', isCorrect: false }
        ]
      } as EditableContent
    },
    {
      id: '7',
      type: 'testimonial',
      content: {
        text: 'Este produto mudou minha vida completamente!',
        author: 'João Silva'
      } as EditableContent
    }
  ];

  const renderBlock = (block: any) => {
    const BlockComponent = blockComponents[block.type as keyof typeof blockComponents];
    
    if (!BlockComponent) {
      return (
        <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
          Componente não implementado: {block.type}
        </div>
      );
    }

    return (
      <BlockComponent
        content={block.content}
        isSelected={selectedBlock === block.id}
        isEditing={false}
        onUpdate={(content: any) => console.log('Update:', content)}
        onSelect={() => setSelectedBlock(block.id)}
      />
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Demonstração dos Blocos</h1>
        <p className="text-gray-600">
          Visualize todos os tipos de blocos disponíveis no editor.
        </p>
      </div>

      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="content">Conteúdo</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="quiz">Quiz</TabsTrigger>
        </TabsList>

        <TabsContent className="space-y-6">
          <div className="grid gap-6">
            {sampleBlocks.map((block) => (
              <Card key={block.id} className="overflow-hidden">
                <div className="p-4 bg-gray-50 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{block.type}</Badge>
                      <span className="text-sm text-gray-600">ID: {block.id}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedBlock(
                        selectedBlock === block.id ? null : block.id
                      )}
                    >
                      {selectedBlock === block.id ? 'Desselecionar' : 'Selecionar'}
                    </Button>
                  </div>
                </div>
                <CardContent className="p-6">
                  {renderBlock(block)}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent className="space-y-6">
          <div className="grid gap-6">
            {sampleBlocks
              .filter(block => ['header', 'text', 'image', 'button', 'testimonial'].includes(block.type))
              .map((block) => (
                <Card key={block.id} className="overflow-hidden">
                  <div className="p-4 bg-gray-50 border-b">
                    <Badge variant="secondary">{block.type}</Badge>
                  </div>
                  <CardContent className="p-6">
                    {renderBlock(block)}
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent className="space-y-6">
          <div className="grid gap-6">
            {sampleBlocks
              .filter(block => ['spacer'].includes(block.type))
              .map((block) => (
                <Card key={block.id} className="overflow-hidden">
                  <div className="p-4 bg-gray-50 border-b">
                    <Badge variant="secondary">{block.type}</Badge>
                  </div>
                  <CardContent className="p-6">
                    {renderBlock(block)}
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent className="space-y-6">
          <div className="grid gap-6">
            {sampleBlocks
              .filter(block => ['quiz-question'].includes(block.type))
              .map((block) => (
                <Card key={block.id} className="overflow-hidden">
                  <div className="p-4 bg-gray-50 border-b">
                    <Badge variant="secondary">{block.type}</Badge>
                  </div>
                  <CardContent className="p-6">
                    {renderBlock(block)}
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BlocksDemo;

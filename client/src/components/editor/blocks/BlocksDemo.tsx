
import React, { useState } from 'react';
import { blockComponents } from './BlockComponents';
import { EditableContent } from '@/types/editor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function BlocksDemo() {
  const [selectedBlockType, setSelectedBlockType] = useState<string | null>(null);
  const [selectedContent, setSelectedContent] = useState<EditableContent>({});

  const blockTypes = [
    { type: 'header', name: 'Cabeçalho', category: 'content' },
    { type: 'text', name: 'Texto', category: 'content' },
    { type: 'image', name: 'Imagem', category: 'content' },
    { type: 'button', name: 'Botão', category: 'content' },
    { type: 'spacer', name: 'Espaçador', category: 'layout' },
    { type: 'quiz-question', name: 'Pergunta', category: 'quiz' },
    { type: 'testimonial', name: 'Depoimento', category: 'content' }
  ];

  const defaultContent: Record<string, EditableContent> = {
    header: {
      text: 'Título Principal',
      textColor: '#1a1a1a',
      backgroundColor: '#ffffff'
    },
    text: {
      text: 'Este é um parágrafo de exemplo com texto demonstrativo.',
      textColor: '#4a4a4a',
      backgroundColor: '#ffffff'
    },
    image: {
      src: 'https://via.placeholder.com/400x200',
      alt: 'Imagem de exemplo',
      height: 200
    },
    button: {
      text: 'Botão de Exemplo',
      textColor: '#ffffff',
      backgroundColor: '#3b82f6'
    },
    spacer: {
      height: 40,
      backgroundColor: '#f8f9fa'
    },
    'quiz-question': {
      question: 'Qual é a sua cor favorita?',
      options: [
        { text: 'Azul', isCorrect: false },
        { text: 'Verde', isCorrect: true },
        { text: 'Vermelho', isCorrect: false },
        { text: 'Amarelo', isCorrect: false }
      ]
    },
    testimonial: {
      text: 'Este produto mudou minha vida completamente!',
      author: 'João Silva',
      textColor: '#2d3748',
      backgroundColor: '#f7fafc'
    }
  };

  const handleBlockSelect = (blockType: string) => {
    setSelectedBlockType(blockType);
    setSelectedContent(defaultContent[blockType] || {});
  };

  const handleContentUpdate = (content: EditableContent) => {
    setSelectedContent(content);
  };

  const renderBlock = (blockType: string, content: EditableContent) => {
    const BlockComponent = blockComponents[blockType];
    if (!BlockComponent) {
      return <div className="text-red-500">Componente não encontrado: {blockType}</div>;
    }

    return (
      <BlockComponent
        content={content}
        isSelected={selectedBlockType === blockType}
        isEditing={false}
        onUpdate={handleContentUpdate}
        onSelect={() => handleBlockSelect(blockType)}
      />
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Demonstração de Blocos</h1>
        <p className="text-gray-600">Explore os diferentes tipos de blocos disponíveis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar com lista de blocos */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Tipos de Blocos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {blockTypes.map((block) => (
                  <Button
                    key={block.type}
                    variant={selectedBlockType === block.type ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => handleBlockSelect(block.type)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>{block.name}</span>
                      <Badge variant="secondary" className="ml-2">
                        {block.category}
                      </Badge>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Área de preview */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedBlockType ? `Preview: ${blockTypes.find(b => b.type === selectedBlockType)?.name}` : 'Selecione um Bloco'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedBlockType ? (
                <div className="space-y-4">
                  <Tabs defaultValue="preview">
                    <TabsList>
                      <TabsTrigger value="preview">Preview</TabsTrigger>
                      <TabsTrigger value="code">Código</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="preview">
                      <div className="border rounded-lg p-4 bg-white">
                        {renderBlock(selectedBlockType, selectedContent)}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="code">
                      <div className="bg-gray-100 rounded-lg p-4">
                        <pre className="text-sm overflow-x-auto">
                          <code>{JSON.stringify(selectedContent, null, 2)}</code>
                        </pre>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">Selecione um tipo de bloco na barra lateral para ver o preview</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Showcase de todos os blocos */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center">Todos os Blocos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blockTypes.map((block) => (
            <Card key={block.type}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {block.name}
                  <Badge variant="outline">{block.category}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {renderBlock(block.type, defaultContent[block.type] || {})}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

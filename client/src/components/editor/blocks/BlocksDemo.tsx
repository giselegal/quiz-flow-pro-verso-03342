
import React, { useState } from 'react';
import { EditorProvider } from '@/contexts/EditorContext';
import { BlockComponents } from './BlockComponents';
import { EditorBlock } from '@/types/editor';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const BlocksDemo = () => {
  const [activeTab, setActiveTab] = useState('editor');

  const mockBlocks: EditorBlock[] = [
    {
      id: '1',
      type: 'header',
      content: {
        title: 'Título Principal',
        subtitle: 'Subtítulo do exemplo'
      },
      order: 0
    },
    {
      id: '2',
      type: 'text',
      content: {
        text: 'Este é um exemplo de texto em um bloco do editor.'
      },
      order: 1
    },
    {
      id: '3',
      type: 'image',
      content: {
        imageUrl: 'https://via.placeholder.com/400x300',
        alt: 'Imagem de exemplo'
      },
      order: 2
    },
    {
      id: '4',
      type: 'button',
      content: {
        text: 'Botão de Exemplo',
        url: '#',
        variant: 'default'
      },
      order: 3
    },
    {
      id: '5',
      type: 'spacer',
      content: {
        height: 40
      },
      order: 4
    }
  ];

  const blockTypeInfo = {
    header: { icon: '📄', name: 'Cabeçalho', description: 'Título e subtítulo' },
    text: { icon: '📝', name: 'Texto', description: 'Parágrafo de texto' },
    image: { icon: '🖼️', name: 'Imagem', description: 'Imagem com alt text' },
    button: { icon: '🔘', name: 'Botão', description: 'Botão clicável' },
    spacer: { icon: '⬜', name: 'Espaçador', description: 'Espaço em branco' }
  };

  return (
    <EditorProvider>
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Demo dos Blocos do Editor</h1>
          <p className="text-gray-600">
            Visualize como os diferentes tipos de blocos são renderizados
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="docs">Documentação</TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🎨 Modo Editor
                  <Badge variant="secondary">Editável</Badge>
                </CardTitle>
                <CardDescription>
                  Blocos com controles de edição ativados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockBlocks.map((block) => (
                    <div key={block.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-center mb-2">
                        <Badge variant="outline">
                          {blockTypeInfo[block.type as keyof typeof blockTypeInfo]?.icon} {' '}
                          {blockTypeInfo[block.type as keyof typeof blockTypeInfo]?.name}
                        </Badge>
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                      </div>
                      <BlockComponents
                        block={block}
                        isSelected={false}
                        isEditing={true}
                        onUpdate={() => {}}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  👁️ Modo Preview
                  <Badge variant="secondary">Somente Leitura</Badge>
                </CardTitle>
                <CardDescription>
                  Blocos como aparecerão para o usuário final
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockBlocks.map((block) => (
                    <BlockComponents
                      key={block.id}
                      block={block}
                      isSelected={false}
                      isEditing={false}
                      onUpdate={() => {}}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="docs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>📚 Documentação dos Blocos</CardTitle>
                <CardDescription>
                  Informações sobre cada tipo de bloco disponível
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {Object.entries(blockTypeInfo).map(([type, info]) => (
                    <div key={type} className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{info.icon}</span>
                        <h3 className="font-semibold">{info.name}</h3>
                        <Badge variant="outline">{type}</Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{info.description}</p>
                      <div className="text-sm text-gray-500">
                        <strong>Propriedades:</strong>
                        <ul className="mt-1 ml-4 list-disc">
                          {type === 'header' && (
                            <>
                              <li>title: string - Título principal</li>
                              <li>subtitle: string - Subtítulo opcional</li>
                            </>
                          )}
                          {type === 'text' && (
                            <li>text: string - Conteúdo do texto</li>
                          )}
                          {type === 'image' && (
                            <>
                              <li>imageUrl: string - URL da imagem</li>
                              <li>alt: string - Texto alternativo</li>
                            </>
                          )}
                          {type === 'button' && (
                            <>
                              <li>text: string - Texto do botão</li>
                              <li>url: string - URL de destino</li>
                              <li>variant: 'default' | 'outline' - Estilo</li>
                            </>
                          )}
                          {type === 'spacer' && (
                            <li>height: number - Altura em pixels</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </EditorProvider>
  );
};

export default BlocksDemo;

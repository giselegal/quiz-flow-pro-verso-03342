
import React, { useState } from 'react';
import { BlockComponents } from './BlockComponents';
import { EditorBlock } from '@/types/editor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';

interface BlocksDemoProps {
  className?: string;
}

export const BlocksDemo: React.FC<BlocksDemoProps> = ({ className }) => {
  const [blocks, setBlocks] = useState<EditorBlock[]>([
    {
      id: 'demo-1',
      type: 'header',
      content: {
        title: 'Título Principal',
        subtitle: 'Subtítulo do componente',
        style: {
          textAlign: 'center',
          color: '#333',
          fontSize: 'text-3xl'
        }
      },
      order: 0
    },
    {
      id: 'demo-2',
      type: 'text',
      content: {
        text: 'Este é um exemplo de texto editável. Clique duplo para editar.',
        style: {
          color: '#666',
          fontSize: '16px'
        }
      },
      order: 1
    },
    {
      id: 'demo-3',
      type: 'image',
      content: {
        imageUrl: 'https://via.placeholder.com/400x200',
        imageAlt: 'Imagem de exemplo',
        caption: 'Legenda da imagem'
      },
      order: 2
    },
    {
      id: 'demo-4',
      type: 'button',
      content: {
        buttonText: 'Botão de Exemplo',
        buttonUrl: 'https://exemplo.com',
        style: {
          backgroundColor: '#007bff',
          color: 'white',
          textAlign: 'center'
        }
      },
      order: 3
    },
    {
      id: 'demo-5',
      type: 'spacer',
      content: {
        height: '60px'
      },
      order: 4
    },
    {
      id: 'demo-6',
      type: 'quiz-question',
      content: {
        question: 'Qual é a sua cor favorita?',
        options: [
          { id: '1', text: 'Azul', imageUrl: '' },
          { id: '2', text: 'Vermelho', imageUrl: '' },
          { id: '3', text: 'Verde', imageUrl: '' },
          { id: '4', text: 'Amarelo', imageUrl: '' }
        ],
        multipleSelection: false,
        showImages: false,
        progressPercent: 50,
        logoUrl: '',
        showBackButton: true,
        optionLayout: 'vertical'
      },
      order: 5
    }
  ]);

  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const handleBlockUpdate = (blockId: string, content: any) => {
    setBlocks(prev => 
      prev.map(block => 
        block.id === blockId 
          ? { ...block, content: { ...block.content, ...content } }
          : block
      )
    );
  };

  const handleBlockDelete = (blockId: string) => {
    setBlocks(prev => prev.filter(block => block.id !== blockId));
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
    }
  };

  const addNewBlock = (type: EditorBlock['type']) => {
    const newBlock: EditorBlock = {
      id: `demo-${Date.now()}`,
      type,
      content: getDefaultContent(type),
      order: blocks.length
    };
    
    setBlocks(prev => [...prev, newBlock]);
    setSelectedBlockId(newBlock.id);
  };

  const getDefaultContent = (type: EditorBlock['type']) => {
    switch (type) {
      case 'header':
        return { title: 'Novo Título', subtitle: 'Subtítulo' };
      case 'text':
        return { text: 'Novo texto aqui...' };
      case 'image':
        return { imageUrl: '', imageAlt: '', caption: '' };
      case 'button':
        return { buttonText: 'Clique aqui', buttonUrl: '' };
      case 'spacer':
        return { height: '40px' };
      case 'quiz-question':
        return {
          question: 'Nova pergunta?',
          options: [
            { id: '1', text: 'Opção 1', imageUrl: '' },
            { id: '2', text: 'Opção 2', imageUrl: '' }
          ],
          multipleSelection: false,
          showImages: false,
          progressPercent: 0,
          logoUrl: '',
          showBackButton: false,
          optionLayout: 'vertical'
        };
      default:
        return {};
    }
  };

  const availableBlockTypes = [
    { type: 'header', name: 'Cabeçalho', icon: '📄' },
    { type: 'text', name: 'Texto', icon: '📝' },
    { type: 'image', name: 'Imagem', icon: '🖼️' },
    { type: 'button', name: 'Botão', icon: '🔘' },
    { type: 'spacer', name: 'Espaçador', icon: '⬜' },
    { type: 'quiz-question', name: 'Questão Quiz', icon: '❓' }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Demo de Componentes</h1>
        <p className="text-gray-600">
          Demonstração dos componentes do editor com funcionalidades completas
        </p>
      </div>

      <Tabs defaultValue="editor" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="blocks">Blocos Disponíveis</TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Button
                variant={isPreviewMode ? "default" : "outline"}
                onClick={() => setIsPreviewMode(!isPreviewMode)}
              >
                {isPreviewMode ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                {isPreviewMode ? 'Sair do Preview' : 'Preview'}
              </Button>
              <Badge variant="secondary">
                {blocks.length} bloco{blocks.length !== 1 ? 's' : ''}
              </Badge>
            </div>
            
            <div className="flex gap-2">
              {availableBlockTypes.map(blockType => (
                <Button
                  key={blockType.type}
                  variant="outline"
                  size="sm"
                  onClick={() => addNewBlock(blockType.type as EditorBlock['type'])}
                >
                  <span className="mr-1">{blockType.icon}</span>
                  {blockType.name}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {blocks
              .sort((a, b) => a.order - b.order)
              .map(block => (
                <Card key={block.id} className="relative">
                  <CardContent className="p-0">
                    <BlockComponents
                      block={block}
                      isSelected={selectedBlockId === block.id}
                      isEditing={!isPreviewMode}
                      onUpdate={(content) => handleBlockUpdate(block.id, content)}
                      onSelect={() => setSelectedBlockId(block.id)}
                    />
                    
                    {!isPreviewMode && (
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedBlockId(block.id)}
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleBlockDelete(block.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="blocks" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableBlockTypes.map(blockType => (
              <Card key={blockType.type}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span>{blockType.icon}</span>
                    {blockType.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    Componente do tipo {blockType.type}
                  </p>
                  <Button
                    onClick={() => addNewBlock(blockType.type as EditorBlock['type'])}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar
                  </Button>
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

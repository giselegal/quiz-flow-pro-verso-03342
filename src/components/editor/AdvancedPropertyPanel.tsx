
import React from 'react';
import { EditorBlock } from '@/types/editor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Trash2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AdvancedPropertyPanelProps {
  selectedBlock: EditorBlock | null;
  onUpdateBlock: (id: string, updates: Partial<EditorBlock>) => void;
  onDeleteBlock: (id: string) => void;
  onClose: () => void;
}

export const AdvancedPropertyPanel: React.FC<AdvancedPropertyPanelProps> = ({
  selectedBlock,
  onUpdateBlock,
  onDeleteBlock,
  onClose
}) => {
  if (!selectedBlock) {
    return (
      <div className="h-full flex flex-col border-l border-gray-200 bg-white">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Propriedades</h2>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center text-gray-500">
            <div className="text-4xl mb-2">🎯</div>
            <p>Selecione um componente para editar suas propriedades</p>
          </div>
        </div>
      </div>
    );
  }

  const handleContentUpdate = (key: string, value: any) => {
    onUpdateBlock(selectedBlock.id, {
      content: {
        ...selectedBlock.content,
        [key]: value
      }
    });
  };

  const renderContentEditor = () => {
    switch (selectedBlock.type) {
      case 'header':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={selectedBlock.content.title || ''}
                onChange={(e) => handleContentUpdate('title', e.target.value)}
                placeholder="Digite o título"
              />
            </div>
            <div>
              <Label htmlFor="subtitle">Subtítulo</Label>
              <Input
                id="subtitle"
                value={selectedBlock.content.subtitle || ''}
                onChange={(e) => handleContentUpdate('subtitle', e.target.value)}
                placeholder="Digite o subtítulo"
              />
            </div>
          </div>
        );

      case 'text':
        return (
          <div>
            <Label htmlFor="text">Texto</Label>
            <Textarea
              id="text"
              value={selectedBlock.content.text || ''}
              onChange={(e) => handleContentUpdate('text', e.target.value)}
              placeholder="Digite o texto"
              className="min-h-[100px]"
            />
          </div>
        );

      case 'image':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="imageUrl">URL da Imagem</Label>
              <Input
                id="imageUrl"
                value={selectedBlock.content.imageUrl || ''}
                onChange={(e) => handleContentUpdate('imageUrl', e.target.value)}
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>
            <div>
              <Label htmlFor="imageAlt">Texto Alternativo</Label>
              <Input
                id="imageAlt"
                value={selectedBlock.content.imageAlt || ''}
                onChange={(e) => handleContentUpdate('imageAlt', e.target.value)}
                placeholder="Descrição da imagem"
              />
            </div>
          </div>
        );

      case 'button':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="buttonText">Texto do Botão</Label>
              <Input
                id="buttonText"
                value={selectedBlock.content.buttonText || ''}
                onChange={(e) => handleContentUpdate('buttonText', e.target.value)}
                placeholder="Clique aqui"
              />
            </div>
            <div>
              <Label htmlFor="buttonUrl">URL do Link</Label>
              <Input
                id="buttonUrl"
                value={selectedBlock.content.buttonUrl || ''}
                onChange={(e) => handleContentUpdate('buttonUrl', e.target.value)}
                placeholder="https://exemplo.com"
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center text-gray-500 py-8">
            <p>Editor de propriedades não disponível para este tipo de componente</p>
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col border-l border-gray-200 bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Propriedades</h2>
          <p className="text-sm text-gray-600 capitalize">{selectedBlock.type}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X size={16} />
        </Button>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="content">Conteúdo</TabsTrigger>
              <TabsTrigger value="style">Estilo</TabsTrigger>
            </TabsList>
            
            <TabsContent value="content" className="space-y-4 mt-4">
              {renderContentEditor()}
            </TabsContent>
            
            <TabsContent value="style" className="space-y-4 mt-4">
              <div className="text-center text-gray-500 py-8">
                <p>Editor de estilos em desenvolvimento</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <Button 
          variant="destructive" 
          size="sm"
          onClick={() => onDeleteBlock(selectedBlock.id)}
          className="w-full"
        >
          <Trash2 size={16} className="mr-2" />
          Excluir Componente
        </Button>
      </div>
    </div>
  );
};

export default AdvancedPropertyPanel;

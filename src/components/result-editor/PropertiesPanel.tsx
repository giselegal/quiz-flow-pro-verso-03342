
import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Block } from '@/types/editor';
import { Trash2, RotateCcw } from 'lucide-react';

interface PropertiesPanelProps {
  selectedBlockId: string | null;
  blocks: Block[];
  onClose: () => void;
  onUpdate: (id: string, content: any) => void;
  onDelete: (id: string) => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedBlockId,
  blocks,
  onClose,
  onUpdate,
  onDelete,
}) => {
  const selectedBlock = blocks.find(block => block.id === selectedBlockId);

  if (!selectedBlockId || !selectedBlock) {
    return (
      <div className="h-full p-4 space-y-4 bg-white">
        <div className="text-center text-[#432818]/60 mt-8">
          <div className="text-4xl mb-4">🎯</div>
          <h3 className="text-lg font-medium mb-2">Selecione um Componente</h3>
          <p className="text-sm">Clique em qualquer bloco do canvas para editar suas propriedades aqui.</p>
        </div>
      </div>
    );
  }

  const handleUpdate = (field: string, value: any) => {
    onUpdate(selectedBlockId, {
      ...selectedBlock.content,
      [field]: value
    });
  };

  const getBlockTypeLabel = () => {
    switch (selectedBlock.type) {
      case 'headline': return 'Título';
      case 'text': return 'Texto';
      case 'image': return 'Imagem';
      case 'benefits': return 'Benefícios';
      case 'testimonials': return 'Depoimentos';
      case 'quiz-result': return 'Resultado do Quiz';
      default: return selectedBlock.type.charAt(0).toUpperCase() + selectedBlock.type.slice(1);
    }
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-[#B89B7A]/20 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h2 className="font-medium text-[#432818]">{getBlockTypeLabel()}</h2>
          <Badge variant="secondary" className="text-xs">
            {selectedBlock.type}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(selectedBlockId)}
          className="text-red-500"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <Tabs defaultValue="content" className="flex-1 flex flex-col">
        <div className="px-4 pt-2">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="content">Conteúdo</TabsTrigger>
            <TabsTrigger value="style">Estilo</TabsTrigger>
          </TabsList>
        </div>
        
        <div className="flex-1 overflow-auto">
          <TabsContent value="content" className="p-4 space-y-4">
            {/* Título */}
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={selectedBlock.content.title || ''}
                onChange={(e) => handleUpdate('title', e.target.value)}
                placeholder="Digite o título"
              />
            </div>

            {/* Subtítulo */}
            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtítulo</Label>
              <Input
                id="subtitle"
                value={selectedBlock.content.subtitle || ''}
                onChange={(e) => handleUpdate('subtitle', e.target.value)}
                placeholder="Digite o subtítulo"
              />
            </div>

            {/* Texto */}
            <div className="space-y-2">
              <Label htmlFor="text">Texto</Label>
              <Textarea
                id="text"
                value={selectedBlock.content.text || ''}
                onChange={(e) => handleUpdate('text', e.target.value)}
                placeholder="Digite o texto"
                className="min-h-[100px]"
              />
            </div>

            {/* URL da Imagem */}
            {(selectedBlock.type === 'image' || selectedBlock.content.imageUrl) && (
              <div className="space-y-2">
                <Label htmlFor="imageUrl">URL da Imagem</Label>
                <Input
                  id="imageUrl"
                  value={selectedBlock.content.imageUrl || ''}
                  onChange={(e) => handleUpdate('imageUrl', e.target.value)}
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>
            )}

            {/* Configurações específicas do quiz result */}
            {selectedBlock.type === 'quiz-result' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="showPrimaryStyle">Mostrar Estilo Principal</Label>
                  <Switch
                    id="showPrimaryStyle"
                    checked={selectedBlock.content.showPrimaryStyle !== false}
                    onCheckedChange={(checked) => handleUpdate('showPrimaryStyle', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="showSecondaryStyles">Mostrar Estilos Secundários</Label>
                  <Switch
                    id="showSecondaryStyles"
                    checked={selectedBlock.content.showSecondaryStyles !== false}
                    onCheckedChange={(checked) => handleUpdate('showSecondaryStyles', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="showOfferSection">Mostrar Seção de Oferta</Label>
                  <Switch
                    id="showOfferSection"
                    checked={selectedBlock.content.showOfferSection !== false}
                    onCheckedChange={(checked) => handleUpdate('showOfferSection', checked)}
                  />
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="style" className="p-4 space-y-4">
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="backgroundColor">Cor de Fundo</Label>
                <Input
                  id="backgroundColor"
                  type="color"
                  value={selectedBlock.content.style?.backgroundColor || '#ffffff'}
                  onChange={(e) => handleUpdate('style', { 
                    ...selectedBlock.content.style,
                    backgroundColor: e.target.value 
                  })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="textColor">Cor do Texto</Label>
                <Input
                  id="textColor"
                  type="color"
                  value={selectedBlock.content.style?.textColor || '#000000'}
                  onChange={(e) => handleUpdate('style', { 
                    ...selectedBlock.content.style,
                    textColor: e.target.value 
                  })}
                />
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

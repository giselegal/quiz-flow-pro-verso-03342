
import React from 'react';
import { Block } from '@/types/editor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { X, Trash2 } from 'lucide-react';

interface PropertiesPanelProps {
  selectedBlockId: string | null;
  blocks: Block[];
  onClose: () => void;
  onUpdate: (id: string, properties: Record<string, any>) => void;
  onDelete: (id: string) => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedBlockId,
  blocks,
  onClose,
  onUpdate,
  onDelete
}) => {
  const selectedBlock = blocks.find(block => block.id === selectedBlockId);

  if (!selectedBlockId || !selectedBlock) {
    return (
      <div className="h-full bg-gray-50 border-l flex items-center justify-center">
        <p className="text-gray-500">Selecione um bloco para editar suas propriedades</p>
      </div>
    );
  }

  const handlePropertyChange = (property: string, value: any) => {
    const content = selectedBlock.content || {};
    onUpdate(selectedBlockId, {
      ...content,
      [property]: value
    });
  };

  const renderPropertyEditor = () => {
    const content = selectedBlock.content || {};
    
    switch (selectedBlock.type) {
      case 'title':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title-text">Título</Label>
              <Input
                id="title-text"
                value={content.text || ''}
                onChange={(e) => handlePropertyChange('text', e.target.value)}
                placeholder="Digite o título"
              />
            </div>
          </div>
        );

      case 'subtitle':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="subtitle-text">Subtítulo</Label>
              <Input
                id="subtitle-text"
                value={content.text || ''}
                onChange={(e) => handlePropertyChange('text', e.target.value)}
                placeholder="Digite o subtítulo"
              />
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="text-content">Texto</Label>
              <Textarea
                id="text-content"
                value={content.text || ''}
                onChange={(e) => handlePropertyChange('text', e.target.value)}
                placeholder="Digite o texto"
                rows={4}
              />
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="image-url">URL da Imagem</Label>
              <Input
                id="image-url"
                value={content.imageUrl || ''}
                onChange={(e) => handlePropertyChange('imageUrl', e.target.value)}
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>
            <div>
              <Label htmlFor="image-alt">Texto Alternativo</Label>
              <Input
                id="image-alt"
                value={content.imageAlt || ''}
                onChange={(e) => handlePropertyChange('imageAlt', e.target.value)}
                placeholder="Descrição da imagem"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="image-width">Largura</Label>
                <Input
                  id="image-width"
                  value={content.width || ''}
                  onChange={(e) => handlePropertyChange('width', e.target.value)}
                  placeholder="100%"
                />
              </div>
              <div>
                <Label htmlFor="image-height">Altura</Label>
                <Input
                  id="image-height"
                  value={content.height || ''}
                  onChange={(e) => handlePropertyChange('height', e.target.value)}
                  placeholder="auto"
                />
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Editor de propriedades para o tipo "{selectedBlock.type}" não está disponível ainda.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="h-full bg-white border-l flex flex-col">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-medium text-gray-900">
          Propriedades - {selectedBlock.type}
        </h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(selectedBlockId)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div className="p-4 flex-1 overflow-auto">
        {renderPropertyEditor()}
      </div>
    </div>
  );
};

export default PropertiesPanel;

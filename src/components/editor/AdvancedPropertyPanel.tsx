
import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface AdvancedPropertyPanelProps {
  selectedBlock: any;
  onUpdateBlock: (id: string, updates: any) => void;
  onDeleteBlock: (id: string) => void;
  onClose: () => void;
}

export const AdvancedPropertyPanel: React.FC<AdvancedPropertyPanelProps> = ({
  selectedBlock,
  onUpdateBlock,
  onDeleteBlock,
  onClose,
}) => {
  // Ensure safe properties access
  const safeProperties = useMemo(() => {
    return selectedBlock?.properties || {};
  }, [selectedBlock]);

  if (!selectedBlock) {
    return (
      <div className="p-4 text-center text-gray-600">
        Selecione um bloco para editar suas propriedades
      </div>
    );
  }

  const handlePropertyChange = (key: string, value: any) => {
    const updatedProperties = {
      ...safeProperties,
      [key]: value
    };
    
    onUpdateBlock(selectedBlock.id, {
      properties: updatedProperties
    });
  };

  return (
    <div className="h-full p-4 space-y-4 bg-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-800">Propriedades</h3>
        <Button
          variant="ghost"
          size="sm"
          className="text-red-500 hover:text-red-700"
          onClick={() => onDeleteBlock(selectedBlock.id)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <Card className="p-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            value={safeProperties.title || ''}
            placeholder="Digite o título"
            onChange={(e) => handlePropertyChange('title', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="subtitle">Subtítulo</Label>
          <Input
            id="subtitle"
            value={safeProperties.subtitle || ''}
            placeholder="Digite o subtítulo"
            onChange={(e) => handlePropertyChange('subtitle', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="text">Texto</Label>
          <Textarea
            id="text"
            value={safeProperties.text || ''}
            placeholder="Digite o texto"
            className="min-h-[100px]"
            onChange={(e) => handlePropertyChange('text', e.target.value)}
          />
        </div>

        {selectedBlock.type === 'image' && (
          <div className="space-y-2">
            <Label htmlFor="imageUrl">URL da Imagem</Label>
            <Input
              id="imageUrl"
              value={safeProperties.imageUrl || ''}
              placeholder="https://exemplo.com/imagem.jpg"
              onChange={(e) => handlePropertyChange('imageUrl', e.target.value)}
            />
          </div>
        )}

        {selectedBlock.type === 'button' && (
          <div className="space-y-2">
            <Label htmlFor="buttonText">Texto do Botão</Label>
            <Input
              id="buttonText"
              value={safeProperties.buttonText || ''}
              placeholder="Clique aqui"
              onChange={(e) => handlePropertyChange('buttonText', e.target.value)}
            />
          </div>
        )}
      </Card>
    </div>
  );
};

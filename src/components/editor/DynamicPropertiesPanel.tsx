
import React from 'react';
import { Block } from '@/types/editor';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, X } from 'lucide-react';
import { getBlockDefinition } from './blocks/EnhancedBlockRegistry';

interface DynamicPropertiesPanelProps {
  selectedBlock: Block | null;
  onUpdateBlock: (id: string, updates: Partial<Block>) => void;
  onDeleteBlock: (id: string) => void;
  onClose: () => void;
}

const DynamicPropertiesPanel: React.FC<DynamicPropertiesPanelProps> = ({
  selectedBlock,
  onUpdateBlock,
  onDeleteBlock,
  onClose
}) => {
  if (!selectedBlock) {
    return (
      <div className="h-full bg-white border-l flex items-center justify-center p-4">
        <div className="text-center text-gray-500">
          <p>Selecione um bloco para editar suas propriedades</p>
        </div>
      </div>
    );
  }

  const blockDefinition = getBlockDefinition(selectedBlock.type);
  const content = selectedBlock.content || {};

  const handlePropertyChange = (property: string, value: any) => {
    onUpdateBlock(selectedBlock.id, {
      content: {
        ...content,
        [property]: value
      }
    });
  };

  const renderPropertyEditor = (propertyKey: string, propertyConfig: any) => {
    const currentValue = content[propertyKey] || propertyConfig.defaultValue || '';

    switch (propertyConfig.type) {
      case 'text':
        return (
          <div key={propertyKey} className="space-y-2">
            <Label htmlFor={propertyKey}>{propertyConfig.label}</Label>
            <Input
              id={propertyKey}
              value={currentValue}
              onChange={(e) => handlePropertyChange(propertyKey, e.target.value)}
              placeholder={propertyConfig.defaultValue || ''}
            />
          </div>
        );

      case 'textarea':
        return (
          <div key={propertyKey} className="space-y-2">
            <Label htmlFor={propertyKey}>{propertyConfig.label}</Label>
            <Textarea
              id={propertyKey}
              value={currentValue}
              onChange={(e) => handlePropertyChange(propertyKey, e.target.value)}
              placeholder={propertyConfig.defaultValue || ''}
              rows={4}
            />
          </div>
        );

      case 'number':
        return (
          <div key={propertyKey} className="space-y-2">
            <Label htmlFor={propertyKey}>{propertyConfig.label}</Label>
            <Input
              id={propertyKey}
              type="number"
              value={currentValue}
              onChange={(e) => handlePropertyChange(propertyKey, parseInt(e.target.value) || 0)}
              placeholder={propertyConfig.defaultValue?.toString() || '0'}
            />
          </div>
        );

      case 'select':
        return (
          <div key={propertyKey} className="space-y-2">
            <Label>{propertyConfig.label}</Label>
            <Select
              value={currentValue}
              onValueChange={(value) => handlePropertyChange(propertyKey, value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma opção" />
              </SelectTrigger>
              <SelectContent>
                {propertyConfig.options?.map((option: string) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 'image':
        return (
          <div key={propertyKey} className="space-y-2">
            <Label htmlFor={propertyKey}>{propertyConfig.label}</Label>
            <Input
              id={propertyKey}
              value={currentValue}
              onChange={(e) => handlePropertyChange(propertyKey, e.target.value)}
              placeholder="https://exemplo.com/imagem.jpg"
            />
            {currentValue && (
              <div className="mt-2">
                <img
                  src={currentValue}
                  alt="Preview"
                  className="max-w-full h-20 object-cover rounded border"
                  onError={() => console.log('Error loading image preview')}
                />
              </div>
            )}
          </div>
        );

      case 'color':
        return (
          <div key={propertyKey} className="space-y-2">
            <Label htmlFor={propertyKey}>{propertyConfig.label}</Label>
            <div className="flex gap-2">
              <Input
                id={propertyKey}
                type="color"
                value={currentValue}
                onChange={(e) => handlePropertyChange(propertyKey, e.target.value)}
                className="w-16 h-10 p-0 border"
              />
              <Input
                value={currentValue}
                onChange={(e) => handlePropertyChange(propertyKey, e.target.value)}
                placeholder="#000000"
                className="flex-1"
              />
            </div>
          </div>
        );

      default:
        return (
          <div key={propertyKey} className="space-y-2">
            <Label htmlFor={propertyKey}>{propertyConfig.label}</Label>
            <Input
              id={propertyKey}
              value={currentValue}
              onChange={(e) => handlePropertyChange(propertyKey, e.target.value)}
              placeholder={propertyConfig.defaultValue || ''}
            />
          </div>
        );
    }
  };

  return (
    <div className="h-full bg-white border-l flex flex-col">
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center">
        <div>
          <h3 className="font-medium text-gray-900">
            {blockDefinition?.label || selectedBlock.type}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {blockDefinition?.description || 'Propriedades do bloco'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDeleteBlock(selectedBlock.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Properties */}
      <div className="p-4 flex-1 overflow-auto space-y-4">
        {blockDefinition?.properties ? (
          Object.entries(blockDefinition.properties).map(([key, config]) =>
            renderPropertyEditor(key, config)
          )
        ) : (
          <div className="text-center text-gray-500">
            <p>Nenhuma propriedade configurável encontrada para este bloco.</p>
          </div>
        )}

        {/* Block Info */}
        <div className="mt-6 pt-4 border-t">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Informações do Bloco</h4>
          <div className="space-y-1 text-xs text-gray-500">
            <div>ID: {selectedBlock.id}</div>
            <div>Tipo: {selectedBlock.type}</div>
            <div>Ordem: {selectedBlock.order}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicPropertiesPanel;

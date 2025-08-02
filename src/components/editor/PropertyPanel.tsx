
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface PropertyPanelProps {
  selectedBlock: any;
  onUpdateBlock: (id: string, properties: any) => void;
  onDeleteBlock: (id: string) => void;
  onClose: () => void;
}

export const PropertyPanel: React.FC<PropertyPanelProps> = ({
  selectedBlock,
  onUpdateBlock,
  onDeleteBlock,
  onClose
}) => {
  if (!selectedBlock) {
    return (
      <div className="w-80 bg-white border-l p-4">
        <p className="text-gray-500">Selecione um bloco para editar</p>
      </div>
    );
  }

  const handlePropertyChange = (key: string, value: any) => {
    onUpdateBlock(selectedBlock.id, {
      ...selectedBlock.properties,
      [key]: value
    });
  };

  const renderPropertyEditor = (key: string, value: any, type: string = 'text') => {
    switch (type) {
      case 'textarea':
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => handlePropertyChange(key, e.target.value)}
            className="mt-1"
          />
        );
      case 'boolean':
        return (
          <Switch
            checked={value || false}
            onCheckedChange={(checked) => handlePropertyChange(key, checked)}
            className="mt-1"
          />
        );
      case 'select':
        return (
          <Select 
            value={value || ''} 
            onValueChange={(newValue) => handlePropertyChange(key, newValue)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Selecione uma opção" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="option1">Opção 1</SelectItem>
              <SelectItem value="option2">Opção 2</SelectItem>
            </SelectContent>
          </Select>
        );
      default:
        return (
          <Input
            value={value || ''}
            onChange={(e) => handlePropertyChange(key, e.target.value)}
            className="mt-1"
          />
        );
    }
  };

  return (
    <div className="w-80 bg-white border-l p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Propriedades</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          ×
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium">Tipo do Bloco</Label>
          <p className="text-sm text-gray-600 mt-1">{selectedBlock.type}</p>
        </div>

        {Object.entries(selectedBlock.properties || {}).map(([key, value]) => (
          <div key={key}>
            <Label htmlFor={key} className="text-sm font-medium">
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </Label>
            {renderPropertyEditor(key, value)}
          </div>
        ))}

        <div className="pt-4 border-t">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDeleteBlock(selectedBlock.id)}
            className="w-full"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Excluir Bloco
          </Button>
        </div>
      </div>
    </div>
  );
};

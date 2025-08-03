
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { BlockDefinition, EditableContent } from '@/types/editor';

interface DynamicPropertiesPanelProps {
  block: {
    id: string;
    type: string;
    content: EditableContent;
    properties?: Record<string, any>;
  };
  blockDefinition: BlockDefinition;
  onUpdateBlock: (id: string, content: Partial<EditableContent>) => void;
  onClose: () => void;
}

const DynamicPropertiesPanel: React.FC<DynamicPropertiesPanelProps> = ({
  block,
  blockDefinition,
  onUpdateBlock,
  onClose
}) => {
  const handlePropertyChange = (key: string, value: any) => {
    onUpdateBlock(block.id, {
      ...block.content,
      [key]: value
    });
  };

  const renderPropertyInput = (key: string, property: any) => {
    const currentValue = (block.content as any)[key] || property.default;

    switch (property.type) {
      case 'string':
        return (
          <Input
            value={currentValue || ''}
            onChange={(e) => handlePropertyChange(key, e.target.value)}
            placeholder={property.label}
          />
        );
      case 'textarea':
        return (
          <Textarea
            value={currentValue || ''}
            onChange={(e) => handlePropertyChange(key, e.target.value)}
            placeholder={property.label}
            rows={3}
          />
        );
      case 'boolean':
        return (
          <Switch
            checked={currentValue || false}
            onCheckedChange={(checked) => handlePropertyChange(key, checked)}
          />
        );
      case 'select':
        return (
          <Select value={currentValue || property.default} onValueChange={(value) => handlePropertyChange(key, value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {property.options?.map((option: any) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'number':
        return (
          <Input
            type="number"
            value={currentValue || ''}
            onChange={(e) => handlePropertyChange(key, parseFloat(e.target.value) || 0)}
            placeholder={property.label}
          />
        );
      default:
        return (
          <Input
            value={currentValue || ''}
            onChange={(e) => handlePropertyChange(key, e.target.value)}
            placeholder={property.label}
          />
        );
    }
  };

  return (
    <div className="h-full w-full flex flex-col">
      {/* Header do Properties Panel */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            {blockDefinition.name}
          </h3>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="text-purple-600 hover:text-purple-700 hover:bg-purple-100"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-sm text-purple-600 mt-1">Propriedades do componente</p>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-4 overflow-auto">
        {Object.entries(blockDefinition.properties).map(([key, property]) => (
          <div key={key} className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">{property.label}</Label>
            {renderPropertyInput(key, property)}
            {property.description && (
              <p className="text-xs text-gray-500">{property.description}</p>
            )}
          </div>
        ))}
        
        {Object.keys(blockDefinition.properties).length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">⚙️</div>
            <p className="text-sm">Nenhuma propriedade disponível</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicPropertiesPanel;

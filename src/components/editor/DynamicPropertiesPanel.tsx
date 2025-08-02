
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
    <Card className="w-80 h-fit">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg">{blockDefinition.name}</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(blockDefinition.properties).map(([key, property]) => (
          <div key={key} className="space-y-2">
            <Label className="text-sm font-medium">{property.label}</Label>
            {renderPropertyInput(key, property)}
            {property.description && (
              <p className="text-xs text-gray-500">{property.description}</p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default DynamicPropertiesPanel;

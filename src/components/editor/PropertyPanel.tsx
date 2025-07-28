
import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Trash2, Copy, Eye, EyeOff } from 'lucide-react';
import { Block } from '@/types/editor';

interface PropertyPanelProps {
  selectedBlock: Block | null;
  onUpdateBlock: (id: string, updates: Partial<Block>) => void;
  onDeleteBlock: (id: string) => void;
  onDuplicateBlock: (id: string) => void;
}

export const PropertyPanel: React.FC<PropertyPanelProps> = ({
  selectedBlock,
  onUpdateBlock,
  onDeleteBlock,
  onDuplicateBlock
}) => {
  if (!selectedBlock) {
    return (
      <div className="p-4 text-center text-gray-500">
        <div className="mb-4 text-4xl">🎯</div>
        <h3 className="mb-2 font-medium">Properties</h3>
        <p className="text-sm">Select a block to edit its properties</p>
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

  const handlePropertyUpdate = (key: string, value: any) => {
    const properties = selectedBlock.properties || {};
    onUpdateBlock(selectedBlock.id, {
      properties: {
        ...properties,
        [key]: value
      }
    });
  };

  const renderPropertyEditor = (property: any) => {
    const { key, label, type, options, defaultValue, min, max, step } = property;
    const value = selectedBlock.content?.[key] || selectedBlock.properties?.[key] || defaultValue;

    switch (type) {
      case 'text':
        return (
          <div className="space-y-2">
            <Label htmlFor={key}>{label}</Label>
            <Input
              id={key}
              value={value || ''}
              onChange={(e) => handleContentUpdate(key, e.target.value)}
              placeholder={`Enter ${label.toLowerCase()}`}
            />
          </div>
        );

      case 'textarea':
        return (
          <div className="space-y-2">
            <Label htmlFor={key}>{label}</Label>
            <Textarea
              id={key}
              value={value || ''}
              onChange={(e) => handleContentUpdate(key, e.target.value)}
              placeholder={`Enter ${label.toLowerCase()}`}
              rows={3}
            />
          </div>
        );

      case 'select':
        return (
          <div className="space-y-2">
            <Label htmlFor={key}>{label}</Label>
            <Select value={value || ''} onValueChange={(val) => handleContentUpdate(key, val)}>
              <SelectTrigger>
                <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {options?.map((option: any) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 'number':
        return (
          <div className="space-y-2">
            <Label htmlFor={key}>{label}</Label>
            <Input
              id={key}
              type="number"
              value={value || ''}
              onChange={(e) => handleContentUpdate(key, parseFloat(e.target.value) || 0)}
              placeholder={`Enter ${label.toLowerCase()}`}
              min={min}
              max={max}
              step={step}
            />
          </div>
        );

      case 'boolean':
        return (
          <div className="flex items-center justify-between">
            <Label htmlFor={key}>{label}</Label>
            <Switch
              id={key}
              checked={value || false}
              onCheckedChange={(checked) => handleContentUpdate(key, checked)}
            />
          </div>
        );

      case 'color':
        return (
          <div className="space-y-2">
            <Label htmlFor={key}>{label}</Label>
            <div className="flex items-center gap-2">
              <Input
                id={key}
                type="color"
                value={value || '#000000'}
                onChange={(e) => handleContentUpdate(key, e.target.value)}
                className="w-12 h-12 p-1"
              />
              <Input
                type="text"
                value={value || '#000000'}
                onChange={(e) => handleContentUpdate(key, e.target.value)}
                placeholder="#000000"
                className="flex-1"
              />
            </div>
          </div>
        );

      case 'range':
        return (
          <div className="space-y-2">
            <Label htmlFor={key}>{label}</Label>
            <div className="px-2">
              <Slider
                value={[value || defaultValue || 0]}
                onValueChange={(values) => handleContentUpdate(key, values[0])}
                max={max || 100}
                min={min || 0}
                step={step || 1}
                className="w-full"
              />
            </div>
            <div className="text-sm text-gray-500 text-center">
              {value || defaultValue || 0}
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="space-y-2">
            <Label htmlFor={key}>{label}</Label>
            <Input
              id={key}
              type="url"
              value={value || ''}
              onChange={(e) => handleContentUpdate(key, e.target.value)}
              placeholder="Enter image URL"
            />
            {value && (
              <div className="mt-2">
                <img
                  src={value}
                  alt="Preview"
                  className="w-full h-24 object-cover rounded border"
                />
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // Get properties schema based on block type
  const getPropertiesSchema = () => {
    switch (selectedBlock.type) {
      case 'header':
        return [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'subtitle', label: 'Subtitle', type: 'text' },
          { key: 'level', label: 'Level', type: 'select', options: [
            { value: 1, label: 'H1' },
            { value: 2, label: 'H2' },
            { value: 3, label: 'H3' },
            { value: 4, label: 'H4' },
          ]},
          { key: 'textAlign', label: 'Text Align', type: 'select', options: [
            { value: 'left', label: 'Left' },
            { value: 'center', label: 'Center' },
            { value: 'right', label: 'Right' },
          ]},
        ];
      case 'text':
        return [
          { key: 'text', label: 'Text', type: 'textarea' },
          { key: 'textAlign', label: 'Text Align', type: 'select', options: [
            { value: 'left', label: 'Left' },
            { value: 'center', label: 'Center' },
            { value: 'right', label: 'Right' },
          ]},
        ];
      case 'image':
        return [
          { key: 'src', label: 'Image URL', type: 'image' },
          { key: 'alt', label: 'Alt Text', type: 'text' },
          { key: 'width', label: 'Width', type: 'number' },
          { key: 'height', label: 'Height', type: 'number' },
        ];
      case 'button':
        return [
          { key: 'text', label: 'Button Text', type: 'text' },
          { key: 'href', label: 'Link URL', type: 'text' },
          { key: 'variant', label: 'Variant', type: 'select', options: [
            { value: 'primary', label: 'Primary' },
            { value: 'secondary', label: 'Secondary' },
            { value: 'outline', label: 'Outline' },
            { value: 'ghost', label: 'Ghost' },
          ]},
          { key: 'size', label: 'Size', type: 'select', options: [
            { value: 'sm', label: 'Small' },
            { value: 'md', label: 'Medium' },
            { value: 'lg', label: 'Large' },
          ]},
        ];
      default:
        return [];
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b bg-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-medium">Properties</h3>
            <Badge variant="outline" className="mt-1">
              {selectedBlock.type}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDuplicateBlock(selectedBlock.id)}
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDeleteBlock(selectedBlock.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-auto">
        {getPropertiesSchema().map((property) => (
          <div key={property.key}>
            {renderPropertyEditor(property)}
          </div>
        ))}

        {/* Additional properties for all blocks */}
        <div className="pt-4 border-t">
          <h4 className="font-medium mb-3">Layout & Spacing</h4>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Margin</Label>
              <Input
                type="text"
                value={selectedBlock.properties?.margin || ''}
                onChange={(e) => handlePropertyUpdate('margin', e.target.value)}
                placeholder="e.g., 16px or 1rem"
              />
            </div>
            <div className="space-y-2">
              <Label>Padding</Label>
              <Input
                type="text"
                value={selectedBlock.properties?.padding || ''}
                onChange={(e) => handlePropertyUpdate('padding', e.target.value)}
                placeholder="e.g., 16px or 1rem"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyPanel;

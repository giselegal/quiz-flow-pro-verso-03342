
import React from 'react';
import { Block, PropertySchema } from '@/types/editor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus, X } from 'lucide-react';
import { getIconByName } from '@/utils/iconMap';

interface PropertyPanelProps {
  block: Block;
  onUpdate: (updates: Partial<Block>) => void;
  onDelete: () => void;
}

export const PropertyPanel: React.FC<PropertyPanelProps> = ({
  block,
  onUpdate,
  onDelete
}) => {
  const updateProperty = (key: string, value: any) => {
    onUpdate({
      content: {
        ...block.content,
        [key]: value
      }
    });
  };

  const updateNestedProperty = (nestedPath: string, key: string, value: any) => {
    const pathParts = nestedPath.split('.');
    const updatedContent = { ...block.content };
    
    let current = updatedContent;
    for (let i = 0; i < pathParts.length - 1; i++) {
      current = current[pathParts[i]] = current[pathParts[i]] || {};
    }
    current[pathParts[pathParts.length - 1]] = {
      ...current[pathParts[pathParts.length - 1]],
      [key]: value
    };
    
    onUpdate({ content: updatedContent });
  };

  // Get properties schema based on block type
  const getPropertiesSchema = (): PropertySchema[] => {
    const properties = block.properties || {};
    if (Array.isArray(properties)) {
      return properties;
    }
    // Convert object to array if needed
    return Object.entries(properties).map(([key, value]) => ({
      key,
      label: key,
      type: 'text' as const,
      ...value
    }));
  };

  const renderPropertyInput = (prop: PropertySchema) => {
    const value = prop.nestedPath 
      ? block.content[prop.nestedPath]?.[prop.key]
      : block.content[prop.key];

    const handleChange = (newValue: any) => {
      if (prop.nestedPath) {
        updateNestedProperty(prop.nestedPath, prop.key, newValue);
      } else {
        updateProperty(prop.key, newValue);
      }
    };

    switch (prop.type) {
      case 'text':
        return (
          <div key={prop.key} className="space-y-2">
            <Label htmlFor={prop.key}>{prop.label}</Label>
            <Input
              id={prop.key}
              type="text"
              value={value || ''}
              onChange={(e) => handleChange(e.target.value)}
              placeholder={prop.placeholder}
            />
          </div>
        );

      case 'textarea':
        return (
          <div key={prop.key} className="space-y-2">
            <Label htmlFor={prop.key}>{prop.label}</Label>
            <Textarea
              id={prop.key}
              value={value || ''}
              onChange={(e) => handleChange(e.target.value)}
              placeholder={prop.placeholder}
              rows={3}
            />
          </div>
        );

      case 'number':
        return (
          <div key={prop.key} className="space-y-2">
            <Label htmlFor={prop.key}>{prop.label}</Label>
            <Input
              id={prop.key}
              type="number"
              value={value || ''}
              onChange={(e) => handleChange(parseFloat(e.target.value) || 0)}
              min={prop.validation?.min}
              max={prop.validation?.max}
              step={prop.validation?.step}
            />
          </div>
        );

      case 'select':
        return (
          <div key={prop.key} className="space-y-2">
            <Label htmlFor={prop.key}>{prop.label}</Label>
            <Select value={value} onValueChange={handleChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {prop.options?.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 'checkbox':
        return (
          <div key={prop.key} className="flex items-center space-x-2">
            <Switch
              id={prop.key}
              checked={value || false}
              onCheckedChange={handleChange}
            />
            <Label htmlFor={prop.key}>{prop.label}</Label>
          </div>
        );

      case 'color':
        return (
          <div key={prop.key} className="space-y-2">
            <Label htmlFor={prop.key}>{prop.label}</Label>
            <Input
              id={prop.key}
              type="color"
              value={value || '#000000'}
              onChange={(e) => handleChange(e.target.value)}
            />
          </div>
        );

      case 'image':
        return (
          <div key={prop.key} className="space-y-2">
            <Label htmlFor={prop.key}>{prop.label}</Label>
            <Input
              id={prop.key}
              type="url"
              value={value || ''}
              onChange={(e) => handleChange(e.target.value)}
              placeholder={prop.placeholder}
            />
          </div>
        );

      case 'array':
        const arrayValue = value || [];
        return (
          <div key={prop.key} className="space-y-2">
            <Label>{prop.label}</Label>
            <div className="space-y-2">
              {arrayValue.map((item: any, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={item}
                    onChange={(e) => {
                      const newArray = [...arrayValue];
                      newArray[index] = e.target.value;
                      handleChange(newArray);
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newArray = arrayValue.filter((_: any, i: number) => i !== index);
                      handleChange(newArray);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleChange([...arrayValue, ''])}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Properties</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={onDelete}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Block Type</Label>
          <div className="px-3 py-2 bg-gray-100 rounded text-sm">
            {block.type}
          </div>
        </div>

        {getPropertiesSchema().map(prop => renderPropertyInput(prop))}

        {prop.helpText && (
          <div className="text-xs text-gray-500 mt-1">
            {prop.helpText}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PropertyPanel;

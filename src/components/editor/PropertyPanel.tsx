
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { ColorPicker } from '@/components/ui/ColorPicker';
import { PropertySchema, EditorBlock } from '@/types/editor';
import { getIconByName } from '@/utils/iconMap';

interface PropertyPanelProps {
  block: EditorBlock;
  onChange: (updates: Partial<EditorBlock>) => void;
  onDelete: () => void;
}

export const PropertyPanel: React.FC<PropertyPanelProps> = ({
  block,
  onChange,
  onDelete
}) => {
  const handlePropertyChange = (key: string, value: any) => {
    const updates = { ...block.content };
    updates[key] = value;
    onChange({ content: updates });
  };

  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  const setNestedValue = (obj: any, path: string, value: any) => {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    const target = keys.reduce((current, key) => {
      if (!current[key]) current[key] = {};
      return current[key];
    }, obj);
    target[lastKey] = value;
  };

  const getBlockProperties = (): PropertySchema[] => {
    const properties = block.properties || [];
    return properties;
  };

  const renderPropertyInput = (property: PropertySchema) => {
    const value = property.nestedPath 
      ? getNestedValue(block.content, property.nestedPath)
      : block.content[property.key];

    const handleChange = (newValue: any) => {
      if (property.nestedPath) {
        const updates = { ...block.content };
        setNestedValue(updates, property.nestedPath, newValue);
        onChange({ content: updates });
      } else {
        handlePropertyChange(property.key, newValue);
      }
    };

    switch (property.type) {
      case 'text':
        return (
          <Input
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={property.placeholder}
          />
        );

      case 'textarea':
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={property.placeholder}
            rows={4}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => handleChange(Number(e.target.value))}
            min={property.min}
            max={property.max}
            step={property.step}
          />
        );

      case 'range':
        return (
          <div className="space-y-2">
            <input
              type="range"
              value={value || 0}
              onChange={(e) => handleChange(Number(e.target.value))}
              min={property.min || 0}
              max={property.max || 100}
              step={property.step || 1}
              className="w-full"
            />
            <div className="text-sm text-gray-500 text-center">{value}</div>
          </div>
        );

      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={property.key}
              checked={value || false}
              onCheckedChange={handleChange}
            />
            <Label htmlFor={property.key}>Enable</Label>
          </div>
        );

      case 'color':
        return (
          <ColorPicker
            value={value || '#000000'}
            onChange={handleChange}
          />
        );

      case 'select':
        return (
          <Select value={value || ''} onValueChange={handleChange}>
            <SelectTrigger>
              <SelectValue placeholder={property.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {property.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'url':
        return (
          <Input
            type="url"
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={property.placeholder}
          />
        );

      case 'image':
        return (
          <div className="space-y-2">
            <Input
              type="url"
              value={value || ''}
              onChange={(e) => handleChange(e.target.value)}
              placeholder={property.placeholder}
            />
            {value && (
              <img 
                src={value} 
                alt="Preview" 
                className="w-full h-32 object-cover rounded border"
              />
            )}
          </div>
        );

      case 'icon-select':
        return <div>Icon Select (Not implemented)</div>;

      case 'array-of-objects':
        return (
          <div className="space-y-2">
            <Label>Array of Objects</Label>
            <Input
              value={JSON.stringify(value || [])}
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  handleChange(parsed);
                } catch (error) {
                  // Handle JSON parse error
                }
              }}
              placeholder={property.placeholder}
            />
          </div>
        );

      case 'array':
        return (
          <div className="space-y-2">
            <Label>Array Values</Label>
            <Textarea
              value={Array.isArray(value) ? value.join('\n') : ''}
              onChange={(e) => {
                const lines = e.target.value.split('\n').filter(line => line.trim());
                handleChange(lines);
              }}
              placeholder="Enter one item per line"
              rows={4}
            />
          </div>
        );

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={property.key}
              checked={value || false}
              onCheckedChange={handleChange}
            />
            <Label htmlFor={property.key}>{property.label}</Label>
          </div>
        );

      default:
        return (
          <Input
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
          />
        );
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Properties</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {getBlockProperties().map((property) => (
          <div key={property.key} className="space-y-2">
            <Label htmlFor={property.key} className="text-sm font-medium">
              {property.label}
            </Label>
            {renderPropertyInput(property)}
            {property.helpText && (
              <p className="text-xs text-gray-500">
                {property.helpText}
              </p>
            )}
          </div>
        ))}
        
        <div className="pt-4 border-t">
          <Button
            variant="destructive"
            onClick={onDelete}
            className="w-full"
          >
            Delete Block
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyPanel;

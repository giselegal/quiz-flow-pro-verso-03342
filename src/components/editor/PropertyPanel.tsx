
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus, X } from 'lucide-react';
import { Block, PropertySchema } from '@/types/editor';
import { getIconByName } from '@/utils/iconMap';

interface PropertyPanelProps {
  block: Block;
  onChange: (content: any) => void;
  onDelete: () => void;
}

export const PropertyPanel: React.FC<PropertyPanelProps> = ({
  block,
  onChange,
  onDelete
}) => {
  const [activeTab, setActiveTab] = useState('content');

  const handlePropertyChange = (key: string, value: any) => {
    onChange({
      ...block.content,
      [key]: value
    });
  };

  const handleNestedPropertyChange = (property: PropertySchema, value: any) => {
    if (property.nestedPath) {
      const keys = property.nestedPath.split('.');
      const currentValue = block.properties || {};
      const newValue = { ...currentValue };
      
      let current = newValue;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      
      onChange(newValue);
    } else {
      handlePropertyChange(property.key, value);
    }
  };

  const getValue = (property: PropertySchema): any => {
    if (property.nestedPath) {
      const keys = property.nestedPath.split('.');
      let current = block.properties || {};
      for (const key of keys) {
        current = current[key];
        if (!current) return property.defaultValue;
      }
      return current;
    }
    return block.content?.[property.key] ?? property.defaultValue;
  };

  const renderPropertyInput = (property: PropertySchema) => {
    const value = getValue(property);

    switch (property.type) {
      case 'text':
        return (
          <Input
            value={value || ''}
            onChange={(e) => handleNestedPropertyChange(property, e.target.value)}
            placeholder={property.placeholder}
          />
        );

      case 'textarea':
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => handleNestedPropertyChange(property, e.target.value)}
            placeholder={property.placeholder}
            rows={4}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => handleNestedPropertyChange(property, Number(e.target.value))}
            min={property.min}
            max={property.max}
            step={property.step}
          />
        );

      case 'range':
        return (
          <div className="space-y-2">
            <Slider
              value={[value || 0]}
              onValueChange={(values) => handleNestedPropertyChange(property, values[0])}
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
          <Switch
            checked={value || false}
            onCheckedChange={(checked) => handleNestedPropertyChange(property, checked)}
          />
        );

      case 'select':
        return (
          <Select value={value || ''} onValueChange={(val) => handleNestedPropertyChange(property, val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select option" />
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

      case 'color':
        return (
          <div className="flex items-center space-x-2">
            <Input
              type="color"
              value={value || '#000000'}
              onChange={(e) => handleNestedPropertyChange(property, e.target.value)}
              className="w-12 h-8 p-0 border-0"
            />
            <Input
              type="text"
              value={value || ''}
              onChange={(e) => handleNestedPropertyChange(property, e.target.value)}
              placeholder={property.placeholder}
              className="flex-1"
            />
          </div>
        );

      case 'url':
        return (
          <Input
            type="url"
            value={value || ''}
            onChange={(e) => handleNestedPropertyChange(property, e.target.value)}
            placeholder={property.placeholder}
          />
        );

      case 'image':
        return (
          <div className="space-y-2">
            <Input
              type="url"
              value={value || ''}
              onChange={(e) => handleNestedPropertyChange(property, e.target.value)}
              placeholder={property.placeholder}
            />
            {value && (
              <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                <img
                  src={value}
                  alt="Preview"
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        );

      case 'icon-select':
        return (
          <Select value={value || ''} onValueChange={(val) => handleNestedPropertyChange(property, val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select icon" />
            </SelectTrigger>
            <SelectContent>
              {property.options?.map((option) => {
                const IconComponent = getIconByName(option.value);
                return (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center space-x-2">
                      {IconComponent && <IconComponent className="w-4 h-4" />}
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        );

      case 'array':
        const arrayValue = Array.isArray(value) ? value : [];
        return (
          <div className="space-y-2">
            {arrayValue.map((item: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={item}
                  onChange={(e) => {
                    const newArray = [...arrayValue];
                    newArray[index] = e.target.value;
                    handleNestedPropertyChange(property, newArray);
                  }}
                  placeholder={property.placeholder}
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const newArray = arrayValue.filter((_, i) => i !== index);
                    handleNestedPropertyChange(property, newArray);
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                handleNestedPropertyChange(property, [...arrayValue, '']);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </div>
        );

      case 'array-of-objects':
        const objectArrayValue = Array.isArray(value) ? value : [];
        return (
          <div className="space-y-4">
            {objectArrayValue.map((item: any, index: number) => (
              <Card key={index} className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Item {index + 1}</h4>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const newArray = objectArrayValue.filter((_, i) => i !== index);
                      handleNestedPropertyChange(property, newArray);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                {property.itemSchema?.map((itemProperty: PropertySchema) => (
                  <div key={itemProperty.key} className="mb-2">
                    <Label className="text-sm font-medium">{itemProperty.label}</Label>
                    <div className="mt-1">
                      {renderPropertyInput({
                        ...itemProperty,
                        key: `${index}.${itemProperty.key}`,
                        // Override the getValue function for nested objects
                      })}
                    </div>
                  </div>
                ))}
              </Card>
            ))}
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const newItem = {};
                property.itemSchema?.forEach((itemProp) => {
                  newItem[itemProp.key] = itemProp.defaultValue;
                });
                handleNestedPropertyChange(property, [...objectArrayValue, newItem]);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </div>
        );

      default:
        return (
          <Input
            value={value || ''}
            onChange={(e) => handleNestedPropertyChange(property, e.target.value)}
            placeholder={property.placeholder}
          />
        );
    }
  };

  // Mock schema for demonstration
  const mockSchema: PropertySchema[] = [
    { key: 'text', label: 'Text', type: 'text', placeholder: 'Enter text' },
    { key: 'title', label: 'Title', type: 'text', placeholder: 'Enter title' },
    { key: 'subtitle', label: 'Subtitle', type: 'text', placeholder: 'Enter subtitle' },
  ];

  return (
    <div className="h-full flex flex-col">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center justify-between">
          <span>Properties</span>
          <Button size="sm" variant="outline" onClick={onDelete}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 overflow-auto p-4">
        <div className="space-y-4">
          {mockSchema.map((property) => (
            <div key={property.key} className="space-y-2">
              <Label className="text-sm font-medium">{property.label}</Label>
              {renderPropertyInput(property)}
              {property.helpText && (
                <p className="text-xs text-gray-500">{property.helpText}</p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </div>
  );
};

export default PropertyPanel;

// =====================================================================
// components/editor/PropertyPanel.tsx - Painel universal de propriedades
// =====================================================================

import React, { useState, useCallback } from 'react';
import { PropertySchema, Block } from '../../types/editor';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Slider } from '../ui/slider';
import { Badge } from '../ui/badge';
import { Trash2, Plus, ChevronDown, ChevronRight } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { getIconByName } from '../../utils/iconMap';

interface PropertyPanelProps {
  block: Block | null;
  schema: PropertySchema[];
  onPropertyChange: (path: string, value: any) => void;
  onBlockUpdate: (block: Block) => void;
}

export const PropertyPanel: React.FC<PropertyPanelProps> = ({
  block,
  schema,
  onPropertyChange,
  onBlockUpdate
}) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleSection = useCallback((sectionKey: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  }, []);

  const getPropertyValue = useCallback((property: PropertySchema) => {
    if (!block) return property.defaultValue;

    if (property.nestedPath) {
      const pathParts = property.nestedPath.split('.');
      let value = block.properties;
      for (const part of pathParts) {
        value = value?.[part];
      }
      return value ?? property.defaultValue;
    }

    return block.properties[property.key] ?? property.defaultValue;
  }, [block]);

  const updateProperty = useCallback((property: PropertySchema, value: any) => {
    if (!block) return;

    const path = property.nestedPath || property.key;
    onPropertyChange(path, value);

    // Atualizar o bloco
    let updatedProperties = { ...block.properties };
    
    if (property.nestedPath) {
      const pathParts = property.nestedPath.split('.');
      let current = updatedProperties;
      
      for (let i = 0; i < pathParts.length - 1; i++) {
        if (!current[pathParts[i]]) {
          current[pathParts[i]] = {};
        }
        current = current[pathParts[i]];
      }
      
      current[pathParts[pathParts.length - 1]] = value;
    } else {
      updatedProperties[property.key] = value;
    }

    onBlockUpdate({
      ...block,
      properties: updatedProperties
    });
  }, [block, onPropertyChange, onBlockUpdate]);

  const renderColorInput = (property: PropertySchema) => {
    const value = getPropertyValue(property);
    return (
      <div className="flex items-center space-x-2">
        <input
          type="color"
          value={value || property.defaultValue}
          onChange={(e) => updateProperty(property, e.target.value)}
          className="w-12 h-8 rounded border cursor-pointer"
        />
        <Input
          value={value || property.defaultValue}
          onChange={(e) => updateProperty(property, e.target.value)}
          placeholder={property.placeholder}
          className="flex-1"
        />
      </div>
    );
  };

  const renderIconSelect = (property: PropertySchema) => {
    const value = getPropertyValue(property);
    const iconOptions = [
      'CheckCircle', 'Clock', 'DollarSign', 'Frown', 'TrendingUp', 
      'Headphones', 'AlertCircle', 'Star', 'Heart', 'Shield',
      'Target', 'Zap', 'Award', 'Gift', 'Users'
    ];

    return (
      <Select
        value={value || property.defaultValue}
        onValueChange={(newValue) => updateProperty(property, newValue)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Selecione um ícone">
            <div className="flex items-center space-x-2">
              {value && React.createElement(getIconByName(value), { size: 16 })}
              <span>{value || 'Selecione...'}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {iconOptions.map((iconName) => {
            const IconComponent = getIconByName(iconName);
            return (
              <SelectItem key={iconName} value={iconName}>
                <div className="flex items-center space-x-2">
                  <IconComponent size={16} />
                  <span>{iconName}</span>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    );
  };

  const renderArrayOfObjects = (property: PropertySchema) => {
    const value = getPropertyValue(property) || [];
    const isExpanded = expandedSections[property.key] ?? true;

    const addItem = () => {
      const newItem: Record<string, any> = {};
      property.itemSchema?.forEach(itemProp => {
        newItem[itemProp.key] = itemProp.defaultValue;
      });

      const newArray = [...value, { id: Date.now().toString(), ...newItem }];
      updateProperty(property, newArray);
    };

    const removeItem = (index: number) => {
      const newArray = value.filter((_: any, i: number) => i !== index);
      updateProperty(property, newArray);
    };

    const updateItem = (index: number, itemKey: string, itemValue: any) => {
      const newArray = [...value];
      newArray[index] = { ...newArray[index], [itemKey]: itemValue };
      updateProperty(property, newArray);
    };

    return (
      <div className="space-y-3">
        <Collapsible open={isExpanded} onOpenChange={() => toggleSection(property.key)}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="flex items-center justify-between w-full p-0">
              <span className="flex items-center">
                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                <span className="ml-2">{property.label}</span>
                <Badge variant="secondary" className="ml-2">{value.length}</Badge>
              </span>
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <div className="space-y-4 mt-3">
              {value.map((item: any, index: number) => (
                <Card key={item.id || index} className="relative">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">Item {index + 1}</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(index)}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {property.itemSchema?.map((itemProp) => (
                        <div key={itemProp.key}>
                          <Label htmlFor={`${property.key}-${index}-${itemProp.key}`} className="text-xs">
                            {itemProp.label}
                          </Label>
                          {renderPropertyControl(
                            itemProp,
                            item[itemProp.key] ?? itemProp.defaultValue,
                            (newValue) => updateItem(index, itemProp.key, newValue),
                            `${property.key}-${index}-${itemProp.key}`
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <Button
                variant="outline"
                onClick={addItem}
                className="w-full"
                size="sm"
              >
                <Plus size={16} className="mr-2" />
                Adicionar {property.label.slice(0, -1)}
              </Button>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  };

  const renderPropertyControl = (
    property: PropertySchema,
    value: any,
    onChange: (value: any) => void,
    id?: string
  ) => {
    const inputId = id || `prop-${property.key}`;

    switch (property.type) {
      case 'text':
        return (
          <Input
            id={inputId}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={property.placeholder}
          />
        );

      case 'textarea':
        return (
          <Textarea
            id={inputId}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={property.placeholder}
            rows={3}
          />
        );

      case 'number':
        return (
          <Input
            id={inputId}
            type="number"
            value={value || property.defaultValue}
            onChange={(e) => onChange(parseInt(e.target.value) || property.defaultValue)}
            min={property.min}
            max={property.max}
            step={property.step}
          />
        );

      case 'range':
        return (
          <div className="space-y-2">
            <Slider
              value={[value || property.defaultValue]}
              onValueChange={([newValue]) => onChange(newValue)}
              min={property.min || 0}
              max={property.max || 100}
              step={property.step || 1}
            />
            <div className="text-xs text-muted-foreground text-center">
              {value || property.defaultValue}
            </div>
          </div>
        );

      case 'color':
        return renderColorInput({ ...property, defaultValue: value });

      case 'boolean':
        return (
          <Switch
            id={inputId}
            checked={value || false}
            onCheckedChange={onChange}
          />
        );

      case 'select':
        return (
          <Select value={value || property.defaultValue} onValueChange={onChange}>
            <SelectTrigger id={inputId}>
              <SelectValue />
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
            id={inputId}
            type="url"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={property.placeholder}
          />
        );

      case 'image':
        return (
          <div className="space-y-2">
            <Input
              id={inputId}
              type="url"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder={property.placeholder}
            />
            {value && (
              <div className="relative">
                <img
                  src={value}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded border"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        );

      case 'icon-select':
        return renderIconSelect({ ...property, defaultValue: value });

      case 'array-of-objects':
        return null; // Renderizado separadamente

      default:
        return (
          <Input
            id={inputId}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={property.placeholder}
          />
        );
    }
  };

  if (!block) {
    return (
      <Card className="w-80">
        <CardHeader>
          <CardTitle>Propriedades</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Selecione um bloco para editar suas propriedades.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-80 max-h-screen overflow-y-auto">
      <CardHeader>
        <CardTitle>Propriedades</CardTitle>
        <p className="text-sm text-muted-foreground">
          {block.type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {schema.map((property) => (
          <div key={property.key}>
            {property.type === 'array-of-objects' ? (
              renderArrayOfObjects(property)
            ) : (
              <div className="space-y-2">
                <Label htmlFor={`prop-${property.key}`} className="text-sm font-medium">
                  {property.label}
                </Label>
                {renderPropertyControl(
                  property,
                  getPropertyValue(property),
                  (value) => updateProperty(property, value)
                )}
                {property.helpText && (
                  <p className="text-xs text-muted-foreground">
                    {property.helpText}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Settings, Trash2, Eye, EyeOff, Palette, Type, Layout, Image, Link, Code, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { getBlockDefinition } from './blocks/EnhancedBlockRegistry';
import type { EditorBlock } from '@/types/editor';

export interface BlockData {
  id: string;
  type: string;
  properties: Record<string, any>;
}

interface DynamicPropertiesPanelProps {
  selectedBlock: BlockData | null;
  onUpdateBlock?: (blockId: string, properties: Record<string, any>) => void;
  onDeleteBlock?: (blockId: string) => void;
}

const DynamicPropertiesPanel: React.FC<DynamicPropertiesPanelProps> = ({
  selectedBlock,
  onUpdateBlock,
  onDeleteBlock
}) => {
  if (!selectedBlock) {
    return (
      <div className="h-full bg-muted/20 border-l">
        <div className="p-4 border-b bg-background">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Propriedades
          </h3>
        </div>
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          <div className="text-center">
            <Layout className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Selecione um componente para editar suas propriedades</p>
          </div>
        </div>
      </div>
    );
  }

  const blockDef = getBlockDefinition(selectedBlock.type);
  
  const handlePropertyChange = (propertyKey: string, value: any) => {
    if (onUpdateBlock) {
      onUpdateBlock(selectedBlock.id, {
        ...selectedBlock.properties,
        [propertyKey]: value
      });
    }
  };

  const handleDeleteBlock = () => {
    if (onDeleteBlock && selectedBlock) {
      onDeleteBlock(selectedBlock.id);
    }
  };

  const renderPropertyControl = (key: string, property: any, value: any) => {
    const propertyId = `property-${key}`;

    switch (property.type) {
      case 'string':
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={propertyId} className="text-xs font-medium">
              {property.label || key}
            </Label>
            <Input
              id={propertyId}
              value={value || ''}
              onChange={(e) => handlePropertyChange(key, e.target.value)}
              placeholder={property.placeholder || `Digite ${property.label || key}`}
              className="h-8"
            />
          </div>
        );

      case 'textarea':
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={propertyId} className="text-xs font-medium">
              {property.label || key}
            </Label>
            <Textarea
              id={propertyId}
              value={value || ''}
              onChange={(e) => handlePropertyChange(key, e.target.value)}
              placeholder={property.placeholder || `Digite ${property.label || key}`}
              className="min-h-[60px] resize-none"
              rows={3}
            />
          </div>
        );

      case 'select':
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={propertyId} className="text-xs font-medium">
              {property.label || key}
            </Label>
            <Select value={value || ''} onValueChange={(val) => handlePropertyChange(key, val)}>
              <SelectTrigger className="h-8">
                <SelectValue placeholder={`Selecione ${property.label || key}`} />
              </SelectTrigger>
              <SelectContent>
                {property.options?.map((option: any) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 'boolean':
        return (
          <div key={key} className="flex items-center justify-between py-2">
            <Label htmlFor={propertyId} className="text-xs font-medium">
              {property.label || key}
            </Label>
            <Switch
              id={propertyId}
              checked={!!value}
              onCheckedChange={(checked) => handlePropertyChange(key, checked)}
            />
          </div>
        );

      case 'number':
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={propertyId} className="text-xs font-medium">
              {property.label || key}
            </Label>
            <Input
              id={propertyId}
              type="number"
              value={value || ''}
              onChange={(e) => handlePropertyChange(key, Number(e.target.value))}
              placeholder={property.placeholder || '0'}
              className="h-8"
            />
          </div>
        );

      case 'color':
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={propertyId} className="text-xs font-medium">
              {property.label || key}
            </Label>
            <div className="flex gap-2">
              <Input
                id={propertyId}
                type="color"
                value={value || '#000000'}
                onChange={(e) => handlePropertyChange(key, e.target.value)}
                className="w-12 h-8 p-1 rounded cursor-pointer"
              />
              <Input
                value={value || '#000000'}
                onChange={(e) => handlePropertyChange(key, e.target.value)}
                placeholder="#000000"
                className="h-8 flex-1 font-mono text-xs"
              />
            </div>
          </div>
        );

      default:
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={propertyId} className="text-xs font-medium">
              {property.label || key}
            </Label>
            <Input
              id={propertyId}
              value={value || ''}
              onChange={(e) => handlePropertyChange(key, e.target.value)}
              placeholder={property.placeholder || `Digite ${property.label || key}`}
              className="h-8"
            />
          </div>
        );
    }
  };

  const groupProperties = (properties: Record<string, any>) => {
    const groups: Record<string, Record<string, any>> = {
      content: {},
      style: {},
      layout: {},
      behavior: {},
      other: {}
    };

    Object.entries(properties).forEach(([key, prop]) => {
      const group = prop.group || 'other';
      groups[group][key] = prop;
    });

    return groups;
  };

  const getGroupIcon = (groupName: string) => {
    switch (groupName) {
      case 'content': return <Type className="w-4 h-4" />;
      case 'style': return <Palette className="w-4 h-4" />;
      case 'layout': return <Layout className="w-4 h-4" />;
      case 'behavior': return <Settings className="w-4 h-4" />;
      default: return <Code className="w-4 h-4" />;
    }
  };

  const getGroupLabel = (groupName: string) => {
    switch (groupName) {
      case 'content': return 'Conteúdo';
      case 'style': return 'Estilo';
      case 'layout': return 'Layout';
      case 'behavior': return 'Comportamento';
      default: return 'Outros';
    }
  };

  const properties = blockDef?.properties || {};
  const groupedProperties = groupProperties(properties);

  return (
    <div className="h-full bg-background border-l flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-muted/10">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Propriedades
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDeleteBlock}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {blockDef?.label || selectedBlock.type}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            ID: {selectedBlock.id.slice(0, 8)}...
          </Badge>
        </div>
      </div>

      {/* Properties Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {Object.entries(groupedProperties).map(([groupName, groupProps]) => {
            if (Object.keys(groupProps).length === 0) return null;

            return (
              <div key={groupName} className="space-y-3">
                <div className="flex items-center gap-2">
                  {getGroupIcon(groupName)}
                  <h4 className="font-medium text-sm text-muted-foreground">
                    {getGroupLabel(groupName)}
                  </h4>
                </div>
                <div className="space-y-4 pl-6">
                  {Object.entries(groupProps).map(([key, property]) =>
                    renderPropertyControl(key, property, selectedBlock.properties[key])
                  )}
                </div>
                {groupName !== 'other' && <Separator />}
              </div>
            );
          })}

          {Object.keys(properties).length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Settings className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Este componente não possui propriedades configuráveis</p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Actions */}
      <div className="p-4 border-t bg-muted/10">
        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => {
              // Toggle visibility logic
              const isVisible = selectedBlock.properties.visible !== false;
              handlePropertyChange('visible', !isVisible);
            }}
          >
            {selectedBlock.properties.visible !== false ? (
              <><Eye className="w-4 h-4 mr-2" /> Visível</>
            ) : (
              <><EyeOff className="w-4 h-4 mr-2" /> Oculto</>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DynamicPropertiesPanel;

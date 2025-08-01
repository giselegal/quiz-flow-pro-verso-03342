// =====================================================================
// components/editor/PropertyPanel.tsx - Painel elegante baseado em schema
// =====================================================================

import React from 'react';
import { PropertySchema, Block } from '../../types/editor';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Trash2, X, Settings, Palette, Type, Image, BarChart3 } from 'lucide-react';
import { getBlockPropertiesSchema } from '../../config/blockDefinitions';

interface PropertyPanelProps {
  selectedBlock: Block | null;
  onUpdateBlock: (id: string, updates: Partial<Block>) => void;
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
      <div className="h-full bg-white border-l border-gray-200 p-4">
        <div className="text-center text-gray-500 mt-8">
          <div className="text-4xl mb-4">⚙️</div>
          <h3 className="font-medium mb-2">Propriedades</h3>
          <p className="text-sm">Selecione um bloco para editar suas propriedades</p>
        </div>
      </div>
    );
  }

  // Busca o schema automaticamente baseado no tipo do bloco
  const schema = getBlockPropertiesSchema(selectedBlock.type) || [];

  const updateContent = (key: string, value: any) => {
    onUpdateBlock(selectedBlock.id, {
      content: { ...selectedBlock.content, [key]: value }
    });
  };

  const getPropertyValue = (property: PropertySchema) => {
    return selectedBlock.content[property.key] ?? property.defaultValue;
  };

  const renderSchemaInput = (property: PropertySchema) => {
    const value = getPropertyValue(property);

    switch (property.type) {
      case 'text':
        return (
          <Input
            value={value || ''}
            onChange={(e) => updateContent(property.key, e.target.value)}
            placeholder={property.placeholder || property.label}
          />
        );

      case 'textarea':
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => updateContent(property.key, e.target.value)}
            placeholder={property.placeholder || property.label}
            rows={property.rows || 3}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => updateContent(property.key, parseFloat(e.target.value) || 0)}
            placeholder={property.placeholder || property.label}
            min={property.min}
            max={property.max}
          />
        );

      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={!!value}
              onCheckedChange={(checked) => updateContent(property.key, checked)}
            />
            <span className="text-sm text-gray-600">
              {value ? 'Ativado' : 'Desativado'}
            </span>
          </div>
        );

      case 'select':
        return (
          <Select value={value || ''} onValueChange={(val) => updateContent(property.key, val)}>
            <SelectTrigger>
              <SelectValue placeholder={property.placeholder || 'Selecione...'} />
            </SelectTrigger>
            <SelectContent>
              {property.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'color':
        return (
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={value || property.defaultValue}
              onChange={(e) => updateContent(property.key, e.target.value)}
              className="w-12 h-8 rounded border cursor-pointer"
            />
            <Input
              value={value || property.defaultValue}
              onChange={(e) => updateContent(property.key, e.target.value)}
              placeholder="#000000"
              className="flex-1"
            />
          </div>
        );

      case 'image-url':
        return (
          <div className="space-y-2">
            <Input
              value={value || ''}
              onChange={(e) => updateContent(property.key, e.target.value)}
              placeholder="https://exemplo.com/imagem.jpg"
            />
            {value && (
              <div className="w-full max-w-xs">
                <img 
                  src={value} 
                  alt="Preview" 
                  className="w-full h-24 object-cover rounded border"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        );

      case 'url':
        return (
          <Input
            type="url"
            value={value || ''}
            onChange={(e) => updateContent(property.key, e.target.value)}
            placeholder="https://exemplo.com"
          />
        );

      case 'array':
        return (
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Lista editável:</p>
            <Textarea
              value={Array.isArray(value) ? value.join('\n') : ''}
              onChange={(e) => updateContent(property.key, e.target.value.split('\n').filter(Boolean))}
              placeholder="Um item por linha"
              rows={4}
            />
          </div>
        );

      default:
        return (
          <Input
            value={value || ''}
            onChange={(e) => updateContent(property.key, e.target.value)}
            placeholder={property.placeholder || property.label}
          />
        );
    }
  };

  // Agrupa propriedades por categoria para melhor organização
  const groupedProperties = schema.reduce((groups: Record<string, PropertySchema[]>, property) => {
    // Categoriza propriedades baseado no tipo ou prefixo
    let category = 'Básicas';
    
    if (property.key.includes('color') || property.key.includes('Color') || property.type === 'color') {
      category = 'Cores';
    } else if (property.key.includes('font') || property.key.includes('text') || property.key.includes('size') || property.key.includes('align')) {
      category = 'Tipografia';
    } else if (property.key.includes('supabase') || property.key.includes('track') || property.key.includes('analytics') || property.key.includes('enable')) {
      category = 'Analytics';
    } else if (property.key.includes('url') || property.key.includes('image') || property.key.includes('src') || property.key.includes('video')) {
      category = 'Mídia';
    } else if (property.key.includes('style') || property.key.includes('variant') || property.key.includes('layout')) {
      category = 'Estilo';
    }

    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(property);
    return groups;
  }, {});

  const getCategoryIcon = (categoryName: string) => {
    switch (categoryName) {
      case 'Cores':
        return <Palette className="w-4 h-4" />;
      case 'Tipografia':
        return <Type className="w-4 h-4" />;
      case 'Mídia':
        return <Image className="w-4 h-4" />;
      case 'Analytics':
        return <BarChart3 className="w-4 h-4" />;
      case 'Estilo':
        return <Palette className="w-4 h-4" />;
      default:
        return <Settings className="w-4 h-4" />;
    }
  };

  return (
    <div className="h-full bg-white border-l border-gray-200 overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-medium">Propriedades do Bloco</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="p-4 space-y-4">
        {/* Informações Gerais */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Informações Gerais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label htmlFor="block-type">Tipo</Label>
              <Input id="block-type" value={selectedBlock.type} disabled />
            </div>
            
            <div>
              <Label htmlFor="block-id">ID</Label>
              <Input id="block-id" value={selectedBlock.id} disabled />
            </div>
          </CardContent>
        </Card>

        {/* Propriedades baseadas no schema */}
        {Object.entries(groupedProperties).map(([categoryName, properties]) => (
          <Card key={categoryName}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                {getCategoryIcon(categoryName)}
                {categoryName}
                <span className="text-xs text-gray-500 ml-auto">
                  {properties.length} {properties.length === 1 ? 'propriedade' : 'propriedades'}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {properties.map((property) => (
                <div key={property.key}>
                  <Label htmlFor={property.key}>
                    {property.label}
                    {property.description && (
                      <span className="text-xs text-gray-500 ml-1">
                        - {property.description}
                      </span>
                    )}
                  </Label>
                  {renderSchemaInput(property)}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}

        {/* Caso não tenha propriedades no schema */}
        {schema.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              <Settings className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nenhuma propriedade configurada para este tipo de bloco.</p>
              <p className="text-xs mt-1">Verifique o blockDefinitions.ts</p>
            </CardContent>
          </Card>
        )}

        {/* Ações */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-red-600">Zona de Perigo</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDeleteBlock(selectedBlock.id)}
              className="w-full"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Deletar Bloco
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

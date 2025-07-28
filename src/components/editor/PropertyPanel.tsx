
import React from 'react';
import { EditorBlock, PropertySchema } from '@/types/editor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Minus } from 'lucide-react';

interface PropertyPanelProps {
  selectedBlock: EditorBlock | null;
  onUpdateBlock: (id: string, content: any) => void;
  onDeleteBlock: (id: string) => void;
}

export const PropertyPanel: React.FC<PropertyPanelProps> = ({
  selectedBlock,
  onUpdateBlock,
  onDeleteBlock
}) => {
  if (!selectedBlock) {
    return (
      <div className="p-4 text-center text-gray-500">
        Selecione um bloco para editar suas propriedades
      </div>
    );
  }

  const getPropertiesForBlockType = (blockType: string): PropertySchema[] => {
    const commonProperties: PropertySchema[] = [
      {
        key: 'title',
        label: 'Título',
        type: 'text',
        placeholder: 'Digite o título...'
      },
      {
        key: 'subtitle',
        label: 'Subtítulo',
        type: 'text',
        placeholder: 'Digite o subtítulo...'
      }
    ];

    const blockSpecificProperties: Record<string, PropertySchema[]> = {
      text: [
        {
          key: 'text',
          label: 'Texto',
          type: 'textarea',
          placeholder: 'Digite o texto...'
        }
      ],
      button: [
        {
          key: 'buttonText',
          label: 'Texto do Botão',
          type: 'text',
          placeholder: 'Clique aqui'
        },
        {
          key: 'buttonUrl',
          label: 'URL do Botão',
          type: 'url',
          placeholder: 'https://...'
        }
      ],
      image: [
        {
          key: 'imageUrl',
          label: 'URL da Imagem',
          type: 'url',
          placeholder: 'https://...'
        },
        {
          key: 'alt',
          label: 'Texto Alternativo',
          type: 'text',
          placeholder: 'Descrição da imagem'
        }
      ]
    };

    return [...commonProperties, ...(blockSpecificProperties[blockType] || [])];
  };

  const properties = getPropertiesForBlockType(selectedBlock.type);

  const handlePropertyChange = (key: string, value: any) => {
    const updatedContent = {
      ...selectedBlock.content,
      [key]: value
    };
    onUpdateBlock(selectedBlock.id, updatedContent);
  };

  const renderPropertyInput = (property: PropertySchema) => {
    const value = selectedBlock.content[property.key] || property.defaultValue || '';

    switch (property.type) {
      case 'text':
      case 'url':
        return (
          <Input
            value={value}
            onChange={(e) => handlePropertyChange(property.key, e.target.value)}
            placeholder={property.placeholder}
          />
        );

      case 'textarea':
        return (
          <Textarea
            value={value}
            onChange={(e) => handlePropertyChange(property.key, e.target.value)}
            placeholder={property.placeholder}
            rows={4}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => handlePropertyChange(property.key, parseFloat(e.target.value) || 0)}
            placeholder={property.placeholder}
          />
        );

      case 'color':
        return (
          <Input
            type="color"
            value={value}
            onChange={(e) => handlePropertyChange(property.key, e.target.value)}
          />
        );

      case 'checkbox':
      case 'boolean':
        return (
          <Switch
            checked={value}
            onCheckedChange={(checked) => handlePropertyChange(property.key, checked)}
          />
        );

      case 'select':
        return (
          <Select value={value} onValueChange={(val) => handlePropertyChange(property.key, val)}>
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

      case 'range':
        return (
          <div className="space-y-2">
            <Slider
              value={[value]}
              onValueChange={(values) => handlePropertyChange(property.key, values[0])}
              max={property.max || 100}
              min={property.min || 0}
              step={property.step || 1}
            />
            <div className="text-sm text-gray-500 text-center">{value}</div>
          </div>
        );

      case 'array':
        const arrayValue = Array.isArray(value) ? value : [];
        return (
          <div className="space-y-2">
            {arrayValue.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={item}
                  onChange={(e) => {
                    const newArray = [...arrayValue];
                    newArray[index] = e.target.value;
                    handlePropertyChange(property.key, newArray);
                  }}
                  placeholder={`Item ${index + 1}`}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const newArray = arrayValue.filter((_, i) => i !== index);
                    handlePropertyChange(property.key, newArray);
                  }}
                >
                  <Minus className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                handlePropertyChange(property.key, [...arrayValue, '']);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Item
            </Button>
          </div>
        );

      default:
        return (
          <Input
            value={value}
            onChange={(e) => handlePropertyChange(property.key, e.target.value)}
            placeholder={property.placeholder}
          />
        );
    }
  };

  return (
    <div className="h-full p-4 space-y-4 bg-white">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium">Propriedades</h3>
          <Badge variant="outline" className="mt-1">
            {selectedBlock.type}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-red-500"
          onClick={() => onDeleteBlock(selectedBlock.id)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Configurações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {properties.map((property) => (
            <div key={property.key} className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor={property.key} className="text-sm font-medium">
                  {property.label}
                </Label>
                {property.required && (
                  <Badge variant="destructive" className="text-xs">
                    Obrigatório
                  </Badge>
                )}
              </div>
              {renderPropertyInput(property)}
              {property.helpText && (
                <p className="text-xs text-gray-500">{property.helpText}</p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyPanel;

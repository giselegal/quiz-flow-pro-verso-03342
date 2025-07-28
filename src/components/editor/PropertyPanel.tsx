
import React from 'react';
import { EditorBlock, PropertySchema } from '@/types/editor';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trash2, Settings } from 'lucide-react';

interface PropertyPanelProps {
  selectedBlock: EditorBlock | null;
  onUpdateBlock: (id: string, updates: Partial<EditorBlock>) => void;
  onDeleteBlock: (id: string) => void;
}

// Define property schemas for different block types
const getPropertySchema = (blockType: string): PropertySchema[] => {
  const baseSchema: PropertySchema[] = [
    {
      key: 'title',
      label: 'Título',
      type: 'text',
      placeholder: 'Digite o título'
    },
    {
      key: 'subtitle',
      label: 'Subtítulo',
      type: 'text',
      placeholder: 'Digite o subtítulo'
    }
  ];

  switch (blockType) {
    case 'text':
    case 'paragraph':
      return [
        ...baseSchema,
        {
          key: 'text',
          label: 'Texto',
          type: 'textarea',
          placeholder: 'Digite o texto'
        }
      ];
    
    case 'image':
      return [
        ...baseSchema,
        {
          key: 'imageUrl',
          label: 'URL da Imagem',
          type: 'text',
          placeholder: 'https://exemplo.com/imagem.jpg'
        },
        {
          key: 'alt',
          label: 'Texto Alternativo',
          type: 'text',
          placeholder: 'Descrição da imagem'
        }
      ];
    
    case 'button':
    case 'cta':
      return [
        ...baseSchema,
        {
          key: 'buttonText',
          label: 'Texto do Botão',
          type: 'text',
          placeholder: 'Clique aqui'
        },
        {
          key: 'buttonUrl',
          label: 'URL do Botão',
          type: 'text',
          placeholder: 'https://exemplo.com'
        },
        {
          key: 'variant',
          label: 'Estilo do Botão',
          type: 'select',
          options: [
            { value: 'default', label: 'Padrão' },
            { value: 'primary', label: 'Primário' },
            { value: 'secondary', label: 'Secundário' },
            { value: 'outline', label: 'Contorno' }
          ]
        }
      ];
    
    case 'header':
    case 'headline':
      return [
        ...baseSchema,
        {
          key: 'level',
          label: 'Nível do Título',
          type: 'select',
          options: [
            { value: '1', label: 'H1' },
            { value: '2', label: 'H2' },
            { value: '3', label: 'H3' },
            { value: '4', label: 'H4' }
          ]
        }
      ];
    
    case 'spacer':
      return [
        {
          key: 'height',
          label: 'Altura',
          type: 'number',
          placeholder: '40'
        }
      ];
    
    default:
      return baseSchema;
  }
};

export const PropertyPanel: React.FC<PropertyPanelProps> = ({
  selectedBlock,
  onUpdateBlock,
  onDeleteBlock
}) => {
  if (!selectedBlock) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-4 text-center">
        <Settings className="w-12 h-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Propriedades</h3>
        <p className="text-sm text-gray-500">Selecione um bloco para editar suas propriedades</p>
      </div>
    );
  }

  const schema = getPropertySchema(selectedBlock.type);

  const handlePropertyChange = (key: string, value: any) => {
    onUpdateBlock(selectedBlock.id, {
      content: {
        ...selectedBlock.content,
        [key]: value
      }
    });
  };

  const renderPropertyField = (property: PropertySchema) => {
    const value = selectedBlock.content?.[property.key] || property.defaultValue || '';

    switch (property.type) {
      case 'text':
        return (
          <div key={property.key} className="space-y-2">
            <Label htmlFor={property.key}>{property.label}</Label>
            <Input
              id={property.key}
              value={value}
              onChange={(e) => handlePropertyChange(property.key, e.target.value)}
              placeholder={property.placeholder}
            />
          </div>
        );

      case 'textarea':
        return (
          <div key={property.key} className="space-y-2">
            <Label htmlFor={property.key}>{property.label}</Label>
            <Textarea
              id={property.key}
              value={value}
              onChange={(e) => handlePropertyChange(property.key, e.target.value)}
              placeholder={property.placeholder}
              rows={4}
            />
          </div>
        );

      case 'number':
        return (
          <div key={property.key} className="space-y-2">
            <Label htmlFor={property.key}>{property.label}</Label>
            <Input
              id={property.key}
              type="number"
              value={value}
              onChange={(e) => handlePropertyChange(property.key, parseFloat(e.target.value) || 0)}
              placeholder={property.placeholder}
            />
          </div>
        );

      case 'select':
        return (
          <div key={property.key} className="space-y-2">
            <Label htmlFor={property.key}>{property.label}</Label>
            <Select value={value} onValueChange={(val: string) => handlePropertyChange(property.key, val)}>
              <SelectTrigger>
                <SelectValue placeholder={`Selecione ${property.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {property.options?.map((option) => (
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
          <div key={property.key} className="flex items-center space-x-2">
            <Switch
              id={property.key}
              checked={value}
              onCheckedChange={(checked) => handlePropertyChange(property.key, checked)}
            />
            <Label htmlFor={property.key}>{property.label}</Label>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col bg-white border-l">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Propriedades</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDeleteBlock(selectedBlock.id)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {selectedBlock.type}
        </p>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-4">
          {schema.map((property) => renderPropertyField(property))}
        </div>
      </div>
    </div>
  );
};

export default PropertyPanel;

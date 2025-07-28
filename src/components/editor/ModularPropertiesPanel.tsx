import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Slider } from '../ui/slider';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { 
  Settings, 
  Type, 
  Image, 
  MousePointer, 
  Palette, 
  Layout,
  Spacing,
  Eye,
  Code,
  Save,
  RotateCcw
} from 'lucide-react';

// =====================================================================
// 🎛️ MODULAR PROPERTIES SYSTEM - Sistema de Propriedades Modulares
// =====================================================================

interface PropertyGroup {
  id: string;
  title: string;
  icon?: React.ReactNode;
  properties: PropertyDefinition[];
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

interface PropertyDefinition {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'boolean' | 'color' | 'slider' | 'range';
  value: any;
  placeholder?: string;
  description?: string;
  options?: { label: string; value: any }[];
  min?: number;
  max?: number;
  step?: number;
  validation?: (value: any) => string | null;
}

interface ModularPropertiesPanelProps {
  componentId: string;
  componentType: string;
  propertyGroups: PropertyGroup[];
  onPropertyChange: (groupId: string, propertyKey: string, value: any) => void;
  onSave?: () => void;
  onReset?: () => void;
  className?: string;
}

export const ModularPropertiesPanel: React.FC<ModularPropertiesPanelProps> = ({
  componentId,
  componentType,
  propertyGroups,
  onPropertyChange,
  onSave,
  onReset,
  className = ''
}) => {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(propertyGroups.filter(group => group.defaultExpanded !== false).map(group => group.id))
  );
  const [hasChanges, setHasChanges] = useState(false);

  const toggleGroup = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  const handlePropertyChange = (groupId: string, propertyKey: string, value: any) => {
    onPropertyChange(groupId, propertyKey, value);
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave?.();
    setHasChanges(false);
  };

  const handleReset = () => {
    onReset?.();
    setHasChanges(false);
  };

  return (
    <Card className={`modular-properties-panel ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <CardTitle className="text-sm font-medium">Propriedades</CardTitle>
          </div>
          <Badge variant="secondary" className="text-xs">
            {componentType}
          </Badge>
        </div>
        <div className="text-xs text-gray-500">
          ID: {componentId}
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        <ScrollArea className="h-96">
          <div className="space-y-4 pr-4">
            {propertyGroups.map((group) => (
              <PropertyGroupRenderer
                key={group.id}
                group={group}
                isExpanded={expandedGroups.has(group.id)}
                onToggle={() => toggleGroup(group.id)}
                onPropertyChange={(propertyKey, value) => 
                  handlePropertyChange(group.id, propertyKey, value)
                }
              />
            ))}
          </div>
        </ScrollArea>

        {/* Controles de ação */}
        {(onSave || onReset) && (
          <>
            <Separator />
            <div className="flex items-center justify-between pt-2">
              <div className="flex space-x-2">
                {onReset && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleReset}
                    className="flex items-center space-x-1"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>Reset</span>
                  </Button>
                )}
              </div>
              
              {onSave && (
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={!hasChanges}
                  className="flex items-center space-x-1"
                >
                  <Save className="h-3 w-3" />
                  <span>Salvar</span>
                </Button>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

// =====================================================================
// 🎨 PROPERTY GROUP RENDERER
// =====================================================================

interface PropertyGroupRendererProps {
  group: PropertyGroup;
  isExpanded: boolean;
  onToggle: () => void;
  onPropertyChange: (propertyKey: string, value: any) => void;
}

const PropertyGroupRenderer: React.FC<PropertyGroupRendererProps> = ({
  group,
  isExpanded,
  onToggle,
  onPropertyChange
}) => {
  return (
    <div className="border rounded-lg p-3 bg-gray-50">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left"
      >
        <div className="flex items-center space-x-2">
          {group.icon}
          <h3 className="font-medium text-sm">{group.title}</h3>
        </div>
        <Badge variant={isExpanded ? 'default' : 'secondary'} className="text-xs">
          {isExpanded ? '−' : '+'}
        </Badge>
      </button>

      {isExpanded && (
        <div className="mt-3 space-y-3">
          {group.properties.map((property) => (
            <PropertyRenderer
              key={property.key}
              property={property}
              onValueChange={(value) => onPropertyChange(property.key, value)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// =====================================================================
// 🎛️ PROPERTY RENDERER
// =====================================================================

interface PropertyRendererProps {
  property: PropertyDefinition;
  onValueChange: (value: any) => void;
}

const PropertyRenderer: React.FC<PropertyRendererProps> = ({
  property,
  onValueChange
}) => {
  const [error, setError] = useState<string | null>(null);

  const handleChange = (value: any) => {
    // Validação
    if (property.validation) {
      const validationError = property.validation(value);
      setError(validationError);
      if (validationError) return;
    } else {
      setError(null);
    }

    onValueChange(value);
  };

  const renderInput = () => {
    switch (property.type) {
      case 'text':
        return (
          <Input
            value={property.value || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={property.placeholder}
          />
        );

      case 'textarea':
        return (
          <Textarea
            value={property.value || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={property.placeholder}
            rows={3}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={property.value || ''}
            onChange={(e) => handleChange(Number(e.target.value))}
            placeholder={property.placeholder}
            min={property.min}
            max={property.max}
            step={property.step}
          />
        );

      case 'select':
        return (
          <Select
            value={property.value}
            onValueChange={handleChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione..." />
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

      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={property.value}
              onCheckedChange={handleChange}
            />
            <span className="text-sm">{property.value ? 'Ativo' : 'Inativo'}</span>
          </div>
        );

      case 'color':
        return (
          <div className="flex items-center space-x-2">
            <Input
              type="color"
              value={property.value || '#000000'}
              onChange={(e) => handleChange(e.target.value)}
              className="w-12 h-8 p-0 border rounded"
            />
            <Input
              type="text"
              value={property.value || ''}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="#000000"
              className="flex-1"
            />
          </div>
        );

      case 'slider':
        return (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-500">
              <span>{property.min || 0}</span>
              <span className="font-medium">{property.value}</span>
              <span>{property.max || 100}</span>
            </div>
            <Slider
              value={[property.value || 0]}
              onValueChange={(value) => handleChange(value[0])}
              min={property.min || 0}
              max={property.max || 100}
              step={property.step || 1}
            />
          </div>
        );

      case 'range':
        const [min, max] = property.value || [0, 100];
        return (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-500">
              <span>{property.min || 0}</span>
              <span className="font-medium">{min} - {max}</span>
              <span>{property.max || 100}</span>
            </div>
            <Slider
              value={[min, max]}
              onValueChange={(value) => handleChange(value)}
              min={property.min || 0}
              max={property.max || 100}
              step={property.step || 1}
            />
          </div>
        );

      default:
        return (
          <div className="text-sm text-gray-500 italic">
            Tipo de campo não suportado: {property.type}
          </div>
        );
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium">{property.label}</Label>
      {renderInput()}
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
      {property.description && (
        <p className="text-xs text-gray-500">{property.description}</p>
      )}
    </div>
  );
};

// =====================================================================
// 🎯 PROPERTY GROUP PRESETS
// =====================================================================

export const createTextPropertyGroups = (initialValues: any = {}): PropertyGroup[] => [
  {
    id: 'content',
    title: 'Conteúdo',
    icon: <Type className="h-4 w-4" />,
    defaultExpanded: true,
    properties: [
      {
        key: 'text',
        label: 'Texto',
        type: 'textarea',
        value: initialValues.text || 'Texto editável',
        placeholder: 'Digite o texto aqui...'
      }
    ]
  },
  {
    id: 'typography',
    title: 'Tipografia',
    icon: <Type className="h-4 w-4" />,
    properties: [
      {
        key: 'size',
        label: 'Tamanho',
        type: 'select',
        value: initialValues.size || 'base',
        options: [
          { label: 'Pequeno', value: 'sm' },
          { label: 'Normal', value: 'base' },
          { label: 'Grande', value: 'lg' },
          { label: 'Extra Grande', value: 'xl' },
          { label: 'XXL', value: '2xl' }
        ]
      },
      {
        key: 'weight',
        label: 'Peso',
        type: 'select',
        value: initialValues.weight || 'normal',
        options: [
          { label: 'Normal', value: 'normal' },
          { label: 'Médio', value: 'medium' },
          { label: 'Semi-negrito', value: 'semibold' },
          { label: 'Negrito', value: 'bold' }
        ]
      },
      {
        key: 'color',
        label: 'Cor',
        type: 'color',
        value: initialValues.color || '#000000'
      },
      {
        key: 'align',
        label: 'Alinhamento',
        type: 'select',
        value: initialValues.align || 'left',
        options: [
          { label: 'Esquerda', value: 'left' },
          { label: 'Centro', value: 'center' },
          { label: 'Direita', value: 'right' }
        ]
      }
    ]
  }
];

export const createImagePropertyGroups = (initialValues: any = {}): PropertyGroup[] => [
  {
    id: 'source',
    title: 'Fonte',
    icon: <Image className="h-4 w-4" />,
    defaultExpanded: true,
    properties: [
      {
        key: 'src',
        label: 'URL da Imagem',
        type: 'text',
        value: initialValues.src || '',
        placeholder: 'https://...'
      },
      {
        key: 'alt',
        label: 'Texto Alternativo',
        type: 'text',
        value: initialValues.alt || '',
        placeholder: 'Descrição da imagem'
      }
    ]
  },
  {
    id: 'dimensions',
    title: 'Dimensões',
    icon: <Layout className="h-4 w-4" />,
    properties: [
      {
        key: 'width',
        label: 'Largura (px)',
        type: 'slider',
        value: initialValues.width || 300,
        min: 50,
        max: 800,
        step: 10
      },
      {
        key: 'height',
        label: 'Altura (px)',
        type: 'slider',
        value: initialValues.height || 200,
        min: 50,
        max: 600,
        step: 10
      },
      {
        key: 'objectFit',
        label: 'Ajuste',
        type: 'select',
        value: initialValues.objectFit || 'cover',
        options: [
          { label: 'Cobrir', value: 'cover' },
          { label: 'Conter', value: 'contain' },
          { label: 'Preencher', value: 'fill' },
          { label: 'Nenhum', value: 'none' }
        ]
      },
      {
        key: 'rounded',
        label: 'Bordas Arredondadas',
        type: 'boolean',
        value: initialValues.rounded || false
      }
    ]
  }
];

export const createButtonPropertyGroups = (initialValues: any = {}): PropertyGroup[] => [
  {
    id: 'content',
    title: 'Conteúdo',
    icon: <MousePointer className="h-4 w-4" />,
    defaultExpanded: true,
    properties: [
      {
        key: 'text',
        label: 'Texto',
        type: 'text',
        value: initialValues.text || 'Botão',
        placeholder: 'Digite o texto do botão'
      }
    ]
  },
  {
    id: 'style',
    title: 'Estilo',
    icon: <Palette className="h-4 w-4" />,
    properties: [
      {
        key: 'variant',
        label: 'Variante',
        type: 'select',
        value: initialValues.variant || 'primary',
        options: [
          { label: 'Primário', value: 'primary' },
          { label: 'Secundário', value: 'secondary' },
          { label: 'Contorno', value: 'outline' },
          { label: 'Fantasma', value: 'ghost' }
        ]
      },
      {
        key: 'size',
        label: 'Tamanho',
        type: 'select',
        value: initialValues.size || 'md',
        options: [
          { label: 'Pequeno', value: 'sm' },
          { label: 'Médio', value: 'md' },
          { label: 'Grande', value: 'lg' }
        ]
      },
      {
        key: 'fullWidth',
        label: 'Largura Total',
        type: 'boolean',
        value: initialValues.fullWidth || false
      },
      {
        key: 'disabled',
        label: 'Desabilitado',
        type: 'boolean',
        value: initialValues.disabled || false
      }
    ]
  }
];

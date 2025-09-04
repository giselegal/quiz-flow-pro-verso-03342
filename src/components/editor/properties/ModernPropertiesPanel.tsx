/**
 * 🎛️ MODERN PROPERTIES PANEL
 * 
 * Sistema de painel de propriedades moderno baseado em shadcn/ui + Radix UI
 * Substitui o LEVA com interface mais profissional e organizada por categorias
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ColorPicker } from '@/components/ui/ColorPicker';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getPropertiesForComponentType } from './core/PropertyDiscovery';
import { useEditor } from '@/hooks/useEditor';
import { PropertyType } from '@/hooks/useUnifiedProperties';
import type { Block } from '@/types/editor';
import {
  LayoutIcon,
  PaletteIcon,
  SettingsIcon,
  CodeIcon,
  CheckCircleIcon,
  AlignLeftIcon,
  PlusIcon,
  TrashIcon,
  GripVerticalIcon
} from 'lucide-react';

interface ModernPropertiesPanelProps {
  selectedBlock?: Block | null;
  onUpdate?: (updates: Record<string, any>) => void;
  onClose?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
}

interface PropertyControlProps {
  property: any;
  value: any;
  onChange: (value: any) => void;
}

/**
 * Componente para renderizar controles individuais baseado no tipo
 */
const PropertyControl: React.FC<PropertyControlProps> = ({ property, value, onChange }) => {
  switch (property.type) {
    case 'text':
    case 'textarea':
      return (
        <div className="space-y-2">
          <Label htmlFor={property.key} className="text-sm font-medium">
            {property.label}
          </Label>
          <Input
            id={property.key}
            placeholder={property.placeholder || 'Digite aqui...'}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full"
          />
          {property.description && (
            <p className="text-xs text-muted-foreground">{property.description}</p>
          )}
        </div>
      );

    case 'number':
    case 'range':
      return (
        <div className="space-y-2">
          <Label htmlFor={property.key} className="text-sm font-medium">
            {property.label}
          </Label>
          <div className="space-y-3">
            <Slider
              value={[value || property.constraints?.min || 0]}
              onValueChange={(values) => onChange(values[0])}
              min={property.constraints?.min || 0}
              max={property.constraints?.max || 100}
              step={property.constraints?.step || 1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{property.constraints?.min || 0}</span>
              <span className="font-medium">{value || property.constraints?.min || 0}</span>
              <span>{property.constraints?.max || 100}</span>
            </div>
          </div>
          {property.description && (
            <p className="text-xs text-muted-foreground">{property.description}</p>
          )}
        </div>
      );

    case 'switch':
    case 'boolean':
      return (
        <div className="flex items-center space-x-2">
          <Switch
            id={property.key}
            checked={value || false}
            onCheckedChange={onChange}
          />
          <div className="space-y-1">
            <Label htmlFor={property.key} className="text-sm font-medium">
              {property.label}
            </Label>
            {property.description && (
              <p className="text-xs text-muted-foreground">{property.description}</p>
            )}
          </div>
        </div>
      );

    case 'select':
      return (
        <div className="space-y-2">
          <Label htmlFor={property.key} className="text-sm font-medium">
            {property.label}
          </Label>
          <Select value={value || ''} onValueChange={onChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={property.placeholder || 'Selecione uma opção'} />
            </SelectTrigger>
            <SelectContent>
              {property.options?.map((option: any) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {property.description && (
            <p className="text-xs text-muted-foreground">{property.description}</p>
          )}
        </div>
      );

    case 'color':
      return (
        <div className="space-y-2">
          <Label htmlFor={property.key} className="text-sm font-medium">
            {property.label}
          </Label>
          <ColorPicker
            value={value || '#000000'}
            onChange={onChange}
            className="w-full"
          />
          {property.description && (
            <p className="text-xs text-muted-foreground">{property.description}</p>
          )}
        </div>
      );

    case 'array':
    case 'options-list':
    case PropertyType.ARRAY:
      // Debug: verificar dados das opções
      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 DEBUG - Array/Options-list control:', {
          property: property.key,
          propertyType: property.type,
          value: value,
          valueType: typeof value,
          isArray: Array.isArray(value),
          length: Array.isArray(value) ? value.length : 'N/A'
        });
      }

      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">
              {property.label}
            </Label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const currentArray = Array.isArray(value) ? value : [];
                const newOption = {
                  id: `option-${Date.now()}`,
                  text: `Nova opção ${currentArray.length + 1}`,
                  imageUrl: '',
                  value: `option-${currentArray.length + 1}`,
                  category: '',
                  points: currentArray.length + 1
                };
                const newArray = [...currentArray, newOption];
                console.log('🔍 Adding new option:', newOption, 'New array:', newArray);
                onChange(newArray);
              }}
              className="h-7 px-2"
            >
              <PlusIcon className="h-3 w-3 mr-1" />
              Adicionar
            </Button>
          </div>

          <div className="space-y-2 max-h-40 overflow-y-auto">
            {Array.isArray(value) && value.length > 0 ? (
              value.map((option: any, index: number) => (
                <div key={option.id || index} className="flex items-center gap-2 p-2 border rounded-md bg-muted/50">
                  <GripVerticalIcon className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1 space-y-1">
                    <Input
                      placeholder="Texto da opção"
                      value={option.text || ''}
                      onChange={(e) => {
                        const newArray = [...(Array.isArray(value) ? value : [])];
                        newArray[index] = { ...option, text: e.target.value };
                        console.log('🔍 Updating option text:', newArray[index]);
                        onChange(newArray);
                      }}
                      className="h-7 text-xs"
                    />
                    <div className="flex gap-1">
                      <Input
                        placeholder="Score"
                        type="number"
                        value={option.points || option.score || ''}
                        onChange={(e) => {
                          const newArray = [...(Array.isArray(value) ? value : [])];
                          newArray[index] = { ...option, points: parseInt(e.target.value) || 0 };
                          onChange(newArray);
                        }}
                        className="h-6 text-xs w-16"
                      />
                      <Input
                        placeholder="Categoria"
                        value={option.category || ''}
                        onChange={(e) => {
                          const newArray = [...(Array.isArray(value) ? value : [])];
                          newArray[index] = { ...option, category: e.target.value };
                          onChange(newArray);
                        }}
                        className="h-6 text-xs flex-1"
                      />
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newArray = Array.isArray(value) ? value.filter((_, i) => i !== index) : [];
                      console.log('🔍 Removing option at index:', index, 'New array:', newArray);
                      onChange(newArray);
                    }}
                    className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                  >
                    <TrashIcon className="h-3 w-3" />
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-sm text-muted-foreground">
                Nenhuma opção configurada. Clique em "Adicionar" para começar.
              </div>
            )}
          </div>

          {property.description && (
            <p className="text-xs text-muted-foreground">{property.description}</p>
          )}
        </div>
      );

    default:
      return (
        <div className="space-y-2">
          <Label htmlFor={property.key} className="text-sm font-medium">
            {property.label}
          </Label>
          <Input
            id={property.key}
            placeholder={property.placeholder || 'Digite aqui...'}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full"
          />
        </div>
      );
  }
};

/**
 * Obtém o valor atual de uma propriedade do bloco
 */
function getCurrentValue(propKey: string, currentBlock?: Block): any {
  if (!currentBlock) return undefined;

  // Debug para investigar o problema das opções
  if (propKey === 'options' && process.env.NODE_ENV === 'development') {
    console.log('🔍 DEBUG - getCurrentValue for options:', {
      propKey,
      currentBlock: {
        id: currentBlock.id,
        type: currentBlock.type,
        hasContent: !!currentBlock.content,
        hasOptions: !!(currentBlock.content?.options),
        optionsLength: Array.isArray(currentBlock.content?.options) ? currentBlock.content.options.length : 'N/A',
        hasProperties: !!currentBlock.properties,
        optionsInProperties: currentBlock.properties?.options
      }
    });
  }

  // Verificar em properties primeiro
  if (currentBlock.properties && currentBlock.properties[propKey] !== undefined) {
    return currentBlock.properties[propKey];
  }

  // Verificar em content com chave composta (ex: content.text)
  if (propKey.startsWith('content.')) {
    const contentKey = propKey.substring(8); // Remove 'content.'
    if (currentBlock.content && currentBlock.content[contentKey] !== undefined) {
      return currentBlock.content[contentKey];
    }
  }

  // Verificar diretamente em content
  if (currentBlock.content && currentBlock.content[propKey] !== undefined) {
    return currentBlock.content[propKey];
  }

  return undefined;
}

/**
 * Organiza propriedades por categoria
 */
function organizePropertiesByCategory(properties: any[]) {
  // Debug: verificar propriedades recebidas
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 DEBUG - organizePropertiesByCategory received:', {
      total: properties.length,
      propertyKeys: properties.map(p => p.key),
      arrayProperties: properties.filter(p => p.type === 'array' || p.type === PropertyType.ARRAY).map(p => p.key),
      optionsProperties: properties.filter(p => p.key.includes('option')).map(p => p.key)
    });
  }

  const categories = {
    content: { label: 'Conteúdo', icon: AlignLeftIcon, properties: [] as any[] },
    layout: { label: 'Layout', icon: LayoutIcon, properties: [] as any[] },
    style: { label: 'Estilização', icon: PaletteIcon, properties: [] as any[] },
    behavior: { label: 'Comportamento', icon: SettingsIcon, properties: [] as any[] },
    validation: { label: 'Validações', icon: CheckCircleIcon, properties: [] as any[] },
    advanced: { label: 'Avançado', icon: CodeIcon, properties: [] as any[] }
  };

  properties.forEach(prop => {
    const category = prop.category || 'advanced';
    if (categories[category as keyof typeof categories]) {
      categories[category as keyof typeof categories].properties.push(prop);
    }
  });

  return Object.entries(categories).filter(([_, cat]) => cat.properties.length > 0);
}

export const ModernPropertiesPanel: React.FC<ModernPropertiesPanelProps> = ({
  selectedBlock,
  onUpdate,
  onClose,
  onDelete,
  onDuplicate
}) => {
  const { updateBlock, deleteBlock } = useEditor();

  // Descobrir propriedades usando sistema existente
  const discoveredProperties = React.useMemo(() => {
    if (!selectedBlock) return [];

    console.log('🔍 ModernPropertiesPanel: Discovering properties for block:', selectedBlock.type);
    console.log('📦 Current block data:', selectedBlock);

    const props = getPropertiesForComponentType(selectedBlock.type, selectedBlock);
    console.log('📊 ModernPropertiesPanel: Found properties:', props.length);

    // Debug específico para options-grid
    if (selectedBlock.type === 'options-grid') {
      console.log('🎯 OPTIONS-GRID DEBUG:');
      console.log('   - Total properties found:', props.length);
      const optionsProperty = props.find(p => p.key === 'options');
      if (optionsProperty) {
        console.log('   ✅ OPTIONS property found:', optionsProperty);
        console.log('   - Type:', optionsProperty.type);
        console.log('   - Default value:', optionsProperty.defaultValue);
        console.log('   - Current value from block:', getCurrentValue('options', selectedBlock));
      } else {
        console.log('   ❌ OPTIONS property NOT found!');
        console.log('   - Available properties:', props.map(p => p.key));
      }
    }

    return props;
  }, [selectedBlock]);

  // Organizar propriedades por categoria
  const categorizedProperties = React.useMemo(() => {
    return organizePropertiesByCategory(discoveredProperties);
  }, [discoveredProperties]);

  // Callback para atualizar propriedade
  const handlePropertyUpdate = React.useCallback((propKey: string, value: any) => {
    if (!selectedBlock) return;

    console.log('📤 ModernPropertiesPanel updating property:', propKey, 'with value:', value);

    // Separar updates entre properties e content
    const propertyUpdates: any = {};
    const contentUpdates: any = {};

    // Caso especial: 'options' deve ser salvo em content.options
    if (propKey === 'options') {
      contentUpdates.options = value;
      console.log('🎯 Special case: Saving options to content.options');
    } else if (propKey.startsWith('content.')) {
      const contentKey = propKey.substring(8);
      contentUpdates[contentKey] = value;
    } else {
      propertyUpdates[propKey] = value;
    }

    // Atualizar bloco via EditorContext ou callback
    const finalUpdates: any = {};

    if (Object.keys(propertyUpdates).length > 0) {
      finalUpdates.properties = {
        ...selectedBlock.properties,
        ...propertyUpdates
      };
    }

    if (Object.keys(contentUpdates).length > 0) {
      finalUpdates.content = {
        ...selectedBlock.content,
        ...contentUpdates
      };
    }

    console.log('🔄 Final updates to EditorContext:', finalUpdates);

    // Use onUpdate callback if provided, otherwise use EditorContext
    if (onUpdate) {
      onUpdate(finalUpdates);
    } else {
      updateBlock(selectedBlock.id, finalUpdates);
    }
  }, [selectedBlock, updateBlock, onUpdate]);

  if (!selectedBlock) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <SettingsIcon className="h-12 w-12 text-muted-foreground mx-auto" />
          <div>
            <h3 className="font-medium text-lg">Nenhum Componente Selecionado</h3>
            <p className="text-sm text-muted-foreground">
              Selecione um componente no canvas para editar suas propriedades
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (categorizedProperties.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <SettingsIcon className="h-12 w-12 text-muted-foreground mx-auto" />
          <div>
            <h3 className="font-medium text-lg">Sem Propriedades</h3>
            <p className="text-sm text-muted-foreground">
              Este componente não possui propriedades editáveis
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Propriedades</h2>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {selectedBlock.type}
              </Badge>
              {onClose && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-6 w-6 p-0"
                >
                  ✕
                </Button>
              )}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Configure as propriedades do componente selecionado
          </p>
          <Separator />
        </div>

        {/* Tabs por categoria */}
        <Tabs defaultValue={categorizedProperties[0]?.[0]} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3">
            {categorizedProperties.slice(0, 6).map(([categoryKey, category]) => {
              const IconComponent = category.icon;
              return (
                <TabsTrigger
                  key={categoryKey}
                  value={categoryKey}
                  className="text-xs flex items-center gap-1"
                >
                  <IconComponent className="h-3 w-3" />
                  {category.label}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {categorizedProperties.map(([categoryKey, category]) => (
            <TabsContent key={categoryKey} value={categoryKey} className="space-y-4 mt-4">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <category.icon className="h-4 w-4" />
                    <CardDescription className="text-sm font-medium">
                      {category.label}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {category.properties.map((property: any) => {
                    const currentValue = getCurrentValue(property.key, selectedBlock);
                    return (
                      <PropertyControl
                        key={property.key}
                        property={property}
                        value={currentValue ?? property.defaultValue}
                        onChange={(value) => handlePropertyUpdate(property.key, value)}
                      />
                    );
                  })}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-sm font-medium">
              Ações
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => onDuplicate?.()}
            >
              Duplicar Componente
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="w-full"
              onClick={() => {
                if (selectedBlock) {
                  onDelete?.() || deleteBlock(selectedBlock.id);
                }
              }}
            >
              Remover Componente
            </Button>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
};

export default ModernPropertiesPanel;

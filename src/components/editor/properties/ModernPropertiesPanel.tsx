/**
 * 🎛️ MODERN PROPERTIES PANEL
 * 
 * ⚠️ DEPRECATED: Este painel é LEGADO. Use SinglePropertiesPanel ao invés.
 * @deprecated Migre para SinglePropertiesPanel ou PropertiesColumn
 * @see SinglePropertiesPanel - Painel canônico de propriedades
 * @see archive/legacy/README.md - Instruções de migração
 * 
 * Sistema de painel de propriedades moderno baseado em shadcn/ui + Radix UI
 * Substitui o LEVA com interface mais profissional e organizada por categorias
 */

import React from 'react';
import { appLogger } from '@/lib/utils/logger';
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
// ✅ CORREÇÃO: Usar adaptador universal para resolver problemas de contexto
import { useEditorAdapter } from '@/hooks/useEditorAdapter';
import { PropertyType } from '@/hooks/useUnifiedProperties';
import type { Block } from '@/types/editor';
import OptionsGridQuickPanel from './quick/OptionsGridQuickPanel';
import {
  LayoutIcon,
  PaletteIcon,
  SettingsIcon,
  CodeIcon,
  CheckCircleIcon,
  AlignLeftIcon,
  PlusIcon,
  TrashIcon,
  GripVerticalIcon,
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
        appLogger.debug('🔍 DEBUG - Array/Options-list control:', {
          property: property.key,
          propertyType: property.type,
          value,
          valueType: typeof value,
          isArray: Array.isArray(value),
          length: Array.isArray(value) ? value.length : 'N/A',
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
                  points: currentArray.length + 1,
                };
                const newArray = [...currentArray, newOption];
                appLogger.debug('🔍 Adding new option:', newOption, 'New array:', newArray);
                onChange(newArray);
              }}
              className="h-7 px-2"
            >
              <PlusIcon className="h-3 w-3 mr-1" />
              Adicionar
            </Button>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
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
                        appLogger.debug('🔍 Updating option text:', newArray[index]);
                        onChange(newArray);
                      }}
                      className="h-7 text-xs"
                    />
                    <div className="flex gap-1 items-center">
                      <Input
                        placeholder="URL da imagem (imageUrl)"
                        value={option.imageUrl || ''}
                        onChange={(e) => {
                          const newArray = [...(Array.isArray(value) ? value : [])];
                          newArray[index] = { ...option, imageUrl: e.target.value };
                          onChange(newArray);
                        }}
                        className="h-6 text-xs flex-1"
                      />
                      {option.imageUrl ? (
                        <img
                          src={option.imageUrl}
                          alt={option.text || `opção ${index + 1}`}
                          className="h-8 w-8 rounded object-cover border"
                          onError={(ev) => {
                            (ev.currentTarget as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : null}
                    </div>
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
                      appLogger.debug('🔍 Removing option at index:', index, 'New array:', newArray);
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
    appLogger.debug('🔍 DEBUG - getCurrentValue for options:', {
      propKey,
      currentBlock: {
        id: currentBlock.id,
        type: currentBlock.type,
        hasContent: !!currentBlock.content,
        hasOptions: !!(currentBlock.content?.options),
        optionsLength: Array.isArray(currentBlock.content?.options) ? currentBlock.content.options.length : 'N/A',
        hasProperties: !!currentBlock.properties,
        optionsInProperties: currentBlock.properties?.options,
      },
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
    appLogger.debug('🔍 DEBUG - organizePropertiesByCategory received:', {
      total: properties.length,
      propertyKeys: properties.map(p => p.key),
      arrayProperties: properties.filter(p => p.type === 'array' || p.type === PropertyType.ARRAY).map(p => p.key),
      optionsProperties: properties.filter(p => p.key.includes('option')).map(p => p.key),
    });
  }

  const categories = {
    content: { label: 'Conteúdo', icon: AlignLeftIcon, properties: [] as any[] },
    layout: { label: 'Layout', icon: LayoutIcon, properties: [] as any[] },
    style: { label: 'Estilização', icon: PaletteIcon, properties: [] as any[] },
    behavior: { label: 'Comportamento', icon: SettingsIcon, properties: [] as any[] },
    validation: { label: 'Validações', icon: CheckCircleIcon, properties: [] as any[] },
    advanced: { label: 'Avançado', icon: CodeIcon, properties: [] as any[] },
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
  onDuplicate,
}) => {
  // ✅ CORREÇÃO: Usar adaptador universal que resolve problemas de contexto
  const editor = useEditorAdapter();
  const { actions, currentStep, selectedBlock: contextSelectedBlock } = editor;

  // Usar selectedBlock do contexto como fallback se não fornecido via props
  const effectiveSelectedBlock = selectedBlock || contextSelectedBlock;

  // Construir stepKey legado compatível (ex: step-01)
  const currentStepKey = React.useMemo(() => `step-${String(currentStep).padStart(2, '0')}`, [currentStep]);

  // Descobrir propriedades usando sistema existente
  const discoveredProperties = React.useMemo(() => {
    if (!effectiveSelectedBlock) return [];

    appLogger.debug('🔍 ModernPropertiesPanel: Discovering properties for block:', effectiveSelectedBlock.type);
    appLogger.debug('📦 Current block data:', effectiveSelectedBlock);

    const props = getPropertiesForComponentType(effectiveSelectedBlock.type, effectiveSelectedBlock);
    appLogger.debug('📊 ModernPropertiesPanel: Found properties:', props.length);

    // Debug específico para options-grid
    if (effectiveSelectedBlock.type === 'options-grid') {
      appLogger.debug('🎯 OPTIONS-GRID DEBUG:');
      appLogger.debug('   - Total properties found:', props.length);
      const optionsProperty = props.find(p => p.key === 'options');
      if (optionsProperty) {
        appLogger.debug('   ✅ OPTIONS property found:', optionsProperty);
        appLogger.debug('   - Type:', optionsProperty.type);
        appLogger.debug('   - Default value:', optionsProperty.defaultValue);
        appLogger.debug('   - Current value from block:', getCurrentValue('options', effectiveSelectedBlock));
      } else {
        appLogger.debug('   ❌ OPTIONS property NOT found!');
        appLogger.debug('   - Available properties:', props.map(p => p.key));
      }
    }

    return props;
  }, [effectiveSelectedBlock]);

  // Organizar propriedades por categoria
  const categorizedProperties = React.useMemo(() => {
    return organizePropertiesByCategory(discoveredProperties);
  }, [discoveredProperties]);

  // Callback para atualizar propriedade
  const handlePropertyUpdate = React.useCallback((propKey: string, value: any) => {
    if (!effectiveSelectedBlock) return;

    appLogger.debug('📤 ModernPropertiesPanel updating property:', propKey, 'with value:', value);

    // Separar updates entre properties e content
    const propertyUpdates: any = {};
    const contentUpdates: any = {};

    // Sempre salvar propriedades de UI em properties
    if (propKey === 'options') {
      propertyUpdates.options = value;
      appLogger.debug('🎯 Saving options to properties.options');
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
        ...effectiveSelectedBlock.properties,
        ...propertyUpdates,
      };
    }

    if (Object.keys(contentUpdates).length > 0) {
      finalUpdates.content = {
        ...effectiveSelectedBlock.content,
        ...contentUpdates,
      };
    }

    appLogger.debug('🔄 Final updates to EditorContext:', finalUpdates);

    // Usar callback externo se fornecido, caso contrário ações do editor
    if (onUpdate) {
      onUpdate(finalUpdates);
    } else {
      // updateBlock takes (id, content) - merge stepKey context into update if needed
      actions.updateBlock(effectiveSelectedBlock.id, finalUpdates);
    }
  }, [effectiveSelectedBlock, actions, onUpdate]);

  // Atualização em lote (usado pelo Quick Panel)
  const handleBatchUpdate = React.useCallback((updates: Record<string, any>) => {
    if (!effectiveSelectedBlock) return;

    const propertyUpdates: Record<string, any> = {};
    const contentUpdates: Record<string, any> = {};

    Object.entries(updates).forEach(([key, val]) => {
      if (key === 'options') {
        propertyUpdates.options = val;
      } else if (key.startsWith('content.')) {
        const contentKey = key.substring(8);
        contentUpdates[contentKey] = val;
      } else {
        propertyUpdates[key] = val;
      }
    });

    const finalUpdates: any = {};
    if (Object.keys(propertyUpdates).length > 0) {
      finalUpdates.properties = {
        ...effectiveSelectedBlock.properties,
        ...propertyUpdates,
      };
    }
    if (Object.keys(contentUpdates).length > 0) {
      finalUpdates.content = {
        ...effectiveSelectedBlock.content,
        ...contentUpdates,
      };
    }

    if (onUpdate) {
      onUpdate(finalUpdates);
    } else {
      // updateBlock takes (id, content)
      actions.updateBlock(effectiveSelectedBlock.id, finalUpdates);
    }
  }, [effectiveSelectedBlock, onUpdate, actions]);

  if (!effectiveSelectedBlock) {
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
                {effectiveSelectedBlock.type}
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

        {/* Quick Panel para Options Grid (Fase 1) */}
        {effectiveSelectedBlock.type === 'options-grid' && (
          <div className="sticky top-0 z-10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border rounded-md p-3 pointer-events-auto">
            <OptionsGridQuickPanel block={effectiveSelectedBlock} onBatchUpdate={handleBatchUpdate} />
          </div>
        )}

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
                    const currentValue = getCurrentValue(property.key, effectiveSelectedBlock);
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
              onClick={() => {
                if (onDuplicate) {
                  onDuplicate();
                } else {
                  // Duplicar bloco criando uma cópia
                  const blockToDuplicate = effectiveSelectedBlock;
                  // addBlock aceita apenas type, depois atualizamos
                  actions.addBlock(blockToDuplicate.type).then((newId) => {
                    if (newId && actions.updateBlock) {
                      actions.updateBlock(newId, {
                        properties: blockToDuplicate.properties,
                        content: blockToDuplicate.content,
                        order: (blockToDuplicate.order || 0) + 1,
                      });
                    }
                  });
                }
              }}
            >
              Duplicar Componente
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="w-full"
              onClick={() => {
                if (effectiveSelectedBlock) {
                  if (onDelete) {
                    onDelete();
                  } else {
                    // removeBlock takes only the id
                    actions.removeBlock(effectiveSelectedBlock.id);
                  }
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

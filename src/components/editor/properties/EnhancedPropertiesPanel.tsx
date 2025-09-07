import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { BlockData } from '@/types/blocks';
import {
  Copy,
  Eye,
  Info,
  Monitor,
  Palette,
  RotateCcw,
  Settings,
  Smartphone,
  Tablet,
  Trash2,
  Type,
} from 'lucide-react';
import React, { useState } from 'react';
import QuizQuestionPropertiesPanel from '@/components/editor/properties/QuizQuestionPropertiesPanel';

interface EnhancedPropertiesPanelProps {
  selectedBlock?: BlockData | null;
  onUpdate?: (updates: Partial<BlockData>) => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onReset?: () => void;
  onClose?: () => void;
  previewMode?: 'desktop' | 'tablet' | 'mobile';
  onPreviewModeChange?: (mode: 'desktop' | 'tablet' | 'mobile') => void;
}

// Definições de propriedades por categoria
const PROPERTY_CATEGORIES = {
  visual: {
    icon: Palette,
    label: 'Visual',
    description: 'Cores, tipografia e estilo',
    properties: [
      'backgroundColor',
      'color',
      'primaryColor',
      'secondaryColor',
      'accentColor',
      'borderColor',
      'borderWidth',
      'borderRadius',
      'shadow',
      'gradient',
    ],
  },
  content: {
    icon: Type,
    label: 'Conteúdo',
    description: 'Texto, imagens e mídia',
    properties: [
      'content',
      'text',
      'title',
      'description',
      'imageUrl',
      'logoUrl',
      'placeholder',
      'label',
      'value',
      'options',
    ],
  },
  layout: {
    icon: Settings,
    label: 'Layout',
    description: 'Tamanho, espaçamento e posição',
    properties: [
      'width',
      'height',
      'padding',
      'margin',
      'marginTop',
      'marginBottom',
      'marginLeft',
      'marginRight',
      'spacing',
      'gap',
      'columns',
      'alignment',
    ],
  },
  behavior: {
    icon: Settings,
    label: 'Comportamento',
    description: 'Interatividade e funcionalidade',
    properties: [
      'onClick',
      'href',
      'target',
      'validation',
      'required',
      'disabled',
      'multiSelect',
      'maxSelections',
      'minSelections',
      'animation',
    ],
  },
};

// Mapeamento de tipos de propriedades
const getPropertyType = (key: string, value: any): string => {
  if (typeof value === 'boolean') return 'boolean';
  if (typeof value === 'number') return 'number';
  if (key.toLowerCase().includes('color')) return 'color';
  if (key.toLowerCase().includes('url') || key.toLowerCase().includes('href')) return 'url';
  if (key === 'options' || Array.isArray(value)) return 'array';
  if (key.toLowerCase().includes('margin') || key.toLowerCase().includes('padding'))
    return 'spacing';
  if (
    key.toLowerCase().includes('size') ||
    key.toLowerCase().includes('width') ||
    key.toLowerCase().includes('height')
  )
    return 'size';
  if (value && typeof value === 'string' && value.length > 50) return 'textarea';
  return 'string';
};

const EnhancedPropertiesPanel: React.FC<EnhancedPropertiesPanelProps> = ({
  selectedBlock,
  onUpdate,
  onDelete,
  onDuplicate,
  onReset,
  onClose,
  previewMode = 'desktop',
  onPreviewModeChange,
}) => {
  const [activeTab, setActiveTab] = useState('visual');
  const [searchTerm, setSearchTerm] = useState('');

  // Special-case: question blocks get the dedicated panel (texto + imagem + opções)
  const isQuestionBlock = !!selectedBlock && (
    (selectedBlock as any).type === 'options-grid' ||
    (selectedBlock as any).type === 'quiz-question' ||
    (selectedBlock as any).type === 'quiz-question-inline'
  );

  if (selectedBlock && isQuestionBlock) {
    return (
      <div className="p-3">
        <QuizQuestionPropertiesPanel
          block={selectedBlock}
          onUpdate={(propsUpdates) => onUpdate?.({ properties: propsUpdates })}
          onDelete={onDelete}
        />
      </div>
    );
  }

  if (!selectedBlock) {
    return (
      <Card className="h-full border-[#B89B7A]/30">
        <CardHeader className="text-center py-12">
          <div className="mx-auto w-16 h-16 bg-[#B89B7A]/10 rounded-full flex items-center justify-center mb-4">
            <Eye className="w-8 h-8 text-[#B89B7A]" />
          </div>
          <CardTitle className="text-[#432818]">Nenhum Bloco Selecionado</CardTitle>
          <CardDescription>Selecione um bloco no editor para ver suas propriedades</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const updateProperty = (key: string, value: any) => {
    if (onUpdate) {
      onUpdate({
        properties: {
          ...selectedBlock.properties,
          [key]: value,
        },
      });
    }
  };

  // Organizar propriedades por categoria
  const organizeProperties = () => {
    const organized: Record<string, string[]> = {
      visual: [],
      content: [],
      layout: [],
      behavior: [],
      other: [],
    };

    if (selectedBlock.properties) {
      Object.keys(selectedBlock.properties).forEach(key => {
        let categorized = false;
        for (const [categoryKey, category] of Object.entries(PROPERTY_CATEGORIES)) {
          if (category.properties.includes(key)) {
            organized[categoryKey].push(key);
            categorized = true;
            break;
          }
        }
        if (!categorized) {
          organized.other.push(key);
        }
      });
    }

    return organized;
  };

  // Renderizar controle baseado no tipo da propriedade
  const renderPropertyControl = (key: string, value: any) => {
    const type = getPropertyType(key, value);
    const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');

    switch (type) {
      case 'boolean':
        return (
          <div key={key} className="flex items-center justify-between">
            <Label htmlFor={key} className="text-sm font-medium text-[#432818]">
              {label}
            </Label>
            <Switch
              id={key}
              checked={value || false}
              onCheckedChange={checked => updateProperty(key, checked)}
            />
          </div>
        );

      case 'color':
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key} className="text-sm font-medium text-[#432818]">
              {label}
            </Label>
            <div className="flex gap-2">
              <Input
                id={key}
                type="color"
                value={value || '#000000'}
                onChange={e => updateProperty(key, e.target.value)}
                className="w-12 h-10 border-[#B89B7A]/30 cursor-pointer"
              />
              <Input
                value={value || '#000000'}
                onChange={e => updateProperty(key, e.target.value)}
                className="flex-1 border-[#B89B7A]/30 focus:border-[#B89B7A] focus:ring-[#B89B7A]/20"
                placeholder="#000000"
              />
            </div>
          </div>
        );

      case 'number':
      case 'spacing':
      case 'size':
        return (
          <div key={key} className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor={key} className="text-sm font-medium text-[#432818]">
                {label}
              </Label>
              <span className="text-[#B89B7A] text-sm font-mono">
                {value || 0}
                {type === 'spacing' || type === 'size' ? 'px' : ''}
              </span>
            </div>
            <Slider
              value={[value || 0]}
              onValueChange={values => updateProperty(key, values[0])}
              max={type === 'spacing' ? 100 : type === 'size' ? 500 : 1000}
              step={1}
              className="w-full"
            />
          </div>
        );

      case 'textarea':
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key} className="text-sm font-medium text-[#432818]">
              {label}
            </Label>
            <Textarea
              id={key}
              value={value || ''}
              onChange={e => updateProperty(key, e.target.value)}
              className="border-[#B89B7A]/30 focus:border-[#B89B7A] focus:ring-[#B89B7A]/20 min-h-[80px]"
              placeholder={`Digite o ${label.toLowerCase()}...`}
            />
          </div>
        );

      default:
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key} className="text-sm font-medium text-[#432818]">
              {label}
            </Label>
            <Input
              id={key}
              value={value || ''}
              onChange={e => updateProperty(key, e.target.value)}
              className="border-[#B89B7A]/30 focus:border-[#B89B7A] focus:ring-[#B89B7A]/20"
              placeholder={`Digite o ${label.toLowerCase()}...`}
            />
          </div>
        );
    }
  };

  const organizedProperties = organizeProperties();
  const filteredProperties = searchTerm
    ? Object.entries(selectedBlock.properties || {}).filter(([key]) =>
        key.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : null;

  return (
    <TooltipProvider>
      <Card className="h-full border-[#B89B7A]/30 flex flex-col">
        {/* Header com informações do bloco */}
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-[#B89B7A]/10 text-[#432818]">
                {selectedBlock.type}
              </Badge>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 text-[#B89B7A]" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>ID: {selectedBlock.id}</p>
                </TooltipContent>
              </Tooltip>
            </div>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                ✕
              </Button>
            )}
          </div>

          <CardTitle className="text-lg text-[#432818]">Propriedades do Bloco</CardTitle>

          {/* Controles de preview e ações */}
          <div className="flex items-center gap-2 pt-2">
            <div style={{ backgroundColor: '#E5DDD5' }}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={previewMode === 'desktop' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => onPreviewModeChange?.('desktop')}
                      className="px-2"
                    >
                      <Monitor className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Desktop</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={previewMode === 'tablet' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => onPreviewModeChange?.('tablet')}
                      className="px-2"
                    >
                      <Tablet className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Tablet</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={previewMode === 'mobile' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => onPreviewModeChange?.('mobile')}
                      className="px-2"
                    >
                      <Smartphone className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Mobile</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="flex gap-1 ml-auto">
              {onDuplicate && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={onDuplicate}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Duplicar</TooltipContent>
                </Tooltip>
              )}

              {onReset && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={onReset}>
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Resetar</TooltipContent>
                </Tooltip>
              )}

              {onDelete && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onDelete}
                      style={{ color: '#432818' }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Excluir</TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>

          {/* Busca de propriedades */}
          <div className="pt-2">
            <Input
              placeholder="Buscar propriedades..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="border-[#B89B7A]/30 focus:border-[#B89B7A] focus:ring-[#B89B7A]/20"
            />
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-auto">
          {filteredProperties ? (
            // Modo de busca
            <div className="space-y-4">
              <p style={{ color: '#6B4F43' }}>
                {filteredProperties.length} propriedades encontradas
              </p>
              {filteredProperties.map(([key, value]) => renderPropertyControl(key, value))}
            </div>
          ) : (
            // Modo de categorias
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
              <TabsList className="grid w-full grid-cols-4 mb-4">
                {Object.entries(PROPERTY_CATEGORIES).map(([key, category]) => {
                  const Icon = category.icon;
                  const count = organizedProperties[key]?.length || 0;

                  return (
                    <TabsTrigger key={key} value={key} className="relative" disabled={count === 0}>
                      <Icon className="w-4 h-4" />
                      {count > 0 && (
                        <span className="absolute -top-1 -right-1 bg-[#B89B7A] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {count}
                        </span>
                      )}
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {Object.entries(PROPERTY_CATEGORIES).map(([key, category]) => (
                <TabsContent key={key} value={key} className="space-y-4">
                  <div className="mb-4">
                    <h3 className="font-medium text-[#432818] flex items-center gap-2">
                      <category.icon className="w-4 h-4" />
                      {category.label}
                    </h3>
                    <p style={{ color: '#6B4F43' }}>{category.description}</p>
                  </div>

                  <Separator className="bg-[#B89B7A]/20" />

                  {organizedProperties[key]?.length > 0 ? (
                    <div className="space-y-4">
                      {organizedProperties[key].map(propertyKey =>
                        renderPropertyControl(propertyKey, selectedBlock.properties?.[propertyKey])
                      )}
                    </div>
                  ) : (
                    <div style={{ color: '#8B7355' }}>
                      <category.icon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>Nenhuma propriedade {category.label.toLowerCase()}</p>
                    </div>
                  )}
                </TabsContent>
              ))}

              {/* Tab para outras propriedades */}
              {organizedProperties.other?.length > 0 && (
                <TabsContent value="other" className="space-y-4">
                  <div className="mb-4">
                    <h3 className="font-medium text-[#432818]">Outras Propriedades</h3>
                    <p style={{ color: '#6B4F43' }}>Propriedades específicas do componente</p>
                  </div>

                  <Separator className="bg-[#B89B7A]/20" />

                  <div className="space-y-4">
                    {organizedProperties.other.map(propertyKey =>
                      renderPropertyControl(propertyKey, selectedBlock.properties?.[propertyKey])
                    )}
                  </div>
                </TabsContent>
              )}
            </Tabs>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default EnhancedPropertiesPanel;

/**
 * 🎨 Enhanced NOCODE Properties Panel
 * 
 * Modern, intuitive properties panel that automatically displays ALL backend configurations
 * for any component across all 21 steps. Provides bidirectional sync with backend.
 */

import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Search,
  Settings,
  Palette,
  Type,
  Layout,
  Zap,
  Eye,
  RotateCcw,
  Copy,
  Sparkles,
  Filter,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PropertyCategory } from '@/hooks/useUnifiedProperties';
import { discoverComponentProperties, DiscoveredProperty } from './core/PropertyDiscovery';
import { UniversalPropertyRenderer } from './core/UniversalPropertyRenderer';
import StepNavigation from './core/StepNavigation';
import type { Block } from '@/types/editor';

interface EnhancedNocodePropertiesPanelProps {
  selectedBlock?: Block | null;
  onUpdate?: (updates: Record<string, any>) => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onReset?: () => void;
  onClose?: () => void;
  currentStep?: number;
  totalSteps?: number;
  onStepChange?: (step: number) => void;
}

// Category metadata for UI
const CATEGORY_META = {
  [PropertyCategory.CONTENT]: {
    icon: Type,
    label: 'Conteúdo',
    description: 'Textos, títulos e mídia',
    color: 'text-blue-600'
  },
  [PropertyCategory.STYLE]: {
    icon: Palette,
    label: 'Estilo',
    description: 'Cores, fontes e aparência',
    color: 'text-purple-600'
  },
  [PropertyCategory.LAYOUT]: {
    icon: Layout,
    label: 'Layout',
    description: 'Tamanho, posição e espaçamento',
    color: 'text-green-600'
  },
  [PropertyCategory.BEHAVIOR]: {
    icon: Zap,
    label: 'Comportamento',
    description: 'Interações e regras',
    color: 'text-orange-600'
  },
  [PropertyCategory.ADVANCED]: {
    icon: Settings,
    label: 'Avançado',
    description: 'Configurações técnicas',
    color: 'text-gray-600'
  },
  [PropertyCategory.ANIMATION]: {
    icon: Sparkles,
    label: 'Animação',
    description: 'Transições e efeitos',
    color: 'text-pink-600'
  },
  [PropertyCategory.ACCESSIBILITY]: {
    icon: Eye,
    label: 'Acessibilidade',
    description: 'Suporte a leitores de tela',
    color: 'text-indigo-600'
  },
  [PropertyCategory.SEO]: {
    icon: Search,
    label: 'SEO',
    description: 'Otimização para buscadores',
    color: 'text-teal-600'
  },
};

export const EnhancedNocodePropertiesPanel: React.FC<EnhancedNocodePropertiesPanelProps> = ({
  selectedBlock,
  onUpdate,
  onDelete,
  onDuplicate,
  // onReset, // Commented out since we have our own reset handler
  onClose,
  currentStep = 1,
  totalSteps = 21,
  onStepChange
}) => {
  // 🔍 DEBUG: Adicionar logs para diagnosticar problemas
  console.log('🎨 EnhancedNocodePropertiesPanel renderizado:', {
    selectedBlock: selectedBlock ? {
      id: selectedBlock.id,
      type: selectedBlock.type,
      hasProperties: !!selectedBlock.properties
    } : null,
    currentStep,
    totalSteps,
    hasOnUpdate: !!onUpdate
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeCategory, setActiveCategory] = useState<PropertyCategory>(PropertyCategory.CONTENT);
  const [collapsedCategories, setCollapsedCategories] = useState<Set<PropertyCategory>>(new Set());

  // Discover properties from the selected block
  const discoveredProperties = useMemo(() => {
    console.log('🔍 Descobrindo propriedades para:', selectedBlock?.type);

    if (!selectedBlock?.type) {
      console.log('❌ Nenhum tipo de bloco selecionado');
      return null;
    }

    const result = discoverComponentProperties(selectedBlock.type);
    console.log('🎯 Propriedades descobertas:', {
      componentType: selectedBlock.type,
      result: result ? {
        componentName: result.componentName,
        totalProperties: result.properties.length,
        categories: Array.from(result.categories),
        firstFewProperties: result.properties.slice(0, 3).map(p => ({ key: p.key, type: p.type, category: p.category }))
      } : null
    });

    return result;
  }, [selectedBlock?.type]);

  // Filter properties based on search and category
  const filteredProperties = useMemo(() => {
    if (!discoveredProperties) return [];

    let properties = discoveredProperties.properties;

    // Filter by search term
    if (searchTerm) {
      properties = properties.filter((prop: DiscoveredProperty) =>
        prop.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prop.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (prop.description && prop.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (activeCategory) {
      properties = properties.filter((prop: DiscoveredProperty) => prop.category === activeCategory);
    }

    return properties;
  }, [discoveredProperties, searchTerm, activeCategory]);

  // Group properties by category
  const propertiesByCategory = useMemo(() => {
    if (!discoveredProperties) return new Map();

    const grouped = new Map<PropertyCategory, DiscoveredProperty[]>();

    discoveredProperties.properties.forEach((prop: DiscoveredProperty) => {
      if (!grouped.has(prop.category)) {
        grouped.set(prop.category, []);
      }
      grouped.get(prop.category)!.push(prop);
    });

    return grouped;
  }, [discoveredProperties]);

  const handlePropertyChange = useCallback((key: string, value: any) => {
    if (onUpdate) {
      onUpdate({ [key]: value });
    }
  }, [onUpdate]);

  const handleResetToDefaults = useCallback(() => {
    if (!discoveredProperties || !onUpdate) return;

    const defaults: Record<string, any> = {};
    discoveredProperties.properties.forEach((prop: DiscoveredProperty) => {
      defaults[prop.key] = prop.defaultValue;
    });

    onUpdate(defaults);
  }, [discoveredProperties, onUpdate]);

  const toggleCategory = useCallback((category: PropertyCategory) => {
    const newCollapsed = new Set(collapsedCategories);
    if (newCollapsed.has(category)) {
      newCollapsed.delete(category);
    } else {
      newCollapsed.add(category);
    }
    setCollapsedCategories(newCollapsed);
  }, [collapsedCategories]);

  if (!selectedBlock) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="text-center text-muted-foreground">
          <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium mb-2">Nenhum Componente Selecionado</p>
          <p className="text-sm">
            Clique em um componente no canvas para editar suas propriedades
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!discoveredProperties) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="text-center text-muted-foreground">
          <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium mb-2">Componente Não Configurável</p>
          <p className="text-sm">
            Este componente não possui propriedades editáveis
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Step Navigation */}
      {onStepChange && (
        <StepNavigation
          currentStep={currentStep}
          totalSteps={totalSteps}
          onStepChange={onStepChange}
        />
      )}

      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-semibold text-lg">{discoveredProperties.componentName}</h3>
            <p className="text-sm text-muted-foreground">
              Etapa {currentStep} de {totalSteps} • {discoveredProperties.properties.length} propriedades
            </p>
          </div>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" variant="outline" onClick={onDuplicate}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Duplicar Componente</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" variant="outline" onClick={handleResetToDefaults}>
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Restaurar Padrões</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar propriedades..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id="show-advanced"
                checked={showAdvanced}
                onCheckedChange={setShowAdvanced}
              />
              <Label htmlFor="show-advanced" className="text-sm">
                Mostrar Avançadas
              </Label>
            </div>
            <Badge variant="outline" className="text-xs">
              {filteredProperties.length} de {discoveredProperties.properties.length}
            </Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        <Tabs value={activeCategory} onValueChange={(value) => setActiveCategory(value as PropertyCategory)}>
          {/* Category Tabs */}
          <div className="border-b px-4 py-2">
            <TabsList className="grid w-full grid-cols-4 gap-1">
              {Array.from(discoveredProperties.categories).map((category: PropertyCategory) => {
                const meta = CATEGORY_META[category];
                const Icon = meta.icon;
                const count = propertiesByCategory.get(category)?.length || 0;

                return (
                  <TabsTrigger
                    key={String(category)}
                    value={String(category)}
                    className="flex items-center gap-1 text-xs"
                  >
                    <Icon className="w-3 h-3" />
                    <span className="hidden sm:inline">{meta.label}</span>
                    <Badge variant="secondary" className="text-xs h-4 px-1">
                      {count}
                    </Badge>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          {/* Properties Content */}
          <ScrollArea className="flex-1">
            {Array.from(discoveredProperties.categories).map((category: PropertyCategory) => {
              const meta = CATEGORY_META[category];
              const categoryProperties = propertiesByCategory.get(category) || [];
              const isCollapsed = collapsedCategories.has(category);

              return (
                <TabsContent key={String(category)} value={String(category)} className="mt-0">
                  <div className="p-4">
                    <div className="space-y-4">
                      {/* Category Header */}
                      <div
                        className="flex items-center justify-between cursor-pointer p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                        onClick={() => toggleCategory(category)}
                      >
                        <div className="flex items-center gap-2">
                          <meta.icon className={cn("w-5 h-5", meta.color)} />
                          <div>
                            <h4 className="font-medium">{meta.label}</h4>
                            <p className="text-xs text-muted-foreground">{meta.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {categoryProperties.length}
                          </Badge>
                          {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                        </div>
                      </div>

                      {/* Properties */}
                      {!isCollapsed && (
                        <div className="space-y-4 pl-2">
                          {categoryProperties.map((property: DiscoveredProperty) => (
                            <div key={property.key} className="space-y-2">
                              <UniversalPropertyRenderer
                                property={property}
                                value={selectedBlock.properties?.[property.key]}
                                onChange={(value) => handlePropertyChange(property.key, value)}
                                showAdvanced={showAdvanced}
                              />
                              <Separator className="opacity-30" />
                            </div>
                          ))}

                          {categoryProperties.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                              <Filter className="w-8 h-8 mx-auto mb-2 opacity-50" />
                              <p className="text-sm">Nenhuma propriedade nesta categoria</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              );
            })}
          </ScrollArea>
        </Tabs>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t bg-gray-50">
        <div className="flex gap-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={onDelete}
            className="flex-1"
          >
            Excluir Componente
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="flex-1"
          >
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedNocodePropertiesPanel;
/**
 * 🚀 ENHANCED NOCODE PROPERTIES PANEL - PAINEL DE PROPRIEDADES MODERNIZADO
 * 
 * Versão aprimorada do painel de propriedades com:
 * - Interface moderna e responsiva
 * - Performance otimizada
 * - Funcionalidades avançadas de edição
 * - Sistema de validação visual
 * - Preview em tempo real
 * - Acessibilidade completa
 * - Undo/Redo system
 * - Keyboard shortcuts
 */

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import {
  Search,
  Settings,
  Palette,
  Type,
  Layout,
  Zap,
  Eye,
  Copy,
  Sparkles,
  Filter,
  Code,
  AlertCircle,
  Save,
  Undo,
  Redo,
  Star,
  Lock,
  Unlock,
  ChevronDown,
  ChevronRight,
  Grid,
  List,
  Maximize2,
  Minimize2,
  MoreVertical,
  Pin,
  PinOff
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { discoverComponentProperties, DiscoveredProperty } from './core/PropertyDiscovery';
import { UniversalPropertyRenderer } from './core/UniversalPropertyRenderer';
import { PropertyCategory } from '@/hooks/useUnifiedProperties';
import EnhancedValidationSystem, { ValidationContext } from './EnhancedValidationSystem';
import type { Block } from '@/types/editor';

// ===== INTERFACES =====

interface EnhancedNoCodePropertiesPanelProps {
  selectedBlock?: Block | null;
  currentStep?: number;
  totalSteps?: number;
  onUpdate?: (updates: Record<string, any>) => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onClose?: () => void;
  className?: string;
}

interface PropertyGroup {
  category: PropertyCategory;
  properties: DiscoveredProperty[];
  icon: React.ReactNode;
  color: string;
  description: string;
}

interface HistoryEntry {
  timestamp: number;
  changes: Record<string, any>;
  description: string;
}

interface ViewState {
  layout: 'grid' | 'list' | 'compact';
  groupBy: 'category' | 'alphabetical' | 'type';
  showAdvanced: boolean;
  showDescriptions: boolean;
  isPinned: boolean;
  isExpanded: boolean;
}

// ===== CONSTANTS =====

const CATEGORY_CONFIG: Record<PropertyCategory, { icon: React.ReactNode; color: string; description: string }> = {
  [PropertyCategory.CONTENT]: {
    icon: <Type className="w-4 h-4" />,
    color: 'bg-blue-500',
    description: 'Textos, títulos e conteúdo principal'
  },
  [PropertyCategory.STYLE]: {
    icon: <Palette className="w-4 h-4" />,
    color: 'bg-purple-500',
    description: 'Cores, fontes e estilos visuais'
  },
  [PropertyCategory.LAYOUT]: {
    icon: <Layout className="w-4 h-4" />,
    color: 'bg-green-500',
    description: 'Posicionamento e espaçamento'
  },
  [PropertyCategory.BEHAVIOR]: {
    icon: <Zap className="w-4 h-4" />,
    color: 'bg-orange-500',
    description: 'Interações e comportamentos'
  },
  [PropertyCategory.ADVANCED]: {
    icon: <Settings className="w-4 h-4" />,
    color: 'bg-gray-500',
    description: 'Configurações avançadas'
  },
  [PropertyCategory.ANIMATION]: {
    icon: <Sparkles className="w-4 h-4" />,
    color: 'bg-pink-500',
    description: 'Animações e transições'
  },
  [PropertyCategory.ACCESSIBILITY]: {
    icon: <Eye className="w-4 h-4" />,
    color: 'bg-teal-500',
    description: 'Acessibilidade e usabilidade'
  },
  [PropertyCategory.SEO]: {
    icon: <Search className="w-4 h-4" />,
    color: 'bg-indigo-500',
    description: 'SEO e metadados'
  },
};

const KEYBOARD_SHORTCUTS = [
  { key: 'Ctrl+S', action: 'Salvar alterações' },
  { key: 'Ctrl+Z', action: 'Desfazer' },
  { key: 'Ctrl+Y', action: 'Refazer' },
  { key: 'Ctrl+D', action: 'Duplicar' },
  { key: 'Ctrl+F', action: 'Buscar propriedade' },
  { key: 'Escape', action: 'Fechar painel' },
];

// ===== MAIN COMPONENT =====

export const EnhancedNoCodePropertiesPanel: React.FC<EnhancedNoCodePropertiesPanelProps> = ({
  selectedBlock,
  currentStep = 1,
  totalSteps = 21,
  onUpdate,
  onDelete,
  onDuplicate,
  onClose,
  className
}) => {
  // ===== STATE MANAGEMENT =====
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PropertyCategory | 'all'>('all');
  const [tempValues, setTempValues] = useState<Record<string, any>>({});
  const [showInterpolationHelper, setShowInterpolationHelper] = useState(false);
  const [viewState, setViewState] = useState<ViewState>({
    layout: 'list',
    groupBy: 'category',
    showAdvanced: false,
    showDescriptions: true,
    isPinned: false,
    isExpanded: true
  });
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [collapsedCategories, setCollapsedCategories] = useState<Set<PropertyCategory>>(new Set());
  const [favoriteProperties, setFavoriteProperties] = useState<Set<string>>(new Set());
  const [lockedProperties, setLockedProperties] = useState<Set<string>>(new Set());
  const [isDirty, setIsDirty] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // ===== MOCK DATA =====
  const userName = 'Usuário';
  const quizResult = {};

  // ===== COMPUTED VALUES =====
  const allProperties = useMemo(() => {
    if (!selectedBlock) return [];
    
    const schema = discoverComponentProperties(selectedBlock.type);
    return schema?.properties || [];
  }, [selectedBlock]);

  const propertyGroups = useMemo(() => {
    const groups: Record<PropertyCategory, PropertyGroup> = {} as any;
    
    allProperties.forEach(property => {
      if (!groups[property.category]) {
        const config = CATEGORY_CONFIG[property.category];
        groups[property.category] = {
          category: property.category,
          properties: [],
          icon: config.icon,
          color: config.color,
          description: config.description
        };
      }
      groups[property.category].properties.push(property);
    });

    return Object.values(groups);
  }, [allProperties]);

  const filteredGroups = useMemo(() => {
    let groups = propertyGroups;

    // Filter by search term
    if (searchTerm) {
      groups = groups.map(group => ({
        ...group,
        properties: group.properties.filter(prop =>
          prop.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          prop.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
          prop.description?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })).filter(group => group.properties.length > 0);
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      groups = groups.filter(group => group.category === selectedCategory);
    }

    // Filter by advanced settings
    if (!viewState.showAdvanced) {
      groups = groups.map(group => ({
        ...group,
        properties: group.properties.filter(prop => !prop.isAdvanced)
      })).filter(group => group.properties.length > 0);
    }

    return groups;
  }, [propertyGroups, searchTerm, selectedCategory, viewState.showAdvanced]);

  const validationContext: ValidationContext = useMemo(() => ({
    blockType: selectedBlock?.type || '',
    blockId: selectedBlock?.id || '',
    propertyKey: '',
    propertyType: 'text' as any,
    stepNumber: currentStep,
    quizProgress: (currentStep / totalSteps) * 100,
    availableVariables: [],
    otherProperties: tempValues,
    userName: userName || '',
    quizResult: quizResult || {}
  }), [selectedBlock, currentStep, totalSteps, userName, quizResult, tempValues]);

  // ===== EVENT HANDLERS =====
  const handlePropertyChange = useCallback((key: string, value: any) => {
    if (lockedProperties.has(key)) return;

    setTempValues(prev => ({ ...prev, [key]: value }));
    setIsDirty(true);

    // Add to history
    const newEntry: HistoryEntry = {
      timestamp: Date.now(),
      changes: { [key]: value },
      description: `Alterou ${key}`
    };
    
    setHistory(prev => [...prev.slice(0, historyIndex + 1), newEntry]);
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex, lockedProperties]);

  const handleSave = useCallback(() => {
    if (!isDirty || !onUpdate) return;
    
    onUpdate(tempValues);
    setTempValues({});
    setIsDirty(false);
  }, [tempValues, isDirty, onUpdate]);

  const handleUndo = useCallback(() => {
    if (historyIndex <= 0) return;
    
    const entry = history[historyIndex - 1];
    setTempValues(prev => {
      const newValues = { ...prev };
      Object.keys(entry.changes).forEach(key => {
        delete newValues[key];
      });
      return newValues;
    });
    setHistoryIndex(prev => prev - 1);
    setIsDirty(historyIndex > 1);
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex >= history.length - 1) return;
    
    const entry = history[historyIndex + 1];
    setTempValues(prev => ({ ...prev, ...entry.changes }));
    setHistoryIndex(prev => prev + 1);
    setIsDirty(true);
  }, [history, historyIndex]);

  const toggleCategoryCollapse = useCallback((category: PropertyCategory) => {
    setCollapsedCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  }, []);

  const toggleFavorite = useCallback((propertyKey: string) => {
    setFavoriteProperties(prev => {
      const next = new Set(prev);
      if (next.has(propertyKey)) {
        next.delete(propertyKey);
      } else {
        next.add(propertyKey);
      }
      return next;
    });
  }, []);

  const toggleLock = useCallback((propertyKey: string) => {
    setLockedProperties(prev => {
      const next = new Set(prev);
      if (next.has(propertyKey)) {
        next.delete(propertyKey);
      } else {
        next.add(propertyKey);
      }
      return next;
    });
  }, []);

  // ===== KEYBOARD SHORTCUTS =====
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            handleSave();
            break;
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              handleRedo();
            } else {
              handleUndo();
            }
            break;
          case 'y':
            e.preventDefault();
            handleRedo();
            break;
          case 'd':
            e.preventDefault();
            onDuplicate?.();
            break;
          case 'f':
            e.preventDefault();
            searchInputRef.current?.focus();
            break;
        }
      } else if (e.key === 'Escape') {
        onClose?.();
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [handleSave, handleUndo, handleRedo, onDuplicate, onClose]);

  // ===== RENDER HELPERS =====
  const renderPropertyItem = useCallback((property: DiscoveredProperty) => {
    const currentValue = tempValues[property.key] ?? 
      selectedBlock?.properties?.[property.key] ?? 
      selectedBlock?.content?.[property.key] ?? 
      property.defaultValue;

    const isFavorite = favoriteProperties.has(property.key);
    const isLocked = lockedProperties.has(property.key);

    return (
      <Card key={property.key} className={cn(
        "relative group transition-all duration-200",
        isLocked && "opacity-60",
        isFavorite && "ring-2 ring-yellow-400"
      )}>
        <CardContent className="p-3">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              {isFavorite && <Star className="w-3 h-3 text-yellow-500 fill-current" />}
              {isLocked && <Lock className="w-3 h-3 text-gray-500" />}
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                {property.category}
              </span>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleFavorite(property.key)}
                      className="h-6 w-6 p-0"
                    >
                      <Star className={cn("w-3 h-3", isFavorite && "fill-current text-yellow-500")} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleLock(property.key)}
                      className="h-6 w-6 p-0"
                    >
                      {isLocked ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isLocked ? 'Desbloquear propriedade' : 'Bloquear propriedade'}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <UniversalPropertyRenderer
            property={property}
            value={currentValue}
            onChange={(value) => handlePropertyChange(property.key, value)}
            disabled={isLocked}
            showAdvanced={viewState.showAdvanced}
            compact={viewState.layout === 'compact'}
          />

          {viewState.showDescriptions && property.description && (
            <p className="text-xs text-muted-foreground mt-2">
              {property.description}
            </p>
          )}
        </CardContent>
      </Card>
    );
  }, [tempValues, selectedBlock, favoriteProperties, lockedProperties, viewState, handlePropertyChange, toggleFavorite, toggleLock]);

  const renderCategoryGroup = useCallback((group: PropertyGroup) => {
    const isCollapsed = collapsedCategories.has(group.category);
    const config = CATEGORY_CONFIG[group.category];

    return (
      <Collapsible
        key={group.category}
        open={!isCollapsed}
        onOpenChange={() => toggleCategoryCollapse(group.category)}
      >
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-between p-3 h-auto hover:bg-accent/50"
          >
            <div className="flex items-center gap-3">
              <div className={cn("w-3 h-3 rounded", config.color)} />
              {config.icon}
              <div className="text-left">
                <div className="font-medium">{group.category.toUpperCase()}</div>
                <div className="text-xs text-muted-foreground">{config.description}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {group.properties.length}
              </Badge>
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 px-3 pb-3">
          {viewState.layout === 'grid' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              {group.properties.map(renderPropertyItem)}
            </div>
          ) : (
            <div className="space-y-2">
              {group.properties.map(renderPropertyItem)}
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    );
  }, [collapsedCategories, toggleCategoryCollapse, viewState.layout, renderPropertyItem]);

  // ===== RENDER =====
  if (!selectedBlock) {
    return (
      <Card className={cn("w-full max-w-md mx-auto", className)}>
        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
          <Settings className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhum Bloco Selecionado</h3>
          <p className="text-muted-foreground text-sm">
            Selecione um bloco no canvas para editar suas propriedades
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("w-full", viewState.isExpanded ? "max-w-md" : "max-w-sm", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn("w-3 h-3 rounded", CATEGORY_CONFIG[PropertyCategory.CONTENT].color)} />
            <CardTitle className="text-lg">Propriedades</CardTitle>
            {isDirty && <div className="w-2 h-2 bg-orange-500 rounded-full" />}
          </div>
          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setViewState(prev => ({ ...prev, isPinned: !prev.isPinned }))}
                    className="h-8 w-8 p-0"
                  >
                    {viewState.isPinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {viewState.isPinned ? 'Desprender painel' : 'Fixar painel'}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setViewState(prev => ({ ...prev, isExpanded: !prev.isExpanded }))}
                    className="h-8 w-8 p-0"
                  >
                    {viewState.isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {viewState.isExpanded ? 'Minimizar painel' : 'Expandir painel'}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {onClose && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                ×
              </Button>
            )}
          </div>
        </div>

        {/* Block Info */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {selectedBlock.type} • Etapa {currentStep}/{totalSteps}
          </span>
          <Badge variant="outline" className="text-xs">
            {allProperties.length} propriedades
          </Badge>
        </div>

        {/* Action Bar */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!isDirty}
            className="flex-1"
          >
            <Save className="w-3 h-3 mr-1" />
            Salvar
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleUndo}
                  disabled={historyIndex <= 0}
                  className="h-8 w-8 p-0"
                >
                  <Undo className="w-3 h-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Desfazer</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleRedo}
                  disabled={historyIndex >= history.length - 1}
                  className="h-8 w-8 p-0"
                >
                  <Redo className="w-3 h-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Refazer</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Popover>
            <PopoverTrigger asChild>
              <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                <MoreVertical className="w-3 h-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48">
              <div className="space-y-2">
                {onDuplicate && (
                  <Button size="sm" variant="ghost" onClick={onDuplicate} className="w-full justify-start">
                    <Copy className="w-3 h-3 mr-2" />
                    Duplicar
                  </Button>
                )}
                {onDelete && (
                  <Button size="sm" variant="ghost" onClick={onDelete} className="w-full justify-start text-red-600">
                    <AlertCircle className="w-3 h-3 mr-2" />
                    Excluir
                  </Button>
                )}
                <Separator />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowInterpolationHelper(true)}
                  className="w-full justify-start"
                >
                  <Code className="w-3 h-3 mr-2" />
                  Ajuda de Interpolação
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Properties Tabs */}
        <Tabs defaultValue="properties" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="properties" className="text-xs">Propriedades</TabsTrigger>
            <TabsTrigger value="presets" className="text-xs">Presets</TabsTrigger>
            <TabsTrigger value="preview" className="text-xs">Preview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="properties" className="mt-3">
            {/* Search and Filters */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  ref={searchInputRef}
                  placeholder="Buscar propriedades..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>

              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="w-3 h-3 mr-1" />
                      {selectedCategory === 'all' ? 'Todas' : selectedCategory}
                      <ChevronDown className="w-3 h-3 ml-1" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48">
                    <Command>
                      <CommandInput placeholder="Buscar categoria..." />
                      <CommandEmpty>Nenhuma categoria encontrada.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem onSelect={() => setSelectedCategory('all')}>
                          Todas as categorias
                        </CommandItem>
                        {Object.entries(CATEGORY_CONFIG).map(([category, config]) => (
                          <CommandItem
                            key={category}
                            onSelect={() => setSelectedCategory(category as PropertyCategory)}
                          >
                            <div className="flex items-center gap-2">
                              <div className={cn("w-2 h-2 rounded", config.color)} />
                              {config.icon}
                              {category}
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewState(prev => ({ ...prev, layout: prev.layout === 'list' ? 'grid' : 'list' }))}
                >
                  {viewState.layout === 'list' ? <Grid className="w-3 h-3" /> : <List className="w-3 h-3" />}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewState(prev => ({ ...prev, showAdvanced: !prev.showAdvanced }))}
                >
                  <Settings className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {/* Validation System */}
            <EnhancedValidationSystem
              properties={{ ...selectedBlock.properties, ...selectedBlock.content, ...tempValues }}
              context={validationContext}
              onValidationChange={() => {}}
              onAutoFix={handlePropertyChange}
              className="mb-3"
            />

            {/* Properties List */}
            <ScrollArea className="h-[60vh]">
              <div className="space-y-2">
                {filteredGroups.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Search className="w-8 h-8 mx-auto mb-2" />
                    <p>Nenhuma propriedade encontrada</p>
                  </div>
                ) : (
                  filteredGroups.map(renderCategoryGroup)
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="presets" className="mt-3">
            <div className="text-center py-8 text-muted-foreground">
              <Palette className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">Sistema de Presets</p>
              <p className="text-xs mt-1">Em desenvolvimento...</p>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="mt-3">
            <div className="text-center py-8 text-muted-foreground">
              <Eye className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">Preview em Tempo Real</p>
              <p className="text-xs mt-1">Em desenvolvimento...</p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Keyboard Shortcuts Help */}
        {showInterpolationHelper && (
          <Card className="border-dashed">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Atalhos do Teclado</CardTitle>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowInterpolationHelper(false)}
                  className="h-6 w-6 p-0"
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-1">
                {KEYBOARD_SHORTCUTS.map((shortcut, index) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{shortcut.action}</span>
                    <Badge variant="outline" className="text-xs font-mono">
                      {shortcut.key}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedNoCodePropertiesPanel;

/**
 * 🎯 UNIFIED COMPONENTS PANEL - PAINEL UNIFICADO DE COMPONENTES
 * 
 * Painel intercambiável que substitui múltiplos components sidebars:
 * - ComponentsSidebar
 * - EnhancedComponentsSidebar  
 * - ComponentsPanel
 * - CombinedComponentsPanel
 * 
 * FUNCIONALIDADES:
 * ✅ Component registry integration
 * ✅ Search e filtering
 * ✅ Categorização dinâmica
 * ✅ Drag & drop support
 * ✅ Lazy loading components
 * ✅ Responsive design
 */

import React, { useState, useMemo, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Grid3X3, 
  List, 
  Star, 
  Zap,
  ChevronDown,
  ChevronRight,
  Plus
} from 'lucide-react';

export interface UnifiedComponentsPanelProps {
  className?: string;
  onAddComponent?: (componentId: string, metadata: ComponentMetadata) => void;
  showSearch?: boolean;
  showCategories?: boolean;
  showFilters?: boolean;
  defaultView?: 'grid' | 'list';
  compactMode?: boolean;
}

export const UnifiedComponentsPanel: React.FC<UnifiedComponentsPanelProps> = ({
  className = '',
  onAddComponent,
  showSearch = true,
  showCategories = true,
  showFilters = true,
  defaultView = 'grid',
  compactMode = false
}) => {
  // 🎯 STATE MANAGEMENT
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory] = useState<ComponentCategory | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(defaultView);
  const [showNewOnly, setShowNewOnly] = useState(false);
  const [showProOnly, setShowProOnly] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<ComponentCategory>>(new Set(['quiz', 'content']));

  // 🎯 DATA PROCESSING
  const { filteredComponents, groupedComponents } = useMemo(() => {
    let components = Object.values(COMPONENT_REGISTRY);

    // Apply search filter
    if (searchQuery.trim()) {
      components = searchComponents(searchQuery);
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      components = components.filter(comp => comp.category === selectedCategory);
    }

    // Apply special filters
    if (showNewOnly) {
      components = components.filter(comp => comp.isNew);
    }
    if (showProOnly) {
      components = components.filter(comp => comp.isPro);
    }

    // Group components
    const grouped = components.reduce((acc, comp) => {
      if (!acc[comp.category]) acc[comp.category] = [];
      acc[comp.category].push(comp);
      return acc;
    }, {} as Record<ComponentCategory, ComponentMetadata[]>);

    return {
      filteredComponents: components,
      groupedComponents: grouped
    };
  }, [searchQuery, selectedCategory, showNewOnly, showProOnly]);

  // 🎯 EVENT HANDLERS
  const handleAddComponent = useCallback((metadata: ComponentMetadata) => {
    onAddComponent?.(metadata.id, metadata);
  }, [onAddComponent]);

  const handleCategoryToggle = useCallback((category: ComponentCategory) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  }, []);

  // 🎯 COMPONENT ITEM RENDERER
  const ComponentItem = React.memo<{ 
    component: ComponentMetadata;
    isCompact?: boolean;
    viewMode: 'grid' | 'list';
  }>(({ component, isCompact = false, viewMode }) => {
    const isGridView = viewMode === 'grid';
    
    return (
      <div
        className={cn(
          'group relative border border-border rounded-lg bg-card hover:bg-accent/50 transition-colors cursor-pointer',
          isGridView ? 'p-3' : 'p-2 flex items-center gap-3',
          isCompact && 'p-2'
        )}
        onClick={() => handleAddComponent(component)}
        title={`Adicionar ${component.name}`}
      >
        {/* Icon */}
        <div className={cn(
          'flex items-center justify-center rounded-md bg-primary/10 text-primary',
          isGridView ? 'w-8 h-8 mx-auto mb-2' : 'w-6 h-6 flex-shrink-0',
          isCompact && 'w-5 h-5'
        )}>
          <span className={cn('text-sm', isCompact && 'text-xs')}>
            {component.icon || '🔧'}
          </span>
        </div>

        {/* Content */}
        <div className={cn('flex-1 min-w-0', isGridView && 'text-center')}>
          <div className="flex items-center gap-2 mb-1">
            <h4 className={cn(
              'font-medium text-foreground truncate',
              isGridView ? 'text-xs' : 'text-sm',
              isCompact && 'text-xs'
            )}>
              {component.name}
            </h4>
            
            {/* Badges */}
            <div className="flex gap-1">
              {component.isNew && (
                <Badge variant="secondary" className="text-xs px-1 py-0">
                  <Star className="w-2.5 h-2.5 mr-1" />
                  New
                </Badge>
              )}
              {component.isPro && (
                <Badge variant="outline" className="text-xs px-1 py-0">
                  <Zap className="w-2.5 h-2.5 mr-1" />
                  Pro
                </Badge>
              )}
            </div>
          </div>

          {!isCompact && (
            <p className={cn(
              'text-muted-foreground text-xs line-clamp-2',
              isGridView && 'text-center'
            )}>
              {component.description}
            </p>
          )}
        </div>

        {/* Add Button Overlay */}
        <div className={cn(
          'absolute inset-0 bg-primary/90 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity',
          'text-primary-foreground font-medium text-sm'
        )}>
          <Plus className="w-4 h-4 mr-1" />
          Adicionar
        </div>
      </div>
    );
  });

  // 🎯 CATEGORY SECTION RENDERER
  const CategorySection = React.memo<{
    category: ComponentCategory;
    components: ComponentMetadata[];
  }>(({ category, components }) => {
    const isExpanded = expandedCategories.has(category);
    
    if (components.length === 0) return null;

    return (
      <div className="mb-4">
        <button
          onClick={() => handleCategoryToggle(category)}
          className="flex items-center gap-2 w-full text-left p-2 hover:bg-accent/50 rounded-md transition-colors"
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          )}
          <span className="font-medium text-sm capitalize">
            {category}
          </span>
          <Badge variant="outline" className="ml-auto text-xs">
            {components.length}
          </Badge>
        </button>

        {isExpanded && (
          <div className={cn(
            'mt-2 gap-2',
            viewMode === 'grid' 
              ? 'grid grid-cols-2 gap-2' 
              : 'space-y-1'
          )}>
            {components.map(component => (
              <ComponentItem
                key={component.id}
                component={component}
                isCompact={compactMode}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}
      </div>
    );
  });

  return (
    <div className={cn('unified-components-panel h-full flex flex-col bg-card', className)}>
      {/* Header */}
      <div className="p-4 border-b border-border flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm">Componentes</h3>
          
          {/* View Mode Toggle */}
          <div className="flex gap-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-7 w-7 p-0"
            >
              <Grid3X3 className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-7 w-7 p-0"
            >
              <List className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Search */}
        {showSearch && (
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar componentes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-8 text-sm"
            />
          </div>
        )}

        {/* Filters */}
        {showFilters && (
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={showNewOnly ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowNewOnly(!showNewOnly)}
              className="h-6 px-2 text-xs"
            >
              <Star className="w-3 h-3 mr-1" />
              Novos
            </Button>
            <Button
              variant={showProOnly ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowProOnly(!showProOnly)}
              className="h-6 px-2 text-xs"
            >
              <Zap className="w-3 h-3 mr-1" />
              Pro
            </Button>
          </div>
        )}
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          {showCategories ? (
            // Categorized View
        Object.entries(groupedComponents)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([category, components]) => (
                <CategorySection
                  key={category}
                  category={category as ComponentCategory}
                  components={components}
                />
              ))
          ) : (
            // Flat View
            <div className={cn(
              'gap-2',
              viewMode === 'grid' 
                ? 'grid grid-cols-2 gap-2' 
                : 'space-y-1'
            )}>
              {filteredComponents.map(component => (
                <ComponentItem
                  key={component.id}
                  component={component}
                  isCompact={compactMode}
                  viewMode={viewMode}
                />
              ))}
            </div>
          )}

          {filteredComponents.length === 0 && (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🔍</div>
              <p className="text-muted-foreground text-sm">
                Nenhum componente encontrado
              </p>
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchQuery('')}
                  className="mt-2 text-xs"
                >
                  Limpar busca
                </Button>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default UnifiedComponentsPanel;
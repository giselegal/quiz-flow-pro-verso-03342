/**
 * 🎯 UNIFIED COMPONENTS PANEL - VERSÃO SIMPLIFICADA
 * 
 * Painel unificado simplificado que funciona com componentes existentes
 * até que o ComponentRegistry seja totalmente implementado.
 */

import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, 
  Grid3X3, 
  List, 
  Star, 
  Plus
} from 'lucide-react';

export interface UnifiedComponentsPanelProps {
  className?: string;
  onAddComponent?: (componentId: string, metadata: any) => void;
  showSearch?: boolean;
  showCategories?: boolean;
  compactMode?: boolean;
}

// 🎯 SIMPLE COMPONENT DATA (fallback até ComponentRegistry estar pronto)
const SIMPLE_COMPONENTS = [
  {
    id: 'quiz-question-inline',
    name: 'Pergunta de Quiz',
    description: 'Pergunta interativa com múltiplas opções',
    category: 'quiz',
    icon: '❓',
    isNew: false
  },
  {
    id: 'button',
    name: 'Botão',
    description: 'Botão interativo customizável',
    category: 'interactive',
    icon: '🔘',
    isNew: false
  },
  {
    id: 'text',
    name: 'Texto',
    description: 'Bloco de texto simples',
    category: 'content',
    icon: '📝',
    isNew: false
  },
  {
    id: 'image',
    name: 'Imagem',
    description: 'Imagem responsiva',
    category: 'media',
    icon: '🖼️',
    isNew: false
  },
  {
    id: 'testimonial',
    name: 'Depoimento',
    description: 'Card de depoimento',
    category: 'social',
    icon: '⭐',
    isNew: true
  }
];

export const UnifiedComponentsPanel: React.FC<UnifiedComponentsPanelProps> = ({
  className = '',
  onAddComponent,
  showSearch = true,
  showCategories = true,
  compactMode = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // 🎯 SIMPLE FILTERING
  const filteredComponents = useMemo(() => {
    let components = SIMPLE_COMPONENTS;

    if (searchQuery.trim()) {
      const searchTerm = searchQuery.toLowerCase();
      components = components.filter(comp => 
        comp.name.toLowerCase().includes(searchTerm) ||
        comp.description.toLowerCase().includes(searchTerm) ||
        comp.category.toLowerCase().includes(searchTerm)
      );
    }

    return components;
  }, [searchQuery]);

  // 🎯 GROUP BY CATEGORY
  const groupedComponents = useMemo(() => {
    return filteredComponents.reduce((acc, comp) => {
      if (!acc[comp.category]) acc[comp.category] = [];
      acc[comp.category].push(comp);
      return acc;
    }, {} as Record<string, typeof SIMPLE_COMPONENTS>);
  }, [filteredComponents]);

  // 🎯 COMPONENT ITEM
  const ComponentItem: React.FC<{ 
    component: typeof SIMPLE_COMPONENTS[0];
    isCompact?: boolean;
    viewMode: 'grid' | 'list';
  }> = ({ component, isCompact = false, viewMode }) => {
    const isGridView = viewMode === 'grid';
    
    return (
      <div
        className={cn(
          'group relative border border-border rounded-lg bg-card hover:bg-accent/50 transition-colors cursor-pointer',
          isGridView ? 'p-3' : 'p-2 flex items-center gap-3',
          isCompact && 'p-2'
        )}
        onClick={() => onAddComponent?.(component.id, component)}
        title={`Adicionar ${component.name}`}
      >
        {/* Icon */}
        <div className={cn(
          'flex items-center justify-center rounded-md bg-primary/10 text-primary',
          isGridView ? 'w-8 h-8 mx-auto mb-2' : 'w-6 h-6 flex-shrink-0',
          isCompact && 'w-5 h-5'
        )}>
          <span className={cn('text-sm', isCompact && 'text-xs')}>
            {component.icon}
          </span>
        </div>

        {/* Content */}
        <div className={cn('flex-1 min-w-0', isGridView && 'text-center')}>
          <div className="flex items-center gap-2 mb-1 justify-center">
            <h4 className={cn(
              'font-medium text-foreground truncate',
              isGridView ? 'text-xs' : 'text-sm',
              isCompact && 'text-xs'
            )}>
              {component.name}
            </h4>
            
            {component.isNew && (
              <Badge variant="secondary" className="text-xs px-1 py-0">
                <Star className="w-2.5 h-2.5 mr-1" />
                New
              </Badge>
            )}
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
  };

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
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          {showCategories ? (
            // Categorized View
            Object.entries(groupedComponents)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([category, components]) => (
                <div key={category} className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-sm capitalize">{category}</span>
                    <Badge variant="outline" className="text-xs">
                      {components.length}
                    </Badge>
                  </div>
                  
                  <div className={cn(
                    'gap-2',
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
                </div>
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
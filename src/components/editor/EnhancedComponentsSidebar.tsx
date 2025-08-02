
import React, { useState, useMemo } from 'react';
import { Search, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BLOCK_CATEGORIES,
  getAllBlockTypes,
  searchBlocks,
  getBlocksByCategory,
  getBlockDefinition,
  BlockDefinition
} from './blocks/EnhancedBlockRegistry';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface EnhancedComponentsSidebarProps {
  onComponentSelect?: (componentType: string) => void;
  className?: string;
}

export const EnhancedComponentsSidebar: React.FC<EnhancedComponentsSidebarProps> = ({
  onComponentSelect,
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favoriteComponents, setFavoriteComponents] = useState<Set<string>>(new Set());

  // Get filtered components based on search and category
  const filteredComponents = useMemo(() => {
    let components: BlockDefinition[] = [];

    if (searchTerm) {
      // Search across all components
      components = searchBlocks(searchTerm);
    } else if (selectedCategory === 'all') {
      // Get all components
      components = getAllBlockTypes().map(type => getBlockDefinition(type)).filter(Boolean) as BlockDefinition[];
    } else if (selectedCategory === 'favorites') {
      // Get favorite components
      components = Array.from(favoriteComponents)
        .map(type => getBlockDefinition(type))
        .filter(Boolean) as BlockDefinition[];
    } else {
      // Get components by category
      components = getBlocksByCategory(selectedCategory);
    }

    return components;
  }, [searchTerm, selectedCategory, favoriteComponents]);

  const handleComponentClick = (componentType: string) => {
    onComponentSelect?.(componentType);
  };

  const toggleFavorite = (componentType: string) => {
    setFavoriteComponents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(componentType)) {
        newSet.delete(componentType);
      } else {
        newSet.add(componentType);
      }
      return newSet;
    });
  };

  return (
    <div className={cn("h-full bg-white border-r border-gray-200 flex flex-col", className)}>
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="font-semibold text-gray-900 mb-3">Componentes</h2>
        
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar componentes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Category tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="content">Conteúdo</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Components List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {filteredComponents.map((component) => {
            const isFavorite = favoriteComponents.has(component.type);
            
            return (
              <div key={component.type} className="relative group">
                <Button
                  variant="ghost"
                  className="w-full justify-start h-auto p-3 text-left"
                  onClick={() => handleComponentClick(component.type)}
                >
                  <div className="flex items-start space-x-3 w-full">
                    <div className="flex-shrink-0">
                      <div className="h-5 w-5 text-gray-600 flex items-center justify-center">
                        📝
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900">
                          {component.name}
                        </p>
                        {component.tags?.includes('premium') && (
                          <Badge variant="secondary" className="text-xs">
                            <Zap className="h-3 w-3 mr-1" />
                            Pro
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {component.description}
                      </p>
                    </div>
                  </div>
                </Button>
                
                {/* Favorite button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(component.type);
                  }}
                  className={cn(
                    "absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity",
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs",
                    isFavorite ? "text-yellow-500" : "text-gray-400 hover:text-yellow-500"
                  )}
                >
                  ⭐
                </button>
              </div>
            );
          })}
          
          {filteredComponents.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhum componente encontrado</p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Categories Overview (when not searching) */}
      {!searchTerm && selectedCategory === 'all' && (
        <div className="border-t p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Categorias</h3>
          <div className="grid grid-cols-1 gap-2">
            {BLOCK_CATEGORIES.map((category) => (
              <Button
                key={category.title}
                variant="outline"
                size="sm"
                className="justify-start h-auto py-2 px-3"
                onClick={() => setSelectedCategory(category.title.toLowerCase())}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-xs">📝</span>
                  <div className="text-left">
                    <p className="text-xs font-medium">{category.name}</p>
                    <p className="text-xs text-gray-500">{category.components.length} itens</p>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedComponentsSidebar;

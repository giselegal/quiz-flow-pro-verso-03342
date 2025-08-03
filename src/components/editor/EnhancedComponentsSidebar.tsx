import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { generateBlockDefinitions, getRegistryStats, ENHANCED_BLOCK_REGISTRY } from '@/config/enhancedBlockRegistry';
import { BlockDefinition } from '@/types/editor';

interface EnhancedComponentsSidebarProps {
  onAddComponent: (type: string) => void;
}

const EnhancedComponentsSidebar: React.FC<EnhancedComponentsSidebarProps> = ({
  onAddComponent
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Obter todas as definições de blocos do registry validado
  const allBlocks = generateBlockDefinitions();
  const registryStats = getRegistryStats();
  
  // Categorias baseadas nos tipos do registry
  const BLOCK_CATEGORIES = ['All', 'Text', 'Interactive', 'Media', 'Layout', 'E-commerce', 'Quiz', 'Content'];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedCategory(null);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category === 'All' ? null : category);
    setSearchQuery('');
  };

  // Filtrar blocos baseado na busca e categoria
  const filteredBlocks = allBlocks.filter(block => {
    const matchesSearch = !searchQuery || 
      block.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      block.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !selectedCategory || block.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Componentes</CardTitle>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar componentes..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-8"
          />
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-hidden">
        {/* Stats do Registry */}
        <div className="mb-4 p-2 bg-green-50 rounded-lg border border-green-200">
          <div className="text-xs text-green-600 font-medium">
            ✅ Registry Validado
          </div>
          <div className="text-xs text-gray-600">
            {registryStats.active} componentes • {registryStats.coverage} cobertura
          </div>
        </div>
        
        <ScrollArea className="h-full">
          {/* Categories */}
          {!searchQuery && (
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Categorias</h3>
              <div className="grid grid-cols-2 gap-2">
                {BLOCK_CATEGORIES.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleCategorySelect(category)}
                    className="justify-start h-auto p-2"
                  >
                    <div className="text-left">
                      <div className="font-medium">{category}</div>
                      <div className="text-xs text-muted-foreground">
                        {allBlocks.filter(b => b.category === category).length} itens
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Components */}
          <div className="space-y-2">
            {filteredBlocks.map((block) => (
              <Card key={block.type} className="p-3 cursor-pointer hover:bg-muted/50">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-md bg-primary/10">
                    <Plus className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-medium truncate">{block.name}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {block.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {block.description}
                    </p>
                    <Button
                      size="sm"
                      onClick={() => onAddComponent(block.type)}
                      className="h-6 text-xs"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Adicionar
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default EnhancedComponentsSidebar;

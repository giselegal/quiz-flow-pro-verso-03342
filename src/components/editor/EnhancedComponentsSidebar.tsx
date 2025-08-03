import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, ChevronDown, ChevronRight } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { generateBlockDefinitions } from '@/config/enhancedBlockRegistry';
import { BlockDefinition } from '@/types/editor';

interface EnhancedComponentsSidebarProps {
  onAddComponent: (type: string) => void;
}

const EnhancedComponentsSidebar: React.FC<EnhancedComponentsSidebarProps> = ({
  onAddComponent
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'Cabeçalho': true,
    'Quiz': true,
    'Venda - Atenção': true,
    'Venda - Interesse': false,
    'Venda - Desejo': false,
    'Venda - Ação': true,
    'Estrutura': false
  });

  // Obter todas as definições de blocos do registry validado
  const allBlocks = generateBlockDefinitions();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Filtrar blocos baseado na busca
  const filteredBlocks = allBlocks.filter(block => {
    const matchesSearch = !searchQuery || 
      block.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      block.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      block.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  // Agrupar blocos por categoria
  const groupedBlocks = filteredBlocks.reduce((groups, block) => {
    const category = block.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(block);
    return groups;
  }, {} as Record<string, BlockDefinition[]>);

  // Ordenar categorias na ordem AIDA
  const categoryOrder = [
    'Cabeçalho',
    'Quiz', 
    'Venda - Atenção',
    'Venda - Interesse', 
    'Venda - Desejo',
    'Venda - Ação',
    'Estrutura',
    'Outros'
  ];

  const orderedCategories = categoryOrder.filter(cat => groupedBlocks[cat]);

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
        <ScrollArea className="h-full">
          {/* Categories */}
          <div className="space-y-1">
            {orderedCategories.map((category) => (
              <div key={category} className="space-y-1">
                {/* Category Header */}
                <div 
                  className="flex items-center justify-between p-2 bg-muted/30 rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => toggleCategory(category)}
                >
                  <div className="flex items-center space-x-2">
                    {expandedCategories[category] ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                    <span className="text-sm font-medium">{category}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {groupedBlocks[category].length}
                  </Badge>
                </div>

                {/* Category Components */}
                {expandedCategories[category] && (
                  <div className="pl-6 space-y-2">
                    {groupedBlocks[category].map((block) => (
                      <Card key={block.type} className="p-3 cursor-pointer hover:bg-muted/50">
                        <div className="space-y-2">
                          {/* Nome do componente */}
                          <h4 className="text-sm font-medium truncate">{block.name}</h4>
                          
                          {/* Descrição do componente */}
                          <p className="text-xs text-muted-foreground leading-tight">
                            {block.description}
                          </p>
                          
                          {/* Botão adicionar */}
                          <Button
                            size="sm"
                            onClick={() => onAddComponent(block.type)}
                            className="w-full h-7 text-xs text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 font-medium"
                            style={{ 
                              backgroundColor: '#d1b586',
                              boxShadow: '0 2px 4px rgba(209, 181, 134, 0.3)'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#c4a373';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = '#d1b586';
                            }}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Adicionar
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default EnhancedComponentsSidebar;

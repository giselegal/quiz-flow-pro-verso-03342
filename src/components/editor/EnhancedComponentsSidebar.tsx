import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus } from 'lucide-react';
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

  // Obter todas as definições de blocos do registry validado
  const allBlocks = generateBlockDefinitions();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Filtrar blocos baseado apenas na busca
  const filteredBlocks = allBlocks.filter(block => {
    const matchesSearch = !searchQuery || 
      block.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      block.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
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
        <ScrollArea className="h-full">
          {/* Components */}
          <div className="space-y-2">
            {filteredBlocks.map((block) => (
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
                    className="w-full h-7 text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Adicionar
                  </Button>
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

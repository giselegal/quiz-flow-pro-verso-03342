import { DraggableComponentItem } from "@/components/editor/dnd/DraggableComponentItem";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { generateBlockDefinitions } from "@/config/enhancedBlockRegistry";
import { useEditor } from "@/context/EditorContext";
import { useSyncedScroll } from "@/hooks/useSyncedScroll";
import { BlockDefinition } from "@/types/editor";
import { ChevronDown, ChevronRight, GripVertical, Search } from "lucide-react";
import React, { useState } from "react";

interface EnhancedComponentsSidebarProps {
  // Props removidas - agora usa drag and drop
}

export const EnhancedComponentsSidebar: React.FC<EnhancedComponentsSidebarProps> = () => {
  const { scrollRef } = useSyncedScroll({ source: "components" });
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    Cabeçalho: true,
    Quiz: true,
    "Venda - Atenção": true,
    "Venda - Interesse": false,
    "Venda - Desejo": false,
    "Venda - Ação": true,
    Estrutura: false,
  });

  // Contexto do editor para adicionar blocos
  const {
    activeStageId,
    blockActions: { addBlock, updateBlock },
  } = useEditor();

  // Obter todas as definições de blocos do registry validado
  const allBlocks = generateBlockDefinitions();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  // Filtrar blocos baseado na busca
  const filteredBlocks = allBlocks.filter(block => {
    const matchesSearch =
      !searchQuery ||
      block.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      block.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      block.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  // Agrupar blocos por categoria
  const groupedBlocks = filteredBlocks.reduce(
    (groups, block) => {
      const category = block.category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(block);
      return groups;
    },
    {} as Record<string, BlockDefinition[]>
  );

  // Ordenar categorias na ordem AIDA
  const categoryOrder = [
    "Cabeçalho",
    "Quiz",
    "Venda - Atenção",
    "Venda - Interesse",
    "Venda - Desejo",
    "Venda - Ação",
    "Estrutura",
    "Outros",
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
            onChange={e => handleSearch(e.target.value)}
            className="pl-8"
          />
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden">
        <div ref={scrollRef} className="h-full overflow-y-auto overflow-x-hidden">
          {/* Categories */}
          <div className="space-y-1 p-0">
            {orderedCategories.map(category => (
              <div key={category} className="space-y-1">
                {/* Category Header */}
                <div
                  className="flex items-center justify-between p-1 bg-muted/30 rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
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
                  <div className="pl-4 space-y-1">
                    {groupedBlocks[category].map(block => (
                      <DraggableComponentItem
                        key={block.type}
                        blockType={block.type}
                        title={block.name}
                        description={block.description}
                        icon={<GripVertical className="h-4 w-4" />}
                        category={category}
                        className="w-full"
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Exportação padrão
export default EnhancedComponentsSidebar;

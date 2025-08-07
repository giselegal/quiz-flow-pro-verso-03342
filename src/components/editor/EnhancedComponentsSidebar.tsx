import { DraggableComponentItem } from "@/components/editor/dnd/DraggableComponentItem";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { generateBlockDefinitions } from "@/config/enhancedBlockRegistry";
import { useEditor } from "@/context/EditorContext";
import { useSyncedScroll } from "@/hooks/useSyncedScroll";
import { BlockDefinition } from "@/types/editor";
import { 
  ChevronDown, 
  ChevronRight, 
  GripVertical, 
  Search,
  Trophy,
  Type,
  MousePointer,
  FormInput,
  Scale,
  Layers
} from "lucide-react";
import React, { useState } from "react";

interface EnhancedComponentsSidebarProps {
  // Props removidas - agora usa drag and drop
}

export // Função para converter valores de margem em classes Tailwind (Sistema Universal)
const getMarginClass = (value: string | number, type: string): string => {
  const numValue = typeof value === "string" ? parseInt(value, 10) : value;

  if (isNaN(numValue) || numValue === 0) return "";

  const prefix = type === "top" ? "mt" : type === "bottom" ? "mb" : type === "left" ? "ml" : "mr";

  // Margens negativas
  if (numValue < 0) {
    const absValue = Math.abs(numValue);
    if (absValue <= 4) return `-${prefix}-1`;
    if (absValue <= 8) return `-${prefix}-2`;
    if (absValue <= 12) return `-${prefix}-3`;
    if (absValue <= 16) return `-${prefix}-4`;
    if (absValue <= 20) return `-${prefix}-5`;
    if (absValue <= 24) return `-${prefix}-6`;
    if (absValue <= 28) return `-${prefix}-7`;
    if (absValue <= 32) return `-${prefix}-8`;
    if (absValue <= 36) return `-${prefix}-9`;
    if (absValue <= 40) return `-${prefix}-10`;
    return `-${prefix}-10`; // Máximo para negativas
  }

  // Margens positivas (expandido para suportar até 100px)
  if (numValue <= 4) return `${prefix}-1`;
  if (numValue <= 8) return `${prefix}-2`;
  if (numValue <= 12) return `${prefix}-3`;
  if (numValue <= 16) return `${prefix}-4`;
  if (numValue <= 20) return `${prefix}-5`;
  if (numValue <= 24) return `${prefix}-6`;
  if (numValue <= 28) return `${prefix}-7`;
  if (numValue <= 32) return `${prefix}-8`;
  if (numValue <= 36) return `${prefix}-9`;
  if (numValue <= 40) return `${prefix}-10`;
  if (numValue <= 44) return `${prefix}-11`;
  if (numValue <= 48) return `${prefix}-12`;
  if (numValue <= 56) return `${prefix}-14`;
  if (numValue <= 64) return `${prefix}-16`;
  if (numValue <= 80) return `${prefix}-20`;
  if (numValue <= 96) return `${prefix}-24`;
  if (numValue <= 112) return `${prefix}-28`;
  return `${prefix}-32`; // Máximo suportado
};

const EnhancedComponentsSidebar: React.FC<EnhancedComponentsSidebarProps> = () => {
  const { scrollRef } = useSyncedScroll({ source: "components" });
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    Quiz: true,
    Interativo: true,
    CTA: true,
    Conteúdo: false,
    Legal: false,
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

  // Agrupar blocos por categoria corrigida com ícones
  const categoryIcons: Record<string, React.ComponentType<any>> = {
    Quiz: Trophy,
    Interativo: FormInput,
    CTA: MousePointer,
    Conteúdo: Type,
    Legal: Scale,
    Estrutura: Layers,
    Outros: GripVertical,
  };

  const groupedBlocks = filteredBlocks.reduce(
    (groups, block) => {
      // Mapear tipos de componentes para categorias organizadas
      let category = "Outros";
      
      switch (block.type) {
        case "quiz-intro-header":
          category = "Quiz";
          break;
        case "text-inline":
          category = "Conteúdo";
          break;
        case "image-display-inline":
          category = "Conteúdo";
          break;
        case "button-inline":
          category = "CTA";
          break;
        case "form-input":
          category = "Interativo";
          break;
        case "legal-notice-inline":
          category = "Legal";
          break;
        default:
          category = "Estrutura";
      }
      
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(block);
      return groups;
    },
    {} as Record<string, BlockDefinition[]>
  );

  // Ordenar categorias por relevância no quiz
  const categoryOrder = [
    "Quiz",
    "Interativo", 
    "CTA",
    "Conteúdo",
    "Legal",
    "Estrutura",
    "Outros",
  ];

  const orderedCategories = categoryOrder.filter(cat => groupedBlocks[cat]);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>🎯 Quiz Builder</CardTitle>
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
                  className="flex items-center justify-between p-2 bg-muted/30 rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => toggleCategory(category)}
                >
                  <div className="flex items-center space-x-2">
                    {expandedCategories[category] ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                    {React.createElement(categoryIcons[category] || GripVertical, { 
                      className: "h-4 w-4 text-primary" 
                    })}
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

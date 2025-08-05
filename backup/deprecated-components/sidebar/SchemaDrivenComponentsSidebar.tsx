import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, Zap, Type, Image, MousePointer, Layout, BarChart3, Palette } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComponentCategory {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  components: ComponentDefinition[];
}

interface ComponentDefinition {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ComponentType<any>;
  isPremium?: boolean;
  tags: string[];
}

interface SchemaDrivenComponentsSidebarProps {
  onComponentSelect?: (componentType: string) => void;
  className?: string;
}

const COMPONENT_CATEGORIES: ComponentCategory[] = [
  {
    id: "content",
    name: "Conteúdo",
    icon: Type,
    components: [
      {
        id: "headline",
        name: "Título",
        description: "Títulos e subtítulos",
        category: "content",
        icon: Type,
        tags: ["texto", "título"],
      },
      {
        id: "text",
        name: "Texto",
        description: "Parágrafos de texto",
        category: "content",
        icon: Type,
        tags: ["texto", "parágrafo"],
      },
      {
        id: "image",
        name: "Imagem",
        description: "Imagens e gráficos",
        category: "content",
        icon: Image,
        tags: ["imagem", "foto"],
      },
    ],
  },
  {
    id: "interactive",
    name: "Interativo",
    icon: MousePointer,
    components: [
      {
        id: "button",
        name: "Botão",
        description: "Botões de ação",
        category: "interactive",
        icon: MousePointer,
        tags: ["botão", "ação", "cta"],
      },
      {
        id: "form",
        name: "Formulário",
        description: "Campos de entrada",
        category: "interactive",
        icon: Layout,
        tags: ["formulário", "entrada"],
      },
    ],
  },
];

export const SchemaDrivenComponentsSidebar: React.FC<SchemaDrivenComponentsSidebarProps> = ({
  onComponentSelect,
  className = "",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const handleComponentClick = (componentId: string) => {
    onComponentSelect?.(componentId);
  };

  const filteredComponents = COMPONENT_CATEGORIES.flatMap(category =>
    category.components.filter(
      component =>
        (selectedCategory === "all" || component.category === selectedCategory) &&
        (searchTerm === "" ||
          component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          component.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          component.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
    )
  );

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
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Category tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="content">Conteúdo</TabsTrigger>
            <TabsTrigger value="interactive">Interativo</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Components List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {filteredComponents.map(component => {
            const IconComponent = component.icon;

            return (
              <Button
                key={component.id}
                variant="ghost"
                className="w-full justify-start h-auto p-3 text-left"
                onClick={() => handleComponentClick(component.id)}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <IconComponent className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-gray-900">{component.name}</p>
                      {component.isPremium && (
                        <Badge variant="secondary" className="text-xs">
                          <Zap className="h-3 w-3 mr-1" />
                          Pro
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{component.description}</p>
                  </div>
                </div>
              </Button>
            );
          })}

          {filteredComponents.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhum componente encontrado</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default SchemaDrivenComponentsSidebar;

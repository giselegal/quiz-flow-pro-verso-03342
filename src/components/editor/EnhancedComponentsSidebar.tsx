import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import {
  Search,
  Plus,
  ChevronDown,
  ChevronRight,
  GripVertical,
  Download,
  Rocket,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { generateBlockDefinitions } from "@/config/enhancedBlockRegistry";
import { BlockDefinition } from "@/types/editor";
import { useSyncedScroll } from "@/hooks/useSyncedScroll";
import { DraggableComponentItem } from "@/components/editor/dnd/DraggableComponentItem";
import { useEditor } from "@/context/EditorContext";

interface EnhancedComponentsSidebarProps {
  // Props removidas - agora usa drag and drop
}

export const EnhancedComponentsSidebar: React.FC<
  EnhancedComponentsSidebarProps
> = () => {
  const { scrollRef } = useSyncedScroll({ source: "components" });
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({
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

  // Função para carregar a Etapa 1
  const handleLoadStep1 = async () => {
    try {
      console.log("🚀 Carregando Etapa 1 do Quiz...");

      const step1Blocks = [
        {
          type: "image",
          properties: {
            src: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
            alt: "Logo Gisele Galvão",
            width: 120,
            height: 120,
            className: "mx-auto mb-4"
          }
        },
        {
          type: "text",
          properties: {
            content: "Progresso: 0% • Etapa 1 de 21",
            fontSize: "text-sm",
            textAlign: "text-center",
            color: "#8F7A6A"
          }
        },
        {
          type: "divider",
          properties: {
            color: "#B89B7A",
            thickness: 4,
            style: "solid"
          }
        },
        {
          type: "heading",
          properties: {
            content: "Chega de um guarda-roupa lotado e da sensação de que nada combina com você.",
            level: 1,
            fontSize: "text-3xl",
            fontWeight: "font-bold",
            textAlign: "text-center",
            color: "#432818"
          }
        },
        {
          type: "image",
          properties: {
            src: "https://res.cloudinary.com/dqljyf76t/image/upload/v1746838118/20250509_2137_Desordem_e_Reflex%C3%A3o_simple_compose_01jtvszf8sfaytz493z9f16rf2_z1c2up.webp",
            alt: "Transforme seu guarda-roupa",
            width: 600,
            height: 400,
            className: "object-cover w-full max-w-2xl h-80 rounded-xl mx-auto shadow-lg"
          }
        },
        {
          type: "text",
          properties: {
            content: "Em poucos minutos, descubra seu <strong style=\"color: #B89B7A;\">Estilo Predominante</strong> — e aprenda a montar looks que realmente refletem sua essência, com praticidade e confiança.",
            fontSize: "text-xl",
            textAlign: "text-center",
            color: "#432818"
          }
        },
        {
          type: "text",
          properties: {
            content: "COMO VOCÊ GOSTARIA DE SER CHAMADA?",
            fontSize: "text-lg",
            fontWeight: "font-bold",
            textAlign: "text-center",
            color: "#432818"
          }
        },
        {
          type: "text",
          properties: {
            content: "[CAMPO DE NOME - Digite seu nome aqui...]",
            fontSize: "text-base",
            textAlign: "text-center",
            color: "#8F7A6A",
            backgroundColor: "#F9F7F5",
            borderRadius: "rounded-lg",
            border: "2px dashed #B89B7A"
          }
        },
        {
          type: "button",
          properties: {
            text: "✨ Quero Descobrir meu Estilo Agora! ✨",
            variant: "primary",
            size: "large",
            backgroundColor: "#B89B7A",
            textColor: "#ffffff",
            textAlign: "text-center",
            borderRadius: "rounded-full"
          }
        },
        {
          type: "text",
          properties: {
            content: "🛡️ Seu nome é necessário para personalizar sua experiência. Ao clicar, você concorda com nossa política de privacidade.<br><br>© 2025 Gisele Galvão - Todos os direitos reservados",
            fontSize: "text-xs",
            textAlign: "text-center",
            color: "#6B7280"
          }
        }
      ];

      let addedCount = 0;
      for (const blockData of step1Blocks) {
        try {
          console.log(`📦 Adicionando bloco Etapa 1 ${addedCount + 1}:`, blockData.type);

          const newBlockId = addBlock(blockData.type, activeStageId || undefined);
          addedCount++;

          // Atualizar propriedades do bloco após criação
          setTimeout(() => {
            updateBlock(newBlockId, blockData.properties as any);
          }, 100);
        } catch (blockError) {
          console.warn(`⚠️ Erro ao adicionar bloco ${blockData.type}:`, blockError);
        }
      }

      toast({
        title: "Etapa 1 Carregada! 🎉",
        description: `${addedCount} blocos da Etapa 1 adicionados com sucesso`,
      });
    } catch (error) {
      console.error("❌ Erro ao carregar Etapa 1:", error);
      toast({
        title: "Erro",
        description: "Erro ao carregar Etapa 1",
        variant: "destructive",
      });
    }
  };

  // Obter todas as definições de blocos do registry validado
  const allBlocks = generateBlockDefinitions();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  // Filtrar blocos baseado na busca
  const filteredBlocks = allBlocks.filter((block) => {
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
    {} as Record<string, BlockDefinition[]>,
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

  const orderedCategories = categoryOrder.filter((cat) => groupedBlocks[cat]);

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
        <div
          ref={scrollRef}
          className="h-full overflow-y-auto overflow-x-hidden"
        >
          {/* Templates Section */}
          <div className="mb-4 p-2 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
            <h3 className="text-sm font-semibold text-amber-800 mb-2">Templates</h3>
            <div className="space-y-2">
              <Button
                onClick={handleLoadStep1}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white"
                size="sm"
              >
                <Rocket className="w-4 h-4 mr-2" />
                Carregar Etapa 1 do Quiz
              </Button>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-1 p-0">
            {orderedCategories.map((category) => (
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
                    {groupedBlocks[category].map((block) => (
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

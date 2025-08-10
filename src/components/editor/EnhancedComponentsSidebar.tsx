import { DraggableComponentItem } from "../../components/editor/dnd/DraggableComponentItem";
import { Badge } from "../../components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { generateBlockDefinitions } from "../../config/enhancedBlockRegistry";
import { QUIZ_CONFIGURATION } from "../../config/quizConfiguration";
import { useEditor } from "../../context/EditorContext";
import { useSyncedScroll } from "../../hooks/useSyncedScroll";
import { BlockDefinition } from "../../types/editor";
import {
  ChevronDown,
  ChevronRight,
  FormInput,
  GripVertical,
  HelpCircle,
  Layers,
  MousePointer,
  Scale,
  Search,
  Settings,
  Trophy,
  Type,
} from "lucide-react";
import React, { useState } from "react";

interface EnhancedComponentsSidebarProps {
  // Props removidas - agora usa drag and drop
}

export // Função para converter valores de margem em classes Tailwind (Sistema Universal)
const getMarginClass = (value: string | number, type: string): string => {
  const numValue = typeof value === "string" ? parseInt(value, 10) : value;

  if (isNaN(numValue) || numValue === 0) return "";

  const prefix =
    type === "top"
      ? "mt"
      : type === "bottom"
        ? "mb"
        : type === "left"
          ? "ml"
          : "mr";

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

const EnhancedComponentsSidebar: React.FC<
  EnhancedComponentsSidebarProps
> = () => {
  const { scrollRef } = useSyncedScroll({ source: "components" });
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({
    "Questões do Quiz": true,
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

  // Gerar blocos do quiz baseados na configuração JSON
  const generateQuizBlocks = (): BlockDefinition[] => {
    // Primeiro, criar o bloco de cabeçalho padrão
    const headerBlock: BlockDefinition = {
      type: "quiz-intro-header",
      name: "Cabeçalho do Quiz",
      description: "Cabeçalho configurável com logo e barra decorativa",
      category: "Questões do Quiz",
      icon: Settings,
      component: "QuizIntroHeaderBlock" as any,
      properties: {
        enabled: {
          type: "boolean" as const,
          default: true,
          label: "Habilitar Cabeçalho",
          description: "Ativar ou desativar o cabeçalho",
          category: "general" as const,
        },
        showLogo: {
          type: "boolean" as const,
          default: true,
          label: "Mostrar Logo",
          description: "Exibir logo no cabeçalho",
          category: "general" as const,
        },
        showDecorativeBar: {
          type: "boolean" as const,
          default: true,
          label: "Barra Decorativa",
          description: "Exibir barra decorativa",
          category: "general" as const,
        },
        scale: {
          type: "range" as const,
          default: 100,
          label: "Escala",
          description: "Tamanho geral do componente (50% - 110%)",
          category: "layout" as const,
          min: 50,
          max: 110,
        },
      },
      label: "Cabeçalho do Quiz",
      defaultProps: {
        enabled: true,
        showLogo: true,
        showDecorativeBar: true,
        logoUrl:
          "https://res.cloudinary.com/dg3fsapzu/image/upload/v1723251877/LOGO_completa_white_clfcga.png",
        logoAlt: "Logo",
        logoSize: 100,
        barColor: "#B89B7A",
        barHeight: 4,
        barPosition: "bottom",
        scale: 100,
        alignment: "center",
        backgroundColor: "transparent",
        backgroundOpacity: 100,
      },
      tags: [`quiz`, `header`, `cabeçalho`],
    };

    // Criar o bloco de introdução da step 1
    const introBlock: BlockDefinition = {
      type: "step01-intro",
      name: "Introdução - Step 1",
      description: "Componente de introdução para a primeira etapa do quiz",
      category: "Questões do Quiz",
      icon: Type,
      component: "IntroBlock" as any,
      properties: {
        enabled: {
          type: "boolean" as const,
          default: true,
          label: "Habilitar Introdução",
          description: "Ativar ou desativar o bloco de introdução",
          category: "general" as const,
        },
        title: {
          type: "string" as const,
          default: "Bem-vindo ao Quiz de Estilo Pessoal",
          label: "Título",
          description: "Título principal da introdução",
          category: "content" as const,
        },
        subtitle: {
          type: "string" as const,
          default: "Descubra seu estilo único",
          label: "Subtítulo",
          description: "Subtítulo descritivo",
          category: "content" as const,
        },
        description: {
          type: "textarea" as const,
          default:
            "Responda às perguntas a seguir para descobrir qual estilo combina mais com você.",
          label: "Descrição",
          description: "Texto explicativo do quiz",
          category: "content" as const,
        },
        showImage: {
          type: "boolean" as const,
          default: true,
          label: "Mostrar Imagem",
          description: "Exibir imagem ilustrativa",
          category: "content" as const,
        },
        scale: {
          type: "range" as const,
          default: 100,
          label: "Escala",
          description: "Tamanho geral do componente (50% - 110%)",
          category: "layout" as const,
          min: 50,
          max: 110,
        },
      },
      label: "Introdução - Step 1",
      defaultProps: {
        enabled: true,
        title: "Bem-vindo ao Quiz de Estilo Pessoal",
        subtitle: "Descubra seu estilo único",
        description:
          "Responda às perguntas a seguir para descobrir qual estilo combina mais com você.",
        showImage: true,
        imageUrl:
          "https://res.cloudinary.com/dg3fsapzu/image/upload/v1723251877/intro-illustration.png",
        imageAlt: "Quiz Illustration",
        scale: 100,
        alignment: "center",
        backgroundColor: "transparent",
        textColor: "#000000",
      },
      tags: [`quiz`, `intro`, `step-1`, `introdução`],
    };

    // Depois, criar os blocos das etapas
    const stepBlocks = QUIZ_CONFIGURATION.steps.map((step, index) => ({
      type: `quiz-${step.type}`,
      name: `${step.title}`,
      description:
        step.description || `Etapa ${index + 1} do quiz de estilo pessoal`,
      category: "Questões do Quiz",
      icon:
        step.type === "questions"
          ? HelpCircle
          : step.type === "result"
            ? Trophy
            : Settings,
      component: "QuizQuestionBlock" as any,
      properties: {
        stepIndex: {
          type: "number" as const,
          default: index,
          label: "Índice da Etapa",
          description: "Posição da etapa no quiz",
          category: "general" as const,
        },
        stepType: {
          type: "string" as const,
          default: step.type,
          label: "Tipo da Etapa",
          description: "Categoria da etapa do quiz",
          category: "general" as const,
        },
        showProgress: {
          type: "boolean" as const,
          default: step.progressBar?.show !== false,
          label: "Mostrar Progresso",
          description: "Exibir barra de progresso",
          category: "behavior" as const,
        },
        scale: {
          type: "range" as const,
          default: 100,
          label: "Escala",
          description: "Tamanho geral do componente (50% - 110%)",
          category: "layout" as const,
          min: 50,
          max: 110,
        },
      },
      label: step.title,
      defaultProps: {
        stepIndex: index,
        stepType: step.type,
        showProgress: step.progressBar?.show !== false,
        columns: step.rules?.colunas || 1,
        multiSelect: step.rules?.multiSelect || 1,
        questions: step.questions || [],
        styles: step.styles || [],
        scale: 100,
      },
      defaultContent: {
        questions: step.questions || [],
        rules: step.rules || {},
        progressBar: step.progressBar || {},
      },
      tags: [`quiz`, `${step.type}`, `etapa-${index + 1}`],
    }));

    return [headerBlock, introBlock, ...stepBlocks];
  };

  // Bloco decorativo separado
  const decorativeBarBlock: BlockDefinition = {
    type: "decorative-bar-inline",
    name: "Barra Decorativa",
    description: "Barra decorativa com gradiente dourado",
    category: "Layout e Design",
    icon: Settings,
    component: "DecorativeBarInlineBlock" as any,
    properties: {
      width: {
        type: "string" as const,
        default: "100%",
        label: "Largura",
        description: "Largura da barra",
        category: "layout" as const,
      },
      height: {
        type: "number" as const,
        default: 4,
        label: "Altura",
        description: "Altura da barra em pixels",
        category: "layout" as const,
      },
      color: {
        type: "color" as const,
        default: "#B89B7A",
        label: "Cor Principal",
        description: "Cor principal da barra",
        category: "styling" as const,
      },
      showShadow: {
        type: "boolean" as const,
        default: true,
        label: "Mostrar Sombra",
        description: "Exibir sombra na barra",
        category: "styling" as const,
      },
    },
    label: "Barra Decorativa",
    defaultProps: {
      width: "100%",
      height: 4,
      color: "#B89B7A",
      gradientColors: ["#B89B7A", "#D4C2A8", "#B89B7A"],
      borderRadius: 3,
      showShadow: true,
      backgroundColor: "transparent",
    },
    tags: [`decorativo`, `barra`, `dourado`],
  };

  // Obter todas as definições de blocos do registry validado + blocos do quiz
  const allBlocks = [
    ...generateQuizBlocks(),
    decorativeBarBlock,
    ...generateBlockDefinitions(),
  ];

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

  // Agrupar blocos por categoria corrigida com ícones
  const categoryIcons: Record<string, React.ComponentType<any>> = {
    "Questões do Quiz": HelpCircle,
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
      // Usar a categoria definida no bloco ou mapear tipos de componentes para categorias organizadas
      let category = block.category || "Outros";

      // Se não tiver categoria definida, mapear baseado no tipo
      if (category === "Outros") {
        switch (block.type) {
          case "quiz-intro-header":
            category = "Quiz";
            break;
          case "step01-intro":
            category = "Quiz";
            break;
          case "decorative-bar-inline":
            category = "Layout e Design";
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
    "Questões do Quiz",
    "Quiz",
    "Interativo",
    "CTA",
    "Conteúdo",
    "Legal",
    "Estrutura",
    "Outros",
  ];

  const orderedCategories = categoryOrder.filter((cat) => groupedBlocks[cat]);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>🎯 Quiz Builder</CardTitle>
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
          {/* Categories */}
          <div className="space-y-1 p-0">
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
                    {React.createElement(
                      categoryIcons[category] || GripVertical,
                      {
                        className: "h-4 w-4 text-primary",
                      }
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

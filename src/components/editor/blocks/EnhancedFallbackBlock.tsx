import React from "react";
import { cn } from "../../../lib/utils";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import type { BlockComponentProps } from "../../../types/blocks";

// Componente de fallback mais rico para componentes não implementados
export const EnhancedFallbackBlock: React.FC<
  BlockComponentProps & { blockType: string }
> = ({
  block,
  isSelected = false,
  onClick,
  onPropertyChange,
  blockType,
  className = "",
}) => {
  const getComponentInfo = (type: string) => {
    const componentMap: Record<
      string,
      { name: string; description: string; category: string; icon: string }
    > = {
      "section-divider": {
        name: "Divisor de Seção",
        description: "Linha divisória entre seções com estilo customizável",
        category: "Layout",
        icon: "➖",
      },
      "flex-container-horizontal": {
        name: "Container Flex Horizontal",
        description:
          "Container flexbox para organizar elementos horizontalmente",
        category: "Layout",
        icon: "↔️",
      },
      "flex-container-vertical": {
        name: "Container Flex Vertical",
        description: "Container flexbox para organizar elementos verticalmente",
        category: "Layout",
        icon: "↕️",
      },
      "feature-highlight": {
        name: "Destaque de Recurso",
        description: "Card destacado para apresentar recursos importantes",
        category: "Conteúdo",
        icon: "⭐",
      },
      "testimonial-card": {
        name: "Card de Depoimento",
        description: "Card individual para exibir depoimentos de clientes",
        category: "Social Proof",
        icon: "💬",
      },
      "stats-counter": {
        name: "Contador de Estatísticas",
        description: "Números animados para exibir estatísticas importantes",
        category: "Métricas",
        icon: "📊",
      },
      "progress-bar-modern": {
        name: "Barra de Progresso Moderna",
        description: "Barra de progresso com animações e estilo moderno",
        category: "UI",
        icon: "📈",
      },
      "quiz-question-modern": {
        name: "Questão Quiz Moderna",
        description: "Componente de questão com design moderno e interativo",
        category: "Quiz",
        icon: "❓",
      },
      "quiz-question-configurable": {
        name: "Questão Quiz Configurável",
        description: "Questão totalmente configurável com múltiplas opções",
        category: "Quiz",
        icon: "⚙️",
      },
      "image-text-card": {
        name: "Card Imagem + Texto",
        description: "Card combinando imagem e texto de forma elegante",
        category: "Conteúdo",
        icon: "🖼️",
      },
    };

    return (
      componentMap[type] || {
        name: type.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
        description: "Componente personalizado em desenvolvimento",
        category: "Personalizado",
        icon: "🔧",
      }
    );
  };

  const info = getComponentInfo(blockType);

  return (
    <div
      className={cn(
        "border-2 border-dashed border-orange-300 bg-orange-50 rounded-lg p-6 text-center transition-all duration-200",
        "hover:border-orange-400 hover:bg-orange-100",
        isSelected && "border-orange-500 bg-orange-100 ring-2 ring-orange-200",
        className,
      )}
      onClick={onClick}
    >
      <div className="space-y-4">
        {/* Ícone e título */}
        <div className="flex flex-col items-center space-y-2">
          <div className="text-4xl">{info.icon}</div>
          <h3 className="text-lg font-semibold text-orange-900">{info.name}</h3>
          <Badge
            variant="outline"
            className="bg-orange-100 text-orange-800 border-orange-300"
          >
            {info.category}
          </Badge>
        </div>

        {/* Descrição */}
        <p className="text-orange-700 text-sm max-w-md mx-auto">
          {info.description}
        </p>

        {/* Status de desenvolvimento */}
        <div className="bg-white rounded-md p-3 border border-orange-200">
          <div className="text-xs text-orange-600 font-medium mb-1">
            🚧 Em Desenvolvimento
          </div>
          <div className="text-xs text-orange-500">
            Tipo:{" "}
            <code className="bg-orange-100 px-1 rounded">{blockType}</code>
          </div>
        </div>

        {/* Informações para o desenvolvedor */}
        <details className="text-left bg-white rounded-md border border-orange-200">
          <summary className="p-2 text-xs font-medium text-orange-700 cursor-pointer hover:bg-orange-50">
            🔍 Informações do Bloco
          </summary>
          <div className="p-3 border-t border-orange-200 text-xs text-orange-600 space-y-1">
            <div>
              <strong>ID:</strong> {block.id}
            </div>
            <div>
              <strong>Tipo:</strong> {blockType}
            </div>
            <div>
              <strong>Propriedades:</strong>
            </div>
            <pre className="bg-orange-50 p-2 rounded text-xs overflow-auto">
              {JSON.stringify(block.properties || {}, null, 2)}
            </pre>
          </div>
        </details>

        {/* Botão de configuração */}
        <Button
          variant="outline"
          size="sm"
          className="border-orange-300 text-orange-700 hover:bg-orange-100"
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
        >
          📝 Configurar Propriedades
        </Button>
      </div>
    </div>
  );
};

export default EnhancedFallbackBlock;

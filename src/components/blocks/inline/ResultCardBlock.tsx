import { cn } from "@/lib/utils";
import type { BlockComponentProps } from "@/types/blocks";
import React from "react";

interface ResultCardProperties {
  resultTitle: string;
  resultDescription?: string;
  score?: number;
  percentage?: number;
  category?: string;
  level?: "beginner" | "intermediate" | "advanced" | "expert";
  showScore?: boolean;
  showPercentage?: boolean;
  cardStyle?: "default" | "outlined" | "elevated" | "flat";
  colorScheme?: "default" | "success" | "warning" | "info" | "primary" | "secondary";
  showRecommendations?: boolean;
  recommendations?: string;
}

const ResultCardBlock: React.FC<BlockComponentProps> = ({
  block,
  properties,
  isSelected,
  onClick,
  onPropertyChange,
}) => {
  const {
    resultTitle = "Resultado do Quiz",
    resultDescription = "Descrição detalhada do seu resultado...",
    score = 0,
    percentage = 0,
    category = "",
    level = "intermediate",
    showScore = true,
    showPercentage = true,
    cardStyle = "default",
    colorScheme = "default",
    showRecommendations = false,
    recommendations = "",
  } = (properties || {}) as ResultCardProperties;

  const handlePropertyUpdate = (key: string, value: any) => {
    onPropertyChange?.(key, value);
  };

  const getCardStyleClass = () => {
    const styleMap = {
      default: "bg-white border border-gray-200 shadow-sm",
      outlined: "bg-white border-2 border-gray-300",
      elevated: "bg-white shadow-lg border border-gray-100",
      flat: "bg-gray-50 border-0",
    };
    return styleMap[cardStyle] || styleMap.default;
  };

  const getColorSchemeClass = () => {
    const colorMap = {
      default: "border-gray-200",
      success: "border-green-200 bg-green-50",
      warning: "border-yellow-200 bg-yellow-50",
      info: "border-blue-200 bg-blue-50",
      primary: "border-indigo-200 bg-indigo-50",
      secondary: "border-purple-200 bg-purple-50",
    };
    return colorMap[colorScheme] || colorMap.default;
  };

  const getLevelColor = () => {
    const levelColors = {
      beginner: "bg-green-100 text-green-800",
      intermediate: "bg-blue-100 text-blue-800",
      advanced: "bg-orange-100 text-orange-800",
      expert: "bg-red-100 text-red-800",
    };
    return levelColors[level] || levelColors.intermediate;
  };

  const getLevelLabel = () => {
    const levelLabels = {
      beginner: "Iniciante",
      intermediate: "Intermediário",
      advanced: "Avançado",
      expert: "Especialista",
    };
    return levelLabels[level] || levelLabels.intermediate;
  };

  return (
    <div
      className={cn(
        "result-card-block w-full transition-all duration-200 rounded-lg p-6",
        getCardStyleClass(),
        getColorSchemeClass(),
        isSelected && "ring-2 ring-blue-500 ring-opacity-50"
      )}
      data-block-id={block.id}
      onClick={onClick}
    >
      {/* Cabeçalho do Card */}
      <div className="mb-4">
        <h3
          className={cn(
            "text-2xl font-bold text-gray-900 mb-2 transition-all duration-200",
            isSelected && "outline-none border-b-2 border-blue-500"
          )}
          contentEditable={isSelected}
          suppressContentEditableWarning
          onBlur={e => handlePropertyUpdate("resultTitle", e.target.textContent || "")}
        >
          {resultTitle}
        </h3>

        {/* Badges de categoria e nível */}
        <div className="flex flex-wrap gap-2 mb-3">
          {(category || isSelected) && (
            <span
              className={cn(
                "px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium",
                isSelected && "outline-none border border-blue-500"
              )}
              contentEditable={isSelected}
              suppressContentEditableWarning
              onBlur={e => handlePropertyUpdate("category", e.target.textContent || "")}
            >
              {category || "Categoria"}
            </span>
          )}

          <span className={cn("px-3 py-1 rounded-full text-sm font-medium", getLevelColor())}>
            {getLevelLabel()}
          </span>
        </div>
      </div>

      {/* Pontuação e Percentual */}
      {(showScore || showPercentage) && (
        <div className="flex justify-between items-center mb-4 p-4 bg-gray-50 rounded-lg">
          {showScore && (
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{score}</div>
              <div className="text-sm text-gray-600">Pontos</div>
            </div>
          )}

          {showPercentage && (
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{percentage}%</div>
              <div className="text-sm text-gray-600">Acerto</div>
            </div>
          )}

          {/* Barra de progresso visual */}
          {showPercentage && (
            <div className="flex-1 mx-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Descrição */}
      <div className="mb-4">
        <p
          className={cn(
            "text-gray-700 leading-relaxed transition-all duration-200",
            isSelected && "outline-none border border-blue-300 rounded p-2"
          )}
          contentEditable={isSelected}
          suppressContentEditableWarning
          onBlur={e => handlePropertyUpdate("resultDescription", e.target.textContent || "")}
        >
          {resultDescription}
        </p>
      </div>

      {/* Recomendações */}
      {showRecommendations && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Recomendações</h4>
          <p
            className={cn(
              "text-blue-800 text-sm leading-relaxed transition-all duration-200",
              isSelected && "outline-none border border-blue-400 rounded p-2",
              !recommendations && isSelected && "text-blue-400"
            )}
            contentEditable={isSelected}
            suppressContentEditableWarning
            onBlur={e => handlePropertyUpdate("recommendations", e.target.textContent || "")}
          >
            {recommendations || (isSelected ? "Clique para adicionar recomendações..." : "")}
          </p>
        </div>
      )}

      {/* Controles de edição inline quando selecionado */}
      {isSelected && (
        <div className="mt-6 p-4 bg-white border border-gray-200 rounded-lg">
          <h4 className="text-sm font-semibold mb-3">Configurações do Card</h4>

          <div className="grid grid-cols-2 gap-3 text-sm">
            {/* Pontuação */}
            <div>
              <label className="block text-gray-600 mb-1">Pontuação</label>
              <input
                type="number"
                value={score}
                onChange={e => handlePropertyUpdate("score", parseInt(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded px-2 py-1"
                min="0"
                max="100"
              />
            </div>

            {/* Percentual */}
            <div>
              <label className="block text-gray-600 mb-1">Percentual (%)</label>
              <input
                type="number"
                value={percentage}
                onChange={e => handlePropertyUpdate("percentage", parseInt(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded px-2 py-1"
                min="0"
                max="100"
              />
            </div>

            {/* Nível */}
            <div>
              <label className="block text-gray-600 mb-1">Nível</label>
              <select
                value={level}
                onChange={e => handlePropertyUpdate("level", e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1"
              >
                <option value="beginner">Iniciante</option>
                <option value="intermediate">Intermediário</option>
                <option value="advanced">Avançado</option>
                <option value="expert">Especialista</option>
              </select>
            </div>

            {/* Estilo do Card */}
            <div>
              <label className="block text-gray-600 mb-1">Estilo</label>
              <select
                value={cardStyle}
                onChange={e => handlePropertyUpdate("cardStyle", e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1"
              >
                <option value="default">Padrão</option>
                <option value="outlined">Com Borda</option>
                <option value="elevated">Elevado</option>
                <option value="flat">Plano</option>
              </select>
            </div>

            {/* Esquema de Cores */}
            <div>
              <label className="block text-gray-600 mb-1">Cores</label>
              <select
                value={colorScheme}
                onChange={e => handlePropertyUpdate("colorScheme", e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1"
              >
                <option value="default">Padrão</option>
                <option value="success">Sucesso</option>
                <option value="warning">Aviso</option>
                <option value="info">Informação</option>
                <option value="primary">Primário</option>
                <option value="secondary">Secundário</option>
              </select>
            </div>

            {/* Switches */}
            <div className="col-span-2 space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showScore}
                  onChange={e => handlePropertyUpdate("showScore", e.target.checked)}
                />
                <span>Mostrar pontuação</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showPercentage}
                  onChange={e => handlePropertyUpdate("showPercentage", e.target.checked)}
                />
                <span>Mostrar percentual</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showRecommendations}
                  onChange={e => handlePropertyUpdate("showRecommendations", e.target.checked)}
                />
                <span>Mostrar recomendações</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultCardBlock;

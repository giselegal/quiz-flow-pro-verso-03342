import { cn } from "@/lib/utils";
import type { BlockComponentProps } from "@/types/blocks";
import { Award, Check, Crown, Heart, Medal, Star, Target, Trophy } from "lucide-react";
import React from "react";

interface ResultHeaderProperties {
  title: string;
  subtitle?: string;
  description?: string;
  resultType?: string;
  showIcon?: boolean;
  iconName?: "trophy" | "star" | "crown" | "award" | "medal" | "target" | "check" | "heart";
  headerStyle?: "centered" | "left" | "right";
  backgroundColor?:
    | "transparent"
    | "primary"
    | "secondary"
    | "muted"
    | "success"
    | "warning"
    | "info";
}

const ResultHeaderBlock: React.FC<BlockComponentProps> = ({
  block,
  properties,
  isSelected,
  onClick,
  onPropertyChange,
}) => {
  const {
    title = "Seu Resultado",
    subtitle = "",
    description = "",
    resultType = "",
    showIcon = true,
    iconName = "trophy",
    headerStyle = "centered",
    backgroundColor = "transparent",
  } = (properties || {}) as ResultHeaderProperties;

  const handlePropertyUpdate = (key: string, value: any) => {
    onPropertyChange?.(key, value);
  };

  const getIcon = () => {
    const iconMap = {
      trophy: Trophy,
      star: Star,
      crown: Crown,
      award: Award,
      medal: Medal,
      target: Target,
      check: Check,
      heart: Heart,
    };
    const IconComponent = iconMap[iconName] || Trophy;
    return <IconComponent className="w-12 h-12 mb-4 text-yellow-500" />;
  };

  const getAlignmentClass = () => {
    const alignMap = {
      centered: "text-center items-center",
      left: "text-left items-start",
      right: "text-right items-end",
    };
    return alignMap[headerStyle] || alignMap.centered;
  };

  const getBackgroundClass = () => {
    const bgMap = {
      transparent: "bg-transparent",
      primary: "bg-blue-50 border border-blue-200",
      secondary: "bg-gray-50 border border-gray-200",
      muted: "bg-gray-100 border border-gray-300",
      success: "bg-green-50 border border-green-200",
      warning: "bg-yellow-50 border border-yellow-200",
      info: "bg-blue-50 border border-blue-200",
    };
    return bgMap[backgroundColor] || bgMap.transparent;
  };

  return (
    <div
      className={cn(
        "result-header-block w-full transition-all duration-200 p-6 rounded-lg",
        getBackgroundClass(),
        isSelected && "ring-2 ring-blue-500 ring-opacity-50"
      )}
      data-block-id={block.id}
      onClick={onClick}
    >
      <div className={cn("flex flex-col", getAlignmentClass())}>
        {/* Ícone */}
        {showIcon && !isSelected && <div className="mb-4">{getIcon()}</div>}

        {/* Título principal */}
        <h1
          className={cn(
            "text-4xl md:text-5xl font-bold mb-4 text-gray-900 transition-all duration-200",
            isSelected && "outline-none border-b-2 border-blue-500"
          )}
          contentEditable={isSelected}
          suppressContentEditableWarning
          onBlur={e => handlePropertyUpdate("title", e.target.textContent || "")}
        >
          {title}
        </h1>

        {/* Tipo de resultado */}
        {(resultType || isSelected) && (
          <div className="mb-3">
            <span
              className={cn(
                "inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium",
                isSelected && "outline-none border border-blue-500"
              )}
              contentEditable={isSelected}
              suppressContentEditableWarning
              onBlur={e => handlePropertyUpdate("resultType", e.target.textContent || "")}
            >
              {resultType || "Tipo de Resultado"}
            </span>
          </div>
        )}

        {/* Subtítulo */}
        {(subtitle || isSelected) && (
          <h2
            className={cn(
              "text-xl md:text-2xl font-semibold mb-3 text-gray-700 transition-all duration-200",
              isSelected && "outline-none border-b border-blue-300",
              !subtitle && isSelected && "text-gray-400"
            )}
            contentEditable={isSelected}
            suppressContentEditableWarning
            onBlur={e => handlePropertyUpdate("subtitle", e.target.textContent || "")}
          >
            {subtitle || (isSelected ? "Clique para adicionar subtítulo..." : "")}
          </h2>
        )}

        {/* Descrição */}
        {(description || isSelected) && (
          <p
            className={cn(
              "text-lg text-gray-600 max-w-2xl leading-relaxed transition-all duration-200",
              isSelected && "outline-none border border-blue-300 rounded p-2",
              !description && isSelected && "text-gray-400"
            )}
            contentEditable={isSelected}
            suppressContentEditableWarning
            onBlur={e => handlePropertyUpdate("description", e.target.textContent || "")}
          >
            {description || (isSelected ? "Clique para adicionar descrição..." : "")}
          </p>
        )}
      </div>

      {/* Controles de edição inline quando selecionado */}
      {isSelected && (
        <div className="mt-6 p-4 bg-white border border-gray-200 rounded-lg">
          <h4 className="text-sm font-semibold mb-3">Configurações do Cabeçalho</h4>

          <div className="grid grid-cols-2 gap-3 text-sm">
            {/* Mostrar ícone */}
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showIcon}
                onChange={e => handlePropertyUpdate("showIcon", e.target.checked)}
              />
              <span>Mostrar ícone</span>
            </label>

            {/* Tipo de ícone */}
            <div>
              <label className="block text-gray-600 mb-1">Ícone</label>
              <select
                value={iconName}
                onChange={e => handlePropertyUpdate("iconName", e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1"
                disabled={!showIcon}
              >
                <option value="trophy">Troféu</option>
                <option value="star">Estrela</option>
                <option value="crown">Coroa</option>
                <option value="award">Prêmio</option>
                <option value="medal">Medalha</option>
                <option value="target">Alvo</option>
                <option value="check">Check</option>
                <option value="heart">Coração</option>
              </select>
            </div>

            {/* Estilo do cabeçalho */}
            <div>
              <label className="block text-gray-600 mb-1">Alinhamento</label>
              <select
                value={headerStyle}
                onChange={e => handlePropertyUpdate("headerStyle", e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1"
              >
                <option value="centered">Centralizado</option>
                <option value="left">Esquerda</option>
                <option value="right">Direita</option>
              </select>
            </div>

            {/* Cor de fundo */}
            <div>
              <label className="block text-gray-600 mb-1">Fundo</label>
              <select
                value={backgroundColor}
                onChange={e => handlePropertyUpdate("backgroundColor", e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1"
              >
                <option value="transparent">Transparente</option>
                <option value="primary">Primário</option>
                <option value="secondary">Secundário</option>
                <option value="muted">Sutil</option>
                <option value="success">Sucesso</option>
                <option value="warning">Aviso</option>
                <option value="info">Informação</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultHeaderBlock;

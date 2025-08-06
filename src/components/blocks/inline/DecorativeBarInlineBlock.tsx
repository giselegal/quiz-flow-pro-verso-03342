import React from "react";
import { cn } from "@/lib/utils";
import type { BlockComponentProps } from "@/types/blocks";

interface DecorativeBarInlineProperties {
  height?: number;
  width?: string;
  backgroundColor?: string;
  gradientFrom?: string;
  gradientTo?: string;
  useGradient?: boolean;
  borderRadius?: "none" | "sm" | "md" | "lg" | "full";
  alignment?: "left" | "center" | "right";
  margin?: "none" | "sm" | "md" | "lg";
  opacity?: number;
  pattern?: "solid" | "dashed" | "dotted" | "double";
  animationType?: "none" | "pulse" | "slide" | "fade";
}

const DecorativeBarInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  properties,
  isSelected,
  onClick,
  onPropertyChange,
}) => {
  const {
    height = 4,
    width = "100%",
    backgroundColor = "#B89B7A",
    gradientFrom = "#B89B7A",
    gradientTo = "#432818",
    useGradient = false,
    borderRadius = "full",
    alignment = "center",
    margin = "md",
    opacity = 1,
    pattern = "solid",
    animationType = "none",
  } = (properties || {}) as DecorativeBarInlineProperties;

  const handlePropertyUpdate = (key: string, value: any) => {
    onPropertyChange?.(key, value);
  };

  const getAlignmentClass = () => {
    const alignMap = {
      left: "justify-start",
      center: "justify-center",
      right: "justify-end",
    };
    return alignMap[alignment] || alignMap.center;
  };

  const getMarginClass = () => {
    const marginMap = {
      none: "",
      sm: "my-2",
      md: "my-4",
      lg: "my-8",
    };
    return marginMap[margin] || marginMap.md;
  };

  const getBorderRadiusClass = () => {
    const radiusMap = {
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      full: "rounded-full",
    };
    return radiusMap[borderRadius] || radiusMap.full;
  };

  const getPatternStyle = () => {
    if (pattern === "dashed") {
      return {
        borderTop: `${height}px dashed ${backgroundColor}`,
        height: 0,
        background: "none",
      };
    }
    if (pattern === "dotted") {
      return {
        borderTop: `${height}px dotted ${backgroundColor}`,
        height: 0,
        background: "none",
      };
    }
    if (pattern === "double") {
      return {
        borderTop: `${Math.ceil(height / 3)}px solid ${backgroundColor}`,
        borderBottom: `${Math.ceil(height / 3)}px solid ${backgroundColor}`,
        height: Math.ceil(height / 3),
        background: "none",
      };
    }
    return {};
  };

  const getAnimationClass = () => {
    const animationMap = {
      none: "",
      pulse: "animate-pulse",
      slide: "animate-slide",
      fade: "animate-fade",
    };
    return animationMap[animationType] || animationMap.none;
  };

  const getBackgroundStyle = () => {
    if (pattern !== "solid") {
      return {};
    }

    if (useGradient) {
      return {
        background: `linear-gradient(90deg, ${gradientFrom} 0%, ${gradientTo} 100%)`,
      };
    }

    return {
      backgroundColor,
    };
  };

  const barStyle = {
    height: pattern === "solid" ? `${height}px` : undefined,
    width,
    opacity,
    ...getBackgroundStyle(),
    ...getPatternStyle(),
  };

  return (
    <div
      className={cn(
        "decorative-bar-inline-block flex transition-all duration-200",
        getAlignmentClass(),
        getMarginClass(),
        isSelected && "ring-2 ring-blue-500 ring-opacity-50 rounded-md p-2"
      )}
      data-block-id={block.id}
      onClick={onClick}
    >
      <div
        className={cn(
          "decorative-bar transition-all duration-200",
          getBorderRadiusClass(),
          getAnimationClass()
        )}
        style={barStyle}
      />

      {/* Controles de edição inline quando selecionado */}
      {isSelected && (
        <div className="absolute top-full left-0 mt-2 p-3 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-80">
          <h4 className="text-sm font-semibold mb-2">Configurações da Barra</h4>

          <div className="grid grid-cols-2 gap-3 text-xs">
            {/* Altura */}
            <div>
              <label className="block text-gray-600 mb-1">Altura (px)</label>
              <input
                type="range"
                min="1"
                max="20"
                value={height}
                onChange={e => handlePropertyUpdate("height", parseInt(e.target.value))}
                className="w-full"
              />
              <span className="text-gray-500">{height}px</span>
            </div>

            {/* Largura */}
            <div>
              <label className="block text-gray-600 mb-1">Largura</label>
              <select
                value={width}
                onChange={e => handlePropertyUpdate("width", e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1"
              >
                <option value="25%">25%</option>
                <option value="50%">50%</option>
                <option value="75%">75%</option>
                <option value="100%">100%</option>
                <option value="200px">200px</option>
                <option value="300px">300px</option>
              </select>
            </div>

            {/* Cor */}
            <div>
              <label className="block text-gray-600 mb-1">Cor</label>
              <input
                type="color"
                value={backgroundColor}
                onChange={e => handlePropertyUpdate("backgroundColor", e.target.value)}
                className="w-full h-8 border border-gray-300 rounded"
              />
            </div>

            {/* Padrão */}
            <div>
              <label className="block text-gray-600 mb-1">Padrão</label>
              <select
                value={pattern}
                onChange={e => handlePropertyUpdate("pattern", e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1"
              >
                <option value="solid">Sólido</option>
                <option value="dashed">Tracejado</option>
                <option value="dotted">Pontilhado</option>
                <option value="double">Duplo</option>
              </select>
            </div>

            {/* Alinhamento */}
            <div>
              <label className="block text-gray-600 mb-1">Alinhamento</label>
              <select
                value={alignment}
                onChange={e => handlePropertyUpdate("alignment", e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1"
              >
                <option value="left">Esquerda</option>
                <option value="center">Centro</option>
                <option value="right">Direita</option>
              </select>
            </div>

            {/* Border Radius */}
            <div>
              <label className="block text-gray-600 mb-1">Bordas</label>
              <select
                value={borderRadius}
                onChange={e => handlePropertyUpdate("borderRadius", e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1"
              >
                <option value="none">Reto</option>
                <option value="sm">Pequeno</option>
                <option value="md">Médio</option>
                <option value="lg">Grande</option>
                <option value="full">Redondo</option>
              </select>
            </div>

            {/* Gradiente */}
            <div className="col-span-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={useGradient}
                  onChange={e => handlePropertyUpdate("useGradient", e.target.checked)}
                />
                <span className="text-gray-600">Usar gradiente</span>
              </label>

              {useGradient && (
                <div className="flex gap-2 mt-1">
                  <input
                    type="color"
                    value={gradientFrom}
                    onChange={e => handlePropertyUpdate("gradientFrom", e.target.value)}
                    className="w-1/2 h-6 border border-gray-300 rounded"
                    title="Cor inicial"
                  />
                  <input
                    type="color"
                    value={gradientTo}
                    onChange={e => handlePropertyUpdate("gradientTo", e.target.value)}
                    className="w-1/2 h-6 border border-gray-300 rounded"
                    title="Cor final"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DecorativeBarInlineBlock;

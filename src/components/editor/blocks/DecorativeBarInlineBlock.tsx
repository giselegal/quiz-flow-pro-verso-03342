import React from "react";
import { cn } from "../../../lib/utils";
import type { BlockComponentProps } from "../../../types/blocks";

/**
 * DecorativeBarInlineBlock - Barra decorativa dourada
 * Componente específico para barras visuais decorativas
 * MODULAR | RESPONSIVO | INDEPENDENTE
 */
const DecorativeBarInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  className = "",
}) => {
  const {
    width = "100%",
    height = 4,
    color = "#B89B7A",
    gradientColors = ["#B89B7A", "#D4C2A8", "#B89B7A"],
    borderRadius = 3,
    marginTop = 8,
    marginBottom = 24,
    showShadow = true,
  } = block?.properties || {};

  return (
    <div
      className={cn(
        "w-full flex justify-center items-center",
        isSelected && "ring-2 ring-[#B89B7A] ring-offset-2 rounded-md p-1",
        "cursor-pointer transition-all duration-200",
        className
      )}
      style={{
        marginTop: `${marginTop}px`,
        marginBottom: `${marginBottom}px`,
      }}
      onClick={onClick}
    >
      <div
        className="block"
        style={{
          width: width,
          height: `${height}px`,
          background:
            gradientColors.length > 1
              ? `linear-gradient(90deg, ${gradientColors.join(", ")})`
              : color,
          borderRadius: `${borderRadius}px`,
          ...(showShadow && {
            boxShadow: `0 2px 6px rgba(184, 155, 122, 0.4)`,
          }),
        }}
      />
    </div>
  );
};

export default DecorativeBarInlineBlock;

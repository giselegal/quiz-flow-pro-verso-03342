import React from "react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import type { BlockComponentProps } from "@/types/blocks";

/**
 * StepHeaderInlineBlock - Componente modular inline horizontal
 * Cabeçalho das etapas com logo e barra de progresso
 * MODULAR | REUTILIZÁVEL | RESPONSIVO | INDEPENDENTE
 */

// Função para converter valores de margem em classes Tailwind (Sistema Universal)
const getMarginClass = (value, type) => {
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

const StepHeaderInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  className = "",
}) => {
  const {
    logoUrl = "https://cakto-quiz-br01.b-cdn.net/uploads/47fd613e-91a9-48cf-bd52-a9d4e180d5ab.png",
    logoWidth = 96,
    logoHeight = 96,
    logoAlt = "Logo",
    progressValue = 0,
    progressMax = 100,
    showProgress = true,
    progressColor = "#432818",
    backgroundColor = "transparent",
    containerWidth = "full", // full, sm, md, lg, xl
    alignment = "center", // left, center, right
    spacing = 4, // gap between elements
  } = block.properties;

  // Classes de largura do container
  const widthClasses = {
    full: "w-full",
    sm: "w-full max-w-sm",
    md: "w-full max-w-md",
    lg: "w-full max-w-lg",
    xl: "w-full max-w-xl",
  };

  // Classes de alinhamento
  const alignmentClasses = {
    left: "justify-start items-start",
    center: "justify-center items-center",
    right: "justify-end items-end",
  };

  // Espaçamento dinâmico
  const gapClass = `gap-${spacing}`;

  return (
    <div
      className={cn(
        // INLINE HORIZONTAL: Flexível e quebra linha automaticamente
        "flex-shrink-0 flex-grow-0",
        // Container principal
        "flex flex-col",
        widthClasses[containerWidth as keyof typeof widthClasses],
        alignmentClasses[alignment as keyof typeof alignmentClasses],
        gapClass,
        "p-4",
        // Estados do editor
        isSelected && "ring-2 ring-[#432818] ring-offset-2",
        "cursor-pointer transition-all duration-200",
        className,
        // Margens universais com controles deslizantes
        getMarginClass(marginTop, "top"),
        getMarginClass(marginBottom, "bottom"),
        getMarginClass(marginLeft, "left"),
        getMarginClass(marginRight, "right")
      )}
      style={{
        backgroundColor: backgroundColor === "transparent" ? undefined : backgroundColor,
      }}
      onClick={onClick}
    >
      {/* Logo */}
      <img
        width={logoWidth}
        height={logoHeight}
        className={cn(
          "object-cover rounded-lg",
          // Tamanho responsivo baseado no logoWidth
          logoWidth <= 64 ? "max-w-16" : logoWidth <= 96 ? "max-w-24" : "max-w-32"
        )}
        alt={logoAlt}
        src={logoUrl}
        loading="lazy"
      />

      {/* Barra de Progresso */}
      {showProgress && (
        <div className="w-full">
          <Progress
            value={progressValue}
            max={progressMax}
            className={cn("w-full h-2 rounded-full overflow-hidden", "bg-zinc-300")}
            style={
              {
                // Customização da barra de progresso
                "--progress-background": progressColor,
              } as React.CSSProperties
            }
          />

          {/* Texto do progresso (opcional) */}
          {progressValue > 0 && (
            <div className="text-center mt-2">
              <span className="text-xs text-gray-500">
                {Math.round((progressValue / progressMax) * 100)}% concluído
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StepHeaderInlineBlock;

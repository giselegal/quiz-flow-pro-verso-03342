import React from "react";
// ⚠️ ARQUIVO DE BACKUP - Aliases @/ não funcionam aqui
// Use a versão atual em: src/components/blocks/inline/ImageDisplayInlineBlock.tsx
import { cn } from "../../../../lib/utils";
import type { BlockComponentProps } from "../../../../types/blocks";

/**
 * ImageDisplayInlineBlock - Componente modular inline horizontal
 * Imagem responsiva com aspectos configuráveis
 * MODULAR | REUTILIZÁVEL | RESPONSIVO | INDEPENDENTE
 */
const ImageDisplayInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  className = "",
}) => {
  // Safely extract properties with fallbacks
  const properties = block?.properties || {};

  const {
    src = "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/2_ziffwx.webp",
    alt = "Imagem",
    aspectRatio = "square", // square, portrait, landscape, auto
    size = "medium",
    showBadge = false,
    badgeText = "Destaque",
    objectFit = "cover",
    borderRadius = "lg",
    // Propriedades específicas do template
    width,
    height,
    className: customClassName = "",
    textAlign = "center",
    marginTop = 0,
    marginBottom = 0,
  } = properties;

  // Tamanhos modulares responsivos
  const sizeClasses = {
    small: "w-full sm:w-48 md:w-56",
    medium: "w-full max-w-md mx-auto",
    large: "w-full sm:w-80 md:w-96 lg:w-[28rem]",
  };

  // Aspect ratios
  const aspectRatioClasses = {
    square: "aspect-square",
    portrait: "aspect-[3/4]",
    landscape: "aspect-[4/3]",
    auto: "h-auto",
  };

  // Object fit
  const objectFitClasses = {
    cover: "object-cover",
    contain: "object-contain",
    fill: "object-fill",
    none: "object-none",
  };

  // Border radius
  const borderRadiusClasses = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
  };

  // Text align classes
  const textAlignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
    "text-left": "text-left",
    "text-center": "text-center",
    "text-right": "text-right",
  };

  // Função para converter valores numéricos de margem em classes Tailwind
  const getMarginClass = (value: number | string, type: "top" | "bottom") => {
    if (typeof value === "number" && value > 0) {
      if (value <= 4) return `m${type[0]}-1`;
      if (value <= 8) return `m${type[0]}-2`;
      if (value <= 12) return `m${type[0]}-3`;
      if (value <= 16) return `m${type[0]}-4`;
      if (value <= 20) return `m${type[0]}-5`;
      if (value <= 24) return `m${type[0]}-6`;
      if (value <= 32) return `m${type[0]}-8`;
      if (value <= 40) return `m${type[0]}-10`;
      return `m${type[0]}-12`;
    }
    return "";
  };

  // Usar className customizada se fornecida, senão usar classes padrão
  const containerClasses = cn(
    // INLINE HORIZONTAL: Flexível e quebra linha automaticamente
    "flex-shrink-0 flex-grow-0 relative",
    // Centralização quando necessária
    textAlign === "center" || textAlign === "text-center"
      ? "mx-auto flex justify-center"
      : "",
    // Usar classes customizadas ou responsivo modular
    customClassName || sizeClasses[size as keyof typeof sizeClasses],
    // Estados do editor
    isSelected && "ring-2 ring-[#B89B7A] ring-offset-2",
    "cursor-pointer transition-all duration-200",
    // Margens
    getMarginClass(marginTop, "top"),
    getMarginClass(marginBottom, "bottom"),
    className
  );

  return (
    <div className={containerClasses} onClick={onClick}>
      <div
        className={cn(
          "relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300",
          aspectRatioClasses[aspectRatio as keyof typeof aspectRatioClasses],
          borderRadiusClasses[borderRadius as keyof typeof borderRadiusClasses]
        )}
      >
        <img
          src={src}
          alt={alt}
          style={{
            ...(width && {
              width: typeof width === "number" ? `${width}px` : width,
            }),
            ...(height && {
              height: typeof height === "number" ? `${height}px` : height,
            }),
          }}
          className={cn(
            "w-full h-full transition-transform duration-500 hover:scale-105",
            objectFitClasses[objectFit as keyof typeof objectFitClasses],
            customClassName && "w-auto h-auto" // Se tem className customizada, não forçar w-full h-full
          )}
        />

        {/* Overlay gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

        {/* Badge flutuante */}
        {showBadge && badgeText && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg">
            <span className="text-sm font-medium text-[#432818]">
              {badgeText}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageDisplayInlineBlock;

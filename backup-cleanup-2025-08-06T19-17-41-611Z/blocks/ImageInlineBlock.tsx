import React from "react";
import { cn } from "@/lib/utils";
import { Image as ImageIcon, Edit3 } from "lucide-react";
import type { BlockComponentProps } from "@/types/blocks";

/**
 * ImageInlineBlock - Componente modular inline horizontal
 * Imagem responsiva e configurável
 * MODULAR | REUTILIZÁVEL | RESPONSIVO | INDEPENDENTE
 */
const ImageInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  onPropertyChange,
  className = "",
}) => {
  const {
    src = "",
    alt = "Imagem",
    width = "auto",
    height = "auto",
    objectFit = "cover", // cover, contain, fill, none, scale-down
    borderRadius = "medium",
    aspectRatio = "auto", // auto, square, video, portrait
    maxWidth = "full",
    alignment = "center",
    showCaption = false,
    caption = "",
    clickable = false,
    href = "",
    target = "_blank",
  } = block?.properties || {};

  // Object fit classes
  const objectFitClasses = {
    cover: "object-cover",
    contain: "object-contain",
    fill: "object-fill",
    none: "object-none",
    "scale-down": "object-scale-down",
  };

  // Border radius classes
  const borderRadiusClasses = {
    none: "rounded-none",
    small: "rounded-sm",
    medium: "rounded-md",
    large: "rounded-lg",
    full: "rounded-full",
  };

  // Aspect ratio classes
  const aspectRatioClasses = {
    auto: "",
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
  };

  // Max width classes
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    full: "max-w-full",
  };

  // Alignment classes
  const alignmentClasses = {
    left: "mx-0 mr-auto",
    center: "mx-auto",
    right: "mx-0 ml-auto",
  };

  const handleImageClick = () => {
    if (clickable && href) {
      window.open(href, target);
    }
  };

  return (
    <div
      className={cn(
        // INLINE HORIZONTAL: Flexível
        "flex-shrink-0 flex-grow-0 relative group",
        // Container editável
        "p-2 rounded-lg border border-transparent",
        "hover:border-gray-200 hover:bg-gray-50/30 transition-all duration-200",
        "cursor-pointer",
        isSelected && "border-[#B89B7A] bg-[#B89B7A]/10/30",
        className
      )}
      onClick={onClick}
    >
      {src ? (
        <div className="space-y-2">
          <div
            className={cn(
              "relative overflow-hidden",
              borderRadiusClasses[borderRadius as keyof typeof borderRadiusClasses],
              aspectRatioClasses[aspectRatio as keyof typeof aspectRatioClasses],
              maxWidthClasses[maxWidth as keyof typeof maxWidthClasses],
              alignmentClasses[alignment as keyof typeof alignmentClasses],
              clickable && "cursor-pointer"
            )}
            onClick={handleImageClick}
          >
            <img
              src={src}
              alt={alt}
              className={cn(
                "w-full h-full transition-transform duration-200 hover:scale-105",
                objectFitClasses[objectFit as keyof typeof objectFitClasses]
              )}
              style={{
                width: width === "auto" ? undefined : width,
                height: height === "auto" ? undefined : height,
              }}
            />
          </div>

          {showCaption && caption && (
            <p className="text-sm text-gray-600 text-center italic">{caption}</p>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center bg-gray-100 rounded-lg p-8 min-h-[120px]">
          <div className="text-center text-gray-500">
            <ImageIcon className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">Clique para selecionar e adicionar imagem no painel</p>
          </div>
        </div>
      )}

      {/* Indicador de seleção */}
      {isSelected && (
        <div className="absolute -top-2 -right-2 bg-[#B89B7A]/100 text-white rounded-full p-1">
          <Edit3 className="w-3 h-3" />
        </div>
      )}
    </div>
  );
};

export default ImageInlineBlock;

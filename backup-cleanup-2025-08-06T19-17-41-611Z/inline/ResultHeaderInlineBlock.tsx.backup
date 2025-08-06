import React from "react";
import { cn } from "@/lib/utils";
import { Award, Crown, Star } from "lucide-react";
import type { BlockComponentProps } from "@/types/blocks";

/**
 * ResultHeaderInlineBlock - Componente modular inline horizontal
 * Cabeçalho de resultado com ícone e título
 * MODULAR | REUTILIZÁVEL | RESPONSIVO | INDEPENDENTE
 */
const ResultHeaderInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  className = "",
}) => {
  const {
    title = "Seu Estilo",
    subtitle = "Resultado Personalizado",
    icon = "award",
    iconColor = "#B89B7A",
    backgroundColor = "white",
    textColor = "#1f2937",
    centered = true,
    showDecorations = true,
  } = block.properties;

  // Ícones disponíveis
  const iconMap = {
    award: Award,
    crown: Crown,
    star: Star,
  };

  const IconComponent = iconMap[icon as keyof typeof iconMap] || Award;

  return (
    <div
      className={cn(
        // INLINE HORIZONTAL: Flexível e quebra linha automaticamente
        "flex-shrink-0 flex-grow-0",
        // Container responsivo
        "w-full p-4 sm:p-6 md:p-8",
        // Alinhamento
        centered ? "text-center" : "text-left",
        // Estados do editor
        isSelected && "ring-2 ring-[#B89B7A] ring-offset-2",
        "cursor-pointer transition-all duration-200",
        className
      )}
      style={{ backgroundColor }}
      onClick={onClick}
    >
      {/* Decorações */}
      {showDecorations && (
        <div className="flex justify-center mb-4 sm:mb-6">
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-gradient-to-r from-[#B89B7A] to-[#A1835D] opacity-60"
              />
            ))}
          </div>
        </div>
      )}

      {/* Ícone principal */}
      <div className="flex justify-center mb-4 sm:mb-6">
        <div
          className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full"
          style={{
            background: `linear-gradient(135deg, ${iconColor}, ${iconColor}dd)`,
            boxShadow: "0 8px 32px rgba(184, 155, 122, 0.3)",
          }}
        >
          <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
        </div>
      </div>

      {/* Título principal */}
      <h1
        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-2 sm:mb-3"
        style={{ color: textColor }}
      >
        {title}
      </h1>

      {/* Subtítulo */}
      <p
        className="text-base sm:text-lg md:text-xl opacity-80 font-medium"
        style={{ color: textColor }}
      >
        {subtitle}
      </p>

      {/* Decorações inferiores */}
      {showDecorations && (
        <div className="flex justify-center mt-4 sm:mt-6">
          <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-transparent via-[#B89B7A] to-transparent rounded-full" />
        </div>
      )}
    </div>
  );
};

export default ResultHeaderInlineBlock;

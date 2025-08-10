import React from "react";
import { cn } from "@/lib/utils";
import { Award, Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { BlockComponentProps } from "@/types/blocks";
import {
  safeGetBlockProperties,
  isValidBlock,
  logBlockDebug,
} from "@/utils/blockUtils";

/**
 * StyleCardInlineBlock - Componente modular inline horizontal
 * Card compacto de resultado de estilo
 * MODULAR | REUTILIZÁVEL | RESPONSIVO | INDEPENDENTE
 */
const StyleCardInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  onPropertyChange,
  className = "",
}) => {
  // 🛡️ Validação e logging de debug
  if (!isValidBlock(block)) {
    console.error("❌ StyleCardInlineBlock: Bloco inválido recebido", block);
    return (
      <div className="p-2 bg-red-100 text-red-600 text-xs rounded">
        Erro: Bloco inválido
      </div>
    );
  }

  logBlockDebug("StyleCardInlineBlock", block);

  // 🛡️ Extração segura das propriedades
  const properties = safeGetBlockProperties(block);

  const {
    styleName = "Elegante",
    percentage = 85,
    description = "Seu estilo único",
    showStars = true,
    showProgress = true,
    cardSize = "medium",
    backgroundColor = "white",
    borderColor = "#B89B7A",
    isEditable = true,
  } = properties;

  // Tamanhos modulares responsivos
  const sizeClasses = {
    small: "p-3 sm:p-4 min-h-[160px] w-full max-w-xs",
    medium: "p-4 sm:p-6 min-h-[200px] w-full max-w-sm",
    large: "p-6 sm:p-8 min-h-[240px] w-full sm:w-80 md:w-96 lg:w-[28rem]",
  };

  const iconSizes = {
    small: "w-6 h-6 sm:w-8 sm:h-8",
    medium: "w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12",
    large: "w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16",
  };

  const textSizes = {
    small: "text-base sm:text-lg",
    medium: "text-lg sm:text-xl md:text-2xl",
    large: "text-xl sm:text-2xl md:text-3xl",
  };

  return (
    <div
      className={cn(
        // INLINE HORIZONTAL: Flexível e quebra linha automaticamente
        "flex-shrink-0 flex-grow-0",
        // Responsivo modular
        sizeClasses[cardSize as keyof typeof sizeClasses],
        // Visual modular
        "bg-white/90 backdrop-blur-sm rounded-lg border",
        "shadow-md hover:shadow-lg transition-all duration-200",
        // Estados do editor
        isSelected && "ring-2 ring-[#B89B7A] ring-offset-2",
        "cursor-pointer hover:scale-[1.02]",
        className
      )}
      style={{
        backgroundColor:
          backgroundColor === "white" ? undefined : backgroundColor,
        borderColor: borderColor,
      }}
      onClick={onClick}
    >
      {/* Header compacto e responsivo */}
      <div className="text-center mb-3 sm:mb-4">
        {/* Ícone responsivo */}
        <div className="inline-flex items-center justify-center bg-gradient-to-br from-[#B89B7A] to-[#A1835D] rounded-full mb-2 sm:mb-3 p-2 sm:p-3">
          <Award
            className={cn(
              "text-white",
              iconSizes[cardSize as keyof typeof iconSizes]
            )}
          />
        </div>

        {/* Título responsivo */}
        <h3
          className={cn(
            "font-bold text-[#432818] mb-1",
            textSizes[cardSize as keyof typeof textSizes]
          )}
        >
          {styleName}
        </h3>

        {/* Descrição responsiva */}
        <p className="text-[#5D4A3A] text-xs sm:text-sm leading-relaxed">
          {description}
        </p>
      </div>

      {/* Progress modular e responsivo */}
      {showProgress && (
        <div className="mb-3 sm:mb-4">
          <div className="flex justify-between items-center text-xs sm:text-sm text-[#5D4A3A] mb-2">
            <span className="font-medium">Compatibilidade</span>
            <span className="font-bold text-[#B89B7A] bg-[#B89B7A]/10 px-2 py-1 rounded-full">
              {percentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5">
            <div
              className="bg-gradient-to-r from-[#B89B7A] to-[#A1835D] h-full rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Stars responsivas */}
      {showStars && (
        <div className="flex justify-center space-x-0.5 sm:space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={cn(
                "w-3 h-3 sm:w-4 sm:h-4 transition-colors",
                star <= Math.floor(percentage / 20)
                  ? "text-yellow-400 fill-current"
                  : "text-gray-300"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StyleCardInlineBlock;

import type { BlockComponentProps } from "@/types/blocks";
import React from "react";

interface Option {
  id: string;
  text: string;
  imageUrl?: string;
}

interface OptionsGridBlockProps extends BlockComponentProps {
  properties: {
    question?: string;
    options?: Option[];
    columns?: number;
    selectedOption?: string;
    // 🎯 CONTROLES DE IMAGEM
    showImages?: boolean;
    imageSize?: "small" | "medium" | "large" | "custom";
    imageWidth?: number;
    imageHeight?: number;
    imagePosition?: "top" | "left" | "right" | "bottom";
    imageLayout?: "vertical" | "horizontal";
    // 🎯 CONTROLES DE LAYOUT
    multipleSelection?: boolean;
    maxSelections?: number;
    minSelections?: number;
    gridGap?: number;
    responsiveColumns?: boolean;
  };
}

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

const OptionsGridBlock: React.FC<OptionsGridBlockProps> = ({
  block,
  isSelected = false,
  isEditing = false,
  onClick,
  onPropertyChange,
  className = "",
}) => {
  const {
    question = "Escolha uma opção",
    options = [],
    columns = 2,
    selectedOption,
    // 🎯 PROPRIEDADES DE IMAGEM
    showImages = true,
    imageSize = "medium",
    imageWidth = 150,
    imageHeight = 120,
    imagePosition = "top",
    imageLayout = "vertical",
    // 🎯 PROPRIEDADES DE LAYOUT
    gridGap = 16,
    responsiveColumns = true,
    multipleSelection = false,
  } = block?.properties || {};

  // 🎯 CALCULAR TAMANHOS DE IMAGEM
  const getImageClasses = () => {
    const sizeClasses: Record<string, string> = {
      small: "w-16 h-16",
      medium: "w-24 h-20",
      large: "w-32 h-28",
      custom: `w-[${imageWidth}px] h-[${imageHeight}px]`,
    };

    const positionClasses: Record<string, string> = {
      top: "mb-3",
      bottom: "mt-3 order-last",
      left: "mr-3",
      right: "ml-3",
    };

    return `${sizeClasses[imageSize]} object-cover rounded-md ${positionClasses[imagePosition]}`;
  };

  // 🎯 CALCULAR LAYOUT DO CARD
  const getCardLayoutClasses = () => {
    if (imageLayout === "horizontal" && (imagePosition === "left" || imagePosition === "right")) {
      return "flex items-center";
    }
    return "flex flex-col";
  };

  const handleOptionSelect = (optionId: string) => {
    if (onPropertyChange) {
      onPropertyChange("selectedOption", optionId);
    }
  };

  return (
    <div
      className={`
        py-8 px-4 cursor-pointer transition-all duration-200
        ${isSelected ? "ring-1 ring-gray-400/40 bg-gray-50/30" : "hover:shadow-sm"}
        ${className}
      `}
      onClick={onClick}
      data-block-id={block.id}
      data-block-type={block.type}
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8 text-[#432818]">{question}</h2>

        <div
          className={`grid gap-${Math.floor(gridGap / 4)} ${
            columns === 1
              ? "grid-cols-1"
              : columns === 2
                ? responsiveColumns
                  ? "grid-cols-1 md:grid-cols-2"
                  : "grid-cols-2"
                : responsiveColumns
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-3"
          }`}
        >
          {(options || []).map((opt: any) => (
            <div
              key={opt.id}
              className={`bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all duration-200 cursor-pointer ${getCardLayoutClasses()}`}
              onClick={() => handleOptionSelect(opt.id)}
            >
              {opt.imageUrl && showImages && (
                <img
                  src={opt.imageUrl}
                  alt={opt.text}
                  className={getImageClasses()}
                  style={
                    imageSize === "custom"
                      ? { width: `${imageWidth}px`, height: `${imageHeight}px` }
                      : {}
                  }
                />
              )}
              <p
                className={`text-center text-[#432818] font-medium ${
                  imageLayout === "horizontal" &&
                  (imagePosition === "left" || imagePosition === "right")
                    ? "flex-1"
                    : ""
                }`}
              >
                {opt.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OptionsGridBlock;

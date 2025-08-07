import React from "react";
import { cn } from "@/lib/utils";
import { BlockComponentProps } from "@/types/blocks";

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

const StyleCharacteristicsInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected,
  onClick,
  onPropertyChange,
}) => {
  const styleData = block?.properties?.styleData || {
    name: "Natural",
    description: "Elegância espontânea e sofisticação despojada",
    characteristics: [
      "Prefere tecidos naturais como algodão e linho",
      "Gosta de cores neutras e terrosas",
      "Valoriza o conforto sem abrir mão do estilo",
      "Aprecia peças versáteis e atemporais",
    ],
    colors: ["#432818", "#432818", "#432818", "#432818"],
    mainColor: "#432818",
  };

  const title = block?.properties?.title || `Características do Estilo ${styleData.name}`;

  return (
    <div
      className={cn(
        "style-characteristics p-6 border border-gray-200 rounded-lg bg-white",
        "hover:shadow-md transition-all duration-200",
        isSelected && "ring-2 ring-[#432818] bg-[#432818]",
        "cursor-pointer",
        // Margens universais com controles deslizantes
        getMarginClass(marginTop, "top"),
        getMarginClass(marginBottom, "bottom"),
        getMarginClass(marginLeft, "left"),
        getMarginClass(marginRight, "right")
      )}
      onClick={onClick}
    >
      {/* Header com nome do estilo */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-[#432818] mb-2">{title}</h3>
        <p className="text-gray-600 italic">{styleData.description}</p>
      </div>

      {/* Paleta de cores */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-[#432818] mb-3">Paleta de Cores</h4>
        <div className="flex justify-center gap-2">
          {styleData.colors.map((color: string, index: number) => (
            <div
              key={index}
              className="w-12 h-12 rounded-full border-2 border-gray-300 shadow-sm"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* Características */}
      <div>
        <h4 className="text-lg font-semibold text-[#432818] mb-3">Características Principais</h4>
        <ul className="space-y-3">
          {styleData.characteristics.map((characteristic: string, index: number) => (
            <li key={index} className="flex items-start">
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm mr-3 mt-0.5 flex-shrink-0"
                style={{ backgroundColor: styleData.mainColor }}
              >
                ✓
              </span>
              <span className="text-gray-700 leading-relaxed">{characteristic}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Área editável quando selecionado */}
      {isSelected && onPropertyChange && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            <p>
              💡 <strong>Editável:</strong> Personalize as características do estilo
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StyleCharacteristicsInlineBlock;

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

const SecondaryStylesInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected,
  onClick,
  onPropertyChange,
}) => {
  const secondaryStyles = block?.properties?.secondaryStyles || [
    { name: "Moderno", percentage: 20, color: "#432818" },
    { name: "Casual", percentage: 15, color: "#432818" },
    { name: "Romântico", percentage: 10, color: "#432818" },
  ];

  const title = block?.properties?.title || "Seus Estilos Secundários";
  const showPercentages = block?.properties?.showPercentages !== false;

  return (
    <div
      className={cn(
        "secondary-styles p-6 border border-gray-200 rounded-lg bg-white",
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
      <h3 className="text-xl font-semibold mb-4 text-[#432818] text-center">{title}</h3>

      <div className="grid gap-4 md:grid-cols-3">
        {secondaryStyles.map((style: any, index: number) => (
          <div
            key={index}
            className="text-center p-4 rounded-lg border bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            {/* Círculo com porcentagem */}
            <div className="relative inline-block mb-3">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg"
                style={{ backgroundColor: style.color }}
              >
                {showPercentages && `${style.percentage}%`}
              </div>
            </div>

            {/* Nome do estilo */}
            <h4 className="font-medium text-[#432818] mb-1">{style.name}</h4>

            {/* Descrição opcional */}
            {style.description && <p className="text-sm text-gray-600">{style.description}</p>}
          </div>
        ))}
      </div>

      {/* Área editável quando selecionado */}
      {isSelected && onPropertyChange && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            <p>
              💡 <strong>Editável:</strong> Personalize os estilos secundários
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecondaryStylesInlineBlock;

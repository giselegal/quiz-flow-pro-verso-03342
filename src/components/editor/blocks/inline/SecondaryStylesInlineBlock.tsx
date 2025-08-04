import React from "react";
import { cn } from "../../../../lib/utils";
import { BlockComponentProps } from "../../../../types/blocks";

const SecondaryStylesInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected,
  onClick,
  onPropertyChange,
}) => {
  const secondaryStyles = block?.properties?.secondaryStyles || [
    { name: "Moderno", percentage: 20, color: "#8B5CF6" },
    { name: "Casual", percentage: 15, color: "#06B6D4" },
    { name: "Romântico", percentage: 10, color: "#EC4899" },
  ];

  const title = block?.properties?.title || "Seus Estilos Secundários";
  const showPercentages = block?.properties?.showPercentages !== false;

  return (
    <div
      className={cn(
        "secondary-styles p-6 border border-gray-200 rounded-lg bg-white",
        "hover:shadow-md transition-all duration-200",
        isSelected && "ring-2 ring-[#B89B7A] bg-[#FAF9F7]",
        "cursor-pointer",
      )}
      onClick={onClick}
    >
      <h3 className="text-xl font-semibold mb-4 text-[#432818] text-center">
        {title}
      </h3>

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
            {style.description && (
              <p className="text-sm text-gray-600">{style.description}</p>
            )}
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

import React from "react";
import { cn } from "../../../lib/utils";
import { BlockComponentProps } from "../../../types/blocks";

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

  const title =
    block?.properties?.title || `Características do Estilo ${styleData.name}`;

  return (
    <div
      className={cn(
        "style-characteristics p-6 border border-gray-200 rounded-lg bg-white",
        "hover:shadow-md transition-all duration-200",
        isSelected && "ring-2 ring-[#432818] bg-[#432818]",
        "cursor-pointer"
      )}
      onClick={onClick}
    >
      {/* Header com nome do estilo */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-[#432818] mb-2">{title}</h3>
        <p style={{ color: "#6B4F43" }}>{styleData.description}</p>
      </div>

      {/* Paleta de cores */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-[#432818] mb-3">
          Paleta de Cores
        </h4>
        <div className="flex justify-center gap-2">
          {styleData.colors.map((color: string, index: number) => (
            <div
              key={index}
              style={{ borderColor: "#E5DDD5", backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* Características */}
      <div>
        <h4 className="text-lg font-semibold text-[#432818] mb-3">
          Características Principais
        </h4>
        <ul className="space-y-3">
          {styleData.characteristics.map(
            (characteristic: string, index: number) => (
              <li key={index} className="flex items-start">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm mr-3 mt-0.5 flex-shrink-0"
                  style={{ backgroundColor: styleData.mainColor }}
                >
                  ✓
                </span>
                <span style={{ color: "#6B4F43" }}>{characteristic}</span>
              </li>
            )
          )}
        </ul>
      </div>

      {/* Área editável quando selecionado */}
      {isSelected && onPropertyChange && (
        <div style={{ borderColor: "#E5DDD5" }}>
          <div style={{ color: "#8B7355" }}>
            <p>
              💡 <strong>Editável:</strong> Personalize as características do
              estilo
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StyleCharacteristicsInlineBlock;

import React from "react";
import { Check } from "lucide-react";
import type { BlockComponentProps } from "../../../types/blocks";

interface BenefitItem {
  text: string;
  icon?: string;
}

interface BenefitsListBlockProps {
  block: {
    id: string;
    type: string;
    properties: Record<string, any>;
  };
  isSelected?: boolean;
  onClick?: () => void;
  onPropertyChange?: (key: string, value: any) => void;
  className?: string;
}

const BenefitsListBlock: React.FC<BenefitsListBlockProps> = ({
  block,
  isSelected = false,
  onClick,
  onPropertyChange,
  className = "",
}) => {
  const {
    title = "Benefícios",
    benefits = [],
    showIcons = true,
    layout = "list",
  } = block.properties || {};

  return (
    <div
      className={`
        p-6 rounded-lg cursor-pointer transition-all duration-200
        ${
          isSelected
            ? "border-2 border-blue-500 bg-blue-50"
            : "border-2 border-dashed border-gray-300 hover:border-gray-400"
        }
        ${className}
      `}
      onClick={onClick}
      data-block-id={block.id}
      data-block-type={block.type}
    >
      <h3 className="text-xl font-semibold mb-4 text-gray-800">{title}</h3>

      <div
        className={`space-y-3 ${layout === "grid" ? "grid grid-cols-2 gap-4" : ""}`}
      >
        {benefits.map((benefit: BenefitItem, index: number) => (
          <div key={index} className="flex items-start gap-3">
            {showIcons && (
              <div className="flex-shrink-0 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
            <span className="text-gray-700">{benefit.text}</span>
          </div>
        ))}
      </div>

      {benefits.length === 0 && (
        <p className="text-gray-400 italic">
          Adicione benefícios nas propriedades do bloco
        </p>
      )}
    </div>
  );
};

export default BenefitsListBlock;

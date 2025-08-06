import React from "react";
import { DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { BlockComponentProps } from "../../../types/blocks";

const DynamicPricingBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  onPropertyChange,
  className = "",
}) => {
  const {
    title = "Preço Especial",
    price = "197",
    originalPrice = "497",
    currency = "R$",
    features = [],
    buttonText = "Comprar Agora",
    buttonUrl = "#",
  } = block.properties || {};

  return (
    <div
      className={`
        p-6 bg-white rounded-lg border cursor-pointer transition-all duration-200
        ${isSelected ? "border-[#B89B7A] ring-2 ring-blue-200" : "border-gray-200 hover:border-gray-300"}
        ${className}
      `}
      onClick={onClick}
      data-block-id={block.id}
      data-block-type={block.type}
    >
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-4 text-gray-800">{title}</h3>

        <div className="mb-6">
          {originalPrice && (
            <span className="text-gray-500 line-through text-lg">
              {currency} {originalPrice}
            </span>
          )}
          <div className="text-4xl font-bold text-green-600 flex items-center justify-center gap-2">
            <DollarSign className="w-8 h-8" />
            {currency} {price}
          </div>
        </div>

        {features.length > 0 && (
          <ul className="text-left mb-6 space-y-2">
            {features.map((feature: string, featureIndex: number) => (
              <li key={featureIndex} className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
        )}

        <Button className="w-full bg-green-600 hover:bg-green-700">{buttonText}</Button>
      </div>
    </div>
  );
};

export default DynamicPricingBlock;

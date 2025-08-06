import React from "react";
import { cn } from "@/lib/utils";
import type { BlockComponentProps } from "@/types/blocks";
import { safeGetBlockProperties, logBlockDebug } from "@/utils/blockUtils";

/**
 * QuizOfferPricingInlineBlock - Preço da oferta do quiz
 */
const QuizOfferPricingInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  className = "",
}) => {
  logBlockDebug("QuizOfferPricingInlineBlock", block);
  const properties = safeGetBlockProperties(block);

  const {
    originalPrice = "R$ 197,00",
    offerPrice = "R$ 97,00",
    discount = "50% OFF",
    urgencyText = "Oferta por tempo limitado",
  } = properties;

  return (
    <div
      className={cn(
        "w-full p-6 rounded-lg transition-all duration-200 text-center",
        "bg-gradient-to-br from-[#432818]/10 to-[#432818]/5",
        "border-2 border-[#432818]/30",
        isSelected && "ring-2 ring-blue-500",
        "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <p className="text-sm text-red-600 font-medium mb-2">{urgencyText}</p>
      <p className="text-lg text-gray-500 line-through mb-1">De {originalPrice}</p>
      <p className="text-3xl font-bold text-[#432818] mb-2">{offerPrice}</p>
      <span className="inline-block bg-green-100 text-green-800 text-sm font-bold px-3 py-1 rounded-full">
        {discount}
      </span>
    </div>
  );
};

export default QuizOfferPricingInlineBlock;

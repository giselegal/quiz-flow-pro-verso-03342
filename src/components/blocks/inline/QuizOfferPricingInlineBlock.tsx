import { cn } from "@/lib/utils";
import type { BlockComponentProps } from "@/types/blocks";
import { logBlockDebug, safeGetBlockProperties } from "@/utils/blockUtils";
import React from "react";

/**
 * QuizOfferPricingInlineBlock - Preço da oferta do quiz
 */

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
    // Sistema completo de margens com controles deslizantes
    marginTop = 8,
    marginBottom = 8,
    marginLeft = 0,
    marginRight = 0,
  } = properties;

  return (
    <div
      className={cn(
        "w-full p-6 rounded-lg transition-all duration-200 text-center",
        "bg-gradient-to-br from-[#432818]/10 to-[#432818]/5",
        "border-2 border-[#432818]/30",
        isSelected && "ring-2 ring-blue-500",
        "cursor-pointer",
        className,
        // Margens universais com controles deslizantes
        getMarginClass(marginTop, "top"),
        getMarginClass(marginBottom, "bottom"),
        getMarginClass(marginLeft, "left"),
        getMarginClass(marginRight, "right")
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

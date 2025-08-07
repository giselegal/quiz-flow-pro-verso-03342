import React from "react";
import { cn } from "@/lib/utils";
import { Quote } from "lucide-react";
import type { BlockComponentProps } from "@/types/blocks";

/**
 * TestimonialCardInlineBlock - Componente modular de depoimento
 * Mostra depoimento de cliente de forma compacta
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

const TestimonialCardInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  className = "",
}) => {
  // Validate block and properties
  if (!block || !block.properties) {
    console.warn("TestimonialCardInlineBlock: block or block.properties is undefined");
    return null;
  }

  const properties = block.properties || {};

  const name = properties.name || "Maria Silva";
  const testimonial =
    properties.testimonial || "Transformou completamente minha forma de me vestir!";
  const avatar = properties.avatar || "https://via.placeholder.com/60x60";
  const rating = properties.rating || 5;
  const location = properties.location || "São Paulo, SP";
  const cardSize = properties.cardSize || "medium"; // small, medium, large

  const sizeClasses = {
    small: "w-full sm:w-64 p-4",
    medium: "w-full sm:w-80 p-6",
    large: "w-full sm:w-96 p-8",
  };

  return (
    <div
      className={cn(
        // Layout inline responsivo
        "flex-shrink-0",
        sizeClasses[cardSize as keyof typeof sizeClasses],
        // Visual
        "bg-white rounded-xl border border-[#432818]/20",
        "shadow-lg hover:shadow-xl transition-all duration-300",
        // Estados
        isSelected && "ring-2 ring-[#432818]",
        "cursor-pointer hover:scale-105",
        "relative",
        className,
        // Margens universais com controles deslizantes
        getMarginClass(marginTop, "top"),
        getMarginClass(marginBottom, "bottom"),
        getMarginClass(marginLeft, "left"),
        getMarginClass(marginRight, "right")
      )}
      onClick={onClick}
    >
      {/* Quote icon */}
      <Quote className="w-8 h-8 text-[#432818]/30 mb-4" />

      {/* Testimonial text */}
      <blockquote className="text-[#432818] text-sm leading-relaxed mb-4 font-medium">
        "{testimonial}"
      </blockquote>

      {/* Rating stars */}
      <div className="flex space-x-1 mb-4">
        {[1, 2, 3, 4, 5].map(star => (
          <span
            key={star}
            className={cn("text-lg", star <= rating ? "text-yellow-400" : "text-gray-300")}
          >
            ★
          </span>
        ))}
      </div>

      {/* Author info */}
      <div className="flex items-center space-x-3">
        <img
          src={avatar}
          alt={name}
          className="w-12 h-12 rounded-full object-cover border-2 border-[#432818]/20"
        />
        <div>
          <p className="font-medium text-[#432818] text-sm">{name}</p>
          <p className="text-xs text-[#432818]">{location}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCardInlineBlock;

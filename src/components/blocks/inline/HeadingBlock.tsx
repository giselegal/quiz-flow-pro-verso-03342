import { cn } from "@/lib/utils";
import type { BlockComponentProps } from "@/types/blocks";
import React from "react";

interface HeadingProperties {
  text: string;
  level: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  color?: string;
  fontSize?: string;
  fontWeight?: "normal" | "medium" | "semibold" | "bold";
  textAlign?: "left" | "center" | "right";
  margin?: "none" | "sm" | "md" | "lg";
  fontFamily?: "sans" | "serif" | "mono";
}

const HeadingBlock: React.FC<BlockComponentProps> = ({
  block,
  properties,
  isSelected,
  onClick,
  onPropertyChange,
}) => {
  const {
    text = "Título",
    level = "h2",
    color = "#1a1a1a",
    fontSize,
    fontWeight = "bold",
    textAlign = "center",
    margin = "md",
    fontFamily = "sans",
  } = (properties || {}) as HeadingProperties;

  const handlePropertyUpdate = (key: string, value: any) => {
    onPropertyChange?.(key, value);
  };

  const getDefaultFontSize = () => {
    const sizeMap = {
      h1: "text-4xl md:text-5xl",
      h2: "text-3xl md:text-4xl",
      h3: "text-2xl md:text-3xl",
      h4: "text-xl md:text-2xl",
      h5: "text-lg md:text-xl",
      h6: "text-base md:text-lg",
    };
    return sizeMap[level] || sizeMap.h2;
  };

  const getWeightClass = () => {
    const weightMap = {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    };
    return weightMap[fontWeight] || weightMap.bold;
  };

  const getAlignClass = () => {
    const alignMap = {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    };
    return alignMap[textAlign] || alignMap.center;
  };

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
    return marginMap[margin] || marginMap.md;
  };

  const getFontFamilyClass = () => {
    const fontMap = {
      sans: "font-sans",
      serif: "font-serif",
      mono: "font-mono",
    };
    return fontMap[fontFamily] || fontMap.sans;
  };

  const HeadingTag = level as keyof JSX.IntrinsicElements;

  return (
    <HeadingTag
      className={cn(
        "heading-block w-full transition-all duration-200 outline-none",
        fontSize ? "" : getDefaultFontSize(),
        getWeightClass(),
        getAlignClass(),
        getMarginClass(),
        getFontFamilyClass(),
        isSelected && "ring-2 ring-blue-500 ring-opacity-50 rounded-md"
      ,
    // Margens universais com controles deslizantes
    getMarginClass(marginTop, "top"),
    getMarginClass(marginBottom, "bottom"),
    getMarginClass(marginLeft, "left"),
    getMarginClass(marginRight, "right")
  )}
      style={{
        color,
        fontSize: fontSize || undefined,
      }}
      contentEditable={isSelected}
      suppressContentEditableWarning
      onBlur={e => handlePropertyUpdate("text", e.target.textContent || "")}
      onClick={onClick}
    >
      {text}
    </HeadingTag>
  );
};

export default HeadingBlock;

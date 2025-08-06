import React from "react";
import { cn } from "@/lib/utils";
import type { BlockComponentProps } from "@/types/blocks";

interface TextInlineProperties {
  content: string;
  fontSize?: string;
  color?: string;
  fontWeight?: "normal" | "medium" | "semibold" | "bold";
  textAlign?: "left" | "center" | "right" | "justify";
  lineHeight?: "tight" | "normal" | "relaxed" | "loose";
  margin?: "none" | "sm" | "md" | "lg";
  fontFamily?: "sans" | "serif" | "mono";
  maxWidth?: string;
  htmlContent?: boolean;
}

const TextInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  properties,
  isSelected,
  onClick,
  onPropertyChange,
}) => {
  const {
    content = "Digite seu texto aqui...",
    fontSize = "16px",
    color = "#333333",
    fontWeight = "normal",
    textAlign = "left",
    lineHeight = "normal",
    margin = "md",
    fontFamily = "sans",
    maxWidth,
    htmlContent = false,
  } = (properties || {}) as TextInlineProperties;

  const handlePropertyUpdate = (key: string, value: any) => {
    onPropertyChange?.(key, value);
  };

  const getWeightClass = () => {
    const weightMap = {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    };
    return weightMap[fontWeight] || weightMap.normal;
  };

  const getAlignClass = () => {
    const alignMap = {
      left: "text-left",
      center: "text-center",
      right: "text-right",
      justify: "text-justify",
    };
    return alignMap[textAlign] || alignMap.left;
  };

  const getLineHeightClass = () => {
    const lineMap = {
      tight: "leading-tight",
      normal: "leading-normal",
      relaxed: "leading-relaxed",
      loose: "leading-loose",
    };
    return lineMap[lineHeight] || lineMap.normal;
  };

  const getMarginClass = () => {
    const marginMap = {
      none: "",
      sm: "my-2",
      md: "my-4",
      lg: "my-6",
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

  if (htmlContent) {
    return (
      <div
        className={cn(
          "text-inline-block w-full transition-all duration-200 outline-none",
          getWeightClass(),
          getAlignClass(),
          getLineHeightClass(),
          getMarginClass(),
          getFontFamilyClass(),
          isSelected && "ring-2 ring-blue-500 ring-opacity-50 rounded-md p-2"
        )}
        style={{
          fontSize,
          color,
          maxWidth: maxWidth || undefined,
        }}
        contentEditable={isSelected}
        suppressContentEditableWarning
        dangerouslySetInnerHTML={{ __html: content }}
        onBlur={e => handlePropertyUpdate("content", e.target.innerHTML || "")}
        onClick={onClick}
      />
    );
  }

  return (
    <p
      className={cn(
        "text-inline-block w-full transition-all duration-200 outline-none",
        getWeightClass(),
        getAlignClass(),
        getLineHeightClass(),
        getMarginClass(),
        getFontFamilyClass(),
        isSelected && "ring-2 ring-blue-500 ring-opacity-50 rounded-md p-2"
      )}
      style={{
        fontSize,
        color,
        maxWidth: maxWidth || undefined,
      }}
      contentEditable={isSelected}
      suppressContentEditableWarning
      onBlur={e => handlePropertyUpdate("content", e.target.textContent || "")}
      onClick={onClick}
    >
      {content}
    </p>
  );
};

export default TextInlineBlock;

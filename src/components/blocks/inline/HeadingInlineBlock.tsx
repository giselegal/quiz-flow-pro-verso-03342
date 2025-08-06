import { safeGetBlockProperties } from "@/utils/blockUtils";
import React from "react";
import type { BlockComponentProps } from "@/types/blocks";

const HeadingInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  onPropertyChange,
}) => {
  const properties = safeGetBlockProperties(block);
  // CORREÇÃO: Aceitar content (string) OU text/title
  const text = properties.content || properties.text || properties.title || "Título";
  const level = properties.level || "h2";
  const textAlign = properties.textAlign || "center";
  const color = properties.color || "#432818";

  const handleTextChange = (newText: string) => {
    if (onPropertyChange) {
      onPropertyChange("content", newText);
    }
  };

  const headingProps = {
    className: `font-bold cursor-pointer transition-all duration-200 ${
      isSelected ? "ring-2 ring-[#432818] ring-opacity-50" : ""
    }`,
    style: {
      textAlign: textAlign as any,
      color,
      fontSize: level === "h1" ? "2rem" : level === "h2" ? "1.5rem" : "1.25rem",
    },
    onClick,
    suppressContentEditableWarning: true,
    contentEditable: isSelected,
    onBlur: (e: React.FocusEvent<HTMLElement>) => {
      if (isSelected) {
        handleTextChange(e.target.textContent || "");
      }
    },
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        (e.target as HTMLElement).blur();
      }
    },
  };

  switch (level) {
    case "h1":
      return <h1 {...headingProps}>{text}</h1>;
    case "h2":
      return <h2 {...headingProps}>{text}</h2>;
    case "h3":
      return <h3 {...headingProps}>{text}</h3>;
    case "h4":
      return <h4 {...headingProps}>{text}</h4>;
    case "h5":
      return <h5 {...headingProps}>{text}</h5>;
    case "h6":
      return <h6 {...headingProps}>{text}</h6>;
    default:
      return <h2 {...headingProps}>{text}</h2>;
  }
};

export default HeadingInlineBlock;

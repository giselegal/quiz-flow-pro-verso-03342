import { safeGetBlockProperties } from "@/utils/blockUtils";
import React from "react";

interface HeadingInlineBlockProps {
  block: {
    id: string;
    type: string;
    content?: any;
  };
  isSelected?: boolean;
  onSelect?: () => void;
  onUpdate?: (content: any) => void;
}

export const HeadingInlineBlock: React.FC<HeadingInlineBlockProps> = ({
  block,
  isSelected = false,
  onSelect,
  onUpdate,
}) => {
  const properties = safeGetBlockProperties(block);
  // CORREÇÃO: Aceitar content (string) OU text/title
  const text = properties.content || properties.text || properties.title || "Título";
  const level = properties.level || "h1";
  const textAlign = properties.textAlign || "center";
  const color = properties.color || "#432818";

  const handleTextChange = (newText: string) => {
    if (onUpdate) {
      onUpdate({ text: newText, title: newText });
    }
  };

  const headingProps = {
    className: `font-bold cursor-pointer transition-all duration-200 ${
      isSelected ? "ring-2 ring-[#B89B7A] ring-opacity-50" : ""
    }`,
    style: {
      textAlign: textAlign as any,
      color,
      fontSize: level === "h1" ? "2rem" : level === "h2" ? "1.5rem" : "1.25rem",
    },
    onClick: onSelect,
    contentEditable: true,
    suppressContentEditableWarning: true,
    onBlur: (e: React.FocusEvent<HTMLElement>) => {
      handleTextChange(e.target.textContent || "");
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
    default:
      return <h1 {...headingProps}>{text}</h1>;
  }
};

export default HeadingInlineBlock;

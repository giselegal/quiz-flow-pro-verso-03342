import React from "react";
import { InlineEditableText } from "./InlineEditableText";
import { Quote } from "lucide-react";
import type { BlockComponentProps } from "@/types/blocks";

const QuoteBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  isEditing = false,
  onClick,
  onPropertyChange,
  className = "",
}) => {
  const {
    text = "Este produto mudou minha vida! Recomendo para todos.",
    author = "Cliente Satisfeito",
  } = block.properties;

  const handlePropertyChange = (key: string, value: any) => {
    if (onPropertyChange) {
      onPropertyChange(key, value);
    }
  };

  return (
    <div
      className={`
        py-6 px-4 bg-gray-50 rounded-lg shadow-sm border border-gray-100 max-w-lg mx-auto space-y-3 cursor-pointer transition-all duration-200
        ${
          isSelected
            ? "ring-1 ring-gray-400/40 bg-gray-50/30"
            : "hover:shadow-md"
        }
        ${className}
      `}
      onClick={onClick}
      data-block-id={block.id}
      data-block-type={block.type}
    >
      <Quote className="w-6 h-6 text-gray-400 mx-auto" />
      <blockquote className="text-[#432818] italic text-center text-base md:text-lg">
        "
        <InlineEditableText
          value={text}
          onChange={(value: string) => handlePropertyChange("text", value)}
          className="inline-block w-full"
          placeholder="Texto da citação"
        />
        "
      </blockquote>
      {author && (
        <p className="text-sm text-gray-600 text-right">
          -{" "}
          <InlineEditableText
            value={author}
            onChange={(value: string) => handlePropertyChange("author", value)}
            className="inline-block"
            placeholder="Autor da citação"
          />
        </p>
      )}
    </div>
  );
};

export default QuoteBlock;

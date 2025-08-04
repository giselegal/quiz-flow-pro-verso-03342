import React from "react";
import { InlineEditableText } from "./InlineEditableText";
import { SlidersHorizontal } from "lucide-react";
import type { BlockComponentProps } from "@/types/blocks";

const ChartLevelBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  isEditing = false,
  onClick,
  onPropertyChange,
  className = "",
}) => {
  const {
    value = 75,
    label = "Nível de Progresso",
    color = "#3b82f6",
    backgroundColor = "#e0e7ff",
  } = block.properties;

  const handlePropertyChange = (key: string, value: any) => {
    if (onPropertyChange) {
      onPropertyChange(key, value);
    }
  };

  const displayValue = value ?? 75;
  const displayColor = color || "#3b82f6";
  const displayBgColor = backgroundColor || "#e0e7ff";

  return (
    <div
      className={`
        py-6 text-center space-y-4 cursor-pointer transition-all duration-200
        ${
          isSelected
            ? "ring-1 ring-gray-400/40 bg-gray-50/30"
            : "hover:shadow-sm"
        }
        ${className}
      `}
      onClick={onClick}
      data-block-id={block.id}
      data-block-type={block.type}
    >
      <div
        className="relative w-32 h-32 mx-auto rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg"
        style={{
          background: `conic-gradient(${displayColor} ${displayValue}%, ${displayBgColor} ${displayValue}%)`,
        }}
      >
        <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
          <span className="text-gray-800">{displayValue}%</span>
        </div>
      </div>
      <p className="text-lg text-[#432818]">
        <InlineEditableText
          value={label}
          onChange={(value: string) => handlePropertyChange("label", value)}
          className="inline-block"
          placeholder="Rótulo do nível"
        />
      </p>
      <div className="text-sm text-gray-500">Progresso: {displayValue}%</div>
    </div>
  );
};

export default ChartLevelBlock;

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowLeftRight, Edit3 } from "lucide-react";

interface ComparisonInlineBlockProps {
  beforeTitle?: string;
  afterTitle?: string;
  beforeText?: string;
  afterText?: string;
  dividerPosition?: number;
  onClick?: () => void;
  className?: string;
  onPropertyChange?: (key: string, value: any) => void;
  disabled?: boolean;
}

const ComparisonInlineBlock: React.FC<ComparisonInlineBlockProps> = ({
  beforeTitle = "Antes",
  afterTitle = "Depois",
  beforeText = "Sem direção de estilo, compras por impulso",
  afterText = "Estilo definido, compras certeiras",
  dividerPosition = 50,
  onClick,
  className,
  onPropertyChange,
  disabled = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [dragPosition, setDragPosition] = useState(dividerPosition);

  return (
    <div
      role="button"
      tabIndex={0}
      className={cn(
        "group/canvas-item inline-block overflow-hidden relative cursor-col-resize",
        "w-full h-[200px]",
        "border-2 border-dashed rounded-md",
        "hover:border-[#B89B7A] transition-all",
        isHovered ? "border-[#B89B7A]" : "border-gray-300",
        disabled && "opacity-75 cursor-not-allowed",
        className
      )}
      onClick={!disabled ? onClick : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Before Section */}
      <div
        className="absolute top-0 left-0 h-full bg-red-50 border-r border-red-200 flex flex-col justify-center items-center p-4"
        style={{ width: `${dragPosition}%` }}
      >
        <h4
          className="font-bold text-red-800 mb-2 cursor-pointer text-center"
          onClick={e => {
            e.stopPropagation();
            if (onPropertyChange && !disabled) {
              const newTitle = prompt('Novo título "Antes":', beforeTitle);
              if (newTitle !== null) onPropertyChange("beforeTitle", newTitle);
            }
          }}
        >
          {beforeTitle}
        </h4>
        <p
          className="text-sm text-red-700 text-center cursor-pointer"
          onClick={e => {
            e.stopPropagation();
            if (onPropertyChange && !disabled) {
              const newText = prompt('Novo texto "Antes":', beforeText);
              if (newText !== null) onPropertyChange("beforeText", newText);
            }
          }}
        >
          {beforeText}
        </p>
      </div>

      {/* After Section */}
      <div
        className="absolute top-0 right-0 h-full bg-green-50 border-l border-green-200 flex flex-col justify-center items-center p-4"
        style={{ width: `${100 - dragPosition}%` }}
      >
        <h4
          className="font-bold text-green-800 mb-2 cursor-pointer text-center"
          onClick={e => {
            e.stopPropagation();
            if (onPropertyChange && !disabled) {
              const newTitle = prompt('Novo título "Depois":', afterTitle);
              if (newTitle !== null) onPropertyChange("afterTitle", newTitle);
            }
          }}
        >
          {afterTitle}
        </h4>
        <p
          className="text-sm text-green-700 text-center cursor-pointer"
          onClick={e => {
            e.stopPropagation();
            if (onPropertyChange && !disabled) {
              const newText = prompt('Novo texto "Depois":', afterText);
              if (newText !== null) onPropertyChange("afterText", newText);
            }
          }}
        >
          {afterText}
        </p>
      </div>

      {/* Divider */}
      <div
        className="h-full w-px absolute top-0 m-auto z-30 bg-gradient-to-b from-transparent from-[5%] to-[95%] via-indigo-500 to-transparent"
        style={{ left: `${dragPosition}%`, top: "0px", zIndex: 40 }}
      >
        <div className="w-36 h-full flex items-center justify-center">
          <div className="w-8 h-8 bg-[#B89B7A]/100 rounded-full flex items-center justify-center shadow-lg">
            <ArrowLeftRight className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>

      {/* Edit indicator */}
      {!disabled && (
        <div className="absolute top-2 right-2 opacity-0 group-hover/canvas-item:opacity-100 transition-opacity z-50">
          <Edit3 className="w-4 h-4 text-[#B89B7A]" />
        </div>
      )}
    </div>
  );
};

export default ComparisonInlineBlock;

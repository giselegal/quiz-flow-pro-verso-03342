import React from "react";
import { cn } from "@/lib/utils";
import { Gift, Edit3 } from "lucide-react";

interface BonusInlineBlockProps {
  title?: string;
  value?: string;
  description?: string;
  showIcon?: boolean;
  onClick?: () => void;
  className?: string;
  onPropertyChange?: (key: string, value: any) => void;
  disabled?: boolean;
}

const BonusInlineBlock: React.FC<BonusInlineBlockProps> = ({
  title = "Bônus Exclusivo",
  value = "R$ 97,00",
  description = "Material adicional incluso gratuitamente",
  showIcon = true,
  onClick,
  className,
  onPropertyChange,
  disabled = false,
}) => {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-l-4 border-green-500",
        "transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer",
        "w-full",
        disabled && "opacity-75 cursor-not-allowed",
        className
      )}
      onClick={!disabled ? onClick : undefined}
    >
      {/* Gift Icon */}
      {showIcon && (
        <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
          <Gift className="w-4 h-4 text-white" />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4
            className="font-semibold text-green-800 text-sm truncate"
            onClick={e => {
              e.stopPropagation();
              if (onPropertyChange && !disabled) {
                const newTitle = prompt("Novo título do bônus:", title);
                if (newTitle !== null) onPropertyChange("title", newTitle);
              }
            }}
          >
            {title}
          </h4>
          <span
            className="text-green-600 font-bold text-sm ml-2"
            onClick={e => {
              e.stopPropagation();
              if (onPropertyChange && !disabled) {
                const newValue = prompt("Novo valor:", value);
                if (newValue !== null) onPropertyChange("value", newValue);
              }
            }}
          >
            {value}
          </span>
        </div>

        <p
          className="text-xs text-green-700 mt-1 line-clamp-2"
          onClick={e => {
            e.stopPropagation();
            if (onPropertyChange && !disabled) {
              const newDescription = prompt("Nova descrição:", description);
              if (newDescription !== null) onPropertyChange("description", newDescription);
            }
          }}
        >
          {description}
        </p>

        <div className="text-xs text-green-600 font-medium mt-1">GRÁTIS para você!</div>
      </div>

      {/* Edit indicator */}
      {!disabled && (
        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <Edit3 className="w-4 h-4 text-green-600" />
        </div>
      )}
    </div>
  );
};

export default BonusInlineBlock;

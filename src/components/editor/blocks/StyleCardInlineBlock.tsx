import React from "react";
import { cn } from "@/lib/utils";
import { Sparkles, Edit3 } from "lucide-react";

interface StyleCardInlineBlockProps {
  title?: string;
  subtitle?: string;
  description?: string;
  showIcon?: boolean;
  onClick?: () => void;
  className?: string;
  onPropertyChange?: (key: string, value: any) => void;
  disabled?: boolean;
}

const StyleCardInlineBlock: React.FC<StyleCardInlineBlockProps> = ({
  title = "Seu Estilo Único",
  subtitle = "Descoberto através do quiz",
  description = "Características principais do seu perfil de estilo pessoal",
  showIcon = true,
  onClick,
  className,
  onPropertyChange,
  disabled = false,
}) => {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-3 p-4 bg-white rounded-lg border-l-4 border-[#B89B7A] shadow-sm",
        "transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer",
        "w-full",
        disabled && "opacity-75 cursor-not-allowed",
        className,
      )}
      onClick={!disabled ? onClick : undefined}
    >
      {/* Icon */}
      {showIcon && (
        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] rounded-full flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3
          className="font-semibold text-[#432818] text-sm md:text-base truncate"
          onClick={(e) => {
            e.stopPropagation();
            if (onPropertyChange && !disabled) {
              const newTitle = prompt("Novo título:", title);
              if (newTitle !== null) onPropertyChange("title", newTitle);
            }
          }}
        >
          {title}
        </h3>
        <p
          className="text-xs md:text-sm text-[#8F7A6A] truncate"
          onClick={(e) => {
            e.stopPropagation();
            if (onPropertyChange && !disabled) {
              const newSubtitle = prompt("Novo subtítulo:", subtitle);
              if (newSubtitle !== null)
                onPropertyChange("subtitle", newSubtitle);
            }
          }}
        >
          {subtitle}
        </p>
        {description && (
          <p
            className="text-xs text-[#8F7A6A] mt-1 line-clamp-2"
            onClick={(e) => {
              e.stopPropagation();
              if (onPropertyChange && !disabled) {
                const newDescription = prompt("Nova descrição:", description);
                if (newDescription !== null)
                  onPropertyChange("description", newDescription);
              }
            }}
          >
            {description}
          </p>
        )}
      </div>

      {/* Edit indicator */}
      {!disabled && (
        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <Edit3 className="w-4 h-4 text-[#B89B7A]" />
        </div>
      )}
    </div>
  );
};

export default StyleCardInlineBlock;

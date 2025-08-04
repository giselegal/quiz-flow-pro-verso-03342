import React from "react";
import { cn } from "@/lib/utils";
import { Quote, Star, Edit3 } from "lucide-react";

interface TestimonialInlineBlockProps {
  text?: string;
  authorName?: string;
  authorRole?: string;
  rating?: number;
  showStars?: boolean;
  onClick?: () => void;
  className?: string;
  onPropertyChange?: (key: string, value: any) => void;
  disabled?: boolean;
}

const TestimonialInlineBlock: React.FC<TestimonialInlineBlockProps> = ({
  text = "Descobri meu estilo autêntico e agora me visto com muito mais confiança!",
  authorName = "Maria Silva",
  authorRole = "Cliente satisfeita",
  rating = 5,
  showStars = true,
  onClick,
  className,
  onPropertyChange,
  disabled = false,
}) => {
  return (
    <div
      className={cn(
        "inline-flex items-start gap-3 p-4 bg-[#fff7f3] rounded-lg border border-[#B89B7A]/20",
        "transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer",
        "w-full",
        disabled && "opacity-75 cursor-not-allowed",
        className,
      )}
      onClick={!disabled ? onClick : undefined}
    >
      {/* Quote Icon */}
      <div className="flex-shrink-0 w-8 h-8 bg-[#B89B7A] rounded-full flex items-center justify-center mt-1">
        <Quote className="w-4 h-4 text-white" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Stars */}
        {showStars && (
          <div className="flex items-center gap-1 mb-2">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-3 h-3",
                  i < rating ? "text-yellow-400 fill-current" : "text-gray-300",
                )}
              />
            ))}
          </div>
        )}

        {/* Testimonial Text */}
        <p
          className="text-sm text-[#432818] mb-2 line-clamp-3 italic"
          onClick={(e) => {
            e.stopPropagation();
            if (onPropertyChange && !disabled) {
              const newText = prompt("Novo depoimento:", text);
              if (newText !== null) onPropertyChange("text", newText);
            }
          }}
        >
          "{text}"
        </p>

        {/* Author */}
        <div className="text-xs text-[#8F7A6A]">
          <span
            className="font-medium"
            onClick={(e) => {
              e.stopPropagation();
              if (onPropertyChange && !disabled) {
                const newName = prompt("Novo nome:", authorName);
                if (newName !== null) onPropertyChange("authorName", newName);
              }
            }}
          >
            {authorName}
          </span>
          {authorRole && (
            <>
              <span className="mx-1">•</span>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  if (onPropertyChange && !disabled) {
                    const newRole = prompt("Novo cargo/descrição:", authorRole);
                    if (newRole !== null)
                      onPropertyChange("authorRole", newRole);
                  }
                }}
              >
                {authorRole}
              </span>
            </>
          )}
        </div>
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

export default TestimonialInlineBlock;

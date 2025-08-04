import React from "react";
import { cn } from "@/lib/utils";
import { useQuiz } from "@/hooks/useQuiz";
import { styleConfig } from "@/config/styleConfig";
import { Progress } from "@/components/ui/progress";

interface StyleCardBlockProps {
  showProgress?: boolean;
  showDescription?: boolean;
  showImage?: boolean;
  className?: string;
}

const StyleCardBlock: React.FC<StyleCardBlockProps> = ({
  showProgress = true,
  showDescription = true,
  showImage = true,
  className,
}) => {
  const { primaryStyle } = useQuiz();

  if (!primaryStyle) {
    return (
      <div className={cn("p-6 text-center text-[#432818]", className)}>
        <p>Finalize o quiz para ver seu estilo predominante</p>
      </div>
    );
  }

  // Handle both string and object style types
  const category =
    typeof primaryStyle === "string"
      ? primaryStyle
      : (primaryStyle as any).category;
  const percentage =
    typeof primaryStyle === "object"
      ? (primaryStyle as any).percentage || 85
      : 85;

  const styleData = styleConfig[category as keyof typeof styleConfig];

  if (!styleData) {
    return (
      <div className={cn("p-6 text-center text-[#432818]", className)}>
        <p>Estilo não encontrado: {category}</p>
      </div>
    );
  }

  const { image, description } = styleData;

  return (
    <div
      className={cn(
        "p-6 bg-white shadow-md border border-[#B89B7A]/20 rounded-lg card-elegant",
        className,
      )}
    >
      <div className="text-center mb-8">
        <div className="max-w-md mx-auto mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-[#8F7A6A]">
              Seu estilo predominante
            </span>
            <span className="text-[#aa6b5d] font-medium">{percentage}%</span>
          </div>
          {showProgress && (
            <Progress
              value={percentage}
              className="h-2 bg-[#F3E8E6]"
              indicatorClassName="bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d]"
            />
          )}
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-[#aa6b5d] mb-4">
          Estilo {category}
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          {showDescription && (
            <p className="text-[#432818] leading-relaxed">{description}</p>
          )}
        </div>

        {showImage && (
          <div className="max-w-xs sm:max-w-sm mx-auto relative">
            <img
              src={`${image}?q=auto:best&f=auto&w=238`}
              alt={`Estilo ${category}`}
              className="w-full h-auto rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
              loading="eager"
              width="238"
              height="auto"
            />
            {/* Decorative corners */}
            <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-[#B89B7A]"></div>
            <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-[#B89B7A]"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StyleCardBlock;

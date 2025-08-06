import React from "react";
import { cn } from "@/lib/utils";
import type { BlockComponentProps } from "@/types/blocks";

interface QuizIntroHeaderProperties {
  title: string;
  subtitle?: string;
  description?: string;
  backgroundColor?: string;
  textColor?: string;
  titleSize?: "sm" | "md" | "lg" | "xl";
  alignment?: "left" | "center" | "right";
  padding?: "sm" | "md" | "lg";
  showIcon?: boolean;
  iconType?: "quiz" | "star" | "question" | "heart";
}

const QuizIntroHeaderBlock: React.FC<BlockComponentProps> = ({
  block,
  properties,
  isSelected,
  onClick,
  onPropertyChange,
}) => {
  const {
    title = "Título do Quiz",
    subtitle,
    description,
    backgroundColor = "transparent",
    textColor = "#1a1a1a",
    titleSize = "lg",
    alignment = "center",
    padding = "md",
    showIcon = false,
    iconType = "quiz",
  } = properties || {};

  const handlePropertyUpdate = (key: string, value: any) => {
    onPropertyChange?.(key, value);
  };

  const getSizeClass = (size: string) => {
    const sizeMap = {
      sm: "text-2xl",
      md: "text-3xl",
      lg: "text-4xl",
      xl: "text-5xl",
    };
    return sizeMap[size as keyof typeof sizeMap] || sizeMap.lg;
  };

  const getAlignmentClass = (align: string) => {
    const alignMap = {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    };
    return alignMap[align as keyof typeof alignMap] || alignMap.center;
  };

  const getPaddingClass = (pad: string) => {
    const paddingMap = {
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    };
    return paddingMap[pad as keyof typeof paddingMap] || paddingMap.md;
  };

  const getIcon = () => {
    const iconMap = {
      quiz: "📝",
      star: "⭐",
      question: "❓",
      heart: "💖",
    };
    return iconMap[iconType as keyof typeof iconMap] || iconMap.quiz;
  };

  return (
    <div
      className={cn(
        "quiz-intro-header-block w-full transition-all duration-200",
        getPaddingClass(padding),
        getAlignmentClass(alignment),
        isSelected && "ring-2 ring-blue-500 ring-opacity-50"
      )}
      style={{
        backgroundColor,
        color: textColor,
      }}
      onClick={onClick}
    >
      {showIcon && <div className="text-4xl mb-4">{getIcon()}</div>}

      <h1
        className={cn("font-bold mb-4 transition-all duration-200", getSizeClass(titleSize))}
        contentEditable={isSelected}
        suppressContentEditableWarning
        onBlur={e => handlePropertyUpdate("title", e.target.textContent || "")}
      >
        {title}
      </h1>

      {subtitle && (
        <h2
          className="text-xl text-opacity-80 mb-3 transition-all duration-200"
          style={{ color: textColor }}
          contentEditable={isSelected}
          suppressContentEditableWarning
          onBlur={e => handlePropertyUpdate("subtitle", e.target.textContent || "")}
        >
          {subtitle}
        </h2>
      )}

      {description && (
        <p
          className="text-lg text-opacity-70 max-w-2xl mx-auto transition-all duration-200"
          style={{ color: textColor }}
          contentEditable={isSelected}
          suppressContentEditableWarning
          onBlur={e => handlePropertyUpdate("description", e.target.textContent || "")}
        >
          {description}
        </p>
      )}
    </div>
  );
};

export default QuizIntroHeaderBlock;

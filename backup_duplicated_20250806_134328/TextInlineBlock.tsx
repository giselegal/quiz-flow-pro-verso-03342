import { cn } from "@/lib/utils";
import { Edit3, Type } from "lucide-react";
import React, { useState } from "react";

interface TextInlineBlockProps {
  block?: {
    id: string;
    type: string;
    properties?: {
      content?: {
        text?: string;
      };
      style?: {
        fontSize?: string;
        fontFamily?: string;
        color?: string;
        textAlign?: "left" | "center" | "right" | "justify";
        fontWeight?: string;
        fontStyle?: string;
        textDecoration?: string;
        lineHeight?: string;
        letterSpacing?: string;
        backgroundColor?: string;
        borderRadius?: string;
        variant?: "default" | "brand" | "elegant" | "minimal";
      };
      layout?: {
        maxWidth?: string;
        margin?: string;
        padding?: string;
      };
    };
  };
  className?: string;
  onClick?: () => void;
  onPropertyChange?: (key: string, value: any) => void;
  isSelected?: boolean;
  isEditing?: boolean;
  text?: string;
  style?: React.CSSProperties;
}

export const TextInlineBlock: React.FC<TextInlineBlockProps> = ({
  block,
  className,
  onClick,
  onPropertyChange,
  isSelected = false,
  isEditing = false,
  text: directText,
  style: directStyle,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  console.log("🧱 TextInlineBlock render:", {
    blockId: block?.id,
    properties: block?.properties,
    directText,
    directStyle,
  });

  // Obter valores das propriedades do bloco ou usar props diretas
  const properties = block?.properties || {};
  const content = properties.content || {};
  const styleProps = properties.style || {};
  const layoutProps = properties.layout || {};

  // CORREÇÃO: Aceitar content como string OU objeto
  // Se content é string, usar diretamente
  // Se content é objeto, usar content.text
  const rawContent =
    (typeof content === "string" ? content : content.text) ||
    directText ||
    "Digite seu texto aqui...";

  // 🐛 DEBUG: Análise completa do conteúdo HTML
  const hasSpanTag = rawContent?.includes("<span");
  const hasStrongTag = rawContent?.includes("<strong");
  const hasEmTag = rawContent?.includes("<em");
  const hasHtmlTags = hasSpanTag || hasStrongTag || hasEmTag || rawContent?.includes("<");

  console.log("🐛 TextInlineBlock DEBUG COMPLETO:", {
    blockId: block?.id,
    rawContent,
    hasSpanTag,
    hasStrongTag,
    hasEmTag,
    hasHtmlTags,
    willRenderAsHTML: hasHtmlTags,
  });

  const text = rawContent;
  const variant = styleProps.variant || "default";

  // Definir estilos baseados na variante
  const getVariantStyles = () => {
    switch (variant) {
      case "brand":
        return {
          color: "#432818",
          background: "linear-gradient(135deg, #E8D5C4 0%, #F5F0E8 100%)",
          borderLeft: "4px solid #B89B7A",
          borderRadius: "8px",
          padding: "12px 16px",
          fontWeight: "500",
        };
      case "elegant":
        return {
          color: "white",
          background: "linear-gradient(135deg, #B89B7A 0%, #D4C2A8 100%)",
          borderRadius: "12px",
          padding: "16px 20px",
          fontWeight: "600",
          textShadow: "0 1px 3px rgba(0,0,0,0.1)",
        };
      case "minimal":
        return {
          color: "#432818",
          borderBottom: "2px solid #B89B7A",
          padding: "8px 0",
          fontWeight: "400",
        };
      default:
        return {
          color: styleProps.color || "#432818",
          backgroundColor: styleProps.backgroundColor || "transparent",
          borderRadius: styleProps.borderRadius || "0px",
        };
    }
  };

  const variantStyles = getVariantStyles();

  // Construir estilos combinados
  const combinedStyle: React.CSSProperties = {
    fontSize: styleProps.fontSize || "16px",
    fontFamily: styleProps.fontFamily || "Inter, sans-serif",
    textAlign: styleProps.textAlign || "left",
    fontWeight: styleProps.fontWeight || variantStyles.fontWeight || "normal",
    fontStyle: styleProps.fontStyle || "normal",
    textDecoration: styleProps.textDecoration || "none",
    lineHeight: styleProps.lineHeight || "1.6",
    letterSpacing: styleProps.letterSpacing || "0.01em",
    maxWidth: layoutProps.maxWidth || "none",
    margin: layoutProps.margin || "0",
    padding: layoutProps.padding || variantStyles.padding || "8px",
    cursor: onClick ? "pointer" : "default",
    transition: "all 0.3s ease",
    position: "relative",
    ...variantStyles,
    ...directStyle,
  };

  const isEmpty = !text || text === "Digite seu texto aqui...";

  return (
    <div
      className={cn(
        "inline-text-block group relative transition-all duration-300",
        onClick && "cursor-pointer",
        isSelected && "ring-2 ring-[#B89B7A]/40 shadow-lg shadow-[#B89B7A]/10",
        isHovered && "transform scale-[1.02]",
        variant === "brand" && "hover:shadow-md hover:shadow-[#B89B7A]/20",
        variant === "elegant" && "hover:shadow-lg hover:shadow-[#B89B7A]/30",
        variant === "minimal" && "hover:border-[#B89B7A]",
        isEmpty &&
          "border-2 border-dashed border-[#B89B7A]/30 min-h-[40px] flex items-center justify-center",
        className
      )}
      style={combinedStyle}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-block-type="text-inline"
      data-block-id={block?.id}
    >
      {/* Editor indicator */}
      {isEditing && (
        <div className="absolute -top-2 -right-2 w-5 h-5 bg-[#B89B7A] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Edit3 className="w-3 h-3 text-white" />
        </div>
      )}

      {/* Empty state */}
      {isEmpty && (
        <div className="flex items-center gap-2 text-[#B89B7A]/60">
          <Type className="w-4 h-4" />
          <span className="text-sm font-medium">Digite seu texto aqui...</span>
        </div>
      )}

      {/* Text content */}
      {!isEmpty && hasHtmlTags ? (
        <div className="relative z-10" dangerouslySetInnerHTML={{ __html: text }} />
      ) : (
        !isEmpty && <span className="relative z-10">{text}</span>
      )}

      {/* Decorative elements for variants */}
      {variant === "elegant" && !isEmpty && (
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-12px opacity-50" />
      )}

      {variant === "brand" && !isEmpty && (
        <div className="absolute top-0 right-0 w-8 h-8 bg-[#B89B7A]/10 rounded-full -translate-y-1 translate-x-1" />
      )}
    </div>
  );
};

export default TextInlineBlock;

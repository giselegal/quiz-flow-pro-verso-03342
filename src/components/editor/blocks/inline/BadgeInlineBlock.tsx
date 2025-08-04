import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface BadgeInlineBlockProps {
  block?: {
    id: string;
    type: string;
    properties?: {
      content?: {
        text?: string;
        icon?: string;
      };
      style?: {
        variant?: "default" | "secondary" | "destructive" | "outline";
        backgroundColor?: string;
        color?: string;
        fontSize?: string;
        padding?: string;
        borderRadius?: string;
      };
      layout?: {
        alignment?: "left" | "center" | "right";
        margin?: string;
      };
    };
  };
  className?: string;
  onClick?: () => void;
}

export const BadgeInlineBlock: React.FC<BadgeInlineBlockProps> = ({
  block,
  className,
  onClick,
}) => {
  console.log("🧱 BadgeInlineBlock render:", {
    blockId: block?.id,
    properties: block?.properties,
  });

  const properties = block?.properties || {};
  const content = properties.content || {};
  const styleProps = properties.style || {};
  const layoutProps = properties.layout || {};

  const text = content.text || "Badge";

  // Determinar o variant
  const getVariant = () => {
    switch (styleProps.variant) {
      case "secondary":
        return "secondary";
      case "destructive":
        return "destructive";
      case "outline":
        return "outline";
      default:
        return "default";
    }
  };

  // Estilos customizados
  const customStyle: React.CSSProperties = {
    backgroundColor: styleProps.backgroundColor,
    color: styleProps.color,
    fontSize: styleProps.fontSize,
    padding: styleProps.padding,
    borderRadius: styleProps.borderRadius,
    margin: layoutProps.margin,
  };

  // Container com alinhamento
  const containerClass = cn("badge-container inline-block", {
    "text-left": layoutProps.alignment === "left",
    "text-center": layoutProps.alignment === "center",
    "text-right": layoutProps.alignment === "right",
  });

  return (
    <div
      className={cn(containerClass, className)}
      data-block-type="badge-inline"
      data-block-id={block?.id}
      onClick={onClick}
    >
      <Badge
        variant={getVariant()}
        style={customStyle}
        className={cn(
          "transition-all duration-200 cursor-pointer",
          onClick && "hover:opacity-80",
        )}
      >
        {content.icon && <span className="mr-1">{content.icon}</span>}
        {text}
      </Badge>
    </div>
  );
};

export default BadgeInlineBlock;

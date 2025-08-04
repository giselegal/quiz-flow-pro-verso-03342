import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ButtonInlineBlockProps {
  block?: {
    id: string;
    type: string;
    properties?: {
      content?: {
        text?: string;
        url?: string;
        icon?: string;
      };
      style?: {
        variant?: "primary" | "secondary" | "outline" | "ghost";
        size?: "small" | "medium" | "large";
        backgroundColor?: string;
        color?: string;
        borderRadius?: string;
        fontSize?: string;
        padding?: string;
        width?: string;
      };
      layout?: {
        alignment?: "left" | "center" | "right";
        margin?: string;
      };
      advanced?: {
        disabled?: boolean;
        loading?: boolean;
        openInNewTab?: boolean;
      };
    };
  };
  className?: string;
  onClick?: () => void;
}

export const ButtonInlineBlock: React.FC<ButtonInlineBlockProps> = ({
  block,
  className,
  onClick,
}) => {
  console.log("🧱 ButtonInlineBlock render:", {
    blockId: block?.id,
    properties: block?.properties,
  });

  const properties = block?.properties || {};
  const content = properties.content || {};
  const styleProps = properties.style || {};
  const layoutProps = properties.layout || {};
  const advanced = properties.advanced || {};

  const text = content.text || "Clique aqui";
  const url = content.url || "#";

  // Determinar o variant do botão
  const getVariant = () => {
    switch (styleProps.variant) {
      case "secondary":
        return "secondary";
      case "outline":
        return "outline";
      case "ghost":
        return "ghost";
      default:
        return "default";
    }
  };

  // Determinar o tamanho do botão
  const getSize = () => {
    switch (styleProps.size) {
      case "small":
        return "sm";
      case "large":
        return "lg";
      default:
        return "default";
    }
  };

  // Estilos customizados
  const customStyle: React.CSSProperties = {
    backgroundColor: styleProps.backgroundColor,
    color: styleProps.color,
    borderRadius: styleProps.borderRadius,
    fontSize: styleProps.fontSize,
    padding: styleProps.padding,
    width: styleProps.width,
    margin: layoutProps.margin,
  };

  // Container com alinhamento
  const containerClass = cn("button-container", {
    "text-left": layoutProps.alignment === "left",
    "text-center": layoutProps.alignment === "center",
    "text-right": layoutProps.alignment === "right",
  });

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (onClick) {
      onClick();
    } else if (url && url !== "#" && !advanced.disabled) {
      if (advanced.openInNewTab) {
        window.open(url, "_blank");
      } else {
        window.location.href = url;
      }
    }
  };

  return (
    <div
      className={cn(containerClass, className)}
      data-block-type="button-inline"
      data-block-id={block?.id}
    >
      <Button
        variant={getVariant()}
        size={getSize()}
        disabled={advanced.disabled || advanced.loading}
        onClick={handleClick}
        style={customStyle}
        className={cn(
          "transition-all duration-200",
          advanced.loading && "opacity-70",
        )}
      >
        {advanced.loading ? (
          <>
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
            Carregando...
          </>
        ) : (
          <>
            {content.icon && <span className="mr-2">{content.icon}</span>}
            {text}
          </>
        )}
      </Button>
    </div>
  );
};

export default ButtonInlineBlock;

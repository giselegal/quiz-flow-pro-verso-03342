import { cn } from "@/lib/utils";
import React from "react";

interface ButtonInlineProps {
  text?: string;
  style?: "primary" | "secondary" | "outline";
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  backgroundColor?: string;
  textColor?: string;
  onClick?: () => void;
  className?: string;
  fullWidth?: boolean;
  borderRadius?: string;
  padding?: string;
  fontSize?: string;
  fontWeight?: string;
  boxShadow?: string;
  hoverEffect?: boolean;
  requiresValidInput?: boolean;
  disabled?: boolean;
  // Propriedades de layout
  textAlign?: string;
  justifyContent?: string;
  alignItems?: string;
  display?: string;
  margin?: string;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
}

export const ButtonInline: React.FC<ButtonInlineProps> = ({
  text = "Clique aqui",
  style = "primary",
  variant = "primary",
  size = "medium",
  backgroundColor = "#B89B7A",
  textColor = "#ffffff",
  onClick,
  className = "",
  fullWidth = false,
  borderRadius = "rounded-lg",
  padding,
  fontSize,
  fontWeight = "font-bold",
  boxShadow,
  hoverEffect = true,
  requiresValidInput = false,
  disabled = false,
  textAlign = "text-center",
  justifyContent = "center",
  alignItems = "center",
  display = "flex",
  margin = "0 auto",
  marginTop = 0,
  marginBottom = 0,
  marginLeft = 0,
  marginRight = 0,
}) => {
  // Usar variant se style não estiver definido
  const actualVariant = variant || style;

  const sizeClasses = {
    small: "px-4 py-2 text-sm",
    medium: "px-6 py-3 text-base",
    large: "px-8 py-4 text-lg",
  };

  const variantClasses = {
    primary: `bg-[${backgroundColor}] text-[${textColor}] hover:bg-[${backgroundColor}]/90 border-[${backgroundColor}]`,
    secondary: "bg-gray-600 text-white hover:bg-gray-700 border-gray-600",
    outline: `bg-transparent text-[${backgroundColor}] border-2 border-[${backgroundColor}] hover:bg-[${backgroundColor}] hover:text-white`,
  };

  // Função para converter margens numéricas em classes Tailwind
  const getMarginClass = (value: number, type: "top" | "bottom" | "left" | "right"): string => {
    if (!value || value === 0) return "";

    const prefix = type === "top" ? "mt" : type === "bottom" ? "mb" : type === "left" ? "ml" : "mr";

    // Converter pixels em unidades Tailwind (aproximadamente)
    if (value <= 4) return `${prefix}-1`;
    if (value <= 8) return `${prefix}-2`;
    if (value <= 12) return `${prefix}-3`;
    if (value <= 16) return `${prefix}-4`;
    if (value <= 20) return `${prefix}-5`;
    if (value <= 24) return `${prefix}-6`;
    if (value <= 32) return `${prefix}-8`;
    if (value <= 40) return `${prefix}-10`;
    if (value <= 48) return `${prefix}-12`;
    if (value <= 64) return `${prefix}-16`;
    if (value <= 80) return `${prefix}-20`;
    return `${prefix}-24`;
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || requiresValidInput}
      className={cn(
        // Base styles
        "inline-flex items-center justify-center font-bold transition-all duration-300 border",
        "focus:outline-none focus:ring-4 focus:ring-opacity-50",

        // Size
        padding || sizeClasses[size],

        // Variant/Style
        variantClasses[actualVariant as keyof typeof variantClasses],

        // Layout
        fullWidth && "w-full",
        borderRadius || "rounded-lg",
        textAlign,

        // Typography
        fontSize || sizeClasses[size].split(" ")[1], // Extrai classe de texto do size
        fontWeight,

        // Effects
        boxShadow,
        hoverEffect && "hover:shadow-lg hover:scale-105 active:scale-95",

        // States
        disabled && "opacity-50 cursor-not-allowed",
        requiresValidInput && "opacity-75 cursor-not-allowed",

        // Margins
        getMarginClass(marginTop, "top"),
        getMarginClass(marginBottom, "bottom"),
        getMarginClass(marginLeft, "left"),
        getMarginClass(marginRight, "right"),

        // Custom classes
        className
      )}
      style={{
        backgroundColor: actualVariant === "primary" ? backgroundColor : undefined,
        color: actualVariant === "primary" ? textColor : undefined,
        borderColor: backgroundColor,
        ...(actualVariant === "outline" && {
          backgroundColor: "transparent",
          color: backgroundColor,
        }),
      }}
    >
      {text}
    </button>
  );
};

export default ButtonInline;

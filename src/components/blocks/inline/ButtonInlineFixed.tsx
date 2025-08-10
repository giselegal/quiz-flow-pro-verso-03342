import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import type { BlockComponentProps } from "../../../types/blocks";

/**
 * ButtonInline - Componente de botão inline modular
 * Botão CTA responsivo e configurável
 * MODULAR | REUTILIZÁVEL | RESPONSIVO | INDEPENDENTE
 */
const ButtonInline: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  onPropertyChange,
  className = "",
}) => {
  // Estado local para controle dinâmico do botão
  const [buttonState, setButtonState] = useState({
    dynamicDisabled: false,
    dynamicRequiresValidInput: false,
  });

  // Destructuring das propriedades do bloco
  const {
    text = "Clique aqui",
    style = "primary",
    variant = "primary",
    size = "large",
    backgroundColor = "#B89B7A",
    textColor = "#ffffff",
    fullWidth = true,
    borderRadius = "rounded-full",
    padding,
    fontSize = "text-lg",
    fontWeight = "font-bold",
    boxShadow = "shadow-xl",
    hoverEffect = true,
    requiresValidInput = false,
    disabled = false,
    // Propriedades de layout
    textAlign = "text-center",
    justifyContent = "center",
    alignItems = "center",
    display = "flex",
    margin = "0 auto",
    marginTop = 0,
    marginBottom = 0,
    marginLeft = 0,
    marginRight = 0,
  } = block?.properties ?? {};

  console.log("🚀 ButtonInline renderizado:", {
    blockId: block?.id,
    text,
    backgroundColor,
    textColor,
    fullWidth,
    size,
    variant,
    allProperties: block?.properties,
  });

  // ✅ LISTENER PARA EVENTOS DE VALIDAÇÃO STEP01
  useEffect(() => {
    const handleButtonStateChange = (event: CustomEvent) => {
      const { buttonId, enabled, disabled, requiresValidInput } = event.detail;
      
      // Verifica se o evento é para este botão
      if (buttonId === block?.id || (block?.id === 'cta-button-modular' && buttonId === 'cta-button-modular')) {
        setButtonState({
          dynamicDisabled: disabled || false,
          dynamicRequiresValidInput: requiresValidInput || false,
        });

        console.log('🎯 ButtonInline estado atualizado:', {
          buttonId: block?.id,
          enabled,
          disabled,
          requiresValidInput,
        });
      }
    };

    window.addEventListener('step01-button-state-change', handleButtonStateChange as EventListener);
    
    return () => {
      window.removeEventListener('step01-button-state-change', handleButtonStateChange as EventListener);
    };
  }, [block?.id]);

  // Usar variant se style não estiver definido
  const actualVariant = variant || style;

  const sizeClasses = {
    small: "px-4 py-2 text-sm",
    medium: "px-6 py-3 text-base",
    large: "px-8 py-4 text-lg",
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

  // ✅ LÓGICA DE DESABILITAÇÃO DINÂMICA
  const isButtonDisabled = disabled || requiresValidInput || buttonState.dynamicDisabled || buttonState.dynamicRequiresValidInput;

  const handleButtonClick = () => {
    // ⚠️ Bloquear clique se botão está desabilitado
    if (isButtonDisabled) {
      console.log("🚫 Botão desabilitado - clique bloqueado:", {
        disabled,
        requiresValidInput,
        dynamicDisabled: buttonState.dynamicDisabled,
        dynamicRequiresValidInput: buttonState.dynamicRequiresValidInput,
      });
      return;
    }

    onClick?.();
    console.log("🎯 ButtonInline CTA clicado:", {
      text,
      blockId: block?.id,
      isButtonDisabled,
    });
  };

  return (
    <div
      className={cn(
        "flex justify-center items-center w-full",
        // Margins do container
        getMarginClass(marginTop, "top"),
        getMarginClass(marginBottom, "bottom"),
        getMarginClass(marginLeft, "left"),
        getMarginClass(marginRight, "right"),
        isSelected && "ring-2 ring-[#B89B7A] ring-offset-2",
        className
      )}
    >
      <button
        onClick={handleButtonClick}
        disabled={isButtonDisabled}
        className={cn(
          // Base styles
          "inline-flex items-center justify-center font-bold transition-all duration-300",
          "focus:outline-none focus:ring-4 focus:ring-[#B89B7A] focus:ring-opacity-50",
          "border-2",

          // Size
          padding || sizeClasses[size as keyof typeof sizeClasses] || sizeClasses.large,

          // Layout
          fullWidth ? "w-full" : "w-auto",
          borderRadius || "rounded-full",

          // Typography
          fontSize || "text-lg",
          fontWeight || "font-bold",

          // Effects
          boxShadow,
          hoverEffect && "hover:shadow-xl hover:scale-105 active:scale-95",

          // States - Usando lógica dinâmica de desabilitação
          isButtonDisabled && "opacity-50 cursor-not-allowed",
          
          // Hover effects - apenas se não estiver desabilitado
          !isButtonDisabled && "hover:shadow-2xl hover:brightness-110"
        )}
        style={{
          backgroundColor,
          color: textColor,
          borderColor: backgroundColor,
        }}
      >
        {text}
      </button>
    </div>
  );
};

export default ButtonInline;

import { cn } from "../../../lib/utils";
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

  // Destructuring das propriedades do bloco - TODAS EDITÁVEIS
  const {
    // ✨ TEXTO E CONTEÚDO
    text = "Clique aqui",
    label = "",

    // ✨ ESTILO E VARIANTE
    style = "primary",
    variant = "primary",
    size = "large",

    // ✨ CORES EDITÁVEIS
    backgroundColor = "#B89B7A",
    textColor = "#ffffff",
    borderColor = "#B89B7A",
    hoverBackgroundColor = "#aa6b5d",
    hoverTextColor = "#ffffff",
    focusColor = "#B89B7A",

    // ✨ TAMANHO E LAYOUT RESPONSIVO
    fullWidth = true,
    width = "auto",
    height = "auto",
    minWidth = "120px",
    maxWidth = "none",

    // ✨ TIPOGRAFIA EDITÁVEL
    fontSize = "text-lg",
    fontWeight = "font-bold",
    fontFamily = "inherit",
    lineHeight = "1.5",
    letterSpacing = "normal",
    textTransform = "none",

    // ✨ BORDAS E CANTOS ARREDONDADOS
    borderRadius = "rounded-full",
    borderWidth = "2px",
    borderStyle = "solid",

    // ✨ ESPAÇAMENTO EDITÁVEL
    padding = "",
    paddingX = "",
    paddingY = "",
    paddingTop = "",
    paddingBottom = "",
    paddingLeft = "",
    paddingRight = "",

    // ✨ MARGENS EDITÁVEIS
    marginTop = 0,
    marginBottom = 0,
    marginLeft = 0,
    marginRight = 0,

    // ✨ EFEITOS E SOMBRAS
    boxShadow = "shadow-lg",
    hoverEffect = true,
    clickEffect = true,
    glowEffect = false,
    gradientBackground = false,
    gradientColors = ["#B89B7A", "#aa6b5d"],

    // ✨ COMPORTAMENTO E VALIDAÇÃO
    requiresValidInput = false,
    conditionalActivation = false,
    validationTarget = "name-input",
    disabled = false,
    loading = false,

    // ✨ NAVEGAÇÃO E AÇÃO
    action = "custom",
    nextStep = "",
    targetUrl = "",
    openInNewTab = false,
    scrollToTop = true,

    // ✨ RESPONSIVIDADE
    mobileFullWidth = true,
    mobileSize = "medium",
    mobileFontSize = "text-base",
    tabletSize = "large",
    desktopSize = "large",

    // ✨ ANIMAÇÕES
    animationType = "none",
    animationDuration = "300ms",
    animationDelay = "0ms",
    transitionEasing = "ease-in-out",

    // ✨ LAYOUT AVANÇADO
    textAlign = "text-center",
    justifyContent = "center",
    alignItems = "center",
    display = "flex",
    position = "relative",
    zIndex = "auto",

    // ✨ ACESSIBILIDADE
    ariaLabel = "",
    title = "",
    tabIndex = 0,
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

  // ✅ LISTENER PARA EVENTOS DE VALIDAÇÃO - CONDICIONAL E CUSTOMIZÁVEL
  useEffect(() => {
    // Se não tem ativação condicional, não precisa escutar eventos
    if (!conditionalActivation) {
      setButtonState({
        dynamicDisabled: false,
        dynamicRequiresValidInput: false,
      });
      return;
    }

    const handleButtonStateChange = (event: CustomEvent) => {
      const { buttonId, enabled, disabled, requiresValidInput } = event.detail;

      // Verifica se o evento é para este botão
      if (
        buttonId === block?.id ||
        (block?.id === "cta-button-modular" &&
          buttonId === "cta-button-modular")
      ) {
        setButtonState({
          dynamicDisabled: disabled || false,
          dynamicRequiresValidInput: requiresValidInput || false,
        });

        console.log("🎯 ButtonInline estado atualizado:", {
          buttonId: block?.id,
          enabled,
          disabled,
          requiresValidInput,
          conditionalActivation,
        });
      }
    };

    // Listener para validação de input específico
    const handleInputValidation = (event: CustomEvent) => {
      const { blockId, value, valid } = event.detail;

      // Verifica se é o input alvo da validação
      if (blockId === validationTarget || blockId.includes(validationTarget)) {
        const isValid = valid && value?.trim()?.length >= 2;

        setButtonState({
          dynamicDisabled: !isValid,
          dynamicRequiresValidInput: !isValid,
        });

        console.log("🎯 Validação de input:", {
          buttonId: block?.id,
          validationTarget,
          inputBlockId: blockId,
          value,
          isValid,
        });
      }
    };

    if (conditionalActivation) {
      window.addEventListener(
        "step01-button-state-change",
        handleButtonStateChange as EventListener
      );
      window.addEventListener(
        "quiz-input-change",
        handleInputValidation as EventListener
      );
    }

    return () => {
      window.removeEventListener(
        "step01-button-state-change",
        handleButtonStateChange as EventListener
      );
      window.removeEventListener(
        "quiz-input-change",
        handleInputValidation as EventListener
      );
    };
  }, [block?.id, conditionalActivation, validationTarget]);

  // Usar variant se style não estiver definido
  const actualVariant = variant || style;

  // ✨ CLASSES DE TAMANHO RESPONSIVAS E EDITÁVEIS
  const sizeClasses = {
    small: "px-3 py-2 text-sm",
    medium: "px-6 py-3 text-base",
    large: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl",
    xxl: "px-12 py-6 text-2xl",
  };

  // ✨ CLASSES RESPONSIVAS BASEADAS NAS PROPRIEDADES
  const getResponsiveClasses = () => {
    const mobileClass = mobileSize
      ? sizeClasses[mobileSize as keyof typeof sizeClasses]
      : "";
    const tabletClass = tabletSize
      ? `md:${sizeClasses[tabletSize as keyof typeof sizeClasses]}`
      : "";
    const desktopClass = desktopSize
      ? `lg:${sizeClasses[desktopSize as keyof typeof sizeClasses]}`
      : "";

    return `${mobileClass} ${tabletClass} ${desktopClass}`.trim();
  };

  // ✨ PADDING CUSTOMIZADO OU CLASSES DE TAMANHO
  const getPaddingClasses = () => {
    if (padding) return padding;
    if (paddingX && paddingY) return `${paddingX} ${paddingY}`;
    if (paddingTop || paddingBottom || paddingLeft || paddingRight) {
      return `${paddingTop || ""} ${paddingRight || ""} ${paddingBottom || ""} ${paddingLeft || ""}`.trim();
    }
    return (
      getResponsiveClasses() ||
      sizeClasses[size as keyof typeof sizeClasses] ||
      sizeClasses.large
    );
  };

  // ✨ BACKGROUND COM SUPORTE A GRADIENTE
  const getBackgroundStyle = () => {
    if (gradientBackground && gradientColors.length >= 2) {
      return {
        background: `linear-gradient(135deg, ${gradientColors.join(", ")})`,
      };
    }
    return {
      backgroundColor,
    };
  };

  // Função para converter margens numéricas em classes Tailwind
  const getMarginClass = (
    value: number,
    type: "top" | "bottom" | "left" | "right"
  ): string => {
    if (!value || value === 0) return "";

    const prefix =
      type === "top"
        ? "mt"
        : type === "bottom"
          ? "mb"
          : type === "left"
            ? "ml"
            : "mr";

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

  // ✅ LÓGICA DE DESABILITAÇÃO DINÂMICA E CONDICIONAL
  const isButtonDisabled =
    disabled ||
    loading ||
    (conditionalActivation &&
      (requiresValidInput ||
        buttonState.dynamicDisabled ||
        buttonState.dynamicRequiresValidInput));

  // ✅ HANDLER DE CLIQUE COM NAVEGAÇÃO E AÇÕES
  const handleButtonClick = async () => {
    // ⚠️ Bloquear clique se botão está desabilitado
    if (isButtonDisabled) {
      console.log("🚫 Botão desabilitado - clique bloqueado:", {
        disabled,
        loading,
        requiresValidInput,
        conditionalActivation,
        dynamicDisabled: buttonState.dynamicDisabled,
        dynamicRequiresValidInput: buttonState.dynamicRequiresValidInput,
      });
      return;
    }

    // ✅ Executar ação personalizada baseada na propriedade 'action'
    try {
      switch (action) {
        case "next-step":
          if (nextStep) {
            console.log("📝 Navegando para próxima etapa:", nextStep);
            // Disparar evento de navegação
            window.dispatchEvent(
              new CustomEvent("quiz-navigate", {
                detail: { step: nextStep, scrollToTop },
              })
            );
          }
          break;

        case "url":
          if (targetUrl) {
            console.log("🌐 Navegando para URL:", targetUrl);
            if (openInNewTab) {
              window.open(targetUrl, "_blank");
            } else {
              window.location.href = targetUrl;
            }
          }
          break;

        case "submit":
          console.log("📤 Enviando formulário/dados");
          window.dispatchEvent(
            new CustomEvent("quiz-submit", {
              detail: { buttonId: block?.id, step: nextStep },
            })
          );
          break;

        case "custom":
        default:
          console.log("🔧 Ação customizada");
          break;
      }

      // ✅ Callback original
      onClick?.();

      // ✅ Scroll para o topo se configurado
      if (scrollToTop) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }

      console.log("🎯 ButtonInline CTA clicado:", {
        text,
        blockId: block?.id,
        action,
        nextStep,
        targetUrl,
        isButtonDisabled,
      });
    } catch (error) {
      console.error("❌ Erro ao executar ação do botão:", error);
    }
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
        aria-label={ariaLabel || text}
        title={title || text}
        tabIndex={tabIndex}
        className={cn(
          // ✨ BASE STYLES
          "inline-flex items-center justify-center transition-all",
          "focus:outline-none focus:ring-4 focus:ring-opacity-50",

          // ✨ TIPOGRAFIA EDITÁVEL
          fontSize || "text-lg",
          fontWeight || "font-bold",
          fontFamily !== "inherit" && `font-[${fontFamily}]`,
          letterSpacing !== "normal" && `tracking-${letterSpacing}`,
          textTransform !== "none" && textTransform,

          // ✨ PADDING RESPONSIVO E CUSTOMIZÁVEL
          getPaddingClasses(),

          // ✨ LAYOUT RESPONSIVO
          fullWidth ? "w-full" : "w-auto",
          mobileFullWidth && "w-full md:w-auto",

          // ✨ BORDAS E CANTOS ARREDONDADOS
          borderRadius || "rounded-lg",
          "border",
          borderWidth && `border-[${borderWidth}]`,

          // ✨ EFEITOS E ANIMAÇÕES
          hoverEffect &&
            !isButtonDisabled &&
            "hover:shadow-xl hover:scale-105 active:scale-95",
          clickEffect && !isButtonDisabled && "active:scale-95",
          glowEffect &&
            !isButtonDisabled &&
            "hover:shadow-2xl hover:shadow-current/25",

          // ✨ TRANSIÇÕES
          `duration-${animationDuration?.replace("ms", "") || "300"}`,
          transitionEasing &&
            `ease-${transitionEasing.replace("ease-", "") || "in-out"}`,

          // ✨ ESTADOS RESPONSIVOS
          isButtonDisabled && "opacity-50 cursor-not-allowed",
          loading && "cursor-wait",

          // ✨ RESPONSIVIDADE MOBILE/TABLET/DESKTOP
          mobileFontSize && `${mobileFontSize} md:${fontSize || "text-lg"}`,

          // ✨ HOVER EFFECTS - apenas se não estiver desabilitado
          !isButtonDisabled && "hover:brightness-110",

          // ✨ FOCUS STYLES
          `focus:ring-[${focusColor}]`,

          // ✨ POSITION E Z-INDEX
          position,
          zIndex !== "auto" && `z-${zIndex}`,

          // ✨ CLASSES DE ALINHAMENTO
          textAlign,
          `justify-${justifyContent}`,
          `items-${alignItems}`
        )}
        style={{
          // ✨ CORES CUSTOMIZÁVEIS
          ...getBackgroundStyle(),
          color: textColor,
          borderColor: borderColor,

          // ✨ DIMENSÕES CUSTOMIZÁVEIS
          width: !fullWidth && width !== "auto" ? width : undefined,
          height: height !== "auto" ? height : undefined,
          minWidth: minWidth !== "120px" ? minWidth : undefined,
          maxWidth: maxWidth !== "none" ? maxWidth : undefined,

          // ✨ TIPOGRAFIA AVANÇADA
          fontFamily: fontFamily !== "inherit" ? fontFamily : undefined,
          lineHeight: lineHeight !== "1.5" ? lineHeight : undefined,

          // ✨ SOMBRAS CUSTOMIZÁVEIS
          boxShadow: boxShadow && !isButtonDisabled ? boxShadow : undefined,
        }}
        onMouseEnter={(e) => {
          if (!isButtonDisabled && hoverBackgroundColor) {
            e.currentTarget.style.backgroundColor = hoverBackgroundColor;
            e.currentTarget.style.color = hoverTextColor || textColor;
          }
        }}
        onMouseLeave={(e) => {
          if (!isButtonDisabled) {
            e.currentTarget.style.backgroundColor = backgroundColor;
            e.currentTarget.style.color = textColor;
          }
        }}
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            <span>Carregando...</span>
          </div>
        ) : (
          <span className="flex items-center gap-2">
            {label && (
              <span className="text-xs uppercase tracking-wide opacity-75">
                {label}
              </span>
            )}
            {text}
          </span>
        )}
      </button>
    </div>
  );
};

export default ButtonInline;

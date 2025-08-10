/**
 * Hook para propriedades de container e gerar classes CSS
 * Converte as propriedades do Step01Template em classes Tailwind
 */
export interface ContainerProperties {
  containerWidth?: "full" | "large" | "medium" | "small";
  containerPosition?: "left" | "center" | "right";
  spacing?:
    | "none"
    | "horizontal-only"
    | "small"
    | "small-horizontal"
    | "compact"
    | "compact-horizontal"
    | "normal"
    | "normal-horizontal"
    | "comfortable"
    | "comfortable-horizontal"
    | "spacious"
    | "spacious-horizontal";
  gridColumns?: "auto" | "full" | "half";
  backgroundColor?: "transparent" | "white" | "gray-50" | "brand-light";
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  scale?: number; // 🎯 Propriedade de escala (50-200%)
}

export const useContainerProperties = (properties: ContainerProperties = {}) => {
  console.log("🏗️ useContainerProperties chamado com:", properties);

  const {
    containerWidth = "full",
    containerPosition = "center",
    spacing = "small", // 🎯 Padrão alterado para "small" (0.75rem/12px)
    gridColumns = "auto",
    backgroundColor = "transparent",
    marginTop = 0,
    marginBottom = 0,
    marginLeft = 0,
    marginRight = 0,
    scale = 100, // 🎯 Valor padrão 100%
  } = properties;

  // Gerar classes CSS baseadas nas propriedades
  const getContainerClasses = (): string => {
    const classes: string[] = [];

    // 🔧 Container Width Classes (aplicar apenas o tamanho, sem mx-auto duplicado)
    switch (containerWidth) {
      case "full":
        classes.push("w-full");
        break;
      case "large":
        classes.push("w-full max-w-4xl");
        break;
      case "medium":
        classes.push("w-full max-w-2xl");
        break;
      case "small":
        classes.push("w-full max-w-md");
        break;
      default:
        classes.push("w-full");
    }

    // 🎯 Container Position Classes (aplicar apenas uma vez)
    switch (containerPosition) {
      case "left":
        classes.push("ml-0 mr-auto");
        break;
      case "center":
        classes.push("mx-auto");
        break;
      case "right":
        classes.push("ml-auto mr-0");
        break;
      default:
        classes.push("mx-auto");
    }

    // 📦 Spacing Classes (padding interno do componente)
    switch (spacing) {
      case "none":
        // Sem padding
        break;
      case "horizontal-only":
        classes.push("px-3"); // 0.75rem horizontal, 0 vertical
        break;
      case "small":
        classes.push("px-3"); // ✅ ALTERADO: apenas horizontal
        break;
      case "small-horizontal":
        classes.push("px-3"); // 0.75rem horizontal, 0 vertical
        break;
      case "compact":
        classes.push("px-2"); // ✅ ALTERADO: apenas horizontal
        break;
      case "compact-horizontal":
        classes.push("px-2"); // 0.5rem horizontal, 0 vertical
        break;
      case "normal":
        classes.push("px-4"); // ✅ ALTERADO: apenas horizontal
        break;
      case "normal-horizontal":
        classes.push("px-4"); // 1rem horizontal, 0 vertical
        break;
      case "comfortable":
        classes.push("px-6"); // ✅ ALTERADO: apenas horizontal
        break;
      case "comfortable-horizontal":
        classes.push("px-6"); // 1.5rem horizontal, 0 vertical
        break;
      case "spacious":
        classes.push("px-8"); // ✅ ALTERADO: apenas horizontal
        break;
      case "spacious-horizontal":
        classes.push("px-8"); // 2rem horizontal, 0 vertical
        break;
      default:
        classes.push("px-3"); // Apenas padding horizontal
    }

    // 🎨 Background Color Classes
    switch (backgroundColor) {
      case "white":
        classes.push("bg-white");
        break;
      case "gray-50":
        classes.push("bg-gray-50");
        break;
      case "brand-light":
        classes.push("bg-[#D4C2A8]");
        break;
      case "transparent":
      default:
        // Sem cor de fundo
        break;
    }

    // 📏 Margin Top Classes (suporte a valores positivos e negativos)
    if (marginTop && marginTop !== 0) {
      if (marginTop < 0) {
        // Margens negativas
        if (marginTop >= -8) classes.push("-mt-2");
        else if (marginTop >= -16) classes.push("-mt-4");
        else if (marginTop >= -24) classes.push("-mt-6");
        else if (marginTop >= -32) classes.push("-mt-8");
        else if (marginTop >= -40) classes.push("-mt-10");
        else classes.push("-mt-12");
      } else {
        // Margens positivas - expandido para suportar até 100px
        if (marginTop <= 8) classes.push("mt-2");
        else if (marginTop <= 16) classes.push("mt-4");
        else if (marginTop <= 24) classes.push("mt-6");
        else if (marginTop <= 32) classes.push("mt-8");
        else if (marginTop <= 40) classes.push("mt-10");
        else if (marginTop <= 48) classes.push("mt-12");
        else if (marginTop <= 56) classes.push("mt-14");
        else if (marginTop <= 64) classes.push("mt-16");
        else if (marginTop <= 80) classes.push("mt-20");
        else if (marginTop <= 96) classes.push("mt-24");
        else classes.push("mt-28");
      }
    }

    // 📏 Margin Bottom Classes (suporte a valores positivos e negativos)
    if (marginBottom && marginBottom !== 0) {
      if (marginBottom < 0) {
        // Margens negativas
        if (marginBottom >= -8) classes.push("-mb-2");
        else if (marginBottom >= -16) classes.push("-mb-4");
        else if (marginBottom >= -24) classes.push("-mb-6");
        else if (marginBottom >= -32) classes.push("-mb-8");
        else if (marginBottom >= -40) classes.push("-mb-10");
        else classes.push("-mb-12");
      } else {
        // Margens positivas - expandido para suportar até 100px
        if (marginBottom <= 8) classes.push("mb-2");
        else if (marginBottom <= 16) classes.push("mb-4");
        else if (marginBottom <= 24) classes.push("mb-6");
        else if (marginBottom <= 32) classes.push("mb-8");
        else if (marginBottom <= 40) classes.push("mb-10");
        else if (marginBottom <= 48) classes.push("mb-12");
        else if (marginBottom <= 56) classes.push("mb-14");
        else if (marginBottom <= 64) classes.push("mb-16");
        else if (marginBottom <= 80) classes.push("mb-20");
        else if (marginBottom <= 96) classes.push("mb-24");
        else classes.push("mb-28");
      }
    }

    // 📏 Margin Left Classes (suporte a valores positivos e negativos)
    if (marginLeft && marginLeft !== 0) {
      if (marginLeft < 0) {
        // Margens negativas
        if (marginLeft >= -8) classes.push("-ml-2");
        else if (marginLeft >= -16) classes.push("-ml-4");
        else if (marginLeft >= -24) classes.push("-ml-6");
        else if (marginLeft >= -32) classes.push("-ml-8");
        else if (marginLeft >= -40) classes.push("-ml-10");
        else classes.push("-ml-12");
      } else {
        // Margens positivas
        if (marginLeft <= 8) classes.push("ml-2");
        else if (marginLeft <= 16) classes.push("ml-4");
        else if (marginLeft <= 24) classes.push("ml-6");
        else if (marginLeft <= 32) classes.push("ml-8");
        else if (marginLeft <= 40) classes.push("ml-10");
        else if (marginLeft <= 48) classes.push("ml-12");
        else if (marginLeft <= 56) classes.push("ml-14");
        else if (marginLeft <= 64) classes.push("ml-16");
        else if (marginLeft <= 80) classes.push("ml-20");
        else if (marginLeft <= 96) classes.push("ml-24");
        else classes.push("ml-28");
      }
    }

    // 📏 Margin Right Classes (suporte a valores positivos e negativos)
    if (marginRight && marginRight !== 0) {
      if (marginRight < 0) {
        // Margens negativas
        if (marginRight >= -8) classes.push("-mr-2");
        else if (marginRight >= -16) classes.push("-mr-4");
        else if (marginRight >= -24) classes.push("-mr-6");
        else if (marginRight >= -32) classes.push("-mr-8");
        else if (marginRight >= -40) classes.push("-mr-10");
        else classes.push("-mr-12");
      } else {
        // Margens positivas
        if (marginRight <= 8) classes.push("mr-2");
        else if (marginRight <= 16) classes.push("mr-4");
        else if (marginRight <= 24) classes.push("mr-6");
        else if (marginRight <= 32) classes.push("mr-8");
        else if (marginRight <= 40) classes.push("mr-10");
        else if (marginRight <= 48) classes.push("mr-12");
        else if (marginRight <= 56) classes.push("mr-14");
        else if (marginRight <= 64) classes.push("mr-16");
        else if (marginRight <= 80) classes.push("mr-20");
        else if (marginRight <= 96) classes.push("mr-24");
        else classes.push("mr-28");
      }
    }

    return classes.filter(Boolean).join(" ");
  };

  // Gerar propriedades de estilo inline (para casos específicos)
  const getInlineStyles = (): React.CSSProperties => {
    const styles: React.CSSProperties = {};

    // 🎯 Aplicar escala que afeta realmente o layout flow
    if (scale && scale !== 100) {
      const scaleFactor = scale / 100;

      // Usar transform com configuração que minimiza espaço vazio
      styles.transform = `scale(${scaleFactor})`;
      styles.transformOrigin = "top center"; // Escalar do topo para baixo

      // 🎯 CRUCIAL: Ajustar altura do container para eliminar espaço vazio
      styles.height = `${scaleFactor * 100}%`;
      styles.margin = `${(1 - scaleFactor) * -50}% 0`; // Compensar espaço vazio
    }

    // Adicionar estilos específicos se necessário
    if (
      backgroundColor &&
      !["transparent", "white", "gray-50", "brand-light"].includes(backgroundColor)
    ) {
      styles.backgroundColor = backgroundColor;
    }

    return styles;
  };

  return {
    containerClasses: getContainerClasses(),
    inlineStyles: getInlineStyles(),
    // Propriedades processadas para debug
    processedProperties: {
      containerWidth,
      containerPosition,
      spacing,
      gridColumns,
      backgroundColor,
      marginTop,
      marginBottom,
      marginLeft,
      marginRight,
      scale, // 🎯 Propriedade de escala
    },
  };
};

export default useContainerProperties;

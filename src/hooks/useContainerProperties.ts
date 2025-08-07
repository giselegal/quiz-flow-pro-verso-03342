/**
 * Hook para processar propriedades de container e gerar classes CSS
 * Converte as propriedades do Step01Template em classes Tailwind
 */
export interface ContainerProperties {
  containerWidth?: "full" | "large" | "medium" | "small";
  containerPosition?: "left" | "center" | "right";
  spacing?: "none" | "compact" | "normal" | "comfortable" | "spacious";
  gridColumns?: "auto" | "full" | "half";
  backgroundColor?: "transparent" | "white" | "gray-50" | "brand-light";
  marginTop?: number;
  marginBottom?: number;
}

export const useContainerProperties = (properties: ContainerProperties = {}) => {
  const {
    containerWidth = "full",
    containerPosition = "center", 
    spacing = "normal",
    gridColumns = "auto",
    backgroundColor = "transparent",
    marginTop = 0,
    marginBottom = 0
  } = properties;

  // Gerar classes CSS baseadas nas propriedades
  const getContainerClasses = (): string => {
    const classes: string[] = [];

    // 🔧 Container Width Classes
    switch (containerWidth) {
      case "full":
        classes.push("w-full");
        break;
      case "large":
        classes.push("w-full max-w-4xl mx-auto");
        break;
      case "medium":
        classes.push("w-full max-w-2xl mx-auto");
        break;
      case "small":
        classes.push("w-full max-w-md mx-auto");
        break;
      default:
        classes.push("w-full");
    }

    // 🎯 Container Position Classes
    switch (containerPosition) {
      case "left":
        classes.push("justify-start ml-0 mr-auto");
        break;
      case "center":
        classes.push("justify-center mx-auto");
        break;
      case "right":
        classes.push("justify-end ml-auto mr-0");
        break;
      default:
        classes.push("justify-center mx-auto");
    }

    // 📦 Spacing Classes
    switch (spacing) {
      case "none":
        // Sem padding
        break;
      case "compact":
        classes.push("p-2");
        break;
      case "normal":
        classes.push("p-4");
        break;
      case "comfortable":
        classes.push("p-6");
        break;
      case "spacious":
        classes.push("p-8");
        break;
      default:
        classes.push("p-4");
    }

    // 📐 Grid Columns Classes
    switch (gridColumns) {
      case "full":
        classes.push("col-span-full");
        break;
      case "half":
        classes.push("col-span-6");
        break;
      case "auto":
      default:
        classes.push("w-full md:w-[calc(50%-0.5rem)]");
        break;
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

    // 📏 Margin Top Classes
    if (marginTop) {
      if (marginTop <= 8) classes.push("mt-2");
      else if (marginTop <= 16) classes.push("mt-4");
      else if (marginTop <= 24) classes.push("mt-6");
      else if (marginTop <= 32) classes.push("mt-8");
      else if (marginTop <= 40) classes.push("mt-10");
      else classes.push("mt-12");
    }

    // 📏 Margin Bottom Classes
    if (marginBottom) {
      if (marginBottom <= 8) classes.push("mb-2");
      else if (marginBottom <= 16) classes.push("mb-4");
      else if (marginBottom <= 24) classes.push("mb-6");
      else if (marginBottom <= 32) classes.push("mb-8");
      else if (marginBottom <= 40) classes.push("mb-10");
      else classes.push("mb-12");
    }

    return classes.filter(Boolean).join(" ");
  };

  // Gerar propriedades de estilo inline (para casos específicos)
  const getInlineStyles = (): React.CSSProperties => {
    const styles: React.CSSProperties = {};

    // Adicionar estilos específicos se necessário
    if (backgroundColor && !["transparent", "white", "gray-50", "brand-light"].includes(backgroundColor)) {
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
      marginBottom
    }
  };
};

export default useContainerProperties;

/**
 * Configuração padrão dos componentes do canvas do editor
 * Baseado na análise do layout HTML do canvas vertical
 */

export interface CanvasLayoutConfig {
  container: {
    className: string;
    padding: string;
    gap: string;
    height: string;
    justifyContent: string;
  };
  header: {
    className: string;
    logo: {
      maxWidth: string;
      objectFit: string;
      alt: string;
    };
    progressBar: {
      className: string;
      height: string;
      backgroundColor: string;
    };
    backButton: {
      className: string;
      position: string;
    };
  };
  mainContent: {
    className: string;
    maxWidth: string;
    height: string;
  };
  canvasItems: {
    wrapper: {
      className: string;
      minHeight: string;
      position: string;
      flexBasis: string;
    };
    container: {
      className: string;
      minHeight: string;
      minWidth: string;
      border: {
        hover: string;
        selected: string;
        default: string;
      };
    };
  };
  components: {
    heading: {
      className: string;
      fontSize: string;
      fontWeight: string;
      textAlign: string;
    };
    spacer: {
      className: string;
      padding: string;
      border: string;
    };
    options: {
      container: {
        className: string;
        gap: string;
      };
      button: {
        className: string;
        height: string;
        padding: string;
        hover: string;
      };
      content: {
        className: string;
        textAlign: string;
      };
    };
    button: {
      className: string;
      height: string;
      width: string;
      padding: string;
    };
  };
}

export const STANDARD_CANVAS_CONFIG: CanvasLayoutConfig = {
  container: {
    className:
      "flex flex-col gap-4 md:gap-6 h-full justify-between p-3 group-[.screen-mobile]:p-3 md:p-5 pb-10",
    padding: "p-3 md:p-5",
    gap: "gap-4 md:gap-6",
    height: "h-full",
    justifyContent: "justify-between",
  },

  header: {
    className: "grid gap-4 opacity-100",
    logo: {
      maxWidth: "max-w-24",
      objectFit: "object-cover",
      alt: "Logo",
    },
    progressBar: {
      className: "relative w-full overflow-hidden rounded-full bg-zinc-300 h-2",
      height: "h-2",
      backgroundColor: "bg-zinc-300",
    },
    backButton: {
      className:
        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ghost hover:bg-primary hover:text-foreground h-10 w-10 absolute left-0",
      position: "absolute left-0",
    },
  },

  mainContent: {
    className: "main-content w-full relative mx-auto customizable-width h-full",
    maxWidth: "customizable-width",
    height: "h-full",
  },

  canvasItems: {
    wrapper: {
      className:
        "group/canvas-item max-w-full canvas-item min-h-[1.25rem] relative self-auto mr-auto",
      minHeight: "min-h-[1.25rem]",
      position: "relative",
      flexBasis: "flex-basis: 100%",
    },
    container: {
      className:
        "min-h-[1.25rem] min-w-full relative self-auto box-border customizable-gap group-hover/canvas-item:border-2 border-dashed hover:border-2 border-[#B89B7A] rounded-md",
      minHeight: "min-h-[1.25rem]",
      minWidth: "min-w-full",
      border: {
        hover: "hover:border-2 border-[#B89B7A]",
        selected: "border-2 border-[#B89B7A]",
        default: "border-dashed",
      },
    },
  },

  components: {
    heading: {
      className: "min-w-full text-3xl font-bold text-center",
      fontSize: "text-3xl",
      fontWeight: "font-bold",
      textAlign: "text-center",
    },

    spacer: {
      className: "min-w-full py-2 border-dashed border-yellow-500 border rounded-lg",
      padding: "py-2",
      border: "border-dashed border-yellow-500 border rounded-lg",
    },

    options: {
      container: {
        className: "flex flex-col items-start justify-start gap-2",
        gap: "gap-2",
      },
      button: {
        className:
          "whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 option border-zinc-200 bg-background hover:bg-primary hover:text-foreground h-10 px-4 hover:shadow-2xl overflow-hidden min-w-full gap-2 flex py-8 flex-row items-center justify-between border drop-shadow-none",
        height: "h-10 py-8",
        padding: "px-4",
        hover: "hover:bg-primary hover:text-foreground hover:shadow-2xl",
      },
      content: {
        className:
          "py-2 px-4 w-full flex flex-row text-base items-center text-full-primary justify-between",
        textAlign: "justify-between",
      },
    },

    button: {
      className:
        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 min-w-full h-14",
      height: "h-14",
      width: "min-w-full",
      padding: "px-4 py-2",
    },
  },
};

/**
 * Configurações responsivas para o canvas
 */
export const RESPONSIVE_BREAKPOINTS = {
  mobile: {
    maxWidth: "max-w-sm",
    padding: "p-3",
    gap: "gap-4",
  },
  tablet: {
    maxWidth: "max-w-2xl",
    padding: "p-4",
    gap: "gap-5",
  },
  desktop: {
    maxWidth: "max-w-4xl",
    padding: "p-5",
    gap: "gap-6",
  },
};

/**
 * Configurações específicas para componentes editáveis
 */
export const EDITABLE_COMPONENT_CONFIG = {
  heading: {
    editableProps: ["text", "fontSize", "fontWeight", "textAlign", "color"],
    defaultContent: "Digite seu título aqui",
  },

  options: {
    editableProps: ["options", "multipleSelection", "columns", "showImages"],
    defaultOptions: [
      { id: "1", text: "Opção 1", value: "opcao1" },
      { id: "2", text: "Opção 2", value: "opcao2" },
    ],
  },

  button: {
    editableProps: ["text", "variant", "size", "action"],
    defaultContent: "Continuar",
  },

  spacer: {
    editableProps: ["height", "borderStyle", "borderColor"],
    defaultHeight: "py-2",
  },
};

/**
 * Configurações de acessibilidade
 */
export const ACCESSIBILITY_CONFIG = {
  canvasItem: {
    role: "button",
    tabIndex: 0,
    ariaDisabled: "false",
    ariaRoleDescription: "sortable",
    ariaDescribedBy: "DndDescribedBy-0",
  },

  progressBar: {
    role: "progressbar",
    ariaValueMax: "100",
    ariaValueMin: "0",
    dataState: "indeterminate",
    dataMax: "100",
  },
};

/**
 * Configurações de drag and drop
 */
export const DND_CONFIG = {
  canvasItem: {
    draggable: true,
    sortable: true,
    transform: "translate3d(0px, 0px, 0px) scaleX(1) scaleY(1)",
    willChange: "transform",
  },

  motionDiv: {
    opacity: 1,
    willChange: "transform",
    dataState: "closed",
  },
};

/**
 * Temas de cores disponíveis
 */
export const COLOR_THEMES = {
  default: {
    primary: "#3b82f6",
    secondary: "#64748b",
    accent: "#f59e0b",
    background: "#ffffff",
    text: "#1f2937",
  },

  brand: {
    primary: "#B89B7A",
    secondary: "#8F7A6A",
    accent: "#D4C4A0",
    background: "#FAF9F7",
    text: "#432818",
  },
};

/**
 * Utilitários para configuração do canvas
 */
export class CanvasConfigUtils {
  /**
   * Gera classes CSS responsivas baseadas no breakpoint
   */
  static getResponsiveClasses(
    mobile: string,
    tablet: string = mobile,
    desktop: string = tablet
  ): string {
    return `${mobile} md:${tablet} lg:${desktop}`;
  }

  /**
   * Mescla configurações personalizadas com as padrão
   */
  static mergeConfig(
    defaultConfig: Partial<CanvasLayoutConfig>,
    customConfig: Partial<CanvasLayoutConfig>
  ): CanvasLayoutConfig {
    return {
      ...defaultConfig,
      ...customConfig,
    } as CanvasLayoutConfig;
  }

  /**
   * Valida se uma configuração está completa
   */
  static validateConfig(config: Partial<CanvasLayoutConfig>): boolean {
    const requiredPaths = [
      "container.className",
      "mainContent.className",
      "canvasItems.wrapper.className",
    ];

    return requiredPaths.every(path => {
      const keys = path.split(".");
      let current: any = config;

      for (const key of keys) {
        if (!current || !current[key]) return false;
        current = current[key];
      }

      return true;
    });
  }

  /**
   * Gera configuração otimizada para dispositivo específico
   */
  static getDeviceOptimizedConfig(
    device: "mobile" | "tablet" | "desktop"
  ): Partial<CanvasLayoutConfig> {
    const responsive = RESPONSIVE_BREAKPOINTS[device];

    return {
      container: {
        ...STANDARD_CANVAS_CONFIG.container,
        padding: responsive.padding,
        gap: responsive.gap,
      },
      mainContent: {
        ...STANDARD_CANVAS_CONFIG.mainContent,
        className: `${STANDARD_CANVAS_CONFIG.mainContent.className} ${responsive.maxWidth}`,
      },
    };
  }
}

export default STANDARD_CANVAS_CONFIG;

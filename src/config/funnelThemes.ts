/**
 * 🎨 SISTEMA DE TEMAS PARA MÁXIMA REUTILIZAÇÃO
 *
 * Temas pré-definidos que podem ser aplicados a qualquer funil,
 * garantindo consistência visual e rápida customização.
 */

export interface FunnelTheme {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
  };
  typography: {
    fontFamily: string;
    headingFont: string;
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      "2xl": string;
      "3xl": string;
    };
  };
  spacing: {
    containerPadding: string;
    sectionGap: string;
    cardPadding: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    brand: string;
  };
}

// 🌟 TEMA: ESTILO ELEGANTE (baseado no funil real)
export const elegantTheme: FunnelTheme = {
  id: "elegant",
  name: "Elegante",
  description: "Tema sofisticado para consultoria de estilo e moda",
  colors: {
    primary: "#B89B7A", // Cor da marca Gisele
    secondary: "#432818", // Marrom escuro
    background: "#FAF9F7", // Creme claro
    surface: "#FFFFFF", // Branco puro
    text: "#432818", // Marrom escuro para texto
    textSecondary: "#8F7A6A", // Marrom médio
    accent: "#D4C4B0", // Dourado claro
    success: "#22c55e", // Verde sucesso
    warning: "#f59e0b", // Amarelo aviso
    error: "#ef4444", // Vermelho erro
  },
  typography: {
    fontFamily: "Inter, system-ui, sans-serif",
    headingFont: "Playfair Display, serif",
    fontSize: {
      xs: "0.75rem", // 12px
      sm: "0.875rem", // 14px
      base: "1rem", // 16px
      lg: "1.125rem", // 18px
      xl: "1.25rem", // 20px
      "2xl": "1.5rem", // 24px
      "3xl": "1.875rem", // 30px
    },
  },
  spacing: {
    containerPadding: "1rem",
    sectionGap: "4rem",
    cardPadding: "1.5rem",
  },
  borderRadius: {
    sm: "0.375rem", // 6px
    md: "0.5rem", // 8px
    lg: "0.75rem", // 12px
    xl: "1rem", // 16px
  },
  shadows: {
    sm: "0 2px 8px rgba(184, 155, 122, 0.08)",
    md: "0 4px 20px rgba(184, 155, 122, 0.12)",
    lg: "0 8px 32px rgba(184, 155, 122, 0.16)",
    brand: "0 8px 24px rgba(184, 155, 122, 0.4)",
  },
};

// 💪 TEMA: FITNESS DINÂMICO
export const fitnessTheme: FunnelTheme = {
  id: "fitness",
  name: "Fitness Dinâmico",
  description: "Tema energético para programas de fitness e saúde",
  colors: {
    primary: "#22c55e", // Verde energia
    secondary: "#16a34a", // Verde escuro
    background: "#f8fafc", // Cinza muito claro
    surface: "#ffffff", // Branco
    text: "#1e293b", // Cinza escuro
    textSecondary: "#64748b", // Cinza médio
    accent: "#10b981", // Verde accent
    success: "#059669", // Verde sucesso
    warning: "#f59e0b", // Laranja
    error: "#dc2626", // Vermelho
  },
  typography: {
    fontFamily: "Inter, system-ui, sans-serif",
    headingFont: "Inter, system-ui, sans-serif",
    fontSize: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
    },
  },
  spacing: {
    containerPadding: "1rem",
    sectionGap: "3rem",
    cardPadding: "1.5rem",
  },
  borderRadius: {
    sm: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
  },
  shadows: {
    sm: "0 2px 8px rgba(34, 197, 94, 0.08)",
    md: "0 4px 20px rgba(34, 197, 94, 0.12)",
    lg: "0 8px 32px rgba(34, 197, 94, 0.16)",
    brand: "0 8px 24px rgba(34, 197, 94, 0.4)",
  },
};

// 💼 TEMA: CORPORATIVO PROFISSIONAL
export const corporateTheme: FunnelTheme = {
  id: "corporate",
  name: "Corporativo",
  description: "Tema profissional para consultoria empresarial",
  colors: {
    primary: "#3b82f6", // Azul corporativo
    secondary: "#1e40af", // Azul escuro
    background: "#ffffff", // Branco
    surface: "#f8fafc", // Cinza claro
    text: "#1e293b", // Cinza escuro
    textSecondary: "#64748b", // Cinza médio
    accent: "#60a5fa", // Azul claro
    success: "#10b981", // Verde
    warning: "#f59e0b", // Amarelo
    error: "#ef4444", // Vermelho
  },
  typography: {
    fontFamily: "Source Sans Pro, system-ui, sans-serif",
    headingFont: "Source Sans Pro, system-ui, sans-serif",
    fontSize: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
    },
  },
  spacing: {
    containerPadding: "1.5rem",
    sectionGap: "4rem",
    cardPadding: "2rem",
  },
  borderRadius: {
    sm: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
  },
  shadows: {
    sm: "0 2px 8px rgba(59, 130, 246, 0.08)",
    md: "0 4px 20px rgba(59, 130, 246, 0.12)",
    lg: "0 8px 32px rgba(59, 130, 246, 0.16)",
    brand: "0 8px 24px rgba(59, 130, 246, 0.4)",
  },
};

// 📚 COLEÇÃO DE TODOS OS TEMAS
export const funnelThemes: FunnelTheme[] = [elegantTheme, fitnessTheme, corporateTheme];

// 🔍 HELPERS PARA TEMAS
export const getThemeById = (id: string): FunnelTheme | undefined => {
  return funnelThemes.find(theme => theme.id === id);
};

export const getDefaultTheme = (): FunnelTheme => {
  return elegantTheme;
};

/**
 * 🎨 FUNÇÃO PARA APLICAR TEMA A UM BLOCO
 *
 * Aplica as cores e estilos do tema às propriedades do bloco
 */
export const applyThemeToBlock = (
  blockProperties: Record<string, any>,
  theme: FunnelTheme
): Record<string, any> => {
  return {
    ...blockProperties,
    backgroundColor: blockProperties.backgroundColor || theme.colors.background,
    textColor: blockProperties.textColor || theme.colors.text,
    primaryColor: blockProperties.primaryColor || theme.colors.primary,
    // Para pain blocks
    cardBorderColor: blockProperties.cardBorderColor || `${theme.colors.primary}33`, // 20% opacity
  };
};

/**
 * 🚀 FUNÇÃO PARA APLICAR TEMA A TEMPLATE COMPLETO
 *
 * Aplica um tema a todos os blocos de um template
 */
export const applyThemeToTemplate = (template: any, theme: FunnelTheme) => {
  return {
    ...template,
    blocks: template.blocks.map((block: any) => ({
      ...block,
      properties: applyThemeToBlock(block.properties, theme),
    })),
  };
};

/**
 * 🎯 GERADOR DE CSS CUSTOMIZADO PARA TEMA
 *
 * Gera CSS custom properties baseado no tema selecionado
 */
export const generateThemeCSS = (theme: FunnelTheme): string => {
  return `
    :root {
      /* Cores */
      --theme-primary: ${theme.colors.primary};
      --theme-secondary: ${theme.colors.secondary};
      --theme-background: ${theme.colors.background};
      --theme-surface: ${theme.colors.surface};
      --theme-text: ${theme.colors.text};
      --theme-text-secondary: ${theme.colors.textSecondary};
      --theme-accent: ${theme.colors.accent};
      --theme-success: ${theme.colors.success};
      --theme-warning: ${theme.colors.warning};
      --theme-error: ${theme.colors.error};
      
      /* Tipografia */
      --theme-font-family: ${theme.typography.fontFamily};
      --theme-heading-font: ${theme.typography.headingFont};
      --theme-font-size-xs: ${theme.typography.fontSize.xs};
      --theme-font-size-sm: ${theme.typography.fontSize.sm};
      --theme-font-size-base: ${theme.typography.fontSize.base};
      --theme-font-size-lg: ${theme.typography.fontSize.lg};
      --theme-font-size-xl: ${theme.typography.fontSize.xl};
      --theme-font-size-2xl: ${theme.typography.fontSize["2xl"]};
      --theme-font-size-3xl: ${theme.typography.fontSize["3xl"]};
      
      /* Espaçamento */
      --theme-container-padding: ${theme.spacing.containerPadding};
      --theme-section-gap: ${theme.spacing.sectionGap};
      --theme-card-padding: ${theme.spacing.cardPadding};
      
      /* Border Radius */
      --theme-radius-sm: ${theme.borderRadius.sm};
      --theme-radius-md: ${theme.borderRadius.md};
      --theme-radius-lg: ${theme.borderRadius.lg};
      --theme-radius-xl: ${theme.borderRadius.xl};
      
      /* Sombras */
      --theme-shadow-sm: ${theme.shadows.sm};
      --theme-shadow-md: ${theme.shadows.md};
      --theme-shadow-lg: ${theme.shadows.lg};
      --theme-shadow-brand: ${theme.shadows.brand};
    }
  `;
};

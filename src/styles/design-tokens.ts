/**
 * 🎨 Design Tokens - Sistema de Design Unificado
 * 
 * Tokens de design reutilizáveis para garantir consistência
 * visual em todos os componentes do quiz v3.0
 */

export const DesignTokens = {
    // Paleta de Cores
    colors: {
        // Cores Primárias
        primary: '#B89B7A',
        primaryHover: '#A68B6A',
        primaryLight: '#F3E8D3',

        // Cores Secundárias
        secondary: '#432818',
        secondaryLight: '#6B4423',

        // Backgrounds
        background: '#FAF9F7',
        backgroundSoft: '#F5F5F0',
        backgroundWhite: '#FFFFFF',

        // Textos
        textPrimary: '#1F2937',
        textSecondary: '#6B7280',
        textLight: '#9CA3AF',
        textDark: '#111827',

        // Bordas
        border: '#E5E7EB',
        borderLight: '#F3F4F6',
        borderDark: '#D1D5DB',

        // Estados
        hover: '#F3E8D3',
        selected: '#B89B7A',
        disabled: '#E5E7EB',
        error: '#DC2626',
        success: '#10B981',
        warning: '#F59E0B',
        info: '#3B82F6',
    },

    // Tipografia
    fonts: {
        heading: "'Playfair Display', serif",
        body: "'Inter', sans-serif",
        mono: "'Fira Code', monospace",
    },

    fontSizes: {
        xs: '0.75rem',    // 12px
        sm: '0.875rem',   // 14px
        base: '1rem',     // 16px
        lg: '1.125rem',   // 18px
        xl: '1.25rem',    // 20px
        '2xl': '1.5rem',  // 24px
        '3xl': '1.875rem',// 30px
        '4xl': '2.25rem', // 36px
        '5xl': '3rem',    // 48px
    },

    fontWeights: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
    },

    lineHeights: {
        tight: 1.25,
        normal: 1.5,
        relaxed: 1.75,
        loose: 2,
    },

    // Espaçamento
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        '2xl': 48,
        '3xl': 64,
        '4xl': 96,
    },

    // Border Radius
    borderRadius: {
        none: 0,
        sm: 4,
        md: 8,
        lg: 12,
        xl: 16,
        '2xl': 24,
        full: 9999,
    },

    // Sombras
    shadows: {
        none: 'none',
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    },

    // Breakpoints (Mobile-First)
    breakpoints: {
        mobile: 320,
        mobileLarge: 425,
        tablet: 768,
        desktop: 1024,
        desktopLarge: 1280,
        wide: 1536,
    },

    // Transições
    transitions: {
        fast: '150ms ease-in-out',
        base: '200ms ease-in-out',
        slow: '300ms ease-in-out',
        slower: '500ms ease-in-out',
    },

    // Z-Index
    zIndex: {
        base: 0,
        dropdown: 1000,
        sticky: 1020,
        fixed: 1030,
        modalBackdrop: 1040,
        modal: 1050,
        popover: 1060,
        tooltip: 1070,
    },

    // Grid/Layout
    layout: {
        maxWidth: {
            mobile: '100%',
            tablet: '768px',
            desktop: '1024px',
            wide: '1280px',
        },
        containerPadding: {
            mobile: 16,
            tablet: 24,
            desktop: 32,
        },
        gridGap: {
            sm: 8,
            md: 16,
            lg: 24,
            xl: 32,
        },
    },
} as const;

export type DesignTokens = typeof DesignTokens;

// Helper para acessar tokens de forma type-safe
export const getToken = <K extends keyof DesignTokens>(
    category: K,
    key: keyof DesignTokens[K]
): DesignTokens[K][typeof key] => {
    return DesignTokens[category][key];
};

// CSS Variables para uso em styled-components ou CSS-in-JS
export const cssVariables = `
  :root {
    /* Colors */
    --color-primary: ${DesignTokens.colors.primary};
    --color-primary-hover: ${DesignTokens.colors.primaryHover};
    --color-secondary: ${DesignTokens.colors.secondary};
    --color-background: ${DesignTokens.colors.background};
    --color-text-primary: ${DesignTokens.colors.textPrimary};
    
    /* Fonts */
    --font-heading: ${DesignTokens.fonts.heading};
    --font-body: ${DesignTokens.fonts.body};
    
    /* Spacing */
    --spacing-sm: ${DesignTokens.spacing.sm}px;
    --spacing-md: ${DesignTokens.spacing.md}px;
    --spacing-lg: ${DesignTokens.spacing.lg}px;
    --spacing-xl: ${DesignTokens.spacing.xl}px;
    
    /* Border Radius */
    --radius-sm: ${DesignTokens.borderRadius.sm}px;
    --radius-md: ${DesignTokens.borderRadius.md}px;
    --radius-lg: ${DesignTokens.borderRadius.lg}px;
    
    /* Transitions */
    --transition-fast: ${DesignTokens.transitions.fast};
    --transition-base: ${DesignTokens.transitions.base};
  }
`;

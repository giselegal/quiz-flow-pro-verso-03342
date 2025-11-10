/**
 * 🎨 THEME CONFIGURATION
 * Configuração centralizada de tema (cores, tipografia, espaçamentos)
 * Single Source of Truth para design tokens
 */

import type { TemplateVariables } from '@/types/dynamic-template';

// ============================================
// 1. DESIGN TOKENS
// ============================================

export const THEME_COLORS = {
  // Cores primárias (do design atual)
  primary: '#B89B7A',      // Dourado/bege elegante
  secondary: '#432818',    // Marrom escuro
  background: '#fffaf7',   // Off-white quente
  text: '#432818',         // Texto principal
  accent: '#B89B7A',       // Destaque (mesmo que primary)
  
  // Cores de sistema
  error: '#dc2626',        // Vermelho para erros
  success: '#16a34a',      // Verde para sucesso
  warning: '#ea580c',      // Laranja para avisos
  info: '#0284c7',         // Azul para informações
  
  // Neutros
  white: '#ffffff',
  black: '#000000',
  gray: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  }
} as const;

export const THEME_FONTS = {
  heading: 'var(--font-heading, "Inter", "Helvetica Neue", sans-serif)',
  body: 'var(--font-body, "Inter", "Helvetica Neue", sans-serif)',
  mono: 'var(--font-mono, "JetBrains Mono", "Consolas", monospace)',
  
  sizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    md: '1rem',       // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem',// 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
    '6xl': '3.75rem', // 60px
  },
  
  weights: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  }
} as const;

export const THEME_SPACING = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
  '4xl': '6rem',   // 96px
  '5xl': '8rem',   // 128px
} as const;

export const THEME_RADIUS = {
  none: '0',
  sm: '0.25rem',    // 4px
  md: '0.5rem',     // 8px
  lg: '0.75rem',    // 12px
  xl: '1rem',       // 16px
  '2xl': '1.5rem',  // 24px
  full: '9999px',   // Círculo completo
} as const;

// ============================================
// 2. CONFIGURAÇÃO PARA TEMPLATES
// ============================================

/**
 * Objeto usado nas variáveis {{theme.*}}
 */
export const themeConfig: TemplateVariables['theme'] = {
  colors: {
    primary: THEME_COLORS.primary,
    secondary: THEME_COLORS.secondary,
    background: THEME_COLORS.background,
    text: THEME_COLORS.text,
    accent: THEME_COLORS.accent,
    error: THEME_COLORS.error,
    success: THEME_COLORS.success,
  },
  fonts: {
    heading: THEME_FONTS.heading,
    body: THEME_FONTS.body,
    sizes: {
      xs: THEME_FONTS.sizes.xs,
      sm: THEME_FONTS.sizes.sm,
      md: THEME_FONTS.sizes.md,
      lg: THEME_FONTS.sizes.lg,
      xl: THEME_FONTS.sizes.xl,
      xxl: THEME_FONTS.sizes['2xl'],
    },
  },
  spacing: {
    xs: THEME_SPACING.xs,
    sm: THEME_SPACING.sm,
    md: THEME_SPACING.md,
    lg: THEME_SPACING.lg,
    xl: THEME_SPACING.xl,
  },
};

// ============================================
// 3. TEMAS ALTERNATIVOS (FUTURO)
// ============================================

/**
 * Exemplo: dark mode ou variações de marca
 */
export const THEME_VARIANTS = {
  default: themeConfig,
  
  // dark: {
  //   colors: {
  //     primary: '#D4B896',
  //     secondary: '#E8DCC8',
  //     background: '#1a1410',
  //     text: '#E8DCC8',
  //     accent: '#D4B896',
  //     error: '#f87171',
  //     success: '#4ade80',
  //   },
  //   // ... resto igual
  // },
} as const;

// ============================================
// 4. UTILITÁRIOS
// ============================================

/**
 * Converte cor hex para rgba
 */
export function hexToRgba(hex: string, alpha: number = 1): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Gera CSS custom properties do tema
 */
export function generateCSSVariables(theme = themeConfig): string {
  return `
:root {
  /* Colors */
  --color-primary: ${theme.colors.primary};
  --color-secondary: ${theme.colors.secondary};
  --color-background: ${theme.colors.background};
  --color-text: ${theme.colors.text};
  --color-accent: ${theme.colors.accent};
  --color-error: ${theme.colors.error};
  --color-success: ${theme.colors.success};
  
  /* Fonts */
  --font-heading: ${theme.fonts.heading};
  --font-body: ${theme.fonts.body};
  
  /* Spacing */
  --spacing-xs: ${theme.spacing.xs};
  --spacing-sm: ${theme.spacing.sm};
  --spacing-md: ${theme.spacing.md};
  --spacing-lg: ${theme.spacing.lg};
  --spacing-xl: ${theme.spacing.xl};
}
  `.trim();
}

// ============================================
// 5. VALIDAÇÃO
// ============================================

/**
 * Valida se tema tem todas as propriedades necessárias
 */
export function validateTheme(theme: any): { valid: boolean; missing: string[] } {
  const required = [
    'colors.primary',
    'colors.secondary',
    'colors.background',
    'colors.text',
    'fonts.heading',
    'fonts.body',
    'spacing.md',
  ];
  
  const missing: string[] = [];
  
  required.forEach(path => {
    const keys = path.split('.');
    let current = theme;
    
    for (const key of keys) {
      if (!(key in current)) {
        missing.push(path);
        break;
      }
      current = current[key];
    }
  });
  
  return { valid: missing.length === 0, missing };
}

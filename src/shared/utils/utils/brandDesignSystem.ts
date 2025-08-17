// @ts-nocheck
// Comprehensive Brand Design System
// Centralized design tokens for consistent styling across the application

const brandDesignSystem = {
  // Brand color palette with semantic naming
  colors: {
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
      main: '#0ea5e9',
      light: '#38bdf8',
      dark: '#0369a1',
    },
    secondary: {
      50: '#fdf4ff',
      100: '#fae8ff',
      200: '#f5d0fe',
      300: '#f0abfc',
      400: '#e879f9',
      500: '#d946ef',
      600: '#c026d3',
      700: '#a21caf',
      800: '#86198f',
      900: '#701a75',
      main: '#d946ef',
      light: '#e879f9',
      dark: '#a21caf',
    },
    accent: {
      50: '#fff7ed',
      100: '#ffedd5',
      200: '#fed7aa',
      300: '#fdba74',
      400: '#fb923c',
      500: '#f97316',
      600: '#ea580c',
      700: '#c2410c',
      800: '#9a3412',
      900: '#7c2d12',
      main: '#f97316',
      light: '#fb923c',
      dark: '#c2410c',
    },
    neutral: {
      50: '#fafafa',
      100: '#f4f4f5',
      200: '#e4e4e7',
      300: '#d4d4d8',
      400: '#a1a1aa',
      500: '#71717a',
      600: '#52525b',
      700: '#3f3f46',
      800: '#27272a',
      900: '#18181b',
      main: '#fefefe',
      light: '#fdfdfd',
      dark: '#e8e8e8',
      gray600: '#52525b',
    },
  },

  typography: {
    fontFamily: {
      primary: '"Inter", system-ui, sans-serif',
      secondary: '"Playfair Display", serif',
      mono: '"JetBrains Mono", monospace',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    },
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    },
    letterSpacing: {
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
    },
    heading: {
      fontSize: '1.5rem',
      fontWeight: '600',
      lineHeight: '1.25',
    },
    body: {
      fontSize: '1rem',
      fontWeight: '400',
      lineHeight: '1.5',
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: '600',
      lineHeight: '1.25',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: '600',
      lineHeight: '1.25',
    },
    small: {
      fontSize: '0.875rem',
      fontWeight: '400',
      lineHeight: '1.5',
    },
  },

  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
    padding: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
    },
  },

  borderRadius: {
    none: '0',
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    full: '9999px',
  },

  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    lift: '0 10px 30px -10px rgba(0, 0, 0, 0.3)',
    brand: '0 4px 14px 0 rgba(14, 165, 233, 0.15)',
  },

  effects: {
    blur: {
      sm: 'blur(4px)',
      md: 'blur(8px)',
      lg: 'blur(16px)',
    },
    opacity: {
      light: 0.1,
      medium: 0.5,
      heavy: 0.8,
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      brand: '0 4px 14px 0 rgba(14, 165, 233, 0.15)',
    },
  },

  transitions: {
    fast: 'all 150ms ease-in-out',
    normal: 'all 300ms ease-in-out',
    slow: 'all 500ms ease-in-out',
    transition: 'all 300ms ease-in-out',
    hover: 'all 200ms ease-in-out',
  },
};

/**
 * Helper function to get brand colors by path
 * @param colorPath - Dot-separated path like "primary.main"
 * @returns Color value or fallback
 */
export const getBrandColor = (colorPath: string): string => {
  const keys = colorPath.split('.');
  let result: any = brandDesignSystem.colors;

  for (const key of keys) {
    result = result?.[key];
    if (result === undefined) break;
  }

  return typeof result === 'string' ? result : brandDesignSystem.colors.neutral[500];
};

// Export individual color palettes for convenience
export const { colors, typography, spacing, borderRadius, shadows, effects, transitions } =
  brandDesignSystem;

// Exports em maiúsculo para compatibilidade com imports existentes
export const BRAND_COLORS = colors;
export const TYPOGRAPHY = typography;
export const SPACING = spacing;
export const ANIMATIONS = transitions;
export const EFFECTS = effects;
export const RESPONSIVE_PATTERNS = {
  mobile: 'mobile',
  tablet: 'tablet',
  desktop: 'desktop',
};

export default brandDesignSystem;

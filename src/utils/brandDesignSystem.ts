
// Brand Design System - Estrutura de cores e tipografia da marca

export const brandDesignSystem = {
  colors: {
    primary: {
      50: '#fef7f0',
      100: '#feeee0',
      200: '#fcdac0',
      300: '#f9c1a0',
      400: '#f6a880',
      500: '#f18f60',
      main: '#f18f60',
      light: '#feeee0',
      dark: '#d67548'
    },
    secondary: {
      50: '#f5f3f0',
      100: '#ebe7e0',
      200: '#d7cfc0',
      300: '#c3b7a0',
      400: '#af9f80',
      500: '#9b8760',
      main: '#9b8760',
      light: '#ebe7e0',
      dark: '#7a6d4c'
    },
    neutral: {
      50: '#fafaf9',
      100: '#f5f5f4',
      200: '#e7e5e4',
      300: '#d6d3d1',
      400: '#a8a29e',
      500: '#78716c',
      600: '#57534e',
      700: '#44403c',
      800: '#292524',
      900: '#1c1917',
      gray600: '#57534e'
    },
    accent: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      main: '#22c55e',
      light: '#dcfce7',
      dark: '#166534'
    },
    surface: {
      50: '#fefefe',
      100: '#fdfdfd',
      200: '#fafafa',
      300: '#f7f7f7',
      400: '#f0f0f0',
      500: '#e8e8e8',
      main: '#fefefe',
      light: '#fdfdfd',
      dark: '#e8e8e8'
    }
  },
  
  typography: {
    fontFamily: {
      primary: '"Inter", system-ui, sans-serif',
      secondary: '"Playfair Display", serif',
      mono: '"JetBrains Mono", monospace'
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
      '5xl': '3rem'
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75
    },
    letterSpacing: {
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em'
    }
  },
  
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem'
  },
  
  borderRadius: {
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem'
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
  },
  
  effects: {
    blur: {
      sm: '4px',
      md: '8px',
      lg: '16px'
    },
    opacity: {
      light: 0.1,
      medium: 0.5,
      heavy: 0.8
    }
  },
  
  transitions: {
    fast: '150ms ease',
    normal: '300ms ease',
    slow: '500ms ease'
  }
};

// Utility functions for accessing brand colors
export const getBrandColor = (colorPath: string): string => {
  const pathArray = colorPath.split('.');
  let result: any = brandDesignSystem.colors;
  
  for (const key of pathArray) {
    if (result && typeof result === 'object' && key in result) {
      result = result[key];
    } else {
      return brandDesignSystem.colors.neutral[500]; // fallback
    }
  }
  
  return typeof result === 'string' ? result : brandDesignSystem.colors.neutral[500];
};

// Export individual color palettes for convenience
export const {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  effects,
  transitions
} = brandDesignSystem;

export default brandDesignSystem;

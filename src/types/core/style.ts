/**
 * 🎯 CANONICAL STYLE TYPES
 * 
 * Tipos para estilos, temas e customização visual.
 * 
 * @canonical
 */

// =============================================================================
// STYLE PROPERTIES
// =============================================================================

export interface StyleProperties {
  // Colors
  backgroundColor?: string;
  color?: string;
  borderColor?: string;
  
  // Typography
  fontFamily?: string;
  fontSize?: string | number;
  fontWeight?: string | number;
  lineHeight?: string | number;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  textDecoration?: string;
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  
  // Spacing
  padding?: string | number;
  paddingTop?: string | number;
  paddingRight?: string | number;
  paddingBottom?: string | number;
  paddingLeft?: string | number;
  margin?: string | number;
  marginTop?: string | number;
  marginRight?: string | number;
  marginBottom?: string | number;
  marginLeft?: string | number;
  
  // Border
  borderWidth?: string | number;
  borderStyle?: string;
  borderRadius?: string | number;
  
  // Shadow
  boxShadow?: string;
  textShadow?: string;
  
  // Layout
  display?: string;
  flexDirection?: string;
  justifyContent?: string;
  alignItems?: string;
  gap?: string | number;
  
  // Size
  width?: string | number;
  height?: string | number;
  minWidth?: string | number;
  minHeight?: string | number;
  maxWidth?: string | number;
  maxHeight?: string | number;
  
  // Position
  position?: string;
  top?: string | number;
  right?: string | number;
  bottom?: string | number;
  left?: string | number;
  zIndex?: number;
  
  // Other
  opacity?: number;
  overflow?: string;
  cursor?: string;
  transition?: string;
  transform?: string;
  
  // Generic
  [key: string]: unknown;
}

// =============================================================================
// THEME
// =============================================================================

export interface Theme {
  id: string;
  name: string;
  
  colors: {
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    accent: string;
    accentForeground: string;
    background: string;
    foreground: string;
    muted: string;
    mutedForeground: string;
    border: string;
    ring: string;
    destructive: string;
    destructiveForeground: string;
    success: string;
    successForeground: string;
    warning: string;
    warningForeground: string;
  };
  
  typography: {
    fontFamily: string;
    fontFamilyHeading?: string;
    fontFamilyMono?: string;
    baseFontSize: string;
    lineHeight: string;
  };
  
  spacing: {
    unit: number;
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  
  borderRadius: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
  
  shadows: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

// =============================================================================
// THEME PRESET
// =============================================================================

export interface ThemePreset {
  id: string;
  name: string;
  description?: string;
  theme: Theme;
  thumbnail?: string;
  isDefault?: boolean;
  isPremium?: boolean;
}

// =============================================================================
// CSS VARIABLES
// =============================================================================

export interface CSSVariables {
  [key: `--${string}`]: string;
}

// =============================================================================
// RESPONSIVE STYLES
// =============================================================================

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface ResponsiveValue<T> {
  base?: T;
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
}

export type ResponsiveStyles = {
  [K in keyof StyleProperties]?: StyleProperties[K] | ResponsiveValue<StyleProperties[K]>;
};

// =============================================================================
// ANIMATION
// =============================================================================

export interface AnimationConfig {
  name: string;
  duration?: string | number;
  delay?: string | number;
  easing?: string;
  iterations?: number | 'infinite';
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
}

export interface TransitionConfig {
  property: string;
  duration?: string | number;
  easing?: string;
  delay?: string | number;
}

// =============================================================================
// DEFAULT THEME
// =============================================================================

export const DEFAULT_THEME: Theme = {
  id: 'default',
  name: 'Default Theme',
  colors: {
    primary: 'hsl(var(--primary))',
    primaryForeground: 'hsl(var(--primary-foreground))',
    secondary: 'hsl(var(--secondary))',
    secondaryForeground: 'hsl(var(--secondary-foreground))',
    accent: 'hsl(var(--accent))',
    accentForeground: 'hsl(var(--accent-foreground))',
    background: 'hsl(var(--background))',
    foreground: 'hsl(var(--foreground))',
    muted: 'hsl(var(--muted))',
    mutedForeground: 'hsl(var(--muted-foreground))',
    border: 'hsl(var(--border))',
    ring: 'hsl(var(--ring))',
    destructive: 'hsl(var(--destructive))',
    destructiveForeground: 'hsl(var(--destructive-foreground))',
    success: 'hsl(142 76% 36%)',
    successForeground: 'hsl(0 0% 100%)',
    warning: 'hsl(38 92% 50%)',
    warningForeground: 'hsl(0 0% 100%)',
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    baseFontSize: '16px',
    lineHeight: '1.5',
  },
  spacing: {
    unit: 4,
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    full: '9999px',
  },
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  },
};

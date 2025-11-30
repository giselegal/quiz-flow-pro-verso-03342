/**
 * 🎨 THEME TOKENS - Configuração Centralizada
 * 
 * Mapeamento de todos os tokens de tema usados nos templates.
 * Serve como referência para:
 * - Substituição de placeholders
 * - Personalização de temas
 * - Validação de cores
 * - Documentação de design system
 * 
 * @module config/themeTokens
 * @version 1.0.0
 */

/**
 * Cores do tema padrão
 */
export const THEME_COLORS = {
  // Primárias
  primary: '#B89B7A',
  primaryHover: '#A68B6A',
  primaryLight: '#F3E8D3',
  primaryDark: '#8F7A5E',
  
  // Secundárias
  secondary: '#432818',
  secondaryHover: '#5A3821',
  secondaryLight: '#6B4A2D',
  
  // Neutras
  background: '#FAF9F7',
  backgroundAlt: '#FFFFFF',
  text: '#1F2937',
  textMuted: '#6B7280',
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  
  // Estados
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
} as const;

/**
 * Fontes do sistema
 */
export const THEME_FONTS = {
  heading: 'Playfair Display, serif',
  body: 'Inter, sans-serif',
  mono: 'JetBrains Mono, monospace',
} as const;

/**
 * Espaçamentos
 */
export const THEME_SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
} as const;

/**
 * Border radius
 */
export const THEME_BORDER_RADIUS = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
} as const;

/**
 * Shadows
 */
export const THEME_SHADOWS = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
} as const;

/**
 * Assets URLs
 */
export const THEME_ASSETS = {
  logo: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/logo_euritmo.webp',
  logoAlt: 'Logo Euritmo',
  logoDark: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/logo_euritmo_dark.webp',
  favicon: '/favicon.ico',
  ogImage: '/og-image.png',
} as const;

/**
 * Mapa completo de tokens para substituição
 * Usado pelo script de correção de placeholders
 */
export const TOKEN_MAP = {
  // Colors
  '{{theme.colors.primary}}': THEME_COLORS.primary,
  '{{theme.colors.primaryHover}}': THEME_COLORS.primaryHover,
  '{{theme.colors.primaryLight}}': THEME_COLORS.primaryLight,
  '{{theme.colors.secondary}}': THEME_COLORS.secondary,
  '{{theme.colors.background}}': THEME_COLORS.background,
  '{{theme.colors.text}}': THEME_COLORS.text,
  '{{theme.colors.border}}': THEME_COLORS.border,
  
  // Fonts
  '{{theme.fonts.heading}}': THEME_FONTS.heading,
  '{{theme.fonts.body}}': THEME_FONTS.body,
  
  // Assets
  '{{asset.logo}}': THEME_ASSETS.logo,
  '{{asset.logoDark}}': THEME_ASSETS.logoDark,
  '{{asset.favicon}}': THEME_ASSETS.favicon,
} as const;

/**
 * Regex patterns para validação
 */
export const VALIDATION_PATTERNS = {
  hexColor: /^#[0-9A-F]{6}$/i,
  hexColorWithAlpha: /^#[0-9A-F]{8}$/i,
  placeholder: /\{\{[^}]+\}\}/g,
  token: /\{\{(theme|asset)\.[\w.]+\}\}/g,
} as const;

/**
 * Resolve um token para seu valor real
 * 
 * @example
 * ```ts
 * resolveToken('{{theme.colors.primary}}') // '#B89B7A'
 * resolveToken('#B89B7A') // '#B89B7A' (já resolvido)
 * ```
 */
export function resolveToken(value: string): string {
  if (!value || typeof value !== 'string') return value;
  
  // Se já é um valor resolvido, retorna
  if (!value.includes('{{')) return value;
  
  // Resolve token
  return TOKEN_MAP[value as keyof typeof TOKEN_MAP] || value;
}

/**
 * Resolve todos os tokens em um objeto
 * 
 * @example
 * ```ts
 * const obj = {
 *   color: '{{theme.colors.primary}}',
 *   logoUrl: '{{asset.logo}}'
 * };
 * 
 * resolveAllTokens(obj);
 * // { color: '#B89B7A', logoUrl: 'https://...' }
 * ```
 */
export function resolveAllTokens<T>(obj: T): T {
  if (!obj || typeof obj !== 'object') return obj;
  
  const resolved = Array.isArray(obj) ? [] : {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      (resolved as any)[key] = resolveToken(value);
    } else if (typeof value === 'object' && value !== null) {
      (resolved as any)[key] = resolveAllTokens(value);
    } else {
      (resolved as any)[key] = value;
    }
  }
  
  return resolved as T;
}

/**
 * Verifica se um valor contém placeholders não resolvidos
 */
export function hasUnresolvedTokens(value: string | object): boolean {
  const str = typeof value === 'string' ? value : JSON.stringify(value);
  return VALIDATION_PATTERNS.placeholder.test(str);
}

/**
 * Lista todos os tokens não resolvidos em um objeto
 */
export function listUnresolvedTokens(obj: object): string[] {
  const str = JSON.stringify(obj);
  const matches = str.match(VALIDATION_PATTERNS.token);
  return matches ? [...new Set(matches)] : [];
}

/**
 * Type-safe theme configuration
 */
export type ThemeColors = typeof THEME_COLORS;
export type ThemeFonts = typeof THEME_FONTS;
export type ThemeSpacing = typeof THEME_SPACING;
export type ThemeBorderRadius = typeof THEME_BORDER_RADIUS;
export type ThemeShadows = typeof THEME_SHADOWS;
export type ThemeAssets = typeof THEME_ASSETS;

export interface Theme {
  colors: ThemeColors;
  fonts: ThemeFonts;
  spacing: ThemeSpacing;
  borderRadius: ThemeBorderRadius;
  shadows: ThemeShadows;
  assets: ThemeAssets;
}

/**
 * Tema completo exportado
 */
export const theme: Theme = {
  colors: THEME_COLORS,
  fonts: THEME_FONTS,
  spacing: THEME_SPACING,
  borderRadius: THEME_BORDER_RADIUS,
  shadows: THEME_SHADOWS,
  assets: THEME_ASSETS,
};

export default theme;

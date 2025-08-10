/**
 * 🎨 SISTEMA UNIVERSAL DE CORES
 * Paleta padronizada para todos os componentes
 * Implementação visual intuitiva com color picker
 */

export interface ColorOption {
  value: string;
  label: string;
  category: "brand" | "neutral" | "accent" | "semantic";
  preview?: string;
}

export interface ColorGroup {
  id: string;
  name: string;
  colors: ColorOption[];
}

// 🎨 CORES DA MARCA (Tons principais)
export const BRAND_COLORS: ColorOption[] = [
  { value: "#B89B7A", label: "Dourado Principal", category: "brand" },
  { value: "#A08968", label: "Dourado Escuro", category: "brand" },
  { value: "#D4C2A8", label: "Dourado Claro", category: "brand" },
  { value: "#8A7766", label: "Dourado Profundo", category: "brand" },
  { value: "#F2E9DC", label: "Dourado Suave", category: "brand" },
];

// 🎨 CORES NEUTRAS (Tons base)
export const NEUTRAL_COLORS: ColorOption[] = [
  { value: "#432818", label: "Marrom Escuro", category: "neutral" },
  { value: "#6B5B4E", label: "Marrom Médio", category: "neutral" },
  { value: "#8F7A6A", label: "Marrom Claro", category: "neutral" },
  { value: "#FFFFFF", label: "Branco", category: "neutral" },
  { value: "#F9F5F1", label: "Creme", category: "neutral" },
  { value: "#FAF9F7", label: "Off-White", category: "neutral" },
  { value: "#E5E7EB", label: "Cinza Claro", category: "neutral" },
  { value: "#9CA3AF", label: "Cinza Médio", category: "neutral" },
  { value: "#374151", label: "Cinza Escuro", category: "neutral" },
  { value: "#111827", label: "Preto Suave", category: "neutral" },
  { value: "transparent", label: "Transparente", category: "neutral" },
];

// 🎨 CORES DE DESTAQUE (Acentos)
export const ACCENT_COLORS: ColorOption[] = [
  { value: "#10B981", label: "Verde Sucesso", category: "accent" },
  { value: "#F59E0B", label: "Âmbar", category: "accent" },
  { value: "#aa6b5d", label: "Vermelho", category: "accent" },
  { value: "#B89B7A", label: "Roxo", category: "accent" },
  { value: "#06B6D4", label: "Ciano", category: "accent" },
  { value: "#EC4899", label: "Rosa", category: "accent" },
];

// 🎨 CORES SEMÂNTICAS (Estados)
export const SEMANTIC_COLORS: ColorOption[] = [
  { value: "#10B981", label: "Sucesso", category: "semantic" },
  { value: "#F59E0B", label: "Aviso", category: "semantic" },
  { value: "#aa6b5d", label: "Erro", category: "semantic" },
  { value: "#B89B7A", label: "Informação", category: "semantic" },
];

// 🎨 GRUPOS DE CORES ORGANIZADOS
export const COLOR_GROUPS: ColorGroup[] = [
  {
    id: "brand",
    name: "Cores da Marca",
    colors: BRAND_COLORS,
  },
  {
    id: "neutral",
    name: "Cores Neutras",
    colors: NEUTRAL_COLORS,
  },
  {
    id: "accent",
    name: "Cores de Destaque",
    colors: ACCENT_COLORS,
  },
  {
    id: "semantic",
    name: "Cores Semânticas",
    colors: SEMANTIC_COLORS,
  },
];

// 🎨 TODAS AS CORES DISPONÍVEIS
export const ALL_COLORS: ColorOption[] = [
  ...BRAND_COLORS,
  ...NEUTRAL_COLORS,
  ...ACCENT_COLORS,
  ...SEMANTIC_COLORS,
];

// 🎨 CORES MAIS USADAS (Shortcuts)
export const POPULAR_COLORS: ColorOption[] = [
  { value: "#B89B7A", label: "Dourado Principal", category: "brand" },
  { value: "#FFFFFF", label: "Branco", category: "neutral" },
  { value: "#432818", label: "Marrom Escuro", category: "neutral" },
  { value: "#F9F5F1", label: "Creme", category: "neutral" },
  { value: "#10B981", label: "Verde Sucesso", category: "accent" },
  { value: "transparent", label: "Transparente", category: "neutral" },
];

// 🎨 UTILITÁRIOS PARA CORES
export class ColorUtils {
  /**
   * Converte hex para RGB
   */
  static hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    if (hex === "transparent") return null;
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  /**
   * Verifica se a cor é escura
   */
  static isDark(hex: string): boolean {
    if (hex === "transparent") return false;
    const rgb = this.hexToRgb(hex);
    if (!rgb) return false;
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    return brightness < 128;
  }

  /**
   * Retorna cor de texto ideal para um fundo
   */
  static getContrastColor(backgroundColor: string): string {
    return this.isDark(backgroundColor) ? "#FFFFFF" : "#432818";
  }

  /**
   * Busca uma cor na paleta
   */
  static findColor(value: string): ColorOption | undefined {
    return ALL_COLORS.find(color => color.value.toLowerCase() === value.toLowerCase());
  }

  /**
   * Retorna o label de uma cor
   */
  static getColorLabel(value: string): string {
    const color = this.findColor(value);
    return color?.label || value;
  }
}

// 🎨 CONFIGURAÇÕES DE CANVAS
export const CANVAS_BACKGROUND_OPTIONS: ColorOption[] = [
  { value: "#FFFFFF", label: "Branco", category: "neutral" },
  { value: "#F9F5F1", label: "Creme", category: "brand" },
  { value: "#FAF9F7", label: "Off-White", category: "neutral" },
  { value: "#F3F4F6", label: "Cinza Muito Claro", category: "neutral" },
  { value: "#E5E7EB", label: "Cinza Claro", category: "neutral" },
  { value: "#B89B7A", label: "Dourado", category: "brand" },
  { value: "#432818", label: "Marrom Escuro", category: "neutral" },
];

export default {
  COLOR_GROUPS,
  ALL_COLORS,
  POPULAR_COLORS,
  CANVAS_BACKGROUND_OPTIONS,
  ColorUtils,
};

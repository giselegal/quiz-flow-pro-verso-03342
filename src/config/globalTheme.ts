/**
 * 🌐 GLOBAL THEME (Quick Win Fase 1)
 *
 * Centraliza definição única de cores e tipografia essenciais.
 * Substitui 21 repetições inline em step-XX-v3.json.
 *
 * Migração gradual:
 * - Scripts de extração removem "theme" dos JSONs.
 * - Renderizador passa a consumir GLOBAL_THEME em vez de theme embutido.
 */
export const GLOBAL_THEME = {
  version: '4.0',
  colors: {
    primary: '#B89B7A',
    primaryHover: '#A68B6A',
    primaryLight: '#F3E8D3',
    secondary: '#432818',
    background: '#FAF9F7',
    text: '#1F2937',
    border: '#E5E7EB',
  },
  fonts: {
    heading: 'Playfair Display, serif',
    body: 'Inter, system-ui, sans-serif',
  },
  spacing: { sm: 8, md: 16, lg: 24, xl: 32 },
  borderRadius: { sm: 4, md: 8, lg: 12, xl: 16 },
} as const;

export type GlobalTheme = typeof GLOBAL_THEME;

export const getGlobalTheme = (): GlobalTheme => GLOBAL_THEME;

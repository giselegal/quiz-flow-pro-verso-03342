/**
 * 🏗️ EDITOR FIXED - PUBLIC API
 * 
 * Exportações públicas do sistema EditorFixed com Compound Components
 */

// =============================================
// MAIN COMPONENTS
// =============================================

export { 
  EditorFixed,           // Compound Components
  DefaultEditorFixed,    // Default Implementation
  useEditorFixed         // Hook para configuração
} from './EditorFixed';

// =============================================
// EXAMPLES & DEMOS
// =============================================

export {
  SimpleEditorExample,
  CustomEditorExample,
  AdvancedEditorExample
} from './EditorFixedExamples';

// =============================================
// TYPES
// =============================================

export type {
  EditorFixedConfig,
  EditorFixedContextValue,
  EditorRootProps,
  EditorCanvasProps,
  EditorPropertiesProps,
  EditorSidebarProps,
  EditorToolbarProps,
  DefaultEditorFixedProps
} from './EditorFixed';

// =============================================
// CONSTANTS
// =============================================

export const EDITOR_FIXED_VERSION = '2.0.0';
export const EDITOR_FIXED_PATTERNS = {
  COMPOUND_COMPONENTS: 'compound-components',
  RENDER_PROPS: 'render-props',
  ATOMIC_DESIGN: 'atomic-design'
} as const;

// =============================================
// UTILITIES
// =============================================

/**
 * Função utilitária para criar configuração padrão
 */
export const createEditorConfig = (overrides = {}) => ({
  theme: 'light' as const,
  layout: 'four-column' as const,
  viewport: 'xl' as const,
  features: {
    dragDrop: true,
    properties: true,
    toolbar: true,
    funnel: true,
  },
  ...overrides
});

/**
 * Função utilitária para validar configuração
 */
export const validateEditorConfig = (config: any): boolean => {
  const validThemes = ['light', 'dark', 'auto'];
  const validLayouts = ['four-column', 'three-column', 'responsive'];
  const validViewports = ['sm', 'md', 'lg', 'xl'];
  
  return (
    (!config.theme || validThemes.includes(config.theme)) &&
    (!config.layout || validLayouts.includes(config.layout)) &&
    (!config.viewport || validViewports.includes(config.viewport))
  );
};

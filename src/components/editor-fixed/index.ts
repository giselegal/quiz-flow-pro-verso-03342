/**
 * 🏗️ EDITOR FIXED - PUBLIC API + SISTEMA JSON INTEGRADO
 *
 * Exportações públicas do sistema EditorFixed com Compound Components
 * + Sistema JSON completo para templates das 21 etapas
 */

// =============================================
// MAIN COMPONENTS (Compound Components)
// =============================================

export {
  DefaultEditorFixed,
  EditorFixed, // Default Implementation
  useEditorFixed, // Hook para configuração
} from './EditorFixed';

// =============================================
// SISTEMA JSON INTEGRADO 🎯
// =============================================

export {
  JsonTemplateEngine,
  useJsonTemplate,
  type JsonBlock,
  type JsonTemplate,
} from './JsonTemplateEngine';

export { useEditorWithJson, type UseEditorWithJsonReturn } from './useEditorWithJson';

// =============================================
// COMPONENTES DE OFERTA (ETAPA 21) 🎯
// =============================================

// Componente para renderizar páginas de oferta
export { default as OfferPageJson } from './OfferPageJson';

// Componentes de oferta individuais
export {
  injectOfferPageStyles,
  OFFER_COMPONENT_TYPES,
  OfferFaqSection,
  OfferGuaranteeSection,
  OfferHeader,
  OfferHeroSection,
  offerPageStyles,
  OfferProblemSection,
  OfferProductShowcase,
  OfferSolutionSection,
} from './offer';

export { TemplateAdapter } from './TemplateAdapter';

// =============================================
// DEMOS E COMPONENTES JSON
// =============================================

export { default as JsonSystemDemo, MinimalExample } from './JsonSystemDemo';

export { default as JsonIntegrationTest } from './JsonIntegrationTest';

export {
  EditorWithJsonIntegration,
  JsonDebugPanel,
  JsonTemplatePreview,
  SimpleJsonIntegration,
  useStepByStepBuilder,
} from './JsonIntegrationExamples';

// =============================================
// EXAMPLES & DEMOS (Compound Components)
// =============================================

export {
  AdvancedEditorExample,
  CustomEditorExample,
  SimpleEditorExample,
} from './EditorFixedExamples';

// =============================================
// TYPES
// =============================================

export type {
  EditorCanvasProps,
  EditorFixedConfig,
  EditorFixedContextValue,
  EditorPropertiesProps,
  EditorRootProps,
  EditorSidebarProps,
  EditorToolbarProps,
} from './EditorFixed';

// =============================================
// CONSTANTS
// =============================================

export const EDITOR_FIXED_VERSION = '2.1.0'; // Atualizado para incluir JSON
export const EDITOR_FIXED_PATTERNS = {
  COMPOUND_COMPONENTS: 'compound-components',
  RENDER_PROPS: 'render-props',
  ATOMIC_DESIGN: 'atomic-design',
  JSON_TEMPLATES: 'json-templates', // NOVO
} as const;

// Informações do Sistema JSON
export const JSON_SYSTEM_INFO = {
  name: 'Sistema JSON para /editor-fixed',
  version: '1.0.0',
  compatibility: '100% compatível com infraestrutura existente',
  templates: {
    available: 21,
    path: '/templates/step-{01-21}-template.json',
    registry: 'ENHANCED_BLOCK_REGISTRY',
    components: '290+',
  },
  features: [
    'Carregamento automático de templates das 21 etapas',
    'Conversão automática JSON → Blocos React',
    'Validação completa de templates',
    'Export/Import de configurações',
    'Compatibilidade total com componentes existentes',
    'Zero breaking changes',
  ],
};

// =============================================
// UTILITIES
// =============================================

/**
 * Função utilitária para criar configuração padrão (Compound Components)
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
    jsonTemplates: true, // NOVO
  },
  ...overrides,
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

// =============================================
// QUICK START JSON 🚀
// =============================================

/**
 * QUICK START: Função helper para começar rapidamente com JSON
 */
export const quickStartJson = (_blocks: any[], _setBlocks: (blocks: any[]) => void) => {
  // Note: Esta função deve ser usada dentro de um componente React
  // devido ao hook useEditorWithJson
  return {
    info: 'Use useEditorWithJson directly in your React component',
    example: `
      const [blocks, setBlocks] = useState([]);
      const jsonFeatures = useEditorWithJson(blocks, setBlocks);
      
      // Usar: jsonFeatures.loadStepTemplate(1)
    `,
  };
};

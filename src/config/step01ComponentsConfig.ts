/**
 * 🎯 CONFIGURAÇÃO COMPLETA DOS COMPONENTES DA ETAPA 1
 * Sistema integrado com Supabase, propriedades específicas e painel ativo
 */

export interface Step01ComponentConfig {
  id: string;
  type: string;
  properties: Record<string, any>;
  supabaseConfig?: {
    enabled: boolean;
    table?: string;
    column?: string;
  };
  propertiesPanelConfig?: {
    enabled: boolean;
    inlineEditingDisabled: boolean;
    categories: string[];
  };
}

/**
 * ✅ COMPONENTES DA ETAPA 1 CONFIGURADOS COMPLETAMENTE
 */
export const STEP01_COMPONENTS_CONFIG: Step01ComponentConfig[] = [
  // 1. Cabeçalho Quiz com logo
  {
    id: 'step01-header-logo',
    type: 'quiz-intro-header',
    properties: {
      logoUrl:
        'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
      logoAlt: 'Logo Gisele Galvão',
      logoWidth: 120,
      logoHeight: 120,
      progressValue: 0,
      progressMax: 100,
      showBackButton: false,
      showProgress: false,
      backgroundColor: '#FEFDFB',
      isSticky: false,
      marginTop: 0,
      marginBottom: 24,
    },
    propertiesPanelConfig: {
      enabled: true,
      inlineEditingDisabled: true,
      categories: ['content', 'style', 'layout', 'behavior'],
    },
  },

  // 2. Barra decorativa
  {
    id: 'step01-decorative-bar',
    type: 'decorative-bar',
    properties: {
      width: '100%',
      height: 4,
      color: '#B89B7A',
      gradientColors: ['#B89B7A', '#D4C2A8', '#B89B7A'],
      borderRadius: 3,
      marginTop: 8,
      marginBottom: 24,
      showShadow: true,
      backgroundColor: '#B89B7A',
    },
    propertiesPanelConfig: {
      enabled: true,
      inlineEditingDisabled: true,
      categories: ['style', 'layout'],
    },
  },

  // 3. Título principal
  {
    id: 'step01-main-title',
    type: 'text',
    properties: {
      content:
        '<span style="color: #B89B7A; font-weight: 700; font-family: \'Playfair Display\', serif;">Chega</span> <span style="font-family: \'Playfair Display\', serif;">de um guarda-roupa lotado e da sensação de que</span> <span style="color: #B89B7A; font-weight: 700; font-family: \'Playfair Display\', serif;">nada combina com você.</span>',
      fontSize: 'text-3xl',
      fontWeight: 'font-bold',
      fontFamily: 'Playfair Display, serif',
      textAlign: 'text-center',
      color: '#432818',
      marginBottom: 32,
      lineHeight: '1.2',
    },
    propertiesPanelConfig: {
      enabled: true,
      inlineEditingDisabled: true,
      categories: ['content', 'style', 'layout'],
    },
  },

  // 4. Imagem hero
  {
    id: 'step01-hero-image',
    type: 'image',
    properties: {
      src: 'https://res.cloudinary.com/der8kogzu/image/upload/f_avif,q_85,w_300,c_limit/v1752443943/Gemini_Generated_Image_i5cst6i5cst6i5cs_fpoukb.avif',
      alt: 'Descubra seu estilo predominante',
      width: 300,
      height: 204,
      className: 'object-cover w-full max-w-lg h-48 rounded-xl mx-auto shadow-lg',
      textAlign: 'text-center',
      marginBottom: 32,
      aspectRatio: '4/3',
      priority: true,
      loading: 'eager',
    },
    propertiesPanelConfig: {
      enabled: true,
      inlineEditingDisabled: true,
      categories: ['content', 'style', 'layout'],
    },
  },

  // 5. Texto motivacional
  {
    id: 'step01-motivation-text',
    type: 'text',
    properties: {
      content: 'Descubra seu <strong>ESTILO PREDOMINANTE</strong> em apenas alguns minutos!',
      fontSize: 'text-lg',
      fontWeight: 'font-medium',
      textAlign: 'text-center',
      color: '#432818',
      marginTop: 0,
      marginBottom: 40,
      lineHeight: '1.6',
    },
    propertiesPanelConfig: {
      enabled: true,
      inlineEditingDisabled: true,
      categories: ['content', 'style', 'layout'],
    },
  },

  // 6. Campo de nome (CONECTADO AO SUPABASE)
  {
    id: 'step01-name-input',
    type: 'form-input',
    properties: {
      label: 'Como posso te chamar?',
      placeholder: 'Digite seu primeiro nome aqui...',
      required: true,
      inputType: 'text',
      name: 'userName',
      backgroundColor: '#ffffff',
      borderColor: '#B89B7A',
      textAlign: 'text-center',
      marginBottom: 32,
      minLength: 2,
      maxLength: 50,
      // Configurações específicas do Supabase
      saveToSupabase: true,
      supabaseTable: 'quiz_users',
      supabaseColumn: 'name',
    },
    supabaseConfig: {
      enabled: true,
      table: 'quiz_users',
      column: 'name',
    },
    propertiesPanelConfig: {
      enabled: true,
      inlineEditingDisabled: true,
      categories: ['content', 'behavior', 'style', 'layout'],
    },
  },

  // 7. Botão CTA
  {
    id: 'step01-cta-button',
    type: 'button',
    properties: {
      text: 'Quero Descobrir meu Estilo Agora!',
      variant: 'primary',
      size: 'large',
      fullWidth: true,
      backgroundColor: '#B89B7A',
      textColor: '#ffffff',
      requiresValidInput: true,
      watchInputId: 'step01-name-input',
      textAlign: 'text-center',
      borderRadius: 'rounded-full',
      padding: 'py-4 px-8',
      fontSize: 'text-lg',
      fontWeight: 'font-bold',
      boxShadow: 'shadow-xl',
      hoverEffect: true,
      nextStepUrl: '/quiz/step-2',
      nextStepId: 'step-2',
      disabledText: 'Digite seu nome para continuar',
      showDisabledState: true,
      disabledOpacity: 0.6,
    },
    propertiesPanelConfig: {
      enabled: true,
      inlineEditingDisabled: true,
      categories: ['content', 'behavior', 'style', 'layout'],
    },
  },

  // 8. Aviso legal
  {
    id: 'step01-legal-notice',
    type: 'legal-notice',
    properties: {
      content:
        '© 2025 Gisele Galvão - Todos os direitos reservados. Suas informações são seguras.',
      fontSize: 'text-xs',
      textAlign: 'text-center',
      color: '#9CA3AF',
      showPrivacyLink: true,
      showTermsLink: true,
      linkColor: '#B89B7A',
      marginTop: 32,
      marginBottom: 8,
    },
    propertiesPanelConfig: {
      enabled: true,
      inlineEditingDisabled: true,
      categories: ['content', 'style', 'layout'],
    },
  },
];

/**
 * 🔧 CONFIGURAÇÕES GLOBAIS PARA O PAINEL DE PROPRIEDADES
 */
export const STEP01_PROPERTIES_PANEL_CONFIG = {
  // Desabilita edição inline em favor do painel
  disableInlineEditing: true,

  // Habilita painel de propriedades para todos os componentes
  enablePropertiesPanel: true,

  // Categorias ativas por padrão
  defaultOpenCategories: ['content', 'style', 'layout'],

  // Configurações específicas do Supabase
  supabaseIntegration: {
    enabled: true,
    autoSave: true,
    realTimeUpdates: true,
  },

  // Validações automáticas
  validation: {
    enabled: true,
    realTime: true,
    showErrors: true,
  },
};

/**
 * 📊 FUNÇÃO PARA OBTER CONFIGURAÇÃO DE UM COMPONENTE ESPECÍFICO
 */
export const getStep01ComponentConfig = (componentId: string): Step01ComponentConfig | null => {
  return STEP01_COMPONENTS_CONFIG.find(config => config.id === componentId) || null;
};

/**
 * 🎯 FUNÇÃO PARA VERIFICAR SE UM COMPONENTE É DA ETAPA 1
 */
export const isStep01Component = (componentId: string): boolean => {
  return (
    componentId.startsWith('step01-') ||
    [
      'intro-header',
      'intro-decorative-bar',
      'intro-main-title',
      'intro-image',
      'intro-subtitle',
      'intro-form-input',
      'intro-cta-button',
      'intro-legal-notice',
    ].includes(componentId)
  );
};

/**
 * ✅ FUNÇÃO PARA VALIDAR CONFIGURAÇÃO COMPLETA
 */
export const validateStep01Configuration = (): {
  valid: boolean;
  components: number;
  supabaseEnabled: number;
  propertiesPanelEnabled: number;
  issues: string[];
} => {
  const issues: string[] = [];

  // Verificar se todos os componentes têm configurações válidas
  STEP01_COMPONENTS_CONFIG.forEach(config => {
    if (!config.id || !config.type) {
      issues.push(`Componente ${config.id || 'sem-id'} está mal configurado`);
    }

    if (!config.propertiesPanelConfig?.enabled) {
      issues.push(`Componente ${config.id} não tem painel de propriedades habilitado`);
    }
  });

  const supabaseEnabled = STEP01_COMPONENTS_CONFIG.filter(
    c => c.supabaseConfig?.enabled || c.properties?.saveToSupabase
  ).length;

  const propertiesPanelEnabled = STEP01_COMPONENTS_CONFIG.filter(
    c => c.propertiesPanelConfig?.enabled
  ).length;

  return {
    valid: issues.length === 0,
    components: STEP01_COMPONENTS_CONFIG.length,
    supabaseEnabled,
    propertiesPanelEnabled,
    issues,
  };
};

export default STEP01_COMPONENTS_CONFIG;

/**
 * 🎯 ESQUEMA UNIFICADO PARA QUIZ HEADLESS/CANÔNICO
 * 
 * Schema completo para migração do quiz21StepsComplete para formato
 * editável no editor visual, com suporte a edição ao vivo, preview real
 * e publicação instantânea.
 */

import { Block } from './editor';

// ============================================================================
// TIPOS BASE
// ============================================================================

export interface QuizFunnelSchema {
  // Metadados básicos
  id: string;
  name: string;
  description: string;
  version: string;
  category: 'quiz' | 'lead-magnet' | 'sales-funnel' | 'assessment';
  templateType: 'quiz-complete' | 'quiz-simple' | 'lead-capture' | 'sales-page';

  // Configurações globais
  settings: FunnelGlobalSettings;

  // Estrutura do funil
  steps: FunnelStep[];

  // Configurações de runtime (pontuação, navegação)
  runtime?: RuntimeConfig;

  // Conteúdos e mapas de resultado/oferta
  results?: ResultsConfig;

  // Preferências de UI/efeitos (opcional)
  ui?: UIConfig;

  // Configurações de publicação
  publication: PublicationSettings;

  // Metadados do editor
  editorMeta: EditorMetadata;
}

// ============================================================================
// RUNTIME CONFIG (pontuação, navegação)
// ============================================================================

export interface RuntimeConfig {
  scoring: ScoringConfig;
  navigation: NavigationConfig;
}

export interface ScoringConfig {
  method: 'sum' | 'weighted' | 'majority';
  // weights pode mapear optionId/styleId → peso numérico
  weights?: Record<string, number>;
  // Opções de desempate — ampliadas para cobrir variações usadas no runtime/preview
  tieBreak?: 'alphabetical' | 'first' | 'natural-first' | 'random';
}

export interface NavigationConfig {
  autoAdvance: {
    enable: boolean;
    delayMs: number;
    perStepOverrides?: Record<string, number>; // stepId → delayMs
  };
}

// ============================================================================
// RESULTADOS E OFERTAS
// ============================================================================

export interface ResultStyleContent {
  title?: string;
  description?: string;
  image?: string;
}

export interface OfferContent {
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  image?: string;
}

export interface ResultsConfig {
  styles?: Record<string, ResultStyleContent>; // styleId → conteúdo
  offersMap?: Record<string, OfferContent>; // chave estratégica → oferta
}

// ============================================================================
// UI CONFIG (efeitos/validações visuais – leve)
// ============================================================================

export interface UIConfig {
  behavior?: {
    selectionEffects?: {
      enabled?: boolean;
      highlightColor?: string;
      pulseOnComplete?: boolean;
    };
    validation?: {
      showErrorOnUnderSelection?: boolean;
      errorCopy?: string;
    };
  };
}

// ============================================================================
// CONFIGURAÇÕES GLOBAIS DO FUNIL
// ============================================================================

export interface FunnelGlobalSettings {
  // SEO e Meta Tags
  seo: SEOConfiguration;

  // Analytics e Tracking
  analytics: AnalyticsConfiguration;

  // Branding e Visual
  branding: BrandingConfiguration;

  // Persistência e Dados
  persistence: PersistenceConfiguration;

  // Integrações
  integrations: IntegrationsConfiguration;

  // Performance
  performance: PerformanceConfiguration;

  // Legal e Conformidade
  legal: LegalConfiguration;
}

export interface SEOConfiguration {
  title: string;
  description: string;
  keywords: string[];
  canonical?: string;
  robots: 'index,follow' | 'noindex,nofollow' | 'index,nofollow' | 'noindex,follow';

  // Open Graph
  openGraph: {
    title: string;
    description: string;
    image: string;
    imageAlt: string;
    type: 'website' | 'article' | 'product';
    url: string;
    siteName: string;
  };

  // Twitter Cards
  twitter: {
    card: 'summary' | 'summary_large_image' | 'app' | 'player';
    title: string;
    description: string;
    image: string;
    creator?: string;
    site?: string;
  };

  // Schema.org structured data
  structuredData: {
    '@type': 'Quiz' | 'WebApplication' | 'Service';
    name: string;
    description: string;
    provider: {
      '@type': 'Organization';
      name: string;
      url: string;
      logo: string;
    };
    category: string[];
    dateCreated: string;
    dateModified: string;
  };
}

export interface AnalyticsConfiguration {
  enabled: boolean;

  // Google Analytics 4
  googleAnalytics?: {
    measurementId: string;
    enableEcommerce: boolean;
    customEvents: string[];
  };

  // Google Tag Manager
  googleTagManager?: {
    containerId: string;
    dataLayerName: string;
  };

  // Facebook Pixel
  facebookPixel?: {
    pixelId: string;
    events: FacebookPixelEvent[];
  };

  // Eventos personalizados
  customEvents: AnalyticsEvent[];

  // UTM Configuration
  utm: {
    source: string;
    medium: string;
    campaign: string;
    content?: string;
    term?: string;
  };

  // Heatmap e Session Recording
  heatmap?: {
    provider: 'hotjar' | 'fullstory' | 'logrocket';
    id: string;
    recordSessions: boolean;
    trackClicks: boolean;
    trackScrolls: boolean;
  };
}

export interface BrandingConfiguration {
  // Cores
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: {
      primary: string;
      secondary: string;
      disabled: string;
    };
    error: string;
    warning: string;
    success: string;
  };

  // Tipografia
  typography: {
    fontFamily: {
      primary: string;
      secondary: string;
      monospace: string;
    };
    fontSizes: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
    };
    fontWeights: {
      light: number;
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
    };
    lineHeight: {
      tight: number;
      normal: number;
      relaxed: number;
    };
  };

  // Logo e Assets
  logo: {
    primary: string;
    secondary?: string;
    favicon: string;
    appleTouchIcon: string;
  };

  // Espaçamento e Layout
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };

  // Border Radius
  borderRadius: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };

  // Shadows
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

export interface PersistenceConfiguration {
  enabled: boolean;
  storage: ('localStorage' | 'sessionStorage' | 'supabase' | 'firebase' | 'custom')[];
  autoSave: boolean;
  autoSaveInterval: number; // milliseconds
  compression: boolean;
  encryption: boolean;
  backupEnabled: boolean;

  // Supabase configuration
  supabase?: {
    url: string;
    anonKey: string;
    tables: {
      funnels: string;
      sessions: string;
      results: string;
    };
  };

  // Webhook configuration
  webhooks?: WebhookConfiguration[];
}

export interface IntegrationsConfiguration {
  // Email Marketing
  email?: {
    provider: 'mailchimp' | 'convertkit' | 'activecampaign' | 'custom';
    apiKey: string;
    listId: string;
    tags: string[];
  };

  // CRM
  crm?: {
    provider: 'hubspot' | 'salesforce' | 'pipedrive' | 'custom';
    apiKey: string;
    pipelineId?: string;
  };

  // Payment
  payment?: {
    provider: 'stripe' | 'paypal' | 'hotmart' | 'custom';
    apiKey: string;
    products: PaymentProduct[];
  };

  // Webhooks
  webhooks: WebhookConfiguration[];
}

export interface WebhookConfiguration {
  id: string;
  name: string;
  url: string;
  method: 'POST' | 'GET' | 'PUT' | 'PATCH';
  headers: Record<string, string>;
  events: WebhookEvent[];
  active: boolean;
  retryPolicy: {
    maxRetries: number;
    backoffMultiplier: number;
  };
}

export interface PerformanceConfiguration {
  // Caching
  cache: {
    enabled: boolean;
    strategy: 'stale-while-revalidate' | 'cache-first' | 'network-first';
    ttl: number; // seconds
  };

  // Lazy Loading
  lazyLoading: {
    images: boolean;
    components: boolean;
    threshold: number; // pixels
  };

  // Preloading
  preload: {
    criticalResources: string[];
    nextStep: boolean;
  };

  // Compression
  compression: {
    images: boolean;
    scripts: boolean;
    styles: boolean;
  };
}

export interface LegalConfiguration {
  // LGPD/GDPR
  privacy: {
    enabled: boolean;
    policyUrl: string;
    consentRequired: boolean;
    cookieNotice: boolean;
  };

  // Terms of Service
  terms: {
    enabled: boolean;
    termsUrl: string;
    acceptanceRequired: boolean;
  };

  // Data Processing
  dataProcessing: {
    purpose: string[];
    legalBasis: string;
    retentionPeriod: number; // days
    rightToDelete: boolean;
    rightToPortability: boolean;
  };
}

// ============================================================================
// ESTRUTURA DAS ETAPAS
// ============================================================================

export interface FunnelStep {
  id: string;
  name: string;
  description: string;
  order: number;
  type: StepType;

  // Configurações da etapa
  settings: StepSettings;

  // Blocos de conteúdo
  blocks: Block[];

  // Lógica de navegação
  navigation: NavigationLogic;

  // Validação e regras
  validation: ValidationRules;

  // SEO específico da etapa
  seo?: Partial<SEOConfiguration>;
}

export type StepType =
  | 'intro'           // Página inicial/boas-vindas
  | 'lead-capture'    // Captura de dados (nome, email)
  | 'quiz-question'   // Pergunta do quiz com pontuação
  | 'strategic-question' // Pergunta estratégica/qualitativa
  | 'transition'      // Página de transição/loading
  | 'result'          // Página de resultado
  | 'offer'          // Página de oferta/vendas
  | 'thank-you'      // Página de agradecimento
  | 'custom';        // Etapa customizada

export interface StepSettings {
  // Timing
  minTimeOnStep?: number; // milliseconds
  maxTimeOnStep?: number; // milliseconds
  autoAdvance?: boolean;
  autoAdvanceDelay?: number; // milliseconds

  // Visual
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundVideo?: string;

  // Progress
  showProgress: boolean;
  progressStyle: 'bar' | 'steps' | 'percentage' | 'custom';

  // Navigation
  showBackButton: boolean;
  showNextButton: boolean;
  allowSkip: boolean;

  // Analytics
  trackTimeOnStep: boolean;
  trackInteractions: boolean;
  customEvents: string[];
}

export interface NavigationLogic {
  // Navegação condicional
  conditions: NavigationCondition[];

  // Navegação padrão
  nextStep?: string;
  prevStep?: string;

  // Ações especiais
  actions: NavigationAction[];
}

export interface NavigationCondition {
  id: string;
  condition: string; // JavaScript expression
  nextStep: string;
  actions?: NavigationAction[];
}

export interface NavigationAction {
  type: 'set-variable' | 'calculate-score' | 'send-webhook' | 'track-event' | 'custom';
  parameters: Record<string, any>;
}

export interface ValidationRules {
  required: boolean;
  customRules: ValidationRule[];
  errorMessages: Record<string, string>;
}

export interface ValidationRule {
  field: string;
  rule: string; // JavaScript expression
  message: string;
}

// ============================================================================
// CONFIGURAÇÕES DE PUBLICAÇÃO
// ============================================================================

export interface PublicationSettings {
  // Status
  status: 'draft' | 'published' | 'archived';
  publishedAt?: string;

  // URLs
  baseUrl: string;
  customDomain?: string;
  slug: string;

  // Versioning
  version: string;
  changelog: ChangelogEntry[];

  // Access Control
  accessControl: {
    public: boolean;
    password?: string;
    allowedDomains?: string[];
    ipWhitelist?: string[];
  };

  // CDN e Performance
  cdn: {
    enabled: boolean;
    provider?: 'cloudflare' | 'aws' | 'custom';
    configuration?: Record<string, any>;
  };
}

export interface ChangelogEntry {
  version: string;
  date: string;
  changes: string[];
  author: string;
}

// ============================================================================
// METADADOS DO EDITOR
// ============================================================================

export interface EditorMetadata {
  // Histórico de edições
  lastModified: string;
  lastModifiedBy: string;

  // Configurações do editor
  editorVersion: string;
  editorSettings: {
    autoSave: boolean;
    previewMode: 'desktop' | 'tablet' | 'mobile';
    showGrid: boolean;
    snapToGrid: boolean;
  };

  // Templates e variações
  baseTemplate?: string;
  variations: TemplateVariation[];

  // Colaboração
  collaborators: Collaborator[];

  // Tags e categorização
  tags: string[];
  categories: string[];

  // Estatísticas
  stats: {
    totalBlocks: number;
    totalSteps: number;
    estimatedCompletionTime: number; // minutes
    lastTestRun?: string;
  };
}

export interface TemplateVariation {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  isActive: boolean;
  changes: VariationChange[];
}

export interface VariationChange {
  type: 'block' | 'step' | 'setting';
  target: string;
  property: string;
  oldValue: any;
  newValue: any;
}

export interface Collaborator {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'editor' | 'viewer';
  lastAccess: string;
}

// ============================================================================
// TIPOS AUXILIARES
// ============================================================================

export type FacebookPixelEvent =
  | 'PageView'
  | 'Lead'
  | 'CompleteRegistration'
  | 'Purchase'
  | 'ViewContent'
  | 'AddToCart'
  | 'InitiateCheckout';

export interface AnalyticsEvent {
  name: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  parameters?: Record<string, any>;
}

export interface PaymentProduct {
  id: string;
  name: string;
  price: number;
  currency: string;
  description: string;
  features: string[];
}

export type WebhookEvent =
  | 'step_completed'
  | 'quiz_completed'
  | 'result_calculated'
  | 'conversion'
  | 'abandonment'
  | 'custom';

// ============================================================================
// SESSÃO DO USUÁRIO
// ============================================================================

export interface UserSession {
  id: string;
  funnelId: string;

  // Dados do usuário
  userData: {
    name?: string;
    email?: string;
    phone?: string;
    customFields?: Record<string, any>;
  };

  // Progresso
  progress: {
    currentStep: string;
    completedSteps: string[];
    startedAt: string;
    lastActivityAt: string;
    completedAt?: string;
    totalTimeSpent: number; // milliseconds
  };

  // Respostas do quiz
  answers: QuizAnswer[];

  // Respostas estratégicas
  strategicAnswers: StrategyAnswer[];

  // Resultado calculado
  result?: QuizResult;

  // Dados de tracking
  tracking: {
    utm: Record<string, string>;
    referrer: string;
    userAgent: string;
    ip: string;
    country: string;
    device: 'desktop' | 'tablet' | 'mobile';
  };
}

export interface QuizAnswer {
  stepId: string;
  questionId: string;
  selectedOptions: string[];
  scores: Record<string, number>;
  timestamp: string;
  timeSpent: number; // milliseconds
}

export interface StrategyAnswer {
  stepId: string;
  questionId: string;
  answer: string;
  timestamp: string;
  timeSpent: number; // milliseconds
}

export interface QuizResult {
  primaryStyle: string;
  secondaryStyles: string[];
  totalScore: number;
  styleScores: Record<string, number>;
  personalizedRecommendations: string[];
  confidenceLevel: number; // 0-1
  calculatedAt: string;
}

// ============================================================================
// UTILITÁRIOS DE VALIDAÇÃO
// ============================================================================

export interface ValidationSchema {
  schema: QuizFunnelSchema;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  path: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

export interface ValidationWarning extends ValidationError {
  suggestion?: string;
}

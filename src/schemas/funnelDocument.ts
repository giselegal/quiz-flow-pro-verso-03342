import { z } from 'zod';

// Zod schema para o documento unificado do funil (FunnelDocument)
// Mantém o escopo mínimo necessário para validação e migração incremental

export const SEOConfigurationSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  keywords: z.array(z.string()).default([]),
  canonical: z.string().url().optional(),
  robots: z.enum(['index,follow', 'noindex,nofollow', 'index,nofollow', 'noindex,follow']).default('index,follow'),
  openGraph: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    image: z.string().min(1),
    imageAlt: z.string().min(1),
    type: z.enum(['website', 'article', 'product']).default('website'),
    url: z.string().min(1),
    siteName: z.string().min(1),
  }),
  twitter: z.object({
    card: z.enum(['summary', 'summary_large_image', 'app', 'player']).default('summary_large_image'),
    title: z.string().min(1),
    description: z.string().min(1),
    image: z.string().min(1),
    creator: z.string().optional(),
    site: z.string().optional(),
  }),
  structuredData: z.object({
    '@type': z.enum(['Quiz', 'WebApplication', 'Service']).default('Quiz'),
    name: z.string().min(1),
    description: z.string().min(1),
    provider: z.object({
      '@type': z.literal('Organization'),
      name: z.string().min(1),
      url: z.string().min(1),
      logo: z.string().min(1),
    }),
    category: z.array(z.string()).default([]),
    dateCreated: z.string().min(1),
    dateModified: z.string().min(1),
  }),
});

export const AnalyticsSchema = z.object({
  enabled: z.boolean().default(true),
  googleAnalytics: z
    .object({
      measurementId: z.string().min(1),
      enableEcommerce: z.boolean().default(false),
      customEvents: z.array(z.string()).default([]),
    })
    .optional(),
  googleTagManager: z
    .object({
      containerId: z.string().min(1),
      dataLayerName: z.string().min(1).default('dataLayer'),
    })
    .optional(),
  facebookPixel: z
    .object({
      pixelId: z.string().min(1),
      events: z.array(z.string()).default([]),
    })
    .optional(),
  customEvents: z
    .array(
      z.object({
        name: z.string(),
        category: z.string(),
        action: z.string(),
        label: z.string().optional(),
        value: z.number().optional(),
        parameters: z.record(z.any()).optional(),
      })
    )
    .default([]),
  utm: z.object({
    source: z.string().default('organic'),
    medium: z.string().default('quiz'),
    campaign: z.string().default('default'),
    content: z.string().optional(),
    term: z.string().optional(),
  }),
  heatmap: z
    .object({
      provider: z.enum(['hotjar', 'fullstory', 'logrocket']).default('hotjar'),
      id: z.string().default(''),
      recordSessions: z.boolean().default(false),
      trackClicks: z.boolean().default(false),
      trackScrolls: z.boolean().default(false),
    })
    .optional(),
});

export const BrandingSchema = z.object({
  colors: z.object({
    primary: z.string(),
    secondary: z.string(),
    accent: z.string(),
    background: z.string(),
    surface: z.string(),
    text: z.object({
      primary: z.string(),
      secondary: z.string(),
      disabled: z.string(),
    }),
    error: z.string(),
    warning: z.string(),
    success: z.string(),
  }),
  typography: z.object({
    fontFamily: z.object({
      primary: z.string(),
      secondary: z.string(),
      monospace: z.string(),
    }),
    fontSizes: z.object({
      xs: z.string(),
      sm: z.string(),
      base: z.string(),
      lg: z.string(),
      xl: z.string(),
      '2xl': z.string(),
      '3xl': z.string(),
      '4xl': z.string(),
    }),
    fontWeights: z.object({
      light: z.number(),
      normal: z.number(),
      medium: z.number(),
      semibold: z.number(),
      bold: z.number(),
    }),
    lineHeight: z.object({
      tight: z.number(),
      normal: z.number(),
      relaxed: z.number(),
    }),
  }),
  logo: z.object({
    primary: z.string(),
    secondary: z.string().optional(),
    favicon: z.string(),
    appleTouchIcon: z.string(),
  }),
  spacing: z.object({
    xs: z.string(),
    sm: z.string(),
    md: z.string(),
    lg: z.string(),
    xl: z.string(),
    '2xl': z.string(),
  }),
  borderRadius: z.object({
    none: z.string(),
    sm: z.string(),
    md: z.string(),
    lg: z.string(),
    xl: z.string(),
    full: z.string(),
  }),
  shadows: z.object({
    sm: z.string(),
    md: z.string(),
    lg: z.string(),
    xl: z.string(),
  }),
});

export const PersistenceSchema = z.object({
  enabled: z.boolean().default(true),
  storage: z.array(z.enum(['localStorage', 'sessionStorage', 'supabase', 'firebase', 'custom'])).default(['localStorage']),
  autoSave: z.boolean().default(true),
  autoSaveInterval: z.number().default(30000),
  compression: z.boolean().default(true),
  encryption: z.boolean().default(false),
  backupEnabled: z.boolean().default(true),
  supabase: z
    .object({
      url: z.string(),
      anonKey: z.string(),
      tables: z.object({ funnels: z.string(), sessions: z.string(), results: z.string() }),
    })
    .optional(),
  webhooks: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        url: z.string().url(),
        method: z.enum(['POST', 'GET', 'PUT', 'PATCH']).default('POST'),
        headers: z.record(z.string()).default({}),
        events: z.array(z.string()).default([]),
        active: z.boolean().default(true),
        retryPolicy: z.object({ maxRetries: z.number().default(3), backoffMultiplier: z.number().default(2) }).default({ maxRetries: 3, backoffMultiplier: 2 }),
      })
    )
    .optional(),
});

export const PerformanceSchema = z.object({
  cache: z.object({ enabled: z.boolean().default(true), strategy: z.enum(['stale-while-revalidate', 'cache-first', 'network-first']).default('stale-while-revalidate'), ttl: z.number().default(3600) }),
  lazyLoading: z.object({ images: z.boolean().default(true), components: z.boolean().default(true), threshold: z.number().default(100) }),
  preload: z.object({ criticalResources: z.array(z.string()).default([]), nextStep: z.boolean().default(true) }),
  compression: z.object({ images: z.boolean().default(true), scripts: z.boolean().default(true), styles: z.boolean().default(true) }),
});

export const LegalSchema = z.object({
  privacy: z.object({ enabled: z.boolean().default(true), policyUrl: z.string().default('/privacy'), consentRequired: z.boolean().default(true), cookieNotice: z.boolean().default(true) }),
  terms: z.object({ enabled: z.boolean().default(true), termsUrl: z.string().default('/terms'), acceptanceRequired: z.boolean().default(false) }),
  dataProcessing: z.object({ purpose: z.array(z.string()).default([]), legalBasis: z.string().default('Consentimento'), retentionPeriod: z.number().default(365), rightToDelete: z.boolean().default(true), rightToPortability: z.boolean().default(true) }),
});

export const StepSettingsSchema = z.object({
  minTimeOnStep: z.number().optional(),
  maxTimeOnStep: z.number().optional(),
  autoAdvance: z.boolean().optional(),
  autoAdvanceDelay: z.number().optional(),
  backgroundColor: z.string().optional(),
  backgroundImage: z.string().optional(),
  backgroundVideo: z.string().optional(),
  showProgress: z.boolean().default(true),
  progressStyle: z.enum(['bar', 'steps', 'percentage', 'custom']).default('bar'),
  showBackButton: z.boolean().default(true),
  showNextButton: z.boolean().default(true),
  allowSkip: z.boolean().default(false),
  trackTimeOnStep: z.boolean().default(true),
  trackInteractions: z.boolean().default(true),
  customEvents: z.array(z.string()).default([]),
});

export const NavigationActionSchema = z.object({
  type: z.enum(['set-variable', 'calculate-score', 'send-webhook', 'track-event', 'custom']),
  parameters: z.record(z.any()).default({}),
});

export const NavigationConditionSchema = z.object({
  id: z.string(),
  condition: z.string(),
  nextStep: z.string(),
  actions: z.array(NavigationActionSchema).default([]).optional(),
});

export const NavigationLogicSchema = z.object({
  conditions: z.array(NavigationConditionSchema).default([]),
  nextStep: z.string().optional(),
  prevStep: z.string().optional(),
  actions: z.array(NavigationActionSchema).default([]),
});

export const ValidationRulesSchema = z.object({
  required: z.boolean().default(false),
  customRules: z.array(z.object({ field: z.string().default(''), rule: z.string().default(''), message: z.string().default('') })).default([]),
  errorMessages: z.record(z.string()).default({}),
});

// Passamos blocks como any para não acoplar com todos os tipos de bloco do editor aqui
export const FunnelStepSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().default(''),
  order: z.number(),
  type: z.enum(['intro', 'lead-capture', 'quiz-question', 'strategic-question', 'transition', 'result', 'offer', 'thank-you', 'custom']),
  settings: StepSettingsSchema,
  blocks: z.array(z.any()).default([]),
  navigation: NavigationLogicSchema,
  validation: ValidationRulesSchema,
  seo: SEOConfigurationSchema.partial().optional(),
});

export const PublicationSchema = z.object({
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  publishedAt: z.string().optional(),
  baseUrl: z.string().default('https://example.com'),
  customDomain: z.string().optional(),
  slug: z.string().default('novo-funil'),
  version: z.string().default('1.0.0'),
  changelog: z
    .array(
      z.object({ version: z.string(), date: z.string(), changes: z.array(z.string()).default([]), author: z.string() })
    )
    .default([]),
  accessControl: z.object({ public: z.boolean().default(true), password: z.string().optional(), allowedDomains: z.array(z.string()).optional(), ipWhitelist: z.array(z.string()).optional() }),
  cdn: z.object({ enabled: z.boolean().default(false), provider: z.enum(['cloudflare', 'aws', 'custom']).optional(), configuration: z.record(z.any()).optional() }),
});

export const EditorMetadataSchema = z.object({
  lastModified: z.string(),
  lastModifiedBy: z.string(),
  editorVersion: z.string(),
  editorSettings: z.object({ autoSave: z.boolean().default(true), previewMode: z.enum(['desktop', 'tablet', 'mobile']).default('desktop'), showGrid: z.boolean().default(false), snapToGrid: z.boolean().default(true) }),
  baseTemplate: z.string().optional(),
  variations: z.array(z.object({ id: z.string(), name: z.string(), description: z.string(), createdAt: z.string(), isActive: z.boolean(), changes: z.array(z.object({ type: z.enum(['block', 'step', 'setting']), target: z.string(), property: z.string(), oldValue: z.any().optional(), newValue: z.any().optional() })).default([]) })).default([]),
  collaborators: z.array(z.object({ id: z.string(), name: z.string(), email: z.string(), role: z.enum(['owner', 'editor', 'viewer']), lastAccess: z.string() })).default([]),
  tags: z.array(z.string()).default([]),
  categories: z.array(z.string()).default([]),
  stats: z.object({ totalBlocks: z.number().default(0), totalSteps: z.number().default(0), estimatedCompletionTime: z.number().default(0), lastTestRun: z.string().optional() }),
});

export const FunnelGlobalSettingsSchema = z.object({
  seo: SEOConfigurationSchema,
  analytics: AnalyticsSchema,
  branding: BrandingSchema,
  persistence: PersistenceSchema,
  integrations: z.object({ webhooks: z.array(z.any()).default([]) }).default({ webhooks: [] }),
  performance: PerformanceSchema,
  legal: LegalSchema,
});

export const FunnelDocumentSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  version: z.string(),
  category: z.enum(['quiz', 'lead-magnet', 'sales-funnel', 'assessment']).default('quiz'),
  templateType: z.enum(['quiz-complete', 'quiz-simple', 'lead-capture', 'sales-page']).default('quiz-complete'),
  settings: FunnelGlobalSettingsSchema,
  steps: z.array(FunnelStepSchema).min(1, 'Funnel must have at least one step'),
  publication: PublicationSchema,
  editorMeta: EditorMetadataSchema,
});

export type FunnelDocument = z.infer<typeof FunnelDocumentSchema>;
export type FunnelStep = z.infer<typeof FunnelStepSchema>;

export function validateFunnelDocument(doc: unknown) {
  const parsed = FunnelDocumentSchema.safeParse(doc);
  if (!parsed.success) {
    return {
      valid: false,
      errors: parsed.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`),
    };
  }
  return { valid: true, data: parsed.data } as const;
}

// @ts-nocheck
/**
 * 🎯 TEMPLATE SOURCES CONFIGURATION - FASE 2
 * 
 * Configuração centralizada das fontes de templates:
 * ✅ Prioridades de carregamento
 * ✅ Fallbacks configuráveis  
 * ✅ Cache settings por fonte
 * ✅ Performance optimization
 */

export interface TemplateSourceConfig {
  name: string;
  priority: number;
  enabled: boolean;
  cache: {
    enabled: boolean;
    ttl: number; // ms
    maxSize: number;
  };
  retry: {
    maxRetries: number;
    delay: number; // ms
    backoff: boolean;
  };
  description: string;
}

export const TEMPLATE_SOURCES: TemplateSourceConfig[] = [
  {
    name: 'published',
    priority: 1,
    enabled: true,
    cache: {
      enabled: true,
      ttl: 60 * 60 * 1000, // 1 hour
      maxSize: 50 // max 50 published templates
    },
    retry: {
      maxRetries: 1,
      delay: 0,
      backoff: false
    },
    description: 'Templates publicados localmente (localStorage) - maior prioridade'
  },
  {
    name: 'json-templates',
    priority: 2, 
    enabled: true,
    cache: {
      enabled: true,
      ttl: 30 * 60 * 1000, // 30 minutes
      maxSize: 100
    },
    retry: {
      maxRetries: 3,
      delay: 150,
      backoff: true
    },
    description: 'Templates JSON estáticos (public/templates/) - templates oficiais'
  },
  {
    name: 'typescript-templates',
    priority: 3,
    enabled: true,
    cache: {
      enabled: true,
      ttl: 15 * 60 * 1000, // 15 minutes
      maxSize: 50
    },
    retry: {
      maxRetries: 2,
      delay: 100,
      backoff: false
    },
    description: 'Templates TypeScript (stepTemplates.ts) - templates dinâmicos'
  },
  {
    name: 'canonical-template',
    priority: 4,
    enabled: true,
    cache: {
      enabled: true,
      ttl: 10 * 60 * 1000, // 10 minutes 
      maxSize: 25
    },
    retry: {
      maxRetries: 2,
      delay: 100,
      backoff: false
    },
    description: 'Template canônico (quiz21StepsComplete.ts) - fallback robusto'
  },
  {
    name: 'fallback',
    priority: 5,
    enabled: true,
    cache: {
      enabled: false, // Fallback nunca é cacheado
      ttl: 0,
      maxSize: 0
    },
    retry: {
      maxRetries: 0, // Fallback nunca falha
      delay: 0,
      backoff: false
    },
    description: 'Fallback garantido - sempre disponível'
  }
];

// Step-specific source overrides
export const STEP_SOURCE_OVERRIDES: Record<string, Partial<TemplateSourceConfig>[]> = {
  'step-1': [
    {
      name: 'json-templates',
      priority: 1, // JSON tem prioridade para step-1
      cache: { ttl: 60 * 60 * 1000 } // Cache longer for intro
    }
  ],
  'step-20': [
    {
      name: 'published',
      priority: 1,
      cache: { ttl: 30 * 60 * 1000 } // Cache result templates longer
    },
    {
      name: 'typescript-templates',
      priority: 2 // TypeScript fallback for results
    }
  ],
  'step-21': [
    {
      name: 'typescript-templates', 
      priority: 1 // Offer templates prefer TypeScript
    }
  ]
};

// Performance settings
export const TEMPLATE_PERFORMANCE_CONFIG = {
  // Preload settings
  preload: {
    enabled: true,
    criticalSteps: ['step-1', 'step-2', 'step-20', 'step-21'],
    delayMs: 100, // Delay before starting preload
    concurrency: 3 // Max concurrent preloads
  },
  
  // Cache settings
  globalCache: {
    enabled: true,
    maxTotalSize: 200, // Max templates in memory
    evictionPolicy: 'lru', // least recently used
    compressionEnabled: false
  },
  
  // Loading optimization
  loading: {
    timeoutMs: 10000, // 10s timeout per source
    debounceMs: 300, // Debounce rapid requests
    batchRequests: true, // Batch multiple requests
    enableWorkers: false // Web workers for processing
  },
  
  // Monitoring
  monitoring: {
    enabled: true,
    logLevel: 'info', // 'debug' | 'info' | 'warn' | 'error'
    metricsEnabled: true,
    performanceMarks: true
  }
};

// Template categories for optimization
export const TEMPLATE_CATEGORIES = {
  'intro': ['step-1'],
  'quiz-questions': ['step-2', 'step-3', 'step-4', 'step-5', 'step-6', 'step-7', 'step-8', 'step-9', 'step-10', 'step-11'],
  'transition': ['step-12', 'step-19'],
  'strategic-questions': ['step-13', 'step-14', 'step-15', 'step-16', 'step-17', 'step-18'],
  'result': ['step-20'],
  'offer': ['step-21']
};

// Block type priorities (for component lazy loading)
export const BLOCK_TYPE_PRIORITIES = {
  // Critical blocks (always preload)
  critical: [
    'text-inline',
    'quiz-intro-header', 
    'form-input',
    'button-inline'
  ],
  
  // Important blocks (preload for common routes)
  important: [
    'quiz-question',
    'options-grid',
    'form-container',
    'result-header-inline'
  ],
  
  // Optional blocks (lazy load on demand)
  optional: [
    'offer-card',
    'bonus-showcase',
    'testimonial-card',
    'image-display-inline'
  ],
  
  // Heavy blocks (always lazy load)
  heavy: [
    'quiz-result',
    'lead-form',
    'video-player',
    'advanced-form'
  ]
};

// Source validation rules
export const SOURCE_VALIDATION_RULES = {
  'published': {
    requiredFields: ['blocks', 'updatedAt'],
    maxBlocks: 20,
    maxSizeKb: 100
  },
  'json-templates': {
    requiredFields: ['templateVersion', 'blocks'],
    maxBlocks: 15,
    maxSizeKb: 200
  },
  'typescript-templates': {
    requiredFields: ['type', 'properties'],
    maxBlocks: 10,
    maxSizeKb: 50
  },
  'canonical-template': {
    requiredFields: ['id', 'type'],
    maxBlocks: 12,
    maxSizeKb: 80
  }
};

// Helper functions
export const getSourceConfig = (sourceName: string): TemplateSourceConfig | null => {
  return TEMPLATE_SOURCES.find(source => source.name === sourceName) || null;
};

export const getStepSourceOverrides = (stepId: string): Partial<TemplateSourceConfig>[] => {
  return STEP_SOURCE_OVERRIDES[stepId] || [];
};

export const getTemplateCategory = (stepId: string): string | null => {
  for (const [category, steps] of Object.entries(TEMPLATE_CATEGORIES)) {
    if (steps.includes(stepId)) {
      return category;
    }
  }
  return null;
};

export const getBlockTypePriority = (blockType: string): 'critical' | 'important' | 'optional' | 'heavy' => {
  for (const [priority, blocks] of Object.entries(BLOCK_TYPE_PRIORITIES)) {
    if (blocks.includes(blockType)) {
      return priority as any;
    }
  }
  return 'optional';
};

export const isSourceEnabled = (sourceName: string): boolean => {
  const config = getSourceConfig(sourceName);
  return config ? config.enabled : false;
};

export const getEnabledSources = (): TemplateSourceConfig[] => {
  return TEMPLATE_SOURCES.filter(source => source.enabled);
};

// Export configuration object
export const TEMPLATE_CONFIG = {
  sources: TEMPLATE_SOURCES,
  stepOverrides: STEP_SOURCE_OVERRIDES,
  performance: TEMPLATE_PERFORMANCE_CONFIG,
  categories: TEMPLATE_CATEGORIES,
  blockPriorities: BLOCK_TYPE_PRIORITIES,
  validation: SOURCE_VALIDATION_RULES
};

export default TEMPLATE_CONFIG;
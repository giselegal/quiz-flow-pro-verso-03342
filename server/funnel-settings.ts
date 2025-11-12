import { Request, Response } from 'express';
import { z } from 'zod';
import { validateRequest, validateRequestWithLogging } from './middleware/validation';
import { generalApiRateLimit } from './middleware/rate-limit';

// ==================================================================================
// Schemas de validação Zod para configurações do funil
// ==================================================================================

// Domain Settings Schema
const DomainSettingsSchema = z.object({
  customDomain: z.string().optional().nullable(),
  subdomain: z.string().optional().nullable(),
  slug: z.string().min(1, 'Slug é obrigatório').max(50, 'Slug não deve exceder 50 caracteres'),
  seoFriendlyUrl: z.boolean().optional().default(true),
});

// Result Profile Schema
const ResultProfileSchema = z.object({
  id: z.string().min(1, 'ID é obrigatório'),
  username: z.string().min(1, 'Username é obrigatório'),
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  percentage: z.number().min(0).max(100, 'Percentagem deve estar entre 0 e 100'),
  primaryFunction: z.string().min(1, 'Função primária é obrigatória'),
  secondaryFunction: z.string().optional().nullable(),
  threshold: z.number().optional().nullable(),
  keywords: z.array(z.string()).optional().default([]),
  images: z.object({
    avatar: z.string().url().optional().nullable(),
    banner: z.string().url().optional().nullable(),
    thumbnail: z.string().url().optional().nullable(),
  }).default({}),
  characteristics: z.array(z.string()).optional().default([]),
  metadata: z.record(z.any()).optional().default({}),
});

// Keyword Result Mapping Schema
const KeywordResultMappingSchema = z.object({
  keywords: z.array(z.string()).min(1, 'Pelo menos uma palavra-chave é obrigatória'),
  resultId: z.string().min(1, 'ID do resultado é obrigatório'),
  weight: z.number().min(0).max(1, 'Peso deve estar entre 0 e 1'),
  conditions: z.record(z.any()).optional().default({}),
});

// Results Settings Schema
const ResultsSettingsSchema = z.object({
  calculationType: z.enum(['weighted', 'keyword-based']).optional().default('weighted'),
  primary: ResultProfileSchema,
  secondary: z.array(ResultProfileSchema).optional().default([]),
  keywords: z.array(KeywordResultMappingSchema).optional().default([]),
});

// SEO Settings Schema
const SEOSettingsSchema = z.object({
  title: z.string().max(60, 'Título SEO não deve exceder 60 caracteres').optional().nullable(),
  description: z.string().max(160, 'Descrição SEO não deve exceder 160 caracteres').optional().nullable(),
  keywords: z.array(z.string()).optional().default([]),
  ogImage: z.string().url().optional().nullable(),
  ogType: z.string().optional().nullable(),
  twitterCard: z.string().optional().nullable(),
  robots: z.string().optional().default('index,follow'),
  canonicalUrl: z.string().url().optional().nullable(),
});

// Pixel Configuration Schema
const PixelConfigurationSchema = z.object({
  provider: z.enum(['facebook', 'google', 'custom']),
  pixelId: z.string().optional().nullable(),
  conversionId: z.string().optional().nullable(),
  conversionLabel: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  code: z.string().optional().nullable(),
  events: z.array(z.string()).default([]),
  customEvents: z.record(z.object({
    eventName: z.string(),
    parameters: z.record(z.any()).optional().default({}),
  })).optional().default({}),
});

// UTM Configuration Schema
const UTMConfigurationSchema = z.object({
  source: z.string().optional().nullable(),
  medium: z.string().optional().nullable(),
  campaign: z.string().optional().nullable(),
  term: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
  customParameters: z.record(z.string()).optional().default({}),
});

// Tracking Settings Schema
const TrackingSettingsSchema = z.object({
  googleAnalytics: z.string().regex(/^G-[A-Z0-9]{10,}$/).optional().nullable(),
  facebookPixel: z.string().regex(/^\d{15,16}$/).optional().nullable(),
  gtm: z.string().regex(/^GTM-[A-Z0-9]{7,}$/).optional().nullable(),
  customPixels: z.array(PixelConfigurationSchema).optional().default([]),
  utmParameters: UTMConfigurationSchema.optional().default({}),
  utmDefaults: z.record(z.string()).optional().default({}),
  events: z.record(z.boolean()).optional().default({}),
});

// Webhook Configuration Schema
const WebhookConfigurationSchema = z.object({
  url: z.string().url('URL do webhook deve ser válida'),
  method: z.enum(['POST', 'GET']),
  headers: z.record(z.string()).optional().default({}),
  events: z.array(z.string()).min(1, 'Pelo menos um evento é obrigatório'),
});

// Security Settings Schema
const SecuritySettingsSchema = z.object({
  accessToken: z.string().optional().nullable(),
  apiKeys: z.record(z.string()).optional().default({}),
  webhookUrls: z.array(z.string().url()).optional().default([]),
  webhooks: z.array(WebhookConfigurationSchema).optional().default([]),
});

// Main Publication Settings Schema
const PublicationSettingsSchema = z.object({
  domain: DomainSettingsSchema,
  results: ResultsSettingsSchema,
  seo: SEOSettingsSchema,
  tracking: TrackingSettingsSchema,
  security: SecuritySettingsSchema,
});

// Update Settings Schema (partial updates)
const UpdateSettingsSchema = PublicationSettingsSchema.partial();

// Funnel ID Parameter Schema
const FunnelIdParamSchema = z.object({
  id: z.string().uuid().or(z.string().min(1, 'ID do funil é obrigatório')),
});

// ==================================================================================
// Mock storage for settings (until database is connected)
// ==================================================================================

const settingsStore = new Map<string, any>();

// Default settings generator
function generateDefaultSettings(funnelId: string) {
  return {
    domain: {
      slug: '',
      seoFriendlyUrl: true,
    },
    results: {
      calculationType: 'weighted',
      primary: {
        id: 'primary',
        username: '',
        title: '',
        description: '',
        percentage: 0,
        primaryFunction: '',
        images: {},
      },
      secondary: [],
      keywords: [],
    },
    seo: {
      robots: 'index,follow',
    },
    tracking: {
      utmParameters: {},
    },
    security: {},
  };
}

// ==================================================================================
// Logger estruturado
// ==================================================================================

interface StructuredLog {
  timestamp: string;
  level: string;
  message: string;
  service: string;
  context?: Record<string, any>;
  metadata?: {
    userAgent?: string;
    ip?: string;
    endpoint?: string;
    funnelId?: string;
  };
}

class StructuredLogger {
  private formatLog(log: StructuredLog): string {
    return JSON.stringify({
      timestamp: log.timestamp,
      level: log.level.toUpperCase(),
      message: log.message,
      service: log.service,
      ...(log.context && Object.keys(log.context).length > 0 && { context: log.context }),
      ...(log.metadata && Object.keys(log.metadata).length > 0 && { metadata: log.metadata }),
    });
  }

  info(message: string, context?: Record<string, any>, metadata?: Record<string, any>) {
    const log: StructuredLog = {
      timestamp: new Date().toISOString(),
      level: 'info',
      message,
      service: 'funnel-settings',
      context,
      metadata,
    };
    console.log(this.formatLog(log));
  }

  warn(message: string, context?: Record<string, any>, metadata?: Record<string, any>) {
    const log: StructuredLog = {
      timestamp: new Date().toISOString(),
      level: 'warn',
      message,
      service: 'funnel-settings',
      context,
      metadata,
    };
    console.warn(this.formatLog(log));
  }

  error(message: string, error?: Error, context?: Record<string, any>, metadata?: Record<string, any>) {
    const log: StructuredLog = {
      timestamp: new Date().toISOString(),
      level: 'error',
      message,
      service: 'funnel-settings',
      context: {
        ...context,
        ...(error && {
          error: {
            name: error.name,
            message: error.message,
            stack: error.stack,
          },
        }),
      },
      metadata,
    };
    console.error(this.formatLog(log));
  }

  debug(message: string, context?: Record<string, any>, metadata?: Record<string, any>) {
    if (process.env.NODE_ENV === 'development') {
      const log: StructuredLog = {
        timestamp: new Date().toISOString(),
        level: 'debug',
        message,
        service: 'funnel-settings',
        context,
        metadata,
      };
      console.debug(this.formatLog(log));
    }
  }
}

const logger = new StructuredLogger();

// ==================================================================================
// API Endpoints
// ==================================================================================

export function setupFunnelSettingsEndpoints(app: any) {
  // GET /api/funnels/:id/settings - Get funnel settings
  app.get('/api/funnels/:id/settings', 
    generalApiRateLimit,
    validateRequest(FunnelIdParamSchema, 'params'),
    async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        
        logger.info('Getting funnel settings', { funnelId: id }, {
          userAgent: req.headers['user-agent'],
          ip: req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress,
          endpoint: '/api/funnels/:id/settings',
          funnelId: id,
        });

        // Check if settings exist in store
        let settings = settingsStore.get(id);
        
        if (!settings) {
          // Generate default settings for new funnel
          settings = generateDefaultSettings(id);
          settingsStore.set(id, settings);
          logger.info('Created default settings for funnel', { funnelId: id });
        }

        res.json({
          success: true,
          data: settings,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        logger.error('Error getting funnel settings', error as Error, {
          funnelId: req.params.id,
        });
        
        res.status(500).json({
          success: false,
          error: 'Erro interno ao buscar configurações',
          timestamp: new Date().toISOString(),
        });
      }
    }
  );

  // PUT /api/funnels/:id/settings - Update funnel settings
  app.put('/api/funnels/:id/settings',
    generalApiRateLimit,
    validateRequestWithLogging(FunnelIdParamSchema, 'params', { endpoint: '/api/funnels/:id/settings' }),
    validateRequestWithLogging(PublicationSettingsSchema, 'body', { endpoint: '/api/funnels/:id/settings' }),
    async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        const settings = req.body;
        
        logger.info('Updating funnel settings', { 
          funnelId: id,
          settings: settings,
        }, {
          userAgent: req.headers['user-agent'],
          ip: req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress,
          endpoint: '/api/funnels/:id/settings',
          funnelId: id,
        });

        // Validate domain conflicts (basic check)
        if (settings.domain.customDomain) {
          // Check for conflicts with other funnels
          for (const [funnelId, existingSettings] of settingsStore.entries()) {
            if (funnelId !== id && 
                existingSettings.domain?.customDomain === settings.domain.customDomain &&
                existingSettings.domain?.slug === settings.domain.slug) {
              logger.warn('Domain conflict detected', {
                funnelId: id,
                conflictingFunnelId: funnelId,
                customDomain: settings.domain.customDomain,
                slug: settings.domain.slug,
              });
              
              return res.status(409).json({
                success: false,
                error: 'Conflito de domínio',
                message: `Domínio "${settings.domain.customDomain}/${settings.domain.slug}" já está em uso`,
                timestamp: new Date().toISOString(),
              });
            }
          }
        }

        // Update settings
        settingsStore.set(id, settings);
        
        logger.info('Funnel settings updated successfully', { funnelId: id });

        res.json({
          success: true,
          data: settings,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        logger.error('Error updating funnel settings', error as Error, {
          funnelId: req.params.id,
        });
        
        res.status(500).json({
          success: false,
          error: 'Erro interno ao atualizar configurações',
          timestamp: new Date().toISOString(),
        });
      }
    }
  );

  // PATCH /api/funnels/:id/settings - Partial update of funnel settings
  app.patch('/api/funnels/:id/settings',
    generalApiRateLimit,
    validateRequestWithLogging(FunnelIdParamSchema, 'params', { endpoint: '/api/funnels/:id/settings' }),
    validateRequestWithLogging(UpdateSettingsSchema, 'body', { endpoint: '/api/funnels/:id/settings' }),
    async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        const updates = req.body;
        
        logger.info('Partially updating funnel settings', { 
          funnelId: id,
          updates: updates,
        }, {
          userAgent: req.headers['user-agent'],
          ip: req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress,
          endpoint: '/api/funnels/:id/settings',
          funnelId: id,
        });

        // Get current settings
        let currentSettings = settingsStore.get(id);
        if (!currentSettings) {
          currentSettings = generateDefaultSettings(id);
        }

        // Merge updates
        const updatedSettings = {
          ...currentSettings,
          ...updates,
          domain: { ...currentSettings.domain, ...updates.domain },
          results: { ...currentSettings.results, ...updates.results },
          seo: { ...currentSettings.seo, ...updates.seo },
          tracking: { ...currentSettings.tracking, ...updates.tracking },
          security: { ...currentSettings.security, ...updates.security },
        };

        // Validate domain conflicts for partial updates
        if (updates.domain?.customDomain || updates.domain?.slug) {
          for (const [funnelId, existingSettings] of settingsStore.entries()) {
            if (funnelId !== id && 
                existingSettings.domain?.customDomain === updatedSettings.domain.customDomain &&
                existingSettings.domain?.slug === updatedSettings.domain.slug) {
              logger.warn('Domain conflict detected in partial update', {
                funnelId: id,
                conflictingFunnelId: funnelId,
                customDomain: updatedSettings.domain.customDomain,
                slug: updatedSettings.domain.slug,
              });
              
              return res.status(409).json({
                success: false,
                error: 'Conflito de domínio',
                message: `Domínio já está em uso`,
                timestamp: new Date().toISOString(),
              });
            }
          }
        }

        // Update settings
        settingsStore.set(id, updatedSettings);
        
        logger.info('Funnel settings partially updated successfully', { funnelId: id });

        res.json({
          success: true,
          data: updatedSettings,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        logger.error('Error partially updating funnel settings', error as Error, {
          funnelId: req.params.id,
        });
        
        res.status(500).json({
          success: false,
          error: 'Erro interno ao atualizar configurações',
          timestamp: new Date().toISOString(),
        });
      }
    }
  );

  // POST /api/funnels/:id/settings/validate - Validate funnel settings
  app.post('/api/funnels/:id/settings/validate',
    generalApiRateLimit,
    validateRequestWithLogging(FunnelIdParamSchema, 'params', { endpoint: '/api/funnels/:id/settings/validate' }),
    validateRequestWithLogging(PublicationSettingsSchema, 'body', { endpoint: '/api/funnels/:id/settings/validate', allowPartial: true }),
    async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        const settings = req.body;
        
        logger.info('Validating funnel settings', { 
          funnelId: id,
          settings: settings,
        }, {
          userAgent: req.headers['user-agent'],
          ip: req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress,
          endpoint: '/api/funnels/:id/settings/validate',
          funnelId: id,
        });

        const validationResult = validateSettings(settings);
        
        logger.info('Funnel settings validation completed', { 
          funnelId: id,
          isValid: validationResult.isValid,
          errorsCount: validationResult.errors.length,
          warningsCount: validationResult.warnings.length,
        });

        res.json({
          success: true,
          data: validationResult,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        logger.error('Error validating funnel settings', error as Error, {
          funnelId: req.params.id,
        });
        
        res.status(500).json({
          success: false,
          error: 'Erro interno ao validar configurações',
          timestamp: new Date().toISOString(),
        });
      }
    }
  );

  // GET /api/funnels/:id/settings/preview-url - Generate preview URL
  app.get('/api/funnels/:id/settings/preview-url',
    generalApiRateLimit,
    validateRequestWithLogging(FunnelIdParamSchema, 'params', { endpoint: '/api/funnels/:id/settings/preview-url' }),
    async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        
        logger.info('Generating preview URL', { 
          funnelId: id,
        }, {
          userAgent: req.headers['user-agent'],
          ip: req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress,
          endpoint: '/api/funnels/:id/settings/preview-url',
          funnelId: id,
        });

        // Get settings to generate URL
        let settings = settingsStore.get(id);
        if (!settings) {
          settings = generateDefaultSettings(id);
        }

        const { domain } = settings;
        let previewUrl: string;

        if (domain.customDomain) {
          previewUrl = `https://${domain.customDomain}/${domain.slug || id}`;
        } else {
          const subdomain = domain.subdomain || 'app';
          const slug = domain.slug || id;
          previewUrl = `https://${subdomain}.quizflowpro.com/${slug}`;
        }

        logger.info('Preview URL generated successfully', { 
          funnelId: id,
          previewUrl,
        });

        res.json({
          success: true,
          data: {
            url: previewUrl,
            domain: domain.customDomain || `${domain.subdomain || 'app'}.quizflowpro.com`,
            slug: domain.slug || id,
          },
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        logger.error('Error generating preview URL', error as Error, {
          funnelId: req.params.id,
        });
        
        res.status(500).json({
          success: false,
          error: 'Erro interno ao gerar URL de pré-visualização',
          timestamp: new Date().toISOString(),
        });
      }
    }
  );
}

// ==================================================================================
// Validation Helper Functions
// ==================================================================================

function validateSettings(settings: any) {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Domain validation
  if (!settings.domain?.slug) {
    errors.push('Slug é obrigatório');
  } else {
    if (!/^[a-z0-9-]+$/.test(settings.domain.slug)) {
      errors.push('Slug deve conter apenas letras minúsculas, números e hífens');
    }
    if (settings.domain.slug.length < 3) {
      errors.push('Slug deve ter no mínimo 3 caracteres');
    }
    if (settings.domain.slug.length > 50) {
      errors.push('Slug não deve exceder 50 caracteres');
    }
  }

  if (settings.domain?.customDomain) {
    const domainRegex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i;
    if (!domainRegex.test(settings.domain.customDomain)) {
      errors.push('Domínio customizado inválido (ex: meusite.com)');
    }
  }

  if (settings.domain?.subdomain) {
    if (!/^[a-z0-9-]+$/.test(settings.domain.subdomain)) {
      errors.push('Subdomínio deve conter apenas letras minúsculas, números e hífens');
    }
  }

  // SEO validation
  if (settings.seo?.title) {
    if (settings.seo.title.length > 60) {
      warnings.push('Título SEO acima de 60 caracteres pode ser truncado pelo Google');
    }
  } else {
    warnings.push('Título SEO não configurado');
  }

  if (settings.seo?.description) {
    if (settings.seo.description.length > 160) {
      warnings.push('Descrição SEO acima de 160 caracteres pode ser truncada');
    }
  }

  if (settings.seo?.ogImage) {
    const urlRegex = /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i;
    if (!urlRegex.test(settings.seo.ogImage)) {
      errors.push('URL da imagem OG inválida (deve ser HTTPS e terminar com .jpg, .png, .webp, .gif)');
    }
  }

  // Tracking validation
  if (settings.tracking?.googleAnalytics) {
    if (!/^G-[A-Z0-9]{10,}$/.test(settings.tracking.googleAnalytics)) {
      errors.push('ID do Google Analytics inválido (formato: G-XXXXXXXXXX)');
    }
  }

  if (settings.tracking?.facebookPixel) {
    if (!/^\d{15,16}$/.test(settings.tracking.facebookPixel)) {
      errors.push('ID do Facebook Pixel inválido (deve ter 15-16 dígitos)');
    }
  }

  if (settings.tracking?.gtm) {
    if (!/^GTM-[A-Z0-9]{7,}$/.test(settings.tracking.gtm)) {
      errors.push('ID do Google Tag Manager inválido (formato: GTM-XXXXXXX)');
    }
  }

  // Results validation
  if (!settings.results?.primary?.title) {
    errors.push('Perfil primário deve ter um título');
  }

  if (!settings.results?.primary?.description) {
    warnings.push('Perfil primário sem descrição');
  }

  // Security validation
  if (settings.security?.webhooks) {
    settings.security.webhooks.forEach((webhook: any, index: number) => {
      const urlRegex = /^https:\/\/.+/;
      if (!urlRegex.test(webhook.url)) {
        errors.push(`Webhook[${index}] deve usar HTTPS`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}
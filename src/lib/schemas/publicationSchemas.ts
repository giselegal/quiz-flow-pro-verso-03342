/**
 * 📋 PUBLICATION SCHEMAS (Zod)
 * 
 * Schemas de validação para configurações de publicação de funis.
 * Usados pelos serviços FunnelSettingsService e PublicationService.
 * 
 * Valida:
 * - Domain: slug, subdomain, custom domain
 * - SEO: meta tags, OG image, robots
 * - Tracking: Google Analytics, Facebook Pixel, GTM, custom pixels, UTMs
 * - Results: perfis de resultado, keywords, mapeamento
 * - Security: webhooks, API keys
 */

import { z } from 'zod';

// ============================================================================
// DOMAIN SCHEMA
// ============================================================================

export const DomainSchema = z.object({
  slug: z
    .string()
    .min(3, 'Slug deve ter no mínimo 3 caracteres')
    .max(50, 'Slug não deve exceder 50 caracteres')
    .regex(/^[a-z0-9-]+$/, 'Slug deve conter apenas letras minúsculas, números e hífens')
    .describe('URL amigável do funil (ex: meu-quiz-incrivel)'),
  
  subdomain: z
    .string()
    .min(3, 'Subdomínio deve ter no mínimo 3 caracteres')
    .max(30, 'Subdomínio não deve exceder 30 caracteres')
    .regex(/^[a-z0-9-]+$/, 'Subdomínio deve conter apenas letras minúsculas, números e hífens')
    .optional()
    .describe('Subdomínio para URL pública (ex: app → app.quizflowpro.com)'),
  
  customDomain: z
    .string()
    .regex(/^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i, 'Domínio customizado inválido (ex: meusite.com)')
    .optional()
    .describe('Domínio próprio do cliente'),
  
  seoFriendlyUrl: z
    .boolean()
    .default(true)
    .describe('Se true, usa slug legível; se false, usa ID do funil'),
});

export type DomainSettings = z.infer<typeof DomainSchema>;

// ============================================================================
// SEO SCHEMA
// ============================================================================

export const SEOSchema = z.object({
  title: z
    .string()
    .max(60, 'Título SEO não deve exceder 60 caracteres (recomendação Google)')
    .optional()
    .describe('Título para SEO e compartilhamento social'),
  
  description: z
    .string()
    .max(160, 'Descrição SEO não deve exceder 160 caracteres (recomendação Google)')
    .optional()
    .describe('Descrição para SEO e compartilhamento social'),
  
  keywords: z
    .array(z.string())
    .optional()
    .describe('Palavras-chave para SEO (opcional)'),
  
  ogImage: z
    .string()
    .url('URL da imagem OG deve ser válida')
    .regex(/\.(jpg|jpeg|png|webp|gif)$/i, 'Imagem OG deve ser JPG, PNG, WEBP ou GIF')
    .optional()
    .describe('Imagem para Open Graph (compartilhamento social)'),
  
  ogType: z
    .enum(['website', 'article', 'quiz', 'survey'])
    .default('quiz')
    .optional()
    .describe('Tipo do conteúdo para Open Graph'),
  
  twitterCard: z
    .enum(['summary', 'summary_large_image', 'app', 'player'])
    .default('summary_large_image')
    .optional()
    .describe('Tipo de card do Twitter'),
  
  robots: z
    .string()
    .regex(/^(index|noindex),\s?(follow|nofollow)$/, 'Formato inválido (ex: index,follow)')
    .default('index,follow')
    .optional()
    .describe('Diretiva para robôs de busca'),
  
  canonicalUrl: z
    .string()
    .url('URL canônica deve ser válida')
    .optional()
    .describe('URL canônica para evitar conteúdo duplicado'),
});

export type SEOSettings = z.infer<typeof SEOSchema>;

// ============================================================================
// TRACKING SCHEMA
// ============================================================================

export const PixelConfigurationSchema = z.object({
  provider: z.enum(['facebook', 'google', 'custom']),
  
  pixelId: z
    .string()
    .optional()
    .describe('ID do pixel (Facebook: 15-16 dígitos)'),
  
  conversionId: z
    .string()
    .optional()
    .describe('ID de conversão (Google Ads)'),
  
  conversionLabel: z
    .string()
    .optional()
    .describe('Label de conversão (Google Ads)'),
  
  name: z
    .string()
    .optional()
    .describe('Nome customizado do pixel'),
  
  code: z
    .string()
    .optional()
    .describe('Código JavaScript customizado'),
  
  events: z
    .array(z.string())
    .default([])
    .describe('Eventos a serem rastreados'),
  
  customEvents: z
    .record(z.object({
      eventName: z.string(),
      parameters: z.record(z.any()).optional(),
    }))
    .optional()
    .describe('Eventos customizados com parâmetros'),
});

export type PixelConfiguration = z.infer<typeof PixelConfigurationSchema>;

export const UTMConfigurationSchema = z.object({
  source: z
    .string()
    .optional()
    .describe('utm_source (ex: google, facebook, newsletter)'),
  
  medium: z
    .string()
    .optional()
    .describe('utm_medium (ex: cpc, email, social)'),
  
  campaign: z
    .string()
    .optional()
    .describe('utm_campaign (ex: summer_sale, black_friday)'),
  
  term: z
    .string()
    .optional()
    .describe('utm_term (ex: palavra-chave paga)'),
  
  content: z
    .string()
    .optional()
    .describe('utm_content (ex: banner_azul, link_rodape)'),
  
  customParameters: z
    .record(z.string())
    .optional()
    .describe('Parâmetros customizados adicionais'),
});

export type UTMConfiguration = z.infer<typeof UTMConfigurationSchema>;

export const TrackingSchema = z.object({
  googleAnalytics: z
    .string()
    .regex(/^G-[A-Z0-9]{10,}$/, 'ID do Google Analytics inválido (formato: G-XXXXXXXXXX)')
    .optional()
    .describe('Measurement ID do Google Analytics 4'),
  
  facebookPixel: z
    .string()
    .regex(/^\d{15,16}$/, 'ID do Facebook Pixel inválido (deve ter 15-16 dígitos)')
    .optional()
    .describe('ID do Facebook Pixel'),
  
  gtm: z
    .string()
    .regex(/^GTM-[A-Z0-9]{7,}$/, 'ID do Google Tag Manager inválido (formato: GTM-XXXXXXX)')
    .optional()
    .describe('Container ID do Google Tag Manager'),
  
  customPixels: z
    .array(PixelConfigurationSchema)
    .optional()
    .describe('Pixels customizados adicionais'),
  
  utmParameters: UTMConfigurationSchema
    .describe('Parâmetros UTM padrão para rastreamento de campanhas'),
  
  utmDefaults: z
    .record(z.string())
    .optional()
    .describe('Valores padrão para UTMs quando não especificados'),
  
  events: z
    .record(z.boolean())
    .optional()
    .describe('Eventos de rastreamento habilitados (ex: pageView, formSubmit, quizComplete)'),
});

export type TrackingSettings = z.infer<typeof TrackingSchema>;

// ============================================================================
// RESULTS SCHEMA
// ============================================================================

export const ResultProfileSchema = z.object({
  id: z
    .string()
    .min(1, 'ID do perfil é obrigatório')
    .describe('Identificador único do perfil de resultado'),
  
  username: z
    .string()
    .optional()
    .describe('Nome de usuário/handle do perfil (ex: @introvertido)'),
  
  title: z
    .string()
    .min(1, 'Título do perfil é obrigatório')
    .max(100, 'Título não deve exceder 100 caracteres')
    .describe('Título do perfil de resultado'),
  
  description: z
    .string()
    .min(10, 'Descrição deve ter no mínimo 10 caracteres')
    .max(500, 'Descrição não deve exceder 500 caracteres')
    .describe('Descrição detalhada do perfil'),
  
  percentage: z
    .number()
    .min(0)
    .max(100)
    .default(0)
    .describe('Porcentagem de compatibilidade (0-100)'),
  
  primaryFunction: z
    .string()
    .min(1, 'Função primária é obrigatória')
    .describe('Função/característica principal do perfil'),
  
  secondaryFunction: z
    .string()
    .optional()
    .describe('Função/característica secundária'),
  
  threshold: z
    .number()
    .min(0)
    .optional()
    .describe('Pontuação mínima para este resultado'),
  
  keywords: z
    .array(z.string())
    .optional()
    .describe('Palavras-chave associadas ao perfil'),
  
  images: z.object({
    avatar: z.string().url('URL do avatar inválida').optional(),
    banner: z.string().url('URL do banner inválida').optional(),
    thumbnail: z.string().url('URL do thumbnail inválida').optional(),
  }),
  
  characteristics: z
    .array(z.string())
    .optional()
    .describe('Lista de características do perfil'),
  
  metadata: z
    .record(z.any())
    .optional()
    .describe('Metadados customizados adicionais'),
});

export type ResultProfile = z.infer<typeof ResultProfileSchema>;

export const KeywordResultMappingSchema = z.object({
  keywords: z
    .array(z.string().min(1))
    .min(1, 'Pelo menos uma palavra-chave é necessária')
    .describe('Palavras-chave que mapeiam para este resultado'),
  
  resultId: z
    .string()
    .min(1, 'ID do resultado é obrigatório')
    .describe('ID do perfil de resultado correspondente'),
  
  weight: z
    .number()
    .min(0)
    .max(1)
    .default(1)
    .describe('Peso da correspondência (0-1)'),
  
  conditions: z
    .record(z.any())
    .optional()
    .describe('Condições adicionais para aplicar este mapeamento'),
});

export type KeywordResultMapping = z.infer<typeof KeywordResultMappingSchema>;

export const ResultsSchema = z.object({
  calculationType: z
    .enum(['weighted', 'keyword-based'])
    .default('weighted')
    .optional()
    .describe('Método de cálculo do resultado final'),
  
  primary: ResultProfileSchema
    .describe('Perfil de resultado primário'),
  
  secondary: z
    .array(ResultProfileSchema)
    .optional()
    .describe('Perfis de resultado secundários'),
  
  keywords: z
    .array(KeywordResultMappingSchema)
    .default([])
    .describe('Mapeamento de palavras-chave para resultados'),
});

export type ResultsSettings = z.infer<typeof ResultsSchema>;

// ============================================================================
// SECURITY SCHEMA
// ============================================================================

export const WebhookConfigurationSchema = z.object({
  url: z
    .string()
    .url('URL do webhook inválida')
    .regex(/^https:\/\//, 'Webhook deve usar HTTPS por segurança')
    .describe('URL do endpoint do webhook'),
  
  method: z
    .enum(['POST', 'GET'])
    .default('POST')
    .describe('Método HTTP para o webhook'),
  
  headers: z
    .record(z.string())
    .optional()
    .describe('Headers customizados para a requisição'),
  
  events: z
    .array(z.string())
    .min(1, 'Pelo menos um evento deve ser configurado')
    .describe('Eventos que disparam o webhook'),
});

export type WebhookConfiguration = z.infer<typeof WebhookConfigurationSchema>;

export const SecuritySchema = z.object({
  accessToken: z
    .string()
    .min(16, 'Token de acesso deve ter no mínimo 16 caracteres')
    .optional()
    .describe('Token para acesso à API privada'),
  
  apiKeys: z
    .record(z.string())
    .optional()
    .describe('Chaves de API para integrações externas'),
  
  webhookUrls: z
    .array(z.string().url())
    .optional()
    .describe('URLs de webhooks (deprecated - use webhooks)'),
  
  webhooks: z
    .array(WebhookConfigurationSchema)
    .optional()
    .describe('Configurações de webhooks'),
});

export type SecuritySettings = z.infer<typeof SecuritySchema>;

// ============================================================================
// MAIN PUBLICATION SCHEMA
// ============================================================================

export const PublicationSettingsSchema = z.object({
  domain: DomainSchema,
  results: ResultsSchema,
  seo: SEOSchema,
  tracking: TrackingSchema,
  security: SecuritySchema,
});

export type PublicationSettings = z.infer<typeof PublicationSettingsSchema>;

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Valida settings de publicação e retorna erros formatados
 */
export function validatePublicationSettings(settings: unknown) {
  const result = PublicationSettingsSchema.safeParse(settings);
  
  if (!result.success) {
    return {
      isValid: false,
      errors: result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
        severity: 'error' as const,
      })),
    };
  }
  
  return {
    isValid: true,
    data: result.data,
    errors: [],
  };
}

/**
 * Valida apenas uma seção específica
 */
export function validateSection<T extends keyof PublicationSettings>(
  section: T,
  data: unknown,
) {
  const schemas = {
    domain: DomainSchema,
    results: ResultsSchema,
    seo: SEOSchema,
    tracking: TrackingSchema,
    security: SecuritySchema,
  };
  
  const schema = schemas[section];
  const result = schema.safeParse(data);
  
  if (!result.success) {
    return {
      isValid: false,
      errors: result.error.issues.map((issue) => ({
        field: `${section}.${issue.path.join('.')}`,
        message: issue.message,
        severity: 'error' as const,
      })),
    };
  }
  
  return {
    isValid: true,
    data: result.data,
    errors: [],
  };
}

// ============================================================================
// DEFAULTS
// ============================================================================

export const DEFAULT_PUBLICATION_SETTINGS: PublicationSettings = {
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
    ogType: 'quiz',
    twitterCard: 'summary_large_image',
  },
  tracking: {
    utmParameters: {},
    events: {},
  },
  security: {},
};

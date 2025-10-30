/**
 * 🎛️ FUNNEL SETTINGS SERVICE (Canonical)
 * 
 * Gerencia configurações JSON do funil armazenadas em funnels.settings:
 * - domain: Configurações de domínio e URL pública
 * - seo: Meta tags, OG image, robots
 * - tracking: Google Analytics, Facebook Pixel, UTMs
 * - results: Perfis de resultado e mapeamento de pontuação
 * - security: Webhooks, API tokens
 * 
 * Segue arquitetura canonical:
 * - BaseCanonicalService
 * - Result pattern
 * - Telemetria com CanonicalServicesMonitor
 * - Cache invalidation
 */

import { BaseCanonicalService, ServiceResult } from '@/services/canonical/types';
import { supabase } from '@/integrations/supabase/customClient';
import { CacheService } from '@/services/canonical/CacheService';
import { CanonicalServicesMonitor } from '@/services/canonical/monitoring';
import type { Json } from '@/integrations/supabase/types';

// ============================================================================
// TYPES
// ============================================================================

export interface DomainSettings {
  customDomain?: string;
  subdomain?: string;
  slug: string;
  seoFriendlyUrl?: boolean;
}

export interface ResultProfile {
  id: string;
  username: string;
  title: string;
  description: string;
  percentage: number;
  primaryFunction: string;
  secondaryFunction?: string;
  threshold?: number;
  keywords?: string[];
  images: {
    avatar?: string;
    banner?: string;
    thumbnail?: string;
  };
  characteristics?: string[];
  metadata?: Record<string, any>;
}

export interface KeywordResultMapping {
  keywords: string[];
  resultId: string;
  weight: number;
  conditions?: Record<string, any>;
}

export interface ResultsSettings {
  calculationType?: 'weighted' | 'keyword-based';
  primary: ResultProfile;
  secondary?: ResultProfile[];
  keywords: KeywordResultMapping[];
}

export interface SEOSettings {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  robots?: string;
  canonicalUrl?: string;
}

export interface PixelConfiguration {
  provider: 'facebook' | 'google' | 'custom';
  pixelId?: string;
  conversionId?: string;
  conversionLabel?: string;
  name?: string;
  code?: string;
  events: string[];
  customEvents?: Record<string, {
    eventName: string;
    parameters?: Record<string, any>;
  }>;
}

export interface UTMConfiguration {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
  customParameters?: Record<string, string>;
}

export interface TrackingSettings {
  googleAnalytics?: string;
  facebookPixel?: string;
  gtm?: string;
  customPixels?: PixelConfiguration[];
  utmParameters: UTMConfiguration;
  utmDefaults?: Record<string, string>;
  events?: Record<string, boolean>;
}

export interface WebhookConfiguration {
  url: string;
  method: 'POST' | 'GET';
  headers?: Record<string, string>;
  events: string[];
}

export interface SecuritySettings {
  accessToken?: string;
  apiKeys?: Record<string, string>;
  webhookUrls?: string[];
  webhooks?: WebhookConfiguration[];
}

export interface PublicationSettings {
  domain: DomainSettings;
  results: ResultsSettings;
  seo: SEOSettings;
  tracking: TrackingSettings;
  security: SecuritySettings;
}

// ============================================================================
// DEFAULT SETTINGS
// ============================================================================

const DEFAULT_SETTINGS: PublicationSettings = {
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

// ============================================================================
// SERVICE
// ============================================================================

export class FunnelSettingsService extends BaseCanonicalService {
  private static instance: FunnelSettingsService;
  private cacheService: CacheService;

  private constructor() {
    super('FunnelSettingsService', '1.0.0');
    this.cacheService = CacheService.getInstance();
  }

  static getInstance(): FunnelSettingsService {
    if (!this.instance) {
      this.instance = new FunnelSettingsService();
    }
    return this.instance;
  }

  protected async onInitialize(): Promise<void> {
    this.log('FunnelSettingsService initialized');
  }

  protected async onDispose(): Promise<void> {
    // Não há necessidade de clear global - cache tem TTL
    this.log('FunnelSettingsService disposed');
  }

  // ============================================================================
  // GET SETTINGS
  // ============================================================================

  async getSettings(funnelId: string): Promise<ServiceResult<PublicationSettings>> {
    CanonicalServicesMonitor.trackUsage(this.name, 'getSettings');

    try {
      // Verificar cache
      const cacheKey = `funnel-settings-${funnelId}`;
      const cachedResult = this.cacheService.get<PublicationSettings>(cacheKey);
      if (cachedResult.success && cachedResult.data) {
        this.log('Settings from cache', { funnelId });
        return this.createResult(cachedResult.data);
      }

      // Buscar do Supabase
      const { data, error } = await supabase
        .from('funnels')
        .select('settings')
        .eq('id', funnelId)
        .single();

      if (error) {
        return this.createError(new Error(`Failed to fetch settings: ${error.message}`));
      }

      if (!data) {
        return this.createError(new Error(`Funnel ${funnelId} not found`));
      }

      // Merge com defaults
      const settings: PublicationSettings = {
        ...DEFAULT_SETTINGS,
        ...(typeof data.settings === 'object' && data.settings !== null ? data.settings : {}),
      } as PublicationSettings;

      // Cachear
      this.cacheService.set(cacheKey, settings, { ttl: 300000 }); // 5 min TTL

      return this.createResult(settings);
    } catch (error) {
      return this.createError(error as Error);
    }
  }

  // ============================================================================
  // UPDATE SETTINGS
  // ============================================================================

  async updateSettings(
    funnelId: string,
    updates: Partial<PublicationSettings>,
  ): Promise<ServiceResult<PublicationSettings>> {
    CanonicalServicesMonitor.trackUsage(this.name, 'updateSettings');

    try {
      // Buscar settings atuais
      const currentResult = await this.getSettings(funnelId);
      if (!currentResult.success || !currentResult.data) {
        return currentResult;
      }

      // Merge deep
      const newSettings: PublicationSettings = {
        domain: { ...currentResult.data.domain, ...updates.domain },
        results: { ...currentResult.data.results, ...updates.results },
        seo: { ...currentResult.data.seo, ...updates.seo },
        tracking: { ...currentResult.data.tracking, ...updates.tracking },
        security: { ...currentResult.data.security, ...updates.security },
      };

      // Atualizar no Supabase
      const { error } = await supabase
        .from('funnels')
        .update({ settings: newSettings as unknown as Json })
        .eq('id', funnelId);

      if (error) {
        return this.failure('SUPABASE_ERROR', `Failed to update settings: ${error.message}`);
      }

      // Invalidar cache
      this.cacheService.delete(`funnel-settings-${funnelId}`);

      this.log('Settings updated', { funnelId, updates });

      return this.success(newSettings);
    } catch (error) {
      return this.failure('UNKNOWN_ERROR', `Unexpected error: ${error}`);
    }
  }

  // ============================================================================
  // UPDATE PARTIAL (por seção)
  // ============================================================================

  async updateDomain(funnelId: string, domain: Partial<DomainSettings>): Promise<ServiceResult<PublicationSettings>> {
    return this.updateSettings(funnelId, { domain } as Partial<PublicationSettings>);
  }

  async updateSEO(funnelId: string, seo: Partial<SEOSettings>): Promise<ServiceResult<PublicationSettings>> {
    return this.updateSettings(funnelId, { seo } as Partial<PublicationSettings>);
  }

  async updateTracking(funnelId: string, tracking: Partial<TrackingSettings>): Promise<ServiceResult<PublicationSettings>> {
    return this.updateSettings(funnelId, { tracking } as Partial<PublicationSettings>);
  }

  async updateResults(funnelId: string, results: Partial<ResultsSettings>): Promise<ServiceResult<PublicationSettings>> {
    return this.updateSettings(funnelId, { results } as Partial<PublicationSettings>);
  }

  async updateSecurity(funnelId: string, security: Partial<SecuritySettings>): Promise<ServiceResult<PublicationSettings>> {
    return this.updateSettings(funnelId, { security } as Partial<PublicationSettings>);
  }

  // ============================================================================
  // GENERATE PREVIEW URL
  // ============================================================================

  async generatePreviewUrl(funnelId: string): Promise<ServiceResult<string>> {
    CanonicalServicesMonitor.trackUsage(this.name, 'generatePreviewUrl');

    try {
      const settingsResult = await this.getSettings(funnelId);
      if (!settingsResult.success || !settingsResult.data) {
        return this.failure('SETTINGS_NOT_FOUND', 'Cannot generate URL without settings');
      }

      const { domain } = settingsResult.data;
      const subdomain = domain.subdomain || 'app';
      const slug = domain.slug || 'quiz';

      let url: string;
      if (domain.customDomain) {
        url = `https://${domain.customDomain}/${slug}`;
      } else {
        url = `https://${subdomain}.quizflowpro.com/${slug}`;
      }

      return this.success(url);
    } catch (error) {
      return this.failure('UNKNOWN_ERROR', `Failed to generate URL: ${error}`);
    }
  }

  // ============================================================================
  // VALIDATE SETTINGS
  // ============================================================================

  async validateSettings(settings: PublicationSettings): Promise<ServiceResult<{ isValid: boolean; errors: string[] }>> {
    CanonicalServicesMonitor.trackUsage(this.name, 'validateSettings');

    const errors: string[] = [];

    // Validar domain
    if (!settings.domain.slug) {
      errors.push('Slug é obrigatório');
    } else if (!/^[a-z0-9-]+$/.test(settings.domain.slug)) {
      errors.push('Slug deve conter apenas letras minúsculas, números e hífens');
    }

    // Validar SEO
    if (settings.seo.title && settings.seo.title.length > 60) {
      errors.push('Título SEO não deve exceder 60 caracteres');
    }
    if (settings.seo.description && settings.seo.description.length > 160) {
      errors.push('Descrição SEO não deve exceder 160 caracteres');
    }

    // Validar tracking
    if (settings.tracking.googleAnalytics && !/^G-[A-Z0-9]+$/.test(settings.tracking.googleAnalytics)) {
      errors.push('ID do Google Analytics inválido (formato: G-XXXXXXXXXX)');
    }
    if (settings.tracking.facebookPixel && !/^\d+$/.test(settings.tracking.facebookPixel)) {
      errors.push('ID do Facebook Pixel deve conter apenas números');
    }

    // Validar results
    if (!settings.results.primary.title) {
      errors.push('Perfil primário deve ter um título');
    }

    return this.success({
      isValid: errors.length === 0,
      errors,
    });
  }
}

// ============================================================================
// EXPORT SINGLETON
// ============================================================================

export const funnelSettingsService = FunnelSettingsService.getInstance();
export default funnelSettingsService;

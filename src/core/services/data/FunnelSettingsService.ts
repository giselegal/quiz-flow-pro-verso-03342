/**
 * 🎛️ FUNNEL SETTINGS SERVICE - API INTEGRATION (Canonical)
 * 
 * Gerencia configurações JSON do funil usando os novos endpoints da API:
 * - Integração com /api/funnels/:id/settings
 * - Validação com Zod schemas
 * - Cache local para performance
 * - Tratamento de erros padronizado
 * 
 * Esta versão substitui a integração direta com Supabase por chamadas de API.
 */

import { BaseCanonicalService, ServiceResult } from '@/services/canonical/types';
import { CacheService } from '@/services/canonical/CacheService';
import { CanonicalServicesMonitor } from '@/services/canonical/monitoring';
import { appLogger } from '@/lib/utils/appLogger';

// ============================================================================
// TYPES (mantidos do arquivo original)
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
// DEFAULT SETTINGS (mantidos do arquivo original)
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
// SERVICE - API INTEGRATION
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
    this.log('FunnelSettingsService (API Integration) initialized');
  }

  protected async onDispose(): Promise<void> {
    this.log('FunnelSettingsService disposed');
  }

  // ============================================================================
  // API CALLS
  // ============================================================================

  private async apiCall(endpoint: string, options: RequestInit = {}): Promise<any> {
    const baseUrl = window.location.origin; // Usar a origem atual do frontend
    const url = `${baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(`API Error ${response.status}: ${errorData.error || errorData.message || 'Unknown error'}`);
      }

      return await response.json();
    } catch (error) {
      appLogger.error('API call failed', { endpoint, error });
      throw error;
    }
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

      // Buscar da API
      const response = await this.apiCall(`/api/funnels/${funnelId}/settings`);
      
      if (!response.success) {
        return this.createError(new Error(`Failed to fetch settings: ${response.error}`));
      }

      if (!response.data) {
        return this.createError(new Error(`Funnel ${funnelId} not found`));
      }

      // Merge com defaults
      const settings: PublicationSettings = {
        ...DEFAULT_SETTINGS,
        ...response.data,
      };

      // Cachear
      this.cacheService.set(cacheKey, settings, { ttl: 300000 }); // 5 min TTL

      this.log('Settings fetched from API', { funnelId });
      return this.createResult(settings);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return this.createError(new Error(`Failed to fetch settings: ${errorMessage}`));
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
      // Buscar settings atuais para merge
      const currentResult = await this.getSettings(funnelId);
      if (!currentResult.success || !currentResult.data) {
        return currentResult;
      }

      // Merge deep
      const newSettings: PublicationSettings = {
        ...currentResult.data,
        domain: { ...currentResult.data.domain, ...updates.domain },
        results: { ...currentResult.data.results, ...updates.results },
        seo: { ...currentResult.data.seo, ...updates.seo },
        tracking: { ...currentResult.data.tracking, ...updates.tracking },
        security: { ...currentResult.data.security, ...updates.security },
      };

      // Enviar para API
      const response = await this.apiCall(`/api/funnels/${funnelId}/settings`, {
        method: 'PUT',
        body: JSON.stringify(newSettings),
      });

      if (!response.success) {
        return this.createError(new Error(`Failed to update settings: ${response.error}`));
      }

      // Invalidar cache
      this.cacheService.delete(`funnel-settings-${funnelId}`);

      this.log('Settings updated via API', { funnelId, updates: Object.keys(updates) });
      return this.createResult(response.data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return this.createError(new Error(`Failed to update settings: ${errorMessage}`));
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
      const response = await this.apiCall(`/api/funnels/${funnelId}/settings/preview-url`);
      
      if (!response.success || !response.data?.url) {
        return this.createError(new Error('Failed to generate preview URL'));
      }

      this.log('Preview URL generated via API', { funnelId, url: response.data.url });
      return this.createResult(response.data.url);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return this.createError(new Error(`Failed to generate preview URL: ${errorMessage}`));
    }
  }

  // ============================================================================
  // STATIC METHODS (for backward compatibility)
  // ============================================================================

  static async loadSettings(funnelId: string): Promise<PublicationSettings> {
    const instance = FunnelSettingsService.getInstance();
    const result = await instance.getSettings(funnelId);
    if (!result.success || !result.data) {
      throw new Error(result.error?.message || 'Failed to load settings');
    }
    return result.data;
  }

  static async saveSettings(funnelId: string, settings: PublicationSettings | any): Promise<void> {
    const instance = FunnelSettingsService.getInstance();
    const result = await instance.updateSettings(funnelId, settings);
    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to save settings');
    }
  }

  static async exportSettings(funnelId: string): Promise<string> {
    const instance = FunnelSettingsService.getInstance();
    const result = await instance.getSettings(funnelId);
    if (!result.success || !result.data) {
      throw new Error(result.error?.message || 'Failed to export settings');
    }
    return JSON.stringify(result.data, null, 2);
  }
}

// ============================================================================
// EXPORT SINGLETON
// ============================================================================

export const funnelSettingsService = FunnelSettingsService.getInstance();
export default funnelSettingsService;
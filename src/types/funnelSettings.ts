export interface SEOSettings {
  metaTitle: string;
  metaDescription: string;
  customUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  favicon: string;
  canonicalUrl: string;
  keywords: string[];
}

export interface AnalyticsSettings {
  facebookPixelId: string;
  googleAnalyticsId: string;
  gtmId: string;
  hotjarId: string;
  customHeadCode: string;
  customBodyCode: string;
  enableConversionTracking: boolean;
}

export interface WebhookSettings {
  hotmartPostbackUrl: string;
  customWebhooks: {
    id: string;
    name: string;
    url: string;
    events: string[];
    headers: Record<string, string>;
    active: boolean;
  }[];
  testMode: boolean;
}

export interface DomainSettings {
  customDomain: string;
  enableSSL: boolean;
  redirects: {
    from: string;
    to: string;
    type: '301' | '302';
  }[];
  subdomain: string;
}

/**
 * FunnelSettings básico (compat com versão original)
 */
export interface FunnelSettings {
  seo: SEOSettings;
  analytics: AnalyticsSettings;
  webhooks: WebhookSettings;
  domain: DomainSettings;
}

/**
 * PublicationSettings básico (de FunnelSettingsService)
 */
export interface PublicationSettingsBasic {
  domain?: {
    slug?: string;
    seoFriendlyUrl?: boolean;
  };
  results?: any;
  seo?: any;
  tracking?: any;
  security?: any;
}

/**
 * Unificação de FunnelSettings + PublicationSettings
 * Use este tipo quando precisar de compatibilidade com ambos
 */
export interface UnifiedFunnelSettings extends FunnelSettings {
  // Campos extras de PublicationSettings
  publication?: {
    status?: 'draft' | 'published' | 'archived';
    publishedAt?: string;
    baseUrl?: string;
    customDomain?: string;
    slug?: string;
  };
}

export const defaultFunnelSettings: FunnelSettings = {
  seo: {
    metaTitle: '',
    metaDescription: '',
    customUrl: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    favicon: '',
    canonicalUrl: '',
    keywords: [],
  },
  analytics: {
    facebookPixelId: '',
    googleAnalyticsId: '',
    gtmId: '',
    hotjarId: '',
    customHeadCode: '',
    customBodyCode: '',
    enableConversionTracking: false,
  },
  webhooks: {
    hotmartPostbackUrl: '',
    customWebhooks: [],
    testMode: false,
  },
  domain: {
    customDomain: '',
    enableSSL: true,
    redirects: [],
    subdomain: '',
  },
};

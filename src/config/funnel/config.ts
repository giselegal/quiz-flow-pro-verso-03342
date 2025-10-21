/**
 * Central funnel configuration (metadata, SEO, analytics, A/B, CTAs)
 * This is a lightweight, optional registry the runtime can consume.
 * Not yet wired; serves as a single source of truth scaffold.
 */

export type PixelProvider = 'facebook' | 'google' | 'tiktok' | 'gtm' | 'custom';

export interface FunnelSEOConfig {
  baseUrl: string;
  title: string;
  description: string;
  ogImage?: string;
}

export interface FunnelAnalyticsConfig {
  pixels: Array<{ provider: PixelProvider; id: string; enabled?: boolean }>;
  utmDefaults?: Partial<Record<'utm_source' | 'utm_medium' | 'utm_campaign' | 'utm_term' | 'utm_content', string>>;
  events?: Record<string, { name: string; params?: Record<string, string | number> }>;
}

export interface FunnelABVariant {
  key: string; // e.g. 'A', 'B', 'C'
  weight: number; // traffic split weight
  description?: string;
}

export interface FunnelABConfig {
  experimentKey: string; // e.g. 'question-copy-variant'
  variants: FunnelABVariant[];
  /** optional forced assignment for QA */
  forceVariant?: string;
}

export interface FunnelCTAConfig {
  primary: { label: string; url: string };
  secondary?: { label: string; url: string };
}

export interface FunnelConfig {
  seo: FunnelSEOConfig;
  analytics: FunnelAnalyticsConfig;
  abTests?: FunnelABConfig[];
  ctas: FunnelCTAConfig;
}

export const FUNNEL_CONFIG: FunnelConfig = {
  seo: {
    baseUrl: 'https://exemplo.com',
    title: 'Quiz de Estilo | Descubra seu perfil',
    description: 'Responda algumas perguntas e receba seu perfil de estilo com dicas personalizadas.',
    ogImage: undefined
  },
  analytics: {
    pixels: [
      // { provider: 'facebook', id: 'YOUR_PIXEL_ID', enabled: true },
    ],
    utmDefaults: {
      utm_medium: 'quiz',
      utm_campaign: 'style-profile'
    },
    events: {
      step_view: { name: 'Step View' },
      option_select: { name: 'Option Select' },
      result_view: { name: 'Result View' },
    }
  },
  abTests: [
    // {
    //   experimentKey: 'cta-copy',
    //   variants: [
    //     { key: 'A', weight: 1 },
    //     { key: 'B', weight: 1 },
    //   ],
    // }
  ],
  ctas: {
    primary: { label: 'Quero meu plano', url: 'https://exemplo.com/checkout' },
    secondary: { label: 'Ver página de vendas', url: 'https://exemplo.com/vendas' }
  }
};

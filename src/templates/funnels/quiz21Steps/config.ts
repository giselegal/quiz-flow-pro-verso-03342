/**
 * 🎯 CONFIGURAÇÃO DO FUNNEL - Quiz 21 Steps Complete
 */

import type { Funnel } from '../../schemas';
import metadata from './metadata.json';

/**
 * Tema visual do funnel
 */
export const theme = {
  colors: {
    primary: '#B89B7A',
    secondary: '#1F2937',
    background: '#FAF9F7',
    text: '#1F2937',
  },
  fonts: {
    heading: 'Inter, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
  },
};

/**
 * Configurações globais do funnel
 */
export const settings = {
  scoring: {
    enabled: true,
    type: 'weighted' as const,
    maxScore: 100,
  },
  analytics: {
    enabled: true,
    provider: 'ga4' as const,
  },
  seo: {
    title: 'Quiz de Estilo Pessoal - 21 Etapas',
    description: 'Descubra seu estilo predominante em poucos minutos',
    keywords: ['quiz', 'estilo pessoal', 'moda', 'personalização'],
  },
};

/**
 * URLs e assets
 */
export const assets = {
  logoUrl: 'https://res.cloudinary.com/der8kogzu/image/upload/f_png,q_70,w_132,h_55,c_fit/v1752430327/LOGO_DA_MARCA_GISELE_l78gin.png',
  logoAlt: 'Logo Gisele Galvão',
  baseCloudinaryUrl: 'https://res.cloudinary.com/der8kogzu/image/upload',
};

/**
 * Lazy loading de steps individuais
 * 
 * IMPORTANTE: Steps são carregados sob demanda para reduzir bundle
 */
export const loadStep = async (stepNumber: number) => {
  const base = String(stepNumber).padStart(2, '0');
  const idNoHyphen = `step${base}`;
  const idWithHyphen = `step-${base}`;

  // 1) Tenta arquivo sem hífen (step01.ts)
  try {
    const module = await import(`./steps/${idNoHyphen}.ts`);
    return (module as any).default || module;
  } catch (_err1) {
    // 2) Fallback: tenta arquivo com hífen (step-01.ts)
    try {
      const module = await import(`./steps/${idWithHyphen}.ts`);
      return (module as any).default || module;
    } catch (_err2) {
      console.error(`[Quiz21Steps] Failed to load step ${stepNumber} (tried: ${idNoHyphen}.ts, ${idWithHyphen}.ts)`);
      throw new Error(`Step ${stepNumber} not found`);
    }
  }
};

/**
 * Exporta configuração completa do funnel
 * 
 * NOTA: Steps são carregados dinamicamente via loadStep()
 */
export const config = {
  metadata: {
    ...metadata,
    ...assets,
  },
  theme,
  settings,
};

export default config;

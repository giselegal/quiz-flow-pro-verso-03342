/**
 * 🖼️ ASSETS CONFIGURATION
 * Configuração centralizada de URLs de imagens/assets
 * Elimina hardcoding de URLs do Cloudinary
 */

import type { TemplateVariables } from '@/types/dynamic-template';

// ============================================
// 1. CLOUDINARY CONFIG
// ============================================

/**
 * Base URLs do Cloudinary (vem do .env ou config)
 */
const CLOUDINARY_BASE_URL = import.meta.env.VITE_CLOUDINARY_BASE_URL || 
  'https://res.cloudinary.com/der8kogzu/image/upload';

const CLOUDINARY_ACCOUNT = 'der8kogzu'; // Backup se não houver env var

/**
 * Paths organizados por tipo de asset
 */
export const CLOUDINARY_PATHS = {
  hero: `${CLOUDINARY_BASE_URL}/f_png,q_85,w_300,c_limit`,
  logo: `${CLOUDINARY_BASE_URL}/f_png,q_70,w_132,h_55,c_fit`,
  icons: `${CLOUDINARY_BASE_URL}/f_png,q_80,w_64,c_fit`,
  questions: `${CLOUDINARY_BASE_URL}/f_png,q_80,w_200,c_limit`,
  
  // Transformações específicas
  thumbnail: `${CLOUDINARY_BASE_URL}/f_png,q_70,w_150,c_thumb`,
  fullsize: `${CLOUDINARY_BASE_URL}/f_auto,q_auto`,
} as const;

// ============================================
// 2. ASSETS REGISTRY
// ============================================

/**
 * Mapeamento de IDs de assets para URLs completas
 * Exemplo: {{assets.hero-intro}} → URL completa
 */
export const ASSETS_REGISTRY = {
  // Logos e branding
  'logo-main': `${CLOUDINARY_PATHS.logo}/v1752430327/LOGO_DA_MARCA_GISELE_l78gin.png`,
  'logo-icon': `${CLOUDINARY_PATHS.icons}/v1752430327/LOGO_ICON_l78gin.png`,
  
  // Hero images (step 01)
  'hero-intro': `${CLOUDINARY_PATHS.hero}/v1752443943/Gemini_Generated_Image_i5cst6i5cst6i5cs_fpoukb.png`,
  
  // Question images (steps 02-21)
  // Step 02
  'q-natural-1': 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735447/1_cfccze.png',
  'q-classico-1': 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735449/2_s0idhw.png',
  'q-contemporaneo-1': 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735452/6_mwhjxb.png',
  'q-elegante-1': 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735451/5_ozpk9f.png',
  'q-romantico-1': 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735451/4_kwq2ib.png',
  'q-sexy-1': 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735454/8_m7c6xm.png',
  'q-dramatico-1': 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735453/7_ocp7jn.png',
  'q-criativo-1': 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735450/3_hkqdmx.png',
  
  // Step 03
  'q-natural-2': 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735456/9_jvf28n.png',
  'q-classico-2': 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735457/10_dkh7am.png',
  'q-contemporaneo-2': 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735461/14_ow2vp9.png',
  'q-elegante-2': 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735460/13_cwqezd.png',
  'q-romantico-2': 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735459/12_y81qxz.png',
  'q-sexy-2': 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735463/16_vjbnyp.png',
  'q-dramatico-2': 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735462/15_hs06f9.png',
  'q-criativo-2': 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735458/11_akpvdi.png',
  
  // Step 10 (accessories)
  'q-natural-10': 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735479/56_htzoxy.png',
  'q-classico-10': 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735479/57_whzmff.png',
  'q-contemporaneo-10': 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735482/61_joafud.png',
  'q-elegante-10': 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735482/60_vzsnps.png',
  'q-romantico-10': 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735482/59_dwaqrx.png',
  'q-sexy-10': 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735487/63_lwgokn.png',
  'q-dramatico-10': 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735485/62_mno8wg.png',
  'q-criativo-10': 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735480/58_njdjoh.png',
  
  // Fallbacks
  'fallback-hero': '/assets/hero-fallback.png',
  'fallback-logo': '/assets/logo-fallback.png',
  'fallback-question': '/assets/question-fallback.png',
} as const;

// ============================================
// 3. CONFIGURAÇÃO PARA TEMPLATES
// ============================================

/**
 * Objeto usado nas variáveis {{assets.*}}
 */
export const assetsConfig: TemplateVariables['assets'] = {
  cloudinary: {
    baseUrl: CLOUDINARY_BASE_URL,
    paths: {
      hero: CLOUDINARY_PATHS.hero,
      logo: CLOUDINARY_PATHS.logo,
      icons: CLOUDINARY_PATHS.icons,
      questions: CLOUDINARY_PATHS.questions,
    },
  },
  fallback: {
    hero: ASSETS_REGISTRY['fallback-hero'],
    logo: ASSETS_REGISTRY['fallback-logo'],
  },
};

// ============================================
// 4. UTILITÁRIOS
// ============================================

/**
 * Resolve asset por ID
 * Exemplo: resolveAsset('hero-intro') → URL completa
 */
export function resolveAsset(assetId: string): string {
  const url = ASSETS_REGISTRY[assetId as keyof typeof ASSETS_REGISTRY];
  
  if (!url) {
    console.warn(`⚠️ Asset não encontrado: ${assetId}, usando fallback`);
    return ASSETS_REGISTRY['fallback-question'];
  }
  
  return url;
}

/**
 * Gera URL do Cloudinary com transformações
 */
export function cloudinaryUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'png' | 'jpg' | 'webp' | 'auto';
    crop?: 'fill' | 'fit' | 'limit' | 'thumb';
  } = {}
): string {
  const { width, height, quality = 80, format = 'auto', crop = 'limit' } = options;
  
  const transforms: string[] = [];
  
  if (format) transforms.push(`f_${format}`);
  if (quality) transforms.push(`q_${quality}`);
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  if (crop) transforms.push(`c_${crop}`);
  
  const transformStr = transforms.join(',');
  return `${CLOUDINARY_BASE_URL}/${transformStr}/${publicId}`;
}

/**
 * Verifica se URL é do Cloudinary
 */
export function isCloudinaryUrl(url: string): boolean {
  return url.includes('cloudinary.com');
}

/**
 * Extrai public ID de uma URL do Cloudinary
 */
export function extractPublicId(url: string): string | null {
  if (!isCloudinaryUrl(url)) return null;
  
  const match = url.match(/\/v\d+\/(.+?)(?:\.[^.]+)?$/);
  return match ? match[1] : null;
}

/**
 * Converte URL hardcoded para asset ID (para migração)
 */
export function urlToAssetId(url: string): string | null {
  // Procura no registry qual ID tem essa URL
  for (const [id, registeredUrl] of Object.entries(ASSETS_REGISTRY)) {
    if (registeredUrl === url) return id;
  }
  
  // Se não encontrou, tenta extrair public ID
  const publicId = extractPublicId(url);
  if (publicId) {
    console.warn(`⚠️ URL não mapeada: ${url}, usar publicId: ${publicId}`);
    return publicId;
  }
  
  return null;
}

// ============================================
// 5. VALIDAÇÃO
// ============================================

/**
 * Valida se todos os assets necessários existem
 */
export function validateAssets(assetIds: string[]): { valid: boolean; missing: string[] } {
  const missing = assetIds.filter(id => !(id in ASSETS_REGISTRY));
  return { valid: missing.length === 0, missing };
}

/**
 * Lista todos os assets disponíveis
 */
export function listAssets(): string[] {
  return Object.keys(ASSETS_REGISTRY);
}

/**
 * Estatísticas dos assets
 */
export function getAssetStats() {
  const total = Object.keys(ASSETS_REGISTRY).length;
  const cloudinary = Object.values(ASSETS_REGISTRY).filter(isCloudinaryUrl).length;
  const local = total - cloudinary;
  
  return {
    total,
    cloudinary,
    local,
    accounts: [CLOUDINARY_ACCOUNT],
  };
}

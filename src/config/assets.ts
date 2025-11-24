/**
 * 🖼️ ASSETS CENTRALIZADOS (Quick Win Fase 1)
 *
 * Substitui URLs Cloudinary hardcoded por referências únicas.
 */
export const CDN_BASE = 'https://res.cloudinary.com/der8kogzu';

export const ASSETS = {
  logo: `${CDN_BASE}/v1752430327/LOGO_DA_MARCA_GISELE_l78gin.png`,
  // Futuras expansões: heroIntro: `${CDN_BASE}/path/hero-intro.png`
} as const;

export type AssetKey = keyof typeof ASSETS;

export const resolveAsset = (key: AssetKey): string => ASSETS[key];

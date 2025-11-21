import { appLogger } from '@/lib/utils/appLogger';
/**
 * 🔄 BLOCK TYPE MAPPER v4.0 - CONSOLIDADO
 *
 * Mapeia tipos de bloco do template v3.0 para tipos canônicos do editor
 * Remove mapeamentos identidade e resolve ambiguidades
 * 
 * MUDANÇAS na v4.0:
 * - ❌ Removidos 15+ mapeamentos identidade
 * - ✅ Resolvidas ambiguidades (1:1 mapping)
 * - ✅ Validação runtime para tipos desconhecidos
 * - ✅ Preserva tipo original em _originalType
 * 
 * @version 4.0.0
 * @deprecated Considere usar UnifiedBlockRegistry diretamente
 */

/**
 * Tipos canônicos válidos no editor
 */
const VALID_BLOCK_TYPES = new Set([
  // Intro
  'intro-logo-header',
  'quiz-intro-header',
  'intro-title',
  'intro-image',
  'intro-description',
  'intro-form',
  
  // Question
  'quiz-question-header',
  'question-progress',
  'question-number',
  'question-text',
  'question-instructions',
  'question-navigation',
  'options-grid',
  
  // Transition
  'transition-hero',
  'transition-title',
  'transition-text',
  
  // Result
  'result-congrats',
  'result-main',
  'result-image',
  'result-description',
  'result-secondary-styles',
  'result-share',
  'result-cta',
  'result-progress-bars',
  'quiz-score-display',
  
  // Offer
  'offer-hero',
  'value-anchoring',
  'benefits-list',
  'testimonials',
  'pricing-inline',
  'secure-purchase',
  'urgency-timer-inline',
  'guarantee',
  
  // Common
  'heading-inline',
  'text-inline',
  'image-display-inline',
  'cta-inline',
  'button',
  'footer-copyright',
]);

/**
 * Mapeamentos de alias para tipos canônicos
 * APENAS transformações reais, sem identidades
 */
export const BLOCK_TYPE_MAP: Record<string, string> = {
  // ====== ALIASES DE NOMENCLATURA ======
  'options grid': 'options-grid',
  'ctabutton': 'cta-inline',
  
  // ====== V3 SECTIONS → ATOMIC BLOCKS ======
  'intro-hero': 'intro-logo-header',
  'welcome-form': 'intro-form',
  'question-hero': 'quiz-question-header',
  'question-title': 'heading-inline',
  'transition-content': 'text-inline',
  'progress-bars': 'question-progress',
  
  // ====== LEGACY V2 SECTIONS → V3 ATOMIC ======
  'HeroSection': 'result-congrats',
  'StyleProfileSection': 'result-main',
  'TransformationSection': 'benefits-list',
  'MethodStepsSection': 'benefits-list',
  'BonusSection': 'benefits-list',
  'SocialProofSection': 'testimonials',
  'OfferSection': 'offer-hero',
  'GuaranteeSection': 'guarantee',
  
  // Legacy aliases (lowercase)
  'heroSection': 'result-congrats',
  'styleProfileSection': 'result-main',
  'transformationSection': 'benefits-list',
  'socialProofSection': 'testimonials',
  'guaranteeSection': 'guarantee',
  'bonusSection': 'benefits-list',
  'offerSection': 'offer-hero',
  
  // ====== RESULT ALIASES ======
  'result-header': 'result-congrats',
  'result-content': 'result-main',
  'result-card': 'result-main',
  
  // ====== OFFER ALIASES ======
  'offer-hero-section': 'offer-hero',
  'offer-cta': 'button',
  
  // ====== VALUE/SECURITY/URGENCY ======
  'ValueAnchor': 'value-anchoring',
  'SecurePurchase': 'secure-purchase',
  'UrgencyTimer': 'urgency-timer-inline',
  
  // ====== PRICING ALIASES ======
  'PricingInline': 'pricing-inline',
  'Pricing': 'pricing-inline',
  'pricing': 'pricing-inline',
  
  // ====== CTA ALIASES ======
  'CTAButton': 'cta-inline',
};

/**
 * Mapear tipo de bloco do template para tipo canônico
 * 
 * @param templateType - Tipo do bloco no template
 * @returns Tipo canônico do bloco
 * 
 * @example
 * mapBlockType('HeroSection') // => 'result-congrats'
 * mapBlockType('intro-title') // => 'intro-title' (canônico)
 * mapBlockType('unknown-type') // => 'text-inline' (fallback seguro)
 */
export function mapBlockType(templateType: string): string {
  if (!templateType) {
    appLogger.warn('[blockTypeMapper] Empty block type, using fallback');
    return 'text-inline';
  }

  const key = String(templateType).trim();
  
  // 1. Verificar mapeamento direto
  if (BLOCK_TYPE_MAP[key]) {
    const mapped = BLOCK_TYPE_MAP[key];
    appLogger.debug(`[blockTypeMapper] Mapped: ${key} → ${mapped}`);
    return mapped;
  }
  
  // 2. Tentar variações de capitalização
  const capitalized = key.charAt(0).toUpperCase() + key.slice(1);
  if (BLOCK_TYPE_MAP[capitalized]) {
    const mapped = BLOCK_TYPE_MAP[capitalized];
    appLogger.debug(`[blockTypeMapper] Mapped (capitalized): ${key} → ${mapped}`);
    return mapped;
  }
  
  const lowercase = key.charAt(0).toLowerCase() + key.slice(1);
  if (BLOCK_TYPE_MAP[lowercase]) {
    const mapped = BLOCK_TYPE_MAP[lowercase];
    appLogger.debug(`[blockTypeMapper] Mapped (lowercase): ${key} → ${mapped}`);
    return mapped;
  }
  
  // 3. Verificar se já é tipo canônico
  if (VALID_BLOCK_TYPES.has(key)) {
    return key;
  }
  
  // 4. Tipo desconhecido - log warning e usar fallback
  appLogger.warn(`[blockTypeMapper] Unknown block type: "${key}", using fallback "text-inline"`);
  return 'text-inline';
}

/**
 * Verificar se tipo requer mapeamento (não é canônico)
 */
export function isCustomBlockType(type: string): boolean {
  return Object.prototype.hasOwnProperty.call(BLOCK_TYPE_MAP, type);
}

/**
 * Verificar se tipo é válido no editor
 */
export function isValidBlockType(type: string): boolean {
  return VALID_BLOCK_TYPES.has(type) || isCustomBlockType(type);
}

/**
 * Obter tipo original preservado
 */
export function getOriginalType(block: any): string | undefined {
  return block?.properties?._originalType || block?.type;
}

/**
 * Estatísticas de mapeamento (debug)
 */
export function getMapperStats() {
  return {
    totalMappings: Object.keys(BLOCK_TYPE_MAP).length,
    validCanonicalTypes: VALID_BLOCK_TYPES.size,
    coverage: `${Object.keys(BLOCK_TYPE_MAP).length} aliases → ${VALID_BLOCK_TYPES.size} canonical types`,
  };
}

// Expor para debug
if (typeof window !== 'undefined') {
  (window as any).__blockTypeMapper = {
    map: mapBlockType,
    isValid: isValidBlockType,
    stats: getMapperStats,
    validTypes: Array.from(VALID_BLOCK_TYPES),
  };
}
